// Global Variables
let ecoCoins = parseInt(localStorage.getItem('ecoCoins')) || 0;
let currentLanguage = localStorage.getItem('language') || 'en';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateEcoCoinsDisplay();
    setLanguage(currentLanguage);
    initializeEventListeners();
    initializeFooter();
    initializeMultimedia();
});

// Eco-Coins System
function updateEcoCoinsDisplay() {
    const ecoCoinsElement = document.getElementById('ecoCoins');
    if (ecoCoinsElement) {
        ecoCoinsElement.textContent = ecoCoins;
    }
}

function addEcoCoins(amount, reason) {
    ecoCoins += amount;
    localStorage.setItem('ecoCoins', ecoCoins);
    updateEcoCoinsDisplay();
    showNotification(`+${amount} Eco-Coins earned! ${reason}`, 'success');
}

function spendEcoCoins(amount, reason) {
    if (ecoCoins >= amount) {
        ecoCoins -= amount;
        localStorage.setItem('ecoCoins', ecoCoins);
        updateEcoCoinsDisplay();
        showNotification(`-${amount} Eco-Coins spent on ${reason}`, 'info');
        return true;
    } else {
        showNotification('Insufficient Eco-Coins!', 'error');
        return false;
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('.notification-styles')) {
        const styles = document.createElement('style');
        styles.className = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(15px);
                padding: 15px 25px;
                border-radius: 25px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 500;
                animation: slideInDown 0.3s ease-out, slideOutUp 0.3s ease-in 2.7s forwards;
            }
            .notification.success { border-left: 4px solid #4CAF50; color: #2E7D32; }
            .notification.error { border-left: 4px solid #F44336; color: #C62828; }
            .notification.info { border-left: 4px solid #2196F3; color: #1565C0; }
            @keyframes slideInDown {
                from { transform: translate(-50%, -100%); opacity: 0; }
                to { transform: translate(-50%, 0); opacity: 1; }
            }
            @keyframes slideOutUp {
                from { transform: translate(-50%, 0); opacity: 1; }
                to { transform: translate(-50%, -100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Language System
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    const elements = document.querySelectorAll(`[data-${lang}]`);
    elements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });
    
    const inputs = document.querySelectorAll(`[data-${lang}-placeholder]`);
    inputs.forEach(input => {
        const placeholder = input.getAttribute(`data-${lang}-placeholder`);
        if (placeholder) {
            input.placeholder = placeholder;
        }
    });
    
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = lang;
    }
}

// Weather API Integration
async function fetchWeatherData(city) {
    try {
        // For demo purposes, using mock data
        // In production, replace with actual API call
        const mockWeatherData = {
            'Ranchi': { temp: 28, condition: 'Clear Sky', humidity: 65, windSpeed: 12 },
            'Jamshedpur': { temp: 32, condition: 'Partly Cloudy', humidity: 70, windSpeed: 8 },
            'Dhanbad': { temp: 30, condition: 'Sunny', humidity: 60, windSpeed: 10 },
            'Bokaro': { temp: 29, condition: 'Clear Sky', humidity: 68, windSpeed: 15 }
        };
        
        return mockWeatherData[city] || mockWeatherData['Ranchi'];
    } catch (error) {
        console.error('Weather fetch error:', error);
        return { temp: '--', condition: 'Unable to fetch', humidity: '--', windSpeed: '--' };
    }
}

// Trip Budget Planner
function calculateTripBudget() {
    const destination = document.getElementById('destination')?.value;
    const duration = parseInt(document.getElementById('duration')?.value) || 1;
    const travelers = parseInt(document.getElementById('travelers')?.value) || 1;
    const budgetType = document.getElementById('budgetType')?.value || 'medium';
    
    if (!destination) {
        showNotification('Please select a destination', 'error');
        return;
    }
    
    const budgetRates = {
        low: { accommodation: 800, food: 500, transport: 300, activities: 400 },
        medium: { accommodation: 1500, food: 800, transport: 600, activities: 700 },
        high: { accommodation: 3000, food: 1200, transport: 1000, activities: 1200 }
    };
    
    const rates = budgetRates[budgetType];
    const totalAccommodation = rates.accommodation * duration * travelers;
    const totalFood = rates.food * duration * travelers;
    const totalTransport = rates.transport * travelers;
    const totalActivities = rates.activities * duration * travelers;
    const grandTotal = totalAccommodation + totalFood + totalTransport + totalActivities;
    
    displayBudgetResult({
        accommodation: totalAccommodation,
        food: totalFood,
        transport: totalTransport,
        activities: totalActivities,
        total: grandTotal,
        destination,
        duration,
        travelers
    });
    
    addEcoCoins(5, 'Planning eco-friendly trip');
}

function displayBudgetResult(budget) {
    const resultDiv = document.getElementById('budgetResult');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <h4>Trip Budget for ${budget.destination}</h4>
            <div class="budget-item">
                <span>Accommodation (${budget.duration} days):</span>
                <span>₹${budget.accommodation.toLocaleString()}</span>
            </div>
            <div class="budget-item">
                <span>Food & Dining:</span>
                <span>₹${budget.food.toLocaleString()}</span>
            </div>
            <div class="budget-item">
                <span>Transportation:</span>
                <span>₹${budget.transport.toLocaleString()}</span>
            </div>
            <div class="budget-item">
                <span>Activities & Sightseeing:</span>
                <span>₹${budget.activities.toLocaleString()}</span>
            </div>
            <div class="budget-total">
                <span>Total Budget:</span>
                <span>₹${budget.total.toLocaleString()}</span>
            </div>
            <p style="margin-top: 15px; font-size: 14px; opacity: 0.8;">
                *Estimated costs for ${budget.travelers} traveler(s). Actual costs may vary.
            </p>
        `;
        resultDiv.style.display = 'block';
    }
}

// Souvenir Scanner
function initSouvenirScanner() {
    const modal = document.getElementById('scannerModal');
    if (modal) {
        modal.style.display = 'flex';
        startCamera();
    }
}

function startCamera() {
    const video = document.getElementById('scannerVideo');
    if (video && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
                video.play();
                // Simulate scanning after 3 seconds
                setTimeout(() => {
                    simulateScan();
                }, 3000);
            })
            .catch(err => {
                console.error('Camera access error:', err);
                showNotification('Camera access denied', 'error');
                closeScannerModal();
            });
    }
}

function simulateScan() {
    const souvenirs = [
        { name: 'Dokra Art', coins: 15, description: 'Traditional metal craft' },
        { name: 'Sohrai Painting', coins: 12, description: 'Tribal wall art' },
        { name: 'Bamboo Craft', coins: 10, description: 'Eco-friendly handicraft' },
        { name: 'Tribal Jewelry', coins: 18, description: 'Authentic tribal ornaments' }
    ];
    
    const randomSouvenir = souvenirs[Math.floor(Math.random() * souvenirs.length)];
    
    document.getElementById('scanResult').innerHTML = `
        <h4>Souvenir Detected!</h4>
        <p><strong>${randomSouvenir.name}</strong></p>
        <p>${randomSouvenir.description}</p>
        <p>Earn ${randomSouvenir.coins} Eco-Coins by purchasing authentic Jharkhand handicrafts!</p>
    `;
    
    addEcoCoins(randomSouvenir.coins, `Scanning ${randomSouvenir.name}`);
    
    setTimeout(() => {
        closeScannerModal();
    }, 3000);
}

function closeScannerModal() {
    const modal = document.getElementById('scannerModal');
    const video = document.getElementById('scannerVideo');
    
    if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
    
    if (modal) {
        modal.style.display = 'none';
    }
}

// Future Footprint Calculator
async function calculateFootprint() {
    const fromLocation = document.getElementById('fromLocation')?.value;
    const toLocation = document.getElementById('toLocation')?.value;
    
    if (!fromLocation || !toLocation) {
        showNotification('Please enter both locations', 'error');
        return;
    }
    
    // Mock distance calculation (in production, use Google Maps API)
    const distances = {
        'Ranchi-Jamshedpur': 130,
        'Ranchi-Dhanbad': 160,
        'Ranchi-Bokaro': 110,
        'Jamshedpur-Dhanbad': 90,
        'Jamshedpur-Bokaro': 120,
        'Dhanbad-Bokaro': 70
    };
    
    const routeKey = `${fromLocation}-${toLocation}`;
    const reverseKey = `${toLocation}-${fromLocation}`;
    const distance = distances[routeKey] || distances[reverseKey] || 100;
    
    const transportOptions = [
        { mode: 'Train', cost: distance * 0.5, time: Math.round(distance / 50), eco: 'Most Eco-Friendly' },
        { mode: 'Bus', cost: distance * 0.8, time: Math.round(distance / 40), eco: 'Eco-Friendly' },
        { mode: 'Shared Taxi', cost: distance * 1.2, time: Math.round(distance / 60), eco: 'Moderate' },
        { mode: 'Private Car', cost: distance * 2, time: Math.round(distance / 70), eco: 'Less Eco-Friendly' }
    ];
    
    displayFootprintResult(distance, transportOptions, fromLocation, toLocation);
    addEcoCoins(3, 'Calculating eco-friendly routes');
}

function displayFootprintResult(distance, options, from, to) {
    const resultDiv = document.getElementById('footprintResult');
    if (resultDiv) {
        let optionsHTML = options.map(option => `
            <div class="transport-option">
                <div class="option-header">
                    <strong>${option.mode}</strong>
                    <span class="eco-rating ${option.eco.toLowerCase().replace(/\s+/g, '-')}">${option.eco}</span>
                </div>
                <div class="option-details">
                    <span>Cost: ₹${option.cost.toFixed(0)}</span>
                    <span>Time: ${option.time}h</span>
                </div>
            </div>
        `).join('');
        
        resultDiv.innerHTML = `
            <h4>Route: ${from} to ${to}</h4>
            <p><strong>Distance:</strong> ${distance} km</p>
            <div class="transport-options">
                ${optionsHTML}
            </div>
            <p style="margin-top: 15px; font-size: 14px; opacity: 0.8;">
                Choose eco-friendly transport options to earn more Eco-Coins!
            </p>
        `;
        resultDiv.style.display = 'block';
    }
}

// Contact Form Handler
function submitContactForm(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('contactName')?.value,
        email: document.getElementById('contactEmail')?.value,
        phone: document.getElementById('contactPhone')?.value,
        message: document.getElementById('contactMessage')?.value
    };
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        addEcoCoins(5, 'Contacting for eco-tourism');
        
        // Reset form
        if (event.target) {
            event.target.reset();
        }
    }, 1000);
}

// Festival Data
const festivals = [
    {
        name: 'Sarhul',
        date: 'March-April',
        description: 'Spring festival celebrating nature and new beginnings',
        image: 'images/sohrai.webp',
        significance: 'Worship of trees and nature'
    },
    {
        name: 'Karma',
        date: 'August-September',
        description: 'Harvest festival dedicated to Karma tree',
        image: 'images/sohrai.avif',
        significance: 'Celebration of brotherhood and prosperity'
    },
    {
        name: 'Sohrai',
        date: 'October-November',
        description: 'Cattle festival with beautiful wall paintings',
        image: 'images/sohrai.webp',
        significance: 'Honoring cattle and livestock'
    },
    {
        name: 'Tusu Parab',
        date: 'December-January',
        description: 'Winter festival celebrating harvest',
        image: 'images/sohrai.avif',
        significance: 'Thanksgiving for good harvest'
    }
];

// Initialize Event Listeners
function initializeEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Form submissions
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', submitContactForm);
    }
    
    // Scanner modal close
    const scannerModal = document.getElementById('scannerModal');
    if (scannerModal) {
        scannerModal.addEventListener('click', (e) => {
            if (e.target === scannerModal) {
                closeScannerModal();
            }
        });
    }
    
    // Eco-friendly actions
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('eco-action')) {
            addEcoCoins(2, 'Eco-friendly action');
        }
    });
}

// Audio Player Management
function playAudio(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) {
        // Pause all other audio
        const allAudio = document.querySelectorAll('audio');
        allAudio.forEach(a => {
            if (a !== audio) a.pause();
        });
        
        if (audio.paused) {
            audio.play();
            addEcoCoins(1, 'Enjoying Jharkhand soundscapes');
        } else {
            audio.pause();
        }
    }
}

// Video Player Management
function playVideo(videoId) {
    const video = document.getElementById(videoId);
    if (video) {
        // Pause all other videos
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach(v => {
            if (v !== video) v.pause();
        });
        
        if (video.paused) {
            video.play();
            addEcoCoins(2, 'Watching Jharkhand videos');
        } else {
            video.pause();
        }
    }
}

// Hotel Booking Simulation
function bookHotel(hotelName) {
    if (spendEcoCoins(20, `booking ${hotelName}`)) {
        showNotification(`Hotel ${hotelName} booking confirmed!`, 'success');
    }
}

// Guide Booking Simulation
function bookGuide(guideName) {
    if (spendEcoCoins(15, `booking guide ${guideName}`)) {
        showNotification(`Guide ${guideName} booking confirmed!`, 'success');
    }
}

// Search Functionality
function searchContent(query) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    const content = [
        { title: 'Hundru Falls', type: 'Waterfall', description: '98m high waterfall near Ranchi' },
        { title: 'Dassam Falls', type: 'Waterfall', description: 'Beautiful waterfall on Kanchi River' },
        { title: 'Betla National Park', type: 'Wildlife', description: 'Tiger reserve and wildlife sanctuary' },
        { title: 'Baidyanath Dham', type: 'Temple', description: 'Sacred Jyotirlinga temple' },
        { title: 'Handia', type: 'Food', description: 'Traditional rice beer of Jharkhand' },
        { title: 'Dokra Art', type: 'Craft', description: 'Ancient metal casting technique' }
    ];
    
    const filtered = content.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
    
    searchResults.innerHTML = filtered.map(item => `
        <div class="search-result-item">
            <h4>${item.title}</h4>
            <span class="result-type">${item.type}</span>
            <p>${item.description}</p>
        </div>
    `).join('');
    
    if (filtered.length === 0) {
        searchResults.innerHTML = '<p>No results found. Try searching for waterfalls, temples, food, or crafts.</p>';
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

function getRandomTip() {
    const tips = [
        'Visit waterfalls during monsoon season for the best experience',
        'Try local tribal cuisine for authentic flavors',
        'Respect tribal customs and traditions',
        'Use eco-friendly transportation when possible',
        'Support local artisans by buying authentic handicrafts',
        'Book accommodations in advance during festival seasons'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

// Enhanced chatbot with Jharkhand-specific responses
function sendChatMessage(message) {
    const messagesContainer = document.getElementById('chatbotMessages');
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.textContent = message;
    messagesContainer.appendChild(userMessage);
    
    // Generate bot response
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'bot-message';
        botMessage.innerHTML = generateChatResponse(message);
        messagesContainer.appendChild(botMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateChatResponse(message) {
    const responses = {
        'waterfall': 'Jharkhand has beautiful waterfalls like Hundru Falls (98m), Dassam Falls, and Jonha Falls. Best time to visit is during monsoon season!',
        'temple': 'Visit Baidyanath Dham in Deoghar, one of the 12 Jyotirlingas. Also explore Jagannath Temple in Ranchi.',
        'food': 'Try authentic Jharkhand cuisine: Handia (rice beer), Dhuska, Pittha, and tribal delicacies. Don\'t miss the local markets!',
        'festival': 'Experience Sarhul (spring festival), Karma (harvest festival), and Sohrai (cattle festival) for authentic tribal culture.',
        'wildlife': 'Betla National Park is perfect for tiger spotting. Also visit Hazaribagh Wildlife Sanctuary for diverse flora and fauna.'
    };
    
    for (let key in responses) {
        if (message.toLowerCase().includes(key)) {
            return responses[key];
        }
    }
    
    return 'Thank you for your interest in Jharkhand! I can help you with information about waterfalls, temples, food, festivals, and wildlife. What would you like to know?';
}

// Enhanced trip budget calculator
function calculateTripBudgetEnhanced() {
    const destination = document.getElementById('destination')?.value;
    const duration = parseInt(document.getElementById('duration')?.value) || 1;
    const travelers = parseInt(document.getElementById('travelers')?.value) || 1;
    const budgetType = document.getElementById('budgetType')?.value || 'medium';
    
    if (!destination) {
        showNotification('Please select a destination', 'error');
        return;
    }
    
    // Enhanced budget rates with more detailed breakdown
    const budgetRates = {
        low: { accommodation: 800, food: 500, transport: 300, activities: 400, miscellaneous: 200 },
        medium: { accommodation: 1500, food: 800, transport: 600, activities: 700, miscellaneous: 400 },
        high: { accommodation: 3000, food: 1200, transport: 1000, activities: 1200, miscellaneous: 600 }
    };
    
    // Destination multipliers based on popularity and infrastructure
    const destinationMultipliers = {
        'Ranchi': 1.2,
        'Jamshedpur': 1.1,
        'Dhanbad': 1.0,
        'Bokaro': 1.0,
        'Deoghar': 1.3,
        'Netarhat': 0.9
    };
    
    const rates = budgetRates[budgetType];
    const multiplier = destinationMultipliers[destination] || 1.0;
    
    const totalAccommodation = Math.round(rates.accommodation * duration * travelers * multiplier);
    const totalFood = Math.round(rates.food * duration * travelers * multiplier);
    const totalTransport = Math.round(rates.transport * travelers * multiplier);
    const totalActivities = Math.round(rates.activities * duration * travelers * multiplier);
    const totalMiscellaneous = Math.round(rates.miscellaneous * duration * travelers * multiplier);
    const grandTotal = totalAccommodation + totalFood + totalTransport + totalActivities + totalMiscellaneous;
    
    displayBudgetResult({
        accommodation: totalAccommodation,
        food: totalFood,
        transport: totalTransport,
        activities: totalActivities,
        miscellaneous: totalMiscellaneous,
        total: grandTotal,
        destination,
        duration,
        travelers,
        budgetType
    });
    
    addEcoCoins(5, 'Planning eco-friendly trip');
}

// Enhanced route calculator with detailed eco-footprint
function calculateFootprintEnhanced() {
    const fromLocation = document.getElementById('fromLocation')?.value;
    const toLocation = document.getElementById('toLocation')?.value;
    
    if (!fromLocation || !toLocation) {
        showNotification('Please select both locations', 'error');
        return;
    }
    
    if (fromLocation === toLocation) {
        showNotification('Please select different locations', 'error');
        return;
    }
    
    // Enhanced distance matrix for Jharkhand cities
    const distances = {
        'Ranchi-Jamshedpur': 130,
        'Ranchi-Dhanbad': 160,
        'Ranchi-Bokaro': 110,
        'Ranchi-Deoghar': 250,
        'Ranchi-Netarhat': 156,
        'Jamshedpur-Dhanbad': 70,
        'Jamshedpur-Bokaro': 80,
        'Jamshedpur-Deoghar': 180,
        'Dhanbad-Bokaro': 40,
        'Dhanbad-Deoghar': 120,
        'Bokaro-Deoghar': 140,
        'Bokaro-Netarhat': 200
    };
    
    const routeKey = `${fromLocation}-${toLocation}`;
    const reverseKey = `${toLocation}-${fromLocation}`;
    const distance = distances[routeKey] || distances[reverseKey] || 200;
    
    // Calculate detailed costs and environmental impact
    const transportOptions = [
        {
            mode: 'Train',
            cost: Math.round(distance * 0.5),
            time: Math.round(distance / 50),
            carbonFootprint: Math.round(distance * 0.04 * 100) / 100,
            ecoRating: 'Excellent',
            ecoCoins: 8
        },
        {
            mode: 'Bus',
            cost: Math.round(distance * 0.8),
            time: Math.round(distance / 40),
            carbonFootprint: Math.round(distance * 0.08 * 100) / 100,
            ecoRating: 'Good',
            ecoCoins: 5
        },
        {
            mode: 'Shared Taxi',
            cost: Math.round(distance * 1.2),
            time: Math.round(distance / 60),
            carbonFootprint: Math.round(distance * 0.12 * 100) / 100,
            ecoRating: 'Fair',
            ecoCoins: 3
        },
        {
            mode: 'Private Car',
            cost: Math.round(distance * 2),
            time: Math.round(distance / 70),
            carbonFootprint: Math.round(distance * 0.20 * 100) / 100,
            ecoRating: 'Poor',
            ecoCoins: 0
        }
    ];
    
    displayFootprintResult(distance, transportOptions, fromLocation, toLocation);
    addEcoCoins(3, 'Calculating eco-friendly routes');
}

// Enhanced souvenir scanner with authenticity verification
function initSouvenirScannerEnhanced() {
    const modal = document.getElementById('scannerModal');
    if (modal) {
        modal.style.display = 'flex';
        startCameraEnhanced();
    }
}

function startCameraEnhanced() {
    const video = document.getElementById('scannerVideo');
    const result = document.getElementById('scanResult');
    
    if (video && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
                video.play();
                result.innerHTML = '<p>Scanning for authentic Jharkhand souvenirs...</p>';
                
                // Simulate scanning after 3 seconds
                setTimeout(() => {
                    simulateScanEnhanced();
                }, 3000);
            })
            .catch(err => {
                console.error('Camera access error:', err);
                video.style.display = 'none';
                result.innerHTML = '<p>Camera not available. Showing sample scan result:</p>';
                simulateScanEnhanced();
            });
    } else {
        result.innerHTML = '<p>Camera not supported. Showing sample scan result:</p>';
        simulateScanEnhanced();
    }
}

function simulateScanEnhanced() {
    const souvenirs = [
        {
            name: 'Dokra Elephant',
            authenticity: 95,
            price: '₹1,200 - ₹1,800',
            description: 'Authentic tribal metal craft using ancient lost-wax technique',
            ecoCoins: 15,
            origin: 'Khunti District',
            artisan: 'Local tribal craftsmen'
        },
        {
            name: 'Sohrai Painting',
            authenticity: 90,
            price: '₹800 - ₹1,500',
            description: 'Traditional wall art depicting harvest festival themes',
            ecoCoins: 12,
            origin: 'Hazaribagh District',
            artisan: 'Kurmi women artists'
        },
        {
            name: 'Bamboo Basket',
            authenticity: 85,
            price: '₹300 - ₹600',
            description: 'Eco-friendly handicraft supporting forest communities',
            ecoCoins: 18,
            origin: 'Gumla District',
            artisan: 'Oraon tribal community'
        },
        {
            name: 'Tribal Jewelry',
            authenticity: 92,
            price: '₹500 - ₹1,200',
            description: 'Traditional ornaments with cultural significance',
            ecoCoins: 10,
            origin: 'Simdega District',
            artisan: 'Munda tribal artisans'
        }
    ];
    
    const randomSouvenir = souvenirs[Math.floor(Math.random() * souvenirs.length)];
    
    document.getElementById('scanResult').innerHTML = `
        <div class="scan-result-enhanced">
            <h4>🎯 Souvenir Detected: ${randomSouvenir.name}</h4>
            <div class="authenticity-meter">
                <p><strong>Authenticity Score:</strong> ${randomSouvenir.authenticity}%</p>
                <div class="meter">
                    <div class="meter-fill" style="width: ${randomSouvenir.authenticity}%; background: ${randomSouvenir.authenticity > 90 ? '#4CAF50' : randomSouvenir.authenticity > 80 ? '#FF9800' : '#F44336'}"></div>
                </div>
            </div>
            <div class="souvenir-details">
                <p><strong>Price Range:</strong> ${randomSouvenir.price}</p>
                <p><strong>Description:</strong> ${randomSouvenir.description}</p>
                <p><strong>Origin:</strong> ${randomSouvenir.origin}</p>
                <p><strong>Artisan:</strong> ${randomSouvenir.artisan}</p>
            </div>
            <div class="eco-reward">
                <i class="fas fa-leaf"></i>
                <span>Earn ${randomSouvenir.ecoCoins} Eco-Coins by purchasing authentic local crafts!</span>
            </div>
            <button onclick="addEcoCoins(${randomSouvenir.ecoCoins}, 'Purchasing authentic ${randomSouvenir.name}'); showNotification('Thank you for supporting local artisans!', 'success');" class="card-btn eco-action">
                🛒 Purchase & Earn ${randomSouvenir.ecoCoins} Coins
            </button>
        </div>
    `;
    
    addEcoCoins(2, 'Using souvenir authenticity scanner');
    
    setTimeout(() => {
        closeScannerModal();
    }, 8000);
}

// Chatbot functionality
function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    if (chatbotWindow) {
        if (chatbotWindow.style.display === 'none' || chatbotWindow.style.display === '') {
            chatbotWindow.style.display = 'flex';
            addEcoCoins(1, 'Using tourism assistant');
        } else {
            chatbotWindow.style.display = 'none';
        }
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    const messagesContainer = document.getElementById('chatbotMessages');
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.innerHTML = `<p>${message}</p>`;
    messagesContainer.appendChild(userMessage);
    
    // Clear input
    chatInput.value = '';
    
    // Generate bot response
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'bot-message';
        botMessage.innerHTML = `<p>${generateChatResponse(message)}</p>`;
        messagesContainer.appendChild(botMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add eco-coins for interaction
        addEcoCoins(1, 'Chatting with tourism assistant');
    }, 1000);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function generateChatResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Enhanced responses with more detailed information
    const responses = {
        'waterfall': 'Jharkhand has stunning waterfalls! 🏔️ Visit Hundru Falls (98m high), Dassam Falls (39m), Jonha Falls (43m), and Hirni Falls. Best time: July-October during monsoon season. Don\'t forget to carry a camera! 📸',
        'temple': 'Sacred temples await you! 🏛️ Baidyanath Dham in Deoghar is one of the 12 Jyotirlingas. Also visit Jagannath Temple in Ranchi, Pahari Mandir, and Dewri Temple. Each has unique spiritual significance! 🙏',
        'food': 'Taste authentic Jharkhand cuisine! 🍽️ Try Handia (traditional rice beer), Dhuska (fried lentil cake), Pittha (rice cake), Rugra (mushroom curry), and Bamboo shoot curry. Visit local markets for fresh ingredients! 🌶️',
        'festival': 'Experience vibrant festivals! 🎉 Sarhul (spring festival in March), Karma (harvest festival in August), Sohrai (cattle festival in November), and Tusu Parab (winter festival). Each celebrates tribal culture beautifully! 🎭',
        'wildlife': 'Explore rich wildlife! 🦌 Betla National Park for tigers and elephants, Hazaribagh Wildlife Sanctuary for diverse fauna, and Dalma Wildlife Sanctuary. Best time: October-March. Book safaris in advance! 🐅',
        'hotel': 'Great accommodation options! 🏨 Luxury: Radisson Blu Ranchi, Budget: Hotel Yuvraj, Eco-friendly: Forest rest houses. Book through our partners to earn extra Eco-Coins! 💚',
        'transport': 'Easy connectivity! 🚗 Ranchi airport connects major cities. Railways: Ranchi, Jamshedpur, Dhanbad stations. Road: Well-connected highways. Use our route planner for eco-friendly options! 🚂',
        'weather': 'Pleasant climate! ☀️ Summer (Mar-Jun): 20-35°C, Monsoon (Jul-Sep): Heavy rainfall, Winter (Oct-Feb): 5-25°C. Best visiting time: October to March for comfortable weather! 🌤️'
    };
    
    // Check for keywords in the message
    for (let keyword in responses) {
        if (lowerMessage.includes(keyword)) {
            return responses[keyword];
        }
    }
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
        return 'Namaste! 🙏 Welcome to Jharkhand Tourism! I\'m excited to help you discover the natural beauty, rich culture, and warm hospitality of Jharkhand. What would you like to explore today?';
    }
    
    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return 'You\'re most welcome! 😊 I\'m here to make your Jharkhand journey memorable. Feel free to ask anything about our beautiful state. Have a wonderful trip! 🌟';
    }
    
    // Default response with suggestions
    return `I'd love to help you explore Jharkhand! 🌿 I can provide information about:
    
    🏔️ **Waterfalls** - Hundru, Dassam, Jonha Falls
    🏛️ **Temples** - Baidyanath Dham, Jagannath Temple  
    🍽️ **Food** - Local cuisine and specialties
    🎉 **Festivals** - Sarhul, Karma, Sohrai celebrations
    🦌 **Wildlife** - National parks and sanctuaries
    🏨 **Hotels** - Accommodation recommendations
    🚗 **Transport** - Travel options and routes
    ☀️ **Weather** - Best time to visit
    
    Just ask me about any of these topics! What interests you most?`;
}

// Festival Details Function
function showFestivalDetails(festivalId) {
    const festivalData = {
        sarhul: {
            title: "🌸 Sarhul Festival",
            description: "Sarhul is the most significant festival of Jharkhand, marking the beginning of the new year for tribal communities. It celebrates the blossoming of Sal trees and the arrival of spring.",
            details: [
                "🌳 Sacred Sal trees are worshipped with offerings of rice beer and flowers",
                "🎭 Traditional Sarhul dance performed by men and women in colorful attire",
                "🥁 Tribal drums (Mandar, Dhol) create rhythmic music throughout the celebration",
                "🌾 Prayers for good harvest and prosperity for the coming year",
                "🤝 Community bonding through shared meals and cultural activities"
            ],
            significance: "Represents the deep connection between tribal communities and nature, emphasizing environmental conservation and cultural heritage."
        },
        karma: {
            title: "🌾 Karma Festival",
            description: "Karma festival honors the Karma tree (Nauclea parvifolia) and seeks blessings for a good harvest. It's celebrated with great enthusiasm by young people.",
            details: [
                "🌳 Young Karma tree branches are brought to the village center",
                "💃 Karma dance performed in circles around the sacred tree",
                "🎵 Traditional folk songs narrating stories of love and nature",
                "🌾 Prayers for agricultural prosperity and fertility",
                "🎨 Decorative rangoli patterns made around the Karma tree"
            ],
            significance: "Symbolizes the cycle of life, fertility, and the importance of trees in sustaining life and agriculture."
        },
        sohrai: {
            title: "🐄 Sohrai Festival",
            description: "Sohrai is a harvest festival dedicated to cattle and livestock, recognizing their vital role in agriculture and rural life.",
            details: [
                "🎨 Houses decorated with beautiful Sohrai paintings using natural colors",
                "🐄 Cattle are bathed, decorated, and worshipped with offerings",
                "🏠 Traditional wall art depicting animals, trees, and geometric patterns",
                "🌾 Celebration of successful harvest and gratitude to livestock",
                "🎭 Folk performances and community gatherings"
            ],
            significance: "Highlights the symbiotic relationship between humans, animals, and agriculture in tribal society."
        },
        tusu: {
            title: "❄️ Tusu Parab",
            description: "Tusu Parab is a winter festival celebrating the harvest season, primarily observed by young girls carrying decorated Tusu dolls.",
            details: [
                "🪆 Beautifully decorated Tusu dolls made from bamboo and cloth",
                "🎶 Traditional Tusu songs sung while visiting houses",
                "🎁 Collection of rice, money, and sweets from households",
                "👭 Young girls participate in groups, strengthening social bonds",
                "🌾 Celebration of winter harvest and community sharing"
            ],
            significance: "Promotes community solidarity, cultural transmission, and the role of youth in preserving traditions."
        },
        karam: {
            title: "🌿 Karam Festival",
            description: "Karam festival is dedicated to Karam Devta, celebrated primarily by unmarried girls who pray for good husbands and prosperity.",
            details: [
                "🌿 Fresh Karam tree branches brought to the celebration area",
                "👭 Unmarried girls observe fast and perform traditional rituals",
                "💃 Graceful Karam dance performed around the sacred branches",
                "🙏 Prayers for marital happiness and family prosperity",
                "🎭 Folk tales and legends shared during the celebration"
            ],
            significance: "Emphasizes the importance of marriage, family values, and the role of nature in blessing human relationships."
        },
        jani: {
            title: "🏹 Jani Shikar",
            description: "Jani Shikar is a traditional hunting festival that brings communities together for collective hunting activities and celebrations.",
            details: [
                "🏹 Traditional hunting techniques and tools demonstrated",
                "🤝 Community participation in organized hunting expeditions",
                "🍽️ Shared community feast with the hunt's bounty",
                "🎭 Cultural performances celebrating hunting traditions",
                "🌿 Respect for nature and sustainable hunting practices"
            ],
            significance: "Represents the traditional livelihood practices, community cooperation, and sustainable relationship with forest resources."
        }
    };

    const festival = festivalData[festivalId];
    if (!festival) return;

    // Create modal for festival details
    const modal = document.createElement('div');
    modal.className = 'festival-modal';
    modal.innerHTML = `
        <div class="festival-modal-content">
            <div class="festival-modal-header">
                <h2>${festival.title}</h2>
                <button class="close-modal" onclick="closeFestivalModal()">&times;</button>
            </div>
            <div class="festival-modal-body">
                <p class="festival-modal-description">${festival.description}</p>
                <h3>🎯 Festival Highlights:</h3>
                <ul class="festival-details-list">
                    ${festival.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
                <div class="festival-significance">
                    <h3>🌟 Cultural Significance:</h3>
                    <p>${festival.significance}</p>
                </div>
                <div class="festival-modal-actions">
                    <button class="card-btn primary" onclick="jharkhandTourism.addEcoCoins(10, 'Learning detailed festival information')">+10 Eco-Coins for Learning</button>
                    <button class="card-btn secondary" onclick="shareFestival('${festivalId}')">Share Festival</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Add modal styles if not already present
    if (!document.querySelector('#festival-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'festival-modal-styles';
        styles.textContent = `
            .festival-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .festival-modal-content {
                background: white;
                border-radius: 20px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                margin: 20px;
                animation: slideIn 0.3s ease;
            }
            
            .festival-modal-header {
                background: linear-gradient(135deg, #4caf50, #2e7d32);
                color: white;
                padding: 20px;
                border-radius: 20px 20px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .festival-modal-header h2 {
                margin: 0;
                font-size: 1.5em;
            }
            
            .close-modal {
                background: none;
                border: none;
                color: white;
                font-size: 2em;
                cursor: pointer;
                padding: 0;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s ease;
            }
            
            .close-modal:hover {
                background: rgba(255,255,255,0.2);
            }
            
            .festival-modal-body {
                padding: 30px;
            }
            
            .festival-modal-description {
                font-size: 1.1em;
                line-height: 1.6;
                color: #555;
                margin-bottom: 25px;
            }
            
            .festival-details-list {
                list-style: none;
                padding: 0;
                margin: 20px 0;
            }
            
            .festival-details-list li {
                background: #f8f9fa;
                padding: 12px 15px;
                margin: 8px 0;
                border-radius: 10px;
                border-left: 4px solid #4caf50;
            }
            
            .festival-significance {
                background: linear-gradient(135deg, #e8f5e8, #f1f8e9);
                padding: 20px;
                border-radius: 15px;
                margin: 25px 0;
            }
            
            .festival-significance h3 {
                color: #2e7d32;
                margin-bottom: 10px;
            }
            
            .festival-modal-actions {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
                margin-top: 25px;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
}

function closeFestivalModal() {
    const modal = document.querySelector('.festival-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

function shareFestival(festivalId) {
    const festivalNames = {
        sarhul: 'Sarhul Festival',
        karma: 'Karma Festival',
        sohrai: 'Sohrai Festival',
        tusu: 'Tusu Parab',
        karam: 'Karam Festival',
        jani: 'Jani Shikar'
    };
    
    const text = `Discover the beautiful ${festivalNames[festivalId]} of Jharkhand! Experience the rich tribal culture and traditions. Visit our Jharkhand Tourism website to learn more.`;
    
    if (navigator.share) {
        navigator.share({
            title: `${festivalNames[festivalId]} - Jharkhand Tourism`,
            text: text,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(text + ' ' + window.location.href);
        alert('Festival information copied to clipboard!');
    }
}

// Enhanced Souvenir Scanner Functions
function switchScannerTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.scanner-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.scanner-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Add active class to selected tab
    event.target.classList.add('active');
}

function captureImage() {
    // Simulate camera capture
    const resultContainer = document.getElementById('scanResult');
    resultContainer.innerHTML = `
        <div class="scan-result">
            <h4>📸 Image Captured Successfully!</h4>
            <p>Analyzing souvenir authenticity...</p>
            <div class="loading-spinner" style="margin: 20px 0;"></div>
        </div>
    `;
    
    // Simulate analysis delay
    setTimeout(() => {
        displayScanResults();
    }, 2000);
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const resultContainer = document.getElementById('scanResult');
        resultContainer.innerHTML = `
            <div class="scan-result">
                <h4>📁 File Uploaded: ${file.name}</h4>
                <p>Processing image for authenticity verification...</p>
                <div class="loading-spinner" style="margin: 20px 0;"></div>
            </div>
        `;
        
        setTimeout(() => {
            displayScanResults();
        }, 2000);
    }
}

function searchSouvenir() {
    const searchTerm = document.getElementById('souvenirSearch').value;
    if (searchTerm.trim()) {
        const resultContainer = document.getElementById('scanResult');
        resultContainer.innerHTML = `
            <div class="scan-result">
                <h4>🔍 Searching for: "${searchTerm}"</h4>
                <p>Finding authentic Jharkhand souvenirs...</p>
                <div class="loading-spinner" style="margin: 20px 0;"></div>
            </div>
        `;
        
        setTimeout(() => {
            displaySearchResults(searchTerm);
        }, 1500);
    }
}

function displayScanResults() {
    const resultContainer = document.getElementById('scanResult');
    resultContainer.innerHTML = `
        <div class="scan-result">
            <h4>🎯 Authenticity Analysis Complete</h4>
            
            <div class="result-item">
                <div class="result-header">
                    <div class="result-icon">🏺</div>
                    <div class="result-info">
                        <h4>Tribal Pottery</h4>
                        <p>Traditional Jharkhand ceramic art</p>
                    </div>
                </div>
                <div class="authenticity-badge authentic">✅ Authentic</div>
                <p><strong>Price Range:</strong> ₹500 - ₹1,200</p>
                <p><strong>Origin:</strong> Hazaribagh District</p>
                <p><strong>Cultural Significance:</strong> Made by Santhal artisans using traditional techniques passed down for generations.</p>
            </div>

            <div class="result-item">
                <div class="result-header">
                    <div class="result-icon">🎨</div>
                    <div class="result-info">
                        <h4>Bamboo Craft</h4>
                        <p>Handwoven bamboo products</p>
                    </div>
                </div>
                <div class="authenticity-badge authentic">✅ Authentic</div>
                <p><strong>Price Range:</strong> ₹200 - ₹800</p>
                <p><strong>Origin:</strong> Ranchi Region</p>
                <p><strong>Eco-Impact:</strong> 100% sustainable, supports local tribal communities.</p>
            </div>

            <div class="result-item">
                <div class="result-header">
                    <div class="result-icon">⚠️</div>
                    <div class="result-info">
                        <h4>Mass-Produced Item</h4>
                        <p>Factory-made imitation</p>
                    </div>
                </div>
                <div class="authenticity-badge questionable">⚠️ Questionable</div>
                <p><strong>Warning:</strong> This appears to be a machine-made replica, not authentic tribal craft.</p>
                <p><strong>Recommendation:</strong> Look for handmade imperfections and ask for artisan certification.</p>
            </div>
        </div>
    `;
}

function displaySearchResults(searchTerm) {
    const resultContainer = document.getElementById('scanResult');
    const souvenirData = {
        'pottery': {
            name: 'Traditional Tribal Pottery',
            icon: '🏺',
            price: '₹500 - ₹1,200',
            origin: 'Hazaribagh District',
            description: 'Authentic ceramic art made by Santhal artisans'
        },
        'bamboo': {
            name: 'Bamboo Handicrafts',
            icon: '🎋',
            price: '₹200 - ₹800',
            origin: 'Ranchi Region',
            description: 'Eco-friendly bamboo products supporting local communities'
        },
        'textile': {
            name: 'Tribal Textiles',
            icon: '🧵',
            price: '₹800 - ₹2,500',
            origin: 'Dumka Region',
            description: 'Handwoven fabrics with traditional Jharkhand patterns'
        }
    };

    const matchedItems = Object.keys(souvenirData).filter(key => 
        key.includes(searchTerm.toLowerCase()) || 
        souvenirData[key].name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchedItems.length > 0) {
        let resultsHTML = '<div class="scan-result"><h4>🎯 Search Results</h4>';
        matchedItems.forEach(key => {
            const item = souvenirData[key];
            resultsHTML += `
                <div class="result-item">
                    <div class="result-header">
                        <div class="result-icon">${item.icon}</div>
                        <div class="result-info">
                            <h4>${item.name}</h4>
                            <p>${item.description}</p>
                        </div>
                    </div>
                    <div class="authenticity-badge authentic">✅ Verified Authentic</div>
                    <p><strong>Price Range:</strong> ${item.price}</p>
                    <p><strong>Origin:</strong> ${item.origin}</p>
                </div>
            `;
        });
        resultsHTML += '</div>';
        resultContainer.innerHTML = resultsHTML;
    } else {
        resultContainer.innerHTML = `
            <div class="scan-result">
                <h4>🔍 No Results Found</h4>
                <p>No authentic Jharkhand souvenirs found for "${searchTerm}".</p>
                <p>Try searching for: pottery, bamboo, textile, jewelry, or handicrafts.</p>
            </div>
        `;
    }
}

function selectSearchTag(tag) {
    document.getElementById('souvenirSearch').value = tag;
    searchSouvenir();
}

// Enhanced Future Footprint Calculator Functions
function switchFootprintTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.footprint-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.footprint-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Add active class to selected tab
    event.target.classList.add('active');
}

function calculateFootprintEnhanced() {
    const fromLocation = document.getElementById('fromLocation').value;
    const toLocation = document.getElementById('toLocation').value;
    const travelMode = document.getElementById('travelMode').value;
    const travelerCount = document.getElementById('travelerCount').value || 2;
    
    if (!fromLocation || !toLocation) {
        alert('Please select both starting point and destination.');
        return;
    }

    if (fromLocation === toLocation) {
        alert('Starting point and destination cannot be the same.');
        return;
    }

    // Simulate distance calculation (in reality, this would use a mapping API)
    const distances = {
        'Ranchi-Jamshedpur': 130,
        'Ranchi-Dhanbad': 160,
        'Ranchi-Bokaro': 110,
        'Ranchi-Deoghar': 250,
        'Ranchi-Hazaribagh': 90,
        'Jamshedpur-Dhanbad': 140,
        'Jamshedpur-Bokaro': 120,
        'Dhanbad-Bokaro': 50
    };

    const routeKey = `${fromLocation}-${toLocation}`;
    const reverseRouteKey = `${toLocation}-${fromLocation}`;
    const distance = distances[routeKey] || distances[reverseRouteKey] || 150; // Default distance

    // Calculate environmental impact based on travel mode
    const impactData = {
        'car': { co2PerKm: 0.21, fuelPerKm: 0.08, cost: 6 },
        'bus': { co2PerKm: 0.05, fuelPerKm: 0.03, cost: 2 },
        'train': { co2PerKm: 0.03, fuelPerKm: 0.02, cost: 1.5 },
        'bike': { co2PerKm: 0.12, fuelPerKm: 0.04, cost: 3 },
        'cycle': { co2PerKm: 0, fuelPerKm: 0, cost: 0 },
        'walk': { co2PerKm: 0, fuelPerKm: 0, cost: 0 }
    };

    const impact = impactData[travelMode];
    const totalCO2 = (distance * impact.co2PerKm * travelerCount).toFixed(2);
    const totalFuel = (distance * impact.fuelPerKm * travelerCount).toFixed(2);
    const totalCost = (distance * impact.cost * travelerCount).toFixed(0);

    // Get selected impact factors
    const carbonOffset = document.getElementById('carbonOffset').checked;
    const fuelConsumption = document.getElementById('fuelConsumption').checked;
    const airQuality = document.getElementById('airQuality').checked;
    const noiseImpact = document.getElementById('noiseImpact').checked;

    const resultContainer = document.getElementById('footprintResult');
    
    let resultsHTML = `
        <div class="footprint-analysis">
            <h3>🌱 Route Analysis: ${fromLocation} → ${toLocation}</h3>
            
            <div class="route-summary">
                <div class="summary-item">
                    <i class="fas fa-route"></i>
                    <div>
                        <h4>Distance</h4>
                        <p>${distance} km</p>
                    </div>
                </div>
                <div class="summary-item">
                    <i class="fas fa-users"></i>
                    <div>
                        <h4>Travelers</h4>
                        <p>${travelerCount} people</p>
                    </div>
                </div>
                <div class="summary-item">
                    <i class="fas fa-car"></i>
                    <div>
                        <h4>Mode</h4>
                        <p>${travelMode.charAt(0).toUpperCase() + travelMode.slice(1)}</p>
                    </div>
                </div>
            </div>

            <div class="impact-results">
    `;

    if (carbonOffset) {
        resultsHTML += `
            <div class="impact-item ${totalCO2 > 20 ? 'high-impact' : totalCO2 > 10 ? 'medium-impact' : 'low-impact'}">
                <i class="fas fa-leaf"></i>
                <div>
                    <h4>Carbon Footprint</h4>
                    <p>${totalCO2} kg CO₂</p>
                    <small>${totalCO2 > 20 ? 'High Impact' : totalCO2 > 10 ? 'Medium Impact' : 'Low Impact'}</small>
                </div>
            </div>
        `;
    }

    if (fuelConsumption) {
        resultsHTML += `
            <div class="impact-item">
                <i class="fas fa-gas-pump"></i>
                <div>
                    <h4>Fuel Consumption</h4>
                    <p>${totalFuel} liters</p>
                    <small>Estimated fuel usage</small>
                </div>
            </div>
        `;
    }

    resultsHTML += `
            <div class="impact-item">
                <i class="fas fa-rupee-sign"></i>
                <div>
                    <h4>Travel Cost</h4>
                    <p>₹${totalCost}</p>
                    <small>Approximate cost per person</small>
                </div>
            </div>
        </div>
    `;

    // Add eco-friendly recommendations
    if (travelMode === 'car' || travelMode === 'bike') {
        resultsHTML += `
            <div class="eco-recommendations">
                <h4>🌿 Eco-Friendly Alternatives</h4>
                <div class="recommendation">
                    <i class="fas fa-bus"></i>
                    <div>
                        <h5>Public Bus</h5>
                        <p>Reduce CO₂ by ${(totalCO2 * 0.7).toFixed(1)} kg • Save ₹${(totalCost * 0.6).toFixed(0)}</p>
                    </div>
                </div>
                <div class="recommendation">
                    <i class="fas fa-train"></i>
                    <div>
                        <h5>Train Travel</h5>
                        <p>Reduce CO₂ by ${(totalCO2 * 0.8).toFixed(1)} kg • Save ₹${(totalCost * 0.7).toFixed(0)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Add carbon offset options
    if (carbonOffset && totalCO2 > 5) {
        const treesToPlant = Math.ceil(totalCO2 / 22); // 1 tree absorbs ~22kg CO2/year
        resultsHTML += `
            <div class="carbon-offset">
                <h4>🌳 Carbon Offset Options</h4>
                <p>Plant <strong>${treesToPlant} trees</strong> to offset your carbon footprint</p>
                <p>Estimated cost: ₹${treesToPlant * 50} (₹50 per tree)</p>
                <button class="offset-btn" onclick="initiateTreePlanting(${treesToPlant})">
                    🌱 Plant Trees Now
                </button>
            </div>
        `;
    }

    resultsHTML += '</div>';
    resultContainer.innerHTML = resultsHTML;
}

function initiateTreePlanting(treeCount) {
    alert(`🌳 Tree Planting Initiative\n\nYou've chosen to plant ${treeCount} trees to offset your carbon footprint!\n\nThis initiative supports:\n• Local reforestation in Jharkhand\n• Tribal community employment\n• Biodiversity conservation\n\nThank you for choosing sustainable travel! 🌿`);
}

// Footer functionality
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    
    if (!email || !email.includes('@')) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate newsletter subscription
    showNotification('Thank you for subscribing to our newsletter! You\'ll receive updates about Jharkhand tourism.', 'success');
    document.getElementById('newsletter-email').value = '';
}

function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update language selector display
    const selector = document.querySelector('.language-selector select');
    if (selector) {
        selector.value = lang;
    }
    
    // Update page content based on language
    setLanguage(lang);
    showNotification(`Language switched to ${lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Bengali'}`, 'success');
}

function handleFooterContact(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    // Simulate contact form submission
    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    form.reset();
}

function initializeFooter() {
    // Newsletter subscription
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', subscribeNewsletter);
    }
    
    // Language selector
    const languageSelector = document.querySelector('.language-selector select');
    if (languageSelector) {
        languageSelector.addEventListener('change', (e) => switchLanguage(e.target.value));
        languageSelector.value = currentLanguage;
    }
    
    // Contact form
    const contactForm = document.querySelector('.footer-contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFooterContact);
    }
    
    // Social media links tracking
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const platform = e.target.closest('a').getAttribute('aria-label') || 'Social Media';
            console.log(`Social media click: ${platform}`);
        });
    });
}

// Multimedia Features
let currentAudio = null;
let currentPlaylist = [];
let currentTrackIndex = 0;
let isPlaying = false;

function initializeMultimedia() {
    // Initialize multimedia tabs
    const multimediaTabs = document.querySelectorAll('.multimedia-tab');
    multimediaTabs.forEach(tab => {
        tab.addEventListener('click', () => switchMultimediaTab(tab.dataset.tab));
    });

    // Initialize audio playlist
    initializeAudioPlaylist();
    
    // Initialize video gallery
    initializeVideoGallery();
    
    // Initialize virtual tours
    initializeVirtualTours();
    
    // Initialize audio stories
    initializeAudioStories();
}

function switchMultimediaTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.multimedia-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.multimedia-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // Add eco coins for multimedia engagement
    addEcoCoins(2, `Exploring ${tabName} content`);
}

function initializeAudioPlaylist() {
    // Audio playlist data
    currentPlaylist = [
        {
            id: 'waterfall-sounds',
            title: 'Waterfall Sounds',
            artist: 'Jharkhand Nature',
            duration: '4:20',
            src: 'sounds/waterfall-sounds-259625.mp3',
            description: 'Soothing waterfall sounds from Hundru Falls'
        },
        {
            id: 'birds-near-waterfall',
            title: 'Birds Near Waterfall',
            artist: 'Jharkhand Wildlife',
            duration: '5:30',
            src: 'sounds/birds-near-waterfall-324855.mp3',
            description: 'Melodious bird calls near cascading waters'
        }
    ];

    // Initialize playlist UI
    updatePlaylistUI();
    
    // Initialize audio controls
    const playPauseBtn = document.querySelector('.play-pause');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const shuffleBtn = document.querySelector('.shuffle-btn');
    const repeatBtn = document.querySelector('.repeat-btn');
    const progressBar = document.querySelector('.progress-bar');
    const volumeSlider = document.querySelector('.volume-slider');

    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    if (prevBtn) prevBtn.addEventListener('click', playPreviousTrack);
    if (nextBtn) nextBtn.addEventListener('click', playNextTrack);
    if (shuffleBtn) shuffleBtn.addEventListener('click', toggleShuffle);
    if (repeatBtn) repeatBtn.addEventListener('click', toggleRepeat);
    if (progressBar) progressBar.addEventListener('input', seekAudio);
    if (volumeSlider) volumeSlider.addEventListener('input', adjustVolume);

    // Load first track
    loadTrack(0);
}

function updatePlaylistUI() {
    const playlistContainer = document.querySelector('.playlist-items');
    if (!playlistContainer) return;

    playlistContainer.innerHTML = currentPlaylist.map((track, index) => `
        <div class="playlist-item ${index === currentTrackIndex ? 'active' : ''}" onclick="jharkhandTourism.playTrack(${index})">
            <div class="playlist-icon">🎵</div>
            <div class="playlist-info">
                <h5>${track.title}</h5>
                <p>${track.artist} • ${track.duration}</p>
            </div>
        </div>
    `).join('');
}

function loadTrack(index) {
    if (index < 0 || index >= currentPlaylist.length) return;
    
    currentTrackIndex = index;
    const track = currentPlaylist[index];
    
    // Update audio info
    const audioTitle = document.querySelector('.audio-info h3');
    const audioDescription = document.querySelector('.audio-info p');
    
    if (audioTitle) audioTitle.textContent = track.title;
    if (audioDescription) audioDescription.textContent = track.description;
    
    // Create or update audio element
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.removeEventListener('timeupdate', updateProgress);
        currentAudio.removeEventListener('ended', playNextTrack);
    }
    
    currentAudio = new Audio(track.src);
    currentAudio.addEventListener('timeupdate', updateProgress);
    currentAudio.addEventListener('ended', playNextTrack);
    currentAudio.addEventListener('loadedmetadata', updateDuration);
    
    // Update playlist UI
    updatePlaylistUI();
}

function playTrack(index) {
    loadTrack(index);
    if (currentAudio) {
        currentAudio.play();
        isPlaying = true;
        updatePlayPauseButton();
        addEcoCoins(3, `Playing ${currentPlaylist[index].title}`);
    }
}

function togglePlayPause() {
    if (!currentAudio) return;
    
    if (isPlaying) {
        currentAudio.pause();
        isPlaying = false;
    } else {
        currentAudio.play();
        isPlaying = true;
    }
    updatePlayPauseButton();
}

function updatePlayPauseButton() {
    const playPauseBtn = document.querySelector('.play-pause');
    if (playPauseBtn) {
        playPauseBtn.innerHTML = isPlaying ? '⏸️' : '▶️';
    }
}

function playPreviousTrack() {
    const prevIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : currentPlaylist.length - 1;
    playTrack(prevIndex);
}

function playNextTrack() {
    const nextIndex = currentTrackIndex < currentPlaylist.length - 1 ? currentTrackIndex + 1 : 0;
    playTrack(nextIndex);
}

function updateProgress() {
    if (!currentAudio) return;
    
    const progressBar = document.querySelector('.progress-bar');
    const currentTimeEl = document.querySelector('.current-time');
    
    if (progressBar) {
        const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
        progressBar.value = progress || 0;
    }
    
    if (currentTimeEl) {
        currentTimeEl.textContent = formatTime(currentAudio.currentTime);
    }
}

function updateDuration() {
    const durationEl = document.querySelector('.duration');
    if (durationEl && currentAudio) {
        durationEl.textContent = formatTime(currentAudio.duration);
    }
}

function seekAudio(event) {
    if (!currentAudio) return;
    
    const seekTime = (event.target.value / 100) * currentAudio.duration;
    currentAudio.currentTime = seekTime;
}

function adjustVolume(event) {
    if (!currentAudio) return;
    
    currentAudio.volume = event.target.value / 100;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function initializeVideoGallery() {
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const videoSrc = thumbnail.dataset.video;
            const videoTitle = thumbnail.dataset.title;
            const videoDescription = thumbnail.dataset.description;
            
            playFeaturedVideo(videoSrc, videoTitle, videoDescription);
            
            // Update active thumbnail
            videoThumbnails.forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
            
            addEcoCoins(3, `Watching ${videoTitle}`);
        });
    });
}

function playFeaturedVideo(src, title, description) {
    const featuredVideo = document.querySelector('.featured-video video');
    const videoTitle = document.querySelector('.video-info h3');
    const videoDescription = document.querySelector('.video-info p');
    
    if (featuredVideo) featuredVideo.src = src;
    if (videoTitle) videoTitle.textContent = title;
    if (videoDescription) videoDescription.textContent = description;
}

function initializeVirtualTours() {
    const tourCards = document.querySelectorAll('.virtual-tour-card');
    tourCards.forEach(card => {
        card.addEventListener('click', () => {
            const tourId = card.dataset.tourId;
            const tourTitle = card.dataset.title;
            openVirtualTour(tourId, tourTitle);
            addEcoCoins(5, `Virtual tour: ${tourTitle}`);
        });
    });
}

function openVirtualTour(tourId, title) {
    const modal = document.getElementById('virtualTourModal');
    const modalTitle = modal.querySelector('h3');
    const tourViewer = modal.querySelector('.virtual-tour-viewer');
    
    if (modalTitle) modalTitle.textContent = `360° Virtual Tour: ${title}`;
    
    // In a real implementation, this would load the 360° tour
    // For now, we'll show a placeholder
    tourViewer.innerHTML = `
        <div class="virtual-placeholder">
            <div class="virtual-icon">🌐</div>
            <h3>360° Virtual Tour</h3>
            <p>Experience ${title} in immersive 360° view</p>
            <div class="virtual-controls">
                <button onclick="jharkhandTourism.simulateVirtualTour('${tourId}')">Start Tour</button>
                <button onclick="jharkhandTourism.closeVirtualTour()">Close</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function simulateVirtualTour(tourId) {
    showNotification('Virtual tour started! Use mouse to look around.', 'success');
    // In a real implementation, this would initialize the 360° viewer
}

function closeVirtualTour() {
    const modal = document.getElementById('virtualTourModal');
    modal.style.display = 'none';
}

function initializeAudioStories() {
    const storyCards = document.querySelectorAll('.story-card');
    storyCards.forEach(card => {
        card.addEventListener('click', () => {
            const storyId = card.dataset.storyId;
            const storyTitle = card.dataset.title;
            const audioSrc = card.dataset.audio;
            
            playAudioStory(audioSrc, storyTitle);
            addEcoCoins(4, `Listening to ${storyTitle}`);
        });
    });
}

function playAudioStory(src, title) {
    // Stop current audio if playing
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
    }
    
    // Create new audio for story
    const storyAudio = new Audio(src);
    storyAudio.play();
    
    showNotification(`Now playing: ${title}`, 'info');
    
    storyAudio.addEventListener('ended', () => {
        showNotification(`Finished listening to: ${title}`, 'success');
    });
}

// Export functions for global use
window.jharkhandTourism = {
    addEcoCoins,
    spendEcoCoins,
    calculateTripBudget,
    calculateTripBudgetEnhanced,
    calculateFootprint,
    calculateFootprintEnhanced,
    initSouvenirScanner,
    initSouvenirScannerEnhanced,
    sendChatMessage,
    generateChatResponse,
    toggleChatbot,
    handleChatKeyPress,
    setLanguage,
    playAudio,
    playVideo,
    bookHotel,
    bookGuide,
    submitContactForm,
    showFestivalDetails,
    switchScannerTab,
    captureImage,
    handleFileUpload,
    searchSouvenir,
    selectSearchTag,
    switchFootprintTab,
    initiateTreePlanting,
    subscribeNewsletter,
    switchLanguage,
    handleFooterContact,
    initializeFooter,
    initializeMultimedia,
    switchMultimediaTab,
    playTrack,
    togglePlayPause,
    playPreviousTrack,
    playNextTrack,
    playFeaturedVideo,
    openVirtualTour,
    simulateVirtualTour,
    closeVirtualTour,
    playAudioStory
};