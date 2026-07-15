
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