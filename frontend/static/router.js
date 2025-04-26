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
            
            // Update navigation text
            this.updateNavigation();
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
        
        // Update navigation
        this.updateNavigation();
    }
    
    updateNavigation() {
        const navTranslations = translations[this.currentLang].nav;
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            const key = link.pathname === '/' ? 'home' : link.pathname.slice(1);
            if (navTranslations[key]) {
                link.textContent = navTranslations[key];
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
                    <h1>${t.title}</h1>
                    <p>${t.subtitle}</p>
                    <div class="cta-buttons">
                        <a href="/login" class="btn btn-light">${t.login}</a>
                        <a href="/register" class="btn btn-light">${t.register}</a>
                    </div>
                </div>
            </section>
            <section class="features-section">
                <div class="features-content">
                    <h2 class="features-title">${t.featuresTitle}</h2>
                    <p class="features-description">${t.featuresDescription}</p>
                    <div class="features-list">
                        <div class="feature-item">
                            <span class="feature-icon">→</span>
                            <p>${t.feature1}</p>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">→</span>
                            <p>${t.feature2}</p>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">→</span>
                            <p>${t.feature3}</p>
                        </div>
                    </div>
                    <a href="/services" class="features-link">${t.allServices} →</a>
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
                <h1>${t.title}</h1>
                <div class="services-grid">
                    <div class="service-card">
                        <h3>${t.service1.title}</h3>
                        <p>${t.service1.description}</p>
                    </div>
                    <div class="service-card">
                        <h3>${t.service2.title}</h3>
                        <p>${t.service2.description}</p>
                    </div>
                    <div class="service-card">
                        <h3>${t.service3.title}</h3>
                        <p>${t.service3.description}</p>
                    </div>
                </div>
            </section>
        `;
    },
    '/portfolio': async (lang) => {
        const t = translations[lang].portfolio;
        return `
            <section class="page-content">
                <h1>${t.title}</h1>
                <p>${t.description}</p>
            </section>
        `;
    },
    '/team': async (lang) => {
        const t = translations[lang].team;
        return `
            <section class="page-content">
                <h1>${t.title}</h1>
                <p>${t.description}</p>
            </section>
        `;
    },
    '/prices': async (lang) => {
        const t = translations[lang].prices;
        return `
            <section class="page-content">
                <h1>${t.title}</h1>
                <p>${t.description}</p>
            </section>
        `;
    },
    '/contact': async (lang) => {
        const t = translations[lang].contact;
        return `
            <section class="page-content">
                <h1>${t.title}</h1>
                <p>${t.description}</p>
            </section>
        `;
    },
    '/login': async (lang) => {
        const t = translations[lang].auth.login;
        return `
            <section class="auth-section">
                <h1>${t.title}</h1>
                <form class="auth-form" id="loginForm">
                    <div class="form-group">
                        <label for="username">${t.username}</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">${t.password}</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">${t.submit}</button>
                </form>
            </section>
        `;
    },
    '/register': async (lang) => {
        const t = translations[lang].auth.register;
        return `
            <section class="auth-section">
                <h1>${t.title}</h1>
                <form class="auth-form" id="registerForm">
                    <div class="form-group">
                        <label for="username">${t.username}</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="email">${t.email}</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">${t.password}</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">${t.submit}</button>
                </form>
            </section>
        `;
    }
};

// Initialize router
const router = new Router(routes); 
