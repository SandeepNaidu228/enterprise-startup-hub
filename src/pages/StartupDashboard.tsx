import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Building2, 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  Star,
  Edit,
  LogOut,
  BarChart3,
  Users,
  Globe,
  Mail,
  Menu,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Plus,
  Save
} from 'lucide-react';
import type { Startup } from '@/lib/searchService';

interface ProjectRequest {
  id: string;
  enterpriseId: string;
  enterpriseName: string;
  projectTitle: string;
  description: string;
  budget: string;
  timeline: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
  message?: string;
}

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

export default function StartupDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([]);
  const [rejectMessage, setRejectMessage] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [newTag, setNewTag] = useState('');
  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    const startupAuth = localStorage.getItem('startupAuth');
    if (!startupAuth) {
      navigate('/auth');
      return;
    }

    const startupData = localStorage.getItem('startupData');
    if (startupData) {
      const parsedStartup = JSON.parse(startupData);
      setStartup(parsedStartup);
      setEditFormData(parsedStartup);
      
      // Increment profile views (simulate backend tracking)
      const updatedStartup = { ...parsedStartup, profileViews: (parsedStartup.profileViews || 0) + 1 };
      localStorage.setItem('startupData', JSON.stringify(updatedStartup));
      
      // Load project requests for this startup
      const allRequests = JSON.parse(localStorage.getItem('projectRequests') || '[]');
      const startupRequests = allRequests.filter((req: ProjectRequest) => 
        req.id.includes(parsedStartup.id)
      );
      setProjectRequests(startupRequests);
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem('startupAuth');
    localStorage.removeItem('startupData');
    
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    
    navigate('/');
  };

  const handleAcceptRequest = (requestId: string) => {
    const updatedRequests = projectRequests.map(req => 
      req.id === requestId ? { ...req, status: 'accepted' as const } : req
    );
    setProjectRequests(updatedRequests);
    
    // Update localStorage
    const allRequests = JSON.parse(localStorage.getItem('projectRequests') || '[]');
    const updatedAllRequests = allRequests.map((req: ProjectRequest) => 
      req.id === requestId ? { ...req, status: 'accepted' } : req
    );
    localStorage.setItem('projectRequests', JSON.stringify(updatedAllRequests));
    
    toast({
      title: "Request accepted!",
      description: "The enterprise has been notified of your acceptance.",
    });
  };

  const handleRejectRequest = (requestId: string) => {
    const updatedRequests = projectRequests.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' as const, message: rejectMessage } : req
    );
    setProjectRequests(updatedRequests);
    
    // Update localStorage
    const allRequests = JSON.parse(localStorage.getItem('projectRequests') || '[]');
    const updatedAllRequests = allRequests.map((req: ProjectRequest) => 
      req.id === requestId ? { ...req, status: 'rejected', message: rejectMessage } : req
    );
    localStorage.setItem('projectRequests', JSON.stringify(updatedAllRequests));
    
    setShowRejectModal(null);
    setRejectMessage('');
    
    toast({
      title: "Request rejected",
      description: "The enterprise has been notified with your message.",
    });
  };

  const handleSaveProfile = () => {
    // Update startup data in localStorage
    const updatedStartup = { ...editFormData };
    setStartup(updatedStartup);
    localStorage.setItem('startupData', JSON.stringify(updatedStartup));
    
    // Update in startups array
    const allStartups = JSON.parse(localStorage.getItem('startups') || '[]');
    const updatedStartups = allStartups.map((s: any) => 
      s.id === updatedStartup.id ? updatedStartup : s
    );
    localStorage.setItem('startups', JSON.stringify(updatedStartups));
    
    setShowEditProfile(false);
    
    toast({
      title: "Profile updated successfully!",
      description: "Your changes have been saved.",
    });
  };

  // Profile editing helper functions
  const addTeamMember = () => {
    setEditFormData((prev: any) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: '', role: '', email: '' }]
    }));
  };

  const removeTeamMember = (index: number) => {
    setEditFormData((prev: any) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    setEditFormData((prev: any) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member: any, i: number) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const addProject = () => {
    setEditFormData((prev: any) => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', technologies: [] }]
    }));
  };

  const removeProject = (index: number) => {
    setEditFormData((prev: any) => ({
      ...prev,
      projects: prev.projects.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateProject = (index: number, field: keyof Omit<Project, 'technologies'>, value: string) => {
    setEditFormData((prev: any) => ({
      ...prev,
      projects: prev.projects.map((project: any, i: number) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const addTechnology = (projectIndex: number) => {
    if (!newTech.trim()) return;
    
    setEditFormData((prev: any) => ({
      ...prev,
      projects: prev.projects.map((project: any, i: number) => 
        i === projectIndex 
          ? { ...project, technologies: [...project.technologies, newTech.trim()] }
          : project
      )
    }));
    setNewTech('');
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    setEditFormData((prev: any) => ({
      ...prev,
      projects: prev.projects.map((project: any, i: number) => 
        i === projectIndex 
          ? { ...project, technologies: project.technologies.filter((_: any, ti: number) => ti !== techIndex) }
          : project
      )
    }));
  };

  const addTag = () => {
    if (!newTag.trim() || editFormData.tags?.includes(newTag.trim())) return;
    
    setEditFormData((prev: any) => ({
      ...prev,
      tags: [...(prev.tags || []), newTag.trim()]
    }));
    setNewTag('');
  };

  const removeTag = (index: number) => {
    setEditFormData((prev: any) => ({
      ...prev,
      tags: prev.tags.filter((_: any, i: number) => i !== index)
    }));
  };

  const calculateProfileCompleteness = (startup: Startup): number => {
    let score = 0;
    const maxScore = 10;
    
    if (startup.name) score += 1;
    if (startup.description) score += 1;
    if (startup.industry) score += 1;
    if (startup.location) score += 1;
    if (startup.website) score += 1;
    if (startup.contact.email) score += 1;
    if (startup.teamMembers.length > 0 && startup.teamMembers[0].name) score += 1;
    if (startup.projects.length > 0 && startup.projects[0].name) score += 1;
    if (startup.tags.length > 0) score += 1;
    if (startup.fundingStage) score += 1;
    
    return (score / maxScore) * 100;
  };

  // Enhanced analytics data
  const analytics = {
    profileViews: startup?.profileViews || 234,
    projectsSubmitted: startup?.projectsSubmitted || 5,
    completedProjects: startup?.completedProjects || 3,
    pendingRequests: projectRequests.filter(req => req.status === 'pending').length,
    averageRating: startup?.averageRating || 4.7
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Startup data not found</div>
      </div>
    );
  }

  const completeness = calculateProfileCompleteness(startup);

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
                Startup Dashboard
              </Badge>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
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
            Welcome back, {startup.name}!
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your startup profile and track your project opportunities.
          </p>
        </div>

        {/* Enhanced Analytics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="card-gradient hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Profile Views</CardTitle>
              <Eye className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.profileViews}</div>
              <p className="text-xs text-gray-500">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="card-gradient hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Projects Submitted</CardTitle>
              <Building2 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.projectsSubmitted}</div>
              <p className="text-xs text-gray-500">Total submissions</p>
            </CardContent>
          </Card>

          <Card className="card-gradient hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Completed Projects</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.completedProjects}</div>
              <p className="text-xs text-gray-500">Successfully delivered</p>
            </CardContent>
          </Card>

          <Card className="card-gradient hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.pendingRequests}</div>
              <p className="text-xs text-gray-500">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="card-gradient hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.averageRating.toFixed(1)}</div>
              <p className="text-xs text-gray-500">From {startup.totalRatings || 0} reviews</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Requests */}
          <div className="lg:col-span-2">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-xl">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Project Requests
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage incoming project requests from enterprises
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No project requests yet</p>
                    <p className="text-gray-500 text-sm">Enterprises will contact you when they're interested in your services</p>
                  </div>
                ) : (
                  projectRequests.map((request) => (
                    <div key={request.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-white font-medium">{request.projectTitle}</h4>
                          <p className="text-gray-400 text-sm">From: {request.enterpriseName}</p>
                          <Badge 
                            variant="outline" 
                            className={`mt-1 text-xs ${
                              request.status === 'pending' ? 'border-yellow-600 text-yellow-400' :
                              request.status === 'accepted' ? 'border-green-600 text-green-400' :
                              'border-red-600 text-red-400'
                            }`}
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-right ml-2">
                          <div className="text-gray-500 text-xs">
                            {new Date(request.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm">{request.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500">Budget: </span>
                          <span className="text-white">{request.budget}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Timeline: </span>
                          <span className="text-white">{request.timeline}</span>
                        </div>
                      </div>
                      
                      {request.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleAcceptRequest(request.id)}
                          >
                            <CheckCircle className="mr-2 h-3 w-3" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1 border-red-600 text-red-400 hover:bg-red-900/20"
                            onClick={() => setShowRejectModal(request.id)}
                          >
                            <XCircle className="mr-2 h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      )}
                      
                      {request.status === 'rejected' && request.message && (
                        <div className="bg-red-900/20 border border-red-600/30 rounded p-2 mt-2">
                          <p className="text-red-400 text-xs">
                            <strong>Rejection reason:</strong> {request.message}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Summary */}
          <div>
            <Card className="card-gradient mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-xl">
                  <User className="mr-2 h-5 w-5" />
                  Profile Completeness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{Math.round(completeness)}% Complete</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                      onClick={() => setShowEditProfile(true)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                  <Progress value={completeness} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-xl">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="text-white font-bold text-lg">{startup.teamSize}</div>
                    <div className="text-gray-400 text-xs">Team Members</div>
                  </div>
                  <div className="text-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="text-white font-bold text-lg">{startup.projects.length}</div>
                    <div className="text-gray-400 text-xs">Projects</div>
                  </div>
                  <div className="text-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="text-white font-bold text-lg">{startup.tags.length}</div>
                    <div className="text-gray-400 text-xs">Skills</div>
                  </div>
                  <div className="text-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="text-white font-bold text-lg">{startup.rating.toFixed(1)}</div>
                    <div className="text-gray-400 text-xs">Rating</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-300 text-sm">
                    <Building2 className="mr-2 h-3 w-3" />
                    <span className="truncate">{startup.industry}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <Globe className="mr-2 h-3 w-3" />
                    <span className="truncate">{startup.location}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <TrendingUp className="mr-2 h-3 w-3" />
                    <span className="truncate">{startup.fundingStage}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="card-gradient max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Startup Name</Label>
                    <Input
                      id="name"
                      value={editFormData.name || ''}
                      onChange={(e) => setEditFormData((prev: any) => ({ ...prev, name: e.target.value }))}
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
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={editFormData.description || ''}
                    onChange={(e) => setEditFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                    className="bg-gray-900 border-gray-700 text-white"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location" className="text-white">Location</Label>
                    <Input
                      id="location"
                      value={editFormData.location || ''}
                      onChange={(e) => setEditFormData((prev: any) => ({ ...prev, location: e.target.value }))}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website" className="text-white">Website</Label>
                    <Input
                      id="website"
                      value={editFormData.website || ''}
                      onChange={(e) => setEditFormData((prev: any) => ({ ...prev, website: e.target.value }))}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Team Members</h3>
                  <Button onClick={addTeamMember} variant="outline" size="sm" className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
                
                {editFormData.teamMembers?.map((member: any, index: number) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <Input
                      value={member.name}
                      onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Name"
                    />
                    <Input
                      value={member.role}
                      onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Role"
                    />
                    <Input
                      value={member.email}
                      onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Email"
                    />
                    <Button
                      onClick={() => removeTeamMember(index)}
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-400 hover:bg-red-900/20"
                      disabled={editFormData.teamMembers?.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Projects</h3>
                  <Button onClick={addProject} variant="outline" size="sm" className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </div>
                
                {editFormData.projects?.map((project: any, index: number) => (
                  <div key={index} className="p-4 bg-gray-900 rounded-lg border border-gray-700 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-white font-medium">Project {index + 1}</h4>
                      <Button
                        onClick={() => removeProject(index)}
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                        disabled={editFormData.projects?.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        value={project.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Project name"
                      />
                      <div className="flex gap-2">
                        <Input
                          value={newTech}
                          onChange={(e) => setNewTech(e.target.value)}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="Add technology"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTechnology(index);
                            }
                          }}
                        />
                        <Button
                          onClick={() => addTechnology(index)}
                          variant="outline"
                          size="sm"
                          className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 shrink-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Textarea
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Project description"
                      rows={3}
                    />
                    
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech: string, techIndex: number) => (
                        <Badge key={techIndex} variant="secondary" className="bg-gray-700 text-gray-300 border-gray-600">
                          {tech}
                          <Button
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
                <h3 className="text-lg font-semibold text-white">Tags</h3>
                
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white"
                    placeholder="Add a tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button
                    onClick={addTag}
                    variant="outline"
                    className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {editFormData.tags?.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300 border-gray-600">
                      {tag}
                      <Button
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

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="card-gradient max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-white">Reject Project Request</CardTitle>
              <CardDescription className="text-gray-400">
                Please provide a reason for rejecting this request (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={rejectMessage}
                onChange={(e) => setRejectMessage(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                placeholder="Thank you for your interest, but we're currently focused on different types of projects..."
                rows={4}
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                  onClick={() => {
                    setShowRejectModal(null);
                    setRejectMessage('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleRejectRequest(showRejectModal)}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Rejection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}