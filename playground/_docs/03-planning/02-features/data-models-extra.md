# Data Models - Supporting Entities

## 💰 Financial Management

### Billing Records
```sql
Billing_Records
- billing_id (PK)
- project_id (FK)
- item_id (FK, nullable: interim vs final billing)
- billing_type ('interim', 'final', 'progress')
- billing_amount
- billing_date
- due_date
- payment_date
- payment_status ('not_billed', 'billed', 'paid')
- invoice_number
- notes
```

## 📄 Document Management

### Documents
```sql
Documents
- document_id (PK)
- item_id (FK)
- document_type ('site_survey_report', 'interim_report', 'final_report', 'site_photo')
- document_name
- file_path
- version
- upload_date
- uploaded_by
- approval_status ('draft', 'under_review', 'approved')
- file_size, file_type
```

## 👥 User & Permission Management

### Users
```sql
Users
- user_id (PK)
- username, email, password_hash
- full_name
- department ('structure', 'administration', 'supervision')
- position
- phone, mobile
- is_active
```

### User Roles
```sql
User_Roles
- role_id (PK)
- user_id (FK)
- project_id (FK, nullable: company-wide vs project-specific)
- role_type ('pm', 'primary_staff', 'assistant_staff', 'admin', 'manager')
- granted_date, revoked_date
```

## 🤝 External Partner Management

### External Partners
```sql
External_Partners
- partner_id (PK)
- company_name
- business_type ('contractor', 'supervisor', 'client')
- contact_person
- phone, email, address
- is_active
```

### Project Partners
```sql
Project_Partners
- project_id (FK)
- partner_id (FK)
- partner_role ('client', 'contractor', 'supervisor')
- contract_start_date, contract_end_date
```

## 🦺 Site Safety Management

### Safety Records
```sql
Safety_Records
- safety_id (PK)
- item_id (FK)
- safety_check_date
- safety_status ('good', 'caution', 'danger')
- safety_issues
- corrective_actions
```

## ✅ Approval Workflow

### Approval Workflows
```sql
Approval_Workflows
- workflow_id (PK)
- document_id (FK)
- approver_user_id (FK)
- approval_step
- approval_status ('pending', 'approved', 'rejected')
- approval_date, comments
```

## 📊 Reporting & Analytics

### Project Reports
```sql
Project_Reports
- report_id (PK)
- project_id (FK)
- report_type ('weekly', 'monthly', 'milestone', 'final')
- report_period_start, report_period_end
- generated_date
- generated_by
- file_path
```

## 🔔 Notification System

### Notifications
```sql
Notifications
- notification_id (PK)
- user_id (FK)
- notification_type ('task_assigned', 'deadline_approaching', 'approval_needed')
- title, message
- related_entity_type ('project', 'task', 'document')
- related_entity_id
- is_read
- created_at
```

## 📅 Calendar & Events

### Events
```sql
Events
- event_id (PK)
- project_id (FK, nullable)
- event_type ('meeting', 'site_visit', 'deadline', 'milestone')
- event_title, event_description
- start_datetime, end_datetime
- location
- participants (JSON array of user_ids)
- created_by
```

## 💬 Comments & Communication

### Comments
```sql
Comments
- comment_id (PK)
- entity_type ('project', 'task', 'document', 'action')
- entity_id
- user_id (FK: commenter)
- comment_text
- parent_comment_id (FK, nullable: for threaded comments)
- created_at, updated_at
```

## 🔖 Tags & Categories

### Tags
```sql
Tags
- tag_id (PK)
- tag_name
- tag_category ('priority', 'status', 'custom')
- color_code
```

### Entity Tags
```sql
Entity_Tags
- entity_type ('project', 'task', 'document')
- entity_id
- tag_id (FK)
- tagged_by
- tagged_at
```

## 📸 Attachments

### Attachments
```sql
Attachments
- attachment_id (PK)
- entity_type ('action', 'task', 'comment', 'document')
- entity_id
- file_name, file_path, file_type, file_size
- thumbnail_path (for images)
- uploaded_by
- upload_date
- description
```

## 🔐 Audit Log

### Audit Logs
```sql
Audit_Logs
- log_id (PK)
- user_id (FK)
- action_type ('create', 'update', 'delete', 'view', 'approve')
- entity_type ('project', 'task', 'document', 'user')
- entity_id
- old_value (JSON)
- new_value (JSON)
- ip_address
- user_agent
- created_at
```

## ⚙️ System Settings

### System Settings
```sql
System_Settings
- setting_id (PK)
- setting_key ('default_currency', 'date_format', 'timezone')
- setting_value
- setting_type ('string', 'number', 'boolean', 'json')
- description
- updated_by
- updated_at
```

### User Preferences
```sql
User_Preferences
- user_id (FK)
- preference_key ('theme', 'language', 'notification_settings')
- preference_value (JSON)
- updated_at
```

## 📧 Email Templates

### Email Templates
```sql
Email_Templates
- template_id (PK)
- template_name ('task_assigned', 'deadline_reminder', 'approval_request')
- subject_template
- body_template (HTML)
- variables (JSON: list of available variables)
- is_active
```

## 🔄 Integration Logs

### Integration Logs
```sql
Integration_Logs
- log_id (PK)
- integration_type ('api', 'webhook', 'sync')
- endpoint
- request_method ('GET', 'POST', 'PUT', 'DELETE')
- request_payload (JSON)
- response_status
- response_payload (JSON)
- execution_time_ms
- created_at
```

## 🎯 Implementation Notes

### Priority Order for Implementation:
1. **Phase 1**: Users, Projects, Documents, Billing
2. **Phase 2**: External Partners, Safety Records, Approval Workflows
3. **Phase 3**: Notifications, Comments, Tags, Attachments
4. **Phase 4**: Audit Logs, System Settings, Email Templates

### Integration Considerations:
- Document storage: Consider integration with cloud storage (AWS S3, Azure Blob)
- Email service: SMTP or third-party services (SendGrid, AWS SES)
- Authentication: OAuth 2.0, JWT tokens
- File uploads: Multipart form data handling
- Backup strategy: Regular automated backups of critical data
