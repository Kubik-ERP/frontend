# 🤖 Claude AI Configuration

This directory contains comprehensive configuration for Claude AI to assist with Vue 3 + TypeScript development.

## 📁 Structure

```
.claude/
├── agents/              # Specialized AI agents
│   ├── frontend-specialist.md
│   ├── architect.md
│   ├── debugger.md
│   ├── docs-writer.md
│   ├── orchestrator.md
│   └── prompts-guide.md
└── commands/            # Custom commands
    ├── changelog.md
    ├── create-module.md
    ├── analyze.md
    └── test.md
```

## 🎯 Quick Start

### 1. Read Master Guide
Start with `/CLAUDE.md` in the project root for complete context.

### 2. Use Specialized Agents
Invoke agents with `@` prefix for specific tasks:

```
@frontend - Create a modal component for user registration
@architect - Design the structure for inventory module
@debugger - Fix TypeScript error in self-order.service.ts
@docs - Document the authentication module
```

### 3. Run Commands
Use `/` prefix for custom commands:

```
/changelog v1.0.0 v1.1.0
/create-module inventory --crud
/analyze bundle
/test unit --coverage
```

## 🤖 Agents Overview

### [@frontend](./agents/frontend-specialist.md)
**Expertise:** Vue 3 components, UI/UX, state management, forms
- Creating/editing components
- Styling with TailwindCSS
- Form validation
- Responsive design
- PrimeVue integration

### [@architect](./agents/architect.md)
**Expertise:** DDD architecture, module design, refactoring
- Designing module structure
- Service layer patterns
- Code organization
- Refactoring strategies
- Performance optimization

### [@debugger](./agents/debugger.md)
**Expertise:** Error resolution, bug fixing, performance
- TypeScript errors
- ESLint violations
- Runtime bugs
- Performance issues
- Memory leaks

### [@docs](./agents/docs-writer.md)
**Expertise:** Technical documentation, README, API docs
- Writing documentation
- JSDoc comments
- Architecture diagrams
- User guides
- Changelogs

### [@orchestrator](./agents/orchestrator.md)
**Meta-agent:** Routes requests to appropriate specialists
- Analyzes task complexity
- Determines which agent(s) to use
- Coordinates multi-agent workflows
- Handles ambiguous requests

## 📚 Guides

### [Prompts Guide](./agents/prompts-guide.md)
Learn how to craft effective prompts:
- Be specific and provide context
- Break down complex tasks
- Use templates for common requests
- Agent-specific prompting strategies
- Common mistakes to avoid

## 🛠️ Commands

### [/changelog](./commands/changelog.md)
Generate changelog from git commits
```
/changelog v1.0.0 v1.1.0
/changelog --unreleased
```

### [/create-module](./commands/create-module.md)
Scaffold new DDD module with boilerplate
```
/create-module inventory --crud
/create-module reports --with-api
```

### [/analyze](./commands/analyze.md)
Analyze codebase metrics
```
/analyze bundle      # Bundle size
/analyze deps        # Dependencies
/analyze types       # Type coverage
/analyze quality     # Code quality
/analyze performance # Performance
/analyze all         # All metrics
```

### [/test](./commands/test.md)
Run test suites
```
/test unit           # Unit tests
/test integration    # Integration tests
/test e2e            # E2E tests
/test coverage       # Coverage report
/test watch          # Watch mode
/test all            # All tests
```

## 💡 Usage Examples

### Example 1: Create New Feature
```
@orchestrator Build a customer registration feature in self-order module

→ Routes to:
  1. @architect - Design module structure
  2. @frontend - Implement components
  3. @docs - Create documentation
```

### Example 2: Fix Bug
```
@debugger Getting TypeScript error in auth.service.ts line 45:
Property 'email' does not exist on type 'User'

[Paste code context]

→ Analyzes error, provides fix, explains root cause
```

### Example 3: Refactor Code
```
@architect Refactor self-order module to separate business logic into service layer

Current issues:
- Logic mixed in components
- Hard to test
- Code duplication

→ Provides refactoring strategy and implementation
```

### Example 4: Create Component
```
@frontend Create a responsive modal component for order summary:
- Show list of items with quantities
- Display total price
- Include confirm/cancel buttons
- Close on backdrop click
- Style with PrimeVue Dialog

→ Generates complete component with proper structure
```

## 📖 Best Practices

### Prompt Engineering
✅ **Good:**
```
@frontend Create a button component in the self-order module with:
- Props: label (string), loading (boolean), disabled (boolean)
- Emits: click event
- Style: Primary button with loading spinner
- Use PrimeVue Button component
```

❌ **Bad:**
```
@frontend make a button
```

### Task Breakdown
✅ **Good:**
```
Let's build the inventory module in steps:
1. @architect - Design the module structure
2. @frontend - Create the list view component
3. @frontend - Create the form component
4. @docs - Document the module
```

❌ **Bad:**
```
Build complete inventory system with everything
```

### Context Sharing
✅ **Good:**
```
@debugger Fix this error in self-order.service.ts:

Error: Property 'email' does not exist
Location: Line 45
File: src/modules/self-order/services/self-order.service.ts

Current code:
[paste relevant code]

Expected behavior:
[description]
```

❌ **Bad:**
```
@debugger error on line 45
```

## 🎓 Learning Path

### Week 1: Basics
1. Read `/CLAUDE.md`
2. Try `@frontend` for simple components
3. Use `/test unit` for testing
4. Practice prompt engineering

### Week 2: Architecture
1. Study `@architect` agent
2. Use `/create-module` command
3. Refactor existing code
4. Learn DDD patterns

### Week 3: Advanced
1. Multi-agent workflows with `@orchestrator`
2. Performance optimization with `/analyze`
3. Complex refactoring
4. CI/CD integration

### Week 4: Mastery
1. Create custom prompts
2. Optimize workflows
3. Contribute improvements
4. Mentor others

## 🔧 Configuration

### VS Code Settings
Add to `.vscode/settings.json`:
```json
{
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": true,
    "markdown": true
  }
}
```

### Git Integration
Add to `.gitignore`:
```
# Keep Claude config
!.claude/
```

## 📊 Metrics

Track your AI-assisted development:
- **Tasks completed**: Count agent-assisted tasks
- **Time saved**: Estimate hours saved
- **Code quality**: Monitor test coverage and errors
- **Learning**: Note new patterns learned

## 🤝 Contributing

Improve Claude configuration:
1. Suggest new agents
2. Enhance prompts
3. Add commands
4. Share workflows

## 📝 Updates

Keep configuration current:
- Review agents quarterly
- Update for new project patterns
- Add new commands as needed
- Share improvements with team

## 🆘 Support

### Issues
- Agent not understanding? → Improve prompt specificity
- Wrong agent selected? → Use explicit `@agent` prefix
- Task too complex? → Break down into subtasks
- Need help? → Ask `@orchestrator` for guidance

### Resources
- [CLAUDE.md](/CLAUDE.md) - Master guide
- [Prompt Engineering](./agents/prompts-guide.md) - Prompt tips
- Each agent file - Detailed agent docs

## 🚀 Next Steps

1. ✅ Read master guide (`/CLAUDE.md`)
2. ✅ Review agent specializations
3. ✅ Try example prompts
4. ✅ Use commands in workflow
5. ✅ Share feedback

---

**Version**: 1.0.0
**Last Updated**: November 23, 2025
**Project**: Vue 3 + TypeScript Frontend
**Team**: Self-Taught Development Team
