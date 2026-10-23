const MessagesAPI = {
// ১. ইউনিক কি তৈরির হেল্পার ফাংশন
   getChatKey: function(jobId, techUid) {
        return `${jobId}_${techUid}`;
    },

  getChatData: function(jobId, currentUserId) {
        const rawData = localStorage.getItem('messages_db');
        if (!rawData) return null;
        
        try {
            const db = JSON.parse(rawData);
            const allMessages = db.allMessages || {};
            
            // সঠিক ইউনিক কি তৈরি করা
            const exactKey = this.getChatKey(jobId, currentUserId);
            
            // ১. যদি হুবহু কি (Key) মিলে যায় শুধু তখনই রিটার্ন করবে, অন্যথায় নয়
            if (allMessages[exactKey]) {
                return allMessages[exactKey];
            }
            
            // যদি হুবহু কি না থাকে, তবে অন্য কোনো জবের বা অন্য ইউজারের ডেটা যাতে ভুলেও না টানে, তাই সরাসরি null রিটার্ন করবে
            return null; 
        } catch (e) {
            return null;
        }
    },
    
    // ক্লায়েন্টের জন্য নির্দিষ্ট জবের সমস্ত চ্যাট অবজেক্ট একসাথে খোঁজার এপিআই মেথড
    getJobAllChats: function(jobId) {
        const rawData = localStorage.getItem('messages_db');
        if (!rawData) return {};
        
        try {
            const db = JSON.parse(rawData);
            const allMessages = db.allMessages || {};
            const jobChats = {};

            // নির্দিষ্ট jobId দিয়ে শুরু হওয়া সব চ্যাট অবজেক্ট ফিল্টার করা
            for (let key in allMessages) {
                if (key.startsWith(jobId)) {
                    jobChats[key] = allMessages[key];
                }
            }
            return jobChats;
        } catch (e) {
            return {};
        }
    },

    // নির্দিষ্ট জব এবং টেকনিশিয়ানের মেসেজগুলো isSeen: true করে লোকালস্টোরেজে সেভ করার ফাংশন
markChatMessagesAsSeen: function(jobId, techUid) {
    const rawData = localStorage.getItem('messages_db');
    if (!rawData) return;
    
    try {
        const db = JSON.parse(rawData);
        const chatKey = `${jobId}_${techUid}`;
        
        // যদি নির্দিষ্ট চ্যাটকি-র আন্ডারে মেসেজগুলো থাকে
        if (db.allMessages && db.allMessages[chatKey] && db.allMessages[chatKey].messages) {
            let updated = false;
            db.allMessages[chatKey].messages.forEach(msg => {
                // আপনার শর্ত অনুযায়ী: যেগুলোর sender 'incoming' এবং isSeen এখনো false আছে
                if (msg.sender === 'outgoing' && msg.isSeen === false) {
                    msg.isSeen = true;
                    updated = true;
                }
            });
            
            // যদি কোনো পরিবর্তন হয়ে থাকে তবে লোকালস্টোরেজে আপডেট ডেটা সেভ করে দেব
            if (updated) {
                localStorage.setItem('messages_db', JSON.stringify(db));
            }
        }
    } catch (e) {
        console.error("Error marking messages as seen:", e);
    }
},

// টেকনিশিয়ানের জন্য নির্দিষ্ট জব এবং টেক ইউআইডি অনুযায়ী মেসেজ সিন করার ফাংশন
markChatMessagesAsSeenTechnician: function(jobId, techUid) {
    const rawData = localStorage.getItem('messages_db');
    if (!rawData) return;

    try {
        let db = JSON.parse(rawData);
        const chatKey = this.getChatKey(jobId, techUid);

        // যদি নির্দিষ্ট চ্যাটকি-র আন্ডারে মেসেজগুলো থাকে
        if (db.allMessages && db.allMessages[chatKey] && db.allMessages[chatKey].messages) {
            let updated = false;
            db.allMessages[chatKey].messages.forEach(msg => {
                // টেকনিশিয়ান পেজে ক্লায়েন্টের পাঠানো মেসেজগুলোর sender চেক করে isSeen ট্রু করা
                if (msg.sender === 'incoming' && msg.isSeen === false) {
                    msg.isSeen = true;
                    updated = true;
                }
            });

            // যদি কোনো পরিবর্তন হয়ে থাকে তবে লোকালস্টোরেজে আপডেট ডেটা সেভ হবে
            if (updated) {
                localStorage.setItem('messages_db', JSON.stringify(db));
            }
        }
    } catch (e) {
        console.error("Error marking messages as seen for technician:", e);
    }
},

    // এটি এপিআই ফাইলের ভেতরে নতুন একটি ফাংশন হিসেবে যোগ করুন (টেকনিশিয়ানের ফাংশন অপরিবর্তিত থাকবে)
saveClientMessage: function(jobId, techUid, messageText, userName) {
    let db = {};
    const rawData = localStorage.getItem('messages_db');
    if (rawData) {
        try { db = JSON.parse(rawData); } catch (e) { db = {}; }
    }

    if (!db.allMessages || typeof db.allMessages !== 'object') {
        db.allMessages = {};
    }

    const chatKey = this.getChatKey(jobId, techUid);
    const clientId = new URLSearchParams(window.location.search).get('id') || '';

    // যদি চ্যাট কি আগে থেকে না থাকে
    if (!db.allMessages[chatKey]) {
        db.allMessages[chatKey] = {
            senderInfo: { senderUid: techUid },
            senderClientInfo: { 
                clientId: clientId, 
                clientName: userName || '' // আপনি পাঠানো userName এখানে সেট হলো
            },
            messages: []
        };
    } else {
        // যদি চ্যাট কি থাকে কিন্তু senderClientInfo না থাকে
        if (!db.allMessages[chatKey].senderClientInfo) {
            db.allMessages[chatKey].senderClientInfo = { 
                clientId: clientId, 
                clientName: userName || '' 
            };
        } else {
            // যদি নাম সেভ করা না থাকে, তবে প্রথমবার userName বসিয়ে দেওয়া
            if (!db.allMessages[chatKey].senderClientInfo.clientName && userName) {
                db.allMessages[chatKey].senderClientInfo.clientName = userName;
            }
        }
    }

    // মেসেজ পুশ করা
    db.allMessages[chatKey].messages.push({
        id: 'msg_' + Date.now() + Math.random().toString(36).substr(2, 9),
        sender: "incoming",
        text: messageText,
        timestamp: Date.now(),
        isDeleted: false,
        isSeen: false
    });

    localStorage.setItem('messages_db', JSON.stringify(db));
},

// আপনার এপিআই ফাইলের ভেতরে যেভাবে যোগ করতে পারেন:
updateMessage: function(jobId, senderUid, messageId, newText) {
    let db = {};
    const rawData = localStorage.getItem('messages_db');
    if (rawData) {
        try { db = JSON.parse(rawData); } catch (e) { db = {}; }
    }

    const chatKey = this.getChatKey(jobId, senderUid);
    if (db.allMessages && db.allMessages[chatKey] && db.allMessages[chatKey].messages) {
        // ইনডেক্সের বদলে .find() দিয়ে ইউনিক id দিয়ে মেসেজ খোঁজা
        const msg = db.allMessages[chatKey].messages.find(m => m.id === messageId);
        if (msg) {
            msg.text = newText;
            msg.isEdited = true;
            msg.timestamp = Date.now();
            
            // ডাটাবেজে সেভ করা
            localStorage.setItem('messages_db', JSON.stringify(db));
            return true;
        }
    }
    return false;
},

// messages-api.js ফাইলের ভেতরে এটি যোগ করুন:
updateClientMessage: function(jobId, techUid, messageId, newText) {
    let db = {};
    const rawData = localStorage.getItem('messages_db');
    if (rawData) {
        try { db = JSON.parse(rawData); } catch (e) { db = {}; }
    }
    
    const chatKey = this.getChatKey(jobId, techUid);
    if (db.allMessages && db.allMessages[chatKey] && db.allMessages[chatKey].messages) {
        const msg = db.allMessages[chatKey].messages.find(m => m.id === messageId);
        if (msg) {
            msg.text = newText;
            msg.isEdited = true;
            msg.timestamp = Date.now();
            
            localStorage.setItem('messages_db', JSON.stringify(db));
            return true;
        }
    }
    return false;
},

findMessageById: function(jobId, senderUid, messageId) {
    let db = {};
    const rawData = localStorage.getItem('messages_db');
    if (rawData) {
        try { db = JSON.parse(rawData); } catch (e) { db = {}; }
    }

    const chatKey = this.getChatKey(jobId, senderUid);
    if (db.allMessages && db.allMessages[chatKey] && db.allMessages[chatKey].messages) {
        return db.allMessages[chatKey].messages.find(m => m.id === messageId);
    }
    return null;
},

// MessagesAPI ফাইলের ভেতরে থাকবে:
deleteMessage: function(jobId, senderUid, messageId) {
    let db = {};
    const rawData = localStorage.getItem('messages_db');
    if (rawData) {
        try { db = JSON.parse(rawData); } catch (e) { db = {}; }
    }

    const chatKey = this.getChatKey(jobId, senderUid);
    if (db.allMessages && db.allMessages[chatKey] && db.allMessages[chatKey].messages) {
        const message = db.allMessages[chatKey].messages.find(m => m.id === messageId);
        if (message) {
            // ১. অডিটের জন্য মূল টেক্সট আলাদা প্রপার্টিতে ব্যাকআপ বা সেভ করে রাখা (যদি আগে না থাকে)
            if (!message.originalText) {
                message.originalText = message.text;
            }

            // ২. ইউআই-এর জন্য টেক্সট পরিবর্তন করে ডিলিটেড মেসেজ সেট করা
            message.text = "এই মেসেজটি ডিলিট করা হয়েছে";
            message.isDeleted = true;
            message.deletedAt = Date.now(); // কখন ডিলিট হয়েছে তার সময়

            // ডাটাবেজ আপডেট করা
            localStorage.setItem('messages_db', JSON.stringify(db));
            return true;
        }
    }
    return false;
},
    saveMessage: function(jobId, senderInfoObj, messageText) {
        let db = {};
        const rawData = localStorage.getItem('messages_db');
        if (rawData) {
            try { db = JSON.parse(rawData); } catch (e) { db = {}; }
        }

        if (!db.allMessages || typeof db.allMessages !== 'object') {
            db.allMessages = {};
        }

        const techUid = senderInfoObj.senderUid; 
        const chatKey = this.getChatKey(jobId, techUid);

        if (!db.allMessages[chatKey]) {
            db.allMessages[chatKey] = {
                senderInfo: {
                    senderUid: senderInfoObj.senderUid,
                    senderName: senderInfoObj.senderName,
                    senderAvatar: senderInfoObj.senderAvatar || 'assets/tech.png'
                },
                messages: []
            };
        }

      db.allMessages[chatKey].messages.push({
    id: 'msg_' + Date.now() + Math.random().toString(36).substr(2, 9), // ইউনিক আইডি
    sender: senderInfoObj.senderRole || 'outgoing',
    text: messageText,
    timestamp: Date.now(),
    isDeleted: false, // সফট ডিলিটের জন্য ডিফ্ল্ট ফ্ল্যাগ
    isSeen: false // নতুন মেসেজের জন্য আনরিড বা অদেখা ফ্ল্যাগ যুক্ত করা হলো
});

        localStorage.setItem('messages_db', JSON.stringify(db));
    }
};

