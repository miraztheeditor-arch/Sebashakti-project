let loggedInUserAvatar = "assets/tech.png"; // ডিফল্ট ছবি

document.addEventListener('DOMContentLoaded', async () => {
    // ১. ইউআরএল বা সেশন থেকে বর্তমান ইউজারের আইডি বের করুন
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get('id') || sessionStorage.getItem('liveUserId');

    if (!currentUserId) return;

// ২. সরাসরি লোকালস্টোরেজ না ধরে, এপিআই ফাংশন ব্যবহার করে ইউজারের ডাটা বা নাম নিয়ে আসা
    if (typeof UserAPI === 'undefined') return;

    // এপিআই থেকে নাম বা ইউজার অবজেক্ট ফেচ করা
    const userName = UserAPI.getUserNameViaApi ? UserAPI.getUserNameViaApi(currentUserId) : "User";
    
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



const chatBtn = document.getElementById('chat-with-client-btn');
const chatModal = document.getElementById('chat-modal');
const closeChatModal = document.getElementById('close-chat-modal');

// ওপেন করা
chatBtn.addEventListener('click', function() {
    
    chatModal.style.display = 'flex';
});

// বন্ধ করা
closeChatModal.addEventListener('click', function() {
    chatModal.style.display = 'none';
});

// মোডালের বাইরে কোথাও ক্লিক করলেও যেন বন্ধ হয়ে যায় (অপশনাল)
window.addEventListener('click', function(event) {
    if (event.target === chatModal) {
        chatModal.style.display = 'none';
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

// সেন্ড বাটনে ক্লিক করলে মেসেজ পাঠানোর লজিক
sendBtn.addEventListener('click', function() {
    const messageText = chatInput.value.trim();
    
    if (messageText === "") return; // সুনিশ্চিত করার জন্য
    
    // নতুন আউটগোইং মেসেজ তৈরি
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'outgoing');
    
 // এখানে fixed ছবির জায়গায় ডাইনামিক loggedInUserAvatar ভেরিয়েবলটি ব্যবহার করা হলো
    messageDiv.innerHTML = `
        <div class="msg-text">${escapeHtml(messageText)}</div>
        <img src="${loggedInUserAvatar}" alt="Tech" class="msg-avatar">
    `;
    chatContainer.appendChild(messageDiv);
    
    // ইনপুট রিসেট করা এবং বাটন আবার ডিজেবল করে দেওয়া
    chatInput.value = "";
    chatInput.style.height = 'auto';
    chatInput.style.overflowY = 'hidden';
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