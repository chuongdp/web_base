-- CreateTable
CREATE TABLE "product_size_stocks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT NOT NULL,
    "size_label" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "product_size_stocks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "product_size_stocks_product_id_size_label_key" ON "product_size_stocks"("product_id", "size_label");

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN "size_label" TEXT NOT NULL DEFAULT '';
