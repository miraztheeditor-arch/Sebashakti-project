document.addEventListener('DOMContentLoaded', function() {
    const avatarLetterSpan = document.getElementById('avatar-letter');
    const savedName = localStorage.getItem('userName');

    if (savedName && savedName.length > 0) {
        // যদি নাম থাকে, তবে প্রথম অক্ষরটি দেখাও
        avatarLetterSpan.innerText = savedName.charAt(0).toUpperCase();
    } else {
        // নাম না থাকলে ডিফল্ট কিছু একটা দাও
        avatarLetterSpan.innerText = "U"; // 'U' for User
    }
});