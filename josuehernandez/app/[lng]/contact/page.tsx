import ContactFormClient from "./ContactFormClient";

export default async function ContactPage({
  params,
}: {
  params: Promise<{
    lng: string;
  }>;
}) {
  await params; // Para evitar el warning de parámetro no usado
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  return <ContactFormClient recaptchaSiteKey={RECAPTCHA_SITE_KEY} />;
}
