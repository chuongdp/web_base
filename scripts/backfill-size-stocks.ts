/**
 * One-off: ensure every product has ProductSizeStock rows matching sizes field,
 * or a single "" row when there are no sizes.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parseSizesList(raw: string | null): string[] {
  if (raw == null || !String(raw).trim()) return [];
  return String(raw)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, sizes: true } });
  for (const p of products) {
    const labels = parseSizesList(p.sizes);
    const want = labels.length > 0 ? labels : [""];
    await prisma.productSizeStock.deleteMany({ where: { productId: p.id } });
    await prisma.productSizeStock.createMany({
      data: want.map((sizeLabel) => ({
        productId: p.id,
        sizeLabel,
        quantity: 0,
      })),
    });
  }
  console.log(`Backfilled size stocks for ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
