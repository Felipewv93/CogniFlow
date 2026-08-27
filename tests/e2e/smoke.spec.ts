import { test, expect } from '@playwright/test';

test.describe('Smoke - páginas principais', () => {
  const pages = [
    { path: '/', heading: 'Desbloqueie Sua' },
    { path: '/auth/login', heading: 'Bem-vindo de volta' },
    { path: '/auth/signup', heading: 'Criar conta' },
    { path: '/generator', heading: 'Gerador de Ideias com IA' },
    { path: '/dashboard' },
    { path: '/teams' },
    { path: '/settings' },
  ];

  for (const item of pages) {
    test(`carrega ${item.path} sem erro`, async ({ page }) => {
      const response = await page.goto(item.path, { waitUntil: 'domcontentloaded' });

      expect(response).not.toBeNull();
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator('body')).not.toContainText('Application error');
      await expect(page.locator('body')).not.toContainText('client-side exception');

      if (item.heading) {
        await expect(page.locator('h1')).toContainText(item.heading);
      }
    });
  }
});
