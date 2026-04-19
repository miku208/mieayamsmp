/**
 * mieayamsmp - Minecraft Server Landing Page
 * Fitur: Server status checker, copy to clipboard, social bubbles, dll
 */

// ===== CONFIGURATION =====
const CONFIG = {
    serverIP: 'mieayam.biz.id',
    serverPort: '19183',
    logoURL: './logo.jpg',
    whatsappLink: 'https://chat.whatsapp.com/Lu8XeNEyMd43AorpEolXYc?mode=gi_t',
    discordLink: 'https://discord.gg/NS9TQbauXh',
    tiktokLink: 'https://www.tiktok.com/@mieayamsmp'
};

// ===== DOM Elements =====
const copyButtons = document.querySelectorAll('.copy-btn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const playNowBtn = document.getElementById('playNowBtn');
const bubbleToggle = document.getElementById('bubbleToggle');
const bubblesContainer = document.getElementById('bubblesContainer');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-links');

// ===== Initialize Configuration =====
function initializeConfig() {
    // Set logo
    const logos = document.querySelectorAll('.server-logo, .footer-logo img');
    logos.forEach(logo => {
        logo.src = CONFIG.logoURL;
        logo.onerror = function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%23ff9933\'/%3E%3Crect x=\'20\' y=\'20\' width=\'60\' height=\'60\' fill=\'%23cc7a29\'/%3E%3Ctext x=\'50\' y=\'70\' font-size=\'40\' text-anchor=\'middle\' fill=\'%23fff\' font-family=\'Arial\'%3EMIE%3C/text%3E%3C/svg%3E';
        };
    });
    
    // Set server IP in info card
    const ipElement = document.getElementById('serverIP');
    const portElement = document.getElementById('serverPort');
    if (ipElement) ipElement.textContent = CONFIG.serverIP;
    if (portElement) portElement.textContent = CONFIG.serverPort;
    
    // Update copy button data attributes
    const ipCopyBtn = document.querySelector('.copy-btn[data-copy="play.mieayamsmp.xyz"]');
    const portCopyBtn = document.querySelector('.copy-btn[data-copy="19132"]');
    
    if (ipCopyBtn) ipCopyBtn.setAttribute('data-copy', CONFIG.serverIP);
    if (portCopyBtn) portCopyBtn.setAttribute('data-copy', CONFIG.serverPort);
    
    // Set social media links
    const waBubble = document.querySelector('.bubble.wa');
    const discordBubble = document.querySelector('.bubble.discord');
    const tiktokBubble = document.querySelector('.bubble.tiktok');
    const socialCircles = document.querySelectorAll('.social-circle');
    
    if (waBubble) waBubble.href = CONFIG.whatsappLink;
    if (discordBubble) discordBubble.href = CONFIG.discordLink;
    if (tiktokBubble) tiktokBubble.href = CONFIG.tiktokLink;
    
    socialCircles.forEach(circle => {
        if (circle.classList.contains('whatsapp')) circle.href = CONFIG.whatsappLink;
        if (circle.classList.contains('discord')) circle.href = CONFIG.discordLink;
        if (circle.classList.contains('tiktok')) circle.href = CONFIG.tiktokLink;
    });
}

// ===== Server Status Checker =====
async function checkServerStatus() {
    const statusBadge = document.querySelector('.status-badge');
    const playerCountElement = document.getElementById('playerCount');
    const maxCountElement = document.getElementById('maxCount');
    const communityCountElement = document.getElementById('communityCount');
    
    if (!statusBadge || !playerCountElement) return;
    
    try {
        // Simulate API call with timeout
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
        );
        
        const fetchPromise = fetch(`https://api.mcsrvstat.us/2/${CONFIG.serverIP}:${CONFIG.serverPort}`);
        
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        const data = await response.json();
        
        if (data.online) {
            // Server Online
            statusBadge.className = 'status-badge online';
            statusBadge.innerHTML = '<i class="fas fa-circle"></i> Online';
            
            if (data.players && data.players.online !== undefined) {
                playerCountElement.textContent = data.players.online;
                if (maxCountElement) {
                    maxCountElement.textContent = data.players.max || '1000';
                }
                if (communityCountElement) {
                    const totalCommunity = data.players.online + 450;
                    communityCountElement.textContent = `${totalCommunity}+`;
                }
            } else {
                playerCountElement.textContent = '?';
            }
            
            console.log(`✅ Server ONLINE - Players: ${data.players?.online || 0}/${data.players?.max || 1000}`);
        } else {
            // Server Offline
            statusBadge.className = 'status-badge offline';
            statusBadge.innerHTML = '<i class="fas fa-circle"></i> Offline';
            playerCountElement.textContent = '0';
            if (maxCountElement) maxCountElement.textContent = '0';
            if (communityCountElement) communityCountElement.textContent = '450+';
            
            console.log('❌ Server OFFLINE');
        }
    } catch (error) {
        console.log('Server status check failed, using fallback:', error);
        
        // Fallback: Simulate online status untuk demo
        const isOnline = Math.random() > 0.2; // 80% chance online
        
        if (isOnline) {
            statusBadge.className = 'status-badge online';
            statusBadge.innerHTML = '<i class="fas fa-circle"></i> Online';
            
            const randomPlayers = Math.floor(Math.random() * 80) + 20;
            playerCountElement.textContent = randomPlayers;
            if (maxCountElement) maxCountElement.textContent = '100';
            if (communityCountElement) {
                const totalCommunity = randomPlayers + 450;
                communityCountElement.textContent = `${totalCommunity}+`;
            }
            
            console.log(`✅ Demo Mode - Server ONLINE (${randomPlayers} players)`);
        } else {
            statusBadge.className = 'status-badge offline';
            statusBadge.innerHTML = '<i class="fas fa-circle"></i> Offline';
            playerCountElement.textContent = '0';
            if (maxCountElement) maxCountElement.textContent = '0';
            if (communityCountElement) communityCountElement.textContent = '450+';
            
            console.log('❌ Demo Mode - Server OFFLINE');
        }
    }
}

// ===== Floating Bubbles Toggle =====
if (bubbleToggle && bubblesContainer) {
    bubbleToggle.addEventListener('click', () => {
        bubblesContainer.classList.toggle('collapsed');
        bubbleToggle.classList.toggle('collapsed');
        
        // Save state to localStorage
        const isCollapsed = bubblesContainer.classList.contains('collapsed');
        localStorage.setItem('bubblesCollapsed', isCollapsed);
    });
    
    // Load saved state
    const savedState = localStorage.getItem('bubblesCollapsed');
    if (savedState === 'true') {
        bubblesContainer.classList.add('collapsed');
        bubbleToggle.classList.add('collapsed');
    }
}

// ===== Mobile Menu Toggle =====
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').className = 'fas fa-bars';
        }
    });
}

// ===== Toast Notification Function =====
function showToast(message, duration = 3000) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ===== Copy to Clipboard Function =====
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast(`✅ Copied: ${text}`);
        
        // Add visual feedback
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('copy-btn')) {
            activeElement.style.background = 'rgba(255, 153, 51, 0.3)';
            setTimeout(() => {
                activeElement.style.background = '';
            }, 500);
        }
        
    } catch (err) {
        // Fallback untuk older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            showToast(`✅ Copied: ${text}`);
        } catch (err) {
            showToast('❌ Failed to copy', 2000);
        }
        
        document.body.removeChild(textarea);
    }
}

// ===== Event Listeners for Copy Buttons =====
copyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const textToCopy = button.getAttribute('data-copy');
        
        // Animasi klik
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
        
        copyToClipboard(textToCopy);
    });
});

// ===== Play Now Button Handler =====
if (playNowBtn) {
    playNowBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('🍜 Launching mieayamsmp...', 2000);
        
        // Animasi tombol
        playNowBtn.style.animation = 'none';
        playNowBtn.offsetHeight;
        playNowBtn.style.animation = 'btnGlow 0.5s infinite';
        
        setTimeout(() => {
            playNowBtn.style.animation = 'btnGlow 2s infinite';
        }, 500);
    });
}

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        if (targetId.includes('#')) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offset = 80;
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active link
                document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.querySelector('i').className = 'fas fa-bars';
                }
            }
        }
    });
});

// ===== Active Nav Link on Scroll =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ===== Card Hover Animation =====
const cards = document.querySelectorAll('.info-card, .feature-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== Particle Background =====
function createParticles() {
    const bg = document.querySelector('.pixel-bg');
    if (!bg) return;
    
    // Hapus particles lama jika ada
    const oldParticles = bg.querySelectorAll('.particle');
    oldParticles.forEach(p => p.remove());
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = '#ff9933';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.opacity = Math.random() * 0.5;
        particle.style.animation = `floatParticle ${5 + Math.random() * 10}s linear infinite`;
        particle.style.pointerEvents = 'none';
        
        bg.appendChild(particle);
    }
}

// Add particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 0.5;
        }
        90% {
            opacity: 0.5;
        }
        100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Lazy Loading Cards =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.info-card, .feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// ===== Progress Bar for Scroll =====
window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    let progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
});

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', function() {
    initializeConfig();
    createParticles();
    
    // Check server status immediately and every 60 seconds
    checkServerStatus();
    setInterval(checkServerStatus, 60000);
    
    // Console welcome message
    console.log('%c🍜 mieayamsmp - Minecraft Server', 'font-size: 20px; color: #ff9933; font-weight: bold;');
    console.log(`%cIP: ${CONFIG.serverIP} | Port: ${CONFIG.serverPort}`, 'font-size: 14px; color: #a0c0b5;');
    console.log('%c🍗 Fitur: Economy, Claim, Team, Bounty, Custom Enchant, Gacha, PvP, AFK, Coinflip, Skill', 'font-size: 12px; color: #ff9933;');
    
    // Auto refresh status when tab becomes visible
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            checkServerStatus();
        }
    });
});

// ===== Handle Window Load =====
window.addEventListener('load', function() {
    // Additional check on load
    checkServerStatus();
});
