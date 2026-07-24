const mongoose = require('mongoose');

const uri = "mongodb+srv://miraztheeditor_db_user:PFY2lFpW4uKiea2V@cluster0.n1q1d.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("সফলভাবে ডাটাবেজ কানেক্ট হয়েছে!");
  })
  .catch((err) => {
    console.error("কানেকশনে সমস্যা হয়েছে:", err.message);
  });





  // ১৫৭-১৫৮ নম্বর লাইনের পরিবর্তে:
// আপনার সাবমিট বাটনের লজিকটি এরকম আছে তো?
const phoneEmailValue = document.getElementById("phone").value.trim();
const existingUser = await UserAPI.findUserByPhone(phoneEmailValue);
// সাইন-আপের সাবমিট বাটনের লজিক
if (existingUser) {
    alert("এই নম্বর দিয়ে আগেই অ্যাকাউন্ট করা হয়েছে। লগইন করুন।");
    
    // লগইন মোডাল খোলার সিগন্যাল সেট করুন
    localStorage.setItem("shouldOpenLoginModal", "true");
     document.getElementById("otpSection").style.display = "none";
      termsContainer.style.display = "block";
    // ইনডেক্স পেজে পাঠিয়ে দিন
    window.location.href = "../../index.html"; 
    return;
}


document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const activeParam = urlParams.get('active');

   if (activeParam === 'recent-request') {
    // ১. সব বাটন থেকে 'active' ক্লাস সরিয়ে দিন
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    // ২. প্রথম বাটনটি খুঁজে বের করুন
    const allNavBtns = document.querySelectorAll('.nav-btn');
    if (allNavBtns.length > 0) {
        // ক্লিক না করে সরাসরি 'active' ক্লাসটি যোগ করুন
        allNavBtns[1].classList.add('active');
    }

    // ৩. হেডার ম্যানুয়ালি আপডেট করুন
    document.getElementById('main-title').innerText = "Recent Job";

    // ৪. ট্যাব আপডেট করুন
    selectTab('today-requests');
}
});


function selectTab(tabId) {
    // ১. সব ট্যাব বাটন থেকে 'active' ক্লাস সরানো
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // ২. সব ট্যাব কন্টেন্ট থেকে 'active' ক্লাস সরানো
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // ৩. নির্দিষ্ট ট্যাব বাটনে 'active' ক্লাস যোগ করা (বাটনটির আইডি থাকলে)
    // অথবা আপনি যদি সরাসরি এলিমেন্ট জানেন:
    const targetTabBtn = document.querySelector(`[onclick*="${tabId}"]`);
    if (targetTabBtn) targetTabBtn.classList.add('active');

    // ৪. নির্দিষ্ট ট্যাব কন্টেন্টে 'active' ক্লাস যোগ করা
    const targetContent = document.getElementById(tabId);
    if (targetContent) targetContent.classList.add('active');
}

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');

    // যদি ইউআরএল থেকে কোনো ট্যাব পাওয়া যায়, তবে সেটি সিলেক্ট করো
    if (tabParam) {
        selectTab(tabParam);
    } else {
        // যদি কিছু না থাকে, তবে ডিফল্টভাবে 'today-requests' দেখাবে
        selectTab('today-requests');
    }
});


 <div class="right-panel">
    <div class="main-header" id="main-title">My Jobs</div>
    <div class="header-tabs">
       <button class="tab-btn" onclick="showTab(event, 'today-requests')">আজকের অনুরোধ</button>
       <button class="tab-btn" onclick="showTab(event, 'ongoing-works')">চলমান কাজ</button>
       <button class="tab-btn" onclick="showTab(event, 'today-schedule')">আজকের শিডিউল</button>
    </div>

    

<div class="content-area">
    <div id="today-requests" class="tab-content active">
        <!-- এখানে আপনার আজকের অনুরোধের কার্ডটি রাখুন -->
        <h3>আজকের অনুরোধ</h3> 
    </div>

    <div id="ongoing-works" class="tab-content">
        <h3>চলমান কাজ</h3>
    </div>

    <div id="today-schedule" class="tab-content">
        <h3>আজকের শিডিউল</h3>
    </div>
</div>
</div>

function updateView(title, element) {
    // ১. মেইন হেডারের লেখা বদলানো
    document.getElementById('main-title').innerText = title;

    // ২. সব বাটন থেকে 'active' ক্লাস সরানো
    let buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // ৩. বর্তমানে ক্লিক করা বাটনে 'active' ক্লাস যোগ করা
    element.classList.add('active');
}


.left-sidebar {
    /* সাইডবারের উইডথ স্ক্রিন সাইজের সাথে কমবে-বাড়বে */
    width: clamp(150px, 20vw, 300px); 
    
    /* ভেতরের এলিমেন্টগুলোকেও রেশিও অনুযায়ী ছোট করার জন্য */
    font-size: clamp(12px, 1vw, 16px);
    padding: clamp(5px, 1vw, 20px);
    transition: all 0.3s ease; /* মসৃণ পরিবর্তনের জন্য */
}

/* বাম পাশের প্যানেল */
.left-sidebar {
    width: 20%;         /* নির্দিষ্ট প্রস্থ */
    height: 100%;         /* বক্সের পুরো হাইট */
    background-color: #f8f9fa;
    border-right: 1px solid #e0e0e0;
    flex-shrink: 0;       /* এটি যাতে ছোট না হয়ে যায় */
    /* সব এলিমেন্টের ফন্ট সাইজ এবং সাইজ প্যারেন্ট এলিমেন্টের সাথে তাল মিলিয়ে চলবে */
    font-size: inherit;
}

