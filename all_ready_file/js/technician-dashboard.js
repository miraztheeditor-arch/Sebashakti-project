document.addEventListener('DOMContentLoaded', async function() {
    const avatarLetterSpan = document.getElementById('avatar-letter');
    
    try {
        // সার্ভার থেকে ডাটা আনার চেষ্টা
        const savedName = await UserAPI.getUserName(); 

        if (savedName && savedName.length > 0) {
            avatarLetterSpan.innerText = savedName.charAt(0).toUpperCase();
        } else {
            // ডাটা খালি হলে ডিফল্ট 'U'
            avatarLetterSpan.innerText = "U";
        }
    } catch (err) {
        // সার্ভার থেকে ডাটা আনতে সমস্যা হলে এখানে আসবে
        console.error("সার্ভার থেকে নাম আনতে সমস্যা হয়েছে:", err);
        
        // এখানে আপনি alert দিতে পারেন অথবা ডিফল্ট কোনো নাম দেখাতে পারেন
        // alert("সার্ভারে কানেকশন নেই, পরে চেষ্টা করুন।"); 
        
        // ডিফল্ট হিসেবে 'U' ই থাক, যাতে ইউজার ইন্টারফেস ভেঙে না যায়
        avatarLetterSpan.innerText = "U"; 
    }
});
document.addEventListener('DOMContentLoaded', async function() {
    const nameDisplaySpan = document.getElementById('user-display-name');
    
    try {
        // এপিআই থেকে নাম আনার চেষ্টা
        const savedName = await UserAPI.getUserName(); 

        if (savedName && savedName.length > 0) {
            nameDisplaySpan.innerText = savedName;
        } else {
            nameDisplaySpan.innerText = "User"; // ডাটা খালি থাকলে 'User' দেখাবে
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

        // ৩. আইডি থাকলে বসিয়ে দিন
        const userIdDisplay = document.getElementById("user-id-display");
        if (userIdDisplay) {
            userIdDisplay.textContent = `টেকনিশিয়ান আইডি: ${userId}`;
        }
        
    } catch (error) {
        // যদি আইডি না থাকে বা কোনো এরর হয়, তবে খেলা এখানেই শেষ
        console.error("Critical Access Error:", error);
         window.location.href = "signup-form.html"; 
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
        const idElement = document.getElementById('user-id-display');
        const nameAvater = document.getElementById('avatar-letter');
        const loginToast = document.getElementById('toastMessage');

        if (nameAvater) nameAvater.innerText = currentUser.name.charAt(0).toUpperCase();
        if (nameElement) nameElement.innerText = currentUser.name;
        if (idElement) idElement.innerText = "টেকনিশিয়ান আইডি: " + currentUser.userId;

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
       
        //alert("ডাটা পাওয়া যায়নি! দয়া করে আবার লগইন করুন।");
        //window.location.href = "/all_ready_file/html/signup-form.html";
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