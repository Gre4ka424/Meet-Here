// Simple client-side router
class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentPath = '';
        this.currentLang = localStorage.getItem('language') || 'en';
        
        // Handle navigation
        window.addEventListener('popstate', () => this.handleRoute());
        
        // Handle initial load
        this.handleRoute();
        
        // Handle link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('a') && e.target.href.startsWith(window.location.origin)) {
                e.preventDefault();
                const path = e.target.pathname;
                this.navigate(path);
            }
            
            // Handle language switching
            if (e.target.matches('.lang-btn')) {
                const lang = e.target.dataset.lang;
                this.switchLanguage(lang);
            }
        });
    }
    
    async handleRoute() {
        const path = window.location.pathname;
        if (path === this.currentPath) return;
        
        this.currentPath = path;
        const route = this.routes[path] || this.routes['/'];
        
        try {
            const content = await route(this.currentLang);
            document.querySelector('main.main-content').innerHTML = content;
            
            // Update active link in navigation
            document.querySelectorAll('.sidebar-nav a').forEach(link => {
                link.classList.toggle('active', link.pathname === path);
            });
        } catch (error) {
            console.error('Error loading route:', error);
        }
    }
    
    navigate(path) {
        window.history.pushState(null, '', path);
        this.handleRoute();
    }
    
    switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        
        // Update language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Update content
        this.handleRoute();
        
        // Update navigation text
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            const keys = key.split('.');
            let translation = translations[lang];
            for (const k of keys) {
                translation = translation[k];
            }
            if (translation) {
                element.textContent = translation;
            }
        });
    }
}

// Define route handlers
const routes = {
    '/': async (lang) => {
        const t = translations[lang].home;
        return `
            <section class="hero-banner">
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <h1 data-lang-key="home.title">${t.title}</h1>
                    <p data-lang-key="home.subtitle">${t.subtitle}</p>
                    <div class="cta-buttons">
                        <a href="/login" class="btn btn-light" data-lang-key="home.login">${t.login}</a>
                        <a href="/register" class="btn btn-light" data-lang-key="home.register">${t.register}</a>
                    </div>
                </div>
            </section>
            <section class="features-section">
                <div class="features-content">
                    <h2 class="features-title" data-lang-key="home.featuresTitle">${t.featuresTitle}</h2>
                    <p class="features-description" data-lang-key="home.featuresDescription">${t.featuresDescription}</p>
                    <div class="features-list">
                        <div class="feature-item">
                            <span class="feature-icon">→</span>
                            <p data-lang-key="home.feature1">${t.feature1}</p>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">→</span>
                            <p data-lang-key="home.feature2">${t.feature2}</p>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">→</span>
                            <p data-lang-key="home.feature3">${t.feature3}</p>
                        </div>
                    </div>
                    <a href="/services" class="features-link" data-lang-key="home.allServices">${t.allServices} →</a>
                </div>
                <div class="features-image">
                    <img src="https://via.placeholder.com/500x350/0000FF/FFFFFF?text=Event+Photo" alt="Event Photo">
                </div>
            </section>
        `;
    },
    '/services': async (lang) => {
        const t = translations[lang].services;
        return `
            <section class="page-content">
                <h1 data-lang-key="services.title">${t.title}</h1>
                <div class="services-grid">
                    <div class="service-card">
                        <h3 data-lang-key="services.service1.title">${t.service1.title}</h3>
                        <p data-lang-key="services.service1.description">${t.service1.description}</p>
                    </div>
                    <div class="service-card">
                        <h3 data-lang-key="services.service2.title">${t.service2.title}</h3>
                        <p data-lang-key="services.service2.description">${t.service2.description}</p>
                    </div>
                    <div class="service-card">
                        <h3 data-lang-key="services.service3.title">${t.service3.title}</h3>
                        <p data-lang-key="services.service3.description">${t.service3.description}</p>
                    </div>
                </div>
            </section>
        `;
    },
    '/our-work': async (lang) => {
        const t = translations[lang].portfolio;
        return `
            <section class="page-content">
                <h1 data-lang-key="portfolio.title">${t.title}</h1>
                <p data-lang-key="portfolio.description">${t.description}</p>
            </section>
        `;
    },
    '/our-team': async (lang) => {
        const t = translations[lang].team;
        return `
            <section class="page-content">
                <h1 data-lang-key="team.title">${t.title}</h1>
                <p data-lang-key="team.description">${t.description}</p>
            </section>
        `;
    },
    '/price-list': async (lang) => {
        const t = translations[lang].prices;
        return `
            <section class="page-content">
                <h1 data-lang-key="prices.title">${t.title}</h1>
                <p data-lang-key="prices.description">${t.description}</p>
            </section>
        `;
    },
    '/contact': async (lang) => {
        const t = translations[lang].contact;
        return `
            <section class="page-content">
                <h1 data-lang-key="contact.title">${t.title}</h1>
                <p data-lang-key="contact.description">${t.description}</p>
            </section>
        `;
    },
    '/login': async (lang) => {
        const t = translations[lang].auth.login;
        return `
            <section class="auth-section">
                <h1 data-lang-key="auth.login.title">${t.title}</h1>
                <form class="auth-form" id="loginForm">
                    <div class="form-group">
                        <label for="username" data-lang-key="auth.login.username">${t.username}</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password" data-lang-key="auth.login.password">${t.password}</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary" data-lang-key="auth.login.submit">${t.submit}</button>
                </form>
            </section>
        `;
    },
    '/register': async (lang) => {
        const t = translations[lang].auth.register;
        return `
            <section class="auth-section">
                <h1 data-lang-key="auth.register.title">${t.title}</h1>
                <form class="auth-form" id="registerForm">
                    <div class="form-group">
                        <label for="username" data-lang-key="auth.register.username">${t.username}</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="email" data-lang-key="auth.register.email">${t.email}</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password" data-lang-key="auth.register.password">${t.password}</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary" data-lang-key="auth.register.submit">${t.submit}</button>
                </form>
            </section>
        `;
    }
};

// Initialize router
const router = new Router(routes); 
