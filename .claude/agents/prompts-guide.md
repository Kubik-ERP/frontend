# 💬 Prompt Engineering Guide

## Overview
This guide helps you interact effectively with Claude AI agents for maximum productivity. Learn how to craft prompts that get the best results.

## Core Principles

### 1. **Be Specific**
```
❌ Bad: "Fix the button"
✅ Good: "Fix the 'Submit' button in SelfOrderCheckout.vue - it should disable when form is invalid"

❌ Bad: "Add validation"
✅ Good: "Add email validation to the registration form using Vuelidate with required and email validators"
```

### 2. **Provide Context**
```
❌ Bad: "This doesn't work"
✅ Good: "The login function in auth.service.ts returns 401 error when I submit valid credentials. The API endpoint is /api/auth/login"

❌ Bad: "Create a component"
✅ Good: "Create a modal component for user registration in the self-order module, similar to the existing SelfOrderSummaryModalOrderSummary.vue"
```

### 3. **Break Down Complex Tasks**
```
❌ Bad: "Build an entire dashboard with charts, filters, and export"
✅ Good: "Let's build a dashboard in steps:
1. First, create the layout structure
2. Then add the data table
3. Then implement filters
4. Finally add chart visualization"
```

### 4. **Show, Don't Just Tell**
```
❌ Bad: "Style it nicely"
✅ Good: "Style the card with:
- White background
- Rounded corners (rounded-lg)
- Shadow (shadow-md)
- Padding (p-6)
- Border (border border-gray-200)"
```

## Prompt Templates

### Template 1: Create New Component
```
Create a [component type] component in [module name] that:

Purpose:
- [What it does]

Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Design:
- [Layout description]
- [Styling requirements]

Props:
- [prop name]: [type] - [description]

Events:
- [event name]: [when emitted] - [payload]

Example:
Create a modal component in the self-order module that:

Purpose:
- Shows order summary before checkout

Requirements:
- Display list of items with quantities
- Show total price
- Include 'Confirm' and 'Cancel' buttons
- Close on backdrop click

Design:
- Use PrimeVue Dialog
- White background with rounded corners
- Items in scrollable list
- Total at bottom with prominent styling

Props:
- items: OrderItem[] - List of order items
- visible: boolean - Control dialog visibility

Events:
- confirm: Emits when user confirms order
- cancel: Emits when user cancels
```

### Template 2: Fix Bug/Error
```
I'm getting [error type] in [file/component]:

Error Message:
```
[Paste exact error message]
```

Location:
- File: [file path]
- Line: [line number]

What I Expected:
[Expected behavior]

What Happened:
[Actual behavior]

What I Tried:
- [Attempt 1]
- [Attempt 2]

Relevant Code:
```typescript
[Paste relevant code section]
```

Example:
I'm getting a TypeScript error in SelfOrderSummary.vue:

Error Message:
```
Property 'email' does not exist on type 'FormData'
```

Location:
- File: src/modules/self-order/components/SelfOrderSummary.vue
- Line: 45

What I Expected:
The email property should be accessible on the form data object

What Happened:
TypeScript shows error that email doesn't exist

What I Tried:
- Added email to the reactive object
- Checked the interface definition

Relevant Code:
```typescript
const formData = reactive({
  name: '',
  phone: '',
});
formData.email = 'test@email.com'; // Error here
```
```

### Template 3: Refactor Code
```
I want to refactor [component/service/file] to:

Current Issues:
- [Issue 1]
- [Issue 2]

Desired Outcome:
- [Goal 1]
- [Goal 2]

Current Code:
```typescript
[Paste current code]
```

Constraints:
- [Constraint 1]
- [Constraint 2]

Example:
I want to refactor self-order.service.ts to:

Current Issues:
- Business logic mixed in components
- Hard to test
- Duplicate code in multiple places

Desired Outcome:
- All business logic in service layer
- Testable methods
- Single source of truth

Current Code:
[Paste current implementation]

Constraints:
- Must maintain existing API contracts
- Can't break existing components
- Follow DDD pattern
```

### Template 4: Implement Feature
```
Implement [feature name] in [module]:

User Story:
As a [user type], I want to [action], so that [benefit]

Acceptance Criteria:
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

Technical Requirements:
- [Requirement 1]
- [Requirement 2]

Design Reference:
[Screenshot, wireframe, or description]

Similar Features:
[Reference to existing similar features]

Example:
Implement customer registration in self-order module:

User Story:
As a guest user, I want to register an account during checkout, so that I can save my order history

Acceptance Criteria:
- [ ] Modal appears when guest clicks "Create Account"
- [ ] Form validates email, name, and phone
- [ ] Success message shown on successful registration
- [ ] Modal closes and user is logged in
- [ ] Error messages displayed for validation failures

Technical Requirements:
- Use Vuelidate for validation
- Call POST /api/customers endpoint
- Store auth token on success
- Update Pinia auth store

Design Reference:
Similar to existing login modal, but with additional name and phone fields

Similar Features:
See authentication/components/LoginModal.vue
```

### Template 5: Code Review
```
Please review this [component/service/file]:

```typescript
[Paste code]
```

Review for:
- [ ] Code quality
- [ ] Best practices
- [ ] Performance
- [ ] TypeScript usage
- [ ] Naming conventions
- [ ] Error handling

Specific concerns:
- [Concern 1]
- [Concern 2]

Example:
Please review this service method:

```typescript
const fetchOrders = async () => {
  const response = await axios.get('/api/orders');
  orders.value = response.data;
}
```

Review for:
- [x] Code quality
- [x] Best practices
- [x] Error handling
- [x] TypeScript usage

Specific concerns:
- Should we add try-catch?
- Is the type safety adequate?
```

## Agent-Specific Prompts

### For @frontend
```
"Create a responsive [component] with [features]"
"Style [component] using TailwindCSS with [design specs]"
"Add form validation to [component] for [fields]"
"Implement [interaction] in [component]"
"Make [component] responsive for mobile/tablet/desktop"
```

### For @architect
```
"Design the structure for [module]"
"Refactor [file] to follow DDD pattern"
"Review the architecture of [feature]"
"How should I organize [code/logic]?"
"Improve the service layer for [module]"
```

### For @debugger
```
"Fix this TypeScript error: [error]"
"Debug why [component] is not [expected behavior]"
"Resolve ESLint violations in [file]"
"Find why [feature] is slow"
"This error appears: [error message]"
```

### For @docs
```
"Document the [module] with README"
"Add JSDoc comments to [service]"
"Create API documentation for [endpoints]"
"Write a guide for [feature]"
"Update changelog with [changes]"
```

## Advanced Techniques

### Technique 1: Incremental Refinement
```
1st prompt: "Create a simple button component"
2nd prompt: "Add loading state to the button"
3rd prompt: "Add disabled state with visual feedback"
4th prompt: "Make it accessible with ARIA labels"
```

### Technique 2: Comparative Prompting
```
"Create a modal similar to LoginModal.vue, but for registration"
"Style this component like SelfOrderSummary.vue"
"Implement validation like in the account module"
```

### Technique 3: Constraint-Based Prompting
```
"Create a [component] that:
- Must use PrimeVue components only
- Should be under 200 lines
- Needs to work on mobile
- Cannot use external libraries"
```

### Technique 4: Example-Driven Prompting
```
"Create a form validator like this example:

```typescript
const validate = (value: string) => {
  if (!value) return 'Required';
  if (value.length < 3) return 'Too short';
  return true;
}
```

But for email validation with additional checks"
```

## Common Mistakes

### Mistake 1: Vague Requests
```
❌ "Make it better"
❌ "Fix the issues"
❌ "Improve performance"

✅ "Improve the loading performance by implementing lazy loading for the product images"
✅ "Fix the TypeScript errors in auth.service.ts"
✅ "Make the modal more user-friendly by adding a close button and backdrop click handler"
```

### Mistake 2: No Context
```
❌ "This doesn't work"
❌ "Error on line 50"
❌ "The button is broken"

✅ "The submit button in RegisterForm.vue (line 50) doesn't disable when the form is invalid, but it should according to the requirement"
```

### Mistake 3: Too Broad
```
❌ "Build a complete e-commerce system"
❌ "Create all the pages"
❌ "Fix everything"

✅ "Build the product listing page with search and filters"
✅ "Create the checkout flow: cart → customer info → payment"
✅ "Fix the TypeScript errors in the authentication module"
```

### Mistake 4: Missing Requirements
```
❌ "Create a form"
✅ "Create a user registration form with:
- Fields: name, email, password, confirm password
- Validation: all required, email format, password min 8 chars, passwords match
- Submit: POST to /api/register
- Success: redirect to dashboard
- Error: show error message"
```

## Response Optimization

### Get Concise Responses
```
"Briefly explain [concept]"
"Give me just the code for [component]"
"Quick fix for [error]"
"Short answer: [question]"
```

### Get Detailed Responses
```
"Explain in detail how [concept] works"
"Walk me through implementing [feature] step by step"
"Provide a comprehensive solution for [problem]"
"Explain with examples: [topic]"
```

### Get Code Only
```
"Just show me the code for [component]"
"Code implementation for [feature] without explanation"
"Give me the TypeScript interface for [data structure]"
```

### Get Explanation Only
```
"Explain the concept of [topic] without code"
"Why does [pattern] work this way?"
"What's the difference between [A] and [B]?"
```

## Quality Prompts Checklist

Before submitting a prompt:
- [ ] Is it specific enough?
- [ ] Have I provided necessary context?
- [ ] Are requirements clear?
- [ ] Have I included relevant code/errors?
- [ ] Is the expected outcome defined?
- [ ] Have I mentioned constraints?
- [ ] Is it broken down if complex?
- [ ] Have I specified the agent (if needed)?

## Examples Library

### Example 1: Complete Feature
```
Create a customer registration feature in the self-order module:

Requirements:
1. Modal component that shows on "Create Account" button click
2. Form fields: email, name, phone
3. Validation:
   - Email: required, valid email format
   - Name: required, min 3 chars
   - Phone: required, 10-15 digits
4. Submit to POST /api/customers
5. On success: show success message, close modal, update auth store
6. On error: show error message

Design:
- Use PrimeVue Dialog
- Form layout: vertical stack
- Buttons: "Create Account" (primary) and "Cancel" (secondary)
- Match the style of existing LoginModal

Files to create/modify:
- Create: SelfOrderSummaryModalRegisterCustomer.vue
- Modify: self-order.service.ts (add registration method)
- Modify: self-order-register.interface.ts (add types)
```

### Example 2: Bug Fix
```
Fix the Sign In button not working in SelfOrderSummarySection.vue:

Current behavior:
- Button does nothing when clicked
- No errors in console
- Route navigation should happen but doesn't

Expected behavior:
- Button should navigate to self-order login page
- User should see the login screen

Code location:
- File: src/modules/self-order/components/SelfOrderSummarySection.vue
- Method: handleLogin() at line 45

Current implementation:
```typescript
const handleLogin = () => {
  router.push({ name: 'login-self-order' });
};
```

Route configuration:
```typescript
{
  path: '/self-order/login',
  name: 'self-order-login', // Note: different from button
  component: () => import('./SelfOrderLoginUI.vue')
}
```

I suspect it's a route name mismatch.
```

### Example 3: Refactoring
```
Refactor SelfOrderLoginUI.vue to move business logic to service:

Current issue:
- API calls are in the component
- Hard to test
- Violates separation of concerns

Target pattern:
- Component only handles UI
- Service contains all business logic
- Use provide/inject for service

Current component code:
[Paste current implementation]

Desired structure:
```typescript
// Service
const useLoginService = () => {
  const login = async (credentials) => {
    // API call logic here
  };
  return { login };
};

// Component
const { login } = inject('loginService');
const handleSubmit = async () => {
  await login(formData);
};
```
```

---

**Guide Version**: 1.0.0
**Last Updated**: November 23, 2025
