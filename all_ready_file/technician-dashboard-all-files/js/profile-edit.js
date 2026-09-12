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
    // শুধুমাত্র পেজটিকে রিলোড করে দাও
    window.location.reload();
}

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
    window.location.href = 'find-jobs.html';
});

document.getElementById('bell-icon').addEventListener('click', function() {
    window.location.href = 'bell-icon.html';
});



function showToast(message, type = 'success') {
    // আগের কোনো টোস্ট থাকলে তা রিমুভ করে দেওয়া
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) {
        existingToast.remove();
    }

    // নতুন টোস্ট এলিমেন্ট তৈরি
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    toast.innerText = message;

    // টোস্টের পজিশন মাঝবরাবর কিছুটা ওপরে সেট করার জন্য
    toast.style.position = 'fixed';
    toast.style.top = '15%'; // ওপর থেকে ১৫% নিচে (স্ক্রিনের মাঝবরাবর কিছুটা ওপরে থাকবে)
    toast.style.left = '50%'; // বাম দিক থেকে মাঝবরাবর
    toast.style.transform = 'translateX(-50%)'; // পারফেক্ট সেন্টারে আনার জন্য
    
    toast.style.backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
    toast.style.color = '#ffffff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '500';
    toast.style.zIndex = '9999';
    toast.style.transition = 'opacity 0.3s ease-in-out';
    
    document.body.appendChild(toast);

    // ঠিক ৩ সেকেন্ড (3000ms) পর টোস্টটি আস্তে আস্তে মিলিয়ে যাবে এবং রিমুভ হবে
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    let fileInput = document.getElementById('profileImageInput');
    
    // ইনপুট না থাকলে ডাইনামিক্যালি তৈরি করে নেওয়া
    if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'profileImageInput';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
    }

    // ক্যামেরা আইকনে ক্লিক করার পর ফাইল সিলেক্ট হলে
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // ইউআরএল বা সেশন থেকে বর্তমান ইউজারের আইডি নেওয়া
        const urlParams = new URLSearchParams(window.location.search);
        const currentUserId = urlParams.get('id') || sessionStorage.getItem('liveUserId');

        if (!currentUserId) {
            alert("ইউজার আইডি পাওয়া যায়নি!");
            return;
        }

        // ছবিটিকে Base64 তে কনভার্ট করা
        
// ছবিকে Base64 তে কনভার্ট ও কম্প্রেস করা
const reader = new FileReader();
reader.onload = async function(uploadEvent) {
    const img = new Image();
    img.src = uploadEvent.target.result;
    
    img.onload = async function() {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;  // প্রোফাইল ছবির জন্য সর্বোচ্চ প্রস্থ ৩০০ পিক্সেল
        const MAX_HEIGHT = 300; // প্রোফাইল ছবির জন্য সর্বোচ্চ উচ্চতা ৩০০ পিক্সেল
        let width = img.width;
        let height = img.height;

        // অনুপাত ঠিক রেখে সাইজ ছোট করা
        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // কম্প্রেস করে ছোট সাইজের Base64 স্ট্রিং তৈরি (কোয়ালিটি ০.৭)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

        try {
            // খুব সুন্দরভাবে শুধু এপিআই ফাংশনটি কল করা হলো (সার্ভার-রেডি স্ট্রাকচার)
            const response = await UserAPI.updateProfileImage(currentUserId, compressedBase64);

            if (response.success) {
                showToast(response.message, "success");
                // চাইলে এখানে প্রিভিউ ইমেজ বা UI আপডেট করে নিতে পারেন
            } else {
                showToast(response.message || "ছবি আপডেট করতে সমস্যা হয়েছে", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("ছবি আপডেট করতে সমস্যা হয়েছে: " + error.message, "error");
        }
    };
};
reader.readAsDataURL(file);

        reader.readAsDataURL(file);
    });
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

const currentUserId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId');
const apiData = UserAPI.getUserProfileData(currentUserId);

if (apiData) {
    const { foundUserData, finalPhoneToUse } = apiData;
    const phoneInput = document.getElementById('phone'); 
    const phoneLabel = document.querySelector('label[for="phone"]'); 

    if (finalPhoneToUse && phoneInput) {
        // যদি Key অথবা profileSection—যেকোনো এক জায়গা থেকে ফোন নম্বর পাওয়া যায়
        phoneInput.value = finalPhoneToUse;
        phoneInput.setAttribute('readonly', true);
        phoneInput.style.backgroundColor = '#f3f4f6'; 
        phoneInput.style.cursor = 'not-allowed';

        if (phoneLabel) {
            phoneLabel.innerHTML = 'মোবাইল নম্বর';
        }
    } else if (phoneInput) {
        // যদি কোথাও ফোন নম্বর না পাওয়া যায়, তবে ফিল্ড এডিটেবল রাখা এবং Required দেখানো
        phoneInput.value = '';
        phoneInput.removeAttribute('readonly');
        phoneInput.style.backgroundColor = '';
        phoneInput.style.cursor = '';

        if (phoneLabel && !phoneLabel.innerHTML.includes('Required')) {
            phoneLabel.innerHTML = 'মোবাইল নম্বর <span style="color: #ef4444; font-size: 12px; font-weight: normal;">(Required)</span>';
        }
    }
}
// ফোন ইনপুট এবং ভেরিফাই বাটন সিলেক্ট করা
const phoneInput = document.getElementById('phone');
const verifyPhoneBtn = document.getElementById('verifyPhoneBtn');

if (phoneInput && verifyPhoneBtn) {
    // চেক করা ফিল্ডটি readonly কি না
    if (phoneInput.hasAttribute('readonly')) {
        // যদি readonly থাকে, তবে বাটনটি হাইড বা লুকিয়ে ফেলা
        verifyPhoneBtn.style.display = 'none';
    } else {
        // যদি ইনপুট নেওয়ার মতো থাকে, তবে বাটনটি প্রদর্শন করা
        verifyPhoneBtn.style.display = 'inline-block';
    }
}

// ইতিপূর্বে ব্যবহৃত নাম এড়াতে নতুন ইউনিক নাম ব্যবহার করা হলো
const activeProfileUserId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId');
const fetchedProfileResponse = UserAPI.getUserProfileData(activeProfileUserId);

if (fetchedProfileResponse) {
    const { finalPhoneToUse, finalEmailToUse } = fetchedProfileResponse;

    // --- ফোন নম্বর হ্যান্ডেলিং ---
    const phoneInput = document.getElementById('phone'); 
    const phoneLabel = document.querySelector('label[for="phone"]'); 

    if (finalPhoneToUse && phoneInput) {
        phoneInput.value = finalPhoneToUse;
        phoneInput.setAttribute('readonly', true);
        phoneInput.style.backgroundColor = '#f3f4f6'; 
        phoneInput.style.cursor = 'not-allowed';
        if (phoneLabel) phoneLabel.innerHTML = 'মোবাইল নম্বর';
    } else if (phoneInput) {
        phoneInput.value = '';
        phoneInput.removeAttribute('readonly');
        phoneInput.style.backgroundColor = '';
        phoneInput.style.cursor = '';
        if (phoneLabel && !phoneLabel.innerHTML.includes('Required')) {
            phoneLabel.innerHTML = 'মোবাইল নম্বর <span style="color: #ef4444; font-size: 12px; font-weight: normal;">(Required)</span>';
        }
    }

    

    // --- ইমেইল অ্যাড্রেস হ্যান্ডেলিং ---
    const emailInput = document.getElementById('email');
    const emailLabel = document.querySelector('label[for="email"]');

    if (finalEmailToUse && emailInput) {
        emailInput.value = finalEmailToUse;
       
        if (emailLabel) {
            emailLabel.innerHTML = 'ইমেইল অ্যাড্রেস';
            emailInput.setAttribute('readonly', true);
        emailInput.style.backgroundColor = '#f3f4f6';
        emailInput.style.cursor = 'not-allowed';
        }
    } else if (emailInput) {
        emailInput.value = '';
        emailInput.removeAttribute('readonly');
        emailInput.style.backgroundColor = '';
        emailInput.style.cursor = '';
        if (emailLabel && !emailLabel.innerHTML.includes('Optional')) {
            emailLabel.innerHTML = 'ইমেইল অ্যাড্রেস <span style="font-weight: normal; color: #7f8c8d; font-size: 13px;">(Optional)</span>';
        }
    }
}

// ==========================================
// জেলা ও উপজেলা ড্রপডাউনে অপশন আসার পর মান সেট করার নিখুঁত লজিক
// ==========================================
window.addEventListener('load', function() {
    const activeUserId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId');
    
    if (!activeUserId || typeof UserAPI === 'undefined' || !UserAPI.getUserLocationViaApi) return;

    const locationResponse = UserAPI.getUserLocationViaApi(activeUserId);
    if (!locationResponse || !locationResponse.success) return;

    const districtSelect = document.getElementById('districtSelect');
    const upazilaSelect = document.getElementById('upazilaSelect');

    // ১. জেলা সেট করার ফাংশন (অপশন লোড হওয়া পর্যন্ত চেক করবে)
    if (districtSelect && locationResponse.district) {
        let districtInterval = setInterval(() => {
            if (districtSelect.options.length > 1) { // অপশন লোড হয়েছে কি না চেক
                districtSelect.value = locationResponse.district;
                
                if (districtSelect.value !== locationResponse.district) {
                    for (let opt of districtSelect.options) {
                        if (opt.text.trim() === locationResponse.district.trim() || opt.value.trim() === locationResponse.district.trim()) {
                            districtSelect.value = opt.value;
                            break;
                        }
                    }
                }

                // জেলা সিলেক্ট হওয়ার পর উপজেলার লিস্ট লোড করার ফাংশন ট্রিগার করা
                if (typeof loadUpazilas === 'function') {
                    loadUpazilas(); 
                }

                clearInterval(districtInterval); // কাজ শেষ, ইন্টারভাল বন্ধ
            }
        }, 100); // প্রতি ১০০ মিলিগ্রাম পর পর চেক করবে অপশন এসেছে কি না
    }

    // ২. উপজেলা সেট করার ফাংশন (উপজেলার অপশনগুলো আসার জন্য অপেক্ষা করবে)
    if (upazilaSelect && locationResponse.upazila) {
        let upazilaInterval = setInterval(() => {
            if (upazilaSelect.options.length > 1) { // উপজেলার অপশন লোড হয়েছে কি না চেক
                upazilaSelect.value = locationResponse.upazila;

                if (upazilaSelect.value !== locationResponse.upazila) {
                    for (let opt of upazilaSelect.options) {
                        if (opt.text.trim() === locationResponse.upazila.trim() || opt.value.trim() === locationResponse.upazila.trim()) {
                            upazilaSelect.value = opt.value;
                            break;
                        }
                    }
                }

                clearInterval(upazilaInterval); // কাজ শেষ, ইন্টারভাল বন্ধ
            }
        }, 150); // প্রতি ১৫০ মিলিগ্রাম পর পর চেক করবে
    }
});

// ==========================================
// কাজের ক্যাটেগরি ড্রপডাউনে মাস্টার ডাটা থেকে এনে সেট করার লজিক
// ==========================================
const categorySelect = document.getElementById('serviceCategorySelect');

// প্রথমে activeUserId ডিফাইন করে নেওয়া হলো
const activeUserId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId');

if (activeUserId && typeof UserAPI !== 'undefined' && UserAPI.getUserCategoryViaApi && categorySelect) {
    let categoryInterval = setInterval(() => {
        if (categorySelect.options.length > 1) {
            const categoryResponse = UserAPI.getUserCategoryViaApi(activeUserId);
            
            if (categoryResponse && categoryResponse.success && categoryResponse.category) {
                categorySelect.value = categoryResponse.category;
                
                // যদি সরাসরি ভ্যালু ম্যাচ না করে, অপশনের টেক্সট ম্যাচ করে সিলেক্ট করা
                if (categorySelect.value !== categoryResponse.category) {
                    for (let opt of categorySelect.options) {
                        if (opt.text.trim() === categoryResponse.category.trim() || opt.value.trim() === categoryResponse.category.trim()) {
                            categorySelect.value = opt.value;
                            break;
                        }
                    }
                }
            }
            clearInterval(categoryInterval); // কাজ শেষ, ইন্টারভাল বন্ধ
        }
    }, 150);
}

// ==========================================
// পেজ লোড হওয়ার সময় মাস্টার ডাটা থেকে ডেসক্রিপশন এনে ইনপুটে বসানোর লজিক
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const workDescriptionInput = document.getElementById('workDescription');

    // সুনিশ্চিত করার জন্য activeUserId গ্লোবাল ভ্যারিয়েবল ব্যবহার করা
    const currentUserId = typeof activeUserId !== 'undefined' ? activeUserId : (new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId'));

    if (workDescriptionInput && currentUserId && typeof UserAPI !== 'undefined' && UserAPI.getUserDescriptionViaApi) {
        // এপিআই কল করে ডেসক্রিপশন ফেচ করা
        const descriptionResponse = UserAPI.getUserDescriptionViaApi(currentUserId);
        
        if (descriptionResponse && descriptionResponse.success && descriptionResponse.description) {
            // মাস্টার ডাটার ভ্যালু টেক্সটএরিয়া ইনপুটে বসিয়ে দেওয়া
            workDescriptionInput.value = descriptionResponse.description;
        }
    }
});

// ==========================================
// পেজ লোড হওয়ার সময় মাস্টার ডাটা থেকে এনআইডি নাম এনে ইনপুটে বসানোর লজিক
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');

    const currentUserId = typeof activeUserId !== 'undefined' ? activeUserId : (new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId'));

    if (currentUserId && typeof UserAPI !== 'undefined' && UserAPI.getNidNameViaApi) {
        const nameResponse = UserAPI.getNidNameViaApi(currentUserId);
        
        if (nameResponse && nameResponse.success) {
            if (firstNameInput && nameResponse.firstName) {
                firstNameInput.value = nameResponse.firstName;
            }
            if (lastNameInput && nameResponse.lastName) {
                lastNameInput.value = nameResponse.lastName;
            }
        }
    }
});

// ==========================================
// পেজ লোড হওয়ার সময় মাস্টার ডাটা থেকে জন্মতারিখ এনে ড্রপডাউনে বসানোর লজিক
// ==========================================
const daySelect = document.getElementById('dob-day');
const monthSelect = document.getElementById('dob-month');
const yearSelect = document.getElementById('dob-year');

// নতুন করে const না লিখে সরাসরি আগের currentUserId ভেরিয়েবলটি ব্যবহার করুন 
// অথবা যদি নতুন স্কোপ হয়, তবে নাম পাল্টে দিতে পারেন যেমন: activeProfileUserId
if (typeof currentUserId !== 'undefined' && currentUserId && typeof UserAPI !== 'undefined' && UserAPI.getDateOfBirthViaApi) {
    const dobResponse = UserAPI.getDateOfBirthViaApi(currentUserId);
    
    if (dobResponse && dobResponse.success) {
        if (daySelect && dobResponse.day) {
            daySelect.value = dobResponse.day;
        }
        if (monthSelect && dobResponse.month) {
            monthSelect.value = dobResponse.month;
        }
        if (yearSelect && dobResponse.year) {
            yearSelect.value = dobResponse.year;
        }
    }
}

// ==========================================
// পেজ লোড হওয়ার সময় মাস্টার ডাটা থেকে এনআইডি নম্বর এনে ইনপুটে বসানোর লজিক
// ==========================================
const nidNumberInput = document.getElementById('nidNumber');

if (typeof currentUserId !== 'undefined' && currentUserId && typeof UserAPI !== 'undefined' && UserAPI.getNidNumberViaApi) {
    const nidResponse = UserAPI.getNidNumberViaApi(currentUserId);
    
    if (nidResponse && nidResponse.success && nidNumberInput && nidResponse.nidNumber) {
        nidNumberInput.value = nidResponse.nidNumber;
    }
}

// ==========================================
// পেজ লোড হওয়ার সময় মাস্টার ডাটা থেকে এনআইডি ছবি এনে প্রিভিউতে দেখানোর লজিক
// ==========================================
const frontPreview = document.getElementById('frontPreview');
const frontPlaceholder = document.getElementById('frontPlaceholder');
const backPreview = document.getElementById('backPreview');
const backPlaceholder = document.getElementById('backPlaceholder');

if (typeof currentUserId !== 'undefined' && currentUserId && typeof UserAPI !== 'undefined' && UserAPI.getNidImagesViaApi) {
    const imagesResponse = UserAPI.getNidImagesViaApi(currentUserId);
    
    if (imagesResponse && imagesResponse.success) {
        // সামনের ছবির জন্য
        if (frontPreview && imagesResponse.frontImage) {
            frontPreview.src = imagesResponse.frontImage;
            frontPreview.style.display = 'block'; // ছবি দৃশ্যমান করা
            if (frontPlaceholder) {
                frontPlaceholder.style.display = 'none'; // প্লেসহোল্ডার লুকিয়ে ফেলা
            }
        }
        
        // পেছনের ছবির জন্য
        if (backPreview && imagesResponse.backImage) {
            backPreview.src = imagesResponse.backImage;
            backPreview.style.display = 'block'; // ছবি দৃশ্যমান করা
            if (backPlaceholder) {
                backPlaceholder.style.display = 'none'; // প্লেসহোল্ডার লুকিয়ে ফেলা
            }
        }
    }
}

// ==========================================
// সংরক্ষণ করুন (Save) বাটনের সম্পূর্ণ শৃঙ্খলিত লজিক
// ==========================================
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('save-btn')) {
        event.preventDefault(); 

        // ১. ফোন নম্বর রিড-ওনলি (Readonly) চেক
        const phoneInput = document.getElementById('phone');
        if (phoneInput && !phoneInput.hasAttribute('readonly')) {
            showToast("আগে অনুগ্রহ করে আপনার ফোন নম্বরটি ভেরিফাই করুন!", "error");
            phoneInput.style.borderColor = '#ef4444';
            phoneInput.focus();
            return; 
        }

        // ২. ইমেইল ফিল্ড চেক (যদি কিছু লেখা থাকে)
        const emailInput = document.getElementById('email');
        let emailValue = "";
        if (emailInput && emailInput.hasAttribute('readonly') === false) {
            emailValue = emailInput.value.trim();
            if (emailValue !== "") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailValue)) {
                    showToast("দয়া করে একটি সঠিক ইমেইল অ্যাড্রেস দিন (যেমন: example@gmail.com)", "error");
                    emailInput.style.borderColor = '#ef4444';
                    emailInput.focus();
                    return;
                }
            }
        }

        // ৩. নাম (Name) ফিল্ড চেক
        const nameInput = document.getElementById('fullName');
        let nameValue = "";
        if (nameInput) {
            nameValue = nameInput.value.trim();

            if (nameValue === "") {
                showToast("দয়া করে আপনার পূর্ণ নাম লিখুন!", "error");
                nameInput.style.borderColor = '#ef4444';
                nameInput.focus();
                return;
            }

            if (nameValue.length < 3 || nameValue.length > 50) {
                showToast("নাম অবশ্যই ৩ থেকে ৫০ অক্ষরের মধ্যে হতে হবে!", "error");
                nameInput.style.borderColor = '#ef4444';
                nameInput.focus();
                return;
            }
        }

        // ৪. জেলা (District) এবং উপজেলা (Upazila) চেক
        const districtSelect = document.getElementById('districtSelect');
        const upazilaSelect = document.getElementById('upazilaSelect');

        let districtValue = "";
        let upazilaValue = "";

        if (districtSelect) {
            districtValue = districtSelect.value.trim();
            if (districtValue === "") {
                showToast("দয়া করে আপনার জেলা নির্বাচন করুন!", "error");
                districtSelect.style.borderColor = '#ef4444';
                districtSelect.focus();
                return;
            } else {
                districtSelect.style.borderColor = '';
            }
        }

        if (upazilaSelect) {
            upazilaValue = upazilaSelect.value.trim();
            if (upazilaValue === "") {
                showToast("দয়া করে আপনার উপজেলা / এলাকা নির্বাচন করুন!", "error");
                upazilaSelect.style.borderColor = '#ef4444';
                upazilaSelect.focus();
                return;
            } else {
                upazilaSelect.style.borderColor = '';
            }
        }
// কাজের ক্যাটেগরি ভ্যালিডেশন ও সেভ অংশ
// ==========================================
const categorySelect = document.getElementById('serviceCategorySelect');
let selectedCategoryValue = ""; // বাইরে ডিক্লেয়ার করা হলো

if (categorySelect) {
    selectedCategoryValue = categorySelect.value.trim();

    if (selectedCategoryValue === "") {
        showToast("দয়া করে আপনার কাজের ক্যাটেগরি নির্বাচন করুন", "error");
        categorySelect.style.borderColor = '#ef4444';
        categorySelect.focus();
        return;
    } else {
        categorySelect.style.borderColor = '';
    }
}

// ==========================================
// প্রথম নাম ও শেষ নাম ফাঁকা আছে কি না চেক করার লজিক
// ==========================================
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');

let firstName = firstNameInput ? firstNameInput.value.trim() : "";
let lastName = lastNameInput ? lastNameInput.value.trim() : "";

// প্রথম নাম খালি থাকলে
if (firstName === "") {
    showToast("দয়া করে আপনার প্রথম নাম লিখুন!", "error"); // অথবা আপনার প্রজেক্টের এলার্ট ফাংশন
    firstNameInput.style.borderColor = '#ef4444';
    firstNameInput.focus();
    return; // সাবমিট প্রসেস এখানেই আটকে যাবে
} else {
    firstNameInput.style.borderColor = '';
}

// শেষ নাম খালি থাকলে
if (lastName === "") {
    showToast("দয়া করে আপনার শেষ নাম লিখুন!", "error");
    lastNameInput.style.borderColor = '#ef4444';
    lastNameInput.focus();
    return; // সাবমিট প্রসেস এখানেই আটকে যাবে
} else {
    lastNameInput.style.borderColor = '';
}

// ==========================================
// জন্মতারিখের তিনটি ড্রপডাউন চেক করার লজিক
// ==========================================
const daySelect = document.getElementById('dob-day');     // আপনার দিনের সিলেক্ট ট্যাগ আইডি
const monthSelect = document.getElementById('dob-month'); // আপনার মাসের সিলেক্ট ট্যাগ আইডি
const yearSelect = document.getElementById('dob-year');   // আপনার বছরের সিলেক্ট ট্যাগ আইডি

let selectedDay = daySelect ? daySelect.value : "";
let selectedMonth = monthSelect ? monthSelect.value : "";
let selectedYear = yearSelect ? yearSelect.value : "";

// দিন সিলেক্ট করা না থাকলে (ডিফল্ট ভ্যালু খালি বা "" হলে)
if (selectedDay === "" || selectedDay === "দিন") {
    showToast("দয়া করে জন্মতারিখের 'দিন' সিলেক্ট করুন!", "error");
    if(daySelect) daySelect.focus();
    return; // সাবমিট আটকে যাবে
}

// মাস সিলেক্ট করা না থাকলে
if (selectedMonth === "" || selectedMonth === "মাস") {
    showToast("দয়া করে জন্মতারিখের 'মাস' সিলেক্ট করুন!", "error");
    if(monthSelect) monthSelect.focus();
    return; // সাবমিট আটকে যাবে
}

// বছর সিলেক্ট করা না থাকলে
if (selectedYear === "" || selectedYear === "বছর") {
    showToast("দয়া করে জন্মতারিখের 'বছর' সিলেক্ট করুন!", "error");
    if(yearSelect) yearSelect.focus();
    return; // সাবমিট আটকে যাবে
}

// তিনটি ঠিকমতো সিলেক্ট করা থাকলে পরবর্তী প্রসেস বা এপিআই কল এখানে হবে...

// ==========================================
// এনআইডি নম্বর ভ্যালিডেশন লজিক (খালি, ১০ বা ১৭ ডিজিট চেক)
// ==========================================
const nidNumberInput = document.getElementById('nidNumber');
const nidValue = nidNumberInput ? nidNumberInput.value.trim() : "";

// ১. এনআইডি ফিল্ড খালি আছে কি না চেক
if (nidValue === "") {
    showToast("দয়া করে আপনার এনআইডি নম্বর লিখুন!", "error");
    if(nidNumberInput) {
        nidNumberInput.style.borderColor = '#ef4444';
        nidNumberInput.focus();
    }
    return; // সাবমিট আটকে যাবে
}

// ২. এনআইডি নম্বরটি ১০ বা ১৭ ডিজিটের কি না চেক (Regex ব্যবহার করে)
const nidRegex = /^\d{10}$|^\d{17}$/;
if (!nidRegex.test(nidValue)) {
    showToast("এনআইডি নম্বর অবশ্যই ১০ অথবা ১৭ ডিজিটের হতে হবে!", "error");
    if(nidNumberInput) {
        nidNumberInput.style.borderColor = '#ef4444';
        nidNumberInput.focus();
    }
    return; // সাবমিট আটকে যাবে
} else {
    // সব ঠিক থাকলে বর্ডার স্বাভাবিক করে দেওয়া
    if(nidNumberInput) {
        nidNumberInput.style.borderColor = '';
    }
}

// এনআইডি সঠিক থাকলে পরবর্তী এপিআই সেভ প্রসেস এখানে চলবে...

// ==========================================
// এনআইডি সামনের ও পেছনের ছবি আপলোড চেক করার লজিক
// ==========================================
const frontPreviewImg = document.getElementById('frontPreview');
const backPreviewImg = document.getElementById('backPreview');

// অথবা আপনি সরাসরি ফাইল ইনপুটগুলোর ফাইল লিস্ট চেক করতে পারেন:
const frontCameraInput = document.getElementById('frontCameraInput');
const frontGalleryInput = document.getElementById('frontGalleryInput');
const backCameraInput = document.getElementById('backCameraInput');
const backGalleryInput = document.getElementById('backGalleryInput');

// সামনের ছবি চেক (প্রিভিউ ইমেজ দৃশ্যমান আছে কি না বা src এ কোনো ডাটা আছে কি না)
const isFrontUploaded = (frontPreviewImg && frontPreviewImg.style.display !== 'none' && frontPreviewImg.src !== "") ||
                        (frontCameraInput && frontCameraInput.files.length > 0) ||
                        (frontGalleryInput && frontGalleryInput.files.length > 0);

// পেছনের ছবি চেক
const isBackUploaded = (backPreviewImg && backPreviewImg.style.display !== 'none' && backPreviewImg.src !== "") ||
                       (backCameraInput && backCameraInput.files.length > 0) ||
                       (backGalleryInput && backGalleryInput.files.length > 0);

if (!isFrontUploaded) {
    showToast("দয়া করে এনআইডি কার্ডের সামনের ছবি আপলোড করুন!", "error");
    return; // সাবমিট আটকে যাবে
}

if (!isBackUploaded) {
    showToast("দয়া করে এনআইডি কার্ডের পেছনের ছবি আপলোড করুন!", "error");
    return; // সাবমিট আটকে যাবে
}

// উভয় ছবি আপলোড করা থাকলে পরবর্তী এপিআই প্রসেস এখানে শুরু হবে...

// নাম দুটি ঠিকমতো পূরণ করা থাকলে পরবর্তী সেভ বা এপিআই কল কোড এখানে চলবে...



        // ==========================================
        // ৫. সব চেক সফলভাবে পাস করলে এখন ডেটা সেভ হওয়া শুরু করবে
        // ==========================================
        const activeUserId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId');

        // ক. নাম সেভ বা আপডেট
        if (nameInput) {
            const nameApiResponse = UserAPI.saveUserNameViaApi(activeUserId, nameValue);
            if (!nameApiResponse || !nameApiResponse.success) {
                showToast(nameApiResponse.message || "নাম সংরক্ষণ করতে সমস্যা হয়েছে", "error");
                return;
            }
        }

        // খ. ইমেইল সেভ (যদি দেওয়া থাকে)
        if (emailInput && emailValue !== "") {
            const emailApiResponse = UserAPI.saveUserEmailViaApi(activeUserId, emailValue);
            if (!emailApiResponse || !emailApiResponse.success) {
                showToast(emailApiResponse.message || "ইমেইল সংরক্ষণ করতে সমস্যা হয়েছে", "error");
                return;
            }
        }

        // গ. জেলা ও উপজেলা সেভ
        if (districtSelect && upazilaSelect) {
            const locationApiResponse = UserAPI.saveUserLocationViaApi(activeUserId, districtValue, upazilaValue);
            if (!locationApiResponse || !locationApiResponse.success) {
                showToast(locationApiResponse.message || "লোকেশন সংরক্ষণ করতে সমস্যা হয়েছে", "error");
                return;
            }
        }
// এখন নিচের এপিআই কল করার অংশে এই ভ্যালু ব্যবহার করুন:
if (categorySelect && selectedCategoryValue) {
    const categoryApiResponse = UserAPI.saveUserCategoryViaApi(activeUserId, selectedCategoryValue);
    if (!categoryApiResponse || !categoryApiResponse.success) {
        showToast(categoryApiResponse.message || "ক্যাটেগরি সংরক্ষণ করতে সমস্যা হয়েছে", "error");
        return;
    }
}

// ==========================================
// ডেসক্রিপশন বক্স চেক করে মাস্টার ডাটাতে সেভ করার লজিক
// ==========================================
const workDescriptionInput = document.getElementById('workDescription');

if (workDescriptionInput) {
    const descriptionValue = workDescriptionInput.value.trim();
    
    // যদি ডেসক্রিপশনে কিছু লেখা হয়ে থাকে, তবেই কেবল সেভ প্রসেস চলবে
    if (descriptionValue !== "") {
        if (typeof UserAPI !== 'undefined' && UserAPI.saveUserDescriptionViaApi) {
            // activeUserId গ্লোবাল ভ্যারিয়েবল ব্যবহার করে এপিআই কল
            const apiResult = UserAPI.saveUserDescriptionViaApi(activeUserId, descriptionValue);
            
            if (apiResult && apiResult.success) {
                console.log("ডেসক্রিপশন সফলভাবে মাস্টার ডাটাতে সংরক্ষিত হয়েছে।");
            } else {
                console.error("ডেসক্রিপশন সেভ করতে সমস্যা হয়েছে:", apiResult?.message);
            }
        }
    }
    // ডেসক্রিপশন খালি থাকলে কোডটি সাইলেন্টলি পাস করে যাবে (কিছুই করবে না)
}

// নাম দুটি ভ্যালিড হওয়ার পর এপিআই-এর মাধ্যমে মাস্টার ডাটাতে সেভ করার লজিক
const firstNameValue = firstNameInput.value.trim();
const lastNameValue = lastNameInput.value.trim();

if (typeof UserAPI !== 'undefined' && UserAPI.saveNidNameViaApi) {
    const apiResult = UserAPI.saveNidNameViaApi(activeUserId, firstNameValue, lastNameValue);
    
    if (apiResult && apiResult.success) {
        console.log("এনআইডি সেকশনে নাম সফলভাবে সংরক্ষিত হয়েছে।");
        // সফলতার মেসেজ বা টোস্ট দেখাতে পারেন
    } else {
        console.error("নাম সংরক্ষণ করতে সমস্যা হয়েছে:", apiResult?.message);
    }
}

// জন্মতারিখের ভ্যালুগুলো সংগ্রহ করা
const dayValue = daySelect.value;
const monthValue = monthSelect.value;
const yearValue = yearSelect.value;

// এপিআই ফাংশনের মাধ্যমে মাস্টার ডাটাতে জন্মতারিখ সেভ করা
if (typeof UserAPI !== 'undefined' && UserAPI.saveDateOfBirthViaApi) {
    const dobApiResult = UserAPI.saveDateOfBirthViaApi(activeUserId, dayValue, monthValue, yearValue);
    
    if (dobApiResult && dobApiResult.success) {
        console.log("জন্মতারিখ সফলভাবে সংরক্ষিত হয়েছে।");
    } else {
        console.error("জন্মতারিখ সেভ করতে সমস্যা হয়েছে:", dobApiResult?.message);
    }
}

// এনআইডি নম্বর এপিআই-এর মাধ্যমে মাস্টার ডাটাতে সেভ করা
if (typeof UserAPI !== 'undefined' && UserAPI.saveNidNumberViaApi) {
    const nidApiResult = UserAPI.saveNidNumberViaApi(activeUserId, nidValue);
    
    if (nidApiResult && nidApiResult.success) {
        console.log("এনআইডি নম্বর সফলভাবে সংরক্ষিত হয়েছে।");
    } else {
        console.error("এনআইডি নম্বর সেভ করতে সমস্যা হয়েছে:", nidApiResult?.message);
    }
}

// ছবিগুলোকে Base64-এ কনভার্ট করে সেভ করার ফাংশন
function convertImageToBase64AndSave(imgElement, fileInputCamera, fileInputGallery, callback) {
    let file = null;
    if (fileInputCamera && fileInputCamera.files && fileInputCamera.files[0]) {
        file = fileInputCamera.files[0];
    } else if (fileInputGallery && fileInputGallery.files && fileInputGallery.files[0]) {
        file = fileInputGallery.files[0];
    }

    if (file) {
        const reader = new FileReader();
       reader.onload = function(e) {
    const img = new Image();
    img.src = e.target.result;
    
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;  // ছবির সর্বোচ্চ প্রস্থ ৮০০ পিক্সেল
        const MAX_HEIGHT = 800; // ছবির সর্বোচ্চ উচ্চতা ৮০০ পিক্সেল
        let width = img.width;
        let height = img.height;

        // ছবির অনুপাত (Aspect Ratio) ঠিক রেখে সাইজ ছোট করা
        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // কম্প্রেস করে ছোট সাইজের Base64 স্ট্রিং তৈরি (0.7 মানে ৭% কোয়ালিটি, যা সাইজ কয়েক কিলোবাইটে নামিয়ে আনবে)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        
        callback(compressedBase64); // কম্প্রেসড বেস৬৪ পাস করা হলো
    }
};
        reader.readAsDataURL(file);
    } else if (imgElement && imgElement.src && imgElement.src.startsWith('data:image')) {
        // যদি অলরেডি ইমেজ ট্যাগ বা প্রিভিউতে বেসড ৬৪ বা সোর্স থাকে
        callback(imgElement.src);
    } else {
        callback(null);
    }
}

// ফ্রন্ট ও ব্যাক উভয় ছবি প্রসেস করে একসাথে এপিআই তে পাঠানো
convertImageToBase64AndSave(frontPreviewImg, frontCameraInput, frontGalleryInput, function(frontBase64) {
    convertImageToBase64AndSave(backPreviewImg, backCameraInput, backGalleryInput, function(backBase64) {
        
        if (typeof UserAPI !== 'undefined' && UserAPI.saveNidImagesViaApi) {
            const imageApiResult = UserAPI.saveNidImagesViaApi(activeUserId, frontBase64, backBase64);
            
            if (imageApiResult && imageApiResult.success) {
                console.log("এনআইডি ছবিগুলো সফলভাবে সংরক্ষিত হয়েছে।");
                // এখানে আপনার পরবর্তী সাকসেস মেসেজ বা রিডাইরেক্ট কোড দিতে পারেন
            } else {
                console.error("ছবি সেভ করতে সমস্যা হয়েছে:", imageApiResult?.message);
            }
        }

    });
});

        // ঘ. সবশেষে ফাইনাল সাকসেস মেসেজ ও পেজ রিলোড
        showToast("প্রোফাইল সফলভাবে আপডেট এবং সংরক্ষিত হয়েছে!", "success");
        setTimeout(() => {
            window.location.reload();
        }, 1200);
    }
});


// ভেরিফাই বাটনে ক্লিক ইভেন্ট লিসেনার
if (verifyPhoneBtn) {
    verifyPhoneBtn.addEventListener('click', function(e) {
        e.preventDefault();

        if (!phoneInput) return;
        let phoneValue = phoneInput.value.trim();

        // ১. খালি চেক
        if (!phoneValue) {
            showToast("দয়া করে মোবাইল নম্বর প্রদান করুন!", "error");
            phoneInput.style.borderColor = '#ef4444';
            phoneInput.focus();
            return;
        }

        // ২. স্পেস বা হাইফেন রিমুভ করা
        let cleanedPhone = phoneValue.replace(/[\s-]/g, '');

        // ৩. +88 বা 88 থাকলে সেটি স্লাইস বা রিমুভ করে দেওয়া
        if (cleanedPhone.startsWith('+88')) {
            cleanedPhone = cleanedPhone.slice(3);
        } else if (cleanedPhone.startsWith('88') && cleanedPhone.length === 13) {
            cleanedPhone = cleanedPhone.slice(2);
        }

        // ৪. ১১ ডিজিটের কি না এবং বাংলাদেশি অপারেটর (013-019) চেক
        const validOperatorRegex = /^01[3-9]\d{8}$/;
        if (!validOperatorRegex.test(cleanedPhone)) {
            showToast("সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)", "error");
            phoneInput.style.borderColor = '#ef4444';
            phoneInput.focus();
            return;
        }

        // ইনপুটে ক্লিন নম্বরটি বসিয়ে দেওয়া
        phoneInput.value = cleanedPhone;
        phoneInput.style.borderColor = '';

        // ৫. currentUserId বের করা
        const currentUserId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId');

        // ৬. api.js ফাইল থেকে ডুপ্লিকেট চেক কল করা
        const duplicateCheck = UserAPI.checkPhoneDuplicate(currentUserId, cleanedPhone);

        if (duplicateCheck.isDuplicate) {
            showToast("এই মোবাইল নম্বরটি ইতিমধ্যে অন্য একটি অ্যাকাউন্টে ব্যবহার করা হয়েছে!", "error");
            phoneInput.style.borderColor = '#ef4444';
            phoneInput.focus();
            return;
        }

        // ৭. সব শর্ত ঠিক থাকলে ওটিপি ভেরিফিকেশন পপআপ ওপেন করা
        openOtpVerificationModal(cleanedPhone);
    });
}

// ওটিপি পপআপ ওপেন করার ফাংশন
function openOtpVerificationModal(phoneNumber) {
    const existingModal = document.getElementById('otpModal');
    if (existingModal) existingModal.remove();

    const modalHTML = `
        <div id="otpModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div style="background: #fff; padding: 25px; border-radius: 8px; width: 350px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
                <h3 style="margin-bottom: 10px; color: #333; font-size: 18px;">ফোন নম্বর ভেরিফিকেশন</h3>
                <p style="font-size: 13px; color: #666; margin-bottom: 20px;">আপনার এই (${phoneNumber}) নাম্বারে ৬ ডিজিটের ওটিপি পাঠানো হয়েছে</p>
                
                <!-- ৬টি ওটিপি ইনপুট বক্স -->
                <div style="display: flex; justify-content: space-between; gap: 8px; margin-bottom: 20px;">
                    <input type="text" maxlength="1" class="otp-box" style="width: 40px; height: 40px; text-align: center; font-size: 18px; border: 1px solid #ccc; border-radius: 4px;" />
                    <input type="text" maxlength="1" class="otp-box" style="width: 40px; height: 40px; text-align: center; font-size: 18px; border: 1px solid #ccc; border-radius: 4px;" />
                    <input type="text" maxlength="1" class="otp-box" style="width: 40px; height: 40px; text-align: center; font-size: 18px; border: 1px solid #ccc; border-radius: 4px;" />
                    <input type="text" maxlength="1" class="otp-box" style="width: 40px; height: 40px; text-align: center; font-size: 18px; border: 1px solid #ccc; border-radius: 4px;" />
                    <input type="text" maxlength="1" class="otp-box" style="width: 40px; height: 40px; text-align: center; font-size: 18px; border: 1px solid #ccc; border-radius: 4px;" />
                    <input type="text" maxlength="1" class="otp-box" style="width: 40px; height: 40px; text-align: center; font-size: 18px; border: 1px solid #ccc; border-radius: 4px;" />
                </div>

                <!-- বাটনগুলো -->
                <div style="display: flex; justify-content: space-between; gap: 10px;">
                    <button type="button" id="cancelOtpBtn" style="flex: 1; padding: 8px; background: #e5e7eb; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">বাতিল</button>
                    <button type="button" id="submitOtpBtn" style="flex: 1; padding: 8px; background: #2563eb; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">সাবমিট</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // ওটিপি বক্সগুলোর হ্যান্ডলিং (এ্যারো কী এবং ব্যাকস্পেস কন্ট্রোল)
    const otpBoxes = document.querySelectorAll('.otp-box');
    
    otpBoxes.forEach((box, index) => {
        // ইনপুট দেওয়ার সময় স্বয়ংক্রিয়ভাবে পরবর্তী ঘরে যাওয়া
        box.addEventListener('input', (e) => {
            const value = e.target.value;
            // শুধু সংখ্যা ইনপুট নিশ্চিত করা
            e.target.value = value.replace(/[^0-9]/g, '');

            if (e.target.value && index < otpBoxes.length - 1) {
                otpBoxes[index + 1].focus();
            }
        });

        // কি-বোর্ড ইভেন্ট হ্যান্ডলিং (এ্যারো কি এবং ব্যাকস্পেস)
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                e.preventDefault();
                if (box.value) {
                    // বর্তমান ঘর ভরা থাকলে শুধু বর্তমান ঘরের সংখ্যা মুছবে
                    box.value = '';
                } else if (index > 0) {
                    // বর্তমান ঘর খালি থাকলে আগের ঘরে চলে যাবে এবং আগের ঘরের সংখ্যা মুছবে
                    otpBoxes[index - 1].focus();
                    otpBoxes[index - 1].value = '';
                }
            } else if (e.key === 'ArrowLeft') {
                // বাম এ্যারো চাপলে আগের ঘরে যাওয়া (যদি থাকে)
                if (index > 0) {
                    e.preventDefault();
                    otpBoxes[index - 1].focus();
                }
            } else if (e.key === 'ArrowRight') {
                // ডান এ্যারো চাপলে সামনের ঘরে যাওয়া (যদি বর্তমান ঘরে সংখ্যা থাকে তবেই পরবর্তী ঘরে যাবে, নতুবা যাবে না)
                if (index < otpBoxes.length - 1 && box.value !== '') {
                    e.preventDefault();
                    otpBoxes[index + 1].focus();
                }
            }
        });

        // কার্সর সবসময় লেখার ডানে রাখার জন্য ফোকাস হলে সিলেক্ট বা কার্সর পজিশন ঠিক করা
        box.addEventListener('focus', () => {
            box.setSelectionRange(box.value.length, box.value.length);
        });
    });

  // পপআপটি বডিতে যুক্ত করার ঠিক পরপরই সামান্য ডিলে দিয়ে প্রথম বক্সে ফোকাস করা
    setTimeout(() => {
        if (otpBoxes.length > 0) {
            otpBoxes[0].focus();
            otpBoxes[0].setSelectionRange(otpBoxes[0].value.length, otpBoxes[0].value.length);
        }
    }, 50); // ৫০ মিলি সেকেন্ড ডিলে দিলে ব্রাউজার খুব সহজেই ফোকাস নিয়ে নেবে

    document.getElementById('cancelOtpBtn').addEventListener('click', function() {
        document.getElementById('otpModal').remove();
    });

 document.getElementById('submitOtpBtn').addEventListener('click', function() {
    let enteredOtp = '';
    otpBoxes.forEach(b => enteredOtp += b.value);

    // ১. চেক করা ৬ ডিজিট সম্পূর্ণ পূরণ হয়েছে কি না
    if (enteredOtp.length < 6) {
        showToast("দয়া করে সম্পূর্ণ ৬ ডিজিটের ওটিপি প্রদান করুন!", "error");
        return;
    }

    // ২. হার্ডকোডেড ওটিপি (123456) এর সাথে ম্যাচ করা
    if (enteredOtp !== "123456") {
        showToast("ওটিপি ভুল হয়েছে! সঠিক ওটিপি প্রদান করুন।", "error");
        // ভুল হলে চাইলে বক্সগুলো খালি করে দিতে পারেন বা ফোকাস রাখতে পারেন
        return;
    }

    // ৩. ওটিপি সঠিক হলে পরবর্তী কার্যক্রম
    
    document.getElementById('otpModal').remove();

    
// সেভ বা সাবমিট বাটনে ক্লিক ইভেন্ট লিসেনার


        const phoneInput = document.getElementById('phone');
        let finalPhone = '';

        if (phoneInput) {
            const phoneValue = phoneInput.value.trim();
            
            // ফোন নম্বর ফিল্ড খালি কি না চেক করা
            if (!phoneValue) {
                showToast("দয়া করে মোবাইল নম্বর প্রদান করুন!", "error");
                phoneInput.style.borderColor = '#ef4444';
                phoneInput.focus();
                return;
            }

            finalPhone = phoneValue;
            
            // যদি ফিল্ডটি readonly না থাকে (ইউজার টাইপ করে থাকলে)
            if (!phoneInput.hasAttribute('readonly')) {
                let cleanedPhone = phoneValue.replace(/[\s-]/g, ''); 
                
                if (cleanedPhone.startsWith('+88')) {
                    cleanedPhone = cleanedPhone.slice(3);
                } else if (cleanedPhone.startsWith('88') && cleanedPhone.length === 13) {
                    cleanedPhone = cleanedPhone.slice(2);
                }

                const validOperatorRegex = /^01[3-9]\d{8}$/;
                if (!validOperatorRegex.test(cleanedPhone)) {
                    showToast("সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)", "error");
                    phoneInput.style.borderColor = '#ef4444';
                    phoneInput.focus();
                    return;
                }
                
                finalPhone = cleanedPhone;
            }
        }

        // বর্তমান ইউজারের আইডি বের করা
        const currentUserId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('liveUserId');

        // 🔥 এপিআই (api.js) ফাইলে থাকা ফাংশন কল করা
        const response = UserAPI.updateUserProfilePhone(currentUserId, finalPhone);

        if (response.success) {
            showToast("ফোন ওটিপি সফলভাবে যাচাই এবং ফোন নম্বরটি সফলভাবে সেভ হয়েছে!", "success");
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showToast(response.message, "error");
        }

    
    // চাইলে এখানে ফোন নম্বরটি সেভ করার বা পরবর্তী ফাংশন কল করতে পারেন
});
}