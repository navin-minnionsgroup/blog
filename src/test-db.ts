import { db } from "./db";

async function testDatabase() {
  const result = await db.execute("SELECT NOW()");

  console.log(result.rows);

  process.exit(0);
}

testDatabase();