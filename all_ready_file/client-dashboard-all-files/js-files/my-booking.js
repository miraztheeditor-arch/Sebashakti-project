window.addEventListener('pageshow', (event) => {
    // যদি ব্রাউজার ব্যাক বাটন বা হিস্ট্রি থেকে ক্যাশ পেজ লোড করে, তবে পেজ রিলোড করে ফ্রেশ ডেটা আনবে
    if (event.persisted) {
        window.location.reload();
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
    if (viewName === 'Booking History') {
        // Recent এবং Post History ট্যাব লুকাও, History ট্যাব দেখাও
        document.querySelectorAll('.recent-tab').forEach(btn => btn.style.display = 'none');
        document.querySelectorAll('.post-history-tab').forEach(btn => btn.style.display = 'none');
        document.querySelectorAll('.history-tab').forEach(btn => btn.style.display = 'inline-block');

        // History এর প্রথম ট্যাবটি ডিফল্টভাবে চালু করো
        document.querySelector('.history-tab').classList.add('active');
        document.getElementById('completed-jobs').classList.add('active');

    } else if (viewName === 'Post History') {
        // Recent এবং History ট্যাব লুকাও, Post History ট্যাব দেখাও
        document.querySelectorAll('.recent-tab').forEach(btn => btn.style.display = 'none');
        document.querySelectorAll('.history-tab').forEach(btn => btn.style.display = 'none');
        document.querySelectorAll('.post-history-tab').forEach(btn => btn.style.display = 'inline-block');

        // Post History এর প্রথম ট্যাবটি (ড্রাফট পোস্ট) ডিফল্টভাবে চালু করো
        document.querySelector('.post-history-tab').classList.add('active');
        document.getElementById('draft-posts').classList.add('active');

    } else {
        // Recent ট্যাব দেখাও, History এবং Post History ট্যাব লুকাও
        document.querySelectorAll('.recent-tab').forEach(btn => btn.style.display = 'inline-block');
        document.querySelectorAll('.history-tab').forEach(btn => btn.style.display = 'none');
        document.querySelectorAll('.post-history-tab').forEach(btn => btn.style.display = 'none');

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
    document.getElementById('main-title').innerText = "Recent Bookings";

    // ৪. ট্যাব আপডেট করুন
    selectTab('today-requests');
}
});

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const activeParam = urlParams.get('active');
    const tabParam = urlParams.get('tab');

    if (activeParam === 'post-history') {
        
        // ১. প্রথমে বাম পাশের সাইডবার থেকে "Post History" বাটনটি খুঁজে বের করে সরাসরি .click() করে দেওয়া
        const sideBtns = document.querySelectorAll('.nav-btn');
        if (sideBtns.length >= 3) {
            // সাইডবারের ৩ নম্বর বাটনটিতে (Post History) সরাসরি ক্লিক ট্রিগার করা
            sideBtns[3].click(); 
        }

        // ২. একটু ডিলে দিয়ে ভেতরের "ড্রাফট পোস্ট" ট্যাবের উপর ক্লিক ট্রিগার করা যাতে কন্টেন্ট ও ট্যাব নিখুঁতভাবে বসে যায়
        if (tabParam) {
            setTimeout(() => {
                const targetTabBtn = document.querySelector(`[onclick*="${tabParam}"]`);
                if (targetTabBtn) {
                    targetTabBtn.click(); // ভেতরের ট্যাবের ওপর সরাসরি ক্লিক
                }
            }, 50);
        }
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
        selectTab('ongoing-works');
    }
});

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
});function renderDraftPosts() {
    const drafts = getDraftJobsFromUrl(); 
    const draftContainer = document.getElementById('draft-posts'); 

    if (!draftContainer) return;

    if (drafts && drafts.length > 0) {
        let allCardsHTML = '';

        drafts.forEach(job => {
            let savedDate = job.savedAt ? new Date(job.savedAt).toLocaleDateString('bn-BD') : 'তারিখ নেই';
            let locationVal = job.currentLocation || 'সেট করা হয়নি';
            let categoryVal = job.workCategory || 'সেট করা হয়নি';
            let unitVal = job.unitCount || 'সেট করা হয়নি';
            let draftId = job.draftId;

            allCardsHTML += `
                <div class="draft-job-card" data-id="${draftId}">
                    <div class="draft-card-header">
                        <span class="draft-badge">Draft Job</span>
                        <span class="draft-date">সংরক্ষিত: <span class="date-value">${savedDate}</span></span>
                    </div>
                    
                    <div class="draft-info-list">
                        <div class="draft-info-item">
                            <span class="draft-label">লোকেশন:</span> <span class="draft-value">${locationVal}</span>
                        </div>
                        <div class="draft-info-item">
                            <span class="draft-label">ক্যাটাগরি:</span> <span class="draft-value">${categoryVal}</span>
                        </div>
                        <div class="draft-info-item">
                            <span class="draft-label">ইউনিট:</span> <span class="draft-value">${unitVal}</span>
                        </div>
                    </div>

                    <div class="draft-card-actions">
                        <button class="btn-complete" onclick="resumeDraft('${draftId}')">এডিট করুন</button>
                        <button class="btn-delete" onclick="deleteDraft('${draftId}')" title="ডিলিট করুন">ডিলিট</button>
                    </div>
                </div>
            `;
        });

        draftContainer.innerHTML = allCardsHTML;

    } else {
        // ড্রাফট না থাকলে সরাসরি কন্টেইনারের ভেতর এই সুন্দর মেসেজটি দেখাবে
        draftContainer.innerHTML = `
            <p style="text-align: center; color: #747d8c; padding: 30px; font-size: 15px; width: 100%;">
                কোনো ড্রাফট পোস্ট পাওয়া যায়নি!
            </p>
        `;
    }
}
// ৪. কাস্টম পপআপের মাধ্যমে ডিলিট হ্যান্ডেল করার লজিক
let pendingDeleteDraftId = null;

function deleteDraft(draftId) {
    pendingDeleteDraftId = draftId;
    const modal = document.getElementById('custom-delete-modal');
    if (modal) {
        modal.style.display = 'flex'; // পপআপ শো করবে
    }
}

// পপআপের ইভেন্ট হ্যান্ডলারগুলো একবারে বাইন্ড করা
document.addEventListener('DOMContentLoaded', () => {
    renderDraftPosts(); // পেজ লোড হলে রেন্ডার হবে

    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const modal = document.getElementById('custom-delete-modal');

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (pendingDeleteDraftId) {
                const success = deleteDraftJob(pendingDeleteDraftId); 
                if (success) {
                    renderDraftPosts(); 
                } else {
                    alert('ড্রাফট ডিলিট করা সম্ভব হয়নি!');
                }
            }
            closeDeleteModal();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeDeleteModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'custom-delete-modal') {
                closeDeleteModal();
            }
        });
    }
});

function closeDeleteModal() {
    const modal = document.getElementById('custom-delete-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    pendingDeleteDraftId = null;
}

function resumeDraft(draftId) {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id'); // বর্তমান ইউজারের আইডি

    if (!userId || !draftId) {
        alert('তথ্য পাওয়া যায়নি!');
        return;
    }

    // পোস্ট জব পেজের আসল ফাইলের নাম এখানে বসাবেন (যেমন: post-job.html)
    // আইডি এবং ড্রাফট আইডি দুটিই ইউআরএল-এর মাধ্যমে পাস করা হচ্ছে
    window.location.href = `post-jobs.html?id=${userId}&draftId=${draftId}`;
}

async function loadLiveJobsToUI(targetUserId) {
    try {
        // এপিআই থেকে শুধু ডেটা নিয়ে আসা হচ্ছে
        const response = JobAPI.getJobs(targetUserId);

        const container = document.getElementById('live-posts');
        if (!container) return;
        
        container.innerHTML = '';
        let hasJobs = false;

        if (response.success && response.postedJobs) {
            const postedJobs = response.postedJobs;

            for (let jobId in postedJobs) {
                hasJobs = true;
                const job = postedJobs[jobId];
                const dateObj = job.createdAt ? new Date(job.createdAt) : null;
const formattedDate = dateObj ? 
    String(dateObj.getDate()).padStart(2, '0') + '/' + 
    String(dateObj.getMonth() + 1).padStart(2, '0') + '/' + 
    dateObj.getFullYear() : '';
                
                // লোকালস্টোরেজ থেকে সঠিক লোকেশন ফিল্ড ব্যবহার করা
                const jobLocation = job.currentLocation || job.fixedLocation || 'লোকেশন পাওয়া যায়নি';
       
          const currentJobUserId = job.userId || targetUserId;



const userLogo = getProfileImageSync(currentJobUserId);

// নাম এবং লোকেশন ১০ ক্যারেক্টারের বেশি হলে কেটে ডট (...) বসানোর লজিক
const rawName = job.userName || 'অপরিচিত ব্যবহারকারী';
const shortName = rawName.length > 10 ? rawName.substring(0, 10) + '...' : rawName;


const shortLocation = jobLocation.length > 10 ? jobLocation.substring(0, 10) + '...' : jobLocation;
      
                const cardHTML = `
                    <div class="job-card-gold card-today-requests">
                        <div class="card-top-row">
                           <div class="logo-circle" style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 1.5px solid #dcdcdc; display: flex; align-items: center; justify-content: center; background-color: #f0f0f0; flex-shrink: 0;">
    <img src="${userLogo}" alt="Logo" style="width: 100%; height: 100%; object-fit: cover;">
</div>
                            <div class="card-meta">
                                <h4 class="client-name">${shortName}</h4>
                                <p class="location">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px; vertical-align: middle;">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    ${shortLocation}
                                </p>
                            </div>
                            
                            <div class="top-right-live-box">
                                <div class="live-top-row">
                                    <span class="live-green-dot"></span>
                                    <span class="live-text">Live</span>
                                </div>
                                <div class="live-date-row">
                                     &nbsp; ${formattedDate}
                                </div>
                            </div>
                        </div>

                        <h3 class="job-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;">
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.4 1.4a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                            </svg>
                            ${job.workCategory || 'এসি সার্ভিসিং'} - ইউনিট : ${job.unitCount || 1}
                        </h3>

                        <!-- বাটনে ক্লিক করলেই এই ফাংশন jobId এবং বর্তমান UID নিয়ে পেজ পরিবর্তন করবে -->
        <button class="btn-details btn-today-requests" onclick="goToPage('job-details-client.html?jobId=${job.jobId}')">
            বিস্তারিত দেখুন
        </button>
                    </div>
                `;

                container.innerHTML += cardHTML;
            }
        }

        if (!hasJobs) {
            container.innerHTML = '<p style="text-align: center; color: #777; padding: 20px;">কোনো লাইভ পোস্ট পাওয়া যায়নি।</p>';
        }

    } catch (error) {
        console.error("Error loading jobs:", error);
    }
}

// পেজ লোড হওয়ার পর ইউআরএল-এর আইডি দিয়ে এপিআই ফাইলের মাধ্যমে জব লোড করা
document.addEventListener("DOMContentLoaded", () => {
    // ১. ইউআরএল থেকে 'id' বা 'userId' প্যারামিটার সংগ্রহ করা (যেমন ?id=CLT-29231116)
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserid = urlParams.get('id') || urlParams.get('userId') || urlParams.get('phone');

    if (targetUserid) {
        // ২. সরাসরি এপিআই ফাংশন বা আপনার গেট জবস মেথডে আইডি পাস করে দেওয়া
        // উদাহরণস্বরূপ: loadLiveJobsToUI(targetUserid); অথবা আপনার ডেডিকেটেড ফাংশন
        if (typeof loadLiveJobsToUI === 'function') {
            loadLiveJobsToUI(targetUserid);
        } else if (typeof getJobs === 'function') {
            const result = getJobs(targetUserid);
            console.log("Fetched Jobs:", result);
        }
    } else {
        console.warn("ইউআরএল-এ কোনো ইউজার আইডি পাওয়া যায়নি!");
    }
});