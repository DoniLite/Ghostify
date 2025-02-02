import { CategoryConfig } from './TrainingDataGenerator';

export const cvTechnicalConfig: CategoryConfig[] = [
  {
    category: 'programming_languages',
    baseWords: [
      'JavaScript',
      'Python',
      'Java',
      'C++',
      'TypeScript',
      'Ruby',
      'Go',
      'Rust',
      'PHP',
      'Swift',
      'Kotlin',
      'Scala',
    ],
    contextTemplates: [
      'Expert in ${word} development with 5+ years experience',
      'Advanced ${word} programming and architecture',
      'Built enterprise applications using ${word}',
      'Implemented scalable solutions in ${word}',
      'Led ${word} development team',
      'Optimized ${word} applications for performance',
    ],
  },
  {
    category: 'frameworks',
    baseWords: [
      'React',
      'Angular',
      'Vue.js',
      'Node.js',
      'Django',
      'Flask',
      'Spring Boot',
      'Laravel',
      'Express.js',
      'Next.js',
      'Nuxt.js',
    ],
    contextTemplates: [
      'Developed complex applications with ${word}',
      'Created responsive interfaces using ${word}',
      'Maintained and scaled ${word} applications',
      'Implemented microservices using ${word}',
      'Built REST APIs with ${word}',
    ],
  },
  {
    category: 'cloud_services',
    baseWords: [
      'AWS',
      'Azure',
      'Google Cloud',
      'Kubernetes',
      'Docker',
      'Terraform',
      'Jenkins',
      'GitLab CI',
      'CircleCI',
    ],
    contextTemplates: [
      'Architected solutions on ${word}',
      'Deployed and managed ${word} infrastructure',
      'Implemented CI/CD pipelines using ${word}',
      'Automated deployment with ${word}',
      'Optimized cloud costs using ${word}',
    ],
  },
  {
    category: 'technical_skills',
    baseWords: [
      'JavaScript',
      'Python',
      'React',
      'Node.js',
      'AWS',
      'Docker',
      'Kubernetes',
      'MongoDB',
      'PostgreSQL',
    ],
    contextTemplates: [
      'Expertise in ${word} development and architecture',
      'Advanced ${word} skills with production experience',
      'Built and maintained ${word} applications',
      'Implemented complex solutions using ${word}',
      '${word} certification and hands-on experience',
      'Led team of ${word} developers',
      'Optimized ${word} performance and scalability',
    ],
  },
];

export const cvEducationConfig: CategoryConfig[] = [
  {
    category: 'education',
    baseWords: ['Bachelor', 'Master', 'PhD', 'degree', 'certification'],
    contextTemplates: [
      '${word} in Computer Science from top university',
      'Currently pursuing ${word} in Software Engineering',
      'Completed ${word} with honors',
      'Advanced ${word} in Data Science',
      'Professional ${word} in Cloud Architecture',
    ],
  },
];

export const cvSoftSkillsConfig: CategoryConfig[] = [
  {
    category: 'leadership',
    baseWords: [
      'leadership',
      'management',
      'mentoring',
      'coaching',
      'strategy',
      'vision',
      'direction',
      'guidance',
    ],
    contextTemplates: [
      'Demonstrated strong ${word} abilities',
      'Provided ${word} to junior developers',
      'Excellence in team ${word}',
      'Strategic ${word} of technical projects',
    ],
  },
  {
    category: 'communication',
    baseWords: [
      'communication',
      'presentation',
      'documentation',
      'collaboration',
      'interpersonal',
      'articulation',
      'facilitation',
    ],
    contextTemplates: [
      'Excellent ${word} skills with stakeholders',
      'Strong written and verbal ${word}',
      'Enhanced team ${word} processes',
      'Led technical ${word} sessions',
    ],
  },
  {
    category: 'teamwork',
    baseWords: [
      'teamwork',
      'collaboration',
      'communication',
      'project management',
      'scheduling',
      'prioritization',
      'decision-making',
    ],
    contextTemplates: [
      'Excellent ${word} and problem-solving skills',
      'Strong ${word} and leadership abilities',
      'Effective ${word} and communication skills',
      'Managed ${word} effectively',
    ],
  },
  {
    category: 'soft_skills',
    baseWords: [
      'leadership',
      'communication',
      'teamwork',
      'problem-solving',
      'adaptability',
      'creativity',
    ],
    contextTemplates: [
      'Demonstrated ${word} abilities in cross-functional teams',
      'Strong ${word} skills developed through project management',
      'Excellence in ${word} and collaboration',
      'Proven ${word} in fast-paced environments',
      'Outstanding ${word} and interpersonal abilities',
    ],
  },
];

export const techBlogConfig: CategoryConfig[] = [
  {
    category: 'tech_blog',
    baseWords: [
      'AI',
      'Machine Learning',
      'Web Development',
      'Cloud Computing',
      'DevOps',
      'Cybersecurity',
    ],
    contextTemplates: [
      'Introduction to ${word}: A Comprehensive Guide',
      'How ${word} is Transforming Modern Business',
      'Best Practices for ${word} Implementation',
      'The Future of ${word}: Trends and Predictions',
      'Understanding ${word} Architecture and Design',
      'Advanced ${word} Techniques for Professionals',
    ],
  },
];

export const tutorialBlogConfig: CategoryConfig[] = [
  {
    category: 'tutorial_blog',
    baseWords: ['guide', 'tutorial', 'walkthrough', 'introduction', 'overview'],
    contextTemplates: [
      'Step-by-step ${word} to modern development',
      'Complete ${word} for beginners',
      'Advanced ${word} for experienced developers',
      'Practical ${word} with real-world examples',
      'In-depth ${word} with code samples',
    ],
  },
];
