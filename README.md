This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

<img src="./public/images/banner.png" alt="Preview" width="500"/>

## Getting Started

Add a MONGODB_URI variable in your .env file:

```bash
MONGODB_URI= Your MongoDb URI
```

Add a OPENROUTER_API_KEY variable in your .env file:

```bash
OPENROUTER_API_KEY= Your OpenRouter Ai api-key
```

## Note

This project uses this package for getting anime data:

- [aniwatch-api](https://github.com/ghoshRitesh12/aniwatch-api) - Please Deploy Your Own Backend for fetching data for better performance and set the url in the env file.

```bash
NEXT_PUBLIC_ANIWATCH_URL= Your Deployed Backend URL
```

Also create an Database on Upstash and save these envs also (for rate limiting) :

```bash
UPSTASH_REDIS_REST_URL=https://example-url-12321.upstash.io
UPSTASH_REDIS_REST_TOKEN=Your Redis Token
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
