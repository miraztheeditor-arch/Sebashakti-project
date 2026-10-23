
    // এটি একটি সাধারণ হ্যাশিং ফাংশন যা ব্রাউজারের নিজস্ব ক্ষমতা ব্যবহার করে
async function simpleHash(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
// ফাংশনের প্যারামিটারের নাম এখানে 'input' দিন
function cleanPhoneNumber(input) { 
    // এখন সব জায়গায় 'input' ব্যবহার করুন
    if (input.includes('@')) {
        return input.toLowerCase().trim();
    } else if (input.includes('+88')) {
        return input.replace("+88", "").trim();
    } else {
        return input.trim();
    }
}
    const UserAPI = {
    // নাম সেভ করার জন্য
    saveUserName: async (name) => {
    
        try {
            localStorage.setItem('userName', name);
            return { success: true };
        } catch (error) {
            console.error("Error in saveUserName:", error);
            return { success: false, error: error.message };
        }
    },

    // নাম রিড করার জন্য
    getUserName: async () => {
        
        try {
            return localStorage.getItem('userName');
        } catch (error) {
            console.error("Error in getUserName:", error);
            return null;
        }
    },

    // রোল সেভ করার জন্য
    saveUserRole: async (role) => {
         
        try {
            localStorage.setItem('userRole', role);
            return { success: true };
        } catch (error) {
            console.error("Error in saveUserRole:", error);
            
            return { success: false, error: error.message };
        }
    },

    // রোল চেক করার জন্য
    getUserRole: async () => {
        
        try {
            return localStorage.getItem('userRole');
        } catch (error) {
            console.error("Error in getUserRole:", error);
            return null;
        }
    },
      // নতুন অংশ: UUID জেনারেট এবং লোকাল স্টোরেজে সেভ করার জন্য
    saveUserId: async (userId) => {
        try {
            localStorage.setItem('userId', userId);
            return { success: true };
        } catch (error) {
            console.error("Error in saveUserId:", error);
            return { success: false, error: error.message };
        }
    },

    // লোকাল স্টোরেজ থেকে আইডি পাওয়ার জন্য
    getUserId: async () => {
     
        try {
            return localStorage.getItem('userId');
        } catch (error) {
            console.error("Error in getUserId:", error);
            return null;
        }
    },
    
    // ফোন/ইমেইল সেভ করার জন্য
    saveUserPhone: async (phone) => {
          
        try {
            localStorage.setItem('userPhone', phone);
            return { success: true };
        } catch (error) {
            console.error("Error in saveUserPhone:", error);
            return { success: false };
        }
    },

    // ফোন/ইমেইল পাওয়ার জন্য
    getUserPhone: async () => {
        try {
            return localStorage.getItem('userPhone');
        } catch (error) {
            console.error("Error in getUserPhone:", error);
            return null;
        }
    },
    findUserByPhone: async (phone) => {
    try {
        // এখানে নাম্বার ক্লিন করে নিন
        const cleanPhone = cleanPhoneNumber(phone);
        const masterData = localStorage.getItem('userMasterData');
        if (!masterData) return null;
        
        const data = JSON.parse(masterData);
        
        // চেক করুন ফোন নম্বরটি ডাটাতে আছে কি না
        if (data[cleanPhone]) {
            // যদি থাকে, তবে পুরো অবজেক্ট থেকে শুধু userId টি ফেরত দিন
            return { userId: data[cleanPhone].userId };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error in findUserByPhone:", error);
        return null;
    }
},

    // api.js
linkUserWithId: async (phone, name, password, role, userId) => {
    try {
        // এখানে নাম্বার ক্লিন করে নিন
        const cleanPhone = cleanPhoneNumber(phone);
        const masterData = localStorage.getItem('userMasterData');
        const data = masterData ? JSON.parse(masterData) : {};

       // হ্যাশ করুন
        const hashedPassword = await simpleHash(password);

        // এখন মাস্টার ডাটাতে সব তথ্য একসাথে সেভ হচ্ছে
        data[cleanPhone] = {
            name: name,
           password: hashedPassword,
            role: role,
            userId: userId
        };

        localStorage.setItem('userMasterData', JSON.stringify(data));
        return { success: true };
    } catch (error) {
        console.error("Error in linkUserWithId:", error);
        return { success: false };
    }
}
};

// নিশ্চিত করুন এই লজিকটি api.js ফাইলে আছে
UserAPI.login = async (input, password) => {
    try {
        const masterData = localStorage.getItem('userMasterData');
        if (!masterData) return { success: false, message: "কোনো ইউজার ডাটা পাওয়া যায়নি!" };

        const data = JSON.parse(masterData);

        // রেজিস্ট্রেশনের সময় যে লজিক ব্যবহার করেছেন, ঠিক সেটিই এখানে ব্যবহার করুন
        const identifier = input.includes('@') ? input.toLowerCase().trim() : cleanPhoneNumber(input);

        const user = data[identifier];

        if (!user) {
            return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };
        }

        const hashedInputPassword = await simpleHash(password);

        if (user.password === hashedInputPassword) {
            return { success: true, userId: user.userId, role: user.role };
        } else {
            return { success: false, message: "পাসওয়ার্ড ভুল হয়েছে!" };
        }
    } catch (error) {
        return { success: false, message: "সিস্টেম এরর!" };
    }
};



// নিশ্চিত করুন এই লজিকটি api.js ফাইলে আছে
UserAPI.login = async (input, password) => {
    try {
        const masterData = localStorage.getItem('userMasterData');
        if (!masterData) return { success: false, message: "কোনো ইউজার ডাটা পাওয়া যায়নি!" };

        const data = JSON.parse(masterData);

        // রেজিস্ট্রেশনের সময় যে লজিক ব্যবহার করেছেন, ঠিক সেটিই এখানে ব্যবহার করুন
        const identifier = input.includes('@') ? input.toLowerCase().trim() : cleanPhoneNumber(input);

        const user = data[identifier];

        if (!user) {
            return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };
        }

        const hashedInputPassword = await simpleHash(password);

        if (user.password === hashedInputPassword) {
            return { success: true, userId: user.userId, role: user.role };
        } else {
            return { success: false, message: "পাসওয়ার্ড ভুল হয়েছে!" };
        }
    } catch (error) {
        return { success: false, message: "সিস্টেম এরর!" };
    }
};







 // ইউজার আইডি সংগ্রহ
                const activeProfileUserId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId');

                // api.js এর মাধ্যমে ইমেইল সেভ করা
                const apiResponse = UserAPI.saveUserEmailViaApi(activeProfileUserId, emailValue);

                if (apiResponse && apiResponse.success) {
                    if (typeof showToast === 'function') {
                        showToast(apiResponse.message, "success");
                    }
                    setTimeout(() => {
                        window.location.reload(); // পেজ রিলোড হয়ে মাস্টার ডাটা থেকে ইমেইল এনে ফিল্ডে বসিয়ে দেবে
                    }, 1200);
                } else {
                    if (typeof showToast === 'function') {
                        showToast(apiResponse.message || "সংরক্ষণ করতে সমস্যা হয়েছে", "error");
                    }
                }

                // ইউজার আইডি সংগ্রহ
                const activeProfileUserId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId');

                // api.js এর মাধ্যমে ইমেইল সেভ করা
                const apiResponse = UserAPI.saveUserEmailViaApi(activeProfileUserId, emailValue);

                if (apiResponse && apiResponse.success) {
                    if (typeof showToast === 'function') {
                        showToast(apiResponse.message, "success");
                    }
                    setTimeout(() => {
                        window.location.reload(); // পেজ রিলোড হয়ে মাস্টার ডাটা থেকে ইমেইল এনে ফিল্ডে বসিয়ে দেবে
                    }, 1200);
                } else {
                    if (typeof showToast === 'function') {
                        showToast(apiResponse.message || "সংরক্ষণ করতে সমস্যা হয়েছে", "error");
                    }
                }

                
    // গ. এপিআই এর মাধ্যমে মাস্টার ডাটা চেক ও রিপ্লেস করা
    const activeUserId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId');
    const nameApiResponse = UserAPI.saveUserNameViaApi(activeUserId, nameValue);

    if (nameApiResponse && nameApiResponse.success) {
        if (nameApiResponse.isChanged) {
            showToast(nameApiResponse.message, "success");
            setTimeout(() => {
                window.location.reload();
            }, 1200);
            return;
        }
        // যদি নাম একই থাকে, তবে কোনো রিলোড বা এরর ছাড়াই স্বাভাবিকভাবে পরের কোডে চলে যাবে
    } else {
        showToast(nameApiResponse.message || "নাম সংরক্ষণ করতে সমস্যা হয়েছে", "error");
        return;
    }


    
// সংরক্ষণ করুন (Save) বাটনের ক্লিক বা ফর্ম সাবমিট ইভেন্ট হ্যান্ডলার
document.addEventListener('click', function(event) {
    // চেক করা হচ্ছে ক্লিক করা বাটনটি সেভ-বাটন কি না
    if (event.target && event.target.classList.contains('save-btn')) {
        // যদি ফর্ম সাবমিট হওয়ার ডিফল্ট আচরণ থাকে তা আটকানো
        event.preventDefault(); 

                // --- সাবমিট বাটনে ফোন নম্বর রিড-ওনলি (Readonly) চেক ---
const phoneInput = document.getElementById('phone');

if (phoneInput) {
    // যদি ফোন নম্বরের ঘরটি রিড-ওনলি না থাকে (অর্থাৎ ভেরিফাই করা না হয়ে থাকে)
    if (!phoneInput.hasAttribute('readonly')) {
        showToast("আগে অনুগ্রহ করে আপনার ফোন নম্বরটি ভেরিফাই করুন!", "error");
        phoneInput.style.borderColor = '#ef4444';
        phoneInput.focus();
        return; // সাবমিট প্রসেস এখানেই আটকে যাবে
    }
}


        const emailInput = document.getElementById('email');
        
        // যদি ইমেইল ইনপুট ফিল্ডটি রিড-অনলি (readonly) না থাকে তবেই কেবল নতুন ইমেইল চেক ও সেভ করবে
        if (emailInput && !emailInput.hasAttribute('readonly')) {
            const emailValue = emailInput.value.trim();

            // ঘরটি খালি থাকলে কোনো এরর না দিয়ে চুপচাপ পাস করে যাবে (অপশনাল)
            if (emailValue !== "") {
                // @ সহ ভ্যালিড ইমেইল চেক করার রেগুলার এক্সপ্রেশন
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(emailValue)) {
                    // ইনভ্যালিড হলে এরর দেখানো
                    if (typeof showToast === 'function') {
                        showToast("দয়া করে একটি সঠিক ইমেইল অ্যাড্রেস দিন (যেমন: example@gmail.com)", "error");
                    } else {
                        alert("দয়া করে একটি সঠিক ইমেইল অ্যাড্রেস দিন!");
                    }
                    emailInput.style.borderColor = '#ef4444';
                    emailInput.focus();
                    return;
                }

                // ইউজার আইডি সংগ্রহ
                const activeProfileUserId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId');

                // api.js এর মাধ্যমে ইমেইল সেভ করা
                const apiResponse = UserAPI.saveUserEmailViaApi(activeProfileUserId, emailValue);

                if (apiResponse && apiResponse.success) {
                    if (typeof showToast === 'function') {
                        showToast(apiResponse.message, "success");
                    }
                    setTimeout(() => {
                        window.location.reload(); // পেজ রিলোড হয়ে মাস্টার ডাটা থেকে ইমেইল এনে ফিল্ডে বসিয়ে দেবে
                    }, 1200);
                } else {
                    if (typeof showToast === 'function') {
                        showToast(apiResponse.message || "সংরক্ষণ করতে সমস্যা হয়েছে", "error");
                    }
                }
            }
        }

        

        // --- নাম (Name) ফিল্ড ভ্যালিডেশন ও আপডেট লজিক ---
const nameInput = document.getElementById('fullName');

if (nameInput) {
    const nameValue = nameInput.value.trim();

    // ক. চেক করা নামের ঘর খালি কি না
    if (nameValue === "") {
        showToast("দয়া করে আপনার পূর্ণ নাম লিখুন!", "error");
        nameInput.style.borderColor = '#ef4444';
        nameInput.focus();
        return; // সাবমিট প্রসেস এখানেই থেমে যাবে
    }

    // খ. চেক করা নাম ৩ অক্ষরের কম বা ৫০ অক্ষরের বেশি কি না
    if (nameValue.length < 3 || nameValue.length > 50) {
        showToast("নাম অবশ্যই ৩ থেকে ৫০ অক্ষরের মধ্যে হতে হবে!", "error");
        nameInput.style.borderColor = '#ef4444';
        nameInput.focus();
        return; // সাবমিট প্রসেস থেমে যাবে
    }

    // গ. এপিআই এর মাধ্যমে মাস্টার ডাটা চেক ও রিপ্লেস করা
    const activeUserId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId');
    const nameApiResponse = UserAPI.saveUserNameViaApi(activeUserId, nameValue);

    if (nameApiResponse && nameApiResponse.success) {
        if (nameApiResponse.isChanged) {
            showToast(nameApiResponse.message, "success");
            setTimeout(() => {
                window.location.reload();
            }, 1200);
            return;
        }
        // যদি নাম একই থাকে, তবে কোনো রিলোড বা এরর ছাড়াই স্বাভাবিকভাবে পরের কোডে চলে যাবে
    } else {
        showToast(nameApiResponse.message || "নাম সংরক্ষণ করতে সমস্যা হয়েছে", "error");
        return;
    }
}

// --- জেলা (District) এবং উপজেলা (Upazila) ভ্যালিডেশন ও সেভ লজিক ---
const districtSelect = document.getElementById('districtSelect');
const upazilaSelect = document.getElementById('upazilaSelect');

if (districtSelect && upazilaSelect) {
    const districtValue = districtSelect.value.trim();
    const upazilaValue = upazilaSelect.value.trim();

    // ১. যদি জেলা ডিফল্ট (খালি) থাকে
    if (districtValue === "") {
        showToast("দয়া করে আপনার জেলা নির্বাচন করুন!", "error");
        districtSelect.style.borderColor = '#ef4444';
        districtSelect.focus();
        return;
    } else {
        districtSelect.style.borderColor = ''; // এরর বর্ডার থাকলে তা সরিয়ে দেওয়া
    }

    // ২. যদি উপজেলা ডিফল্ট (খালি) থাকে
    if (upazilaValue === "") {
        showToast("দয়া করে আপনার উপজেলা / এলাকা নির্বাচন করুন!", "error");
        upazilaSelect.style.borderColor = '#ef4444';
        upazilaSelect.focus();
        return;
    } else {
        upazilaSelect.style.borderColor = '';
    }

    // ৩. সব ঠিক থাকলে এপিআই-এর মাধ্যমে মাস্টার ডাটার ভেতরে সেভ করা
    const activeUserId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId');
    const locationApiResponse = UserAPI.saveUserLocationViaApi(activeUserId, districtValue, upazilaValue);

    if (!locationApiResponse || !locationApiResponse.success) {
        showToast(locationApiResponse.message || "লোকেশন সংরক্ষণ করতে সমস্যা হয়েছে", "error");
        return;
    }
}


    }
});

// profile edit page



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


        // --- ৫. হেডার বা নেভিগেশন বারের অ্যাভাটার আপডেট (আপনার নতুন স্ক্রিনশট অনুযায়ী) ---
        const navAvatarLetter = document.getElementById('avatar-letter');
        if (navAvatarLetter) navAvatarLetter.innerText = firstLetter;


        // --- ৬. ইনপুট ফিল্ডে নাম বসানোর জন্য (যদি থাকে) ---
        const nameInput = document.getElementById('fullName');
        if (nameInput) nameInput.value = userName;
        
        console.log("সফলভাবে সব জায়গার (ডিসপ্লে, সাইডবার ও হেডার) ডেটা ও অ্যাভাটার লোড হয়েছে:", userName);
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

// বাংলাদেশের সমস্ত জেলা ও উপজেলার পূর্ণাঙ্গ ডেটা
const bangladeshData = {
    "ঢাকা": ["উত্তরা", "মিরপুর", "ধানমন্ডি", "গুলশান", "বনানী", "তেজগাঁও", "রমনা", "লালবাগ", "মতিঝিল", "পল্টন", "মোহাম্মদপুর", "পল্লবী", "সাভার", "ধামরাই", "কেরানীগঞ্জ", "নবাবগঞ্জ", "দোহার"],
    "ফরিদপুর": ["ফরিদপুর সদর", "বোয়ালমারী", "আলফাডাঙ্গা", "মধুখালী", "ভাঙ্গা", "নাগরকান্দা", "চরভদ্রাসন", "সদরপুর", "এরশাদপুর"],
    "গাজীপুর": ["গাজীপুর সদর", "কালিয়াকৈর", "কাপাসিয়া", "শ্রীপুর", "কালীগঞ্জ"],
    "গোপালগঞ্জ": ["গোপালগঞ্জ সদর", "কাশিয়ানি", "টুঙ্গিপাড়া", "কোটালীপাড়া", "মুকসুদপুর"],
    "কিশোরগঞ্জ": ["কিশোরগঞ্জ সদর", "হোসেনপুর", "পাকুন্দিয়া", "কটিয়াদি", "করিমগঞ্জ", "তাড়াইল", "উত্তরাঞ্চল", "বাজিতপুর", "কুলিয়ারচর", "ভৈরব", "অষ্টগ্রাম", "ইটনা", "মিঠামইন"],
    "মাদারীপুর": ["মাদারীপুর সদর", "শিবচর", "কালকিনি", "রাজৈর", "ডাসার"],
    "মানিকগঞ্জ": ["মানিকগঞ্জ সদর", "সিঙ্গাইর", "সাটুরিয়া", "ঘিওর", "শশিবালিয়া", "দৌলতপুর", "হরিরামপুর"],
    "মুন্সিগঞ্জ": ["মুন্সিগঞ্জ সদর", "শ্রীনগর", "সিরাজদিখান", "লৌহজং", "টঙ্গীবাড়ি", "গজারিয়া"],
    "নারায়ণগঞ্জ": ["নারায়ণগঞ্জ সদর", "বন্দর", "আলাইগঞ্জ", "রূপগঞ্জ", "সোনারগাঁ", "আড়াইহাজার"],
    "নরসিংদী": ["নরসিংদী সদর", "পলাশ", "শিবপুর", "মনোহরদী", "বেলাবো", "রায়পুরা"],
    "রাজবাড়ী": ["রাজবাড়ী সদর", "গোয়ালন্দ", "পাংশা", "কালুখালী", "বালিয়াকান্দি"],
    "শরীয়তপুর": ["শরীয়তপুর সদর", "নড়িয়া", "জাজিরা", "গোসাইরহাট", "ভেদরগঞ্জ", "ডামুড্যা"],
    
    "চট্টগ্রাম": ["কোতোয়ালি", "পাহাড়তলী", "পাঁচলাইশ", "ডবলমুরিং", "বায়েজিদ বোস্তামী", "খুলশী", "হালিশহর", "সীতাকুণ্ড", "মিরসরাই", "সন্দ্বীপ", "আউটার রিং", "রাউজান", "রাঙ্গুনিয়া", "বোয়ালখালী", "পটিয়া", "চন্দনাইশ", "সাতক্ষীরা", "সাতকানিয়া", "লোহাগাড়া", "বাঁশখালী", "আনোয়ারা", "কর্ণফুলী"],
    "বান্দরবান": ["বান্দরবান সদর", "আলীকদম", "নাইক্ষ্যংছড়ি", "রোয়াংছড়ি", "লামা", "রুমা", "থানচি"],
    "ব্রাহ্মণবাড়িয়া": ["ব্রাহ্মণবাড়িয়া সদর", "কসবা", "নাসিরনগর", "সরাইল", "আশুগঞ্জ", "আখাউড়া", "নবীনগর", "বাঞ্ছারামপুর", "বিজয়নগর"],
    "চাঁদপুর": ["চাঁদপুর সদর", "হাজীগঞ্জ", "শাহরাস্তি", "কচুয়া", "মতলব উত্তর", "মতলব দক্ষিণ", "ফরিদগঞ্জ", "হাইমচর"],
    "কুমিল্লা": ["কুমিল্লা আদর্শ সদর", "সদর দক্ষিণ", "ব্রাহ্মণপাড়া", "বুড়িচং", "চৌদ্দগ্রাম", "দেবিদ্বার", "হোমনা", "লাকসাম", "মুরাদনগর", "নাঙ্গলকোট", "তিতাস", "মনোহরগঞ্জ", "মেঘনা"],
    "কক্সবাজার": ["কক্সবাজার সদর", "চকরিয়া", "কুতুবদিয়া", "উখিয়া", "মহেশখালী", "পেকুয়া", "টেকনাফ", "রামু"],
    "ফেনী": ["ফেনী সদর", "ছাগলনাইয়া", "দাগনভূঞা", "পরশুরাম", "ফুলগাজী", "সোনাগাজী"],
    "খাগড়াছড়ি": ["খাগড়াছড়ি সদর", "দীঘিনালা", "পানছড়ি", "লক্ষ্মীছড়ি", "মহালছড়ি", "মাটিরাঙ্গা", "রামগড়", "মানিকছড়ি"],
    "লক্ষ্মীপুর": ["লক্ষ্মীপুর সদর", "রায়পুর", "রামগঞ্জ", "কমলনগর", "রামগতি"],
    "নোয়াখালী": ["সুধারাম (নোয়াখালী সদর)", "কোম্পানীগঞ্জ", "বেগমগঞ্জ", "হাতিয়া", "চাটখিল", "সেনবাগ", "সুবর্ণচর", "কবিরহাট"],
    "রাঙ্গামাটি": ["রাঙ্গামাটি সদর", "কাউখালী", "বাঘাইছড়ি", "বরকল", "লংগদু", "নানিয়ারচর", "রাউজান", "জুরাছড়ি", "বেলালাইছড়ি", "রাজস্থলী"],

    "রাজশাহী": ["বোয়ালিয়া", "ম মতিহার", "রাজপাড়া", "শাহ মখদুম", "পবা", "দুর্গাপুর", "বাগমারা", "মোহনপুর", "চারঘাট", "বাঘা", "তানোর", "গোদাগাড়ী"],
    "বগুড়া": ["বগুড়া সদর", "শিবগঞ্জ", "শেরপুর", "ধুনট", "গাবতলী", "সোনাতলা", "কাহালু", "নন্দীগ্রাম", "সারিয়াকান্দি", "আদমদীঘি", "দুপচাঁচিয়া"],
    "জয়পুরহাট": ["জয়পুরহাট সদর", "পাঁচবিবি", "আক্কেলপুর", "কালাই", "ক্ষেতলাল"],
    "নওগাঁ": ["নওগাঁ সদর", "মহাদেবপুর", "মান্দা", "পত্নীতলা", "ধামইরহাট", "নিয়ামতপুর", "পোরশা", "সাপাহার", "বদলগাছী", "আত্রাই", "রানীনগর"],
    "নাটোর": ["নাটোর সদর", "বাগাতিপাড়া", "বড়াইগ্রাম", "গুরুদাসপুর", "লালপুর", "সিংড়া"],
    "পাবনা": ["পাবনা সদর", "ঈশ্বরদী", "চাটমোহর", "বেড়া", "সুজানগর", "ভাঙ্গুড়া", "ফরিদপুর", "আটঘরিয়া", "সাঁথিয়া"],
    "সিরাজগঞ্জ": ["সিরাজগঞ্জ সদর", "কাজিপুর", "উল্লাপাড়া", "শাহজাদপুর", "বেলকুচি", "চৌহালি", "রায়গঞ্জ", "তারাস", "কামারখন্দ"],
    "চাঁপাইনবাবগঞ্জ": ["চাঁপাইনবাবগঞ্জ সদর", "শিবগঞ্জ", "গোমস্তাপুর", "নাচোল", "ভোলাহাট"],

    "খুলনা": ["সোনাডাঙ্গা", "খালিশপুর", "দৌলতপুর", "খানজাহান আলী", "হরিণটানা", "আড়ংঘাটা", "রূপসা", "বটিয়াঘাটা", "দাকোপ", "পাইকগাছা", "কয়রা", "ডুমুরিয়া", "তেরখাদা"],
    "বাগেরহাট": ["বাগেরহাট সদর", "মংলা", "মোরেলগঞ্জ", "শরণখোলা", "রামপাল", "ফকিরহাট", "কচুয়া", "চিতলমারী", "মূলঘর"],
    "চুয়াডাঙ্গা": ["চুয়াডাঙ্গা সদর", "আলমডাঙ্গা", "দামুড়হুদা", "জীবননগর"],
    "যশোর": ["যশোর সদর", "অভয়নগর", "কেশবপুর", "চৌগাছা", "ঝিকরগাছা", "বাঘারপাড়া", "শার্শা", "মণিরামপুর"],
    "ঝিনাইদহ": ["ঝিনাইদহ সদর", "শৈলকুপা", "কালীগঞ্জ", "কোটচাঁদপুর", "মহেশপুর", "হরিণাকুণ্ডু"],
    "কুষ্টিয়া": ["কুষ্টিয়া সদর", "কুমারখালী", "দৌলতপুর", "মিরপুর", "ভেড়ামারা", "খোকসা"],
    "মাগুরা": ["মাগুরা সদর", "শ্রীপুর", "মহম্মদপুর", "শালিখা"],
    "মেহেরপুর": ["মেহেরপুর সদর", "গাংনী", "মুজিবনগর"],
    "নড়াইল": ["নড়াইল সদর", "লোহাগড়া", "কালিয়া"],
    "সাতক্ষীরা": ["সাতক্ষীরা সদর", "তালা", "কলারোয়া", "দেবহাটা", "কালীগঞ্জ", "শ্যামনগর", "আশাশুনি"],

    "বরিশাল": ["বরিশাল সদর", "বাকেরগঞ্জ", "বাবুগঞ্জ", "উজিরপুর", "বানারীপাড়া", "গৌরনদী", "আগৈলঝাড়া", "মেহেন্দিগঞ্জ", "হিজলা", "মাদারীপুর"],
    "বরগুনা": ["বরগুনা সদর", "আমতলী", "বেতাগী", "বামনা", "পাথরঘাটা", "তালতলী"],
    "ভোলা": ["ভোলা সদর", "বোরহানউদ্দিন", "চরফ্যাশন", "দৌলতখান", "লালমোহন", "তজুমদ্দিন", "মনপুরা"],
    "ঝালকাঠি": ["ঝালকাঠি সদর", "কাঁঠালিয়া", "রাজাপুর", "নলছিটি"],
    "পটুয়াখালী": ["পটুয়াখালী সদর", "বাউফল", "গলাচিপা", "কলাপাড়া", "দুমকি", "দশমিনা", "রাঙ্গাবালী", "মীরগোডাউন"],
    "পিরোজপুর": ["পিরোজপুর সদর", "নাজিরপুর", "কাউখালী", "বাউফল", "ভাণ্ডারিয়া", "মঠবাড়িয়া", "নেছারাবাদ (স্বরূপকাঠী)", "ইন্দুরকানী"],

    "সিলেট": ["সিলেট সদর", "বালাগঞ্জ", "বিয়ানীবাজার", "বিশ্বনাথ", "কোম্পানীগঞ্জ", "ফেঞ্চুগঞ্জ", "গোলাপগঞ্জ", "গোয়াইনঘাট", "জকিগঞ্জ", "কানাইঘাট", "দক্ষিণ সুরমা", "জৈন্তাপুর"],
    "হবিগঞ্জ": ["হবিগঞ্জ সদর", "নবীগঞ্জ", "বাহুবল", "চুনারুঘাট", "মাধবপুর", "বানিয়াচং", "আজমিরীগঞ্জ", "লাখাই", "শায়েস্তাগঞ্জ"],
    "মৌলভীবাজার": ["মৌলভীবাজার সদর", "বড়লেখা", "কমলগঞ্জ", "কুলাউড়া", "রাজনগর", "শ্রীমঙ্গল", "জুড়ী"],
    "সুনামগঞ্জ": ["সুনামগঞ্জ সদর", "দক্ষিণ সুনামগঞ্জ (শান্তিগঞ্জ)", "বিশ্বম্ভরপুর", "ছাতক", "জগন্নাথপুর", "তাহিরপুর", "ধর্মপাশা", "জামালগঞ্জ", "শাল্লা", "দিরাই", "মধ্যনগর"],

    "রংপুর": ["রংপুর সদর", "গংগাচড়া", "তারাগঞ্জ", "বদরগঞ্জ", "পীরগঞ্জ", "কাউনিয়া", "পীরগাছা"],
    "দিনাজপুর": ["দিনাজপুর সদর", "বীরগঞ্জ", "বিরামপুর", "বিড়াল", "বোচাগঞ্জ", "চিরিরবন্দর", "ফুলবাড়ী", "ঘোড়াঘাট", "হাকিমপুর", "কাহারোল", "খাঁনসামা", "নবাবগঞ্জ", "পার্বতীপুর"],
    "গাইবান্ধা": ["গাইবান্ধা সদর", "ফুলছড়ি", "সাঘাটা", "সাটুরিয়া", "গোবিন্দগঞ্জ", "পলাশবাড়ী", "সাদুল্লাপুর"],
    "কুড়িগ্রাম": ["কুড়িগ্রাম সদর", "নাগেশ্বরী", "ভুরুঙ্গামারী", "ফুলবাড়ী", "রাজারহাট", "উলিপুর", "চিলমারী", "রৌমারী", "চর রাজিবপুর"],
    "লালমনিরহাট": ["লালমনিরহাট সদর", "হাতীবান্ধা", "পাটগ্রাম", "কালীগঞ্জ", "আদিতমারী"],
    "নীলফামারী": ["নীলফামারী সদর", "সৈয়দপুর", "জলঢাকা", "কিশোরগঞ্জ", "ডোমার", "জলঢাকা"],
    "পটুয়াখালী": ["পটুয়াখালী সদর", "বাউফল", "গলাচিপা", "কলাপাড়া", "দুমকি", "দশমিনা", "রাঙ্গাবালী"],
    "পঞ্চগড়": ["পঞ্চগড় সদর", "বোদা", "দেবীগঞ্জ", "আটোয়ারী", "তেঁতুলিয়া"],
    "ঠাকুরগাঁও": ["ঠাকুরগাঁও সদর", "বালিয়াডাঙ্গী", "পীরগঞ্জ", "রাণীশংকট", "হরিপুর"],

    "ময়মনসিংহ": ["ময়মনসিংহ সদর", "ভালুকা", "মুক্তাগাছা", "ফুলপুর", "ত্রিশাল", "হালুয়াঘাট", "গফরগাঁও", "ধোবাউড়া", "ফুলবাড়িয়া", "নান্দাইল", "ঈশ্বরগঞ্জ", "গৌরীপুর"],
    "শেরপুর": ["শেরপুর সদর", "নালিতাবাড়ি", "শ্রীবরদী", "ঝিনাইগাতী", "নকলা"],
    "জামালপুর": ["জামালপুর সদর", "মেলান্দহ", "ইসলামপুর", "দেওয়ানগঞ্জ", "বকশীগঞ্জ", "সরিষাবাড়ি", "মাদারগঞ্জ"],
    "নেত্রকোণা": ["নেত্রকোণা সদর", "আটপাড়া", "বারহাট্টা", "দুর্গাপুর", "কলমাকান্দা", "কেন্দুয়া", "মদন", "মোহনগঞ্জ", "পূর্বধলা", "খালিয়াজুরি"]
};

// পেজ লোড হওয়ার সাথে সাথে সমস্ত জেলা ড্রপডাউনে বসিয়ে দেওয়া
window.onload = function() {
    const districtSelect = document.getElementById("districtSelect");
    for (let district in bangladeshData) {
        let option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    }
};

// জেলা সিলেক্ট করলে সেই জেলার উপজেলাগুলো লোড করার ফাংশন
function loadUpazilas() {
    const districtSelect = document.getElementById("districtSelect");
    const upazilaSelect = document.getElementById("upazilaSelect");
    const selectedDistrict = districtSelect.value;

    upazilaSelect.innerHTML = '<option value="">উপজেলা বেছে নিন</option>';

    if (selectedDistrict && bangladeshData[selectedDistrict]) {
        bangladeshData[selectedDistrict].forEach(function(upazila) {
            let option = document.createElement("option");
            option.value = upazila;
            option.textContent = upazila;
            upazilaSelect.appendChild(option);
        });
    } else {
        upazilaSelect.innerHTML = '<option value="">প্রথমে জেলা সিলেক্ট করুন</option>';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const profileFullNameInput = document.getElementById('fullName');
    const profilePhoneInput = document.getElementById('phone'); // ভবিষ্যৎ ফোন ফিল্ড
    const profileEmailInput = document.getElementById('email'); // ভবিষ্যৎ ইমেইল ফিল্ড

    // উদাহরণস্বরূপ সেশন বা সার্ভার থেকে ডেটা আনা
    const realUserName = sessionStorage.getItem('liveUserName') || "User";

    if (profileFullNameInput) {
        profileFullNameInput.value = realUserName;
        // 🔥 মূল ম্যাজিক: ইনপুটের defaultValue সেট করে দেওয়া, যাতে ব্রাউজার মনে রাখে এটাই এর ডিফল্ট ভ্যালু
        profileFullNameInput.defaultValue = realUserName; 
        profileFullNameInput.setAttribute('readonly', true);
    }

    // ভবিষ্যতে ফোন বা ইমেইল আসলে ঠিক একইভাবে defaultValue সেট করে দেবেন:
    /*
    if (profilePhoneInput) {
        profilePhoneInput.value = realUserPhone;
        profilePhoneInput.defaultValue = realUserPhone;
    }
    */
});
function resetProfileForm() {
    // ১. ফর্মের ডিফল্ট রিসেট মেথড কল করা
    const form = document.querySelector('.profile-form');
    if (form) {
        form.reset();
    }

    // ২. ডকুমেন্টের সব ইনপুট, সিলেক্ট এবং টেক্সটএরিয়া জোরপূর্বক খালি করা
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(element => {
        if (element.type === 'checkbox' || element.type === 'radio') {
            element.checked = false;
        } else if (element.tagName === 'SELECT') {
            element.selectedIndex = 0;
        } else {
            element.value = '';
        }
    });

    // ৩. এনআইডি কার্ডের সামনের ছবির প্রিভিউ ও প্লেসহোল্ডার রিসেট
    const frontPreview = document.getElementById('frontPreview');
    const frontPlaceholder = document.getElementById('frontPlaceholder');
    if (frontPreview && frontPlaceholder) {
        frontPreview.src = '';
        frontPreview.style.display = 'none';
        frontPlaceholder.style.display = 'block';
    }

    // ৪. এনআইডি কার্ডের পেছনের ছবির প্রিভিউ ও প্লেসহোল্ডার রিসেট
    const backPreview = document.getElementById('backPreview');
    const backPlaceholder = document.getElementById('backPlaceholder');
    if (backPreview && backPlaceholder) {
        backPreview.src = '';
        backPreview.style.display = 'none';
        backPlaceholder.style.display = 'block';
    }

    // ৫. যদি কোনো ডাইনামিক ফিল্ড বা রিঅ্যাডওনিকরণ থাকে, তা ইনিশিয়াল স্টেটে ফিরিয়ে নেওয়া
    const profileFullNameInput = document.getElementById('fullName');
    if (profileFullNameInput) {
        profileFullNameInput.value = '';
        profileFullNameInput.setAttribute('readonly', true);
        profileFullNameInput.style.borderColor = "";
    }

    // ৬. উপজেলা বা অন্য কোনো চেইন ড্রপডাউন থাকলে তার ডিফল্ট টেক্সট ফিরিয়ে আনা
    const upazilaSelect = document.getElementById("upazilaSelect");
    if (upazilaSelect) {
        upazilaSelect.innerHTML = '<option value="">প্রথমে জেলা সিলেক্ট করুন</option>';
    }

    console.log("File and form completely reset to default state.");
}

document.addEventListener('DOMContentLoaded', function () {
    const profileFullNameInput = document.getElementById('fullName');
    const profileUserNameSpan = document.getElementById('user-name'); // এটি স্প্যান ট্যাগ হিসেবে ধরুন

    if (profileFullNameInput) {
        // সেশন থেকে সার্ভারের আসল নামটা নিয়ে আসা
        const realUserName = sessionStorage.getItem('liveUserName');

        if (realUserName && realUserName !== "User" && realUserName !== "Dear Valuable User") {
            profileFullNameInput.value = realUserName; // ইনপুটের জন্য .value ঠিক আছে
            
            // সাইডবারের স্প্যান ট্যাগের জন্য .innerText ব্যবহার করতে হবে
            if (profileUserNameSpan) {
                profileUserNameSpan.innerText = realUserName;
            }
        } else {
            profileFullNameInput.value = "User"; // ফলব্যাক
            if (profileUserNameSpan) {
                profileUserNameSpan.innerText = "User...";
            }
        }
        
        // লঞ্চ রেডি সিকিউরিটি: সরাসরি ফোকাস বা এডিট বন্ধ রাখতে readonly করা
        profileFullNameInput.setAttribute('readonly', true);
    }
});

// ডানের কলম বা এডিট আইকনে ক্লিক করলে ফিল্ড আনলক ও ফোকাস করার ফাংশন
function enableNameEdit() {
    const profileFullNameInput = document.getElementById('fullName');
    if (profileFullNameInput) {
        profileFullNameInput.removeAttribute('readonly');
        profileFullNameInput.focus();
        profileFullNameInput.style.borderColor = "#3498db";
    }
}
window.enableNameEdit = enableNameEdit;

function openUploadOptions(type) {
    activeType = type;
    
    // চেক করা ডিভাইসটি মোবাইল নাকি ল্যাপটপ/কম্পিউটার
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        // মোবাইল হলে ক্যামেরা ও গ্যালারির পপ-আপ দেখাবে
        document.getElementById('uploadChoiceModal').style.display = 'flex';
    } else {
        // ল্যাপটপ বা কম্পিউটার হলে সরাসরি ফাইল ব্রাউজার/স্টোরেজ ওপেন হবে
        document.getElementById(activeType + 'GalleryInput').click();
    }
}

function closeUploadOptions() {
    document.getElementById('uploadChoiceModal').style.display = 'none';
}

function selectSource(source) {
    closeUploadOptions();
    if (source === 'camera') {
        document.getElementById(activeType + 'CameraInput').click();
    } else {
        document.getElementById(activeType + 'GalleryInput').click();
    }
}

function previewImage(event, previewId, placeholderId) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImg = document.getElementById(previewId);
            const placeholder = document.getElementById(placeholderId);
            
            previewImg.src = e.target.result;
            previewImg.style.display = "block";
            placeholder.style.display = "none";
        }
        reader.readAsDataURL(file);
    }
}

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



// ক্লায়েন্ট আইডি থেকে আসা কাজের স্যাম্পল ডাটা
const allJobsDatabase = [
    { id: 1, title: "এসি সার্ভিসিং - ২ ইউনিট", category: "ac", area: "your-area", client: "রহিম এন্টারপ্রাইজ", location: "মিরপুর, ঢাকা" },
    { id: 2, title: "নতুন ওয়্যারিং ও সুইচ ফিটিং", category: "electrical", area: "other", client: "করিম ব্রাদার্স", location: "ধানমন্ডি, ঢাকা" },
    { id: 3, title: "বাথরুম ফিটিংস ও পাইপ মেরামত", category: "plumbing", area: "your-area", client: "মডার্ন বিল্ডার্স", location: "মিরপুর, ঢাকা" },
    { id: 4, title: "সম্পূর্ণ বাসা ডিপ ক্লিনিং", category: "cleaning", area: "other", client: "নবাব ম্যানশন", location: "গুলশান, ঢাকা" },
    { id: 5, title: "রেফ্রিজারেটর গ্যাস চার্জ", category: "fridge", area: "your-area", client: "ভাই ভাই স্টোর", location: "মিরপুর, ঢাকা" }
];

let selectedCategory = 'all';
let selectedAreaType = 'all'; // 'all' অথবা 'area'



// ফিল터 অনুযায়ী কাজ স্ক্রিনে দেখানোর লজিক
function renderFilteredJobs() {
    const searchText = document.getElementById('jobSearchInput').value.toLowerCase();
    const gridContainer = document.getElementById('jobsCardsGrid');
    
    gridContainer.innerHTML = '';

    const filteredData = allJobsDatabase.filter(job => {
        // ক্যাটাগরি ম্যাচ চেক
        let matchCat = (selectedCategory === 'all' || job.category === selectedCategory);
        
        // এরিয়া ম্যাচ চেক
        let matchArea = true;
        if (selectedAreaType === 'area') {
            matchArea = (job.area === 'your-area');
        }

        // সার্চ টেক্সট চেক
        let matchSearch = job.title.toLowerCase().includes(searchText) || job.client.toLowerCase().includes(searchText) || job.location.toLowerCase().includes(searchText);

        return matchCat && matchArea && matchSearch;
    });

    if (filteredData.length === 0) {
        gridContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 30px;">দুঃখিত! এই মুহূর্তে আপনার এই ক্যাটাগরিতে কোনো কাজ পাওয়া যায়নি।</p>';
        return;
    }

    filteredData.forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-item-card';
        card.innerHTML = `
            <div>
                <div class="job-card-top">
                    <span class="job-client-name">${job.client}</span>
                    <span class="job-location-text">📍 ${job.location}</span>
                </div>
                <div class="job-service-title">🔧 ${job.title}</div>
            </div>
            <button class="btn-details-action" onclick="viewJobDetails('${job.title}')">বিস্তারিত দেখুন</button>
        `;
        gridContainer.appendChild(card);
    });
}

// সার্চ ইনপুটে টাইপ করলে ফিল্টার করার ফাংশন
function filterJobsList() {
    renderFilteredJobs();
}





function renderDynamicJobs() {
    const gridContainer = document.getElementById('jobsCardsGrid');
    if (!gridContainer) return;

    // আপাতত টেস্ট করার জন্য বা ডেটা লোড করার জন্য একটি স্যাম্পল ডাটা অ্যারে
    const jobsData = [
        {
            name: "রহিম এন্টারপ্রাইজ",
            location: "মিরপুর, ঢাকা",
            categoryName: "এসি সার্ভিসিং",
            unit: "২ ইউনিট",
            dateTime: "৮ সেপ্টেম্বর, ২০২৬ • সকাল ১০:৩০ টা",
            detailsUrl: "job-details.html"
        }
    ];

    // শর্ত: বামে 'all' (সকল কাজ) এবং ডানে 'all' (All) সিলেক্ট করা থাকলে কার্ড দেখাবে
    if (selectedCategory === 'all' && selectedAreaType === 'all') {
        gridContainer.innerHTML = ""; // আগের কন্টেন্ট ক্লিয়ার করা

        jobsData.forEach(job => {
            const cardHTML = `
                <div class="full-width-profile-container">
                    <div class="profile-row-item">
                        <div class="row-left-section">
                            <div class="row-circle-avatar">
                                <img src="" alt="" style="display: none;">
                            </div>
                            <div class="row-name-location">
                                <h4 class="row-title">${job.name}</h4>
                                <p class="row-location">${job.location}</p>
                            </div>
                        </div>
                        <div class="row-middle-info">
                            <div class="category-wrapper">
                                <span class="category-svg-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                                </span>
                                <span class="row-category">${job.categoryName}</span>
                                <span class="row-unit">&bull; ${job.unit}</span>
                            </div>
                            <span class="row-date-time">${job.dateTime}</span>
                        </div>
                        <div class="row-right-action">
                            <a href="${job.detailsUrl}" class="row-details-link">বিস্তারিত দেখুন</a>
                        </div>
                    </div>
                </div>
            `;
            gridContainer.innerHTML += cardHTML;
        });
    } else {
        // অন্য কিছু সিলেক্ট করলে আপাতত খালি বা মেসেজ দেখাতে পারেন
        gridContainer.innerHTML = `<p style="text-align: center; color: #718093; padding: 20px;">এই ফিল্টারে কোনো ডেটা নেই</p>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderDynamicJobs();
});




   // ২. ফিল্টারিং লজিক (ক্যাটেগরি এবং এরিয়া চেক)
    const filteredJobs = allPostedJobsList.filter(job => {
        let matchesCategory = (selectedCategory === 'all' || job.categoryKey === selectedCategory);
        let matchesArea = (selectedAreaType === 'all');
        return matchesCategory && matchesArea;
    });


    localStorage.removeItem('messages_db');

    // ১. নির্দিষ্ট জব আইডির সাথে লোকাল স্টোরেজ ম্যাচ করে ডাইনামিক কার্ড বানানোর ফাংশন
function renderDynamicInquiryCard(jobId) {
    // আপনার এইচটিএমএলের যে জায়গায় কার্ডটি দেখাতে চান সেই কন্টেইনার ধরুন
    const messagesContainer = document.getElementById('messages-container'); // আপনার কন্টেইনার আইডি দিন
    if (!messagesContainer) return;

    // কন্টেইনারটি প্রথমে খালি করে নেব (যাতে হার্ডকোডেড কার্ড রিমুভ হয়ে যায়)
    messagesContainer.innerHTML = '';

    // MessagesAPI ব্যবহার করে লোকাল স্টোরেজ থেকে নির্দিষ্ট জব আইডির চ্যাট ডাটা আনা
    const chatData = MessagesAPI.getChatData(jobId); 

    // যদি এই জব আইডির বিপরীতে কোনো চ্যাট বা মেসেজ ডেটা না থাকে
    if (!chatData || !chatData.messages || chatData.messages.length === 0) {
        messagesContainer.innerHTML = `<p class="no-msg" style="padding: 15px; color: #777;">এই জবের জন্য কোনো ইনকোয়ারি মেসেজ নেই।</p>`;
        return;
    }

    // মেসেজ অ্যারে থেকে একদম সর্বশেষ মেসেজটি বের করা
    const messages = chatData.messages;
    const lastMessage = messages[messages.length - 1];
    
    // senderInfo থেকে নাম ও ছবি নেওয়া
    const senderInfo = chatData.senderInfo || {};
    const senderName = senderInfo.senderName || 'Technician';
    const senderAvatar = senderInfo.senderAvatar || 'assets/tech.png';
    const lastText = lastMessage.text || '';
    const timeAgo = formatTimeAgo(lastMessage.timestamp);

    // ডাইনামিক কার্ডের এইচটিএমএল স্ট্রাকচার তৈরি করা
    const cardDiv = document.createElement('div');
    cardDiv.className = 'sample-item-card'; // আপনার আগের ক্লাসের নাম ঠিক রাখা হলো
    
    // কার্ডে ক্লিক করলে যেন চ্যাট মোডাল ওপেন হয়
    cardDiv.onclick = function() {
        if (typeof openChatModal === 'function') {
            openChatModal(jobId);
        }
    };

    cardDiv.innerHTML = `
        <div class="card-left">
            <img src="${senderAvatar}" alt="${senderName}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-right: 12px;">
            <div>
                <h4 class="card-title">${escapeHtml(senderName)}</h4>
                <p class="card-subtitle">${escapeHtml(lastText)}</p>
            </div>
        </div>
        <span class="card-time">${timeAgo}</span>
    `;

    // কন্টেইনারে ডাইনামিক কার্ডটি অ্যাপেন্ড করা
    messagesContainer.appendChild(cardDiv);
}


chatBtn.addEventListener('click', function() {
    
    
    startChatPolling(currentJobId, currentUserId);
    chatModal.style.display = 'flex';
    loadExistingMessages(currentJobId, currentUserId);
});

sendBtn.addEventListener('click', function() {
    const messageText = chatInput.value.trim();
    if (messageText === "") return;

       

    // সেন্ডার ইনফো অবজেক্ট
    const senderInfo = {
        senderUid: currentUserId || sessionStorage.getItem('liveUserid') || 'unknown_id',
        senderName: typeof userName !== 'undefined' ? userName : 'Technician',  
        senderAvatar: typeof loggedInUserAvatar !== 'undefined' ? loggedInUserAvatar : 'assets/tech.png'
    };

    // এপিআই কল করে সেভ করা
    MessagesAPI.saveMessage(currentJobId, senderInfo, messageText);

    // ইউআই রেন্ডারিং এবং ইনপুট ক্লিয়ার করার কোড...
    // (আপনার আগের মতোই থাকবে)
    // ২. ইনস্ট্যান্ট স্ক্রিনে রেন্ডার করা (বা আপনার রেন্ডারিং ফাংশন কল করা)
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'outgoing');
    messageDiv.innerHTML = `
        <div class="msg-text">${escapeHtml(messageText)}</div>
        <img src="${loggedInUserAvatar}" alt="Tech" class="msg-avatar">
    `;
    chatContainer.appendChild(messageDiv);

// নতুন পাঠানো মেসেজের জন্য লং-প্রেস ফাংশন যুক্ত করুন
const messageId = 'temp_' + Date.now(); // সার্ভার থেকে আইডি আসলে সেটি, না হলে টেম্পোরারি আইডি
attachLongPressEvent(messageDiv, index, 'outgoing');

    // ৩. ইনপুট রিসেট এবং স্ক্রোল বটমে নেওয়া
    chatInput.value = "";
    chatInput.style.height = 'auto';
    chatInput.style.overflowY = 'hidden';
    sendBtn.disabled = true;
    chatContainer.scrollTop = chatContainer.scrollHeight;
});

// এন্টার প্রেস করলে সেন্ড হওয়ার লজিক (বাটন ডিজেবল না থাকলে কাজ করবে)
chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) {
            sendBtn.click();
        }
    }
});

// আগের মোট মেসেজ সংখ্যা ট্র্যাক করার জন্য একটি ভেরিয়েবল রাখতে পারেন (অথবা লেংথ চেক)
let previousMessageCount = 0;

function loadExistingMessages(jobId, userId, forceScroll = false) {
    const chatContainer = document.getElementById('chat-messages-container');
    if (!chatContainer) return; // এখানে বানান ঠিক করে নেবেন
    
    chatContainer.innerHTML = ""; 

    // সঠিক জব আইডি এবং কারেন্ট ইউজারের আইডি পাস করা হচ্ছে
    const chatData = MessagesAPI.getChatData(jobId, userId);

    if (!chatData || !chatData.messages || !Array.isArray(chatData.messages)) {
        console.log("এই ইউজারের জন্য এই জব আইডিতে কোনো চ্যাট নেই।");
        return;
    }

    const avatar = chatData.senderInfo?.senderAvatar || 'assets/tech.png';
    const name = chatData.senderInfo?.senderName || 'User';

    // ১. ইনকামিং মেসেজের জন্য currentJob.logo এবং আউটগোয়িং বা ফলব্যাকের জন্য ডিফল্ট ছবি সেট করা
const incomingAvatar = (typeof currentJob !== 'undefined' && currentJob.logo) ? currentJob.logo : 'assets/tech.png';

chatData.messages.forEach((msg, index) => {
    const messageDiv = document.createElement('div');
    
    // সঠিক সেন্ডার ক্লাস নির্ধারণ
    const senderClass = (msg.sender === 'incoming') ? 'incoming' : 'outgoing';
    messageDiv.classList.add('message', senderClass);

    // ইনকামিং হলে currentJob.logo, অন্যথায় সাধারণ avatar ব্যবহার করা
    const currentAvatar = (msg.sender === 'incoming') ? incomingAvatar : (chatData.senderInfo?.senderAvatar || 'assets/client.png');
    const currentName = chatData.senderInfo?.senderName || 'User';

    if (msg.sender === 'incoming') {
        messageDiv.innerHTML = `
            <img src="${escapeHtml(currentAvatar)}" alt="${escapeHtml(currentName)}" class="msg-avatar" onerror="this.src='assets/tech.png'">
            <div class="msg-text">${escapeHtml(msg.text || '')}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="msg-text">${escapeHtml(msg.text || '')}</div>
            <img src="${escapeHtml(currentAvatar)}" alt="${escapeHtml(currentName)}" class="msg-avatar" onerror="this.src='assets/client.png'">
        `;
    }

    chatContainer.appendChild(messageDiv);
    attachLongPressEvent(messageDiv, msg.id, msg.sender);
    
});

 saveMessage: function(jobId, senderInfoObj, messageText) {
        let db = {};
        const rawData = localStorage.getItem('messages_db');
        if (rawData) {
            try { db = JSON.parse(rawData); } catch (e) { db = {}; }
        }

        if (!db.allMessages || typeof db.allMessages !== 'object') {
            db.allMessages = {};
        }

        const techUid = senderInfoObj.senderUid; 
        const chatKey = this.getChatKey(jobId, techUid);

        if (!db.allMessages[chatKey]) {
            db.allMessages[chatKey] = {
                senderInfo: {
                    senderUid: senderInfoObj.senderUid,
                    senderName: senderInfoObj.senderName,
                    senderAvatar: senderInfoObj.senderAvatar || 'assets/tech.png'
                },
                messages: []
            };
        }

        db.allMessages[chatKey].messages.push({
            sender: senderInfoObj.senderRole || 'outgoing',
            text: messageText,
            timestamp: Date.now()
        });

        localStorage.setItem('messages_db', JSON.stringify(db));
    }
};


// আপনার এপিআই ফাইলের ভেতরে যেভাবে যোগ করতে পারেন:
updateMessage: function(jobId, senderUid, messageIndex, newText) {
    let db = {};
    const rawData = localStorage.getItem('messages_db');
    if (rawData) {
        try { db = JSON.parse(rawData); } catch (e) { db = {}; }
    }

    const chatKey = this.getChatKey(jobId, senderUid);
    if (db.allMessages && db.allMessages[chatKey] && db.allMessages[chatKey].messages[messageIndex]) {
        // নির্দিষ্ট ইনডেক্সের টেক্সট এবং টাইম আপডেট করা
        db.allMessages[chatKey].messages[messageIndex].text = newText;
        db.allMessages[chatKey].messages[messageIndex].timestamp = Date.now();

        // ডাটাবেজে সেভ করা
        localStorage.setItem('messages_db', JSON.stringify(db));
    }
},

deleteMessage: function(jobId, senderUid, messageIndex) {
    let db = {};
    const rawData = localStorage.getItem('messages_db');
    if (rawData) {
        try { db = JSON.parse(rawData); } catch (e) { db = {}; }
    }

    const chatKey = this.getChatKey(jobId, senderUid);
    if (db.allMessages && db.allMessages[chatKey] && db.allMessages[chatKey].messages) {
        db.allMessages[chatKey].messages.splice(messageIndex, 1);
        localStorage.setItem('messages_db', JSON.stringify(db));
        return true;
    }
    return false;
},

sendBtn.addEventListener('click', function() {
    const messageText = chatInput.value.trim();
    if (messageText === "") return;

       

    // সেন্ডার ইনফো অবজেক্ট
    const senderInfo = {
        senderUid: currentUserId || sessionStorage.getItem('liveUserid') || 'unknown_id',
        senderName: typeof userName !== 'undefined' ? userName : 'Technician',  
        senderAvatar: typeof loggedInUserAvatar !== 'undefined' ? loggedInUserAvatar : 'assets/tech.png'
    };
    if (editingIndex !== null) {
    // --- এডিট মোড: এপিআই এর মাধ্যমে আপডেট করা ---
    const senderUid = senderInfo.senderUid;
    
    // এপিআই ফাংশন কল (যা সরাসরি লোকালস্টোরেজে আপডেট করে দেবে)
    MessagesAPI.updateMessage(currentJobId, senderUid, editingIndex, messageText);

    // এডিট শেষ, ইনডেক্স রিসেট করা
    editingIndex = null;

    // চ্যাট লিস্ট রি-রেন্ডার করা
    loadExistingMessages(currentJobId, senderUid, true);
    
    // ইনপুট বক্স ও অন্যান্য রিসেট
    chatInput.value = "";
    chatInput.style.height = 'auto';
    chatInput.style.overflow = 'hidden';
    sendBtn.disabled = true;

    } else {
        // --- নতুন মেসেজ মোড: নরমাল সেভ করা ---
        MessagesAPI.saveMessage(currentJobId, senderInfo, messageText);

        // নতুন মেসেজ ডিভে রেন্ডার করে নিচে যুক্ত করা (আপনার কোডের মতো)
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'outgoing');
        messageDiv.innerHTML = `
            <div class="msg-text">${escapeHtml(messageText)}</div>
            <img src="${escapeHtml(loggedInUserAvatar)}" alt="Tech" class="msg-avatar">
        `;
        chatContainer.appendChild(messageDiv);
        
        

    // চ্যাট লিস্ট রি-রেন্ডার করা (এটাই সবচেয়ে নিরাপদ ও নিখুঁত উপায়, এতে নতুন মেসেজ ও তার সঠিক ইনডেক্স অটোমেটিক লোড হয়ে যাবে)
    const senderUid = senderInfo.senderUid;
    loadExistingMessages(currentJobId, senderUid, true);
        
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // ইনপুট ফিল্ড ক্লিয়ার ও রিসেট করা
    chatInput.value = "";
    chatInput.style.height = 'auto';
    chatInput.style.overflow = 'hidden';
    sendBtn.disabled = true;
});

// এডিট ও ডিলিট মেনু তৈরির ফাংশন
function showEditDeleteMenu(messageElement, messageId, event) {
    // পুরনো কোনো মেনু খোলা থাকলে তা আগে রিমুভ করা
    const existingMenu = document.getElementById('chat-action-menu');
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement('div');
    menu.id = 'chat-action-menu';
    menu.className = 'chat-action-menu';
    
    // এখানে ${messageId}-কে সিঙ্গেল কোটেশনের ভেতরে রাখা বাধ্যতামূলক
    menu.innerHTML = `
        <div class="action-item" onclick="handleEditMessage('${messageId}')">✏️ Edit</div>
        <div class="action-item" onclick="handleDeleteMessage('${messageId}')">🗑️ Delete</div>
    `;

    // পজিশন সেট করার কোড...
    const clientX = event.clientX || (event.touches ? event.touches[0].clientX : 0);
    const clientY = event.clientY || (event.touches ? event.touches[0].clientY : 0);

    menu.style.position = 'fixed';
    menu.style.top = `${clientY}px`;
    menu.style.left = `${clientX}px`;
    menu.style.zIndex = '9999';

    document.body.appendChild(menu);

    // মেনুর বাইরে কোথাও ক্লিক করলে মেনু বন্ধ হয়ে যাবে
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        }, { once: true });
    }, 100);
}

function handleEditMessage(messageId) {
    console.log("Edit message ID:", messageId);

    // যদি messageId ভুলবশত undefined আসে
    if (messageId === undefined || messageId === 'undefined') {
        console.error("Message ID is undefined!");
        return;
    }

    // লোকালস্টোরেজ থেকে ডাটা রিড করা
    let db = {};
    const rawData = localStorage.getItem('messages_db');
    if (rawData) {
        try { db = JSON.parse(rawData); } catch (e) { db = {}; }
    }

    const senderUid = currentUserId || sessionStorage.getItem('liveUserid');
    const chatKey = MessagesAPI.getChatKey(currentJobId, senderUid);

    // নির্দিষ্ট চ্যাটের মেসেজ থেকে টেক্সট বের করা
    if (db.allMessages && db.allMessages[chatKey] && db.allMessages[chatKey].messages) {
        const targetMessage = db.allMessages[chatKey].messages[messageId];
        
        if (targetMessage) {
            const chatInput = document.getElementById('chat-input-message');
            if (chatInput) {
                chatInput.value = targetMessage.text;
                chatInput.focus();
                
                // ইনপুট ইভেন্ট ট্রিগার করা যাতে সেন্ড বাটনটি এনাবল হয়ে যায়
                chatInput.dispatchEvent(new Event('input'));
            }
            
            // এডিটিং ইনডেক্স সেট করা
            editingIndex = messageId;
        }
    }

    // মেনু রিমুভ করা
    const menu = document.getElementById('chat-action-menu');
    if (menu) menu.remove();
}

function showEditDeleteMenu(messageElement, messageId, event) {
    // পুরনো কোনো মেনু খোলা থাকলে তা আগে রিমুভ করা
    const existingMenu = document.getElementById('chat-action-menu');
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement('div');
    menu.id = 'chat-action-menu';
    menu.className = 'chat-action-menu';
    
    // এখানে ${messageId}-কে সিঙ্গেল কোটেশনের ভেতরে রাখা বাধ্যতামূলক
    menu.innerHTML = `
        <div class="action-item" onclick="handleEditMessage('${messageId}')">✏️ Edit</div>
        <div class="action-item" onclick="handleDeleteMessage('${messageId}')">🗑️ Delete</div>
    `;

    // পজিশন সেট করার কোড...
    const clientX = event.clientX || (event.touches ? event.touches[0].clientX : 0);
    const clientY = event.clientY || (event.touches ? event.touches[0].clientY : 0);

    menu.style.position = 'fixed';
    menu.style.top = `${clientY}px`;
    menu.style.left = `${clientX}px`;
    menu.style.zIndex = '9999';

    document.body.appendChild(menu);

    // মেনুর বাইরে কোথাও ক্লিক করলে মেনু বন্ধ হয়ে যাবে
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        }, { once: true });
    }, 100);
}

if (msg.isEdited && !msg.isDeleted) {
    // ডিফল্ট আউটগোয়িং এর জন্য right: 0px রেখে দিচ্ছি
    editTagHtml = `<div style="position: absolute; bottom: -14px; right: 0px; font-size: 9px; color: #8c8c8c; font-style: italic; white-space: nowrap;">Edited</div>`;
}

if (msg.sender === 'incoming') {
    // ইনকামিংয়ের জন্য right: 0px কে left: 0px করে দেওয়া হলো
    const incomingEditTag = editTagHtml.replace('right: 0px;', 'left: 0px;');

    messageDiv.innerHTML = `
        <img src="${escapeHtml(currentAvatar)}" alt="${escapeHtml(currentName)}" class="msg-avatar" onerror="this.onerror=null;this.src='assets/tech.png';">
        <div style="display: flex; flex-direction: column; align-items: flex-start;">
            <div class="msg-text" style="${messageStyle}; position: relative; margin-bottom: 4px;">
                ${escapeHtml(displayText)}
                ${incomingEditTag}
            </div>
        </div>
    `;
} else {
    messageDiv.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
            <div class="msg-text" style="${messageStyle}" position: relative; margin-bottom: 4px;">
                ${escapeHtml(displayText)}
                ${editTagHtml}
            </div>
        </div>
        <img src="${escapeHtml(currentAvatar)}" alt="${escapeHtml(currentName)}" class="msg-avatar" onerror="this.onerror=null;this.src='assets/client.png';">
    `;
}
    chatContainer.appendChild(messageDiv);
    attachLongPressEvent(messageDiv, msg.id, msg.sender, msg.isDeleted);
    
});

const NotificationAPI = {
    fetchChatNotifications: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const targetUserId = urlParams.get('id');

        if (!targetUserId) return '';

        const userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        const messagesDb = JSON.parse(localStorage.getItem('messages_db')) || { allMessages: {} };

        let matchedAccountKey = null;

        for (const key in userMasterData) {
            if (userMasterData[key].userId === targetUserId) {
                matchedAccountKey = key;
                break;
            }
        }

        if (!matchedAccountKey) return '';

        const accountData = userMasterData[matchedAccountKey];
        const postedJobs = accountData.jobSection?.postedJobs || {};

        let allNotifications = [];
        const allChats = messagesDb.allMessages || {};

        // সব চ্যাট থেকে unread নোটিফিকেশনগুলো একটি অ্যারেতে সংগ্রহ করা
        for (const chatKey in allChats) {
            const chatData = allChats[chatKey];
            const messages = chatData.messages || [];

            let belongsToUser = false;
            let matchedJobId = null;

            for (const jobId in postedJobs) {
                if (chatKey.includes(jobId)) {
                    belongsToUser = true;
                    matchedJobId = jobId;
                    break;
                }
            }

            if (belongsToUser) {
                const unreadMessages = messages.filter(msg => msg.isSeen === false && msg.sender === 'outgoing');

                if (unreadMessages.length > 0) {
                    const lastUnreadMsg = unreadMessages[unreadMessages.length - 1];
                    const senderName = chatData.senderInfo?.senderName || 'গ্রাহক';
                    
                    // নাম বা মেসেজ বড় হলে লিমিట్ করে তিন ডট (...) দেওয়ার ফাংশন
                    const truncateText = (text, limit) => {
                        return text.length > limit ? text.substring(0, limit) + '...' : text;
                    };

                    const formattedSenderName = truncateText(senderName, 20); // নামের জন্য সর্বোচ্চ ২০ ক্যারেক্টার
                    const formattedMessage = truncateText(lastUnreadMsg.text, 45); // মেসেজের জন্য সর্বোচ্চ ৪৫ ক্যারেক্টার

                    const diff = Math.floor((Date.now() - lastUnreadMsg.timestamp) / 60000);
                    let timeAgo = 'এই মাত্র';
                    if (diff >= 1 && diff < 60) timeAgo = `${diff} মিনিট আগে`;
                    else if (diff >= 60) timeAgo = `${Math.floor(diff / 60)} ঘণ্টা আগে`;

                    // অ্যারেতে পুশ করে রাখা যাতে পরে টাইম অনুযায়ী সর্ট করা যায়
                    allNotifications.push({
                        timestamp: lastUnreadMsg.timestamp,
                        html: `
                            <div class="notification-card" onclick="window.location.href='chat.html?jobId=${matchedJobId}'" style="cursor: pointer;">
                                <div class="notification-icon-box">💬</div>
                                <div class="notification-content">
                                    <h4>নতুন চ্যাট মেসেজ এসেছে</h4>
                                    <p><strong>${formattedSenderName}</strong> আপনাকে একটি মেসেজ পাঠিয়েছেন: "${formattedMessage}"</p>
                                    <span class="notification-time">${timeAgo}</span>
                                </div>
                            </div>
                        `
                    });
                }
            }
        }

        // নতুন মেসেজগুলো (যেগুলোর টাইম লেটেস্ট বা কম সময় আগে) উপরে দেখানোর জন্য সর্ট করা (Descending order)
        allNotifications.sort((a, b) => b.timestamp - a.timestamp);

        // সাজানো কার্ডগুলোর এইচটিএমএল এক সাথে যুক্ত করা
        let notificationCardsHTML = '';
        allNotifications.forEach(notif => {
            notificationCardsHTML += notif.html;
        });

        return notificationCardsHTML;
    }
};



function loadExistingMessages(forceScroll = false) {
    const messagesContainer = document.getElementById('chat-messages-container');
    if (!messagesContainer) return;

    messagesContainer.innerHTML = '';

    try {
        const jobChats = (typeof MessagesAPI !== 'undefined' && typeof MessagesAPI.getJobAllChats === 'function') 
            ? MessagesAPI.getJobAllChats(currentJobId) 
            : {};

        const chatKey = `${currentJobId}_${currentTechUid}`;
        const chatData = jobChats ? jobChats[chatKey] : null;

        // যদি চ্যাট ডাটা বা মেসেজ না থাকে
        if (!chatData || !Array.isArray(chatData.messages) || chatData.messages.length === 0) {
            messagesContainer.innerHTML = `<p style="text-align: center; color: #888; margin-top: 20px;">কোনো মেসেজ নেই</p>`;
            return;
        }

        const messages = chatData.messages;
        const techAvatar = chatData.senderInfo && chatData.senderInfo.senderAvatar 
            ? chatData.senderInfo.senderAvatar 
            : 'assets/tech.png';

        // মেসেজগুলো রেন্ডার করার লুপ
     messages.forEach(msg => {
    let messageDiv = document.createElement('div');
    
    // ডিলিট এবং এডিট হ্যান্ডেল করার জন্য লোকাল ভেরিয়েবল
    let displayText = msg.text;
    let messageStyle = '';
    let editTagHtml = '';

    if (msg.isDeleted) {
        displayText = `🚫 এই মেসেজটি ডিলিট করা হয়েছে`;
        messageStyle = 'background-color: #e4e6eb !important; color: #555 !important; font-style: italic; border: 1px dashed #ccd0d5;';
    }

 if (msg.isEdited && !msg.isDeleted) {
    editTagHtml = `<div style="position: absolute; bottom: -14px; right: 0px; font-size: 9px; color: #8c8c8c; font-style: italic; white-space: nowrap;">Edited</div>`;
}
   if (msg.sender === 'incoming') {
    // ডাটাবেজে incoming থাকলে ক্লায়েন্টের স্ক্রিনে outgoing (ডান দিক) দেখাবে
    messageDiv.className = 'message outgoing';
    messageDiv.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
            <div class="msg-text" style="${messageStyle}; position: relative; margin-bottom: 4px;">
                ${escapeHtml(displayText)}
                ${editTagHtml}
            </div>
        </div>
        <img src="${escapeHtml(savedImageString)}" alt="Avatar" class="msg-avatar">
    `;
    
    messageDiv.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showActionPopup(e.clientX, e.clientY, msg.id);
    });
    
    messagesContainer.appendChild(messageDiv);
} else {
    // অন্যথায় incoming (বাম দিক) দেখাবে, তাই এখানে এডিট ট্যাগটি বাম দিকে থাকবে
    const incomingEditTag = editTagHtml.replace('right: 0px;', 'left: 0px;');
    
    messageDiv.className = 'message incoming';
    messageDiv.innerHTML = `
        <img src="${escapeHtml(techAvatar)}" alt="Tech" class="msg-avatar">
        <div style="display: flex; flex-direction: column; align-items: flex-start;">
            <div class="msg-text" style="${messageStyle}; position: relative; margin-bottom: 4px;">
                ${escapeHtml(displayText)}
                ${incomingEditTag}
            </div>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
}
 
    
});
        
    
    // যদি নতুন কোনো মেসেজ না থাকে অথবা মেসেজ সংখ্যা আগের সমান থাকে
    const hasNewMessages = messages.length !== previousMessageCount;
    previousMessageCount = messages.length;

    // মেসেজগুলো রেন্ডার করার কোড...
    
    // শুধু তখনই স্ক্রোল নিচে নামবে যখন নতুন মেসেজ আসবে অথবা একদম প্রথমে মোডাল ওপেন হবে
    if (forceScroll || hasNewMessages) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    } catch (error) {
        console.error("Error loading messages:", error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // এপিআই ফাইল থেকে কার্ডের এইচটিএমএল ডেটা নিয়ে আসা
    const cardsHTML = NotificationAPI.fetchChatNotifications();

    // মেইন ফাইলের নোটিফিকেশন কন্টেইনারে কার্ডগুলো রেন্ডার করা
    const container = document.querySelector('.notifications-body');
    if (container && cardsHTML) {
        container.innerHTML += cardsHTML;
    }
});

getUnreadCountOnly: function() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('id');
    if (!targetUserId) return 0;

    const userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
    const messagesDb = JSON.parse(localStorage.getItem('messages_db')) || { allMessages: {} };

    let matchedAccountKey = null;
    for (const key in userMasterData) {
        if (userMasterData[key].userId === targetUserId) {
            matchedAccountKey = key;
            break;
        }
    }

    if (!matchedAccountKey) return 0;

    const accountData = userMasterData[matchedAccountKey];
    
    // সেফ চেক যেন postedJobs আনইটারেবল (non-iterable) হয়ে এরর না দেয়
    const rawPostedJobs = accountData.jobSection?.postedJobs;
    const postedJobs = Array.isArray(rawPostedJobs) 
        ? rawPostedJobs 
        : (rawPostedJobs ? Object.keys(rawPostedJobs) : []);
        
    const allChats = messagesDb.allMessages || {};

    let totalUnreadCount = 0;

    for (const chatKey in allChats) {
        const chatData = allChats[chatKey];
        const messages = chatData.messages || [];

        let belongsToUser = false;
        for (const jobId of postedJobs) {
            if (chatKey.includes(jobId)) {
                belongsToUser = true;
                break;
            }
        }

        if (belongsToUser) {
            const unreadMessages = messages.filter(msg => 
                msg.isSeen === false && 
                msg.isDeleted !== true && 
                msg.sender === 'outgoing'
            );
            totalUnreadCount += unreadMessages.length;
        }
    }

    return totalUnreadCount;
}

    // এটি এপিআই ফাইলের ভেতরে নতুন একটি ফাংশন হিসেবে যোগ করুন (টেকনিশিয়ানের ফাংশন অপরিবর্তিত থাকবে)
saveClientMessage: function(jobId, techUid, messageText) {
    let db = {};
    const rawData = localStorage.getItem('messages_db');
    if (rawData) {
        try { db = JSON.parse(rawData); } catch (e) { db = {}; }
    }

    if (!db.allMessages || typeof db.allMessages !== 'object') {
        db.allMessages = {};
    }

    const chatKey = this.getChatKey(jobId, techUid);

    // যদি চ্যাট কি আগে থেকে না থাকে, তবে ইনিশিয়ালাইজ করে নেওয়া
    if (!db.allMessages[chatKey]) {
        db.allMessages[chatKey] = {
            senderInfo: { senderUid: techUid },
            messages: []
        };
    }

    // ক্লায়েন্টের পাঠানো মেসেজ ডাটাবেজে সবসময় সরাসরি "incoming" হিসেবে সেভ হবে
db.allMessages[chatKey].messages.push({
    id: 'msg_' + Date.now() + Math.random().toString(36).substr(2, 9), // ইউনিক আইডি যুক্ত করা হলো
    sender: "incoming",
    text: messageText,
    timestamp: Date.now(),
    isDeleted: false, // সফট ডিলিটের জন্য ডিফ্ল্ট ফ্ল্যাগ
    isSeen: false // নতুন মেসেজের জন্য আনরিড বা অদেখা ফ্ল্যাগ যুক্ত করা হলো
    
});

    localStorage.setItem('messages_db', JSON.stringify(db));
},

let previousMessageCount = 0;

function loadExistingMessages(jobId, userId, forceScroll = false) {
    const chatContainer = document.getElementById('chat-messages-container');
    if (!chatContainer) return; // এখানে বানান ঠিক করে নেবেন
    
    chatContainer.innerHTML = ""; 

    // সঠিক জব আইডি এবং কারেন্ট ইউজারের আইডি পাস করা হচ্ছে
    const chatData = MessagesAPI.getChatData(jobId, userId);

    if (!chatData || !chatData.messages || !Array.isArray(chatData.messages)) {
        console.log("এই ইউজারের জন্য এই জব আইডিতে কোনো চ্যাট নেই।");
        return;
    }

    // আপনার loadExistingMessages ফাংশনের ভেতরে কল করার সময়:
if (typeof MessagesAPI !== 'undefined' && typeof MessagesAPI.markChatMessagesAsSeenTechnician === 'function') {
    MessagesAPI.markChatMessagesAsSeenTechnician(jobId, userId); // এখানে currentTechUid এর পরিবর্তে jobId এবং userId পাস করে দিন
}

    const avatar = chatData.senderInfo?.senderAvatar || 'assets/tech.png';
    const name = chatData.senderInfo?.senderName || 'User';

    // ১. ইনকামিং মেসেজের জন্য currentJob.logo এবং আউটগোয়িং বা ফলব্যাকের জন্য ডিফল্ট ছবি সেট করা
const incomingAvatar = (typeof currentJob !== 'undefined' && currentJob.logo) ? currentJob.logo : 'assets/tech.png';

chatData.messages.forEach((msg, index) => {
    const messageDiv = document.createElement('div');
    
    // সঠিক সেন্ডার ক্লাস নির্ধারণ
    const senderClass = (msg.sender === 'incoming') ? 'incoming' : 'outgoing';
    messageDiv.classList.add('message', senderClass);

    // ইনকামিং হলে currentJob.logo, অন্যথায় সাধারণ avatar ব্যবহার করা
    const currentAvatar = (msg.sender === 'incoming') ? incomingAvatar : (chatData.senderInfo?.senderAvatar || 'assets/client.png');
    const currentName = chatData.senderInfo?.senderName || 'User';

    // মেসেজ টেক্সট এবং স্টাইল নির্ধারণ করার লজিক
let displayText = msg.text;
let messageStyle = '';
let editTagHtml = '';

if (msg.isDeleted) {
    displayText = `🚫 এই মেসেজটি ডিলিট করা হয়েছে`;
    // এখানে ব্যাকগ্রাউন্ড হালকা ছাই রঙের এবং টেক্সট কালার ও ইটালিক একসাথে সেট করা হলো
    messageStyle = 'background-color: #e4e6eb !important; color: #555 !important; font-style: italic; border: 1px dashed #ccd0d5;';
}

if (msg.isEdited && !msg.isDeleted) {
    // ডিফল্ট আউটগোয়িং এর জন্য right: 0px রেখে দিচ্ছি
    editTagHtml = `<div style="position: absolute; bottom: -14px; right: 0px; font-size: 9px; color: #8c8c8c; font-style: italic; white-space: nowrap;">Edited</div>`;
}

if (msg.sender === 'incoming') {
    // ইনকামিংয়ের জন্য right: 0px কে left: 0px করে দেওয়া হলো
    const incomingEditTag = editTagHtml.replace('right: 0px;', 'left: 0px;');

    messageDiv.innerHTML = `
        <img src="${escapeHtml(currentAvatar)}" alt="${escapeHtml(currentName)}" class="msg-avatar" onerror="this.onerror=null;this.src='assets/tech.png';">
        <div style="display: flex; flex-direction: column; align-items: flex-start;">
            <div class="msg-text" style="${messageStyle}; position: relative; margin-bottom: 4px;">
                ${escapeHtml(displayText)}
                ${incomingEditTag}
            </div>
        </div>
    `;
} else {
    messageDiv.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
            <div class="msg-text" style="${messageStyle}" position: relative; margin-bottom: 4px;">
                ${escapeHtml(displayText)}
                ${editTagHtml}
            </div>
        </div>
        <img src="${escapeHtml(currentAvatar)}" alt="${escapeHtml(currentName)}" class="msg-avatar" onerror="this.onerror=null;this.src='assets/client.png';">
    `;
}
    chatContainer.appendChild(messageDiv);
    attachLongPressEvent(messageDiv, msg.id, msg.sender, msg.isDeleted);
    
});

    const messages = chatData.messages;
    
    // যদি নতুন কোনো মেসেজ না থাকে অথবা মেসেজ সংখ্যা আগের সমান থাকে
    const hasNewMessages = messages.length !== previousMessageCount;
    previousMessageCount = messages.length;

    // মেসেজগুলো রেন্ডার করার কোড...
    
    // শুধু তখনই স্ক্রোল নিচে নামবে যখন নতুন মেসেজ আসবে অথবা একদম প্রথমে মোডাল ওপেন হবে
    if (forceScroll || hasNewMessages) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

const applyModal = document.getElementById('applyModal');
const applyBtn = document.getElementById('applyBtn'); // আপনার এপ্লাই বাটনের আইডি
const closeApplyModal = document.getElementById('closeApplyModal');

if (applyBtn) {
    applyBtn.addEventListener('click', () => {
        applyModal.style.display = 'flex';
    });
}

if (closeApplyModal) {
    closeApplyModal.addEventListener('click', () => {
        applyModal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === applyModal) {
        applyModal.style.display = 'none';
    }
});

const applyForm = document.getElementById('applyForm');
if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const laborCost = document.getElementById('laborCost').value;
        const materialResponsibility = document.getElementById('materialResponsibility').value;
        const cancellationFee = document.getElementById('cancellationFee').value;
        const coverLetter = document.getElementById('coverLetter').value;

        console.log({
            laborCost,
            materialResponsibility,
            cancellationFee,
            coverLetter
        });

        alert('আপনার প্রপোজাল সফলভাবে জমা হয়েছে!');
        applyModal.style.display = 'none';
        applyForm.reset();
    });
}

// ফর্ম সাবমিট ইভেন্ট
if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // উদাহরণস্বরূপ: আপনার মোডাল বা পেজ থেকে বর্তমান জব আইডিটি যেভাবে ধরেন
        // ধরা যাক jobId ভেরিয়েবলে জব আইডিটি রয়েছে (যেমন: job_1789366418904_456)
        const jobId = applyForm.getAttribute('data-job-id') || window.currentJobId; 

        const proposalData = {
            laborCost: document.getElementById('laborCost').value,
            materialResponsibility: document.getElementById('materialResponsibility').value,
            cancellationFee: document.getElementById('cancellationFee').value,
            estimatedTime: document.getElementById('estimatedTime').value,
            coverLetter: document.getElementById('coverLetter').value,
            appliedAt: new Date().toISOString()
        };

        // এপিআই ফাংশনে প্রপোজাল ডেটার সাথে জব আইডিটি পাস করা হচ্ছে
        const isSuccess = window.TechnicianApplyAPI.submitProposal(proposalData, jobId);

        if (isSuccess) {
            applyModal.style.display = 'none';
            applyForm.reset();
        }
    });
}


  submitProposal: function(proposalData) {
    // ১. প্রথমে এনআইডি বা অন্যান্য চেক
    const checkResult = this.checkTechnicianNid();

    if (!checkResult.isValid) {
        if (typeof showToast === 'function') {
            showToast(checkResult.message, "error");
        } else {
            alert(checkResult.message);
        }
        return false;
    }

    const targetUserKey = checkResult.userKey;
    let userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
    const targetUser = userMasterData[targetUserKey];

    // ২. এবার ওয়ালেটের ব্যালেন্স এবং balanceCheckFlag চেক করা
    if (targetUser && targetUser.myWallet) {
        const wallet = targetUser.myWallet;
        const currentBalance = Number(wallet.balance) || 0;
        const balanceFlag = Number(wallet.balanceCheckFlag) !== undefined ? Number(wallet.balanceCheckFlag) : 3;

        // শর্ত: ব্যালেন্স এবং balanceCheckFlag দুটোই যদি ০ বা মাইনাস (<= 0) হয়
        if (currentBalance <= 0 && balanceFlag <= 0) {
            if (typeof showToast === 'function') {
                showToast("আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। দয়া করে ব্যালেন্স রিচার্জ করুন।", "error");
            } else {
                alert("আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। দয়া করে ব্যালেন্স রিচার্জ করুন।");
            }
            return false; // সাবমিশন আটকে যাবে
        }
    }

    // ৩. আগের মতো জব সেকশনে ডেটা সেভ করার লজিক
    if (!targetUser.jobSection) {
        targetUser.jobSection = {};
    }
    
    targetUser.jobSection.appliedProposal = proposalData;
    userMasterData[targetUserKey] = targetUser;
    localStorage.setItem('userMasterData', JSON.stringify(userMasterData));

    if (typeof showToast === 'function') {
        showToast("আপনার প্রপোজাল সফলভাবে জমা হয়েছে!", "success");
    }

    return true;
}

let userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};

// সব ইউজারের appliedProposal সেকশন খালি করে দেওয়া
for (let userKey in userMasterData) {
    if (userMasterData[userKey].jobSection) {
        userMasterData[userKey].jobSection.appliedProposal = {};
    }
}

// লোকালস্টোরেজে আপডেট ডেটা সেভ করা
localStorage.setItem('userMasterData', JSON.stringify(userMasterData));

console.log("সকল ইউজারের অ্যাপ্লাইড প্রপোজাল সফলভাবে মুছে ফেলা হয়েছে!");



if (applyBtn) {
    applyBtn.addEventListener('click', () => {
        // এপিআই অবজেক্টের মাধ্যমে প্রোফাইল ও এনআইডি চেক করা
        const checkResult = window.TechnicianApplyAPI.checkTechnicianNid();

        if (!checkResult.isValid) {
            if (typeof showToast === 'function') {
                showToast(checkResult.message);
            } else {
                alert(checkResult.message);
            }
            return; // তথ্য না থাকলে মোডাল ওপেন হবে না
        }

        // সব ঠিক থাকলে মোডাল ওপেন হবে
        applyModal.style.display = 'flex';
    });
}

if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // ফাইলের নিজস্ব ভেরিয়েবল থেকে সরাসরি currentJobId নেওয়া হচ্ছে
        const jobId = window.currentJobId || currentJobId;

        // ড্রপডাউনের সিলেক্ট করা অপশনের পুরো বাংলা টেক্সট বা লেখাটি পাওয়ার জন্য:
        const materialSelect = document.getElementById('materialResponsibility');
        const materialResponsibilityValue = materialSelect && materialSelect.selectedIndex > 0 
            ? materialSelect.options[materialSelect.selectedIndex].text 
            : "";

        const proposalData = {
            laborCost: document.getElementById('laborCost').value,
            // মেটেরিয়াল রেসপনসিবিলিটি এর সঠিক ভ্যালু নিশ্চিত করার জন্য:            
            materialResponsibility: materialResponsibilityValue,
            cancellationFee: document.getElementById('cancellationFee').value,
            estimatedTime: document.getElementById('estimatedTime').value,
            coverLetter: document.getElementById('coverLetter').value,
            appliedAt: new Date().toISOString()
        };

        // সঠিক jobId সহ এপিআই ফাংশন কল করা
        const isSuccess = window.TechnicianApplyAPI.submitProposal(proposalData, jobId);

        if (isSuccess) {
            applyModal.style.display = 'none';
            applyForm.reset();
        }
    });
}

window.TechnicianWishlistAPI = {
    // উইশলিস্টের সব জব ফেচ বা গেট করার এপিআই
    getWishlistJobs: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlUserId = urlParams.get('id');
        
        if (!urlUserId) return [];

        let userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        let targetUserKey = null;

        for (let key in userMasterData) {
            if (userMasterData[key].userId === urlUserId || key === urlUserId) {
                targetUserKey = key;
                break;
            }
        }

        if (targetUserKey && userMasterData[targetUserKey].jobSection && userMasterData[targetUserKey].jobSection.wishlistJobs) {
            return Object.values(userMasterData[targetUserKey].jobSection.wishlistJobs);
        }

        return [];
    },

    // উইশলিস্ট থেকে জব ডিলিট করার এপিআই
    removeWishlistJob: function(jobId) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlUserId = urlParams.get('id');
        let userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        
        for (let key in userMasterData) {
            if (userMasterData[key].userId === urlUserId || key === urlUserId) {
                if (userMasterData[key].jobSection && userMasterData[key].jobSection.wishlistJobs) {
                    delete userMasterData[key].jobSection.wishlistJobs[jobId];
                    localStorage.setItem('userMasterData', JSON.stringify(userMasterData));
                    if (typeof showToast === 'function') {
                        showToast("উইশলিস্ট থেকে সফলভাবে ডিলিট করা হয়েছে!", "success");
                    }
                    return true;
                }
                break;
            }
        }
        return false;
    }
    
};

function getAppliedProposalsList() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlUserId = urlParams.get('id');
        
        if (!urlUserId) {
            console.warn("ইউআরএল-এ কোনো আইডি পাওয়া যায়নি!");
            return {};
        }

        const userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        let targetUserKey = null;

        // নির্দিষ্ট ইউজারের চাবি বা কি (key) খুঁজে বের করা
        for (let key in userMasterData) {
            const user = userMasterData[key];
            if (key === urlUserId || (user && user.userId === urlUserId)) {
                targetUserKey = key;
                break;
            }
        }

        // যদি সঠিক ইউজার পাওয়া যায় এবং তার জব সেকশনে প্রপোজাল থাকে
        if (targetUserKey && userMasterData[targetUserKey].jobSection && userMasterData[targetUserKey].jobSection.appliedProposal) {
            return userMasterData[targetUserKey].jobSection.appliedProposal;
        }

        return {};
    } catch (error) {
        console.error("প্রপোজাল ডেটা ফেচ করতে সমস্যা হয়েছে:", error);
        return {};
    }
}

// Main File: রিজেক্ট বাটন হ্যান্ডলার
function handleReject() {
    const { jobId, applicantId } = window.currentActionData || {};
    if (!jobId || !applicantId) return;

    // API ফাইলের ফাংশন কল করা
    const response = rejectProposal(jobId, applicantId);
    console.log("Reject API Response:", response); // কনসোলে রেসপন্স চেক করার জন্য

    // মেসেজ টেক্সট বের করে নেওয়া (যাতে অবজেক্ট হোক বা স্ট্রিং হোক সমস্যা না হয়)
    let messageText = "সফলভাবে প্রসেস করা হয়েছে";
    let isSuccess = false;

    if (response) {
        if (typeof response === 'object') {
            messageText = response.message || messageText;
            isSuccess = response.success === true;
        } else if (typeof response === 'boolean') {
            isSuccess = response;
        }
    }

    // টোস্ট কল করার চেষ্টা করা, না থাকলে কনসোল বা অ্যালার্ট দেখানো
    if (typeof showToast === 'function') {
        showToast(messageText, isSuccess ? "success" : "error");
    } else {
        alert(messageText);
    }

    closeDetailsModal();

}

function rejectProposal(jobId, applicantId) {
    try {
        let userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        let updated = false;

        // ১. সব ইউজারের ওপর লুপ চালানো
        for (let userKey in userMasterData) {
            let userData = userMasterData[userKey];
            
            if (userData.jobSection && userData.jobSection.appliedProposal) {
                let proposals = userData.jobSection.appliedProposal;
                
                // ২. appliedProposal এর ভেতরের প্রতিটা আইটেম চেক করা (চাবি যাই হোক না কেন)
                for (let propKey in proposals) {
                    let proposal = proposals[propKey];
                    
                    // কনসোল লগ অনুযায়ী যে অবজেক্ট আসছে তার ভেতরের jobId অথবা propKey মিলিয়ে দেখা
                    let currentJobId = proposal.jobId || propKey;
                    
                    if (currentJobId === jobId) {
                        // applicantId ম্যাচ করছে কি না চেক করা (যদি applicantId পাঠানো হয়)
                        let targetAppId = proposal.applicantIdentification ? proposal.applicantIdentification.userId : null;
                        
                        if (!applicantId || targetAppId === applicantId || propKey === jobId) {
                            proposal.isAccepted = false; // মান false করে দেওয়া
                            updated = true;
                            break;
                        }
                    }
                }
            }
            if (updated) break;
        }

        // ৩. লোকালস্টোরেজ আপডেট করা
        if (updated) {
            localStorage.setItem('userMasterData', JSON.stringify(userMasterData));
            return { success: true, message: "টেকনিশিয়ানের আবেদন সফলভাবে রিজেক্ট করা হয়েছে!" };
        } else {
            return { success: false, message: "সংশ্লিষ্ট প্রপোজালটি খুঁজে পাওয়া যায়নি!" };
        }

    } catch (error) {
        console.error("API Error rejecting proposal:", error);
        return { success: false, message: "সার্ভার বা লোকালস্টোরেজ ত্রুটি।" };
    }
}

// এক্সেপ্ট বাটন হ্যান্ডলার
function handleAccept() {
    const { jobId, applicantId } = window.currentActionData || {};
    if (!jobId || !applicantId) return;

    console.log(`Job ${jobId} accepted for applicant ${applicantId}`);
    alert("টেকনিশিয়ানের আবেদন সফলভাবে এক্সেপ্ট করা হয়েছে!");
    closeDetailsModal();
}