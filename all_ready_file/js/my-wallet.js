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


document.addEventListener('DOMContentLoaded', function () {
   const walletUserNameSpan = document.getElementById('wallet-user-name'); // এটি স্প্যান ট্যাগ হিসেবে ধরুন
    const profileUserNameSpan = document.getElementById('user-name'); // এটি স্প্যান ট্যাগ হিসেবে ধরুন

    if (walletUserNameSpan) {
        // সেশন থেকে সার্ভারের আসল নামটা নিয়ে আসা
        const realUserName = sessionStorage.getItem('liveUserName');

        if (realUserName && realUserName !== "User" && realUserName !== "Dear Valuable User") {
            walletUserNameSpan.innerText = realUserName;
            
            // সাইডবারের স্প্যান ট্যাগের জন্য .innerText ব্যবহার করতে হবে
            if (profileUserNameSpan) {
                profileUserNameSpan.innerText = realUserName;
            }
        } else {
            walletUserNameSpan.innerText = "User"; // ফলব্যাক
            if (profileUserNameSpan) {
                profileUserNameSpan.innerText = "User...";
            }
        }
        
        
    }
});


// আলাদাভাবে শুধুমাত্র ইউজার আইডি ধরার এবং সেট করার কোড
document.addEventListener('DOMContentLoaded', function () {
    const realUserId = sessionStorage.getItem('liveUserId');
    const userIdProfile = document.getElementById('user-id-profile');
    const walletUserIdProfile = document.getElementById('wallet-user-id-profile');

    if (userIdProfile) {
        if (realUserId) {
            userIdProfile.textContent = `UID: ${realUserId}`;

            if(walletUserIdProfile) {
                walletUserIdProfile.textContent = `UID: ${realUserId}`;
            }
        } else {
            userIdProfile.textContent = "UID: #XXXX"; // ডেটা না থাকলে ফলব্যাক
        }
    }
});

// আলাদাভাবে শুধুমাত্র অবতার বা প্রোফাইল লেটার ধরার এবং সেট করার কোড
document.addEventListener('DOMContentLoaded', function () {
    const realAvatarLetter = sessionStorage.getItem('liveAvatarLetter');
    const avatarLetterProfile = document.getElementById('profile-avatar-letter');
    const avatarLetter = document.getElementById('avatar-letter');
    const walletProfileAvatarLetter = document.getElementById('wallet-profile-avatar-letter');

    if (avatarLetterProfile) {
        if (realAvatarLetter) {
            avatarLetterProfile.innerText = realAvatarLetter;
            avatarLetter.innerText = realAvatarLetter;
            walletProfileAvatarLetter.innerText = realAvatarLetter;
        } else {
            avatarLetterProfile.innerText = "U"; // ডেটা না থাকলে ফলব্যাক
            avatarLetter.innerText = "U"; // ডেটা না থাকলে ফলব্যাক
            walletProfileAvatarLetter.innerText = "U"; // ডেটা না থাকলে ফলব্যাক
        }
    }
});