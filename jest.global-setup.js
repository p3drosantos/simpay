import { execSync } from "child_process"

export default async function () {
  execSync("docker compose up -d --wait postgres-test")
  await new Promise((resolve) => setTimeout(resolve, 3000))
  execSync("npx dotenv -e .env.test -- drizzle-kit migrate")
}
