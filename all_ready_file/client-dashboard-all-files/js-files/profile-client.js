document.addEventListener('DOMContentLoaded', async () => {
    // ১. ইউআরএল বা সেশন থেকে বর্তমান ইউজারের আইডি বের করুন
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get('id') || sessionStorage.getItem('liveUserId');

    if (!currentUserId) return;

// ২. সরাসরি লোকালস্টোরেজ না ধরে, এপিআই ফাংশন ব্যবহার করে ইউজারের ডাটা নিয়ে আসা
    if (typeof UserAPI === 'undefined') return;

    // এপিআই থেকে ইউজারের নাম বা তথ্য ফেচ করা
    const userName = UserAPI.getUserNameViaApi ? UserAPI.getUserNameViaApi(currentUserId) : "User";

    if (userName && userName !== "User") {
        const userId = currentUserId;
        const firstLetter = userName.charAt(0).toUpperCase();

        // --- ৩. মেইন ডিসপ্লে সেকশনের ডেটা আপডেট ---
        const nameDisplay = document.getElementById('user-name-in-display');
        if (nameDisplay) nameDisplay.innerText = userName;

        const idDisplay = document.getElementById('user-id-profile-in-display');
        if (idDisplay) idDisplay.innerText = `UID: ${userId}`;

        const avatarLetterDisplay = document.getElementById('profile-avatar-letter-in-display');
        if (avatarLetterDisplay) avatarLetterDisplay.innerText = firstLetter;

        // --- ৪. সাইডবার (Sidebar) সেকশনের ডেটা আপডেট ---
        const sidebarName = document.getElementById('user-name');
        if (sidebarName) sidebarName.innerText = userName;

        const sidebarId = document.getElementById('user-id-profile');
        if (sidebarId) sidebarId.innerText = `UID: ${userId}`;

        const sidebarAvatarLetter = document.getElementById('profile-avatar-letter');
        if (sidebarAvatarLetter) sidebarAvatarLetter.innerText = firstLetter;

        // --- ৫. হেডার বা নেভিগেশন বারের অ্যাভাটার আপডেট ---
        const navAvatarLetter = document.getElementById('avatar-letter');
        if (navAvatarLetter) navAvatarLetter.innerText = firstLetter;

        // --- ৬. ইনপুট ফিল্ডে নাম বসানোর জন্য (যদি থাকে) ---
        const nameInput = document.getElementById('fullName') || document.getElementById('userName');
        if (nameInput) nameInput.value = userName;

        console.log("সফলভাবে সব জায়গায় (ডিসপ্লে, সাইডবার ও হেডার) ডেটা ও অ্যাভাটার লোড হয়েছে:", userName);
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
    window.location.href = 'find-jobs.html';
});

document.getElementById('bell-icon').addEventListener('click', function() {
    window.location.href = 'bell-icon.html';
});

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get('id') || sessionStorage.getItem('liveUserId');

    if (currentUserId) {
        try {
            // এপিআই থেকে সেভ করা ছবি নিয়ে আসা
            const savedImageString = await UserAPI.getProfileImage(currentUserId);

            if (savedImageString) {
                // ১. মোট ৩টি সার্কেল এলিমেন্ট সিলেক্ট করা
                const avatarElements = [
                    ...document.querySelectorAll('#profile-avatar'), 
                    document.getElementById('profile-avatar-in-display')
                ];

                avatarElements.forEach(avatarContainer => {
                    if (avatarContainer) {
                        avatarContainer.style.backgroundImage = `url(${savedImageString})`;
                        avatarContainer.style.backgroundSize = 'cover';
                        avatarContainer.style.backgroundPosition = 'center';
                        
                        // ২. সার্কেলের ঠিক ভেতরে থাকা 'span' বা লেটার এলিমেন্টটিকে সরাসরি রিমুভ করে দেওয়া
                        const innerSpan = avatarContainer.querySelector('span');
                        if (innerSpan) {
                            innerSpan.remove(); // লেটারটি আর থাকবে না বা কালার বদলানোর সুযোগ পাবে না
                        }
                    }
                });
            }
        } catch (error) {
            console.error("প্রোফাইল ছবি লোড করতে সমস্যা হয়েছে:", error);
        }
    }
});

// ==========================================
// স্ট্যাটিক প্রোফাইল পেজে ইউজার ডাটা ফেচ করে বসানোর লজিক
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // বর্তমান ইউজারের আইডি সংগ্রহ 
    const currentUserId = typeof activeUserId !== 'undefined' ? activeUserId : (new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId'));

    if (currentUserId && typeof UserAPI !== 'undefined' && UserAPI.getUserProfileData) {
        
        // ১. আপনার এপিআই ফাংশন কল করে ডাটা অবজেক্ট আনা
        const profileData = UserAPI.getUserProfileData(currentUserId);
        
        if (profileData) {
            // ২. ফোন নম্বর বসানোর লজিক (ইনপুট ফিল্ড হলে .value, টেক্সট এলিমেন্ট হলে .innerText ব্যবহার করবেন)
            const phoneInput = document.getElementById('phone'); // স্ক্রিনশটের id="phone" অনুযায়ী
            if (phoneInput && profileData.finalPhoneToUse) {
                phoneInput.value = profileData.finalPhoneToUse;
            }

            // ৩. ইমেল বসানোর লজিক
            const emailInput = document.getElementById('email'); // স্ক্রিনশটের id="email" অনুযায়ী
            if (emailInput && profileData.finalEmailToUse) {
                emailInput.value = profileData.finalEmailToUse;
            }

            // ৪. নাম বসানোর লজিক (যদি foundUserData এর ভেতর নাম বা অন্য প্রপার্টি থাকে)
            if (profileData.foundUserData) {
                const fullNameInput = document.getElementById('fullName'); // স্ক্রিনশটের id="fullName" অনুযায়ী
                if (fullNameInput && profileData.foundUserData.fullName) {
                    fullNameInput.value = profileData.foundUserData.fullName;
                }
            }
        }
    }

    // ==========================================
// স্ট্যাটিক প্রোফাইল পেজে জেলা ও উপজেলা ফেচ করে বসানোর লজিক
// ==========================================
if (currentUserId && typeof UserAPI !== 'undefined' && UserAPI.getUserLocationViaApi) {
    const locationRes = UserAPI.getUserLocationViaApi(currentUserId);
    
    if (locationRes && locationRes.success) {
        // ১. জেলার ইনপুটে মান বসানো
        const districtInput = document.getElementById('districtSelect');
        if (districtInput && locationRes.district) {
            districtInput.value = locationRes.district;
        }

        // ২. উপজেলার ইনপুটে মান বসানো
        const upazilaInput = document.getElementById('upazilaSelect');
        if (upazilaInput && locationRes.upazila) {
            upazilaInput.value = locationRes.upazila;
        }
    }
}



// ==========================================
// স্ট্যাটিক প্রোফাইল পেজে কাজের বিবরণ বা ডেসক্রিপশন ফেচ করে বসানোর লজিক
// ==========================================
if (currentUserId && typeof UserAPI !== 'undefined' && UserAPI.getUserDescriptionViaApi) {
    const descRes = UserAPI.getUserDescriptionViaApi(currentUserId);
    
    if (descRes && descRes.success) {
        const descTextarea = document.getElementById('workDescription');
        if (descTextarea && descRes.description) {
            descTextarea.value = descRes.description;
        }
    }
}

// ==========================================
// স্ট্যাটিক প্রোফাইল পেজে এনআইডি নাম (First Name ও Last Name) একত্রিত করে বসানোর লজিক
// ==========================================
if (currentUserId && typeof UserAPI !== 'undefined' && UserAPI.getNidNameViaApi) {
    const nameRes = UserAPI.getNidNameViaApi(currentUserId);
    
    if (nameRes && nameRes.success) {
        const fullNameInput = document.getElementById('nidFullName');
        if (fullNameInput) {
            // প্রথম ও শেষ নাম একত্রিত করা
            const firstName = nameRes.firstName || "";
            const lastName = nameRes.lastName || "";
            const combinedName = `${firstName} ${lastName}`.trim();
            
            if (combinedName !== "") {
                fullNameInput.value = combinedName;
            }
        }
    }
}

// ==========================================
// স্ট্যাটিক প্রোফাইল পেজে জন্মতারিখ (Day, Month, Year) একত্রিত করে বসানোর লজিক
// ==========================================
if (currentUserId && typeof UserAPI !== 'undefined' && UserAPI.getDateOfBirthViaApi) {
    const dobRes = UserAPI.getDateOfBirthViaApi(currentUserId);
    
    if (dobRes && dobRes.success) {
        const dobInput = document.getElementById('dob');
        if (dobInput) {
            const day = dobRes.day || "";
            const month = dobRes.month || "";
            const year = dobRes.year || "";
            
            // সবকটি ভ্যালু উপস্থিত থাকলে একত্রিত করা (উদাহরণস্বরূপ: DD-MM-YYYY ফরম্যাট)
            if (day && month && year) {
                const combinedDob = `${day}-${month}-${year}`;
                dobInput.value = combinedDob;
            }
        }
    }
}

// ==========================================
// স্ট্যাটিক প্রোফাইল পেজে এনআইডি নম্বর ফেচ করে বসানোর লজিক
// ==========================================
if (currentUserId && typeof UserAPI !== 'undefined' && UserAPI.getNidNumberViaApi) {
    const nidRes = UserAPI.getNidNumberViaApi(currentUserId);
    
    if (nidRes && nidRes.success) {
        const nidInput = document.getElementById('nidNumber');
        if (nidInput && nidRes.nidNumber) {
            nidInput.value = nidRes.nidNumber;
        }
    }
}

// ==========================================
// স্ট্যাটিক প্রোফাইল পেজে এনআইডি সামনের ও পেছনের ছবি ফেচ করে প্রিভিউতে দেখানোর লজিক
// ==========================================
if (currentUserId && typeof UserAPI !== 'undefined' && UserAPI.getNidImagesViaApi) {
    const imagesRes = UserAPI.getNidImagesViaApi(currentUserId);
    
    if (imagesRes && imagesRes.success) {
        // ১. সামনের ছবি (Front Image) সেট করা
        const frontPreviewImg = document.getElementById('frontPreview');
        const frontPlaceholderDiv = document.getElementById('frontPlaceholder');
        
        if (imagesRes.frontImage) {
            if (frontPreviewImg) {
                frontPreviewImg.src = imagesRes.frontImage;
                frontPreviewImg.style.display = 'block'; // ছবি দৃশ্যমান করা
            }
            if (frontPlaceholderDiv) {
                frontPlaceholderDiv.style.display = 'none'; // প্লেসহোল্ডার লুকিয়ে ফেলা
            }
        }

        // ২. পেছনের ছবি (Back Image) সেট করা
        const backPreviewImg = document.getElementById('backPreview');
        const backPlaceholderDiv = document.getElementById('backPlaceholder');
        
        if (imagesRes.backImage) {
            if (backPreviewImg) {
                backPreviewImg.src = imagesRes.backImage;
                backPreviewImg.style.display = 'block'; // ছবি দৃশ্যমান করা
            }
            if (backPlaceholderDiv) {
                backPlaceholderDiv.style.display = 'none'; // প্লেসহোল্ডার লুকিয়ে ফেলা
            }
        }
    }
}
});