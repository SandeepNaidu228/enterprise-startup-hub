import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Building2, ArrowLeft } from 'lucide-react';

interface EnterpriseFormData {
  email: string;
  password: string;
  companyName: string;
  contactPerson: string;
}

export default function EnterpriseAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<EnterpriseFormData>({
    email: '',
    password: '',
    companyName: '',
    contactPerson: ''
  });

  useEffect(() => {
    // Check if already authenticated
    const enterpriseAuth = localStorage.getItem('enterpriseAuth');
    if (enterpriseAuth) {
      navigate('/enterprise-search');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simple localStorage-based authentication for testing
      const enterpriseData = {
        email: formData.email,
        companyName: formData.companyName || 'Test Enterprise',
        contactPerson: formData.contactPerson || 'Test Contact',
        isAuthenticated: true
      };
      
      localStorage.setItem('enterpriseAuth', JSON.stringify(enterpriseData));

      toast({
        title: "Login successful!",
        description: "Welcome to Yhteys Enterprise Portal.",
      });

      navigate('/enterprise-search');
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
      if (!formData.email || !formData.password || !formData.companyName || !formData.contactPerson) {
        throw new Error('Please fill in all required fields');
      }

      // Simple localStorage-based storage for testing
      const enterpriseData = {
        email: formData.email,
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        isAuthenticated: true
      };
      
      localStorage.setItem('enterpriseAuth', JSON.stringify(enterpriseData));

      toast({
        title: "Registration successful!",
        description: "Welcome to Yhteys! You can now search for startups.",
      });

      navigate('/enterprise-search');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-4 sm:py-8 px-4">
      <div className="max-w-md mx-auto">
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
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl text-white">
              {isLogin ? 'Enterprise Login' : 'Join as Enterprise'}
            </CardTitle>
            <CardDescription className="text-gray-300 text-base sm:text-lg">
              {isLogin 
                ? 'Access your enterprise dashboard' 
                : 'Discover innovative startups for partnerships'
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

            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="enterprise@company.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-white">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="Your password"
                  required
                />
              </div>

              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="companyName" className="text-white">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="Your Company Inc."
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactPerson" className="text-white">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 text-base sm:text-lg"
                disabled={loading}
              >
                {loading 
                  ? (isLogin ? 'Signing in...' : 'Creating Account...') 
                  : (isLogin ? 'Sign In' : 'Create Enterprise Account')
                }
              </Button>
            </form>

            {/* Benefits Section */}
            <div className="mt-8 p-4 bg-black/20 rounded-lg">
              <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">Enterprise Benefits</h3>
              <ul className="space-y-2 text-gray-300 text-xs sm:text-sm">
                <li className="flex items-center">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30 mr-2 text-xs">
                    ✓
                  </Badge>
                  Access to 1000+ verified startups
                </li>
                <li className="flex items-center">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30 mr-2 text-xs">
                    ✓
                  </Badge>
                  Smart search with AI matching
                </li>
                <li className="flex items-center">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30 mr-2 text-xs">
                    ✓
                  </Badge>
                  Direct communication tools
                </li>
                <li className="flex items-center">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30 mr-2 text-xs">
                    ✓
                  </Badge>
                  Partnership analytics
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}