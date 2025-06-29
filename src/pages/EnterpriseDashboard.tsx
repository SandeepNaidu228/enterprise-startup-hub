import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Search, 
  Star, 
  TrendingUp, 
  Users,
  LogOut,
  Menu,
  X,
  Send,
  Lightbulb,
  CheckCircle,
  Clock,
  MessageSquare,
  Eye,
  Sparkles,
  Edit,
  Save,
  Plus,
  Bot,
  Zap,
  Target,
  AlertCircle
} from 'lucide-react';

interface ProjectRequest {
  id: string;
  title: string;
  description: string;
  budget: string;
  timeline: string;
  requirements: string[];
  status: 'draft' | 'published' | 'in_progress' | 'completed';
  createdAt: string;
  suggestedStartups?: any[];
  webhookResponse?: any;
}

interface Enterprise {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  industry: string;
  companySize: string;
  location: string;
}

interface WebhookResponse {
  recommendations: Array<{
    startup_name: string;
    match_score: number;
    reasoning: string;
    contact_info: {
      email: string;
      phone?: string;
    };
    expertise: string[];
    estimated_timeline: string;
    estimated_cost: string;
  }>;
  analysis: {
    project_complexity: string;
    recommended_approach: string;
    key_considerations: string[];
  };
}

export default function EnterpriseDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([]);
  const [webhookLoading, setWebhookLoading] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    budget: '',
    timeline: '',
    requirements: [''],
    industry: '',
    techStack: '',
    projectType: '',
    urgency: ''
  });

  const WEBHOOK_URL = 'https://sandeep2285.app.n8n.cloud/webhook-test/e4750441-1f71-43e6-96a7-a883fed59ecd';

  useEffect(() => {
    const enterpriseAuth = localStorage.getItem('enterpriseAuth');
    if (!enterpriseAuth) {
      navigate('/auth');
      return;
    }

    const enterpriseData = localStorage.getItem('enterpriseData');
    if (enterpriseData) {
      const parsedEnterprise = JSON.parse(enterpriseData);
      setEnterprise(parsedEnterprise);
      setEditFormData(parsedEnterprise);
      
      // Load project requests for this enterprise
      const allRequests = JSON.parse(localStorage.getItem('enterpriseProjectRequests') || '[]');
      const enterpriseRequests = allRequests.filter((req: ProjectRequest) => 
        req.id.includes(parsedEnterprise.id)
      );
      setProjectRequests(enterpriseRequests);
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem('enterpriseAuth');
    localStorage.removeItem('enterpriseData');
    
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    
    navigate('/');
  };

  const handleSaveProfile = () => {
    // Update enterprise data in localStorage
    const updatedEnterprise = { ...editFormData };
    setEnterprise(updatedEnterprise);
    localStorage.setItem('enterpriseData', JSON.stringify(updatedEnterprise));
    
    // Update in enterprises array
    const allEnterprises = JSON.parse(localStorage.getItem('enterprises') || '[]');
    const updatedEnterprises = allEnterprises.map((e: any) => 
      e.id === updatedEnterprise.id ? updatedEnterprise : e
    );
    localStorage.setItem('enterprises', JSON.stringify(updatedEnterprises));
    
    setShowEditProfile(false);
    
    toast({
      title: "Profile updated successfully!",
      description: "Your changes have been saved.",
    });
  };

  const addRequirement = () => {
    setProjectForm(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setProjectForm(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const removeRequirement = (index: number) => {
    setProjectForm(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  // Enhanced webhook integration for AI startup recommendations
  const getAIRecommendations = async () => {
    if (!projectForm.title || !projectForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in the project title and description first.",
        variant: "destructive",
      });
      return;
    }

    setWebhookLoading(true);
    
    try {
      const webhookPayload = {
        project: {
          title: projectForm.title,
          description: projectForm.description,
          budget: projectForm.budget,
          timeline: projectForm.timeline,
          requirements: projectForm.requirements.filter(req => req.trim() !== ''),
          industry: projectForm.industry,
          techStack: projectForm.techStack,
          projectType: projectForm.projectType,
          urgency: projectForm.urgency
        },
        enterprise: {
          name: enterprise?.companyName,
          industry: enterprise?.industry,
          size: enterprise?.companySize,
          location: enterprise?.location
        },
        requestType: 'startup_recommendations',
        timestamp: new Date().toISOString()
      };

      console.log('Sending to webhook:', webhookPayload);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload)
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Webhook response:', data);
      
      setWebhookResponse(data);
      
      toast({
        title: "AI Analysis Complete!",
        description: `Found ${data.recommendations?.length || 0} recommended startups for your project.`,
      });

    } catch (error: any) {
      console.error('Webhook error:', error);
      
      // Fallback to mock data if webhook fails
      const mockResponse: WebhookResponse = {
        recommendations: [
          {
            startup_name: "AI Workflow Solutions",
            match_score: 95,
            reasoning: "Perfect match for AI automation projects with proven enterprise experience",
            contact_info: {
              email: "contact@aiworkflow.com",
              phone: "+1 (555) 123-4567"
            },
            expertise: ["AI/ML", "Automation", "Enterprise Integration"],
            estimated_timeline: "3-4 months",
            estimated_cost: "$75,000 - $120,000"
          },
          {
            startup_name: "DataFlow Analytics",
            match_score: 88,
            reasoning: "Strong data processing capabilities and real-time analytics expertise",
            contact_info: {
              email: "hello@dataflow.io"
            },
            expertise: ["Data Analytics", "Real-time Processing", "Business Intelligence"],
            estimated_timeline: "2-3 months",
            estimated_cost: "$50,000 - $80,000"
          },
          {
            startup_name: "SecureCloud Pro",
            match_score: 82,
            reasoning: "Excellent security practices and cloud infrastructure expertise",
            contact_info: {
              email: "security@securecloud.pro"
            },
            expertise: ["Cloud Security", "Infrastructure", "Compliance"],
            estimated_timeline: "4-6 months",
            estimated_cost: "$90,000 - $150,000"
          }
        ],
        analysis: {
          project_complexity: "Medium-High",
          recommended_approach: "Agile development with MVP first, then iterative improvements",
          key_considerations: [
            "Ensure data privacy compliance",
            "Plan for scalability from day one",
            "Consider integration with existing systems",
            "Budget for ongoing maintenance and support"
          ]
        }
      };
      
      setWebhookResponse(mockResponse);
      
      toast({
        title: "Using Cached Recommendations",
        description: "Webhook unavailable, showing sample AI analysis results.",
        variant: "destructive",
      });
    } finally {
      setWebhookLoading(false);
    }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!enterprise || !webhookResponse) return;
    
    const newProject: ProjectRequest = {
      id: `${enterprise.id}_project_${Date.now()}`,
      title: projectForm.title,
      description: projectForm.description,
      budget: projectForm.budget,
      timeline: projectForm.timeline,
      requirements: projectForm.requirements.filter(req => req.trim() !== ''),
      status: 'published',
      createdAt: new Date().toISOString(),
      webhookResponse: webhookResponse
    };
    
    // Save to localStorage
    const allRequests = JSON.parse(localStorage.getItem('enterpriseProjectRequests') || '[]');
    allRequests.push(newProject);
    localStorage.setItem('enterpriseProjectRequests', JSON.stringify(allRequests));
    
    // Create project requests for recommended startups
    const projectRequestsForStartups = webhookResponse.recommendations.map(startup => ({
      id: `${newProject.id}_to_${startup.startup_name.replace(/\s+/g, '_').toLowerCase()}`,
      enterpriseId: enterprise.id,
      enterpriseName: enterprise.companyName,
      projectTitle: newProject.title,
      description: newProject.description,
      budget: newProject.budget,
      timeline: newProject.timeline,
      status: 'pending',
      timestamp: new Date().toISOString(),
      aiRecommendation: {
        matchScore: startup.match_score,
        reasoning: startup.reasoning,
        estimatedCost: startup.estimated_cost,
        estimatedTimeline: startup.estimated_timeline
      }
    }));
    
    const allStartupRequests = JSON.parse(localStorage.getItem('projectRequests') || '[]');
    allStartupRequests.push(...projectRequestsForStartups);
    localStorage.setItem('projectRequests', JSON.stringify(allStartupRequests));
    
    setProjectRequests(prev => [...prev, newProject]);
    setShowProjectForm(false);
    setProjectForm({
      title: '',
      description: '',
      budget: '',
      timeline: '',
      requirements: [''],
      industry: '',
      techStack: '',
      projectType: '',
      urgency: ''
    });
    setWebhookResponse(null);
    
    toast({
      title: "Project published successfully!",
      description: `Your project has been sent to ${webhookResponse.recommendations.length} AI-recommended startups.`,
    });
  };

  const handleContactStartup = (startup: any) => {
    // Create a direct contact request
    const contactRequest = {
      id: `contact_${Date.now()}`,
      enterpriseId: enterprise?.id,
      enterpriseName: enterprise?.companyName,
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
      description: `We'll notify ${startup.startup_name} about your interest.`,
    });
  };

  // Analytics data
  const analytics = {
    activeProjects: projectRequests.filter(p => p.status === 'in_progress').length,
    completedProjects: projectRequests.filter(p => p.status === 'completed').length,
    totalRequests: projectRequests.length,
    responseRate: 85
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading enterprise dashboard...</div>
      </div>
    );
  }

  if (!enterprise) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Enterprise data not found</div>
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
                Enterprise Dashboard
              </Badge>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Welcome, {enterprise.companyName}</span>
              <Button 
                variant="ghost" 
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={() => navigate('/enterprise-search')}
              >
                <Search className="mr-2 h-4 w-4" />
                Search Startups
              </Button>
              <Button 
                variant="ghost" 
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={() => setShowEditProfile(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
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
                <div className="text-gray-400 text-sm px-4 py-2">Welcome, {enterprise.companyName}</div>
                <Button 
                  variant="ghost" 
                  className="text-gray-400 hover:text-white hover:bg-gray-800 justify-start"
                  onClick={() => {
                    navigate('/enterprise-search');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search Startups
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-gray-400 hover:text-white hover:bg-gray-800 justify-start"
                  onClick={() => {
                    setShowEditProfile(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Enterprise Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your projects and discover innovative startup partners with AI-powered recommendations.
          </p>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-gradient hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Projects</CardTitle>
              <Clock className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.activeProjects}</div>
              <p className="text-xs text-gray-500">Currently in progress</p>
            </CardContent>
          </Card>

          <Card className="card-gradient hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.completedProjects}</div>
              <p className="text-xs text-gray-500">Successfully delivered</p>
            </CardContent>
          </Card>

          <Card className="card-gradient hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Requests</CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.totalRequests}</div>
              <p className="text-xs text-gray-500">Project submissions</p>
            </CardContent>
          </Card>

          <Card className="card-gradient hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Response Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.responseRate}%</div>
              <p className="text-xs text-gray-500">Startup engagement</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI-Powered Project Matching */}
          <div className="lg:col-span-2">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-xl">
                  <Bot className="mr-2 h-5 w-5" />
                  AI-Powered Project Matching
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Describe your project and get intelligent startup recommendations powered by AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showProjectForm ? (
                  <div className="text-center py-8">
                    <Sparkles className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-white text-xl mb-2">Share Your Project Idea</h3>
                    <p className="text-gray-400 mb-6">
                      Our AI will analyze your requirements and suggest the best startup matches
                    </p>
                    <Button 
                      onClick={() => setShowProjectForm(true)}
                      className="button-gradient hover:button-gradient"
                    >
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Create New Project
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitProject} className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-white">Project Title *</Label>
                      <Input
                        id="title"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        placeholder="e.g., AI-powered customer service chatbot"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-white">Project Description *</Label>
                      <Textarea
                        id="description"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        placeholder="Describe your project requirements, goals, and expected outcomes..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="projectType" className="text-white">Project Type</Label>
                        <Select value={projectForm.projectType} onValueChange={(value) => setProjectForm(prev => ({ ...prev, projectType: value }))}>
                          <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="web-application" className="text-white hover:bg-gray-800">Web Application</SelectItem>
                            <SelectItem value="mobile-app" className="text-white hover:bg-gray-800">Mobile App</SelectItem>
                            <SelectItem value="ai-ml" className="text-white hover:bg-gray-800">AI/ML Solution</SelectItem>
                            <SelectItem value="data-analytics" className="text-white hover:bg-gray-800">Data Analytics</SelectItem>
                            <SelectItem value="automation" className="text-white hover:bg-gray-800">Process Automation</SelectItem>
                            <SelectItem value="integration" className="text-white hover:bg-gray-800">System Integration</SelectItem>
                            <SelectItem value="other" className="text-white hover:bg-gray-800">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="urgency" className="text-white">Urgency Level</Label>
                        <Select value={projectForm.urgency} onValueChange={(value) => setProjectForm(prev => ({ ...prev, urgency: value }))}>
                          <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="low" className="text-white hover:bg-gray-800">Low - Flexible timeline</SelectItem>
                            <SelectItem value="medium" className="text-white hover:bg-gray-800">Medium - Standard priority</SelectItem>
                            <SelectItem value="high" className="text-white hover:bg-gray-800">High - Important project</SelectItem>
                            <SelectItem value="urgent" className="text-white hover:bg-gray-800">Urgent - Critical timeline</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="budget" className="text-white">Budget Range</Label>
                        <Select value={projectForm.budget} onValueChange={(value) => setProjectForm(prev => ({ ...prev, budget: value }))}>
                          <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="$5,000 - $15,000" className="text-white hover:bg-gray-800">$5,000 - $15,000</SelectItem>
                            <SelectItem value="$15,000 - $50,000" className="text-white hover:bg-gray-800">$15,000 - $50,000</SelectItem>
                            <SelectItem value="$50,000 - $100,000" className="text-white hover:bg-gray-800">$50,000 - $100,000</SelectItem>
                            <SelectItem value="$100,000 - $250,000" className="text-white hover:bg-gray-800">$100,000 - $250,000</SelectItem>
                            <SelectItem value="$250,000+" className="text-white hover:bg-gray-800">$250,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="timeline" className="text-white">Timeline</Label>
                        <Select value={projectForm.timeline} onValueChange={(value) => setProjectForm(prev => ({ ...prev, timeline: value }))}>
                          <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="1-3 months" className="text-white hover:bg-gray-800">1-3 months</SelectItem>
                            <SelectItem value="3-6 months" className="text-white hover:bg-gray-800">3-6 months</SelectItem>
                            <SelectItem value="6-12 months" className="text-white hover:bg-gray-800">6-12 months</SelectItem>
                            <SelectItem value="12+ months" className="text-white hover:bg-gray-800">12+ months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="techStack" className="text-white">Preferred Technology Stack</Label>
                      <Input
                        id="techStack"
                        value={projectForm.techStack}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, techStack: e.target.value }))}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        placeholder="e.g., React, Node.js, Python, AWS, etc."
                      />
                    </div>

                    <div>
                      <Label className="text-white">Key Requirements</Label>
                      {projectForm.requirements.map((req, index) => (
                        <div key={index} className="flex gap-2 mt-2">
                          <Input
                            value={req}
                            onChange={(e) => updateRequirement(index, e.target.value)}
                            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                            placeholder="e.g., React expertise, API integration, scalable architecture"
                          />
                          {projectForm.requirements.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeRequirement(index)}
                              variant="outline"
                              size="sm"
                              className="border-red-600 text-red-400 hover:bg-red-900/20"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addRequirement}
                        variant="outline"
                        size="sm"
                        className="mt-2 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Requirement
                      </Button>
                    </div>

                    {/* AI Analysis Button */}
                    {projectForm.title && projectForm.description && (
                      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-blue-400 font-medium flex items-center">
                            <Bot className="mr-2 h-4 w-4" />
                            AI Startup Analysis
                          </h4>
                          <Button
                            type="button"
                            onClick={getAIRecommendations}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={webhookLoading}
                          >
                            {webhookLoading ? (
                              <>
                                <Zap className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Get AI Recommendations
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-gray-400 text-sm">
                          Click to analyze your project and get personalized startup recommendations
                        </p>
                      </div>
                    )}

                    {/* AI Recommendations Display */}
                    {webhookResponse && (
                      <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 space-y-4">
                        <h4 className="text-green-400 font-medium mb-3 flex items-center">
                          <Target className="mr-2 h-4 w-4" />
                          AI Analysis Results
                        </h4>
                        
                        {/* Project Analysis */}
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <h5 className="text-white font-medium mb-2">Project Analysis</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Complexity: </span>
                              <span className="text-white">{webhookResponse.analysis.project_complexity}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Approach: </span>
                              <span className="text-white">{webhookResponse.analysis.recommended_approach}</span>
                            </div>
                          </div>
                          {webhookResponse.analysis.key_considerations.length > 0 && (
                            <div className="mt-3">
                              <span className="text-gray-400 text-sm">Key Considerations:</span>
                              <ul className="list-disc list-inside text-gray-300 text-sm mt-1 space-y-1">
                                {webhookResponse.analysis.key_considerations.map((consideration, index) => (
                                  <li key={index}>{consideration}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Startup Recommendations */}
                        <div className="space-y-3">
                          <h5 className="text-white font-medium">Recommended Startups ({webhookResponse.recommendations.length})</h5>
                          {webhookResponse.recommendations.slice(0, 3).map((startup, index) => (
                            <div key={index} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="text-white font-medium">{startup.startup_name}</h6>
                                  <div className="flex items-center mt-1">
                                    <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-600 text-xs mr-2">
                                      {startup.match_score}% match
                                    </Badge>
                                    <span className="text-gray-400 text-xs">{startup.estimated_timeline}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-white text-sm font-medium">{startup.estimated_cost}</div>
                                </div>
                              </div>
                              <p className="text-gray-400 text-sm mb-2">{startup.reasoning}</p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {startup.expertise.map((skill, skillIndex) => (
                                  <Badge key={skillIndex} variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-xs">{startup.contact_info.email}</span>
                                <Button
                                  type="button"
                                  onClick={() => handleContactStartup(startup)}
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                                >
                                  Contact
                                </Button>
                              </div>
                            </div>
                          ))}
                          {webhookResponse.recommendations.length > 3 && (
                            <p className="text-gray-500 text-sm">+{webhookResponse.recommendations.length - 3} more startups will be contacted</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                        onClick={() => {
                          setShowProjectForm(false);
                          setWebhookResponse(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 button-gradient hover:button-gradient"
                        disabled={!webhookResponse}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Publish Project
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <div>
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-xl">
                  <Building2 className="mr-2 h-5 w-5" />
                  Your Projects
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Track your project requests and progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No projects yet</p>
                    <p className="text-gray-500 text-sm">Create your first project to get started</p>
                  </div>
                ) : (
                  projectRequests.slice(0, 5).map((project) => (
                    <div key={project.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-white font-medium text-sm">{project.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            project.status === 'published' ? 'border-blue-600 text-blue-400' :
                            project.status === 'in_progress' ? 'border-yellow-600 text-yellow-400' :
                            project.status === 'completed' ? 'border-green-600 text-green-400' :
                            'border-gray-600 text-gray-400'
                          }`}
                        >
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-xs line-clamp-2">{project.description}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">{project.budget}</span>
                        <span className="text-gray-500">{project.timeline}</span>
                      </div>
                      {project.webhookResponse && (
                        <div className="flex items-center text-xs">
                          <Bot className="h-3 w-3 text-blue-400 mr-1" />
                          <span className="text-blue-400">
                            {project.webhookResponse.recommendations.length} AI recommendations
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
                
                {projectRequests.length > 0 && (
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 text-sm"
                  >
                    View All Projects
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="card-gradient max-w-md w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white text-xl">Edit Profile</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditProfile(false)}
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName" className="text-white">Company Name</Label>
                <Input
                  id="companyName"
                  value={editFormData.companyName || ''}
                  onChange={(e) => setEditFormData((prev: any) => ({ ...prev, companyName: e.target.value }))}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="contactPerson" className="text-white">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={editFormData.contactPerson || ''}
                  onChange={(e) => setEditFormData((prev: any) => ({ ...prev, contactPerson: e.target.value }))}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="industry" className="text-white">Industry</Label>
                <Input
                  id="industry"
                  value={editFormData.industry || ''}
                  onChange={(e) => setEditFormData((prev: any) => ({ ...prev, industry: e.target.value }))}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-white">Location</Label>
                <Input
                  id="location"
                  value={editFormData.location || ''}
                  onChange={(e) => setEditFormData((prev: any) => ({ ...prev, location: e.target.value }))}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                  onClick={() => setShowEditProfile(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 button-gradient hover:button-gradient"
                  onClick={handleSaveProfile}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}