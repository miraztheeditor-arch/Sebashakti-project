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

// ৪. কোন পেজে ক্লিক করেছে তার ওপর ভিত্তি করে বাটনগুলো শো/হাইড করা
    if (viewName === 'Job History') {
        // Job History দেখাও, বাকিগুলো লুকাল
        document.querySelectorAll('.recent-tab').forEach(btn => btn.style.display = 'none');
        document.querySelectorAll('.applied-tab').forEach(btn => btn.style.display = 'none');
        document.querySelectorAll('.history-tab').forEach(btn => btn.style.display = 'inline-block');

        // History এর প্রথম ট্যাবটি ডিফল্টভাবে চালু করা
        document.querySelector('.history-tab').classList.add('active');
        document.getElementById('completed-jobs').classList.add('active');

    } else if (viewName === 'Applied Job') {
        // Applied Job দেখাও, বাকিগুলো লুকাও
        document.querySelectorAll('.recent-tab').forEach(btn => btn.style.display = 'none');
        document.querySelectorAll('.history-tab').forEach(btn => btn.style.display = 'none');
        document.querySelectorAll('.applied-tab').forEach(btn => btn.style.display = 'inline-block');

        // Applied Job এর প্রথম ট্যাবটি (অপেক্ষমান আবেদন) ডিফল্টভাবে চালু করা
        document.querySelector('.applied-tab').classList.add('active');
        document.getElementById('accepted-applied').classList.add('active');

    } else {
        // Recent Job দেখাও, বাকিগুলো লুকাও
        document.querySelectorAll('.history-tab').forEach(btn => btn.style.display = 'none');
        document.querySelectorAll('.applied-tab').forEach(btn => btn.style.display = 'none');
        document.querySelectorAll('.recent-tab').forEach(btn => btn.style.display = 'inline-block');

        // Recent এর প্রথম ট্যাবটি ডিফল্টভাবে চালু করা
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

function formatOnlyDate(dateString) {
    if (!dateString) return "-";
    
    let monthsMap = {
        'জানুয়ারি': '01', 'ফেব্রুয়ারি': '02', 'মার্চ': '03', 'এপ্রিল': '04', 'মে': '05', 'জুন': '06',
        'জুলাই': '07', 'আগস্ট': '08', 'সেপ্টেম্বর': '09', 'অক্টোবর': '10', 'নভেম্বর': '11', 'ডিসেম্বর': '12',
        'January': '01', 'February': '02', 'March': '03', 'April': '04', 'May': '05', 'June': '06',
        'July': '07', 'August': '08', 'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };

    let day = "";
    let month = "09";
    let year = "2026";

    let numbers = dateString.match(/\d+/g);
    if (numbers && numbers.length > 0) {
        day = numbers[0].padStart(2, '0');
        
        for (let num of numbers) {
            if (num.length === 4) {
                year = num;
                break;
            }
        }
    }

    for (let key in monthsMap) {
        if (dateString.includes(key)) {
            month = monthsMap[key];
            break;
        }
    }

    if (dateString.includes('/') || dateString.includes('-')) {
        let parts = dateString.split(/[\/\-]/);
        if (parts.length >= 3) {
            day = parts[0].trim().padStart(2, '0');
            month = parts[1].trim().padStart(2, '0');
            year = parts[2].trim().substring(0, 4);
        }
    }

    if (day && month && year) {
        return `${day}/${month}/${year}`;
    }

    let d = new Date(dateString);
    if (!isNaN(d.getTime())) {
        let dd = String(d.getDate()).padStart(2, '0');
        let mm = String(d.getMonth() + 1).padStart(2, '0');
        let yy = d.getFullYear();
        return `${dd}/${mm}/${yy}`;
    }

    return dateString;
}

// লোকেশন ১০ ক্যারেক্টারের বেশি হলে থ্রি-ডট (...) দেওয়ার ফাংশন
function truncateLocation(loc, limit = 10) {
    if (!loc) return "-";
    if (loc.length > limit) {
        return loc.substring(0, limit) + "...";
    }
    return loc;
}

let pendingDeleteJobId = null;

function renderWishlistCards() {
    let jobsArray = TechnicianWishlistAPI.getWishlistJobs();
    
    let container = document.getElementById('today-requests'); 
    if (!container) return;

    container.innerHTML = ""; 

    if (jobsArray.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding:20px;'>কোনো উইশলিস্ট জব পাওয়া যায়নি!</p>";
        return;
    }

    jobsArray.forEach(job => {
        let formattedDate = formatOnlyDate(job.dateTime);
        let rawLocation = job.fixedLocation || job.location || "-";
        let shortLocation = truncateLocation(rawLocation, 10);

        let cardHTML = `
            <div class="job-card-gold card-today-requests">
                <div class="card-top-row">
                    <div class="logo-circle" style="overflow:hidden; display:flex; align-items:center; justify-content:center; background:#f0f0f0;">
    ${job.logo ? `<img src="${job.logo}" alt="Logo" style="width:100%; height:100%; object-fit:cover;">` : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`}
</div>
                    <div class="card-meta">
                        <h4 class="client-name">${job.name || "N/A"}</h4>
                        <p class="location" title="${rawLocation}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px; vertical-align: middle;">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            ${shortLocation}
                        </p>
                    </div>
                    <div class="top-right-live-box">
                        <div class="live-top-row">
                            <span class="liva-green-dot"></span>
                            <span class="live-text">Live</span>
                        </div>
                        <div class="live-date-row">
                            ${formattedDate}
                        </div>
                    </div>
                </div>

                <h3 class="job-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px; vertical-align: middle;">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                    </svg>
                    ${job.categoryName || "-"} - ${job.unit || "-"}
                </h3>

                <div class="wishlist-actions-row">
                    <button class="wishlist-btn-half wishlist-btn-delete" onclick="openDeleteModal('${job.jobId}')">Delete</button>
                    <button class="wishlist-btn-half wishlist-btn-details" onclick="goToPage('job-details-technician.html?jobId=${job.jobId}')">Details</button>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });

    ensureDeleteModalExists();
}

function ensureDeleteModalExists() {
    if (document.getElementById('custom-delete-modal')) return;

    let modalHTML = `
        <div id="custom-delete-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
            <div style="background:#fff; padding:25px; border-radius:10px; width:90%; max-width:320px; text-align:center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <h3 style="margin-bottom:10px; color:#333; font-size:18px;">জব ডিলিট কনফার্মেশন</h3>
                <p style="color:#666; font-size:14px; margin-bottom:20px;">আপনি কি নিশ্চিতভাবে এই জবটি উইশলিস্ট থেকে ডিলিট করতে চান?</p>
                <div style="display:flex; justify-content:space-between; gap:10px;">
                    <button onclick="closeDeleteModal()" style="flex:1; padding:10px; background:#ddd; border:none; border-radius:5px; cursor:pointer; font-weight:bold; color:#333;">বাতিল</button>
                    <button onclick="confirmDeleteJob()" style="flex:1; padding:10px; background:#e74c3c; border:none; border-radius:5px; cursor:pointer; font-weight:bold; color:#fff;">ডিলিট</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// গ্লোবাল ফাংশনসমূহ (goToPage ফাংশনটি যদি অন্য ফাইলে না পাওয়া যায়, তবে এখানে ফলব্যাক হিসেবে কাজ করবে)
if (typeof window.goToPage !== 'function') {
    window.goToPage = function(url) {
        window.location.href = url;
    };
}

// ফাংশনগুলোকে গ্লোবালি উইন্ডো অবজেক্টে বাইন্ড করা হলো যাতে কনসোলে আর Uncaught ReferenceError না আসে
window.openDeleteModal = function(jobId) {
    pendingDeleteJobId = jobId;
    let modal = document.getElementById('custom-delete-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
};

window.closeDeleteModal = function() {
    pendingDeleteJobId = null;
    let modal = document.getElementById('custom-delete-modal');
    if (modal) {
        modal.style.display = 'none';
    }
};

window.confirmDeleteJob = function() {
    if (pendingDeleteJobId) {
        let success = TechnicianWishlistAPI.removeWishlistJob(pendingDeleteJobId);
        if (success) {
            renderWishlistCards();
        }
    }
    closeDeleteModal();
};

document.addEventListener('DOMContentLoaded', () => {
    renderWishlistCards();
});

// ফাইন্ড জব পেজের আদলে উইশলিস্টের ডিটেইলস ফাংশন আপডেট করা হলো
window.viewJobDetails = function(jobId) {
    if (!jobId) {
        console.error("জব আইডি পাওয়া যায়নি!");
        return;
    }

    // ফাইন্ড জব পেজের মতো একই পেজে রিডায়রেক্ট করার জন্য goToPage বা window.location ব্যবহার করা
    if (typeof goToPage === 'function') {
        goToPage(`job-details-technician.html?jobId=${jobId}`);
    } else {
        window.location.href = `job-details-technician.html?jobId=${jobId}`;
    }
};

function renderAppliedProposalCards() {
    console.log("প্রপোজাল রেন্ডার ফাংশন কল হয়েছে!");

// এপিআই ফাইল থেকে ডেটা নিয়ে আসা (সেফ চেকসহ)
    const appliedProposals = (window.TechnicianApplyAPI && typeof window.TechnicianApplyAPI.getAppliedProposalsList === 'function') 
        ? window.TechnicianApplyAPI.getAppliedProposalsList() 
        : (typeof getAppliedProposalsList === 'function' ? getAppliedProposalsList() : {});
        
    console.log("প্রাপ্ত প্রপোজাল ডেটা:", appliedProposals);

    let cardsHTML = "";
    const proposalKeys = Object.keys(appliedProposals);



    // ১. প্রথমে সব কন্টেইনারের ভেতরের আগের ডেটা খালি করে নেওয়া
document.getElementById('pending-applied').innerHTML = '';
document.getElementById('accepted-applied').innerHTML = '';
document.getElementById('rejected-applied').innerHTML = '';



    // প্রপোজালগুলোর ওপর লুপ চালিয়ে কার্ড তৈরি করা
proposalKeys.forEach(jobId => {
    const proposal = appliedProposals[jobId] || {};
    
    // ক্লায়েন্টের তথ্য বিভিন্ন সম্ভাব্য প্রপার্টি থেকে খোঁজার ব্যবস্থা
    const client = proposal.clientIdentification || proposal.client || proposal.userInfo || {};
    
    // নাম, ছবি এবং ইউআইডি বের করার চেষ্টা
    const clientName = client.name || client.clientName || 'ক্লায়েন্টের নাম';
    const clientImg = client.profileImage || client.image || client.photo || '';
    const clientUid = client.userId || client.uid || client.id || '-';

    // proposal.isAccepted এর মান অনুযায়ী টেক্সট এবং শুধু টেক্সট কালার নির্ধারণ
    let liveText = "Pending";
    let textColor = "#3B82F6"; 
    let targetContainerId = "pending-applied"; // ডিফল্ট

    if (proposal.isAccepted === false || proposal.isAccepted === "false") {
        liveText = "Rejected";
        textColor = "#EF4444"; 
        targetContainerId = "rejected-applied"; 
    } else if (proposal.isAccepted === true || proposal.isAccepted === "true") {
        liveText = "Accepted";
        textColor = "#10B981"; 
        targetContainerId = "accepted-applied"; 
    }

    cardsHTML = `
        <div class="job-card-gold card-today-requests">
            <div class="card-top-row">
                <div class="logo-circle" style="overflow: hidden; position: relative; background: #ddd;">
                    ${clientImg ? `<img src="${clientImg}" alt="Logo" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` : '<span style="font-size: 10px; display: flex; align-items: center; justify-content: center; height: 100%;">Logo</span>'}
                </div>
                <div class="card-meta">
                    <h4 class="client-name">${clientName}</h4>
                </div>
                <div class="top-right-live-box">
                    <div class="live-top-row">
                        <span class="live-text" style="color: ${textColor}; font-weight: 600;">${liveText}</span>
                    </div>
                    <div class="live-date-row">
                         ${proposal.proposalDetails && proposal.proposalDetails.appliedAt ? proposal.proposalDetails.appliedAt.split('T')[0] : ''}
                    </div>
                </div>
            </div>
            
            <p id="clientUid" class="client-uid">UID: ${clientUid}</p>
            <h3 class="job-title" id="clientJobId">Job_Id: ${jobId}</h3>
            
            <div class="wishlist-actions-row">
                ${proposal.isAccepted === true || proposal.isAccepted === "true" 
        ? '<button class="wishlist-btn-half wishlist-btn-delete" disabled style="opacity: 0.5; cursor: not-allowed; pointer-events: none;">Delete</button>' 
        : `<button class="wishlist-btn-half wishlist-btn-delete" onclick="handleDeleteProposal('${jobId}')">Delete</button>`}
                <button class="wishlist-btn-half wishlist-btn-details" onclick="handleViewProposalDetails('${jobId}')">Details</button>
            </div>
        </div>
    `;
// নির্দিষ্ট কন্টেইনারে কার্ড যোগ করা এবং ক্যাটাগরি অনুযায়ী কাউন্ট বা চেক রাখা
    const targetContainer = document.getElementById(targetContainerId);
    if (targetContainer) {
        // যদি কন্টেইনারে আগে থেকেই আমাদের গ্রেডিয়েন্ট টেক্সট বা এম্পটি মেসেজ থাকে, তবে সেটি আগে ক্লিয়ার করে নেব
        if (targetContainer.innerHTML.includes("কোনো") || targetContainer.innerHTML.trim() === "") {
            targetContainer.innerHTML = "";
        }
        targetContainer.innerHTML += cardsHTML;
    }
});
// ৩. লুপ শেষ হওয়ার পর যে কন্টেইনারগুলোতে কোনো কার্ড বসেনি, সেগুলোতে এম্পটি টেক্সট বসানো
    const pendingContainer = document.getElementById('pending-applied');
    const acceptedContainer = document.getElementById('accepted-applied');
    const rejectedContainer = document.getElementById('rejected-applied');

    const emptyMsgStyle = "padding: 60px 20px; text-align: center; background: linear-gradient(135deg, #4f46e5, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; margin: 0;";
    const acceptedMsgStyle = "padding: 60px 20px; text-align: center; background: linear-gradient(135deg, #10b981, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; margin: 0;";
    const rejectedMsgStyle = "padding: 60px 20px; text-align: center; background: linear-gradient(135deg, #f59e0b, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; margin: 0;";

    if (pendingContainer && pendingContainer.innerHTML.trim() === "") {
        pendingContainer.innerHTML = `<p style="${emptyMsgStyle}">কোনো অপেক্ষমান আবেদন পাওয়া যায়নি!</p>`;
    }
    if (acceptedContainer && acceptedContainer.innerHTML.trim() === "") {
        acceptedContainer.innerHTML = `<p style="${acceptedMsgStyle}">কোনো গৃহীত আবেদন পাওয়া যায়নি!</p>`;
    }
    if (rejectedContainer && rejectedContainer.innerHTML.trim() === "") {
        rejectedContainer.innerHTML = `<p style="${rejectedMsgStyle}">কোনো বাতিলকৃত আবেদন পাওয়া যায়নি!</p>`;
    }
}

// পেজ পুরোপুরি লোড হওয়ার পর ফাংশনটি কল করা নিশ্চিত করা
document.addEventListener('DOMContentLoaded', () => {
    renderAppliedProposalCards();
});

function handleViewProposalDetails(jobId) {
    try {
        const appliedProposals = (typeof getAppliedProposalsList === 'function') ? getAppliedProposalsList() : {};
        const proposal = appliedProposals[jobId];

        if (!proposal) {
            console.error("এই জব আইডির কোনো প্রপোজাল পাওয়া যায়নি:", jobId);
            return;
        }

        console.log("ফুল প্রপোজাল ডেটা:", proposal);

        // ১. সরাসরি proposal.clientIdentification থেকে ক্লায়েন্টের ডেটা বের করা
        const clientIdent = proposal.clientIdentification || {};
        
        let clientName = clientIdent.name || 'N/A';
        let clientUid = clientIdent.userId || clientIdent.id || 'N/A';
        let clientImg = clientIdent.profileImage || clientIdent.logo || '';

        // যদি প্রোফাইল ছবি অবজেক্ট আকারে থাকে, তবে সেটির ভেতর থেকে স্ট্রিং বা ইউআরএল বের করা
        if (typeof clientImg === 'object' && clientImg !== null) {
            clientImg = clientImg.url || clientImg.data || clientImg.src || '';
        }

        // যদি userMasterData থেকেও ক্রস-চেক করতে হয়
        const userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        if ((clientName === 'N/A' || !clientImg) && clientUid !== 'N/A' && userMasterData[clientUid]) {
            const clientData = userMasterData[clientUid];
            clientName = clientData.fullName || clientData.name || clientName;
            clientUid = clientData.userId || clientData.id || clientUid;
            if (!clientImg) {
                clientImg = clientData.profileImage || clientData.logo || '';
            }
        }

        // ২. প্রপোজাল ডিটেইলস ডেটা এক্সট্রাক্ট করা
        const details = proposal.proposalDetails || proposal;

        // প্রপোজালের ভেতর থেকে জব ডিটেইলস ডেটা এক্সট্রাক্ট করা
        const jobData = proposal.jobDetails || proposal.job || {};
        
        // ডেট ফরম্যাট করা
        let rawDate = details.appliedAt || proposal.appliedAt || details.date;
        let formattedDate = 'N/A';
        if (rawDate) {
            let d = new Date(rawDate);
            if (!isNaN(d.getTime())) {
                formattedDate = d.toLocaleString('bn-BD', { 
                    year: 'numeric', month: 'long', day: 'numeric', 
                    hour: 'numeric', minute: 'numeric', hour12: true 
                });
            } else {
                formattedDate = rawDate;
            }
        }

        // মজুরী বা সার্ভিস চার্জ
        const budgetVal = details.laborCost || details.budget || details.serviceCharge || proposal.budget;
        const budget = budgetVal ? budgetVal + ' ৳' : 'N/A';

        // মালামাল কেনার খরচ
        const materialCost = details.materialResponsibility || details.materialCost || 'ক্লাইয়েন্ট নিজে মালামাল কিনে দিবে';

        // ক্যান্সেলেশন বা ভিজিটিং ফি
        const cancellationFeeVal = details.cancellationFee || details.visitingFee || details.fee;
        const cancellationFee = cancellationFeeVal ? cancellationFeeVal + ' ৳' : 'N/A';

        // কাজ শেষ করতে কত সময় লাগবে
        const timeRequired = details.estimatedTime || details.timeRequired || details.completionTime || 'N/A';

        // কভার লেটার বা নোট
        const coverLetter = details.coverLetter || details.note || proposal.coverLetter || 'কোনো নোট নেই';

        // এখন এখান থেকে আপনার ৬টি ফিল্ডের ডেটা খুব সহজেই ধরতে পারবেন:
        const createdAt = jobData.dateTime || jobData.createdAt || '';
        const currentLocation = jobData.currentLocation || '';
        const fixedLocation = jobData.fixedLocation || '';
        const workCategory = jobData.categoryName || '';
        const unitCount = jobData.unit || '';
        const problemDetails = jobData.problemDetails || '';

        // ৩. মোডালের হেডারে ডেটা বসানো
        document.getElementById('modalClientName').innerText = clientName;
        document.getElementById('modalClientUid').innerText = 'UID: ' + clientUid;

        const imgElement = document.getElementById('modalClientImage');
        if (imgElement) {
            if (clientImg && typeof clientImg === 'string' && clientImg.trim() !== '') {
                imgElement.src = clientImg;
                imgElement.style.display = 'block';
            } else {
                imgElement.style.display = 'none';
            }
        }

        // ৪. মোডালের ইনপুট ফিল্ডগুলোতে মান বসানো
        document.getElementById('modalJobId').value = jobId;
        document.getElementById('modalAppliedTime').value = formattedDate;
        document.getElementById('modalLaborCost').value = budget;
        document.getElementById('modalMaterialCost').value = materialCost;
        document.getElementById('modalCancellationFee').value = cancellationFee;
        document.getElementById('modalEstimatedTime').value = timeRequired;
        document.getElementById('modalCoverLetter').value = coverLetter;
        // এলিমেন্টগুলো ধরে রাখা এবং খালি বা null ভ্যালু সেট করা
        document.getElementById('modalCreatedAt').value = createdAt;
        document.getElementById('modalCurrentLocation').value = currentLocation;
        document.getElementById('modalFixedLocation').value = fixedLocation;
        document.getElementById('modalWorkCategory').value = workCategory;
        document.getElementById('modalUnitCount').value = unitCount;
        document.getElementById('modalProblemDetails').value = problemDetails;

        // স্ট্যাটাস মেসেজ এবং হেডার ডায়নামিক করা (নিরাপদ পদ্ধতি)
setTimeout(() => {
    const statusContainer = document.getElementById('proposalStatusContainer');

    if (statusContainer) {
        let isAcceptedVal = proposal ? proposal.isAccepted : "";

        if (isAcceptedVal === false || isAcceptedVal === "false") {
            statusContainer.style.backgroundColor = "#FEE2E2"; // হালকা লাল ব্যাকগ্রাউন্ড
            statusContainer.style.color = "#991B1B";
            statusContainer.innerHTML = `<i class="fas fa-info-circle"></i> দুঃখিত, ক্লায়েন্ট এই আবেদনটি বাতিল করেছেন।`;
        } else if (isAcceptedVal === true || isAcceptedVal === "true") {
            statusContainer.style.backgroundColor = "#D1FAE5"; // হালকা সবুজ ব্যাকগ্রাউন্ড
            statusContainer.style.color = "#065F46";
            statusContainer.innerHTML = `<i class="fas fa-check-circle"></i> স্বাগতম! আপনার আবেদনটি এক্সেপ্ট করা হয়েছে।`;
        } else {
            statusContainer.style.backgroundColor = "#E3F2FD"; // হালকা নীল ব্যাকগ্রাউন্ড
            statusContainer.style.color = "#0D47A1";
            statusContainer.innerHTML = `<i class="fas fa-info-circle"></i> আপনি এই জবটিতে এপ্লাই করেছেন এবং এটি এখনও পর্যন্ত পেন্ডিং এ রয়েছে।`;
        }
    }
}, 50);

        // ৫. মোডাল ওপেন করা
        const modal = document.getElementById('applicantDetailsModal');
        if (modal) {
            modal.style.display = 'flex';
        }

    } catch (error) {
        console.error("ডিটেইলস লোড করতে সমস্যা হয়েছে:", error);
    }
}
// মোডাল বন্ধ করার ফাংশন
function closeDetailsModal() {
    const modal = document.getElementById('applicantDetailsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}



// Main File: বাটন ক্লিক করলে কনফার্ম মোডাল ওপেন হবে
function handleDeleteProposal(jobId) {
    pendingDeleteJobId = jobId;
    const confirmModal = document.getElementById('customConfirmModal');
    if (confirmModal) {
        confirmModal.style.display = 'flex';
    }
}

// মোডালের 'বাতিল' বা 'না' বাটনে ক্লিক করলে মোডাল বন্ধ হবে
function closeConfirmModal() {
    const confirmModal = document.getElementById('customConfirmModal');
    if (confirmModal) {
        confirmModal.style.display = 'none';
    }
    pendingDeleteJobId = null;
}

// ইভেন্ট লিসেনারগুলো পেজ লোড হওয়ার সময় বা স্ক্রিপ্টের নিচে যুক্ত করে দিন
document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('confirmYesBtn');
    const noBtn = document.getElementById('confirmNoBtn');

    if (yesBtn) {
        yesBtn.addEventListener('click', () => {
            if (pendingDeleteJobId) {
                // এপিআই ফাইল বা এপিআই ফাংশন কল করা
                const response = apiDeleteProposal(pendingDeleteJobId);

                if (response.success) {
                    console.log(response.message);
                    
                    if (typeof renderAppliedProposalCards === 'function') {
                        renderAppliedProposalCards();
                    } else {
                        location.reload();
                    }

                    if (typeof showcast === 'function') {
                        showcast(response.message, "success");
                    }
                } else {
                    alert(response.message);
                }
            }
            closeConfirmModal();
        });
    }

    if (noBtn) {
        noBtn.addEventListener('click', () => {
            closeConfirmModal();
        });
    }
});

function renderRunningJobCards() {
    // ১. রানিং জবসের ডেটা ফেচ করা
    const runningJobs = getRunningJobsList();
    const jobKeys = Object.keys(runningJobs);

    // ২. কন্টেইনার সিলেক্ট করা (আপনার এইচটিএমএলের id অনুযায়ী 'ongoing-works')
    const container = document.getElementById('ongoing-works');
    if (!container) return;

    container.innerHTML = '';

    // ৩. যদি কোনো রানিং জব না থাকে
    if (jobKeys.length === 0) {
        container.innerHTML = `<p style="padding: 20px; text-align: center;">কোনো রানিং জব পাওয়া যায়নি!</p>`;
        return;
    }

    // ৪. প্রতিটা জবের জন্য লুপ চালিয়ে কার্ড তৈরি করা
    jobKeys.forEach(jobId => {
        const job = runningJobs[jobId] || {};
        
        // ক্লায়েন্ট ইনফো এক্সট্রাক্ট করা
        const client = job.clientIdentification || job.client || job.userInfo || {};
        const clientName = client.name || client.clientName || 'ক্লায়েন্টের নাম';
        const clientImg = client.profileImage || client.client.image || client.photo || '';
        
        // প্রপোজাল বা জবের ডিটেইলস থেকে লোকেশন ও ক্যাটাগরি নেওয়া
        const locationText = job.jobDetails?.fixedLocation || job.location || 'মিরপুর, ঢাকা';
        // ক্যাটাগরি নেম এবং ইউনিট একসাথে যুক্ত করার লজিক
        const categoryName = job.jobDetails?.categoryName || job.categoryName || 'এসি সার্ভিসিং-';
        const unitName = job.jobDetails?.unit || job.unit || 'ইউনিট ৩';

        // যদি ইউনিট থাকে তাহলে হাইফেন বা স্পেস দিয়ে ক্যাটাগরির সাথে জোড়া লাগানো, না থাকলে শুধু ক্যাটাগরি
        const jobTitleText = unitName ? `${categoryName} - ${unitName}` : categoryName;
        
        // এক্সেপ্ট করার ডেট (Accepted Details থেকে)
        const acceptedDate = job.acceptedDetails?.date || '';

        // ৫. আপনার দেওয়া কার্ডের স্ট্রাকচার অনুযায়ী HTML টেমপ্লেট
        let cardHTML = `
           <div class="job-card-gold card-ongoing-works">
        <div class="card-top-row">
            <div class="logo-circle" style="overflow: hidden; position: relative; background: #ddd;">
                ${clientImg ? `<img src="${clientImg}" alt="Logo" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` : `<span></span>`}
            </div>
            
            <!-- card-meta এর ভেতরে নাম এবং লোকেশন একসাথে রাখা হলো -->
            <div class="card-meta">
                <h4 class="client-name">${clientName}</h4>
                <p class="location" style="margin: 0;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 3px; vertical-align: middle;">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    ${locationText}
                </p>
            </div>

            <div class="top-right-live-box">
                <div class="live-top-row">
                    <span class="live-green-dot"></span>
                    <span class="live-text">Running</span>
                </div>
                <div class="live-date-row">
                     ${acceptedDate}
                </div>
            </div>
        </div>

        <h3 class="job-title" style="margin-top: 15px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
            ${jobTitleText}
        </h3>

        <div class="wishlist-actions-row">
            <button class="btn-details btn-ongoing-works" onclick="handleViewRunningJobDetails('${jobId}')">বিস্তারিত দেখুন</button>
        </div>
    </div>
`;
        container.innerHTML += cardHTML;
    });
}

// পেজ লোড হওয়ার পর বা ট্যাব টগল করার সময় ফাংশনটি কল করুন
document.addEventListener('DOMContentLoaded', () => {
    renderRunningJobCards();
});