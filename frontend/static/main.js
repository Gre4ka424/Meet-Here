// Ожидаем полной загрузки DOM перед выполнением скрипта
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация роутера
    const router = new Router();
    router.init();

    // Обработка мобильного меню
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            sidebar.classList.toggle('active');
        });
    }
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#' || !targetId) return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50,
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню при клике на ссылку
                if (mobileMenuToggle && mobileMenuToggle.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    sidebar.classList.remove('active');
                }
            }
        });
    });
    
    // Анимация при прокрутке страницы
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkIfInView() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('show');
            }
        });
    }
    
    // Проверяем видимость элементов при загрузке и прокрутке
    window.addEventListener('scroll', checkIfInView);
    checkIfInView();
    
    // Слайдер для отзывов
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const prevButton = document.querySelector('.testimonial-prev');
    const nextButton = document.querySelector('.testimonial-next');
    
    if (testimonialItems.length > 0) {
        let currentIndex = 0;
        
        function showTestimonial(index) {
            testimonialItems.forEach((item, i) => {
                item.style.transform = `translateX(${(i - index) * 100}%)`;
            });
        }
        
        function nextTestimonial() {
            currentIndex = (currentIndex + 1) % testimonialItems.length;
            showTestimonial(currentIndex);
        }
        
        function prevTestimonial() {
            currentIndex = (currentIndex - 1 + testimonialItems.length) % testimonialItems.length;
            showTestimonial(currentIndex);
        }
        
        // Инициализируем позиции слайдов
        showTestimonial(currentIndex);
        
        // Добавляем обработчики событий для кнопок навигации
        if (prevButton) prevButton.addEventListener('click', prevTestimonial);
        if (nextButton) nextButton.addEventListener('click', nextTestimonial);
        
        // Автоматическая прокрутка слайдов
        const autoSlideInterval = setInterval(nextTestimonial, 7000);
        
        // Останавливаем автоматическую прокрутку при наведении на слайдер
        const testimonialContainer = document.querySelector('.testimonials-container');
        if (testimonialContainer) {
            testimonialContainer.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
        }
    }
    
    // Уведомление о cookies
    const cookieNotice = document.querySelector('.cookie-notice');
    const cookieAcceptButton = document.querySelector('.cookie-accept');
    
    if (cookieNotice && cookieAcceptButton) {
        // Проверяем, было ли уже принято соглашение о cookies
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieNotice.classList.add('show');
            }, 1000);
            
            cookieAcceptButton.addEventListener('click', function() {
                cookieNotice.classList.remove('show');
                localStorage.setItem('cookiesAccepted', 'true');
            });
        }
    }
    
    // Валидация формы обратной связи
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация полей
            let isValid = true;
            const nameField = contactForm.querySelector('input[name="name"]');
            const emailField = contactForm.querySelector('input[name="email"]');
            const messageField = contactForm.querySelector('textarea[name="message"]');
            
            // Проверка имени
            if (!nameField.value.trim()) {
                markInvalid(nameField, 'Пожалуйста, введите ваше имя');
                isValid = false;
            } else {
                markValid(nameField);
            }
            
            // Проверка email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailField.value.trim() || !emailPattern.test(emailField.value)) {
                markInvalid(emailField, 'Пожалуйста, введите корректный email');
                isValid = false;
            } else {
                markValid(emailField);
            }
            
            // Проверка сообщения
            if (!messageField.value.trim()) {
                markInvalid(messageField, 'Пожалуйста, введите ваше сообщение');
                isValid = false;
            } else {
                markValid(messageField);
            }
            
            // Если форма валидна, отправляем её (здесь будет код отправки)
            if (isValid) {
                // Имитация отправки формы
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.textContent = 'Отправка...';
                
                // Имитация задержки отправки
                setTimeout(() => {
                    contactForm.reset();
                    submitButton.textContent = 'Отправлено!';
                    
                    // Возвращаем кнопке исходное состояние
                    setTimeout(() => {
                        submitButton.disabled = false;
                        submitButton.textContent = originalText;
                    }, 2000);
                    
                    // Показываем сообщение об успешной отправке
                    showMessage('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.', 'success');
                }, 1500);
            }
        });
        
        function markInvalid(field, message) {
            field.classList.add('invalid');
            
            // Удаляем предыдущее сообщение об ошибке, если оно есть
            const existingError = field.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Добавляем новое сообщение об ошибке
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = message;
            field.parentElement.appendChild(errorMessage);
        }
        
        function markValid(field) {
            field.classList.remove('invalid');
            
            // Удаляем сообщение об ошибке, если оно есть
            const existingError = field.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
        }
    }
    
    // Функция для показа сообщений пользователю
    function showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${type}`;
        messageElement.textContent = message;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }, 5000);
    }
    
    // Стилизация выбранного языка
    const languageSwitcher = document.querySelector('.language-switcher');
    if (languageSwitcher) {
        const languageButtons = languageSwitcher.querySelectorAll('button');
        
        languageButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Удаляем активный класс у всех кнопок
                languageButtons.forEach(btn => btn.classList.remove('active'));
                // Добавляем активный класс выбранной кнопке
                this.classList.add('active');
                
                // Здесь можно добавить логику для изменения языка сайта
                const language = this.dataset.lang;
                console.log(`Changing language to: ${language}`);
                // В реальном приложении здесь будет код для изменения текстов
            });
        });
    }
    
    // Добавление классов к элементам для анимации при прокрутке
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (!section.classList.contains('animate-on-scroll')) {
            section.classList.add('animate-on-scroll');
        }
    });
    
    // Счетчики статистики с анимацией
    const statItems = document.querySelectorAll('.stat-item h3');
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 секунды на анимацию
        const step = 25; // Обновление каждые 25мс
        
        let current = 0;
        const increment = target / (duration / step);
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, step);
    }
    
    // Обработчик для запуска анимации счетчиков при прокрутке до них
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        let countersAnimated = false;
        
        function checkStatsPosition() {
            if (!countersAnimated) {
                const statsSectionTop = statsSection.getBoundingClientRect().top;
                
                if (statsSectionTop < window.innerHeight * 0.8) {
                    statItems.forEach(animateCounter);
                    countersAnimated = true;
                    window.removeEventListener('scroll', checkStatsPosition);
                }
            }
        }
        
        window.addEventListener('scroll', checkStatsPosition);
        checkStatsPosition(); // Проверяем при загрузке страницы
    }
}); 
