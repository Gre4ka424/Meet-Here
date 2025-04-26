// Словарь переводов для всех поддерживаемых языков
const translations = {
    en: {
        // Навигация
        nav_home: "Home",
        nav_about: "About",
        nav_contacts: "Contacts",
        nav_register: "Register",
        
        // Секция Hero
        hero_title: "Welcome to MeetHere",
        hero_subtitle: "A place where people meet, communicate and find like-minded individuals",
        hero_button: "Join Now",
        
        // Секция особенностей
        why_meethere: "Why MeetHere?",
        feature1_title: "Connections",
        feature1_text: "Meet new people and make valuable connections",
        feature2_title: "Communication",
        feature2_text: "Chat with like-minded people on topics that interest you",
        feature3_title: "Communities",
        feature3_text: "Create groups and join existing communities",
        
        // Модальное окно регистрации
        register_title: "Registration",
        register_name: "Name",
        register_email: "Email",
        register_password: "Password",
        register_button: "Register",
        
        // Футер
        footer_rights: "All rights reserved.",
        
        // Уведомления
        success_message: "Registration successful!",
        error_message: "Error: ",
        server_error: "An error occurred while sending data. Please try again later."
    },
    
    ru: {
        // Навигация
        nav_home: "Главная",
        nav_about: "О нас",
        nav_contacts: "Контакты",
        nav_register: "Регистрация",
        
        // Секция Hero
        hero_title: "Добро пожаловать на MeetHere",
        hero_subtitle: "Место, где люди встречаются, общаются и находят единомышленников",
        hero_button: "Присоединиться",
        
        // Секция особенностей
        why_meethere: "Почему MeetHere?",
        feature1_title: "Знакомства",
        feature1_text: "Встречайте новых людей и заводите полезные знакомства",
        feature2_title: "Общение",
        feature2_text: "Общайтесь с единомышленниками на интересующие вас темы",
        feature3_title: "Сообщества",
        feature3_text: "Создавайте группы и присоединяйтесь к существующим сообществам",
        
        // Модальное окно регистрации
        register_title: "Регистрация",
        register_name: "Имя",
        register_email: "Email",
        register_password: "Пароль",
        register_button: "Зарегистрироваться",
        
        // Футер
        footer_rights: "Все права защищены.",
        
        // Уведомления
        success_message: "Регистрация прошла успешно!",
        error_message: "Ошибка: ",
        server_error: "Произошла ошибка при отправке данных. Пожалуйста, попробуйте позже."
    },
    
    el: {
        // Навигация
        nav_home: "Αρχική",
        nav_about: "Σχετικά με εμάς",
        nav_contacts: "Επικοινωνία",
        nav_register: "Εγγραφή",
        
        // Секция Hero
        hero_title: "Καλώς ήρθατε στο MeetHere",
        hero_subtitle: "Ένα μέρος όπου οι άνθρωποι συναντιούνται, επικοινωνούν και βρίσκουν ομοϊδεάτες",
        hero_button: "Συμμετοχή τώρα",
        
        // Секция особенностей
        why_meethere: "Γιατί το MeetHere;",
        feature1_title: "Συνδέσεις",
        feature1_text: "Γνωρίστε νέους ανθρώπους και κάντε πολύτιμες γνωριμίες",
        feature2_title: "Επικοινωνία",
        feature2_text: "Συνομιλήστε με ομοϊδεάτες για θέματα που σας ενδιαφέρουν",
        feature3_title: "Κοινότητες",
        feature3_text: "Δημιουργήστε ομάδες και συμμετάσχετε σε υπάρχουσες κοινότητες",
        
        // Модальное окно регистрации
        register_title: "Εγγραφή",
        register_name: "Όνομα",
        register_email: "Email",
        register_password: "Κωδικός πρόσβασης",
        register_button: "Εγγραφή",
        
        // Футер
        footer_rights: "Με επιφύλαξη παντός δικαιώματος.",
        
        // Уведомления
        success_message: "Η εγγραφή ολοκληρώθηκε με επιτυχία!",
        error_message: "Σφάλμα: ",
        server_error: "Παρουσιάστηκε σφάλμα κατά την αποστολή δεδομένων. Παρακαλώ δοκιμάστε αργότερα."
    }
};

// Установить язык из localStorage или использовать английский по умолчанию
let currentLang = localStorage.getItem('language') || 'en';

// Функция для обновления всех текстов на странице
function updatePageLanguage() {
    document.documentElement.lang = currentLang;
    
    // Находит все элементы с атрибутом data-lang-key и обновляет их содержимое
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
    
    // Выделяет активный язык
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Устанавливаем обработчики событий после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Обновляем язык при загрузке страницы
    updatePageLanguage();
    
    // Добавляем обработчики для кнопок переключения языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            currentLang = btn.getAttribute('data-lang');
            localStorage.setItem('language', currentLang);
            updatePageLanguage();
        });
    });
}); 