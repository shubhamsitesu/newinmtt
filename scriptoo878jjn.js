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
            playTone(1200, 0.1);
            setTimeout(() => playTone(1500, 0.1), 100);
        }
        
        function playLoveSound() {
            playTone(523.25, 0.1);
            setTimeout(() => playTone(659.25, 0.1), 100);
            setTimeout(() => playTone(783.99, 0.2), 200);
        }

        // Click heart creation
        function createHeart(x, y) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = '❤️';
            heart.style.left = `${x - 10}px`;
            heart.style.top = `${y - 10}px`;
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 2000);
        }

        function showFlowerMessage() {
            const flowers = {
                "I": ["😘", "👩‍❤️‍💋‍👨"],
                "LOVE": ["❤️"],
                "YOU": ["🌹", "🥀", "🌹"]
            };
            
            const container = document.createElement('div');
            container.className = 'flower-message';
            document.body.appendChild(container);
            
            // Create each word with flowers
            Object.entries(flowers).forEach(([word, flowerTypes], wordIndex) => {
                const wordDiv = document.createElement('div');
                wordDiv.className = 'flower-word';
                container.appendChild(wordDiv);
                
                // For "LOVE" we just show the heart
                if (word === "LOVE") {
                    const heart = document.createElement('div');
                    heart.className = 'flower-heart';
                    heart.innerHTML = flowerTypes[0];
                    wordDiv.appendChild(heart);
                } 
                // For other words, show flowers for each letter
                else {
                    word.split('').forEach((letter, letterIndex) => {
                        const flower = document.createElement('div');
                        flower.className = 'flower';
                        const randomFlower = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
                        flower.innerHTML = randomFlower;
                        wordDiv.appendChild(flower);
                        
                        // Create falling petals
                        for (let i = 0; i < 5; i++) {
                            setTimeout(() => {
                                const petal = document.createElement('div');
                                petal.className = 'flower-petal';
                                petal.innerHTML = randomFlower;
                                petal.style.left = `${letterIndex * 60 + Math.random() * 40}px`;
                                petal.style.top = `-20px`;
                                petal.style.animationDelay = `${i * 0.5}s`;
                                petal.style.fontSize = `${15 + Math.random() * 15}px`;
                                wordDiv.appendChild(petal);
                                
                                setTimeout(() => {
                                    petal.remove();
                                }, 5000);
                            }, i * 500);
                        }
                    });
                }
                
                // Animate word in
                setTimeout(() => {
                    wordDiv.style.transition = 'all 1s ease-out';
                    wordDiv.style.opacity = '1';
                    wordDiv.style.transform = 'translateY(0)';
                    
                    // Add gentle floating animation
                    setInterval(() => {
                        wordDiv.style.transform = `translateY(${Math.sin(Date.now()/1000 + wordIndex) * 10}px)`;
                    }, 50);
                }, wordIndex * 500);
            });
            
            // Remove after some time and return to password screen
            setTimeout(() => {
                container.style.transition = 'opacity 1s';
                container.style.opacity = '0';
                setTimeout(() => {
                    container.remove();
                    document.querySelector('.chat-container').style.display = 'none';
                    document.getElementById('startScreen').style.display = 'flex';
                    document.getElementById('passwordInput').value = '';
                }, 1000);
            }, 8000);
        }

        // Swipe detection setup
        let startX;
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });
            
            chatContainer.addEventListener('touchend', (e) => {
                if (!startX) return;
                const endX = e.changedTouches[0].clientX;
                if (startX - endX > 50) {
                    // Left swipe detected
                    alert("Swipe detected! Secret message: I'll always like you ❤️");
                }
                startX = null;
            });
        }

        document.addEventListener('DOMContentLoaded', function() {
            const startScreen = document.getElementById('startScreen');
            const startButton = document.getElementById('startButton');
            const passwordInput = document.getElementById('passwordInput');
            const chatContainer = document.querySelector('.chat-container');
            const chat = document.getElementById('chat');
            
            // Click hearts creation
            document.addEventListener('click', (e) => {
                if (startScreen.style.display === 'none') {
                    createHeart(e.clientX, e.clientY);
                }
            });
            
            // Password protection
            startButton.addEventListener('click', function() {
                if (passwordInput.value === '2005') { // Change this to your special date
                    initAudio();
                    startScreen.style.display = 'none';
                    chatContainer.style.display = 'block';
                    startChat();
                } else {
                    alert('Try again ❤️');
                }
            });
            
            // Allow pressing Enter in password field
            passwordInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    startButton.click();
                }
            });
            
            function startChat() {
                // Clear any previous messages
                chat.innerHTML = '';
                
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
                                addMessage(text, isReceived, 0);
                            }, 1500);
                        } else {
                            const messageDiv = document.createElement('div');
                            messageDiv.className = `message ${isReceived ? 'received' : 'sent'}`;
                            messageDiv.innerHTML = text;
                            chat.appendChild(messageDiv);
                            chat.scrollTop = chat.scrollHeight;
                            
                            if (text.includes("LOVE you")) {
                                playLoveSound();
                                showFlowerMessage();
                            } else {
                                playMessageSound();
                            }
                        }
                    }, delay);
                }
                
                // Chat sequence
                addMessage("Hii <span class='heart'>❤️</span>", true, 1000);
                addMessage("Hello", false, 2500);
                addMessage("Suno na, ek baat kehni thi...?", true, 4000, true);
                addMessage("Ha bolo 😊", false, 7000);
                addMessage("Aajkal bas aapke baare mein sochta rahta hu...", true, 9000, true);
                addMessage("kya?", false, 12000);
                addMessage("Aapke bare mein...", true, 14000, true);
                addMessage("Hamare baare mein kya? 👀", false, 17000);
                addMessage("Bas ye kahna tha ki...", true, 19000, true);
                addMessage("I LOVE you <span class='heart'>❤️</span>", true, 22000);
            }
        });
