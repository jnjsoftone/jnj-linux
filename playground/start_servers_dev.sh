#!/bin/bash
#
# Start GraphQL and Next.js servers in DEVELOPMENT mode
#

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"

# Create logs directory
mkdir -p "$PROJECT_DIR/logs"

# Load environment variables
if [ -f "$PROJECT_DIR/.env" ]; then
  export $(grep -v '^#' "$PROJECT_DIR/.env" | xargs)
fi

echo "Starting servers in DEVELOPMENT mode..."

# Start GraphQL server (backend) in dev mode
echo "Starting GraphQL dev server..."
cd "$PROJECT_DIR/backend/nodejs" || exit 1
nohup npm run graphql:dev > "$PROJECT_DIR/logs/nohup_graphql_dev.out" 2>&1 &
GRAPHQL_PID=$!
echo "GraphQL dev server started (PID: $GRAPHQL_PID)"

# Wait a bit for GraphQL to initialize
sleep 2

# Start Next.js frontend in dev mode
echo "Starting Next.js dev server..."
cd "$PROJECT_DIR/frontend/nextjs" || exit 1
nohup npm run dev > "$PROJECT_DIR/logs/nohup_nextjs_dev.out" 2>&1 &
NEXTJS_PID=$!
echo "Next.js dev server started (PID: $NEXTJS_PID)"

# Save PIDs to file for later management
echo "$GRAPHQL_PID" > "$PROJECT_DIR/logs/graphql_dev.pid"
echo "$NEXTJS_PID" > "$PROJECT_DIR/logs/nextjs_dev.pid"

echo ""
echo "========================================"
echo "Dev servers started successfully!"
echo "GraphQL PID: $GRAPHQL_PID"
echo "Next.js PID: $NEXTJS_PID"
echo "========================================"
echo ""
echo "To view logs:"
echo "  GraphQL: tail -f $PROJECT_DIR/logs/nohup_graphql_dev.out"
echo "  Next.js: tail -f $PROJECT_DIR/logs/nohup_nextjs_dev.out"
echo ""
echo "To stop servers:"
echo "  kill \$(cat $PROJECT_DIR/logs/graphql_dev.pid)"
echo "  kill \$(cat $PROJECT_DIR/logs/nextjs_dev.pid)"
echo ""
