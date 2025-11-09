#!/bin/bash
#
# Start GraphQL and Next.js servers
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

echo "Starting servers..."

# Start GraphQL server (backend)
echo "Starting GraphQL server..."
cd "$PROJECT_DIR/backend/nodejs" || exit 1
nohup npm run graphql:start > "$PROJECT_DIR/logs/nohup_graphql.out" 2>&1 &
GRAPHQL_PID=$!
echo "GraphQL server started (PID: $GRAPHQL_PID)"

# Wait a bit for GraphQL to initialize
sleep 2

# Start Next.js frontend
echo "Starting Next.js frontend..."
cd "$PROJECT_DIR/frontend/nextjs" || exit 1
nohup npm run start > "$PROJECT_DIR/logs/nohup_nextjs.out" 2>&1 &
NEXTJS_PID=$!
echo "Next.js frontend started (PID: $NEXTJS_PID)"

# Save PIDs to file for later management
echo "$GRAPHQL_PID" > "$PROJECT_DIR/logs/graphql.pid"
echo "$NEXTJS_PID" > "$PROJECT_DIR/logs/nextjs.pid"

echo ""
echo "========================================"
echo "Servers started successfully!"
echo "GraphQL PID: $GRAPHQL_PID"
echo "Next.js PID: $NEXTJS_PID"
echo "========================================"
echo ""
echo "To view logs:"
echo "  GraphQL: tail -f $PROJECT_DIR/logs/nohup_graphql.out"
echo "  Next.js: tail -f $PROJECT_DIR/logs/nohup_nextjs.out"
echo ""
echo "To stop servers:"
echo "  kill \$(cat $PROJECT_DIR/logs/graphql.pid)"
echo "  kill \$(cat $PROJECT_DIR/logs/nextjs.pid)"
echo ""