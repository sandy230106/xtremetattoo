 "use client";

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

const portfolioItems = [
  { id: 1, category: 'realism', img: '/b1.jpg', alt: 'Realism Tattoo', title: 'Realism', desc: 'Detailed Art' },
  { id: 2, category: 'realism', img: '/b2.jpg', alt: 'Realism Tattoo', title: 'Realism', desc: 'High Detail' },
  { id: 3, category: 'realism', img: '/r1.jpg', alt: 'Realism Profile', title: 'Realism', desc: 'Masterpiece' },
  { id: 4, category: 'realism', img: '/r2.jpg', alt: 'Realism Piece', title: 'Realism', desc: 'Precision' },
  { id: 5, category: 'realism', img: '/r3.jpg', alt: 'Realism Skin Art', title: 'Realism', desc: 'Cinematic' },
  { id: 6, category: 'realism', img: '/r4.JPG', alt: 'Realism Deep Work', title: 'Realism', desc: 'Lifelike' },
  { id: 7, category: 'realism', img: '/r5.jpg', alt: 'Realistic Tattoo', title: 'Realism', desc: 'Shadows' },
  { id: 8, category: 'portrait', img: '/po1.jpg', alt: 'Portrait Tattoo', title: 'Portrait', desc: 'Hyper Realism' },
  { id: 9, category: 'portrait', img: '/po2.jpg', alt: 'Portrait Detail', title: 'Portrait', desc: 'Black & Grey' },
  { id: 10, category: 'minimal', img: '/m1.jpg', alt: 'Minimal Tattoo', title: 'Minimal', desc: 'Fine Line' },
  { id: 11, category: 'minimal', img: '/m2.jpg', alt: 'Minimal Piece', title: 'Minimal', desc: 'Simplicity' },
  { id: 12, category: 'minimal', img: '/m3.PNG', alt: 'Minimal Art', title: 'Minimal', desc: 'Clean Work' },
  { id: 13, category: 'minimal', img: '/m4.JPG', alt: 'Minimal Expression', title: 'Minimal', desc: 'Elegant' },
  { id: 14, category: 'piercing', img: '/p1.jpg', alt: 'Piercing Jewelry', title: 'Piercing', desc: 'Body Art' },
  { id: 15, category: 'piercing', img: '/p2.jpg', alt: 'Ear Piercing', title: 'Piercing', desc: 'Curated Ear' },
  { id: 16, category: 'piercing', img: '/p3.jpg', alt: 'Nose Piercing', title: 'Piercing', desc: 'Precision' }
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const artistImages = ['/a5.jpg', '/a2.JPG', '/a4.JPG', '/a3.JPG'];
  const [artistImageIndex, setArtistImageIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const triggerReveals = () => {
      const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
      const windowHeight = window.innerHeight;
      const isMobile = window.innerWidth <= 768;
      const elementVisible = isMobile ? 50 : 100;

      reveals.forEach(reveal => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
          reveal.classList.add('active');
        }
      });
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      triggerReveals();
    };

    // Trigger reveals after loader hides
    triggerReveals();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading]);

  // Auto-slide the artist image every 3 seconds (after loader completes).
  useEffect(() => {
    if (isLoading) return;
    const id = setInterval(() => {
      setArtistImageIndex((prev) => (prev + 1) % artistImages.length);
    }, 4000);
    return () => clearInterval(id);
  }, [isLoading, artistImages.length]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const name = e.target.querySelector('#name').value;
    const phone = e.target.querySelector('#phone').value;
    const service = e.target.querySelector('#service').value;
    const message = e.target.querySelector('#message').value;

    const text = `🔥 *New Consultation Request*\n\n👤 *Name:* ${name}\n📞 *Phone:* ${phone}\n🎨 *Service:* ${service}\n💬 *Message:* ${message || 'N/A'}`;

    const whatsappURL = `https://wa.me/917010343009?text=${encodeURIComponent(text)}`;
    window.open(whatsappURL, '_blank');

    const btn = e.target.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Request Sent!';
    btn.style.backgroundColor = 'var(--clr-gold)';
    btn.style.borderColor = 'var(--clr-gold)';
    btn.style.color = 'var(--clr-black)';
    
    setTimeout(() => {
      e.target.reset();
      btn.textContent = originalText;
      btn.style.backgroundColor = '';
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 3000);
  };

  const filteredItems =
    activeFilter === 'all'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeFilter);

  return (
    <div className={isLoading ? "loading" : ""}>
      
      {/* Ink Loader */}
      <div id="loader" className={`loader ${isLoading ? '' : 'hidden'}`}>
        <div className="loader-content">
          <h1 className="loader-brand" style={{fontSize: "clamp(2rem, 5vw, 4rem)"}}>XTREME TATTOO STUDIO</h1>
          <p className="loader-tagline">INKING YOUR STORY</p>
          <div className="ink-drop"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#" className="logo">
            <img src="/logo.jpg" alt="Xtreme Tattoo Studio Logo" className="logo-img" />
            <span className="logo-text">XTREME TATTOO STUDIO</span>
          </a>
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</a></li>
            <li><a href="#services" className="nav-link" onClick={() => setIsMenuOpen(false)}>Services</a></li>
            <li><a href="#portfolio" className="nav-link" onClick={() => setIsMenuOpen(false)}>Portfolio</a></li>
            <li><a href="#contact" className="nav-link btn-small" onClick={() => setIsMenuOpen(false)}>Book Now</a></li>
          </ul>
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero" id="home">
        <div className="hero-bg" style={{ backgroundImage: "url('/a3.JPG')" }}></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="trust-badge reveal float-anim">
            <span className="star">⭐</span> 5.0 Rating | 90+ Happy Clients
          </div>
          <h1 className="hero-title reveal delay-1">Your Story.<br/><span>Inked Forever.</span></h1>
          <p className="hero-subtitle reveal delay-2">Custom tattoos crafted with precision, meaning, and artistry in Trichy.</p>
          <div className="hero-cta reveal delay-3">
            <a href="#contact" className="btn btn-primary">Book Consultation</a>
            <a href="#portfolio" className="btn btn-outline">View Portfolio</a>
          </div>
          
          <div className="hero-features reveal delay-4">
            <div className="feature-item">
              <span className="check">✔</span> Hygienic Studio
            </div>
            <div className="feature-item">
              <span className="check">✔</span> Expert Artist
            </div>
          </div>
        </div>
      </header>

      {/* About */}
      <section className="about section-padding" id="about">
        <div className="container grid-2-col">
          <div className="about-image-wrapper reveal-left">
            <div className="about-image">
              {artistImages.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt="Muthu Kumar Tattooing"
                  loading="lazy"
                  className={`artist-img ${idx === artistImageIndex ? 'active' : ''}`}
                />
              ))}
            </div>
            <div className="about-experience">
              <span className="exp-number">8+</span>
              <span className="exp-text">Years<br/>Experience</span>
            </div>
          </div>
          <div className="about-content reveal-right">
            <h2 className="section-title">More Than Just <span>Tattoos</span></h2>
            <h3 className="artist-name">Artist: Muthu Kumar</h3>
            <p className="about-text">At Xtreme Tattoo Studio, every tattoo is a story. Led by artist Muthu Kumar, we specialize in custom designs that reflect your identity, beliefs, and emotions.</p>
            <p className="about-text">With a strong focus on hygiene, precision, and comfort, we ensure every client has a safe and memorable experience.</p>
            <ul className="about-bullets">
              <li>Hyper-Realistic & Custom Design Specialists</li>
              <li>Record Holder Artist</li>
              <li>100% Sterile & Safe Environment</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services section-padding bg-charcoal" id="services">
        <div className="container">
          <div className="section-header text-center reveal">
            <h2 className="section-title">Our <span>Services</span></h2>
            <p className="section-subtitle">Personalized art, flawless execution, and safety first.</p>
          </div>
          <div className="services-grid">
            <div className="service-card reveal-zoom">
              <div className="service-icon">✒️</div>
              <h3 className="service-title">Custom Tattoos</h3>
              <p className="service-desc">We design unique tattoos that tell your personal story. No copy-pasting, just pure art.</p>
            </div>
            <div className="service-card reveal-zoom delay-1">
              <div className="service-icon">👤</div>
              <h3 className="service-title">Portrait Tattoos</h3>
              <p className="service-desc">Hyper-realistic portraits capturing every fine detail to immortalize your loved ones.</p>
            </div>
            <div className="service-card reveal-zoom delay-2">
              <div className="service-icon">👁️</div>
              <h3 className="service-title">Realism</h3>
              <p className="service-desc">Hyper-accurate, lifelike designs that capture reality with stunning precision.</p>
            </div>
            <div className="service-card reveal-zoom delay-3">
              <div className="service-icon">💎</div>
              <h3 className="service-title">Piercing</h3>
              <p className="service-desc">Professional and hygienic body piercing with a wide selection of premium jewelry.</p>
            </div>
            <div className="service-card reveal-zoom delay-4">
              <div className="service-icon">🔄</div>
              <h3 className="service-title">Cover-ups</h3>
              <p className="service-desc">Transform your regretful ink into a masterpiece you&apos;ll be proud to show off.</p>
            </div>
            <div className="service-card reveal-zoom delay-5">
              <div className="service-icon">❌</div>
              <h3 className="service-title">Tattoo Removal</h3>
              <p className="service-desc">Safe and effective laser removal services to clear the canvas for your next piece.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Marquee */}
      <section className="why-us section-padding">
        <div className="container marquee-container reveal">
          <div className="marquee-content">
            <span>⭐ 5-STAR RATED STUDIO</span><span>•</span>
            <span>⭐ HIGHLY SKILLED ARTIST</span><span>•</span>
            <span>⭐ HYGIENIC & SAFE</span><span>•</span>
            <span>⭐ PERFECT FOR FIRST-TIMERS</span><span>•</span>
            <span>⭐ CUSTOM DESIGN CONSULTATION</span><span>•</span>
            <span>⭐ FRIENDLY EXPERIENCE</span><span>•</span>
          </div>
          <div className="marquee-content" aria-hidden="true">
            <span>⭐ 5-STAR RATED STUDIO</span><span>•</span>
            <span>⭐ HIGHLY SKILLED ARTIST</span><span>•</span>
            <span>⭐ HYGIENIC & SAFE</span><span>•</span>
            <span>⭐ PERFECT FOR FIRST-TIMERS</span><span>•</span>
            <span>⭐ CUSTOM DESIGN CONSULTATION</span><span>•</span>
            <span>⭐ FRIENDLY EXPERIENCE</span><span>•</span>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="portfolio section-padding" id="portfolio">
        <div className="container">
          <div className="section-header text-center reveal">
            <h2 className="section-title">Our <span>Portfolio</span></h2>
            <p className="section-subtitle">Real work. Real stories. Browse our recent masterpieces.</p>
          </div>

          <div className="portfolio-filters reveal">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${activeFilter === 'portrait' ? 'active' : ''}`}
              onClick={() => setActiveFilter('portrait')}
            >
              Portrait
            </button>
            <button
              className={`filter-btn ${activeFilter === 'realism' ? 'active' : ''}`}
              onClick={() => setActiveFilter('realism')}
            >
              Realism
            </button>
            <button
              className={`filter-btn ${activeFilter === 'minimal' ? 'active' : ''}`}
              onClick={() => setActiveFilter('minimal')}
            >
              Minimal
            </button>
            <button
              className={`filter-btn ${activeFilter === 'piercing' ? 'active' : ''}`}
              onClick={() => setActiveFilter('piercing')}
            >
              Piercing
            </button>
          </div>

          <div className="portfolio-slider-container" style={{ paddingBottom: '3rem' }}>
            <Swiper
              key={activeFilter}
              modules={[Autoplay, Pagination, EffectCoverflow, Navigation]}
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              coverflowEffect={{
                rotate: 55,
                stretch: 25,
                depth: 180,
                modifier: 1,
                slideShadows: true,
              }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation={true}
              className="portfolio-swiper"
            >
              {filteredItems.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className={`portfolio-item reveal active`} style={{ display: 'block' }}>
                    <img src={item.img} alt={item.alt} loading="lazy" />
                    <div className="portfolio-overlay"><h4>{item.title}</h4><p>{item.desc}</p></div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials section-padding bg-charcoal">
        <div className="container">
          <div className="section-header text-center reveal">
            <h2 className="section-title">Client <span>Stories</span></h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card reveal glass">
              <div className="stars">★★★★★</div>
              <p className="quote">&quot;Best tattoo artist in Trichy! The attention to detail is mind-blowing.&quot;</p>
              <h4 className="client-name">- Rahul M.</h4>
            </div>
            <div className="testimonial-card reveal delay-1 glass">
              <div className="stars">★★★★★</div>
              <p className="quote">&quot;Very hygienic and professional studio. Muthu made me feel completely at ease.&quot;</p>
              <h4 className="client-name">- Priya S.</h4>
            </div>
            <div className="testimonial-card reveal delay-2 glass">
              <div className="stars">★★★★★</div>
              <p className="quote">&quot;Perfect for first-time tattoo, very comfortable experience.&quot;</p>
              <h4 className="client-name">- Karthik T.</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Booking */}
      <section className="contact section-padding" id="contact">
        <div className="container grid-2-col">
          <div className="contact-info reveal-left">
            <h2 className="section-title">Book Your <span>Session</span></h2>
            <p className="contact-subtitle" style={{marginBottom: "2rem"}}>Ready to let your skin tell your story? Reach out to us for a consultation or to book your slot.</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4 style={{marginBottom: "0.5rem", fontSize: "1.2rem"}}>Visit Us</h4>
                  <p style={{color: "var(--clr-gray)"}}>No # C-117, 11th B Cross Rd,<br/>West Thillai Nagar, Tennur,<br/>Tiruchirappalli, Tamil Nadu 620018</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4 style={{marginBottom: "0.5rem", fontSize: "1.2rem"}}>Call Us</h4>
                  <p><a href="tel:+917010343009" className="text-link">070103 43009</a></p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="contact-form-wrapper reveal-right">
            <form className="contact-form glass" style={{padding: '3rem', borderRadius: '15px'}} id="booking-form" onSubmit={handleBookingSubmit}>
              <h3 className="form-title" style={{marginBottom: '2rem', color: 'var(--clr-gold)'}}>Consultation Form</h3>
              <div className="form-group">
                <input type="text" id="name" required placeholder="Your Name" />
              </div>
              <div className="form-group">
                <input type="tel" id="phone" required placeholder="Phone Number" />
              </div>
              <div className="form-group">
                <select id="service" required>
                  <option value="">Select Service</option>
                  <option value="custom">Custom Tattoo</option>
                  <option value="portrait">Portrait Tattoo</option>
                  <option value="coverup">Cover-up</option>
                  <option value="piercing">Piercing</option>
                </select>
              </div>
              <div className="form-group">
                <textarea id="message" rows="4" placeholder="Tell us about your idea..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Send Request</button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Instagram Section */}
      <section className="instagram-section reveal" style={{ marginTop: "2rem" }} id="instagram">
        <div className="instagram-inner">
          <h2 className="section-title">
            Follow <span>Instagram</span>
          </h2>
          <p className="section-subtitle" style={{ marginBottom: "1.5rem" }}>
            Watch reels and explore recent tattoo work.
          </p>

          <iframe
            className="instagram-iframe"
            src="https://www.instagram.com/xtreme.tattoo.studio/embed/"
            loading="lazy"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            referrerPolicy="no-referrer-when-downgrade"
            title="Xtreme Tattoo Studio Instagram"
          />

        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-charcoal" style={{padding: "3rem", textAlign: "center"}}>
        <div className="container footer-content">
          <div className="footer-logo">
            <span className="logo-text" style={{fontFamily: "var(--font-heading)", letterSpacing:"1px"}}>XTREME TATTOO STUDIO</span>
            <p style={{color: "var(--clr-gray)", fontSize:"0.9rem", marginBottom: '2rem'}}>Tattoo Studio Trichy</p>
            
            <div className="social-links" style={{display: 'flex', justifyContent: 'center', gap: '1.5rem'}}>
              <a href="https://www.instagram.com/xtreme.tattoo.studio?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" className="social-icon insta">
                <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.584.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
          <p className="copyright" style={{marginTop:"3rem", color:"rgba(255,255,255,0.3)", fontSize:"0.8rem"}}>&copy; 2024 Xtreme Tattoo Studio. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/917010343009" className="whatsapp-float" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 32 32" className="wa-icon" style={{width: "40px", height: "40px", fill: "white"}}>
          <path d="M16 2a13 13 0 0 0-11 20l-2 5 5-2a13 13 0 1 0 8-23zm0 24a11 11 0 0 1-5-1l-3 1 1-3a11 11 0 1 1 7 3zm5-8c0 .2-.1.5-.3.7-.3.5-.8.7-1.4.9-.3 0-.7.1-1.2.1-1.3 0-2.8-.5-4.2-1.6-1.5-1.1-2.6-2.6-3.1-3.6-.3-.6-.4-1.1-.4-1.5 0-1 .5-1.6.8-2 .2-.3.4-.4.7-.4h.5c.2 0 .4 0 .5.3.3.6.8 1.9.9 2.2.1.2.1.4 0 .6-.1.2-.2.4-.4.6-.2.2-.4.4-.6.5-.2.2-.3.5-.1.8.4.8 1 1.5 1.7 2.1.8.7 1.6 1.1 2.4 1.4.3.1.6 0 .8-.2.2-.3.5-.6.7-1 .2-.3.4-.3.7-.2.2.1 1.5.7 1.8.8.2.1.4.2.5.3.1.2.1.6 0 1z"/>
        </svg>
      </a>

      {/* Mobile Sticky CTA */}
      <div className="mobile-sticky-cta">
        <a href="#contact" className="btn btn-primary btn-block">Book Now</a>
      </div>
    </div>
  );
}
