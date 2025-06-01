// Chatbot JavaScript

document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const micBtn = document.getElementById('mic-btn'); // Mic button (for future use)

    let isChatbotOpen = false;
    let inactivityTimer;
    const INACTIVITY_TIMEOUT = 30000; // 30 seconds
    const CHAT_HISTORY_STORAGE_KEY = 'hisaab_chatbot_history';

    // Load chat history from localStorage
    function loadChatHistory() {
        const history = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
        if (history) {
            chatMessages.innerHTML = history;
             // Ensure messages are visible after loading
            chatMessages.querySelectorAll('.message').forEach(msg => msg.style.opacity = 1);
            scrollToBottom();
        }
    }

    // Save chat history to localStorage
    function saveChatHistory() {
        localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, chatMessages.innerHTML);
    }

    // Scroll to the bottom of the chat window
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Add a new message to the chat window
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(messageElement);
        scrollToBottom();
        saveChatHistory(); // Save after adding a new message
    }

    // Simulate AI response
    function getBotResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase();

        if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
            return "Hi there! I'm HISAAB's AI Assistant 👋 How can I help you today?";
        } else if (lowerCaseMessage.includes('pricing') || lowerCaseMessage.includes('price') || lowerCaseMessage.includes('cost')) {
            return "Our Pro Plan starts at ₹24,999/month. You can see more details on our Pricing page.";
        } else if (lowerCaseMessage.includes('help') || lowerCaseMessage.includes('support')) {
            return "I can assist with features, orders, analytics, and general information about HISAAB. What do you need help with?";
        } else if (lowerCaseMessage.includes('order status') || lowerCaseMessage.includes('my order')) {
            return "Please provide your Order ID and I can check the status for you.";
        } else if (lowerCaseMessage.includes('analytics') || lowerCaseMessage.includes('report')) {
            // Simulate some dummy analytics data
            const salesIncrease = Math.floor(Math.random() * 50) + 10; // Random increase between 10% and 60%
            const attendanceRate = Math.floor(Math.random() * 10) + 90; // Random rate between 90% and 100%
            const topProducts = ['T-Shirt', 'Jeans', 'Shoes', 'Bag', 'Watch'];
            const randomProduct = topProducts[Math.floor(Math.random() * topProducts.length)];
            return `Here's a quick glance: Sales ↑ ${salesIncrease}%, Attendance ${attendanceRate}%, Top Product: ${randomProduct}. You can find detailed reports in your dashboard.`;
        } else if (lowerCaseMessage.includes('thank you') || lowerCaseMessage.includes('thanks')) {
             return "You're welcome!";
        }
        else {
            return "I'm here to assist you with any business queries. Please ask me about features, pricing, or your account.";
        }
    }

    // Simulate bot typing animation
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'bot-message', 'typing-indicator');
        typingIndicator.innerHTML = '<p><span>.</span><span>.</span><span>.</span></p>';
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();
    }

    // Remove bot typing indicator
    function removeTypingIndicator() {
        const typingIndicator = chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Handle sending a message
    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (userMessage === '') return; // Don't send empty messages

        addMessage(userMessage, 'user');
        userInput.value = ''; // Clear input
        resetInactivityTimer(); // Reset timer on user activity

        showTypingIndicator(); // Show typing indicator

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 seconds delay

        removeTypingIndicator(); // Remove typing indicator

        const botResponse = getBotResponse(userMessage);
        addMessage(botResponse, 'bot');

         resetInactivityTimer(); // Reset timer after bot responds
    }

    // Event listeners
    chatbotToggleBtn.addEventListener('click', () => {
        isChatbotOpen = !isChatbotOpen;
        if (isChatbotOpen) {
            chatbotWindow.classList.add('active');
            resetInactivityTimer(); // Start timer when opening
        } else {
            chatbotWindow.classList.remove('active');
            clearTimeout(inactivityTimer); // Clear timer when closing manually
        }
         chatbotToggleBtn.classList.toggle('active', isChatbotOpen); // Optional: Add active class to icon
         loadChatHistory(); // Load history when opening
    });

    chatbotCloseBtn.addEventListener('click', () => {
        isChatbotOpen = false;
        chatbotWindow.classList.remove('active');
        chatbotToggleBtn.classList.remove('active'); // Optional: Remove active class from icon
        clearTimeout(inactivityTimer); // Clear timer when closing manually
    });

    sendBtn.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Inactivity timer and auto-collapse
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            if (isChatbotOpen) {
                chatbotCloseBtn.click(); // Simulate closing the chat
            }
        }, INACTIVITY_TIMEOUT);
    }

    // Optional: Add event listeners to detect user activity on the page
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    document.addEventListener('click', resetInactivityTimer);
    document.addEventListener('scroll', resetInactivityTimer);


    // Initial load: Load history but keep chat window closed
    loadChatHistory();
});

// Note: The mic button functionality is not implemented in this version.
// You would need to integrate a Web Speech API for voice input. 