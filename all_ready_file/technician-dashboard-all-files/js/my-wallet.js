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

function switchHistoryTab(type, headerTitle, event) {
    // ১. সব বাটন থেকে active ক্লাস সরাও
    document.querySelectorAll('.history-tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // ২. সব হিস্ট্রি কন্টেন্ট হাইড করো
    document.querySelectorAll('.history-tab-content').forEach(content => content.style.display = 'none');
    
    // ৩. ডান পাশের হিস্ট্রি ফিল্ডের ভেতরের হেডার টাইটেল সিলেক্টেড বাটনের নাম অনুযায়ী আপডেট করো
    document.getElementById('history-header-title').innerText = headerTitle;
    
    // ৪. কাঙ্ক্ষিত ট্যাব শো করো এবং ক্লিক করা বাটনে active ক্লাস যুক্ত করো
    if (type === 'commission') {
        document.getElementById('commission-list').style.display = 'block';
        event.currentTarget.classList.add('active');
    } else if (type === 'deposit') {
        document.getElementById('deposit-list').style.display = 'block';
        event.currentTarget.classList.add('active');
    }
}

function setupHistoryFieldTabs() {
    const historyTabBtns = document.querySelectorAll('.history-field-tab-btn');

    if (historyTabBtns.length === 0) return;

    historyTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // ১. সব ট্যাব থেকে active ক্লাস সরিয়ে ফেলা
            historyTabBtns.forEach(item => item.classList.remove('active'));
            
            // ২. বর্তমানে যেটিতে ক্লিক করা হয়েছে সেটিতে active ক্লাস যোগ করা
            this.classList.add('active');

            // ৩. কোন ট্যাব সিলেক্ট করা হলো তা চেক করে প্রয়োজনীয় ডাটা লোড বা ফিল্টার করার জায়গা
            const tabText = this.innerText.trim();
            if (tabText === 'লাস্ট মান্থ') {
                // লাস্ট মান্থ সিলেক্ট করলে যা করতে হবে
                console.log('Last Month selected');
            } else if (tabText === 'ফুল টাইম') {
                // ফুল টাইম সিলেক্ট করলে যা করতে হবে
                console.log('Full Time selected');
            }
        });
    });
}

// পেজ লোড হওয়ার পর ফাংশনটি কল করা
document.addEventListener('DOMContentLoaded', setupHistoryFieldTabs);

function updateBalanceAndDue() {
    const amountNumElement = document.getElementById('amount-num');
    const dueNumElement = document.getElementById('due-num');
    if (!amountNumElement || !dueNumElement) return;

    let textValue = amountNumElement.innerText.trim();
    
    // সংখ্যা বা মাইনাস চিহ্ন আলাদা করার জন্য
    let numericValue = parseFloat(textValue.replace(/[^\d.-]/g, ''));
    if (textValue.includes('-') && isNaN(numericValue)) {
        numericValue = 0; // যদি শুধু মাইনাস থাকে
    }

    // ক্লাস রিমুভ করা
    amountNumElement.classList.remove('positive-val', 'negative-val', 'zero-val');
    dueNumElement.classList.remove('negative-val', 'zero-val');

    // ১. যদি ব্যালেন্স মাইনাস হয়
    if (textValue.includes('-') || numericValue < 0) {
        amountNumElement.classList.add('negative-val');
        
        // ব্যালেন্সের সেম ভ্যালু ডিউ তে বসবে (মাইনাস সহ বা সংখ্যা হিসেবে)
        dueNumElement.innerText = textValue; 
        dueNumElement.classList.add('negative-val');
    } 
    // ২. যদি ব্যালেন্স জিরো হয়
    else if (textValue === '০' || textValue === '০০০' || textValue === '0' || numericValue === 0) {
        amountNumElement.classList.add('zero-val');
        
        // ডিউ জিরো হয়ে যাবে
        dueNumElement.innerText = '০';
        dueNumElement.classList.add('zero-val');
    } 
    // ৩. যদি ব্যালেন্স জিরো থেকে বেশি (পজিটিভ) হয়
    else {
        amountNumElement.classList.add('positive-val');
        
        // ডিউ জিরো হয়ে যাবে
        dueNumElement.innerText = '০';
        dueNumElement.classList.add('zero-val');
    }
}

// পেজ লোড হওয়ার পর বা ডেটা পরিবর্তনের সময় এই ফাংশনটি কল করবেন
document.addEventListener('DOMContentLoaded', updateBalanceAndDue);



document.addEventListener('DOMContentLoaded', async () => {
    // ১. ইউআরএল বা সেশন থেকে বর্তমান ইউজারের আইডি বের করুন
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get('id') || sessionStorage.getItem('liveUserId');

    if (!currentUserId) return;

    // ২. মাস্টার ডাটা থেকে এই আইডির তথ্য খুঁজে বের করুন
    const masterDataStr = localStorage.getItem('userMasterData');
    if (!masterDataStr) return;

    const masterData = JSON.parse(masterDataStr);
    const foundUser = Object.values(masterData).find(user => user.userId === currentUserId);

    if (foundUser && foundUser.name) {
        const userName = foundUser.name;
        const userId = foundUser.userId;
        const firstLetter = userName.charAt(0).toUpperCase();

        // --- ৩. মেইন ডিসপ্লে সেকশনের ডেটা আপডেট ---
        const nameDisplay = document.getElementById('user-name');
        if (nameDisplay) nameDisplay.innerText = userName;

        const idDisplay = document.getElementById('user-id-profile');
        if (idDisplay) idDisplay.innerText = `UID: ${userId}`;

        const avatarLetterDisplay = document.getElementById('profile-avatar-letter');
        if (avatarLetterDisplay) avatarLetterDisplay.innerText = firstLetter;


        // --- ৪. সাইডবার (Sidebar) সেকশনের ডেটা আপডেট ---
        const sidebarName = document.getElementById('wallet-user-name');
        if (sidebarName) sidebarName.innerText = userName;

        const sidebarId = document.getElementById('wallet-user-id-profile');
        if (sidebarId) sidebarId.innerText = `UID: ${userId}`;

        const sidebarAvatarLetter = document.getElementById('wallet-profile-avatar-letter');
        if (sidebarAvatarLetter) sidebarAvatarLetter.innerText = firstLetter;


        // --- ৫. হেডার বা নেভিগেশন বারের অ্যাভাটার আপডেট (আপনার নতুন স্ক্রিনশট অনুযায়ী) ---
        const navAvatarLetter = document.getElementById('avatar-letter');
        if (navAvatarLetter) navAvatarLetter.innerText = firstLetter;


        // --- ৬. ইনপুট ফিল্ডে নাম বসানোর জন্য (যদি থাকে) ---
        const nameInput = document.getElementById('fullName');
        if (nameInput) nameInput.value = userName;
        
        console.log("সফলভাবে সব জায়গার (ডিসপ্লে, সাইডবার ও হেডার) ডেটা ও অ্যাভাটার লোড হয়েছে:", userName);
    }
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
    window.location.href = 'find-jobs.html';
});

document.getElementById('bell-icon').addEventListener('click', function() {
    window.location.href = 'bell-icon.html';
});


document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get('id') || sessionStorage.getItem('liveUserId');

    if (currentUserId) {
        try {
            // এপিআই থেকে সেভ করা ছবি নিয়ে আসা
            const savedImageString = await UserAPI.getProfileImage(currentUserId);

            if (savedImageString) {
                // ১. মোট ৩টি সার্কেল এলিমেন্ট সিলেক্ট করা
                const avatarElements = [
                    ...document.querySelectorAll('#profile-avatar'), 
                    document.getElementById('wallet-profile-avatar')
                ];

                avatarElements.forEach(avatarContainer => {
                    if (avatarContainer) {
                        avatarContainer.style.backgroundImage = `url(${savedImageString})`;
                        avatarContainer.style.backgroundSize = 'cover';
                        avatarContainer.style.backgroundPosition = 'center';
                        
                        // ২. সার্কেলের ঠিক ভেতরে থাকা 'span' বা লেটার এলিমেন্টটিকে সরাসরি রিমুভ করে দেওয়া
                        const innerSpan = avatarContainer.querySelector('span');
                        if (innerSpan) {
                            innerSpan.remove(); // লেটারটি আর থাকবে না বা কালার বদলানোর সুযোগ পাবে না
                        }
                    }
                });
            }
        } catch (error) {
            console.error("প্রোফাইল ছবি লোড করতে সমস্যা হয়েছে:", error);
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // এপিআই থেকে ওয়ালেটের ডেটা ফেচ করা
    const walletData = window.WalletAPI.getTechnicianWalletData();

    if (walletData) {
        // ১. বর্তমান ব্যালেন্স বসানো (id="amount-num")
        const amountNumEl = document.getElementById('amount-num');
        if (amountNumEl) {
            amountNumEl.innerText = walletData.balance !== undefined ? walletData.balance : 0;
        }

        // ২. মোট কাটা কমিশন বসানো (এটির জন্য এইচটিএমএলে h3 ট্যাগে id="commission-num" যুক্ত করে নিতে পারেন)
        const commissionEl = document.getElementById('commission-num');
        if (commissionEl) {
            commissionEl.innerText = (walletData.totalCommission !== undefined ? walletData.totalCommission : 0) + "৳";
        }

        // ৩. বকেয়া অ্যাডজাস্টমেন্ট বসানো (id="due-num")
        const dueNumEl = document.getElementById('due-num');
        if (dueNumEl) {
            dueNumEl.innerText = walletData.dueAdjustment !== undefined ? walletData.dueAdjustment : 0;
        }

        console.log("ওয়ালেট ডেটা সফলভাবে বাইন্ড করা হয়েছে:", walletData);
    }
});