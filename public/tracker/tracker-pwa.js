/**
 * Progressive Web App (PWA) Setup
 * Handles app installation and offline functionality
 */

let deferredPrompt;
const installButton = document.getElementById('installButton');

// Check if app is installable
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('App is installable');
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button
    installButton.style.display = 'block';
});

// Handle install button click
installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
        console.log('Install prompt not available');
        return;
    }

    // Show install prompt
    deferredPrompt.prompt();
    
    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    
    // Clear the prompt
    deferredPrompt = null;
    installButton.style.display = 'none';
});

// Handle successful installation
window.addEventListener('appinstalled', (e) => {
    console.log('App successfully installed');
    installButton.style.display = 'none';
    
    // Track installation (optional analytics)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install', {
            event_category: 'PWA',
            event_label: 'Lucy Hair Tracker'
        });
    }
});

// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/tracker/sw.js');
            console.log('Service Worker registered successfully:', registration);
            
            // Handle updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New version available
                        if (confirm('A new version is available. Reload to update?')) {
                            window.location.reload();
                        }
                    }
                });
            });
            
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    });
}

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Back online');
    // Try to sync any pending data
    syncPendingData();
});

window.addEventListener('offline', () => {
    console.log('Gone offline');
    showOfflineNotification();
});

function showOfflineNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        font-family: 'Source Sans 3', sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.textContent = 'You\'re offline. Data will sync when reconnected.';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

async function syncPendingData() {
    // Check for any data that needs syncing
    const pendingEntries = JSON.parse(localStorage.getItem('pendingSync') || '[]');
    
    if (pendingEntries.length > 0 && window.tracker) {
        console.log(`Syncing ${pendingEntries.length} pending entries`);
        
        for (const entry of pendingEntries) {
            try {
                await window.tracker.saveToNetlify(entry);
            } catch (error) {
                console.error('Failed to sync entry:', error);
                break; // Stop syncing if one fails
            }
        }
        
        // Clear successfully synced entries
        localStorage.removeItem('pendingSync');
        console.log('All pending entries synced successfully');
    }
}

// Enhanced keyboard shortcuts for mobile
document.addEventListener('keydown', (e) => {
    // Quick actions with Alt key (easier on mobile)
    if (e.altKey) {
        switch(e.key) {
            case 'h': // Alt+H for haircut
                e.preventDefault();
                if (window.tracker) {
                    window.tracker.switchTab('entry');
                    window.tracker.switchEntryType('haircut');
                }
                break;
            case 'm': // Alt+M for misc income
                e.preventDefault();
                if (window.tracker) {
                    window.tracker.switchTab('entry');
                    window.tracker.switchEntryType('misc');
                }
                break;
            case 'e': // Alt+E for expense
                e.preventDefault();
                if (window.tracker) {
                    window.tracker.switchTab('entry');
                    window.tracker.switchEntryType('expense');
                }
                break;
            case 'd': // Alt+D for dashboard
                e.preventDefault();
                if (window.tracker) {
                    window.tracker.switchTab('dashboard');
                }
                break;
        }
    }
});

// Add haptic feedback for supported devices
function hapticFeedback(type = 'light') {
    if ('vibrate' in navigator) {
        switch(type) {
            case 'light':
                navigator.vibrate(10);
                break;
            case 'medium':
                navigator.vibrate(20);
                break;
            case 'heavy':
                navigator.vibrate([10, 10, 10]);
                break;
        }
    }
}

// Add vibration to button clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('lucy-button')) {
        hapticFeedback('light');
    }
});

// Screen wake lock for long data entry sessions
let wakeLock = null;

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Screen wake lock activated');
        }
    } catch (error) {
        console.error('Wake lock failed:', error);
    }
}

// Request wake lock when user starts entering data
document.addEventListener('focus', (e) => {
    if (e.target.matches('input, select, textarea')) {
        requestWakeLock();
    }
}, true);

// Release wake lock when leaving the page
document.addEventListener('visibilitychange', () => {
    if (wakeLock !== null && document.visibilityState === 'hidden') {
        wakeLock.release();
        wakeLock = null;
        console.log('Screen wake lock released');
    }
});

// Theme color update based on profit/loss
function updateThemeColor() {
    if (!window.tracker) return;
    
    const entries = window.tracker.getStoredEntries();
    const analytics = window.tracker.calculateAnalytics(entries);
    
    let themeColor = '#D8A7B1'; // Default Lucy accent color
    
    if (analytics.netProfit > 0) {
        themeColor = '#28a745'; // Green for profit
    } else if (analytics.netProfit < 0) {
        themeColor = '#dc3545'; // Red for loss
    }
    
    // Update theme color meta tag
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
        themeColorMeta.setAttribute('content', themeColor);
    }
}

// Update theme color when dashboard is viewed
document.addEventListener('click', (e) => {
    if (e.target.dataset.tab === 'dashboard') {
        setTimeout(updateThemeColor, 500);
    }
});
