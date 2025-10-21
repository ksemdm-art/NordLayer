#!/bin/bash

# Database Backup Script for 3D Printing Platform
# Supports both PostgreSQL and SQLite databases

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/nordlayer}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${BACKUP_DIR}/backup.log"

# Database configuration from environment or defaults
DB_TYPE="${DB_TYPE:-postgresql}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-printing_platform}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD}"

# S3 configuration for remote backups (optional)
S3_BUCKET="${S3_BUCKET}"
S3_PREFIX="${S3_PREFIX:-backups/database}"
AWS_REGION="${AWS_REGION:-us-east-1}"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling
handle_error() {
    log "ERROR: Backup failed at line $1"
    exit 1
}

trap 'handle_error $LINENO' ERR

log "Starting database backup process..."

# Function to backup PostgreSQL
backup_postgresql() {
    local backup_file="${BACKUP_DIR}/nordlayer_db_${TIMESTAMP}.sql"
    local compressed_file="${backup_file}.gz"
    
    log "Creating PostgreSQL backup: $backup_file"
    
    # Set password for pg_dump
    export PGPASSWORD="$DB_PASSWORD"
    
    # Create backup with custom format for better compression and features
    pg_dump \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --format=custom \
        --compress=9 \
        --verbose \
        --file="$backup_file"
    
    # Additional SQL dump for compatibility
    pg_dump \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --format=plain \
        --verbose | gzip > "$compressed_file"
    
    unset PGPASSWORD
    
    log "PostgreSQL backup completed: $backup_file and $compressed_file"
    echo "$backup_file"
}

# Function to backup SQLite
backup_sqlite() {
    local db_file="${DB_FILE:-backend/printing_platform.db}"
    local backup_file="${BACKUP_DIR}/nordlayer_sqlite_${TIMESTAMP}.db"
    local compressed_file="${backup_file}.gz"
    
    if [ ! -f "$db_file" ]; then
        log "ERROR: SQLite database file not found: $db_file"
        exit 1
    fi
    
    log "Creating SQLite backup: $backup_file"
    
    # Create backup using SQLite's backup command
    sqlite3 "$db_file" ".backup $backup_file"
    
    # Compress the backup
    gzip -c "$backup_file" > "$compressed_file"
    rm "$backup_file"
    
    log "SQLite backup completed: $compressed_file"
    echo "$compressed_file"
}

# Function to upload to S3
upload_to_s3() {
    local file_path="$1"
    local filename=$(basename "$file_path")
    local s3_key="${S3_PREFIX}/${filename}"
    
    if [ -z "$S3_BUCKET" ]; then
        log "S3_BUCKET not configured, skipping remote backup"
        return 0
    fi
    
    log "Uploading backup to S3: s3://${S3_BUCKET}/${s3_key}"
    
    if command -v aws >/dev/null 2>&1; then
        aws s3 cp "$file_path" "s3://${S3_BUCKET}/${s3_key}" \
            --region "$AWS_REGION" \
            --storage-class STANDARD_IA
        log "Successfully uploaded to S3"
    else
        log "WARNING: AWS CLI not found, skipping S3 upload"
    fi
}

# Function to clean old backups
cleanup_old_backups() {
    log "Cleaning up backups older than $RETENTION_DAYS days..."
    
    # Local cleanup
    find "$BACKUP_DIR" -name "nordlayer_*" -type f -mtime +$RETENTION_DAYS -delete
    
    # S3 cleanup (if configured)
    if [ -n "$S3_BUCKET" ] && command -v aws >/dev/null 2>&1; then
        local cutoff_date=$(date -d "$RETENTION_DAYS days ago" +%Y-%m-%d)
        aws s3api list-objects-v2 \
            --bucket "$S3_BUCKET" \
            --prefix "$S3_PREFIX/" \
            --query "Contents[?LastModified<='$cutoff_date'].Key" \
            --output text | \
        while read -r key; do
            if [ -n "$key" ] && [ "$key" != "None" ]; then
                aws s3 rm "s3://${S3_BUCKET}/${key}"
                log "Deleted old S3 backup: $key"
            fi
        done
    fi
    
    log "Cleanup completed"
}

# Function to verify backup integrity
verify_backup() {
    local backup_file="$1"
    
    log "Verifying backup integrity: $backup_file"
    
    case "$DB_TYPE" in
        "postgresql")
            if [[ "$backup_file" == *.gz ]]; then
                # Verify compressed SQL dump
                if gzip -t "$backup_file"; then
                    log "Backup file integrity verified"
                else
                    log "ERROR: Backup file is corrupted"
                    exit 1
                fi
            else
                # Verify custom format backup
                export PGPASSWORD="$DB_PASSWORD"
                if pg_restore --list "$backup_file" >/dev/null 2>&1; then
                    log "Backup file integrity verified"
                else
                    log "ERROR: Backup file is corrupted"
                    exit 1
                fi
                unset PGPASSWORD
            fi
            ;;
        "sqlite")
            if [[ "$backup_file" == *.gz ]]; then
                if gzip -t "$backup_file"; then
                    log "Backup file integrity verified"
                else
                    log "ERROR: Backup file is corrupted"
                    exit 1
                fi
            else
                # Test SQLite database integrity
                if sqlite3 "$backup_file" "PRAGMA integrity_check;" | grep -q "ok"; then
                    log "Backup file integrity verified"
                else
                    log "ERROR: Backup file is corrupted"
                    exit 1
                fi
            fi
            ;;
    esac
}

# Main backup process
main() {
    local backup_file
    
    case "$DB_TYPE" in
        "postgresql")
            backup_file=$(backup_postgresql)
            ;;
        "sqlite")
            backup_file=$(backup_sqlite)
            ;;
        *)
            log "ERROR: Unsupported database type: $DB_TYPE"
            exit 1
            ;;
    esac
    
    # Verify backup
    verify_backup "$backup_file"
    
    # Upload to S3 if configured
    upload_to_s3 "$backup_file"
    
    # Cleanup old backups
    cleanup_old_backups
    
    # Generate backup report
    local backup_size=$(du -h "$backup_file" | cut -f1)
    log "Backup completed successfully!"
    log "File: $backup_file"
    log "Size: $backup_size"
    
    # Send notification (if configured)
    if [ -n "$NOTIFICATION_WEBHOOK" ]; then
        curl -X POST "$NOTIFICATION_WEBHOOK" \
            -H "Content-Type: application/json" \
            -d "{\"text\":\"Database backup completed successfully. Size: $backup_size\"}" \
            >/dev/null 2>&1 || true
    fi
}

# Run main function
main "$@"

log "Database backup process completed."