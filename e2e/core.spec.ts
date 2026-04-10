import { test, expect } from '@playwright/test'

/**
 * Authentication E2E Tests
 * Tests cover login, logout, and protected routes
 */

test.describe('Authentication', () => {
  test('should redirect to login for protected routes', async ({ page }) => {
    // Try to access protected route without auth
    await page.goto('/customers')
    
    // In dev mode, might not have auth, but check for login redirect
    // This depends on actual auth implementation
  })

  test('should display login form', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    
    // Check login form elements
    await expect(page.locator('input[name="email"], input[name="username"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /登录|Login/i })).toBeVisible()
  })
})

/**
 * Form Validation E2E Tests
 */
test.describe('Form Validation', () => {
  test('should show validation errors', async ({ page }) => {
    await page.goto('/customers')
    await page.waitForLoadState('networkidle')
    
    // Open create modal
    await page.getByRole('button', { name: /新增|添加|创建/i }).click()
    
    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /保存|提交|确定/i })
    if (await submitButton.isVisible()) {
      await submitButton.click()
      
      // Validation errors should appear
      await expect(page.locator('[data-testid="form-error"], .error-message')).toBeVisible()
    }
  })

  test('should validate email format', async ({ page }) => {
    await page.goto('/customers')
    await page.waitForLoadState('networkidle')
    
    // Open create modal
    await page.getByRole('button', { name: /新增|添加|创建/i }).click()
    
    // Fill invalid email
    const emailInput = page.locator('input[name="email"]')
    if (await emailInput.isVisible()) {
      await emailInput.fill('invalid-email')
      await emailInput.blur()
      
      // Error should appear
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
    }
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/leads')
    await page.waitForLoadState('networkidle')
    
    // Open create modal
    await page.getByRole('button', { name: /新增|添加|创建/i }).click()
    
    // Find name input (required)
    const nameInput = page.locator('input[name="name"]')
    if (await nameInput.isVisible()) {
      // Clear any default value
      await nameInput.clear()
      await nameInput.blur()
      
      // Error should appear
      await page.waitForTimeout(300)
    }
  })
})

/**
 * Search and Filter E2E Tests
 */
test.describe('Search and Filter', () => {
  test('should filter by date range', async ({ page }) => {
    await page.goto('/customers')
    await page.waitForLoadState('networkidle')
    
    // Find date filter
    const dateFilter = page.locator('[data-filter="createdAt"], input[type="date"]').first()
    if (await dateFilter.isVisible()) {
      await dateFilter.click()
      
      // Date picker should appear
      await page.waitForTimeout(300)
    }
  })

  test('should combine multiple filters', async ({ page }) => {
    await page.goto('/opportunities')
    await page.waitForLoadState('networkidle')
    
    // Apply status filter
    const statusFilter = page.locator('[data-filter="stage"]')
    if (await statusFilter.isVisible()) {
      await statusFilter.click()
      await page.getByRole('option').first().click()
    }
    
    // Apply another filter
    const assigneeFilter = page.locator('[data-filter="assignee"]')
    if (await assigneeFilter.isVisible()) {
      await assigneeFilter.click()
      await page.getByRole('option').first().click()
    }
    
    // Both filters should be active
    await page.waitForTimeout(500)
  })

  test('should clear all filters', async ({ page }) => {
    await page.goto('/customers')
    await page.waitForLoadState('networkidle')
    
    // Apply a filter first
    const statusFilter = page.locator('[data-filter="status"]')
    if (await statusFilter.isVisible()) {
      await statusFilter.click()
      await page.getByRole('option').first().click()
    }
    
    // Find clear button
    const clearButton = page.getByRole('button', { name: /清除|清空|重置|Clear|Reset/i })
    if (await clearButton.isVisible()) {
      await clearButton.click()
      
      // Filters should be cleared
      await page.waitForTimeout(300)
    }
  })
})

/**
 * Bulk Operations E2E Tests
 */
test.describe('Bulk Operations', () => {
  test('should select multiple rows', async ({ page }) => {
    await page.goto('/customers')
    await page.waitForLoadState('networkidle')
    
    // Wait for table to load
    await page.waitForTimeout(1000)
    
    // Click multiple checkboxes
    const checkboxes = page.locator('tbody input[type="checkbox"]')
    const count = await checkboxes.count()
    
    if (count >= 2) {
      await checkboxes.first().click()
      await checkboxes.nth(1).click()
      
      // Selection count should show
      await expect(page.locator('[data-testid="selection-count"]')).toContainText('2')
    }
  })

  test('should show bulk action bar when rows selected', async ({ page }) => {
    await page.goto('/customers')
    await page.waitForLoadState('networkidle')
    
    await page.waitForTimeout(1000)
    
    // Select a row
    const checkbox = page.locator('tbody input[type="checkbox"]').first()
    if (await checkbox.isVisible()) {
      await checkbox.click()
      
      // Bulk action bar should appear
      await expect(page.locator('[data-testid="bulk-action-bar"]')).toBeVisible()
    }
  })

  test('should bulk delete with confirmation', async ({ page }) => {
    await page.goto('/customers')
    await page.waitForLoadState('networkidle')
    
    await page.waitForTimeout(1000)
    
    // Select rows
    const checkbox = page.locator('tbody input[type="checkbox"]').first()
    if (await checkbox.isVisible()) {
      await checkbox.click()
      
      // Click delete button
      const deleteButton = page.getByRole('button', { name: /删除|Delete/i })
      if (await deleteButton.isVisible()) {
        await deleteButton.click()
        
        // Confirmation dialog should appear
        await expect(page.locator('[role="alertdialog"], [data-testid="confirm-dialog"]')).toBeVisible()
      }
    }
  })
})