#!/bin/bash

# Script to track Korean version creation status
# This helps identify which files need Korean translations

DOCS_ROOT="/var/services/homes/jungsam/dev/dockers/_templates/docker/ubuntu-project/_docs"
cd "$DOCS_ROOT"

echo "🌏 Korean Version Status Check"
echo "================================"
echo ""

# Find all .md files that don't have .kr.md versions
echo "📋 Files without Korean versions (.kr.md):"
echo ""

count=0
while IFS= read -r file; do
    base_name="${file%.md}"
    kr_file="${base_name}.kr.md"

    if [ ! -f "$kr_file" ]; then
        count=$((count + 1))
        echo "  $count. $file"
    fi
done < <(find . -name "*.md" -type f ! -name "*.kr.md" ! -name "CHATS.md" | sort)

echo ""
echo "================================"
echo "Total files needing Korean versions: $count"
echo ""
echo "✅ Files with Korean versions:"
echo ""

kr_count=0
while IFS= read -r file; do
    kr_count=$((kr_count + 1))
    echo "  $kr_count. $file"
done < <(find . -name "*.kr.md" -type f | sort)

echo ""
echo "================================"
echo "Total Korean versions created: $kr_count"
echo ""
echo "💡 To create Korean version for a file:"
echo "   1. Copy the English version"
echo "   2. Translate to Korean"
echo "   3. Save as [filename].kr.md"
echo ""
echo "📚 Priority files to translate:"
echo "   - README.md (✅ Done)"
echo "   - QUICK-START.md (✅ Done)"
echo "   - DOCUMENTATION-GUIDE.md"
echo "   - 01-requirements/README.md"
echo "   - 01-requirements/templates/requirement-template.md"
echo "   - 10-collaboration/02-design-handoff.md"
