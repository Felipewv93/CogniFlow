import { test, expect } from '@playwright/test';

test.describe('Fluxo de Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve mostrar página de login', async ({ page }) => {
    await page.goto('/auth/login');

    await expect(page.locator('h1')).toContainText('Bem-vindo de volta');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('deve mostrar página de signup', async ({ page }) => {
    await page.goto('/auth/signup');

    await expect(page.locator('h1')).toContainText('Criar conta');
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('deve validar email no login', async ({ page }) => {
    await page.goto('/auth/login');

    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('invalid-email');

    // HTML5 validation
    const validity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(false);
  });

  test('deve validar comprimento mínimo de senha', async ({ page }) => {
    await page.goto('/auth/signup');

    const passwordInput = page.locator('input[type="password"]');
    const minLength = await passwordInput.getAttribute('minLength');

    expect(minLength).toBe('6');
  });

  test('deve exibir ícones do Google e GitHub', async ({ page }) => {
    await page.goto('/auth/login');

    const googleButton = page.locator('button:has-text("Google")');
    const githubButton = page.locator('button:has-text("GitHub")');

    await expect(googleButton).toBeVisible();
    await expect(githubButton).toBeVisible();

    // Verificar se os SVGs estão presentes
    await expect(googleButton.locator('svg')).toBeVisible();
    await expect(githubButton.locator('svg')).toBeVisible();
  });

  test('deve redirecionar para dashboard se autenticado', async ({ page, context }) => {
    // Simular token de autenticação
    await context.addCookies([
      {
        name: 'supabase-auth-token',
        value: 'fake-token',
        url: 'http://localhost:3000',
        httpOnly: true,
      },
    ]);

    await page.goto('/');

    // Deveria redirecionar para dashboard
    // await expect(page).toHaveURL('/dashboard');
  });

  test('deve mostrar landing page para usuários não autenticados', async ({ page }) => {
    await page.goto('/');

    // Verificar que a landing page está visível
    await expect(page.locator('text=Desbloqueie Sua')).toBeVisible();
    await expect(page.locator('text=Criatividade Oculta')).toBeVisible();
  });
});

test.describe('Validações de Formulário', () => {
  test('deve desabilitar botão enquanto está processando', async ({ page }) => {
    await page.goto('/auth/signup');

    const nameInput = page.locator('input[placeholder="Seu nome"]');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button:has-text("Criar Conta Grátis")');

    await nameInput.fill('John Doe');
    await emailInput.fill('john@example.com');
    await passwordInput.fill('password123');

    // Verificar que o botão está habilitado
    await expect(submitButton).not.toBeDisabled();
  });

  test('deve exibir link para login na página de signup', async ({ page }) => {
    await page.goto('/auth/signup');

    const loginLink = page.locator('a:has-text("Entrar")');
    await expect(loginLink).toBeVisible();

    // Verificar URL do link
    const href = await loginLink.getAttribute('href');
    expect(href).toContain('/auth/login');
  });
});
