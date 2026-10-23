document.addEventListener('DOMContentLoaded', async function() {
    const avatarLetterSpan = document.getElementById('avatar-letter');
    const avatarLetterProfile = document.getElementById('profile-avatar-letter');
    
  try {
    const savedName = await UserAPI.getUserName();

    if (savedName && savedName.length > 0) {
        const firstLetter = savedName.charAt(0).toUpperCase();
        
        // 🔥 অবতার লেটার আলাদাভাবে সেশনে সেভ করা হলো
        sessionStorage.setItem('liveAvatarLetter', firstLetter);

        const avatarLetterSpan = document.getElementById('avatar-letter');
        const avatarLetterProfile = document.getElementById('profile-avatar-letter');

        if (avatarLetterSpan) avatarLetterSpan.innerText = firstLetter;
        if (avatarLetterProfile) avatarLetterProfile.innerText = firstLetter;
    } else {
        sessionStorage.setItem('liveAvatarLetter', 'U');
    }
    } catch (err) {
        // সার্ভার থেকে ডাটা আনতে সমস্যা হলে এখানে আসবে
        console.error("সার্ভার থেকে নাম আনতে সমস্যা হয়েছে:", err);
        
        // এখানে আপনি alert দিতে পারেন অথবা ডিফল্ট কোনো নাম দেখাতে পারেন
        // alert("সার্ভারে কানেকশন নেই, পরে চেষ্টা করুন।"); 
        
        // ডিফল্ট হিসেবে 'U' ই থাক, যাতে ইউজার ইন্টারফেস ভেঙে না যায়
        avatarLetterSpan.innerText = "U"; 
        sessionStorage.setItem('liveAvatarLetter', 'U');
    }
});
document.addEventListener('DOMContentLoaded', async function() {
    const nameDisplaySpan = document.getElementById('user-display-name');
    const nameSpan = document.getElementById('user-name');
    
    try {
        // এপিআই থেকে নাম আনার চেষ্টা
        const savedName = await UserAPI.getUserName();

        if (savedName && savedName.length > 0) {
            nameDisplaySpan.innerText = savedName;
            nameSpan.innerText = savedName;

            // 🚀 লঞ্চ রেডি কোড: সার্ভার থেকে নাম পাওয়ার সাথে সাথেই প্রোফাইল বা অন্য ফাইলের জন্য সেভ করে রাখা
        sessionStorage.setItem('liveUserName', savedName);
        } else {
            nameDisplaySpan.innerText = "User"; // ডাটা খালি থাকলে 'User' দেখাবে
            sessionStorage.setItem('liveUserName', "User");
        }
    } catch (err) {
        console.error("সার্ভার থেকে নাম আনতে সমস্যা হয়েছে:", err);
        // এরর হলে ডিফল্ট হিসেবে 'User' দেখাবে, যাতে পেজ ভেঙে না যায়
        nameDisplaySpan.innerText = "Dear Valuable User"; 
    }
});
document.addEventListener("DOMContentLoaded", function() {
    // ১. চেক করুন সিগন্যালটি আছে কি না
    if (localStorage.getItem("showWelcomeToast") === "true") {
        
        // ২. আপনার টোস্ট মেসেজ দেখান
        showToast(); 
        
        // ৩. মেসেজটি ডিলিট করে দিন যাতে রিফ্রেশ করলে আবার না আসে
        localStorage.removeItem("showWelcomeToast");
    }
});

// টোস্ট ফাংশনটি এখানে বা কমন জেএস ফাইলে রাখুন
function showToast() {
    const toast = document.getElementById("toastMessage");
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 3000);
}

document.addEventListener("DOMContentLoaded", async function() {
    try {
        // ১. ট্রাই ব্লকের ভেতরে আইডি আনুন
        const userId = await UserAPI.getUserId();

        // ২. আইডি চেক করুন (যদি আইডি না থাকে, তবে রেজিস্ট্রেশন অসম্পূর্ণ!)
        if (!userId) {
            throw new Error("User ID not found! Redirecting to signup...");
        }

        // 🔥 লঞ্চ রেডি: আইডি সেশনে সেভ করে দেওয়া হলো যাতে অন্য ফাইলও পায়
        sessionStorage.setItem('liveUserId', userId);

        // ৩. আইডি থাকলে বসিয়ে দিন
        const userIdDisplay = document.getElementById("user-id-display");
        const userIdProfile = document.getElementById("user-id-profile");
        if (userIdDisplay) {
            userIdDisplay.textContent = `টেকনিশিয়ান আইডি: ${userId}`;
            userIdProfile.textContent = `UID: ${userId}`;
        }
        
    } catch (error) {
        // যদি আইডি না থাকে বা কোনো এরর হয়, তবে খেলা এখানেই শেষ
        console.error("Critical Access Error:", error);
         window.location.href = "../../../index.html"; 
        // ইউজারকে সাইন-আপ পেজে ফেরত পাঠান
        alert("আপনার রেজিস্ট্রেশন অসম্পূর্ণ! দয়া করে পুনরায় সাইন-আপ করুন।");
       
        
        return; // এখানেই কোড রান করা বন্ধ হয়ে যাবে
    }
});

window.addEventListener('DOMContentLoaded', () => {
    // ১. লোকাল স্টোরেজ থেকে ডাটাবেজ নিন
    const masterData = JSON.parse(localStorage.getItem('userMasterData'));
    
    // ২. ইউআরএল থেকে ইউজার আইডি নিন
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get('id');




    // ৩. masterData থেকে সঠিক ইউজারটি খুঁজে বের করুন
    // Object.values ব্যবহার করে সব ইউজারের ভেতর থেকে আইডি ম্যাচ করছি
    const currentUser = Object.values(masterData).find(u => u.userId === userIdFromUrl);

    if (currentUser) {
        // ৪. সফলভাবে ডাটা পাওয়া গেলে আপডেট করুন
        const nameElement = document.getElementById('user-display-name');
        const nameProfile = document.getElementById('user-name');
        const idElementDisplay = document.getElementById('user-id-display');
        const idElementProfile = document.getElementById('user-id-profile');
        const nameAvater = document.getElementById('avatar-letter');
        const nameAvaterLetter = document.getElementById('profile-avatar-letter');
        const loginToast = document.getElementById('toastMessage');

        if (nameElement) nameElement.innerText = currentUser.name;
        if (nameAvaterLetter) nameAvaterLetter.innerText = currentUser.name.charAt(0).toUpperCase();
        if (nameAvater) nameAvater.innerText = currentUser.name.charAt(0).toUpperCase();
        if (nameProfile) nameProfile.innerText = currentUser.name;
        if (idElementDisplay) idElementDisplay.innerText = "UID: " + currentUser.userId;
        if (idElementProfile) idElementProfile.innerText = "UID: " + currentUser.userId;

        // টোস্ট মেসেজটি শুধুমাত্র একবার দেখানোর লজিক
    // চেক করুন ইউজার কি মাত্রই লগইন করে এসেছে কিনা (সাইন-আপ বা লগইন পেজ থেকে)
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');

    if (justLoggedIn === 'true') {
        loginToast.innerText = "স্বাগতম! আপনি সফলভাবে আপনার ড্যাশবোর্ডে লগইন করেছেন!";
        loginToast.style.display = "block";
        
        setTimeout(() => {
            loginToast.style.display = "none";
            // মেসেজ দেখানো শেষ হলে ফ্ল্যাগটি সরিয়ে ফেলুন
            sessionStorage.removeItem('justLoggedIn');
        }, 3000);
    }
        console.log("সফল: মাস্টার ডাটা থেকে ডাটা লোড হয়েছে", currentUser);
    } else {
        // যদি ইউজার না পাওয়া যায়
       
       // alert("ডাটা পাওয়া যায়নি! দয়া করে আবার লগইন করুন।");
       // window.location.href = "../../../index.html";
    }
});

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
    window.location.href = 'find-jobs.html';
});


document.getElementById('bell-icon').addEventListener('click', function() {
    window.location.href = 'bell-icon.html';
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

function updateWishlistDashboardCount() {
    let jobsArray = TechnicianWishlistAPI.getWishlistJobs();
    let countBadge = document.getElementById('wishlist-count-badge');
    if (countBadge) {
        countBadge.innerText = jobsArray.length;
    }
}

// পেজ লোড হওয়ার পর এবং উইশলিস্ট রেন্ডার করার সময় এটি কল করতে হবে
document.addEventListener('DOMContentLoaded', () => {
    updateWishlistDashboardCount();
});