const NotificationAPI = {

    // ক. টেকনিশিয়ানের কার্ড রেন্ডার করার মেইন ফাংশন
fetchTechnicianChatNotifications: function() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('id');
    if (!targetUserId) return '';

    const messagesDb = JSON.parse(localStorage.getItem('messages_db')) || { allMessages: {} };
    const allChats = messagesDb.allMessages || {};

    let allNotifications = [];

    for (const chatKey in allChats) {
        const chatData = allChats[chatKey];
        const messages = chatData.messages || [];

        let belongsToUser = false;
        if (chatKey.includes(targetUserId) || (chatData.participants && chatData.participants.includes(targetUserId))) {
            belongsToUser = true;
        }

        if (belongsToUser) {
            const unreadMessages = messages.filter(msg => 
                msg.isSeen === false && 
                msg.isDeleted !== true && 
                msg.sender === 'incoming'
            );

            if (unreadMessages.length > 0) {
                const lastUnreadMsg = unreadMessages[unreadMessages.length - 1];
                const senderName = chatData.senderClientInfo?.clientName || 'গ্রাহক';

                const truncateText = (text, limit) => {
                    return text.length > limit ? text.substring(0, limit) + '...' : text;
                };

                const formattedSenderName = truncateText(senderName, 20);
                const formattedMessage = truncateText(lastUnreadMsg.text, 45);

                const diff = Math.floor((Date.now() - lastUnreadMsg.timestamp) / 60000);
                let timeAgo = 'এই মাত্র';
                if (diff >= 1 && diff < 60) timeAgo = `${diff} মিনিট আগে`;
                else if (diff >= 60) timeAgo = `${Math.floor(diff / 60)} ঘণ্টা আগে`;

                allNotifications.push({
                    timestamp: lastUnreadMsg.timestamp,
                    html: `
                    <div class="notification-card" onclick="window.location.href='job-details-technician.html?jobId=${chatKey.split('_TECH-')[0]}&id=${targetUserId}&chatKey=${chatKey}'">
                        <div class="notification-icon-box">💬</div>
                        <div class="notification-content">
                            <h4>নতুন চ্যাট মেসেজ এসেছে</h4>
                            <p><strong>${formattedSenderName}</strong> আপনাকে একটি মেসেজ পাঠিয়েছেন: "${formattedMessage}"</p>
                            <span class="notification-time">${timeAgo}</span>
                        </div>
                    </div>`
                });
            }
        }
    }

    allNotifications.sort((a, b) => b.timestamp - a.timestamp);

    let notificationCardsHTML = '';
    allNotifications.forEach(notif => {
        notificationCardsHTML += notif.html;
    });

    return notificationCardsHTML;
},

    // খ. টেকনিশিয়ানের শুধুমাত্র কাউন্ট রিটার্ন করার লাইটওয়েট ফাংশন
 getTechnicianUnreadCountOnly: function() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('id');
    

    if (!targetUserId) return 0;

    const messagesDb = JSON.parse(localStorage.getItem('messages_db')) || { allMessages: {} };
    const allChats = messagesDb.allMessages || {};

    let totalUnreadCount = 0;

    for (const chatKey in allChats) {
        const chatData = allChats[chatKey];
        const messages = chatData.messages || [];

        let belongsToUser = false;
        if (chatKey.includes(targetUserId) || (chatData.participants && chatData.participants.includes(targetUserId))) {
            belongsToUser = true;
        }

        if (belongsToUser) {
            // চেক করা হচ্ছে এই চ্যাটে অন্তত একটি আনরিড ইনকামিং মেসেজ আছে কি না
            const hasUnread = messages.some(msg => 
                msg.isSeen === false && 
                msg.isDeleted !== true && 
                msg.sender === 'incoming'
            );

            // যদি একটি বা একাধিক আনরিড মেসেজ থাকে, তবে এই চ্যাটের জন্য মাত্র ১ যোগ হবে
            if (hasUnread) {
                totalUnreadCount += 1;
            }
        }
    }

    
    return totalUnreadCount;
}
};