This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1. Make a copy of the example `.env.example` file:

```shell
cp .env.example .env.development.local
```

- Replace any relevant values in your `.gitignore`d `.env.development.local` file. 

2. Run the development server:

```shell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Type Generation

In order to generate types from the backend, run `npm run gen-types`. It will fetch the types from the dev environment and write them to schema.d.ts.

## Formatting

If using VS Code, use the following plugins so you can see inline linting errors:

ESLint: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
Prettier: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
Prettier ESLint: https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint

Follow these steps to enable linting of files on save for VS Code. https://www.digitalocean.com/community/tutorials/workflow-auto-eslinting#step-4-adding-code-actions-on-save

TLDR: You will want to add the following to your `.vscode/settings.json`:
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript"]
}
```

Refer to https://prettier.io/docs/en/editors and https://eslint.org/docs/latest/use/integrations if using another editor.

Before committing changes, run `npm run lint:fix` to fix any lint errors and format files.

## Debugging with Visual Studio Code

Debugging with the standard NodeJS debugger does not allow for `await` or other types of `async` patterns to be used.

1. In your VS Code editor, click "Run and Debug" in your left toolbar.
2. In the top-left of your editor window, select `Next.js: debug full stack` from the drop-down next to the green "play" icon.
3. Click the green "play" icon.

## Testing

We use [Playwright](https://playwright.dev) to run our end-to-end tests.

To run tests, you will need to spin up an instance of the backend. Clone the [event-server repo](https://codeberg.org/reality-hack-inc/realityhack.world-backend/), and follow the instructions to spin up the docker instance. They are copied below for clarity.

```shell
./build-image.sh
docker compose up
```

### Running Tests

To run tests, use the following commands:

First, run `npx playwright install` to setup playwright

`npm run test` to run all tests headless

`npm run test:debug` to debug writing tests

Checkout out [Playwright's documentation](https://playwright.dev/docs/writing-tests) to get started writing tests.

Currently we have a test admin user and a test participant (attendee) user, each with their own auth tokens stored for the duration of the tests. You can import the proper auth file for your tests as follows:

```javascript
import { test } from '@playwright/test';
import { adminAuthFile } from '../auth.setup';

test.describe(() => {
  test.use({ storageState: adminAuthFile });

  test('can see page as admin', async ({ page }) => {
    // Signed in as admin in these tests
  });
});
```