import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Rocket, 
  Users, 
  Star, 
  ArrowRight,
  CheckCircle,
  Globe,
  Zap,
  Target,
  Brain,
  Sparkles,
  Play,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  AlertCircle
} from 'lucide-react';
import { mockStartupData, mockEnterpriseData, sampleProjectRequest } from '@/data/mockStartup';

export default function DemoScenario() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreatingStartup, setIsCreatingStartup] = useState(false);
  const [isCreatingEnterprise, setIsCreatingEnterprise] = useState(false);
  const [startupCreated, setStartupCreated] = useState(false);
  const [enterpriseCreated, setEnterpriseCreated] = useState(false);

  const createStartup = async () => {
    setIsCreatingStartup(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add startup to localStorage
    const existingStartups = JSON.parse(localStorage.getItem('startups') || '[]');
    existingStartups.push(mockStartupData);
    localStorage.setItem('startups', JSON.stringify(existingStartups));
    
    setIsCreatingStartup(false);
    setStartupCreated(true);
    
    toast({
      title: "🚀 Startup Created Successfully!",
      description: "TechFlow Innovations is now registered on the platform.",
    });
  };

  const createEnterprise = async () => {
    setIsCreatingEnterprise(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add enterprise to localStorage
    const existingEnterprises = JSON.parse(localStorage.getItem('enterprises') || '[]');
    existingEnterprises.push(mockEnterpriseData);
    localStorage.setItem('enterprises', JSON.stringify(existingEnterprises));
    
    // Set up enterprise session
    localStorage.setItem('enterpriseAuth', JSON.stringify({
      email: mockEnterpriseData.email,
      enterpriseId: mockEnterpriseData.id,
      isAuthenticated: true
    }));
    localStorage.setItem('enterpriseData', JSON.stringify(mockEnterpriseData));
    
    setIsCreatingEnterprise(false);
    setEnterpriseCreated(true);
    
    toast({
      title: "🏢 Enterprise Account Created!",
      description: "GlobalTech Solutions is ready to discover startups.",
    });
  };

  const startAIDemo = () => {
    // Navigate to enterprise dashboard where they can request the AI service
    navigate('/enterprise-dashboard');
    
    toast({
      title: "🎯 Demo Ready!",
      description: "You can now test the AI-powered startup matching system.",
    });
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-2xl">Y</span>
            </div>
            <span className="text-3xl font-bold text-white">Yhteys</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            AI-Powered Demo Scenario
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience how our AI matches enterprises with perfect startup partners. 
            We'll create a sample startup and enterprise, then demonstrate the intelligent matching process.
          </p>
        </div>

        {/* Demo Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Step 1: Create Startup */}
          <Card className={`card-gradient hover-lift ${currentStep >= 1 ? 'ring-2 ring-blue-500' : ''}`}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-fit">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Step 1: Create Startup</CardTitle>
              <CardDescription className="text-gray-400">
                Register TechFlow Innovations - an AI automation startup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h4 className="text-white font-medium mb-2">TechFlow Innovations</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-300">
                    <Building2 className="mr-2 h-3 w-3" />
                    <span>SaaS / AI Automation</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MapPin className="mr-2 h-3 w-3" />
                    <span>Austin, TX</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Users className="mr-2 h-3 w-3" />
                    <span>12 team members</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Star className="mr-2 h-3 w-3" />
                    <span>4.8/5 rating</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={createStartup}
                disabled={isCreatingStartup || startupCreated}
                className="w-full button-gradient hover:button-gradient"
              >
                {isCreatingStartup ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Startup...
                  </>
                ) : startupCreated ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Startup Created!
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Create Startup
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Create Enterprise */}
          <Card className={`card-gradient hover-lift ${currentStep >= 2 ? 'ring-2 ring-green-500' : ''}`}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full w-fit">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Step 2: Create Enterprise</CardTitle>
              <CardDescription className="text-gray-400">
                Register GlobalTech Solutions - a technology consulting firm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h4 className="text-white font-medium mb-2">GlobalTech Solutions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-300">
                    <Building2 className="mr-2 h-3 w-3" />
                    <span>Technology Consulting</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MapPin className="mr-2 h-3 w-3" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Users className="mr-2 h-3 w-3" />
                    <span>201-1000 employees</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <User className="mr-2 h-3 w-3" />
                    <span>Jennifer Martinez</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={createEnterprise}
                disabled={isCreatingEnterprise || enterpriseCreated || !startupCreated}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isCreatingEnterprise ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Enterprise...
                  </>
                ) : enterpriseCreated ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Enterprise Created!
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    Create Enterprise
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Step 3: AI Demo */}
          <Card className={`card-gradient hover-lift ${currentStep >= 3 ? 'ring-2 ring-cyan-500' : ''}`}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-fit">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Step 3: AI Matching Demo</CardTitle>
              <CardDescription className="text-gray-400">
                Test the AI-powered startup recommendation system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h4 className="text-white font-medium mb-2">Sample Project Request</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-300">
                    <Brain className="mr-2 h-3 w-3" />
                    <span>AI Customer Support</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <DollarSign className="mr-2 h-3 w-3" />
                    <span>$100,000+ budget</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock className="mr-2 h-3 w-3" />
                    <span>6-12 months</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <AlertCircle className="mr-2 h-3 w-3" />
                    <span>High priority</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={startAIDemo}
                disabled={!enterpriseCreated}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Brain className="mr-2 h-4 w-4" />
                Start AI Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Project Details Preview */}
        {enterpriseCreated && (
          <Card className="card-gradient mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-2xl">
                <Sparkles className="mr-2 h-6 w-6 text-yellow-400" />
                Sample Project: AI Customer Support Automation
              </CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                This is the project that GlobalTech Solutions will submit for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Project Overview</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {sampleProjectRequest.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-2">Expected Outcomes</h4>
                    <p className="text-gray-300 text-sm">
                      {sampleProjectRequest.expectedOutcomes}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                      <div className="text-gray-400 text-xs">Budget</div>
                      <div className="text-white font-medium">{sampleProjectRequest.budget}</div>
                    </div>
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                      <div className="text-gray-400 text-xs">Timeline</div>
                      <div className="text-white font-medium">{sampleProjectRequest.timeline}</div>
                    </div>
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                      <div className="text-gray-400 text-xs">Type</div>
                      <div className="text-white font-medium">AI/ML Solution</div>
                    </div>
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                      <div className="text-gray-400 text-xs">Priority</div>
                      <div className="text-white font-medium">High</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-2">Key Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {sampleProjectRequest.requirements.slice(0, 4).map((req, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-900/30 text-blue-400 border-blue-600/30 text-xs">
                          {req}
                        </Badge>
                      ))}
                      <Badge variant="secondary" className="bg-gray-600 text-gray-400 text-xs">
                        +{sampleProjectRequest.requirements.length - 4} more
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expected AI Results Preview */}
        {enterpriseCreated && (
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-2xl">
                <Brain className="mr-2 h-6 w-6 text-cyan-400" />
                Expected AI Analysis Results
                <Badge variant="secondary" className="ml-2 bg-cyan-900/30 text-cyan-400 border-cyan-600">
                  Powered by ChatGPT
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                Preview of what the AI will analyze and recommend
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                <h4 className="text-green-400 font-medium mb-3 flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  Perfect Match Expected: TechFlow Innovations
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-white font-medium mb-2">Why it's a perfect match:</div>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Specializes in AI automation solutions</li>
                      <li>• Has experience with NLP and ML integration</li>
                      <li>• Proven track record with enterprise clients</li>
                      <li>• Team expertise in required technologies</li>
                      <li>• Timeline and budget alignment</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-white font-medium mb-2">Expected AI Score:</div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="outline" className="border-green-600/30 text-green-400 text-lg px-3 py-1">
                        95% Match
                      </Badge>
                    </div>
                    <div className="text-gray-300 text-sm">
                      <div>Estimated Cost: $75,000 - $120,000</div>
                      <div>Estimated Timeline: 4-6 months</div>
                      <div>Success Probability: 92%</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={startAIDemo}
                  disabled={!enterpriseCreated}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 px-8 py-3 text-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Experience the AI Demo Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}