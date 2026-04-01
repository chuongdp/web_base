import Link from "next/link";

export const dynamic = "force-dynamic";

const cards = [
  {
    href: "/admin/collections",
    title: "Cấu hình Collection",
    desc: "Preset mặc định, tiêu đề khối trang chủ.",
  },
  {
    href: "/admin/product-collections",
    title: "Bộ sưu tập",
    desc: "Tạo collection, gán sản phẩm từ mục Sản phẩm.",
  },
  {
    href: "/admin/categories",
    title: "Danh mục",
    desc: "Thêm, sửa, xóa danh mục sản phẩm.",
  },
  {
    href: "/admin/products",
    title: "Sản phẩm",
    desc: "Quản lý sản phẩm, giá và ảnh (URL).",
  },
  {
    href: "/admin/settings",
    title: "Cài đặt giao diện",
    desc: "Tên site, logo, màu chủ đạo, banner.",
  },
] as const;

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Bảng điều khiển</h1>
      <p className="mt-1 text-sm text-zinc-600">Chọn mục bên dưới để quản trị nội dung.</p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="block rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow"
            >
              <h2 className="font-medium text-zinc-900">{c.title}</h2>
              <p className="mt-2 text-sm text-zinc-600">{c.desc}</p>
              <span className="mt-3 inline-block text-sm font-medium text-zinc-800">Mở →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
