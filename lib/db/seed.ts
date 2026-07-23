// NOTE: Uncomment when bcryptjs and drizzle-orm are installed
/*
import { db } from "./index";
import { users } from "./schema";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding started...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await db.insert(users).values({
    name: "Administrator",
    email: "admin@imtihan.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("Default admin user created: admin@imtihan.com / admin123");
  console.log("Seeding complete!");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
*/
