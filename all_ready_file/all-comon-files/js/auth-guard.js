// global-auth.js (সব পেজে শুধু এই একটি ফাইল যুক্ত থাকবে)
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    let currentUserId = urlParams.get('id') || sessionStorage.getItem('liveUserId');

    if (currentUserId) {
        sessionStorage.setItem('liveUserId', currentUserId);

        // গ্লোবালি সব লিংকের সাথে আইডি যুক্ত করে দেওয়া
        document.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes('.html') && !href.includes('id=')) {
                const separator = href.includes('?') ? '&' : '?';
                link.setAttribute('href', `${href}${separator}id=${currentUserId}`);
            }
        });
    } else {
        console.warn("কোনো ইউজার আইডি পাওয়া যায়নি, লগইন পেজে রিডাইরেক্ট করা হতে পারে।");
        // window.location.href = 'login.html';
    }
});
// মাস্টার ডাটা চেক করে রোল অনুযায়ী সঠিক পেজে রিডাইরেক্ট করার ইউনিভার্সাল ক্লিক হ্যান্ডলার
document.addEventListener('click', async function(e) {
    const currentUserId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId');
    
    // যে এলিমেন্টে বা তার কাছাকাছি আইডিতে ক্লিক করা হয়েছে
    const targetElement = e.target.closest('#jobs-btn, #bell-icon, a');
    
    if (targetElement && currentUserId) {
        e.preventDefault(); // ডিফল্ট অ্যাকশন সাময়িক আটকানো
        
// ১. মাস্টার ডাটা থেকে ইউজারের সঠিক রোল চেক করা
let userRole = 'client'; // ডিফল্ট ফলব্যাক

if (typeof UserAPI !== 'undefined' && UserAPI.getUserRoleViaApi) {
    try {
        // অবশ্যই await ব্যবহার করতে হবে কারণ এটি async ফাংশন
        const roleResponse = await UserAPI.getUserRoleViaApi(currentUserId);
        
        console.log("Role Response Check:", roleResponse); // কনসোলে দেখার জন্য

        if (roleResponse && roleResponse.role) {
            userRole = roleResponse.role; // সঠিক রোলটি এখানে এসাইন হবে
        }
    } catch (err) {
        console.error("Role fetch error:", err);
    }
}
        let destinationUrl = "";
        const targetId = targetElement.id;
        
        // ২. জবস বাটন (যেমন: #jobs-btn) ক্লিক করলে রোল অনুযায়ী পেজ নির্ধারণ
        if (targetId === 'jobs-btn' || targetElement.getAttribute('href')?.includes('job')) {
            if (userRole === 'technician') {
                destinationUrl = 'find-jobs.html'; // টেকনিশিয়ান হলে
            } else {
                destinationUrl = 'post-jobs.html';  // ক্লায়েন্ট হলে
            }
        } 
        // ৩. বেল আইকন ক্লিক করলে রোল অনুযায়ী নোটিফিকেশন পেজ নির্ধারণ
        else if (targetId === 'bell-icon') {
            if (userRole === 'technician') {
                destinationUrl = 'bell-icon.html'; // আপনার টেকনিশিয়ান বেল পেজ থাকলে
            } else {
                destinationUrl = 'bell-icon-client.html';     // আপনার ক্লায়েন্ট বেল পেজ থাকলে
            }
        } 
        // ৪. অন্যান্য সাধারণ লিংকের জন্য
        else {
            let href = targetElement.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                destinationUrl = href;
            }
        }
        
        // ৫. ইউআইডি (id) সহ ফাইনাল ইউআরএলে রিডাইরেক্ট করা
        if (destinationUrl) {
            let separator = destinationUrl.includes('?') ? '&' : '?';
            let finalUrl = destinationUrl;
            
            if (!destinationUrl.includes('id=') && currentUserId) {
                finalUrl = `${destinationUrl}${separator}id=${currentUserId}`;
            }
            
            window.location.href = finalUrl;
        }
    }
});

// প্রথমে UID এবং পরে জব আইডি (বা অন্যান্য প্যারামিটার) সহ পেজ পরিবর্তনের ফাংশন
function goToPage(targetUrl) {
    // ১. বর্তমান পেজের URL থেকে 'id' বা UID খুঁজে নেওয়া
    const urlParams = new URLSearchParams(window.location.search);
    const currentUid = urlParams.get('id') || localStorage.getItem('loggedInUserPhone') || '';

    // ২. টার্গেট URL থেকে বেজ পাথ এবং অন্যান্য প্যারামিটার আলাদা করা (যেমন: job-details.html?jobId=123)
    let baseUrl = targetUrl;
    let otherParams = new URLSearchParams();

    if (targetUrl.includes('?')) {
        const parts = targetUrl.split('?');
        baseUrl = parts[0];
        otherParams = new URLSearchParams(parts[1]);
    }

    // ৩. নতুন একটি URLSearchParams তৈরি করে সবার আগে 'id' (UID) বসানো
    const finalParams = new URLSearchParams();
    if (currentUid) {
        finalParams.set('id', currentUid);
    }

    // ৪. এরপর বাকি প্যারামিটারগুলো (যেমন jobId) যোগ করা
    for (const [key, value] of otherParams.entries()) {
        // যদি টার্গেটে ইতিমধ্যে id না থাকে, তবেই অন্যান্য প্যারামিটার যুক্ত হবে
        if (key !== 'id') {
            finalParams.set(key, value);
        }
    }

    // ৫. চূড়ান্ত ইউআরএল তৈরি করা
    const queryString = finalParams.toString();
    const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    // ৬. পেজ রিডাইরেক্ট করা
    window.location.href = finalUrl;
}