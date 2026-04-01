import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      siteName: "My Local Store",
      logoUrl: null,
      primaryColor: "#000000",
      bannerText: null,
      defaultCurrency: "USD",
    },
    update: {
      siteName: "My Local Store",
      logoUrl: null,
      primaryColor: "#000000",
      bannerText: null,
      defaultCurrency: "USD",
    },
  });

  console.log("Seed SiteSetting id=1: My Local Store");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
