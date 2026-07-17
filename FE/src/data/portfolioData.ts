import type { TechStackCategory } from '../types';

export interface PortfolioProject {
  _id: string;
  title: string;
  description?: string;
  techStack?: string[];
  imageUrl?: string;
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  displayOrder?: number;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    _id: '69ad0720789dea10050f4557',
    title: 'Phone Store Management',
    description: 'A full-featured online phone store with real-time inventory management, secure payments, and admin dashboard.',
    techStack: ['React', 'Spring Boot', 'TailwindCSS', 'MySQL'],
    imageUrl: '',
    demoUrl: '',
    repoUrl: 'https://github.com/HuynhTienNhat/Techsphere',
    featured: true,
    displayOrder: 1,
  },
  {
    _id: '69ad0720789dea10050f4558',
    title: 'Remote Desktop App',
    description: 'A remote desktop app that lets users access and control a computer from a mobile device.',
    techStack: ['Dart', 'Flutter'],
    imageUrl: '',
    demoUrl: 'https://play.google.com/store/apps/details?id=org.termuxstudio.vncviewer',
    repoUrl: '',
    featured: true,
    displayOrder: 2,
  },
  {
    _id: '69ad0720789dea10050f4559',
    title: 'Safe Bite',
    description: 'SafeBite is a mobile application designed to help users understand food labels instantly.',
    techStack: ['Flutter', 'Dart', 'Firebase'],
    imageUrl: '',
    demoUrl: '',
    repoUrl: 'https://github.com/justinbiahoi05/SafeBite',
    featured: true,
    displayOrder: 3,
  },
  {
    _id: '69ad0720789dea10050f455a',
    title: 'Name Entity Regconition',
    description: 'an NLP task that identifies and classifies entities such as people, organizations,.. from unstructured text.',
    techStack: ['DistilBERT', 'BiLSTM', 'Attention'],
    imageUrl: '',
    demoUrl: '',
    repoUrl: 'https://github.com/duyhoang17930/Named-Entity-Recognition',
    featured: true,
    displayOrder: 4,
  },
  {
    _id: '69c81e9d00c58c7dc0244b2b',
    title: 'Captcha Recognition',
    description: 'A deep learning-based captcha recognition system using CNN with CTC loss for sequence labeling.',
    techStack: ['Python', 'CNN', 'CTC'],
    imageUrl: '',
    demoUrl: '',
    repoUrl: 'https://github.com/duyhoang17930/Captcha-Recognition',
    featured: false,
    displayOrder: 5,
  },
];

export const techStackCategories: TechStackCategory[] = [
  {
    _id: '69ad01b08bd8eb7cc067638c',
    name: 'Languages',
    items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'Dart'],
    displayOrder: 1,
  },
  {
    _id: '69ad01b08bd8eb7cc067638d',
    name: 'Frontend',
    items: ['HTML', 'CSS', 'React', 'Next.js', 'Tailwind CSS'],
    displayOrder: 2,
  },
  {
    _id: '69ad01b08bd8eb7cc067638e',
    name: 'Mobile Development',
    items: ['Flutter', 'Android (Java)'],
    displayOrder: 3,
  },
  {
    _id: '69ad01b08bd8eb7cc067638f',
    name: 'Backend',
    items: ['Spring Boot', 'MySQL', 'Supabase'],
    displayOrder: 4,
  },
  {
    _id: '69ad01b08bd8eb7cc0676390',
    name: 'Tools & Platforms',
    items: ['Git', 'GitHub', 'Docker'],
    displayOrder: 5,
  },
];
