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

function updateView(viewName, element) {
    // ১. মেইন টাইটেল পরিবর্তন
    document.getElementById('main-title').innerText = viewName;

    // ২. সাইডবার বাটন থেকে 'active' ক্লাস সরানো এবং ক্লিক করাটিতে যোগ করা (আপনার পুরোনো লজিক)
    let buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    // ২. সব ট্যাব কন্টেন্ট এবং বাটন থেকে 'active' ক্লাস সরিয়ে দিন (যাতে সব কন্টেন্ট লুকানো থাকে)
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // ৩. কোন পেজে ক্লিক করেছে তার ওপর ভিত্তি করে বাটনগুলো শো/হাইড করা
    if (viewName === 'Job History') {
        // Recent ট্যাব লুকাও, History ট্যাব দেখাও
        document.querySelectorAll('.recent-tab').forEach(btn => btn.style.display = 'none');
        document.querySelectorAll('.history-tab').forEach(btn => btn.style.display = 'inline-block'); // বা block
        


        // History এর প্রথম ট্যাবটি ডিফল্টভাবে চালু করো
        document.querySelector('.history-tab').classList.add('active');
        document.getElementById('completed-jobs').classList.add('active');
    } else {
        // Recent ট্যাব দেখাও, History ট্যাব লুকাও
        document.querySelectorAll('.recent-tab').forEach(btn => btn.style.display = 'inline-block');
        document.querySelectorAll('.history-tab').forEach(btn => btn.style.display = 'none');

        // Recent এর প্রথম ট্যাবটি ডিফল্টভাবে চালু করো
        document.querySelector('.recent-tab').classList.add('active');
        document.getElementById('today-requests').classList.add('active');
    }
}






function showTab(event, tabId) {
    // ১. সব ট্যাব কন্টেন্ট থেকে 'active' ক্লাস সরিয়ে দাও
    document.querySelectorAll('.tab-content').forEach(function(content) {
        content.classList.remove('active');
    });

    // ২. সব বাটন থেকে 'active' ক্লাস সরিয়ে দাও (যদি ডিজাইন চেঞ্জ করতে চান)
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });

    // ৩. শুধুমাত্র ক্লিক করা ট্যাব কন্টেন্টে 'active' ক্লাস যোগ করো
    var targetContent = document.getElementById(tabId);
    if (targetContent) {
        targetContent.classList.add('active');
    }

    // ৪. ক্লিক করা বাটনে 'active' ক্লাস যোগ করো
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}


document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const activeParam = urlParams.get('active');

   if (activeParam === 'recent-request') {
    // ১. সব বাটন থেকে 'active' ক্লাস সরিয়ে দিন
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    // ২. প্রথম বাটনটি খুঁজে বের করুন
    const allNavBtns = document.querySelectorAll('.nav-btn');
    if (allNavBtns.length > 0) {
        // ক্লিক না করে সরাসরি 'active' ক্লাসটি যোগ করুন
        allNavBtns[1].classList.add('active');
    }

    // ৩. হেডার ম্যানুয়ালি আপডেট করুন
    document.getElementById('main-title').innerText = "Recent Job";

    // ৪. ট্যাব আপডেট করুন
    selectTab('today-requests');
}
});


function selectTab(tabId) {
    // ১. সব ট্যাব বাটন থেকে 'active' ক্লাস সরানো
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // ২. সব ট্যাব কন্টেন্ট থেকে 'active' ক্লাস সরানো
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // ৩. নির্দিষ্ট ট্যাব বাটনে 'active' ক্লাস যোগ করা (বাটনটির আইডি থাকলে)
    // অথবা আপনি যদি সরাসরি এলিমেন্ট জানেন:
    const targetTabBtn = document.querySelector(`[onclick*="${tabId}"]`);
    if (targetTabBtn) targetTabBtn.classList.add('active');

    // ৪. নির্দিষ্ট ট্যাব কন্টেন্টে 'active' ক্লাস যোগ করা
    const targetContent = document.getElementById(tabId);
    if (targetContent) targetContent.classList.add('active');
}

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');

    // যদি ইউআরএল থেকে কোনো ট্যাব পাওয়া যায়, তবে সেটি সিলেক্ট করো
    if (tabParam) {
        selectTab(tabParam);
    } else {
        // যদি কিছু না থাকে, তবে ডিফল্টভাবে 'today-requests' দেখাবে
        selectTab('today-requests');
    }
});


document.addEventListener('DOMContentLoaded', function () {
   
    const profileUserNameSpan = document.getElementById('user-name'); // এটি স্প্যান ট্যাগ হিসেবে ধরুন

    if (profileUserNameSpan) {
        // সেশন থেকে সার্ভারের আসল নামটা নিয়ে আসা
        const realUserName = sessionStorage.getItem('liveUserName');

        if (realUserName && realUserName !== "User" && realUserName !== "Dear Valuable User") {
            
            
            // সাইডবারের স্প্যান ট্যাগের জন্য .innerText ব্যবহার করতে হবে
            if (profileUserNameSpan) {
                profileUserNameSpan.innerText = realUserName;
            }
        } else {
          
                profileUserNameSpan.innerText = "User...";
            
        }
        
        
    }
});


// আলাদাভাবে শুধুমাত্র ইউজার আইডি ধরার এবং সেট করার কোড
document.addEventListener('DOMContentLoaded', function () {
    const realUserId = sessionStorage.getItem('liveUserId');
    const userIdProfile = document.getElementById('user-id-profile');
   

    if (userIdProfile) {
        if (realUserId) {
            userIdProfile.textContent = `UID: ${realUserId}`;

            
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
    

    if (avatarLetterProfile) {
        if (realAvatarLetter) {
            avatarLetterProfile.innerText = realAvatarLetter;
            avatarLetter.innerText = realAvatarLetter;
            
        } else {
            avatarLetterProfile.innerText = "U"; // ডেটা না থাকলে ফলব্যাক
            avatarLetter.innerText = "U"; // ডেটা না থাকলে ফলব্যাক
            
        }
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
