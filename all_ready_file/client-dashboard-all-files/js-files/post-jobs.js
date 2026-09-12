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

// অন্যান্য সিলেক্ট করলে ড্রপডাউন লুকিয়ে ইনপুট দেখানোর ফাংশন
function toggleField(selectObj) {
    const select = selectObj;
    const customContainer = document.getElementById('customInputContainer');
    const customInput = document.getElementById('customWorkInput');

    if (select.value === "other") {
        select.classList.add('hidden');
        customContainer.classList.remove('hidden');
       
        customInput.focus();
    }
}

// ভুল করে অন্যান্য সিলেক্ট করলে আবার ড্রপডাউনে ফিরে যাওয়ার ফাংশন
function resetToDropdown() {
    const select = document.getElementById('workCategory');
    const customContainer = document.getElementById('customInputContainer');
    const customInput = document.getElementById('customWorkInput');

    // ইনপুট ক্লিয়ার করা ও রিকোয়ারড হঠানো
    customInput.value = "";
    customInput.removeAttribute('required');

    // ইনপুট লুকিয়ে ড্রপডাউন আবার ফিরিয়ে আনা এবং ডিফল্ট সিলেক্ট রিসেট করা
    customContainer.classList.add('hidden');
    select.classList.remove('hidden');
    select.value = ""; // আবার ডিফল্ট 'কাজ সিলেক্ট করুন' এ চলে যাবে
}

function saveAsDraft() {
    // ইউআরএল থেকে বা গ্লোবাল ভেরিয়েবল থেকে ইউজার আইডি নেওয়া
    const urlParams = new URLSearchParams(window.location.search);
    const userId = typeof currentUserId !== 'undefined' ? currentUserId : urlParams.get('id');

    if (!userId) {
        showToast("ইউজার আইডি পাওয়া যায়নি!", "error");
        return;
    }

    // ১. বর্তমান লোকেশন তোলা
    const currentLocationEl = document.getElementById('currentLocation');
    const currentLocationVal = currentLocationEl ? currentLocationEl.value.trim() : "";

    // ২. কাজের ক্যাটাগরি তোলা (ড্রপডাউন অথবা কাস্টম ইনপুট থেকে, আপনার ফর্মের গঠন অনুযায়ী)
    const workCategoryEl = document.getElementById('workCategory');
    let workCategoryVal = workCategoryEl ? workCategoryEl.value : "";
    
    // যদি 'other' সিলেক্ট করা থাকে এবং কাস্টম ইনপুটে কিছু লেখা হয়
    if (workCategoryVal === 'other') {
        const customInputEl = document.getElementById('customWorkInput');
        if (customInputEl && customInputEl.value.trim() !== "") {
            workCategoryVal = customInputEl.value.trim();
        }
    }
    // অথবা যদি আপনার কোডে 'finalCategory' গ্লোবাল ভেরিয়েবল থাকে সেটিও ব্যবহার করতে পারেন
    if (typeof finalCategory !== 'undefined' && finalCategory) {
        workCategoryVal = finalCategory;
    }

    // ৩. ইউনিট কাউন্ট তোলা
    const unitCountEl = document.getElementById('unitCount');
    const unitCountVal = unitCountEl ? Number(unitCountEl.value) : 1;

    // ৪. সমস্যার বিস্তারিত তোলা
    const problemDetailsEl = document.getElementById('problemDetails');
    const problemDetailsVal = problemDetailsEl ? problemDetailsEl.value.trim() : "";

    // ইউআরএল থেকে draftId চেক করা (যদি এডিট মোড হয় তবে ড্রাফট আইডি পাওয়া যাবে, নতুন পোস্ট হলে থাকবে না)
    const urlParamsForDraft = new URLSearchParams(window.location.search);
    const existingDraftId = urlParamsForDraft.get('draftId');

    // ড্রাফট পে-লোড অবজেক্ট তৈরি
    const draftData = {
        // যদি ইউআরএল-এ draftId থাকে সেটাই বসবে, না থাকলে নতুন তৈরি হবে
        draftId: existingDraftId ? existingDraftId : ('draft_' + Date.now()),
        currentLocation: currentLocationVal,
        workCategory: workCategoryVal,
        unitCount: isNaN(unitCountVal) ? 1 : unitCountVal,
        problemDetails: problemDetailsVal
    };

    try {
        // JobAPI-এর মাধ্যমে ড্রাফট সেভ ও লিমিট চেক করা
        const response = JobAPI.saveDraftJob(userId, draftData);

        // সফল টোস্ট দেখানো
        showToast(response.message, "success");

        // ১.৫ সেকেন্ড পর ড্যাশবোর্ডে রিডাইরেক্ট করা
        setTimeout(() => {
            window.location.href = `client-dashboard.html?id=${userId}`;
        }, 1500);

    } catch (error) {
        // ড্রাফট ১০টি পূর্ণ হয়ে গেলে বা অন্য কোনো সমস্যা হলে টোস্ট এলার্ট দেখানো
        showToast(error.message, "error");
    }
}
// ১. আকর্ষণীয় ও কালারফুল টোস্ট ফাংশন (উপরিভাগে দেখানোর জন্য)
function showToast(message, type = 'error') {
    let toast = document.getElementById('custom-toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'custom-toast-notification';
        toast.style.position = 'fixed';
        toast.style.top = '25px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        toast.style.padding = '14px 28px';
        toast.style.borderRadius = '8px';
        toast.style.zIndex = '99999';
        toast.style.fontSize = '15px';
        toast.style.fontWeight = '500';
        toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        toast.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        toast.style.opacity = '0';
        document.body.appendChild(toast);
    }
    
    if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #10B981, #059669)';
        toast.style.color = '#ffffff';
    } else {
        toast.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
        toast.style.color = '#ffffff';
    }
    
    toast.innerText = message;
    
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
    }, 3500);
}// ফর্ম সাবমিট ইভেন্ট লিসেনার ও ভ্যালিডেশন চেক
const postJobForm = document.getElementById('postJobForm');
if (postJobForm) {
    postJobForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // ব্রাউজারের ডিফল্ট সাবমিট আটকে দেওয়া

        // ১. বর্তমান লোকেশন চেক
        const currentLocationInput = document.getElementById('currentLocation');
        if (currentLocationInput) {
            const locationValue = currentLocationInput.value.trim();
            if (!locationValue) {
                showToast("⚠️ দয়া করে আপনার বর্তমান লোকেশন লিখুন!", "error"); 
                currentLocationInput.focus();
                return; 
            }
        }

        // ২. ওয়ার্ক ক্যাটাগরি (ড্রপডাউন বা কাস্টম ইনপুট) চেক
        const workCategorySelect = document.getElementById('workCategory');
        const customInputContainer = document.getElementById('customInputContainer');
        const customWorkInput = document.getElementById('customWorkInput');
        
        let finalCategory = "";

        if (workCategorySelect) {
            const selectedCategory = workCategorySelect.value;

            if (!selectedCategory || selectedCategory === "") {
                showToast("⚠️ দয়া করে কাজের ক্যাটাগরি সিলেক্ট করুন!", "error");
                workCategorySelect.focus();
                return;
            }

            if (selectedCategory === "other") {
                if (customInputContainer && !customInputContainer.classList.contains('hidden')) {
                    const customValue = customWorkInput ? customWorkInput.value.trim() : "";
                    if (!customValue) {
                        showToast("⚠️ দয়া করে আপনার কাজের নাম নিজে লিখুন!", "error");
                        if (customWorkInput) customWorkInput.focus();
                        return;
                    }
                    finalCategory = customValue; 
                }
            } else {
                finalCategory = selectedCategory; 
            }
        }

        // ৩. ইউনিট কাউন্ট চেক
        const unitCountInput = document.getElementById('unitCount');
        let unitValue = 1;
        if (unitCountInput) {
            unitValue = unitCountInput.value.trim();
            if (!unitValue || Number(unitValue) <= 0) {
                showToast("⚠️ ইউনিটের সংখ্যা কমপক্ষে ১ বা তার বেশি হতে হবে!", "error");
                unitCountInput.focus();
                return;
            }

            // সর্বোচ্চ লিমিট চেক (যেমন ১০ এর বেশি হতে পারবে না)
        if (Number(unitValue) > 10) {
            showToast("⚠️ ইউনিটের সংখ্যা ১০ এর বেশি হতে পারবে না!", "error");
            unitCountInput.focus();
            return;
        }
        }

        // ৪. সমস্যার বিস্তারিত ও মিনিমাম ক্যারেক্টার চেক
        const problemDetailsInput = document.getElementById('problemDetails');
        let detailsValue = "";
        if (problemDetailsInput) {
            detailsValue = problemDetailsInput.value.trim();
            const minLength = 20;

            if (!detailsValue) {
                showToast("⚠️ দয়া করে সমস্যার বিস্তারিত লিখুন!", "error");
                problemDetailsInput.focus();
                return;
            }

            if (detailsValue.length < minLength) {
                showToast(`⚠️ সমস্যার বিস্তারিত অন্তত ${minLength} অক্ষরের হতে হবে!`, "error");
                problemDetailsInput.focus();
                return;
            }
        }

        // ৫. ইউজার আইডি সংগ্রহ (URL বা SessionStorage থেকে)
        const urlParams = new URLSearchParams(window.location.search);
        const currentUserId = urlParams.get('id') || sessionStorage.getItem('liveUserId');

        if (!currentUserId) {
            showToast("❌ ইউজার আইডি পাওয়া যায়নি! দয়া করে আবার লগইন করুন।", "error");
            return;
        }

        // ৬. ফর্মের সমস্ত ডাটা একত্রিত করা
        const jobPayload = {
            currentLocation: currentLocationInput.value.trim(),
            workCategory: finalCategory,
            unitCount: Number(unitValue),
            problemDetails: detailsValue
        };

    try {
    // ১. সার্ভারে পাঠানোর আগে লোকালস্টোরেজ থেকে সরাসরি প্রোফাইল চেক করে নেওয়া (যাতে অপ্রয়োজনীয় লোডিং টোস্ট না ওঠে)
    let masterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
    let foundUserKey = masterData[currentUserId] ? currentUserId : null;
    if (!foundUserKey) {
        for (let key in masterData) {
            if (masterData[key].userId === currentUserId || key === currentUserId) {
                foundUserKey = key;
                break;
            }
        }
    }

    // যদি প্রোফাইল অসম্পূর্ণ থাকে, তবে এপিআই কল করার আগেই সরাসরি মোডাল দেখাবে এবং থেমে যাবে
    if (!foundUserKey || !masterData[foundUserKey].profileSection || !masterData[foundUserKey].profileSection.nidSection) {
        showProfileIncompleteModal(currentUserId);
        return; // এখানেই থেমে যাবে, কোনো সাকসেস বা লোডিং টোস্ট আসবে না!
    }

    // ২. প্রোফাইল ঠিক থাকলে এবার লোডিং টোস্ট ও এপিআই কল হবে
    showToast("⏳ কাজটি পোস্ট করা হচ্ছে...", "success");

  // ২. প্রোফাইল ঠিক থাকলে এবার এপিআই কল হবে
    const response = await JobAPI.saveJob(currentUserId, jobPayload);

    // মোডালের জন্য ডাটা প্রস্তুত করা (মাস্টার ডাটা থেকে নাম এবং এপিআই থেকে পাওয়া jobId সহ)
    const successJobData = {
        jobId: response.jobId, // এপিআই থেকে আসা ইউনিক আইডি
        userName: masterData[foundUserKey].name || masterData[foundUserKey].userName || "ব্যবহারকারী", // মাস্টার ডাটা থেকে ইউজারের নাম
        currentLocation: jobPayload.currentLocation,
        workCategory: jobPayload.workCategory,
        unitCount: jobPayload.unitCount
    };

    showJobSuccessModal(successJobData, currentUserId);
    postJobForm.reset();

    // পেজের ইউআরএল-এ draftId আছে কি না তা চেক করা
    const urlParamsForDelete = new URLSearchParams(window.location.search);
    const activeDraftId = urlParamsForDelete.get('draftId');
    
    // যদি সত্যি সত্যি draftId থাকে, তবেই কেবল ডিলিট ফাংশন কল হবে
    if (activeDraftId && typeof deleteDraftJob === 'function') {
        deleteDraftJob(activeDraftId);
    }

} catch (error) {
    console.error("Job Submit Error:", error);
    showToast("❌ " + (error.message || "কাজটি সেভ করতে সমস্যা হয়েছে!"), "error");
}
    });
}
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

// পেজ লোড হওয়ার পর বা এপিআই রেডি হলে এই কোডটি রান করুন
document.addEventListener("DOMContentLoaded", function() {
    if (typeof UserAPI !== 'undefined' && UserAPI.getUserNameViaApi) {
        // এপিআই থেকে নাম এনে ইনপুটের ভ্যালুতে বসিয়ে দেওয়া
        const fetchedName = UserAPI.getUserNameViaApi();
        const nameInput = document.getElementById('userName');
        
        if (nameInput && fetchedName) {
            nameInput.value = fetchedName;
        }
    }

    // ১. এপিআই থেকে ইউজারের লোকেশন এনে ফিক্সড লোকেশন ইনপুটে বসানো
const urlParams = new URLSearchParams(window.location.search);
const currentUserId = urlParams.get('id') || sessionStorage.getItem('liveUserId');

if (currentUserId && typeof UserAPI !== 'undefined' && UserAPI.getUserLocationViaApi) {
    const locationResponse = UserAPI.getUserLocationViaApi(currentUserId);
    
    if (locationResponse && locationResponse.success) {
        const upazila = locationResponse.upazila || '';
        const district = locationResponse.district || '';
        
        // ফরম্যাট তৈরি: প্রথমে উপজেলা, কমা, তারপর জেলা (যেমন: মিরপুর, ঢাকা)
        let formattedLocation = '';
        if (upazila && district) {
            formattedLocation = `${upazila}, ${district}`;
        } else {
            formattedLocation = upazila || district; 
        }
        
        // ফিক্সড লোকেশন ইনপুট ফিল্ডে বসিয়ে দেওয়া
        const fixedLocationInput = document.getElementById('fixedLocation');
        if (fixedLocationInput && formattedLocation) {
            fixedLocationInput.value = formattedLocation;
        } else {
            // ফিক্সড লোকেশন ইনপুট ফিল্ডে বসিয়ে দেওয়া
const fixedLocationInput = document.getElementById('fixedLocation');
if (fixedLocationInput) {
    if (formattedLocation) {
        // এপিআই থেকে সফলভাবে ডেটা আসলে ইউজারের লোকেশন বসবে
        fixedLocationInput.value = formattedLocation;
    } else {
        // সার্ভার থেকে ডেটা না পেলে বা ফেল করলে এটি দেখাবে
        fixedLocationInput.value = "লোকেশন পাওয়া যায়নি";
    }
}
        }
    }
}
});

// কাস্টম মোডাল তৈরি ও দেখানোর ফাংশন (প্রোফাইল অসম্পূর্ণ থাকলে এটি কল হবে)
function showProfileIncompleteModal(currentUserId) {
    // যদি আগে থেকেই কোনো মোডাল থাকে তা রিমूव করে দেওয়া
    let existingModal = document.getElementById('custom-profile-modal');
    if (existingModal) existingModal.remove();

    // মোডালের মূল কন্টেইনার
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'custom-profile-modal';
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.zIndex = '999999';
    modalOverlay.style.backdropFilter = 'blur(4px)';

    // মোডাল বক্স
    const modalBox = document.createElement('div');
    modalBox.style.background = '#ffffff';
    modalBox.style.padding = '30px';
    modalBox.style.borderRadius = '16px';
    modalBox.style.maxWidth = '400px';
    modalBox.style.width = '90%';
    modalBox.style.textAlign = 'center';
    modalBox.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    modalBox.style.animation = 'modalScaleIn 0.3s ease-out';

    // আইকন বা সতর্কতা হেডিং
    modalBox.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
        <h3 style="margin-bottom: 12px; color: #1F2937; font-size: 20px; font-weight: 600;">প্রোফাইল অসম্পূর্ণ!</h3>
        <p style="color: #4B5563; font-size: 14px; line-height: 1.5; margin-bottom: 25px;">
            কাজ পোস্ট করার আগে এনআইডি সহ অন্যান্য তথ্য দিয়ে আপনার প্রোফাইল আপডেট করুন।
        </p>
    `;

    // বাটনগুলোর কন্টেইনার
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '12px';
    btnContainer.style.justifyContent = 'center';

    // ১. "এখনই করব" বাটন
    const btnNow = document.createElement('button');
    btnNow.innerText = "এখনই করব";
    btnNow.style.flex = '1';
    btnNow.style.padding = '12px 16px';
    btnNow.style.backgroundColor = '#2563EB'; // আকর্ষণীয় ব্লু কালার
    btnNow.style.color = '#ffffff';
    btnNow.style.border = 'none';
    btnNow.style.borderRadius = '8px';
    btnNow.style.fontSize = '14px';
    btnNow.style.fontWeight = '500';
    btnNow.style.cursor = 'pointer';
    btnNow.style.transition = 'background 0.2s';

    btnNow.onmouseover = () => btnNow.style.backgroundColor = '#1D4ED8';
    btnNow.onmouseout = () => btnNow.style.backgroundColor = '#2563EB';

    btnNow.onclick = function() {
        // প্রোফাইল এডিট পেজে রিডাইরেক্ট করা (আইডি সহ)
        window.location.href = `profile-edit-client.html?id=${currentUserId}`; // আপনার প্রোফাইল পেজের সঠিক নাম এখানে বসিয়ে দেবেন
    };

    // ২. "পরে করব" বাটন
    const btnLater = document.createElement('button');
    btnLater.innerText = "পরে করব";
    btnLater.style.flex = '1';
    btnLater.style.padding = '12px 16px';
    btnLater.style.backgroundColor = '#E5E7EB'; // সফট গ্রে কালার
    btnLater.style.color = '#374151';
    btnLater.style.border = 'none';
    btnLater.style.borderRadius = '8px';
    btnLater.style.fontSize = '14px';
    btnLater.style.fontWeight = '500';
    btnLater.style.cursor = 'pointer';
    btnLater.style.transition = 'background 0.2s';

    btnLater.onmouseover = () => btnLater.style.backgroundColor = '#D1D5DB';
    btnLater.onmouseout = () => btnLater.style.backgroundColor = '#E5E7EB';

    btnLater.onclick = function() {
        // মোডালটি সরিয়ে দেওয়া এবং পেজ আগের মতো রাখা
        modalOverlay.remove();
    };

    // বাটনগুলো মোজালে যুক্ত করা
    btnContainer.appendChild(btnLater);
    btnContainer.appendChild(btnNow);
    modalBox.appendChild(btnContainer);
    modalOverlay.appendChild(modalBox);
    document.body.appendChild(modalOverlay);
}

// ব্রাউজারের ব্যাক বাটন বা হিস্ট্রি থেকে পেজে ফিরে আসলে পেজ অটোমেটিক রিলোড করার জন্য
window.addEventListener('pageshow', function(event) {
    // যদি পেজটি ব্রাউজারের ক্যাশ থেকে লোড হয়ে থাকে (যেমন ব্যাক করে ফিরে আসা)
    if (event.persisted) {
        window.location.reload();
    }
});
function showJobSuccessModal(jobData, currentUserId) {
    let existingModal = document.getElementById('job-success-modal');
    if (existingModal) existingModal.remove();

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'job-success-modal';
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.zIndex = '999999';
    modalOverlay.style.backdropFilter = 'blur(5px)';

    const modalBox = document.createElement('div');
    modalBox.style.background = '#ffffff';
    modalBox.style.padding = '30px 25px';
    modalBox.style.borderRadius = '20px';
    modalBox.style.maxWidth = '450px';
    modalBox.style.width = '90%';
    modalBox.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
    modalBox.style.animation = 'modalScaleIn 0.3s ease-out';

    modalBox.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="width: 55px; height: 55px; background: #D1FAE5; color: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; margin: 0 auto 12px auto;">✓</div>
            <h3 style="color: #1F2937; font-size: 20px; font-weight: 700; margin-bottom: 6px;">জব সফলভাবে পোস্ট হয়েছে!</h3>
            <p style="color: #4B5563; font-size: 13px;">আপনার কাজটি এই মুহূর্তে লাইভ রয়েছে। নিচে জবের বিস্তারিত তথ্য দেওয়া হলো:</p>
        </div>

        <!-- জবের বিস্তারিত তথ্য কার্ড -->
        <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 15px; margin-bottom: 15px; font-size: 14px; color: #374151;">
            <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                <span style="color: #6B7280; font-weight: 500;">জব আইডি:</span>
                <span style="font-family: monospace; background: #E5E7EB; padding: 2px 6px; border-radius: 4px; font-size: 12px; color: #1F2937;">${jobData.jobId}</span>
            </div>
            <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                <span style="color: #6B7280; font-weight: 500;">নাম:</span>
                <span style="font-weight: 600; color: #1F2937;">${jobData.userName}</span>
            </div>
            <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                <span style="color: #6B7280; font-weight: 500;">বর্তমান লোকেশন:</span>
                <span style="color: #1F2937; text-align: right;">${jobData.currentLocation}</span>
            </div>
            <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                <span style="color: #6B7280; font-weight: 500;">কাজের ধরন:</span>
                <span style="color: #2563EB; font-weight: 600;">${jobData.workCategory}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #6B7280; font-weight: 500;">ইউনিট কাউন্ট:</span>
                <span style="font-weight: 600; color: #1F2937;">${jobData.unitCount} টি</span>
            </div>
        </div>

        <!-- অতিরিক্ত গাইডলাইন বা নোটিশ -->
        <div style="font-size: 13px; color: #4B5563; text-align: center; margin-bottom: 20px; background: #EFF6FF; padding: 10px; border-radius: 8px; border: 1px solid #DBEAFE;">
            ℹ️ এই জবটি সম্পর্কে সার্বক্ষণিক আপডেট <strong style="color: #1D4ED8;">'মাই বুকিং'</strong> পেজে পেয়ে যাবেন।
        </div>
    `;

    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'center';

    const btnGotIt = document.createElement('button');
    btnGotIt.innerText = "আমি বুঝতে পেরেছি";
    btnGotIt.style.width = '100%';
    btnGotIt.style.padding = '13px';
    btnGotIt.style.backgroundColor = '#2563EB';
    btnGotIt.style.color = '#ffffff';
    btnGotIt.style.border = 'none';
    btnGotIt.style.borderRadius = '10px';
    btnGotIt.style.fontSize = '15px';
    btnGotIt.style.fontWeight = '600';
    btnGotIt.style.cursor = 'pointer';
    btnGotIt.style.transition = 'background 0.2s';

    btnGotIt.onmouseover = () => btnGotIt.style.backgroundColor = '#1D4ED8';
    btnGotIt.onmouseout = () => btnGotIt.style.backgroundColor = '#2563EB';

    btnGotIt.onclick = function() {
        modalOverlay.remove();
        window.location.href = `client-dashboard.html?id=${currentUserId}`; 
    };

    btnContainer.appendChild(btnGotIt);
    modalBox.appendChild(btnContainer);
    modalOverlay.appendChild(modalBox);
    document.body.appendChild(modalOverlay);
}

window.addEventListener('load', () => {
    setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const targetUserid = urlParams.get('id');
        const draftId = urlParams.get('draftId');

        if (!targetUserid || !draftId) return;

        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return;

        try {
            const masterData = JSON.parse(masterDataStr);
            let targetUserObj = null;

            for (const [key, userObj] of Object.entries(masterData)) {
                if (key === targetUserid || (userObj && userObj.userid === targetUserid) || (userObj && JSON.stringify(userObj).includes(targetUserid))) {
                    targetUserObj = userObj;
                    break;
                }
            }

            if (!targetUserObj) return;

            let draftedJobs = null;
            if (targetUserObj.jobSection && targetUserObj.jobSection.draftedJobs) {
                draftedJobs = targetUserObj.jobSection.draftedJobs;
            } else if (targetUserObj.draftedJobs) {
                draftedJobs = targetUserObj.draftedJobs;
            }

            if (!draftedJobs) return;

            let selectedDraft = null;
            if (Array.isArray(draftedJobs)) {
                selectedDraft = draftedJobs.find(job => job.draftId === draftId);
            } else if (typeof draftedJobs === 'object') {
                selectedDraft = draftedJobs[draftId] || Object.values(draftedJobs).find(job => job.draftId === draftId);
            }

            if (selectedDraft) {
                const locationInput = document.getElementById('currentLocation');
                const categorySelect = document.getElementById('workCategory');
                const unitInput = document.getElementById('unitCount');
                const detailsInput = document.getElementById('problemDetails');

                if (locationInput && selectedDraft.currentLocation) {
                    locationInput.value = selectedDraft.currentLocation;
                    locationInput.dispatchEvent(new Event('input'));
                }
                
                if (categorySelect && selectedDraft.workCategory) {
                    categorySelect.value = selectedDraft.workCategory;
                    categorySelect.dispatchEvent(new Event('change'));
                    if (typeof toggleField === 'function') {
                        toggleField(categorySelect);
                    }
                }
                
                if (unitInput && selectedDraft.unitCount) {
                    unitInput.value = selectedDraft.unitCount;
                    unitInput.dispatchEvent(new Event('input'));
                }
                
                const detailsValue = selectedDraft.problemDetails || selectedDraft.jobDetails || selectedDraft.details || selectedDraft.description;
                if (detailsInput && detailsValue) {
                    detailsInput.value = detailsValue;
                    detailsInput.dispatchEvent(new Event('input'));
                }
            }
        } catch (error) {
            // সাইকোলজিক্যাল বা সাইলেন্ট এরর হ্যান্ডলিং (কনসোলে শো করবে না)
        }
    }, 300);
});