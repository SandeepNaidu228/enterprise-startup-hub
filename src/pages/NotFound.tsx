import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-md w-full">
        <CardHeader className="text-center px-4 sm:px-6">
          <div className="mx-auto mb-4 p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-fit">
            <img src="/Yhteys.png" alt="Yhteys" className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <CardTitle className="text-3xl sm:text-4xl text-white mb-2">404</CardTitle>
          <CardDescription className="text-gray-300 text-base sm:text-lg">
            Page not found
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-6 px-4 sm:px-6">
          <p className="text-gray-300 text-sm sm:text-base">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}