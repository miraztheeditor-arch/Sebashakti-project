
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
