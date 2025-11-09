# Claude Code Prompts - Design Phase

Effective prompts for using Claude Code during the design phase (Week 1-2).

---

## 🎨 Design System Creation

### Prompt: Generate Design System Tokens

```
Create a comprehensive design system for a user authentication UI using shadcn/ui and Tailwind CSS.

Include:
1. **Color palette**:
   - Primary colors (blue scale, 50-900)
   - Neutral/gray scale
   - Semantic colors (success, error, warning, info)
   - Dark mode variants

2. **Typography scale**:
   - Font families (sans, mono)
   - Font sizes (xs to 4xl) with line heights
   - Font weights (300-700)
   - Usage guidelines (headings, body, captions)

3. **Spacing system**: 0-20 scale (4px increments)

4. **Component tokens**:
   - Button sizes and padding
   - Input heights and padding
   - Border radius values
   - Shadow elevation levels

5. **Tailwind config**: Complete tailwind.config.ts file

Ensure WCAG 2.1 Level AA contrast compliance.
Reference: /var/services/homes/jungsam/dev/dockers/_templates/docker/ubuntu-project/_docs/02-design/01-design-system
```

---

## 🧩 Component Structure

### Prompt: Define Atomic Component Hierarchy

```
Define a component structure for authentication UI using Atomic Design methodology.

Tech stack:
- Next.js 15 (App Router)
- shadcn/ui components
- TypeScript
- Tailwind CSS

Create component hierarchy for:

**Atoms** (shadcn/ui primitives):
- Button (variants: default, destructive, outline, ghost)
- Input (with focus states, error states)
- Label, Card, Alert, Badge

**Molecules** (form components):
- FormField (label + input + error message)
- PasswordInput (with visibility toggle)
- EmailInput (with validation indicator)

**Organisms** (complete forms):
- LoginForm (email, password, remember me, forgot password link)
- SignupForm (email, password, confirm password, terms checkbox)
- ResetPasswordForm (email input)

**Templates** (layouts):
- AuthLayout (split screen: branding left, form right)

**Pages** (routes):
- /login, /signup, /reset-password, /verify-email

For each component, provide:
- File structure
- TypeScript interface
- Props pattern
- Accessibility requirements (ARIA labels, keyboard nav)

Reference: /var/services/homes/jungsam/dev/dockers/_templates/docker/ubuntu-project/_docs/02-design/02-ui-components
```

---

## 🖼️ UI Component Implementation

### Prompt: Generate shadcn/ui LoginForm Component

```
Generate a production-ready LoginForm component using:
- shadcn/ui components (Button, Input, Card, Label)
- react-hook-form for form management
- Zod for validation
- TypeScript

Requirements:
1. **Fields**:
   - Email (validated)
   - Password (with show/hide toggle)
   - "Remember me" checkbox
   - "Forgot password?" link

2. **Validation**:
   - Email: valid email format
   - Password: required (min 1 char for login)
   - Show inline error messages

3. **States**:
   - Loading state (show spinner on button)
   - Error state (display API errors)
   - Success state (redirect)

4. **Accessibility**:
   - Proper ARIA labels
   - Error announcements
   - Keyboard navigation
   - Focus management

5. **Styling**:
   - Use design tokens from colors-typography.md
   - Dark mode support
   - Responsive (mobile-first)

Return complete component code with imports.
```

**Expected Output**: Full React component with form validation

---

### Prompt: Generate SignupForm with Password Strength

```
Create a SignupForm component based on the LoginForm structure.

Additional requirements:
1. **Extra fields**:
   - First name, Last name
   - Confirm password (must match password)

2. **Password strength indicator**:
   - Visual indicator (weak/medium/strong)
   - Requirements checklist:
     - [x] At least 8 characters
     - [x] Uppercase letter
     - [x] Lowercase letter
     - [x] Number
     - [x] Special character

3. **Terms acceptance**:
   - Checkbox for "I agree to Terms & Privacy Policy"
   - Links to /terms and /privacy

4. **Zod schema**:
   - All validation rules
   - Password confirmation match
   - Terms must be accepted

Include real-time password strength calculation function.
```

---

## 🎭 User Flows & Wireframes

### Prompt: Design Authentication User Flows

```
Create detailed user flow documentation for authentication system.

Document these flows:

1. **Registration Flow**:
   - User visits /signup
   - Fills form (email, password, name)
   - Submits → account created (inactive)
   - Redirected to "Check your email" page
   - Receives verification email
   - Clicks link → account activated
   - Redirected to /login
   - Success message shown

2. **Login Flow**:
   - User visits /login
   - Enters credentials
   - If unverified → show error + resend verification button
   - If verified → receives tokens → redirect to /dashboard

3. **Password Reset Flow**:
   - User clicks "Forgot password?"
   - Enters email → receives reset email
   - Clicks reset link → redirected to /reset-password?token=xxx
   - Enters new password → password updated
   - Redirected to /login with success message

4. **Error Scenarios**:
   - Invalid credentials
   - Expired token
   - Email service down
   - Network error

For each flow, provide:
- Step-by-step user actions
- System responses
- UI states (loading, success, error)
- Error messages
- Redirect logic

Format as Mermaid diagram + detailed description.
```

---

### Prompt: Create Wireframes (Text-based)

```
Create ASCII/text-based wireframes for authentication pages.

Pages to wireframe:
1. Login page
2. Signup page
3. Password reset request page
4. Email verification success page

For each page, show:
- Layout structure (header, content, footer)
- Component placement
- Copy/text content
- CTA buttons
- Links
- Spacing (relative sizing)

Example format:
```
+--------------------------------------------------+
|                     LOGO                         |
+--------------------------------------------------+
|                                                  |
|  +--------------------------------------------+  |
|  |           Sign In to Continue              |  |
|  +--------------------------------------------+  |
|  |                                            |  |
|  | Email                                      |  |
|  | [____________________________________]     |  |
|  |                                            |  |
|  | Password                                   |  |
|  | [____________________________________] 👁  |  |
|  |                                            |  |
|  | [ ] Remember me    Forgot password?       |  |
|  |                                            |  |
|  | [        Sign In Button (Primary)    ]     |  |
|  |                                            |  |
|  | Don't have an account? Sign up             |  |
|  +--------------------------------------------+  |
|                                                  |
+--------------------------------------------------+
```

Use similar format for all pages.
```

---

## 🌓 Dark Mode Implementation

### Prompt: Add Dark Mode Support

```
Add comprehensive dark mode support to our authentication UI.

Using next-themes, configure:

1. **Theme provider setup**:
   - Create providers.tsx
   - Wrap app with ThemeProvider
   - Set defaultTheme="system", enableSystem

2. **Dark mode classes**:
   - Update all components with dark: variants
   - Background: bg-white dark:bg-neutral-900
   - Text: text-neutral-900 dark:text-neutral-50
   - Borders: border-neutral-200 dark:border-neutral-800
   - Cards: bg-white dark:bg-neutral-800

3. **Theme toggle component**:
   - Button to switch light/dark/system
   - Icon changes based on theme
   - Persist preference

4. **CSS variables** (globals.css):
   - Define --background, --foreground for each theme
   - Use in components via hsl(var(--background))

Show code for:
- providers.tsx
- theme-toggle.tsx
- Updated globals.css
- Example component with dark mode
```

---

## ♿ Accessibility Audit

### Prompt: Audit Component Accessibility

```
Audit this LoginForm component [paste component code] for accessibility issues.

Check for:

1. **Semantic HTML**: Using correct elements?
2. **ARIA labels**: All interactive elements labeled?
3. **Keyboard navigation**: Tab order correct? Focus management?
4. **Focus indicators**: Visible focus states?
5. **Error announcements**: ARIA live regions for errors?
6. **Color contrast**: WCAG AA compliance?
7. **Screen reader**: Can it be used without vision?

For each issue found:
- Describe the problem
- Severity (Critical/High/Medium/Low)
- How to fix with code example
- WCAG guideline reference

Provide a compliance checklist:
- [ ] Semantic HTML
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] Error announcements
- [ ] Color contrast (4.5:1 minimum)
- [ ] Screen reader tested
```

---

## 📱 Responsive Design

### Prompt: Make Components Responsive

```
Make the authentication UI fully responsive.

Breakpoints:
- Mobile: 0-640px (sm)
- Tablet: 641-1024px (md)
- Desktop: 1025px+ (lg)

Requirements for each breakpoint:

**Mobile** (< 640px):
- Single column layout
- Hide branding panel
- Full-width cards
- Stack form fields vertically
- Touch-friendly button sizes (min 44x44px)

**Tablet** (641-1024px):
- Consider showing branding panel
- Card max-width: 500px, centered
- Comfortable spacing

**Desktop** (1025px+):
- Split screen (50/50)
- Branding left, form right
- Form max-width: 450px

Update these components:
1. AuthLayout
2. LoginForm
3. SignupForm

Show Tailwind responsive classes:
- sm:, md:, lg: prefixes
- Mobile-first approach
```

---

## 🎯 Component Reusability

### Prompt: Create Reusable Form Components

```
Extract reusable patterns from LoginForm and SignupForm into shared components.

Create these components:

1. **FormField** (label + input + error):
```tsx
interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}
```

2. **PasswordInput** (input with toggle):
```tsx
interface PasswordInputProps extends InputProps {
  showStrength?: boolean  // Show password strength for signup
}
```

3. **SubmitButton** (button with loading state):
```tsx
interface SubmitButtonProps extends ButtonProps {
  isLoading: boolean
  loadingText?: string
}
```

4. **FormError** (API error display):
```tsx
interface FormErrorProps {
  error?: string | null
}
```

For each component:
- Full TypeScript code
- Usage example
- Props documentation
```

---

## 📋 Design Handoff Checklist

### Prompt: Create Design-to-Dev Handoff Document

```
Create a comprehensive handoff document for designers to give developers.

Include:

1. **Design System**:
   - Link to Figma file
   - Color tokens (with hex codes)
   - Typography scale
   - Spacing values
   - Component variants

2. **Component Specifications**:
   - For each component: states, variants, sizes
   - Spacing (padding, margin, gaps)
   - Interactions (hover, active, focus, disabled)
   - Animations (if any)

3. **User Flows**:
   - Flow diagrams
   - State transitions
   - Error states
   - Loading states

4. **Assets**:
   - Icons (with names)
   - Illustrations (if any)
   - Logos (SVG exports)

5. **Accessibility**:
   - Color contrast ratios
   - Focus indicator specs
   - ARIA requirements

6. **Responsive Behavior**:
   - Breakpoint values
   - Layout changes per breakpoint
   - Image sizing

Format as a structured markdown document with checklists.

Reference: /var/services/homes/jungsam/dev/dockers/_templates/docker/ubuntu-project/_docs/10-collaboration/02-design-handoff.md
```

---

## 💡 Best Practices

### Do's ✅

1. **Reference Design System**: "Use colors from colors-typography.md"
2. **Be Specific About Framework**: "shadcn/ui Button component, not custom"
3. **Include Accessibility**: Always ask for ARIA labels, keyboard support
4. **Request TypeScript**: "Provide full TypeScript interfaces"
5. **Ask for Examples**: "Show usage example with the component"

### Don'ts ❌

1. **Don't Skip Dark Mode**: Always include dark: variants
2. **Don't Forget Mobile**: Always ask for responsive design
3. **Don't Ignore Errors**: Always ask for error states
4. **Don't Overlook Loading**: Always include loading states

---

## 📚 Related Documents

- [Design System](./01-design-system/colors-typography.md)
- [Component Structure](./02-ui-components/element-component-structure.md)
- [Workflow Guide](./workflow-guide.md)
- [Requirements](../01-requirements/02-functional-requirements.md)
