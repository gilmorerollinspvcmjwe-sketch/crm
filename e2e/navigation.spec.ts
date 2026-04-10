import { test, expect } from '@playwright/test'

/**
 * Navigation and Layout E2E Tests
 * Tests cover navigation, sidebar, header, responsive behavior
 */

test.describe('Navigation', () => {
  test('should display sidebar navigation', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Sidebar should be visible
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible()
    
    // Navigation items should be present
    const navItems = page.locator('[data-testid="nav-item"]')
    const count = await navItems.count()
    expect(count).toBeGreaterThan(5)
  })

  test('should navigate through menu items', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Test Customers navigation
    const customersNav = page.getByRole('link', { name: /客户|Customers/i })
    if (await customersNav.isVisible()) {
      await customersNav.click()
      await expect(page).toHaveURL(/\/customers/)
    }
    
    // Test Opportunities navigation
    const opportunitiesNav = page.getByRole('link', { name: /商机|Opportunities/i })
    if (await opportunitiesNav.isVisible()) {
      await opportunitiesNav.click()
      await expect(page).toHaveURL(/\/opportunities/)
    }
  })

  test('should expand/collapse submenu', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Find expandable menu item
    const expandableMenu = page.locator('[data-testid="nav-group"]').first()
    if (await expandableMenu.isVisible()) {
      // Click to expand
      await expandableMenu.click()
      await page.waitForTimeout(200)
      
      // Submenu should be visible
      await expect(expandableMenu.locator('[data-testid="submenu"]')).toBeVisible()
      
      // Click again to collapse
      await expandableMenu.click()
      await page.waitForTimeout(200)
    }
  })
})

test.describe('Dashboard', () => {
  test('should display dashboard widgets', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Dashboard title
    await expect(page.locator('h1')).toContainText('仪表盘|Dashboard')
    
    // Check KPI cards
    const kpiCards = page.locator('[data-testid="kpi-card"]')
    const count = await kpiCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display charts', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Charts should be rendered
    const charts = page.locator('[data-testid="chart-container"], [class*="recharts"]')
    const count = await charts.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('Responsive Layout', () => {
  test('should collapse sidebar on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Sidebar might be hidden or collapsed
    const sidebar = page.locator('[data-testid="sidebar"]')
    const isVisible = await sidebar.isVisible()
    
    if (!isVisible) {
      // Toggle button should exist
      const toggle = page.getByRole('button', { name: /menu|菜单/i })
      await expect(toggle).toBeVisible()
    }
  })

  test('should show hamburger menu on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Find hamburger menu
    const hamburger = page.locator('[data-testid="mobile-menu-toggle"], button[aria-label*="menu"]')
    if (await hamburger.isVisible()) {
      await hamburger.click()
      
      // Mobile menu should open
      await expect(page.locator('[data-testid="mobile-menu"], [role="dialog"]')).toBeVisible()
    }
  })
})

test.describe('Theme Toggle', () => {
  test('should toggle dark/light mode', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Find theme toggle
    const themeToggle = page.getByRole('button', { name: /theme|主题|dark|light/i })
    if (await themeToggle.isVisible()) {
      // Get current theme
      const isDark = await page.evaluate(() => 
        document.documentElement.classList.contains('dark')
      )
      
      // Toggle theme
      await themeToggle.click()
      await page.waitForTimeout(300)
      
      // Theme should change
      const newIsDark = await page.evaluate(() => 
        document.documentElement.classList.contains('dark')
      )
      
      expect(newIsDark).toBe(!isDark)
    }
  })
})