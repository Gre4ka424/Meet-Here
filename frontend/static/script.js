// Получаем элементы DOM
const modal = document.getElementById('register-modal');
const registerBtn = document.getElementById('register-btn');
const registerLink = document.querySelector('.btn-register');
const closeBtn = document.querySelector('.close');
const registerForm = document.getElementById('register-form');

// API URL
const API_URL = 'http://localhost:8080';

// Открываем модальное окно при нажатии кнопки "Присоединиться"
registerBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Открываем модальное окно при нажатии на "Регистрация" в навигации
registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
});

// Закрываем модальное окно при нажатии на "×"
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Закрываем модальное окно при клике вне его содержимого
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Обрабатываем отправку формы регистрации
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Получаем данные из формы
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Отправляем данные на API
    try {
        const response = await fetch(`${API_URL}/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Если регистрация успешна
            alert(translations[currentLang].success_message);
            modal.style.display = 'none';
            registerForm.reset();
        } else {
            // Если есть ошибка
            alert(`${translations[currentLang].error_message}${data.detail || 'Unknown error'}`);
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        alert(translations[currentLang].server_error);
    }
});

// Основные функции для MeetHere сайта

// Обработка загрузки документа
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация куки-уведомления
    initCookieNotice();
    
    // Активация текущего пункта меню
    highlightCurrentPage();
    
    // Инициализация форм
    initForms();
    
    // Инициализация языкового переключателя
    initLanguageSwitcher();

    // Показ уведомления о cookies
    setTimeout(function() {
        const cookieNotice = document.querySelector('.cookie-notice');
        if (cookieNotice) {
            cookieNotice.classList.add('show');
        }
    }, 1000);

    // Обработка кнопки закрытия уведомления о cookies
    const cookieAcceptBtn = document.querySelector('.cookie-accept');
    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', function() {
            const cookieNotice = document.querySelector('.cookie-notice');
            if (cookieNotice) {
                cookieNotice.classList.remove('show');
                // Сохраняем в localStorage информацию о принятии cookies
                localStorage.setItem('cookiesAccepted', 'true');
            }
        });
    }

    // Проверка, было ли принято соглашение о cookies ранее
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        const cookieNotice = document.querySelector('.cookie-notice');
        if (cookieNotice) {
            cookieNotice.style.display = 'none';
        }
    }

    // Анимация появления элементов при прокрутке
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    // Функция для проверки, находится ли элемент в видимой области
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Функция для добавления класса анимации к видимым элементам
    function animateOnScroll() {
        animateElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('fadeIn')) {
                element.classList.add('fadeIn');
            }
        });
    }
    
    // Вызываем функцию при загрузке и при прокрутке
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Мобильное меню
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show-mobile');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Добавление активного класса к текущему пункту меню
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation === linkPath || 
            (currentLocation === '/' && linkPath === 'index.html') ||
            (currentLocation.includes(linkPath) && linkPath !== '/')) {
            link.classList.add('active');
        }
    });

    // Плавная прокрутка к секциям при клике на навигационные ссылки
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню после клика
                if (sidebar && sidebar.classList.contains('show-mobile')) {
                    sidebar.classList.remove('show-mobile');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.classList.remove('active');
                    }
                }
            }
        });
    });

    // Простой слайдер для отзывов
    const testimonials = document.querySelectorAll('.testimonial-item');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(item => {
            item.style.display = 'none';
        });
        
        if (testimonials[index]) {
            testimonials[index].style.display = 'block';
        }
    }
    
    if (testimonials.length > 0) {
        // Показываем первый отзыв
        showTestimonial(currentTestimonial);
        
        // Настройка кнопок слайдера
        const prevButton = document.querySelector('.testimonial-prev');
        const nextButton = document.querySelector('.testimonial-next');
        
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
                showTestimonial(currentTestimonial);
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                showTestimonial(currentTestimonial);
            });
        }
        
        // Автоматическая смена отзывов
        setInterval(function() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 8000);
    }

    // Форма обратной связи
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация формы
            const name = contactForm.querySelector('[name="name"]').value.trim();
            const email = contactForm.querySelector('[name="email"]').value.trim();
            const message = contactForm.querySelector('[name="message"]').value.trim();
            
            if (!name || !email || !message) {
                alert('Пожалуйста, заполните все поля формы');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Пожалуйста, введите корректный email адрес');
                return;
            }
            
            // Здесь будет код для отправки формы на сервер
            // В данном примере просто показываем сообщение
            alert('Спасибо! Ваше сообщение отправлено.');
            contactForm.reset();
        });
    }
    
    // Проверка валидности email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Анимированные числа в секции статистики
    const statNumbers = document.querySelectorAll('.stat-item h3');
    
    function animateNumbers() {
        statNumbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-target'), 10);
            const duration = 2000; // 2 секунды
            const startTime = Date.now();
            
            function updateNumber() {
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Используем нелинейную анимацию для более естественного эффекта
                const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentNumber = Math.floor(target * easedProgress);
                
                number.textContent = currentNumber.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                }
            }
            
            updateNumber();
        });
    }
    
    // Инициализация анимации чисел при прокрутке до секции статистики
    const statsSection = document.querySelector('.stats-section');
    
    if (statsSection && statNumbers.length > 0) {
        let animated = false;
        
        function checkIfInView() {
            if (animated) return;
            
            const rect = statsSection.getBoundingClientRect();
            const isInView = (rect.top <= window.innerHeight * 0.8);
            
            if (isInView) {
                animateNumbers();
                animated = true;
                window.removeEventListener('scroll', checkIfInView);
            }
        }
        
        window.addEventListener('scroll', checkIfInView);
        checkIfInView(); // Проверка при загрузке страницы
    }
});

// Функция для определения и подсветки текущей страницы в навигации
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Для главной страницы
        if (currentPath.endsWith('/') || currentPath.endsWith('index.html')) {
            if (href === 'index.html' || href === './' || href === '/') {
                link.classList.add('active');
            }
        } 
        // Для других страниц
        else if (currentPath.includes(href) && href !== 'index.html' && href !== './' && href !== '/') {
            link.classList.add('active');
        }
    });
}

// Функция для инициализации и обработки куки-уведомления
function initCookieNotice() {
    const cookieNotice = document.querySelector('.cookie-notice');
    const acceptButton = document.querySelector('.btn-accept');
    
    // Проверка, были ли куки приняты ранее
    if (cookieNotice && acceptButton) {
        if (localStorage.getItem('cookiesAccepted') !== 'true') {
            cookieNotice.style.display = 'flex';
        } else {
            cookieNotice.style.display = 'none';
        }
        
        // Обработчик клика по кнопке принятия
        acceptButton.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieNotice.style.display = 'none';
        });
    }
}

// Функция для инициализации форм
function initForms() {
    // Контактная форма
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получение значений полей
            const name = contactForm.querySelector('[name="name"]').value.trim();
            const email = contactForm.querySelector('[name="email"]').value.trim();
            const message = contactForm.querySelector('[name="message"]').value.trim();
            
            // Простая валидация
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Имитация отправки формы
            alert('Thank you for your message! We will contact you soon.');
            contactForm.reset();
        });
    }
    
    // Форма регистрации (если есть)
    const registrationForm = document.querySelector('.registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получение значений полей
            const username = registrationForm.querySelector('[name="username"]').value.trim();
            const email = registrationForm.querySelector('[name="email"]').value.trim();
            const password = registrationForm.querySelector('[name="password"]').value;
            const confirmPassword = registrationForm.querySelector('[name="confirm-password"]').value;
            
            // Простая валидация
            if (!username || !email || !password) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }
            
            // Имитация регистрации
            alert('Registration successful! Welcome to MeetHere.');
            registrationForm.reset();
        });
    }
}

// Функция для инициализации языкового переключателя
function initLanguageSwitcher() {
    // Языковые настройки - для демонстрации
    const translations = {
        'en': {
            'welcome': 'Welcome to MeetHere',
            'subheading': 'Connect with your community',
            'join-btn': 'Join Now',
            'learn-more': 'Learn More',
            'cookie-notice': 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
            'accept': 'Accept'
        },
        'ru': {
            'welcome': 'Добро пожаловать в MeetHere',
            'subheading': 'Общайтесь с вашим сообществом',
            'join-btn': 'Присоединиться',
            'learn-more': 'Узнать больше',
            'cookie-notice': 'Мы используем файлы cookie для улучшения вашего опыта. Продолжая посещать этот сайт, вы соглашаетесь с использованием файлов cookie.',
            'accept': 'Принять'
        },
        'el': {
            'welcome': 'Καλώς ήρθατε στο MeetHere',
            'subheading': 'Συνδεθείτε με την κοινότητά σας',
            'join-btn': 'Εγγραφή τώρα',
            'learn-more': 'Μάθετε περισσότερα',
            'cookie-notice': 'Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σας. Συνεχίζοντας την επίσκεψη σε αυτόν τον ιστότοπο, συμφωνείτε με τη χρήση των cookies.',
            'accept': 'Αποδοχή'
        }
    };
    
    // Проверяем наличие элементов для языкового переключателя
    const languageBtns = document.querySelectorAll('.language-switcher a');
    if (languageBtns.length > 0) {
        // Получение сохраненного языка или установка языка по умолчанию
        const currentLang = localStorage.getItem('selectedLanguage') || 'en';
        
        // Применение текущего языка при загрузке страницы
        applyLanguage(currentLang, translations);
        
        // Подсветка активного языка
        highlightActiveLanguage(currentLang);
        
        // Добавление обработчиков событий для кнопок переключения языка
        languageBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                
                // Сохранение выбранного языка
                localStorage.setItem('selectedLanguage', lang);
                
                // Применение нового языка
                applyLanguage(lang, translations);
                
                // Подсветка активного языка
                highlightActiveLanguage(lang);
            });
        });
    }
}

// Функция для применения языка ко всем элементам с атрибутом data-lang-key
function applyLanguage(lang, translations) {
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// Функция для подсветки активного языка
function highlightActiveLanguage(currentLang) {
    document.querySelectorAll('.language-switcher a').forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Добавление возможности открытия модального окна (если есть)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        
        // Обработчик для закрытия модального окна
        modal.querySelector('.close').addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Закрытие по клику за пределами модального окна
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Функция для отображения уведомлений
function showNotification(message, type = 'success') {
    // Создание элемента уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Добавление в DOM
    document.body.appendChild(notification);
    
    // Удаление через 3 секунды
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Экспорт функций для использования в других скриптах
window.MeetHere = {
    openModal,
    showNotification
}; 