#!/bin/bash

# Documentation Structure Setup Script
# This script creates a comprehensive documentation structure for project management

set -e

DOCS_ROOT="/var/services/homes/jungsam/dev/dockers/_templates/docker/ubuntu-project/_docs"
cd "$DOCS_ROOT"

echo "🚀 Setting up comprehensive documentation structure..."

# Create directory structure
echo "📁 Creating directories..."

mkdir -p 01-requirements/{templates,personas,use-cases}
mkdir -p 02-design/{01-design-system,02-ui-components,03-mockups,04-specifications,assets/{images,icons,fonts}}
mkdir -p 03-planning/{02-features,03-user-stories,04-sprints,05-backlog}
mkdir -p 04-architecture/{diagrams,decisions}
mkdir -p 05-api/{graphql,rest,auth,examples}
mkdir -p 06-development/{04-best-practices,05-implementation-notes,06-code-review}
mkdir -p 07-testing/{02-test-cases,03-automated-tests,04-performance,05-security}
mkdir -p 08-deployment/{03-cicd,05-environments}
mkdir -p 09-operations/{01-incidents,03-runbooks,04-backups}
mkdir -p 10-collaboration/{01-communication,03-change-requests,04-status-reports,05-bug-reports,06-meeting-notes,07-onboarding,08-decisions}

echo "✅ Directories created successfully"

# Create .gitkeep files to preserve empty directories
echo "📌 Adding .gitkeep files..."
find . -type d -empty -exec touch {}/.gitkeep \;

echo "✅ Documentation structure setup complete!"
echo ""
echo "📊 Structure Summary:"
echo "  - 10 main categories"
echo "  - 40+ subdirectories"
echo "  - Ready for documentation"
echo ""
echo "Next steps:"
echo "  1. Review the main README.md"
echo "  2. Customize templates for your project"
echo "  3. Start documenting requirements"
echo "  4. Set up collaboration workflows"
