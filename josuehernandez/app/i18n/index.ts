import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from '@/node_modules/react-i18next/initReactI18next'
import { getOptions } from './settings'

export async function getServerTranslation(lng: string, ns?: string) {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => 
      import(`./locales/${language}/${namespace}.json`)
    ))
    .init(getOptions(lng, ns));

  return i18nInstance.getFixedT(lng, ns);
}