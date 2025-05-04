document.addEventListener('DOMContentLoaded', function() {
    // ===== Global Variables =====
    const chatOptions = document.querySelectorAll('.chat-option');
    const chatBody = document.querySelector('.chat-body');
    const customMessageInput = document.getElementById('customMessage');
    const sendCustomMessageBtn = document.getElementById('sendCustomMessage');

    const config = {
        backendEndpoint: 'http://localhost:5001/api/chat' // Update this if you deploy
    };

    // ===== Event Listeners =====

    // Handle quick chat option buttons
    chatOptions.forEach(option => {
        option.addEventListener('click', function() {
            const userMessage = this.textContent;

            addMessage(userMessage, 'user');
            disableChatOptions(true);

            const typingIndicator = createTypingIndicator();
            chatBody.appendChild(typingIndicator);
            chatBody.scrollTop = chatBody.scrollHeight;

            generateAIResponse([{ role: 'user', content: userMessage }], typingIndicator);
        });
    });

    // Handle custom message send button
    sendCustomMessageBtn.addEventListener('click', sendCustomMessage);

    // Handle custom message "Enter" key
    customMessageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendCustomMessage();
        }
    });

    // ===== Helper Functions =====

    function sendCustomMessage() {
        const message = customMessageInput.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        customMessageInput.value = '';
        disableChatOptions(true);

        const typingIndicator = createTypingIndicator();
        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;

        generateAIResponse([{ role: 'user', content: message }], typingIndicator);
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender);
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function createTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        return typingIndicator;
    }

    function disableChatOptions(disabled) {
        chatOptions.forEach(btn => btn.disabled = disabled);
    }

    async function generateAIResponse(messages, typingIndicator = null) {
        try {
            const response = await fetch(config.backendEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.response;

            if (typingIndicator) {
                chatBody.removeChild(typingIndicator);
            }

            addMessage(aiResponse, 'bot');
        } catch (error) {
            console.error('Error:', error);

            if (typingIndicator) {
                chatBody.removeChild(typingIndicator);
            }

            let errorMessage = "Sorry, I'm having trouble connecting to the AI service.";
            if (error.message.includes('rate limit')) {
                errorMessage = "I'm getting too many requests. Please wait a moment and try again.";
            } else if (error.message.includes('authentication')) {
                errorMessage = "There's an authentication issue. Please contact support.";
            }

            addMessage(errorMessage, 'bot');
        } finally {
            disableChatOptions(false);
        }
    }

    // ===== Initial Animation =====
    setTimeout(() => {
        const botGreeting = document.querySelector('.chat-message.bot');
        if (botGreeting) {
            botGreeting.style.opacity = '1';
        }
    }, 300);
});
