// technician-find-job-api.js - ডেডিকেটেড ফাইন্ড জব এপিআই ফাইল
const TechnicianFindJobAPI = {
    formatDateTime(isoString) {
        if (!isoString) return "সম্প্রতি";
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return isoString;
            
            let day = date.getDate();
            let monthNames = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
            let month = monthNames[date.getMonth()];
            let year = date.getFullYear();
            
            let hours24 = date.getHours();
            let hours = hours24 % 12;
            hours = hours ? hours : 12; 
            
            let minutes = date.getMinutes();
            let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            
            let ampm = hours24 >= 12 ? 'PM' : 'AM';

            return `${day} ${month}, ${year} ${hours}:${formattedMinutes} ${ampm}`;
        } catch (e) {
            return isoString;
        }
    },

    getAllPostedJobs() {
        let allPostedJobsList = [];

        try {
            const rawUserData = localStorage.getItem('userMasterData');
            if (!rawUserData) return [];

            const userMasterData = JSON.parse(rawUserData);

            for (let phoneKey in userMasterData) {
                const userObj = userMasterData[phoneKey];

                if (userObj.jobSection && userObj.jobSection.postedJobs) {
                    const postedJobsObj = userObj.jobSection.postedJobs;

                    // প্রোফাইল সেকশন থেকে ইমেজ স্ট্রিং বের করার লজিক
                    let logoUrl = "";
                    if (userObj.profileSection && userObj.profileSection.profileImage && userObj.profileSection.profileImage.imageString) {
                        logoUrl = userObj.profileSection.profileImage.imageString;
                    }

                    for (let jobIdKey in postedJobsObj) {
                        const jobData = postedJobsObj[jobIdKey];
                        
                        let rawLocation = jobData.fixedLocation || "ঠিকানা দেওয়া হয়নি";
                        let finalLocation = rawLocation.length > 19 ? rawLocation.substring(0, 19) + "..." : rawLocation;

                            // ক্লায়েন্টের প্রোফাইল থেকে উপজেলা বের করার লজিক (যদি profileSection থাকে)
                         let clientUpazila = "";
                         if (userObj.profileSection && userObj.profileSection.upazila) {
                             clientUpazila = userObj.profileSection.upazila;
                         }

                         

                        allPostedJobsList.push({
                            name: jobData.userName || userObj.name || "অজানা ব্যবহারকারী",
                            fixedLocation: finalLocation,
                            currentLocation: jobData.currentLocation || "দেওয়া হয়নি", // <--- কারেন্ট লোকেশন যোগ করা হলো
                            problemDetails: jobData.problemDetails || "কোনো বিবরণ নেই", // <--- প্রবলেম ডিটেইলস যোগ করা হলো
                            upazila: clientUpazila,
                            categoryKey: jobData.workCategory || "others",
                            categoryName: jobData.workCategory || "সাধারণ সেবা",
                            unit: (jobData.unitCount || 1) + " ইউনিট",
                            dateTime: this.formatDateTime(jobData.createdAt),
                            jobId: jobData.jobId || jobIdKey,
                            logo: logoUrl,
                            userId: userObj.userId // <--- সরাসরি userObj থেকে ইউজার আইডি নেওয়া হলো 
                           
                        });
                    }
                }
            }
        } catch (error) {
            console.error("এপিআই ডাটা প্রসেস করতে সমস্যা হয়েছে:", error);
        }

        return allPostedJobsList;
    }
};

/**
 * ইউআরএল-এর ইউআইডি (যেমন ?id=TECH-18347695) ধরে userMasterData থেকে উপজেলা ফেচ করার ফাংশন
 * @returns {string|null} উপজেলা পেলে স্ট্রিং (যেমন "শিবচর"), না পেলে null বা ফাঁকা স্ট্রিং
 */
function getTechnicianUpazilaFromUrl() {
    // ১. পেজ ইউআরএল থেকে 'id' বা 'TECH' বা 'phone' প্যারামিটার সংগ্রহ করা
    const urlParams = new URLSearchParams(window.location.search);
    const currentTechId = urlParams.get('id') || urlParams.get('TECH') || urlParams.get('phone');

    if (!currentTechId) {
        console.warn("ইউআরএল-এ কোনো আইডি বা প্যারামিটার পাওয়া যায়নি!");
        return null;
    }

    // ২. localStorage থেকে userMasterData পার্স করে আনা (যেখানে মূল কী হলো ফোন নম্বর/ইমেইল)
    const userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};

    let matchedUserData = null;

    // ৩. মাস্টার ডাটার মূল কী (ফোন/ইমেইল) অথবা ভেতরের `userId` চেক করে ইউজার অবজেক্ট খুঁজে বের করা
    for (let phoneOrEmailKey in userMasterData) {
        const userData = userMasterData[phoneOrEmailKey];
        
        // ইউআরএল-এর আইডি যদি মেইন কী অথবা ভেতরের userId এর সাথে মিলে যায়
        if (phoneOrEmailKey === currentTechId || userData.userId === currentTechId) {
            matchedUserData = userData;
            break; 
        }
    }

    // ৪. যদি ইউজার ডেটাই না পাওয়া যায়
    if (!matchedUserData) {
        console.warn("masterData-তে এই আইডির বিপরীতে কোনো ইউজার পাওয়া যায়নি:", currentTechId);
        return null;
    }

    // ৫. প্রোফাইল সেকশন চেক করা
    if (!matchedUserData.profileSection) {
        
        return null;
    }

    // ৬. প্রোফাইল সেকশনের ভেতরে উপজেলা চেক করা
    if (!matchedUserData.profileSection.upazila) {
        console.warn("প্রোফাইল সেকশনে কোনো উপজেলা (upazila) সেট করা নেই!");
        return ""; // প্রোফাইল আছে কিন্তু উপজেলা ফিল্ড খালি থাকলে
    }

    // সফলভাবে উপজেলা পাওয়া গেলে সেটি রিটার্ন করা
    const technicianUpazila = matchedUserData.profileSection.upazila;
    
    
    return technicianUpazila;
}

