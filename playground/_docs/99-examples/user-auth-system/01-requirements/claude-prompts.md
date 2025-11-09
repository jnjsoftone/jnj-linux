# Claude Code Prompts - Requirements Phase

This document contains **effective prompts** for using Claude Code during the requirements gathering and documentation phase.

---

## 📋 General Principles for Requirements Phase

### What Works Well with Claude
✅ **Generating comprehensive requirement lists**
✅ **Identifying edge cases and error scenarios**
✅ **Creating acceptance criteria**
✅ **Structuring requirements documents**
✅ **Cross-referencing related requirements**
✅ **Identifying missing requirements**

### What Needs Human Input
❌ **Business priorities** (you must define what's important)
❌ **Stakeholder constraints** (budget, timeline, team)
❌ **Domain-specific business rules** (your company's policies)
❌ **Final approval** (always review Claude's output)

---

## 🎯 Phase 1: Project Overview

### Prompt 1.1: Initial Project Overview

```
I'm building a user authentication and authorization system with the following tech stack:
- Database: PostgreSQL
- Backend: TypeScript + GraphQL (Apollo Server)
- Frontend: Next.js 15 + shadcn/ui + Tailwind CSS

Help me create a comprehensive project overview document that includes:
1. Executive summary (what, why, who)
2. Project objectives (primary and secondary)
3. Success criteria (functional, security, UX, technical)
4. Scope (in-scope for 3 phases, out-of-scope)
5. Stakeholders and their roles
6. Constraints (technical, time, resource, compliance)
7. Assumptions
8. Risks and mitigation strategies
9. Dependencies
10. Metrics and KPIs
11. Timeline with milestones

The project should support:
- User registration with email verification
- Login/logout with JWT tokens
- Password reset
- Role-based access control (RBAC)
- Permission management

Follow the template from /var/services/homes/jungsam/dev/dockers/_templates/docker/ubuntu-project/_docs/01-requirements/templates/requirement-template.md
```

**Expected Output**: Complete project overview document with all sections

---

### Prompt 1.2: Risk Assessment

```
Based on this project overview [paste your overview], identify potential risks for a user authentication system.

For each risk, provide:
1. Risk description
2. Impact level (Critical/High/Medium/Low)
3. Probability (High/Medium/Low)
4. Mitigation strategy
5. Owner (who should handle it)

Focus on:
- Security risks (most critical)
- Technical risks
- Timeline risks
- Integration risks
```

**Expected Output**: Risk matrix with 10-15 identified risks

---

## 📝 Phase 2: Functional Requirements

### Prompt 2.1: Core Authentication Requirements

```
Generate detailed functional requirements for a user authentication system.

For each requirement, include:
- Unique ID (e.g., REQ-AUTH-001)
- Priority (Critical/High/Medium/Low)
- Description
- Acceptance criteria (testable, specific)
- GraphQL mutation/query example
- Error cases with error messages
- Security requirements (if applicable)
- Dependencies on other requirements

Cover these features:
1. User registration with email
2. Email verification
3. Login with JWT tokens (access + refresh)
4. Token refresh mechanism
5. Logout
6. Password reset request
7. Password reset confirmation
8. Password change (authenticated user)
9. Get current user profile
10. Update user profile

Use GraphQL schema with domain-centric naming:
- authUserRegister (not just "register")
- authUserLogin (not just "login")
- authTokenRefresh (not just "refresh")

Reference the GraphQL design guide: /var/services/homes/jungsam/dev/dockers/_templates/docker/docker-ubuntu/_docs/api/01-graphql-design.md
```

**Expected Output**: 10 detailed functional requirements with acceptance criteria

---

### Prompt 2.2: Role & Permission Requirements

```
Generate functional requirements for role-based access control (RBAC).

Include requirements for:
1. List all roles
2. Create new role
3. Update role
4. Delete role
5. Assign role to user
6. Remove role from user
7. List all permissions
8. Check if user has permission
9. Role inheritance (optional)

For each requirement:
- Define who can perform the action (admin only? specific permission?)
- Include authorization checks
- Define GraphQL schema following domain-centric naming
- List error cases (unauthorized, not found, etc.)

Use naming pattern:
- rolesList (query)
- roleCreate (mutation)
- roleUpdate (mutation)
- userRoleAssign (mutation)
```

**Expected Output**: 8-10 RBAC requirements

---

### Prompt 2.3: Edge Cases and Error Scenarios

```
Review these functional requirements [paste requirements] and identify:

1. **Missing edge cases**:
   - What happens if email service is down during registration?
   - What if user tries to reset password for non-existent email?
   - What if refresh token is used multiple times (replay attack)?
   - What if user tries to assign a role they don't have permission for?

2. **Error scenarios**:
   - Invalid input (malformed email, weak password)
   - Race conditions (concurrent token refresh)
   - Database failures
   - Network timeouts

3. **Security considerations**:
   - Account enumeration attacks
   - Brute force attacks
   - Token theft scenarios

For each edge case, suggest:
- How to handle it
- Error message to show user
- Whether to log it for security
```

**Expected Output**: 15-20 edge cases with handling strategies

---

## 🔒 Phase 3: Non-Functional Requirements

### Prompt 3.1: Performance Requirements

```
Define non-functional performance requirements for a user authentication system that needs to support 100,000 concurrent users.

Include requirements for:
1. API response time (p95, p99, average)
   - Login operation
   - Token refresh
   - Permission check
   - Profile fetch
2. Database query performance
   - Target query times
   - Required indexes
3. Concurrent user support
   - Normal load
   - Peak load
   - Stress test threshold
4. Throughput
   - Logins per second
   - Token refreshes per second
   - Permission checks per second

Provide specific, measurable targets with justification.
```

**Expected Output**: Detailed performance requirements with metrics

---

### Prompt 3.2: Security Requirements (OWASP)

```
Create comprehensive security requirements for user authentication system based on OWASP Top 10.

Include:
1. Password security
   - Hashing algorithm and parameters
   - Password strength rules
   - Storage requirements
2. Token security
   - JWT configuration (algorithm, expiry)
   - Refresh token rotation
   - Token storage (server and client)
3. Rate limiting
   - Login attempts
   - Password reset requests
   - Token refresh
   - API requests
4. Account lockout policy
5. OWASP Top 10 protection measures
6. Data protection (GDPR)
7. Encryption (in transit, at rest)

For each requirement, specify:
- Exact configuration values (bcrypt cost factor, JWT expiry times)
- Implementation approach
- Testing criteria
```

**Expected Output**: 8-10 security NFRs with specific configurations

---

### Prompt 3.3: Availability & Reliability Requirements

```
Define availability and reliability requirements for a production authentication system.

Include:
1. Uptime target (99.9%, 99.99%?)
2. Planned vs unplanned downtime allowance
3. Fault tolerance
   - Database failure handling
   - Email service failure handling
   - Single points of failure
4. Recovery objectives
   - RTO (Recovery Time Objective)
   - RPO (Recovery Point Objective)
5. Error rate targets
   - Overall error rate
   - Critical errors (5xx)
   - Client errors (4xx)
6. Monitoring requirements
   - Health checks
   - Alerting thresholds

Provide justification for each target based on industry standards.
```

**Expected Output**: Availability and reliability NFRs with SLA definitions

---

## 📊 Phase 4: Requirements Analysis

### Prompt 4.1: Requirements Traceability Matrix

```
Create a requirements traceability matrix for these functional requirements [paste requirements].

For each requirement, list:
1. Requirement ID
2. Phase (1, 2, or 3)
3. Priority
4. Dependencies (other requirements)
5. Related user stories (reference format: US-001, US-002)
6. Test cases (reference format: TC-001, TC-002)
7. Implementation status (Not Started, In Progress, Completed)

Format as a markdown table for easy tracking.
```

**Expected Output**: Complete traceability matrix table

---

### Prompt 4.2: Requirements Gap Analysis

```
Review this project overview [paste] and functional requirements [paste].

Identify:
1. **Missing requirements**:
   - Features mentioned in overview but not in requirements
   - Common authentication features we might have forgotten
   - Security features that should be included
2. **Conflicting requirements**:
   - Requirements that contradict each other
   - Unrealistic combinations
3. **Incomplete requirements**:
   - Requirements missing acceptance criteria
   - Requirements without error cases
   - Requirements missing security considerations

For each gap, suggest:
- Whether it should be added
- Which phase it belongs to
- Priority level
```

**Expected Output**: Gap analysis report with recommendations

---

### Prompt 4.3: Requirements Validation

```
Validate these requirements [paste] against SMART criteria:
- Specific: Is it clear what needs to be built?
- Measurable: Can we test if it's done?
- Achievable: Can we build it with our tech stack?
- Relevant: Does it align with project objectives?
- Time-bound: Is it scoped for the right phase?

For each requirement, rate it (Pass/Fail/Needs Improvement) and provide feedback.
```

**Expected Output**: Requirements validation report

---

## 🔄 Phase 5: Requirements Refinement

### Prompt 5.1: Convert Requirements to User Stories

```
Convert these functional requirements [paste] into user stories format:

**As a** [user role]
**I want** [feature]
**So that** [business value]

**Acceptance Criteria**:
- [ ] Criterion 1
- [ ] Criterion 2

For each requirement, create:
1. Primary user story (happy path)
2. Alternative scenarios (error cases)
3. Edge cases

Group related requirements into epic-level stories.
```

**Expected Output**: User stories for all requirements

---

### Prompt 5.2: GraphQL Schema from Requirements

```
Based on these functional requirements [paste], generate a complete GraphQL schema.

Include:
1. Type definitions for:
   - User
   - Role
   - Permission
   - Session
2. Input types for all mutations
3. Mutations for all write operations
4. Queries for all read operations
5. Custom scalars (DateTime, etc.)
6. Enums (UserStatus, RoleName, etc.)

Follow naming conventions:
- Domain-centric naming (authUserRegister, not register)
- Consistent patterns (roleCreate, roleUpdate, roleDelete)
- Clear input/output types

Reference: /var/services/homes/jungsam/dev/dockers/_templates/docker/docker-ubuntu/_docs/api/01-graphql-design.md
```

**Expected Output**: Complete GraphQL schema file

---

## 💡 Best Practices for Requirements Phase

### Do's ✅

1. **Start with Why**
   ```
   Don't just say "we need login"
   Say "we need JWT-based login because it's stateless and scalable"
   ```

2. **Be Specific**
   ```
   ❌ "System should be fast"
   ✅ "API should respond in <200ms for p95"
   ```

3. **Reference Existing Docs**
   ```
   "Follow the GraphQL naming conventions from [file path]"
   "Use the requirement template from [file path]"
   ```

4. **Iterate**
   ```
   1. Ask Claude for initial requirements
   2. Review and refine
   3. Ask Claude to fill gaps
   4. Repeat
   ```

### Don'ts ❌

1. **Don't Accept Without Review**
   - Claude may generate generic requirements
   - Always customize for your specific needs

2. **Don't Skip Business Context**
   - Claude doesn't know your business
   - Provide context about your users, constraints

3. **Don't Forget Security**
   - Always explicitly ask about security requirements
   - Review OWASP Top 10 coverage

4. **Don't Mix Concerns**
   - Separate functional from non-functional
   - Don't mix requirements with implementation

---

## 📚 Example Complete Workflow

### Day 1: Project Overview

```bash
# Step 1: Generate initial overview
[Use Prompt 1.1]

# Step 2: Review and customize
[Add your business-specific context]

# Step 3: Identify risks
[Use Prompt 1.2]

# Step 4: Finalize
[Review with stakeholders]
```

### Day 2-3: Functional Requirements

```bash
# Step 1: Generate core auth requirements
[Use Prompt 2.1]

# Step 2: Generate RBAC requirements
[Use Prompt 2.2]

# Step 3: Identify edge cases
[Use Prompt 2.3]

# Step 4: Create traceability matrix
[Use Prompt 4.1]

# Step 5: Validate requirements
[Use Prompt 4.3]
```

### Day 4: Non-Functional Requirements

```bash
# Step 1: Define performance requirements
[Use Prompt 3.1]

# Step 2: Define security requirements
[Use Prompt 3.2]

# Step 3: Define availability requirements
[Use Prompt 3.3]

# Step 4: Review completeness
[Use Prompt 4.2 for gap analysis]
```

### Day 5: Refinement

```bash
# Step 1: Convert to user stories
[Use Prompt 5.1]

# Step 2: Generate GraphQL schema
[Use Prompt 5.2]

# Step 3: Final review
[Team review meeting]
```

---

## 🎯 Success Criteria

By the end of requirements phase, you should have:
- [ ] Complete project overview document
- [ ] 15-20 detailed functional requirements
- [ ] 10-15 non-functional requirements
- [ ] Requirements traceability matrix
- [ ] Initial GraphQL schema
- [ ] User stories for Sprint 1
- [ ] Identified risks and gaps
- [ ] Stakeholder approval

---

**Related Documents**:
- [Project Overview](./01-project-overview.md)
- [Functional Requirements](./02-functional-requirements.md)
- [Non-Functional Requirements](./03-non-functional-requirements.md)
- [Workflow Guide](./workflow-guide.md)
