#!/usr/bin/env bash
# find-jenn-candidates.sh — local-only helper. Skims the last 3 days of received iMessages from a
# specific thread, filters for "funny" lines, and prints candidates for the /jenn page. Depends on
# `imsg` and a populated Messages.app DB; not portable to CI.
#
# Override via env: REPO_DIR=<path-to-urandom.io clone> CHAT_ID=<imsg chat id> ./find-jenn-candidates.sh
set -euo pipefail

REPO_DIR=${REPO_DIR:-"$HOME/Projects/urandom.io/urandom.io"}
CHAT_ID=${CHAT_ID:-71}

# Fetch last 3 days of messages
imsg history --chat-id "$CHAT_ID" --limit 500 2>/dev/null \
  | strings \
  | grep -E "202[456]-" \
  | grep "\[recv\]" > /tmp/jenn_recent.txt || true

if [ ! -s /tmp/jenn_recent.txt ]; then
  echo "No new messages found in the last 3 days."
  exit 0
fi

# Sanity-check the repo path before the python step references it
if [ ! -f "$REPO_DIR/public/jenn-data.json" ]; then
  echo "REPO_DIR does not look right: $REPO_DIR/public/jenn-data.json missing" >&2
  exit 1
fi

# Filter candidates
python3 << 'PYTHON_EOF'
import re
from datetime import datetime, timedelta

# Skip keywords
skip_keywords = [
    'http', 'www.', '.com', 'icloud', 'share.', 'link',
    'money', 'card', 'account', 'password', 'ssn', 'medicine', 'doctor',
    'insurance', 'bill', 'debt', 'rent', 'therapy', 'prescription'
]
children_names = ['aiden', 'emilie', 'ellee', 'mercy', 'mistie']

# Funny keywords (loose filter)
funny_keywords = [
    'fuck', 'shit', 'poop', 'taco', 'bell', 'nextdoor', 'dad', 'dump',
    'butter', 'meteor', 'donut', 'flies', 'drunk', 'alcohol', 'weed', 'pot',
    'bang', 'sex', 'lol', 'wtf', 'omg', 'crazy', 'insane', 'shed', 'shitter',
    'fart', 'ass', 'butt', 'damn', 'hell'
]

cutoff = datetime.now() - timedelta(days=3)

with open('/tmp/jenn_recent.txt', 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        match = re.match(r'([\d\-T:.Z]+)\s+\[recv\]\s+\+\d+:\s*(.+)', line)
        if not match:
            continue
        
        timestamp_str, text = match.groups()
        text = text.strip()
        text_lower = text.lower()
        
        # Skip boring stuff
        if not text or len(text) < 15 or 'attachment' in text_lower:
            continue
        if any(kw in text_lower for kw in skip_keywords):
            continue
        if any(name in text_lower for name in children_names):
            continue
        
        # Only show if has funny keywords
        if not any(kw in text_lower for kw in funny_keywords):
            continue
        
        try:
            dt = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
            if dt < cutoff:
                continue
            
            print(f"{dt.strftime('%Y-%m-%d %I:%M %p')} | {text}")
        except:
            continue
PYTHON_EOF
