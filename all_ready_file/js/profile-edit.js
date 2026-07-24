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
    // ১. ফরমের ডিফল্ট রিসেট মেথড কল করা 
    // (এটি ব্রাউজারের defaultValue অনুযায়ী ফিল্ডগুলোকে আবার আগের অবস্থায় ফিরিয়ে নিয়ে যাবে)
    document.querySelector('.profile-form').reset();

    // ২. উপজেলা ড্রপডাউন রিসেট করার পর ডিফল্ট টেক্সট ফিরিয়ে আনার কোড
    const upazilaSelect = document.getElementById("upazilaSelect");
    if (upazilaSelect) {
        upazilaSelect.innerHTML = '<option value="">প্রথমে জেলা সিলেক্ট করুন</option>';
    }

    // ৩. নাম বা অন্যান্য ফিল্ড যদি রিসেটের কারণে রিডঅনলি অবস্থা থেকে চেঞ্জ হয়ে থাকে, 
    // তবে সেগুলোকে আবার আগের মতো নিরাপদ বা readonly করে দেওয়া
    const profileFullNameInput = document.getElementById('fullName');
    if (profileFullNameInput) {
        profileFullNameInput.setAttribute('readonly', true);
        profileFullNameInput.style.borderColor = ""; // বর্ডার কালার রিসেট
    }

    // ভবিষ্যতে ফোন বা ইমেইল ফিল্ড আসলে সেগুলোও এখানে রিডঅনলি বা আগের অবস্থায় ফিরিয়ে নিতে পারবেন
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

// আলাদাভাবে শুধুমাত্র ইউজার আইডি ধরার এবং সেট করার কোড
document.addEventListener('DOMContentLoaded', function () {
    const realUserId = sessionStorage.getItem('liveUserId');
    const userIdProfile = document.getElementById('user-id-profile');

    if (userIdProfile) {
        if (realUserId) {
            userIdProfile.textContent = `UID: ${realUserId}`;
        } else {
            userIdProfile.textContent = "UID: #XXXX"; // ডেটা না থাকলে ফলব্যাক
        }
    }
});

// আলাদাভাবে শুধুমাত্র অবতার বা প্রোফাইল লেটার ধরার এবং সেট করার কোড
document.addEventListener('DOMContentLoaded', function () {
    const realAvatarLetter = sessionStorage.getItem('liveAvatarLetter');
    const avatarLetterProfile = document.getElementById('profile-avatar-letter');
    const avatarLetter = document.getElementById('avatar-letter');

    if (avatarLetterProfile) {
        if (realAvatarLetter) {
            avatarLetterProfile.innerText = realAvatarLetter;
            avatarLetter.innerText = realAvatarLetter;
        } else {
            avatarLetterProfile.innerText = "U"; // ডেটা না থাকলে ফলব্যাক
            avatarLetter.innerText = "U"; // ডেটা না থাকলে ফলব্যাক
        }
    }
});