#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$HOME/Projects/urandomio/urandom.io"
cd "$REPO_DIR"

# Fetch last 3 days of messages (to catch anything we missed)
echo "Fetching recent messages from Jenn..."
imsg history --chat-id 71 --limit 500 2>/dev/null | strings | grep -E "202[456]-" | grep "\[recv\]" > /tmp/jenn_recent.txt || true

if [ ! -s /tmp/jenn_recent.txt ]; then
  echo "No new messages found."
  exit 0
fi

# Run Python script to filter and update JSON
python3 << 'PYTHON_EOF'
import json
import re
from datetime import datetime, timedelta

# Funny keywords
funny_keywords = [
    'fuck', 'shit', 'poop', 'taco', 'bell', 'nextdoor', 'dad', 'dump', 
    'butter', 'meteor', 'donut', 'flies', 'drunk', 'alcohol', 'weed', 'pot',
    'bang', 'sex', 'lol', 'haha', 'wtf', 'omg', 'crazy', 'insane', 'shed', 'shitter'
]

# Personal/sensitive keywords to skip
skip_keywords = [
    'money', 'card', 'account', 'password', 'ssn', 'medicine', 'doctor', 'health',
    'insurance', 'bill', 'debt', 'rent', 'therapy', 'prescription'
]

# Load existing data
with open('public/jenn-data.json', 'r') as f:
    data = json.load(f)

# Get existing message texts to avoid duplicates
existing_texts = set()
for month_msgs in data['months'].values():
    for msg in month_msgs:
        existing_texts.add(msg['text'])

# Parse new messages
new_messages = []
cutoff = datetime.now() - timedelta(days=3)

with open('/tmp/jenn_recent.txt', 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        match = re.match(r'([\d\-T:.Z]+)\s+\[recv\]\s+\+\d+:\s*(.+)', line)
        if not match:
            continue
        
        timestamp_str, text = match.groups()
        text = text.strip()
        
        # Skip if already exists
        if text in existing_texts:
            continue
        
        # Skip empty, short, or attachment-only messages
        if not text or len(text) < 10 or 'attachment' in text.lower():
            continue
        
        # Skip if contains personal keywords
        text_lower = text.lower()
        if any(keyword in text_lower for keyword in skip_keywords):
            continue
        
        # Only keep if it has funny keywords
        if not any(keyword in text_lower for keyword in funny_keywords):
            continue
        
        try:
            dt = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
            
            # Only messages from last 3 days
            if dt < cutoff:
                continue
            
            new_messages.append({
                'date': dt.strftime('%Y-%m-%d'),
                'time': dt.strftime('%I:%M %p').lstrip('0'),
                'month': dt.strftime('%B %Y'),
                'text': text,
                'is_funny': True
            })
        except:
            continue

if not new_messages:
    print("No new funny content found.")
    exit(0)

# Add new messages to data
added = 0
for msg in new_messages:
    month = msg['month']
    if month not in data['months']:
        data['months'][month] = []
    data['months'][month].insert(0, msg)  # Add to beginning of month
    added += 1

data['total'] = sum(len(msgs) for msgs in data['months'].values())

# Save updated data
with open('public/jenn-data.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"✅ Added {added} new messages. Total: {data['total']}")
PYTHON_EOF

# Check if there were changes
if git diff --quiet public/jenn-data.json; then
  echo "No changes to commit."
  exit 0
fi

# Commit and push
git add public/jenn-data.json
git commit -m "data(jenn): auto-update with new funny content"
git push origin main

echo "🚀 Changes committed and pushed!"
