import { Locator, Page, expect, test } from '@playwright/test';

async function goToHardware(page: Page) {
    await page.goto('/');
    await page.click('text=Hardware');
    await page.waitForURL("/hardware/request");
    await page.waitForLoadState("networkidle");
}

async function requestHardware(page: Page, { reason, id = 0 }: {reason: string, id?: number}) {
    const card = await page.getByTestId(`hardware-request-hardware-${id}`);
    await card.getByPlaceholder("Reason for request").fill(reason);
    await card.getByRole('button', { name: 'Request' }).click();
    return {
        reason,
        hardware: {
            name: await card.getByTitle("Hardware name").textContent()
        }
    }
}

async function openOwnHardware(page: Page) {
    await page.getByText("Your requested hardware").click();
    await page.waitForURL("/hardware/requested");
    const table = await page.getByRole("table").first().waitFor();
    await page.waitForLoadState("networkidle");
}

async function getPageHardwareRequests({page, knownElements}: {page: Page, knownElements: number}) {
    const table = await page.getByRole("table").first();
    await table.getByRole("row").nth(knownElements + 1).waitFor();

    const [header, ...rows] = await table.getByRole("row").all();
    const headerCells = header.getByRole("cell");
    expect(headerCells.getByText("Item")).not.toBeEmpty();
    const headerNames = await Promise.all((await headerCells.all()).map(cell => cell.textContent()));
    console.log(headerNames);

    return await Promise.all(rows.map(async row => {
        const cells = row.getByRole("cell");
        const rowByHeader = (headerName: string) => cells.nth(headerNames.indexOf(headerName));
        await page.waitForTimeout(2000);
        // reason guaranteed to be non-empty
        await expect(rowByHeader("Reason")).not.toBeEmpty();
        console.log(await rowByHeader("Reason").innerText());
        return {
            reason: await rowByHeader("Reason").innerText(),
            hardware: {
                name: await rowByHeader("Item").innerText()
            }
        }
    }))
}

test.describe(() => {
  test.use({ storageState: 'playwright/.auth/attendee.json' });

  test('able to load hardware page', async ({ page }) => {
    await goToHardware(page);
  });

  test('can request hardware', async ({ page }) => {
    await goToHardware(page);
    await requestHardware(page, { reason: "Hardware request creation test" });
  });

  test('can delete hardware requests', async ({ page }) => {
    await goToHardware(page);
    const request = await requestHardware(page, { reason: "Hardware request deletion test" });
    await openOwnHardware(page);
    const hardwareRequestsTable = await getPageHardwareRequests({page, knownElements: 1});
    console.log(request);
    console.log(hardwareRequestsTable);
    expect(hardwareRequestsTable.some(tableRequest => (
        tableRequest.reason === request.reason &&
        tableRequest.hardware.name === request.hardware.name
    ))).toBeTruthy();
  });
});
