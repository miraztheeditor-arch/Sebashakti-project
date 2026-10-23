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

function getApplicantsByJobId(targetJobId) {
    try {
        const masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return [];

        const masterData = JSON.parse(masterDataStr);
        let matchedApplicants = [];

        for (const [userKey, userObj] of Object.entries(masterData)) {
            // সেফ চেক: ইউজার অবজেক্ট, রোল এবং জব সেকশন নিরাপদ রাখা
            if (userObj && userObj.role === 'technician' && userObj.jobSection && userObj.jobSection.appliedProposal) {
                const appliedProposals = userObj.jobSection.appliedProposal;

                // যদি নির্দিষ্ট জব আইডি মিলে যায়
                if (appliedProposals && appliedProposals[targetJobId]) {
                    const proposalData = appliedProposals[targetJobId];

                    // চেক করুন: যদি isAccepted স্ট্যাটাস false হয়, তবে এটি লিস্টে দেখাবে না
    if (proposalData.isAccepted !== false && proposalData.isAccepted !== "false" && proposalData.isAccepted !== true && proposalData.isAccepted !== "true") {
                    
                    // সেফ ডেটা এক্সট্রাকশন (ডাটা না থাকলেও যেন এরর না দেয়)
                    const applicantInfo = proposalData.applicantIdentification || {};
                    const propDetails = proposalData.proposalDetails || proposalData; // যদি সরাসরি প্রপোজালের ভেতরেই প্রপার্টি থাকে

                    const name = applicantInfo.name || userObj.profileSection?.name || userObj.name || "টেকনিশিয়ান";
                    
                    // ইমেজ সেফ চেক
                    const profileImg = applicantInfo.profileImage?.imageString 
                        || userObj.profileSection?.profileImage?.imageString 
                        || 'images/default-avatar.png';

// প্রপোজাল ডিটেলস থেকে সব ডেটা সঠিকভাবে সংগ্রহ করে পুশ করা
        const laborCost = propDetails.laborCost || "";
        const materialCost = propDetails.materialCost || propDetails.materialResponsibility || "";
        const cancellationFee = propDetails.cancellationFee || "";
        const estimatedTime = propDetails.estimatedTime || "";
        const coverLetter = propDetails.coverLetter || "";
        const appliedAt = propDetails.appliedAt || "";

        matchedApplicants.push({
            applicantId: userKey,
            applicantIdentification: { 
                name: name, 
                userId: applicantInfo.userId, // সঠিক টেকনিশিয়ান আইডি (UID) নেওয়ার জন্য
                profileImage: profileImg 
            },
            proposalDetails: { 
                laborCost, 
                materialCost, 
                cancellationFee, 
                estimatedTime, 
                coverLetter, 
                appliedAt
            }
        });
                }
            }
        }
    }

        return matchedApplicants;
    } catch (error) {
        console.error("আবেদনকারী ডেটা ফেচ করতে সমস্যা হয়েছে:", error);
        return [];
    }
}

window.updateProposalReadStatus = function(jobId, applicantId) {
    try {
        let masterDataStr = localStorage.getItem('userMasterData');
        if (!masterDataStr) return;

        let masterData = JSON.parse(masterDataStr);
        let isUpdated = false;

        // সমস্ত ইউজারের ডেটার মধ্যে লুপ চালিয়ে জবের প্রপোজাল খুঁজে বের করা
        for (let userKey in masterData) {
            let userObj = masterData[userKey];
            
            // চেক করা হচ্ছে ইউজার অবজেক্টের ভেতর jobSection এবং appliedProposal আছে কি না
            if (userObj && userObj.jobSection && userObj.jobSection.appliedProposal) {
                let appliedProposals = userObj.jobSection.appliedProposal;
                
                // যদি নির্দিষ্ট jobId মিলে যায়
                if (appliedProposals[jobId]) {
                    let proposal = appliedProposals[jobId];
                    
                    // applicantIdentification অথবা সরাসরি ইউজার আইডি দিয়ে ম্যাচ করানো
                    if (proposal.applicantIdentification && 
                        (proposal.applicantIdentification.userId === applicantId || userKey === applicantId)) {
                        
                        proposal.isRead = true;
                        isUpdated = true;
                    }
                }
            }
        }

        // যদি আপডেট সফল হয়, তবে লোকাল স্টোরেজে সেভ করা
        if (isUpdated) {
            localStorage.setItem('userMasterData', JSON.stringify(masterData));
            console.log("Proposal read status updated successfully!");
        }
    } catch (error) {
        console.error("Error updating proposal read status:", error);
    }
};

function rejectProposal(jobId, applicantId) {
    try {
        let userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        let updated = false;

        // ১. সব ইউজারের ওপর লুপ চালানো
        for (let userKey in userMasterData) {
            let userData = userMasterData[userKey];

            if (userData.jobSection && userData.jobSection.appliedProposal) {
                let proposals = userData.jobSection.appliedProposal;

                // ২. appliedProposal এর প্রতিটা আইটেম চেক করা
                for (let propKey in proposals) {
                    let proposal = proposals[propKey];
                    let currentJobId = proposal.jobId || propKey;

                    // ৩. জব আইডি মিলে গেলে
                    if (currentJobId === jobId) {
                        
                        // ৪. ইউজারের মূল কী (userKey) অথবা প্রপোজালের ভেতরের applicantIdentification.userId এর সাথে মেলানো
                        let targetAppId = proposal.applicantIdentification ? proposal.applicantIdentification.userId : null;

                        // নির্দিষ্ট applicantId বা userKey এর সাথে মিললে তবেই রিজেক্ট হবে
                        if (!applicantId || targetAppId === applicantId || userKey === applicantId || proposal.applicantId === applicantId) {
                            proposal.isAccepted = false; // মান false করে দেওয়া
                            updated = true;
                            break;
                        }
                    }
                }
            }
            if (updated) break;
        }

        // ৫. লোকালস্টোরেজ আপডেট করা
        if (updated) {
            localStorage.setItem('userMasterData', JSON.stringify(userMasterData));
            return { success: true, message: "টেকনিশিয়ানের আবেদন সফলভাবে রিজেক্ট করা হয়েছে!" };
        } else {
            return { success: false, message: "সংশ্লিষ্ট প্রপোজালটি খুঁজে পাওয়া যায়নি!" };
        }
    } catch (error) {
        console.error("API Error rejecting proposal:", error);
        return { success: false, message: "সার্ভার বা লোকালস্টোরেজে ত্রুটি!" };
    }
}

function acceptProposal(jobId, applicantId) {
    try {
        let userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        let updated = false;

        // ১. সব ইউজারের ওপর লুপ চালানো
        for (let userKey in userMasterData) {
            let userData = userMasterData[userKey];

            if (userData.jobSection && userData.jobSection.appliedProposal) {
                let proposals = userData.jobSection.appliedProposal;

                // ২. appliedProposal এর প্রতিটা আইটেম চেক করা
                for (let propKey in proposals) {
                    let proposal = proposals[propKey];
                    let currentJobId = proposal.jobId || propKey;

                    // ৩. জব আইডি মিলে গেলে
                    if (currentJobId === jobId) {
                        
                        // ৪. ইউজারের মূল কী (userKey) অথবা প্রপোজালের ভেতরের applicantIdentification.userId এর সাথে মেলানো
                        let targetAppId = proposal.applicantIdentification ? proposal.applicantIdentification.userId : null;

                        // নির্দিষ্ট applicantId বা userKey এর সাথে মিললে তবেই রিজেক্ট হবে
                        if (!applicantId || targetAppId === applicantId || userKey === applicantId || proposal.applicantId === applicantId) {
                            proposal.isAccepted = true; // মান true করে দেওয়া

                            // নতুন acceptedDetails অবজেক্ট তৈরি
                            const now = new Date();
                            proposal.acceptedDetails = {
                                acceptedAt: now.toISOString(),
                                date: now.toLocaleDateString(),
                                time: now.toLocaleTimeString()
                            };

                            // runningJobs চেক ও ডেটা সেভ করার লজিক
                        if (!userData.jobSection.runningJobs) {
                                userData.jobSection.runningJobs = {};
                            }
                            userData.jobSection.runningJobs[jobId] = { ...proposal };

                            updated = true;
                            break;
                        }
                    }
                }
            }
            if (updated) break;
        }

        // ৫. লোকালস্টোরেজ আপডেট করা
        if (updated) {
            localStorage.setItem('userMasterData', JSON.stringify(userMasterData));
            return { success: true, message: "টেকনিশিয়ানের আবেদন সফলভাবে Accept করা হয়েছে!" };
        } else {
            return { success: false, message: "সংশ্লিষ্ট প্রপোজালটি খুঁজে পাওয়া যায়নি!" };
        }
    } catch (error) {
        console.error("API Error rejecting proposal:", error);
        return { success: false, message: "সার্ভার বা লোকালস্টোরেজে ত্রুটি!" };
    }
}