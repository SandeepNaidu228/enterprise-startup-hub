import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import Auth from './pages/Auth';
import StartupDashboard from './pages/StartupDashboard';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import EnterpriseSearch from './pages/EnterpriseSearch';
import DemoScenario from './pages/DemoScenario';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/startup-dashboard" element={<StartupDashboard />} />
          <Route path="/enterprise-dashboard" element={<EnterpriseDashboard />} />
          <Route path="/enterprise-search" element={<EnterpriseSearch />} />
          <Route path="/demo" element={<DemoScenario />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;