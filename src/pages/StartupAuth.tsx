import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Rocket, Plus, X, ArrowLeft } from 'lucide-react';

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

export default function StartupAuth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [loading, setLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [formData, setFormData] = useState<StartupFormData>({
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

  const [newTag, setNewTag] = useState('');
  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    // Check if already authenticated
    const startupAuth = localStorage.getItem('startupAuth');
    if (startupAuth) {
      navigate('/startup-dashboard');
    }
  }, [navigate]);

  const industries = [
    'SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'AI/ML', 
    'Blockchain', 'IoT', 'Cybersecurity', 'CleanTech', 'AgriTech', 'Other'
  ];

  const fundingStages = [
    'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Bootstrapped'
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simple localStorage-based authentication for testing
      const existingStartups = JSON.parse(localStorage.getItem('startups') || '[]');
      const startup = existingStartups.find((s: any) => s.contact.email === loginData.email);
      
      if (!startup) {
        throw new Error('Startup not found. Please register first.');
      }

      const startupAuth = {
        email: loginData.email,
        startupId: startup.id,
        isAuthenticated: true
      };
      
      localStorage.setItem('startupAuth', JSON.stringify(startupAuth));
      localStorage.setItem('startupData', JSON.stringify(startup));

      toast({
        title: "Login successful!",
        description: "Welcome back to Yhteys.",
      });

      navigate('/startup-dashboard');
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.name || !formData.contact.email || !formData.password) {
        throw new Error('Please fill in all required fields');
      }

      // Create startup object
      const startup = {
        id: `startup_${Date.now()}`,
        ...formData,
        rating: 4.0 + Math.random() * 1, // Random rating between 4.0-5.0
        createdAt: new Date().toISOString()
      };

      // Simple localStorage-based storage for testing
      const existingStartups = JSON.parse(localStorage.getItem('startups') || '[]');
      existingStartups.push(startup);
      localStorage.setItem('startups', JSON.stringify(existingStartups));

      const startupAuth = {
        email: formData.contact.email,
        startupId: startup.id,
        isAuthenticated: true
      };
      
      localStorage.setItem('startupAuth', JSON.stringify(startupAuth));
      localStorage.setItem('startupData', JSON.stringify(startup));

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

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: '', role: '', email: '' }]
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', technologies: [] }]
    }));
  };

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const updateProject = (index: number, field: keyof Omit<Project, 'technologies'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const addTechnology = (projectIndex: number) => {
    if (!newTech.trim()) return;
    
    setFormData(prev => ({
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
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === projectIndex 
          ? { ...project, technologies: project.technologies.filter((_, ti) => ti !== techIndex) }
          : project
      )
    }));
  };

  const addTag = () => {
    if (!newTag.trim() || formData.tags.includes(newTag.trim())) return;
    
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    setNewTag('');
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10 text-sm sm:text-base"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img src="/Yhteys.png" alt="Yhteys" className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-lg sm:text-2xl font-bold text-white">Yhteys</span>
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center px-4 sm:px-6">
            <div className="mx-auto mb-4 p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-fit">
              <Rocket className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl text-white">
              {isLogin ? 'Welcome Back!' : 'Join as Startup'}
            </CardTitle>
            <CardDescription className="text-gray-300 text-base sm:text-lg">
              {isLogin 
                ? 'Sign in to your startup dashboard' 
                : 'Create your startup profile and connect with enterprises'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-4 sm:px-6">
            {/* Toggle Login/Register */}
            <div className="flex justify-center">
              <div className="bg-black/20 p-1 rounded-lg">
                <Button
                  variant={isLogin ? "default" : "ghost"}
                  onClick={() => setIsLogin(true)}
                  className={`text-sm sm:text-base ${isLogin ? "bg-white text-black" : "text-white hover:bg-white/10"}`}
                >
                  Login
                </Button>
                <Button
                  variant={!isLogin ? "default" : "ghost"}
                  onClick={() => setIsLogin(false)}
                  className={`text-sm sm:text-base ${!isLogin ? "bg-white text-black" : "text-white hover:bg-white/10"}`}
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
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
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
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Your password"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            ) : (
              /* Registration Form */
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Startup Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Your startup name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="industry" className="text-white">Industry *</Label>
                      <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map(industry => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
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
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="City, Country"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="website" className="text-white">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-white">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.contact.email}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          contact: { ...prev.contact, email: e.target.value }
                        }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="contact@startup.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-white">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.contact.phone}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          contact: { ...prev.contact, phone: e.target.value }
                        }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-white">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="Create a secure password"
                      required
                    />
                  </div>
                </div>

                {/* Team Members */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Team Members</h3>
                    <Button type="button" onClick={addTeamMember} variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                  
                  {formData.teamMembers.map((member, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-black/20 rounded-lg">
                      <Input
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Name"
                      />
                      <Input
                        value={member.role}
                        onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Role"
                      />
                      <Input
                        value={member.email}
                        onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Email"
                      />
                      <Button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        variant="outline"
                        size="sm"
                        className="border-red-400/20 text-red-400 hover:bg-red-400/10 w-full sm:w-auto"
                        disabled={formData.teamMembers.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Projects */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Projects</h3>
                    <Button type="button" onClick={addProject} variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                  
                  {formData.projects.map((project, index) => (
                    <div key={index} className="p-4 bg-black/20 rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-white font-medium">Project {index + 1}</h4>
                        <Button
                          type="button"
                          onClick={() => removeProject(index)}
                          variant="outline"
                          size="sm"
                          className="border-red-400/20 text-red-400 hover:bg-red-400/10"
                          disabled={formData.projects.length === 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          value={project.name}
                          onChange={(e) => updateProject(index, 'name', e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          placeholder="Project name"
                        />
                        <div className="flex gap-2">
                          <Input
                            value={newTech}
                            onChange={(e) => setNewTech(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            placeholder="Add technology"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTechnology(index);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={() => addTechnology(index)}
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10 shrink-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <Textarea
                        value={project.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Project description"
                        rows={3}
                      />
                      
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                            {tech}
                            <Button
                              type="button"
                              onClick={() => removeTechnology(index, techIndex)}
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Tags</h3>
                  
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="Add a tag (e.g., AI, automation, SaaS)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                        {tag}
                        <Button
                          type="button"
                          onClick={() => removeTag(index)}
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Additional Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="fundingStage" className="text-white">Funding Stage</Label>
                      <Select value={formData.fundingStage} onValueChange={(value) => setFormData(prev => ({ ...prev, fundingStage: value }))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {fundingStages.map(stage => (
                            <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="teamSize" className="text-white">Team Size</Label>
                      <Input
                        id="teamSize"
                        type="number"
                        value={formData.teamSize}
                        onChange={(e) => setFormData(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 1 }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="foundedYear" className="text-white">Founded Year</Label>
                      <Input
                        id="foundedYear"
                        type="number"
                        value={formData.foundedYear}
                        onChange={(e) => setFormData(prev => ({ ...prev, foundedYear: parseInt(e.target.value) || new Date().getFullYear() }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 text-base sm:text-lg"
                  disabled={loading}
                >
                  {loading ? 'Creating Profile...' : 'Create Startup Profile'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}