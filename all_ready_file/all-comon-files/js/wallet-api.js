window.WalletAPI = {
    getTechnicianWalletData: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlUserId = urlParams.get('id');

        if (!urlUserId) {
            console.warn("ইউজার আইডি পাওয়া যায়নি!");
            return null;
        }

        let userMasterData = JSON.parse(localStorage.getItem('userMasterData')) || {};
        let targetKey = null;
        let targetUser = null;

        for (let key in userMasterData) {
            const user = userMasterData[key];
            if (key === urlUserId || user.userId === urlUserId) {
                targetUser = user;
                targetKey = key;
                break;
            }
        }

        if (targetUser) {
            // যদি myWallet না থাকে, তবে পুরোনো বা নতুন ইউজারের জন্য স্বয়ংক্রিয়ভাবে এটি তৈরি করে লোকালস্টোরেজে সেভ করে দেব
            if (!targetUser.myWallet) {
                targetUser.myWallet = {
                    balance: 0, // আপনার ইচ্ছেমতো ডিফল্ট মান বা ৭৫ রাখতে পারেন
                    totalCommission: 0,
                    dueAdjustment: 0,
                    balanceCheckFlag: 3
                };

                // লোকালস্টোরেজে মাস্টার ডাটা আপডেট করা
                userMasterData[targetKey] = targetUser;
                localStorage.setItem('userMasterData', JSON.stringify(userMasterData));
                console.log("পুরোনো ইউজারের জন্য নতুন myWallet তৈরি ও সেভ করা হয়েছে!");
            }

            return targetUser.myWallet;
        }

        return null;
    }
};