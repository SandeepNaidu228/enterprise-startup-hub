// Mock startup data for testing the AI service request
export const mockStartupData = {
  id: 'startup_techflow_2024',
  name: 'TechFlow Innovations',
  description: 'We are a cutting-edge startup specializing in AI-powered business automation and workflow optimization. Our team of experienced engineers and data scientists creates intelligent solutions that help enterprises streamline their operations, reduce costs, and accelerate growth through advanced machine learning and process automation.',
  industry: 'SaaS',
  location: 'Austin, TX',
  website: 'https://techflow-innovations.com',
  contact: {
    email: 'hello@techflow-innovations.com',
    phone: '+1 (512) 555-0123'
  },
  teamMembers: [
    { name: 'Alex Chen', role: 'CEO & Co-founder', email: 'alex@techflow-innovations.com' },
    { name: 'Sarah Rodriguez', role: 'CTO & Co-founder', email: 'sarah@techflow-innovations.com' },
    { name: 'Michael Kim', role: 'Head of AI/ML', email: 'michael@techflow-innovations.com' },
    { name: 'Emily Johnson', role: 'Lead Full-Stack Developer', email: 'emily@techflow-innovations.com' },
    { name: 'David Park', role: 'DevOps Engineer', email: 'david@techflow-innovations.com' }
  ],
  projects: [
    {
      name: 'SmartFlow AI Platform',
      description: 'Intelligent workflow automation platform that uses machine learning to optimize business processes and reduce manual work by up to 80%',
      technologies: ['Python', 'TensorFlow', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Redis']
    },
    {
      name: 'DataSync Enterprise',
      description: 'Real-time data integration and synchronization solution for enterprise systems with advanced analytics and monitoring',
      technologies: ['Apache Kafka', 'Elasticsearch', 'React', 'Python', 'MongoDB', 'Kubernetes']
    },
    {
      name: 'AutoReport Pro',
      description: 'AI-powered reporting and analytics dashboard that automatically generates insights and recommendations from business data',
      technologies: ['Python', 'Pandas', 'D3.js', 'React', 'FastAPI', 'PostgreSQL']
    }
  ],
  tags: ['AI', 'automation', 'workflow', 'enterprise', 'machine learning', 'data analytics', 'SaaS', 'business intelligence'],
  fundingStage: 'Series A',
  teamSize: 12,
  foundedYear: 2022,
  rating: 4.8,
  profileViews: 156,
  projectsSubmitted: 8,
  completedProjects: 6,
  averageRating: 4.8,
  totalRatings: 23,
  createdAt: new Date().toISOString()
};

// Mock enterprise data for testing
export const mockEnterpriseData = {
  id: 'enterprise_globaltech_2024',
  companyName: 'GlobalTech Solutions',
  contactPerson: 'Jennifer Martinez',
  email: 'jennifer.martinez@globaltech.com',
  industry: 'Technology Consulting',
  companySize: '201-1000 employees',
  location: 'San Francisco, CA',
  createdAt: new Date().toISOString(),
  projectRequests: [],
  activeProjects: [],
  completedProjects: []
};

// Sample project request that the enterprise will make
export const sampleProjectRequest = {
  title: 'AI-Powered Customer Support Automation',
  description: 'We need to develop an intelligent customer support system that can handle 80% of customer inquiries automatically using natural language processing and machine learning. The system should integrate with our existing CRM, provide real-time analytics, and escalate complex issues to human agents seamlessly.',
  budget: '$100,000+',
  timeline: '6-12 months',
  requirements: [
    'Natural Language Processing (NLP)',
    'Machine Learning Integration',
    'CRM System Integration',
    'Real-time Analytics Dashboard',
    'Multi-channel Support (Email, Chat, Phone)',
    'Automated Ticket Routing',
    'Performance Monitoring'
  ],
  industry: 'Technology Consulting',
  techStack: 'Python, TensorFlow, React, Node.js, PostgreSQL',
  projectType: 'ai-ml',
  urgency: 'high',
  targetAudience: 'Enterprise customers with 1000+ support tickets per month',
  expectedOutcomes: 'Reduce support response time by 70%, decrease operational costs by 50%, improve customer satisfaction scores by 25%'
};