window.addToWishlist = function(jobData) {
    const urlParams = new URLSearchParams(window.location.search);
    const urlUserId = urlParams.get('id');
    
    if (!urlUserId || !jobData || !jobData.jobId) return;

    let userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
    let targetUserKey = null;

    for (let key in userMasterData) {
        if (userMasterData[key].userId === urlUserId || key === urlUserId) {
            targetUserKey = key;
            break;
        }
    }

    if (targetUserKey) {
        if (!userMasterData[targetUserKey].jobSection) userMasterData[targetUserKey].jobSection = {};
        if (!userMasterData[targetUserKey].jobSection.wishlistJobs) userMasterData[targetUserKey].jobSection.wishlistJobs = {};

        // চেক করা ইতিমধ্যে সেভ আছে কি না
        if (userMasterData[targetUserKey].jobSection.wishlistJobs[jobData.jobId]) {
            if (typeof showToast === 'function') showToast("এই কাজটি ইতিমধ্যে আপনার উইশলিস্টে সংরক্ষিত আছে!", "error");
            return;
        }

        // নতুন সেভ করা
        userMasterData[targetUserKey].jobSection.wishlistJobs[jobData.jobId] = {
            jobId: jobData.jobId,
            name: jobData.name || "-",
            categoryName: jobData.categoryName || "-",
            location: jobData.location || "-",
            fixedLocation: jobData.fixedLocation || "-",
            unit: jobData.unit || "-",
            dateTime: jobData.dateTime || "-",
            problemDetails: jobData.problemDetails || "-",
            clientUserId: jobData.userId || "-",
            logo: jobData.logo || jobData.image || ""
        };

        localStorage.setItem('userMasterData', JSON.stringify(userMasterData));
        if (typeof showToast === 'function') showToast("সফলভাবে কাজটি উইশলিস্টে সংরক্ষণ করা হয়েছে!", "success");
    }
};

window.TechnicianWishlistAPI = {
    getWishlistJobs: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlUserId = urlParams.get('id');

        let userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        let targetUserKey = null;

        for (let key in userMasterData) {
            if (userMasterData[key].userId === urlUserId || key === urlUserId) {
                targetUserKey = key;
                break;
            }
        }

        if (targetUserKey && userMasterData[targetUserKey].jobSection && userMasterData[targetUserKey].jobSection.wishlistJobs) {
            let wishlistJobs = userMasterData[targetUserKey].jobSection.wishlistJobs;
            
            // ১. সমস্ত ক্লায়েন্টের postedJobs থেকে একটি কমপ্লিট ভ্যালিড জব আইডি লিস্ট বা কালেকশন তৈরি করা
            let allPostedJobIds = {};
            for (let key in userMasterData) {
                let user = userMasterData[key];
                // যদি ইউজার ক্লায়েন্ট হয় এবং তার postedJobs থাকে
                if (user.jobSection && user.jobSection.postedJobs) {
                    for (let jobId in user.jobSection.postedJobs) {
                        allPostedJobIds[jobId] = true;
                    }
                }
            }

            let isUpdated = false;

            // ২. উইশলিস্টের প্রতিটি জব চেক করা যে সেটি কোনো না কোনো ক্লায়েন্টের postedJobs-এ আছে কি না
            for (let jobId in wishlistJobs) {
                if (!allPostedJobIds[jobId]) {
                    // যদি মূল postedJobs-এ জবটি না থাকে, তবে উইশলিস্ট থেকে মুছে ফেলা হবে
                    delete wishlistJobs[jobId];
                    isUpdated = true;
                }
            }

            // ৩. যদি কোনো জব ডিলিট হয়ে থাকে, তবে লোকালস্টোরেজ আপডেট করে দেওয়া
            if (isUpdated) {
                localStorage.setItem('userMasterData', JSON.stringify(userMasterData));
            }

            return Object.values(wishlistJobs);
        }

        return [];
    },

    // উইশলিস্ট থেকে ডিলিট করার এপিআই (যেমনটি আপনার কোডে আছে)
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
            }
        }
        return false;
    }
};

window.TechnicianApplyAPI = {
    
    checkTechnicianNid: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlUserId = urlParams.get('id');

        if (!urlUserId) {
            return { isValid: false, message: "ইউজার আইডি পাওয়া যায়নি!" };
        }

        let userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        let targetUser = null;
        let targetKey = null;

        for (let key in userMasterData) {
            const user = userMasterData[key];
            if (key === urlUserId || user.userId === urlUserId) {
                targetUser = user;
                targetKey = key;
                break;
            }
        }

        

        if (targetUser) {
            const isMatch = (targetKey === urlUserId) || (targetUser.userId === urlUserId);
            
            if (!isMatch) {
                return { isValid: false, message: "ইউজার ভেরিফিকেশন ব্যর্থ হয়েছে!" };
            }

            const hasProfile = !!targetUser.profileSection;
            const hasNid = hasProfile && !!targetUser.profileSection.nidSection;

            if (!hasProfile || !hasNid) {
                return { 
                    isValid: false, 
                    message: "প্রথমে আপনার প্রোফাইল এবং NID সেকশন আপডেট করুন!" 
                };
            }

            return { isValid: true, userKey: targetKey, userData: targetUser };
        }

        return { isValid: false, message: "ডাটাবেজে এই ইউজারের কোনো সঠিক তথ্য পাওয়া যায়নি!" };
    },
submitProposal: function(proposalData, jobId) {
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

    if (!targetUser) return false;

    // ওয়ালেট ব্যালেন্স এবং ফ্লাগ চেক
    if (targetUser.myWallet) {
        const wallet = targetUser.myWallet;
        const currentBalance = Number(wallet.balance) || 0;
        const balanceFlag = Number(wallet.balanceCheckFlag) !== undefined ? Number(wallet.balanceCheckFlag) : 3;

        if (currentBalance <= 0 && balanceFlag <= 0) {
            if (typeof showToast === 'function') {
                showToast("আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। দয়া করে ব্যালেন্স রিচার্জ করুন।", "error");
            } else {
                alert("আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। দয়া করে ব্যালেন্স রিচার্জ করুন।");
            }
            return false;
        }
    }

    // jobSection এবং appliedProposal ইনিশিয়ালাইজ করা
    if (!targetUser.jobSection) {
        targetUser.jobSection = {};
    }
    
    if (!targetUser.jobSection.appliedProposal || typeof targetUser.jobSection.appliedProposal !== 'object' || Array.isArray(targetUser.jobSection.appliedProposal)) {
        targetUser.jobSection.appliedProposal = {};
    }

    // একই জব আইডিতে ইতিপূর্বে প্রপোজাল জমা দেওয়া থাকলে সাবমিট হবে না
    if (targetUser.jobSection.appliedProposal[jobId]) {
        if (typeof showToast === 'function') {
            showToast("আপনি এই জবটিতে ইতিমধ্যে প্রপোজাল জমা দিয়েছেন!", "error");
        } else {
            alert("আপনি এই জবটিতে ইতিমধ্যে প্রপোজাল জমা দিয়েছেন!");
        }
        return false;
    }

    // ইউজারের প্রোফাইল থেকে নাম, ইউআইডি ও ছবি সংগ্রহ করা
    const userName = targetUser.name || "";
    const userId = targetUser.userId || "";
    const profileImage = targetUser.profileSection && targetUser.profileSection.profileImage ? targetUser.profileSection.profileImage : null;

    // সরাসরি jobID-কে মূল কি (Key) বানিয়ে তার ভেতরে দুটি সেকশন সেট করা
    targetUser.jobSection.appliedProposal[jobId] = {
        applicantIdentification: {
            name: userName,
            userId: userId,
            profileImage: profileImage
        },

    // ক্লায়েন্টের তথ্যগুলো এখানে যুক্ত করে দিন
    clientIdentification: {
        name: currentJob.name || "",
        userId: currentJob.userId || "",
        profileImage: currentJob.logo || ""
    },
       proposalDetails: proposalData,
       jobDetails: currentJob || {},
        isRead: false,
        isAccepted: ""
    };

    // লোকালস্টোরেজে ডেটা সেভ করা
    userMasterData[targetUserKey] = targetUser;
    localStorage.setItem('userMasterData', JSON.stringify(userMasterData));

    if (typeof showToast === 'function') {
        showToast("আপনার প্রপোজাল সফলভাবে জমা হয়েছে!", "success");
    }

    return true;
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

        let userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        let targetUserKey = null;

        // নির্দিষ্ট ইউজারের চাবি বা কি (key) খুঁজে বের করা
        for (let key in userMasterData) {
            const user = userMasterData[key];
            if (key === urlUserId || (user && user.userSession && user.userSession.userId === urlUserId) || (user && user.userSection && user.userSection.userId === urlUserId) || (user && user.userId === urlUserId)) {
                targetUserKey = key;
                break;
            }
        }

        if (targetUserKey && userMasterData[targetUserKey].jobSection && userMasterData[targetUserKey].jobSection.appliedProposal) {
            let appliedProposals = userMasterData[targetUserKey].jobSection.appliedProposal;

            // ১. সমস্ত ক্লায়েন্টের postedJobs থেকে একটি কমপ্লিট ভ্যালিড জব আইডি লিস্ট বা কালেকশন তৈরি করা
            let allPostedJobIds = {};
            for (let key in userMasterData) {
                let user = userMasterData[key];
                if (user.jobSection && user.jobSection.postedJobs) {
                    for (let jobId in user.jobSection.postedJobs) {
                        allPostedJobIds[jobId] = true;
                    }
                }
            }

            let isUpdated = false;

            // ২. appliedProposal এর প্রতিটি জব চেক করা যে সেটি কোনো না কোনো ক্লায়েন্টের postedJobs-এ আছে কি না
            for (let jobId in appliedProposals) {
                // যদি মূল postedJobs-এ জবটি না থাকে, তবে প্রপোজাল লিস্ট থেকে মুছে ফেলা হবে
                if (!allPostedJobIds[jobId]) {
                    delete appliedProposals[jobId];
                    isUpdated = true;
                }
            }

            // ৩. যদি কোনো প্রপোজাল ডিলিট হয়ে থাকে, তবে লোকালস্টোরেজ আপডেট করে দেওয়া
            if (isUpdated) {
                localStorage.setItem('userMasterData', JSON.stringify(userMasterData));
            }

            return appliedProposals;
        }

        return {};
    } catch (error) {
        console.error("প্রপোজাল ডেটা ফেচ করতে সমস্যা হয়েছে:", error);
        return {};
    }
}



// API File: প্রপোজাল ডিলিট করার মূল লজিক
function apiDeleteProposal(jobId) {
    try {
        // URL থেকে ইউজার আইডি বা টেকনিশিয়ান আইডি বের করা (যদি ইউআরএলে আইডি থাকে যেমন: ?id=01971945611 বা অনুরূপ)
        const urlParams = new URLSearchParams(window.location.search);
        const urlTechId = urlParams.get('id') || urlParams.get('techId') || urlParams.get('phone');

        // লোকালস্টোরেজ থেকে userMasterData ফেচ করা
        let userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        let deleted = false;

        // যদি ইউআরএলে নির্দিষ্ট আইডি পাওয়া যায়, সরাসরি সেই ইউজারের অবজেক্টে ঢুকব
        if (urlTechId && userMasterData[urlTechId]) {
            const userData = userMasterData[urlTechId];
            if (userData.jobSection && userData.jobSection.appliedProposal && userData.jobSection.appliedProposal[jobId]) {
                
                // অতিরিক্ত সুরক্ষা: ভেতরের applicantIdentification-এর userId বা key এর সাথে ইউআরএলের আইডি মিলছে কিনা দেখা
                const proposalObj = userData.jobSection.appliedProposal[jobId];
                
                // প্রপোজাল ডিলিট করা
                delete userData.jobSection.appliedProposal[jobId];
                deleted = true;
            }
        } else {
            // যদি ইউআরএলে আইডি না থাকে, সব ইউজার স্ক্যান করে যার ভেতরে এই jobId ও applicantIdentification ম্যাচ করে তাকে ডিলিট করব
            for (let userKey in userMasterData) {
                const userData = userMasterData[userKey];
                if (userData.jobSection && userData.jobSection.appliedProposal && userData.jobSection.appliedProposal[jobId]) {
                    
                    // এখানে চাইলে প্রোফাইল বা অ্যাপ্লিকেন্ট আইডি চেক করতে পারেন
                    delete userData.jobSection.appliedProposal[jobId];
                    deleted = true;
                    break;
                }
            }
        }

        if (deleted) {
            // লোকালস্টোরেজ আপডেট করা
            localStorage.setItem('userMasterData', JSON.stringify(userMasterData));
            return { success: true, message: "প্রপোজাল সফলভাবে ডিলিট করা হয়েছে।" };
        } else {
            return { success: false, message: "সংশ্লিষ্ট প্রপোজালটি খুঁজে পাওয়া যায়নি।" };
        }

    } catch (error) {
        console.error("API Error deleting proposal:", error);
        return { success: false, message: "সার্ভার বা লোকালস্টোরেজ ত্রুটি।" };
    }
}

function getRunningJobsList() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlUserId = urlParams.get('id');

        let userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        let targetUserKey = null;

        // ১. সঠিক ইউজারের চাবি (key) খুঁজে বের করা (যেমন: 01971945611)
        for (let key in userMasterData) {
            let user = userMasterData[key];
            if (key === urlUserId || (user && user.userId === urlUserId) || (user && user.userSession && user.userSession.userId === urlUserId)) {
                targetUserKey = key;
                break;
            }
        }

        // ২. যদি ইউজার পাওয়া যায় এবং তার ভেতর jobSection ও runningJobs থাকে
        if (targetUserKey && userMasterData[targetUserKey].jobSection && userMasterData[targetUserKey].jobSection.runningJobs) {
            return userMasterData[targetUserKey].jobSection.runningJobs; // সরাসরি runningJobs অবজেক্ট রিটার্ন করবে
        }

        return {};
    } catch (error) {
        console.error("রানিং জবস ফেচ করতে সমস্যা হয়েছে:", error);
        return {};
    }
}