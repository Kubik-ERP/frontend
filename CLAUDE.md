# 🤖 Claude AI Configuration Guide

## Overview
This document contains the AI configuration and guidelines for the **Vue 3 + TypeScript + PrimeVue** project. Claude AI assists with development, code reviews, refactoring, and maintaining code quality across the entire codebase.

---

## 🎯 Project Context

### Tech Stack
- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript (Strict Mode)
- **UI Library**: PrimeVue 4.x
- **State Management**: Pinia with persistence
- **Styling**: TailwindCSS 4.x
- **Build Tool**: Vite 6.x
- **Router**: Vue Router 4.x
- **Validation**: Vuelidate
- **Testing**: Vitest

### Architecture
- **Pattern**: Domain-Driven Design (DDD)
- **Structure**: Feature-based modules
- **Service Layer**: Business logic separated from components
- **Type Safety**: Strict TypeScript with no `any` types

---

## 📋 Core Principles

### 1. **Code Quality Standards**
- ✅ **Zero ESLint Errors**: All code must pass ESLint validation
- ✅ **Type Safety**: No `any` types, complete TypeScript coverage
- ✅ **Naming Conventions**: Consistent prefixing (e.g., `selfOrder_`, `cashier_`)
- ✅ **Component Structure**: `<script setup>` → `<template>` → `<style>`
- ✅ **Single Responsibility**: Each function/component does one thing well

### 2. **Development Workflow**
```
1. Understand requirement → 2. Plan implementation → 3. Write code → 4. Test → 5. Verify no errors → 6. Document
```

### 3. **Communication Style**
- **Concise**: Keep responses brief unless complex explanation needed
- **Actionable**: Focus on implementation, not just theory
- **Error-Driven**: Always check errors after edits
- **Fact-Based**: Provide accurate information from codebase

---

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                    # Core application
│   │   ├── assets/            # Static assets (icons, images, fonts)
│   │   ├── components/        # Reusable components
│   │   │   ├── base/         # Base components (buttons, inputs)
│   │   │   ├── common/       # Common components (modals, forms)
│   │   │   └── layouts/      # Layout components
│   │   ├── composables/      # Vue composables
│   │   ├── constants/        # Global constants
│   │   ├── directives/       # Custom directives
│   │   ├── helpers/          # Utility functions
│   │   ├── locales/          # i18n translations
│   │   ├── router/           # Vue Router configuration
│   │   └── store/            # Global Pinia stores
│   │
│   ├── modules/               # Feature modules (DDD)
│   │   ├── {module-name}/
│   │   │   ├── components/   # Module-specific components
│   │   │   ├── constants/    # Module constants
│   │   │   ├── interfaces/   # TypeScript interfaces
│   │   │   ├── locales/      # Module translations
│   │   │   ├── routes/       # Module routes
│   │   │   ├── services/     # Business logic layer
│   │   │   ├── store/        # Module-specific stores
│   │   │   └── views/        # Page components
│   │
│   ├── plugins/               # Vue plugins (axios, i18n, etc.)
│   ├── types/                 # Global TypeScript types
│   ├── App.vue               # Root component
│   └── main.ts               # Application entry point
│
├── .claude/                   # Claude AI configuration
│   ├── agents/               # Specialized AI agents
│   └── commands/             # Custom commands
│
└── docs/                      # Documentation
```

---

## 🤝 Working with Claude

### **When to Use Agents**

#### 🎨 **Frontend Specialist** (`/agent frontend-specialist`)
Use for:
- Component development (Vue 3)
- UI/UX implementation with PrimeVue
- State management with Pinia
- TypeScript interfaces and types
- Responsive design with TailwindCSS
- Form validation with Vuelidate

**Example:**
```
@agent frontend-specialist create a responsive modal component for user registration with email, phone, and name fields
```

#### 🏗️ **Architect** (`/agent architect`)
Use for:
- Module structure design
- Service layer architecture
- Interface design patterns
- Code organization
- Refactoring strategies
- Performance optimization

**Example:**
```
@agent architect design a service layer for the payment module with proper separation of concerns
```

#### 🐛 **Debugger** (`/agent debugger`)
Use for:
- TypeScript errors
- ESLint issues
- Runtime bugs
- Performance issues
- Build errors

**Example:**
```
@agent debugger fix the TypeScript error in self-order.service.ts line 245
```

#### 📚 **Documentation Writer** (`/agent docs-writer`)
Use for:
- README files
- API documentation
- Code comments
- Architecture diagrams
- PRD (Product Requirements Document)

**Example:**
```
@agent docs-writer create a comprehensive README for the self-order module
```

### **When to Use Commands**

#### 📝 **Generate Changelog** (`/command changelog`)
Auto-generates changelog from git commits
```
/command changelog v1.2.0
```

#### 🏗️ **Create Module** (`/command create-module`)
Scaffolds a new feature module
```
/command create-module payment-gateway
```

#### 🔍 **Analyze Bundle** (`/command analyze`)
Analyzes build bundle size
```
/command analyze
```

#### ✅ **Run Tests** (`/command test`)
Runs test suite with options
```
/command test unit --coverage
```

---

## 🎯 Naming Conventions

### **Modules**
- Folder: `kebab-case` (e.g., `self-order`, `cash-drawer`)
- Component: `PascalCase` with module prefix (e.g., `SelfOrderMainSection`)
- Service: `kebab-case` with `.service.ts` suffix (e.g., `self-order.service.ts`)

### **Components**
```typescript
// ✅ Good
SelfOrderListProduct.vue
CashierProductCard.vue
AppBaseButton.vue

// ❌ Bad
ListProduct.vue
ProductCard.vue
Button.vue
```

### **Interfaces**
```typescript
// ✅ Good - with I prefix and module name
interface ISelfOrderProvided {}
interface ICashierProductItem {}

// ❌ Bad
interface SelfOrderProvided {}
interface ProductItem {}
```

### **Service Properties**
```typescript
// ✅ Good - with module prefix
const selfOrder_selectedProduct = ref([]);
const selfOrder_onSelectProduct = () => {};
const selfOrder_isLoading = ref(false);

// ❌ Bad
const selectedProduct = ref([]);
const selectProduct = () => {};
const loading = ref(false);
```

### **Boolean Properties**
```typescript
// ✅ Good - with is/has prefix
selfOrder_isButtonPlaceOrderDisabled
selfOrder_hasCustomerManagementPermission

// ❌ Bad
selfOrder_buttonPlaceOrderDisabled
selfOrder_customerManagementPermission
```

### **Action Methods**
```typescript
// ✅ Good - with on/handle prefix
selfOrder_onSelectProduct()
selfOrder_onFetchCategory()
selfOrder_handleSubmit()

// ❌ Bad
selfOrder_selectProduct()
selfOrder_fetchCategory()
selfOrder_submit()
```

---

## 📐 Code Patterns

### **1. Vue Component Structure**
```vue
<script setup lang="ts">
// Imports (grouped)
import { ref, computed, onMounted } from 'vue';
import type { ISelfOrderProvided } from '@/modules/self-order/interfaces';

// Props & Emits
interface Props {
  title: string;
  isVisible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: true,
});

const emit = defineEmits<{
  close: [];
  submit: [data: FormData];
}>();

// Inject
const { selfOrder_data, selfOrder_onSubmit } = inject<ISelfOrderProvided>('selfOrder')!;

// Refs
const isLoading = ref(false);

// Computed
const displayTitle = computed(() => props.title.toUpperCase());

// Methods
const handleClose = () => {
  emit('close');
};

// Lifecycle
onMounted(() => {
  // initialization
});
</script>

<template>
  <div class="component-wrapper">
    <!-- Content -->
  </div>
</template>

<style scoped>
/* Component-specific styles */
</style>
```

### **2. Service Pattern**
```typescript
// service-name.service.ts
import { ref, computed } from 'vue';
import type { IModuleProvided } from '../interfaces';

export const useModuleService = (): IModuleProvided => {
  // State
  const module_data = ref<Data[]>([]);
  const module_isLoading = ref(false);
  
  // Computed
  const module_hasData = computed(() => module_data.value.length > 0);
  
  // Actions
  const module_onFetchData = async () => {
    module_isLoading.value = true;
    try {
      // API call
    } finally {
      module_isLoading.value = false;
    }
  };
  
  // Return
  return {
    module_data,
    module_isLoading,
    module_hasData,
    module_onFetchData,
  };
};
```

### **3. Interface Pattern**
```typescript
// module.interface.ts
export interface IModuleProvided {
  // State
  module_data: Ref<Data[]>;
  module_isLoading: Ref<boolean>;
  
  // Computed
  module_hasData: ComputedRef<boolean>;
  
  // Actions
  module_onFetchData: () => Promise<void>;
}

export interface IModuleData {
  id: string;
  name: string;
  createdAt: Date;
}
```

---

## 🔍 Best Practices

### **1. TypeScript**
```typescript
// ✅ Good - Explicit types
const data = ref<Product[]>([]);
const computed = computed((): string => '');

// ❌ Bad - Implicit any
const data = ref([]);
const computed = computed(() => '');
```

### **2. Composables**
```typescript
// ✅ Good - Reusable composable
export const useValidation = () => {
  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return { isEmailValid };
};

// Usage
const { isEmailValid } = useValidation();
```

### **3. Error Handling**
```typescript
// ✅ Good - Comprehensive error handling
try {
  const response = await api.post('/endpoint', data);
  useToast().success('Success!');
  return response.data;
} catch (error) {
  console.error('API Error:', error);
  useToast().error('Failed to submit');
  throw error;
}
```

### **4. Responsive Design**
```vue
<!-- ✅ Good - Mobile-first with breakpoints -->
<div class="block lg:hidden">Mobile View</div>
<div class="hidden lg:block">Desktop View</div>

<!-- ✅ Good - Responsive component -->
<PrimeVueButton
  :class="['w-full', 'lg:w-auto']"
  :size="isMobile ? 'small' : 'default'"
/>
```

---

## 🚀 Development Workflow

### **1. Before Starting**
```bash
# Check current errors
npm run lint

# Run dev server
npm run start:dev
```

### **2. During Development**
- Write code in small, testable chunks
- Check TypeScript errors frequently
- Test in both mobile and desktop views
- Verify ESLint compliance

### **3. Before Commit**
```bash
# Lint and fix
npm run lint

# Run tests
npm run test:unit

# Build check
npm run build
```

### **4. Git Commit Convention**
```bash
# Format: type(scope): description

feat(self-order): add register customer modal
fix(cashier): resolve payment calculation bug
refactor(auth): extract login logic to service
docs(readme): update installation guide
style(ui): improve button hover states
test(payment): add unit tests for validation
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring
- `docs`: Documentation
- `style`: UI/formatting
- `test`: Testing
- `chore`: Maintenance

---

## 🎨 UI/UX Guidelines

### **Design System**
- **Colors**: Use TailwindCSS variables (primary, secondary, etc.)
- **Spacing**: Use standard Tailwind spacing (p-4, gap-2, etc.)
- **Typography**: Use semantic font sizes (text-sm, text-base, text-lg)
- **Components**: Use PrimeVue components for consistency

### **Responsive Breakpoints**
```
sm: 640px   (mobile landscape)
md: 768px   (tablet)
lg: 1024px  (desktop)
xl: 1280px  (large desktop)
2xl: 1536px (extra large)
```

### **Accessibility**
- Use semantic HTML (`<button>` not `<div @click>`)
- Include ARIA labels for screen readers
- Ensure keyboard navigation works
- Maintain color contrast ratios

---

## 📚 Resources

### **Documentation**
- [Vue 3 Docs](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PrimeVue Components](https://primevue.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Pinia Store](https://pinia.vuejs.org/)

### **Project-Specific**
- See `docs/RBAC.md` for role-based access control
- See `docs/SELF-ORDER-REFACTORING-PRD.md` for module architecture
- Check `.claude/agents/` for AI agent capabilities

---

## 🤖 AI Agent Usage Tips

### **Be Specific**
```
❌ "Fix the bug"
✅ "Fix the TypeScript error on line 42 in self-order.service.ts where property 'email' doesn't exist"
```

### **Provide Context**
```
❌ "Add a modal"
✅ "Add a registration modal in the self-order module with email, name, and phone fields using PrimeVue Dialog component"
```

### **Request Verification**
```
✅ "After making changes, verify there are no TypeScript or ESLint errors"
✅ "Check if the component works on both mobile and desktop"
```

---

## 🎓 Learning Path

### **For New Developers**
1. Read this CLAUDE.md completely
2. Review the project structure in `/src`
3. Study one module (e.g., `self-order`) as a reference
4. Check naming conventions and patterns
5. Run the app and explore existing features

### **For AI Assistance**
1. Use specific agents for specialized tasks
2. Follow the coding patterns shown here
3. Always verify code quality after changes
4. Keep responses concise and actionable

---

## 📞 Support

For questions or improvements to this guide:
1. Check existing documentation in `/docs`
2. Review similar implementations in the codebase
3. Ask Claude AI with specific context
4. Consult with team lead for architectural decisions

---

**Last Updated**: November 23, 2025
**Version**: 1.0.0
**Maintained By**: Development Team
