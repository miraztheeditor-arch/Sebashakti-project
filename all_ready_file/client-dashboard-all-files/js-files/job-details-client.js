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

document.addEventListener("DOMContentLoaded", () => {
    // ১. URL থেকে id এবং jobId বের করা
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('id');
    const targetJobId = urlParams.get('jobId');

    if (!targetUserId || !targetJobId) {
        console.error("URL-এ সঠিক id বা jobId পাওয়া যায়নি!");
        return;
    }

    // ২. API ফাইল থেকে তৈরি করা নতুন ফাংশনটি কল করা
    const result = getJobDetailsById(targetUserId, targetJobId);

    if (result && result.success) {
        const matchedJob = result.job;
        const userData = result.user;

        // ৩. সফলভাবে পেজের ফিল্ডগুলোতে ডেটা বসিয়ে দেওয়া
        document.getElementById('lbl-username').textContent = matchedJob.username || userData.name || '-';
        document.getElementById('lbl-category').textContent = matchedJob.workCategory || '-';
        document.getElementById('lbl-current-location').textContent = matchedJob.currentLocation || '-';
        document.getElementById('lbl-fixed-location').textContent = matchedJob.fixedLocation || '-';
        document.getElementById('lbl-units').textContent = matchedJob.unitCount || '-';
        document.getElementById('lbl-date').textContent = formatDateTime(matchedJob.createdAt);
        document.getElementById('lbl-jobid').textContent = matchedJob.jobId || '-';
        document.getElementById('lbl-details').textContent = matchedJob.problemDetails || matchedJob.details || '-';

        console.log("সফলভাবে নির্দিষ্ট জবের ডাটা লোড হয়েছে:", matchedJob);
    } else {
        console.warn(result.message || "জব লোড করতে সমস্যা হয়েছে।");
    }
});

// ডেট স্ট্রিং সুন্দর ফরম্যাটে রূপান্তর করার ছোট্ট ফাংশন
function formatDateTime(isoString) {
    if (!isoString) return '-';
    try {
        const date = new Date(isoString);
        // লোকাল ফরম্যাট অনুযায়ী তারিখ ও সময় সুন্দর করে সাজানো (যেমন: 06 Sep 2026, 12:56 PM)
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (e) {
        return isoString;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const deleteBtn = document.getElementById('delete-job-btn');
    const deleteModal = document.getElementById('delete-modal');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const confirmDeleteBtn = document.getElementById('modal-confirm-delete-btn');

    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('id');
    const targetJobId = urlParams.get('jobId');

    // ১. ডিলিট বাটনে ক্লিক করলে মোডাল ওপেন হবে
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            deleteModal.style.display = 'flex';
        });
    }

    // ২. 'বাতিল' এ ক্লিক করলে মোডাল বন্ধ হবে
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            deleteModal.style.display = 'none';
        });
    }

    // ৩. মোডালের 'ডিলিট' এ ক্লিক করলে API ফাংশন কল হবে
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            // API ফাইলের মাধ্যমে ডিলিট ফাংশন কল করা হলো
            const result = deleteJobById(targetUserId, targetJobId);

            if (result.success) {
                // মোডাল ক্লোজ ফাংশন কল করা
            closeDeleteModal();
                // সফলভাবে ডিলিট হওয়ার পর ড্যাশবোর্ডে রিডাইরেক্ট
             window.location.replace(`client-dashboard.html?id=${targetUserId}`);
            } else {
                alert(result.message);
            }
        });
    }
});

// ১. ডিলিট বাটনে ক্লিক করলে মোডাল ওপেন করার গ্লোবাল ফাংশন
window.openDeleteModal = function() {
    const deleteModal = document.getElementById('delete-modal');
    if (deleteModal) {
        deleteModal.style.display = 'flex'; // এখানে deleteModal নিশ্চিত করুন
    }
};

// ২. 'বাতিল' বা মোডাল বন্ধ করার গ্লোবাল ফাংশন
window.closeDeleteModal = function() {
    const deleteModal = document.getElementById('delete-modal');
    if (deleteModal) {
        deleteModal.style.display = 'none'; // এখানেও deleteModal নিশ্চিত করুন
    }
};