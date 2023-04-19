import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/edge";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  vite: {
    build: {
      rollupOptions: {
        external: ["nock", "aws-sdk", "mock-aws-s3"],
      },
    },
    ssr: {
      rollupOptions: {
        external: ["nock", "aws-sdk", "mock-aws-s3"],
      },
    },
  },
});
