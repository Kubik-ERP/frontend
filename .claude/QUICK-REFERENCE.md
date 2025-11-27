# ⚡ Claude Quick Reference

A one-page cheat sheet for Claude AI-assisted development.

## 🤖 Agent Quick Reference

| Agent | Use When | Example |
|-------|----------|---------|
| `@frontend` | UI/Components | Create modal component with form |
| `@architect` | Structure/Refactor | Design service layer for module |
| `@debugger` | Fix errors | Fix TypeScript error on line 45 |
| `@docs` | Documentation | Document this API service |
| `@orchestrator` | Complex/Unclear | Build complete feature X |

## 📝 Prompt Templates

### Create Component
```
@frontend Create a [component type] in [module] that:
- Purpose: [what it does]
- Props: [list props]
- Events: [list events]
- Style: [design requirements]
```

### Fix Bug
```
@debugger Fix [error type] in [file]:
Error: [exact error message]
Location: [file:line]
Expected: [expected behavior]
Current code: [paste code]
```

### Design Module
```
@architect Design [module name] module with:
- Features: [list features]
- Requirements: [list requirements]
- Pattern: DDD with service layer
```

### Document Code
```
@docs Document [module/service/component]:
- Add README
- JSDoc comments
- Usage examples
- API documentation
```

## 🛠️ Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `/changelog` | Generate changelog | `/changelog v1.0.0 v1.1.0` |
| `/create-module` | Scaffold module | `/create-module inventory --crud` |
| `/analyze` | Analyze codebase | `/analyze bundle` |
| `/test` | Run tests | `/test unit --coverage` |

## ✅ Quality Checklist

Before committing:
- [ ] TypeScript passes: `npm run type-check`
- [ ] ESLint passes: `npm run lint`
- [ ] Tests pass: `npm run test:unit`
- [ ] Code reviewed by appropriate agent
- [ ] Documentation updated

## 🎯 Common Tasks

### Create New Feature
```
@orchestrator Build [feature] in [module]:
1. Design structure
2. Implement components
3. Add tests
4. Document
```

### Fix TypeScript Error
```
@debugger TypeScript error in [file]:
[paste error and code]
```

### Refactor Code
```
@architect Refactor [file/module]:
Current issues: [list issues]
Desired outcome: [goals]
```

### Style Component
```
@frontend Style [component] with:
- Layout: [description]
- Colors: [palette]
- Responsive: [breakpoints]
```

## 💡 Prompt Best Practices

### ✅ Do
- Be specific and detailed
- Provide context and code
- Break complex tasks down
- Use agent prefixes (`@agent`)
- Include file paths
- Show expected outcome

### ❌ Don't
- Be vague ("fix it")
- Omit error messages
- Request too much at once
- Forget to specify files
- Assume context

## 📐 Project Patterns

### Component Structure
```vue
<script setup lang="ts">
// Imports
// Inject services
// Extract properties/methods
// Lifecycle hooks
</script>

<template>
  <!-- UI -->
</template>

<style scoped>
  /* TailwindCSS classes */
</style>
```

### Service Pattern
```typescript
export const useModuleService = () => {
  // State
  const state = reactive({
    module_data: [],
    module_loading: false,
    module_error: null,
  });
  
  // Methods
  const moduleGetList = async () => {
    // Implementation
  };
  
  return {
    ...toRefs(state),
    moduleGetList,
  };
};
```

### Naming Convention
```
Component:     ModuleName + Type + .vue
Service:       module-name.service.ts
Interface:     module-name.interface.ts
Store:         module-name.store.ts
Properties:    module_propertyName
Methods:       moduleMethodName
```

## 🔍 Quick Diagnostics

### TypeScript Error?
```bash
npm run type-check
# Or
@debugger [paste error]
```

### ESLint Warning?
```bash
npm run lint
# Or
npm run lint -- --fix
```

### Component Not Rendering?
```
@debugger Component [name] not rendering:
Expected: [description]
Code: [paste component]
```

### Performance Issue?
```
/analyze performance
# Or
@debugger [component] is slow: [details]
```

## 📚 Resources

| Resource | Location | Purpose |
|----------|----------|---------|
| Master Guide | `/CLAUDE.md` | Complete reference |
| Agents | `/.claude/agents/` | Agent details |
| Commands | `/.claude/commands/` | Command docs |
| Examples | `/CLAUDE.md` | Code examples |

## 🚀 Keyboard Shortcuts

**VS Code with Copilot:**
- `Cmd/Ctrl + I` - Inline chat
- `Cmd/Ctrl + Shift + I` - Chat panel
- `Tab` - Accept suggestion
- `Esc` - Dismiss suggestion

## 📊 Metrics to Track

- **Code Quality**: Test coverage, ESLint score
- **Performance**: Bundle size, load time
- **Productivity**: Tasks completed, time saved
- **Learning**: New patterns, improvements

## 🎓 Learning Resources

1. **Week 1**: Read `/CLAUDE.md`, try `@frontend`
2. **Week 2**: Use `@architect`, understand DDD
3. **Week 3**: Multi-agent workflows, commands
4. **Week 4**: Custom prompts, optimization

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Agent misunderstands | Add more context, be specific |
| Wrong output | Review prompt, try different agent |
| Error in generated code | Run through `@debugger` |
| Need clarification | Ask `@orchestrator` |

## 🎯 Daily Workflow

### Morning
```
1. Pull latest changes
2. Run: npm run type-check
3. Run: npm run lint
4. Plan tasks with @orchestrator
```

### Development
```
1. Use @frontend for components
2. Use @architect for structure
3. Use @debugger for errors
4. Commit regularly
```

### End of Day
```
1. Run tests: /test unit
2. Generate changelog: /changelog --unreleased
3. Update docs: @docs
4. Commit and push
```

## 🔄 Version Control

### Commit Messages
```
feat(module): add new feature
fix(module): resolve bug
refactor(module): improve code
docs(module): update documentation
test(module): add tests
style(module): format code
```

### Before Push
```bash
npm run type-check  # TypeScript
npm run lint        # ESLint
npm run test:unit   # Tests
git status          # Review changes
```

## 🎨 Quick Styling

### TailwindCSS Classes
```
Layout:     flex, grid, p-4, m-2
Colors:     bg-primary, text-white
Size:       w-full, h-screen
Responsive: sm:, md:, lg:, xl:
```

### PrimeVue Components
```vue
<Button label="Click" @click="handle" />
<Dialog v-model:visible="visible">
<InputText v-model="value" />
<DataTable :value="items" />
```

---

**Keep this page handy for quick reference!**

**Version**: 1.0.0
**Last Updated**: November 23, 2025
