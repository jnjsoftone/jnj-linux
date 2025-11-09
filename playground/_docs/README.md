# 📚 Project Documentation Hub

Welcome to **${PROJECT_NAME}** documentation. This `_docs/` folder is the single source of truth for all project information, designed to support continuous collaboration between stakeholders, designers, developers, and operations teams.

## 📌 Documentation Scope

**This is PROJECT-LEVEL documentation** - templates for project-specific documentation that evolves during agile development.

**Key Characteristics**:
- **Project-Specific**: Implementation details unique to this project
- **Agile**: Updated continuously throughout development lifecycle
- **AI-Assisted**: Claude Code automatically updates docs alongside code changes
- **Template-Based**: Provides structure; each project fills in specific content
- **Bilingual**: English (`.md`) for AI communication, Korean (`.kr.md`) for developers

**Relationship to Platform Documentation**:
- Platform docs (`docker-ubuntu/_docs/`) = **Platform-wide standards** (coding conventions, architecture patterns)
- Project docs (here) = **Project implementation details** (requirements, features, API specs)
- See [CLAUDE.md](/volume1/homes/jungsam/dockers/CLAUDE.md) for complete documentation architecture

**AI Documentation Updates**:
- When code changes, Claude Code **automatically identifies** which docs need updates
- Updates happen **in parallel** with code changes, not after
- Both English and Korean versions are **kept synchronized**
- See "Documentation Update Workflow" section below for details

## 🎯 Documentation Philosophy

This documentation follows:
- **Living Documentation**: Continuously updated alongside code changes
- **Workflow-Driven**: Organized to match development lifecycle
- **Collaboration-First**: Facilitates communication between all team members
- **Version-Controlled**: All documents tracked in Git with change history
- **AI-Maintained**: Claude Code helps keep documentation current and accurate

## 📂 Documentation Structure

```
_docs/
├── 01-requirements/           # What we're building (Client & PM)
├── 02-design/                 # How it should look (Design Team)
├── 03-planning/               # How we'll build it (PM & Tech Lead)
├── 04-architecture/           # Technical foundation (Developers)
├── 05-api/                    # API contracts (Backend & Frontend)
├── 06-development/            # Implementation guides (Developers)
├── 07-testing/                # Quality assurance (QA & Developers)
├── 08-deployment/             # Going live (DevOps)
├── 09-operations/             # Running in production (Operations)
├── 10-collaboration/          # Team communication (All)
└── README.md                  # This file
```

## 🔄 Documentation Lifecycle

```
Client Requirements → Design → Planning → Architecture → Development → Testing → Deployment → Operations
       ↓                ↓          ↓            ↓              ↓           ↓           ↓            ↓
  Requirements    UI/UX Specs  Roadmap    Tech Specs    Implementation  Test Plans  Deploy Guide  Runbooks
```

## 📖 Quick Start by Role

### 👔 For Clients & Stakeholders
1. **[Project Overview](./01-requirements/01-project-overview.md)** - What this project does
2. **[Requirements](./01-requirements/02-functional-requirements.md)** - What features are included
3. **[Roadmap](./03-planning/01-roadmap.md)** - Project timeline and milestones
4. **[Change Requests](./10-collaboration/03-change-requests/)** - How to request changes

### 🎨 For Designers
1. **[Design System](./02-design/01-design-system.md)** - Design principles and guidelines
2. **[UI Components](./02-design/02-ui-components/)** - Reusable components
3. **[Mockups & Prototypes](./02-design/03-mockups/)** - Visual designs
4. **[Design Handoff](./10-collaboration/02-design-handoff.md)** - Designer → Developer process

### 📋 For Product Managers
1. **[Product Roadmap](./03-planning/01-roadmap.md)** - Feature planning
2. **[User Stories](./03-planning/03-user-stories/)** - User-centered requirements
3. **[Sprint Planning](./03-planning/04-sprints/)** - Iteration planning
4. **[Status Reports](./10-collaboration/04-status-reports/)** - Project progress

### 💻 For Developers
1. **[Getting Started](./06-development/01-getting-started.md)** - Development setup
2. **[Architecture](./04-architecture/01-system-architecture.md)** - System design
3. **[API Documentation](./05-api/)** - GraphQL/REST APIs
4. **[Coding Standards](./06-development/02-coding-standards.md)** - Code conventions
5. **[Development Workflow](./06-development/03-development-workflow.md)** - Daily workflow

### 🧪 For QA Engineers
1. **[Testing Strategy](./07-testing/01-testing-strategy.md)** - Overall approach
2. **[Test Cases](./07-testing/02-test-cases/)** - Detailed test scenarios
3. **[Bug Reports](./10-collaboration/05-bug-reports/)** - Issue tracking

### 🚀 For DevOps
1. **[Deployment Guide](./08-deployment/01-deployment-guide.md)** - How to deploy
2. **[Infrastructure](./08-deployment/02-infrastructure.md)** - Server setup
3. **[Monitoring](./09-operations/02-monitoring.md)** - System health
4. **[Runbooks](./09-operations/03-runbooks/)** - Operational procedures

## 📋 Documentation Categories

### 01. Requirements
**Purpose**: Define what needs to be built
**Maintained by**: Product Manager, Stakeholders
**Updated**: When requirements change

- Project overview and business goals
- Functional and non-functional requirements
- User personas and use cases
- Success metrics and KPIs

### 02. Design
**Purpose**: Visual and interaction design
**Maintained by**: Design Team
**Updated**: During design iterations

- Design system and style guide
- UI components and patterns
- Mockups and prototypes
- Accessibility guidelines

### 03. Planning
**Purpose**: Project organization and timelines
**Maintained by**: Product Manager, Tech Lead
**Updated**: Weekly/Sprint basis

- Product roadmap
- Feature specifications
- User stories and acceptance criteria
- Sprint planning and backlog

### 04. Architecture
**Purpose**: Technical foundation and decisions
**Maintained by**: Tech Lead, Senior Developers
**Updated**: When architecture changes

- System architecture diagrams
- Database schema design
- Technology stack decisions
- Security architecture

### 05. API
**Purpose**: API contracts and documentation
**Maintained by**: Backend Developers
**Updated**: With every API change

- GraphQL schema and queries
- REST endpoints
- Authentication/Authorization
- API versioning

### 06. Development
**Purpose**: Implementation guidance
**Maintained by**: Development Team
**Updated**: Continuously

- Development environment setup
- Coding standards and conventions
- Development workflow
- Code review guidelines

### 07. Testing
**Purpose**: Quality assurance
**Maintained by**: QA Team, Developers
**Updated**: Per feature/sprint

- Testing strategy
- Test cases and scenarios
- Automated test coverage
- Performance testing

### 08. Deployment
**Purpose**: Release and deployment processes
**Maintained by**: DevOps, Tech Lead
**Updated**: When deployment process changes

- Deployment procedures
- Infrastructure as Code
- CI/CD pipelines
- Environment configurations

### 09. Operations
**Purpose**: Production operations
**Maintained by**: DevOps, Operations Team
**Updated**: Continuously

- Incident response procedures
- Monitoring and alerting
- Runbooks and playbooks
- Backup and recovery

### 10. Collaboration
**Purpose**: Team communication and processes
**Maintained by**: All Team Members
**Updated**: Continuously

- Communication channels
- Meeting notes and decisions
- Change request process
- Knowledge sharing

## 🔄 Document Update Workflow

### AI-Assisted Documentation Updates (Claude Code)

**Automatic Update Process**:

```
Code Change → Claude Detects Impact → Identifies Affected Docs → Updates Content → Verifies Sync
      ↓                ↓                       ↓                      ↓               ↓
Feature Impl    Analyzes Changes      Requirements/API/Dev      Updates .md      Checks .kr.md
Architecture    References CLAUDE.md   Architecture/Testing    Adds Examples    Syncs Both
API Change      Checks Both _docs      Deployment/Operations   Updates Refs     Validates
```

**What Claude Code Updates**:

1. **Feature Implementation**:
   - `03-planning/01-roadmap.md` - Mark feature as completed
   - `05-api/graphql/*.md` or `05-api/rest/*.md` - Add new endpoints
   - `06-development/05-implementation-notes/{feature}.md` - Document implementation
   - `98-chats/claude/{date}-{topic}.md` - Record development decisions

2. **Architecture Decisions**:
   - `04-architecture/decisions/ADR-{number}-{title}.md` - Add Architecture Decision Record
   - `04-architecture/diagrams/` - Update diagrams (if needed)
   - Platform docs (if reusable pattern)

3. **API Contract Changes**:
   - `05-api/graphql/*.md` or `05-api/rest/*.md` - Update schema/endpoints
   - `05-api/examples/*.md` - Update examples with working code
   - `06-development/05-implementation-notes/*.md` - Note breaking changes

4. **Testing & QA**:
   - `07-testing/02-test-cases/*.md` - Add test scenarios
   - `07-testing/03-automated-tests/*.md` - Document test coverage

5. **Deployment Changes**:
   - `08-deployment/01-deployment-guide.md` - Update procedures
   - `08-deployment/04-changelog.md` - Add version history

**Claude Code's Checklist** (automated verification):
- ✅ Affected files identified and updated
- ✅ English and Korean versions synchronized
- ✅ File paths with line numbers (e.g., `api/src/users.ts:42`)
- ✅ Code examples tested and working
- ✅ Cross-references between docs valid
- ✅ Follows existing document structure

### When to Update Documentation

```mermaid
Code Change → Update Technical Docs → PR Review → Merge → Deploy
    ↓              ↓                      ↓           ↓
Requirements   API Docs            Code Review   Update Changelog
 Change      Architecture         Documentation    Release Notes
              Development Guide    Check
```

### Manual Documentation Review Cycle

- **Daily**: API documentation, development guides (Claude Code assists)
- **Weekly**: User stories, sprint planning, status reports
- **Sprint**: Roadmap updates, feature specs
- **Quarterly**: Architecture review, technology decisions
- **Annually**: Design system, overall strategy

### Human Responsibilities

While Claude Code handles technical documentation updates, **humans must**:
- Review and approve documentation changes in PRs
- Update business requirements and goals (`01-requirements/`)
- Create design specifications (`02-design/`)
- Plan roadmaps and user stories (`03-planning/`)
- Write status reports and meeting notes (`10-collaboration/`)
- Make final architectural decisions (Claude documents them)

## 🤝 Team Collaboration Best Practices

### 1. Requirements Gathering
**Process**: Client → PM → Design → Development
- Use **[Requirement Template](./01-requirements/templates/requirement-template.md)**
- Document in **[Functional Requirements](./01-requirements/02-functional-requirements.md)**
- Create **[User Stories](./03-planning/03-user-stories/)**

### 2. Design Handoff
**Process**: Design → Development
- Complete **[Design Specs](./02-design/04-specifications/)**
- Use **[Design Handoff Checklist](./10-collaboration/02-design-handoff.md)**
- Review in **Design Review Meeting**

### 3. Development
**Process**: Planning → Implementation → Review → Deploy
- Follow **[Development Workflow](./06-development/03-development-workflow.md)**
- Update **[API Documentation](./05-api/)**
- Document in **[Implementation Notes](./06-development/05-implementation-notes/)**

### 4. Testing & QA
**Process**: Development → Testing → Bug Fix → Retest
- Use **[Test Case Templates](./07-testing/02-test-cases/template.md)**
- Report bugs in **[Bug Reports](./10-collaboration/05-bug-reports/)**
- Track in **Issue Tracker**

### 5. Deployment
**Process**: QA Approval → Deploy → Verify → Monitor
- Follow **[Deployment Checklist](./08-deployment/01-deployment-guide.md)**
- Update **[Changelog](./08-deployment/04-changelog.md)**
- Monitor in **[Operations Dashboard](./09-operations/02-monitoring.md)**

## 📞 Communication Channels

### Synchronous Communication
- **Daily Standup**: 15-min status updates (9:00 AM)
- **Design Review**: Weekly design discussions (Tuesday 2:00 PM)
- **Sprint Planning**: Bi-weekly planning (Monday 10:00 AM)
- **Retrospective**: Sprint reflection (Friday 3:00 PM)

### Asynchronous Communication
- **Slack/Teams**: Quick questions and updates
- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code review discussions
- **Documentation**: Long-form explanations

### Meeting Notes
All meetings documented in **[10-collaboration/06-meeting-notes/](./10-collaboration/06-meeting-notes/)**

## 📝 Documentation Standards

### File Naming Convention
```
# Use descriptive, kebab-case names
✅ user-authentication-flow.md
✅ database-schema-design.md
✅ api-error-handling.md

❌ doc1.md
❌ UserAuth.md
❌ database_schema.md
```

### Document Structure
```markdown
# Title (H1 - one per document)

Brief description of document purpose.

## Table of Contents (for long docs)

## Section 1 (H2)

### Subsection (H3)

- Use clear hierarchy
- Include code examples
- Add diagrams when helpful

## Related Documents
[Link to related docs]

---
**Last Updated**: YYYY-MM-DD
**Author**: Name
**Reviewers**: Name1, Name2
```

### Markdown Best Practices
- Use relative links: `[API Docs](../05-api/graphql.md)`
- Include code blocks with language: ` ```typescript `
- Add alt text to images: `![Architecture Diagram](./images/arch.png)`
- Use tables for structured data
- Add emoji for visual hierarchy (sparingly)

## 🔍 Search and Navigation

### Finding Information
1. **Start with README.md** (this file)
2. **Check the relevant numbered folder** (01-10)
3. **Use folder README.md** for navigation
4. **Search with `grep` or IDE search**

### Cross-References
- Always link related documents
- Use relative paths for portability
- Keep link text descriptive

## 🔐 Access Control

### Public Documentation
- Project overview
- API documentation (public APIs)
- Getting started guides

### Internal Documentation
- Client requirements (sensitive)
- Business logic details
- Infrastructure secrets (use separate secure storage)

### Sensitive Information
⚠️ **Never commit**:
- API keys, passwords, secrets
- Client confidential information
- Production credentials

Use environment variables and secret management tools.

## 🎓 Knowledge Base

### Onboarding New Team Members
1. **[Onboarding Guide](./10-collaboration/07-onboarding/)**
2. Review role-specific Quick Start (above)
3. Set up development environment
4. Read recent sprint documentation
5. Attend team introduction meeting

### Knowledge Sharing
- **[Decision Log](./10-collaboration/08-decisions/)** - Why we made key decisions
- **[Best Practices](./06-development/04-best-practices/)** - Lessons learned
- **[FAQs](./10-collaboration/09-faqs.md)** - Common questions

## 📊 Documentation Metrics

Track documentation health:
- **Coverage**: % of features documented
- **Freshness**: Days since last update
- **Accuracy**: Feedback from team
- **Usability**: Time to find information

## 🔗 External Resources

### Project Links
- **Repository**: [GitHub/GitLab URL]
- **CI/CD**: [Jenkins/GitHub Actions URL]
- **Staging**: [Staging Environment URL]
- **Production**: [Production URL]

### Tools
- **Design**: Figma, Adobe XD
- **Project Management**: Jira, Linear, Notion
- **Communication**: Slack, Microsoft Teams
- **Monitoring**: Grafana, Datadog

## 📅 Maintenance Schedule

### Daily
- Update API docs with code changes
- Log important decisions
- Update implementation notes

### Weekly
- Review and merge documentation PRs
- Update sprint documentation
- Check for broken links

### Monthly
- Review documentation metrics
- Archive outdated documents
- Update external links

### Quarterly
- Comprehensive documentation audit
- Update architecture diagrams
- Review and refine processes

## 🆘 Getting Help

### Documentation Issues
1. **Can't find information**: Ask in `#documentation` channel
2. **Information outdated**: Create documentation issue
3. **Unclear documentation**: Suggest improvements via PR

### Contact
- **Documentation Lead**: ${GITHUB_USER}
- **Tech Lead**: [Name]
- **Product Manager**: [Name]

---

**Project**: ${PROJECT_NAME}
**Platform**: ${PLATFORM_NAME}
**Last Updated**: $(date +%Y-%m-%d)
**Version**: 1.0.0

> 💡 **Tip**: This documentation is version-controlled. Check Git history to see how documents evolved over time.

> 📌 **Note**: Keep this documentation in sync with code. Every significant code change should update relevant documentation.
