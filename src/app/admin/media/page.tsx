import { MediaLibraryClient } from "@/components/admin/MediaLibraryClient";
import { listMediaAssets } from "@/app/actions/mediaActions";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const items = await listMediaAssets();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Media</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Quản lý ảnh upload để dùng trong sản phẩm, cấu hình site, favicon (copy URL).
      </p>
      <div className="mt-8">
        <MediaLibraryClient items={items} />
      </div>
    </div>
  );
}
