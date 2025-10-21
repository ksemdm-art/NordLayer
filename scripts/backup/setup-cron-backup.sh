#!/bin/bash

# Setup automated database backups using cron
# This script configures cron jobs for regular database backups

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKUP_SCRIPT="$SCRIPT_DIR/backup-database.sh"

# Default configuration
BACKUP_FREQUENCY="${BACKUP_FREQUENCY:-daily}"
BACKUP_TIME="${BACKUP_TIME:-02:00}"
BACKUP_USER="${BACKUP_USER:-$(whoami)}"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -f, --frequency FREQ    Backup frequency (hourly, daily, weekly) [default: daily]"
    echo "  -t, --time TIME         Backup time in HH:MM format [default: 02:00]"
    echo "  -u, --user USER         User to run backups as [default: current user]"
    echo "  -r, --remove            Remove existing backup cron jobs"
    echo "  -l, --list              List current backup cron jobs"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                      # Setup daily backup at 02:00"
    echo "  $0 -f weekly -t 03:30   # Setup weekly backup at 03:30"
    echo "  $0 -f hourly            # Setup hourly backups"
    echo "  $0 --remove             # Remove all backup cron jobs"
    exit 1
}

# Check if backup script exists
check_backup_script() {
    if [ ! -f "$BACKUP_SCRIPT" ]; then
        log "ERROR: Backup script not found: $BACKUP_SCRIPT"
        exit 1
    fi
    
    if [ ! -x "$BACKUP_SCRIPT" ]; then
        log "ERROR: Backup script is not executable: $BACKUP_SCRIPT"
        exit 1
    fi
}

# Generate cron schedule based on frequency
generate_cron_schedule() {
    local frequency="$1"
    local time="$2"
    
    # Parse time
    local hour=$(echo "$time" | cut -d: -f1)
    local minute=$(echo "$time" | cut -d: -f2)
    
    # Validate time format
    if ! [[ "$hour" =~ ^[0-9]{1,2}$ ]] || ! [[ "$minute" =~ ^[0-9]{1,2}$ ]]; then
        log "ERROR: Invalid time format: $time (use HH:MM)"
        exit 1
    fi
    
    if [ "$hour" -gt 23 ] || [ "$minute" -gt 59 ]; then
        log "ERROR: Invalid time: $time"
        exit 1
    fi
    
    case "$frequency" in
        "hourly")
            echo "0 * * * *"
            ;;
        "daily")
            echo "$minute $hour * * *"
            ;;
        "weekly")
            echo "$minute $hour * * 0"  # Sunday
            ;;
        *)
            log "ERROR: Invalid frequency: $frequency (use hourly, daily, or weekly)"
            exit 1
            ;;
    esac
}

# Create environment file for cron
create_env_file() {
    local env_file="$SCRIPT_DIR/.backup-env"
    
    log "Creating environment file: $env_file"
    
    cat > "$env_file" << EOF
# Environment variables for database backup cron job
# Generated on $(date)

# Project paths
PROJECT_ROOT=$PROJECT_ROOT
BACKUP_DIR=/var/backups/nordlayer

# Database configuration (customize as needed)
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=printing_platform
DB_USER=postgres
# DB_PASSWORD=your_password_here

# S3 configuration (optional)
# S3_BUCKET=your-backup-bucket
# S3_PREFIX=backups/database
# AWS_REGION=us-east-1

# Notification webhook (optional)
# NOTIFICATION_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Retention settings
RETENTION_DAYS=30

# Logging
LOG_LEVEL=INFO
EOF
    
    chmod 600 "$env_file"
    log "Environment file created. Please edit $env_file to configure your database settings."
}

# Add cron job
add_cron_job() {
    local frequency="$1"
    local time="$2"
    local user="$3"
    
    local schedule=$(generate_cron_schedule "$frequency" "$time")
    local env_file="$SCRIPT_DIR/.backup-env"
    
    # Create the cron command
    local cron_command="cd $PROJECT_ROOT && source $env_file && $BACKUP_SCRIPT"
    local cron_entry="$schedule $cron_command"
    local cron_comment="# NordLayer Database Backup ($frequency)"
    
    log "Adding cron job for $user:"
    log "Schedule: $schedule ($frequency at $time)"
    log "Command: $cron_command"
    
    # Get current crontab
    local temp_cron=$(mktemp)
    crontab -u "$user" -l 2>/dev/null > "$temp_cron" || true
    
    # Remove existing backup jobs
    grep -v "NordLayer Database Backup" "$temp_cron" > "${temp_cron}.new" || true
    mv "${temp_cron}.new" "$temp_cron"
    
    # Add new job
    echo "$cron_comment" >> "$temp_cron"
    echo "$cron_entry" >> "$temp_cron"
    
    # Install new crontab
    crontab -u "$user" "$temp_cron"
    rm "$temp_cron"
    
    log "Cron job added successfully for user: $user"
}

# Remove cron jobs
remove_cron_jobs() {
    local user="$1"
    
    log "Removing backup cron jobs for user: $user"
    
    local temp_cron=$(mktemp)
    crontab -u "$user" -l 2>/dev/null > "$temp_cron" || true
    
    # Remove backup-related jobs
    grep -v "NordLayer Database Backup" "$temp_cron" > "${temp_cron}.new" || true
    
    # Install cleaned crontab
    crontab -u "$user" "${temp_cron}.new"
    rm "$temp_cron" "${temp_cron}.new"
    
    log "Backup cron jobs removed"
}

# List current cron jobs
list_cron_jobs() {
    local user="$1"
    
    log "Current cron jobs for user: $user"
    echo ""
    
    if crontab -u "$user" -l 2>/dev/null | grep -A1 "NordLayer Database Backup"; then
        echo ""
    else
        echo "No NordLayer backup cron jobs found"
    fi
}

# Verify cron service
verify_cron_service() {
    if ! systemctl is-active --quiet cron 2>/dev/null && ! systemctl is-active --quiet crond 2>/dev/null; then
        log "WARNING: Cron service doesn't appear to be running"
        log "You may need to start it with: sudo systemctl start cron"
    fi
}

# Main function
main() {
    local frequency="$BACKUP_FREQUENCY"
    local time="$BACKUP_TIME"
    local user="$BACKUP_USER"
    local action="add"
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -f|--frequency)
                frequency="$2"
                shift 2
                ;;
            -t|--time)
                time="$2"
                shift 2
                ;;
            -u|--user)
                user="$2"
                shift 2
                ;;
            -r|--remove)
                action="remove"
                shift
                ;;
            -l|--list)
                action="list"
                shift
                ;;
            -h|--help)
                usage
                ;;
            *)
                echo "Unknown option: $1"
                usage
                ;;
        esac
    done
    
    log "NordLayer Database Backup Cron Setup"
    log "====================================="
    
    case "$action" in
        "add")
            check_backup_script
            create_env_file
            add_cron_job "$frequency" "$time" "$user"
            verify_cron_service
            
            echo ""
            log "Setup completed!"
            log "Next steps:"
            log "1. Edit $SCRIPT_DIR/.backup-env to configure your database settings"
            log "2. Test the backup manually: $BACKUP_SCRIPT"
            log "3. Check cron logs to ensure backups are running: tail -f /var/log/cron"
            ;;
        "remove")
            remove_cron_jobs "$user"
            ;;
        "list")
            list_cron_jobs "$user"
            ;;
    esac
}

# Run main function
main "$@"