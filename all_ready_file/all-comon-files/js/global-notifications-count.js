document.addEventListener('DOMContentLoaded', () => {
    function updateBadge() {
        if (typeof NotificationAPI !== 'undefined' && typeof NotificationAPI.getUnreadCountOnly === 'function') {
            const chatUnreadCount = NotificationAPI.getUnreadCountOnly(); // শুধু মেসেজের আনরিড কাউন্ট
            const badgeEl = document.querySelector('.notification-badge');
            
        // গ্লোবাল ফাইলের ব্যাজ আপডেট করার লজিকটি এভাবে ঠিক করে নিন:

if (badgeEl) {
    let existingCount = parseInt(badgeEl.getAttribute('data-other-count')) || 0;
    const totalBadgeCount = existingCount + chatUnreadCount;
    
    if (totalBadgeCount > 0) {
        badgeEl.style.display = 'inline-block';
        
        // ৯৯ এর বেশি হলে '99+' অথবা বাংলায় '৯৯+' করে দেওয়া
        if (totalBadgeCount > 99) {
            badgeEl.innerText = '99+'; // অথবা বাংলায় চাইলে '৯৯+' দিতে পারেন
        } else {
            badgeEl.innerText = totalBadgeCount;
        }
    } else {
        badgeEl.style.display = 'none';
    }
}
        }
    }

    updateBadge(); // পেজ লোড হওয়ার সাথে সাথে
    setInterval(updateBadge, 3000); // প্রতি ৩ সেকেন্ড পর পর পোলিং
});