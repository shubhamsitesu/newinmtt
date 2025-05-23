 // Audio context and functions
        let audioContext;
        let audioEnabled = false;
        
        function initAudio() {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                audioEnabled = true;
            } catch (e) {
                console.warn("Web Audio API not supported");
                audioEnabled = false;
            }
        }
        
        function playTone(frequency, duration, type = 'sine') {
            if (!audioEnabled || !audioContext) return;
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
        }
        
        function playMessageSound() {
            // WhatsApp-like notification tone
            playTone(800, 0.1);
            setTimeout(() => playTone(1000, 0.1), 100);
            setTimeout(() => playTone(1200, 0.1), 200);
        }
        
        function playLoveSound() {
            // Special love tone
            playTone(523.25, 0.1);
            setTimeout(() => playTone(659.25, 0.1), 100);
            setTimeout(() => playTone(783.99, 0.2), 200);
        }

        // Heart creation only in chat container
        function createHeart(x, y) {
            const chatContainer = document.querySelector('.chat-container');
            if (!chatContainer) return;
            
            const rect = chatContainer.getBoundingClientRect();
            
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                const heart = document.createElement('div');
                heart.className = 'floating-heart';
                heart.innerHTML = '❤️';
                heart.style.left = `${x}px`;
                heart.style.top = `${y}px`;
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 2500);
            }
        }

        // Beautiful "I Love You" explosion
        function createLoveExplosion() {
            const explosion = document.createElement('div');
            explosion.className = 'love-explosion';
            
            const colors = ['#ff0000', '#ff69b4', '#ff1493', '#ff00ff', '#ff6347'];
            const words = ['I', 'LOVE', 'YOU', '❤️', '💖', '💕'];
            
            words.forEach((word, i) => {
                const loveWord = document.createElement('div');
                loveWord.className = 'love-word';
                loveWord.textContent = word;
                loveWord.style.color = colors[i % colors.length];
                loveWord.style.setProperty('--tx', (Math.random() * 2 - 1));
                loveWord.style.setProperty('--ty', (Math.random() * 0.5 - 1));
                loveWord.style.animationDelay = `${i * 0.1}s`;
                explosion.appendChild(loveWord);
            });
            
            document.body.appendChild(explosion);
            
            setTimeout(() => {
                explosion.remove();
            }, 3000);
        }

        // Create falling petals
        function createPetals() {
            const types = ['🌸', '🌹', '🌺', '🌻', '🌼', '💮', '🏵️'];
            const container = document.querySelector('.chat-container');
            
            for(let i = 0; i < 20; i++) {
                const petal = document.createElement('div');
                petal.className = 'petal';
                petal.innerHTML = types[Math.floor(Math.random() * types.length)];
                petal.style.left = Math.random() * 100 + '%';
                petal.style.fontSize = (Math.random() * 20 + 15) + 'px';
                petal.style.animationDuration = (Math.random() * 10 + 5) + 's';
                petal.style.animationDelay = Math.random() * 5 + 's';
                petal.style.setProperty('--dx', (Math.random() * 2 - 1));
                container.appendChild(petal);
            }
        }

        // Confetti effect
        function triggerConfetti() {
            const canvas = document.getElementById('confetti-canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const pieces = [];
            const colors = ['#ff0000', '#ff1493', '#ff69b4', '#ffc0cb', '#ffffff'];
            const flowers = ['🌹', '🌷', '🌸', '💐', '🌺'];

            for (let i = 0; i < 300; i++) {
                const isFlower = Math.random() > 0.6;
                pieces.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height - canvas.height,
                    size: Math.random() * 12 + 8,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speed: Math.random() * 3 + 2,
                    angle: Math.random() * 6.28,
                    rotation: Math.random() * 0.2 - 0.1,
                    isFlower: isFlower,
                    flower: isFlower ? flowers[Math.floor(Math.random() * flowers.length)] : null,
                    shape: isFlower ? null : Math.random() > 0.5 ? 'circle' : 'rect'
                });
            }

            let animationComplete = false;
            const animationDuration = 10000;
            const startTime = Date.now();

            function animate() {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / animationDuration;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                let stillAlive = false;
                pieces.forEach(p => {
                    const speedMultiplier = 1 - (progress * 0.9);
                    p.x += Math.sin(p.angle) * 0.5 * speedMultiplier;
                    p.y += p.speed * speedMultiplier;
                    p.angle += p.rotation * speedMultiplier;
                    
                    if (p.y < canvas.height) {
                        stillAlive = true;
                        ctx.save();
                        ctx.translate(p.x, p.y);
                        ctx.rotate(p.angle);
                        
                        if (p.isFlower) {
                            ctx.font = `${p.size}px Arial`;
                            ctx.fillText(p.flower, -p.size/2, p.size/2);
                        } else {
                            ctx.fillStyle = p.color;
                            if (p.shape === 'circle') {
                                ctx.beginPath();
                                ctx.arc(0, 0, p.size/2, 0, Math.PI*2);
                                ctx.fill();
                            } else {
                                const cornerRadius = p.size/5;
                                ctx.beginPath();
                                ctx.moveTo(-p.size/2 + cornerRadius, -p.size/2);
                                ctx.lineTo(p.size/2 - cornerRadius, -p.size/2);
                                ctx.quadraticCurveTo(p.size/2, -p.size/2, p.size/2, -p.size/2 + cornerRadius);
                                ctx.lineTo(p.size/2, p.size/2 - cornerRadius);
                                ctx.quadraticCurveTo(p.size/2, p.size/2, p.size/2 - cornerRadius, p.size/2);
                                ctx.lineTo(-p.size/2 + cornerRadius, p.size/2);
                                ctx.quadraticCurveTo(-p.size/2, p.size/2, -p.size/2, p.size/2 - cornerRadius);
                                ctx.lineTo(-p.size/2, -p.size/2 + cornerRadius);
                                ctx.quadraticCurveTo(-p.size/2, -p.size/2, -p.size/2 + cornerRadius, -p.size/2);
                                ctx.closePath();
                                ctx.fill();
                            }
                        }
                        ctx.restore();
                    }
                });

                if (stillAlive && elapsed < animationDuration) {
                    requestAnimationFrame(animate);
                } else if (!animationComplete) {
                    animationComplete = true;
                }
            }

            animate();
        }

        // Get current time in HH:MM format
        function getCurrentTime() {
            const now = new Date();
            return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        document.addEventListener('DOMContentLoaded', function() {
            const startScreen = document.getElementById('startScreen');
            const startButton = document.getElementById('startButton');
            const passwordInput = document.getElementById('passwordInput');
            const chatContainer = document.querySelector('.chat-container');
            const chat = document.getElementById('chat');
            const messageInput = document.getElementById('messageInput');
            const sendButton = document.getElementById('sendButton');
            const newMessageIndicator = document.getElementById('newMessageIndicator');
            
            // Click hearts creation only in chat container
            document.addEventListener('click', (e) => {
                if (startScreen.style.display === 'none') {
                    createHeart(e.clientX, e.clientY);
                }
            });
            
            // Password protection
            startButton.addEventListener('click', function() {
                if (passwordInput.value === '2005') {
                    initAudio();
                    startScreen.style.display = 'none';
                    chatContainer.style.display = 'block';
                    startChat();
                    createPetals();
                } else {
                    alert('Try again ❤️');
                    passwordInput.value = '';
                }
            });
            
            passwordInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    startButton.click();
                }
            });

            function startChat() {
                // Add date separator
                const today = new Date();
                const dateStr = today.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
                addDateSeparator(dateStr);

                // Function to handle sending messages
                function sendMessage() {
                    const text = messageInput.value.trim();
                    if (text) {
                        addMessage(text, false, 0);
                        messageInput.value = '';
                        
                        // Check for special words
                        if (text.toLowerCase().includes('love you') || text.toLowerCase().includes('i love you')) {
                            setTimeout(() => {
                                playLoveSound();
                                triggerConfetti();
                                createLoveExplosion();
                                createPetals();
                            }, 200);
                        }
                        
                        // Auto-reply after 1-3 seconds
                        setTimeout(() => {
                            const replies = [
                                "I love you too! ❤️",
                                "You make me so happy 😊",
                                "Thinking of you... 💭",
                                "Miss you already! 💕",
                                "You're my everything 🌟",
                                "My heart belongs to you 💘",
                                "Forever yours 💍",
                                "You complete me 💞"
                            ];
                            const randomReply = replies[Math.floor(Math.random() * replies.length)];
                            addMessage(randomReply, true, 0);
                            showNewMessageIndicator();
                        }, 1000 + Math.random() * 2000);
                    }
                }

                // Show new message indicator
                function showNewMessageIndicator() {
                    newMessageIndicator.style.display = 'flex';
                    setTimeout(() => {
                        newMessageIndicator.style.display = 'none';
                    }, 3000);
                }

                // Event listeners for real-time chat
                sendButton.addEventListener('click', sendMessage);
                messageInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') sendMessage();
                });

                // Add date separator
                function addDateSeparator(dateStr) {
                    const separator = document.createElement('div');
                    separator.className = 'date-separator';
                    separator.innerHTML = `<span>${dateStr}</span>`;
                    chat.appendChild(separator);
                }

                // Modified addMessage function with profile icons
                function addMessage(text, isReceived, delay, withTyping = false) {
                    setTimeout(() => {
                        if (withTyping) {
                            const typingDiv = document.createElement('div');
                            typingDiv.className = 'message received';
                            typingDiv.innerHTML = `
                                <div class="typing">
                                    <span class="typing-dot"></span>
                                    <span class="typing-dot"></span>
                                    <span class="typing-dot"></span>
                                </div>
                            `;
                            chat.appendChild(typingDiv);
                            chat.scrollTop = chat.scrollHeight;
                            
                            setTimeout(() => {
                                chat.removeChild(typingDiv);
                                // Play sound before showing message
                                playMessageSound();
                                setTimeout(() => {
                                    showMessage(text, isReceived);
                                }, 200);
                            }, 1500);
                        } else {
                            // Play appropriate sound before showing message
                            if (text.toLowerCase().includes('love you') || text.toLowerCase().includes('i love you')) {
                                playLoveSound();
                                setTimeout(() => {
                                    showMessage(text, isReceived);
                                }, 200);
                            } else {
                                playMessageSound();
                                setTimeout(() => {
                                    showMessage(text, isReceived);
                                }, 200);
                            }
                        }
                    }, delay);
                }

                function showMessage(text, isReceived) {
                    const messageContainer = document.createElement('div');
                    messageContainer.className = 'message-container';
                    
                    if (isReceived) {
                        const profileIcon = document.createElement('div');
                        profileIcon.className = 'profile-icon';
                        profileIcon.textContent = 'S';
                        messageContainer.appendChild(profileIcon);
                    }
                    
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `message ${isReceived ? 'received' : 'sent'}`;
                    messageDiv.innerHTML = text;
                    messageContainer.appendChild(messageDiv);
                    
                    // Add message time
                    const timeDiv = document.createElement('div');
                    timeDiv.className = 'message-time';
                    timeDiv.textContent = getCurrentTime();
                    messageDiv.appendChild(timeDiv);
                    
                    // Add seen indicator for sent messages
                    if (!isReceived) {
                        const seenDiv = document.createElement('div');
                        seenDiv.className = 'seen-indicator';
                        seenDiv.innerHTML = '✓✓';
                        messageDiv.appendChild(seenDiv);
                    }
                    
                    if (!isReceived) {
                        const profileIcon = document.createElement('div');
                        profileIcon.className = 'profile-icon';
                        profileIcon.textContent = 'R';
                        messageContainer.appendChild(profileIcon);
                    }
                    
                    chat.appendChild(messageContainer);
                    chat.scrollTop = chat.scrollHeight;
                }

                // Initial chat sequence in romantic Hinglish (true = boy, false = girl)
addMessage("Hii meri jaan <span class='heart'>❤️</span>", true, 1000);
addMessage("Hello mere handsome 😊", false, 2500);
addMessage("Bas aapke baare mein soch raha tha...", true, 4000, true);
addMessage("Kya chal raha hai aapke dil mein? 💭", false, 7000);
addMessage("Aapke saath har pal kisi jaadu se kam nahi lagta ✨", true, 9000, true);
addMessage("Aap mera dil dhadakne pe majboor kar dete ho 💓", false, 12000);
addMessage("Bas aapko apni baahon mein lena chahta hoon...", true, 14000, true);
addMessage("Main aapse itna pyaar karta hoon jitna lafzon mein bayan nahi ho sakta 💌", false, 17000);
addMessage("Kya aap hamesha ke liye meri banengi?", true, 19000, true);
addMessage("Haan... hamesha aur sirf aapki <span class='heart'>❤️</span>", false, 22000);
addMessage("I love you <span class='heart'>❤️</span>", true, 23000);

            }
        });
