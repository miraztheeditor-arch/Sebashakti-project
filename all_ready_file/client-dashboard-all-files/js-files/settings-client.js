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

let failedAttempts = 0;
let lockoutTimer = null;
let isLocked = false;

// ১. Change Password বাটনে ক্লিক করলে ফর্ম ওপেন হবে
function openPasswordForm() {
    if (isLocked) return; // লক থাকলে ওপেন হবে না
    document.getElementById('password-trigger-box').style.display = 'none';
    document.getElementById('password-form-box').style.display = 'block';
}

// ২. পাসওয়ার্ড আপডেট সাবমিট হ্যান্ডলার (ভুল হলে টাইমার বাড়ার লজিক)
function handlePasswordUpdate(event) {
    event.preventDefault();
    if (isLocked) return;

    const currentPassInput = document.getElementById('current-password').value;
    const warningBox = document.getElementById('security-warning');
    const updateBtn = document.getElementById('update-pass-btn');

    // এখানে আপনার ব্যাকএন্ড বা ডেটাবেজ অনুযায়ী কারেন্ট পাসওয়ার্ড চেক করতে হবে।
    // আপাতত ডেমো হিসেবে ধরে নিলাম সঠিক পাসওয়ার্ড হলো "123456"
    const correctPassword = "123456"; 

    if (currentPassInput === correctPassword) {
        // সফল হলে
        alert("Password updated successfully!");
        failedAttempts = 0; // ভুল কাউন্ট রিসেট
        document.getElementById('password-form-box').reset();
        document.getElementById('password-form-box').style.display = 'none';
        document.getElementById('password-trigger-box').style.display = 'block';
        warningBox.style.display = 'none';
    } else {
        // পাসওয়ার্ড ভুল হলে
        failedAttempts++;
        
        // প্রতি ভুলের জন্য টাইমার বাড় াবে (যেমন: প্রথম ভু্লে ১০ সেকেন্ড, দ্বিতীয় ভু্লে ৩০ সেকেন্ড, এরপর ১ মিনিট...)
        let waitTime = 10; // ডিফল্ট ১০ সেকেন্ড
        if (failedAttempts === 2) waitTime = 30;
        if (failedAttempts >= 3) waitTime = 60;

        startLockout(waitTime);
    }
}

// ৩. টাইমার ও লকআউট ফাংশন
function startLockout(seconds) {
    isLocked = true;
    const updateBtn = document.getElementById('update-pass-btn');
    const warningBox = document.getElementById('security-warning');
    const currentPassInput = document.getElementById('current-password');
    
    updateBtn.disabled = true;
    updateBtn.style.opacity = "0.5";
    currentPassInput.disabled = true;

    warningBox.style.display = 'block';

    let timeLeft = seconds;
    
    lockoutTimer = setInterval(() => {
        warningBox.innerHTML = `⚠️ Incorrect Current Password! Too many failed attempts. Please try again in <b>${timeLeft}</b> seconds.`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(lockoutTimer);
            isLocked = false;
            updateBtn.disabled = false;
            updateBtn.style.opacity = "1";
            currentPassInput.disabled = false;
            warningBox.style.display = 'none';
            warningBox.innerHTML = '';
        }
    }, 1000);
}
// ইউজার বা সিস্টেমের ফোন বা ইমেইল নম্বর (ডেমো হিসেবে এখানে একটি নম্বর রাখা হলো)
const userPhoneNumber = "+8801712345678"; 

// ১. Forgot Password এ ক্লিক করলে ওটিপি সেকশন ওপেন হবে এবং নম্বর হাইড করবে
function handleForgotPassword(event) {
    event.preventDefault();
    
    // মেইন পাসওয়ার্ড ফর্ম হাইড করে ওটিপি বক্স ওপেন করা
    document.getElementById('password-form-box').style.display = 'none';
    
    const otpBox = document.getElementById('otp-section-box');
    const msgElement = document.getElementById('otp-sent-message');
    
    otpBox.style.display = 'block';

    // নম্বরের মাঝের অংশ স্টার (*) দিয়ে হাইড করার লজিক (যেমন: +88017****5678)
    let maskedNumber = hideMiddleDigits(userPhoneNumber);
    
    // হেডার বা মেসেজ সেট করা
    msgElement.innerHTML = `আপনার <b>${maskedNumber}</b> এত নম্বরে ৪ সংখ্যার ওটিপি পাঠানো হয়েছে, সেটা সাবমিট করুন।`;
}

// নম্বরের মাঝের অংশ স্টার দিয়ে হাইড করার ফাংশন
function hideMiddleDigits(phone) {
    if (phone.length > 8) {
        let start = phone.slice(0, 5); // প্রথম ৫টি ক্যারেক্টার রাখবে
        let end = phone.slice(-4);   // শেষের ৪টি ক্যারেক্টার রাখবে
        return start + "****" + end;
    }
    return phone;
}

// ওটিপি ভেরিফাই করার আপডেট করা ফাংশন
function verifyOTP() {
    const otpInput = document.getElementById('otp-input').value;
    
    // ডেমো ওটিপি হিসেবে "1234" ধরা হলো
    const correctOTP = "0000";

    if (otpInput === correctOTP) {
        // ওটিপি সঠিক হলে ওটিপি বক্স হাইড করে নতুন পাসওয়ার্ডের সেকশন ওপেন করবে
        document.getElementById('otp-section-box').style.display = 'none';
        document.getElementById('new-password-section').style.display = 'block';
        
        // ইনপুট ক্লিয়ার করা
        document.getElementById('otp-input').value = '';
    } else {
        alert("Invalid OTP! Please try again.");
    }
}

// নতুন পাসওয়ার্ড সেভ করার ফাংশন
function saveNewPassword(event) {
    event.preventDefault();
    
    const newPass = document.getElementById('reset-new-pass').value;
    const confirmPass = document.getElementById('reset-confirm-pass').value;

    if (newPass !== confirmPass) {
        alert("New passwords do not match! Please re-enter correctly.");
        return;
    }

    // পাসওয়ার্ড সফলভাবে সেভ হওয়ার পর
    alert("Password reset successfully! You can now log in with your new password.");
    
    // সব সেকশন রিসেট করে আবার মূল বাটনে ফিরিয়ে নেওয়া
    document.getElementById('new-password-section').style.display = 'none';
    document.getElementById('password-trigger-box').style.display = 'block';
    
    // ফর্ম রিসেট
    document.getElementById('reset-new-pass').value = '';
    document.getElementById('reset-confirm-pass').value = '';
}

// ৩. ওটিপি সেকশন ক্যানসেল করার জন্য
function cancelOTP() {
    document.getElementById('otp-section-box').style.display = 'none';
    document.getElementById('password-trigger-box').style.display = 'block';
    document.getElementById('otp-input').value = '';
}

let currentActionType = '';

// ১. মোডাল ওপেন করার ফাংশন (টাইপ অনুযায়ী টেক্সট ও কালার চেঞ্জ হবে)
function openModal(type) {
    currentActionType = type;
    const modal = document.getElementById('confirm-modal');
    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');
    const confirmBtn = document.getElementById('modal-confirm-btn');

    modal.style.display = 'flex';

    if (type === 'deactivate') {
        title.innerText = "Deactivate Account?";
        desc.innerText = "Your account will be temporarily disabled. You can log back in anytime to reactivate it.";
        confirmBtn.innerText = "Yes, Deactivate";
        confirmBtn.className = "btn-warning"; // ওয়ার্নিং কালার
    } else if (type === 'delete') {
        title.innerText = "Delete Account Permanently?";
        desc.innerText = "Once you delete your account, all your data will be permanently removed. There is no going back.";
        confirmBtn.innerText = "Yes, Delete";
        confirmBtn.className = "btn-danger"; // ডেঞ্জার কালার
    }
}

// ২. মোডাল বন্ধ করার ফাংশন
function closeModal() {
    document.getElementById('confirm-modal').style.display = 'none';
    currentActionType = '';
}

// ৩. কনফার্ম বাটনে ক্লিক করলে যে কাজ হবে
function executeAction() {
    if (currentActionType === 'deactivate') {
        alert("Account deactivated successfully!");
        // এখানে ডিঅ্যাক্টিভেটের ব্যাকএন্ড বা রিডাইরেক্ট কোড বসাতে পারেন
    } else if (currentActionType === 'delete') {
        alert("Account deleted permanently!");
        // এখানে ডিলিটের ব্যাকএন্ড বা লগআউট কোড বসাতে পারেন
    }
    closeModal();
}

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