import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Trash2, RefreshCw, Database, CheckCircle, AlertTriangle } from 'lucide-react';
import { clearAllLocalData, getLocalDataStatus } from '@/lib/clearLocalData';

export function ClearDataButton() {
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);
  const [dataStatus, setDataStatus] = useState(getLocalDataStatus());

  const handleClearData = async () => {
    setIsClearing(true);
    
    try {
      // Clear all local data
      clearAllLocalData();
      
      // Update status
      setDataStatus(getLocalDataStatus());
      
      toast({
        title: "🗑️ Database Cleared Successfully!",
        description: "All local data has been removed. Ready for fresh start with Supabase.",
      });
      
      // Reload page after a short delay to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Error clearing data",
        description: "There was an issue clearing the local database.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const hasData = dataStatus.startups > 0 || dataStatus.enterprises > 0 || dataStatus.projectRequests > 0 || dataStatus.hasAuth;

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="text-white flex items-center text-lg">
          <Database className="mr-2 h-5 w-5" />
          Local Database Status
        </CardTitle>
        <CardDescription className="text-gray-400">
          Current local storage data and cleanup options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-xs">Startups</div>
            <div className="text-white font-medium">{dataStatus.startups}</div>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-xs">Enterprises</div>
            <div className="text-white font-medium">{dataStatus.enterprises}</div>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-xs">Project Requests</div>
            <div className="text-white font-medium">{dataStatus.projectRequests}</div>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-xs">Total Keys</div>
            <div className="text-white font-medium">{dataStatus.totalKeys}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {hasData ? (
              <>
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm">Local data present</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm">Database clean</span>
              </>
            )}
          </div>
          
          <Badge variant={hasData ? "destructive" : "secondary"} className="text-xs">
            {hasData ? "Needs Cleanup" : "Ready for Supabase"}
          </Badge>
        </div>

        <Button 
          onClick={handleClearData}
          disabled={isClearing || !hasData}
          variant={hasData ? "destructive" : "outline"}
          className="w-full"
        >
          {isClearing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Clearing Data...
            </>
          ) : hasData ? (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All Local Data
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Database Already Clean
            </>
          )}
        </Button>

        {hasData && (
          <div className="text-xs text-gray-500 text-center">
            This will remove all local data and reload the page for a fresh start
          </div>
        )}
      </CardContent>
    </Card>
  );
}