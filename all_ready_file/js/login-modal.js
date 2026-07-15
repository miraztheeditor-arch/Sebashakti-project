// পপআপ খোলার ফাংশন (আপনার বাটনের সাথে কানেক্টেড)
function openLoginModal() {
    document.getElementById("loginModal").style.display = "block";
    document.body.classList.add('stop-scrolling');
}

// বন্ধ করার ফাংশন
function closeLoginModal() {
    document.getElementById("loginModal").style.display = "none";
    document.body.classList.remove('stop-scrolling');
}
document.getElementById("loginSubmit").onclick = async function() {
    const userField = document.getElementById("username");
    const passField = document.getElementById("password");
    
    const userVal = userField.value.trim();
    const passVal = passField.value.trim();

    // চেক: ডাটাবেজের সাথে মিলিয়ে দেখা
    const result = await UserAPI.login(userVal, passVal);

    if (result.success) {
       
    // ফাইলগুলো যেখানে আছে সেই নির্দিষ্ট পাথটি সেট করুন
    const basePath = "/all_ready_file/html/"; 
    
    // রোল অনুযায়ী ফাইলের নাম নির্ধারণ করুন
    const dashboardFile = (result.role === 'client') ? 'client-dashboard.html' : 'technician-dashboard.html';

    // পুরো পাথটি তৈরি করুন এবং রিডাইরেক্ট করুন
    window.location.href = `${basePath}${dashboardFile}?id=${result.userId}`;
    // লগইন সাকসেসফুল হওয়ার পর
sessionStorage.setItem('justLoggedIn', 'true');

    } else {
        alert(result.message);
        // ভুল হলে ইনপুট ফিল্ড কাঁপিয়ে দেওয়া
        userField.classList.add("shake-red");
        passField.classList.add("shake-red");
        setTimeout(() => {
            userField.classList.remove("shake-red");
            passField.classList.remove("shake-red");
        }, 500);
    }
};
// লগইন পপআপ বন্ধ করে সাইন আপ পপআপ খোলার জন্য
function switchToJoin() {
    document.getElementById("loginModal").style.display = "none"; // লগইন বন্ধ
    document.getElementById("joinModal").style.display = "block";  // সাইন আপ চালু
}

// সাইন আপ পপআপ বন্ধ করে লগইন পপআপ খোলার জন্য
function switchToLogin() {
    document.getElementById("joinModal").style.display = "none";  // সাইন আপ বন্ধ
    document.getElementById("loginModal").style.display = "block"; // লগইন চালু
};