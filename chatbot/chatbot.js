// Конфігурація API
const API_KEY = "AIzaSyBEibG7-99fu1R9dn1VYTEk5F0_cZqa6-E"; // Ваш Gemini API ключ

// Ініціалізація Google Generative AI
const genAI = new window.GoogleGenerativeAI(API_KEY);

// Історія чату
let chatHistory = [];

// DOM елементи
const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Обробник події для кнопки надсилання
sendButton.addEventListener('click', handleSendMessage);

// Обробник події для клавіші Enter
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});

// Функція обробки надсилання повідомлення
async function handleSendMessage() {
    const userMessage = userInput.value.trim();
    
    if (!userMessage) return;
    
    // Додати повідомлення користувача до чату
    addMessageToChat('user', userMessage);
    
    // Очистити поле вводу
    userInput.value = '';
    
    try {
        // Додати індикатор завантаження
        const loadingIndicator = addLoadingIndicator();
        
        // Оновити історію чату
        chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });
        
        // Отримати відповідь від Gemini
        const response = await getGeminiResponse(userMessage);
        
        // Видалити індикатор завантаження
        if (loadingIndicator) {
            chatArea.removeChild(loadingIndicator);
        }
        
        // Додати відповідь до чату
        addMessageToChat('bot', response);
        
        // Оновити історію чату
        chatHistory.push({ role: 'model', parts: [{ text: response }] });
    } catch (error) {
        console.error('Помилка отримання відповіді:', error);
        
        // Видалити індикатор завантаження, якщо він існує
        const loadingIndicator = document.querySelector('.bot.loading');
        if (loadingIndicator) {
            chatArea.removeChild(loadingIndicator);
        }
        
        // Додати повідомлення про помилку
        addMessageToChat('bot error', 'Вибачте, сталася помилка. Будь ласка, спробуйте ще раз пізніше.');
    }
    
    // Прокрутити чат до останнього повідомлення
    scrollToBottom();
}

// Функція для отримання відповіді від Gemini
async function getGeminiResponse(message) {
    try {
        // Ініціалізація моделі Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Створення чату
        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                temperature: 0.7,
                topK: 32,
                topP: 0.95,
                maxOutputTokens: 1024,
            },
        });
        
        // Отримання відповіді
        const result = await chat.sendMessage(message);
        const response = result.response;
        
        return response.text();
    } catch (error) {
        console.error('Помилка Gemini API:', error);
        throw error;
    }
}

// Функція додавання повідомлення до чату
function addMessageToChat(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    messageDiv.appendChild(messageContent);
    chatArea.appendChild(messageDiv);
    
    // Додати часову мітку
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = getCurrentTime();
    messageContent.appendChild(timeDiv);
    
    return messageDiv;
}

// Функція додавання індикатора завантаження
function addLoadingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot loading';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const loadingAnimation = document.createElement('div');
    loadingAnimation.className = 'loading-animation';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = 'loading-dot';
        loadingAnimation.appendChild(dot);
    }
    
    messageContent.appendChild(loadingAnimation);
    messageDiv.appendChild(messageContent);
    chatArea.appendChild(messageDiv);
    
    scrollToBottom();
    
    return messageDiv;
}

// Функція отримання поточного часу
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Функція прокрутки чату до останнього повідомлення
function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Початкова підготовка системної інструкції для Gemini
async function initChat() {
    // Встановити системну інструкцію
    const systemInstruction = `Ти помічник студії фотографії studia.photo. Ти допомагаєш відповідати на запитання відвідувачів щодо послуг, цін та контактної інформації студії. 
    
    Базова інформація:
    - Студія пропонує послуги фотозйомки (портретна, весільна, комерційна, предметна, архітектурна) та дизайну (веб-дизайн, графічний дизайн, брендинг, упаковка, постобробка фотографій)
    - Адреса: м. Київ, вул. Хрещатик, 1
    - Телефон: +380 (44) 123-45-67
    - Email: info@studia.photo
    - Години роботи: Пн-Пт, 9:00 - 18:00
    
    Намагайся давати короткі, але інформативні відповіді. Будь ввічливим та дружелюбним. Якщо не знаєш відповідь, запропонуй зв'язатися з нами напряму.`;
    
    try {
        // Ініціалізація моделі Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Встановити системну інструкцію в історію чату
        chatHistory.push({ role: 'user', parts: [{ text: systemInstruction }] });
        
        // Отримати відповідь моделі для підтвердження, що інструкція працює
        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 256,
            },
        });
        
        const result = await chat.sendMessage("Підтвердь, що ти отримав інструкцію (відповідай коротко)");
        
        // Додати відповідь до історії чату та видалити тестові повідомлення
        chatHistory = [];
        chatHistory.push({ role: 'system', parts: [{ text: systemInstruction }] });
        
        console.log("Чатбот успішно ініціалізований!");
    } catch (error) {
        console.error("Помилка при ініціалізації чатбота:", error);
    }
}

// Ініціалізувати чатбот при завантаженні сторінки
window.addEventListener('DOMContentLoaded', () => {
    initChat();
});
