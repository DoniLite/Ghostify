import React, { useState } from 'react';
import { useTranslation } from '../components/shared/TranslationContext.tsx';
import { Mail, MapPin, Phone } from 'lucide-react'; // Example icons

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(null);
    try {
      console.log('Form data submitted:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='min-h-screen mt-[6rem] bg-background'>
      <div className='container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
        <div className='text-center lg:text-left'>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-4'>
            {t('contact.title')}
          </h1>
          <p className='text-lg sm:text-xl text-foreground/80 mb-8'>
            {t('contact.subtitle')}
          </p>

          <div className='space-y-6'>
            <div className='flex items-center justify-center lg:justify-start gap-3 text-foreground'>
              <Mail className='size-6 text-primary flex-shrink-0' />
              <span className='text-lg'>contact@ghostify.com</span>
            </div>
            <div className='flex items-center justify-center lg:justify-start gap-3 text-foreground'>
              <Phone className='size-6 text-primary flex-shrink-0' />
              <span className='text-lg'>+34 123 456 789</span>{' '}
              {/* Assuming Spain is the location */}
            </div>
            <div className='flex items-center justify-center lg:justify-start gap-3 text-foreground'>
              <MapPin className='size-6 text-primary flex-shrink-0' />
              <span className='text-lg'>
                123 Ghost St, Digital City, 08001 Barcelona, Spain
              </span>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className='bg-card p-8 rounded-2xl shadow-lg shadow-card border border-border'>
          <h2 className='text-3xl font-bold text-primary text-center mb-8'>
            {t('contact.form_heading')}
          </h2>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-foreground mb-2'
              >
                {t('contact.form_name')}
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='w-full p-3 rounded-lg bg-input text-foreground border border-border focus:ring-1 focus:ring-primary focus:outline-none'
                required
              />
            </div>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-foreground mb-2'
              >
                {t('contact.form_email')}
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='w-full p-3 rounded-lg bg-input text-foreground border border-border focus:ring-1 focus:ring-primary focus:outline-none'
                required
              />
            </div>
            <div>
              <label
                htmlFor='subject'
                className='block text-sm font-medium text-foreground mb-2'
              >
                {t('contact.form_subject')}
              </label>
              <input
                type='text'
                id='subject'
                name='subject'
                value={formData.subject}
                onChange={handleChange}
                className='w-full p-3 rounded-lg bg-input text-foreground border border-border focus:ring-1 focus:ring-primary focus:outline-none'
                required
              />
            </div>
            <div>
              <label
                htmlFor='message'
                className='block text-sm font-medium text-foreground mb-2'
              >
                {t('contact.form_message')}
              </label>
              <textarea
                id='message'
                name='message'
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className='w-full p-3 rounded-lg bg-input text-foreground border border-border focus:ring-1 focus:ring-primary focus:outline-none resize-y'
                required
              >
              </textarea>
            </div>
            <button
              type='submit'
              className='w-full py-3 rounded-full bg-primary text-primary-foreground text-lg font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t('contact.form_sending')
                : t('contact.form_submit')}
            </button>

            {submitSuccess === true && (
              <p className='text-center text-green-500 mt-4'>
                {t('contact.form_success')}
              </p>
            )}
            {submitSuccess === false && (
              <p className='text-center text-destructive mt-4'>
                {t('contact.form_error')}
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
};

export default Contact;
