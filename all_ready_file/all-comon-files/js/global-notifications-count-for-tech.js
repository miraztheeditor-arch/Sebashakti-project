document.addEventListener('DOMContentLoaded', () => {
    function updateTechnicianBadge() {
        if (typeof NotificationAPI !== 'undefined' && typeof NotificationAPI.getTechnicianUnreadCountOnly === 'function') {
            const chatUnreadCount = NotificationAPI.getTechnicianUnreadCountOnly();
            const badgeEl = document.querySelector('.notification-badge');
            
            if (badgeEl) {
                let existingCount = parseInt(badgeEl.getAttribute('data-other-count')) || 0;
                const totalBadgeCount = existingCount + chatUnreadCount;
                
                if (totalBadgeCount > 0) {
                    badgeEl.style.display = 'inline-block';
                    
                    // ৯৯ এর বেশি হলে '99+' দেখানোর লজিক
                    if (totalBadgeCount > 99) {
                        badgeEl.innerText = '99+';
                    } else {
                        badgeEl.innerText = totalBadgeCount;
                    }
                } else {
                    badgeEl.style.display = 'none';
                }
            }
        }
    }

    updateTechnicianBadge();
    setInterval(updateTechnicianBadge, 3000);
});