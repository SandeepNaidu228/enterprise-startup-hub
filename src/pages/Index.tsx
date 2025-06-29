import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ClearDataButton } from '@/components/ClearDataButton';
import { getLocalDataStatus } from '@/lib/clearLocalData';
import { 
  Building2, 
  Rocket, 
  Users, 
  TrendingUp, 
  Star, 
  ArrowRight,
  CheckCircle,
  Globe,
  Zap,
  Target,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  HelpCircle,
  MessageSquare,
  Shield,
  BarChart3,
  Search,
  Brain,
  Sparkles,
  Play,
  Database,
  RefreshCw
} from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showClearData, setShowClearData] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [dataStatus, setDataStatus] = useState(getLocalDataStatus());
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [stats, setStats] = useState({
    startups: 0,
    enterprises: 0,
    connections: 0,
    countries: 0
  });

  useEffect(() => {
    // Update data status
    setDataStatus(getLocalDataStatus());
    
    // Animate stats on load
    const animateStats = () => {
      const targets = { startups: 1247, enterprises: 89, connections: 3456, countries: 23 };
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      
      let step = 0;
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setStats({
          startups: Math.floor(targets.startups * progress),
          enterprises: Math.floor(targets.enterprises * progress),
          connections: Math.floor(targets.connections * progress),
          countries: Math.floor(targets.countries * progress)
        });
        
        if (step >= steps) {
          clearInterval(interval);
          setStats(targets);
        }
      }, stepDuration);
    };
    
    animateStats();
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save contact form to localStorage
    const contacts = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    const newContact = {
      ...contactForm,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    contacts.push(newContact);
    localStorage.setItem('contactSubmissions', JSON.stringify(contacts));
    
    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setContactForm({ name: '', email: '', company: '', message: '' });
    setShowContactForm(false);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const hasLocalData = dataStatus.startups > 0 || dataStatus.enterprises > 0 || dataStatus.projectRequests > 0 || dataStatus.hasAuth;

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Matching",
      description: "Advanced ChatGPT integration analyzes project requirements and matches startups with 95% accuracy using machine learning algorithms"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Network",
      description: "Access to verified startups and enterprises from over 20 countries with real-time collaboration tools"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Verified Profiles",
      description: "All profiles undergo rigorous verification to ensure quality connections and legitimate business partnerships"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics and insights to track partnership success and optimize collaboration strategies"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Innovation Director",
      company: "TechCorp Global",
      content: "Yhteys transformed our startup discovery process. The AI recommendations were spot-on and we found three key partners that accelerated our digital transformation by 300%.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "CEO",
      company: "DataFlow AI",
      content: "Within weeks of joining, we connected with enterprise clients that became our biggest revenue drivers. The AI matching is incredibly accurate.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      role: "VP of Partnerships",
      company: "InnovateCorp",
      content: "The AI understands our requirements perfectly and suggests startups that are perfect fits every time. It's like having a dedicated partnership team.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How does the AI-powered matching work?",
      answer: "Our ChatGPT-powered system analyzes startup profiles, project descriptions, and enterprise requirements to suggest the most relevant connections based on industry, technology stack, team expertise, and business needs with 95% accuracy."
    },
    {
      question: "What is the cost structure for using Yhteys?",
      answer: "Basic membership is free for both startups and enterprises. We offer premium tiers with enhanced AI matching, priority support, and advanced analytics for growing businesses."
    },
    {
      question: "How accurate are the AI recommendations?",
      answer: "Our AI system achieves 95% matching accuracy by analyzing over 50 data points including technical expertise, project history, budget alignment, and cultural fit indicators."
    },
    {
      question: "Can I track the progress of my partnerships?",
      answer: "Yes! Our platform includes comprehensive project tracking, milestone management, AI-powered insights, and rating systems to help you monitor and evaluate partnership success."
    },
    {
      question: "What types of partnerships can I find on Yhteys?",
      answer: "You can find various partnership types including technology collaborations, pilot programs, joint ventures, service partnerships, investment opportunities, and long-term strategic alliances."
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">Y</span>
              </div>
              <span className="text-xl font-semibold text-white">Yhteys</span>
              <Badge variant="secondary" className="hidden sm:block bg-gray-800 text-gray-300 border-gray-700">
                <Brain className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className={`text-sm font-medium transition-colors hover:text-white ${activeSection === 'home' ? 'text-white' : 'text-gray-400'}`}
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className={`text-sm font-medium transition-colors hover:text-white ${activeSection === 'about' ? 'text-white' : 'text-gray-400'}`}
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className={`text-sm font-medium transition-colors hover:text-white ${activeSection === 'features' ? 'text-white' : 'text-gray-400'}`}
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className={`text-sm font-medium transition-colors hover:text-white ${activeSection === 'faq' ? 'text-white' : 'text-gray-400'}`}
              >
                FAQ
              </button>
              <button 
                onClick={() => setShowContactForm(true)}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </button>
              {hasLocalData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearData(true)}
                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                >
                  <Database className="mr-2 h-4 w-4" />
                  Clear Data
                </Button>
              )}
              <Button 
                onClick={() => navigate('/demo')}
                variant="outline"
                className="border-cyan-600 text-cyan-400 hover:bg-cyan-900/20"
              >
                <Play className="mr-2 h-4 w-4" />
                Try AI Demo
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="button-gradient hover:button-gradient font-medium"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:bg-gray-800"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-gray-400 hover:text-white px-4 py-2 text-left text-sm font-medium transition-colors"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-gray-400 hover:text-white px-4 py-2 text-left text-sm font-medium transition-colors"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-gray-400 hover:text-white px-4 py-2 text-left text-sm font-medium transition-colors"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="text-gray-400 hover:text-white px-4 py-2 text-left text-sm font-medium transition-colors"
                >
                  FAQ
                </button>
                <button 
                  onClick={() => {
                    setShowContactForm(true);
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-400 hover:text-white px-4 py-2 text-left text-sm font-medium transition-colors"
                >
                  Contact
                </button>
                <div className="px-4 pt-2 space-y-2">
                  {hasLocalData && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowClearData(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full border-red-600 text-red-400 hover:bg-red-900/20"
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Clear Data
                    </Button>
                  )}
                  <Button 
                    onClick={() => {
                      navigate('/demo');
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-cyan-600 text-cyan-400 hover:bg-cyan-900/20"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Try AI Demo
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate('/auth');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full button-gradient hover:button-gradient font-medium"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Database Status Banner */}
      {!hasLocalData && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-green-900/20 border-b border-green-600/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-center space-x-2 text-green-400 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>✨ Fresh Database Ready - Connect to Supabase for production data</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className={`${!hasLocalData ? 'pt-32' : 'pt-24'} pb-20 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <Badge className="bg-gray-900 text-gray-300 border-gray-700 mb-8 px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              🚀 AI-Powered Startup-Enterprise Matching
            </Badge>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
            Where AI Meets
            <span className="block text-gradient-accent">Perfect Partnerships</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Yhteys uses advanced AI and ChatGPT integration to connect innovative startups with enterprise partners. 
            Experience 95% matching accuracy and discover opportunities that accelerate growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Button 
              size="lg" 
              className="button-gradient hover:button-gradient px-8 py-4 text-lg font-semibold rounded-lg hover-lift"
              onClick={() => navigate('/auth')}
            >
              <Rocket className="mr-2 h-5 w-5" />
              Start Building Connections
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-cyan-600 text-cyan-400 hover:bg-cyan-900/20 px-8 py-4 text-lg font-semibold rounded-lg hover-lift"
              onClick={() => navigate('/demo')}
            >
              <Brain className="mr-2 h-5 w-5" />
              Try AI Demo
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950 border-y border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {stats.startups.toLocaleString()}+
              </div>
              <div className="text-gray-400 font-medium">AI-Verified Startups</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {stats.enterprises}+
              </div>
              <div className="text-gray-400 font-medium">Enterprise Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {stats.connections.toLocaleString()}+
              </div>
              <div className="text-gray-400 font-medium">AI-Matched Connections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                95%
              </div>
              <div className="text-gray-400 font-medium">AI Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              About Yhteys
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Yhteys (Finnish for "connection") uses cutting-edge AI technology to bridge the gap between innovative startups and forward-thinking enterprises, 
              creating partnerships that drive technological advancement and business growth.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">Our AI-Powered Mission</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                We believe that the future of business lies in intelligent collaboration between agile startups and established enterprises. 
                Our platform uses advanced AI, including ChatGPT integration, to analyze requirements and connect the right partners with 95% accuracy.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="card-gradient hover-lift">
                  <CardContent className="p-6">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <Rocket className="mr-2 h-4 w-4" />
                      For Startups
                    </h4>
                    <p className="text-gray-400 text-sm">Access enterprise clients through AI-powered matching, scale your solutions, and accelerate growth.</p>
                  </CardContent>
                </Card>
                <Card className="card-gradient hover-lift">
                  <CardContent className="p-6">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <Building2 className="mr-2 h-4 w-4" />
                      For Enterprises
                    </h4>
                    <p className="text-gray-400 text-sm">Discover cutting-edge solutions through AI recommendations and drive innovation effortlessly.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Card className="card-gradient hover-lift">
              <CardContent className="p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
                  <Brain className="mr-2 h-6 w-6 text-cyan-400" />
                  Why Choose Our AI Platform?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 shrink-0" />
                    <span className="text-gray-300">ChatGPT-powered matching with 95% accuracy</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 shrink-0" />
                    <span className="text-gray-300">AI-verified profiles and secure connections</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 shrink-0" />
                    <span className="text-gray-300">Intelligent project tracking and collaboration tools</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 shrink-0" />
                    <span className="text-gray-300">Global AI-powered network spanning 20+ countries</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 shrink-0" />
                    <span className="text-gray-300">24/7 AI-assisted support and partnership guidance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950 border-y border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              AI-Powered Platform Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with human insight to create meaningful business connections with unprecedented accuracy.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-gradient hover-lift">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-white rounded-lg w-fit text-black">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400">
              Get answers to common questions about our AI-powered platform.
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="card-gradient hover-lift">
                <CardHeader>
                  <CardTitle className="text-white flex items-start text-lg">
                    <HelpCircle className="h-5 w-5 mr-3 mt-0.5 text-gray-400 shrink-0" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 ml-8">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950 border-y border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              AI Success Stories
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Hear from our community about how our AI-powered platform has transformed their business relationships.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-gradient hover-lift">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Badge variant="secondary" className="ml-2 bg-cyan-900/30 text-cyan-400 border-cyan-600 text-xs">
                      AI Matched
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-300 text-lg italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  <div className="text-gray-500 text-sm">{testimonial.company}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Experience AI-Powered Matching?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join thousands of startups and enterprises already using our AI platform to accelerate their growth with 95% matching accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="button-gradient hover:button-gradient px-8 py-4 text-lg font-semibold rounded-lg hover-lift"
              onClick={() => navigate('/auth')}
            >
              <Rocket className="mr-2 h-5 w-5" />
              Get Started Now
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-cyan-600 text-cyan-400 hover:bg-cyan-900/20 px-8 py-4 text-lg font-semibold rounded-lg hover-lift"
              onClick={() => navigate('/demo')}
            >
              <Brain className="mr-2 h-5 w-5" />
              Try AI Demo
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="card-gradient max-w-md w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white text-xl">Contact Us</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-gray-400">
                Get in touch with our team. We'll respond within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Name *</Label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-white">Company</Label>
                  <Input
                    id="company"
                    value={contactForm.company}
                    onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-white">Message *</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="How can we help you?"
                    rows={4}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full button-gradient hover:button-gradient font-medium"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Clear Data Modal */}
      {showClearData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <ClearDataButton />
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => setShowClearData(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-lg">Y</span>
                </div>
                <span className="text-xl font-semibold text-white">Yhteys</span>
                <Badge variant="secondary" className="bg-cyan-900/30 text-cyan-400 border-cyan-600 text-xs">
                  AI-Powered
                </Badge>
              </div>
              <p className="text-gray-400 mb-4">
                Building intelligent connections that matter. Connecting innovation with enterprise through advanced AI, worldwide.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                  onClick={() => setShowContactForm(true)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white transition-colors">About</button></li>
                <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('faq')} className="text-gray-400 hover:text-white transition-colors">FAQ</button></li>
                <li><button onClick={() => navigate('/demo')} className="text-gray-400 hover:text-white transition-colors">AI Demo</button></li>
                <li><button onClick={() => navigate('/auth')} className="text-gray-400 hover:text-white transition-colors">Login</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setShowContactForm(true)} className="text-gray-400 hover:text-white transition-colors">Contact Us</button></li>
                <li><span className="text-gray-400">Help Center</span></li>
                <li><span className="text-gray-400">Privacy Policy</span></li>
                <li><span className="text-gray-400">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">&copy; 2024 Yhteys. All rights reserved. Powered by AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}