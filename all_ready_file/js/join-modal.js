// পপআপ খোলার ফাংশন
function openJoinModal() {
    // ১. মোডাল খোলার সময় সব রেডিও বাটন রিসেট করা
    const radios = document.querySelectorAll('input[name="role"]');
    radios.forEach(radio => {
        radio.checked = false; // সব আন-সিলেক্ট করে দেবে
    });
    document.getElementById("joinModal").style.display = "block";
     // পপআপ খোলার সময় বডিতে ক্লাস যোগ করুন
    document.body.classList.add('stop-scrolling');
}

// পপআপ বন্ধ করার ফাংশন
function closeModal(id) {
    document.getElementById(id).style.display = "none";
        // পপআপ বন্ধ করার সময় ক্লাসটি সরিয়ে নিন
   document.body.classList.remove('stop-scrolling');
}


async function openConfirmation() {
     const selectedRadio = document.querySelector('input[name="role"]:checked');
     
    const radioContainer = document.querySelector('.my-radio-list'); // আপনার রেডিও বাটনের কন্টেইনার ক্লাস
    if (!selectedRadio) {
     // ১. লাল বর্ডার ও শেকিং ইফেক্ট যোগ করা
        radioContainer.classList.add('shake-animation');

        // ২. ০.৫ সেকেন্ড পর অ্যানিমেশন ক্লাসটি সরিয়ে ফেলা যাতে পরের বার আবার কাজ করে
        setTimeout(() => {
            radioContainer.classList.remove('shake-animation');
        }, 500);

        return; // ফাংশনটি এখানে থেমে যাবে
    }
    // ৮১ নম্বর লাইনের জন্য ট্রাই-ক্যাচ ব্লক
        try {
            await UserAPI.saveUserRole(selectedRadio.value);
            
          
            
        } catch (err) {
            // এরর হলে কমন মেসেজ
            console.error("Error saving user role:", err);
            alert("সার্ভারে সমস্যা হয়েছে, দয়া করে পুনরায় চেষ্টা করুন।");
            return; // এখানেই থেমে যাবে, সাইন আপ পেজে আর যাবে না
        }
   

    // ১. রোলের নাম অনুযায়ী বাংলা টেক্সট সেট করা
    let roleName = "";
    let noteText = "";

    if (selectedRadio.id === "client") {
        roleName = "আমি ক্লায়েন্ট";
        noteText = " সম্মানিত ইউজার! আপনি ক্লায়েন্ট হিসেবে অ্যাকাউন্ট করতে যাচ্ছেন। এর মানে হলো, আপনি আমাদের সাইটে থাকা সম্মানিত রেজিস্টার্ড টেকনিশিয়ানদের দ্বারা আপনার নিত্যপ্রয়োজনীয় সমস্যাগুলো সমাধান করিয়ে নিতে পারবেন। মনে রাখবেন, ক্লায়েন্ট প্রোফাইল ব্যবহার করে আপনি অন্য কারো কাজ করে আয় করতে পারবেন না; অর্থাৎ এই প্রোফাইলে আপনি টেকনিশিয়ানের কোনো সুবিধা পাবেন না।";
    } else if (selectedRadio.id === "technician") {
        roleName = "আমি টেকনিশিয়ান";
        noteText = " সম্মানিত ইউজার! আপনি টেকনিশিয়ান হিসেবে অ্যাকাউন্ট করতে যাচ্ছেন। এর মানে হলো, আপনি আমাদের সাইটের সম্মানিত ক্লায়েন্টদের বিভিন্ন সমস্যা সমাধান করে আয় করতে পারবেন। মনে রাখবেন, টেকনিশিয়ান প্রোফাইল ব্যবহার করে আপনি অন্য কাউকে দিয়ে নিজের কাজ করাতে পারবেন না; অর্থাৎ এই প্রোফাইলে আপনি ক্লায়েন্টের কোনো সুবিধা পাবেন না।";
    } else {
        roleName = "উভয়ই";
        noteText = " সম্মানিত ইউজার! আপনি ক্লায়েন্ট এবং টেকনিশিয়ান—উভয় হিসেবেই অ্যাকাউন্ট করতে যাচ্ছেন। এর মানে হলো, আপনি আমাদের সাইটে থাকা সম্মানিত রেজিস্টার্ড টেকনিশিয়ানদের দ্বারা নিজের সমস্যা সমাধান করাতে পারবেন এবং একই সাথে সম্মানিত ক্লায়েন্টদের বিভিন্ন সমস্যা সমাধান করে আয়ও করতে পারবেন। মনে রাখবেন, উভয় প্রোফাইল ব্যবহার করার সময় নিজ নিজ দায়িত্ব বজায় রাখা আপনার কর্তব্য; কোনো প্রোফাইলের সুবিধা অন্যটিতে অপব্যবহার করা সম্পূর্ণ নিষিদ্ধ।";
    }

    // ২. হেডিং এবং নোট আপডেট করা
    document.getElementById('dynamicHeading').innerText = "আপনি (" + roleName + ") সিলেক্ট করেছেন";
    document.getElementById('confirmNoteText').innerHTML = '<span class="note-label">নোট:</span> ' + noteText;
    // ৩. মোডাল দেখানো
    document.getElementById('joinModal').style.display = 'none';
    document.getElementById('confirmationModal').style.display = 'flex';
    // পপআপ খোলার সময় বডিতে ক্লাস যোগ করুন
    document.body.classList.add('stop-scrolling');
}

function closeConfirmation() {
    // কনফার্মেশন বন্ধ করে আগেরটিতে ফেরত আসা
    document.getElementById("confirmationModal").style.display = "none";
    document.getElementById("joinModal").style.display = "block";
    // পপআপ বন্ধ করার সময় ক্লাসটি সরিয়ে নিন
   document.body.classList.add('stop-scrolling');
}

function proceed() {
    
    // কনফার্ম হওয়ার পর পরবর্তী কাজ
    alert("আপনার নির্বাচন নিশ্চিত হয়েছে!");
    document.getElementById("confirmationModal").style.display = "none";
}

function confirmAndRedirect() {
    // ১. কোন রেডিও বাটনটি সিলেক্ট করা ছিল তা খুঁজে বের করুন
    const selectedRadio = document.querySelector('input[name="role"]:checked');
    
    if (selectedRadio) {
        // ৮১ নম্বর লাইনের জন্য ট্রাই-ক্যাচ ব্লক
         
            // ৩. সফল হলে তবেই সাইন আপ পেজে পাঠান
            window.location.href = "all_ready_file/html/signup-form.html";
    }
}

// লগইন চেক করার সময়:
findUserByCredential: async (identifier, password) => {
    const masterData = JSON.parse(localStorage.getItem('userMasterData') || '{}');
    
    // লুপ চালিয়ে চেক করুন ফোন অথবা ইমেইলের সাথে পাসওয়ার্ড মেলে কি না
    for (let phone in masterData) {
        const user = masterData[phone];
        if ((phone === identifier || user.email === identifier) && user.password === password) {
            return user; // পুরো ইউজার ডাটা (আইডিসহ) ফেরত দিবে
        }
    }
    return null;
}