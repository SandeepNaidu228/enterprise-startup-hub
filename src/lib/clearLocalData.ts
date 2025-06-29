// Utility to clear all local storage data and reset the application state
export function clearAllLocalData() {
  // Clear all localStorage data
  const keysToRemove = [
    // Authentication data
    'startupAuth',
    'enterpriseAuth',
    'startupData',
    'enterpriseData',
    
    // Application data
    'startups',
    'enterprises',
    'projectRequests',
    'enterpriseProjectRequests',
    'aiRecommendations',
    'contactSubmissions',
    'savedStartups',
    
    // Demo data
    'demoStartups',
    'demoEnterprises',
    'demoProjects',
    
    // Any other cached data
    'userPreferences',
    'searchHistory',
    'recentActivity'
  ];
  
  // Remove specific keys
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Also clear any keys that might have been created dynamically
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.includes('startup') || 
        key.includes('enterprise') || 
        key.includes('project') || 
        key.includes('yhteys') ||
        key.includes('demo')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear sessionStorage as well
  sessionStorage.clear();
  
  console.log('✅ All local data cleared successfully');
  return true;
}

export function resetApplicationState() {
  // Clear all data
  clearAllLocalData();
  
  // Reset any global state if needed
  if (typeof window !== 'undefined') {
    // Force reload to ensure clean state
    window.location.reload();
  }
}

export function getLocalDataStatus() {
  const startups = JSON.parse(localStorage.getItem('startups') || '[]');
  const enterprises = JSON.parse(localStorage.getItem('enterprises') || '[]');
  const projectRequests = JSON.parse(localStorage.getItem('projectRequests') || '[]');
  
  return {
    startups: startups.length,
    enterprises: enterprises.length,
    projectRequests: projectRequests.length,
    hasAuth: !!(localStorage.getItem('startupAuth') || localStorage.getItem('enterpriseAuth')),
    totalKeys: Object.keys(localStorage).length
  };
}