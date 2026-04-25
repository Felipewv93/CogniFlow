import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

export function getSupabaseClient(): SupabaseClient {
  if (browserClient) {
    return browserClient;
  }

  const supabaseUrl = requireEnvVar('NEXT_PUBLIC_SUPABASE_URL');
  const supabaseAnonKey = requireEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  browserClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  return browserClient;
}

export function getSupabaseAdminClient(): SupabaseClient {
  if (adminClient) {
    return adminClient;
  }

  const supabaseUrl = requireEnvVar('NEXT_PUBLIC_SUPABASE_URL');
  const supabaseAnonKey = requireEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

  adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}

function createClientProxy(factory: () => SupabaseClient): SupabaseClient {
  return new Proxy({} as SupabaseClient, {
    get(_target, prop, receiver) {
      const client = factory();
      const value = Reflect.get(client as object, prop, receiver);
      return typeof value === 'function' ? value.bind(client) : value;
    },
  });
}

// Compatibilidade com imports existentes: mantém as exportações originais.
export const supabase = createClientProxy(getSupabaseClient);
export const supabaseAdmin = createClientProxy(getSupabaseAdminClient);
