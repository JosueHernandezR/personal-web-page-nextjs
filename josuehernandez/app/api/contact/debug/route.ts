import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    smtp: {
      host: process.env.SMTP_HOST ? 'Configurado' : 'NO configurado',
      port: process.env.SMTP_PORT ? 'Configurado' : 'NO configurado',
      user: process.env.SMTP_USER ? 'Configurado' : 'NO configurado',
      password: process.env.SMTP_PASSWORD ? 'Configurado' : 'NO configurado',
      contactEmail: process.env.CONTACT_EMAIL ? 'Configurado' : 'NO configurado',
    },
    recaptcha: {
      secretKey: process.env.RECAPTCHA_SECRET_KEY ? 'Configurado' : 'NO configurado',
      siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? 'Configurado' : 'NO configurado',
    },
    timestamp: new Date().toISOString(),
  });
} 