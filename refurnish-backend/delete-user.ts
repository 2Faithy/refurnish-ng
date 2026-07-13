import { prisma } from "./src/config/prisma";

async function main() {
  const deleted = await prisma.user.deleteMany({
    where: { email: "faithonwuemeri2008@gmail.com" },
  });
  console.log(`Deleted ${deleted.count} user(s)`);
}

main().finally(() => prisma.$disconnect());
