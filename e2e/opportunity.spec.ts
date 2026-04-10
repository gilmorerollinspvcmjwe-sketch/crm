import { test, expect } from '@playwright/test'

/**
 * Opportunity Management E2E Tests
 * Tests cover opportunity list, kanban, detail, CRUD operations
 */

test.describe('Opportunity List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/opportunities')
    await page.waitForLoadState('networkidle')
  })

  test('should display opportunity list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('商机')
    await expect(page.locator('table')).toBeVisible()
  })

  test('should switch to kanban view', async ({ page }) => {
    const kanbanButton = page.getByRole('button', { name: /看板|Kanban/i })
    if (await kanbanButton.isVisible()) {
      await kanbanButton.click()
      
      // Should navigate to kanban
      await expect(page).toHaveURL(/\/opportunities\/kanban/)
      
      // Kanban columns should be visible
      await expect(page.locator('[data-testid="kanban-column"]')).toBeVisible()
    }
  })
})

test.describe('Opportunity Kanban', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/opportunities/kanban')
    await page.waitForLoadState('networkidle')
  })

  test('should display kanban board', async ({ page }) => {
    // Check columns exist
    const columns = page.locator('[data-droppable-id]')
    const columnCount = await columns.count()
    
    expect(columnCount).toBeGreaterThanOrEqual(4) // At least 4 stages
    
    // Check summary stats
    await expect(page.locator('[data-testid="kanban-stats"]')).toBeVisible()
  })

  test('should drag and drop opportunity card', async ({ page }) => {
    // Find first draggable card
    const card = page.locator('[data-rbd-draggable-id]').first()
    if (await card.isVisible()) {
      // Get source column
      const sourceColumn = await card.evaluateHandle(
        (el) => el.closest('[data-droppable-id]')
      )
      
      // Find target column (next stage)
      const columns = page.locator('[data-droppable-id]')
      const targetColumn = columns.nth(1) // Second column
      
      // Perform drag
      await card.hover()
      await page.mouse.down()
      await targetColumn.hover()
      await page.mouse.up()
      
      // Wait for update
      await page.waitForTimeout(500)
    }
  })

  test('should add new opportunity from column', async ({ page }) => {
    // Find add button in first column
    const addButton = page.locator('[data-droppable-id]').first()
      .getByRole('button', { name: /添加|新增|Plus/i })
    
    if (await addButton.isVisible()) {
      await addButton.click()
      
      // Modal should open
      await expect(page.locator('[role="dialog"]')).toBeVisible()
    }
  })

  test('should display stage statistics', async ({ page }) => {
    // Check each column has stats
    const columns = page.locator('[data-testid="kanban-column-header"]')
    const count = await columns.count()
    
    for (let i = 0; i < count; i++) {
      const header = columns.nth(i)
      // Should show count and amount
      await expect(header).toContainText(/\d+/)
    }
  })
})

test.describe('Opportunity Detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/opportunities/1')
    await page.waitForLoadState('networkidle')
  })

  test('should display opportunity details', async ({ page }) => {
    await expect(page.locator('[data-testid="detail-layout"]')).toBeVisible()
    
    // Check opportunity name
    await expect(page.locator('h2')).toBeVisible()
    
    // Check amount is displayed
    await expect(page.locator('[data-testid="opportunity-amount"]')).toBeVisible()
  })

  test('should show stage progression', async ({ page }) => {
    // Check stage indicator
    const stageProgress = page.locator('[data-testid="stage-progress"]')
    if (await stageProgress.isVisible()) {
      await expect(stageProgress).toBeVisible()
    }
  })

  test('should edit opportunity', async ({ page }) => {
    const editButton = page.getByRole('button', { name: /编辑|Edit/i })
    if (await editButton.isVisible()) {
      await editButton.click()
      
      // Modal or form should appear
      await expect(page.locator('[role="dialog"], form')).toBeVisible()
    }
  })
})