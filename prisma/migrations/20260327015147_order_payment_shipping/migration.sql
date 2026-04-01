-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_number" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "customer_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "note" TEXT,
    "subtotal" DECIMAL NOT NULL DEFAULT 0,
    "shipping_fee" DECIMAL NOT NULL DEFAULT 0,
    "payment_method" TEXT NOT NULL DEFAULT 'cod',
    "total" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_orders" ("address", "created_at", "currency", "customer_name", "email", "id", "note", "order_number", "phone", "status", "total", "updated_at") SELECT "address", "created_at", "currency", "customer_name", "email", "id", "note", "order_number", "phone", "status", "total", "updated_at" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
