import { createElement, useEffect, useState, type FormEvent } from 'react';
// Vercel deployment trigger: homepage product catalogue
// Deployment refresh: serve latest public product photos
import {
  ArrowRight, Battery, Car, CheckCircle2, ChevronRight, Instagram, ShoppingCart, Minus, Plus, Trash2,
  MapPin, Menu, MessageCircle, Navigation, Phone, Search, Settings,
  ShieldCheck, Star, Wrench, X,
} from 'lucide-react';

const whatsappNumber = '2347065379450';
const directionsUrl = 'https://www.google.com/maps/search/?api=1&query=Genesis+Autos%2C+62+Alimosho+Rd.%2C+Opp+Multigrace+Sch.%2C+Alagutan+B%2FStop%2C+Iyana+Ipaja%2C+Lagos';
const instagramUrl = 'https://www.instagram.com/genesisautosalimosho/';

const openWhatsApp = (message: string) => {
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
};

const SITE_URL = 'https://genesisautos.org';

const seoRoutes: Record<string, { title: string; description: string; type?: string }> = {
  '/': {
    title: 'Genesis Autos | Auto Spare Parts & Automotive Products in Iyana Ipaja, Lagos',
    description: 'Genesis Autos in Iyana Ipaja, Lagos supplies automobile spare parts, batteries, car accessories, tools, engine oil, ATF, coolant and automotive products.',
  },
  '/batteries': {
    title: 'Car Batteries in Lagos | Genesis Autos Iyana Ipaja',
    description: 'Browse automotive batteries from Genesis Autos in Iyana Ipaja, Lagos. Explore battery brands, voltages, capacities and terminal options and enquire about current availability.',
  },
  '/accessories': {
    title: 'Car Accessories in Lagos | Genesis Autos',
    description: 'Explore car accessories from Genesis Autos in Iyana Ipaja, Lagos, including steering covers, dashboard mats, dashboard rugs and other automotive accessories.',
  },
  '/tools': {
    title: 'Automotive Tools & Essentials in Lagos | Genesis Autos',
    description: 'Browse automotive tools and essentials from Genesis Autos in Iyana Ipaja, Lagos, including jacks, alloy wheels, car horns, safety equipment and more.',
  },
  '/security': {
    title: 'Vehicle Security Products in Lagos | Genesis Autos',
    description: 'Browse vehicle security products from Genesis Autos in Iyana Ipaja, Lagos, including GPS trackers and steering and car locks.',
  },
  '/oil-grease-atf': {
    title: 'Engine Oil, ATF, Coolant & Automotive Fluids in Lagos | Genesis Autos',
    description: 'Browse engine oils by grade, ATF, coolant, grease, oil filters, injector cleaner, oil treatments and other automotive fluids from Genesis Autos in Iyana Ipaja, Lagos.',
  },
  '/cart': {
    title: 'Shopping Cart | Genesis Autos',
    description: 'Review your Genesis Autos product order and enter delivery details for payment on delivery.',
    type: 'noindex',
  },
};


const slugify = (value: string) => value.toLowerCase().trim().replace(/['"\\[\\]]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

type SeoProduct = {
  slug: string;
  name: string;
  category: string;
  description: string;
  image?: string;
  price?: number;
  details?: string;
  brand?: string;
};

function getSeoProducts(): SeoProduct[] {
  const products: SeoProduct[] = [];

  batteryProducts.forEach((p) => {
    const terminal = p.terminal ? `-${slugify(p.terminal)}` : '';
    products.push({
      slug: `battery-${slugify(p.brand)}-${slugify(p.capacity)}${terminal}`,
      name: `${p.name} ${p.capacity} Battery`,
      category: 'Car Batteries',
      description: `Shop ${p.brand} ${p.capacity} car batteries from Genesis Autos in Iyana Ipaja, Lagos. ${p.voltage} automotive battery${p.terminal ? ` with ${p.terminal.toLowerCase()}` : ''}.`,
      image: p.image || undefined,
      price: p.price,
      details: [p.voltage, p.capacity, p.terminal].filter(Boolean).join(' · '),
      brand: p.brand,
    });
  });

  accessoryProducts.forEach((p) => products.push({
    slug: `accessory-${slugify(p.name)}`,
    name: p.name,
    category: 'Car Accessories',
    description: `${p.name} available from Genesis Autos in Iyana Ipaja, Lagos. Contact us for current availability and pricing.`,
    image: p.image,
    price: p.price,
  }));

  [
    ['Normal Steering Cover', '/DESIGN 1 STEERING.jpg'],
    ['Condom Steering Cover', '/DESIGN 2 STEERING.jpg'],
    ['Seat Covers — OC CLASSIC', '/DESIGN 1 SEATCOVER.jpg'],
    ['Seat Covers — R-POWER', '/DESIGN 2 SEAT COVER.jpg'],
    ['Seat Covers — CROWN', '/DESIGN 3 SEAT COVER.jpg'],
    ['Seat Covers — SMILEY', '/DESIGN SEAT COVER 4.jpg'],
    ['Seat Covers — Design 5', '/DESIGN 5SEAT CIVER.jpg'],
  ].forEach(([name, image]) => products.push({
    slug: `accessory-${slugify(String(name))}`,
    name: String(name),
    category: 'Car Accessories',
    description: `${name} available from Genesis Autos in Iyana Ipaja, Lagos. Ask about current availability and price.`,
    image: String(image),
  }));

  alloyRimProducts.forEach((rim) => rim.options.forEach((option) => products.push({
    slug: `alloy-rim-${slugify(rim.size)}-${slugify(option.name)}`,
    name: `Alloy Rim ${rim.size} — ${option.name}`,
    category: 'Alloy Rims',
    description: `${option.name} ${rim.size} alloy rims available from Genesis Autos in Iyana Ipaja, Lagos. Contact us to confirm availability.`,
    image: '/RIMS.jpg',
    price: option.price,
    details: `${rim.size} · ${option.name}`,
  })));

  brakeFluidProducts.forEach((p) => p.brands.forEach((brand) => products.push({
    slug: `brake-fluid-${slugify(brand.name)}`,
    name: `Brake Fluid — ${brand.name}`,
    category: 'Automotive Tools & Essentials',
    description: `${brand.name} brake fluid available from Genesis Autos in Iyana Ipaja, Lagos. Contact us for current price.`,
    image: brand.image,
    price: brand.price,
    brand: brand.name,
  })));

  matProducts.forEach((p) => p.options.forEach((option) => products.push({
    slug: `mat-${slugify(p.name)}-${slugify(option.name)}`,
    name: `${p.name} — ${option.name}`,
    category: 'Car Accessories',
    description: `${p.name} for ${option.name} available from Genesis Autos in Iyana Ipaja, Lagos.`,
    image: p.image, price: option.price, details: option.name, brand: option.name,
  })));
  securityProducts.forEach((p) => products.push({
    slug: `security-${slugify(p.name)}`,
    name: p.name,
    category: 'Vehicle Security',
    description: `${p.name} available from Genesis Autos in Iyana Ipaja, Lagos. Contact us for current availability and price.`,
    image: p.image,
    price: p.price,
  }));

  toolsProducts.forEach((p) => products.push({
    slug: `tool-${slugify(p.name)}`,
    name: p.name,
    category: 'Automotive Tools & Essentials',
    description: `${p.name} available from Genesis Autos in Iyana Ipaja, Lagos. Contact us for current availability and price.`,
    image: p.image,
    price: p.price,
  }));

  engineOilGrades.forEach((group) => Object.entries(group.brands).forEach(([brand, sizes]) => sizes.forEach((item) => products.push({
    slug: `engine-oil-${slugify(brand)}-${slugify(group.grade)}-${slugify(item.size)}`,
    name: `${brand} ${group.grade} Engine Oil — ${item.size}`,
    category: 'Engine Oil',
    description: `${brand} ${group.grade} engine oil in ${item.size}, available from Genesis Autos in Iyana Ipaja, Lagos. Contact us to confirm current stock.`,
    price: item.price,
    details: `${group.grade} · ${item.size}`,
    brand,
  }))));

  [
    { name: 'TOYOTA ATF 1L', image: '/TOYOTA ATF.jpg', price: 6500 },
    { name: 'TOYOTA ATF 4L', image: '/TOYOTA ATF.jpg', price: 25000 },
    { name: 'SEAMAX ATF 1L', image: '/SEAMAX ATF.jpg', price: 4500 },
    { name: 'SEAMAX ATF 4L', image: '/SEAMAX ATF.jpg', price: 17000 },
    { name: 'ABRO MASTERS 1L', image: '/ATF.jpg', price: 4500 },
    { name: 'HARDEX T4 1L', image: '/HARDEX ATF.jpg', price: 10000 },
    { name: 'HARDEX T4 4L', image: '/HARDEX ATF.jpg', price: 42000 },
    { name: 'HOLTS ATF', image: '/ATF.jpg', price: 5000 },
  ].forEach((p) => products.push({
    slug: `atf-${slugify(p.name)}`,
    name: p.name,
    category: 'ATF',
    description: `${p.name} automatic transmission fluid available from Genesis Autos in Iyana Ipaja, Lagos. Contact us for current availability and price.`,
    image: p.image,
    price: p.price,
  }));

  coolantOptions.forEach((item) => products.push({
    slug: `coolant-${slugify(item.size)}`,
    name: `Coolant — ${item.size}`,
    category: 'Coolant',
    description: `Automotive coolant in ${item.size} available from Genesis Autos in Iyana Ipaja, Lagos.`,
    price: item.price,
    details: item.size,
  }));

  const otherImages: Record<string, string> = {
    'OIL FILTER': '/OIL FILTER.jpg',
    'INJECTOR CLEANER': '/FUEL INJECTOR CLEANER.jpg',
    'OIL TREATMENT': '/OIL TREATMENT.jpg',
  };
  lubricantGroups.other.forEach((name) => products.push({
    slug: `fluid-${slugify(name)}`,
    name,
    category: 'Automotive Fluids',
    description: `${name} available from Genesis Autos in Iyana Ipaja, Lagos. Contact us for current availability and price.`,
    image: otherImages[name],
    price: name === 'INJECTOR CLEANER' || name === 'OIL TREATMENT' ? 3500 : undefined,
  }));

  return products;
}

function getSeoProductBySlug(slug: string) {
  return getSeoProducts().find((product) => product.slug === slug);
}

function setMeta(name: string, content: string, attribute = 'name') {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function useSeo(currentPath: string) {
  useEffect(() => {
    const rawPath = currentPath.replace(/\/+$/, '') || '/';
    const productSlug = rawPath.startsWith('/products/') ? rawPath.replace('/products/', '') : '';
    const product = productSlug ? getSeoProductBySlug(productSlug) : undefined;
    const route = product ? {
      title: `${product.name} | Genesis Autos Iyana Ipaja Lagos`,
      description: product.description,
    } : seoRoutes[rawPath] || (rawPath.startsWith('/batteries/') ? {
      title: `${rawPath.split('/').pop()?.replace(/-/g, ' ')} Batteries | Genesis Autos Lagos`,
      description: 'Browse battery options from Genesis Autos in Iyana Ipaja, Lagos. Explore battery specifications, capacities and terminal options and contact Genesis Autos for current availability.',
    } : seoRoutes['/']);
    const canonical = `${SITE_URL}${rawPath === '/' ? '/' : rawPath}`;
    document.title = route.title;
    setMeta('description', route.description);
    setMeta('robots', route.type === 'noindex' ? 'noindex, nofollow, noarchive' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMeta('googlebot', route.type === 'noindex' ? 'noindex, nofollow, noarchive' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMeta('og:title', route.title, 'property');
    setMeta('og:description', route.description, 'property');
    setMeta('og:url', canonical, 'property');
    setMeta('og:type', 'website', 'property');
    const socialImage = product?.image ? `${SITE_URL}${product.image}` : `${SITE_URL}/IMG_4929.jpg`;
    setMeta('og:image', socialImage, 'property');
    setMeta('og:image:alt', product ? product.name : 'Genesis Autos automotive parts and services', 'property');
    setMeta('twitter:title', route.title);
    setMeta('twitter:description', route.description);
    setMeta('twitter:image', socialImage);
    let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    const oldSchema = document.getElementById('genesis-seo-schema');
    oldSchema?.remove();
    const schema = document.createElement('script');
    schema.id = 'genesis-seo-schema';
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'LocalBusiness',
          '@id': `${SITE_URL}/#business`,
          name: 'Genesis Autos',
          description: 'Automobile spare parts and automotive products business in Iyana Ipaja, Lagos.',
          url: SITE_URL,
          telephone: '+2347065379450',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '62 Alimosho Rd., Opp. Multigrace Sch. Alagutan B/Stop',
            addressLocality: 'Iyana Ipaja',
            addressRegion: 'Lagos',
            addressCountry: 'NG',
          },
          areaServed: ['Iyana Ipaja', 'Alimosho', 'Lagos'],
          sameAs: [
            'https://www.instagram.com/genesisautosalimosho/',
            'https://www.tiktok.com/@genesisautosalimosho',
          ],
        },
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          name: 'Genesis Autos',
          url: SITE_URL,
          publisher: { '@id': `${SITE_URL}/#business` },
          inLanguage: 'en-NG',
        },
        {
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          url: canonical,
          name: route.title,
          description: route.description,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@id': `${SITE_URL}/#business` },
          inLanguage: 'en-NG',
        },
        ...(product ? [{
          '@type': 'Product',
          '@id': `${canonical}#product`,
          name: product.name,
          description: product.description,
          image: product.image ? [`${SITE_URL}${product.image}`] : undefined,
          sku: product.slug,
          brand: product.brand ? { '@type': 'Brand', name: product.brand } : { '@type': 'Brand', name: 'Genesis Autos' },
          offers: typeof product.price === 'number' ? {
            '@type': 'Offer',
            url: canonical,
            priceCurrency: 'NGN',
            price: product.price,
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
          } : undefined,
        }] : []),
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
            ...(rawPath !== '/' ? [{ '@type': 'ListItem', position: 2, name: route.title.split('|')[0].trim(), item: canonical }] : []),
          ],
        },
      ],
    });
    document.head.appendChild(schema);

    return () => {
      schema.remove();
    };
  }, [currentPath]);
}

function ImagePlaceholder({ src = '/IMG_4929.jpg', label = 'Image', className = '' }: { src?: string; label?: string; className?: string }) {
  return (
    <div className={`image-placeholder image-ready ${className}`}>
      <img className="real-image" src={src} alt={label} />
    </div>
  );
}



type CartItem = {
  id: string;
  name: string;
  image?: string;
  details?: string;
  quantity: number;
  price?: number;
};

const CART_KEY = 'genesis-autos-cart';

const readCart = (): CartItem[] => {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('genesis-cart-updated'));
};

const addToCart = (item: Omit<CartItem, 'quantity'>) => {
  const items = readCart();
  const existing = items.find((cartItem) => cartItem.id === item.id);
  if (existing) existing.quantity += 1;
  else items.push({ ...item, quantity: 1 });
  saveCart(items);
};

const updateCartQuantity = (id: string, delta: number) => {
  const items = readCart().map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0);
  saveCart(items);
};

const removeFromCart = (id: string) => saveCart(readCart().filter((item) => item.id !== id));

function CartButton() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const sync = () => setCount(readCart().reduce((sum, item) => sum + item.quantity, 0));
    sync();
    window.addEventListener('genesis-cart-updated', sync);
    return () => window.removeEventListener('genesis-cart-updated', sync);
  }, []);
  return <a className="cart-button" href="/cart" aria-label={`Shopping cart with ${count} item`}><ShoppingCart size={17} /><span>Cart</span>{count > 0 && <b>{count}</b>}</a>;
}

function ProductSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchItems = getSeoProducts().map((product) => ({
    name: product.name,
    detail: product.category + (product.details ? ` · ${product.details}` : ''),
    href: `/products/${product.slug}`,
  }));
  const normalized = query.trim().toLowerCase();
  const results = normalized ? searchItems.filter((item, index, list) => item.name.toLowerCase().includes(normalized) && list.findIndex((candidate) => candidate.name.toLowerCase() === item.name.toLowerCase()) === index).slice(0, 8) : [];
  const askOnWhatsApp = () => openWhatsApp('Hello Genesis Autos, I am looking for ' + query.trim() + '. Please let me know if you have it available and the current price.');
  const close = () => { setOpen(false); setQuery(''); };
  return createElement('div', { className: 'product-search' }, createElement('button', { className: 'search-trigger', onClick: () => setOpen(!open), 'aria-label': 'Search products', 'aria-expanded': open }, createElement(Search, { size: 18 })), open ? createElement('div', { className: 'search-panel' }, createElement('div', { className: 'search-input-wrap' }, createElement(Search, { size: 16 }), createElement('input', { autoFocus: true, value: query, onChange: (event) => setQuery(event.target.value), placeholder: 'Search products...', 'aria-label': 'Search products' }), createElement('button', { className: 'search-close', onClick: close, 'aria-label': 'Close search' }, createElement(X, { size: 15 }))), normalized && results.length > 0 ? createElement('div', { className: 'search-results' }, results.map((item) => createElement('a', { href: item.href, key: item.name }, createElement('span', null, createElement('strong', null, item.name), createElement('small', null, item.detail)), createElement(ChevronRight, { size: 15 })))) : null, normalized && results.length === 0 ? createElement('div', { className: 'search-empty' }, createElement('strong', null, 'We do not currently have ' + query.trim() + ' listed.'), createElement('span', null, 'Ask Genesis Autos and we will check availability for you.'), createElement('button', { className: 'button button-orange', onClick: askOnWhatsApp }, createElement(MessageCircle, { size: 15 }), ' Ask on WhatsApp')) : null) : null);
}
function ContactPriceButton({ productName }: { productName: string }) {
  return <button type="button" className="contact-price" onClick={() => openWhatsApp(`Hello Genesis Autos, I am interested in the ${productName}. Please confirm availability and current price.`)}><MessageCircle size={11} /> Contact for price</button>;
}

function AddToCartButton({ item }: { item: Omit<CartItem, 'quantity'> }) {
  const [added, setAdded] = useState(false);
  return <button className="button button-orange add-cart-button" onClick={() => { addToCart(item); setAdded(true); setTimeout(() => setAdded(false), 1200); }}>
    <ShoppingCart size={15} /> {added ? 'Added to Cart' : 'Add to Cart'}
  </button>;
}

function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener('genesis-cart-updated', sync);
    return () => window.removeEventListener('genesis-cart-updated', sync);
  }, []);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const pricedTotal = items.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
  const hasPrices = items.length > 0 && items.every((item) => typeof item.price === 'number');
  const hasUnpricedItems = items.some((item) => typeof item.price !== 'number');
  const [deliveryArea, setDeliveryArea] = useState('');
  const deliveryFee = deliveryArea === 'mainland' ? 5000 : deliveryArea === 'island' ? 10000 : deliveryArea === 'outside-lagos' ? 15000 : 0;
  const grandTotal = pricedTotal + deliveryFee;

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!items.length) return;
    setSending(true);
    setError('');
    const data = new FormData(event.currentTarget);
    const orderLines = items.map((item) => `${item.name} — Qty: ${item.quantity}${item.details ? ` — ${item.details}` : ''}${typeof item.price === 'number' ? ` — ₦${(item.price * item.quantity).toLocaleString()}` : ' — Price to be confirmed'}`).join('\n');
    const total = hasPrices ? `₦${grandTotal.toLocaleString()}` : `₦${pricedTotal.toLocaleString()} confirmed product value + additional product prices to be confirmed + ₦${deliveryFee.toLocaleString()} delivery`;
    try {
      const response = await fetch('https://formsubmit.co/ajax/genesisautos2020@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'NEW GENESIS AUTOS ORDER',
          _template: 'table',
          _cc: 'odogwutyga@genesis.org',
          _replyto: data.get('email'),
          name: data.get('name'),
          phone: data.get('phone'),
          email: data.get('email'),
          address: data.get('address'),
          city: data.get('city'),
          state: data.get('state'),
          delivery_area: deliveryArea === 'mainland' ? 'Lagos Mainland — ₦5,000' : deliveryArea === 'island' ? 'Lagos Island — ₦10,000' : 'Outside Lagos — ₦15,000',
          delivery_fee: `₦${deliveryFee.toLocaleString()}`,
          payment: 'Payment on Delivery',
          items: orderLines,
          total,
          notes: data.get('notes') || 'None',
        }),
      });
      const result = await response.json();
      if (!response.ok || result.success === false) throw new Error('Order email could not be sent.');
      setSubmitted(true);
      localStorage.removeItem(CART_KEY);
      window.dispatchEvent(new Event('genesis-cart-updated'));
      setItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return <div className="battery-page">
    <header className="site-header"><div className="container nav-wrap">
      <a className="brand" href="/"><img className="brand-logo" src="/Logo and icon.jpg" alt="Genesis Autos" decoding="async" /><span className="brand-text"><strong>GENESIS <em>AUTOS</em></strong><small>AUTOMOBILE PARTS & SERVICES</small></span></a>
      <nav className="battery-nav"><a href="/">Home</a><ProductSearch /><CartButton /><a className="button button-small button-orange" href="/batteries">Continue Shopping</a></nav>
    </div></header>
    <main>
      <section className="battery-hero"><div className="container">
        <div className="eyebrow orange-text"><ShoppingCart size={14} /> Shopping Cart</div>
        <h1>Your <span>Cart</span></h1>
        <p>Review your items, enter your delivery details and place your order. Payment is made on delivery.</p>
        <div className="delivery-notice"><strong>Delivery fees:</strong> Lagos Mainland — ₦5,000 · Lagos Island — ₦10,000 · Outside Lagos — ₦15,000.</div>
      </div></section>
      <section className="cart-section"><div className="container cart-layout">
        <div className="cart-items">
          <div className="battery-heading"><div><div className="eyebrow orange-text">Order Summary</div><h2>{totalQuantity} <span>Item{totalQuantity === 1 ? '' : 's'}</span></h2></div></div>
          {!items.length && !submitted && <div className="empty-cart"><ShoppingCart size={38}/><h3>Your cart is empty</h3><p>Add products from the catalogue to start an order.</p><a className="button button-orange" href="/batteries">Browse Products</a></div>}
          {submitted && <div className="empty-cart"><CheckCircle2 size={42}/><h3>Order Received!</h3><p>Your order has been sent to Genesis Autos. Our team will contact you to confirm your order and delivery.</p><a className="button button-orange" href="/">Back to Genesis Autos</a></div>}
          {items.map((item) => <article className="cart-item" key={item.id}>
            {item.image ? <img src={item.image} alt={item.name} decoding="async" /> : <div className="cart-item-image-placeholder" aria-hidden="true"><ShoppingCart size={24} /></div>}
            <div className="cart-item-info"><strong>{item.name}</strong>{item.details && <small>{item.details}</small>}<span>{typeof item.price === 'number' ? `₦${item.price.toLocaleString()}` : 'Price to be confirmed'}</span></div>
            <div className="cart-quantity"><button onClick={() => updateCartQuantity(item.id, -1)} aria-label="Decrease quantity"><Minus size={14}/></button><strong>{item.quantity}</strong><button onClick={() => updateCartQuantity(item.id, 1)} aria-label="Increase quantity"><Plus size={14}/></button></div>
            <button className="cart-remove" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={16}/></button>
          </article>)}
          {items.length > 0 && <div className="cart-totals"><div><span>Products</span><strong>{hasUnpricedItems ? `₦${pricedTotal.toLocaleString()} + price to be confirmed` : `₦${pricedTotal.toLocaleString()}`}</strong></div><div><span>Delivery</span><strong>{deliveryFee ? `₦${deliveryFee.toLocaleString()}` : 'Select delivery area'}</strong></div><div className="cart-total"><span>Total</span><strong>{hasPrices && deliveryFee ? `₦${grandTotal.toLocaleString()}` : hasUnpricedItems ? (deliveryFee ? `₦${(pricedTotal + deliveryFee).toLocaleString()} + price to be confirmed` : 'Price to be confirmed') : 'Select delivery area'}</strong></div></div>}
        </div>
        {items.length > 0 && <form className="checkout-form" onSubmit={handleCheckout}>
          <div className="eyebrow orange-text">Checkout</div><h2>Delivery <span>Details</span></h2>
          <p className="checkout-intro">Payment method: <strong>Payment on Delivery</strong></p>
          <div className="form-row"><label>Full Name<input required name="name" placeholder="Your full name" /></label><label>Phone Number<input required name="phone" type="tel" placeholder="+234..." /></label></div>
          <label>Email Address<input required name="email" type="email" placeholder="you@example.com" /></label>
          <label>Delivery Address<textarea required name="address" rows={3} placeholder="House number, street, landmark..."></textarea></label>
          <div className="form-row"><label>City<input required name="city" placeholder="e.g. Lagos" /></label><label>State<input required name="state" placeholder="e.g. Lagos State" /></label></div>
          <label>Delivery Area<select required name="deliveryArea" value={deliveryArea} onChange={(event) => setDeliveryArea(event.target.value)}><option value="">Select delivery area</option><option value="mainland">Lagos Mainland — ₦5,000</option><option value="island">Lagos Island — ₦10,000</option><option value="outside-lagos">Outside Lagos — ₦15,000</option></select></label>
          <label>Order Notes<textarea name="notes" rows={2} placeholder="Optional delivery instructions"></textarea></label>
          <button className="button button-orange form-button" type="submit" disabled={sending}>{sending ? 'Sending Order...' : 'Place Order — Payment on Delivery'} <ArrowRight size={16}/></button>
          {error && <p className="checkout-error">{error}</p>}
          <small className="checkout-footnote">Delivery fee is calculated from the selected delivery area: Lagos Mainland ₦5,000, Lagos Island ₦10,000, Outside Lagos ₦15,000. Our team will confirm the order and delivery details before dispatch.</small>
        </form>}
      </div></section>
    </main>
  </div>;
}

const products = [
  { title: 'Batteries', description: 'Automotive batteries available in different brands, voltages and capacities.', icon: Battery, label: 'Batteries', image: '/ZENGLOBAL.jpg', battery: true },
  { title: 'Accessories', description: 'Essential interior, exterior and car care accessories for your vehicle.', icon: Car, label: 'Accessories', image: '/ACCESORIES.jpg', accessories: true },
  { title: 'Tools & Essentials', description: 'Essential automotive tools, safety items and vehicle accessories.', icon: Wrench, label: 'Tools & Essentials', image: '/RIMS.jpg', tools: true },
  { title: 'Security', description: 'Vehicle security products including trackers and steering and car locks.', icon: ShieldCheck, label: 'Security', image: '/GPS TRACKER.jpg', security: true },
  { title: 'Oil, Grease & ATF', description: 'Engine oils, automatic transmission fluids, coolants, grease, filters, treatments and automotive fluids.', icon: Settings, label: 'Oil, Grease & ATF', image: '/ATF.jpg', lubricants: true },
];

const services = [
  { title: 'Spare Parts Sourcing', description: 'Get assistance finding the automotive parts you need.', icon: Search },
  { title: 'Vehicle Support', description: 'Automotive support for vehicle owners and businesses.', icon: Wrench },
  { title: 'Parts Enquiries', description: 'Contact Genesis Autos to ask about availability and pricing.', icon: MessageCircle },
];

const accessoryProducts = [
  { name: 'Dashboard Polish', price: 5000 },
  { name: 'Steering Cover' },
  { name: 'Seat Covers' },
  { name: 'Dashboard Rug', image: '/DASHBOARD RUG.jpg', price: 10000 },
  { name: 'Dashboard Mat', image: '/DASHBOARD MAT.jpg' },
  { name: 'Floor Mat' },
  { name: 'New Wiper', price: 3000 },
  { name: 'Tokunbo Wiper', price: 5000 },
  { name: 'LED Lights', image: '/LED LIGHTS.jpg', price: 40000 },
  { name: 'Engine Cover', image: '/ENGINE COVER.jpg' },
];

const alloyRimProducts = [
  { size: '15"', options: [{ name: 'New', price: 250000 }, { name: 'Tokunbo', price: 200000 }] },
  { size: '16"', options: [{ name: 'New', price: 400000 }, { name: 'Tokunbo', price: 350000 }] },
  { size: '17"', options: [{ name: 'New', price: 500000 }, { name: 'Tokunbo', price: 450000 }] },
  { size: '18"', options: [{ name: 'New', price: 600000 }, { name: 'Tokunbo', price: 550000 }] },
  { size: '19"', options: [{ name: 'New', price: 700000 }, { name: 'Tokunbo', price: 650000 }] },
  { size: '20"', options: [{ name: 'New', price: 800000 }, { name: 'Tokunbo', price: 750000 }] },
  { size: '21"', options: [{ name: 'New', price: 900000 }, { name: 'Tokunbo', price: 850000 }] },
];

const toolsProducts = [
  { name: 'Jacks', image: '/JACKS.jpg' },
  { name: 'Hydraulic Jack 5T', image: '/JACK 5T &10T.jpg', price: 13000 },
  { name: 'Hydraulic Jack 10T', image: '/JACK 5T &10T.jpg', price: 16000 },
  { name: 'Fuel Injector Cleaner', image: '/FUEL INJECTOR CLEANER.jpg', price: 3000 },
  { name: 'ABRO Fuel Injector Cleaner', image: '/IJNCETOR CLEANER 2.jpg', price: 4000 },
  { name: 'Car Horn', image: '/CAR HORNS.jpg', price: 10000 },
    { name: 'Heavy Duty Battery Charger 1000A', image: '/BATTERY CHARGERS.jpg', price: 32000 },
  { name: 'Jumpstart Cable — Small', image: '/BATTERY CHARGER.jpg', price: 60000 },
  { name: 'Jumpstart Cable — Big + Tire Gauge', image: '/BATTERY CHARGER.jpg', price: 80000 },
  { name: 'Air Freshener — Strawberry', image: '/AIR FRESHNERS.jpg', price: 5000 },
  { name: 'Air Freshener — Coconut', image: '/AIR FRESHNERS.jpg', price: 5000 },
  { name: 'Air Freshener — Cherry', image: '/AIR FRESHNERS.jpg', price: 5000 },
  { name: 'Single Inner Fender', image: '/ENGINE COVER.jpg', price: 6000 },
  { name: 'Full Engine Cover', image: '/ENGINE COVER.jpg', price: 16000 },
  { name: 'C-Caution', image: '/C-Caution.jpg', price: 5000 },
  { name: 'Fire Extinguishers', image: '/FIRE EXTINGUISHERS.jpg', price: 8000 },
];

const brakeFluidProducts = [
  { name: 'Brake Fluid', brands: [{ name: 'ALLIED', image: '/ALLIED BRAKE FLUID.jpg', price: 5000 }, { name: 'BLAUE ORIGINAL', image: '/BLAUE ORIGINAL BRAKE FLUID.jpg', price: 5000 }] },
];

const matProducts = [
  { name: 'Boot Mat', image: '/BOOTMAT LEXUSRX350 &330 40K, VENZA 40K, HIGHLANDER 40K.jpg', options: [
    { name: 'Lexus RX350 & RX330', price: 40000 }, { name: 'Venza', price: 40000 }, { name: 'Highlander', price: 40000 },
  ] },
  { name: 'Leather & Rug Mixed Footmat', image: '/LEATHERR AND RUG MIXED FOOTMAT, TOYOTA-8K, LEXUS-80K, MERCEDES-80K.jpg', options: [
    { name: 'Toyota', price: 8000 }, { name: 'Lexus', price: 80000 }, { name: 'Mercedes', price: 80000 },
  ] },
  { name: 'Universal Leather Rug Footmat', image: '/UNIVERSAL LEATHER RUG FOTMAT-60K.jpg', options: [{ name: 'Universal', price: 60000 }] },
  { name: 'VIP Footmats', image: '/VIP FOOTMATS, LEXUS ,MERCEDES ,TOYOTA.jpg', options: [{ name: 'Lexus' }, { name: 'Mercedes' }, { name: 'Toyota' }] },
];

function BrakeFluidProduct() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const selected = brakeFluidProducts[0].brands.find((brand) => brand.name === selectedBrand);
  return <article className="catalogue-product">
    {selected?.image ? <img src={selected.image} alt={`Brake Fluid — ${selected.name}`} decoding="async" /> : <div className="catalogue-product-placeholder" aria-hidden="true"><Wrench size={28} /></div>}
    <div className="catalogue-product-body"><strong>Brake Fluid</strong>
      <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} aria-label="Select brake fluid brand">
        <option value="">Select Brand</option>{brakeFluidProducts[0].brands.map((brand) => <option key={brand.name} value={brand.name}>{brand.name}</option>)}
      </select>
      {typeof selected?.price === 'number' ? <div className="product-price">₦{selected.price.toLocaleString()}</div> : <ContactPriceButton productName={selected ? `Brake Fluid — ${selected.name}` : 'Brake Fluid'} />}
      <AddToCartButton item={{ id: `brake-fluid-${selectedBrand || 'select'}`, name: selected ? `Brake Fluid — ${selected.name}` : 'Brake Fluid', image: selected?.image, price: selected?.price }} />
    </div>
  </article>;
}

function MatProducts() {
  const [selected, setSelected] = useState<Record<string, string>>({});
  return <>{matProducts.map((product) => {
    const selectedOption = product.options.find((option) => option.name === selected[product.name]);
    return <article className="catalogue-product" key={product.name}>
      <img src={product.image} alt={product.name} decoding="async" />
      <div className="catalogue-product-body"><strong>{product.name}</strong>
        <select value={selected[product.name] || ''} onChange={(e) => setSelected((prev) => ({ ...prev, [product.name]: e.target.value }))} aria-label={`Select ${product.name} type`}>
          <option value="">Select Brand / Type</option>{product.options.map((option) => <option key={option.name} value={option.name}>{option.name}</option>)}
        </select>
        {selectedOption?.price ? <div className="product-price">₦{selectedOption.price.toLocaleString()}</div> : <ContactPriceButton productName={selectedOption ? `${product.name} — ${selectedOption.name}` : product.name} />}
        <AddToCartButton item={{ id: `mat-${product.name}-${selectedOption?.name || 'select'}`, name: selectedOption ? `${product.name} — ${selectedOption.name}` : product.name, price: selectedOption?.price, image: product.image }} />
      </div>
    </article>;
  })}</>;
}
const securityProducts = [
  { name: 'Trackers', image: '/GPS TRACKER.jpg', price: 50000 },
  { name: 'Steering and Car Lock', image: '/STERRING and car lock.jpg', price: 20000 },
];

function SteeringCoverProduct() {
  const designs = [
    { name: 'Normal Steering Cover', image: '/DESIGN 1 STEERING.jpg', price: 8000 },
    { name: 'Condom Steering Cover', image: '/DESIGN 2 STEERING.jpg', price: 7000 },
  ];
  const [selectedDesign, setSelectedDesign] = useState('');
  const selected = designs.find((design) => design.name === selectedDesign);

  return <article className="catalogue-product">
    {selected ? <img src={selected.image} alt={`Steering Cover ${selected.name}`} decoding="async" /> : <div className="catalogue-product-placeholder" aria-hidden="true"><Car size={28} /></div>}
    <div className="catalogue-product-body">
      <strong>Steering Cover</strong>
      <label className="oil-select-label">Choose Design
        <select value={selectedDesign} onChange={(event) => setSelectedDesign(event.target.value)}>
          <option value="">Pick a Design</option>
          {designs.map((design) => <option value={design.name} key={design.name}>{design.name}</option>)}
        </select>
      </label>
      <ContactPriceButton productName={selected ? `Steering Cover — ${selected.name}` : 'Steering Cover'} />
      <AddToCartButton item={{ id: `accessory-steering-cover-${selectedDesign || 'unselected'}`, name: selected ? `Steering Cover — ${selected.name}` : 'Steering Cover', image: selected?.image }} />
    </div>
  </article>;
}

function SeatCoverProduct() {
  const designs = [
    { name: 'OC CLASSIC', image: '/DESIGN 1 SEATCOVER.jpg', price: 30000 },
    { name: 'R-POWER', image: '/DESIGN 2 SEAT COVER.jpg', price: 100000 },
    { name: 'CROWN', image: '/DESIGN 3 SEAT COVER.jpg', price: 60000 },
    { name: 'SMILEY', image: '/DESIGN SEAT COVER 4.jpg', price: 100000 },
    { name: 'Design 5', image: '/DESIGN 5SEAT CIVER.jpg' },
  ];
  const [selectedDesign, setSelectedDesign] = useState('');
  const selected = designs.find((design) => design.name === selectedDesign);

  return <article className="catalogue-product">
    {selected ? <img src={selected.image} alt={`Seat Cover ${selected.name}`} decoding="async" /> : <div className="catalogue-product-placeholder" aria-hidden="true"><Car size={28} /></div>}
    <div className="catalogue-product-body">
      <strong>Seat Covers</strong>
      <label className="oil-select-label">Choose Design
        <select value={selectedDesign} onChange={(event) => setSelectedDesign(event.target.value)}>
          <option value="">Pick a Design</option>
          {designs.map((design) => <option value={design.name} key={design.name}>{design.name}</option>)}
        </select>
      </label>
      <ContactPriceButton productName={selected ? `Seat Covers — ${selected.name}` : 'Seat Covers'} />
      <AddToCartButton item={{ id: `accessory-seat-cover-${selectedDesign || 'unselected'}`, name: selected ? `Seat Covers — ${selected.name}` : 'Seat Covers', image: selected?.image }} />
    </div>
  </article>;
}

function AccessoriesPage() {
  return <div className="battery-page"><header className="site-header"><div className="container nav-wrap">
    <a className="brand" href="/"><img className="brand-logo" src="/Logo and icon.jpg" alt="Genesis Autos" /><span className="brand-text"><strong>GENESIS <em>AUTOS</em></strong><small>AUTOMOBILE PARTS & SERVICES</small></span></a>
    <nav className="battery-nav"><a href="/">Home</a><ProductSearch /><CartButton /><a href="/accessories">Accessories</a><button className="button button-small button-orange" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to enquire about your car accessories.')}><MessageCircle size={15}/> WhatsApp Us</button></nav>
  </div></header>
  <main><section className="battery-hero"><div className="container"><div className="eyebrow orange-text"><Car size={14}/> Accessories</div><h1>Car <span>Accessories</span></h1><p>Available automotive accessories from Genesis Autos. Contact us to confirm availability and current price.</p>
    <div className="accessory-list">{accessoryProducts.map((item) => item.name === 'Seat Covers' ? <SeatCoverProduct key={item.name} /> : item.name === 'Steering Cover' ? <SteeringCoverProduct key={item.name} /> : <article className="catalogue-product" key={item.name}>{item.image ? <img src={item.image} alt={item.name} decoding="async" /> : <div className="catalogue-product-placeholder" aria-hidden="true"><Car size={28} /></div>}<div className="catalogue-product-body"><strong>{item.name}</strong>{typeof item.price === 'number' ? <div className="product-price">₦{item.price.toLocaleString()}</div> : <ContactPriceButton productName={item.name} />}<AddToCartButton item={{ id: `accessory-${item.name}`, name: item.name, price: item.price, image: item.image }} /></div></article>)}</div>
    <h2 className="section-title">Foot Mats & Boot Mats</h2>
    <div className="accessory-list"><MatProducts /></div>
  </div></section>
</main>
  <button className="floating-whatsapp" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to enquire about your car accessories.')} aria-label="Chat on WhatsApp"><MessageCircle size={24}/></button></div>;
}

function RimProduct({ rim }: { rim: { size: string; options: { name: string; price: number }[] } }) {
  const [selectedOption, setSelectedOption] = useState('');
  const selected = rim.options.find((option) => option.name === selectedOption);
  return <article className="catalogue-product">
    <img src="/RIMS.jpg" alt={`Alloy Rim ${rim.size}`} decoding="async" />
    <div className="catalogue-product-body">
      <strong>Alloy Rim {rim.size}</strong>
      <label className="oil-select-label">Choose Condition
        <select value={selectedOption} onChange={(event) => setSelectedOption(event.target.value)}>
          <option value="">Pick New or Tokunbo</option>
          {rim.options.map((option) => <option value={option.name} key={option.name}>{option.name}</option>)}
        </select>
      </label>
      {selected ? <div className="product-price">₦{selected.price.toLocaleString()}</div> : <span className="price-prompt">Select an option to see price</span>}
      <ContactPriceButton productName={selected ? `Alloy Rim ${rim.size} — ${selected.name}` : `Alloy Rim ${rim.size}`} />
      <AddToCartButton item={{ id: `rim-${rim.size}-${selectedOption || 'unselected'}`, name: selected ? `Alloy Rim ${rim.size} — ${selected.name}` : `Alloy Rim ${rim.size}`, price: selected?.price, image: '/RIMS.jpg' }} />
    </div>
  </article>;
}

function SecurityPage() {
  return <div className="battery-page"><header className="site-header"><div className="container nav-wrap">
    <a className="brand" href="/"><img className="brand-logo" src="/Logo and icon.jpg" alt="Genesis Autos" /><span className="brand-text"><strong>GENESIS <em>AUTOS</em></strong><small>AUTOMOBILE PARTS & SERVICES</small></span></a>
    <nav className="battery-nav"><a href="/">Home</a><ProductSearch /><CartButton /><a href="/security">Security</a><button className="button button-small button-orange" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to enquire about vehicle security products.')}><MessageCircle size={15}/> WhatsApp Us</button></nav>
  </div></header>
  <main><section className="battery-hero"><div className="container"><div className="eyebrow orange-text"><ShieldCheck size={14}/> Security</div><h1>Vehicle <span>Security</span></h1><p>Vehicle security products from Genesis Autos. Contact us to confirm availability and current price.</p>
    <div className="accessory-list">{securityProducts.map((item) => <article className="catalogue-product" key={item.name}>{item.image ? <img src={item.image} alt={item.name} decoding="async" /> : <div className="catalogue-product-placeholder" aria-hidden="true"><ShieldCheck size={28} /></div>}<div className="catalogue-product-body"><strong>{item.name}</strong>{typeof item.price === 'number' ? <div className="product-price">₦{item.price.toLocaleString()}</div> : <ContactPriceButton productName={item.name} />}<AddToCartButton item={{ id: `security-${item.name}`, name: item.name, price: item.price, image: item.image }} /></div></article>)}</div>
  </div></section></main>
  <button className="floating-whatsapp" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to enquire about vehicle security products.')} aria-label="Chat on WhatsApp"><MessageCircle size={24}/></button></div>;
}

function ToolsPage() {
  return <div className="battery-page"><header className="site-header"><div className="container nav-wrap">
    <a className="brand" href="/"><img className="brand-logo" src="/Logo and icon.jpg" alt="Genesis Autos" /><span className="brand-text"><strong>GENESIS <em>AUTOS</em></strong><small>AUTOMOBILE PARTS & SERVICES</small></span></a>
    <nav className="battery-nav"><a href="/">Home</a><ProductSearch /><CartButton /><a href="/tools">Tools & Essentials</a><button className="button button-small button-orange" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to enquire about tools and essentials.')}><MessageCircle size={15}/> WhatsApp Us</button></nav>
  </div></header>
  <main><section className="battery-hero"><div className="container"><div className="eyebrow orange-text"><Wrench size={14}/> Tools & Essentials</div><h1>Tools <span>& Essentials</span></h1><p>Essential automotive tools, safety items and vehicle essentials available from Genesis Autos. Contact us to confirm availability and current price.</p>
    <div className="accessory-list">
      {alloyRimProducts.map((rim) => <RimProduct key={rim.size} rim={rim} />)}
      {toolsProducts.map((item) => <article className="catalogue-product" key={item.name}>{item.image ? <img src={item.image} alt={item.name} /> : <div className="catalogue-product-placeholder" aria-hidden="true"><Wrench size={28} /></div>}<div className="catalogue-product-body"><strong>{item.name}</strong>{typeof item.price === 'number' ? <div className="product-price">₦{item.price.toLocaleString()}</div> : <ContactPriceButton productName={item.name} />}<AddToCartButton item={{ id: `tool-${item.name}`, name: item.name, price: item.price, image: item.image }} /></div></article>)}
      <h2 className="section-title">Brake Fluids</h2>
      <div className="accessory-list"><BrakeFluidProduct /></div>
    </div>
  </div></section>
</main>
  <button className="floating-whatsapp" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to enquire about tools and essentials.')} aria-label="Chat on WhatsApp"><MessageCircle size={24}/></button></div>;
}

type EngineOilOption = { size: string; price: number };
type EngineOilGradeData = { grade: string; brands: Record<string, EngineOilOption[]> };

const engineOilGrades: EngineOilGradeData[] = [
  {
    grade: '20W-50',
    brands: {
      'MOBIL HHP': [
        { size: '4 Litre', price: 24000 },
        { size: '5 Litre', price: 30000 },
        { size: '1 Litre', price: 7500 },
      ],
      'TOTAL': [
        { size: '5 Litre', price: 30000 },
        { size: '4 Litre', price: 25000 },
        { size: '1 Litre', price: 8000 },
      ],
      'AP VISCO 2000': [
        { size: '1 Litre', price: 6500 },
        { size: '4 Litre', price: 25000 },
      ],
      'SEA HORSE': [
        { size: '1 Litre', price: 4500 },
        { size: '4 Litre', price: 18000 },
      ],
    },
  },
  { grade: '10W-40', brands: {} },
  {
    grade: '5W-30',
    brands: {
      'HARDEX': [
        { size: '5 Litre', price: 40000 },
        { size: '1 Litre', price: 10000 },
      ],
      'SEA GOLD SUPER D': [
        { size: '5 Litre', price: 30000 },
      ],
      'MOBIL 2000': [
        { size: '1 Litre', price: 8000 },
        { size: '4 Litre', price: 27000 },
        { size: '5 Litre', price: 35000 },
      ],
      'MOBIL 1 [SPECIAL]': [
        { size: '5 Litre', price: 80000 },
      ],
      'MOBIL 1': [
        { size: '1 Litre', price: 8000 },
        { size: '5 Litre', price: 30000 },
      ],
    },
  },
  {
    grade: '5W-20',
    brands: {
      'HARDEX': [
        { size: '5 Litre', price: 40000 },
        { size: '1 Litre', price: 10000 },
        { size: '7 Litre', price: 60000 },
      ],
    },
  },
  {
    grade: 'SAE 40',
    brands: {
      'OLEUM SUPER': [
        { size: '1 Litre', price: 4500 },
        { size: '4 Litre', price: 18000 },
      ],
      'CONOIL GOLDEN SUPER': [
        { size: '4 Litre', price: 18000 },
      ],
    },
  },
  {
    grade: '0W-20',
    brands: {
      'MOBIL 1': [{ size: '5 Litre', price: 50000 }],
    },
  },
];

const lubricantGroups = {
  atf: ['TOYOTA ATF', 'SEAMAX', 'ABRO MASTERS', 'HARDEX ATF', 'HOLTS ATF'],
  other: ['OIL FILTER', 'INJECTOR CLEANER', 'OIL TREATMENT'],
};

const coolantOptions = [
  { size: '4 Litre', price: 6000 },
  { size: '1 Litre', price: 2500 },
];

function ATFProduct({ name, image, price }: { name: string; image: string; price?: number }) {
  return <article className="catalogue-product">
    <img src={image} alt={name} decoding="async" />
    <div className="catalogue-product-body">
      <strong>{name}</strong>
      {typeof price === 'number' ? <div className="product-price">₦{price.toLocaleString()}</div> : <ContactPriceButton productName={name} />}
      <AddToCartButton item={{ id: `atf-${name.toLowerCase().replace(/\\s+/g, '-')}`, name, image, price }} />
    </div>
  </article>;
}
function CoolantProduct() {
  const [selectedSize, setSelectedSize] = useState(coolantOptions[0].size);
  const selected = coolantOptions.find((item) => item.size === selectedSize) || coolantOptions[0];

  return <article className="catalogue-product lubricant-grade-card">
    <div className="catalogue-product-body">
      <div className="eyebrow orange-text">Coolant</div>
      <h3>COOLANT</h3>
      <label className="oil-select-label">Size
        <select value={selected.size} onChange={(event) => setSelectedSize(event.target.value)}>
          {coolantOptions.map((item) => <option value={item.size} key={item.size}>{item.size} — ₦{item.price.toLocaleString()}</option>)}
        </select>
      </label>
      <div className="battery-price">₦{selected.price.toLocaleString()}</div>
      <AddToCartButton item={{ id: `coolant-${selected.size}`, name: 'COOLANT', price: selected.price, details: selected.size }} />
    </div>
  </article>;
}

function EngineOilGrade({ grade, brands }: { grade: string; brands: Record<string, { size: string; price: number }[]> }) {
  const brandNames = Object.keys(brands);
  const firstBrand = brandNames[0] || '';
  const [selectedBrand, setSelectedBrand] = useState(firstBrand);
  const [selectedSize, setSelectedSize] = useState(brands[firstBrand]?.[0]?.size || '');

  useEffect(() => {
    const validBrand = brandNames.includes(selectedBrand) ? selectedBrand : firstBrand;
    const sizes = brands[validBrand] || [];
    const validSize = sizes.some((item) => item.size === selectedSize) ? selectedSize : (sizes[0]?.size || '');
    if (validBrand !== selectedBrand) setSelectedBrand(validBrand);
    if (validSize !== selectedSize) setSelectedSize(validSize);
  }, [brandNames.join('|'), firstBrand, selectedBrand, selectedSize, brands]);

  const brandItems = brands[selectedBrand] || [];
  const selected = brandItems.find((item) => item.size === selectedSize) || brandItems[0];
  const itemName = selectedBrand ? `${selectedBrand} ${grade}` : grade;

  return <article className="catalogue-product lubricant-grade-card">
    <div className="catalogue-product-body">
      <div className="eyebrow orange-text">Engine Oil</div>
      <h3>{grade}</h3>
      {brandNames.length ? <>
        <label className="oil-select-label">Brand
          <select value={selectedBrand} onChange={(event) => {
            const nextBrand = event.target.value;
            setSelectedBrand(nextBrand);
            setSelectedSize(brands[nextBrand]?.[0]?.size || '');
          }}>
            {brandNames.map((brand) => <option value={brand} key={brand}>{brand}</option>)}
          </select>
        </label>
        <label className="oil-select-label">Size
          <select value={selected?.size || ''} onChange={(event) => setSelectedSize(event.target.value)}>
            {brandItems.map((item) => <option value={item.size} key={item.size}>{item.size} — ₦{item.price.toLocaleString()}</option>)}
          </select>
        </label>
        {selected && <div className="battery-price">₦{selected.price.toLocaleString()}</div>}
        {selected && <AddToCartButton item={{ id: `engine-oil-${grade}-${selectedBrand}-${selected.size}`, name: itemName, price: selected.price, details: `${grade} · ${selected.size}` }} />}
      </> : <ContactPriceButton productName={itemName} />}
    </div>
  </article>;
}

function LubricantsPage() {
  return <div className="battery-page"><header className="site-header"><div className="container nav-wrap">
    <a className="brand" href="/"><img className="brand-logo" src="/Logo and icon.jpg" alt="Genesis Autos" /><span className="brand-text"><strong>GENESIS <em>AUTOS</em></strong><small>AUTOMOBILE PARTS & SERVICES</small></span></a>
    <nav className="battery-nav"><a href="/">Home</a><ProductSearch /><CartButton /><a href="/oil-grease-atf">Oil, Grease & ATF</a><button className="button button-small button-orange" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to enquire about oil, grease and ATF products.')}><MessageCircle size={15}/> WhatsApp Us</button></nav>
  </div></header>
  <main><section className="battery-hero"><div className="container"><div className="eyebrow orange-text"><Settings size={14}/> Oil, Grease & ATF</div><h1>Oil, Grease <span>& ATF</span></h1><p>Engine oils grouped by grade. Select the brand and size you need.</p>
    <div className="lubricant-groups">
      <div className="lubricant-group"><h2>Engine Oil Grades</h2><div className="accessory-list">{engineOilGrades.map((group) => <EngineOilGrade key={group.grade} {...group} />)}</div></div>
      <div className="lubricant-group"><h2>ATF</h2><div className="accessory-list">{[{ name: 'TOYOTA ATF 1L', image: '/TOYOTA ATF.jpg', price: 7000 }, { name: 'SEAMAX', image: '/SEAMAX ATF.jpg' }, { name: 'ABRO MASTERS', image: '/ATF.jpg' }, { name: 'HARDEX ATF', image: '/HARDEX ATF.jpg' }, { name: 'HOLTS ATF', image: '/ATF.jpg', price: 5000 }].map((item) => <ATFProduct key={item.name} {...item} />)}</div></div>
      <div className="lubricant-group"><h2>Other Lubricants & Fluids</h2><div className="accessory-list">
        <CoolantProduct />
        {lubricantGroups.other.map((item) => {
        const imageMap: Record<string, string> = {
          'OIL FILTER': '/OIL FILTER.jpg',
          'INJECTOR CLEANER': '/FUEL INJECTOR CLEANER.jpg',
          'OIL TREATMENT': '/OIL TREATMENT.jpg',
        };
        return <article className="catalogue-product" key={item}>{imageMap[item] && <img src={imageMap[item]} alt={item} decoding="async" />}<div className="catalogue-product-body"><strong>{item}</strong>{item === 'INJECTOR CLEANER' || item === 'OIL TREATMENT' ? null : <ContactPriceButton productName={item} />}<AddToCartButton item={{ id: `fluid-${item}`, name: item, price: item === 'INJECTOR CLEANER' ? 3500 : item === 'OIL TREATMENT' ? 3500 : undefined, image: imageMap[item] }} /></div></article>;
      })}</div></div>
    </div>
  </div></section></main>
  <button className="floating-whatsapp" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to enquire about oil, grease and ATF products.')} aria-label="Chat on WhatsApp"><MessageCircle size={24}/></button></div>;
}

type BatteryProduct = { brand: string; name: string; voltage: string; capacity: string; image: string; price?: number; terminal?: string };

const batteryProducts: BatteryProduct[] = [
  { brand: 'Gales', name: 'Gales Battery', voltage: '12V', capacity: '75Ah', price: 75000, image: '' },

  { brand: 'ZenGLOBAL', name: 'ZenGLOBAL Battery', voltage: '12V', capacity: '75Ah', price: 60000, image: '/ZENGLOBAL.jpg' },
  { brand: 'Runall', name: 'Runall Battery', voltage: '12V', capacity: '100Ah', price: 80000, image: '/RUNALL.jpg' },
  { brand: 'Runall', name: 'Runall Battery', voltage: '12V', capacity: '45Ah', price: 40000, image: '/RUNALL.jpg' },
  { brand: 'Runall', name: 'Runall Battery', voltage: '12V', capacity: '62Ah', price: 45000, image: '/RUNALL.jpg' },
  { brand: 'Runall', name: 'Runall Battery', voltage: '12V', capacity: '75Ah', price: 55000, image: '/RUNALL.jpg' },
  { brand: 'Runall', name: 'Runall Battery', voltage: '12V', capacity: '90Ah', price: 120000, image: '/RUNALL.jpg' },
  { brand: 'Runall', name: 'Runall Battery', voltage: '12V', capacity: '80Ah', price: 110000, image: '/RUNALL.jpg' },
  { brand: 'Startall', name: 'Startall Battery', voltage: '12V', capacity: '75Ah', price: 55000, image: '/STARTALL.jpg' },
{ brand: 'Solite', name: 'Solite Battery', voltage: '12V', capacity: '75Ah', price: 95000, image: '/SOLITE.jpg' },
  { brand: 'Sebang', name: 'Sebang Battery', voltage: '12V', capacity: '75Ah', price: 100000, image: '/SEBANG.jpg' },
  { brand: 'Everstart', name: 'Everstart Battery', voltage: '12V', capacity: '90Ah', terminal: 'Normal Terminal', price: 120000, image: '/EVERSTART.jpg' },
  { brand: 'Everstart', name: 'Everstart Battery', voltage: '12V', capacity: '90Ah', terminal: 'Opposite Terminal', price: 120000, image: '/EVERSTART.jpg' },
  { brand: 'Everstart', name: 'Everstart Battery', voltage: '12V', capacity: '75Ah', terminal: 'Normal Terminal', price: 100000, image: '/EVERSTART.jpg' },
  { brand: 'Everstart', name: 'Everstart Battery', voltage: '12V', capacity: '75Ah', terminal: 'Opposite Terminal', price: 100000, image: '/EVERSTART.jpg' },
  { brand: 'Everstart', name: 'Everstart Battery', voltage: '12V', capacity: '80Ah', terminal: 'Normal Terminal', price: 110000, image: '/EVERSTART.jpg' },
  { brand: 'Everstart', name: 'Everstart Battery', voltage: '12V', capacity: '80Ah', terminal: 'Opposite Terminal', price: 110000, image: '/EVERSTART.jpg' },
  { brand: 'Everstart', name: 'Everstart Battery', voltage: '12V', capacity: '100Ah', terminal: 'Normal Terminal', price: 150000, image: '/EVERSTART.jpg' },
  { brand: 'Everstart', name: 'Everstart Battery', voltage: '12V', capacity: '100Ah', terminal: 'Opposite Terminal', price: 150000, image: '/EVERSTART.jpg' },
  { brand: 'KINGLION', name: 'KINGLION Battery', voltage: '12V', capacity: '75Ah', price: 55000, image: '/KINGLION.jpg' },
  { brand: 'FINBROK SUPER', name: 'FINBROK SUPER Battery', voltage: '12V', capacity: '75Ah', price: 55000, image: '/FINBROKSUPER.jpg' },
  { brand: 'Super Diamond', name: 'Super Diamond Battery', voltage: '12V', capacity: '75Ah', price: 100000, image: '/DIAMOND.jpg' },
  { brand: 'Target', name: 'Target Battery', voltage: '12V', capacity: '75Ah', price: 100000, image: '/TARGET.jpg' },
  { brand: 'Cooltiger', name: 'Cooltiger Battery', voltage: '12V', capacity: '75Ah', price: 55000, image: '/COOLTIGER.jpg' },
  { brand: 'Rocket', name: 'Rocket Battery', voltage: '12V', capacity: '75Ah', price: 100000, image: '/ROCKET.jpg' },
  { brand: 'Atlas BX', name: 'Atlas BX Battery', voltage: '12V', capacity: '75Ah', price: 55000, image: '/ATLASBX.jpg' },
];

function BatteryPage() {
  const path = window.location.pathname.replace(/\/+$/, '');
  const slug = path.split('/').pop() || '';
  const brandMap: Record<string, string> = {
    gales: 'Gales',
    zenglobal: 'ZenGLOBAL',
    runall: 'Runall',
    startall: 'Startall',
    solite: 'Solite',
    sebang: 'Sebang',
    everstart: 'Everstart',
    kinglion: 'KINGLION',
    'finbrok-super': 'FINBROK SUPER',
    'super-diamond': 'Super Diamond',
    target: 'Target',
    cooltiger: 'Cooltiger',
    rocket: 'Rocket',
    'atlas-bx': 'Atlas BX',
  };
  const selectedBrand = brandMap[slug];
  const visibleProducts = selectedBrand
    ? batteryProducts.filter((p) => p.brand === selectedBrand)
    : batteryProducts;

  return (
    <div className="battery-page">
      <header className="site-header"><div className="container nav-wrap">
        <a className="brand" href="/"><img className="brand-logo" src="/Logo and icon.jpg" alt="Genesis Autos" /><span className="brand-text"><strong>GENESIS <em>AUTOS</em></strong><small>AUTOMOBILE PARTS & SERVICES</small></span></a>
        <nav className="battery-nav"><a href="/">Home</a><ProductSearch /><CartButton /><a href="/batteries">All Batteries</a><button className="button button-small button-orange" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to enquire about your batteries.')}><MessageCircle size={15} /> WhatsApp Us</button></nav>
      </div></header>
      <main>
        <section className="battery-hero"><div className="container">
          <div className="eyebrow orange-text"><Battery size={14} /> Batteries</div>
          <h1>{selectedBrand ? <>{selectedBrand} <span>Batteries</span></> : <>Automotive <span>Batteries</span></>}</h1>
          <p>{selectedBrand ? `Available ${selectedBrand} battery options. Contact Genesis Autos to confirm availability and current price.` : 'Select a battery brand below to view only that brand’s available batteries.'}</p>
          {!selectedBrand && <div className="battery-filters"><div><label>Battery Brands</label><div className="filter-buttons">{Object.entries(brandMap).map(([key, name]) => <a className="brand-filter-link" href={`/batteries/${key}`} key={key}>{name}</a>)}</div></div></div>}
        </div></section>
        <section className="battery-catalogue"><div className="container">
          <div className="battery-heading"><div><div className="eyebrow orange-text">{selectedBrand || 'Battery Catalogue'}</div><h2>{selectedBrand ? 'Available Options' : <>Choose a <span>Brand</span></>}</h2></div><span>{selectedBrand ? `${visibleProducts.length} product${visibleProducts.length === 1 ? '' : 's'}` : `${Object.keys(brandMap).length} brands`}</span></div>
          {selectedBrand ? selectedBrand === 'Everstart' ? <div className="battery-terminal-groups">
            {['Normal Terminal', 'Opposite Terminal'].map((terminal) => {
              const terminalProducts = visibleProducts.filter((p) => p.terminal === terminal);
              return <section className="battery-terminal-group" key={terminal}>
                <div className="battery-terminal-heading"><div><div className="eyebrow orange-text">Everstart</div><h3>{terminal}</h3></div><span>{terminalProducts.length} options</span></div>
                <div className="battery-grid">{terminalProducts.map((p) => <article className="battery-card" key={p.brand + p.capacity + p.terminal}>
                  {p.image ? <img src={p.image} alt={p.name + ' ' + p.capacity + ' ' + p.terminal} decoding="async" /> : <div className="battery-image-placeholder" aria-hidden="true"><Battery size={30} /></div>}
                  <div className="battery-card-body"><div className="battery-brand">{p.brand}</div><h3>{p.name}</h3><div className="battery-specs"><div><small>Voltage</small><strong>{p.voltage}</strong></div><div><small>Capacity</small><strong>{p.capacity}</strong></div><div><small>Terminal</small><strong>{p.terminal?.replace(' Terminal', '')}</strong></div></div>{typeof p.price === 'number' ? <div className="product-price">₦{p.price.toLocaleString()}</div> : <ContactPriceButton productName={p.name} />}<AddToCartButton item={{ id: p.brand + '-' + p.voltage + '-' + p.capacity + '-' + p.terminal, name: p.name, price: p.price, image: p.image, details: p.voltage + ' · ' + p.capacity + ' · ' + p.terminal }} /><button className="button button-outline battery-enquire" onClick={() => openWhatsApp('Hello Genesis Autos, I am interested in the ' + p.name + ' (' + p.voltage + ', ' + p.capacity + ', ' + p.terminal + '). Please confirm availability and current price.')}><MessageCircle size={15} /> Enquire on WhatsApp</button></div>
                </article>)}</div>
              </section>;
            })}
          </div> : <div className="battery-grid">{visibleProducts.map((p) => <article className="battery-card" key={p.brand + p.capacity}>
            {p.image ? <img src={p.image} alt={p.name} decoding="async" /> : <div className="battery-image-placeholder" aria-hidden="true"><Battery size={30} /></div>}
            <div className="battery-card-body"><div className="battery-brand">{p.brand}</div><h3>{p.name}</h3><div className="battery-specs"><div><small>Voltage</small><strong>{p.voltage}</strong></div><div><small>Capacity</small><strong>{p.capacity}</strong></div>{p.terminal && <div><small>Terminal</small><strong>{p.terminal.replace(' Terminal', '')}</strong></div>}</div>{typeof p.price === 'number' ? <div className="product-price">₦{p.price.toLocaleString()}</div> : <ContactPriceButton productName={p.name} />}<AddToCartButton item={{ id: p.brand + '-' + p.voltage + '-' + p.capacity + '-' + (p.terminal || 'standard'), name: p.name, price: p.price, image: p.image, details: p.voltage + ' · ' + p.capacity + (p.terminal ? ' · ' + p.terminal : '') }} /><button className="button button-outline battery-enquire" onClick={() => openWhatsApp('Hello Genesis Autos, I am interested in the ' + p.name + ' (' + p.voltage + ', ' + p.capacity + (p.terminal ? ', ' + p.terminal : '') + '). Please confirm availability and current price.')}><MessageCircle size={15} /> Enquire on WhatsApp</button></div>
          </article>)}</div> : <div className="battery-brand-directory">{Object.entries(brandMap).map(([key, name]) => <a className="battery-brand-tile" href={`/batteries/${key}`} key={key}><Battery size={22} /><strong>{name}</strong><span>View batteries <ChevronRight size={14} /></span></a>)}</div>}
        </div></section>
      </main>
      <button className="floating-whatsapp" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to enquire about your batteries.')} aria-label="Chat on WhatsApp"><MessageCircle size={24} /></button>
    </div>
  );
}


function ProductDetailPage({ product }: { product: SeoProduct }) {
  const categoryHref = product.category === 'Car Batteries' ? '/batteries' : product.category === 'Car Accessories' ? '/accessories' : product.category === 'Automotive Tools & Essentials' || product.category === 'Alloy Rims' ? '/tools' : product.category === 'Vehicle Security' ? '/security' : '/oil-grease-atf';
  return <div className="battery-page">
    <header className="site-header"><div className="container nav-wrap">
      <a className="brand" href="/"><img className="brand-logo" src="/Logo and icon.jpg" alt="Genesis Autos" /><span className="brand-text"><strong>GENESIS <em>AUTOS</em></strong><small>AUTOMOBILE PARTS & SERVICES</small></span></a>
      <nav className="battery-nav"><a href="/">Home</a><ProductSearch /><CartButton /><a href={categoryHref}>{product.category}</a><button className="button button-small button-orange" onClick={() => openWhatsApp(`Hello Genesis Autos, I am interested in ${product.name}. Please confirm availability and current price.`)}><MessageCircle size={15}/> WhatsApp Us</button></nav>
    </div></header>
    <main>
      <section className="battery-hero"><div className="container">
        <div className="eyebrow orange-text">{product.category}</div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
      </div></section>
      <section className="battery-catalogue"><div className="container">
        <div className="catalogue-product product-detail-card">
          {product.image ? <img src={product.image} alt={`${product.name} available from Genesis Autos in Iyana Ipaja Lagos`} decoding="async" /> : <div className="catalogue-product-placeholder" aria-hidden="true"><Car size={40} /></div>}
          <div className="catalogue-product-body">
            <div className="eyebrow orange-text">{product.category}</div>
            <h2>{product.name}</h2>
            {product.details && <p>{product.details}</p>}
            {typeof product.price === 'number' ? <div className="product-price">₦{product.price.toLocaleString()}</div> : <ContactPriceButton productName={product.name} />}
            <AddToCartButton item={{ id: product.slug, name: product.name, price: product.price, image: product.image, details: product.details }} />
            <button className="button button-outline battery-enquire" onClick={() => openWhatsApp(`Hello Genesis Autos, I am interested in ${product.name}. Please confirm availability and current price.`)}><MessageCircle size={15} /> Enquire on WhatsApp</button>
            <a className="text-button" href={categoryHref}>Browse more {product.category} <ChevronRight size={14} /></a>
          </div>
        </div>
      </div></section>
    </main>
    <button className="floating-whatsapp" onClick={() => openWhatsApp(`Hello Genesis Autos, I am interested in ${product.name}.`)} aria-label="Chat on WhatsApp"><MessageCircle size={24}/></button>
  </div>;
}

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  useSeo(currentPath);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleInternalNavigation = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link || link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.origin);
      if (url.origin !== window.location.origin || url.hash) return;
      const path = url.pathname;
      if (!['/', '/cart', '/batteries', '/accessories', '/tools', '/security', '/oil-grease-atf'].some((route) => path === route || (route === '/batteries' && path.startsWith('/batteries/')) || path.startsWith('/products/'))) return;
      event.preventDefault();
      if (path === window.location.pathname) return;
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    document.addEventListener('click', handleInternalNavigation);
    return () => document.removeEventListener('click', handleInternalNavigation);
  }, []);
  const [showIntro, setShowIntro] = useState(() => {
    return localStorage.getItem('genesis-intro-played') !== 'true';
  });

  useEffect(() => {
    if (showIntro) localStorage.setItem('genesis-intro-played', 'true');
  }, [showIntro]);

  useEffect(() => {
    if (!showIntro) return;
    document.body.classList.add('intro-active');
    return () => document.body.classList.remove('intro-active');
  }, [showIntro]);

  const finishIntro = () => {
    setShowIntro(false);
    document.body.classList.remove('intro-active');
  };
  const [formSent, setFormSent] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = `Hello Genesis Autos, I would like to make an enquiry.\n\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nWhat I need: ${data.get('need')}\nVehicle: ${data.get('vehicle')}\nMessage: ${data.get('message')}`;
    setFormSent(true); openWhatsApp(message);
  };

  if (currentPath === '/cart') return <CartPage />;
  if (currentPath.startsWith('/products/')) {
    const product = getSeoProductBySlug(currentPath.replace('/products/', ''));
    if (product) return <ProductDetailPage product={product} />;
  }
  if (currentPath === '/batteries' || currentPath.startsWith('/batteries/')) return <BatteryPage />;
  if (currentPath === '/accessories') return <AccessoriesPage />;
  if (currentPath === '/tools') return <ToolsPage />;
  if (currentPath === '/security') return <SecurityPage />;
  if (currentPath === '/oil-grease-atf') return <LubricantsPage />;

  return (
    <>
      {showIntro && (
        <div className="site-intro" role="dialog" aria-label="Genesis Autos introduction">
          <video
            className="site-intro-video"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={finishIntro}
            onError={finishIntro}
          >
            <source src="/IMG_4927.mp4" type="video/mp4" />
          </video>
          <div className="site-intro-shade" />
          <div className="site-intro-brand">
            <span>GENESIS <em>AUTOS</em></span>
            <small>Automobile Parts & Services</small>
            <div className="intro-loading"><i /></div>
          </div>
        </div>
      )}
      <div className="site-shell">
      <header className="site-header"><div className="container nav-wrap">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Genesis Autos home"><img className="brand-logo" src="/Logo and icon.jpg" alt="Genesis Autos" /><span className="brand-text"><strong>GENESIS <em>AUTOS</em></strong><small>AUTOMOBILE PARTS & SERVICES</small></span></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          <a href="#home" onClick={closeMenu}>Home</a><a href="#about" onClick={closeMenu}>About</a><a href="#batteries" onClick={closeMenu}>Products</a><a href="#services" onClick={closeMenu}>Services</a><a href="#why-genesis" onClick={closeMenu}>Why Genesis</a><a href="#contact" onClick={closeMenu}>Contact</a>
          <ProductSearch /><CartButton /><button className="button button-small button-orange nav-cta" onClick={() => openWhatsApp('Hello Genesis Autos, I found your website and I would like to make an enquiry.')}><MessageCircle size={15} /> WhatsApp Us</button>
        </nav>
      </div></header>

      <main>
        <section className="hero" id="home"><div className="hero-accent" /><div className="container hero-grid">
          <div className="hero-copy"><div className="eyebrow"><MapPin size={13} /> Iyana Ipaja, Lagos</div><h1>Quality Auto Parts.<br /><span>Reliable Automotive</span><br />Support.</h1><p>Your trusted destination for automobile spare parts and automotive support in Iyana Ipaja, Lagos.</p><div className="hero-actions"><button className="button button-orange" onClick={() => openWhatsApp('Hello Genesis Autos, I found your website and I would like to make an enquiry.')}><MessageCircle size={17} /> WhatsApp Genesis Autos</button><a className="button button-outline" href="#products">Explore Products <ArrowRight size={16} /></a></div><div className="rating-line"><Star size={16} fill="currentColor" /><strong>4.3</strong> Google Rating <span>·</span> Local Automotive Business</div></div>
          <img
  className="hero-image real-image"
  src="/IMG_4929.jpg"
  alt="Genesis Autos automotive parts and services"
  fetchPriority="high"
  decoding="async"
/>
        </div></section>

        <section className="quick-strip"><div className="container quick-grid">{[
          { icon: Settings, title: 'Spare Parts', text: 'Quality automotive parts for different vehicle needs.' }, { icon: Wrench, title: 'Auto Support', text: 'Automotive support for vehicle owners and businesses.' }, { icon: MessageCircle, title: 'Easy Enquiries', text: 'Contact Genesis Autos directly through WhatsApp or phone.' },
        ].map(({ icon: Icon, title, text }) => <div className="quick-card" key={title}><Icon size={24} /><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>

        <section className="section about-section" id="about"><div className="container about-grid"><div className="about-copy"><div className="eyebrow orange-text">About Genesis Autos</div><h2>Built Around Your<br /><span>Vehicle Needs</span></h2><p>Genesis Autos provides automotive products and support for vehicle owners, drivers, workshops and businesses in Lagos.</p><p>From spare parts and automotive products to support, our goal is to make it easier for customers to find the products and assistance they need for their vehicles.</p><div className="location-card"><div className="location-icon"><MapPin size={19} /></div><div><strong>Visit Genesis Autos</strong><p>62 Alimosho Rd.<br />Opp. Multigrace Sch. Alagutan B/Stop<br />Iyana Ipaja, Lagos</p></div><a className="button button-orange button-small" href={directionsUrl} target="_blank" rel="noreferrer">Get Directions</a></div></div><img className="about-image real-image" src="/IMG_4926.jpg" alt="Genesis Autos automotive parts and services" decoding="async" /></div></section>

        <section className="section dark-section products-section" id="products"><div className="container"><div className="section-heading light-heading"><div><div className="eyebrow orange-text">Our Products</div><h2>Automotive <span>Products</span></h2></div><a href="#products">View All Products <ArrowRight size={15} /></a></div><div className="products-grid">{products.map(({ title, description, icon: Icon, label, image, battery, accessories, tools, security, lubricants }) => {
  const href = battery ? '/batteries' : accessories ? '/accessories' : tools ? '/tools' : security ? '/security' : lubricants ? '/oil-grease-atf' : '#contact';
  return <a className="product-card product-card-link" key={title} href={href} aria-label={`View ${title}`}>
    <ImagePlaceholder src={image} label={label} />
    <div className="product-info">
      <div className="product-title"><Icon size={19} /><h3>{title}</h3></div>
      <p>{description}</p>
      {href !== '#contact' && <span className="text-button">View {title} <ChevronRight size={14} /></span>}
    </div>
  </a>;
})}</div></div></section>

        <section className="section dark-section services-section" id="services"><div className="container"><div className="section-heading light-heading"><div><div className="eyebrow orange-text">Services</div><h2>Automotive Support <span>When You Need It</span></h2></div></div><div className="services-grid">{services.map(({ title, description, icon: Icon }) => <article className="service-card" key={title}><Icon size={25} /><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>

        <section className="section why-section" id="why-genesis"><div className="container"><div className="eyebrow orange-text">Why Genesis Autos</div><h2>Why Customers Choose <span>Genesis Autos</span></h2><div className="why-grid">{[{ title: 'Local & Accessible', text: 'Conveniently located on Alimosho Road in Iyana Ipaja.', icon: MapPin }, { title: 'Automotive Focused', text: 'Focused specifically on vehicle parts and automotive support.', icon: ShieldCheck }, { title: 'Direct Communication', text: 'Customers can contact the business directly through WhatsApp or phone.', icon: MessageCircle }, { title: 'Built for Real Vehicle Needs', text: 'Designed around helping customers find the right automotive products and support.', icon: CheckCircle2 }].map(({ title, text, icon: Icon }) => <article className="why-card" key={title}><div className="why-icon"><Icon size={19} /></div><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>

        <section className="social-section"><div className="container social-grid"><div className="review-panel"><div className="eyebrow orange-text">Google Reviews</div><h2>What Customers<br /><span>Are Saying</span></h2><div className="review-score">4.3 <small>/ 5</small></div><div className="stars"><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /></div><p>6 Google Reviews</p><a className="button button-outline" href={directionsUrl} target="_blank" rel="noreferrer">View Google Reviews <ArrowRight size={15} /></a></div><div className="instagram-panel"><div><div className="eyebrow orange-text">Social</div><h2>Follow <span>Genesis Autos</span></h2><p>See our latest vehicles, products and automotive updates on Instagram.</p><a className="instagram-handle" href={instagramUrl} target="_blank" rel="noreferrer"><Instagram size={17} /> @genesisautosalimosho</a><br /><a className="instagram-handle" href="https://www.tiktok.com/@genesisautosalimosho" target="_blank" rel="noreferrer">TikTok · @genesisautosalimosho</a><br /><a className="button button-orange button-small" href={instagramUrl} target="_blank" rel="noreferrer">Follow on Instagram <ArrowRight size={14} /></a></div><div className="instagram-placeholders"><ImagePlaceholder src="/IMG_4929.jpg" label="Genesis Autos social photo" /><ImagePlaceholder src="/IMG_4924.jpg" label="Genesis Autos social photo" /><ImagePlaceholder src="/COOLTIGER.jpg" label="Genesis Autos social photo" /></div></div></div></section>

        <section className="section contact-section" id="contact"><div className="container contact-grid"><div className="contact-copy"><div className="eyebrow orange-text">Contact Genesis Autos</div><h2>Looking for a<br /><span>Part or Spare?</span></h2><p>Tell us what you need and contact Genesis Autos directly.</p><div className="contact-actions"><button className="contact-action whatsapp" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to make an enquiry about your automotive products.')}><MessageCircle size={19} /><span><strong>Chat on WhatsApp</strong><small>Quickest way to reach us</small></span></button><a className="contact-action" href="tel:+2347065379450"><Phone size={19} /><span><strong>Call Genesis Autos</strong><small>+234 706 537 9450 · +234 908 356 1212</small></span></a></div></div><form className="enquiry-form" onSubmit={handleSubmit}><div className="form-row"><label>Name<input required name="name" placeholder="Your full name" /></label><label>Phone Number<input required name="phone" type="tel" placeholder="Your phone number" /></label></div><div className="form-row"><label>What do you need?<input required name="need" placeholder="e.g. battery or spare part" /></label><label>Vehicle Make / Model<input name="vehicle" placeholder="e.g. Toyota Camry" /></label></div><label>Message<textarea required name="message" rows={3} placeholder="Tell us what you need..."></textarea></label><button className="button button-orange form-button" type="submit">{formSent ? 'Enquiry Ready — Open WhatsApp' : 'Send Enquiry'} <ArrowRight size={16} /></button></form></div></section>

        <section className="location-section"><div className="container location-grid"><div><div className="eyebrow orange-text">Our Location</div><h2>Genesis <span>Autos</span></h2><p>62 Alimosho Rd.<br />Opp. Multigrace Sch. Alagutan B/Stop<br />Iyana Ipaja, Lagos, Nigeria</p><a className="button button-orange button-small" href={directionsUrl} target="_blank" rel="noreferrer"><Navigation size={15} /> Get Directions</a></div><div className="map-embed"><iframe title="Genesis Autos location map" src="https://www.google.com/maps?q=62+Alimosho+Rd.%2C+Opp.+Multigrace+Sch.+Alagutan+B%2FStop%2C+Iyana+Ipaja%2C+Lagos%2C+Nigeria&output=embed" referrerPolicy="no-referrer-when-downgrade" /><a className="map-overlay" href={directionsUrl} target="_blank" rel="noreferrer"><MapPin size={18} /> Open in Google Maps</a></div></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><a className="brand" href="#home"><img className="brand-logo" src="/Logo and icon.jpg" alt="Genesis Autos" /><span className="brand-text"><strong>GENESIS <em>AUTOS</em></strong><small>AUTOMOBILE PARTS & SERVICES</small></span></a><p>Automobile Spare Parts & Automotive Services</p><small>© 2026 Genesis Autos. All rights reserved.</small></div><div><h4>Explore</h4><a href="#home">Home</a><a href="#about">About</a><a href="#products">Products</a><a href="#services">Services</a><a href="#contact">Contact</a></div><div><h4>Contact</h4><a href="tel:+2347065379450">+234 706 537 9450</a><a href="tel:+2349083561212">+234 908 356 1212</a><span>Iyana Ipaja, Lagos</span></div><div><h4>Social</h4><a href={instagramUrl} target="_blank" rel="noreferrer"><Instagram size={15} /> @genesisautosalimosho</a><a href="https://www.tiktok.com/@genesisautosalimosho" target="_blank" rel="noreferrer">TikTok · @genesisautosalimosho</a></div></div></footer>
      <button className="floating-whatsapp" onClick={() => openWhatsApp('Hello Genesis Autos, I found your website and I would like to make an enquiry.')} aria-label="Chat on WhatsApp"><MessageCircle size={24} /></button>
      <div className="mobile-bar"><button onClick={() => openWhatsApp('Hello Genesis Autos, I would like to make an enquiry.')}><MessageCircle size={17} /> WhatsApp</button><a href="tel:+2347065379450"><Phone size={17} /> Call</a><a href={directionsUrl} target="_blank" rel="noreferrer"><Navigation size={17} /> Directions</a></div>
      </div>
    </>
  );
}

export default App;