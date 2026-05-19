"use server";

import { Prisma } from "@prisma/client";
import type { Currency } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cartLineKey, normalizeSizeLabel } from "@/lib/sizes";
import { FLAT_SHIPPING_FEE } from "@/lib/shipping";

const PAYMENT_METHODS = new Set(["paypal", "cod", "card", "bank", "payoneer"]);

function buildPayoneerRedirectUrl(
  orderNumber: string,
  total: Prisma.Decimal,
  currency: Currency,
): string | undefined {
  const template = process.env.PAYONEER_CHECKOUT_URL_TEMPLATE?.trim();
  if (!template) return undefined;
  const amountStr = total.toString();
  return template
    .replaceAll("{orderNumber}", encodeURIComponent(orderNumber))
    .replaceAll("{amount}", encodeURIComponent(amountStr))
    .replaceAll("{currency}", encodeURIComponent(currency));
}

export type CartLineInput = {
  productId: string;
  quantity: number;
  sizeLabel: string;
};

export type CartProductRow = {
  id: string;
  name: string;
  slug: string;
  price: string;
  currency: Currency;
  imageUrl: string | null;
};

/** Product info for cart lines (price from DB). */
export async function getCartProducts(ids: string[]): Promise<CartProductRow[]> {
  if (ids.length === 0) return [];
  const unique = [...new Set(ids)];
  const rows = await prisma.product.findMany({
    where: { id: { in: unique } },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      currency: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } },
    },
  });
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price.toString(),
    currency: p.currency,
    imageUrl: p.images[0]?.url ?? null,
  }));
}

function generateOrderNumber(): string {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${t}-${r}`;
}

export type CreateOrderResult =
  | { ok: true; orderId: string; orderNumber: string; payoneerRedirectUrl?: string }
  | { ok: false; message: string };

export type OrderSuccessDTO = {
  orderNumber: string;
  status: string;
  createdAt: Date;
  currency: Currency;
  customerName: string;
  email: string;
  address: string | null;
  paymentMethod: string;
  subtotal: string;
  shippingFee: string;
  total: string;
  items: {
    id: string;
    productId: string;
    productName: string;
    sizeLabel: string;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
    imageUrl: string | null;
  }[];
};

/** Chi tiết đơn cho trang thank-you (public, tra theo mã đơn). */
export async function getOrderPublicByNumber(orderNumber: string): Promise<OrderSuccessDTO | null> {
  const trimmed = orderNumber.trim();
  if (!trimmed) return null;
  const o = await prisma.order.findUnique({
    where: { orderNumber: trimmed },
    include: { items: { orderBy: { id: "asc" } } },
  });
  if (!o) return null;
  const productIds = [...new Set(o.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } },
    },
  });
  const imgByProductId = new Map(products.map((p) => [p.id, p.images[0]?.url ?? null]));

  return {
    orderNumber: o.orderNumber,
    status: o.status,
    createdAt: o.createdAt,
    currency: o.currency,
    customerName: o.customerName,
    email: o.email,
    address: o.address,
    paymentMethod: o.paymentMethod,
    subtotal: o.subtotal.toString(),
    shippingFee: o.shippingFee.toString(),
    total: o.total.toString(),
    items: o.items.map((it) => ({
      id: it.id,
      productId: it.productId,
      productName: it.productName,
      sizeLabel: it.sizeLabel,
      quantity: it.quantity,
      unitPrice: it.unitPrice.toString(),
      lineTotal: it.lineTotal.toString(),
      imageUrl: imgByProductId.get(it.productId) ?? null,
    })),
  };
}

function parseCartLines(raw: string): CartLineInput[] {
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("empty");
  }
  return parsed.map((row) => {
    if (
      row &&
      typeof row === "object" &&
      "productId" in row &&
      "quantity" in row &&
      typeof (row as CartLineInput).productId === "string" &&
      typeof (row as CartLineInput).quantity === "number"
    ) {
      const sizeLabel =
        "sizeLabel" in row && typeof (row as { sizeLabel?: unknown }).sizeLabel === "string"
          ? normalizeSizeLabel((row as { sizeLabel: string }).sizeLabel)
          : "";
      return {
        productId: (row as CartLineInput).productId,
        quantity: (row as CartLineInput).quantity,
        sizeLabel,
      };
    }
    throw new Error("bad");
  });
}

export async function createOrder(formData: FormData): Promise<CreateOrderResult> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const customerName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const companyName = String(formData.get("companyName") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "").trim();
  const addressLine1 = String(formData.get("addressLine1") ?? "").trim();
  const addressLine2 = String(formData.get("addressLine2") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim();
  const stateRegion = String(formData.get("stateRegion") ?? "").trim() || null;
  const postalCode = String(formData.get("postalCode") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const note = String(formData.get("note") ?? "").trim() || null;
  const paymentMethod = String(formData.get("paymentMethod") ?? "").trim();

  const addressParts = [
    companyName ? `Company: ${companyName}` : null,
    addressLine1,
    addressLine2,
    [city, stateRegion, postalCode].filter(Boolean).join(", ") || null,
    country,
  ].filter((x): x is string => Boolean(x));
  const address = addressParts.length > 0 ? addressParts.join("\n") : null;

  if (!firstName || !lastName) return { ok: false, message: "Please enter your first and last name." };
  if (!country) return { ok: false, message: "Please select a country / region." };
  if (!addressLine1) return { ok: false, message: "Please enter your street address." };
  if (!city) return { ok: false, message: "Please enter your city." };
  if (!PAYMENT_METHODS.has(paymentMethod)) {
    return { ok: false, message: "Please select a payment method." };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  let lines: CartLineInput[];
  try {
    const raw = String(formData.get("items") ?? "");
    lines = parseCartLines(raw);
  } catch {
    return { ok: false, message: "Invalid cart data." };
  }

  let merged = new Map<string, CartLineInput>();
  for (const l of lines) {
    const key = cartLineKey(l.productId, l.sizeLabel);
    const prev = merged.get(key);
    if (prev) {
      merged.set(key, { ...prev, quantity: prev.quantity + l.quantity });
    } else {
      merged.set(key, { ...l });
    }
  }
  lines = [...merged.values()];

  for (const l of lines) {
    if (l.quantity < 1 || l.quantity > 999) {
      return { ok: false, message: "Invalid quantity." };
    }
  }

  const ids = [...new Set(lines.map((l) => l.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
  });

  if (products.length !== ids.length) {
    return { ok: false, message: "Some products are no longer available. Please refresh your cart." };
  }

  const currency = products[0].currency;
  for (const p of products) {
    if (p.currency !== currency) {
      return { ok: false, message: "Orders cannot mix two currencies." };
    }
  }

  const lineRows: {
    productId: string;
    productName: string;
    sizeLabel: string;
    unitPrice: Prisma.Decimal;
    quantity: number;
    lineTotal: Prisma.Decimal;
  }[] = [];

  let subtotal = new Prisma.Decimal(0);

  for (const line of lines) {
    const p = products.find((x) => x.id === line.productId);
    if (!p) return { ok: false, message: "Product not found." };
    const unit = new Prisma.Decimal(p.price.toString());
    const lineTotal = unit.mul(line.quantity);
    subtotal = subtotal.add(lineTotal);
    const size = normalizeSizeLabel(line.sizeLabel);
    const displayName =
      size.length > 0 ? `${p.name} (${size})` : p.name;
    lineRows.push({
      productId: p.id,
      productName: displayName,
      sizeLabel: size,
      unitPrice: unit,
      quantity: line.quantity,
      lineTotal,
    });
  }

  const shippingFee = new Prisma.Decimal(FLAT_SHIPPING_FEE[currency]);
  const total = subtotal.add(shippingFee);

  let orderNumber = generateOrderNumber();
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const order = await prisma.$transaction(async (tx) => {
        for (const line of lines) {
          const size = normalizeSizeLabel(line.sizeLabel);
          const updated = await tx.productSizeStock.updateMany({
            where: {
              productId: line.productId,
              sizeLabel: size,
              quantity: { gte: line.quantity },
            },
            data: { quantity: { decrement: line.quantity } },
          });
          if (updated.count === 0) {
            throw new Error("INSUFFICIENT_STOCK");
          }
        }

        return tx.order.create({
          data: {
            orderNumber,
            currency,
            customerName,
            email,
            phone,
            address,
            note,
            subtotal,
            shippingFee,
            paymentMethod,
            total,
            items: {
              create: lineRows.map((r) => ({
                productId: r.productId,
                productName: r.productName,
                sizeLabel: r.sizeLabel,
                unitPrice: r.unitPrice,
                quantity: r.quantity,
                lineTotal: r.lineTotal,
              })),
            },
          },
        });
      });

      const payoneerRedirectUrl =
        paymentMethod === "payoneer"
          ? buildPayoneerRedirectUrl(order.orderNumber, total, currency)
          : undefined;

      return {
        ok: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        ...(payoneerRedirectUrl ? { payoneerRedirectUrl } : {}),
      };
    } catch (e) {
      if (e instanceof Error && e.message === "INSUFFICIENT_STOCK") {
        return { ok: false, message: "Not enough stock for one or more items. Refresh your cart and try again." };
      }
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        orderNumber = generateOrderNumber();
        continue;
      }
      console.error(e);
      return { ok: false, message: "Could not place the order. Please try again." };
    }
  }

  return { ok: false, message: "Could not generate an order number. Please try again." };
}
