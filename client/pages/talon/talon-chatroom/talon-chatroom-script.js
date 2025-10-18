// Golden Talon Chatroom - Interactive Functionality

class TalonChatroom {
    constructor() {
        this.messages = [];
        this.users = [
            { id: 1, name: 'GoldenEagle', status: 'online', typing: false },
            { id: 2, name: 'CyberHawk', status: 'online', typing: false },
            { id: 3, name: 'DigitalFalcon', status: 'away', typing: false },
            { id: 4, name: 'ShadowRaven', status: 'online', typing: false },
            { id: 5, name: 'PhantomOwl', status: 'offline', typing: false }
        ];
        this.currentUser = 'Anonymous';
        this.isTyping = false;
        this.typingTimeout = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderUserList();
        this.addSystemMessage('Welcome to the Golden Talon secure chatroom. All communications are encrypted.');
        this.addSystemMessage('WARNING: This chatroom may contain sensitive information. Inspect carefully!');
        this.simulateChatActivity();
        this.addMobileInstructions();
    }

    setupEventListeners() {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const messageContainer = document.getElementById('messagesContainer');

        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            messageInput.addEventListener('input', () => {
                this.handleTyping();
            });
        }

        if (sendButton) {
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        if (messageContainer) {
            messageContainer.addEventListener('scroll', () => {
                this.handleScroll();
            });
        }
    }

    renderUserList() {
        const userList = document.getElementById('userList');
        if (!userList) return;

        userList.innerHTML = '';
        this.users.forEach(user => {
            const userElement = document.createElement('li');
            userElement.className = `user-item ${user.status} ${user.typing ? 'typing' : ''}`;
            userElement.innerHTML = `
                <div>${user.name}</div>
                <div style="font-size: 12px; opacity: 0.7;">${user.status}</div>
            `;
            userList.appendChild(userElement);
        });
    }

    addMessage(content, sender, type = 'other') {
        const message = {
            id: Date.now(),
            content,
            sender,
            type,
            timestamp: new Date()
        };
        
        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
    }

    addSystemMessage(content) {
        this.addMessage(content, 'System', 'system');
    }

    renderMessage(message) {
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.type}-message`;
        
        const timeString = message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageElement.innerHTML = `
            <div class="message-header">${message.sender}</div>
            <div class="message-content">${this.escapeHtml(message.content)}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        if (!messageInput) return;

        const content = messageInput.value.trim();
        if (!content) return;

        this.addMessage(content, this.currentUser, 'user');
        messageInput.value = '';
        this.stopTyping();
        
        // Simulate response after a delay
        setTimeout(() => {
            this.simulateResponse(content);
        }, 1000 + Math.random() * 2000);
    }

    simulateResponse(userMessage) {
        const responses = [
            "Interesting point about the security protocols...",
            "Have you checked the latest intel on the target?",
            "The operation is proceeding as planned.",
            "We need to be more careful with our communications.",
            "The authorities are getting suspicious.",
            "Our contact in the bank has been compromised.",
            "We should move to the backup plan.",
            "The encryption keys have been updated.",
            "Meeting at the usual place tomorrow?",
            "The new recruits are ready for deployment."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const randomUser = this.users[Math.floor(Math.random() * this.users.length)];
        
        this.addMessage(randomResponse, randomUser.name, 'other');
    }

    simulateChatActivity() {
        // Add some initial messages to make it look active
        const initialMessages = [
            { content: "Everyone ready for tonight's operation?", sender: "GoldenEagle", type: "other" },
            { content: "Affirmative. All systems are go.", sender: "CyberHawk", type: "other" },
            { content: "The target's security has been analyzed. We have a 3-hour window.", sender: "DigitalFalcon", type: "other" },
            { content: "Remember, keep all communications encrypted. No real names.", sender: "ShadowRaven", type: "other" },
            { content: "The authorities are monitoring our usual channels. Use the new encryption protocol.", sender: "GoldenEagle", type: "other" }
        ];

        initialMessages.forEach((msg, index) => {
            setTimeout(() => {
                this.addMessage(msg.content, msg.sender, msg.type);
            }, index * 2000);
        });

        // Simulate ongoing activity
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance every 10 seconds
                this.simulateResponse("Random activity");
            }
        }, 10000);
    }

    handleTyping() {
        if (!this.isTyping) {
            this.isTyping = true;
            this.updateTypingStatus(true);
        }

        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            this.stopTyping();
        }, 2000);
    }

    stopTyping() {
        this.isTyping = false;
        this.updateTypingStatus(false);
    }

    updateTypingStatus(typing) {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.style.display = typing ? 'block' : 'none';
            typingIndicator.textContent = typing ? `${this.currentUser} is typing...` : '';
        }
    }

    handleScroll() {
        // Could add infinite scroll or other scroll-based features here
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('messagesContainer');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    addMobileInstructions() {
        // Add instructions for mobile users
        setTimeout(() => {
            this.addSystemMessage('TIP: Try selecting text in the chat area - you might find hidden information!');
        }, 3000);
        
        setTimeout(() => {
            this.addSystemMessage('HINT: Look for invisible messages that blend with the background...');
        }, 6000);
    }
}

// Initialize chatroom when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new TalonChatroom();
    
    // Add some console messages for CTF participants
    console.log('Golden Talon Chatroom initialized');
    console.log('Debug info: Check the page source for hidden information');
    console.log('Hint: Look for comments and hidden elements');
});
