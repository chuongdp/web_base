import { CollectionConfigForm } from "@/components/admin/CollectionConfigForm";
import { getCollectionConfig } from "@/lib/collection-config";

export const dynamic = "force-dynamic";

export default async function AdminCollectionConfigPage() {
  const config = await getCollectionConfig();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Cấu hình Collection</h1>
      <p className="mt-1 max-w-2xl text-sm text-zinc-600">
        Thiết lập chung cho khối danh mục trên trang chủ và kiểu hiển thị mặc định. Từng danh mục có thể ghi đè hoặc
        chọn &quot;Kế thừa&quot; để dùng mặc định ở đây.
      </p>
      <div className="mt-8 max-w-lg">
        <CollectionConfigForm initial={config} />
      </div>
    </div>
  );
}
