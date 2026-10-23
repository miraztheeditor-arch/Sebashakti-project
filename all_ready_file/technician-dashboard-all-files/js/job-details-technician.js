let loggedInUserAvatar = "assets/tech.png"; // ডিফল্ট ছবি
let currentUserId = "";
let currentJobId = "";
let userName = "";
let editingMessageId = null;

document.addEventListener('DOMContentLoaded', async () => {
    // ১. ইউআরএল বা সেশন থেকে বর্তমান ইউজারের আইডি বের করুন
    const urlParams = new URLSearchParams(window.location.search);
         currentUserId = urlParams.get('id') || sessionStorage.getItem('liveUserId');
         currentJobId = targetJobId || 'job_default_123';

    if (!currentUserId) return;

// ২. সরাসরি লোকালস্টোরেজ না ধরে, এপিআই ফাংশন ব্যবহার করে ইউজারের ডাটা বা নাম নিয়ে আসা
    if (typeof UserAPI === 'undefined') return;

    // এপিআই থেকে নাম বা ইউজার অবজেক্ট ফেচ করা
         userName = UserAPI.getUserNameViaApi ? UserAPI.getUserNameViaApi(currentUserId) : "User";
    
    if (userName && userName !== "User") {
        const userId = currentUserId;
        const firstLetter = userName.charAt(0).toUpperCase();

        // --- ৩. সাইডবার (Sidebar) সেকশনের ডেটা আপডেট ---
        const sidebarName = document.getElementById('user-name');
        if (sidebarName) sidebarName.innerText = userName;

        const sidebarId = document.getElementById('user-id-profile');
        if (sidebarId) sidebarId.innerText = `UID: ${userId}`;

        const sidebarAvatarLetter = document.getElementById('profile-avatar-letter');
        if (sidebarAvatarLetter) sidebarAvatarLetter.innerText = firstLetter;

        // --- ৪. হেডার বা নেভিগেশন বারের অ্যাভাটার আপডেট ---
        const navAvatarLetter = document.getElementById('avatar-letter');
        if (navAvatarLetter) navAvatarLetter.innerText = firstLetter;

        // --- ৫. ইনপুট ফিল্ডে নাম বসানোর জন্য (যেমন: post-jobs পেজের জন্য) ---
        // আপনার স্ক্রিনশটে ইনপুট আইডি 'userName' বা 'fullName' থাকতে পারে, দুটোই হ্যান্ডেল করার ব্যবস্থা
        const nameInput = document.getElementById('userName') || document.getElementById('fullName');
        if (nameInput) nameInput.value = userName;

        console.log("সফলভাবে সব জায়গায় (ইনপুট, সাইডবার ও হেডার) ডেটা ও অ্যাভাটার লোড হয়েছে:", userName);
    }
});

function showTab(event, tabId) {
    // সব ট্যাব কন্টেন্ট লুকানো
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    // সব বাটনের active ক্লাস রিমুভ
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    // নির্দিষ্ট ট্যাব এবং বাটন সক্রিয় করা
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function toggleSidebar() {
    const sidebar = document.getElementById("profileSidebar");
    sidebar.classList.toggle("active");
}

const sidebar = document.getElementById('profileSidebar');
const overlay = document.getElementById('overlay');

// সাইডবার এবং ওভারলে ওপেন করার ফাংশন
function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// ওভারলেতে ক্লিক করলে সাইডবার বন্ধ হবে
overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// ১. লগ আউটে ক্লিক করলে মডাল শো করবে
function showLogoutModal(event) {
    event.preventDefault();
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.style.setProperty('display', 'flex', 'important');
    }
}

// ২. 'বাতিল' বাটনে ক্লিক করলে মডাল বন্ধ হবে
function hideLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.style.setProperty('display', 'none', 'important');
    }
}

// ৩. চূড়ান্তভাবে লগ আউট কনফার্ম করলে
function executeLogout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '../../index.html'; // আপনার লগইন পেজের লিংক
}

document.getElementById('jobs-btn').addEventListener('click', function() {
    window.location.href = 'post-jobs.html';
});

document.getElementById('bell-icon').addEventListener('click', function() {
    window.location.href = 'bell-icon-client.html';
});


document.addEventListener('DOMContentLoaded', async () => {
    // বর্তমান ইউজারের আইডি বের করা
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get('id') || sessionStorage.getItem('liveUserId');

    if (currentUserId) {
        try {
            // এপিআই থেকে সেভ করা ছবিটি নিয়ে আসা
             const savedImageString = await UserAPI.getProfileImage(currentUserId);

if (savedImageString) {
    // গ্লোবাল ভেরিয়েবলে ইউজারের আসল ছবি সেভ করে রাখা
    loggedInUserAvatar = savedImageString; 

    // ১. ড্যাশবোর্ডের এই ছবি 'profile-avatar' এলিমেন্টগুলোতে সেট করার আপনার পুরোনো কোড...
    const avatarElements = document.querySelectorAll('#profile-avatar');
    avatarElements.forEach(avatarContainer => {
        avatarContainer.style.backgroundImage = `url(${savedImageString})`;
        avatarContainer.style.backgroundSize = 'cover';
        avatarContainer.style.backgroundPosition = 'center';
        
        const innerSpan = avatarContainer.querySelector('span');
        if (innerSpan) {
            innerSpan.remove();
        }
    });
}
        } catch (error) {
            console.error("প্রোফাইল ছবি লোড করতে সমস্যা হয়েছে:", error);
        }
    }
});

// ১. ইউআরএল থেকে jobId ধরে নেওয়া
const urlParams = new URLSearchParams(window.location.search);
const targetJobId = urlParams.get('jobId');

// ২. সব জব থেকে নির্দিষ্ট jobId ওয়ালা জব ডাটা খুঁজে বের করা
const allJobs = TechnicianFindJobAPI.getAllPostedJobs();
const currentJob = allJobs.find(job => job.jobId === targetJobId);

if (currentJob) {
    // ৩. সঠিক আইডিগুলোতে ডেটা বসিয়ে দেওয়া
    document.getElementById('lbl-username').innerText = currentJob.name || '-';
    document.getElementById('lbl-category').innerText = currentJob.categoryName || '-';
    document.getElementById('lbl-current-location').innerText = currentJob.location || '-';
    document.getElementById('lbl-fixed-location').innerText = currentJob.fixedLocation || '-';
    document.getElementById('lbl-units').innerText = currentJob.unit || '-';
    document.getElementById('lbl-date').innerText = currentJob.dateTime || '-';
    document.getElementById('lbl-jobid').innerText = currentJob.jobId || '-';
    document.getElementById('lbl-current-location').innerText = currentJob.currentLocation || '-';
    document.getElementById('lbl-details').innerText = currentJob.problemDetails || '-';
    document.getElementById('clientUidDisplay').innerText = currentJob.userId || '-';
    
    // যদি প্রবলেম ডিটেইলস বা অন্যান্য ফিল্ড থাকে সেগুলোর জন্যও এভাবে বসাতে পারবেন
    // নতুন লাইন: লোগো বা প্রোফাইল ছবি সেট করা
   // লোগো বা প্রোফাইল ছবি সেট করা (আপনার আগের কোড)
const logoImg = document.getElementById('client-profile-pic');
if (currentJob.logo && currentJob.logo !== "") {
    logoImg.src = currentJob.logo;
}

// === নতুন যোগ করুন: চ্যাট মডালের হেডার ইমেজ ও নাম ডাইনামিক করার জন্য ===
const chatHeaderImg = document.getElementById('modal-client-img');
const chatHeaderName = document.getElementById('modal-client-name');

if (chatHeaderImg && currentJob.logo) {
    chatHeaderImg.src = currentJob.logo;
}
if (chatHeaderName && currentJob.name) {
    chatHeaderName.innerText = currentJob.name;


        
} else {
    console.warn("নির্দিষ্ট জব আইডি পাওয়া যায়নি!");
}
}

// ১. আকর্ষণীয় ও কালারফুল টোস্ট ফাংশন (উপরিভাগে দেখানোর জন্য)
function showToast(message, type = 'error') {
    let toast = document.getElementById('custom-toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'custom-toast-notification';
        toast.style.position = 'fixed';
        toast.style.top = '25px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        toast.style.padding = '14px 28px';
        toast.style.borderRadius = '8px';
        toast.style.zIndex = '99999';
        toast.style.fontSize = '15px';
        toast.style.fontWeight = '500';
        toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        toast.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        toast.style.opacity = '0';
        document.body.appendChild(toast);
    }
    
    if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #10B981, #059669)';
        toast.style.color = '#ffffff';
    } else {
        toast.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
        toast.style.color = '#ffffff';
    }
    
    toast.innerText = message;
    
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
    }, 3500);
}

const chatBtn = document.getElementById('chat-with-client-btn');
const chatModal = document.getElementById('chat-modal');
const closeChatModal = document.getElementById('close-chat-modal');



chatBtn.addEventListener('click', async function() {
    try {
        // এপিআই থেকে প্রোফাইল ইমেজ ফেচ করা
        const profileData = typeof UserAPI !== 'undefined' ? await UserAPI.getProfileImage(currentUserId) : null;

        // এখানে চেক করা হচ্ছে ডাটা বা ইমেজ স্ট্রিং আসলেই আছে কি না
        const hasImage = profileData && (
            typeof profileData === 'string' ? profileData.trim() !== "" : 
            (profileData.imageString && profileData.imageString.trim() !== "")
        );

        if (!hasImage) {
            showProfileIncompleteModal(currentUserId, 'chat');
            return; // ছবি না থাকলে মোডাল ওপেন হবে না
        }

        // ছবি থাকলে চ্যাট মোডাল ওপেন হবে এবং পোলিং শুরু হবে
        startChatPolling(currentJobId, currentUserId);
        chatModal.style.display = 'flex';
        // **এখানে ব্যাকগ্রাউন্ড স্ক্রল বন্ধ করা হলো**
        document.body.style.overflow = 'hidden';
        loadExistingMessages(currentJobId, currentUserId, true);

    } catch (error) {
        console.error("প্রোফাইল ইমেজ চেক করতে সমস্যা হয়েছে:", error);
    }
});

// বন্ধ করা
closeChatModal.addEventListener('click', function() {
    chatModal.style.display = 'none';
    // **এখানে ব্যাকগ্রাউন্ড স্ক্রল আবার চালু করে দেওয়া হলো**
    document.body.style.overflow = 'auto';
    stopChatPolling()
});

// মোডালের বাইরে কোথাও ক্লিক করলেও যেন বন্ধ হয়ে যায় (অপশনাল)
window.addEventListener('click', function(event) {
    if (event.target === chatModal) {
        chatModal.style.display = 'none';
        // **এখানে ব্যাকগ্রাউন্ড স্ক্রল আবার চালু করে দেওয়া হলো**
    document.body.style.overflow = 'auto';
        stopChatPolling();
    }
});

const textarea = document.getElementById('chat-input-message');
const maxHeight = 115; // ৫ লাইন পর্যন্ত বড় হওয়ার সর্বোচ্চ সীমা

textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    
    // যদি ৫ লাইনের কম বা সমান হয়, তবে বক্স বড় হতে থাকবে আর স্ক্রলবার থাকবে না
    if (this.scrollHeight <= maxHeight) {
        this.style.height = this.scrollHeight + 'px';
        this.style.overflowY = 'hidden';
    } else {
        // ষষ্ঠ লাইনে পৌঁছালে হাইট ৫ লাইনে আটকে যাবে এবং স্ক্রলবার চলে আসবে
        this.style.height = maxHeight + 'px';
        this.style.overflowY = 'auto';
    }
});

// আগের মোট মেসেজ সংখ্যা ট্র্যাক করার জন্য একটি ভেরিয়েবল রাখতে পারেন (অথবা লেংথ চেক)
let previousMessageCount = 0;

function loadExistingMessages(jobId, userId, forceScroll = false) {
    const chatContainer = document.getElementById('chat-messages-container');
    if (!chatContainer) return; // এখানে বানান ঠিক করে নেবেন
    
    chatContainer.innerHTML = ""; 

    // সঠিক জব আইডি এবং কারেন্ট ইউজারের আইডি পাস করা হচ্ছে
    const chatData = MessagesAPI.getChatData(jobId, userId);

    if (!chatData || !chatData.messages || !Array.isArray(chatData.messages)) {
        console.log("এই ইউজারের জন্য এই জব আইডিতে কোনো চ্যাট নেই।");
        return;
    }

    // আপনার loadExistingMessages ফাংশনের ভেতরে কল করার সময়:
if (typeof MessagesAPI !== 'undefined' && typeof MessagesAPI.markChatMessagesAsSeenTechnician === 'function') {
    MessagesAPI.markChatMessagesAsSeenTechnician(jobId, userId); // এখানে currentTechUid এর পরিবর্তে jobId এবং userId পাস করে দিন
}

    const avatar = chatData.senderInfo?.senderAvatar || 'assets/tech.png';
    const name = chatData.senderInfo?.senderName || 'User';

    // ১. ইনকামিং মেসেজের জন্য currentJob.logo এবং আউটগোয়িং বা ফলব্যাকের জন্য ডিফল্ট ছবি সেট করা
const incomingAvatar = (typeof currentJob !== 'undefined' && currentJob.logo) ? currentJob.logo : 'assets/tech.png';

let lastOutgoingIndex = -1;
chatData.messages.forEach((m, idx) => {
    if (m.sender === 'outgoing' && !m.isDeleted) {
        lastOutgoingIndex = idx;
    }
});

chatData.messages.forEach((msg, index) => {
    const messageDiv = document.createElement('div');
    
    // সঠিক সেন্ডার ক্লাস নির্ধারণ
    const senderClass = (msg.sender === 'incoming') ? 'incoming' : 'outgoing';
    messageDiv.classList.add('message', senderClass);

    // ইনকামিং হলে currentJob.logo, অন্যথায় সাধারণ avatar ব্যবহার করা
    const currentAvatar = (msg.sender === 'incoming') ? incomingAvatar : (chatData.senderInfo?.senderAvatar || 'assets/client.png');
    const currentName = chatData.senderInfo?.senderName || 'User';

    // মেসেজ টেক্সট এবং স্টাইল নির্ধারণ করার লজিক
let displayText = msg.text;
let messageStyle = '';
let editTagHtml = '';

if (msg.isDeleted) {
    displayText = `🚫 এই মেসেজটি ডিলিট করা হয়েছে`;
    // এখানে ব্যাকগ্রাউন্ড হালকা ছাই রঙের এবং টেক্সট কালার ও ইটালিক একসাথে সেট করা হলো
    messageStyle = 'background-color: #e4e6eb !important; color: #555 !important; font-style: italic; border: 1px dashed #ccd0d5;';
}

if (msg.isEdited && !msg.isDeleted) {
    // ডিফল্ট আউটগোয়িং এর জন্য right: 0px রেখে দিচ্ছি
    editTagHtml = `<div style="position: absolute; bottom: -14px; right: 0px; font-size: 9px; color: #FFB300; font-style: italic; white-space: nowrap;">Edited</div>`;
}

if (msg.sender === 'incoming') {
    // ইনকামিংয়ের জন্য right: 0px কে left: 0px করে দেওয়া হলো
    const incomingEditTag = editTagHtml.replace('right: 0px;', 'left: 0px;');

    messageDiv.innerHTML = `
        <img src="${escapeHtml(currentAvatar)}" alt="${escapeHtml(currentName)}" class="msg-avatar" onerror="this.onerror=null;this.src='assets/tech.png';">
        <div style="display: flex; flex-direction: column; align-items: flex-start;">
            <div class="msg-text" style="${messageStyle}; position: relative; margin-bottom: 4px;">
                ${escapeHtml(displayText)}
                ${incomingEditTag}
            </div>
        </div>
    `;
} else {

    // চেক করা এটি শেষ আউটগোয়িং মেসেজ কিনা
 let seenStatusHtml = "";
if (index === lastOutgoingIndex) {
    // মেসেজটি এডিটেড হলে bottom আরও নিচে (-26px) নামিয়ে দেওয়া, নতুবা -14px রাখা
    let bottomPos = (msg.isEdited) ? "-26px" : "-14px"; 
    let colorCode = (msg.isSeen === true) ? "#4CAF50" : "#F44336";
    let statusText = (msg.isSeen === true) ? "Seen" : "Unseen";

    seenStatusHtml = `<div style="position: absolute; bottom: ${bottomPos}; right: 0px; font-size: 9px; color: ${colorCode}; white-space: nowrap;">${statusText}</div>`;
}

    messageDiv.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
            <div class="msg-text" style="${messageStyle}" position: relative; margin-bottom: 4px;">
                ${escapeHtml(displayText)}
                ${editTagHtml}
                ${seenStatusHtml}
            </div>
        </div>
        <img src="${escapeHtml(currentAvatar)}" alt="${escapeHtml(currentName)}" class="msg-avatar" onerror="this.onerror=null;this.src='assets/client.png';">
    `;
}
    chatContainer.appendChild(messageDiv);
    attachLongPressEvent(messageDiv, msg.id, msg.sender, msg.isDeleted);
    
});

    const messages = chatData.messages;
    
    // যদি নতুন কোনো মেসেজ না থাকে অথবা মেসেজ সংখ্যা আগের সমান থাকে
    const hasNewMessages = messages.length !== previousMessageCount;
    previousMessageCount = messages.length;

    // মেসেজগুলো রেন্ডার করার কোড...
    
    // শুধু তখনই স্ক্রোল নিচে নামবে যখন নতুন মেসেজ আসবে অথবা একদম প্রথমে মোডাল ওপেন হবে
    if (forceScroll || hasNewMessages) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

let chatPollingInterval = null;

// চ্যাট মোডাল ওপেন হওয়ার সময় বা মেসেজ লোড শুরু করার সময় এটি কল করুন
function startChatPolling(jobId, userId) {
    // যদি আগে থেকেই কোনো ইন্টারভাল চালু থাকে তা পরিষ্কার করে নেওয়া
    if (chatPollingInterval) {
        clearInterval(chatPollingInterval);
    }

    // প্রতি ২.৫ সেকেন্ডে (২৫০০ মিলিসেকেন্ড) একবার মেসেজ ফাংশন কল হবে
    chatPollingInterval = setInterval(() => {
        // আপনার বিদ্যমান মেসেজ লোড বা রেন্ডার করার ফাংশন এখানে কল করুন
        loadExistingMessages(jobId, userId, false); 
    }, 2500);
}

// চ্যাট মোডাল বন্ধ (Close) করার বা হাইড করার ফাংশনে এটি যুক্ত করবেন
function stopChatPolling() {
    if (chatPollingInterval) {
        clearInterval(chatPollingInterval);
        chatPollingInterval = null;
    }
}

const sendBtn = document.getElementById('send-chat-btn');
const chatInput = document.getElementById('chat-input-message');
const chatContainer = document.getElementById('chat-messages-container');

// শুরুতে বাটন ডিজেবল থাকবে কারণ ইনপুট খালি
sendBtn.disabled = true;

// ইনপুটে লেখার সময় চেক করা
chatInput.addEventListener('input', function() {
    const text = this.value.trim();
    
    if (text === "") {
        sendBtn.disabled = true; // খালি থাকলে ডিজেবল থাকবে
    } else {
        sendBtn.disabled = false; // কিছু লিখলে এনেবল (চালু) হয়ে যাবে
    }
});

sendBtn.addEventListener('click', function() {
    const messageText = chatInput.value.trim();
    if (messageText === "") return;

    // সেন্ডার ইনফো অবজেক্ট
    const senderInfo = {
        senderUid: currentUserId || sessionStorage.getItem('liveUserid') || 'unknown_id',
        senderName: typeof userName !== 'undefined' ? userName : 'Technician',
        senderAvatar: typeof loggedInUserAvatar !== 'undefined' ? loggedInUserAvatar : 'assets/tech.png'
    };

    if (editingMessageId !== null) {
        // --- এডিট মোড: ইউনিক আইডি দিয়ে আপডেট করা ---
        const senderUid = senderInfo.senderUid;
        MessagesAPI.updateMessage(currentJobId, senderUid, editingMessageId, messageText);
        
        // এডিট শেষ, আইডি রিসেট করা
        editingMessageId = null;
        
        // চ্যাট লিস্ট রি-রেন্ডার করা
        loadExistingMessages(currentJobId, senderUid, true);
        
        // ইনপুট বক্স ও অন্যান্য রিসেট
        chatInput.value = "";
        chatInput.style.height = 'auto';
        chatInput.style.overflow = 'hidden';
        sendBtn.disabled = true;

    } else {
        // --- নতুন মেসেজ মোড: নরমাল সেভ করা ---
        MessagesAPI.saveMessage(currentJobId, senderInfo, messageText);
        
        // নতুন মেসেজ ভিডিতে রেন্ডার করে নিচে যুক্ত কর (আপনার কোডের মতো)
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'outgoing');
        messageDiv.innerHTML = `
            <div class="msg-text">${escapeHtml(messageText)}</div>
            <img src="${escapeHtml(loggedInUserAvatar)}" alt="Tech" class="msg-avatar">
        `;
        chatContainer.appendChild(messageDiv);

        // চ্যাট লিস্ট রি-রেন্ডার করা (এটি সবচেয়ে নিরাপদ ও নিখুঁত উপায়, এতে নতুন মেসেজ ও তার সঠিক আইডি অটোমেটিক লোড হয়ে যাবে)
        const senderUid = senderInfo.senderUid;
        loadExistingMessages(currentJobId, senderUid, true);
        
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // ইনপুট বক্স ও অন্যান্য রিসেট
        chatInput.value = "";
        chatInput.style.height = 'auto';
        chatInput.style.overflow = 'hidden';
        sendBtn.disabled = true;
    }
});

// এন্টার প্রেস করলে সেন্ড হওয়ার লজিক (বাটন ডিজেবল না থাকলে কাজ করবে)
chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) {
            sendBtn.click();
        }
    }
});

// সিকিউরিটির জন্য এস্কেপ ফাংশন
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

let pressTimer;

// মেসেজ এলিমেন্ট তৈরি করার সময় বা লুপ চালানোর সময় এটি যুক্ত করবেন
function attachLongPressEvent(messageElement, messageId, senderType, isDeleted) {

    // যদি মেসেজটি ইনকামিং (incoming) হয়, তবে এডিট/ডিলিট মেনু দেখানোর দরকার নেই
    if (senderType === 'incoming') {
        return; 
    }
    // যদি মেসেজটি ইতিমধ্যে ডিলিট করা হয়ে থাকে, তবে লং প্রেস ইভেন্ট কাজ করবে না (মেনু আসবে না)
    if (isDeleted) {
        return; 
    }
    // মাউসের ক্ষেত্রে (কম্পিউটার) - সরাসরি রাইট ক্লিক (contextmenu) ইভেন্ট ব্যবহার করা হলো
messageElement.addEventListener('contextmenu', function(e) {
    e.preventDefault(); // ব্রাউজারের ডিফল্ট রাইট-ক্লিক মেনু বন্ধ করার জন্য
    showEditDeleteMenu(messageElement, messageId, e);
});

    // মোবাইল ডিভাইসের টাচ স্ক্রিনের ক্ষেত্রে
    messageElement.addEventListener('touchstart', function(e) {
        pressTimer = setTimeout(() => {
            showEditDeleteMenu(messageElement, messageId, e);
        }, 600);
    });

    messageElement.addEventListener('touchend', function() {
        clearTimeout(pressTimer);
    });
}

// এডিট ও ডিলিট মেনু তৈরির ফাংশন
function showEditDeleteMenu(messageElement, messageId, event) {
    // পুরনো কোনো মেনু খোলা থাকলে তা আগে রিমুভ করা
    const existingMenu = document.getElementById('chat-action-menu');
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement('div');
    menu.id = 'chat-action-menu';
    menu.className = 'chat-action-menu';
    
    // এখানে ${messageId}-কে সিঙ্গেল কোটেশনের ভেতরে রাখা বাধ্যতামূলক
    menu.innerHTML = `
        <div class="action-item" onclick="handleEditMessage('${messageId}')">✏️ Edit</div>
        <div class="action-item" onclick="handleDeleteMessage('${messageId}')">🗑️ Delete</div>
    `;

    // পজিশন সেট করার কোড...
    const clientX = event.clientX || (event.touches ? event.touches[0].clientX : 0);
    const clientY = event.clientY || (event.touches ? event.touches[0].clientY : 0);

    menu.style.position = 'fixed';
    menu.style.top = `${clientY}px`;
    menu.style.left = `${clientX}px`;
    menu.style.zIndex = '9999';

    document.body.appendChild(menu);

    // মেনুর বাইরে কোথাও ক্লিক করলে মেনু বন্ধ হয়ে যাবে
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        }, { once: true });
    }, 100);
}

function handleEditMessage(messageId) {
    console.log("Edit message ID:", messageId);

    if (!messageId || messageId === 'undefined') {
        console.error("Message ID is undefined!");
        return;
    }

    const senderUid = currentUserId || sessionStorage.getItem('Liveuserid') || sessionStorage.getItem('liveUserid');
    
    // সরাসরি লোকালস্টোরেজ না ডেকে MessagesAPI ব্যবহার করে মেসেজ খুঁজে বের করা
    const targetMessage = MessagesAPI.findMessageById(currentJobId, senderUid, messageId);

    if (targetMessage) {
        const chatInput = document.getElementById('chat-input-message');
        if (chatInput) {
            chatInput.value = targetMessage.text;
            chatInput.focus();
            
            // ইনপুট ইভেন্ট ট্রিগার করা যাতে সেন্ড বাটনটি এনেবল হয়ে যায়
            chatInput.dispatchEvent(new Event('input'));
        }

        // ইনডেক্সের পরিবর্তে ইউনিক আইডি সেট করা
        editingMessageId = messageId;
    } else {
        console.error("Target message not found for editing!");
    }

    // মেনু রিমুভ করা
    const menu = document.getElementById('chat-action-menu');
    if (menu) menu.remove();
}

function handleDeleteMessage(messageId) {
    console.log("Delete message ID:", messageId);

    const senderUid = currentUserId || sessionStorage.getItem('Liveuserid');

    // ১. সরাসরি এপিআই ফাইলের মাধ্যমে মেসেজ ডিলিট করা
    const success = MessagesAPI.deleteMessage(currentJobId, senderUid, messageId);

    if (success) {
        // ২. পপআপ মেনু বা মডালটি সাথে সাথে রিমুভ বা ক্লোজ করে দেওয়া
        const menu = document.getElementById('chat-action-menu');
        if (menu) {
            menu.remove();
        }

        // ৩. চ্যাট উইন্ডো রি-রেন্ডার করা যাতে আপডেট ভিউ দেখা যায়
        loadExistingMessages(currentJobId, senderUid, true);

        // ৪. টেক্সট এরিয়া ও ইনপুট লেআউট ঠিক রাখা
        const chatInput = document.getElementById('chat-input-message');
        if (chatInput) {
            chatInput.style.height = 'auto';
        }
    } else {
        console.error("Failed to delete message via API");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // আপনার আগের পেজ লোড হওয়ার ফাংশনগুলো এখানে থাকবে...

    const urlParams = new URLSearchParams(window.location.search);
    const chatKey = urlParams.get('chatKey');

    // যদি ইউআরএলে chatKey থাকে, তার মানে নোটিফিকেশন থেকে আসা হয়েছে
    if (chatKey) {
        // একটু সময় বিরতি দিয়ে (যাতে জবের সব ডেটা আগে থেকে ব্যাকগ্রাউন্ডে লোড হয়ে যায়) চ্যাট বাটনটি অটো-ক্লিক করে দেওয়া
        setTimeout(() => {
            const chatBtn = document.getElementById('chat-with-client-btn');
            if (chatBtn) {
                chatBtn.click(); // এটি আপনার চ্যাট মোডাল খোলার এবং মেসেজ লোড করার সব কোড একসাথে রান করে দেবে!
            }
        }, 100); // ৫০ মিলিহিসাব বা ০.৫ সেকেন্ডের ডিলে দেওয়া হলো, যা স্মুদলি কাজ করবে
    }
});

// job-details-technician.js এর ভেতরে
document.addEventListener('DOMContentLoaded', () => {
    const wishlistBtn = document.getElementById('wishlist-btn');

    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            if (typeof currentJob !== 'undefined' && currentJob) {
                // সরাসরি এপিআই ফাংশন কল করা হলো
                addToWishlist(currentJob);
            } else {
                alert("জবের ডেটা এখনো লোড হয়নি!");
            }
        });
    }
});

const applyBtn = document.getElementById('applyBtn');
const applyModal = document.getElementById('applyModal');
const closeApplyModal = document.getElementById('closeApplyModal');
const applyForm = document.getElementById('applyForm');

// এপ্লাই বাটন ক্লিক ইভেন্ট (মোডাল ওপেন করার আগে এপিআই চেক)
// এপ্লাই বাটনে ক্লিক ইভেন্ট (মোডাল ওপেন করার আগে এনআইডি ও ইমেজ চেক)
if (applyBtn) {
    applyBtn.addEventListener('click', async function() {
        try {
            // ১. এপিআই অবজেক্টের মাধ্যমে এনআইডি চেক করা
            const checkResult = window.TechnicianApplyAPI.checkTechnicianNid();
            if (!checkResult.isValid) {
                if (typeof showToast === 'function') {
                    showToast(checkResult.message);
                } else {
                    alert(checkResult.message);
                }
                return; // এনআইডি ভ্যালিড না হলে মোডাল ওপেন হবে না
            }

            // ২. এপিআই থেকে প্রোফাইল ইমেজ ফেচ করা (চ্যাট বাটনের লজিক অনুযায়ী)
            const profileData = typeof UserAPI !== 'undefined' ? await UserAPI.getProfileImage(currentUserId) : null;

            // ইমেজ স্ট্রিং বা ডাটা আছে কি না চেক করা
            const hasImage = profileData && (
                typeof profileData === 'string' ? profileData.trim() !== "" : 
                (profileData.imageString && profileData.imageString.trim() !== "")
            );

            if (!hasImage) {
                if (typeof showToast === 'function') {
                    showProfileIncompleteModal(currentUserId, 'apply');
                } 
                return; // ছবি না থাকলে মোডাল ওপেন হবে না
            }

            // ৩. সব ঠিক থাকলে মোডাল ওপেন হবে
            applyModal.style.display = 'flex';

        } catch (error) {
            console.error("Error checking profile image:", error);
        }
    });
}

// মোডাল ক্লোজ করার লজিক
if (closeApplyModal) {
    closeApplyModal.addEventListener('click', () => {
        applyModal.style.display = 'none';
    });
}

// মোডালের বাইরে ক্লিক করলে বন্ধ হওয়ার লজিক
window.addEventListener('click', (e) => {
    if (e.target === applyModal) {
        applyModal.style.display = 'none';
    }
});

if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // ফাইলের নিজস্ব ভেরিয়েবল থেকে সরাসরি currentJobId নেওয়া হচ্ছে
        const jobId = window.currentJobId || currentJobId;

        // ড্রপডাউনের সিলেক্ট করা অপশনের পুরো বাংলা টেক্সট বা লেখাটি পাওয়ার জন্য:
        const materialSelect = document.getElementById('materialResponsibility');
        const materialResponsibilityValue = materialSelect && materialSelect.selectedIndex > 0 
            ? materialSelect.options[materialSelect.selectedIndex].text 
            : "";

            

        const proposalData = {
                   laborCost: document.getElementById('laborCost').value,
            // মেটেরিয়াল রেসপনসিবিলিটি এর সঠিক ভ্যালু নিশ্চিত করার জন্য:            
            materialResponsibility: materialResponsibilityValue,
            cancellationFee: document.getElementById('cancellationFee').value,
            estimatedTime: document.getElementById('estimatedTime').value,
            coverLetter: document.getElementById('coverLetter').value,
            appliedAt: new Date().toISOString(),
    

};
        

        // সঠিক jobId সহ এপিআই ফাংশন কল করা
        const isSuccess = window.TechnicianApplyAPI.submitProposal(proposalData, jobId);

        if (isSuccess) {
            applyModal.style.display = 'none';
            applyForm.reset();
        }
    });
}



// কাস্টম মোডাল তৈরি ও দেখানোর ফাংশন (প্রোফাইল অসম্পূর্ণ থাকলে এটি কল হবে)
function showProfileIncompleteModal(currentUserId, type = 'apply') {
    // যদি আগে থেকেই কোনো মোডাল থাকে তা রিমूव করে দেওয়া
    let existingModal = document.getElementById('custom-profile-modal');
    if (existingModal) existingModal.remove();

    // জায়গাভেদে আলাদা স্লোগান নির্ধারণ করা
    let descriptionText = "জবে এপ্লাই করার পূর্বে এনআইডি ও প্রোফাইল ছবি দিয়ে আপনার প্রোফাইল আপডেট করুন।";
    
    if (type === 'chat' || type === 'message') {
        descriptionText = "ক্লাইন্টের সাথে চ্যাট বা মেসেজ করার পূর্বে প্রোফাইল ছবি দিয়ে আপনার প্রোফাইল আপডেট করুন।";
    }

    // মোডালের মূল কন্টেইনার
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'custom-profile-modal';
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.zIndex = '999999';
    modalOverlay.style.backdropFilter = 'blur(4px)';

    // মোডাল বক্স
    const modalBox = document.createElement('div');
    modalBox.style.background = '#ffffff';
    modalBox.style.padding = '30px';
    modalBox.style.borderRadius = '16px';
    modalBox.style.maxWidth = '400px';
    modalBox.style.width = '90%';
    modalBox.style.textAlign = 'center';
    modalBox.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    modalBox.style.animation = 'modalScaleIn 0.3s ease-out';

    // আইকন বা সতর্কতা হেডিং
    modalBox.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
        <h3 style="margin-bottom: 12px; color: #1F2937; font-size: 20px; font-weight: 600;">প্রোফাইল অসম্পূর্ণ!</h3>
        <p style="color: #4B5563; font-size: 14px; line-height: 1.5; margin-bottom: 25px;">
           ${descriptionText}
        </p>
    `;

    // বাটনগুলোর কন্টেইনার
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '12px';
    btnContainer.style.justifyContent = 'center';

    // ১. "এখনই করব" বাটন
    const btnNow = document.createElement('button');
    btnNow.innerText = "এখনই করব";
    btnNow.style.flex = '1';
    btnNow.style.padding = '12px 16px';
    btnNow.style.backgroundColor = '#2563EB'; // আকর্ষণীয় ব্লু কালার
    btnNow.style.color = '#ffffff';
    btnNow.style.border = 'none';
    btnNow.style.borderRadius = '8px';
    btnNow.style.fontSize = '14px';
    btnNow.style.fontWeight = '500';
    btnNow.style.cursor = 'pointer';
    btnNow.style.transition = 'background 0.2s';

    btnNow.onmouseover = () => btnNow.style.backgroundColor = '#1D4ED8';
    btnNow.onmouseout = () => btnNow.style.backgroundColor = '#2563EB';

    btnNow.onclick = function() {
        // প্রোফাইল এডিট পেজে রিডাইরেক্ট করা (আইডি সহ)
        window.location.href = `profile-edit.html?id=${currentUserId}`; // আপনার প্রোফাইল পেজের সঠিক নাম এখানে বসিয়ে দেবেন
    };

    // ২. "পরে করব" বাটন
    const btnLater = document.createElement('button');
    btnLater.innerText = "পরে করব";
    btnLater.style.flex = '1';
    btnLater.style.padding = '12px 16px';
    btnLater.style.backgroundColor = '#E5E7EB'; // সফট গ্রে কালার
    btnLater.style.color = '#374151';
    btnLater.style.border = 'none';
    btnLater.style.borderRadius = '8px';
    btnLater.style.fontSize = '14px';
    btnLater.style.fontWeight = '500';
    btnLater.style.cursor = 'pointer';
    btnLater.style.transition = 'background 0.2s';

    btnLater.onmouseover = () => btnLater.style.backgroundColor = '#D1D5DB';
    btnLater.onmouseout = () => btnLater.style.backgroundColor = '#E5E7EB';

    btnLater.onclick = function() {
        // মোডালটি সরিয়ে দেওয়া এবং পেজ আগের মতো রাখা
        modalOverlay.remove();
    };

    // বাটনগুলো মোজালে যুক্ত করা
    btnContainer.appendChild(btnLater);
    btnContainer.appendChild(btnNow);
    modalBox.appendChild(btnContainer);
    modalOverlay.appendChild(modalBox);
    document.body.appendChild(modalOverlay);
}

