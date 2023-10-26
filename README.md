This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1. Make a copy of the example `.env` file:

```shell
cp .env.example .env.local
```

- Replace any relevant values in your `.gitignore`d `.env.local` file. 

2. Run the development server:

```shell
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

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