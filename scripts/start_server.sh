#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SESSION="file-tracer"

# Kill existing session if any
tmux kill-session -t "$SESSION" 2>/dev/null || true

# Create session with first window (pane 0): Frontend
tmux new-session -d -s "$SESSION" -n "dev" -c "$ROOT_DIR/frontend" "npx vite --host"

# Split horizontally, pane 1: Backend
tmux split-window -h -t "$SESSION:dev" -c "$ROOT_DIR/backend" \
  "source .venv/bin/activate && python -m uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload"

# Attach
tmux attach -t "$SESSION"
