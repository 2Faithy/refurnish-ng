import dotenv from "dotenv";
dotenv.config();

import { prisma } from "./src/config/prisma";

const EMAIL_TO_CLEAR = "faithonwuemeri2008@gmail.com";

async function main() {
  const user = await prisma.user.findUnique({ where: { email: EMAIL_TO_CLEAR } });

  if (!user) {
    console.log(`No user found with email: ${EMAIL_TO_CLEAR}`);
    return;
  }

  const deletedListings = await prisma.listing.deleteMany({
    where: { sellerId: user.id },
  });
  console.log(`Deleted ${deletedListings.count} listing(s) for this user.`);

  await prisma.user.delete({ where: { id: user.id } });
  console.log(`Deleted user: ${user.email} (id: ${user.id})`);
}

main()
  .catch((err) => {
    console.error("Error clearing user:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
