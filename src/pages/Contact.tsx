import { Mail, MapPin, Phone } from 'lucide-react' // Example icons
import React, { useState } from 'react'
import { useTranslation } from '../components/shared/TranslationContext.tsx'

const Contact = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitSuccess(null)
    try {
      console.log('Form data submitted:', formData)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="bg-background mt-[6rem] min-h-screen">
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="text-center lg:text-left">
          <h1 className="text-primary mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
            {t('contact.title')}
          </h1>
          <p className="text-foreground/80 mb-8 text-lg sm:text-xl">{t('contact.subtitle')}</p>

          <div className="space-y-6">
            <div className="text-foreground flex items-center justify-center gap-3 lg:justify-start">
              <Mail className="text-primary size-6 flex-shrink-0" />
              <span className="text-lg">contact@ghostify.com</span>
            </div>
            <div className="text-foreground flex items-center justify-center gap-3 lg:justify-start">
              <Phone className="text-primary size-6 flex-shrink-0" />
              <span className="text-lg">+34 123 456 789</span>{' '}
              {/* Assuming Spain is the location */}
            </div>
            <div className="text-foreground flex items-center justify-center gap-3 lg:justify-start">
              <MapPin className="text-primary size-6 flex-shrink-0" />
              <span className="text-lg">123 Ghost St, Digital City, 08001 Barcelona, Spain</span>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-card shadow-card border-border rounded-2xl border p-8 shadow-lg">
          <h2 className="text-primary mb-8 text-center text-3xl font-bold">
            {t('contact.form_heading')}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="name"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                {t('contact.form_name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-input text-foreground border-border focus:ring-primary w-full rounded-lg border p-3 focus:outline-none focus:ring-1"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                {t('contact.form_email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-input text-foreground border-border focus:ring-primary w-full rounded-lg border p-3 focus:outline-none focus:ring-1"
                required
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                {t('contact.form_subject')}
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="bg-input text-foreground border-border focus:ring-primary w-full rounded-lg border p-3 focus:outline-none focus:ring-1"
                required
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                {t('contact.form_message')}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="bg-input text-foreground border-border focus:ring-primary w-full resize-y rounded-lg border p-3 focus:outline-none focus:ring-1"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary focus:ring-offset-background w-full rounded-full py-3 text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('contact.form_sending') : t('contact.form_submit')}
            </button>

            {submitSuccess === true && (
              <p className="mt-4 text-center text-green-500">{t('contact.form_success')}</p>
            )}
            {submitSuccess === false && (
              <p className="text-destructive mt-4 text-center">{t('contact.form_error')}</p>
            )}
          </form>
        </div>
      </div>
    </main>
  )
}

export default Contact
