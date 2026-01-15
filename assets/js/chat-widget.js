/**
 * Chat Widget Functionality
 * Handles toggle interactions and message simulation
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initChatWidget();
    });

    // Also try to init immediately in case DOM is already ready (dynamic load)
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initChatWidget();
    }

    function initChatWidget() {
        const widgetContainer = document.querySelector('.rbt-chat-widget');

        // Guard clause ensuring element exists and hasn't been initialized
        if (!widgetContainer || widgetContainer.dataset.initialized) return;
        widgetContainer.dataset.initialized = 'true';

        const toggleBtn = widgetContainer.querySelector('.chat-toggle-btn');
        const chatWindow = widgetContainer.querySelector('.chat-window');
        const closeBtn = widgetContainer.querySelector('.chat-close');
        const chatBody = widgetContainer.querySelector('.chat-body');
        const chatForm = widgetContainer.querySelector('.chat-input-area');
        const chatInput = chatForm.querySelector('input');
        const notificationBadge = widgetContainer.querySelector('.notification-badge');

        // Toggle Chat
        function toggleChat() {
            widgetContainer.classList.toggle('active');
            chatWindow.classList.toggle('active');

            // Focus input when opening
            if (widgetContainer.classList.contains('active')) {
                setTimeout(() => chatInput.focus(), 300);
                // Hide badge on open
                if (notificationBadge) notificationBadge.style.display = 'none';
            }
        }

        toggleBtn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleChat();
        });

        // Send Message Logic
        function sendMessage(e) {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (!message) return;

            // Append User Message
            appendMessage(message, 'outgoing');
            chatInput.value = '';

            // Simulate Reply
            simulateReply();
        }

        function appendMessage(text, type) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${type}`;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';

            const p = document.createElement('p');
            p.className = 'chat-font';
            p.textContent = text;

            const timeSpan = document.createElement('span');
            timeSpan.className = 'time';
            timeSpan.textContent = 'Just now'; // Could use real time

            contentDiv.appendChild(p);
            contentDiv.appendChild(timeSpan);
            msgDiv.appendChild(contentDiv);

            chatBody.appendChild(msgDiv);
            scrollToBottom();
        }

        function scrollToBottom() {
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        // Simulate typing request
        let isTyping = false;
        function simulateReply() {
            if (isTyping) return;
            isTyping = true;

            // Show typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message incoming typing-indicator-msg';
            typingDiv.innerHTML = `
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
            chatBody.appendChild(typingDiv);
            scrollToBottom();

            // Wait and replace with message
            setTimeout(() => {
                if (typingDiv.parentNode) typingDiv.remove();
                appendMessage("Thanks for your message! Our team will get back to you shortly.", 'incoming');
                isTyping = false;
            }, 1500 + Math.random() * 1000);
        }

        chatForm.addEventListener('submit', sendMessage);
    }

    // Listen for custom event from components.js if needed in future
    // window.addEventListener('componentsLoaded', initChatWidget);
})();
