'use client'

import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { getOptions } from './settings'
import { useEffect } from 'react'

// 
i18next
  .use(initReactI18next)
  .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
  .init(getOptions())

export function useTranslation(lng: string, ns?: string, options?: { keyPrefix?: string }) {
  const ret = useTranslationOrg(ns, options)
  
  useEffect(() => {
    if (i18next.resolvedLanguage !== lng) {
      i18next.changeLanguage(lng)
    }
  }, [lng])
  
  return ret
}