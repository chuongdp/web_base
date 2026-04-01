"use client";

export type ContactFormProps = {
  pageTitle: string;
  intro: string;
  email: string;
  phone: string;
  address: string;
  mapEmbedUrl: string;
};

function isGoogleMapsEmbedUrl(url: string): boolean {
  const t = url.trim();
  if (!t) return false;
  try {
    const u = new URL(t);
    if (u.protocol !== "https:") return false;
    const h = u.hostname.toLowerCase();
    return (
      (h === "www.google.com" || h === "maps.google.com") &&
      u.pathname.startsWith("/maps/embed")
    );
  } catch {
    return false;
  }
}

export function ContactForm({
  pageTitle,
  intro,
  email,
  phone,
  address,
  mapEmbedUrl,
}: ContactFormProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  const mailHref = email.startsWith("mailto:") ? email : `mailto:${email}`;
  const telDigits = phone.replace(/\s/g, "");
  const telHref = telDigits.startsWith("tel:") ? telDigits : `tel:${telDigits}`;
  const showMap = isGoogleMapsEmbedUrl(mapEmbedUrl);
  const addressTrimmed = address.trim();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:max-w-6xl lg:py-16">
      <h1 className="text-center font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
        {pageTitle}
      </h1>

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-6 text-zinc-700">
          <p className="text-sm leading-relaxed text-zinc-600">{intro}</p>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Email</p>
            <a href={mailHref} className="mt-1 block text-sm font-medium text-zinc-900 hover:underline">
              {email.replace(/^mailto:/i, "")}
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Phone</p>
            <a href={telHref} className="mt-1 block text-sm font-medium text-zinc-900 hover:underline">
              {phone.replace(/^tel:/i, "")}
            </a>
          </div>
          {addressTrimmed ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Address</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600 whitespace-pre-line">{addressTrimmed}</p>
            </div>
          ) : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 sm:p-8"
        >
          <div>
            <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-zinc-800">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-zinc-800">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-zinc-800">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:w-auto"
          >
            Send
          </button>
        </form>
      </div>

      {showMap ? (
        <section className="mt-14" aria-labelledby="contact-map-heading">
          <h2
            id="contact-map-heading"
            className="mb-4 text-center font-serif text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl"
          >
            Map
          </h2>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm ring-1 ring-zinc-200/80">
            <div className="relative aspect-[16/10] min-h-[220px] w-full sm:min-h-[280px]">
              <iframe
                title="Store location map"
                src={mapEmbedUrl.trim()}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
