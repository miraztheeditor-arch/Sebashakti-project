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