// Smart search service for Yhteys platform
// Uses fuzzy string matching for intelligent startup discovery

export interface Startup {
  id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  website: string;
  contact: {
    email: string;
    phone: string;
  };
  teamMembers: Array<{
    name: string;
    role: string;
    email: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
  tags: string[];
  fundingStage: string;
  teamSize: number;
  foundedYear: number;
  rating: number;
}

export interface SearchResult {
  startup: Startup;
  score: number;
  matchedFields: string[];
}

export interface FilterOptions {
  industry?: string;
  location?: string;
  fundingStage?: string;
  minTeamSize?: number;
  maxTeamSize?: number;
  minRating?: number;
  tags?: string[];
}

// Simple fuzzy matching function (replacement for rapidfuzz)
function fuzzyMatch(query: string, text: string): number {
  query = query.toLowerCase();
  text = text.toLowerCase();
  
  // Exact match
  if (text.includes(query)) {
    return text === query ? 100 : 90;
  }
  
  // Character-based fuzzy matching
  let score = 0;
  let queryIndex = 0;
  
  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (text[i] === query[queryIndex]) {
      score += 1;
      queryIndex++;
    }
  }
  
  const ratio = (score / query.length) * 100;
  return ratio > 60 ? ratio : 0;
}

// Extract keywords from natural language queries
function extractKeywords(prompt: string): string[] {
  const words = prompt.toLowerCase().split(/\s+/);
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'startup', 'company', 'business'
  ]);
  
  return words.filter(word => 
    word.length > 2 && 
    !stopWords.has(word) && 
    /^[a-zA-Z]+$/.test(word)
  );
}

// Main search function
export function searchStartups(query: string, startups: Startup[], threshold: number = 50): SearchResult[] {
  if (!query.trim()) return [];
  
  const keywords = extractKeywords(query);
  const results: SearchResult[] = [];
  
  for (const startup of startups) {
    let totalScore = 0;
    const matchedFields: string[] = [];
    
    // Search in different fields with different weights
    const searchFields = [
      { field: 'name', text: startup.name, weight: 3 },
      { field: 'description', text: startup.description, weight: 2 },
      { field: 'industry', text: startup.industry, weight: 2.5 },
      { field: 'tags', text: startup.tags.join(' '), weight: 2 },
      { field: 'projects', text: startup.projects.map(p => `${p.name} ${p.description} ${p.technologies.join(' ')}`).join(' '), weight: 1.5 }
    ];
    
    // Direct query match
    for (const { field, text, weight } of searchFields) {
      const score = fuzzyMatch(query, text);
      if (score > 0) {
        totalScore += score * weight;
        matchedFields.push(field);
      }
    }
    
    // Keyword-based matching
    for (const keyword of keywords) {
      for (const { field, text, weight } of searchFields) {
        const score = fuzzyMatch(keyword, text);
        if (score > 0) {
          totalScore += (score * weight) * 0.7; // Lower weight for individual keywords
          if (!matchedFields.includes(field)) {
            matchedFields.push(field);
          }
        }
      }
    }
    
    // Normalize score
    const normalizedScore = Math.min(totalScore / searchFields.length, 100);
    
    if (normalizedScore >= threshold) {
      results.push({
        startup,
        score: normalizedScore,
        matchedFields
      });
    }
  }
  
  // Sort by score (highest first)
  return results.sort((a, b) => b.score - a.score);
}

// Advanced search with filters
export function advancedSearch(
  query: string, 
  startups: Startup[], 
  filters: FilterOptions,
  threshold: number = 50
): SearchResult[] {
  // Apply filters first
  let filteredStartups = startups.filter(startup => {
    if (filters.industry && startup.industry !== filters.industry) return false;
    if (filters.location && !startup.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.fundingStage && startup.fundingStage !== filters.fundingStage) return false;
    if (filters.minTeamSize && startup.teamSize < filters.minTeamSize) return false;
    if (filters.maxTeamSize && startup.teamSize > filters.maxTeamSize) return false;
    if (filters.minRating && startup.rating < filters.minRating) return false;
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        startup.tags.some(startupTag => 
          startupTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasMatchingTag) return false;
    }
    return true;
  });
  
  // Then search within filtered results
  return searchStartups(query, filteredStartups, threshold);
}

// Get search suggestions based on existing startup data
export function getSearchSuggestions(startups: Startup[]): string[] {
  const suggestions = new Set<string>();
  
  // Extract popular industries
  const industries = startups.map(s => s.industry);
  const industryCount = industries.reduce((acc, industry) => {
    acc[industry] = (acc[industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Add top industries
  Object.entries(industryCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .forEach(([industry]) => suggestions.add(industry));
  
  // Extract popular tags
  const allTags = startups.flatMap(s => s.tags);
  const tagCount = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Add top tags
  Object.entries(tagCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([tag]) => suggestions.add(tag));
  
  // Add some common search terms
  suggestions.add('AI automation');
  suggestions.add('workflow platform');
  suggestions.add('data analytics');
  suggestions.add('mobile app');
  suggestions.add('cloud solution');
  
  return Array.from(suggestions);
}

// Get unique values for filter options
export function getFilterOptions(startups: Startup[]) {
  return {
    industries: [...new Set(startups.map(s => s.industry))].sort(),
    locations: [...new Set(startups.map(s => s.location))].sort(),
    fundingStages: [...new Set(startups.map(s => s.fundingStage))].sort(),
    tags: [...new Set(startups.flatMap(s => s.tags))].sort()
  };
}