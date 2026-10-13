import { createClient } from '@supabase/supabase-js';

export const WEBSITE_SLUG = import.meta.env.VITE_WEBSITE_SLUG || 'genesis-autos-1218d5';
const EXPECTED_HUB_SUPABASE_REF = import.meta.env.VITE_HUB_SUPABASE_REF || 'xfguwqqhfktnbfsipyor';

export type ManagedProduct = {
  id: string;
  external_key: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number | string | null;
  currency: string;
  image_path: string | null;
  image_url: string | null;
  brand: string | null;
  details: string | null;
  display_order: number;
  is_published: boolean;
};

export type ManagedService = {
  id: string;
  name: string;
  description: string;
  display_order: number;
  is_published: boolean;
};

export type ManagedBusinessDetails = {
  telephone?: string | null;
  secondary_telephone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  telegram?: string | null;
};

export type ManagedWebsiteContentRecord = {
  title?: string | null;
  description?: string | null;
  logo_url?: string | null;
  business_details?: ManagedBusinessDetails | null;
  content?: Record<string, unknown> | null;
};

export type ManagedWebsiteContent = {
  website: { id: string; name: string; slug: string; status: string };
  content: ManagedWebsiteContentRecord | null;
  products: ManagedProduct[];
  services: ManagedService[];
};

function getSupabaseClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.',
    );
  }

  const configuredRef = new URL(supabaseUrl).hostname.split('.')[0];
  if (configuredRef !== EXPECTED_HUB_SUPABASE_REF) {
    throw new Error(
      `Supabase project mismatch: configured ref "${configuredRef}", expected MetroDEVOPS Hub ref "${EXPECTED_HUB_SUPABASE_REF}". Update the storefront environment before enabling managed content.`,
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Public storefront loader. It deliberately sees only the live website and
 * published products/services; draft content remains private to the manager.
 */
export async function loadWebsiteContent(): Promise<ManagedWebsiteContent> {
  const supabase = getSupabaseClient();

  const { data: website, error: websiteError } = await supabase
    .from('websites')
    .select('id, name, slug, status')
    .eq('slug', WEBSITE_SLUG)
    .eq('status', 'live')
    .single();

  if (websiteError) throw websiteError;

  const [contentResult, productsResult, servicesResult] = await Promise.all([
    supabase
      .from('website_content')
      .select('title, description, logo_url, business_details, content')
      .eq('website_id', website.id)
      .maybeSingle(),
    supabase
      .from('products')
      .select('id, external_key, name, slug, category, description, price, currency, image_path, image_url, brand, details, display_order, is_published')
      .eq('website_id', website.id)
      .eq('is_published', true)
      .order('display_order'),
    supabase
      .from('services')
      .select('id, name, description, display_order, is_published')
      .eq('website_id', website.id)
      .eq('is_published', true)
      .order('display_order'),
  ]);

  if (contentResult.error) throw contentResult.error;
  if (productsResult.error) throw productsResult.error;
  if (servicesResult.error) throw servicesResult.error;

  return {
    website,
    content: (contentResult.data as ManagedWebsiteContentRecord | null) ?? null,
    products: (productsResult.data ?? []) as ManagedProduct[],
    services: (servicesResult.data ?? []) as ManagedService[],
  };
}
