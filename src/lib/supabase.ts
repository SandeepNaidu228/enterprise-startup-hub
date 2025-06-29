import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, metadata?: any) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getUser: async () => {
    return await supabase.auth.getUser();
  },

  getSession: async () => {
    return await supabase.auth.getSession();
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // Startup operations
  startups: {
    create: async (startup: any) => {
      return await supabase
        .from('startups')
        .insert(startup)
        .select()
        .single();
    },

    getAll: async () => {
      return await supabase
        .from('startups')
        .select('*')
        .order('created_at', { ascending: false });
    },

    getByUserId: async (userId: string) => {
      return await supabase
        .from('startups')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
    },

    update: async (id: string, updates: any) => {
      return await supabase
        .from('startups')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    },

    incrementViews: async (id: string) => {
      return await supabase.rpc('increment_profile_views', { startup_id: id });
    }
  },

  // Enterprise operations
  enterprises: {
    create: async (enterprise: any) => {
      return await supabase
        .from('enterprises')
        .insert(enterprise)
        .select()
        .single();
    },

    getByUserId: async (userId: string) => {
      return await supabase
        .from('enterprises')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
    },

    update: async (id: string, updates: any) => {
      return await supabase
        .from('enterprises')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    }
  },

  // Project request operations
  projectRequests: {
    create: async (request: any) => {
      return await supabase
        .from('project_requests')
        .insert(request)
        .select()
        .single();
    },

    getByStartupId: async (startupId: string) => {
      return await supabase
        .from('project_requests')
        .select(`
          *,
          enterprises (
            company_name,
            contact_person,
            email
          )
        `)
        .eq('startup_id', startupId)
        .order('created_at', { ascending: false });
    },

    getByEnterpriseId: async (enterpriseId: string) => {
      return await supabase
        .from('project_requests')
        .select(`
          *,
          startups (
            name,
            contact_email,
            industry,
            location
          )
        `)
        .eq('enterprise_id', enterpriseId)
        .order('created_at', { ascending: false });
    },

    update: async (id: string, updates: any) => {
      return await supabase
        .from('project_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    }
  },

  // AI recommendations operations
  aiRecommendations: {
    create: async (recommendation: any) => {
      return await supabase
        .from('ai_recommendations')
        .insert(recommendation)
        .select()
        .single();
    },

    getByEnterpriseId: async (enterpriseId: string) => {
      return await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('enterprise_id', enterpriseId)
        .order('created_at', { ascending: false });
    }
  }
};

// Real-time subscriptions
export const subscriptions = {
  projectRequests: (startupId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('project_requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_requests',
          filter: `startup_id=eq.${startupId}`
        },
        callback
      )
      .subscribe();
  }
};