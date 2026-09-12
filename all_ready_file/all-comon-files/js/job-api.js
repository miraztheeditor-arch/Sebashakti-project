// job-api.js - ডেডিকেটেড জব এপিআই ফাইল

const JobAPI = {
    async saveJob(targetUserId, jobData) {
        try {
            let masterData = JSON.parse(localStorage.getItem('userMasterData')) || {};

            let foundUserKey = null;

            if (masterData[targetUserId]) {
                foundUserKey = targetUserId;
            } else {
                for (let key in masterData) {
                    if (masterData[key].userId === targetUserId || key === targetUserId) {
                        foundUserKey = key;
                        break;
                    }
                }
            }

            if (!foundUserKey || !masterData[foundUserKey]) {
                throw new Error("ইউজার ডাটা খুঁজে পাওয়া যায়নি!");
            }

            // প্রোফাইল ভেরিফিকেশন চেক
            const userProfile = masterData[foundUserKey].profileSection;
            
            if (!userProfile || !userProfile.nidSection) {
                // একটি স্পেশাল কিওয়ার্ড সহ এরর থ্রো করা হচ্ছে যাতে ফ্রন্টএন্ড বুঝতে পারে এটি প্রোফাইল আপডেটের মোডাল দেখানোর সিগন্যাল
                throw new Error("PROFILE_INCOMPLETE:আপনার প্রোফাইল এখনো সম্পূর্ণ নয়! কাজ পোস্ট করার আগে এনআইডি সহ অন্যান্য তথ্য দিয়ে প্রোফাইল আপডেট করুন।");
            }

            if (!masterData[foundUserKey].jobSection) {
                masterData[foundUserKey].jobSection = {};
            }

            if (!masterData[foundUserKey].jobSection.postedJobs) {
                masterData[foundUserKey].jobSection.postedJobs = {};
            }

            const uniqueJobId = 'job_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            
            const finalJobPayload = {
                jobId: uniqueJobId,
                userName: masterData[foundUserKey].name || "Unknown",
                fixedLocation: `${userProfile.upazila}, ${userProfile.district}`,
                ...jobData,
                createdAt: new Date().toISOString()
            };

            masterData[foundUserKey].jobSection.postedJobs[uniqueJobId] = finalJobPayload;

            localStorage.setItem('userMasterData', JSON.stringify(masterData));

            return { success: true, message: "জব সফলভাবে সেভ হয়েছে!", jobId: uniqueJobId };

        } catch (error) {
            console.error("Job API Error:", error);
            throw error;
        }
    },

    getJobs(targetUserId) {
        try {
            let masterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
            let foundUserKey = null;

            // ইউজার খোঁজার সঠিক লজিক
            if (masterData[targetUserId]) {
                foundUserKey = targetUserId;
            } else {
                for (let key in masterData) {
                    if (masterData[key].userId === targetUserId || key === targetUserId) {
                        foundUserKey = key;
                        break;
                    }
                }
            }

            if (!foundUserKey) {
                return { success: false, postedJobs: {} };
            }

            const userSection = masterData[foundUserKey];
            if (userSection?.jobSection?.postedJobs) {
                return { success: true, postedJobs: userSection.jobSection.postedJobs };
            }

            return { success: true, postedJobs: {} };
        } catch (error) {
            console.error("Job API Get Error:", error);
            throw error;
        }
    },


    
// ড্রাফট জব সেভ করার ফাংশন
    saveDraftJob(targetUserId, jobData) {
        let masterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        let foundUserKey = null;

        for (let key in masterData) {
            if (masterData[key].userId === targetUserId || key === targetUserId) {
                foundUserKey = key;
                break;
            }
        }

        if (!foundUserKey) {
            throw new Error("ইউজার পাওয়া যায়নি!");
        }
        
        // ১. জব ডাটা থেকে draftId চেক করা (যদি আগে থেকে থাকে সেটাই ব্যবহার হবে, না থাকলে নতুন তৈরি হবে)
    const uniqueDraftId = (jobData && jobData.draftId) ? jobData.draftId : ('draft_' + Date.now());

    const draftPayload = {
        draftId: uniqueDraftId,
        currentLocation: jobData.currentLocation || "",
        workCategory: jobData.workCategory || "",
        unitCount: jobData.unitCount || 1,
        problemDetails: jobData.problemDetails || "",
        // এডিট মোড হলে updatedAt আর নতুন হলে savedAt সেভ হবে
        savedAt: new Date().toISOString()
    };

     
        // ১. জব সেকশন না থাকলে তৈরি করে ড্রাফট সেট করা
        if (!masterData[foundUserKey].jobSection) {
            masterData[foundUserKey].jobSection = {};
            masterData[foundUserKey].jobSection.draftedJobs = {};
            masterData[foundUserKey].jobSection.draftedJobs[uniqueDraftId] = draftPayload;
            
            localStorage.setItem('userMasterData', JSON.stringify(masterData));
            return { success: true, message: "ড্রাফটে সফলভাবে সংরক্ষিত হয়েছে!", draftId: uniqueDraftId };
        }

        // ২. জব সেকশন আছে কিন্তু draftedJobs ফোল্ডার না থাকলে সেটি তৈরি করা
        if (!masterData[foundUserKey].jobSection.draftedJobs) {
            masterData[foundUserKey].jobSection.draftedJobs = {};
            masterData[foundUserKey].jobSection.draftedJobs[uniqueDraftId] = draftPayload;
            
            localStorage.setItem('userMasterData', JSON.stringify(masterData));
            return { success: true, message: "ড্রাফটে সফলভাবে সংরক্ষিত হয়েছে!", draftId: uniqueDraftId };
        }

        // ৩. draftedJobs ফোল্ডার থাকলে ১০টি ড্রাফট পূর্ণ আছে কি না চেক করা
        let draftKeys = Object.keys(masterData[foundUserKey].jobSection.draftedJobs);
        if (draftKeys.length >= 10) {
            throw new Error("সর্বোচ্চ ১০টি ড্রাফট সংরক্ষণ করা সম্ভব। আর ড্রাফট রাখা যাবে না!");
        }

        // ১০টির কম থাকলে ইউনিক আইডি অনুযায়ী ভ্যালু সেট করা
        masterData[foundUserKey].jobSection.draftedJobs[uniqueDraftId] = draftPayload;
        localStorage.setItem('userMasterData', JSON.stringify(masterData));

        return { success: true, message: "ড্রাফটে সফলভাবে সংরক্ষিত হয়েছে!", draftId: uniqueDraftId };
    }
};

function getDraftJobsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserid = urlParams.get('id'); // যেমন: CLT-97005341

    if (!targetUserid) return [];

    const masterDataStr = localStorage.getItem('userMasterData');
    if (!masterDataStr) return [];

    let masterData = JSON.parse(masterDataStr);
    let targetUserObj = null;

    // মাস্টার ডাটার ভেতর লুপ চালিয়ে ইউজারের অবজেক্ট খুঁজে বের করা
    for (const [key, userObj] of Object.entries(masterData)) {
        // ১. যদি কী (Key) সরাসরি ম্যাচ করে অথবা ভেতরের কোনো প্রপার্টিতে আইডি থাকে
        if (key === targetUserid || 
            (userObj && userObj.userid === targetUserid) || 
            (userObj && JSON.stringify(userObj).includes(targetUserid))) {
            targetUserObj = userObj;
            break;
        }
    }

    if (!targetUserObj) {
        return [];
    }

    // jobSection ও draftedJobs চেক করে ড্রাফটগুলো অ্যারে আকারে রিটার্ন করা
    if (targetUserObj.jobSection && targetUserObj.jobSection.draftedJobs) {
        return Object.values(targetUserObj.jobSection.draftedJobs);
    }

    return [];
}

// ২. নির্দিষ্ট ড্রাফট ডিলিট করার শক্তিশালী ফাংশন
function deleteDraftJob(draftId) {
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserid = urlParams.get('id');

    if (!targetUserid || !draftId) return false;

    const masterDataStr = localStorage.getItem('userMasterData');
    if (!masterDataStr) return false;

    let masterData = JSON.parse(masterDataStr);
    let targetUserKey = null;

    // সঠিক ইউজার কী (Key) খুঁজে বের করা
    for (const [key, userObj] of Object.entries(masterData)) {
        if (key === targetUserid || 
            (userObj && userObj.userid === targetUserid) || 
            (userObj && JSON.stringify(userObj).includes(targetUserid))) {
            targetUserKey = key;
            break;
        }
    }

    if (!targetUserKey || !masterData[targetUserKey]) return false;

    let userObj = masterData[targetUserKey];

    if (userObj.jobSection && userObj.jobSection.draftedJobs) {
        let draftedJobs = userObj.jobSection.draftedJobs;

        // অবজেক্ট ফরম্যাটে থাকলে
        if (!Array.isArray(draftedJobs) && typeof draftedJobs === 'object') {
            if (draftedJobs[draftId]) {
                delete draftedJobs[draftId];
                localStorage.setItem('userMasterData', JSON.stringify(masterData));
                return true;
            }
            
            for (const [dKey, dVal] of Object.entries(draftedJobs)) {
                if (dVal && (dVal.draftId === draftId || dKey === draftId)) {
                    delete draftedJobs[dKey];
                    localStorage.setItem('userMasterData', JSON.stringify(masterData));
                    return true;
                }
            }
        } 
        // অ্যারে ফরম্যাটে থাকলে
        else if (Array.isArray(draftedJobs)) {
            const initialLength = draftedJobs.length;
            userObj.jobSection.draftedJobs = draftedJobs.filter(job => job.draftId !== draftId);
            
            if (userObj.jobSection.draftedJobs.length < initialLength) {
                localStorage.setItem('userMasterData', JSON.stringify(masterData));
                return true;
            }
        }
    }

    return false;
}

window.getProfileImageSync = function(userId) {
    try {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return '';
        const masterData = JSON.parse(masterDataStr);
        for (const key in masterData) {
            const userObj = masterData[key];
            if (userObj.userId === userId || key === userId || userObj.phone === userId) {
                return userObj.profileSection?.profileImage?.imageString || '';
            }
        }
    } catch (e) {
        console.error("API Error:", e);
    }
    return '';
};

// নির্দিষ্ট jobId দিয়ে নির্দিষ্ট জব খুঁজে বের করার API ফাংশন
window.getJobDetailsById = function(targetUserId, targetJobId) {
    try {
        let masterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        let foundUserKey = null;

        // ইউজার খুঁজে বের করার লজিক
        if (masterData[targetUserId]) {
            foundUserKey = targetUserId;
        } else {
            for (let key in masterData) {
                if (masterData[key].userId === targetUserId || key === targetUserId) {
                    foundUserKey = key;
                    break;
                }
            }
        }

        if (!foundUserKey) {
            return { success: false, message: "ইউজার পাওয়া যায়নি" };
        }

        const userSection = masterData[foundUserKey];
        const jobSec = userSection.jobSection || userSection.jobsection;

        if (jobSec && jobSec.postedJobs) {
            const postedJobs = jobSec.postedJobs;
            
            // সরাসরি নির্দিষ্ট jobId দিয়ে জব অবজেক্ট খুঁজে বের করা
            for (let jobKey in postedJobs) {
                if (postedJobs[jobKey].jobId === targetJobId) {
                    return {
                        success: true,
                        user: userSection,
                        job: postedJobs[jobKey]
                    };
                }
            }
        }

        return { success: false, message: "এই জব আইডি দিয়ে কোনো জব পাওয়া যায়নি" };
    } catch (error) {
        console.error("API Error:", error);
        return { success: false, error: error.message };
    }
};

window.deleteJobById = function(targetUserId, targetJobId) {
    try {
        let masterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        let foundUserKey = null;

        // ইউজার খুঁজে বের করা
        if (masterData[targetUserId]) {
            foundUserKey = targetUserId;
        } else {
            for (let key in masterData) {
                if (masterData[key].userId === targetUserId || key === targetUserId) {
                    foundUserKey = key;
                    break;
                }
            }
        }

        if (foundUserKey && masterData[foundUserKey].jobSection) {
            let postedJobs = masterData[foundUserKey].jobSection.postedJobs || {};

            // নির্দিষ্ট jobId মিলিয়ে জবটি ডিলিট করা
            let deleted = false;
            for (let jobKey in postedJobs) {
                if (postedJobs[jobKey].jobId === targetJobId) {
                    delete postedJobs[jobKey];
                    deleted = true;
                    break;
                }
            }

            if (deleted) {
                // আপডেট হওয়া ডাটা লোকালস্টোরেজে সেভ করা
                masterData[foundUserKey].jobSection.postedJobs = postedJobs;
                localStorage.setItem('userMasterData', JSON.stringify(masterData));
                return { success: true, message: "পোস্ট সফলভাবে ডিলিট হয়েছে।" };
            } else {
                return { success: false, message: "এই জব আইডিটি পাওয়া যায়নি।" };
            }
        }
        return { success: false, message: "ইউজার ডাটা পাওয়া যায়নি।" };
    } catch (error) {
        console.error("API Delete Error:", error);
        return { success: false, message: "ডিলিট করতে গিয়ে সমস্যা হয়েছে।" };
    }
};