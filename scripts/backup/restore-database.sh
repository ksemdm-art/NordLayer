#!/bin/bash

# Database Restore Script for 3D Printing Platform
# Supports both PostgreSQL and SQLite databases

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/nordlayer}"
LOG_FILE="${BACKUP_DIR}/restore.log"

# Database configuration
DB_TYPE="${DB_TYPE:-postgresql}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-printing_platform}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD}"

# S3 configuration
S3_BUCKET="${S3_BUCKET}"
S3_PREFIX="${S3_PREFIX:-backups/database}"
AWS_REGION="${AWS_REGION:-us-east-1}"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling
handle_error() {
    log "ERROR: Restore failed at line $1"
    exit 1
}

trap 'handle_error $LINENO' ERR

# Usage function
usage() {
    echo "Usage: $0 [OPTIONS] BACKUP_FILE"
    echo ""
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -f, --force         Force restore without confirmation"
    echo "  -s, --from-s3       Download backup from S3 first"
    echo "  -l, --list          List available backups"
    echo "  -t, --test          Test restore (dry run)"
    echo ""
    echo "Examples:"
    echo "  $0 /path/to/backup.sql.gz"
    echo "  $0 --from-s3 nordlayer_db_20241021_120000.sql.gz"
    echo "  $0 --list"
    exit 1
}

# List available backups
list_backups() {
    log "Available local backups:"
    find "$BACKUP_DIR" -name "nordlayer_*" -type f -printf "%T@ %Tc %p\n" | sort -n | cut -d' ' -f2-
    
    if [ -n "$S3_BUCKET" ] && command -v aws >/dev/null 2>&1; then
        log "Available S3 backups:"
        aws s3 ls "s3://${S3_BUCKET}/${S3_PREFIX}/" --recursive | grep nordlayer_
    fi
}

# Download backup from S3
download_from_s3() {
    local s3_file="$1"
    local local_file="${BACKUP_DIR}/${s3_file}"
    local s3_key="${S3_PREFIX}/${s3_file}"
    
    if [ -z "$S3_BUCKET" ]; then
        log "ERROR: S3_BUCKET not configured"
        exit 1
    fi
    
    log "Downloading backup from S3: s3://${S3_BUCKET}/${s3_key}"
    
    if ! command -v aws >/dev/null 2>&1; then
        log "ERROR: AWS CLI not found"
        exit 1
    fi
    
    aws s3 cp "s3://${S3_BUCKET}/${s3_key}" "$local_file" --region "$AWS_REGION"
    
    log "Downloaded to: $local_file"
    echo "$local_file"
}

# Restore PostgreSQL database
restore_postgresql() {
    local backup_file="$1"
    local test_mode="$2"
    
    log "Restoring PostgreSQL database from: $backup_file"
    
    export PGPASSWORD="$DB_PASSWORD"
    
    if [ "$test_mode" = "true" ]; then
        log "TEST MODE: Would restore PostgreSQL database"
        log "Command would be: pg_restore --host=$DB_HOST --port=$DB_PORT --username=$DB_USER --dbname=$DB_NAME --clean --if-exists --verbose $backup_file"
        unset PGPASSWORD
        return 0
    fi
    
    # Check if it's a compressed SQL file or custom format
    if [[ "$backup_file" == *.gz ]]; then
        log "Restoring from compressed SQL dump"
        
        # Drop and recreate database
        log "Dropping existing database..."
        dropdb --host="$DB_HOST" --port="$DB_PORT" --username="$DB_USER" --if-exists "$DB_NAME" || true
        
        log "Creating new database..."
        createdb --host="$DB_HOST" --port="$DB_PORT" --username="$DB_USER" "$DB_NAME"
        
        # Restore from compressed SQL
        log "Restoring data..."
        gunzip -c "$backup_file" | psql --host="$DB_HOST" --port="$DB_PORT" --username="$DB_USER" --dbname="$DB_NAME"
    else
        log "Restoring from custom format backup"
        
        # Use pg_restore for custom format
        pg_restore \
            --host="$DB_HOST" \
            --port="$DB_PORT" \
            --username="$DB_USER" \
            --dbname="$DB_NAME" \
            --clean \
            --if-exists \
            --verbose \
            "$backup_file"
    fi
    
    unset PGPASSWORD
    log "PostgreSQL restore completed"
}

# Restore SQLite database
restore_sqlite() {
    local backup_file="$1"
    local test_mode="$2"
    local db_file="${DB_FILE:-backend/printing_platform.db}"
    
    log "Restoring SQLite database from: $backup_file"
    
    if [ "$test_mode" = "true" ]; then
        log "TEST MODE: Would restore SQLite database"
        log "Would backup current database and restore from: $backup_file"
        return 0
    fi
    
    # Backup current database
    if [ -f "$db_file" ]; then
        local current_backup="${db_file}.backup.$(date +%Y%m%d_%H%M%S)"
        log "Backing up current database to: $current_backup"
        cp "$db_file" "$current_backup"
    fi
    
    # Restore from backup
    if [[ "$backup_file" == *.gz ]]; then
        log "Extracting and restoring compressed backup"
        gunzip -c "$backup_file" > "$db_file"
    else
        log "Copying backup file"
        cp "$backup_file" "$db_file"
    fi
    
    # Verify restored database
    if sqlite3 "$db_file" "PRAGMA integrity_check;" | grep -q "ok"; then
        log "SQLite restore completed and verified"
    else
        log "ERROR: Restored database failed integrity check"
        exit 1
    fi
}

# Confirm restore operation
confirm_restore() {
    local backup_file="$1"
    local force="$2"
    
    if [ "$force" = "true" ]; then
        return 0
    fi
    
    echo ""
    echo "WARNING: This will replace the current database with the backup!"
    echo "Backup file: $backup_file"
    echo "Database: $DB_TYPE ($DB_NAME)"
    echo ""
    read -p "Are you sure you want to continue? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        log "Restore cancelled by user"
        exit 0
    fi
}

# Main restore function
main() {
    local backup_file=""
    local force=false
    local from_s3=false
    local test_mode=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                usage
                ;;
            -f|--force)
                force=true
                shift
                ;;
            -s|--from-s3)
                from_s3=true
                shift
                ;;
            -l|--list)
                list_backups
                exit 0
                ;;
            -t|--test)
                test_mode=true
                shift
                ;;
            -*)
                echo "Unknown option: $1"
                usage
                ;;
            *)
                backup_file="$1"
                shift
                ;;
        esac
    done
    
    if [ -z "$backup_file" ]; then
        echo "ERROR: Backup file not specified"
        usage
    fi
    
    # Download from S3 if requested
    if [ "$from_s3" = "true" ]; then
        backup_file=$(download_from_s3 "$backup_file")
    fi
    
    # Check if backup file exists
    if [ ! -f "$backup_file" ]; then
        log "ERROR: Backup file not found: $backup_file"
        exit 1
    fi
    
    log "Starting database restore process..."
    log "Backup file: $backup_file"
    log "Database type: $DB_TYPE"
    
    if [ "$test_mode" = "false" ]; then
        confirm_restore "$backup_file" "$force"
    fi
    
    # Perform restore based on database type
    case "$DB_TYPE" in
        "postgresql")
            restore_postgresql "$backup_file" "$test_mode"
            ;;
        "sqlite")
            restore_sqlite "$backup_file" "$test_mode"
            ;;
        *)
            log "ERROR: Unsupported database type: $DB_TYPE"
            exit 1
            ;;
    esac
    
    if [ "$test_mode" = "false" ]; then
        log "Database restore completed successfully!"
        
        # Send notification if configured
        if [ -n "$NOTIFICATION_WEBHOOK" ]; then
            curl -X POST "$NOTIFICATION_WEBHOOK" \
                -H "Content-Type: application/json" \
                -d "{\"text\":\"Database restore completed successfully from: $(basename $backup_file)\"}" \
                >/dev/null 2>&1 || true
        fi
    else
        log "Test mode completed - no actual restore performed"
    fi
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Run main function
main "$@"