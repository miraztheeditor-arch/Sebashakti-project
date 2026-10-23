let savedImageString = "assets/client.png"; // ডিফল্ট ছবি
let userName = "";

document.addEventListener('DOMContentLoaded', async () => {
    // ১. ইউআরএল বা সেশন থেকে বর্তমান ইউজারের আইডি বের করুন
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get('id') || sessionStorage.getItem('liveUserId');

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

let failedAttempts = 0;
let lockoutTimer = null;
let isLocked = false;

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
             savedImageString = await UserAPI.getProfileImage(currentUserId);

            if (savedImageString) {
                // ১. ড্যাশবোর্ড পেজের ওই দুটি 'profile-avatar' এলিমেন্ট একসাথে সিলেক্ট করা
                const avatarElements = document.querySelectorAll('#profile-avatar');

                avatarElements.forEach(avatarContainer => {
                    if (avatarContainer) {
                        avatarContainer.style.backgroundImage = `url(${savedImageString})`;
                        avatarContainer.style.backgroundSize = 'cover';
                        avatarContainer.style.backgroundPosition = 'center';
                        
                        // ২. ভেতরের ডিফল্ট লেটারটি ('U') রিমুভ করে দেওয়া
                        const innerSpan = avatarContainer.querySelector('span');
                        if (innerSpan) {
                            innerSpan.remove();
                        }
                    }
                });
            }
        } catch (error) {
            console.error("প্রোফাইল ছবি লোড করতে সমস্যা হয়েছে:", error);
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // ১. URL থেকে id এবং jobId বের করা
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('id');
    const targetJobId = urlParams.get('jobId');

    if (!targetUserId || !targetJobId) {
        console.error("URL-এ সঠিক id বা jobId পাওয়া যায়নি!");
        return;
    }

    // ২. API ফাইল থেকে তৈরি করা নতুন ফাংশনটি কল করা
    const result = getJobDetailsById(targetUserId, targetJobId);

    if (result && result.success) {
        const matchedJob = result.job;
        const userData = result.user;

        // ৩. সফলভাবে পেজের ফিল্ডগুলোতে ডেটা বসিয়ে দেওয়া
        document.getElementById('lbl-username').textContent = matchedJob.username || userData.name || '-';
        document.getElementById('lbl-category').textContent = matchedJob.workCategory || '-';
        document.getElementById('lbl-current-location').textContent = matchedJob.currentLocation || '-';
        document.getElementById('lbl-fixed-location').textContent = matchedJob.fixedLocation || '-';
        document.getElementById('lbl-units').textContent = matchedJob.unitCount || '-';
        document.getElementById('lbl-date').textContent = formatDateTime(matchedJob.createdAt);
        document.getElementById('lbl-jobid').textContent = matchedJob.jobId || '-';
        document.getElementById('lbl-details').textContent = matchedJob.problemDetails || matchedJob.details || '-';

        console.log("সফলভাবে নির্দিষ্ট জবের ডাটা লোড হয়েছে:", matchedJob);
        renderDynamicInquiryCard(matchedJob.jobId);
    } else {
        console.warn(result.message || "জব লোড করতে সমস্যা হয়েছে।");
    }
});

function renderDynamicInquiryCard(jobId) {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;
    
    // কন্টেইনার খালি করে নেওয়া
    messagesContainer.innerHTML = '';

    // সরাসরি এপিআই ফাইল (MessagesAPI) থেকে বর্তমান জব আইডির সব চ্যাট ডাটা নিয়ে আসা
    const jobChats = MessagesAPI.getJobAllChats(jobId);
    
    const chatKeys = Object.keys(jobChats);
    if (chatKeys.length === 0) {
        messagesContainer.innerHTML = `<p class="no-msg" style="padding: 15px; color: #888;">কোনো চ্যাট হিস্ট্রি নেই</p>`;
        return;
    }
// প্রতিটি অবজেক্ট বা ইউজারের জন্য লুপ চালিয়ে আলাদা কার্ড তৈরি করা
// প্রথমে সমস্ত চ্যাট ডাটাগুলোকে একটি অ্যারেতে রূপান্তর করে লেটেস্ট সময় অনুযায়ী সর্ট করে নেওয়া
// প্রতিটি অবজেক্ট বা ইউজারের জন্য লুপ চালিয়ে আলাদা কার্ড তৈরি করা
const chatItems = chatKeys.map(key => {
    const chatData = jobChats[key];
    
    // যদি isDisabled ট্রু হয়, তবে স্কিপ করা
    if (chatData.isDisabled) {
        return null;
    }

    const messagesObj = chatData.messages || {};
    const messages = Array.isArray(messagesObj) ? messagesObj : Object.values(messagesObj);
    
    // এমন শেষ মেসেজ খুঁজে বের করা যা ডিলিট করা হয়নি (!msg.isDeleted)
    let lastMessage = { text: "", sender: "", timestamp: 0 };
    
    if (messages.length > 0) {
        let sortedMessages = messages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        
        for (let i = sortedMessages.length - 1; i >= 0; i--) {
            let msg = sortedMessages[i];
            // শর্ত: মেসেজটি বৈধ হতে হবে এবং কোনোভাবেই ডিলিট করা হওয়া চলবে না (!msg.isDeleted)
            if (msg && (msg.sender === 'outgoing') && !msg.isDeleted) {
                lastMessage = msg;
                break;
            }
        }
    }

    return { key, chatData, lastMessage };
}).filter(item => item !== null);
// নতুন থেকে পুরোনো (Descending order) ক্রমানুসারে সর্ট করা
chatItems.sort((a, b) => new Date(b.lastMessage.timestamp || 0) - new Date(a.lastMessage.timestamp || 0));

// সর্ট করা অ্যারের ওপর লুপ চালিয়ে কার্ড রেন্ডার করা
chatItems.forEach(item => {
    const { key, chatData, lastMessage } = item;
    const messages = chatData.messages || [];
    if (messages.length === 0) return;

    let lastText = (messages.length > 0 && lastMessage.text) ? lastMessage.text : "";
    if (lastText.length > 20) {
        lastText = lastText.substring(0, 30) + '...';
    }

    const timeAgo = formatTimeAgo(lastMessage.timestamp);
    const senderInfo = chatData.senderInfo || {};
    const senderName = senderInfo.senderName || 'Technician';
    const senderAvatar = senderInfo.senderAvatar || 'assets/tech.png';
    const techUid = senderInfo.senderUid || key.split('_').pop();

    const cardDiv = document.createElement('div');
    cardDiv.className = 'sample-item-card';
    cardDiv.dataset.jobId = jobId;
    cardDiv.dataset.techUid = techUid;

    cardDiv.innerHTML = `
        <div class="card-left">
            <img src="${escapeHtml(senderAvatar)}" alt="${escapeHtml(senderName)}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
            <div>
                <h4 class="card-title">${escapeHtml(senderName)}</h4>
                <p class="card-subtitle">${escapeHtml(lastText)}</p>
            </div>
        </div>
        <span class="card-time">${timeAgo}</span>
    `;

    // যেহেতু অ্যারে আগেই সর্ট করা আছে, তাই এখানে সাধারণ appendChild ব্যবহার করলেই সঠিক ক্রমানুসারে দেখাবে
    messagesContainer.appendChild(cardDiv);
});

// ==========================================
// ৩টির বেশি কার্ড থাকলে "See More" বাটন লজিক
// ==========================================
const allCards = messagesContainer.querySelectorAll('.sample-item-card');

// পুরোনো বাটন থাকলে তা আগে রিমুভ করে দেওয়া যাতে ডুপ্লিকেট না হয়
const existingBtn = document.getElementById('see-more-btn');
if (existingBtn) {
    existingBtn.remove();
}

// যদি কার্ডের সংখ্যা ৩টির বেশি হয়
if (allCards.length > 3) {
    const seeMoreBtn = document.createElement('button');
    seeMoreBtn.id = 'see-more-btn';
    seeMoreBtn.className = 'see-more-btn';
    seeMoreBtn.innerText = 'আরও দেখুন (See More)...';
    
    seeMoreBtn.addEventListener('click', function() {
    sectionBox.classList.toggle('expanded');
        if (sectionBox.classList.contains('expanded')) {
            seeMoreBtn.innerText = 'সংক্ষিপ্ত করুন (See Less)';
        } else {
            seeMoreBtn.innerText = 'আরও দেখুন (See More)...';
            // যখন সংক্ষিপ্ত করা হবে, তখন স্ক্রল পজিশন একদম উপরে রিসেট করে ডিফল্ট অবস্থায় ফিরিয়ে আনা
        sectionBox.scrollTop = 0;
        }
    });

    // সীমাবদ্ধ বক্সের (.section-box) বাইরে বা নিচে বাটনটি বসানো যাতে ঢাকা না পড়ে
    const sectionBox = messagesContainer.closest('.section-box');
    if (sectionBox) {
        sectionBox.insertAdjacentElement('afterend', seeMoreBtn);
    } else {
        messagesContainer.parentNode.appendChild(seeMoreBtn);
    }
}

}


const chatModal = document.getElementById('chat-modal');
const closeChatModal = document.getElementById('close-chat-modal');

// বন্ধ করা
closeChatModal.addEventListener('click', function() {
    chatModal.style.display = 'none';
    // **এখানে ব্যাকগ্রাউন্ড স্ক্রল আবার চালু করে দেওয়া হলো**
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto'; // স্বাভাবিক অবস্থা ফিরিয়ে দেওয়া হলো
    stopChatPolling();
});

// মোডালের বাইরে কোথাও ক্লিক করলেও যেন বন্ধ হয়ে যায় (অপশনাল)
window.addEventListener('click', function(event) {
    if (event.target === chatModal) {
        chatModal.style.display = 'none';
        // **এখানে ব্যাকগ্রাউন্ড স্ক্রল আবার চালু করে দেওয়া হলো**
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto'; // স্বাভাবিক অবস্থা ফিরিয়ে দেওয়া হলো
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

const messagesContainer = document.getElementById('messages-container');

if (messagesContainer) {
    // আগের পুরোনো ইভেন্ট মুছে ফেলতে নতুন করে সেফ লিসেনার
    messagesContainer.replaceWith(messagesContainer.cloneNode(true));
    const newContainer = document.getElementById('messages-container');

    newContainer.addEventListener('click', function(e) {
        // যদি ক্লিকটি সরাসরি ডিলিট বাটন বা তার আশপাশে হয়, তবে চ্যাট কোড যেন ভুলেও রান না করে
        if (e.target.closest('#delete-job-btn') || e.target.closest('.btn-delete-confirm') || e.target.closest('#delete-modal')) {
            return;
        }

        const card = e.target.closest('.sample-item-card');
        if (!card) return;

 currentJobId = card.dataset.jobId;
currentTechUid = card.dataset.techUid;

// ১. কার্ড থেকে টেকনিশিয়ানের নাম ও ছবি তুলে নেওয়া
const techName = card.querySelector('.card-title') ? card.querySelector('.card-title').innerText : '';
const techAvatar = card.querySelector('img') ? card.querySelector('img').src : '';

// ২. মডালের হেডারে নাম ও ছবি বসিয়ে দেওয়া
const modalNameEl = document.getElementById('modal-client-name');
const modalImgEl = document.getElementById('modal-client-img');

if (modalNameEl) {
    modalNameEl.innerText = techName;
}
if (modalImgEl && techAvatar) {
    modalImgEl.src = techAvatar;
}

// ৩. চ্যাট মোডাল খুঁজে বের করে সরাসরি সবার উপরে ফিক্স করা
const chatModal = document.getElementById('chat-modal');
if (chatModal) {
    document.body.appendChild(chatModal); 
    chatModal.style.setProperty('display', 'flex', 'important');
    // **এখানে ব্যাকগ্রাউন্ড স্ক্রল বন্ধ করা হলো**
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden'; // HTML রুট এলিমেন্টেও লক করা হলো
    chatModal.style.setProperty('position', 'fixed', 'important');
    chatModal.style.setProperty('top', '0', 'important');
    chatModal.style.setProperty('left', '0', 'important');
    chatModal.style.setProperty('width', '100%', 'important');
    chatModal.style.setProperty('height', '100%', 'important');
    chatModal.style.setProperty('z-index', '1001', 'important');
} else {
    console.error("Error: #chat-modal ID not found in HTML!");
}

if (typeof startChatPolling === 'function') {
    startChatPolling();
    
}
loadExistingMessages(true);
    });
}
// সময় ফরম্যাট করার ফাংশন (প্রয়োজন হলে রাখতে পারেন)
function formatTimeAgo(timestamp) {
    if (!timestamp) return '';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'মাত্রই';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} মিনিট আগে`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ঘণ্টা আগে`;
    return `${Math.floor(hours / 24)} দিন আগে`;
}

// সেফটির জন্য এইচটিএমএল এস্কেপ ফাংশন
function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// ডেট স্ট্রিং সুন্দর ফরম্যাটে রূপান্তর করার ছোট্ট ফাংশন
function formatDateTime(isoString) {
    if (!isoString) return '-';
    try {
        const date = new Date(isoString);
        // লোকাল ফরম্যাট অনুযায়ী তারিখ ও সময় সুন্দর করে সাজানো (যেমন: 06 Sep 2026, 12:56 PM)
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (e) {
        return isoString;
    }
}

let chatPollingInterval = null;

// চ্যাট মোডাল ওপেন হলে পোলিং শুরু করার ফাংশন
function startChatPolling() {
    if (chatPollingInterval) {
        clearInterval(chatPollingInterval);
    }

    // প্রতি ২.৫ সেকেন্ডে কোনো প্যারামিটার ছাড়াই সরাসরি কল হবে
    chatPollingInterval = setInterval(() => {
        if (typeof loadExistingMessages === 'function') {
            loadExistingMessages(false);
        }
    }, 2500);
}

// মোডাল বন্ধ হলে পোলিং বন্ধ করার ফাংশন
function stopChatPolling() {
    if (chatPollingInterval) {
        clearInterval(chatPollingInterval);
        chatPollingInterval = null;
    }
}


// ডাটাবেজ থেকে নির্দিষ্ট জবের সমস্ত চ্যাট হিস্ট্রি এনে ডাইনামিক্যালি রেন্ডার করার সম্পূর্ণ ফাংশন
// আগের মোট মেসেজ সংখ্যা ট্র্যাক করার জন্য একটি ভেরিয়েবল রাখতে পারেন (অথবা লেংথ চেক)
let previousMessageCount = 0;

function loadExistingMessages(forceScroll = false) {
    const messagesContainer = document.getElementById('chat-messages-container');
    if (!messagesContainer) return;

    messagesContainer.innerHTML = '';

    try {
        const jobChats = (typeof MessagesAPI !== 'undefined' && typeof MessagesAPI.getJobAllChats === 'function') 
            ? MessagesAPI.getJobAllChats(currentJobId) 
            : {};

        const chatKey = `${currentJobId}_${currentTechUid}`;
        const chatData = jobChats ? jobChats[chatKey] : null;

        // যদি চ্যাট ডাটা বা মেসেজ না থাকে
        if (!chatData || !Array.isArray(chatData.messages) || chatData.messages.length === 0) {
            messagesContainer.innerHTML = `<p style="text-align: center; color: #888; margin-top: 20px;">কোনো মেসেজ নেই</p>`;
            return;
        }

        let lastOutgoingIndex = -1;
chatData.messages.forEach((m, idx) => {
    if (m.sender === 'outgoing' && !m.isDeleted) {
        lastOutgoingIndex = idx;
    }
});

        const messages = chatData.messages;
        const techAvatar = chatData.senderInfo && chatData.senderInfo.senderAvatar 
            ? chatData.senderInfo.senderAvatar 
            : 'assets/tech.png';

        // মেসেজগুলো রেন্ডার করার লুপ
     messages.forEach((msg, idx) => {
     // loadExistingMessages ফাংশনের ভেতরে chatData পাওয়ার পর:
const chatKey = `${currentJobId}_${currentTechUid}`;
const chatData = jobChats ? jobChats[chatKey] : null;

if (!chatData || !Array.isArray(chatData.messages) || chatData.messages.length === 0) {
    messagesContainer.innerHTML = '<p style="text-align: center; color: #888; margin-top: 20px;">কোনো মেসেজ নেই</p>';
    return;
}

// --- এখানে ফাংশনটি কল করে দেবো, যাতে চ্যাট ওপেন হওয়ামাত্র লোকালস্টোরেজে isSeen true হয়ে যায় ---
if (typeof MessagesAPI !== 'undefined' && typeof MessagesAPI.markChatMessagesAsSeen === 'function') {
    MessagesAPI.markChatMessagesAsSeen(currentJobId, currentTechUid);
}
// ------------------------------------------------------------------------------------
let lastOutgoingIndex = -1;
if (chatData && chatData.messages) {
    chatData.messages.forEach((m, i) => {
        // ক্লায়েন্ট পেজের জন্য নিজস্ব মেসেজগুলো 'incoming' হিসেবে থাকায় এটি এখানে চেক করতে হবে
        if (m.sender === 'incoming' && !m.isDeleted) {
            lastOutgoingIndex = i;
        }
    });
}

const messages = chatData.messages;
// এরপর আপনার আগের মতো মেসেজ রেন্ডারিং লুপ চলবে...

    let messageDiv = document.createElement('div');
    
    // ডিলিট এবং এডিট হ্যান্ডেল করার জন্য লোকাল ভেরিয়েবল
    let displayText = msg.text;
    let messageStyle = '';
    let editTagHtml = '';

    if (msg.isDeleted) {
        displayText = `🚫 এই মেসেজটি ডিলিট করা হয়েছে`;
        messageStyle = 'background-color: #e4e6eb !important; color: #555 !important; font-style: italic; border: 1px dashed #ccd0d5;';
    }

 if (msg.isEdited && !msg.isDeleted) {
    editTagHtml = `<div style="position: absolute; bottom: -14px; right: 0px; font-size: 9px; color:  #FFB300; font-style: italic; white-space: nowrap;">Edited</div>`;
}
   if (msg.sender === 'incoming') {

    let seenStatusHtml = '';
// এখানেও msg.sender === 'incoming' দিতে হবে
if (idx === lastOutgoingIndex && msg.sender === 'incoming') {
    let bottomPos = (msg.isEdited) ? "-26px" : "-14px"; 
    let colorCode = (msg.isSeen === true) ? "#4CAF50" : "#F44336"; // Seen হলে সবুজ, Unseen হলে লাল
    let statusText = (msg.isSeen === true) ? "Seen" : "Unseen";

    seenStatusHtml = `<div style="position: absolute; bottom: ${bottomPos}; right: 0px; font-size: 9px; color: ${colorCode}; white-space: nowrap;">${statusText}</div>`;
}
    // ডাটাবেজে incoming থাকলে ক্লায়েন্টের স্ক্রিনে outgoing (ডান দিক) দেখাবে
    messageDiv.className = 'message outgoing';
    messageDiv.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
            <div class="msg-text" style="${messageStyle}; position: relative; margin-bottom: 4px;">
                ${escapeHtml(displayText)}
                ${editTagHtml}
                ${seenStatusHtml}
            </div>
        </div>
        <img src="${escapeHtml(savedImageString)}" alt="Avatar" class="msg-avatar">
    `;
    
    messageDiv.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showActionPopup(e.clientX, e.clientY, msg.id);
    });
    
    messagesContainer.appendChild(messageDiv);
} else {
    // অন্যথায় incoming (বাম দিক) দেখাবে, তাই এখানে এডিট ট্যাগটি বাম দিকে থাকবে
    const incomingEditTag = editTagHtml.replace('right: 0px;', 'left: 0px;');
    
    messageDiv.className = 'message incoming';
    messageDiv.innerHTML = `
        <img src="${escapeHtml(techAvatar)}" alt="Tech" class="msg-avatar">
        <div style="display: flex; flex-direction: column; align-items: flex-start;">
            <div class="msg-text" style="${messageStyle}; position: relative; margin-bottom: 4px;">
                ${escapeHtml(displayText)}
                ${incomingEditTag}
            </div>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
}
 
    
});
        
    
    // যদি নতুন কোনো মেসেজ না থাকে অথবা মেসেজ সংখ্যা আগের সমান থাকে
    const hasNewMessages = messages.length !== previousMessageCount;
    previousMessageCount = messages.length;

    // মেসেজগুলো রেন্ডার করার কোড...
    
    // শুধু তখনই স্ক্রোল নিচে নামবে যখন নতুন মেসেজ আসবে অথবা একদম প্রথমে মোডাল ওপেন হবে
    if (forceScroll || hasNewMessages) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    } catch (error) {
        console.error("Error loading messages:", error);
    }
}


function showActionPopup(x, y, msgId) {
    console.log("ইভেন্ট কাজ করছে! Message ID: " + msgId);

    // পুরনো কোনো পপআপ থাকলে তা সরিয়ে ফেলুন
    const existingPopup = document.getElementById('chat-action-popup');
    if (existingPopup) existingPopup.remove();

    // ১. প্রথমে চেক করা মেসেজটি ডিলিট করা কি না
    const jobId = currentJobId;   // আপনার প্রজেক্টের ভেরিয়েবল অনুযায়ী
    const techUid = currentTechUid; // আপনার প্রজেক্টের ভেরিয়েবল অনুযায়ী
    
    const targetMsg = MessagesAPI.findMessageById(jobId, techUid, msgId);
    
    // যদি মেসেজটি ডিলিট করা থাকে (isDeleted === true), তবে পপআপ দেখাবে না
    if (targetMsg && targetMsg.isDeleted) {
        console.log("এই মেসেজটি ডিলিট করা হয়েছে, তাই পপআপ দেখাবে না।");
        return; 
    }
    
    const popup = document.createElement('div');
    popup.id = 'chat-action-popup';
    popup.style.position = 'fixed';
    popup.style.top = y + 'px';
    popup.style.left = x + 'px';
    popup.style.background = '#ffffff';
    popup.style.border = '1px solid #ccc';
    popup.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    popup.style.borderRadius = '6px';
    popup.style.zIndex = '999999'; // সবার উপরে রাখার জন্য অনেক বেশি z-index দেওয়া হলো
    popup.style.minWidth = '100px';
    
    popup.innerHTML = `
        <div style="padding: 10px 16px; cursor: pointer; border-bottom: 1px solid #eee; font-size: 14px; color: #333;" onclick="editMessage('${msgId}')">✏️ Edit</div>
        <div style="padding: 10px 16px; cursor: pointer; font-size: 14px; color: red;" onclick="deleteMessage('${msgId}')">🗑️ Delete</div>
    `;
    
    document.body.appendChild(popup);

    // বাইরে কোথাও ক্লিক করলে পপআপ বন্ধ হয়ে যাবে
    setTimeout(() => {
        document.addEventListener('click', function closePopup() {
            popup.remove();
            document.removeEventListener('click', closePopup);
        }, { once: true });
    }, 100);
}


// এক্সএসএস (XSS) সুরক্ষার জন্য হেল্পার ফাংশন
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
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

    // চেক করা হচ্ছে এডিট মোড কি না
    if (window.editingMessageId) {
        // ১. এডিট করা মেসেজ আপডেট করা
        MessagesAPI.updateClientMessage(currentJobId, currentTechUid, window.editingMessageId, messageText);
        
        // এডিট শেষে আইডি রিসেট করা
        window.editingMessageId = null;
    } else {
        // ২. নতুন মেসেজ সেভ করা
        MessagesAPI.saveClientMessage(currentJobId, currentTechUid, messageText, userName);
    }

    // চ্যাট লিস্ট রি-রেন্ডার করা
    loadExistingMessages(true);

    // ইনপুট বক্স ও অন্যান্য রিসেট
    chatInput.value = '';
    chatInput.style.height = 'auto';
    chatInput.style.overflow = 'hidden';
    sendBtn.disabled = true;
    chatContainer.scrollTop = chatContainer.scrollHeight;
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

document.addEventListener("DOMContentLoaded", () => {
    const deleteBtn = document.getElementById('delete-job-btn');
    const deleteModal = document.getElementById('delete-modal');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const confirmDeleteBtn = document.getElementById('modal-confirm-delete-btn');

    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('id');
    const targetJobId = urlParams.get('jobId');

    // ১. ডিলিট বাটনে ক্লিক করলে মোডাল ওপেন হবে
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            deleteModal.style.display = 'flex';
        });
    }

    // ২. 'বাতিল' এ ক্লিক করলে মোডাল বন্ধ হবে
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            deleteModal.style.display = 'none';
        });
    }

    // ৩. মোডালের 'ডিলিট' এ ক্লিক করলে API ফাংশন কল হবে
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            // API ফাইলের মাধ্যমে ডিলিট ফাংশন কল করা হলো
            const result = deleteJobById(targetUserId, targetJobId);

            if (result.success) {
                // মোডাল ক্লোজ ফাংশন কল করা
            closeDeleteModal();
                // সফলভাবে ডিলিট হওয়ার পর ড্যাশবোর্ডে রিডাইরেক্ট
             window.location.replace(`client-dashboard.html?id=${targetUserId}`);
            } else {
                alert(result.message);
            }
        });
    }
});

// ১. 'openDeleteModal' ফাংশনটি আগে গ্লোবালি ডিফাইন করে দেওয়া
window.openDeleteModal = function(e) {
    if (e) e.stopPropagation(); // ইভেন্ট ওপরের দিকে ছড়াতে বাধা দেওয়া
    
    const deleteModal = document.getElementById('delete-modal');
    if (deleteModal) {
        deleteModal.style.setProperty('display', 'flex', 'important');
        deleteModal.style.setProperty('z-index', '99999', 'important');
    }
};

// ২. ডিলিট বাটনে ইভেন্ট লিসেনার যুক্ত করা
const deleteJobBtn = document.getElementById('delete-job-btn');
if (deleteJobBtn) {
    deleteJobBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // এটি ইভেন্ট চ্যাট কন্টেইনারে যাওয়া ১০০% আটকে দেবে
        window.openDeleteModal(e);
    });
}

// ২. 'বাতিল' বা মোডাল বন্ধ করার গ্লোবাল ফাংশন
window.closeDeleteModal = function() {
    const deleteModal = document.getElementById('delete-modal');
    if (deleteModal) {
        deleteModal.style.display = 'none'; // এখানেও deleteModal নিশ্চিত করুন
    }
};

function editMessage(msgId) {
    const jobId = currentJobId; 
    const techUid = currentTechUid; 
    
    // এপিআই থেকে নির্দিষ্ট মেসেজটি খুঁজে বের করা
    const targetMsg = MessagesAPI.findMessageById(jobId, techUid, msgId);
    
    if (targetMsg) {
        const chatInput = document.getElementById('chat-input-message'); // আপনার ইনপুট ফিল্ডের সঠিক আইডি দিন
        if (chatInput) {
            chatInput.value = targetMsg.text; // মেসেজের টেক্সট ইনপুটে বসাচ্ছে
            chatInput.focus();

            // ইনপুট ইভেন্ট ট্রিগার করা যাতে সেন্ড বাটনটি এনেবল হয়ে যায়
            chatInput.dispatchEvent(new Event('input'));
            
            // কোন মেসেজটি এডিট হচ্ছে তা ট্র্যাক করার জন্য আইডি সেভ করে রাখা
            window.editingMessageId = msgId;
        }
    }
}

function deleteMessage(msgId) {
    console.log("Delete clicked for:", msgId);
    
    const jobId = currentJobId;   // আপনার প্রজেক্টের ভেরিয়েবল অনুযায়ী
    const techUid = currentTechUid; // আপনার প্রজেক্টের ভেরিয়েবল অনুযায়ী
    
    // MessagesAPI-এর ডিলিট ফাংশন কল করা
    const success = MessagesAPI.deleteMessage(jobId, techUid, msgId);
    
    if (success) {
        console.log("Message deleted successfully!");
        // চ্যাট লিস্ট বা UI রি-রেন্ডার করা যাতে ডিলিট হওয়া মেসেজটি সাথে সাথে আপডেট দেখায়
        loadExistingMessages(true);
    } else {
        console.error("Failed to delete message.");
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const openChat = urlParams.get('openChat');
    const jobId = urlParams.get('jobId');

    if (openChat === 'true' && jobId) {
        // আপনার প্রজেক্টে চ্যাট মোডাল ওপেন করার যে ফাংশন বা কোড আছে তা এখানে কল করুন
        // যেমন: openChatModal(jobId); অথবা চ্যাট বাটনে অটো ক্লিক করার কোড
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const openChat = urlParams.get('openChat');
    const targetJobId = urlParams.get('jobId');
    const targetChatKey = urlParams.get('chatKey');

    if (openChat === 'true' && targetJobId) {
        setTimeout(() => {
            const allCards = document.querySelectorAll('.sample-item-card');
            let targetCard = null;

            // ১. প্রথমে চেষ্টা করব chatKey এর ভেতরে থাকা টেকনিশিয়ান আইডি বা নাম দিয়ে সঠিক কার্ডটি খুঁজে বের করতে
            allCards.forEach(card => {
                if (card.dataset.jobId === targetJobId) {
                    // যদি chatKey-র মধ্যে কার্ডের techUid বা নির্দিষ্ট কোনো অংশ মিলে যায়
                    if (targetChatKey && card.dataset.techUid && targetChatKey.includes(card.dataset.techUid)) {
                        targetCard = card;
                    }
                }
            });

            // ২. যদি প্রথম ধাপে না পাওয়া যায়, তবে চ্যাট লিস্টের ইনকোয়ারি সেকশন বা টেকনিশিয়ান লিস্ট থেকে সঠিক কার্ডটি মেলানো
            if (!targetCard && targetChatKey) {
                allCards.forEach(card => {
                    const cardTitle = card.querySelector('.card-title')?.innerText?.trim().toLowerCase();
                    // নোটিফিকেশনের সেন্ডার বা চ্যাটকি থেকে নাম বা আইডি মিলিয়ে দেখা
                    if (targetChatKey.toLowerCase().includes(cardTitle) || (card.dataset.techUid && targetChatKey.includes(card.dataset.techUid))) {
                        targetCard = card;
                    }
                });
            }

            // ৩. যদি তবুও নির্দিষ্ট কার্ড না মিলে, তবে লুপের বাইরে গিয়ে যার সাথে মিলবে তাকে নেব (প্রথমটিকে বাইপাস করে)
            if (!targetCard && allCards.length > 0) {
                // যদি একাধিক কার্ড থাকে, তবে চ্যাটকি বা ইউজারের নাম জাস্টিফাই করে সিলেক্ট করা
                allCards.forEach(card => {
                    if (card.dataset.jobId === targetJobId) {
                        const cardText = card.innerText.toLowerCase();
                        // রাহাত বা অন্য কারো নাম ইউআরএল বা চ্যাটকি তে থাকলে সেটি স্কিপ করে অন্যটা ধরা যদি সেটা টার্গেট না হয়
                        if (targetChatKey && targetChatKey.includes('rahat')) {
                            if (cardText.includes('rahat')) targetCard = card;
                        } else {
                            // অন্য কেউ হলে প্রথমটি বাদ দিয়ে পরেরটি বা যেটি মিলে তাকে সিলেক্ট করা
                            targetCard = card; 
                        }
                    }
                });
                // একান্তই না পেলে ফলব্যাক হিসেবে প্রথমটি
                if (!targetCard) targetCard = allCards[0];
            }

            window.currentJobId = targetJobId;
            let techName = 'টেকনিশিয়ান';
            let techAvatar = '';

            if (targetCard) {
                window.currentTechUid = targetCard.dataset.techUid || '';
                techName = targetCard.querySelector('.card-title')?.innerText || 'টেকনিশিয়ান';
                techAvatar = targetCard.querySelector('img')?.src || '';
            }

            // মোডালের হেডে সঠিক নাম ও ছবি বসানো
            const modalNameEl = document.getElementById('modal-client-name');
            const modalImgEl = document.getElementById('modal-client-img');
            if (modalNameEl) modalNameEl.innerText = techName;
            if (modalImgEl && techAvatar) modalImgEl.src = techAvatar;

            // চ্যাট মোডাল ওপেন করা
            const chatModal = document.getElementById('chat-modal');
            if (chatModal) {
                document.body.appendChild(chatModal);
                chatModal.style.setProperty('display', 'flex', 'important');
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
                chatModal.style.setProperty('position', 'fixed', 'important');
                chatModal.style.setProperty('top', '0', 'important');
                chatModal.style.setProperty('left', '0', 'important');
                chatModal.style.setProperty('width', '100%', 'important');
                chatModal.style.setProperty('height', '100%', 'important');
                chatModal.style.setProperty('z-index', '1001', 'important');

                if (typeof startChatPolling === 'function') {
                    startChatPolling();
                }
                if (typeof loadExistingMessages === 'function') {
                    loadExistingMessages(true);
                }
            }
        }, 100);
    }
});

function loadApplicantsUI(jobId) {
    const container = document.getElementById('applicants-container');
    if (!container) return;

    container.innerHTML = '';
    const applicants = getApplicantsByJobId(jobId);

    // প্রথমে sectionBox ডিক্লেয়ার করে নেওয়া হচ্ছে
    const sectionBox = container.closest('.section-box');

    // পুরোনো সেকশন বক্স এবং আগের See More বাটন থাকলে রিমूव করে দেওয়া
    if (sectionBox) {
        const existingBtn = document.getElementById('applicants-see-more-btn') || sectionBox.querySelector('.see-more-btn');
        if (existingBtn) existingBtn.remove();
        sectionBox.classList.remove('expanded');
    }

    if (!applicants || applicants.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #687280; padding: 15px;">এখনো কোনো আবেদন জমা পড়েনি</p>';
        return;
    }

    // কার্ডগুলো রেন্ডার করার অংশ
    applicants.forEach(app => {
        const name = app.applicantIdentification?.name || "টেকনিশিয়ান";
        const laborCost = app.proposalDetails?.laborCost || "০";
        const estimatedTime = app.proposalDetails?.estimatedTime || "নির্দিষ্ট নয়";

       // যদি profileImage নিজেই একটি স্ট্রিং (base64 বা url) হয়, তবে সরাসরি সেটি ব্যবহার করা হবে
const profileImg = app.applicantIdentification?.profileImage
                   || 'images/default-avatar.png';

        const cardHTML = `
            <div class="sample-item-card">
                <div class="card-left">
                    <img src="${profileImg}" alt="Avatar" class="card-icon" style="border-radius: 50%; object-fit: cover;">
                    <div>
                        <h4 class="card-title">
                            ${name} <span class="badge">টেকনিশিয়ান</span>
                        </h4>
                        <p class="card-subtitle">
                            বাজেট: <strong>${laborCost} টাকা</strong> | সময়: <strong>${estimatedTime}</strong>
                        </p>
                    </div>
                </div>
                <button class="preview-btn" onclick="viewApplicantDetails('${jobId}', '${app.applicantId}')">বিস্তারিত</button>
            </div>
        `;

        container.innerHTML += cardHTML;
    });

    // ==========================================
    // ৩টির বেশি কার্ড থাকলে "See More" বাটন লজিক
    // ==========================================
    const allCards = container.querySelectorAll('.sample-item-card');

    if (sectionBox && allCards.length > 3) {
        const seeMoreBtn = document.createElement('button');
        seeMoreBtn.id = 'applicants-see-more-btn';
        seeMoreBtn.className = 'see-more-btn';
        seeMoreBtn.innerText = 'আরও দেখুন (See More)...';

        seeMoreBtn.addEventListener('click', function() {
            sectionBox.classList.toggle('expanded');
            if (sectionBox.classList.contains('expanded')) {
                seeMoreBtn.innerText = 'সংক্ষিপ্ত করুন (See Less)';
            } else {
                seeMoreBtn.innerText = 'আরও দেখুন (See More)...';
                sectionBox.scrollTop = 0;
            }
        });

        sectionBox.insertAdjacentElement('afterend', seeMoreBtn);
    }
}



window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const openChat = urlParams.get('openChat');
    const jobId = urlParams.get('jobId'); // সঠিক জব আইডি এখান থেকে নেওয়া হচ্ছে

    if (jobId) {
        loadApplicantsUI(jobId); // এখানে সঠিক jobId পাস করা হলো
    }
});

// এপিআই ফাংশন ব্যবহার করে ডিটেইলস মোডাল ওপেন করার ফাংশন
function viewApplicantDetails(jobId, applicantId) {
    // আপনার তৈরি করা এপিআই ফাংশন দিয়ে এই জবের সমস্ত অ্যাপ্লিকেন্টদের ডেটা নিয়ে আসা
    const applicants = getApplicantsByJobId(jobId);
    
    // নির্দিষ্ট applicantId অনুযায়ী অ্যারে থেকে অ্যাপ্লিকেন্ট খুঁজে বের করা
    const targetApp = applicants.find(app => app.applicantId === applicantId);

    if (targetApp) {

        updateProposalReadStatus(jobId, applicantId);
        
        const identity = targetApp.applicantIdentification || {};
        const details = targetApp.proposalDetails || {};

        // মোডালের হেডার অংশে নাম, ইউআইডি এবং ছবি সেট করা
        document.getElementById('modalTechName').innerText = identity.name || "টেকনিশিয়ান";
        // এখানে userKey বা applicantId এর বদলে সঠিক টেকনিশিয়ান UID ব্যবহার করা হলো:
        const correctUid = identity.userId || applicantId || "N/A";
        document.getElementById('modalTechUid').innerText = "UID: " + correctUid;

        // প্রোফাইল ইমেজ সেট করা (আপনার কার্ডের রেন্ডারিং লজিকের মতো)
        const profileImg = identity.profileImage?.imageString || identity.profileImage || 'images/default-avatar.png';
        document.getElementById('modalTechImage').src = profileImg;

        // স্ট্যাটিক ফর্মে প্রপোজালের ডাটাগুলো বসানো
       // স্ট্যাটিক ফর্মে প্রপোজালের ডাটাগুলো বসানো
        // সরাসরি targetApp থেকে proposalDetails বের করে তার ভেতর থেকে appliedAt নেওয়া
        const proposalDetails = targetApp.proposalDetails || {};
        const appliedTime = proposalDetails.appliedAt || targetApp.appliedAt || "";

        document.getElementById('modalAppliedTime').value = appliedTime ? new Date(appliedTime).toLocaleString('bn-BD', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric', 
            hour12: true 
        }) : "তারিখ পাওয়া যায়নি";
        // জব আইডি ইনপুটে ডায়নামিকভাবে জব আইডি বসানো
        document.getElementById('modalJobId').value = jobId || "";
        document.getElementById('modalLaborCost').value = details.laborCost ? details.laborCost + " ৳" : "";
        document.getElementById('modalMaterialCost').value = details.materialCost || details.materialResponsibility || "N/A";
        document.getElementById('modalCancellationFee').value = details.cancellationFee ? details.cancellationFee + " ৳" : "0 ৳";
        document.getElementById('modalEstimatedTime').value = details.estimatedTime || "";
        document.getElementById('modalCoverLetter').value = details.coverLetter || "";

        // এক্সেপ্ট বা রিজেক্ট বাটনের জন্য বর্তমান আইডি সেভ করে রাখা
        window.currentActionData = { jobId, applicantId };

        // মোডাল প্রদর্শন করা
        // মোডাল প্রদর্শন করা এবং বডির সবার উপরে নিয়ে যাওয়া
        const applicantModal = document.getElementById('applicantDetailsModal');
        if (applicantModal) {
            document.body.appendChild(applicantModal);
            applicantModal.style.setProperty('display', 'flex', 'important');
            // ব্যাকগ্রাউন্ড স্ক্রল পুরোপুরি বন্ধ করা
            document.body.style.setProperty('overflow', 'hidden', 'important');
            document.documentElement.style.setProperty('overflow', 'hidden', 'important');
            applicantModal.style.setProperty('position', 'fixed', 'important');
            applicantModal.style.setProperty('top', '0', 'important');
            applicantModal.style.setProperty('left', '0', 'important');
            applicantModal.style.setProperty('width', '100%', 'important');
            applicantModal.style.setProperty('height', '100%', 'important');
            applicantModal.style.setProperty('z-index', '1005', 'important');
        }
    } else {
        alert("তথ্য পাওয়া যায়নি!");
    }
}

// মোডাল বন্ধ করার ফাংশন
function closeDetailsModal() {
    document.getElementById('applicantDetailsModal').style.display = 'none';
    // মোডাল বন্ধ হলে ব্যাকগ্রাউন্ডের স্ক্রল আবার ফিরিয়ে আনা
    document.body.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('overflow');
}

function handleAccept() {
    const { jobId, applicantId } = window.currentActionData || {};
    if (!jobId || !applicantId) return;

    // API ফাইলের ফাংশন কল করা
    const response = acceptProposal(jobId, applicantId);
    console.log("Reject API Response:", response); // কনসোলে রেসপন্স চেক করার জন্য

    // মেসেজ টেক্সট বের করে নেওয়া (যাতে অবজেক্ট হোক বা স্ট্রিং হোক সমস্যা না হয়)
    let messageText = "সফলভাবে প্রসেস করা হয়েছে";
    let isSuccess = false;

    if (response) {
        if (typeof response === 'object') {
            messageText = response.message || messageText;
            isSuccess = response.success === true;
        } else if (typeof response === 'boolean') {
            isSuccess = response;
        }
    }

    // টোস্ট কল করার চেষ্টা করা, না থাকলে কনসোল বা অ্যালার্ট দেখানো
    if (typeof showToast === 'function') {
        showToast(messageText, isSuccess ? "success" : "error");
    } else {
        alert(messageText);
    }

    closeDetailsModal();

}



// Main File: রিজেক্ট বাটন হ্যান্ডলার
function handleReject() {
    const { jobId, applicantId } = window.currentActionData || {};
    if (!jobId || !applicantId) return;

    // API ফাইলের ফাংশন কল করা
    const response = rejectProposal(jobId, applicantId);
    console.log("Reject API Response:", response); // কনসোলে রেসপন্স চেক করার জন্য

    // মেসেজ টেক্সট বের করে নেওয়া (যাতে অবজেক্ট হোক বা স্ট্রিং হোক সমস্যা না হয়)
    let messageText = "সফলভাবে প্রসেস করা হয়েছে";
    let isSuccess = false;

    if (response) {
        if (typeof response === 'object') {
            messageText = response.message || messageText;
            isSuccess = response.success === true;
        } else if (typeof response === 'boolean') {
            isSuccess = response;
        }
    }

    // টোস্ট কল করার চেষ্টা করা, না থাকলে কনসোল বা অ্যালার্ট দেখানো
    if (typeof showToast === 'function') {
        showToast(messageText, isSuccess ? "success" : "error");
    } else {
        alert(messageText);
    }

    closeDetailsModal();

}

// স্ক্রিনের মাঝে টোস্ট দেখানোর ফাংশন
function showToast(message, type = "success") {
    // পুরোনো টোস্ট থাকলে তা রিমুভ করে দেওয়া
    const existingToast = document.getElementById('custom-toast-notification');
    if (existingToast) existingToast.remove();

    // টোস্ট এলিমেন্ট তৈরি করা
    const toast = document.createElement('div');
    toast.id = 'custom-toast-notification';
    toast.innerText = message;
    
    // সাকসেস হলে সবুজ, এরর হলে লাল ব্যাকগ্রাউন্ড
    const bgColor = type === "success" ? "#10B981" : "#EF4444";
    
    // একদম স্ক্রিনের মাঝখানে (Center) দেখানোর জন্য পজিশনিং ও স্টাইল
    toast.style.position = "fixed";
    toast.style.top = "50%";
    toast.style.left = "50%";
    toast.style.transform = "translate(-50%, -50%)";
    toast.style.backgroundColor = bgColor;
    toast.style.color = "#ffffff";
    toast.style.padding = "16px 28px";
    toast.style.borderRadius = "10px";
    toast.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.25)";
    toast.style.zIndex = "999999";
    toast.style.fontSize = "16px";
    toast.style.fontWeight = "600";
    toast.style.textAlign = "center";
    toast.style.transition = "all 0.3s ease-in-out";
    
    document.body.appendChild(toast);

    // ৩ সেকেন্ড পর টোস্টটি স্ক্রিন থেকে মিলিয়ে যাবে
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const openProposal = urlParams.get('openProposal');
    const targetJobId = urlParams.get('jobId');
    const targetApplicantId = urlParams.get('applicantId');

    if (openProposal === 'true' && targetJobId && targetApplicantId) {
        setTimeout(() => {
            // আপনার প্রপোজাল বা অ্যাপ্লিকেন্ট মোডাল ওপেন করার ফাংশনটি এখানে কল করুন
            if (typeof viewApplicantDetails === 'function') {
                viewApplicantDetails(targetJobId, targetApplicantId);
            }
        }, 100);
    }
});