#!/bin/bash
# OneFlow MySQL Database Management Commands

echo "=========================================="
echo "OneFlow MySQL Database Commands"
echo "=========================================="
echo ""

case "$1" in
  start)
    echo "Starting MySQL database..."
    docker-compose -f docker-compose.mysql.yml up -d
    echo "Waiting for database to be ready..."
    sleep 5
    docker exec oneflow-mysql mysqladmin ping -h localhost -u root -prootpassword --silent && echo "✓ Database is ready!" || echo "✗ Database not ready yet, wait a moment"
    ;;
    
  stop)
    echo "Stopping MySQL database..."
    docker-compose -f docker-compose.mysql.yml down
    ;;
    
  restart)
    echo "Restarting MySQL database..."
    docker-compose -f docker-compose.mysql.yml restart
    ;;
    
  logs)
    echo "Viewing database logs (Ctrl+C to exit)..."
    docker-compose -f docker-compose.mysql.yml logs -f
    ;;
    
  status)
    echo "Database Status:"
    docker ps | grep oneflow-mysql || echo "Container not running"
    echo ""
    echo "Health Check:"
    docker exec oneflow-mysql mysqladmin ping -h localhost -u root -prootpassword 2>/dev/null && echo "✓ Database is healthy" || echo "✗ Database is not responding"
    ;;
    
  connect)
    echo "Connecting to MySQL as oneflow_user..."
    docker exec -it oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow
    ;;
    
  connect-root)
    echo "Connecting to MySQL as root..."
    docker exec -it oneflow-mysql mysql -u root -prootpassword oneflow
    ;;
    
  tables)
    echo "Database Tables:"
    docker exec oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow -e "SHOW TABLES;"
    ;;
    
  users)
    echo "Users in database:"
    docker exec oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow -e "SELECT id, username, email, role FROM users;"
    ;;
    
  projects)
    echo "Projects in database:"
    docker exec oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow -e "SELECT id, name, manager, status, progress FROM projects;"
    ;;
    
  tasks)
    echo "Tasks in database:"
    docker exec oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow -e "SELECT id, title, assignee, priority, state FROM tasks LIMIT 10;"
    ;;
    
  backup)
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    echo "Creating backup: $BACKUP_FILE"
    docker exec oneflow-mysql mysqldump -u oneflow_user -poneflow_pass oneflow > "$BACKUP_FILE"
    echo "✓ Backup created: $BACKUP_FILE"
    ;;
    
  restore)
    if [ -z "$2" ]; then
      echo "Usage: $0 restore <backup-file.sql>"
      exit 1
    fi
    echo "Restoring from: $2"
    docker exec -i oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow < "$2"
    echo "✓ Database restored"
    ;;
    
  reset)
    echo "⚠️  WARNING: This will delete all data and recreate the database!"
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
      echo "Stopping and removing containers and volumes..."
      docker-compose -f docker-compose.mysql.yml down -v
      echo "Starting fresh database..."
      docker-compose -f docker-compose.mysql.yml up -d
      echo "✓ Database reset complete"
    else
      echo "Reset cancelled"
    fi
    ;;
    
  clean)
    echo "Removing stopped containers and unused volumes..."
    docker-compose -f docker-compose.mysql.yml down
    docker volume prune -f
    echo "✓ Cleanup complete"
    ;;
    
  *)
    echo "Usage: $0 {command}"
    echo ""
    echo "Available commands:"
    echo "  start         - Start the MySQL database"
    echo "  stop          - Stop the MySQL database"
    echo "  restart       - Restart the MySQL database"
    echo "  logs          - View database logs"
    echo "  status        - Check database status"
    echo "  connect       - Connect to MySQL CLI (as oneflow_user)"
    echo "  connect-root  - Connect to MySQL CLI (as root)"
    echo "  tables        - Show all tables"
    echo "  users         - Show all users"
    echo "  projects      - Show all projects"
    echo "  tasks         - Show tasks (limited to 10)"
    echo "  backup        - Create database backup"
    echo "  restore FILE  - Restore from backup file"
    echo "  reset         - Reset database (deletes all data!)"
    echo "  clean         - Clean up unused Docker resources"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 connect"
    echo "  $0 backup"
    echo "  $0 restore backup_20251108_120000.sql"
    exit 1
    ;;
esac
