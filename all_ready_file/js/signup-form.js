
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("signupForm");
    const submitBtn = document.querySelector(".submit-btn");
    const termsContainer = document.querySelector(".terms-container");
    const nameInput = document.getElementById("name"); // আইডি 'name'
    
    // আপনার ইনপুটগুলোর আইডি ধরে নিন (HTML এ আইডি বসিয়ে নিন যদি না থাকে)
  
    const phoneInput = document.getElementById("phone"); // আইডি 'phone'
    const passInput = document.getElementById("pass"); // আইডি 'password'
    const termsCheckbox = document.getElementById("terms");
    

    submitBtn.addEventListener("click", function(event) {
        event.preventDefault(); 

        let isValid = true;
        const inputs = [nameInput, phoneInput, passInput];

        // ১. সব ইনপুট চেক করুন
        inputs.forEach(input => {
            if (input && input.value.trim() === "") {
                input.classList.add("input-error");
                setTimeout(() => input.classList.remove("input-error"), 800);
                isValid = false;
            }
        });
        // ১. আগে চেক করুন কোনো ঘর খালি কি না
        if (nameInput.value.trim() === "" || phoneInput.value.trim() === "" || passInput.value.trim() === "") {
            return; // এখানেই কোড থেমে যাবে, পরের কোনো কন্ডিশন কাজ করবে না
        }

        // ২. নামের ভ্যালিডেশন চেক (আপনার আগের করা কন্ডিশন)
        const nameValue = nameInput.value.trim();
       const nameRegex = /^(?=.*[\p{L}])[\p{L}\d\s\W]{3,50}$/u;

        if (nameValue.length < 3 || nameValue.length > 50 || !nameRegex.test(nameValue)) {
            nameInput.classList.add("input-error");
           // এখানে প্লেসহোল্ডার না পাল্টে স্প্যানটি দেখান
        const errSpan = document.getElementById("nameErrorMessage");
       errSpan.classList.add("show-error"); // ক্লাস যোগ করছি
            
            return;

        }
const phoneEmailInput = document.getElementById("phone");
const phoneEmailValue = phoneEmailInput.value.trim();

// ইমেইলের জন্য রেজেক্স
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// ফোন নম্বরের জন্য রেজেক্স (০ দিয়ে শুরু এবং ১১ ডিজিট)
const phoneRegex =/^(\+88)?(01[3-9]\d{8})$/;

// চেক করার লজিক
if (emailRegex.test(phoneEmailValue)) {
    // এটি ইমেইল, কাজ ঠিক আছে
    console.log("ইমেইল সঠিক");
} else if (phoneRegex.test(phoneEmailValue)) {
    // এটি ফোন নম্বর এবং ০১ দিয়ে শুরু হয়েছে
    console.log("ফোন নম্বর সঠিক");
} else {
    // উভয়ই ভুল
    phoneEmailInput.classList.add("input-error");
    document.getElementById("phoneEmailErrorMessage").classList.add("show-error");
    return;
}



// ২. সাবমিট লজিকের ভেতরে পাসওয়ার্ড চেক
const passwordInput = document.getElementById("pass");
const toggleEye = document.getElementById("togglePassword"); // আপনার আইকনের আইডি
const passwordErrorWrapper = document.getElementById("passwordErrorWrapper");
// মাঝখানের স্পেসসহ সব স্পেস রিমুভ করে ফেলা
const passwordValue = passwordInput.value.replace(/\s+/g, '');

// সব ধরণের বিশেষ চিহ্নের জন্য এই Regex ব্যবহার করুন
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
if (!passwordRegex.test(passwordValue)) {
    passwordInput.classList.add("input-error");
    // ইনপুট টাইপ টেক্সট করে দিন
    passwordInput.type = "text";
    // আইকনটি ওপেন চোখের ইমোজি দিয়ে বদলে দিন
    toggleEye.textContent = "🙈";
    passwordErrorWrapper.style.display = "block"; // মেসেজ ও বাটন দেখাবে
    return; // সাবমিট আটকে যাবে
} else {
    passwordInput.classList.remove("input-error");
    passwordErrorWrapper.style.display = "none";
    guideDiv.style.display = "none";
}
   // ২. যদি ইনপুট সব ঠিক থাকে, তখনই চেকবক্স চেক করুন
        if (isValid) {
            if (!termsCheckbox.checked) {
                termsCheckbox.classList.add("input-error");
                setTimeout(() => termsCheckbox.classList.remove("input-error"), 800);
                console.log("চেকবক্স চেক করা হয়নি");
            } else {
                // সবকিছু পারফেক্ট!
                document.getElementById("otpSection").style.display = "block";
                termsContainer.style.display = "none";
                
            // যদি বাটনটি "সাবমিট" অবস্থায় থাকে
    if (this.innerText === "সাবমিট") {
        // ১. ওটিপি সেকশন দেখান
        document.getElementById("otpSection").style.display = "block";
        focusFirstOtpBox();
        // এডিট বাটনটিও দেখান
    document.querySelector(".edit-info-container").style.display = "block";
        // এখানে 'phone' আইডিটি ব্যবহার করুন
        const contactInput = document.getElementById("phone").value; 
        const instructionText = document.getElementById("otpInstruction");

        // চেক করুন ইনপুটটি ফোন নাকি ইমেইল (ইমেইলে '@' চিহ্ন থাকে)
        if (contactInput.includes("@")) {
            instructionText.innerText = "আপনার ইমেইলে পাঠানো ৬ সংখ্যার কোডটি লিখুন:";
        } else {
            instructionText.innerText = "আপনার নম্বরে পাঠানো ৬ সংখ্যার কোডটি লিখুন:";
        }
        // ইনপুট ফিল্ড লক করা
            nameInput.disabled = true;
            phoneInput.disabled = true;
            passInput.disabled = true;
        // ২. টাইমার শুরু করুন (যদি প্রয়োজন হয়)
        startOtpTimer();
        
        // ৩. বাটনের টেক্সট বদলে ফেলুন
        this.innerText = "কনফার্ম";
    } 
    // আপনার কনফার্ম বাটনের ক্লিক ইভেন্টটি এভাবে লিখুন
else if (this.innerText === "কনফার্ম") {
    
    // ১. সব ইনপুট বক্সের মান চেক করুন
    const otpInputs = document.querySelectorAll('.otp-box');
    let otpValue = "";
    otpInputs.forEach(input => otpValue += input.value);

    // ২. শর্ত যাচাই করুন (ভ্যালিডেশন)
    if (otpValue.length < 6) {
        // ঘর খালি থাকলে এরর দেখান এবং নিচে রিটার্ন করুন যাতে পরের লাইনে না যায়
        showError("আপনাকে ওটিপি বক্স পূর্ণ করতে হবে!");
        return; 
    } 
    
    if (otpValue !== "123456") { // এখানে আপনার সঠিক ওটিপি চেক করুন
        // ভুল ওটিপি হলে এরর দেখান
        showError("ভুল ওটিপি! সঠিক কোডটি পুনরায় লিখুন।");
        return; 
    }

    // ৩. সবকিছু ঠিক থাকলে শুধুমাত্র তখনই ড্যাশবোর্ডে পাঠান
    window.location.href = "dashboard.html";
    // নতুন অংশ: ওটিপি বক্সগুলো খালি করা
    otpBoxes.forEach(box => {
        box.value = ""; // প্রতিটি বক্সের মান খালি করে দিবে
        
    });
}
            }
        }
    });
    // HTML এ onclick না লিখে সরাসরি এখান থেকে ইভেন্ট লিসেনার যোগ করুন
document.getElementById("editContactBtn").addEventListener("click", function() {
    // ১. ওটিপি সেকশন লুকিয়ে দিন
    document.getElementById("otpSection").style.display = "none";
    
    // ২. এডিট বাটনটি (তথ্য পরিবর্তন) লুকিয়ে দিন
    document.querySelector(".edit-info-container").style.display = "none";
    
    
    // ৩. ইনপুট ফিল্ডগুলো আবার আনলক (Enable) করুন
    nameInput.disabled = false;
    phoneInput.disabled = false;
    passInput.disabled = false;
    
    // ৪. বাটন টেক্সট আবার "সাবমিট" করে দিন
    submitBtn.innerText = "সাবমিট";
    termsContainer.style.display = "block";
    // নতুন অংশ: ওটিপি বক্সগুলো খালি করা
    otpBoxes.forEach(box => {
        box.value = ""; // প্রতিটি বক্সের মান খালি করে দিবে
        box.classList.remove('input-error');  // যদি কোনো ক্লাস থাকে
    });
   document.getElementById('otp-error').style.display = "none";
});
});

// ওটিপি বক্সের জন্য অটো-ফোকাস লজিক
const otpBoxes = document.querySelectorAll('.otp-box');
otpBoxes.forEach((box, index) => {
    box.addEventListener('input', (e) => {
        // ১. প্রথমেই টেক্সট হলে তা মুছে ফেলুন (এটি আপনার লাইনে ছিলই)
        box.value = box.value.replace(/[^0-9]/g, '');

        // ২. এখন চেক করুন এটি ব্যাকস্পেস কি না
        if (e.inputType === 'deleteContentBackward') {
            if (index > 0) otpBoxes[index - 1].focus();
        } 
        // ৩. শুধু তখনই পরের ঘরে যাবে যদি বক্সটি খালি না হয় (অর্থাৎ সংখ্যা বসেছে)
        else if (box.value.length === 1) {
            if (index < otpBoxes.length - 1) {
                otpBoxes[index + 1].focus();
            }
        }
    });

  box.addEventListener('keydown', (e) => {
    // ১. ওভাররাইট লজিক: যদি সংখ্যা চাপেন (0-9)
    if (e.key >= 0 && e.key <= 9) {
        box.value = e.key; // পুরোনোটি মুছে নতুনটি বসবে
        if (index < otpBoxes.length - 1) {
            otpBoxes[index + 1].focus(); // পরের বক্সে ফোকাস
        }
        e.preventDefault(); // ব্রাউজারের ডিফল্ট আচরণ বন্ধ করে আমাদেরটা সেট করা
        return;
    }
    if (e.key === 'Backspace' && !box.value && index > 0) {
        otpBoxes[index - 1].focus();
        otpBoxes[index - 1].setSelectionRange(1, 1);
    }
    else if (e.key === 'ArrowRight' && index < otpBoxes.length - 1 && box.value) {
        otpBoxes[index + 1].focus();
        // ছোট delay ব্যবহার করে ফোকাস সেট হওয়ার পর পজিশন ঠিক করা
        setTimeout(() => {
            otpBoxes[index + 1].setSelectionRange(1, 1);
        }, 0);
    }
   else if (e.key === 'ArrowLeft') {
    if (index > 0) {
        // আগের ঘরে ফোকাস
        otpBoxes[index - 1].focus();
        setTimeout(() => otpBoxes[index - 1].setSelectionRange(1, 1), 0);
    } else if (index === 0) {
        // যদি প্রথম ঘরেই থাকে, তবে অ্যারো টিপলেও কারসার যেন নড়াচড়া না করে
        e.preventDefault(); 
        box.setSelectionRange(1, 1);
    }
}
});
});
// রিসেন্ড বাটন ক্লিক করলে নতুন ওটিপি পাঠানোর লজিক
document.getElementById("resendBtn").addEventListener("click", function() {
    if (!this.classList.contains("disabled")) {
        alert("নতুন ওটিপি পাঠানো হয়েছে!");
        startOtpTimer(); // নতুন করে টাইমার চালু হবে
    }
});

// টাইমার ফাংশন
function startOtpTimer() {
    let timeLeft = 60; // সময়
    const resendBtn = document.getElementById("resendBtn");
    
    // বাটনটিকে ডিজেবল ও ধূসর করা
    resendBtn.classList.add("disabled");
    resendBtn.innerText = `Resend (${timeLeft}s)`;
    
    // আগের কোনো টাইমার চললে সেটা বন্ধ করা
    if (window.otpInterval) clearInterval(window.otpInterval);
    
    window.otpInterval = setInterval(() => {
        timeLeft--;
        resendBtn.innerText = `Resend (${timeLeft}s)`;
        
        if (timeLeft <= 0) {
            clearInterval(window.otpInterval);
            resendBtn.innerText = "Resend";
            resendBtn.classList.remove("disabled"); // বাটন আবার সচল করা
        }
    }, 1000);
}

// সরাসরি nameInput ভেরিয়েবলের ওপর নির্ভর না করে পুরো ডকুমেন্টে লিসেনার দিচ্ছি
document.addEventListener("focus", function(event) {
    // চেক করছি ক্লিক করা এলিমেন্টটি কি সত্যিই আমাদের সেই ইনপুট বক্স?
    if (event.target && event.target.id === 'name') {
        
        
        // এখানে আপনার কাজের কোডগুলো দিন
        event.target.classList.remove("input-error");
        event.target.style.color = "black";
        
        const errSpan = document.getElementById("nameErrorMessage");
        if(errSpan) {
            errSpan.classList.remove("show-error");
        }
    }
  
    if (event.target.id === 'phone') {
        event.target.classList.remove("input-error");
        document.getElementById("phoneEmailErrorMessage").classList.remove("show-error");
        event.target.style.color = "black";
    }

  
}, true); // true মানে এটি ক্যাপচারিং ফেজে কাজ করবে, যা খুবই পাওয়ারফুল

// ১. টগল বাটনের কাজ
const toggleBtn = document.getElementById("toggleGuideBtn");
const guideDiv = document.getElementById("passwordGuide");

toggleBtn.addEventListener("click", function() {
    if (guideDiv.style.display === "none") {
        guideDiv.style.display = "block";
        toggleBtn.textContent = "বন্ধ করুন";
      
    } else {
        guideDiv.style.display = "none";
        toggleBtn.textContent = "দেখুন";
          
    }
});

const passwordInput = document.getElementById("pass");
const toggleBtnPro = document.getElementById("togglePassword");

passwordInput.addEventListener("input", function() {
    // যদি ইনপুট বক্সে ১টি ক্যারেক্টারও থাকে, তবে চোখ দেখাও
    if (this.value.length > 0) {
        toggleBtnPro.style.display = "block";
    } else {
        // যদি খালি হয়, তবে লুকিয়ে ফেলো
        toggleBtnPro.style.display = "none";
    }
});

// ক্লিক করলে শো/হাইড করার লজিক (আগেরটি)
toggleBtnPro.addEventListener("click", function() {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    toggleBtnPro.textContent = isPassword ? "🙈" : "👁️";
});
passwordInput.addEventListener("focus", function(event) {
    // ১. সাধারণ ফোকাস কাজ (ইনপুট ঠিক করা, কালার ঠিক করা ইত্যাদি)
    this.style.color = "black";
    
    // ২. এরর থাকলে তা হ্যান্ডেল করা
    if (this.classList.contains("input-error")) {
        // পাসওয়ার্ড হাইড করা
        this.type = "password";
        document.getElementById("togglePassword").textContent = "👁️";
        
        // এরর ক্লাস ও মেসেজ রিমুভ করা
        this.classList.remove("input-error");
        
        const errorWrapper = document.getElementById("passwordErrorWrapper");
        if(errorWrapper) {
            errorWrapper.style.display = "none";
        }
        
        // অন্যান্য এলিমেন্ট রিসেট করা
        document.getElementById("passwordGuide").style.display = "none";
        document.getElementById("toggleGuideBtn").textContent = "দেখুন";
    }
});

function toggleTerms(event) {
    // এই লাইনটিই ম্যাজিকের মতো কাজ করবে
    // এটি ক্লিক ইভেন্টকে চেক বক্সের লেবেলে পৌঁছাতে বাধা দেয়
    event.preventDefault(); 
    event.stopPropagation();
    
    const termsContent = document.getElementById('terms-content');
    
    // ড্রপডাউন টগল করার লজিক
    if (termsContent.style.display === "none" || termsContent.style.display === "") {
        termsContent.style.display = "block";
        termsContent.scrollTop = 0;
    } else {
        termsContent.style.display = "none";
    }
}
function showError(message) {
    const errorDiv = document.getElementById('otp-error');
    errorDiv.innerText = message;
    errorDiv.style.display = "block";

    // এখানে লজিক পরিবর্তন করা হয়েছে
    const otpInputs = document.querySelectorAll('.otp-box');
    
    otpInputs.forEach(input => {
        // শুধুমাত্র খালি বক্সগুলোতেই লাল বর্ডার এবং শেক হবে
        if (input.value === "") {
            input.classList.add('input-error');
            input.style.border = "1px solid red";
        } else {
            // যেগুলো পূর্ণ আছে, সেগুলোর স্টাইল স্বাভাবিক থাকবে
            input.classList.remove('input-error');
            input.style.border = "1px solid #ccc"; // অথবা আপনার ডিফল্ট বর্ডার কালার
        }
    });
}



const otpInputs = document.querySelectorAll('.otp-box');

otpInputs.forEach((input, index) => {
    input.addEventListener('focus', () => {
        // ১. প্রতিটি বক্স থেকে 'input-error' ক্লাস সরিয়ে ফেলুন এবং বর্ডার ঠিক করুন
        otpInputs.forEach(item => {
            item.classList.remove('input-error');
            item.style.border = "1px solid #ccc"; // ডিফল্ট বর্ডার
        });

        // ২. এরর মেসেজটি লুকিয়ে ফেলুন
        const errorDiv = document.getElementById('otp-error');
        if (errorDiv) {
            errorDiv.style.display = "none";
        }

        // ৩. বর্তমানে ফোকাস থাকা বক্সের স্টাইল
        input.style.border = "2px solid #28a745"; // সবুজ বর্ডার
        input.classList.add('active-focus');
    });

    // blur ইভেন্ট
    input.addEventListener('blur', () => {
        input.style.border = "1px solid #ccc";
        input.classList.remove('active-focus');
    });

    // অটো-ফোকাস লজিক
    input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });
});

// ওটিপি বক্সটি দেখানোর পর এই ফাংশনটি কল করুন
function focusFirstOtpBox() {
    const firstBox = document.querySelector('.otp-box'); // আপনার প্রথম ওটিপি বক্সটি সিলেক্ট করা
    if (firstBox) {
        firstBox.focus();
    }
}