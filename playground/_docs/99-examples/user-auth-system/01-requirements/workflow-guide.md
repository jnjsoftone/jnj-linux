# Requirements Phase - Workflow Guide

This guide explains **how to work** during the requirements phase, **when to create/update documents**, and **how to collaborate** with Claude Code.

---

## 📅 Phase Overview

**Duration**: Week 1 (5 days)
**Team**: Product Manager (lead), Tech Lead, Stakeholders
**Output**: Approved requirements documentation

---

## Day-by-Day Workflow

### Day 1 (Monday): Project Kickoff

#### Morning (9 AM - 12 PM): Initial Requirements Gathering

**Activities**:
1. **Stakeholder Meeting** (2 hours)
   - Present project idea
   - Discuss objectives and success criteria
   - Identify constraints and risks
   - Define scope boundaries

2. **With Claude Code** (1 hour)
   - Use [Prompt 1.1](./claude-prompts.md#prompt-11-initial-project-overview)
   - Generate initial project overview
   - Review and customize with business context

**Documents Created**:
- ✅ `01-project-overview.md` (Draft)

**Claude Code Integration**:
```
Open: 01-project-overview.md
Prompt: "I'm building a user authentication system. Help me create a comprehensive project overview..."
Action: Review Claude's output, add business-specific details
Save: Draft version for team review
```

#### Afternoon (1 PM - 5 PM): Core Functional Requirements

**Activities**:
1. **Brainstorming** (1 hour)
   - List all authentication features needed
   - Prioritize must-have vs nice-to-have
   - Identify dependencies

2. **With Claude Code** (2 hours)
   - Use [Prompt 2.1](./claude-prompts.md#prompt-21-core-authentication-requirements)
   - Generate functional requirements for auth
   - Add acceptance criteria and error cases

3. **Documentation** (1 hour)
   - Review Claude's requirements
   - Customize for your needs
   - Add traceability IDs

**Documents Created**:
- ✅ `02-functional-requirements.md` (50% complete)

**End of Day 1 Checklist**:
- [ ] Project overview drafted
- [ ] Core authentication requirements documented (10-12 requirements)
- [ ] Stakeholder meeting notes saved
- [ ] Tomorrow's priorities identified

---

### Day 2 (Tuesday): Complete Functional Requirements

#### Morning (9 AM - 12 PM): RBAC Requirements

**Activities**:
1. **With Claude Code** (2 hours)
   - Use [Prompt 2.2](./claude-prompts.md#prompt-22-role--permission-requirements)
   - Generate RBAC requirements
   - Define GraphQL schema for roles/permissions

2. **Review Session** (1 hour)
   - Review all functional requirements
   - Check for completeness
   - Identify gaps

**Documents Updated**:
- ✅ `02-functional-requirements.md` (100% complete)

#### Afternoon (1 PM - 5 PM): Edge Cases & Validation

**Activities**:
1. **With Claude Code** (1.5 hours)
   - Use [Prompt 2.3](./claude-prompts.md#prompt-23-edge-cases-and-error-scenarios)
   - Identify missing edge cases
   - Add error scenarios

2. **Team Review** (1.5 hours)
   - Walk through requirements with team
   - Get feedback from developers
   - Adjust priorities if needed

**Documents Updated**:
- ✅ `02-functional-requirements.md` (edge cases added)
- ✅ `01-project-overview.md` (risks updated based on requirements)

**End of Day 2 Checklist**:
- [ ] All functional requirements documented (18-20 requirements)
- [ ] Edge cases identified
- [ ] Team review completed
- [ ] Initial GraphQL schema drafted

---

### Day 3 (Wednesday): Non-Functional Requirements

#### Morning (9 AM - 12 PM): Performance & Security NFRs

**Activities**:
1. **With Claude Code** (1 hour)
   - Use [Prompt 3.1](./claude-prompts.md#prompt-31-performance-requirements)
   - Generate performance requirements
   - Define SLAs and targets

2. **With Claude Code** (1.5 hours)
   - Use [Prompt 3.2](./claude-prompts.md#prompt-32-security-requirements-owasp)
   - Generate security requirements
   - OWASP Top 10 coverage check

**Documents Created**:
- ✅ `03-non-functional-requirements.md` (60% complete)

#### Afternoon (1 PM - 5 PM): Complete NFRs

**Activities**:
1. **With Claude Code** (1 hour)
   - Use [Prompt 3.3](./claude-prompts.md#prompt-33-availability--reliability-requirements)
   - Generate availability requirements
   - Define monitoring needs

2. **Tech Lead Review** (2 hours)
   - Review all NFRs with tech lead
   - Validate performance targets are realistic
   - Adjust based on infrastructure constraints

**Documents Updated**:
- ✅ `03-non-functional-requirements.md` (100% complete)

**End of Day 3 Checklist**:
- [ ] Performance requirements defined
- [ ] Security requirements comprehensive (OWASP covered)
- [ ] Availability targets set
- [ ] Tech lead approval obtained

---

### Day 4 (Thursday): Requirements Analysis & Traceability

#### Morning (9 AM - 12 PM): Traceability & Gap Analysis

**Activities**:
1. **With Claude Code** (1 hour)
   - Use [Prompt 4.1](./claude-prompts.md#prompt-41-requirements-traceability-matrix)
   - Generate traceability matrix
   - Link requirements to test cases

2. **With Claude Code** (1.5 hours)
   - Use [Prompt 4.2](./claude-prompts.md#prompt-42-requirements-gap-analysis)
   - Identify missing requirements
   - Check for conflicts

**Documents Updated**:
- ✅ `02-functional-requirements.md` (added traceability section)
- ✅ `01-project-overview.md` (updated scope based on gaps)

#### Afternoon (1 PM - 5 PM): Requirements Validation

**Activities**:
1. **With Claude Code** (1 hour)
   - Use [Prompt 4.3](./claude-prompts.md#prompt-43-requirements-validation)
   - Validate requirements against SMART criteria
   - Fix incomplete requirements

2. **Stakeholder Review** (2 hours)
   - Present all requirements to stakeholders
   - Get approval on scope
   - Finalize priorities

**Documents Finalized**:
- ✅ `01-project-overview.md` (Approved)
- ✅ `02-functional-requirements.md` (Approved)
- ✅ `03-non-functional-requirements.md` (Approved)

**End of Day 4 Checklist**:
- [ ] Traceability matrix complete
- [ ] No missing requirements
- [ ] All requirements SMART-validated
- [ ] Stakeholder approval received

---

### Day 5 (Friday): Preparation for Next Phase

#### Morning (9 AM - 12 PM): User Stories & Planning

**Activities**:
1. **With Claude Code** (2 hours)
   - Use [Prompt 5.1](./claude-prompts.md#prompt-51-convert-requirements-to-user-stories)
   - Convert requirements to user stories
   - Group into sprints

**Documents Created**:
- ✅ `../03-planning/03-user-stories/auth-user-stories.md`

#### Afternoon (1 PM - 5 PM): API Schema Draft

**Activities**:
1. **With Claude Code** (2 hours)
   - Use [Prompt 5.2](./claude-prompts.md#prompt-52-graphql-schema-from-requirements)
   - Generate complete GraphQL schema
   - Review against requirements

2. **Handoff Preparation** (1 hour)
   - Prepare requirements handoff to design team
   - Create summary document
   - Schedule design kickoff for Week 2

**Documents Created**:
- ✅ `../05-api/01-graphql-schema.md` (Initial draft)
- ✅ `requirements-summary.md` (Handoff document)

**End of Day 5 Checklist**:
- [ ] User stories created for Sprint 1
- [ ] Initial GraphQL schema drafted
- [ ] Requirements phase complete
- [ ] Ready for design phase

---

## 🔄 Document Evolution Pattern

### Pattern: Iterative Refinement

```
Day 1: Create (Draft)
   ↓
Day 2: Expand (Add details)
   ↓
Day 3: Review (Team feedback)
   ↓
Day 4: Validate (SMART check)
   ↓
Day 5: Finalize (Approval)
```

### Which Documents Get Updated When

| Document | Day 1 | Day 2 | Day 3 | Day 4 | Day 5 |
|----------|-------|-------|-------|-------|-------|
| 01-project-overview.md | Create | Update (risks) | - | Update (scope) | Finalize |
| 02-functional-requirements.md | Create | Complete | - | Add traceability | Finalize |
| 03-non-functional-requirements.md | - | - | Create | Review | Finalize |

---

## 👥 Team Collaboration

### Daily Standup (15 min)

**Every morning at 9 AM**:
- What did I document yesterday?
- What will I document today?
- Any blockers? (missing stakeholder input, unclear scope)

### End-of-Day Review (30 min)

**Every day at 4:30 PM**:
- Review documents created today
- Check for consistency across documents
- Plan tomorrow's priorities

### Key Meetings

| Meeting | When | Duration | Participants | Purpose |
|---------|------|----------|--------------|---------|
| Kickoff | Day 1, 9 AM | 2 hours | All stakeholders | Define objectives |
| Team Review | Day 2, 2 PM | 1.5 hours | Dev team | Review functional requirements |
| Tech Review | Day 3, 2 PM | 2 hours | Tech lead | Validate NFRs |
| Stakeholder Approval | Day 4, 2 PM | 2 hours | Stakeholders | Final approval |

---

## 🤖 Claude Code Integration Points

### When to Use Claude

1. **Document Generation** ✅
   - Creating initial drafts
   - Following templates
   - Ensuring completeness

2. **Gap Analysis** ✅
   - Identifying missing requirements
   - Finding edge cases
   - Checking coverage

3. **Validation** ✅
   - SMART criteria check
   - Consistency check
   - Format validation

4. **Schema Generation** ✅
   - GraphQL schema from requirements
   - Type definitions
   - Input/output types

### When NOT to Use Claude

1. **Business Decisions** ❌
   - Priority setting
   - Scope decisions
   - Budget allocation

2. **Stakeholder Management** ❌
   - Getting approvals
   - Resolving conflicts
   - Political considerations

3. **Domain Expertise** ❌
   - Your company's specific rules
   - Industry regulations
   - Custom workflows

---

## 📝 Documentation Best Practices

### Writing Requirements

**Good Requirement**:
```markdown
### REQ-AUTH-001: User Registration with Email
**Priority**: Critical

Users must be able to register using email and password.

**Acceptance Criteria**:
- [ ] Email must be unique
- [ ] Password must be at least 8 characters
- [ ] Password must contain uppercase, lowercase, number, special char
- [ ] Email verification sent after registration
- [ ] Account inactive until verified

**Error Cases**:
- Email exists → "Email already registered"
- Weak password → "Password does not meet requirements"
```

**Bad Requirement**:
```markdown
### User Signup
Users can sign up.
```

### Linking Documents

Always cross-reference related documents:

```markdown
**Related Requirements**:
- REQ-AUTH-002 (Email Verification) - depends on this
- REQ-AUTH-003 (Login) - requires verification

**Related Documents**:
- [Database Schema](../04-architecture/02-database-schema.md)
- [GraphQL Schema](../05-api/01-graphql-schema.md)
```

---

## ✅ Phase Completion Checklist

Before moving to Design phase, ensure:

### Documentation Complete
- [ ] Project overview approved by stakeholders
- [ ] All functional requirements documented
- [ ] All non-functional requirements documented
- [ ] Requirements traceability matrix created
- [ ] No conflicting requirements
- [ ] All requirements SMART-validated

### Quality Checks
- [ ] All requirements have unique IDs
- [ ] All requirements have acceptance criteria
- [ ] All requirements have priority assigned
- [ ] Error cases documented
- [ ] Security requirements covered (OWASP)
- [ ] Performance targets defined

### Team Alignment
- [ ] Stakeholder approval received
- [ ] Tech lead reviewed all NFRs
- [ ] Development team understands requirements
- [ ] QA team has access to requirements
- [ ] Design team briefed for next phase

### Next Phase Preparation
- [ ] User stories created for Sprint 1
- [ ] Initial GraphQL schema drafted
- [ ] Design kickoff scheduled
- [ ] Database schema planning scheduled

---

## 🚀 Transition to Design Phase

### Handoff to Design Team

Create a handoff document with:
1. Summary of requirements
2. Key user flows
3. Priority features for design
4. Brand guidelines (if any)
5. Accessibility requirements

### Handoff Meeting (1 hour)

**Agenda**:
1. Present project overview (15 min)
2. Walk through user stories (20 min)
3. Discuss UI/UX priorities (15 min)
4. Q&A (10 min)

**Deliverables to Design Team**:
- `01-project-overview.md`
- `02-functional-requirements.md`
- `../03-planning/03-user-stories/auth-user-stories.md`
- Wireframe requirements (if any)

---

## 📚 Related Documents

- [Claude Prompts](./claude-prompts.md) - Prompts for this phase
- [Project Overview](./01-project-overview.md) - Created in this phase
- [Functional Requirements](./02-functional-requirements.md) - Created in this phase
- [Non-Functional Requirements](./03-non-functional-requirements.md) - Created in this phase
- [Design Phase Guide](../02-design/workflow-guide.md) - Next phase

---

**Phase Status**: Template for Week 1
**Time Investment**: ~40 hours (1 week, 1 person)
**Claude Code Contribution**: ~60% of content generation
