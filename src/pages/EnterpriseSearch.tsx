import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Users, 
  Building2, 
  Globe, 
  Mail,
  Phone,
  LogOut,
  Heart,
  MessageSquare,
  TrendingUp,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { searchStartups, advancedSearch, getSearchSuggestions, getFilterOptions, type Startup, type SearchResult, type FilterOptions } from '@/lib/searchService';

export default function EnterpriseSearch() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [enterprise, setEnterprise] = useState<any>(null);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [savedStartups, setSavedStartups] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [filters, setFilters] = useState<FilterOptions>({
    industry: '',
    location: '',
    fundingStage: '',
    minTeamSize: undefined,
    maxTeamSize: undefined,
    minRating: undefined,
    tags: []
  });

  // Mock startup data for testing
  const mockStartups: Startup[] = [
    {
      id: 'startup_1',
      name: 'AI Workflow Solutions',
      description: 'Revolutionary AI-powered automation platform that streamlines enterprise workflows and increases productivity by 300%. Our cutting-edge machine learning algorithms adapt to your business processes.',
      industry: 'SaaS',
      location: 'San Francisco, CA',
      website: 'https://aiworkflow.com',
      contact: {
        email: 'contact@aiworkflow.com',
        phone: '+1 (555) 123-4567'
      },
      teamMembers: [
        { name: 'Sarah Chen', role: 'CEO & Co-founder', email: 'sarah@aiworkflow.com' },
        { name: 'Marcus Rodriguez', role: 'CTO & Co-founder', email: 'marcus@aiworkflow.com' },
        { name: 'Lisa Thompson', role: 'Head of Product', email: 'lisa@aiworkflow.com' }
      ],
      projects: [
        {
          name: 'Enterprise Automation Suite',
          description: 'Complete workflow automation solution for large enterprises',
          technologies: ['Python', 'TensorFlow', 'React', 'Node.js', 'PostgreSQL']
        },
        {
          name: 'AI Analytics Dashboard',
          description: 'Real-time analytics and insights for workflow optimization',
          technologies: ['React', 'D3.js', 'Python', 'Apache Kafka']
        }
      ],
      tags: ['AI', 'automation', 'workflow', 'enterprise', 'productivity', 'machine learning'],
      fundingStage: 'Series A',
      teamSize: 15,
      foundedYear: 2021,
      rating: 4.8
    },
    {
      id: 'startup_2',
      name: 'DataFlow Analytics',
      description: 'Advanced data analytics platform helping enterprises make data-driven decisions. Real-time processing of big data with intuitive visualization tools.',
      industry: 'AI/ML',
      location: 'New York, NY',
      website: 'https://dataflow.io',
      contact: {
        email: 'hello@dataflow.io',
        phone: '+1 (555) 987-6543'
      },
      teamMembers: [
        { name: 'Alex Johnson', role: 'CEO', email: 'alex@dataflow.io' },
        { name: 'Maria Garcia', role: 'Head of Engineering', email: 'maria@dataflow.io' }
      ],
      projects: [
        {
          name: 'Real-time Analytics Engine',
          description: 'High-performance analytics engine for real-time data processing',
          technologies: ['Apache Spark', 'Kafka', 'Elasticsearch', 'React']
        }
      ],
      tags: ['data analytics', 'big data', 'visualization', 'real-time', 'business intelligence'],
      fundingStage: 'Seed',
      teamSize: 8,
      foundedYear: 2022,
      rating: 4.6
    },
    {
      id: 'startup_3',
      name: 'SecureCloud Pro',
      description: 'Next-generation cybersecurity platform protecting enterprise cloud infrastructure with AI-powered threat detection and automated response systems.',
      industry: 'Cybersecurity',
      location: 'Austin, TX',
      website: 'https://securecloud.pro',
      contact: {
        email: 'security@securecloud.pro',
        phone: '+1 (555) 456-7890'
      },
      teamMembers: [
        { name: 'David Kim', role: 'CEO & Founder', email: 'david@securecloud.pro' },
        { name: 'Jennifer Wu', role: 'Head of Security', email: 'jennifer@securecloud.pro' },
        { name: 'Robert Brown', role: 'Lead Developer', email: 'robert@securecloud.pro' }
      ],
      projects: [
        {
          name: 'AI Threat Detection',
          description: 'Machine learning-based threat detection system',
          technologies: ['Python', 'TensorFlow', 'AWS', 'Docker', 'Kubernetes']
        },
        {
          name: 'Automated Response System',
          description: 'Automated incident response and remediation platform',
          technologies: ['Go', 'Redis', 'PostgreSQL', 'Terraform']
        }
      ],
      tags: ['cybersecurity', 'cloud security', 'AI', 'threat detection', 'automation'],
      fundingStage: 'Series B',
      teamSize: 25,
      foundedYear: 2020,
      rating: 4.9
    },
    {
      id: 'startup_4',
      name: 'EcoTech Innovations',
      description: 'Sustainable technology solutions for smart cities. IoT sensors and AI analytics for environmental monitoring and energy optimization.',
      industry: 'CleanTech',
      location: 'Seattle, WA',
      website: 'https://ecotech.green',
      contact: {
        email: 'info@ecotech.green',
        phone: '+1 (555) 321-0987'
      },
      teamMembers: [
        { name: 'Emma Wilson', role: 'CEO', email: 'emma@ecotech.green' },
        { name: 'James Park', role: 'CTO', email: 'james@ecotech.green' }
      ],
      projects: [
        {
          name: 'Smart City Sensors',
          description: 'IoT sensor network for environmental monitoring',
          technologies: ['IoT', 'Arduino', 'LoRaWAN', 'Python', 'MongoDB']
        }
      ],
      tags: ['IoT', 'smart cities', 'environmental', 'sustainability', 'sensors'],
      fundingStage: 'Pre-Seed',
      teamSize: 6,
      foundedYear: 2023,
      rating: 4.4
    },
    {
      id: 'startup_5',
      name: 'HealthTech Connect',
      description: 'Digital health platform connecting patients with healthcare providers through telemedicine and AI-powered health monitoring.',
      industry: 'HealthTech',
      location: 'Boston, MA',
      website: 'https://healthtech.connect',
      contact: {
        email: 'contact@healthtech.connect',
        phone: '+1 (555) 654-3210'
      },
      teamMembers: [
        { name: 'Dr. Michael Chen', role: 'CEO & Co-founder', email: 'michael@healthtech.connect' },
        { name: 'Sarah Johnson', role: 'COO & Co-founder', email: 'sarah@healthtech.connect' }
      ],
      projects: [
        {
          name: 'Telemedicine Platform',
          description: 'Secure video consultation platform for healthcare',
          technologies: ['React', 'WebRTC', 'Node.js', 'MongoDB', 'AWS']
        }
      ],
      tags: ['telemedicine', 'healthcare', 'AI', 'digital health', 'patient care'],
      fundingStage: 'Seed',
      teamSize: 12,
      foundedYear: 2021,
      rating: 4.7
    }
  ];

  useEffect(() => {
    const enterpriseAuth = localStorage.getItem('enterpriseAuth');
    if (!enterpriseAuth) {
      navigate('/auth');
      return;
    }

    setEnterprise(JSON.parse(enterpriseAuth));
    
    // Load startups from localStorage or use mock data
    const storedStartups = localStorage.getItem('startups');
    if (storedStartups) {
      const parsedStartups = JSON.parse(storedStartups);
      setStartups([...parsedStartups, ...mockStartups]);
    } else {
      setStartups(mockStartups);
    }
    
    // Load saved startups
    const saved = localStorage.getItem('savedStartups');
    if (saved) {
      setSavedStartups(JSON.parse(saved));
    }
    
    setLoading(false);
  }, [navigate]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    const timeoutId = setTimeout(() => {
      const results = advancedSearch(searchQuery, startups, filters, 30);
      setSearchResults(results);
      setSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, startups, filters]);

  const filterOptions = useMemo(() => getFilterOptions(startups), [startups]);
  const searchSuggestions = useMemo(() => getSearchSuggestions(startups), [startups]);

  const handleLogout = async () => {
    localStorage.removeItem('enterpriseAuth');
    
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    
    navigate('/');
  };

  const handleSaveStartup = (startupId: string) => {
    const newSaved = savedStartups.includes(startupId)
      ? savedStartups.filter(id => id !== startupId)
      : [...savedStartups, startupId];
    
    setSavedStartups(newSaved);
    localStorage.setItem('savedStartups', JSON.stringify(newSaved));
    
    toast({
      title: savedStartups.includes(startupId) ? "Removed from saved" : "Saved startup",
      description: savedStartups.includes(startupId) 
        ? "Startup removed from your saved list" 
        : "Startup added to your saved list",
    });
  };

  const handleContactStartup = (startup: Startup) => {
    // Create a direct contact request
    const contactRequest = {
      id: `contact_${Date.now()}_to_${startup.id}`,
      enterpriseId: enterprise?.email,
      enterpriseName: enterprise?.companyName || 'Enterprise User',
      projectTitle: 'Direct Contact Request',
      description: `${enterprise?.companyName || 'An enterprise'} is interested in connecting with your startup for potential collaboration opportunities.`,
      budget: 'To be discussed',
      timeline: 'Flexible',
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    // Add to startup's project requests
    const allStartupRequests = JSON.parse(localStorage.getItem('projectRequests') || '[]');
    allStartupRequests.push(contactRequest);
    localStorage.setItem('projectRequests', JSON.stringify(allStartupRequests));
    
    toast({
      title: "Contact request sent",
      description: `We'll notify ${startup.name} about your interest.`,
    });
  };

  const clearFilters = () => {
    setFilters({
      industry: '',
      location: '',
      fundingStage: '',
      minTeamSize: undefined,
      maxTeamSize: undefined,
      minRating: undefined,
      tags: []
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading enterprise portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="glass-effect border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">Y</span>
              </div>
              <span className="text-xl font-semibold text-white">Yhteys</span>
              <Badge variant="secondary" className="hidden sm:block bg-gray-800 text-gray-300 border-gray-700">
                Enterprise Portal
              </Badge>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Welcome, {enterprise?.companyName || 'Enterprise'}</span>
              <Button 
                variant="ghost" 
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={() => navigate('/enterprise-dashboard')}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
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
              <div className="flex flex-col space-y-2">
                <div className="text-gray-400 text-sm px-4 py-2">Welcome, {enterprise?.companyName || 'Enterprise'}</div>
                <Button 
                  variant="ghost" 
                  className="text-gray-400 hover:text-white hover:bg-gray-800 justify-start"
                  onClick={() => {
                    navigate('/enterprise-dashboard');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-gray-400 hover:text-white hover:bg-gray-800 justify-start"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Discover Innovative Startups
          </h1>
          <p className="text-gray-400 text-lg">
            Find the perfect startup partners using our intelligent search platform.
          </p>
        </div>

        {/* Search Section */}
        <Card className="card-gradient mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-xl">
              <Search className="mr-2 h-5 w-5" />
              Smart Startup Search
            </CardTitle>
            <CardDescription className="text-gray-400">
              Use natural language to find startups. Try "AI automation platform" or "healthcare technology"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 text-lg py-3"
                  placeholder="Search for startups... (e.g., 'AI automation platform for enterprises')"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Search Suggestions */}
            {!searchQuery && (
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {searchSuggestions.slice(0, 6).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery(suggestion)}
                      className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <Select value={filters.industry} onValueChange={(value) => setFilters(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="" className="text-white hover:bg-gray-700">All Industries</SelectItem>
                    {filterOptions.industries.map(industry => (
                      <SelectItem key={industry} value={industry} className="text-white hover:bg-gray-700">{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="" className="text-white hover:bg-gray-700">All Locations</SelectItem>
                    {filterOptions.locations.map(location => (
                      <SelectItem key={location} value={location} className="text-white hover:bg-gray-700">{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.fundingStage} onValueChange={(value) => setFilters(prev => ({ ...prev, fundingStage: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Funding Stage" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="" className="text-white hover:bg-gray-700">All Stages</SelectItem>
                    {filterOptions.fundingStages.map(stage => (
                      <SelectItem key={stage} value={stage} className="text-white hover:bg-gray-700">{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Min Team Size"
                  value={filters.minTeamSize || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, minTeamSize: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
                />

                <Input
                  type="number"
                  placeholder="Max Team Size"
                  value={filters.maxTeamSize || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxTeamSize: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
                />

                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="space-y-6">
          {searching && (
            <div className="text-center py-8">
              <div className="text-white text-lg">Searching startups...</div>
            </div>
          )}

          {!searching && searchQuery && searchResults.length === 0 && (
            <Card className="card-gradient">
              <CardContent className="text-center py-8">
                <div className="text-white text-lg mb-2">No startups found</div>
                <div className="text-gray-400">Try adjusting your search terms or filters</div>
              </CardContent>
            </Card>
          )}

          {!searching && searchResults.length > 0 && (
            <div className="mb-4">
              <div className="text-white text-lg">
                Found {searchResults.length} startup{searchResults.length !== 1 ? 's' : ''} matching your search
              </div>
            </div>
          )}

          {/* Display search results or all startups */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(searchResults.length > 0 ? searchResults : startups.map(startup => ({ startup, score: 0, matchedFields: [] }))).map((result, index) => {
              const { startup, score, matchedFields } = result;
              const isSaved = savedStartups.includes(startup.id);
              
              return (
                <Card key={startup.id} className="card-gradient hover-lift">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-white text-xl mb-2 flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="truncate">{startup.name}</span>
                          {score > 0 && (
                            <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-600 text-xs shrink-0">
                              {Math.round(score)}% match
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-gray-400 text-sm mb-3 gap-1 sm:gap-0">
                          <div className="flex items-center">
                            <Building2 className="mr-1 h-4 w-4" />
                            <span className="truncate">{startup.industry}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            <span className="truncate">{startup.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {startup.rating.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveStartup(startup.id)}
                        className={`${isSaved ? 'text-red-400 hover:text-red-300' : 'text-gray-500 hover:text-white'} shrink-0`}
                      >
                        <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <CardDescription className="text-gray-400">
                      {startup.description}
                    </CardDescription>

                    {matchedFields.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-500 mb-2">Matched in:</div>
                        <div className="flex flex-wrap gap-1">
                          {matchedFields.map((field, fieldIndex) => (
                            <Badge key={fieldIndex} variant="outline" className="border-blue-600/30 text-blue-400 text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-400">
                        <Users className="mr-2 h-4 w-4" />
                        <span className="truncate">{startup.teamSize} team members</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        <span className="truncate">{startup.fundingStage}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Globe className="mr-2 h-4 w-4" />
                        <span className="truncate">Founded {startup.foundedYear}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Zap className="mr-2 h-4 w-4" />
                        <span className="truncate">{startup.projects.length} project{startup.projects.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-white font-medium mb-2">Tags</div>
                      <div className="flex flex-wrap gap-2">
                        {startup.tags.slice(0, 4).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="bg-gray-700 text-gray-300 border-gray-600 text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {startup.tags.length > 4 && (
                          <Badge variant="secondary" className="bg-gray-600 text-gray-400 border-gray-500 text-xs">
                            +{startup.tags.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-white font-medium mb-2">Key Projects</div>
                      <div className="space-y-2">
                        {startup.projects.slice(0, 1).map((project, projectIndex) => (
                          <div key={projectIndex} className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                            <div className="text-white font-medium text-sm">{project.name}</div>
                            <div className="text-gray-500 text-xs mb-2">{project.description}</div>
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.slice(0, 3).map((tech, techIndex) => (
                                <Badge key={techIndex} variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                  {tech}
                                </Badge>
                              ))}
                              {project.technologies.length > 3 && (
                                <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                  +{project.technologies.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                        {startup.projects.length > 1 && (
                          <div className="text-gray-500 text-xs">
                            +{startup.projects.length - 1} more project{startup.projects.length - 1 !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button 
                        className="flex-1 button-gradient hover:button-gradient"
                        onClick={() => handleContactStartup(startup)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Startup
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                        onClick={() => window.open(`mailto:${startup.contact.email}`, '_blank')}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </Button>
                      {startup.contact.phone && (
                        <Button 
                          variant="outline" 
                          className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 sm:px-3"
                          onClick={() => window.open(`tel:${startup.contact.phone}`, '_blank')}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Show all startups when no search */}
          {!searchQuery && !searching && (
            <div className="text-center py-8">
              <div className="text-gray-500">
                Start typing to search for specific startups, or use the filters above to narrow down results.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}