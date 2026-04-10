import { test, expect } from '@playwright/test'

/**
 * Customer Management E2E Tests
 * Tests cover customer list, detail, CRUD operations
 */

test.describe('Customer Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to customers page
    await page.goto('/customers')
    // Wait for page to be ready
    await page.waitForLoadState('networkidle')
  })

  test('should display customer list page', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('客户管理')
    
    // Check filter bar is visible
    await expect(page.locator('[data-testid="filter-bar"]')).toBeVisible()
    
    // Check table is visible
    await expect(page.locator('table')).toBeVisible()
    
    // Check add button exists
    await expect(page.getByRole('button', { name: /新增|添加|创建/i })).toBeVisible()
  })

  test('should navigate to customer detail', async ({ page }) => {
    // Wait for customer data to load
    await page.waitForTimeout(1000)
    
    // Click on first customer row (if exists)
    const firstRow = page.locator('tbody tr').first()
    if (await firstRow.isVisible()) {
      await firstRow.click()
      
      // Should navigate to detail page
      await expect(page).toHaveURL(/\/customers\/\d+/)
      
      // Check detail page elements
      await expect(page.locator('[data-testid="detail-layout"]')).toBeVisible()
    }
  })

  test('should open create customer modal', async ({ page }) => {
    // Click add button
    await page.getByRole('button', { name: /新增|添加|创建/i }).click()
    
    // Modal should open
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    
    // Check form elements
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="company"]')).toBeVisible()
  })

  test('should filter customers by status', async ({ page }) => {
    // Open status filter
    const statusFilter = page.locator('[data-filter="status"]')
    if (await statusFilter.isVisible()) {
      await statusFilter.click()
      
      // Select a status option
      await page.getByRole('option', { name: '活跃' }).click()
      
      // Table should update
      await page.waitForTimeout(500)
    }
  })

  test('should search customers', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="搜索"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('测试')
      await searchInput.press('Enter')
      
      // Wait for results
      await page.waitForTimeout(500)
    }
  })

  test('should export customers', async ({ page }) => {
    // Look for export button
    const exportButton = page.getByRole('button', { name: /导出|Export/i })
    if (await exportButton.isVisible()) {
      // Listen for download
      const downloadPromise = page.waitForEvent('download')
      await exportButton.click()
      const download = await downloadPromise
      
      // Check file was downloaded
      expect(download.suggestedFilename()).toMatch(/customers|客户/)
    }
  })
})

test.describe('Customer Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a specific customer detail
    await page.goto('/customers/1')
    await page.waitForLoadState('networkidle')
  })

  test('should display customer information', async ({ page }) => {
    // Check detail layout
    await expect(page.locator('[data-testid="detail-layout"]')).toBeVisible()
    
    // Check customer name is displayed
    await expect(page.locator('h2, [data-testid="customer-name"]')).toBeVisible()
  })

  test('should show related data tabs', async ({ page }) => {
    // Check tabs exist
    const tabs = page.locator('[role="tab"]')
    const tabCount = await tabs.count()
    
    expect(tabCount).toBeGreaterThan(0)
    
    // Try clicking different tabs
    const contactsTab = page.getByRole('tab', { name: /联系人|Contacts/i })
    if (await contactsTab.isVisible()) {
      await contactsTab.click()
      await page.waitForTimeout(300)
    }
  })

  test('should allow inline editing', async ({ page }) => {
    // Find an inline editable field
    const editableField = page.locator('[data-testid="inline-edit-field"]').first()
    if (await editableField.isVisible()) {
      // Hover to show edit icon
      await editableField.hover()
      
      // Click edit button
      const editIcon = editableField.locator('[data-testid="edit-icon"]')
      if (await editIcon.isVisible()) {
        await editIcon.click()
        
        // Input should appear
        await expect(editableField.locator('input')).toBeVisible()
      }
    }
  })
})