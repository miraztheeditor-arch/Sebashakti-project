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
