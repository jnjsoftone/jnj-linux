# Data Models - Main Business Entities

## 📋 Core Data Structure

This document defines the main data models and their relationships for the project.

### Business Entity Hierarchy

```
Projects (Top Level)
└─ Works (Work Areas)
   └─ Tasks (Specific Tasks)
      └─ Activities (Detailed Activities)
         └─ Actions (Actual Executions)
```

## 🏗️ Core Tables

### 1. Projects (Top Level)
```sql
Projects
- project_id (PK)
- project_name
- business_type
- pm_user_id (FK)
- client_company
- total_contract_amount
- project_status
- planned_start_date
- planned_end_date
- actual_start_date
- actual_end_date
```

### 2. Works (Work Areas within Project)
```sql
Works
- work_id (PK)
- project_id (FK)
- work_type
- work_name
- work_order
- work_status
- parent_work_id (FK, nullable: work hierarchy)
```

### 3. Tasks (Specific Tasks within Work)
```sql
Tasks
- task_id (PK)
- work_id (FK)
- standard_task_id (FK: reference to standard tasks)
- task_name
- task_order
- task_status
- required_count
- current_count
```

### 4. Activities (Detailed Activities within Task)
```sql
Activities
- activity_id (PK)
- task_id (FK)
- standard_activity_id (FK: reference to standard activities)
- activity_name
- activity_type
- activity_status ('planned', 'in_progress', 'completed', 'suspended')
- planned_duration (minutes)
- required_resources
- required_skills
- quality_criteria
- safety_requirements
- deliverables
- priority_level (1-5)
- is_repeatable
- max_retry_count
```

### 5. Actions (Actual Execution Records)
```sql
Actions
- action_id (PK)
- activity_id (FK)
- user_id (FK: executor)
- supervisor_id (FK: supervisor, nullable)
- action_sequence
- role_type ('primary', 'assistant', 'reviewer', 'approver')
- action_status ('in_progress', 'completed', 'on_hold', 'failed', 'rework_needed')
- actual_start_time
- actual_end_time
- break_duration (minutes)
- location_gps_lat, location_gps_lng
- location_description
- weather_condition
- equipment_used
- quality_score (1-10)
- completion_rate (0-100%)
- notes
- photos_count
- created_at, updated_at
```

## 📊 Action Management

### Action Deliverables
```sql
Action_Deliverables
- deliverable_id (PK)
- action_id (FK)
- deliverable_type ('report', 'drawing', 'photo', 'inspection_result')
- file_name, file_path, file_size
- version
- created_by
- reviewed_by (nullable)
- approved_by (nullable)
- created_at
```

### Action Verifications
```sql
Action_Verifications
- verification_id (PK)
- action_id (FK)
- verifier_id (FK: verifier)
- verification_type ('self_review', 'peer_review', 'supervisor_approval', 'external_verification')
- verification_result ('pass', 'conditional_pass', 'rework_needed', 'rejected')
- verification_score
- feedback
- verification_date
```

### Action Dependencies
```sql
Action_Dependencies
- dependency_id (PK)
- predecessor_action_id (FK)
- successor_action_id (FK)
- dependency_type ('finish_to_start', 'start_to_start', 'parallel')
- lag_minutes
- is_mandatory
```

## ⚙️ Process Hierarchy

### 1. Project Phases
```sql
Project_Phases
- phase_id (PK)
- project_id (FK)
- phase_name ('planning', 'execution', 'completion')
- phase_order
- phase_status ('scheduled', 'in_progress', 'completed', 'on_hold')
- planned_start_date, planned_end_date
- actual_start_date, actual_end_date
```

### 2. Work Stages
```sql
Work_Stages
- stage_id (PK)
- phase_id (FK)
- work_id (FK)
- stage_name
- stage_order
- stage_status
- completion_rate (%)
```

### 3. Task States
```sql
Task_States
- state_id (PK)
- task_id (FK)
- current_state ('waiting', 'in_progress', 'review', 'approval', 'completed')
- state_changed_date
- changed_by (FK: Users)
- notes
```

### 4. Activity Steps
```sql
Activity_Steps
- step_id (PK)
- activity_id (FK)
- step_name
- step_order
- step_status ('not_started', 'in_progress', 'completed')
- completion_timestamp
```

### 5. Action Progress Log
```sql
Action_Progress_Log
- log_id (PK)
- action_id (FK)
- progress_timestamp
- progress_type ('start', 'checkpoint', 'completion', 'verification')
- progress_rate (%)
- milestone_achieved
- issues_encountered
- recorded_by
```

## 🌟 Standard Templates

### Standard Business Processes
```sql
Standard_Business_Processes
- process_id (PK)
- business_type
- process_name
- process_description
- is_active
```

### Standard Works
```sql
Standard_Works
- standard_work_id (PK)
- process_id (FK)
- work_name
- work_category
- work_order
- estimated_duration
- required_skills
```

### Standard Tasks
```sql
Standard_Tasks
- standard_task_id (PK)
- standard_work_id (FK)
- task_name
- task_type
- standard_duration
- required_resources
- deliverables
```

### Standard Activities
```sql
Standard_Activities
- standard_activity_id (PK)
- standard_task_id (FK)
- activity_name
- activity_description
- required_tools
- safety_requirements
```

## 🔄 Implementation Strategy

### Phase 1: Core Hierarchy
```sql
Projects → Works → Tasks (3 levels)
+ Task_States (state management)
+ Standard_Works, Standard_Tasks (standardization)
```

### Phase 2: Detail Expansion
```sql
+ Activities, Activity_Steps (detailed activities)
+ Project_Phases, Work_Stages (process management)
```

### Phase 3: Advanced Features
```sql
+ Complex dependency management
+ Automated workflows
+ AI-based schedule optimization
```

## 🎯 Usage Example

### Work Mapping Example:
```
Project: "Sample Project"
└─ Work: "Foundation Work"
   └─ Task: "Excavation Inspection" (required_count: 3)
      └─ Activity: "Site Survey" (planned_duration: 120min)
         └─ Action #1: John Doe (primary) 2024-01-15 09:00-11:30
         └─ Action #2: Jane Smith (assistant) 2024-01-15 09:00-11:30
      └─ Activity: "Report Writing" (planned_duration: 180min)
         └─ Action #1: John Doe (writer) 2024-01-15 14:00-17:00
         └─ Action #2: Team Lead (reviewer) 2024-01-16 10:00-10:30
```

## 💡 Benefits

```
1. 🔄 Versatility: Applicable to all business types
2. 📈 Scalability: Easy to add new business types
3. 🎯 Standardization: Standardize and reuse work processes
4. 📊 Analytics: Progress and performance analysis by hierarchy
5. 🔍 Traceability: Track down to detailed steps
```

## 💡 Additional Considerations

### 1. Real-time Tracking
```
- Real-time Action updates via mobile app
- Auto GPS recording, automatic time tracking
- Automatic photo upload and classification
```

### 2. Performance Analysis
```
- Individual/team Action statistics
- Standard time vs actual time analysis by Activity
- Quality score trend analysis
```

### 3. Automation Possibilities
```
- Auto notification for next Action upon completion
- Auto rework flag when quality criteria not met
- Auto escalation when delays occur
```
