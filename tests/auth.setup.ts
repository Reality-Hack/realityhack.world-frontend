import { test as setup } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export const adminAuthFile = 'playwright/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/signin');
  await page.getByLabel(/mail/).fill('admin');
  await page.getByLabel('Password', { exact: true }).fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('/');

  await page.context().storageState({ path: adminAuthFile });
});

export const attendeeAuthFile = 'playwright/.auth/attendee.json';

setup('authenticate as attendee', async ({ page }) => {
  await page.goto('/signin');
  await page.getByLabel(/mail/).fill('attendee@test.com');
  await page.getByLabel('Password', { exact: true }).fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('/');

  await page.waitForLoadState("networkidle");
  const hidden = await page.getByText('Click to upload').isHidden();
  if(!hidden) {
    await page.getByTestId("initial-setup-profile-image").setInputFiles(
      path.join(path.dirname(__dirname), "public/images/RH-logo-color.png"));

    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForURL('/');
  }

  await page.context().storageState({ path: attendeeAuthFile });
});
