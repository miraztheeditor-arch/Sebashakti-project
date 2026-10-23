const NotificationAPI = {
    fetchChatNotifications: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const targetUserId = urlParams.get('id');

        if (!targetUserId) return '';

        const userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        const messagesDb = JSON.parse(localStorage.getItem('messages_db')) || { allMessages: {} };

        let matchedAccountKey = null;
        let currentUserId = null;

        for (const key in userMasterData) {
            if (userMasterData[key].userId === targetUserId) {
                matchedAccountKey = key;
                currentUserId = userMasterData[key].userId; // ইউজারের আসল আইডি সংগ্রহ করা
                break;
            }
        }

        if (!matchedAccountKey) return '';

        const accountData = userMasterData[matchedAccountKey];
        const postedJobs = accountData.jobSection?.postedJobs || {};

        let allNotifications = [];
        const allChats = messagesDb.allMessages || {};

        for (const chatKey in allChats) {
            const chatData = allChats[chatKey];
            const messages = chatData.messages || [];

            let belongsToUser = false;
            let matchedJobId = null;

            for (const jobId in postedJobs) {
                if (chatKey.includes(jobId)) {
                    belongsToUser = true;
                    matchedJobId = jobId;
                    break;
                }
            }

            if (belongsToUser) {
                const unreadMessages = messages.filter(msg => msg.isSeen === false && msg.isDeleted !== true && msg.sender === 'outgoing');

                if (unreadMessages.length > 0) {
                    const lastUnreadMsg = unreadMessages[unreadMessages.length - 1];
                    const senderName = chatData.senderInfo?.senderName || 'গ্রাহক';
                    
                    const truncateText = (text, limit) => {
                        return text.length > limit ? text.substring(0, limit) + '...' : text;
                    };

                    const formattedSenderName = truncateText(senderName, 20);
                    const formattedMessage = truncateText(lastUnreadMsg.text, 45);

                    const diff = Math.floor((Date.now() - lastUnreadMsg.timestamp) / 60000);
                    let timeAgo = 'এই মাত্র';
                    if (diff >= 1 && diff < 60) timeAgo = `${diff} মিনিট আগে`;
                    else if (diff >= 60) timeAgo = `${Math.floor(diff / 60)} ঘণ্টা আগে`;

                    // এখানে লিঙ্কের সাথে id=${currentUserId} যুক্ত করে দেওয়া হয়েছে
                    allNotifications.push({
                        timestamp: lastUnreadMsg.timestamp,
                        html: `
                            <div class="notification-card" onclick="window.location.href='job-details-client.html?id=${currentUserId}&jobId=${matchedJobId}&chatKey=${encodeURIComponent(chatKey)}&openChat=true'" style="cursor: pointer;">
            <div class="notification-icon-box">💬</div>
            <div class="notification-content">
                <h4>নতুন চ্যাট মেসেজ এসেছে</h4>
                <p><strong>${formattedSenderName}</strong> আপনাকে একটি মেসেজ পাঠিয়েছেন: "${formattedMessage}"</p>
                <span class="notification-time">${timeAgo}</span>
            </div>
        </div>
                        `
                    });
                }
            }
        }
const masterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        // ১. বর্তমান ইউজারের postedJobs অবজেক্ট থেকে জব আইডিগুলো চেক করা
const postedJobsObj = accountData.jobSection?.postedJobs || {};

// ২. সমস্ত টেকনিশিয়ানের ডেটার মধ্যে লুপ চালানো
for (const techKey in masterData) {
    const techObj = masterData[techKey];
    
    if (techObj && techObj.jobSection && techObj.jobSection.appliedProposal) {
        const appliedProposals = techObj.jobSection.appliedProposal;
        
        for (const jobId in appliedProposals) {
            // ৩. postedJobs অবজেক্টের ভেতরে এই jobId আছে কি না তা চেক করা
            if (postedJobsObj[jobId]) {
                const proposal = appliedProposals[jobId];
                
                // ৪. যদি isRead === false হয় (আনসিন আবেদন)
                if (proposal.isRead === false) {
                    const applicantName = proposal.applicantIdentification ? proposal.applicantIdentification.name : "টেকনিশিয়ান";
                    // প্রপোজাল ডেটা থেকে সঠিক applicantId বা টেকনিশিয়ানের আইডিটি বের করে নিন
                    const correctApplicantId = proposal.applicantId || techKey;
                    
                    const appliedTime = proposal.proposalDetails && proposal.proposalDetails.appliedAt ? new Date(proposal.proposalDetails.appliedAt).getTime() : Date.now();
                    
                    const diff = Math.floor((Date.now() - appliedTime) / 60000);
                    let timeAgo = 'এই মাত্র';
                    if (diff >= 1 && diff < 60) timeAgo = `${diff} মিনিট আগে`;
                    else if (diff >= 60) timeAgo = `${Math.floor(diff / 60)} ঘণ্টা আগে`;

                    allNotifications.push({
                        timestamp: appliedTime,
                        html: `
                      <div class="notification-card" onclick="window.location.href='job-details-client.html?id=${currentUserId}&jobId=${jobId}&applicantId=${correctApplicantId}&openProposal=true'">
                            <div class="notification-icon-box">📋</div>
                            <div class="notification-content">
                                <h4>নতুন আবেদন এসেছে</h4>
                                <p><strong>${applicantName}</strong> আপনার জবে একটি প্রপোজাল পাঠিয়েছেন।</p>
                                <span class="notification-time">${timeAgo}</span>
                            </div>
                        </div>
                        `
                    });
                }
            }
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

// notifications-api.js ফাইলের ভেতরে এটি যুক্ত করুন:

getUnreadCountOnly: function() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('id');
    if (!targetUserId) return 0;

    const userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
    const messagesDb = JSON.parse(localStorage.getItem('messages_db')) || { allMessages: {} };

    let matchedAccountKey = null;
    for (const key in userMasterData) {
        if (userMasterData[key].userId === targetUserId) {
            matchedAccountKey = key;
            break;
        }
    }

    if (!matchedAccountKey) return 0;

    const accountData = userMasterData[matchedAccountKey];
    const rawPostedJobs = accountData.jobSection?.postedJobs;
    const postedJobs = Array.isArray(rawPostedJobs) 
        ? rawPostedJobs 
        : (rawPostedJobs ? Object.keys(rawPostedJobs) : []);
        
    const allChats = messagesDb.allMessages || {};
    let totalUnreadCount = 0;

    for (const chatKey in allChats) {
        const chatData = allChats[chatKey];
        const messages = chatData.messages || [];

        let belongsToUser = false;
        for (const jobId of postedJobs) {
            if (chatKey.includes(jobId)) {
                belongsToUser = true;
                break;
            }
        }

        if (belongsToUser) {
            const unreadMessages = messages.filter(msg => 
                msg.isSeen === false && 
                msg.sender === 'outgoing'
            );

            // চ্যাটপ্রতি মাত্র ১ করে কাউন্ট যোগ হবে
            if (unreadMessages.length > 0) {
                totalUnreadCount += 1;
            }
        }
    }

    // চ্যাট আনসিন মেসেজ গণনা করার লজিক এখানে শেষ হচ্ছে...
    // ঠিক এর পরেই নতুন প্রপোজালের আনসিন কাউন্ট যোগ করার কোডটি বসিয়ে দিন:

    try {
        for (const techKey in userMasterData) {
            const techObj = userMasterData[techKey];
            
            if (techObj && techObj.jobSection && techObj.jobSection.appliedProposal) {
                const appliedProposals = techObj.jobSection.appliedProposal;
                
                for (const jobId in appliedProposals) {
                    const isMyJob = postedJobs.includes ? postedJobs.includes(jobId) : postedJobs[jobId];
                    
                    if (isMyJob) {
                        const proposal = appliedProposals[jobId];
                        if (proposal && proposal.isRead === false) {
                            totalUnreadCount += 1;
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error("Error counting proposal notifications:", err);
    }


    return totalUnreadCount;
}
};

