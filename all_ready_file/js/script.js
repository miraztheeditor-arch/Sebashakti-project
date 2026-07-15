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