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

// লগইন লজিক
document.getElementById("loginSubmit").onclick = function() {
    const user = document.getElementById("username");
    const pass = document.getElementById("password");
    
    // ইউজারনেম খালি থাকলে
    if (user.value.trim() === "") {
        user.classList.add("shake-red");
        setTimeout(() => user.classList.remove("shake-red"), 500);
    }
    
    // পাসওয়ার্ড খালি থাকলে
    if (pass.value.trim() === "") {
        pass.classList.add("shake-red");
        setTimeout(() => pass.classList.remove("shake-red"), 500);
    }
    
    // যদি সব ঠিক থাকে
    if (user.value.trim() !== "" && pass.value.trim() !== "") {
        alert("লগইন সফল!");
    }
}
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