// Simple client-side router
class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentPath = '';
        
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
        });
    }
    
    async handleRoute() {
        const path = window.location.pathname;
        if (path === this.currentPath) return;
        
        this.currentPath = path;
        const route = this.routes[path] || this.routes['/'];
        
        try {
            const content = await route();
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
}

// Define route handlers
const routes = {
    '/': async () => `
        <section class="hero-banner">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1>We connect here, we meet everywhere.</h1>
                <p>Welcome to MeetHere, our social site that connects you with other people and helps you to make new friends.</p>
                <div class="cta-buttons">
                    <a href="/login" class="btn btn-light">Login</a>
                    <a href="/register" class="btn btn-light">User registration</a>
                </div>
            </div>
        </section>
        <section class="features-section">
            <div class="features-content">
                <h2 class="features-title">"Connect Locally, Meet Globally"</h2>
                <p class="features-description">MeetHere is an innovative social networking platform that allows you to connect with other users</p>
                <div class="features-list">
                    <div class="feature-item">
                        <span class="feature-icon">→</span>
                        <p>Event planning and promotion</p>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">→</span>
                        <p>Community engagement management</p>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">→</span>
                        <p>Social media analytics tracking</p>
                    </div>
                </div>
                <a href="/services" class="features-link">All services →</a>
            </div>
            <div class="features-image">
                <img src="https://via.placeholder.com/500x350/0000FF/FFFFFF?text=Event+Photo" alt="Event Photo">
            </div>
        </section>
    `,
    '/services': async () => `
        <section class="page-content">
            <h1>Наши услуги</h1>
            <div class="services-grid">
                <div class="service-card">
                    <h3>Event Planning</h3>
                    <p>Professional event planning and coordination services.</p>
                </div>
                <div class="service-card">
                    <h3>Community Management</h3>
                    <p>Expert community engagement and growth strategies.</p>
                </div>
                <div class="service-card">
                    <h3>Analytics</h3>
                    <p>Comprehensive social media analytics and reporting.</p>
                </div>
            </div>
        </section>
    `,
    '/portfolio': async () => `
        <section class="page-content">
            <h1>Наши работы</h1>
            <p>Ознакомьтесь с нашими успешными проектами и мероприятиями.</p>
        </section>
    `,
    '/team': async () => `
        <section class="page-content">
            <h1>Наша команда</h1>
            <p>Познакомьтесь с удивительными людьми, стоящими за MeetHere.</p>
        </section>
    `,
    '/prices': async () => `
        <section class="page-content">
            <h1>Прайс-лист</h1>
            <p>Изучите наши конкурентные ценовые предложения.</p>
        </section>
    `,
    '/contact': async () => `
        <section class="page-content">
            <h1>Контакты</h1>
            <p>Свяжитесь с нашей командой.</p>
        </section>
    `,
    '/login': async () => `
        <section class="auth-section">
            <h1>Вход</h1>
            <form class="auth-form" id="loginForm">
                <div class="form-group">
                    <label for="username">Имя пользователя</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Пароль</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Войти</button>
            </form>
        </section>
    `,
    '/register': async () => `
        <section class="auth-section">
            <h1>Регистрация</h1>
            <form class="auth-form" id="registerForm">
                <div class="form-group">
                    <label for="username">Имя пользователя</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Пароль</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Зарегистрироваться</button>
            </form>
        </section>
    `
};

// Initialize router
const router = new Router(routes); 
