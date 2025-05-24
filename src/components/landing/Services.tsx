import { FileText, Repeat2, UserCheck } from 'lucide-react'; // Assuming lucide-react for icons

type ServiceCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  apiCode?: string;
};

const ServiceCard = (
  { icon, title, description, features, apiCode }: ServiceCardProps,
) => (
  <div className='bg-card p-8 rounded-xl shadow-lg border border-border flex flex-col items-start text-left w-full lg:w-1/3'>
    <div className='mb-4 text-primary'>{icon}</div>
    <h3 className='text-2xl font-bold text-foreground mb-3 font-nunito'>
      {title}
    </h3>
    <p className='text-muted-foreground mb-4 font-inter'>{description}</p>
    <ul className='text-muted-foreground space-y-2 mb-6 text-sm font-inter'>
      {features.map((feature, index) => (
        <li key={index} className='flex items-center'>
          <svg
            className='h-4 w-4 text-green-500 mr-2'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M5 13l4 4L19 7'
            />
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    {apiCode && (
      <div className='bg-muted p-4 rounded-md text-sm text-muted-foreground w-full font-mono overflow-auto'>
        <pre>{apiCode}</pre>
      </div>
    )}
  </div>
);

const ServicesSection = () => {
  return (
    <section className='py-20 px-6 lg:px-12 bg-background text-center'>
      <div className='container mx-auto'>
        <span className='text-primary text-lg font-semibold font-nunito'>
          Nos Services
        </span>
        <h2 className='text-4xl lg:text-5xl font-extrabold text-foreground mt-4 mb-12 font-nunito'>
          Solutions documentaires complètes pour les développeurs
        </h2>
        <p className='text-lg text-muted-foreground mb-16 max-w-2xl mx-auto font-inter'>
          Intégrez des fonctionnalités avancées de gestion documentaire à vos
          applications avec nos API's hautement performantes et évolutives.
        </p>

        <div className='flex flex-col lg:flex-row justify-center items-stretch gap-8'>
          <ServiceCard
            icon={<FileText size={36} />}
            title='Traduction de Documents'
            description='Traduisez vos documents dans différents types de formats'
            features={[
              'Performance et optimisation',
              'Formats PDF, DOCX, HTML',
              'Traduction en masse',
            ]}
            apiCode={`POST /api/documents/translate\n{\n  "template": "invoice_v2",\n  "data": {\n    "client": "Acme Inc.",\n    "items": []\n  }\n}`}
          />
          <ServiceCard
            icon={<Repeat2 size={36} />}
            title='Conversion de Documents'
            description='Convertissez vos documents entre différents formats tout en préservant la mise en forme et les éléments complexes.'
            features={[
              'PDF, DOCX, HTML, Markdown',
              'Préservation de la mise en page',
              'Traitement par lots',
            ]}
            apiCode={`POST /api/documents/convert\n{\n  "source": "pdf",\n  "target": "docx",\n  "options": {\n    "preserveImages": true\n  }\n}`}
          />
          <ServiceCard
            icon={<UserCheck size={36} />}
            title='Création de CV'
            description='Générez des CV professionnels avec des modèles personnalisables pour les applications RH et les sites de recrutement.'
            features={[
              'Templates modernes',
              'Personnalisation avancée',
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
