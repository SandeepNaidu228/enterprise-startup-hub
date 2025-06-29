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
import { useAuth } from '@/contexts/AuthContext';
import { db, supabase } from '@/lib/supabase';
import { Rocket, Building2, Plus, X, ArrowLeft, Users, Key, AlertCircle } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  email: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
}

interface StartupFormData {
  name: string;
  description: string;
  industry: string;
  location: string;
  website: string;
  contact: {
    email: string;
    phone: string;
  };
  teamMembers: TeamMember[];
  projects: Project[];
  tags: string[];
  fundingStage: string;
  teamSize: number;
  foundedYear: number;
  password: string;
}

interface EnterpriseFormData {
  companyName: string;
  contactPerson: string;
  industry: string;
  companySize: string;
  location: string;
  email: string;
  password: string;
}

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signUp, signIn, loading: authLoading } = useAuth();
  const [userType, setUserType] = useState<'startup' | 'enterprise'>('startup');
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [startupFormData, setStartupFormData] = useState<StartupFormData>({
    name: '',
    description: '',
    industry: '',
    location: '',
    website: '',
    contact: {
      email: '',
      phone: ''
    },
    teamMembers: [{ name: '', role: '', email: '' }],
    projects: [{ name: '', description: '', technologies: [] }],
    tags: [],
    fundingStage: '',
    teamSize: 1,
    foundedYear: new Date().getFullYear(),
    password: ''
  });

  const [enterpriseFormData, setEnterpriseFormData] = useState<EnterpriseFormData>({
    companyName: '',
    contactPerson: '',
    industry: '',
    companySize: '',
    location: '',
    email: '',
    password: ''
  });

  const [newTag, setNewTag] = useState('');
  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    if (user) {
      // Check if user has startup or enterprise profile
      checkUserProfile();
    }
  }, [user]);

  const checkUserProfile = async () => {
    if (!user) return;

    try {
      // Check for startup profile
      const { data: startup } = await db.startups.getByUserId(user.id);
      if (startup) {
        navigate('/startup-dashboard');
        return;
      }

      // Check for enterprise profile
      const { data: enterprise } = await db.enterprises.getByUserId(user.id);
      if (enterprise) {
        navigate('/enterprise-dashboard');
        return;
      }
    } catch (error) {
      // User doesn't have a profile yet, stay on auth page
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?reset=true`
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password reset email sent!",
        description: "Check your email for instructions to reset your password.",
      });

      setShowPasswordReset(false);
      setResetEmail('');
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const industries = [
    'SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'AI/ML', 
    'Blockchain', 'IoT', 'Cybersecurity', 'CleanTech', 'AgriTech', 'Other'
  ];

  const fundingStages = [
    'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Bootstrapped'
  ];

  const companySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees', 
    '201-1000 employees', '1000+ employees'
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        throw error;
      }

      toast({
        title: "Login successful!",
        description: "Welcome back to Yhteys.",
      });

      // Navigation will be handled by useEffect when user state updates
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartupRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!startupFormData.name || !startupFormData.contact.email || !startupFormData.password) {
        throw new Error('Please fill in all required fields including password');
      }

      if (startupFormData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Create auth user with the provided password
      const { data: authData, error: authError } = await signUp(
        startupFormData.contact.email,
        startupFormData.password,
        { user_type: 'startup' }
      );

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Create startup profile
      const startupData = {
        user_id: authData.user.id,
        name: startupFormData.name,
        description: startupFormData.description,
        industry: startupFormData.industry,
        location: startupFormData.location,
        website: startupFormData.website,
        contact_email: startupFormData.contact.email,
        contact_phone: startupFormData.contact.phone,
        team_members: startupFormData.teamMembers,
        projects: startupFormData.projects,
        tags: startupFormData.tags,
        funding_stage: startupFormData.fundingStage,
        team_size: startupFormData.teamSize,
        founded_year: startupFormData.foundedYear,
        rating: 4.0 + Math.random() * 1
      };

      const { error: dbError } = await db.startups.create(startupData);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Registration successful!",
        description: "Welcome to Yhteys! Your startup profile has been created.",
      });

      navigate('/startup-dashboard');
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnterpriseRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!enterpriseFormData.companyName || !enterpriseFormData.contactPerson || !enterpriseFormData.email || !enterpriseFormData.password) {
        throw new Error('Please fill in all required fields including password');
      }

      if (enterpriseFormData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Create auth user
      const { data: authData, error: authError } = await signUp(
        enterpriseFormData.email,
        enterpriseFormData.password,
        { user_type: 'enterprise' }
      );

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Create enterprise profile
      const enterpriseData = {
        user_id: authData.user.id,
        company_name: enterpriseFormData.companyName,
        contact_person: enterpriseFormData.contactPerson,
        email: enterpriseFormData.email,
        industry: enterpriseFormData.industry,
        company_size: enterpriseFormData.companySize,
        location: enterpriseFormData.location
      };

      const { error: dbError } = await db.enterprises.create(enterpriseData);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Registration successful!",
        description: "Welcome to Yhteys! You can now discover startups.",
      });

      navigate('/enterprise-dashboard');
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Startup form helper functions
  const addTeamMember = () => {
    setStartupFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: '', role: '', email: '' }]
    }));
  };

  const removeTeamMember = (index: number) => {
    setStartupFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    setStartupFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const addProject = () => {
    setStartupFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', technologies: [] }]
    }));
  };

  const removeProject = (index: number) => {
    setStartupFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const updateProject = (index: number, field: keyof Omit<Project, 'technologies'>, value: string) => {
    setStartupFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const addTechnology = (projectIndex: number) => {
    if (!newTech.trim()) return;
    
    setStartupFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === projectIndex 
          ? { ...project, technologies: [...project.technologies, newTech.trim()] }
          : project
      )
    }));
    setNewTech('');
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    setStartupFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === projectIndex 
          ? { ...project, technologies: project.technologies.filter((_, ti) => ti !== techIndex) }
          : project
      )
    }));
  };

  const addTag = () => {
    if (!newTag.trim() || startupFormData.tags.includes(newTag.trim())) return;
    
    setStartupFormData(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    setNewTag('');
  };

  const removeTag = (index: number) => {
    setStartupFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">Y</span>
            </div>
            <span className="text-xl font-semibold text-white">Yhteys</span>
          </div>
        </div>

        <Card className="card-gradient">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-white rounded-lg w-fit">
              {userType === 'startup' ? (
                <Rocket className="h-8 w-8 text-black" />
              ) : (
                <Building2 className="h-8 w-8 text-black" />
              )}
            </div>
            <CardTitle className="text-2xl sm:text-3xl text-white">
              {isLogin ? 'Welcome Back!' : 'Join Yhteys'}
            </CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              {isLogin 
                ? 'Sign in to your account' 
                : 'Create your account and start building connections'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* User Type Selection */}
            <div className="flex justify-center">
              <div className="bg-gray-900 p-1 rounded-lg border border-gray-700">
                <Button
                  variant={userType === 'startup' ? "default" : "ghost"}
                  onClick={() => setUserType('startup')}
                  className={`${userType === 'startup' ? "button-gradient" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
                >
                  <Rocket className="mr-2 h-4 w-4" />
                  Startup
                </Button>
                <Button
                  variant={userType === 'enterprise' ? "default" : "ghost"}
                  onClick={() => setUserType('enterprise')}
                  className={`${userType === 'enterprise' ? "button-gradient" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Enterprise
                </Button>
              </div>
            </div>

            {/* Login/Register Toggle */}
            <div className="flex justify-center">
              <div className="bg-gray-900 p-1 rounded-lg border border-gray-700">
                <Button
                  variant={isLogin ? "default" : "ghost"}
                  onClick={() => setIsLogin(true)}
                  className={`${isLogin ? "button-gradient" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
                >
                  Login
                </Button>
                <Button
                  variant={!isLogin ? "default" : "ghost"}
                  onClick={() => setIsLogin(false)}
                  className={`${!isLogin ? "button-gradient" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
                >
                  Register
                </Button>
              </div>
            </div>

            {isLogin ? (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="Your password"
                    required
                  />
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowPasswordReset(true)}
                    className="text-gray-400 hover:text-white text-sm p-0 h-auto"
                  >
                    <Key className="mr-1 h-3 w-3" />
                    Forgot password?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full button-gradient hover:button-gradient font-medium"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            ) : userType === 'startup' ? (
              /* Startup Registration Form */
              <form onSubmit={handleStartupRegister} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Startup Name *</Label>
                      <Input
                        id="name"
                        value={startupFormData.name}
                        onChange={(e) => setStartupFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        placeholder="Your startup name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="industry" className="text-white">Industry *</Label>
                      <Select value={startupFormData.industry} onValueChange={(value) => setStartupFormData(prev => ({ ...prev, industry: value }))}>
                        <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          {industries.map(industry => (
                            <SelectItem key={industry} value={industry} className="text-white hover:bg-gray-800">{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white">Description *</Label>
                    <Textarea
                      id="description"
                      value={startupFormData.description}
                      onChange={(e) => setStartupFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      placeholder="Describe your startup, what you do, and your mission..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location" className="text-white">Location</Label>
                      <Input
                        id="location"
                        value={startupFormData.location}
                        onChange={(e) => setStartupFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        placeholder="City, Country"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="website" className="text-white">Website</Label>
                      <Input
                        id="website"
                        value={startupFormData.website}
                        onChange={(e) => setStartupFormData(prev => ({ ...prev, website: e.target.value }))}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Contact & Security</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-white">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={startupFormData.contact.email}
                        onChange={(e) => setStartupFormData(prev => ({ 
                          ...prev, 
                          contact: { ...prev.contact, email: e.target.value }
                        }))}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        placeholder="contact@startup.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-white">Phone</Label>
                      <Input
                        id="phone"
                        value={startupFormData.contact.phone}
                        onChange={(e) => setStartupFormData(prev => ({ 
                          ...prev, 
                          contact: { ...prev.contact, phone: e.target.value }
                        }))}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-white">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={startupFormData.password}
                      onChange={(e) => setStartupFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      placeholder="Create a secure password (min 6 characters)"
                      required
                      minLength={6}
                    />
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Password must be at least 6 characters long
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Additional Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="fundingStage" className="text-white">Funding Stage</Label>
                      <Select value={startupFormData.fundingStage} onValueChange={(value) => setStartupFormData(prev => ({ ...prev, fundingStage: value }))}>
                        <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          {fundingStages.map(stage => (
                            <SelectItem key={stage} value={stage} className="text-white hover:bg-gray-800">{stage}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="teamSize" className="text-white">Team Size</Label>
                      <Input
                        id="teamSize"
                        type="number"
                        value={startupFormData.teamSize}
                        onChange={(e) => setStartupFormData(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 1 }))}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="foundedYear" className="text-white">Founded Year</Label>
                      <Input
                        id="foundedYear"
                        type="number"
                        value={startupFormData.foundedYear}
                        onChange={(e) => setStartupFormData(prev => ({ ...prev, foundedYear: parseInt(e.target.value) || new Date().getFullYear() }))}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full button-gradient hover:button-gradient py-3 text-lg font-medium"
                  disabled={loading}
                >
                  {loading ? 'Creating Profile...' : 'Create Startup Profile'}
                </Button>
              </form>
            ) : (
              /* Enterprise Registration Form */
              <form onSubmit={handleEnterpriseRegister} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName" className="text-white">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={enterpriseFormData.companyName}
                      onChange={(e) => setEnterpriseFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      placeholder="Your Company Inc."
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactPerson" className="text-white">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      value={enterpriseFormData.contactPerson}
                      onChange={(e) => setEnterpriseFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-white">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={enterpriseFormData.email}
                      onChange={(e) => setEnterpriseFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      placeholder="enterprise@company.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password" className="text-white">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={enterpriseFormData.password}
                      onChange={(e) => setEnterpriseFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      placeholder="Create a secure password (min 6 characters)"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="flex items-center text-xs text-gray-500">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Password must be at least 6 characters long
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry" className="text-white">Industry</Label>
                    <Select value={enterpriseFormData.industry} onValueChange={(value) => setEnterpriseFormData(prev => ({ ...prev, industry: value }))}>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        {industries.map(industry => (
                          <SelectItem key={industry} value={industry} className="text-white hover:bg-gray-800">{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="companySize" className="text-white">Company Size</Label>
                    <Select value={enterpriseFormData.companySize} onValueChange={(value) => setEnterpriseFormData(prev => ({ ...prev, companySize: value }))}>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        {companySizes.map(size => (
                          <SelectItem key={size} value={size} className="text-white hover:bg-gray-800">{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-white">Location</Label>
                  <Input
                    id="location"
                    value={enterpriseFormData.location}
                    onChange={(e) => setEnterpriseFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="City, Country"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full button-gradient hover:button-gradient py-3 text-lg font-medium"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Enterprise Account'}
                </Button>
              </form>
            )}

            {/* Benefits Section */}
            <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-gray-700">
              <h3 className="text-white font-semibold mb-4">
                {userType === 'startup' ? 'Startup Benefits' : 'Enterprise Benefits'}
              </h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                {userType === 'startup' ? (
                  <>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-700 mr-3 text-xs">
                        ✓
                      </Badge>
                      Connect with enterprise clients worldwide
                    </li>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-700 mr-3 text-xs">
                        ✓
                      </Badge>
                      Showcase your projects and expertise
                    </li>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-700 mr-3 text-xs">
                        ✓
                      </Badge>
                      Track project requests and ratings
                    </li>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-700 mr-3 text-xs">
                        ✓
                      </Badge>
                      Build your reputation and portfolio
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-700 mr-3 text-xs">
                        ✓
                      </Badge>
                      Access to 1000+ verified startups
                    </li>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-700 mr-3 text-xs">
                        ✓
                      </Badge>
                      AI-powered startup recommendations
                    </li>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-700 mr-3 text-xs">
                        ✓
                      </Badge>
                      Project management and tracking
                    </li>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-700 mr-3 text-xs">
                        ✓
                      </Badge>
                      Rate and review partnerships
                    </li>
                  </>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Password Reset Modal */}
        {showPasswordReset && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="card-gradient max-w-md w-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white text-xl flex items-center">
                    <Key className="mr-2 h-5 w-5" />
                    Reset Password
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPasswordReset(false)}
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-gray-400">
                  Enter your email address and we'll send you a link to reset your password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <Label htmlFor="resetEmail" className="text-white">Email Address</Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                      onClick={() => setShowPasswordReset(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 button-gradient hover:button-gradient"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}