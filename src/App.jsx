import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LoginModal from './LoginModal';
import AdminPanel from './AdminPanel';
import TestimonialForm from './TestimonialForm';
import './index.css';

const textContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const textItem = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

function App() {
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 1000], ['0%', '40%']);
  const heroTextY = useTransform(scrollY, [0, 1000], ['0%', '80%']);

  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 11, minutes: 9, seconds: 36 });
  
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(targetDate.getHours() + 11);
    targetDate.setMinutes(targetDate.getMinutes() + 9);
    targetDate.setSeconds(targetDate.getSeconds() + 36);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) return;
      
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [activeProducts, setActiveProducts] = useState(new Set());
  const toggleHeart = (id) => {
    setActiveProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const [activeFilter, setActiveFilter] = useState('filter-featured');
  const [activeCollFilter, setActiveCollFilter] = useState('filter-outdoor');

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 20); // Faster, smooth increment
    return () => clearInterval(interval);
  }, []);

  // Admin state
  const [isLoggedIn, setIsLoggedIn] = useState(() => JSON.parse(localStorage.getItem('admin_logged_in') || 'false'));
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [customPlants, setCustomPlants] = useState(() => JSON.parse(localStorage.getItem('admin_plants') || '[]'));
  const [testimonialEnabled, setTestimonialEnabled] = useState(() => JSON.parse(localStorage.getItem('testimonial_enabled') || 'false'));
  const [customTestimonials, setCustomTestimonials] = useState(() => JSON.parse(localStorage.getItem('custom_testimonials') || '[]'));
  const [clientWorks, setClientWorks] = useState(() => JSON.parse(localStorage.getItem('client_works') || '[]'));
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('admin_logged_in', 'true');
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('admin_logged_in', 'false');
  };
  const handleTestimonialSubmit = (testimonial) => {
    const updated = [...customTestimonials, testimonial];
    setCustomTestimonials(updated);
    localStorage.setItem('custom_testimonials', JSON.stringify(updated));
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const sections = [
    { id: 'collection', label: 'Plant Collection', keywords: 'plants outdoor indoor desk potted pet friendly orchids succulents' },
    { id: 'works', label: 'Recent Exports & Works', keywords: 'exports portfolio work done projects clients' },
    { id: 'testimonials', label: 'Testimonials', keywords: 'testimonial review customer community' },
    { id: 'subscribe', label: 'Subscribe', keywords: 'subscribe email newsletter' },
    { id: 'contact', label: 'Contact Us', keywords: 'contact form message phone email address' },
  ];

  const plantCategories = [
    { id: 'fruit', name: 'Fruit Plants', keywords: 'mango guava citrus orchard sapling' },
    { id: 'avenues', name: 'Avenues', keywords: 'shade trees walkways garden paths tall neem' },
    { id: 'flowers', name: 'Flowers', keywords: 'roses jasmine marigold blooming colorful' },
    { id: 'exotic', name: 'Exotic Fruit Plants', keywords: 'dragon fruit passion avocado tropical rare' },
    { id: 'palms', name: 'Palm Varieties', keywords: 'resort tropical palm trees tall' },
    { id: 'spices', name: 'Spices', keywords: 'cinnamon cardamom pepper aromatic' },
    { id: 'indoor', name: 'Indoor Plants', keywords: 'air purifying low maintenance desk houseplant' },
    { id: 'shrubs', name: 'Shrubs & Bush', keywords: 'compact ornamental borders hedges landscape' },
    { id: 'bonsai', name: 'Bonsai', keywords: 'miniature sculpted art ancient' },
    { id: 'climbers', name: 'Climbers & Creepers', keywords: 'vines vertical green wall creeper' },
    { id: 'cactus', name: 'Cactus & Succulents', keywords: 'hardy low water sunny desert' },
    { id: 'lawn', name: 'Lawn Grass', keywords: 'carpet green grass garden ground' },
    { id: 'bamboo', name: 'Bamboo', keywords: 'fast privacy fencing wood eco' },
    { id: 'medicinal', name: 'Medicinal & Herbal Plants', keywords: 'tulsi aloe ashwagandha pharmacy ayurvedic' },
  ];

  const searchResultsData = [
    ...sections.map(s => ({ ...s, type: 'section' })),
    ...plantCategories.map(c => ({ id: 'collection', label: c.name, subLabel: 'Category', type: 'category', keywords: c.keywords })),
    ...customPlants.map(p => ({ id: 'collection', label: p.name, subLabel: `Custom Plant - ${p.collection}`, type: 'plant', keywords: `${p.desc} ${p.family} ${p.specs}` })),
    ...clientWorks.map(w => ({ id: 'works', label: w.title, subLabel: `Project - ${w.tag || 'Work Done'}`, type: 'work', keywords: `${w.desc} ${w.tag}` }))
  ];

  const filteredResults = searchResultsData.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.keywords.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Ethereal Blossom Preloader */}
      <div className={`preloader ${!loading ? 'fade-out' : ''}`}>
        <div className="ethereal-glow"></div>
        
        <div className="loader-lux-content">
          <div className="loader-seed-wrap">
            <div className="loader-aura-ring"></div>
            <div className="loader-aura-ring" style={{ animationDelay: '1s' }}></div>
            <svg className="loader-seed-svg" viewBox="0 0 100 100">
              <path d="M50 20 C30 20 15 40 15 60 C15 85 50 95 50 95 C50 95 85 85 85 60 C85 40 70 20 50 20 Z" />
            </svg>
          </div>

          <h2 className="loader-lux-title">Sri Satya Ramayya Nursery</h2>
          <div className="loader-lux-count">{progress}%</div>
        </div>
      </div>
      

{/* ===== HERO SECTION ===== */}
<div className="page-wrap">
  <section className="hero">
    <motion.div className="hero-bg" style={{ y: heroBgY }}></motion.div>
    <nav className="navbar">
      <span className="nav-logo">Sri Satya Ramayya Nursery</span>
      <ul className="nav-links">
        <li><a href="#" className="active" id="nav-home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a></li>
        <li><a href="#contact" id="nav-contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
      </ul>
      <div className="nav-right">
        <button className="nav-icon-btn" id="btn-search" aria-label="Search" onClick={() => setSearchOpen(true)}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
        <button className="nav-btn" id="btn-shop">Shop</button>
        {isLoggedIn ? (
          <button className="nav-btn nav-btn-admin" id="btn-admin" onClick={() => setShowAdmin(true)}>Dashboard</button>
        ) : (
          <button className="nav-btn" id="btn-login" onClick={() => setShowLogin(true)}>Login</button>
        )}
      </div>
    </nav>

    {/* Search Overlay */}
    {searchOpen && (
      <motion.div 
        className="search-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => setSearchOpen(false)}
      >
        <motion.div 
          className="search-modal"
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="search-header">
            <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              className="search-input" 
              type="text" 
              placeholder="Search plants, blog, offers..." 
              autoFocus 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-close" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>✕</button>
          </div>
          <div className="search-results">
            {searchQuery.length === 0 ? (
              <div className="search-hint">Start typing to search across sections, categories, and plants...</div>
            ) : filteredResults.length > 0 ? (
              filteredResults.map((item, idx) => (
                <button 
                  key={`${item.id}-${idx}`} 
                  className="search-result-item" 
                  onClick={() => { 
                    scrollToSection(item.id); 
                    if (item.type === 'category') setActiveCollFilter('show-all');
                    setSearchOpen(false); 
                    setSearchQuery(''); 
                  }}
                >
                  <div className="search-result-content">
                    <span className="search-result-label">{item.label}</span>
                    {item.subLabel && <span className="search-result-sub">{item.subLabel}</span>}
                  </div>
                  <span className="search-result-arrow">→</span>
                </button>
              ))
            ) : (
              <div className="search-hint">No results found for "{searchQuery}"</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}

    <div className="hero-content">
      <motion.div 
        className="hero-text-center"
        initial="hidden" animate="visible"
        variants={textContainer}
        style={{ y: heroTextY }}
      >
        <motion.p className="hero-subtitle" variants={textItem}>With Sri Satya Ramayya Nursery</motion.p>
        <motion.h1 className="hero-title" variants={textItem}>Grow Happiness at Home</motion.h1>
        <motion.p className="hero-desc" variants={textItem}>From your desk to your balcony — Sri Satya Ramayya Nursery helps you create a calm corner of nature. Explore plants that purify air and refresh your everyday moments.</motion.p>
      </motion.div>
      <div className="hero-bottom">
        <div className="hero-stat-card">
          <div className="hero-stat-number">150+ Plants</div>
          <div className="hero-stat-desc">Discover the finest collection of plants to transform your home into a living garden.</div>
        </div>
        <div className="hero-shop-wrap">
          <button className="hero-scroll-btn" id="btn-scroll-down" aria-label="Scroll down" onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          </button>
          <button className="hero-shop-btn" id="btn-shop-tropical">Shop Tropical Plants</button>
        </div>
      </div>
    </div>
  </section>
</div>

{/* ===== PLANT COLLECTION ===== */}
<div className="section-wrapper">
  <motion.section 
    className="collection-section" id="collection"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8 }}
  >
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={textContainer}>
      <motion.p className="section-label" variants={textItem}>Discover</motion.p>
      <motion.h2 className="section-title" variants={textItem}>Our Plant Collection</motion.h2>
    </motion.div>

    {(() => {
      const allCategories = [
        { id: 'fruit', name: 'Fruit Plants', img: 'fruit_plants.png', desc: 'Grow your own orchard with our premium fruit saplings — mango, guava, citrus & more.', family: 'Rosaceae', size: 'large' },
        { id: 'avenues', name: 'Avenues', img: 'avenue_trees.png', desc: 'Grand, shade-giving trees perfect for lining walkways and garden paths.', family: 'Fabaceae', size: 'small' },
        { id: 'flowers', name: 'Flowers', img: 'orchids.png', desc: 'Brighten your garden with vibrant roses, jasmine, marigolds and more.', family: 'Asteraceae', size: 'small' },
        { id: 'exotic', name: 'Exotic Fruit Plants', img: 'pet_friendly_plants.png', desc: 'Rare tropical fruiting varieties — dragon fruit, passion fruit, avocado & more.', family: 'Cactaceae', size: 'large' },
        { id: 'palms', name: 'Palm Varieties', img: 'hero_fern.png', desc: 'Elegant palm trees to give your garden a tropical, resort-like feel.', family: 'Arecaceae', size: 'small' },
        { id: 'spices', name: 'Spices', img: 'bonsai_plant.png', desc: 'Grow cinnamon, cardamom, pepper and more aromatic spice plants at home.', family: 'Zingiberaceae', size: 'small' },
        { id: 'indoor', name: 'Indoor Plants', img: 'pothos_plant.png', desc: 'Air-purifying, low-maintenance plants that thrive indoors.', family: 'Araceae', size: 'large' },
        { id: 'shrubs', name: 'Shrubs & Bush', img: 'succulents.png', desc: 'Compact ornamental shrubs ideal for borders and hedges.', family: 'Myrtaceae', size: 'small' },
        { id: 'bonsai', name: 'Bonsai', img: 'bonsai_plant.png', desc: 'Miniature masterpieces — sculpted living art for your space.', family: 'Various', size: 'small' },
        { id: 'climbers', name: 'Climbers & Creepers', img: 'spider_plant.png', desc: 'Beautiful vines and climbers that add vertical greenery to any wall.', family: 'Convolvulaceae', size: 'large' },
        { id: 'cactus', name: 'Cactus & Succulents', img: 'succulents.png', desc: 'Hardy, low-water beauties perfect for sunny spots and windowsills.', family: 'Cactaceae', size: 'small' },
        { id: 'lawn', name: 'Lawn Grass', img: 'avenue_trees.png', desc: 'Premium lawn grass varieties for lush, green, carpet-like gardens.', family: 'Poaceae', size: 'small' },
        { id: 'bamboo', name: 'Bamboo', img: 'hero_fern.png', desc: 'Fast-growing, eco-friendly bamboo for fencing, privacy and beauty.', family: 'Poaceae', size: 'large' },
        { id: 'medicinal', name: 'Medicinal & Herbal Plants', img: 'pet_friendly_plants.png', desc: 'Tulsi, aloe vera, ashwagandha — nature\'s pharmacy in your garden.', family: 'Lamiaceae', size: 'small' },
      ];

      const initialCategories = allCategories.slice(0, 3);
      const showAll = activeCollFilter === 'show-all';
      
      // Merge initial categories with custom plants if they match the collection
      const displayCategories = showAll 
        ? allCategories 
        : initialCategories;

      // Filter custom plants for the active collection or show all if in "See All" mode
      const relevantCustomPlants = customPlants.filter(p => 
        showAll || p.collection === allCategories.find(c => c.id === activeCollFilter.replace('filter-', ''))?.name
      );

      return (
        <>
          <div className="filter-row">
            <button 
              className={`filter-btn ${activeCollFilter === 'filter-outdoor' ? 'active' : ''}`} 
              onClick={() => setActiveCollFilter('filter-outdoor')}
            >
              Outdoor
            </button>
            <button 
              className={`filter-btn ${activeCollFilter === 'filter-indoor' ? 'active' : ''}`} 
              onClick={() => setActiveCollFilter('filter-indoor')}
            >
              Indoor
            </button>
            <button className={`see-all-btn ${showAll ? 'active' : ''}`} onClick={() => setActiveCollFilter(showAll ? 'filter-outdoor' : 'show-all')}>
              {showAll ? 'Show Less' : 'See All'}
            </button>
          </div>

          <div className={showAll ? 'collection-grid-all' : 'collection-grid'}>
            {displayCategories.map((cat, i) => (
              <motion.div
                key={cat.id}
                className={`coll-card ${showAll ? 'coll-card-uniform' : (cat.size === 'large' ? 'coll-card-large' : 'coll-card-small')}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: showAll ? i * 0.05 : i * 0.1 }}
              >
                <img src={cat.img} alt={cat.name} />
                <div className="coll-card-overlay"></div>
                <div className="coll-card-content">
                  <h3 className="coll-card-title">{cat.name}</h3>
                  <p className="coll-card-desc">{cat.desc}</p>
                  <span className="coll-arrow">→</span>
                </div>
                <div className="coll-tag">
                  <span className="coll-tag-star">★</span>
                  {cat.family}
                </div>
              </motion.div>
            ))}

            {/* Custom Admin Plants */}
            {relevantCustomPlants.map((plant, i) => (
              <motion.div
                key={plant.id}
                className={`coll-card ${showAll ? 'coll-card-uniform' : 'coll-card-small'}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (displayCategories.length + i) * 0.1 }}
              >
                {plant.img ? (
                  <img src={plant.img} alt={plant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#1e2e1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '40px' }}>
                    🌿
                  </div>
                )}
                <div className="coll-card-overlay"></div>
                <div className="coll-card-content">
                  <h3 className="coll-card-title">{plant.name}</h3>
                  <p className="coll-card-desc">{plant.desc || plant.specs || 'Nurtured with care at Sri Satya Ramayya Nursery.'}</p>
                  <div className="admin-plant-price-badge">₹{plant.price || 'Contact'}</div>
                </div>
                <div className="coll-tag">
                  <span className="coll-tag-star">★</span>
                  {plant.family || 'Specimen'}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      );
    })()}

    <div className="divider"></div>

    {/* Products Filter Row */}
    <div className="filter-row" style={{ marginTop: "14px" }}>
      <button className="filter-btn" id="filter-new">New Arrival</button>
      <button className="filter-btn active" id="filter-featured">Featured</button>
      <button className="filter-btn" id="filter-bestseller">Bestseller</button>
      <button className="see-all-btn" id="btn-see-all-products">See All</button>
    </div>

    {/* Product Cards */}
    <div className="products-grid">
      {/* Product 1 */}
      <div className="product-card" id="product-peperomia">
        <div className="product-img-wrap">
          <img src="bonsai_plant.png" alt="Peperomia Plants" />
          <button className="product-heart" onClick={() => toggleHeart('pep')} style={{ color: activeProducts.has('pep') ? 'rgb(220, 50, 50)' : '' }} aria-label="Favourite Peperomia">♥</button>
        </div>
        <div className="product-info">
          <div className="product-name">Peparomia Plants</div>
          <div className="product-desc">Low effort, high charm — small plants with bold style.</div>
          <div className="product-footer">
            <span className="product-price">$35</span>
            <span className="product-stock">12 Left in stock</span>
            <button className="product-cart" id="cart-peperomia" aria-label="Add to cart">
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Product 2 */}
      <div className="product-card" id="product-succulent">
        <div className="product-img-wrap">
          <img src="pothos_plant.png" alt="Succulent Mix" />
          <button className="product-heart" onClick={() => toggleHeart('suc')} style={{ color: activeProducts.has('suc') ? 'rgb(220, 50, 50)' : '' }} aria-label="Favourite Succulent">♥</button>
        </div>
        <div className="product-info">
          <div className="product-name">Succulent Mix</div>
          <div className="product-desc">A touch of tropical calm for your living space.</div>
          <div className="product-footer">
            <span className="product-price">$27</span>
            <span className="product-stock">21 Left in stock</span>
            <button className="product-cart" id="cart-succulent" aria-label="Add to cart">
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Product 3 */}
      <div className="product-card" id="product-spider">
        <div className="product-img-wrap">
          <img src="spider_plant.png" alt="Spider Plant" />
          <button className="product-heart" onClick={() => toggleHeart('spi')} style={{ color: activeProducts.has('spi') ? 'rgb(220, 50, 50)' : '' }} aria-label="Favourite Spider Plant">♥</button>
        </div>
        <div className="product-info">
          <div className="product-name">Spider Plant</div>
          <div className="product-desc">Playful, hardy, and perfect for any space.</div>
          <div className="product-footer">
            <span className="product-price">$43</span>
            <span className="product-stock">15 Left in stock</span>
            <button className="product-cart" id="cart-spider" aria-label="Add to cart">
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Dots */}
    <div className="dots">
      <div className="dot" id="dot-1"></div>
      <div className="dot active" id="dot-2"></div>
      <div className="dot" id="dot-3"></div>
      <div className="dot" id="dot-4"></div>
    </div>
  </motion.section>
</div>

{/* ===== RECENT EXPORTS & WORKS ===== */}
<section className="works-section" id="works">
  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={textContainer} style={{ textAlign: "center", marginBottom: "40px" }}>
    <motion.p className="section-label" variants={textItem}>Portfolio</motion.p>
    <motion.h2 className="section-title" style={{ fontFamily: "var(--font-mono)" }} variants={textItem}>Our Recent Exports & Work Done</motion.h2>
  </motion.div>

  <div className="works-grid">
    {clientWorks.length === 0 ? (
      <div className="works-empty-state">
        <p>Showcasing our excellence in landscaping and exports soon.</p>
      </div>
    ) : (
      clientWorks.map((work, idx) => (
        <motion.div 
          key={work.id} 
          className="work-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: idx * 0.1 }}
        >
          <div className="work-img-wrap">
            <img src={work.img || 'special_offer_bg.png'} alt={work.title} />
            <div className="work-overlay"></div>
          </div>
          <div className="work-content">
            <h3 className="work-title">{work.title}</h3>
            <p className="work-desc">{work.desc}</p>
            <div className="work-tag">{work.tag || 'Project'}</div>
          </div>
        </motion.div>
      ))
    )}
  </div>
</section>



{/* ===== ABOUT US ===== */}
<motion.section 
  className="about-section" id="about"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.8 }}
>
  <div className="about-badge">Est. 1985</div>
  <div className="about-inner">
    <div className="about-left">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={textContainer}>
        <motion.p className="about-eyebrow" variants={textItem}>Our Legacy</motion.p>
        <motion.h2 className="about-heading" variants={textItem}>Where Nature Meets<br />Timeless Craftsmanship</motion.h2>
        <motion.div className="about-accent-line" variants={textItem}></motion.div>
        <motion.p className="about-desc about-desc-lead" variants={textItem}>
          For over three decades, Sri Satya Ramayya Nursery has stood as a beacon of horticultural excellence — curating the finest botanical specimens from across the subcontinent and beyond.
        </motion.p>
        <motion.p className="about-desc" variants={textItem}>
          What began as a family's deep-rooted passion for flora has evolved into a distinguished institution, trusted by landscape architects, interior designers, and discerning plant connoisseurs. Every plant in our collection is hand-selected, meticulously nurtured, and delivered with the promise of enduring vitality.
        </motion.p>
        <motion.p className="about-quote" variants={textItem}>
          "We don't just grow plants — we cultivate living legacies."
        </motion.p>
      </motion.div>
      <div className="about-stats">
        <div className="about-stat">
          <div className="about-stat-num">500<span className="about-stat-plus">+</span></div>
          <div className="about-stat-label">Curated Varieties</div>
        </div>
        <div className="about-stat">
          <div className="about-stat-num">38<span className="about-stat-plus">yrs</span></div>
          <div className="about-stat-label">Heritage & Legacy</div>
        </div>
        <div className="about-stat">
          <div className="about-stat-num">10K<span className="about-stat-plus">+</span></div>
          <div className="about-stat-label">Patrons Served</div>
        </div>
        <div className="about-stat">
          <div className="about-stat-num">50<span className="about-stat-plus">+</span></div>
          <div className="about-stat-label">Master Gardeners</div>
        </div>
      </div>
    </div>
  </div>
</motion.section>

{/* ===== TESTIMONIALS ===== */}
<motion.section 
  className="testimonial-section" id="testimonials"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.8 }}
>
  {/* Decorative SVG left */}
  <svg className="testimonial-deco-left" width="90" height="100" viewBox="0 0 90 100" fill="none">
    <path d="M45 90 C20 70 5 50 10 25 C15 5 35 0 45 10 C55 0 75 5 80 25 C85 50 70 70 45 90Z" stroke="white" strokeWidth="1.5" fill="none"/>
    <path d="M45 90 L45 60 M30 75 L45 60 L60 75" stroke="white" strokeWidth="1.5" fill="none"/>
    <path d="M20 85 C15 90 10 95 5 98" stroke="white" strokeWidth="1.5" fill="none"/>
    <circle cx="45" cy="60" r="2" fill="white"/>
    <circle cx="25" cy="30" r="2" fill="white" opacity="0.5"/>
    <circle cx="65" cy="25" r="2" fill="white" opacity="0.5"/>
  </svg>

  {/* Decorative SVG right (plant illustration) */}
  <svg className="testimonial-deco-right" width="110" height="140" viewBox="0 0 110 140" fill="none" opacity="0.85">
    <ellipse cx="55" cy="55" rx="40" ry="48" fill="#1a7a6e" opacity="0.7"/>
    <ellipse cx="30" cy="75" rx="28" ry="35" fill="#e8d5a3" opacity="0.8" transform="rotate(-20 30 75)"/>
    <ellipse cx="80" cy="50" rx="24" ry="32" fill="#1a7a6e" opacity="0.6" transform="rotate(15 80 50)"/>
    <line x1="55" y1="100" x2="55" y2="140" stroke="#c8a96e" strokeWidth="4"/>
    <path d="M30 115 C35 108 45 105 55 110" stroke="#c8a96e" strokeWidth="2.5" fill="none"/>
    <path d="M80 120 C75 113 65 110 55 115" stroke="#c8a96e" strokeWidth="2.5" fill="none"/>
  </svg>

  <div className="testi-inner">
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={textContainer}>
      <motion.p className="testi-label" variants={textItem}>Testimonial</motion.p>
      <motion.h2 className="testi-title" variants={textItem}>Hear from Our Growing Community</motion.h2>
    </motion.div>
    <div className="testi-grid">
      {/* Default Testimonials */}
      <div className="testi-card" id="testi-1">
        <img className="testi-img" src="testimonial_man.png" alt="David Beckham" />
        <div className="testi-body">
          <p className="testi-text">I recently ordered a variety of indoor plants from Sri Satya Ramayya Nursery, and I couldn't be happier with my experience. Each plant arrived healthy, fresh, and perfectly packed, in every order.</p>
          <div className="testi-stars">★★★★★</div>
          <div className="testi-divider"></div>
          <div className="testi-name">David Beckham</div>
          <div className="testi-role">CEO, Nexo IT Firm Ltd.</div>
        </div>
      </div>

      <div className="testi-card" id="testi-2">
        <img className="testi-img" src="testimonial_woman.png" alt="Ketty Jones" />
        <div className="testi-body">
          <p className="testi-text">I recently ordered a variety of indoor plants from Sri Satya Ramayya Nursery, and I couldn't be happier with my experience. Each plant arrived healthy, fresh, and perfectly packed, in every order.</p>
          <div className="testi-stars">★★★★★</div>
          <div className="testi-divider"></div>
          <div className="testi-name">Ketty Jones</div>
          <div className="testi-role">CEO, Tourivo Pvt Ltd.</div>
        </div>
      </div>

      {/* Custom Testimonials */}
      {customTestimonials.map(t => (
        <div key={t.id} className="testi-card">
          <div className="testi-img" style={{ background: '#4a8c3f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            {t.name.charAt(0)}
          </div>
          <div className="testi-body">
            <p className="testi-text">{t.text}</p>
            <div className="testi-stars">{'★'.repeat(t.rating)}{'☆'.repeat(5-t.rating)}</div>
            <div className="testi-divider"></div>
            <div className="testi-name">{t.name}</div>
            <div className="testi-role">{t.role}</div>
          </div>
        </div>
      ))}
    </div>

    {/* Dots */}
    <div className="dots" style={{ marginTop: "30px" }}>
      <div className="dot active" id="testi-dot-1" style={{ background: "#4a8c3f" }}></div>
      <div className="dot" id="testi-dot-2" style={{ background: "rgba(255,255,255,0.3)" }}></div>
      <div className="dot" id="testi-dot-3" style={{ background: "rgba(255,255,255,0.3)" }}></div>
    </div>
  </div>
</motion.section>

{/* ===== SUBSCRIBE ===== */}
<section className="subscribe-section" id="subscribe">
  <motion.div 
    className="subscribe-card"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8 }}
  >
    <div className="subscribe-bg"></div>
    <div className="subscribe-content">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={textContainer}>
        <motion.h2 className="subscribe-title" variants={textItem}>Get The Sri Satya Ramayya Nursery In Your Home</motion.h2>
        <motion.p className="subscribe-subtitle" variants={textItem}>Subscribe now and receive fresh plant care tips and exclusive<br />updates straight to your inbox.</motion.p>
      </motion.div>
      <form className="subscribe-form" id="subscribe-form" onSubmit={(e) => e.preventDefault()}>
        <input className="subscribe-input" type="email" id="email-input" placeholder="Enter Your Email" />
        <button className="subscribe-submit" type="submit" id="btn-subscribe">Subscribe</button>
      </form>
    </div>
  </motion.div>
</section>

{/* ===== CONTACT FORM ===== */}
<motion.section 
  className="contact-section" id="contact"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.8 }}
>
  <div className="contact-inner">
    <div className="contact-info">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={textContainer}>
        <motion.p className="section-label" variants={textItem}>Contact Us</motion.p>
        <motion.h2 className="contact-heading" variants={textItem}>Get In Touch With Us</motion.h2>
        <motion.p className="contact-desc" variants={textItem}>Have questions about our plants or need help choosing the perfect green companion? We'd love to hear from you.</motion.p>
      </motion.div>
      <div className="contact-details">
        <div className="contact-detail-item">
          <div className="contact-detail-icon">📍</div>
          <div>
            <div className="contact-detail-label">Visit Us</div>
            <div className="contact-detail-text">123 Green Lane, Plant City, FL 33563</div>
          </div>
        </div>
        <div className="contact-detail-item">
          <div className="contact-detail-icon">📞</div>
          <div>
            <div className="contact-detail-label">Call Us</div>
            <div className="contact-detail-text">+91 00000 00000</div>
          </div>
        </div>
        <a href="https://wa.me/910000000000" target="_blank" rel="noopener noreferrer" className="contact-detail-item whatsapp-link">
          <div className="contact-detail-icon" style={{ background: '#25d366' }}>💬</div>
          <div>
            <div className="contact-detail-label">WhatsApp Us</div>
            <div className="contact-detail-text">Fast support via WhatsApp</div>
          </div>
        </a>
        <div className="contact-detail-item">
          <div className="contact-detail-icon">✉️</div>
          <div>
            <div className="contact-detail-label">Email Us</div>
            <div className="contact-detail-text">hello@srisatyaramayya.com</div>
          </div>
        </div>
        <div className="contact-detail-item">
          <div className="contact-detail-icon">🕐</div>
          <div>
            <div className="contact-detail-label">Working Hours</div>
            <div className="contact-detail-text">Mon – Sat: 9:00 AM – 6:00 PM</div>
          </div>
        </div>
      </div>
    </div>
    <motion.div 
      className="contact-form-card"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <h3 className="contact-form-title">Send Us a Message</h3>
      <form className="contact-form" id="contact-form" onSubmit={(e) => e.preventDefault()}>
        <div className="contact-form-row">
          <div className="contact-form-group">
            <label htmlFor="contact-first-name">First Name</label>
            <input type="text" id="contact-first-name" placeholder="John" />
          </div>
          <div className="contact-form-group">
            <label htmlFor="contact-last-name">Last Name</label>
            <input type="text" id="contact-last-name" placeholder="Doe" />
          </div>
        </div>
        <div className="contact-form-group">
          <label htmlFor="contact-email">Email Address</label>
          <input type="email" id="contact-email" placeholder="john@example.com" />
        </div>
        <div className="contact-form-group">
          <label htmlFor="contact-phone">Phone Number</label>
          <input type="tel" id="contact-phone" placeholder="+1 (555) 000-0000" />
        </div>
        <div className="contact-form-group">
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" rows="4" placeholder="Tell us what you need..."></textarea>
        </div>
        <button className="contact-submit-btn" type="submit" id="btn-contact-submit">Send Message</button>
      </form>
    </motion.div>
  </div>
</motion.section>

{/* ===== FOOTER ===== */}
<footer id="footer">
  <div className="footer-top">
    <div>
      <span className="footer-logo">Sri Satya Ramayya Nursery</span>
      <p className="footer-tagline">Fresh plants. Fresh air. Fresh life. We don't just sell plants — we grow happiness.</p>
      <div className="footer-socials">
        <a href="#" className="social-icon" id="social-facebook" aria-label="Facebook">
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
        <a href="#" className="social-icon" id="social-instagram" aria-label="Instagram">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        </a>
        <a href="#" className="social-icon" id="social-linkedin" aria-label="LinkedIn">
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
        </a>
        <a href="#" className="social-icon" id="social-youtube" aria-label="YouTube">
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="#162012" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
        </a>
      </div>
    </div>

    <div>
      <div className="footer-col-title">Quick Links</div>
      <ul className="footer-links">
        <li><a href="#" id="footer-home">Home</a></li>
        <li><a href="#blog" id="footer-blog">Blog</a></li>
        <li><a href="#" id="footer-shop">Shop</a></li>
        <li><a href="#" id="footer-contact">Contact</a></li>
      </ul>
    </div>

    <div>
      <div className="footer-col-title">Customer Service</div>
      <ul className="footer-links">
        <li><a href="#" id="footer-my-account">My Account</a></li>
        <li><a href="#" id="footer-track-order">Track Your Order</a></li>
        <li><a href="#" id="footer-return">Return</a></li>
        <li><a href="#" id="footer-faqs">FAQs</a></li>
      </ul>
    </div>

    <div>
      <div className="footer-col-title">Our Information</div>
      <ul className="footer-links">
        <li><a href="#" id="footer-privacy">Privacy</a></li>
        <li><a href="#" id="footer-terms">User Terms &amp; Conditions</a></li>
        <li><a href="#" id="footer-return-policy">Return Policy</a></li>
        <li><a href="#" id="footer-community">Community Engagement</a></li>
      </ul>
    </div>
  </div>

  <div className="footer-bottom">
    <span>© Copyright 2025 by Sri Satya Ramayya Nursery | All Rights Reserved.</span>
    <div className="footer-lang">
      <span>🌐</span>
      <span>En</span>
      <span>|</span>
      <span>English</span>
    </div>
  </div>

  <div className="footer-big-text">Sri Satya Ramayya<br />Nursery</div>
</footer>


    {/* Modals & Overlays */}
    {showLogin && (
      <LoginModal 
        onClose={() => setShowLogin(false)} 
        onLogin={handleLogin} 
      />
    )}

    {showAdmin && (
      <AdminPanel 
        onClose={() => setShowAdmin(false)} 
        onLogout={handleLogout}
        customPlants={customPlants}
        setCustomPlants={setCustomPlants}
        testimonialEnabled={testimonialEnabled}
        setTestimonialEnabled={setTestimonialEnabled}
        customTestimonials={customTestimonials}
        setCustomTestimonials={setCustomTestimonials}
        clientWorks={clientWorks}
        setClientWorks={setClientWorks}
      />
    )}

    {showTestimonialForm && (
      <TestimonialForm 
        onClose={() => setShowTestimonialForm(false)}
        onSubmit={handleTestimonialSubmit}
      />
    )}

    {/* Floating Testimonial Toggle Button (Only if enabled by admin) */}
    {testimonialEnabled && (
      <motion.button 
        className="floating-testimonial-btn"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowTestimonialForm(true)}
        title="Leave a Testimonial"
      >
        💬
      </motion.button>
    )}
    {/* Floating WhatsApp Button */}
    <motion.a 
      href="https://wa.me/910000000000?text=Hello! I'm interested in plants from Sri Satya Ramayya Nursery." 
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp-btn"
      style={{ right: testimonialEnabled ? '100px' : '30px' }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title="Contact on WhatsApp"
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </motion.a>
    </>
  );
}

export default App;
