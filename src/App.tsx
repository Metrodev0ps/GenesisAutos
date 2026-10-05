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
    description: 'Browse automotive tools and essentials from Genesis Autos in Iyana Ipaja, Lagos, including jacks, trackers, alloy wheels, car horns, safety equipment and more.',
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

function setMeta(name: string, content: string, attribute = 'name') {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function useSeo() {
  useEffect(() => {
    const rawPath = window.location.pathname.replace(/\/+$/, '') || '/';
    const route = seoRoutes[rawPath] || (rawPath.startsWith('/batteries/') ? {
      title: `${rawPath.split('/').pop()?.replace(/-/g, ' ')} Batteries | Genesis Autos Lagos`,
      description: 'Browse battery options from Genesis Autos in Iyana Ipaja, Lagos. Check available specifications and contact Genesis Autos for current price and availability.',
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
    setMeta('og:image', `${SITE_URL}/IMG_4929.jpg`, 'property');
    setMeta('og:image:alt', 'Genesis Autos automotive parts and services', 'property');
    setMeta('twitter:title', route.title);
    setMeta('twitter:description', route.description);
    setMeta('twitter:image', `${SITE_URL}/IMG_4929.jpg`);
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
  }, []);
}

function ImagePlaceholder({ src = '/IMG_4929.jpg', label = 'Image', className = '' }: { src?: string; label?: string; className?: string }) {
  return (
    <div className={`image-placeholder image-ready ${className}`}>
      <img className="real-image" src={src} alt={label} loading="lazy" />
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
  const searchItems = [
    ...batteryProducts.map((p) => ({ name: p.brand + ' ' + p.capacity + ' Battery', detail: p.voltage + ' · ' + p.capacity + (p.terminal ? ' · ' + p.terminal : ''), href: '/batteries/' + p.brand.toLowerCase().replace(/\s+/g, '-') })),
    ...accessoryProducts.map((p) => ({ name: p.name, detail: 'Car Accessory', href: '/accessories' })),
    ...toolsProducts.map((p) => ({ name: p.name, detail: 'Tools & Essentials', href: '/tools' })),
    ...engineOilGrades.flatMap((group) => Object.entries(group.brands).flatMap(([brand, sizes]) => sizes.map((item) => ({ name: `${brand} ${group.grade} ${item.size}`, detail: `Engine Oil · ${group.grade}`, href: '/oil-grease-atf' })))),
    ...Object.values(lubricantGroups).flat().filter((name) => name.toLowerCase() !== 'and so much more').map((name) => ({ name, detail: 'Oil, Grease & ATF', href: '/oil-grease-atf' })),
  ];
  const normalized = query.trim().toLowerCase();
  const results = normalized ? searchItems.filter((item, index, list) => item.name.toLowerCase().includes(normalized) && list.findIndex((candidate) => candidate.name.toLowerCase() === item.name.toLowerCase()) === index).slice(0, 8) : [];
  const askOnWhatsApp = () => openWhatsApp('Hello Genesis Autos, I am looking for ' + query.trim() + '. Please let me know if you have it available and the current price.');
  const close = () => { setOpen(false); setQuery(''); };
  return createElement('div', { className: 'product-search' }, createElement('button', { className: 'search-trigger', onClick: () => setOpen(!open), 'aria-label': 'Search products', 'aria-expanded': open }, createElement(Search, { size: 18 })), open ? createElement('div', { className: 'search-panel' }, createElement('div', { className: 'search-input-wrap' }, createElement(Search, { size: 16 }), createElement('input', { autoFocus: true, value: query, onChange: (event) => setQuery(event.target.value), placeholder: 'Search products...', 'aria-label': 'Search products' }), createElement('button', { className: 'search-close', onClick: close, 'aria-label': 'Close search' }, createElement(X, { size: 15 }))), normalized && results.length > 0 ? createElement('div', { className: 'search-results' }, results.map((item) => createElement('a', { href: item.href, key: item.name }, createElement('span', null, createElement('strong', null, item.name), createElement('small', null, item.detail)), createElement(ChevronRight, { size: 15 })))) : null, normalized && results.length === 0 ? createElement('div', { className: 'search-empty' }, createElement('strong', null, 'We do not currently have ' + query.trim() + ' listed.'), createElement('span', null, 'Ask Genesis Autos and we will check availability for you.'), createElement('button', { className: 'button button-orange', onClick: askOnWhatsApp }, createElement(MessageCircle, { size: 15 }), ' Ask on WhatsApp')) : null) : null);
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
    const total = hasPrices ? `₦${grandTotal.toLocaleString()}` : `Product price to be confirmed + ₦${deliveryFee.toLocaleString()} delivery`;
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
      <a className="brand" href="/"><img className="brand-logo" src="/Logo and icon.jpg" alt="Genesis Autos" /><span className="brand-text"><strong>GENESIS <em>AUTOS</em></strong><small>AUTOMOBILE PARTS & SERVICES</small></span></a>
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
            <img src={item.image || '/IMG_4929.jpg'} alt={item.name} />
            <div className="cart-item-info"><strong>{item.name}</strong>{item.details && <small>{item.details}</small>}<span>{typeof item.price === 'number' ? `₦${item.price.toLocaleString()}` : 'Price to be confirmed'}</span></div>
            <div className="cart-quantity"><button onClick={() => updateCartQuantity(item.id, -1)} aria-label="Decrease quantity"><Minus size={14}/></button><strong>{item.quantity}</strong><button onClick={() => updateCartQuantity(item.id, 1)} aria-label="Increase quantity"><Plus size={14}/></button></div>
            <button className="cart-remove" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={16}/></button>
          </article>)}
          {items.length > 0 && <div className="cart-totals"><div><span>Products</span><strong>{hasPrices ? `₦${pricedTotal.toLocaleString()}` : 'Price to be confirmed'}</strong></div><div><span>Delivery</span><strong>{deliveryFee ? `₦${deliveryFee.toLocaleString()}` : 'Select delivery area'}</strong></div><div className="cart-total"><span>Total</span><strong>{hasPrices && deliveryFee ? `₦${grandTotal.toLocaleString()}` : 'Price to be confirmed'}</strong></div></div>}
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
  { title: 'Oil, Grease & ATF', description: 'Engine oils, automatic transmission fluids, coolants, grease, filters, treatments and automotive fluids.', icon: Settings, label: 'Oil, Grease & ATF', image: '/ATF.jpg', lubricants: true },
];

const services = [
  { title: 'Spare Parts Sourcing', description: 'Get assistance finding the automotive parts you need.', icon: Search },
  { title: 'Vehicle Support', description: 'Automotive support for vehicle owners and businesses.', icon: Wrench },
  { title: 'Parts Enquiries', description: 'Contact Genesis Autos to ask about availability and pricing.', icon: MessageCircle },
];

const accessoryProducts = [
  { name: 'Dashboard Polish' },
  { name: 'Steering Cover', image: '/STEERING COVERS.jpg' },
  { name: 'Seat Covers' },
  { name: 'Dashboard Rug', image: '/DASHBOARD RUG.jpg' },
  { name: 'Dashboard Mat', image: '/DASHBOARD MAT.jpg' },
  { name: 'Floor Mat' },
  { name: 'Wipers' },
];

const toolsProducts = [
  { name: 'Alloy Wheel', image: '/RIMS.jpg' },
  { name: 'Trackers', image: '/GPS TRACKER.jpg' },
  { name: 'Jacks', image: '/JACKS.jpg' },
  { name: 'Hydraulic Jacks', image: '/JACK 5T &10T.jpg' },
  { name: 'Injectors', image: '/FUEL INJECTOR CLEANER.jpg' },
  { name: 'Car Horn', image: '/CAR HORNS.jpg' },
  { name: 'Engine Cover', image: '/ENGINE COVER.jpg' },
  { name: 'C-Caution', image: '/C-Caution.jpg' },
  { name: 'Fire Extinguishers', image: '/FIRE EXTINGUISHERS.jpg' },
];

function AccessoriesPage() {
  return <div className="battery-page"><header className="site-header"><div className="container nav-wrap">
    <a className="brand" href="/"><img className="brand-logo" src="/Logo and icon.jpg" alt="Genesis Autos" /><span className="brand-text"><strong>GENESIS <em>AUTOS</em></strong><small>AUTOMOBILE PARTS & SERVICES</small></span></a>
    <nav className="battery-nav"><a href="/">Home</a><ProductSearch /><CartButton /><a href="/accessories">Accessories</a><ProductSearch /><CartButton /><button className="button button-small button-orange" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to enquire about your car accessories.')}><MessageCircle size={15}/> WhatsApp Us</button></nav>
  </div></header>
  <main><section className="battery-hero"><div className="container"><div className="eyebrow orange-text"><Car size={14}/> Accessories</div><h1>Car <span>Accessories</span></h1><p>Available automotive accessories from Genesis Autos. Contact us to confirm availability and current price.</p>
    <div className="accessory-list">{accessoryProducts.map((item) => <article className="catalogue-product" key={item.name}>{item.image && <img src={item.image} alt={item.name} loading="lazy" />}<div className="catalogue-product-body"><strong>{item.name}</strong><AddToCartButton item={{ id: `accessory-${item.name}`, name: item.name, image: item.image }} /></div></article>)}</div>
  </div></section>
</main>
  <button className="floating-whatsapp" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to enquire about your car accessories.')} aria-label="Chat on WhatsApp"><MessageCircle size={24}/></button></div>;
}

function ToolsPage() {
  return <div className="battery-page"><header className="site-header"><div className="container nav-wrap">
    <a className="brand" href="/"><img className="brand-logo" src="/Logo and icon.jpg" alt="Genesis Autos" /><span className="brand-text"><strong>GENESIS <em>AUTOS</em></strong><small>AUTOMOBILE PARTS & SERVICES</small></span></a>
    <nav className="battery-nav"><a href="/">Home</a><ProductSearch /><CartButton /><a href="/tools">Tools & Essentials</a><button className="button button-small button-orange" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to enquire about tools and essentials.')}><MessageCircle size={15}/> WhatsApp Us</button></nav>
  </div></header>
  <main><section className="battery-hero"><div className="container"><div className="eyebrow orange-text"><Wrench size={14}/> Tools & Essentials</div><h1>Tools <span>& Essentials</span></h1><p>Essential automotive tools, safety items and vehicle essentials available from Genesis Autos. Contact us to confirm availability and current price.</p>
    <div className="accessory-list">{toolsProducts.map((item) => <article className="catalogue-product" key={item.name}>{item.image && <img src={item.image} alt={item.name} loading="lazy" />}<div className="catalogue-product-body"><strong>{item.name}</strong><AddToCartButton item={{ id: `tool-${item.name}`, name: item.name, image: item.image }} /></div></article>)}</div>
  </div></section>
  <section className="accessory-gallery-section"><div className="container"><div className="battery-heading"><div><div className="eyebrow orange-text">Tools & Essentials</div><h2>Available <span>Items</span></h2></div><span>Photos coming below</span></div>
    <div className="accessory-random-gallery">
      <img key="/RIMS.jpg" src="/RIMS.jpg" alt="Genesis Autos alloy wheels" loading="lazy" />
      <img key="/GPS TRACKER.jpg" src="/GPS%20TRACKER.jpg" alt="Genesis Autos GPS tracker" loading="lazy" />
      <img key="/JACKS.jpg" src="/JACKS.jpg" alt="Genesis Autos jacks" loading="lazy" />
      <img key="/JACK 5T &10T.jpg" src="/JACK%205T%20%2610T.jpg" alt="Genesis Autos hydraulic jacks" loading="lazy" />
      <img key="/CAR HORNS.jpg" src="/CAR%20HORNS.jpg" alt="Genesis Autos car horns" loading="lazy" />
      <img key="/FIRE EXTINGUISHERS.jpg" src="/FIRE%20EXTINGUISHERS.jpg" alt="Genesis Autos fire extinguishers" loading="lazy" />
      <img key="/BATTERY CHARGERS.jpg" src="/BATTERY%20CHARGERS.jpg" alt="Genesis Autos battery chargers" loading="lazy" />
    </div>
  </div></section></main>
  <button className="floating-whatsapp" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to enquire about tools and essentials.')} aria-label="Chat on WhatsApp"><MessageCircle size={24}/></button></div>;
}

const engineOilGrades = [
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
  { grade: '0W-20', brands: {} },
];

const lubricantGroups = {
  atf: ['TOYOTA ATF', 'SEAMAX', 'ABRO MASTERS', 'HARDEX ATF', 'and so much more'],
  other: ['HOLTS', 'GREASE INFINITY', 'OIL FILTER', 'INJECTOR CLEANER', 'OIL TREATMENT', 'BRAKE FLUIDS'],
};

const coolantOptions = [
  { size: '4 Litre', price: 6000 },
  { size: '1 Litre', price: 2500 },
];

function CoolantProduct() {
  const [selectedSize, setSelectedSize] = useState(coolantOptions[0].size);
  const selected = coolantOptions.find((item) => item.size === selectedSize) || coolantOptions[0];

  return <article className="catalogue-product lubricant-grade-card">
    <div className="catalogue-product-body">
      <div className="eyebrow orange-text">Coolant</div>
      <h3>COOLANG</h3>
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
      </> : <p>Brands and sizes will be added here.</p>}
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
      <div className="lubricant-group"><h2>ATF</h2><div className="accessory-list">{lubricantGroups.atf.map((item) => <span className="catalogue-chip" key={item}><span>{item}</span><AddToCartButton item={{ id: `atf-${item}`, name: item }} /></span>)}</div></div>
      <div className="lubricant-group"><h2>Other Lubricants & Fluids</h2><div className="accessory-list">
        <CoolantProduct />
        {lubricantGroups.other.map((item) => {
        const imageMap: Record<string, string> = {
          'OIL FILTER': '/OIL FILTER.jpg',
          'INJECTOR CLEANER': '/FUEL INJECTOR CLEANER.jpg',
          'OIL TREATMENT': '/OIL TREATMENT.jpg',
        };
        return <article className="catalogue-product" key={item}>{imageMap[item] && <img src={imageMap[item]} alt={item} loading="lazy" />}<div className="catalogue-product-body"><strong>{item}</strong><AddToCartButton item={{ id: `fluid-${item}`, name: item, price: item === 'INJECTOR CLEANER' ? 3500 : item === 'OIL TREATMENT' ? 3500 : undefined, image: imageMap[item] }} /></div></article>;
      })}</div></div>
    </div>
  </div></section></main>
  <button className="floating-whatsapp" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to enquire about oil, grease and ATF products.')} aria-label="Chat on WhatsApp"><MessageCircle size={24}/></button></div>;
}

type BatteryProduct = { brand: string; name: string; voltage: string; capacity: string; image: string; price?: number; terminal?: string };

const batteryProducts: BatteryProduct[] = [
  { brand: 'ZenGLOBAL', name: 'ZenGLOBAL Battery', voltage: '12V', capacity: '75Ah', image: '/ZENGLOBAL.jpg' },
  { brand: 'Runall', name: 'Runall Battery', voltage: '12V', capacity: '100Ah', image: '/RUNALL.jpg' },
  { brand: 'Runall', name: 'Runall Battery', voltage: '12V', capacity: '45Ah', image: '/RUNALL.jpg' },
  { brand: 'Runall', name: 'Runall Battery', voltage: '12V', capacity: '62Ah', image: '/RUNALL.jpg' },
  { brand: 'Runall', name: 'Runall Battery', voltage: '12V', capacity: '75Ah', image: '/RUNALL.jpg' },
  { brand: 'Runall', name: 'Runall Battery', voltage: '12V', capacity: '90Ah', image: '/RUNALL.jpg' },
  { brand: 'Runall', name: 'Runall Battery', voltage: '12V', capacity: '80Ah', image: '/RUNALL.jpg' },
  { brand: 'Startall', name: 'Startall Battery', voltage: '12V', capacity: '75Ah', image: '/STARTALL.jpg' },
{ brand: 'Solite', name: 'Solite Battery', voltage: '12V', capacity: '75Ah', image: '/SOLITE.jpg' },
  { brand: 'Sebang', name: 'Sebang Battery', voltage: '12V', capacity: '75Ah', image: '/SEBANG.jpg' },
  { brand: 'Everstart', name: 'Everstart Battery', voltage: '12V', capacity: '90Ah', terminal: 'Normal Terminal', price: 120000, image: '/EVERSTART.jpg' },
  { brand: 'Everstart', name: 'Everstart Battery', voltage: '12V', capacity: '90Ah', terminal: 'Opposite Terminal', price: 120000, image: '/EVERSTART.jpg' },
  { brand: 'Everstart', name: 'Everstart Battery', voltage: '12V', capacity: '75Ah', terminal: 'Normal Terminal', price: 100000, image: '/EVERSTART.jpg' },
  { brand: 'Everstart', name: 'Everstart Battery', voltage: '12V', capacity: '75Ah', terminal: 'Opposite Terminal', price: 100000, image: '/EVERSTART.jpg' },
  { brand: 'Everstart', name: 'Everstart Battery', voltage: '12V', capacity: '80Ah', terminal: 'Normal Terminal', price: 110000, image: '/EVERSTART.jpg' },
  { brand: 'Everstart', name: 'Everstart Battery', voltage: '12V', capacity: '80Ah', terminal: 'Opposite Terminal', price: 110000, image: '/EVERSTART.jpg' },
  { brand: 'Everstart', name: 'Everstart Battery', voltage: '12V', capacity: '100Ah', terminal: 'Normal Terminal', price: 150000, image: '/EVERSTART.jpg' },
  { brand: 'Everstart', name: 'Everstart Battery', voltage: '12V', capacity: '100Ah', terminal: 'Opposite Terminal', price: 150000, image: '/EVERSTART.jpg' },
  { brand: 'KINGLION', name: 'KINGLION Battery', voltage: '12V', capacity: '75Ah', image: '/KINGLION.jpg' },
  { brand: 'FINBROK SUPER', name: 'FINBROK SUPER Battery', voltage: '12V', capacity: '75Ah', image: '/FINBROKSUPER.jpg' },
  { brand: 'Super Diamond', name: 'Super Diamond Battery', voltage: '12V', capacity: '75Ah', image: '/DIAMOND.jpg' },
  { brand: 'Target', name: 'Target Battery', voltage: '12V', capacity: '75Ah', image: '/TARGET.jpg' },
  { brand: 'Cooltiger', name: 'Cooltiger Battery', voltage: '12V', capacity: '75Ah', image: '/COOLTIGER.jpg' },
{ brand: 'Cooltiger', name: 'Cooltiger Battery', voltage: '75V', capacity: '45Ah', image: '/COOLTIGER.jpg' },
  { brand: 'Rocket', name: 'Rocket Battery', voltage: '12V', capacity: '75Ah', image: '/ROCKET.jpg' },
  { brand: 'Atlas BX', name: 'Atlas BX Battery', voltage: '12V', capacity: '75Ah', image: '/ATLASBX.jpg' },
];

function BatteryPage() {
  const path = window.location.pathname.replace(/\/+$/, '');
  const slug = path.split('/').pop() || '';
  const brandMap: Record<string, string> = {
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
          <div className="battery-heading"><div><div className="eyebrow orange-text">{selectedBrand || 'Battery Catalogue'}</div><h2>{selectedBrand ? 'Available Options' : <>Choose a <span>Brand</span></>}</h2></div><span>{selectedBrand ? `${visibleProducts.length} product${visibleProducts.length === 1 ? '' : 's'}` : '12 brands'}</span></div>
          {selectedBrand ? selectedBrand === 'Everstart' ? <div className="battery-terminal-groups">
            {['Normal Terminal', 'Opposite Terminal'].map((terminal) => {
              const terminalProducts = visibleProducts.filter((p) => p.terminal === terminal);
              return <section className="battery-terminal-group" key={terminal}>
                <div className="battery-terminal-heading"><div><div className="eyebrow orange-text">Everstart</div><h3>{terminal}</h3></div><span>{terminalProducts.length} options</span></div>
                <div className="battery-grid">{terminalProducts.map((p) => <article className="battery-card" key={p.brand + p.capacity + p.terminal}>
                  <img src={p.image} alt={p.name + ' ' + p.capacity + ' ' + p.terminal} loading="lazy" />
                  <div className="battery-card-body"><div className="battery-brand">{p.brand}</div><h3>{p.name}</h3><div className="battery-specs"><div><small>Voltage</small><strong>{p.voltage}</strong></div><div><small>Capacity</small><strong>{p.capacity}</strong></div><div><small>Terminal</small><strong>{p.terminal.replace(' Terminal', '')}</strong></div></div>{typeof p.price === 'number' && <div className="battery-price">₦{p.price.toLocaleString()}</div>}<AddToCartButton item={{ id: p.brand + '-' + p.voltage + '-' + p.capacity + '-' + p.terminal, name: p.name, price: p.price, image: p.image, details: p.voltage + ' · ' + p.capacity + ' · ' + p.terminal }} /><button className="button button-outline battery-enquire" onClick={() => openWhatsApp('Hello Genesis Autos, I am interested in the ' + p.name + ' (' + p.voltage + ', ' + p.capacity + ', ' + p.terminal + '). Please confirm availability and current price.')}><MessageCircle size={15} /> Enquire on WhatsApp</button></div>
                </article>)}</div>
              </section>;
            })}
          </div> : <div className="battery-grid">{visibleProducts.map((p) => <article className="battery-card" key={p.brand + p.capacity}>
            <img src={p.image} alt={p.name} loading="lazy" />
            <div className="battery-card-body"><div className="battery-brand">{p.brand}</div><h3>{p.name}</h3><div className="battery-specs"><div><small>Voltage</small><strong>{p.voltage}</strong></div><div><small>Capacity</small><strong>{p.capacity}</strong></div>{p.terminal && <div><small>Terminal</small><strong>{p.terminal.replace(' Terminal', '')}</strong></div>}</div>{typeof p.price === 'number' && <div className="battery-price">₦{p.price.toLocaleString()}</div>}<AddToCartButton item={{ id: p.brand + '-' + p.voltage + '-' + p.capacity + '-' + (p.terminal || 'standard'), name: p.name, price: p.price, image: p.image, details: p.voltage + ' · ' + p.capacity + (p.terminal ? ' · ' + p.terminal : '') }} /><button className="button button-outline battery-enquire" onClick={() => openWhatsApp('Hello Genesis Autos, I am interested in the ' + p.name + ' (' + p.voltage + ', ' + p.capacity + (p.terminal ? ', ' + p.terminal : '') + '). Please confirm availability and current price.')}><MessageCircle size={15} /> Enquire on WhatsApp</button></div>
          </article>)}</div> : <div className="battery-brand-directory">{Object.entries(brandMap).map(([key, name]) => <a className="battery-brand-tile" href={`/batteries/${key}`} key={key}><Battery size={22} /><strong>{name}</strong><span>View batteries <ChevronRight size={14} /></span></a>)}</div>}
        </div></section>
      </main>
      <button className="floating-whatsapp" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to enquire about your batteries.')} aria-label="Chat on WhatsApp"><MessageCircle size={24} /></button>
    </div>
  );
}

function App() {
  useSeo();
  const [menuOpen, setMenuOpen] = useState(false);
  if (window.location.pathname === '/cart') return <CartPage />;
  if (window.location.pathname === '/batteries' || window.location.pathname.startsWith('/batteries/')) return <BatteryPage />;
  if (window.location.pathname === '/accessories') return <AccessoriesPage />;
  if (window.location.pathname === '/tools') return <ToolsPage />;
if (window.location.pathname === '/oil-grease-atf') return <LubricantsPage />;
  const [showIntro, setShowIntro] = useState(() => {
    const internalNavigation = sessionStorage.getItem('genesis-internal-navigation') === 'true';
    if (internalNavigation) sessionStorage.removeItem('genesis-internal-navigation');
    return !internalNavigation;
  });

  useEffect(() => {
    const markInternalNavigation = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link || event.defaultPrevented || event.button !== 0) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      sessionStorage.setItem('genesis-internal-navigation', 'true');
    };

    document.addEventListener('click', markInternalNavigation, true);
    return () => document.removeEventListener('click', markInternalNavigation, true);
  }, []);

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
/>
        </div></section>

        <section className="quick-strip"><div className="container quick-grid">{[
          { icon: Settings, title: 'Spare Parts', text: 'Quality automotive parts for different vehicle needs.' }, { icon: Wrench, title: 'Auto Support', text: 'Automotive support for vehicle owners and businesses.' }, { icon: MessageCircle, title: 'Easy Enquiries', text: 'Contact Genesis Autos directly through WhatsApp or phone.' },
        ].map(({ icon: Icon, title, text }) => <div className="quick-card" key={title}><Icon size={24} /><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>

        <section className="section about-section" id="about"><div className="container about-grid"><div className="about-copy"><div className="eyebrow orange-text">About Genesis Autos</div><h2>Built Around Your<br /><span>Vehicle Needs</span></h2><p>Genesis Autos provides automotive products and support for vehicle owners, drivers, workshops and businesses in Lagos.</p><p>From spare parts and automotive products to support, our goal is to make it easier for customers to find the products and assistance they need for their vehicles.</p><div className="location-card"><div className="location-icon"><MapPin size={19} /></div><div><strong>Visit Genesis Autos</strong><p>62 Alimosho Rd.<br />Opp. Multigrace Sch. Alagutan B/Stop<br />Iyana Ipaja, Lagos</p></div><a className="button button-orange button-small" href={directionsUrl} target="_blank" rel="noreferrer">Get Directions</a></div></div><img className="about-image real-image" src="/IMG_4926.jpg" alt="Genesis Autos automotive parts and services" /></div></section>

        <section className="section dark-section products-section" id="products"><div className="container"><div className="section-heading light-heading"><div><div className="eyebrow orange-text">Our Products</div><h2>Automotive <span>Products</span></h2></div><a href="#contact">View All Products <ArrowRight size={15} /></a></div><div className="products-grid">{products.map(({ title, description, icon: Icon, label, image, battery, accessories, tools, lubricants }) => {
  const href = battery ? '/batteries' : accessories ? '/accessories' : tools ? '/tools' : lubricants ? '/oil-grease-atf' : '#contact';
  return <a className="product-card product-card-link" key={title} href={href} aria-label={`View ${title}`}>
    <ImagePlaceholder src={image} label={label} />
    <div className="product-info">
      <div className="product-title"><Icon size={19} /><h3>{title}</h3></div>
      <p>{description}</p>
      {href !== '#contact' && <span className="text-button">View ${title} <ChevronRight size={14} /></span>}
    </div>
  </a>;
})}</div></div></section>

        <section className="section dark-section services-section" id="services"><div className="container"><div className="section-heading light-heading"><div><div className="eyebrow orange-text">Services</div><h2>Automotive Support <span>When You Need It</span></h2></div></div><div className="services-grid">{services.map(({ title, description, icon: Icon }) => <article className="service-card" key={title}><Icon size={25} /><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>

        <section className="section why-section" id="why-genesis"><div className="container"><div className="eyebrow orange-text">Why Genesis Autos</div><h2>Why Customers Choose <span>Genesis Autos</span></h2><div className="why-grid">{[{ title: 'Local & Accessible', text: 'Conveniently located on Alimosho Road in Iyana Ipaja.', icon: MapPin }, { title: 'Automotive Focused', text: 'Focused specifically on vehicle parts and automotive support.', icon: ShieldCheck }, { title: 'Direct Communication', text: 'Customers can contact the business directly through WhatsApp or phone.', icon: MessageCircle }, { title: 'Built for Real Vehicle Needs', text: 'Designed around helping customers find the right automotive products and support.', icon: CheckCircle2 }].map(({ title, text, icon: Icon }) => <article className="why-card" key={title}><div className="why-icon"><Icon size={19} /></div><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>

        <section className="social-section"><div className="container social-grid"><div className="review-panel"><div className="eyebrow orange-text">Google Reviews</div><h2>What Customers<br /><span>Are Saying</span></h2><div className="review-score">4.3 <small>/ 5</small></div><div className="stars"><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /></div><p>6 Google Reviews</p><a className="button button-outline" href={directionsUrl} target="_blank" rel="noreferrer">View Google Reviews <ArrowRight size={15} /></a></div><div className="instagram-panel"><div><div className="eyebrow orange-text">Social</div><h2>Follow <span>Genesis Autos</span></h2><p>See our latest vehicles, products and automotive updates on Instagram.</p><a className="instagram-handle" href={instagramUrl} target="_blank" rel="noreferrer"><Instagram size={17} /> @genesisautosalimosho</a><br /><a className="instagram-handle" href="https://www.tiktok.com/@genesisautosalimosho" target="_blank" rel="noreferrer">TikTok · @genesisautosalimosho</a><br /><a className="button button-orange button-small" href={instagramUrl} target="_blank" rel="noreferrer">Follow on Instagram <ArrowRight size={14} /></a></div><div className="instagram-placeholders"><ImagePlaceholder src="/IMG_4929.jpg" label="Genesis Autos social photo" /><ImagePlaceholder src="/IMG_4924.jpg" label="Genesis Autos social photo" /><ImagePlaceholder src="/COOLTIGER.jpg" label="Genesis Autos social photo" /></div></div></div></section>

        <section className="section contact-section" id="contact"><div className="container contact-grid"><div className="contact-copy"><div className="eyebrow orange-text">Contact Genesis Autos</div><h2>Looking for a<br /><span>Part or Spare?</span></h2><p>Tell us what you need and contact Genesis Autos directly.</p><div className="contact-actions"><button className="contact-action whatsapp" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to make an enquiry about your automotive products.')}><MessageCircle size={19} /><span><strong>Chat on WhatsApp</strong><small>Quickest way to reach us</small></span></button><a className="contact-action" href="tel:+2347065379450"><Phone size={19} /><span><strong>Call Genesis Autos</strong><small>+234 706 537 9450 · +234 908 356 1212</small></span></a></div></div><form className="enquiry-form" onSubmit={handleSubmit}><div className="form-row"><label>Name<input required name="name" placeholder="Your full name" /></label><label>Phone Number<input required name="phone" type="tel" placeholder="Your phone number" /></label></div><div className="form-row"><label>What do you need?<input required name="need" placeholder="e.g. battery or spare part" /></label><label>Vehicle Make / Model<input name="vehicle" placeholder="e.g. Toyota Camry" /></label></div><label>Message<textarea required name="message" rows={3} placeholder="Tell us what you need..."></textarea></label><button className="button button-orange form-button" type="submit">{formSent ? 'Enquiry Ready — Open WhatsApp' : 'Send Enquiry'} <ArrowRight size={16} /></button></form></div></section>

        <section className="location-section"><div className="container location-grid"><div><div className="eyebrow orange-text">Our Location</div><h2>Genesis <span>Autos</span></h2><p>62 Alimosho Rd.<br />Opp. Multigrace Sch. Alagutan B/Stop<br />Iyana Ipaja, Lagos, Nigeria</p><a className="button button-orange button-small" href={directionsUrl} target="_blank" rel="noreferrer"><Navigation size={15} /> Get Directions</a></div><div className="map-embed"><iframe title="Genesis Autos location map" src="https://www.google.com/maps?q=62+Alimosho+Rd.%2C+Opp.+Multigrace+Sch.+Alagutan+B%2FStop%2C+Iyana+Ipaja%2C+Lagos%2C+Nigeria&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><a className="map-overlay" href={directionsUrl} target="_blank" rel="noreferrer"><MapPin size={18} /> Open in Google Maps</a></div></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><a className="brand" href="#home"><img className="brand-logo" src="/Logo and icon.jpg" alt="Genesis Autos" /><span className="brand-text"><strong>GENESIS <em>AUTOS</em></strong><small>AUTOMOBILE PARTS & SERVICES</small></span></a><p>Automobile Spare Parts & Automotive Services</p><small>© 2026 Genesis Autos. All rights reserved.</small></div><div><h4>Explore</h4><a href="#home">Home</a><a href="#about">About</a><a href="#products">Products</a><a href="#services">Services</a><a href="#contact">Contact</a></div><div><h4>Contact</h4><a href="tel:+2347065379450">+234 706 537 9450</a><a href="tel:+2349083561212">+234 908 356 1212</a><span>Iyana Ipaja, Lagos</span></div><div><h4>Social</h4><a href={instagramUrl} target="_blank" rel="noreferrer"><Instagram size={15} /> @genesisautosalimosho</a><a href="https://www.tiktok.com/@genesisautosalimosho" target="_blank" rel="noreferrer">TikTok · @genesisautosalimosho</a></div></div></footer>
      <button className="floating-whatsapp" onClick={() => openWhatsApp('Hello Genesis Autos, I found your website and I would like to make an enquiry.')} aria-label="Chat on WhatsApp"><MessageCircle size={24} /></button>
      <div className="mobile-bar"><button onClick={() => openWhatsApp('Hello Genesis Autos, I would like to make an enquiry.')}><MessageCircle size={17} /> WhatsApp</button><a href="tel:+2347065379450"><Phone size={17} /> Call</a><a href={directionsUrl} target="_blank" rel="noreferrer"><Navigation size={17} /> Directions</a></div>
      </div>
    </>
  );
}

export default App;
