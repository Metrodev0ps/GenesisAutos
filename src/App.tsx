import { useState, type FormEvent } from 'react';
import {
  ArrowRight, Car, CheckCircle2, ChevronRight, CircleHelp, Instagram,
  MapPin, Menu, MessageCircle, Navigation, Phone, Search, Settings,
  ShieldCheck, Star, Truck, Wrench, X,
} from 'lucide-react';

const whatsappNumber = '2349129006547';
const directionsUrl = 'https://www.google.com/maps/search/?api=1&query=Genesis+Autos%2C+64%2F65+Alimosho+Road%2C+Iyana+Ipaja%2C+Lagos';
const instagramUrl = 'https://www.instagram.com/genesisautosalimosho/';

const openWhatsApp = (message: string) => {
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
};

function ImagePlaceholder({ label = 'Add business photo', className = '' }: { label?: string; className?: string }) {
  return (
    <div className={`image-placeholder ${className}`} role="img" aria-label={label}>
      <div className="placeholder-mark"><Search size={22} strokeWidth={1.6} /></div>
      <span>Image Placeholder</span><small>{label}</small>
    </div>
  );
}

const products = [
  { title: 'Car Spare Parts', description: 'Parts for everyday vehicle needs.', icon: Settings, label: 'Add car parts photo' },
  { title: 'SUV Parts & Accessories', description: 'Automotive essentials for SUV applications.', icon: Car, label: 'Add SUV parts photo' },
  { title: 'Car Tyres', description: 'Tyre enquiries for passenger vehicles.', icon: CircleHelp, label: 'Add car tyres photo' },
  { title: 'SUV Tyres', description: 'Tyre options for SUV applications.', icon: Car, label: 'Add SUV tyres photo' },
  { title: 'Truck Tyres', description: 'Tyre enquiries for heavier vehicles.', icon: Truck, label: 'Add truck tyres photo' },
  { title: 'Other Automotive Components', description: 'Ask about the component you need.', icon: Wrench, label: 'Add components photo' },
];

const services = [
  { title: 'Spare Parts Sourcing', description: 'Get assistance finding the automotive parts you need.', icon: Search },
  { title: 'Tyre Support', description: 'Enquire about tyre options for cars, SUVs and trucks.', icon: CircleHelp },
  { title: 'Vehicle Support', description: 'Automotive support for vehicle owners and businesses.', icon: Wrench },
  { title: 'Parts Enquiries', description: 'Contact Genesis Autos to ask about availability and pricing.', icon: MessageCircle },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = `Hello Genesis Autos, I would like to make an enquiry.\n\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nWhat I need: ${data.get('need')}\nVehicle: ${data.get('vehicle')}\nMessage: ${data.get('message')}`;
    setFormSent(true); openWhatsApp(message);
  };

  return (
    <div className="site-shell">
      <header className="site-header"><div className="container nav-wrap">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Genesis Autos home"><span>GENESIS <em>AUTOS</em></span><small>AUTOMOBILE PARTS & SERVICES</small></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          <a href="#home" onClick={closeMenu}>Home</a><a href="#about" onClick={closeMenu}>About</a><a href="#products" onClick={closeMenu}>Products</a><a href="#services" onClick={closeMenu}>Services</a><a href="#why-genesis" onClick={closeMenu}>Why Genesis</a><a href="#contact" onClick={closeMenu}>Contact</a>
          <button className="button button-small button-orange nav-cta" onClick={() => openWhatsApp('Hello Genesis Autos, I found your website and I would like to make an enquiry.')}><MessageCircle size={15} /> WhatsApp Us</button>
        </nav>
      </div></header>

      <main>
        <section className="hero" id="home"><div className="hero-accent" /><div className="container hero-grid">
          <div className="hero-copy"><div className="eyebrow"><MapPin size={13} /> Iyana Ipaja, Lagos</div><h1>Quality Auto Parts.<br /><span>Reliable Automotive</span><br />Support.</h1><p>Your trusted destination for automobile spare parts, tyres and automotive support in Iyana Ipaja, Lagos.</p><div className="hero-actions"><button className="button button-orange" onClick={() => openWhatsApp('Hello Genesis Autos, I found your website and I would like to make an enquiry.')}><MessageCircle size={17} /> WhatsApp Genesis Autos</button><a className="button button-outline" href="#products">Explore Products <ArrowRight size={16} /></a></div><div className="rating-line"><Star size={16} fill="currentColor" /><strong>4.3</strong> Google Rating <span>·</span> Local Automotive Business</div></div>
          <ImagePlaceholder label="Add your hero automotive photo here" className="hero-image" />
        </div></section>

        <section className="quick-strip"><div className="container quick-grid">{[
          { icon: Settings, title: 'Spare Parts', text: 'Quality automotive parts for different vehicle needs.' }, { icon: CircleHelp, title: 'Tyres', text: 'Tyres for cars, SUVs and trucks.' }, { icon: Wrench, title: 'Auto Support', text: 'Automotive support for vehicle owners and businesses.' }, { icon: MessageCircle, title: 'Easy Enquiries', text: 'Contact Genesis Autos directly through WhatsApp or phone.' },
        ].map(({ icon: Icon, title, text }) => <div className="quick-card" key={title}><Icon size={24} /><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>

        <section className="section about-section" id="about"><div className="container about-grid"><div className="about-copy"><div className="eyebrow orange-text">About Genesis Autos</div><h2>Built Around Your<br /><span>Vehicle Needs</span></h2><p>Genesis Autos provides automotive products and support for vehicle owners, drivers, workshops and businesses in Lagos.</p><p>From spare parts and tyres to automotive support, our goal is to make it easier for customers to find the products and assistance they need for their vehicles.</p><div className="location-card"><div className="location-icon"><MapPin size={19} /></div><div><strong>Visit Genesis Autos</strong><p>64/65 Alimosho Road<br />Opposite Multigrace School<br />Iyana Ipaja, Lagos</p></div><a className="button button-orange button-small" href={directionsUrl} target="_blank" rel="noreferrer">Get Directions</a></div></div><ImagePlaceholder label="Add your business photo here" className="about-image" /></div></section>

        <section className="section dark-section products-section" id="products"><div className="container"><div className="section-heading light-heading"><div><div className="eyebrow orange-text">Our Products</div><h2>Automotive <span>Products</span></h2></div><a href="#contact">View All Products <ArrowRight size={15} /></a></div><div className="products-grid">{products.map(({ title, description, icon: Icon, label }) => <article className="product-card" key={title}><ImagePlaceholder label={label} /><div className="product-info"><div className="product-title"><Icon size={19} /><h3>{title}</h3></div><p>{description}</p><button className="text-button" onClick={() => openWhatsApp(`Hello Genesis Autos, I would like to enquire about ${title}. Please let me know availability and price.`)}>Ask About Availability <ChevronRight size={14} /></button></div></article>)}</div></div></section>

        <section className="section tyres-section"><div className="container tyres-grid"><div className="tyres-copy"><div className="eyebrow orange-text">Tyres</div><h2>Tyres for Cars,<br /><span>SUVs & Trucks</span></h2><p>Reliable tyre enquiries for everyday vehicles, SUVs and commercial applications.</p><button className="button button-orange" onClick={() => openWhatsApp('Hello Genesis Autos, I need tyres. Please help me check availability and price.')}><MessageCircle size={17} /> Ask About Tyres</button><small>Hello Genesis Autos, I need tyres. Please help me check availability and price.</small></div><div className="tyre-cards">{[{ title: 'Cars', text: 'Tyres for everyday passenger vehicles.', label: 'Add car tyres photo', icon: Car }, { title: 'SUVs', text: 'Tyres suitable for SUV applications.', label: 'Add SUV tyres photo', icon: Car }, { title: 'Trucks', text: 'Tyres for commercial and heavier vehicles.', label: 'Add truck tyres photo', icon: Truck }].map(({ title, text, label, icon: Icon }) => <div className="tyre-card" key={title}><ImagePlaceholder label={label} /><div><Icon size={19} /><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>

        <section className="section dark-section services-section" id="services"><div className="container"><div className="section-heading light-heading"><div><div className="eyebrow orange-text">Services</div><h2>Automotive Support <span>When You Need It</span></h2></div></div><div className="services-grid">{services.map(({ title, description, icon: Icon }) => <article className="service-card" key={title}><Icon size={25} /><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>

        <section className="section why-section" id="why-genesis"><div className="container"><div className="eyebrow orange-text">Why Genesis Autos</div><h2>Why Customers Choose <span>Genesis Autos</span></h2><div className="why-grid">{[{ title: 'Local & Accessible', text: 'Conveniently located on Alimosho Road in Iyana Ipaja.', icon: MapPin }, { title: 'Automotive Focused', text: 'Focused specifically on vehicle parts, tyres and automotive support.', icon: ShieldCheck }, { title: 'Direct Communication', text: 'Customers can contact the business directly through WhatsApp or phone.', icon: MessageCircle }, { title: 'Built for Real Vehicle Needs', text: 'Designed around helping customers find the right automotive products and support.', icon: CheckCircle2 }].map(({ title, text, icon: Icon }) => <article className="why-card" key={title}><div className="why-icon"><Icon size={19} /></div><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>

        <section className="social-section"><div className="container social-grid"><div className="review-panel"><div className="eyebrow orange-text">Google Reviews</div><h2>What Customers<br /><span>Are Saying</span></h2><div className="review-score">4.3 <small>/ 5</small></div><div className="stars"><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /></div><p>6 Google Reviews</p><a className="button button-outline" href={directionsUrl} target="_blank" rel="noreferrer">View Google Reviews <ArrowRight size={15} /></a></div><div className="instagram-panel"><div><div className="eyebrow orange-text">Social</div><h2>Follow <span>Genesis Autos</span></h2><p>See our latest vehicles, tyres, products and automotive updates on Instagram.</p><a className="instagram-handle" href={instagramUrl} target="_blank" rel="noreferrer"><Instagram size={17} /> @genesisautosalimosho</a><br /><a className="button button-orange button-small" href={instagramUrl} target="_blank" rel="noreferrer">Follow on Instagram <ArrowRight size={14} /></a></div><div className="instagram-placeholders"><ImagePlaceholder label="Add social photo" /><ImagePlaceholder label="Add social photo" /><ImagePlaceholder label="Add social photo" /></div></div></div></section>

        <section className="section contact-section" id="contact"><div className="container contact-grid"><div className="contact-copy"><div className="eyebrow orange-text">Contact Genesis Autos</div><h2>Looking for a<br /><span>Part or Tyre?</span></h2><p>Tell us what you need and contact Genesis Autos directly.</p><div className="contact-actions"><button className="contact-action whatsapp" onClick={() => openWhatsApp('Hello Genesis Autos, I would like to make an enquiry about your automotive products.')}><MessageCircle size={19} /><span><strong>Chat on WhatsApp</strong><small>Quickest way to reach us</small></span></button><a className="contact-action" href="tel:09129006547"><Phone size={19} /><span><strong>Call Genesis Autos</strong><small>09129006547 · 08066404053</small></span></a></div></div><form className="enquiry-form" onSubmit={handleSubmit}><div className="form-row"><label>Name<input required name="name" placeholder="Your full name" /></label><label>Phone Number<input required name="phone" type="tel" placeholder="Your phone number" /></label></div><div className="form-row"><label>What do you need?<input required name="need" placeholder="e.g. car tyre or spare part" /></label><label>Vehicle Make / Model<input name="vehicle" placeholder="e.g. Toyota Camry" /></label></div><label>Message<textarea required name="message" rows={3} placeholder="Tell us what you need..."></textarea></label><button className="button button-orange form-button" type="submit">{formSent ? 'Enquiry Ready — Open WhatsApp' : 'Send Enquiry'} <ArrowRight size={16} /></button></form></div></section>

        <section className="location-section"><div className="container location-grid"><div><div className="eyebrow orange-text">Our Location</div><h2>Genesis <span>Autos</span></h2><p>64/65 Alimosho Road<br />Opposite Multigrace School<br />Iyana Ipaja, Lagos, Nigeria</p><a className="button button-orange button-small" href={directionsUrl} target="_blank" rel="noreferrer"><Navigation size={15} /> Get Directions</a></div><div className="map-embed"><iframe title="Genesis Autos location map" src="https://www.google.com/maps?q=64%2F65+Alimosho+Road%2C+Iyana+Ipaja%2C+Lagos%2C+Nigeria&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><a className="map-overlay" href={directionsUrl} target="_blank" rel="noreferrer"><MapPin size={18} /> Open in Google Maps</a></div></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><a className="brand" href="#home"><span>GENESIS <em>AUTOS</em></span><small>AUTOMOBILE PARTS & SERVICES</small></a><p>Automobile Spare Parts & Automotive Services</p><small>© 2026 Genesis Autos. All rights reserved.</small></div><div><h4>Explore</h4><a href="#home">Home</a><a href="#about">About</a><a href="#products">Products</a><a href="#services">Services</a><a href="#contact">Contact</a></div><div><h4>Contact</h4><a href="tel:09129006547">09129006547</a><a href="tel:08066404053">08066404053</a><span>Iyana Ipaja, Lagos</span></div><div><h4>Social</h4><a href={instagramUrl} target="_blank" rel="noreferrer"><Instagram size={15} /> @genesisautosalimosho</a></div></div></footer>
      <button className="floating-whatsapp" onClick={() => openWhatsApp('Hello Genesis Autos, I found your website and I would like to make an enquiry.')} aria-label="Chat on WhatsApp"><MessageCircle size={24} /></button>
      <div className="mobile-bar"><button onClick={() => openWhatsApp('Hello Genesis Autos, I would like to make an enquiry.')}><MessageCircle size={17} /> WhatsApp</button><a href="tel:09129006547"><Phone size={17} /> Call</a><a href={directionsUrl} target="_blank" rel="noreferrer"><Navigation size={17} /> Directions</a></div>
    </div>
  );
}

export default App;
