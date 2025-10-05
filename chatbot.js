// Advanced AI Chatbot Class
class Chatbot {
    constructor() {
        this.toggleBtn = document.getElementById('chatbotToggle');
        this.chatWindow = document.getElementById('chatWindow');
        this.closeBtn = document.getElementById('closeChat');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendMessage');
        this.messagesContainer = document.getElementById('chatMessages');
        this.isOpen = false;
        this.conversationHistory = [];
        this.userContext = {
            currentConverter: null,
            lastAction: null,
            preferences: {}
        };
        
        this.initializeEventListeners();
        this.setupAdvancedResponses();
        this.addWelcomeMessage();
    }

    initializeEventListeners() {
        this.toggleBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    setupAdvancedResponses() {
        this.knowledgeBase = {
            // Converter-specific responses
            converters: {
                'pdf to jpg': {
                    description: 'Convert PDF pages to high-quality JPG images',
                    steps: [
                        'Click "PDF to JPG" in navigation or home page',
                        'Upload your PDF file (drag & drop or click to browse)',
                        'Wait for conversion (progress bar shows status)',
                        'Preview converted images',
                        'Download individual images or all at once'
                    ],
                    tips: [
                        'Supports multi-page PDFs',
                        'High-quality output (2x scale)',
                        'Each page becomes a separate JPG',
                        'Files processed locally for privacy'
                    ],
                    troubleshooting: [
                        'Large PDFs may take longer to process',
                        'Ensure PDF is not password-protected',
                        'Check file size (very large files may timeout)'
                    ]
                },
                'image to pdf': {
                    description: 'Combine multiple images into a single PDF document',
                    steps: [
                        'Click "Image to PDF" in navigation or home page',
                        'Select multiple images (JPG, PNG supported)',
                        'Preview selected images in grid',
                        'Click "Convert to PDF"',
                        'Download the generated PDF'
                    ],
                    tips: [
                        'Select images in desired order',
                        'Images will be scaled to fit page',
                        'Each image becomes a PDF page',
                        'Maintains original image quality'
                    ]
                },
                'pdf resizer': {
                    description: 'Resize PDF pages to custom dimensions',
                    steps: [
                        'Click "PDF Resizer" in navigation or home page',
                        'Upload your PDF file',
                        'Enter new width and height in pixels',
                        'Click "Resize PDF"',
                        'Download the resized PDF'
                    ],
                    tips: [
                        'Enter dimensions in pixels (e.g., 800x600)',
                        'All pages will be resized to same dimensions',
                        'Maintains aspect ratio when possible',
                        'Good for standardizing document sizes'
                    ]
                },
                'image resizer': {
                    description: 'Resize images to specific dimensions',
                    steps: [
                        'Click "Image Resizer" in navigation or home page',
                        'Upload your image file',
                        'Enter new width and height in pixels',
                        'Click "Resize Image"',
                        'Preview and download resized image'
                    ],
                    tips: [
                        'Supports JPG, PNG, GIF formats',
                        'Enter exact pixel dimensions',
                        'Preview before downloading',
                        'Maintains original file format'
                    ]
                }
            },
            
            // General responses
            general: {
                greeting: [
                    "Hello! I'm your AI assistant for the file converter. How can I help you today?",
                    "Hi there! I'm here to help you with all your file conversion needs. What would you like to know?",
                    "Welcome! I can assist you with PDF to JPG, Image to PDF, PDF resizing, and Image resizing. What can I help you with?"
                ],
                help: [
                    "I can help you with: PDF to JPG conversion, Image to PDF conversion, PDF resizing, and Image resizing. Each tool processes files locally in your browser for maximum privacy!",
                    "Here are the available tools: PDF to JPG (convert PDF pages to images), Image to PDF (combine images into PDF), PDF Resizer (change PDF dimensions), and Image Resizer (resize images). What interests you?",
                    "I'm your guide for all file conversion needs! Ask me about any of our four converters, troubleshooting, or how to get the best results."
                ],
                privacy: [
                    "Your privacy is our top priority! All file processing happens locally in your browser - your files never leave your device or get uploaded to any server.",
                    "Rest assured, everything is processed on your computer. We don't store, track, or access your files in any way.",
                    "Complete privacy guaranteed! All conversions are done locally in your browser with no data transmission."
                ],
                supportedFormats: [
                    "Supported formats: PDF files for PDF tools, JPG/PNG/GIF for image tools. All conversions maintain high quality and original file properties.",
                    "We support: PDF (for PDF tools), JPG, PNG, GIF (for image tools). Each converter maintains the best possible quality during processing.",
                    "Format support: PDFs for PDF operations, and JPG/PNG/GIF for image operations. Quality is preserved throughout all conversions."
                ],
                error: [
                    "If you're experiencing issues: 1) Check file format compatibility, 2) Ensure file isn't too large, 3) Try refreshing the page, 4) Make sure file isn't corrupted. I'm here to help troubleshoot!",
                    "Common solutions: Verify file format, check file size (very large files may take longer), refresh the page, or try a different file. Need more specific help?",
                    "Troubleshooting steps: Confirm file format, check size limits, refresh browser, verify file integrity. Let me know what specific error you're seeing!"
                ]
            }
        };
        
        this.contextualResponses = {
            'what can you do': 'general.help',
            'how do you work': 'general.privacy',
            'what formats': 'general.supportedFormats',
            'having trouble': 'general.error',
            'privacy': 'general.privacy',
            'security': 'general.privacy'
        };
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatWindow.classList.toggle('hidden', !this.isOpen);
        if (this.isOpen) {
            this.chatInput.focus();
        }
    }

    closeChat() {
        this.isOpen = false;
        this.chatWindow.classList.add('hidden');
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add to conversation history
        this.conversationHistory.push({ role: 'user', content: message });
        this.addMessage(message, 'user');
        this.chatInput.value = '';

        // Update user context
        this.updateUserContext(message);

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate AI thinking delay
        const thinkingTime = Math.random() * 1500 + 500; // 0.5-2 seconds
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateAIResponse(message);
            this.conversationHistory.push({ role: 'assistant', content: response });
            this.addMessage(response, 'bot');
        }, thinkingTime);
    }

    addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `mb-4 fade-in ${sender === 'user' ? 'text-right' : ''}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = `inline-block p-3 rounded-lg max-w-xs ${
            sender === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-800'
        }`;
        
        // Format message with line breaks and better styling
        const formattedMessage = this.formatMessage(message);
        messageContent.innerHTML = `<div class="text-sm whitespace-pre-line">${formattedMessage}</div>`;
        
        messageDiv.appendChild(messageContent);
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    formatMessage(message) {
        // Convert line breaks to HTML
        return message.replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'mb-4';
        typingDiv.id = 'typing-indicator';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'inline-block p-3 rounded-lg bg-gray-100 text-gray-800';
        typingContent.innerHTML = `
            <div class="flex items-center space-x-1">
                <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
                <span class="text-xs text-gray-500 ml-2">AI is thinking...</span>
            </div>
        `;
        
        typingDiv.appendChild(typingContent);
        this.messagesContainer.appendChild(typingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    updateUserContext(message) {
        const lowerMessage = message.toLowerCase();
        
        // Detect current converter context
        if (lowerMessage.includes('pdf to jpg') || lowerMessage.includes('pdf to image')) {
            this.userContext.currentConverter = 'pdf to jpg';
        } else if (lowerMessage.includes('image to pdf') || lowerMessage.includes('images to pdf')) {
            this.userContext.currentConverter = 'image to pdf';
        } else if (lowerMessage.includes('pdf resizer') || lowerMessage.includes('resize pdf')) {
            this.userContext.currentConverter = 'pdf resizer';
        } else if (lowerMessage.includes('image resizer') || lowerMessage.includes('resize image')) {
            this.userContext.currentConverter = 'image resizer';
        }
        
        // Detect last action
        if (lowerMessage.includes('upload') || lowerMessage.includes('select')) {
            this.userContext.lastAction = 'upload';
        } else if (lowerMessage.includes('download') || lowerMessage.includes('save')) {
            this.userContext.lastAction = 'download';
        } else if (lowerMessage.includes('convert') || lowerMessage.includes('process')) {
            this.userContext.lastAction = 'convert';
        }
    }

    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Handle greetings
        if (this.isGreeting(lowerMessage)) {
            return this.getRandomResponse(this.knowledgeBase.general.greeting);
        }
        
        // Handle gratitude
        if (this.isGratitude(lowerMessage)) {
            return this.getGratitudeResponse();
        }
        
        // Handle converter-specific questions
        const converterMatch = this.detectConverter(lowerMessage);
        if (converterMatch) {
            return this.generateConverterResponse(converterMatch, lowerMessage);
        }
        
        // Handle contextual questions
        const contextualMatch = this.detectContextualQuestion(lowerMessage);
        if (contextualMatch) {
            return this.getRandomResponse(this.knowledgeBase[contextualMatch]);
        }
        
        // Handle troubleshooting
        if (this.isTroubleshooting(lowerMessage)) {
            return this.generateTroubleshootingResponse(lowerMessage);
        }
        
        // Handle follow-up questions
        if (this.isFollowUp(lowerMessage)) {
            return this.generateFollowUpResponse(lowerMessage);
        }
        
        // Default intelligent response
        return this.generateDefaultResponse(lowerMessage);
    }

    isGreeting(message) {
        const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
        return greetings.some(greeting => message.includes(greeting));
    }

    isGratitude(message) {
        const gratitude = ['thank', 'thanks', 'appreciate', 'grateful'];
        return gratitude.some(word => message.includes(word));
    }

    detectConverter(message) {
        const converters = ['pdf to jpg', 'image to pdf', 'pdf resizer', 'image resizer'];
        return converters.find(converter => message.includes(converter));
    }

    detectContextualQuestion(message) {
        for (const [keyword, responsePath] of Object.entries(this.contextualResponses)) {
            if (message.includes(keyword)) {
                return responsePath;
            }
        }
        return null;
    }

    isTroubleshooting(message) {
        const troubleWords = ['error', 'problem', 'issue', 'not working', 'failed', 'broken', 'stuck'];
        return troubleWords.some(word => message.includes(word));
    }

    isFollowUp(message) {
        const followUpWords = ['how', 'what', 'why', 'when', 'where', 'can you', 'could you'];
        return followUpWords.some(word => message.includes(word));
    }

    generateConverterResponse(converter, message) {
        const converterData = this.knowledgeBase.converters[converter];
        
        if (message.includes('how') || message.includes('steps')) {
            return this.formatSteps(converterData.steps, converterData.description);
        } else if (message.includes('tip') || message.includes('advice')) {
            return this.formatTips(converterData.tips, converterData.description);
        } else if (message.includes('problem') || message.includes('issue')) {
            return this.formatTroubleshooting(converterData.troubleshooting, converterData.description);
        } else {
            return this.formatGeneralConverterInfo(converterData, converter);
        }
    }

    generateTroubleshootingResponse(message) {
        const responses = [
            "I understand you're having an issue. Let me help you troubleshoot this step by step.",
            "No worries! Let's work through this problem together. I'm here to help.",
            "I can help you resolve this. Let me guide you through some solutions."
        ];
        
        const baseResponse = this.getRandomResponse(responses);
        const generalTroubleshooting = this.getRandomResponse(this.knowledgeBase.general.error);
        
        return `${baseResponse}\n\n${generalTroubleshooting}`;
    }

    generateFollowUpResponse(message) {
        if (this.userContext.currentConverter) {
            const converterData = this.knowledgeBase.converters[this.userContext.currentConverter];
            return `Since you're working with ${this.userContext.currentConverter}, here's what I can tell you: ${converterData.description}. Would you like specific steps, tips, or troubleshooting help?`;
        }
        
        return "I'd be happy to help! Could you be more specific about what you'd like to know? For example, you could ask about a specific converter, troubleshooting, or general usage tips.";
    }

    generateDefaultResponse(message) {
        const responses = [
            "I'm not sure I understand exactly what you're asking. Could you rephrase your question? I can help with converter instructions, troubleshooting, or general questions about the tools.",
            "That's an interesting question! I can help you with PDF to JPG conversion, Image to PDF creation, PDF resizing, or Image resizing. What specific aspect would you like to know about?",
            "I want to make sure I give you the best answer. Could you clarify what you need help with? I'm here to assist with all aspects of our file conversion tools."
        ];
        
        return this.getRandomResponse(responses);
    }

    formatSteps(steps, description) {
        let response = `${description}\n\nHere's how to do it:\n`;
        steps.forEach((step, index) => {
            response += `${index + 1}. ${step}\n`;
        });
        return response;
    }

    formatTips(tips, description) {
        let response = `${description}\n\nPro tips for best results:\n`;
        tips.forEach((tip, index) => {
            response += `• ${tip}\n`;
        });
        return response;
    }

    formatTroubleshooting(troubleshooting, description) {
        let response = `${description}\n\nCommon issues and solutions:\n`;
        troubleshooting.forEach((item, index) => {
            response += `• ${item}\n`;
        });
        return response;
    }

    formatGeneralConverterInfo(converterData, converterName) {
        return `${converterData.description}\n\nWould you like to know the steps, get some tips, or need troubleshooting help?`;
    }

    getGratitudeResponse() {
        const responses = [
            "You're very welcome! I'm here whenever you need help with the converters.",
            "Happy to help! Feel free to ask if you have any other questions about the tools.",
            "My pleasure! Don't hesitate to reach out if you need assistance with anything else.",
            "You're welcome! I'm always here to help you get the most out of our conversion tools."
        ];
        return this.getRandomResponse(responses);
    }

    getRandomResponse(responses) {
        if (Array.isArray(responses)) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
        return responses;
    }

    addWelcomeMessage() {
        const welcomeMessage = this.getRandomResponse(this.knowledgeBase.general.greeting);
        this.addMessage(welcomeMessage, 'bot');
    }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});
