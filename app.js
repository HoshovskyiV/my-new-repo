// Головний компонент App
function App() {
    const [activeSection, setActiveSection] = React.useState('intro');

    return (
        <div className="app-container fade-in">
            <h1 className="typing-effect">Studia.photo - Тестовий React Сайт</h1>
            
            <div className="button-container" style={{ marginBottom: '1.5rem' }}>
                <button onClick={() => window.location.href='/'} className="active">Головна</button>
                <button onClick={() => window.location.href='/services'}>Послуги</button>
                <button onClick={() => window.location.href='/contact'}>Контакти</button>
                <button onClick={() => window.location.href='/chatbot'}>AI Помічник</button>
            </div>
            
            <div className="button-container">
                <button onClick={() => setActiveSection('intro')}>Вступ</button>
                <button onClick={() => setActiveSection('counter')}>Лічильник</button>
                <button onClick={() => setActiveSection('animation')}>Анімація</button>
                <button onClick={() => setActiveSection('colors')}>Кольори</button>
            </div>
            
            {activeSection === 'intro' && <IntroSection />}
            {activeSection === 'counter' && <CounterSection />}
            {activeSection === 'animation' && <AnimationSection />}
            {activeSection === 'colors' && <ColorSection />}
        </div>
    );
}

// Компонент вступу з ефектом набору тексту
function IntroSection() {
    const [isVisible, setIsVisible] = React.useState(false);
    
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 500);
        
        return () => clearTimeout(timer);
    }, []);
    
    return (
        <div className={`card ${isVisible ? 'fade-in' : ''}`}>
            <h2>Вітаємо на сайті Studia.photo!</h2>
            <p style={{ marginTop: '1rem' }}>
                Цей сайт демонструє різні ефекти та анімації, які можна створити за допомогою React.
                Виберіть один з розділів вище, щоб побачити різні ефекти в дії.
            </p>
            <p style={{ marginTop: '1rem' }}>
                Усі компоненти використовують React хуки, такі як useState і useEffect,
                для керування станом та життєвим циклом компонентів.
            </p>
            <p style={{ marginTop: '1rem' }}>
                Відвідайте сторінку <a href="/services" style={{ color: '#5a67d8', textDecoration: 'underline' }}>послуг</a>, 
                щоб дізнатися більше про те, що ми пропонуємо, або сторінку 
                <a href="/contact" style={{ color: '#5a67d8', textDecoration: 'underline' }}> контактів</a>, 
                щоб зв'язатися з нами.
            </p>
            <p style={{ marginTop: '1rem' }}>
                <a href="/chatbot" style={{ color: '#5a67d8', textDecoration: 'underline' }}>Спробуйте наш AI помічник</a> на основі 
                Google Gemini - він відповість на ваші запитання про нашу студію!
            </p>
        </div>
    );
}

// Компонент лічильника з анімацією зміни значення
function CounterSection() {
    const [count, setCount] = React.useState(0);
    const [isPulsing, setIsPulsing] = React.useState(false);
    
    const increment = () => {
        setCount(prevCount => prevCount + 1);
        animatePulse();
    };
    
    const decrement = () => {
        setCount(prevCount => prevCount - 1);
        animatePulse();
    };
    
    const reset = () => {
        setCount(0);
        animatePulse();
    };
    
    const animatePulse = () => {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 300);
    };
    
    return (
        <div className="card fade-in">
            <h2>Інтерактивний Лічильник</h2>
            <div 
                className="counter" 
                style={{ 
                    transform: isPulsing ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform 0.3s ease',
                    color: count > 0 ? '#4ade80' : count < 0 ? '#f87171' : 'white'
                }}
            >
                {count}
            </div>
            <div className="button-container">
                <button onClick={decrement}>-1</button>
                <button onClick={reset}>Скинути</button>
                <button onClick={increment}>+1</button>
            </div>
        </div>
    );
}

// Компонент з анімаціями елементів
function AnimationSection() {
    const [animation, setAnimation] = React.useState('');
    const [isAnimating, setIsAnimating] = React.useState(false);
    
    const playAnimation = (animName) => {
        setIsAnimating(false);
        setTimeout(() => {
            setAnimation(animName);
            setIsAnimating(true);
        }, 50);
    };
    
    const getAnimationStyle = () => {
        if (!isAnimating) return {};
        
        switch (animation) {
            case 'rotate':
                return { 
                    transform: 'rotate(360deg)',
                    transition: 'transform 1s ease'
                };
            case 'scale':
                return { 
                    transform: 'scale(1.5)',
                    transition: 'transform 0.5s ease'
                };
            case 'shake':
                return { 
                    animation: 'shake 0.5s ease',
                    keyframes: `
                        @keyframes shake {
                            0%, 100% { transform: translateX(0); }
                            25% { transform: translateX(-10px); }
                            50% { transform: translateX(10px); }
                            75% { transform: translateX(-10px); }
                        }
                    `
                };
            case 'bounce':
                return { 
                    animation: 'bounce 0.5s ease infinite alternate',
                    keyframes: `
                        @keyframes bounce {
                            from { transform: translateY(0); }
                            to { transform: translateY(-30px); }
                        }
                    `
                };
            default:
                return {};
        }
    };
    
    // Додаємо CSS анімації через стиль
    const boxStyle = {
        ...getAnimationStyle()
    };
    
    // Додаємо keyframes для нестандартних анімацій
    const keyframesStyle = animation === 'shake' || animation === 'bounce' 
        ? `<style>${getAnimationStyle().keyframes}</style>` 
        : '';
    
    return (
        <div className="card fade-in">
            <h2>Анімації</h2>
            <div dangerouslySetInnerHTML={{ __html: keyframesStyle }} />
            <div 
                className="animation-box" 
                style={boxStyle}
            ></div>
            <div className="button-container">
                <button onClick={() => playAnimation('rotate')}>Обертання</button>
                <button onClick={() => playAnimation('scale')}>Масштабування</button>
                <button onClick={() => playAnimation('shake')}>Трясіння</button>
                <button onClick={() => playAnimation('bounce')}>Стрибок</button>
            </div>
        </div>
    );
}

// Компонент з інтерактивною зміною кольорів
function ColorSection() {
    const [backgroundColor, setBackgroundColor] = React.useState('#ffffff');
    const [textVisible, setTextVisible] = React.useState(false);
    
    const colors = [
        { name: 'Червоний', hex: '#ef4444' },
        { name: 'Зелений', hex: '#10b981' },
        { name: 'Синій', hex: '#3b82f6' },
        { name: 'Жовтий', hex: '#f59e0b' },
        { name: 'Пурпуровий', hex: '#8b5cf6' }
    ];
    
    const changeColor = (color) => {
        setBackgroundColor(color.hex);
        setTextVisible(true);
        
        setTimeout(() => {
            setTextVisible(false);
        }, 2000);
    };
    
    return (
        <div className="card fade-in">
            <h2>Зміна Кольорів</h2>
            <p>Натисніть на один із кольорів нижче:</p>
            
            <div className="animation-box" style={{ backgroundColor, transition: 'background-color 0.5s ease' }}>
                {textVisible && (
                    <div 
                        style={{ 
                            display: 'flex', 
                            height: '100%', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: backgroundColor === '#ffffff' ? '#000' : '#fff',
                            fontWeight: 'bold',
                            textShadow: '0 0 5px rgba(0,0,0,0.3)'
                        }}
                    >
                        {backgroundColor}
                    </div>
                )}
            </div>
            
            <div className="color-box">
                {colors.map((color) => (
                    <div 
                        key={color.hex}
                        className="color-item"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => changeColor(color)}
                        title={color.name}
                    ></div>
                ))}
            </div>
        </div>
    );
}

// Рендерінг додатку в DOM
ReactDOM.render(
    <App />,
    document.getElementById('root')
);
