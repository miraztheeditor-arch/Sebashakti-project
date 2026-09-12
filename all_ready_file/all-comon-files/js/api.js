
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
   // নাম সেভ করার জন্য (সাইন-আপ প্যাকেজের চাইল্ড হিসেবে)
    saveUserName: async (name, signupId) => {
        try {
            const activeSignupId = signupId || localStorage.getItem('activeSignupId') || ('signup_pkg_' + Date.now());
            
            let packageData = JSON.parse(localStorage.getItem(activeSignupId)) || {};
            packageData.userName = name; // প্যাকেজের ভেতরে চাইল্ড হিসেবে নাম সেভ হলো
            
            localStorage.setItem(activeSignupId, JSON.stringify(packageData));
            localStorage.setItem('activeSignupId', activeSignupId);

            return { success: true, signupId: activeSignupId };
        } catch (error) {
            console.error("Error in saveUserName:", error);
            return { success: false, error: error.message };
        }
    },


// নাম রিড করার জন্য (সাইন-আপ প্যাকেজ থেকে)
    getUserName: async (signupId) => {
        try {
            // ১. বর্তমান প্যাকেজ কি (Key) শনাক্ত করুন
            const activeSignupId = signupId || localStorage.getItem('activeSignupId');
            if (!activeSignupId) return null;

            // ২. প্যাকেজ থেকে ডেটা পার্স করুন
            let packageData = JSON.parse(localStorage.getItem(activeSignupId)) || {};
            
            // ৩. চাইল্ড প্রপার্টি 'userName' রিটার্ন করুন
            return packageData.userName || null;
        } catch (error) {
            console.error("Error in getUserName:", error);
            return null;
        }
    },

    // ইউজার আইডি বা URL-এর আইডি দিয়ে মাস্টার ডাটা থেকে নাম খুঁজে আনার এপিআই ফাংশন
getUserNameViaApi: function(userId) {
    try {
        // যদি প্যারামিটার হিসেবে আইডি না দেওয়া হয়, তবে স্বয়ংক্রিয়ভাবে URL থেকে 'id' ধরে নেবে
        const targetId = userId || new URLSearchParams(window.location.search).get('id');
        if (!targetId) return "User";

        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return "User";

        let masterData = JSON.parse(masterDataStr);

        // মাস্টার ডাটার ভেতর লুপ চালিয়ে আইডি ম্যাচ করা
        for (const [key, userObj] of Object.entries(masterData)) {
            if (!userObj) continue;

            // রুট লেভেলে বা profileSection এর ভেতরে থাকা ইউজার আইডি চেক করা
            const currentId = userObj.userId || (userObj.profileSection && userObj.profileSection.userId);
            
            if (currentId === targetId || key === targetId) {
                // রুট লেভেল বা profileSection থেকে নাম খুঁজে বের করা
                const foundName = userObj.name || 
                                  (userObj.profileSection && userObj.profileSection.name);
                
                if (foundName) {
                    return foundName;
                }
            }
        }
        return "User"; // না পেলে ডিফল্ট নাম
    } catch (error) {
        console.error("Error in getUserNameViaApi:", error);
        return "User";
    }
},

    

 // রোল সেভ করার জন্য
saveUserRole: async (role, signupId) => {
    try {
        // যদি signupId না থাকে, তবে একটি নতুন তৈরি হবে (টাইমস্ট্যাম্প দিয়ে ইউনিক)
        const activeSignupId = signupId || 'signup_pkg_' + Date.now();
        
        let packageData = JSON.parse(localStorage.getItem(activeSignupId)) || {};
        packageData.userRole = role;
        
        localStorage.setItem(activeSignupId, JSON.stringify(packageData));
        
        // বর্তমান সেশন আইডিটি মনে রাখা
        localStorage.setItem('activeSignupId', activeSignupId);

        return { success: true, signupId: activeSignupId };
    } catch (error) {
        console.error("Error in saveUserRole:", error);
        return { success: false, error: error.message };
    }
},
    // রোল চেক করার জন্য (আপডেট করা ভার্সন)
    getUserRole: async (signupId) => {
        try {
            const activeSignupId = signupId || localStorage.getItem('activeSignupId');
            if (!activeSignupId) return null;

            let packageData = JSON.parse(localStorage.getItem(activeSignupId)) || {};
            return packageData.userRole || null;
        } catch (error) {
            console.error("Error in getUserRole:", error);
            return null;
        }
    },

    getUserRoleViaApi: async (targetUserId) => {
    try {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) {
            console.log("Master data not found in localStorage!");
            return { success: false, role: 'client' };
        }

        let masterData = JSON.parse(masterDataStr);
        console.log("Searching for User ID:", targetUserId);

        // মাস্টার ডাটার প্রতিটি এন্ট্রির ভেতর ডিপ সার্চ (Deep Search) করা
        for (const [key, userObj] of Object.entries(masterData)) {
            if (!userObj) continue;

            // ১. ইউজার অবজেক্টের রুট বা ভেতরে থাকা userId চেক করা
            const currentId = userObj.userId || (userObj.profileSection && userObj.profileSection.userId);
            
            // ২. অথবা যদি কি (key) নিজেই আইডি বা ফোন নম্বর হয়
            if (currentId === targetUserId || key === targetUserId) {
                // যেকোনো জায়গা থেকে রোল খুঁজে বের করা (রুট, প্রোফাইল সেকশন বা অন্য কোথাও)
                const foundRole = userObj.role || 
                                  (userObj.profileSection && userObj.profileSection.role) || 
                                  userObj.userRole;

                if (foundRole) {
                    console.log("Found Role:", foundRole);
                    return { success: true, role: foundRole.toLowerCase().trim() };
                }
            }
        }

        console.log("User ID match not found, defaulting to client.");
        return { success: false, role: 'client' };
    } catch (error) {
        console.error("Error in getUserRoleViaApi:", error);
        return { success: false, role: 'client' };
    }
},
    // ইউজার আইডি সেভ করার জন্য (সাইন-আপ প্যাকেজের চাইল্ড হিসেবে)
    saveUserId: async (userId, signupId) => {
        try {
            const activeSignupId = signupId || localStorage.getItem('activeSignupId') || ('signup_pkg_' + Date.now());
            
            let packageData = JSON.parse(localStorage.getItem(activeSignupId)) || {};
            packageData.userId = userId; // প্যাকেজের ভেতরে চাইল্ড হিসেবে আইডি সেভ হলো
            
            localStorage.setItem(activeSignupId, JSON.stringify(packageData));
            localStorage.setItem('activeSignupId', activeSignupId);

            return { success: true, signupId: activeSignupId };
        } catch (error) {
            console.error("Error in saveUserId:", error);
            return { success: false, error: error.message };
        }
    },

    
// ইউজার আইডি পাওয়ার জন্য (সাইন-আপ প্যাকেজ থেকে)
    getUserId: async (signupId) => {
        try {
            const activeSignupId = signupId || localStorage.getItem('activeSignupId');
            if (!activeSignupId) return null;

            let packageData = JSON.parse(localStorage.getItem(activeSignupId)) || {};
            return packageData.userId || null; // প্যাকেজের ভেতর থেকে userId রিটার্ন করবে
        } catch (error) {
            console.error("Error in getUserId:", error);
            return null;
        }
    },
    
    // ফোন/ইমেইল সেভ করার জন্য (সাইন-আপ প্যাকেজের চাইল্ড হিসেবে)
    saveUserPhone: async (phone, signupId) => {
        try {
            const activeSignupId = signupId || localStorage.getItem('activeSignupId') || ('signup_pkg_' + Date.now());
            
            let packageData = JSON.parse(localStorage.getItem(activeSignupId)) || {};
            packageData.userPhone = phone; // প্যাকেজের ভেতরে চাইল্ড হিসেবে ফোন/ইমেইল সেভ হলো
            
            localStorage.setItem(activeSignupId, JSON.stringify(packageData));
            localStorage.setItem('activeSignupId', activeSignupId);

            return { success: true, signupId: activeSignupId };
        } catch (error) {
            console.error("Error in saveUserPhone:", error);
            return { success: false, error: error.message };
        }
    },

   // ফোন/ইমেইল রিড করার জন্য (সাইন-আপ প্যাকেজ থেকে)
    getUserPhone: async (signupId) => {
        try {
            // ১. বর্তমান প্যাকেজ কি (Key) শনাক্ত করুন
            const activeSignupId = signupId || localStorage.getItem('activeSignupId');
            if (!activeSignupId) return null;

            // ২. প্যাকেজ থেকে ডেটা পার্স করুন
            let packageData = JSON.parse(localStorage.getItem(activeSignupId)) || {};
            
            // ৩. চাইল্ড প্রপার্টি 'userPhone' রিটার্ন করুন
            return packageData.userPhone || null;
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

    // অন্যান্য মেথডগুলোর পাশাপাশি এটি যুক্ত করুন
    async updateProfileImage(userId, base64Image) {
        // ১. মাস্টার ডাটা ফেচ করা
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) throw new Error("মাস্টার ডাটা পাওয়া যায়নি!");

        const masterData = JSON.parse(masterDataStr);

        // ২. ইউজার খুঁজে বের করা
        let targetUser = null;
        for (const userObj of Object.values(masterData)) {
            if (userObj.userId === userId) {
                targetUser = userObj;
                break;
            }
        }

        if (!targetUser) throw new Error("ইউজার পাওয়া যায়নি!");

        // ৩. ফোল্ডার বা প্রপার্টি চেক এবং ক্রিয়েট করার লজিক (Existence Check)
        if (!targetUser.profileSection) {
            targetUser.profileSection = {}; // প্রথমবার হলে ফোল্ডার ক্রিয়েট হবে
        }

        if (!targetUser.profileSection.profileImage) {
            targetUser.profileSection.profileImage = {}; // সাব-ফোল্ডার ক্রিয়েট হবে
        }

        // ৪. ভেতরে ভ্যালু (ছবি ও টাইমস্ট্যাম্প) ঢুকিয়ে দেওয়া বা আপডেট করা
        targetUser.profileSection.profileImage = {
            imageString: base64Image,
            updatedAt: new Date().toISOString()
        };

        // ৫. লোকাল স্টোরেজে সেভ করা (ভবিষ্যতে এখানে লোকাল স্টোরেজের বদলে সরাসরি সার্ভার API Fetch/Axios রিকোয়েস্ট হবে)
        localStorage.setItem('userMasterData', JSON.stringify(masterData));

        /* 
           --- ভবিষ্যতে সার্ভারে যাওয়ার পর এই অংশটি এমন হতে পারে ---
           return await fetch('/api/update-profile-image', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ userId, base64Image })
           }).then(res => res.json());
        */

        return { success: true, message: "প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে!" };
    },

    // api.js ফাইলের ভেতরে UserAPI অবজেক্টের মধ্যে এটি যুক্ত করুন
async getProfileImage(userId) {
    const masterDataStr = localStorage.getItem('userMasterData');
    if (!masterDataStr) return null;

    const masterData = JSON.parse(masterDataStr);

    let targetUser = null;
    for (const userObj of Object.values(masterData)) {
        if (userObj.userId === userId) {
            targetUser = userObj;
            break;
        }
    }

    // চেক করা যে profileSection এবং profileImage আছে কি না
    if (targetUser && targetUser.profileSection && targetUser.profileSection.profileImage && targetUser.profileSection.profileImage.imageString) {
        return targetUser.profileSection.profileImage.imageString;
    }

    return null; // না থাকলে null রিটার্ন করবে
},

getUserProfileData: function(userId) {
        try {
            const masterDataStr = localStorage.getItem('userMasterData');
            if (!masterDataStr || !userId) return null;

            const masterData = JSON.parse(masterDataStr);
            let foundUserKey = null;
            let foundUserData = null;

            for (const [key, userObj] of Object.entries(masterData)) {
                if (userObj.userId === userId || userObj.userid === userId) {
                    foundUserKey = key;
                    foundUserData = userObj;
                    break;
                }
            }

            if (!foundUserData) return null;

            let finalPhoneToUse = null;

            // ১. প্রথমে চেক করা Key-টি নিজেই কোনো বৈধ বাংলাদেশি ফোন নম্বর কি না
            const isKeyPhone = /^01[3-9]\d{8}$/.test(foundUserKey);

            if (isKeyPhone) {
                finalPhoneToUse = foundUserKey; // Key-তেই ফোন নম্বর পাওয়া গেছে
            } 
            // ২. যদি Key-তে ফোন নম্বর না থাকে, তবে profileSection-এর ভেতরে ফোন নম্বর আছে কি না চেক করা
            else if (foundUserData.profileSection && foundUserData.profileSection.phone) {
                const profilePhone = foundUserData.profileSection.phone.trim();
                const isProfilePhoneValid = /^01[3-9]\d{8}$/.test(profilePhone);
                
                if (isProfilePhoneValid) {
                    finalPhoneToUse = profilePhone; // profileSection থেকে ফোন নম্বর পেয়ে গেছে
                }
            }

            return { 
                foundUserKey, 
                foundUserData, 
                finalPhoneToUse // এটি দিয়ে এখন ইনপুট ও রিডওনিকো হ্যান্ডেল হবে
            };

        } catch (error) {
            console.error("API Error:", error);
            return null;
        }
    },

    getUserProfileData: function(userId) {
        try {
            const masterDataStr = localStorage.getItem('userMasterData');
            if (!masterDataStr || !userId) return null;

            const masterData = JSON.parse(masterDataStr);
            let foundUserKey = null;
            let foundUserData = null;

            for (const [key, userObj] of Object.entries(masterData)) {
                if (userObj.userId === userId || userObj.userid === userId) {
                    foundUserKey = key;
                    foundUserData = userObj;
                    break;
                }
            }

            if (!foundUserData) return null;

            let finalPhoneToUse = null;
            let finalEmailToUse = null;

            // ১. ফোন নম্বর ডিটেক্ট করা (Key বা profileSection থেকে)
            const isKeyPhone = /^01[3-9]\d{8}$/.test(foundUserKey);
            if (isKeyPhone) {
                finalPhoneToUse = foundUserKey;
            } else if (foundUserData.profileSection && foundUserData.profileSection.phone) {
                const profilePhone = foundUserData.profileSection.phone.trim();
                if (/^01[3-9]\d{8}$/.test(profilePhone)) {
                    finalPhoneToUse = profilePhone;
                }
            }

            // ২. ইমেইল ডিটেক্ট করা (Key বা profileSection থেকে)
            // সাধারণ ইমেইল ভ্যালিডেশনRegex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isKeyEmail = emailRegex.test(foundUserKey);

            if (isKeyEmail) {
                finalEmailToUse = foundUserKey; // Key-তেই ইমেইল পাওয়া গেছে
            } else if (foundUserData.profileSection && foundUserData.profileSection.email) {
                const profileEmail = foundUserData.profileSection.email.trim();
                if (emailRegex.test(profileEmail)) {
                    finalEmailToUse = profileEmail; // profileSection থেকে ইমেইল পাওয়া গেছে
                }
            }

            return { 
                foundUserKey, 
                foundUserData, 
                finalPhoneToUse,
                finalEmailToUse // এটি এখন ইমেইলের জন্য কাজ করবে
            };

        } catch (error) {
            console.error("API Error:", error);
            return null;
        }
    },

    // নতুন নাম আপডেট করার ফাংশন
    saveUserNameViaApi: function(userId, newName) {
        try {
            const masterDataStr = localStorage.getItem('userMasterData');
            if (!masterDataStr) return { success: false, message: "ইউজার ডেটা পাওয়া যায়নি!" };

            let masterData = JSON.parse(masterDataStr);
            let targetUserObj = null;

            for (const [key, userObj] of Object.entries(masterData)) {
                if (userObj.userId === userId || userObj.userid === userId) {
                    targetUserObj = userObj;
                    break;
                }
            }

            if (!targetUserObj) return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };

            // profileSection অবজেক্ট না থাকলে তৈরি করে নেওয়া
            if (!targetUserObj.profileSection) {
                targetUserObj.profileSection = {};
            }

            // আগের নাম এবং নতুন নাম চেক করা
            const existingName = targetUserObj.profileSection.name || targetUserObj.name || "";

            if (existingName === newName) {
                return { success: true, message: "নাম একই রয়েছে, কোনো পরিবর্তন হয়নি", isChanged: false };
            }

            // নাম রিপ্লেস বা আপডেট করা
            targetUserObj.profileSection.name = newName;
            // যদি মূল অবজেক্টেও নাম প্রপার্টি থাকে তা সিঙ্ক রাখা
            if (targetUserObj.name) {
                targetUserObj.name = newName;
            }

            // লোকালস্টোরেজে আপডেট করা
            localStorage.setItem('userMasterData', JSON.stringify(masterData));

            return { success: true, message: "নাম সফলভাবে আপডেট করা হয়েছে", isChanged: true };

        } catch (error) {
            console.error("API Error:", error);
            return { success: false, message: "সার্ভারে নাম সেভ করতে সমস্যা হয়েছে।" };
        }
    },

    // নতুন জেলা ও উপজেলা সেভ করার ফাংশন
    saveUserLocationViaApi: function(userId, district, upazila) {
        try {
            const masterDataStr = localStorage.getItem('userMasterData');
            if (!masterDataStr) return { success: false, message: "ইউজার ডেটা পাওয়া যায়নি!" };

            let masterData = JSON.parse(masterDataStr);
            let targetUserObj = null;

            for (const [key, userObj] of Object.entries(masterData)) {
                if (userObj.userId === userId || userObj.userid === userId) {
                    targetUserObj = userObj;
                    break;
                }
            }

            if (!targetUserObj) return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };

            // profileSection অবজেক্ট না থাকলে তৈরি করে নেওয়া
            if (!targetUserObj.profileSection) {
                targetUserObj.profileSection = {};
            }

            // জেলা ও উপজেলা সেভ করা
            targetUserObj.profileSection.district = district;
            targetUserObj.profileSection.upazila = upazila;

            // লোকালস্টোরেজে আপডেট করা
            localStorage.setItem('userMasterData', JSON.stringify(masterData));

            return { success: true, message: "লোকেশন সফলভাবে সংরক্ষিত হয়েছে" };

        } catch (error) {
            console.error("API Error:", error);
            return { success: false, message: "লোকেশন সেভ করতে সমস্যা হয়েছে।" };
        }
    },

  // ==========================================
// মাস্টার ডাটা থেকে জেলা ও উপজেলা গেট (ফেচ) করার ফাংশন
// ==========================================
getUserLocationViaApi: function(userId) {
    try {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return { success: false, message: "ইউজার ডেটা পাওয়া যায়নি!" };

        let masterData = JSON.parse(masterDataStr);
        let targetUserObj = null;

        // ইউজার খোঁজা (আপনার সেভ ফাংশনের লজিক অনুযায়ী)
        for (const [key, userObj] of Object.entries(masterData)) {
            if (userObj.userId === userId || userObj.userid === userId) {
                targetUserObj = userObj;
                break;
            }
        }

        if (!targetUserObj) return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };

        // profileSection বা সরাসরি অবজেক্ট থেকে জেলা ও উপজেলা রিটার্ন করা
        const district = targetUserObj.profileSection ? targetUserObj.profileSection.district : targetUserObj.district;
        const upazila = targetUserObj.profileSection ? targetUserObj.profileSection.upazila : targetUserObj.upazila;

        return { 
            success: true, 
            district: district || "", 
            upazila: upazila || "" 
        };

    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "লোকেশন ডাটা লোড করতে সমস্যা হয়েছে!" };
    }
},

// নতুন ক্যাটেগরি সেভ করার ফাংশন (লোকেশন সেভ করার হুবহু স্টাইলে)
saveUserCategoryViaApi: function(userId, category) {
    try {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return { success: false, message: "ইউজার ডেটা পাওয়া যায়নি!" };

        let masterData = JSON.parse(masterDataStr);
        let targetUserObj = null;

        for (const [key, userObj] of Object.entries(masterData)) {
            if (userObj.userId === userId || userObj.userid === userId) {
                targetUserObj = userObj;
                break;
            }
        }

        if (!targetUserObj) return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };

        // profileSection অবজেক্ট না থাকলে তৈরি করে নেওয়া
        if (!targetUserObj.profileSection) {
            targetUserObj.profileSection = {};
        }

        // profileSection এর ভেতরে ক্যাটেগরি সেট করা
        targetUserObj.profileSection.category = category;

        // লোকালস্টোরেজে আপডেট করা
        localStorage.setItem('userMasterData', JSON.stringify(masterData));

        return { success: true, message: "ক্যাটেগরি সফলভাবে সংরক্ষিত হয়েছে!" };

    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "ক্যাটেগরি সেভ করতে সমস্যা হয়েছে!" };
    }
},

// মাস্টার ডাটা থেকে কাজের ক্যাটেগরি গেট (ফেচ) করার ফাংশন
getUserCategoryViaApi: function(userId) {
    try {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return { success: false, message: "ইউজার ডেটা পাওয়া যায়নি!" };

        let masterData = JSON.parse(masterDataStr);
        let targetUserObj = null;

        // ইউজার খোঁজা
        for (const [key, userObj] of Object.entries(masterData)) {
            if (userObj.userId === userId || userObj.userid === userId) {
                targetUserObj = userObj;
                break;
            }
        }

        if (!targetUserObj) return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };

        // profileSection বা রুট থেকে ক্যাটেগরি রিটার্ন করা
        const category = targetUserObj.profileSection ? targetUserObj.profileSection.category : targetUserObj.category;

        return { 
            success: true, 
            category: category || "" 
        };

    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "ক্যাটেগরি ডাটা লোড করতে সমস্যা হয়েছে!" };
    }
},

// UserAPI অবজেক্টের ভেতরে এই ফাংশনটি থাকবে:
saveUserDescriptionViaApi: function(userId, description) {
    try {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return { success: false, message: "ইউজার ডেটা পাওয়া যায়নি!" };

        let masterData = JSON.parse(masterDataStr);
        let targetUserObj = null;

        for (const [key, userObj] of Object.entries(masterData)) {
            if (userObj.userId === userId || userObj.userid === userId) {
                targetUserObj = userObj;
                break;
            }
        }

        if (!targetUserObj) return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };

        // profileSection অবজেক্ট না থাকলে তৈরি করে নেওয়া
        if (!targetUserObj.profileSection) {
            targetUserObj.profileSection = {};
        }

        // profileSection এর ভেতরে description সেট করা
        targetUserObj.profileSection.description = description;

        // লোকালস্টোরেজে আপডেট করা
        localStorage.setItem('userMasterData', JSON.stringify(masterData));

        return { success: true, message: "ডেসক্রিপশন সফলভাবে সংরক্ষিত হয়েছে!" };

    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "ডেসক্রিপশন সেভ করতে সমস্যা হয়েছে!" };
    }
},

// মাস্টার ডাটার profileSection থেকে ডেসক্রিপশন রিড করে আনার ফাংশন
getUserDescriptionViaApi: function(userId) {
    try {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return { success: false, message: "ইউজার ডেটা পাওয়া যায়নি!" };

        let masterData = JSON.parse(masterDataStr);
        let targetUserObj = null;

        for (const [key, userObj] of Object.entries(masterData)) {
            if (userObj.userId === userId || userObj.userid === userId) {
                targetUserObj = userObj;
                break;
            }
        }

        if (!targetUserObj) return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };

        // profileSection এবং description চেক করা
        if (targetUserObj.profileSection && targetUserObj.profileSection.description) {
            return { 
                success: true, 
                description: targetUserObj.profileSection.description 
            };
        }

        return { success: false, message: "কোনো ডেসক্রিপশন পাওয়া যায়নি।" };

    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "ডেসক্রিপশন লোড করতে সমস্যা হয়েছে!" };
    }
},

// মাস্টার ডাটার profileSection-এর ভেতরে nidSection তৈরি করে নাম সেভ করার ফাংশন
saveNidNameViaApi: function(userId, firstName, lastName) {
    try {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return { success: false, message: "ইউজার ডেটা পাওয়া যায়নি!" };

        let masterData = JSON.parse(masterDataStr);
        let targetUserObj = null;

        for (const [key, userObj] of Object.entries(masterData)) {
            if (userObj.userId === userId || userObj.userid === userId) {
                targetUserObj = userObj;
                break;
            }
        }

        if (!targetUserObj) return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };

        // ১. profileSection অবজেক্ট না থাকলে তৈরি করে নেওয়া
        if (!targetUserObj.profileSection) {
            targetUserObj.profileSection = {};
        }

        // ২. profileSection এর ভেতরে nidSection অবজেক্ট তৈরি বা আপডেট করা
        targetUserObj.profileSection.nidSection = {
            firstName: firstName,
            lastName: lastName
        };

        // ৩. লোকালস্টোরেজে সম্পূর্ণ মাস্টার ডাটা আপডেট করা
        localStorage.setItem('userMasterData', JSON.stringify(masterData));

        return { success: true, message: "এনআইডি নাম সফলভাবে সংরক্ষিত হয়েছে!" };

    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "ডেটা সেভ করতে সমস্যা হয়েছে!" };
    }
},

// মাস্টার ডাটার profileSection.nidSection থেকে নাম রিড করে আনার ফাংশন
getNidNameViaApi: function(userId) {
    try {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return { success: false, message: "ইউজার ডেটা পাওয়া যায়নি!" };

        let masterData = JSON.parse(masterDataStr);
        let targetUserObj = null;

        for (const [key, userObj] of Object.entries(masterData)) {
            if (userObj.userId === userId || userObj.userid === userId) {
                targetUserObj = userObj;
                break;
            }
        }

        if (!targetUserObj) return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };

        // nidSection এবং নামগুলো চেক করা
        if (targetUserObj.profileSection && targetUserObj.profileSection.nidSection) {
            const nidData = targetUserObj.profileSection.nidSection;
            return { 
                success: true, 
                firstName: nidData.firstName || "", 
                lastName: nidData.lastName || "" 
            };
        }

        return { success: false, message: "কোনো এনআইডি নাম পাওয়া যায়নি।" };

    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "নাম লোড করতে সমস্যা হয়েছে!" };
    }
},

// মাস্টার ডাটার profileSection.nidSection-এর ভেতরে জন্মতারিখ সেভ করার ফাংশন
saveDateOfBirthViaApi: function(userId, day, month, year) {
    try {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return { success: false, message: "ইউজার ডেটা পাওয়া যায়নি!" };

        let masterData = JSON.parse(masterDataStr);
        let targetUserObj = null;

        for (const [key, userObj] of Object.entries(masterData)) {
            if (userObj.userId === userId || userObj.userid === userId) {
                targetUserObj = userObj;
                break;
            }
        }

        if (!targetUserObj) return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };

        // ১. profileSection অবজেক্ট না থাকলে তৈরি করে নেওয়া
        if (!targetUserObj.profileSection) {
            targetUserObj.profileSection = {};
        }

        // ২. nidSection না থাকলে তৈরি করে নেওয়া
        if (!targetUserObj.profileSection.nidSection) {
            targetUserObj.profileSection.nidSection = {};
        }

        // ৩. nidSection এর ভেতরে dateOfBirth সেট করা (দিন, মাস, বছর আকারে)
        targetUserObj.profileSection.nidSection.dateOfBirth = {
            day: day,
            month: month,
            year: year
        };

        // ৪. লোকালস্টোরেজে সম্পূর্ণ মাস্টার ডাটা আপডেট করা
        localStorage.setItem('userMasterData', JSON.stringify(masterData));

        return { success: true, message: "জন্মতারিখ সফলভাবে সংরক্ষিত হয়েছে!" };

    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "জন্মতারিখ সেভ করতে সমস্যা হয়েছে!" };
    }
},

// মাস্টার ডাটার profileSection.nidSection.dateOfBirth থেকে জন্মতারিখ রিড করে আনার ফাংশন
getDateOfBirthViaApi: function(userId) {
    try {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return { success: false, message: "ইউজার ডেটা পাওয়া যায়নি!" };

        let masterData = JSON.parse(masterDataStr);
        let targetUserObj = null;

        for (const [key, userObj] of Object.entries(masterData)) {
            if (userObj.userId === userId || userObj.userid === userId) {
                targetUserObj = userObj;
                break;
            }
        }

        if (!targetUserObj) return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };

        // dateOfBirth অবজেক্ট চেক করা
        if (targetUserObj.profileSection && 
            targetUserObj.profileSection.nidSection && 
            targetUserObj.profileSection.nidSection.dateOfBirth) {
            
            const dobData = targetUserObj.profileSection.nidSection.dateOfBirth;
            return { 
                success: true, 
                day: dobData.day || "", 
                month: dobData.month || "", 
                year: dobData.year || "" 
            };
        }

        return { success: false, message: "কোনো জন্মতারিখ পাওয়া যায়নি।" };

    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "জন্মতারিখ লোড করতে সমস্যা হয়েছে!" };
    }
},

// মাস্টার ডাটার profileSection.nidSection-এর ভেতরে এনআইডি নম্বর সেভ করার ফাংশন
saveNidNumberViaApi: function(userId, nidNumber) {
    try {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return { success: false, message: "ইউজার ডেটা পাওয়া যায়নি!" };

        let masterData = JSON.parse(masterDataStr);
        let targetUserObj = null;

        for (const [key, userObj] of Object.entries(masterData)) {
            if (userObj.userId === userId || userObj.userid === userId) {
                targetUserObj = userObj;
                break;
            }
        }

        if (!targetUserObj) return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };

        // ১. profileSection অবজেক্ট না থাকলে তৈরি করে নেওয়া
        if (!targetUserObj.profileSection) {
            targetUserObj.profileSection = {};
        }

        // ২. nidSection না থাকলে তৈরি করে নেওয়া
        if (!targetUserObj.profileSection.nidSection) {
            targetUserObj.profileSection.nidSection = {};
        }

        // ৩. nidSection এর ভেতরে nidNumber সেট করা
        targetUserObj.profileSection.nidSection.nidNumber = nidNumber;

        // ৪. লোকালস্টোরেজে সম্পূর্ণ মাস্টার ডাটা আপডেট করা
        localStorage.setItem('userMasterData', JSON.stringify(masterData));

        return { success: true, message: "এনআইডি নম্বর সফলভাবে সংরক্ষিত হয়েছে!" };

    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "এনআইডি নম্বর সেভ করতে সমস্যা হয়েছে!" };
    }
},

// মাস্টার ডাটার profileSection.nidSection.nidNumber থেকে এনআইডি নম্বর রিড করে আনার ফাংশন
getNidNumberViaApi: function(userId) {
    try {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return { success: false, message: "ইউজার ডেটা পাওয়া যায়নি!" };

        let masterData = JSON.parse(masterDataStr);
        let targetUserObj = null;

        for (const [key, userObj] of Object.entries(masterData)) {
            if (userObj.userId === userId || userObj.userid === userId) {
                targetUserObj = userObj;
                break;
            }
        }

        if (!targetUserObj) return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };

        // nidNumber প্রপার্টি চেক করা
        if (targetUserObj.profileSection && 
            targetUserObj.profileSection.nidSection && 
            targetUserObj.profileSection.nidSection.nidNumber) {
            
            return { 
                success: true, 
                nidNumber: targetUserObj.profileSection.nidSection.nidNumber 
            };
        }

        return { success: false, message: "কোনো এনআইডি নম্বর পাওয়া যায়নি।" };

    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "এনআইডি নম্বর লোড করতে সমস্যা হয়েছে!" };
    }
},

// মাস্টার ডাটার profileSection.nidSection-এর ভেতরে এনআইডি ছবি সেভ করার ফাংশন
saveNidImagesViaApi: function(userId, frontImage, backImage) {
    try {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return { success: false, message: "ইউজার ডেটা পাওয়া যায়নি!" };

        let masterData = JSON.parse(masterDataStr);
        let targetUserObj = null;

        for (const [key, userObj] of Object.entries(masterData)) {
            if (userObj.userId === userId || userObj.userid === userId) {
                targetUserObj = userObj;
                break;
            }
        }

        if (!targetUserObj) return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };

        // ১. profileSection অবজেক্ট না থাকলে তৈরি করে নেওয়া
        if (!targetUserObj.profileSection) {
            targetUserObj.profileSection = {};
        }

        // ২. nidSection না থাকলে তৈরি করে নেওয়া
        if (!targetUserObj.profileSection.nidSection) {
            targetUserObj.profileSection.nidSection = {};
        }

        // ৩. ছবিগুলো nidSection এর ভেতরে সেট করা (যদি নতুন ছবি দেওয়া হয় শুধু তখনই আপডেট হবে)
        if (frontImage) {
            targetUserObj.profileSection.nidSection.frontImage = frontImage;
        }
        if (backImage) {
            targetUserObj.profileSection.nidSection.backImage = backImage;
        }

        // ৪. লোকালস্টোরেজে সম্পূর্ণ মাস্টার ডাটা আপডেট করা
        localStorage.setItem('userMasterData', JSON.stringify(masterData));

        return { success: true, message: "এনআইডি ছবি সফলভাবে সংরক্ষিত হয়েছে!" };

    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "ছবি সেভ করতে সমস্যা হয়েছে!" };
    }
},

// মাস্টার ডাটার profileSection.nidSection থেকে এনআইডি ছবি রিড করে আনার ফাংশন
getNidImagesViaApi: function(userId) {
    try {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return { success: false, message: "ইউজার ডেটা পাওয়া যায়নি!" };

        let masterData = JSON.parse(masterDataStr);
        let targetUserObj = null;

        for (const [key, userObj] of Object.entries(masterData)) {
            if (userObj.userId === userId || userObj.userid === userId) {
                targetUserObj = userObj;
                break;
            }
        }

        if (!targetUserObj) return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };

        // frontImage ও backImage চেক করা
        if (targetUserObj.profileSection && 
            targetUserObj.profileSection.nidSection) {
            
            const nidData = targetUserObj.profileSection.nidSection;
            return { 
                success: true, 
                frontImage: nidData.frontImage || null, 
                backImage: nidData.backImage || null 
            };
        }

        return { success: false, message: "কোনো ছবি পাওয়া যায়নি।" };

    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "ছবি লোড করতে সমস্যা হয়েছে!" };
    }
},

    // নতুন ইমেইল সেভ করার ফাংশন
    saveUserEmailViaApi: function(userId, newEmail) {
        try {
            const masterDataStr = localStorage.getItem('userMasterData');
            if (!masterDataStr) return { success: false, message: "ইউজার ডেটা পাওয়া যায়নি!" };

            let masterData = JSON.parse(masterDataStr);
            let targetUserObj = null;

            for (const [key, userObj] of Object.entries(masterData)) {
                if (userObj.userId === userId || userObj.userid === userId) {
                    targetUserObj = userObj;
                    break;
                }
            }

            if (!targetUserObj) return { success: false, message: "ইউজার খুঁজে পাওয়া যায়নি!" };

            // profileSection অবজেক্ট না থাকলে তৈরি করে নেওয়া
            if (!targetUserObj.profileSection) {
                targetUserObj.profileSection = {};
            }

            // ইমেইল সেভ করা
            targetUserObj.profileSection.email = newEmail;

            // লোকালস্টোরেজে আপডেট করা
            localStorage.setItem('userMasterData', JSON.stringify(masterData));

            return { success: true, message: "ইমেইল সফলভাবে সংরক্ষিত হয়েছে" };

        } catch (error) {
            console.error("API Error:", error);
            return { success: false, message: "সার্ভারে ডেটা সেভ করতে সমস্যা হয়েছে।" };
        }
    },

// ইউজার প্রোফাইল আপডেট বা ফোন নম্বর সেভ করার ফাংশন
    updateUserProfilePhone: function(userId, phoneNo) {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr || !userId) return { success: false, message: "User not found" };

        try {
            const masterData = JSON.parse(masterDataStr);
            let userDataObj = null;

            // বর্তমান ইউজারের অবজেক্ট খুঁজে বের করা
            for (const [key, obj] of Object.entries(masterData)) {
                if (obj.userId === userId) {
                    userDataObj = obj;
                    break;
                }
            }

            if (userDataObj) {
                // 'profileSection' ফোল্ডার না থাকলে তৈরি করা
                if (!userDataObj.profileSection) {
                    userDataObj.profileSection = {};
                }

                // ফোন নম্বর সেভ করা
                userDataObj.profileSection.phone = phoneNo;

                // লোকাল স্টোরেজ আপডেট করা (ভবিষ্যতে এখানে এপিআই কল ফেচ হবে)
                localStorage.setItem('userMasterData', JSON.stringify(masterData));
                return { success: true, message: "Profile updated successfully" };
            }
            return { success: false, message: "User data object not found" };
        } catch (error) {
            console.error("API Error:", error);
            return { success: false, message: "Something went wrong" };
        }
    },

// মোবাইল নম্বর ডুপ্লিকেট চেক করার ফাংশন
    checkPhoneDuplicate: function(userId, phoneNo) {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return { isDuplicate: false };

        try {
            const masterData = JSON.parse(masterDataStr);

            for (const [key, obj] of Object.entries(masterData)) {
                // বর্তমান ইউজারের নিজের ডেটা বাদ দিয়ে অন্যদের সাথে চেক করা
                if (obj.userId !== userId) {
                    const isKeyMatch = (key === phoneNo);
                    const isValueMatch = obj.profileSection && obj.profileSection.phone === phoneNo;

                    if (isKeyMatch || isValueMatch) {
                        return { isDuplicate: true };
                    }
                }
            }
            return { isDuplicate: false };
        } catch (error) {
            console.error("API Error:", error);
            return { isDuplicate: false };
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


