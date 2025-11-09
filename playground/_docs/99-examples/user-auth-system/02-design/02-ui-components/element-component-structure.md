# UI Component Structure - Atomic Design

**Document Status**: ✅ Approved
**Created**: 2024-10-19 (Week 1, Day 2)
**Last Updated**: 2024-10-19
**Owner**: Design Lead / Frontend Lead

---

## Overview

This document defines the **component hierarchy** for the authentication UI following **Atomic Design methodology**, optimized for Next.js 15 + shadcn/ui.

---

## 🧪 Atomic Design Hierarchy

```
src/components/
├── ui/                    # Atoms (shadcn/ui components)
│   ├── button.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── card.tsx
│   └── ...
├── forms/                 # Molecules (form fields)
│   ├── form-field.tsx
│   ├── password-input.tsx
│   ├── email-input.tsx
│   └── ...
├── auth/                  # Organisms (complete forms)
│   ├── login-form.tsx
│   ├── signup-form.tsx
│   ├── reset-password-form.tsx
│   └── ...
├── layouts/               # Templates (page layouts)
│   ├── auth-layout.tsx
│   ├── dashboard-layout.tsx
│   └── ...
└── ...
```

**Pages** (in `app/` directory):
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(auth)/reset-password/page.tsx`

---

## 🔹 Level 1: Atoms (UI Primitives)

### Definition
**Atoms** are the smallest, indivisible UI components. Built using shadcn/ui.

### Components

#### Button
```tsx
// src/components/ui/button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700',
        destructive: 'bg-error-600 text-white hover:bg-error-700',
        outline: 'border border-neutral-300 bg-white hover:bg-neutral-50',
        ghost: 'hover:bg-neutral-100',
        link: 'text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3 text-sm',
        lg: 'h-12 px-6',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

export { Button, buttonVariants }
```

#### Input
```tsx
// src/components/ui/input.tsx
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2',
          'text-sm placeholder:text-neutral-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-neutral-700 dark:bg-neutral-900',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

#### Label, Card, Alert, Badge
Similar shadcn/ui components...

---

## 🔹 Level 2: Molecules (Composite Components)

### Definition
**Molecules** are simple combinations of atoms that function together as a unit.

### Components

#### FormField
```tsx
// src/components/forms/form-field.tsx
interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-error-500">{error}</p>
      )}
    </div>
  )
}
```

#### PasswordInput (with toggle visibility)
```tsx
// src/components/forms/password-input.tsx
export function PasswordInput({ ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  )
}
```

#### EmailInput (with validation indicator)
```tsx
// src/components/forms/email-input.tsx
export function EmailInput({ value, error, ...props }: EmailInputProps) {
  const isValid = value && !error && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  return (
    <div className="relative">
      <Input type="email" value={value} {...props} />
      {isValid && (
        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-success-500" size={20} />
      )}
    </div>
  )
}
```

---

## 🔹 Level 3: Organisms (Complex Components)

### Definition
**Organisms** are complex UI components composed of atoms and molecules.

### Components

#### LoginForm
```tsx
// src/components/auth/login-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    // GraphQL mutation: authUserLogin
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Email"
            error={form.formState.errors.email?.message}
            required
          >
            <EmailInput {...form.register('email')} />
          </FormField>

          <FormField
            label="Password"
            error={form.formState.errors.password?.message}
            required
          >
            <PasswordInput {...form.register('password')} />
          </FormField>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span className="text-sm">Remember me</span>
            </label>
            <Link href="/reset-password" className="text-sm text-primary-600">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-neutral-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary-600 font-medium">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
```

#### SignupForm, ResetPasswordForm
Similar structure with different fields and validation...

---

## 🔹 Level 4: Templates (Layouts)

### Definition
**Templates** are page-level structures that define content placement.

### Components

#### AuthLayout
```tsx
// src/components/layouts/auth-layout.tsx
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
          <p className="text-primary-100 text-lg">
            Secure authentication for your application
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
```

---

## 🔹 Level 5: Pages (Routes)

### Definition
**Pages** are complete routes that compose templates with organisms.

### Pages

#### Login Page
```tsx
// app/(auth)/login/page.tsx
import { AuthLayout } from '@/components/layouts/auth-layout'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
```

#### Signup Page
```tsx
// app/(auth)/signup/page.tsx
import { AuthLayout } from '@/components/layouts/auth-layout'
import { SignupForm } from '@/components/auth/signup-form'

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  )
}
```

---

## 📁 Complete File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx          # Auth route group layout
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   ├── signup/
│   │   │   └── page.tsx        # Signup page
│   │   ├── reset-password/
│   │   │   └── page.tsx        # Reset password page
│   │   └── verify-email/
│   │       └── page.tsx        # Email verification page
│   └── (dashboard)/
│       └── ...
├── components/
│   ├── ui/                     # Atoms (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── card.tsx
│   │   ├── alert.tsx
│   │   └── badge.tsx
│   ├── forms/                  # Molecules
│   │   ├── form-field.tsx
│   │   ├── password-input.tsx
│   │   ├── email-input.tsx
│   │   └── form-error.tsx
│   ├── auth/                   # Organisms
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   ├── reset-password-form.tsx
│   │   ├── verify-email-banner.tsx
│   │   └── auth-provider.tsx
│   └── layouts/                # Templates
│       ├── auth-layout.tsx
│       └── dashboard-layout.tsx
└── lib/
    ├── validations/
    │   └── auth.ts             # Zod schemas
    └── hooks/
        └── use-auth.ts         # Auth context hook
```

---

## 🎯 Component Guidelines

### Naming Conventions

```
Atoms:     button.tsx, input.tsx (lowercase)
Molecules: form-field.tsx, password-input.tsx (kebab-case)
Organisms: login-form.tsx, signup-form.tsx (kebab-case)
Layouts:   auth-layout.tsx (kebab-case)
Pages:     page.tsx (Next.js convention)
```

### Component Exports

```tsx
// Named export for organisms/molecules
export function LoginForm() { ... }

// Named + default for shadcn components
export { Button, buttonVariants }
export default Button
```

### Props Pattern

```tsx
// Extend HTML element props
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

// Or custom props only
interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}
```

---

## ♿ Accessibility Requirements

### Every Component Must Have

- [ ] Semantic HTML elements
- [ ] Proper ARIA labels where needed
- [ ] Keyboard navigation support
- [ ] Focus indicators
- [ ] Screen reader friendly
- [ ] Error announcements (ARIA live regions)

### Example

```tsx
<FormField label="Email" error={error} required>
  <Input
    type="email"
    aria-label="Email address"
    aria-invalid={!!error}
    aria-describedby={error ? 'email-error' : undefined}
  />
  {error && (
    <span id="email-error" role="alert" className="text-error-500">
      {error}
    </span>
  )}
</FormField>
```

---

## 📚 Related Documents

- [Design System](../01-design-system/colors-typography.md)
- [Component Library](./component-library.md)
- [Frontend Implementation](../../06-development/frontend/03-implementation.md)

---

**Component Structure**: ✅ Approved for development
**Framework**: Next.js 15 + shadcn/ui
**Methodology**: Atomic Design
