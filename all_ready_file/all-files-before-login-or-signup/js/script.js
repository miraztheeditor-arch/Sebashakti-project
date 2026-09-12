function openPopup(title, desc) {
    document.getElementById('popupTitle').innerText = title;
    document.getElementById('popupDesc').innerText = desc;
    document.getElementById('servicePopup').style.display = 'flex';
    document.body.classList.add('stop-scrolling');
}

function closePopup() {
    document.getElementById('servicePopup').style.display = 'none';
    document.body.classList.remove('stop-scrolling');
}

// ইনডেক্স পেজের মেইন স্ক্রিপ্ট ফাইলে
document.addEventListener("DOMContentLoaded", function() {
    // চেক করুন কোনো সিগন্যাল আছে কি না
    if (localStorage.getItem("shouldOpenLoginModal") === "true") {
        
        // ১. মোডালটি খুলে দিন (আপনার মোডাল খোলার ফাংশনটি এখানে কল করুন)
        // ধরলাম আপনার ফাংশনটির নাম openLoginModal()
        const loginModal = document.getElementById("loginModal");
        if (loginModal) {
            loginModal.style.display = "block"; // অথবা আপনার ফাংশনটি কল করুন
        }

        // ২. সিগন্যালটি মুছে দিন যাতে পরের বার আর অটো না খোলে
        localStorage.removeItem("shouldOpenLoginModal");
    }
});

window.addEventListener('pageshow', function(event) {
    // event.persisted যদি true হয়, তার মানে পেজটি ব্রাউজারের ব্যাক হিস্ট্রি (ক্যাশ) থেকে লোড হয়েছে
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        
        // ১. মডালগুলো জোর করে বন্ধ করা
        const joinModal = document.getElementById('joinModal');
        if (joinModal) joinModal.style.display = 'none';

        const confirmationModal = document.getElementById('confirmationModal'); // আপনার সঠিক আইডিটি দিন
        if (confirmationModal) confirmationModal.style.display = 'none';

        // ২. বডি থেকে স্ক্রোল লক সরানো
        document.body.classList.remove('stop-scrolling');

        // ৩. লোকাল স্টোরেজ থেকে অসম্পূর্ণ সাইন-আপ ডেটা ক্লিন করা
        const activeSignupId = localStorage.getItem('activeSignupId');
        if (activeSignupId) {
            localStorage.removeItem(activeSignupId);
            localStorage.removeItem('activeSignupId');
        }
    }
});