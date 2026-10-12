-- Server-only, repeat-safe importer RPC. Never grant this to anon or authenticated.
create or replace function public.import_genesis_autos_products(p_rows jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_website_id uuid;
  v_input_count integer := 0;
  v_upserted_count integer := 0;
begin
  select id into v_website_id
  from public.websites
  where slug = 'genesis-autos-1218d5';

  if v_website_id is null then
    raise exception 'Genesis Autos website record is missing';
  end if;

  if jsonb_typeof(p_rows) <> 'array' then
    raise exception 'Import expects a JSON array';
  end if;

  select count(*) into v_input_count from jsonb_array_elements(p_rows);

  insert into public.products (
    website_id, external_key, name, slug, category, description,
    price, currency, image_path, image_url, brand, details,
    is_published, display_order, source, updated_at
  )
  select
    v_website_id,
    r.external_key,
    r.name,
    r.slug,
    coalesce(nullif(r.category, ''), 'Uncategorised'),
    coalesce(r.description, ''),
    r.price,
    'NGN',
    r.image_path,
    null,
    r.brand,
    r.details,
    false,
    r.display_order,
    'genesis-app-tsx-import-v1',
    now()
  from jsonb_to_recordset(p_rows) as r(
    external_key text,
    name text,
    slug text,
    category text,
    description text,
    price numeric,
    image_path text,
    brand text,
    details text,
    display_order integer
  )
  where nullif(r.external_key, '') is not null
    and nullif(r.name, '') is not null
    and nullif(r.slug, '') is not null
  on conflict (website_id, external_key) do update set
    name = excluded.name,
    slug = excluded.slug,
    category = excluded.category,
    description = excluded.description,
    price = excluded.price,
    currency = excluded.currency,
    image_path = excluded.image_path,
    image_url = excluded.image_url,
    brand = excluded.brand,
    details = excluded.details,
    display_order = excluded.display_order,
    source = excluded.source,
    updated_at = now();

  get diagnostics v_upserted_count = row_count;

  return jsonb_build_object(
    'input_count', v_input_count,
    'upserted_count', v_upserted_count,
    'website_slug', 'genesis-autos-1218d5',
    'published', false
  );
end;
$$;

revoke all on function public.import_genesis_autos_products(jsonb) from public;
revoke all on function public.import_genesis_autos_products(jsonb) from anon, authenticated;
grant execute on function public.import_genesis_autos_products(jsonb) to service_role;
