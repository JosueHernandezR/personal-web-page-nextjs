'use client';

import { useState } from 'react';
import { FadeIn, FadeInStagger } from '@/components/ui/Fade';
import { ReCaptchaWrapper, useReCaptcha } from '@/components/ui/ReCaptchaWrapper';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '../../i18n/client';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  budget: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  phone?: string;
  message?: string;
  budget?: string;
  general?: string;
}

const ContactForm = () => {
  const { lng } = useLanguage();
  const { t } = useTranslation(lng, 'contact');

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    budget: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { executeRecaptcha, isLoaded } = useReCaptcha();

  // Validación de formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('form.firstName.error.required');
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = t('form.firstName.error.maxLength');
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('form.lastName.error.required');
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = t('form.lastName.error.maxLength');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t('form.email.error.required');
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t('form.email.error.invalid');
    }

    // Validar mensaje
    if (!formData.message.trim()) {
      newErrors.message = t('form.message.error.required');
    } else if (formData.message.length > 500) {
      newErrors.message = t('form.message.error.maxLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!isLoaded) {
      setErrors({
        general: t('errors.recaptchaNotReady'),
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Ejecutar reCAPTCHA
      const recaptchaToken = await executeRecaptcha('contact_form');
      
      if (!recaptchaToken) {
        setErrors({
          general: t('errors.securityVerification'),
        });
        return;
      }

      // Preparar datos para la API
      const apiData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        subject: `Nuevo mensaje${formData.company ? ` de ${formData.company}` : ''}`,
        message: `${formData.message}${formData.phone ? `\n\nTeléfono de contacto: ${formData.phone}` : ''}${formData.company ? `\nEmpresa: ${formData.company}` : ''}`,
        recaptchaToken
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          phone: '',
          message: '',
          budget: '',
        });
      } else {
        setErrors({
          general: data.error || t('errors.general'),
        });
      }
    } catch {
      setErrors({
        general: t('errors.connectionError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mensaje de éxito
  if (isSuccess) {
    return (
      <div className="relative bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <FadeIn>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-3">
                {t('success.title')}
              </h3>
              <p className="text-green-600 dark:text-green-300 mb-6">
                {t('success.description')}
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl transition-colors font-semibold"
              >
                {t('success.button')}
              </button>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="lg:absolute lg:inset-0 lg:left-1/2">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=2560&h=3413&&q=80"
          className="h-64 w-full bg-gray-50 object-cover sm:h-80 lg:absolute lg:h-full"
        />
      </div>
      <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:pt-32">
        <div className="px-6 lg:px-8">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <FadeInStagger>
              <FadeIn>
                <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-white sm:text-5xl">
                  {t('title')}
                </h2>
              </FadeIn>
              <FadeIn>
                <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-300">
                  {t('description')}
                </p>
              </FadeIn>

              {/* Error general */}
              {errors.general && (
                <FadeIn>
                  <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
                  </div>
                </FadeIn>
              )}

              <form onSubmit={handleSubmit} className="mt-16 space-y-8">
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                  <FadeIn>
                    <div>
                      <label htmlFor="firstName" className="block text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        {t('form.firstName.label')}
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        autoComplete="given-name"
                        className={`block w-full rounded-2xl bg-transparent border-2 px-4 py-4 text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-colors ${
                          errors.firstName 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400'
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.firstName && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
                      )}
                    </div>
                  </FadeIn>

                  <FadeIn>
                    <div>
                      <label htmlFor="lastName" className="block text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        {t('form.lastName.label')}
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        autoComplete="family-name"
                        className={`block w-full rounded-2xl bg-transparent border-2 px-4 py-4 text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-colors ${
                          errors.lastName 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400'
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.lastName && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>
                      )}
                    </div>
                  </FadeIn>
                </div>

                {/* Email */}
                <FadeIn>
                  <div>
                    <label htmlFor="email" className="block text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      {t('form.email.label')}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      className={`block w-full rounded-2xl bg-transparent border-2 px-4 py-4 text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-colors ${
                        errors.email 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400'
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>
                </FadeIn>

                {/* Empresa */}
                <FadeIn>
                  <div>
                    <label htmlFor="company" className="block text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      {t('form.company.label')}
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                      autoComplete="organization"
                      className="block w-full rounded-2xl bg-transparent border-2 border-gray-300 dark:border-gray-600 px-4 py-4 text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-gray-500 dark:focus:border-gray-400 transition-colors"
                      disabled={isSubmitting}
                    />
                  </div>
                </FadeIn>

                {/* Teléfono */}
                <FadeIn>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label htmlFor="phone" className="block text-lg font-medium text-gray-900 dark:text-gray-100">
                        {t('form.phone.label')}
                      </label>
                      <span className="text-sm text-gray-400">{t('form.phone.optional')}</span>
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      autoComplete="tel"
                      className="block w-full rounded-2xl bg-transparent border-2 border-gray-300 dark:border-gray-600 px-4 py-4 text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-gray-500 dark:focus:border-gray-400 transition-colors"
                      disabled={isSubmitting}
                    />
                  </div>
                </FadeIn>

                {/* Mensaje */}
                <FadeIn>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label htmlFor="message" className="block text-lg font-medium text-gray-900 dark:text-gray-100">
                        {t('form.message.label')}
                      </label>
                      <span className="text-sm text-gray-400">{t('form.message.maxCharacters')}</span>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`block w-full rounded-2xl bg-transparent border-2 px-4 py-4 text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-colors resize-none ${
                        errors.message 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400'
                      }`}
                      disabled={isSubmitting}
                    />
                    <div className="mt-2 flex justify-between">
                      {errors.message && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.message}</p>
                      )}
                      <p className="text-sm text-gray-400 ml-auto">
                        {formData.message.length}/500
                      </p>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn>
                  <div className="mt-10 border-t border-gray-900/10 dark:border-gray-100/10 pt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting || !isLoaded}
                      className={`w-full rounded-2xl px-6 py-4 text-center text-lg font-semibold text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition-all duration-200 ${
                        isSubmitting || !isLoaded
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transform hover:scale-[1.02]'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('form.submit.sending')}
                        </>
                      ) : !isLoaded ? (
                        t('form.submit.loading')
                      ) : (
                        t('form.submit.button')
                      )}
                    </button>
                  </div>
                </FadeIn>
              </form>
            </FadeInStagger>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ContactFormClientProps {
  recaptchaSiteKey: string;
}

const ContactFormClient = ({ recaptchaSiteKey }: ContactFormClientProps) => {
  if (!recaptchaSiteKey) {
    console.error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY no está configurada');
  }

  return (
    <ReCaptchaWrapper siteKey={recaptchaSiteKey}>
      <ContactForm />
    </ReCaptchaWrapper>
  );
};

export default ContactFormClient; 