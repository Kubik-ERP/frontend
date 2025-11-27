# 📊 Analyze Command

## Purpose
Analyze codebase for bundle size, dependencies, type coverage, code quality, and performance metrics.

## Usage
```
/analyze [type] [options]
```

**Examples:**
```
/analyze bundle
/analyze deps
/analyze types
/analyze quality
/analyze performance
/analyze all
```

## Analysis Types

### 1. Bundle Analysis (`/analyze bundle`)

Analyzes JavaScript bundle size and composition.

**Output:**
```
📦 Bundle Analysis
==================

Build Size:
  Total:        2.4 MB
  Gzipped:      680 KB
  
Chunks:
  vendor.js:    1.2 MB (50%)
  app.js:       800 KB (33%)
  styles.css:   400 KB (17%)

Largest Dependencies:
  1. vue            180 KB
  2. primevue       320 KB
  3. axios          95 KB
  4. pinia          45 KB
  5. vue-router     40 KB

Recommendations:
  ⚠️  Consider lazy-loading primevue components
  ⚠️  Use tree-shaking for unused exports
  ✅  Code splitting configured correctly
```

**Implementation:**
```bash
# Build with analysis
npm run build -- --mode=analyze

# Or use vite-bundle-visualizer
npx vite-bundle-visualizer
```

**Thresholds:**
- 🟢 Good: < 500 KB gzipped
- 🟡 Warning: 500 KB - 1 MB
- 🔴 Critical: > 1 MB

---

### 2. Dependency Analysis (`/analyze deps`)

Analyzes project dependencies for updates, security, and size.

**Output:**
```
📦 Dependency Analysis
======================

Package Stats:
  Total:              45 dependencies
  Outdated:           3 packages
  Security Issues:    1 vulnerability

Outdated Packages:
  axios:              1.6.2 → 1.6.5 (patch)
  typescript:         5.3.0 → 5.4.2 (minor)
  vite:               5.0.0 → 5.1.0 (minor)

Security Vulnerabilities:
  🔴 axios@1.6.2 - CVE-2024-XXXXX (High)
      Fix: Update to 1.6.5

Size by Category:
  UI Libraries:       850 KB (40%)
  Build Tools:        600 KB (28%)
  Utilities:          450 KB (21%)
  Other:              240 KB (11%)

Recommendations:
  ⚠️  Update axios to fix security vulnerability
  ℹ️  3 packages have minor updates available
  ✅  No deprecated packages detected
```

**Commands:**
```bash
# Check for updates
npm outdated

# Check security
npm audit

# Dependency tree
npm list --depth=0
```

---

### 3. Type Coverage (`/analyze types`)

Analyzes TypeScript type safety across the codebase.

**Output:**
```
📝 TypeScript Analysis
======================

Type Coverage:
  Files:              234 files
  Total Lines:        12,450 lines
  Type Coverage:      94.5%
  
Errors:
  Errors:             0 errors
  Warnings:           3 warnings

Coverage by Module:
  ✅ app/               98.2%
  ✅ modules/auth       97.5%
  ✅ modules/self-order 96.8%
  ⚠️  modules/reports   89.3%
  ⚠️  modules/legacy    78.1%

Common Issues:
  1. Implicit 'any' types (5 occurrences)
  2. Missing return types (8 functions)
  3. Unsafe type assertions (2 instances)

Recommendations:
  ⚠️  Improve type coverage in reports module
  ⚠️  Add explicit return types to functions
  ⚠️  Replace 'any' with proper types
```

**Implementation:**
```bash
# Type check
npm run type-check

# With detailed output
npx vue-tsc --noEmit --pretty
```

---

### 4. Code Quality (`/analyze quality`)

Analyzes code quality metrics using ESLint, code complexity, and duplication.

**Output:**
```
✨ Code Quality Analysis
========================

ESLint:
  Files Linted:       234 files
  Errors:             0 errors
  Warnings:           5 warnings
  
Complexity:
  Average:            4.2 (Good)
  Highest:            12 (services/report.service.ts:234)
  
Code Duplication:
  Duplicated Lines:   45 lines (0.4%)
  Duplicated Blocks:  3 blocks

Top Issues:
  1. Missing JSDoc comments (8 functions)
  2. Long functions (> 100 lines): 2 instances
  3. High cyclomatic complexity: 1 function

Recommendations:
  ⚠️  Refactor report.service.ts:234 (complexity: 12)
  ℹ️  Add JSDoc to public API methods
  ✅  Overall code quality is good
```

**Metrics:**
- **Cyclomatic Complexity**: < 10 is good
- **Function Length**: < 50 lines preferred
- **Duplication**: < 3% is acceptable

---

### 5. Performance (`/analyze performance`)

Analyzes runtime performance metrics.

**Output:**
```
⚡ Performance Analysis
======================

Build Performance:
  Build Time:         12.3s
  HMR Time:           180ms
  Cold Start:         3.2s

Runtime Performance:
  Initial Load:       1.8s
  Time to Interactive: 2.4s
  First Paint:        0.9s
  Largest Component:  245ms (ProductList)

Bundle Metrics:
  Main Bundle:        680 KB (gzipped)
  Lazy Loaded:        1.2 MB
  Total:              1.88 MB

Slowest Operations:
  1. ProductList render:     245ms
  2. Dashboard data load:    180ms
  3. Image loading:          150ms

Recommendations:
  ⚠️  Optimize ProductList rendering (use virtual scroll)
  ⚠️  Implement image lazy loading
  ℹ️  Consider caching dashboard data
  ✅  Code splitting implemented correctly
```

**Thresholds:**
- 🟢 Good: < 3s time to interactive
- 🟡 Warning: 3-5s
- 🔴 Critical: > 5s

---

### 6. Comprehensive Analysis (`/analyze all`)

Runs all analysis types and generates comprehensive report.

**Output:**
```
🔍 Comprehensive Analysis Report
=================================

Generated: 2025-01-15 14:30:00

Executive Summary:
  Overall Score:      87/100 (Good)
  Critical Issues:    1
  Warnings:           8
  Info:               12

Scores by Category:
  Bundle Size:        92/100 ✅
  Dependencies:       78/100 ⚠️
  Type Safety:        94/100 ✅
  Code Quality:       88/100 ✅
  Performance:        85/100 ✅

Critical Issues:
  🔴 Security vulnerability in axios@1.6.2
     Action: Update to 1.6.5 immediately

Top Priorities:
  1. Fix security vulnerability
  2. Optimize ProductList component
  3. Improve type coverage in reports module
  4. Update 3 outdated dependencies

Detailed Reports:
  📦 Bundle Analysis:        [See section below]
  📦 Dependency Analysis:    [See section below]
  📝 Type Coverage:          [See section below]
  ✨ Code Quality:           [See section below]
  ⚡ Performance:            [See section below]

[Full detailed output for each analysis type]

Report saved to: analysis-report-2025-01-15.md
```

---

## Options

### `--format <type>`
Output format (console, json, html, markdown):
```
/analyze bundle --format json
/analyze all --format html
```

### `--output <file>`
Save report to file:
```
/analyze all --output report.md
```

### `--threshold <level>`
Set warning threshold (low, medium, high):
```
/analyze bundle --threshold medium
```

### `--compare <baseline>`
Compare against baseline:
```
/analyze bundle --compare baseline.json
```

---

## Configuration

Create `.analyzerc.json`:
```json
{
  "bundle": {
    "maxSize": 1000,
    "maxGzipped": 500,
    "thresholds": {
      "warning": 800,
      "error": 1000
    }
  },
  "performance": {
    "maxLoadTime": 3000,
    "maxTTI": 5000
  },
  "quality": {
    "maxComplexity": 10,
    "maxDuplication": 3,
    "requireJSDoc": true
  },
  "types": {
    "minCoverage": 90,
    "strict": true
  }
}
```

---

## Automation

### CI/CD Integration
```yaml
# .github/workflows/analyze.yml
name: Code Analysis

on: [pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Run analysis
        run: npm run analyze
      - name: Upload report
        uses: actions/upload-artifact@v2
        with:
          name: analysis-report
          path: analysis-report.html
```

### Pre-commit Hook
```bash
# .husky/pre-commit
#!/bin/sh
npm run analyze:quick
```

---

## Implementation Details

### Bundle Analysis Script
```typescript
import { build } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

const analyzeBundle = async () => {
  await build({
    plugins: [
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
  });
};
```

### Type Coverage Script
```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const analyzeTypes = async () => {
  const { stdout } = await execAsync('npx vue-tsc --noEmit');
  const errors = stdout.match(/error TS/g)?.length || 0;
  const warnings = stdout.match(/warning TS/g)?.length || 0;
  
  return { errors, warnings };
};
```

---

## Best Practices

1. **Regular Analysis**: Run weekly or before releases
2. **Track Trends**: Compare with previous reports
3. **Set Budgets**: Define size/performance budgets
4. **Automate**: Include in CI/CD pipeline
5. **Act on Findings**: Don't just analyze, improve
6. **Document Changes**: Note why metrics changed

---

## Troubleshooting

### Build Analysis Fails
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

### Type Check Errors
```bash
# Check specific file
npx vue-tsc --noEmit src/path/to/file.vue
```

### Performance Issues
```bash
# Profile build
npm run build -- --profile
```

---

**Command Version**: 1.0.0
**Last Updated**: November 23, 2025
