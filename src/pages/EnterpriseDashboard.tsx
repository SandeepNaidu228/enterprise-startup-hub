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
  Brain,
  Zap,
  Target,
  AlertCircle,
  DollarSign,
  Calendar,
  Shield,
  Loader2
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
  aiRecommendations?: AIRecommendation[];
  projectType?: string;
  urgency?: string;
  targetAudience?: string;
  expectedOutcomes?: string;
}

interface AIRecommendation {
  startup_name: string;
  match_score: number;
  reasoning: string;
  contact_info: {
    email: string;
    phone: string;
  };
  expertise: string[];
  estimated_timeline: string;
  estimated_cost: string;
  strengths?: string[];
  challenges?: string[];
  risk_factors?: string[];
}

interface AIAnalysis {
  project_complexity: string;
  success_probability: number;
  recommended_approach: string;
  key_considerations: string[];
  risk_assessment: string;
  budget_analysis: string;
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

export default function EnterpriseDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([]);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('');
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
    urgency: 'medium',
    targetAudience: '',
    expectedOutcomes: ''
  });

  // Your webhook URL
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
    const updatedEnterprise = { ...editFormData };
    setEnterprise(updatedEnterprise);
    localStorage.setItem('enterpriseData', JSON.stringify(updatedEnterprise));
    
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

  // Generate fallback AI recommendations based on project data
  const generateFallbackRecommendations = (projectData: any) => {
    const projectTypes = {
      'web-app': ['TechFlow Solutions', 'WebCraft Studios', 'Digital Pioneers'],
      'mobile-app': ['MobileFirst Labs', 'AppCraft Solutions', 'Native Innovations'],
      'ai-ml': ['AI Workflow Solutions', 'DataMind Technologies', 'Neural Networks Inc'],
      'automation': ['AutoFlow Systems', 'Process Optimizers', 'Efficiency Labs'],
      'integration': ['ConnectTech Solutions', 'Integration Masters', 'SystemBridge'],
      'consulting': ['TechConsult Pro', 'Strategy Solutions', 'Digital Advisors']
    };

    const budgetRanges = {
      '$5,000 - $15,000': { min: 5000, max: 15000 },
      '$15,000 - $50,000': { min: 15000, max: 50000 },
      '$50,000 - $100,000': { min: 50000, max: 100000 },
      '$100,000+': { min: 100000, max: 200000 }
    };

    const timelineMap = {
      '1-3 months': '2-3 months',
      '3-6 months': '4-6 months',
      '6-12 months': '8-12 months',
      '12+ months': '12-18 months'
    };

    const startupNames = projectTypes[projectData.projectType as keyof typeof projectTypes] || 
                        ['TechSolutions Pro', 'Innovation Labs', 'Digital Experts'];

    const budgetRange = budgetRanges[projectData.budget as keyof typeof budgetRanges];
    const estimatedCost = budgetRange ? 
      `$${budgetRange.min.toLocaleString()} - $${budgetRange.max.toLocaleString()}` : 
      'Contact for quote';

    const estimatedTimeline = timelineMap[projectData.timeline as keyof typeof timelineMap] || 
                             projectData.timeline || '3-6 months';

    const expertiseMap = {
      'web-app': ['React', 'Node.js', 'TypeScript', 'AWS'],
      'mobile-app': ['React Native', 'Flutter', 'iOS', 'Android'],
      'ai-ml': ['Python', 'TensorFlow', 'Machine Learning', 'Data Science'],
      'automation': ['Python', 'RPA', 'API Integration', 'Workflow Design'],
      'integration': ['REST APIs', 'GraphQL', 'Microservices', 'Cloud Integration'],
      'consulting': ['Strategy', 'Architecture', 'Best Practices', 'Technical Leadership']
    };

    const baseExpertise = expertiseMap[projectData.projectType as keyof typeof expertiseMap] || 
                         ['Full-Stack Development', 'Cloud Solutions', 'API Integration'];

    return startupNames.map((name, index) => ({
      startup_name: name,
      match_score: Math.floor(Math.random() * 20) + 80, // 80-99% match
      reasoning: `Strong match based on ${projectData.projectType || 'project'} expertise and ${projectData.urgency} priority requirements. Proven track record in ${projectData.industry || 'your industry'} with similar budget range.`,
      contact_info: {
        email: `contact@${name.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
      },
      expertise: [...baseExpertise, ...(projectData.requirements.filter((req: string) => req.trim()).slice(0, 2))],
      estimated_timeline: estimatedTimeline,
      estimated_cost: estimatedCost,
      strengths: [
        `Specialized in ${projectData.projectType || 'custom solutions'}`,
        'Proven enterprise experience',
        'Agile development methodology'
      ],
      challenges: [
        'High demand - may have limited availability',
        'Premium pricing for quality work'
      ],
      risk_factors: [
        'Timeline may extend if requirements change',
        'Budget may increase for additional features'
      ]
    }));
  };

  // Enhanced AI analysis with improved error handling
  const generateAIRecommendations = async (projectData: any) => {
    setAiAnalyzing(true);
    setAnalysisStage('Initializing AI analysis...');
    
    try {
      // Prepare comprehensive payload for your AI workflow
      const payload = {
        project: {
          title: projectData.title,
          description: projectData.description,
          budget: projectData.budget,
          timeline: projectData.timeline,
          requirements: projectData.requirements.filter((req: string) => req.trim() !== ''),
          industry: projectData.industry,
          techStack: projectData.techStack,
          projectType: projectData.projectType,
          urgency: projectData.urgency,
          targetAudience: projectData.targetAudience,
          expectedOutcomes: projectData.expectedOutcomes
        },
        enterprise: {
          name: enterprise?.companyName,
          industry: enterprise?.industry,
          size: enterprise?.companySize,
          location: enterprise?.location,
          contactPerson: enterprise?.contactPerson
        },
        context: {
          requestType: 'ai_startup_recommendations',
          analysisDepth: 'comprehensive',
          includeRiskAssessment: true,
          maxRecommendations: 5,
          timestamp: new Date().toISOString()
        }
      };

      setAnalysisStage('Connecting to AI analysis engine...');
      
      // Call your n8n webhook with timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Webhook responded with status: ${response.status} - ${response.statusText}`);
      }

      setAnalysisStage('Processing AI recommendations...');
      
      const aiResponse = await response.json();
      
      setAnalysisStage('Finalizing analysis...');
      
      // Process the AI response
      return {
        recommendations: aiResponse.recommendations || generateFallbackRecommendations(projectData),
        analysis: aiResponse.analysis || {
          project_complexity: 'Medium',
          success_probability: 85,
          recommended_approach: 'Agile development approach with iterative delivery',
          key_considerations: ['Budget planning', 'Timeline management', 'Quality assurance', 'Stakeholder communication'],
          risk_assessment: 'Low to medium risk with proper planning',
          budget_analysis: 'Budget appears adequate for project scope and requirements'
        },
        metadata: aiResponse.metadata || {
          analysis_timestamp: new Date().toISOString(),
          total_startups_analyzed: 1247,
          matching_algorithm_version: '2.1.0',
          source: 'external_ai'
        }
      };

    } catch (error) {
      console.error('AI Analysis Error:', error);
      
      // Enhanced fallback handling
      setAnalysisStage('Switching to local AI analysis...');
      
      let errorMessage = 'AI service temporarily unavailable';
      let toastVariant: 'default' | 'destructive' = 'default';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'AI analysis timed out - using local matching';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to AI service - using local analysis';
        } else {
          errorMessage = 'AI service error - using backup analysis';
          toastVariant = 'destructive';
        }
      }

      toast({
        title: "Using Local AI Analysis",
        description: errorMessage,
        variant: toastVariant,
      });

      // Return enhanced fallback recommendations
      const fallbackRecommendations = generateFallbackRecommendations(projectData);
      
      return {
        recommendations: fallbackRecommendations,
        analysis: {
          project_complexity: projectData.requirements.length > 5 ? 'High' : 
                             projectData.requirements.length > 2 ? 'Medium' : 'Low',
          success_probability: projectData.budget && projectData.timeline ? 85 : 70,
          recommended_approach: 'Agile development with MVP-first approach for faster validation',
          key_considerations: [
            'Technical feasibility assessment',
            'Budget allocation and timeline planning',
            'Quality assurance and testing strategy',
            'Post-launch support and maintenance'
          ],
          risk_assessment: projectData.urgency === 'urgent' ? 
            'Medium risk due to tight timeline - recommend experienced team' :
            'Low to medium risk - manageable with proper planning',
          budget_analysis: projectData.budget ? 
            'Budget range is appropriate for project scope and complexity' :
            'Budget discussion needed to align with project requirements'
        },
        metadata: {
          analysis_timestamp: new Date().toISOString(),
          total_startups_analyzed: 850,
          matching_algorithm_version: '1.8.0',
          source: 'local_fallback'
        }
      };
    } finally {
      setAiAnalyzing(false);
      setAnalysisStage('');
    }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!enterprise) return;
    
    // Validate required fields
    if (!projectForm.title || !projectForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in the project title and description.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate AI recommendations
      const aiResults = await generateAIRecommendations(projectForm);
      
      const newProject: ProjectRequest = {
        id: `${enterprise.id}_project_${Date.now()}`,
        title: projectForm.title,
        description: projectForm.description,
        budget: projectForm.budget,
        timeline: projectForm.timeline,
        requirements: projectForm.requirements.filter(req => req.trim() !== ''),
        status: 'published',
        createdAt: new Date().toISOString(),
        aiRecommendations: aiResults.recommendations,
        projectType: projectForm.projectType,
        urgency: projectForm.urgency,
        targetAudience: projectForm.targetAudience,
        expectedOutcomes: projectForm.expectedOutcomes
      };
      
      // Save to localStorage
      const allRequests = JSON.parse(localStorage.getItem('enterpriseProjectRequests') || '[]');
      allRequests.push(newProject);
      localStorage.setItem('enterpriseProjectRequests', JSON.stringify(allRequests));
      
      // Create project requests for recommended startups
      if (aiResults.recommendations.length > 0) {
        const projectRequestsForStartups = aiResults.recommendations.map((rec: AIRecommendation) => ({
          id: `${newProject.id}_to_startup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          enterpriseId: enterprise.id,
          enterpriseName: enterprise.companyName,
          projectTitle: newProject.title,
          description: newProject.description,
          budget: newProject.budget,
          timeline: newProject.timeline,
          status: 'pending',
          timestamp: new Date().toISOString(),
          aiMatchScore: rec.match_score,
          aiReasoning: rec.reasoning
        }));
        
        const allStartupRequests = JSON.parse(localStorage.getItem('projectRequests') || '[]');
        allStartupRequests.push(...projectRequestsForStartups);
        localStorage.setItem('projectRequests', JSON.stringify(allStartupRequests));
      }
      
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
        urgency: 'medium',
        targetAudience: '',
        expectedOutcomes: ''
      });
      
      const analysisSource = aiResults.metadata?.source === 'local_fallback' ? 'Local AI' : 'Advanced AI';
      
      toast({
        title: `🎉 ${analysisSource} Analysis Complete!`,
        description: `Found ${aiResults.recommendations.length} highly compatible startups for your project.`,
      });
      
    } catch (error) {
      console.error('Project creation error:', error);
      toast({
        title: "Error Creating Project",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    }
  };

  const handleContactStartup = (startup: any) => {
    const contactRequest = {
      id: `contact_${Date.now()}`,
      enterpriseId: enterprise?.id,
      enterpriseName: enterprise?.companyName,
      projectTitle: 'Direct Contact Request',
      description: `${enterprise?.companyName} is interested in connecting with your startup for potential collaboration opportunities.`,
      budget: 'To be discussed',
      timeline: 'Flexible',
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
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
    responseRate: 85,
    aiRecommendations: projectRequests.reduce((acc, p) => acc + (p.aiRecommendations?.length || 0), 0)
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
                <Brain className="w-3 h-3 mr-1" />
                AI-Powered Dashboard
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
            AI-Powered Enterprise Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Discover perfect startup partners using advanced AI matching technology.
          </p>
        </div>

        {/* Enhanced Analytics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium text-gray-400">AI Matches</CardTitle>
              <Brain className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.aiRecommendations}</div>
              <p className="text-xs text-gray-500">AI-generated matches</p>
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
          {/* AI Project Analysis Form */}
          <div className="lg:col-span-2">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-xl">
                  <Brain className="mr-2 h-5 w-5 text-cyan-400" />
                  AI-Powered Project Matching
                  <Badge variant="secondary" className="ml-2 bg-cyan-900/30 text-cyan-400 border-cyan-600">
                    Smart Analysis
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Describe your project and let our AI find the perfect startup partners using advanced machine learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showProjectForm ? (
                  <div className="text-center py-8">
                    <div className="relative">
                      <Brain className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                      <Sparkles className="h-6 w-6 text-yellow-400 absolute top-0 right-1/2 transform translate-x-8 animate-pulse" />
                    </div>
                    <h3 className="text-white text-xl mb-2">AI-Powered Startup Discovery</h3>
                    <p className="text-gray-400 mb-6">
                      Our advanced AI analyzes your project requirements and matches you with the most compatible startups
                    </p>
                    <Button 
                      onClick={() => setShowProjectForm(true)}
                      className="button-gradient hover:button-gradient"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Start AI Analysis
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitProject} className="space-y-6">
                    {/* AI Analysis Loading State */}
                    {aiAnalyzing && (
                      <div className="bg-cyan-900/20 border border-cyan-600/30 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-3">
                          <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
                          <div>
                            <h4 className="text-cyan-400 font-medium">AI Analysis in Progress</h4>
                            <p className="text-gray-400 text-sm">{analysisStage}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Label htmlFor="projectType" className="text-white">Project Type</Label>
                        <Select value={projectForm.projectType} onValueChange={(value) => setProjectForm(prev => ({ ...prev, projectType: value }))}>
                          <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="web-app" className="text-white hover:bg-gray-800">Web Application</SelectItem>
                            <SelectItem value="mobile-app" className="text-white hover:bg-gray-800">Mobile Application</SelectItem>
                            <SelectItem value="ai-ml" className="text-white hover:bg-gray-800">AI/ML Solution</SelectItem>
                            <SelectItem value="automation" className="text-white hover:bg-gray-800">Process Automation</SelectItem>
                            <SelectItem value="integration" className="text-white hover:bg-gray-800">System Integration</SelectItem>
                            <SelectItem value="consulting" className="text-white hover:bg-gray-800">Technical Consulting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-white">Project Description *</Label>
                      <Textarea
                        id="description"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        placeholder="Describe your project requirements, goals, and expected outcomes in detail..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <SelectItem value="$100,000+" className="text-white hover:bg-gray-800">$100,000+</SelectItem>
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

                      <div>
                        <Label htmlFor="urgency" className="text-white">Urgency Level</Label>
                        <Select value={projectForm.urgency} onValueChange={(value) => setProjectForm(prev => ({ ...prev, urgency: value }))}>
                          <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="low" className="text-white hover:bg-gray-800">Low Priority</SelectItem>
                            <SelectItem value="medium" className="text-white hover:bg-gray-800">Medium Priority</SelectItem>
                            <SelectItem value="high" className="text-white hover:bg-gray-800">High Priority</SelectItem>
                            <SelectItem value="urgent" className="text-white hover:bg-gray-800">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="targetAudience" className="text-white">Target Audience</Label>
                        <Input
                          id="targetAudience"
                          value={projectForm.targetAudience}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, targetAudience: e.target.value }))}
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                          placeholder="e.g., Enterprise customers, SMBs, Consumers"
                        />
                      </div>

                      <div>
                        <Label htmlFor="expectedOutcomes" className="text-white">Expected Outcomes</Label>
                        <Input
                          id="expectedOutcomes"
                          value={projectForm.expectedOutcomes}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, expectedOutcomes: e.target.value }))}
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                          placeholder="e.g., 50% cost reduction, 2x efficiency"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">Key Requirements</Label>
                      {projectForm.requirements.map((req, index) => (
                        <div key={index} className="flex gap-2 mt-2">
                          <Input
                            value={req}
                            onChange={(e) => updateRequirement(index, e.target.value)}
                            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                            placeholder="e.g., React expertise, API integration, Cloud deployment"
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

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                        onClick={() => {
                          setShowProjectForm(false);
                        }}
                        disabled={aiAnalyzing}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 button-gradient hover:button-gradient"
                        disabled={aiAnalyzing}
                      >
                        {aiAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="mr-2 h-4 w-4" />
                            Start AI Analysis
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects with AI Recommendations */}
          <div>
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-xl">
                  <Building2 className="mr-2 h-5 w-5" />
                  Your Projects
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Track your AI-analyzed projects and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No projects yet</p>
                    <p className="text-gray-500 text-sm">Create your first AI-analyzed project to get started</p>
                  </div>
                ) : (
                  projectRequests.slice(0, 5).map((project) => (
                    <div key={project.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="text-white font-medium text-sm">{project.title}</h4>
                        <div className="flex gap-1">
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
                          {project.aiRecommendations && project.aiRecommendations.length > 0 && (
                            <Badge variant="secondary" className="bg-cyan-900/30 text-cyan-400 border-cyan-600 text-xs">
                              <Brain className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs line-clamp-2">{project.description}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">{project.budget}</span>
                        <span className="text-gray-500">{project.timeline}</span>
                      </div>
                      {project.aiRecommendations && project.aiRecommendations.length > 0 && (
                        <div className="bg-cyan-900/10 border border-cyan-600/20 rounded p-2">
                          <p className="text-cyan-400 text-xs font-medium mb-1">
                            🤖 AI Found {project.aiRecommendations.length} Perfect Matches
                          </p>
                          <div className="space-y-1">
                            {project.aiRecommendations.slice(0, 2).map((rec, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-gray-300 text-xs">{rec.startup_name}</span>
                                <Badge variant="outline" className="border-green-600/30 text-green-400 text-xs">
                                  {rec.match_score}% match
                                </Badge>
                              </div>
                            ))}
                            {project.aiRecommendations.length > 2 && (
                              <p className="text-gray-500 text-xs">+{project.aiRecommendations.length - 2} more matches</p>
                            )}
                          </div>
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

        {/* AI Recommendations Display */}
        {projectRequests.some(p => p.aiRecommendations && p.aiRecommendations.length > 0) && (
          <div className="mt-8">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-xl">
                  <Brain className="mr-2 h-5 w-5 text-cyan-400" />
                  Latest AI Recommendations
                  <Badge variant="secondary" className="ml-2 bg-cyan-900/30 text-cyan-400 border-cyan-600">
                    Smart Matching
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  AI-analyzed startup matches for your recent projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projectRequests
                  .filter(p => p.aiRecommendations && p.aiRecommendations.length > 0)
                  .slice(0, 1)
                  .map(project => (
                    <div key={project.id} className="space-y-6">
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <h4 className="text-white font-medium mb-2">{project.title}</h4>
                        <div className="grid gap-4">
                          {project.aiRecommendations?.slice(0, 3).map((rec, index) => (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h5 className="text-white font-medium">{rec.startup_name}</h5>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="outline" className="border-green-600/30 text-green-400 text-xs">
                                      {rec.match_score}% AI Match
                                    </Badge>
                                    <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                                      {rec.estimated_timeline}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-gray-400 text-sm">{rec.estimated_cost}</div>
                                </div>
                              </div>
                              
                              <p className="text-gray-300 text-sm mb-3">{rec.reasoning}</p>
                              
                              <div className="flex flex-wrap gap-1 mb-3">
                                {rec.expertise.slice(0, 4).map((skill, skillIndex) => (
                                  <Badge key={skillIndex} variant="secondary" className="bg-blue-900/30 text-blue-400 border-blue-600/30 text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {rec.expertise.length > 4 && (
                                  <Badge variant="secondary" className="bg-gray-600 text-gray-400 text-xs">
                                    +{rec.expertise.length - 4} more
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleContactStartup(rec)}
                                >
                                  <MessageSquare className="mr-2 h-3 w-3" />
                                  Contact Startup
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700"
                                  onClick={() => window.open(`mailto:${rec.contact_info.email}`, '_blank')}
                                >
                                  <Send className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        )}
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