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

// ক্লায়েন্ট আইডি থেকে আসা কাজের স্যাম্পল ডাটা
const allJobsDatabase = [
    { id: 1, title: "এসি সার্ভিসিং - ২ ইউনিট", category: "ac", area: "your-area", client: "রহিম এন্টারপ্রাইজ", location: "মিরপুর, ঢাকা" },
    { id: 2, title: "নতুন ওয়্যারিং ও সুইচ ফিটিং", category: "electrical", area: "other", client: "করিম ব্রাদার্স", location: "ধানমন্ডি, ঢাকা" },
    { id: 3, title: "বাথরুম ফিটিংস ও পাইপ মেরামত", category: "plumbing", area: "your-area", client: "মডার্ন বিল্ডার্স", location: "মিরপুর, ঢাকা" },
    { id: 4, title: "সম্পূর্ণ বাসা ডিপ ক্লিনিং", category: "cleaning", area: "other", client: "নবাব ম্যানশন", location: "গুলশান, ঢাকা" },
    { id: 5, title: "রেফ্রিজারেটর গ্যাস চার্জ", category: "fridge", area: "your-area", client: "ভাই ভাই স্টোর", location: "মিরপুর, ঢাকা" }
];

let selectedCategory = 'all';
let selectedAreaType = 'all'; // 'all' অথবা 'area'

// পেজ লোড হওয়ার সাথে সাথে রেন্ডার করা
document.addEventListener("DOMContentLoaded", () => {
    renderFilteredJobs();
});

// ক্যাটাগরি সিলেক্ট করার ফাংশন
function selectCategory(categoryKey, categoryDisplayName, element) {
    selectedCategory = categoryKey;
    
    // সাইডবারের একটিভ ক্লাস পরিবর্তন
    document.querySelectorAll('.left-sidebar-menu .menu-category-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    // ডান পাশের ওপরের হেদারে নাম শো করানো
    document.getElementById('selectedCategoryTitle').innerText = categoryDisplayName;

    renderFilteredJobs();
}

// All বা Your Areas ট্যাব সিলেক্ট করার ফাংশন
function setAreaFilter(areaType, element) {
    selectedAreaType = areaType;

    document.querySelectorAll('.two-tabs .filter-tab-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    renderFilteredJobs();
}

// ফিল터 অনুযায়ী কাজ স্ক্রিনে দেখানোর লজিক
function renderFilteredJobs() {
    const searchText = document.getElementById('jobSearchInput').value.toLowerCase();
    const gridContainer = document.getElementById('jobsCardsGrid');
    
    gridContainer.innerHTML = '';

    const filteredData = allJobsDatabase.filter(job => {
        // ক্যাটাগরি ম্যাচ চেক
        let matchCat = (selectedCategory === 'all' || job.category === selectedCategory);
        
        // এরিয়া ম্যাচ চেক
        let matchArea = true;
        if (selectedAreaType === 'area') {
            matchArea = (job.area === 'your-area');
        }

        // সার্চ টেক্সট চেক
        let matchSearch = job.title.toLowerCase().includes(searchText) || job.client.toLowerCase().includes(searchText) || job.location.toLowerCase().includes(searchText);

        return matchCat && matchArea && matchSearch;
    });

    if (filteredData.length === 0) {
        gridContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 30px;">দুঃখিত! এই মুহূর্তে আপনার এই ক্যাটাগরিতে কোনো কাজ পাওয়া যায়নি।</p>';
        return;
    }

    filteredData.forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-item-card';
        card.innerHTML = `
            <div>
                <div class="job-card-top">
                    <span class="job-client-name">${job.client}</span>
                    <span class="job-location-text">📍 ${job.location}</span>
                </div>
                <div class="job-service-title">🔧 ${job.title}</div>
            </div>
            <button class="btn-details-action" onclick="viewJobDetails('${job.title}')">বিস্তারিত দেখুন</button>
        `;
        gridContainer.appendChild(card);
    });
}

// সার্চ ইনপুটে টাইপ করলে ফিল্টার করার ফাংশন
function filterJobsList() {
    renderFilteredJobs();
}

// পেছনের পেজে যাওয়ার ব্যাক বাটন ফাংশন
function goBack() {
    window.history.back();
}

// বিস্তারিত দেখার বাটন ক্লিক করলে
function viewJobDetails(title) {
    alert(`"${title}" কাজটির বিস্তারিত দেখতে প্রসিড করা হচ্ছে।`);
}

document.getElementById('jobs-btn').addEventListener('click', function() {
    window.location.href = 'find-jobs.html';
});

document.getElementById('bell-icon').addEventListener('click', function() {
    window.location.href = 'bell-icon.html';
});
