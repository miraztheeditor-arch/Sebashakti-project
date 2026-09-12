document.addEventListener('DOMContentLoaded', async () => {
    // ১. ইউআরএল বা সেশন থেকে বর্তমান ইউজারের আইডি বের করুন
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get('id') || sessionStorage.getItem('liveUserId');

    if (!currentUserId) return;

    // ২. মাস্টার ডাটা থেকে এই আইডির তথ্য খুঁজে বের করুন
    const masterDataStr = localStorage.getItem('userMasterData');
    if (!masterDataStr) return;

    const masterData = JSON.parse(masterDataStr);
    const foundUser = Object.values(masterData).find(user => user.userId === currentUserId);

    if (foundUser && foundUser.name) {
        const userName = foundUser.name;
        const userId = foundUser.userId;
        const firstLetter = userName.charAt(0).toUpperCase();

        // --- ৪. সাইডবার (Sidebar) সেকশনের ডেটা আপডেট ---
        const sidebarName = document.getElementById('user-name');
        if (sidebarName) sidebarName.innerText = userName;

        const sidebarId = document.getElementById('user-id-profile');
        if (sidebarId) sidebarId.innerText = `UID: ${userId}`;

        const sidebarAvatarLetter = document.getElementById('profile-avatar-letter');
        if (sidebarAvatarLetter) sidebarAvatarLetter.innerText = firstLetter;


        // --- ৫. হেডার বা নেভিগেশন বারের অ্যাভাটার আপডেট (আপনার নতুন স্ক্রিনশট অনুযায়ী) ---
        const navAvatarLetter = document.getElementById('avatar-letter');
        if (navAvatarLetter) navAvatarLetter.innerText = firstLetter;


        // --- ৬. ইনপুট ফিল্ডে নাম বসানোর জন্য (যদি থাকে) ---
        const nameInput = document.getElementById('fullName');
        if (nameInput) nameInput.value = userName;
        
        console.log("সফলভাবে সব জায়গার (ডিসপ্লে, সাইডবার ও হেডার) ডেটা ও অ্যাভাটার লোড হয়েছে:", userName);
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




// ক্যাটাগরি সিলেক্ট করার ফাংশন
function selectCategory(categoryKey, categoryDisplayName, element) {
    selectedCategory = categoryKey;
    
    // সাইডবারের একটিভ ক্লাস পরিবর্তন
    document.querySelectorAll('.left-sidebar-menu .menu-category-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    // ডান পাশের ওপরের হেদারে নাম শো করানো
    document.getElementById('selectedCategoryTitle').innerText = categoryDisplayName;

    // নতুন কল যুক্ত করা হলো
    renderDynamicJobs();
}

// All বা Your Areas ট্যাব সিলেক্ট করার ফাংশন
function setAreaFilter(areaType, element) {
    selectedAreaType = areaType;

    document.querySelectorAll('.two-tabs .filter-tab-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    // নতুন কল যুক্ত করা হলো
    renderDynamicJobs();
}


// পেছনের পেজে যাওয়ার ব্যাক বাটন ফাংশন
function goBack() {
    window.history.back();
}

// বিস্তারিত দেখার বাটন ক্লিক করলে
function viewJobDetails(title) {
    alert(`"${title}" কাজটির বিস্তারিত দেখতে প্রসিড করা হচ্ছে।`);
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

// গ্লোবাল ভেরিয়েবল ডিক্লেয়ারেশন (এই লাইন দুটি ফাইলের উপরে দিয়ে দিন)
let selectedCategory = 'all';
let selectedAreaType = 'all';

function renderDynamicJobs() {
    const gridContainer = document.getElementById('jobsCardsGrid');
    if (!gridContainer) return;

    gridContainer.innerHTML = ""; // কন্টেইনার ফাঁকা করা

    // ১. এপিআই ফাইল থেকে রিয়েল ডেটা অ্যারে নিয়ে আসা
    const allPostedJobsList = TechnicianFindJobAPI.getAllPostedJobs();

// ১. ফ্লাগ বা ভ্যারিয়েবল ডিক্লেয়ার করা
let isProfileMissing = false;

// ২. ফিল্টারিং লজিক
const filteredJobs = allPostedJobsList.filter(job => {
    let matchesCategory = (selectedCategory === 'all') || (job.categoryKey.toLowerCase() === selectedCategory.toLowerCase());
    let matchesArea = true;
    
    if (selectedAreaType === 'area' || selectedAreaType === 'my-area') {
        const techUpazila = typeof getTechnicianUpazilaFromUrl === 'function' ? getTechnicianUpazilaFromUrl() : (window.TechnicianFindJobAPI && window.TechnicianFindJobAPI.getTechnicianUpazilaFromUrl ? window.TechnicianFindJobAPI.getTechnicianUpazilaFromUrl() : null);
        
        if (!techUpazila) {
            isProfileMissing = true; // প্রোফাইল মিসিং হলে ফ্লাগ ট্রু হবে
            return false;
        }
        
        const jobUpazilaStr = (job.upazila || "").toLowerCase();
        const techUpazilaStr = techUpazila.toLowerCase();
        matchesArea = jobUpazilaStr.includes(techUpazilaStr);
    }

    return matchesCategory && matchesArea;
});

// ৩. মেসেজ বা কার্ড রেন্ডারিং হ্যান্ডেল করা
if (isProfileMissing) {
    // যদি প্রোফাইল বা উপজেলা না থাকে, শুধু এই মেসেজটিই দেখাবে এবং ফাংশন থামিয়ে দেবে
    gridContainer.innerHTML = `<p style="text-align: center; color: #d9534f; padding: 30px; font-size: 18px;">এরিয়া ভিত্তিক জব দেখার জন্য প্রথমে আপনার প্রোফাইল আপডেট করুন!</p>`;
    return;
}

// ৪. সাধারণ "কোনো কাজ পাওয়া যায়নি" মেসেজ চেক
if (filteredJobs.length === 0) {
    gridContainer.innerHTML = `<p style="text-align: center; color: #718093; padding: 30px; font-size: 18px;">কোনো কাজ পাওয়া যায়নি</p>`;
    return;
}
    // ৩. কোনো জব না থাকলে মেসেজ দেখানো
    if (filteredJobs.length === 0) {
        gridContainer.innerHTML = `<p style="text-align: center; color: #718093; padding: 30px; font-size: 16px;">কোনো কাজের পোস্ট পাওয়া যায়নি</p>`;
        return;
    }

    // ৪. যতগুলো জব পাওয়া গেছে, লুপ চালিয়ে ঠিক ততগুলো কার্ড রেন্ডার করা
    filteredJobs.forEach(job => {
        let logoMarkup = job.logo 
            ? `<img src="${job.logo}" alt="Logo">` 
            : `<img src="" alt="" style="display: none;">`;
const cardHTML = `
            <div class="full-width-profile-container">
                <div class="profile-row-item">
                    
                    <!-- বাম পাশের সেকশন: লোগো এবং নাম-লোকেশন -->
                    <div class="row-left-section">
                        <div class="row-circle-avatar">
                            ${logoMarkup}
                        </div>
                        <div class="row-name-location">
                            <h4 class="row-title">${job.name}</h4>
                                   <p class="row-location" style="display: inline-flex; align-items: center; gap: 5px; margin: 0; vertical-align: middle;">
                                <!-- এসভিজি আইকন -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: -1px;">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <!-- লোকেশন টেক্সট -->
                                <span style="line-height: 1;">${job.fixedLocation}</span>
                            </p>
                        </div>
                    </div>

                    <!-- মাঝের অংশ: ক্যাটেগরি, ইউনিট এবং ডেট-টাইম -->
                    <div class="row-middle-info">
                        <div class="category-wrapper">
                            <span class="category-svg-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                                </svg>
                            </span>
                            <span class="row-category">${job.categoryName}</span>
                            <span class="row-unit">&bull; ${job.unit}</span>
                        </div>
                        <span class="row-date-time">${job.dateTime}</span>
                    </div>
                    
                    <!-- ডান পাশের বাটন -->
                    <div class="row-right-action">
                        
                        <button class="row-details-link" onclick="goToPage('job-details-technician.html?jobId=${job.jobId}')">বিস্তারিত দেখুন</button>
                    </div>

                </div>
            </div>
        `;

        gridContainer.innerHTML += cardHTML;
    });
}

// পেজ লোড হওয়ার সাথে সাথে ফাংশনটি কল করার জন্য
document.addEventListener("DOMContentLoaded", () => {
    renderDynamicJobs();
});