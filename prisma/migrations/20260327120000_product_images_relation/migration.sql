-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "product_id" TEXT NOT NULL,
    CONSTRAINT "images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "images_product_id_idx" ON "images"("product_id");

-- Migrate existing image_url → images (một ảnh / sản phẩm, sort_order = 0)
INSERT INTO "images" ("id", "url", "sort_order", "product_id")
SELECT lower(hex(randomblob(16))), trim("image_url"), 0, "id"
FROM "products"
WHERE "image_url" IS NOT NULL AND trim("image_url") <> '';

-- RedefineTables: bỏ cột image_url khỏi products
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "category_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_products" ("category_id", "created_at", "currency", "description", "id", "name", "price", "slug", "updated_at")
SELECT "category_id", "created_at", "currency", "description", "id", "name", "price", "slug", "updated_at" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");
CREATE INDEX "products_category_id_idx" ON "products"("category_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
