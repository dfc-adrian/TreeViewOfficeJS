import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

console.log('🔧 Supabase Config:');
console.log('  URL:', supabaseUrl);
console.log('  Key:', supabaseKey);

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Sign up function (Custom Edge Function)
export async function signUp(email: string, password: string, accountName: string, accountType: 'personal' | 'organization' = 'personal') {
  console.log('📧 Sign-Up Request:', { email, accountName, accountType });

  const response = await fetch(`${supabaseUrl}/functions/v1/test/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      first_name: 'Test',
      last_name: 'User',
      account_name: accountName,
      account_type: accountType,
      street: 'Teststraße',
      house_number: '1',
      zip: '10115',
      city: 'Berlin',
      country: 'Germany',
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    console.error('❌ Sign-Up Error:', error);
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const data = await response.json();
  console.log('📨 Sign-Up Response:', data);

  // Save access token to localStorage
  if (data.session?.access_token) {
    localStorage.setItem('access_token', data.session.access_token);
    localStorage.setItem('refresh_token', data.session.refresh_token);
    console.log('💾 Token gespeichert');
  }

  return data;
}

// Sign in function (Custom Edge Function)
export async function signIn(email: string, password: string) {
  console.log('🔐 Login Request:', { email });

  const response = await fetch(`${supabaseUrl}/functions/v1/test/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    console.error('❌ Login Error:', error);
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const data = await response.json();
  console.log('📨 Login Response:', data);

  // Save access token to localStorage
  if (data.session?.access_token) {
    localStorage.setItem('access_token', data.session.access_token);
    localStorage.setItem('refresh_token', data.session.refresh_token);
    console.log('💾 Token gespeichert');
  }

  return data;
}

// Sign out function
export async function signOut() {
  // Clear localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  console.log('🗑️ Token gelöscht');

  // Also sign out from Supabase (if using standard auth)
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.warn('Supabase sign-out warning:', error);
  }
}

// Get current session
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// Get access token
export async function getAccessToken(): Promise<string | null> {
  // Try localStorage first (for custom auth)
  const token = localStorage.getItem('access_token');
  if (token) {
    console.log('🔑 Token from localStorage');
    return token;
  }

  // Fallback to Supabase session
  const session = await getSession();
  return session?.access_token || null;
}

// Initialize file storage (load folders and files)
export async function initFileStorage() {
  const token = await getAccessToken();

  if (!token) {
    throw new Error('Kein Access Token gefunden. Bitte melden Sie sich an.');
  }

  console.log('📁 Init Request mit Token:', token.substring(0, 20) + '...');

  // File Storage API (Supabase Edge Function)
  const response = await fetch(`${supabaseUrl}/functions/v1/test/file-storage/init`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  console.log('📁 Init Response Status:', response.status);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    console.error('❌ Init Error:', error);
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}
