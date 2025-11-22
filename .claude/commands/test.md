# 🧪 Test Command

## Purpose
Run test suites with various configurations for unit tests, integration tests, and e2e tests.

## Usage
```
/test [type] [options]
```

**Examples:**
```
/test unit
/test integration
/test e2e
/test coverage
/test watch
/test all
```

## Test Types

### 1. Unit Tests (`/test unit`)

Run unit tests for individual components, services, and utilities.

**Output:**
```
🧪 Running Unit Tests
=====================

 ✓ app/helpers/debounce.helper.test.ts (2)
   ✓ should debounce function calls
   ✓ should cancel pending calls

 ✓ modules/self-order/services/self-order.service.test.ts (5)
   ✓ should initialize with empty state
   ✓ should fetch order data
   ✓ should handle API errors
   ✓ should update cart items
   ✓ should calculate total correctly

 ✓ modules/auth/composables/useAuth.test.ts (3)
   ✓ should login successfully
   ✓ should logout and clear state
   ✓ should refresh token

Test Files:  24 passed (24)
Tests:       156 passed (156)
Duration:    3.42s

Coverage:    94.2%
```

**Command:**
```bash
npm run test:unit
```

**Options:**
```bash
# Watch mode
npm run test:unit -- --watch

# Specific file
npm run test:unit -- self-order.service.test.ts

# With coverage
npm run test:unit -- --coverage

# Update snapshots
npm run test:unit -- -u
```

---

### 2. Integration Tests (`/test integration`)

Run integration tests for module interactions and API integration.

**Output:**
```
🔗 Running Integration Tests
============================

 ✓ modules/self-order/integration/checkout-flow.test.ts (4)
   ✓ should complete checkout flow
   ✓ should handle payment failure
   ✓ should apply discount codes
   ✓ should update inventory

 ✓ modules/auth/integration/auth-flow.test.ts (3)
   ✓ should authenticate user
   ✓ should persist session
   ✓ should handle token refresh

Test Files:  8 passed (8)
Tests:       42 passed (42)
Duration:    8.12s
```

**Command:**
```bash
npm run test:integration
```

---

### 3. E2E Tests (`/test e2e`)

Run end-to-end tests with Playwright or Cypress.

**Output:**
```
🌐 Running E2E Tests
====================

 ✓ tests/e2e/self-order/customer-journey.spec.ts
   ✓ Customer can browse menu
   ✓ Customer can add items to cart
   ✓ Customer can checkout
   ✓ Customer can create account

 ✓ tests/e2e/auth/login-flow.spec.ts
   ✓ User can login
   ✓ User can logout
   ✓ User session persists

Test Suites: 5 passed (5)
Tests:       23 passed (23)
Duration:    45.3s

Screenshots: 0
Videos:      2
```

**Command:**
```bash
# Headless
npm run test:e2e

# With browser
npm run test:e2e:ui

# Specific spec
npm run test:e2e -- --spec customer-journey
```

---

### 4. Coverage Report (`/test coverage`)

Generate comprehensive test coverage report.

**Output:**
```
📊 Test Coverage Report
=======================

File                                    % Stmts  % Branch  % Funcs  % Lines
------------------------------------------------------------------------
All files                               94.2     89.5      92.1     94.8
 app/composables                        96.3     91.2      94.5     96.8
  useHttp.ts                            98.1     93.4      96.2     98.5
  useValidateForm.ts                    94.2     88.7      92.1     94.8
 modules/self-order/services            93.5     87.3      90.8     93.9
  self-order.service.ts                 94.8     89.1      92.3     95.2
  self-order-api.service.ts             92.1     85.5      89.2     92.5
 modules/auth/services                  95.7     92.1      94.3     96.1
  auth.service.ts                       97.2     94.5      96.1     97.8

Uncovered Lines:
  self-order.service.ts: 245-248 (error handling)
  auth.service.ts: 123 (edge case)

Coverage Thresholds:
  ✅ Statements:  94.2% (>= 80%)
  ✅ Branches:    89.5% (>= 75%)
  ✅ Functions:   92.1% (>= 80%)
  ✅ Lines:       94.8% (>= 80%)

Report: coverage/index.html
```

**Command:**
```bash
npm run test:coverage
```

**Open Report:**
```bash
open coverage/index.html
```

---

### 5. Watch Mode (`/test watch`)

Run tests in watch mode for development.

**Output:**
```
🔄 Test Watch Mode
==================

Watching for file changes...

Test Files:  2 changed
Tests:       8 passed

Re-running affected tests...

Commands:
  a - run all tests
  f - run only failed tests
  q - quit watch mode
  p - filter by file pattern
  t - filter by test name

Press h for more commands
```

**Command:**
```bash
npm run test:watch
```

---

### 6. Run All Tests (`/test all`)

Run complete test suite including unit, integration, and e2e tests.

**Output:**
```
🎯 Running Complete Test Suite
==============================

Phase 1: Unit Tests
-------------------
✅ 156 tests passed
⏱️  3.42s

Phase 2: Integration Tests
---------------------------
✅ 42 tests passed
⏱️  8.12s

Phase 3: E2E Tests
------------------
✅ 23 tests passed
⏱️  45.3s

Summary
-------
Total Tests:     221 passed
Total Duration:  56.84s
Coverage:        94.2%

✅ All tests passed successfully!
```

**Command:**
```bash
npm run test:all
```

---

## Test Examples

### Unit Test Template

```typescript
// self-order.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useInventoryService } from '../inventory.service';

describe('InventoryService', () => {
  let service: ReturnType<typeof useInventoryService>;
  
  beforeEach(() => {
    service = useInventoryService();
  });
  
  describe('inventoryGetList', () => {
    it('should fetch inventory list successfully', async () => {
      // Arrange
      const mockData = [
        { id: '1', name: 'Item 1', quantity: 10 },
        { id: '2', name: 'Item 2', quantity: 5 },
      ];
      vi.spyOn(service, 'inventoryApiGetList').mockResolvedValue(mockData);
      
      // Act
      await service.inventoryGetList();
      
      // Assert
      expect(service.inventory_data.value).toEqual(mockData);
      expect(service.inventory_loading.value).toBe(false);
      expect(service.inventory_error.value).toBeNull();
    });
    
    it('should handle API errors', async () => {
      // Arrange
      const error = new Error('API Error');
      vi.spyOn(service, 'inventoryApiGetList').mockRejectedValue(error);
      
      // Act
      await service.inventoryGetList();
      
      // Assert
      expect(service.inventory_data.value).toEqual([]);
      expect(service.inventory_error.value).toBe('Failed to load inventory');
    });
  });
});
```

### Component Test Template

```typescript
// InventoryList.test.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import InventoryList from '../InventoryList.vue';

describe('InventoryList', () => {
  it('should render list of items', () => {
    // Arrange
    const items = [
      { id: '1', name: 'Item 1', quantity: 10 },
      { id: '2', name: 'Item 2', quantity: 5 },
    ];
    
    // Act
    const wrapper = mount(InventoryList, {
      props: { items },
    });
    
    // Assert
    expect(wrapper.findAll('.inventory-item')).toHaveLength(2);
    expect(wrapper.text()).toContain('Item 1');
    expect(wrapper.text()).toContain('Item 2');
  });
  
  it('should emit select event when item clicked', async () => {
    // Arrange
    const items = [{ id: '1', name: 'Item 1', quantity: 10 }];
    const wrapper = mount(InventoryList, {
      props: { items },
    });
    
    // Act
    await wrapper.find('.inventory-item').trigger('click');
    
    // Assert
    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')?.[0]).toEqual([items[0]]);
  });
});
```

### E2E Test Template

```typescript
// customer-journey.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Customer Journey', () => {
  test('should complete full checkout flow', async ({ page }) => {
    // Navigate to self-order
    await page.goto('/self-order');
    
    // Browse menu
    await expect(page.locator('.product-list')).toBeVisible();
    
    // Add item to cart
    await page.locator('.product-item').first().click();
    await page.locator('button:has-text("Add to Cart")').click();
    
    // Verify cart updated
    await expect(page.locator('.cart-count')).toHaveText('1');
    
    // Go to checkout
    await page.locator('button:has-text("Checkout")').click();
    
    // Create account
    await page.locator('button:has-text("Create Account")').click();
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="phone"]', '1234567890');
    await page.locator('button[type="submit"]').click();
    
    // Complete order
    await page.locator('button:has-text("Confirm Order")').click();
    
    // Verify success
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

---

## Options

### `--watch`
Run tests in watch mode:
```
/test unit --watch
```

### `--coverage`
Generate coverage report:
```
/test unit --coverage
```

### `--ui`
Open test UI (Vitest UI):
```
/test unit --ui
```

### `--file <pattern>`
Run specific test file(s):
```
/test unit --file self-order
```

### `--grep <pattern>`
Run tests matching pattern:
```
/test unit --grep "should fetch"
```

### `--update-snapshots`
Update component snapshots:
```
/test unit --update-snapshots
```

---

## Configuration

### Vitest Config (`vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

---

## Best Practices

### 1. Test Organization
```
tests/
├── unit/
│   ├── app/
│   │   ├── helpers/
│   │   └── composables/
│   └── modules/
│       ├── self-order/
│       └── auth/
├── integration/
│   └── modules/
├── e2e/
│   ├── self-order/
│   └── auth/
└── fixtures/
    └── data/
```

### 2. Test Naming
```typescript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do expected behavior when condition', () => {
      // Test implementation
    });
  });
});
```

### 3. AAA Pattern
```typescript
it('should add item to cart', () => {
  // Arrange
  const item = { id: '1', name: 'Test' };
  
  // Act
  addToCart(item);
  
  // Assert
  expect(cart.value).toContain(item);
});
```

### 4. Mocking
```typescript
// Mock API calls
vi.mock('@/app/composables/useHttp', () => ({
  useHttp: () => ({
    httpGet: vi.fn().mockResolvedValue({ data: [] }),
  }),
}));
```

---

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm run test:all
      - name: Upload coverage
        uses: codecov/codecov-action@v2
        with:
          files: ./coverage/coverage-final.json
```

---

**Command Version**: 1.0.0
**Last Updated**: November 23, 2025
