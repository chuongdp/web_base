import { getSiteSetting } from "@/app/actions/settingActions";
import { ContactForm } from "@/components/storefront/ContactForm";
import { CONTACT_CONTENT_DEFAULTS } from "@/lib/storefront-content-defaults";

export const revalidate = 60;

export default async function ContactPage() {
  const s = await getSiteSetting();
  const d = CONTACT_CONTENT_DEFAULTS;

  return (
    <ContactForm
      pageTitle={s?.contactPageTitle ?? d.pageTitle}
      intro={s?.contactIntro ?? d.intro}
      email={s?.contactEmail ?? d.email}
      phone={s?.contactPhone ?? d.phone}
      address={s?.contactAddress ?? d.address}
      mapEmbedUrl={s?.contactMapEmbedUrl ?? d.mapEmbedUrl}
    />
  );
}
