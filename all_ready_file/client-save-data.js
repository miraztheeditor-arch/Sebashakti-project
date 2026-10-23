sendBtn.addEventListener('click', function() {
    const messageText = chatInput.value.trim();
    if (messageText === "") return;

    // ক্লায়েন্টের ইনফো এবং তার নিজের ছবি বা অবতারের পাথ
    const clientAvatar = typeof savedImageString !== 'undefined' ? savedImageString : 'assets/client.png';

    // ১. ডাটাবেজে "incoming" হিসেবে সেভ করা
    MessagesAPI.saveClientMessage(currentJobId, currentTechUid, messageText);

    // ২. ক্লায়েন্টের স্ক্রিনে ইনস্ট্যান্ট রেন্ডার করার সময় টেক্সট এবং নিজের ছবি সহ দেখানো
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'outgoing'); 
    messageDiv.innerHTML = `
        <div class="msg-text">${escapeHtml(messageText)}</div>
        <img src="${escapeHtml(clientAvatar)}" alt="Client" class="msg-avatar">
    `;
    
    chatContainer.appendChild(messageDiv);

    // ৩. ইনপুট রিসেট এবং স্ক্রোল নিচে নামানো
    chatInput.value = '';
    chatInput.style.height = 'auto';
    sendBtn.disabled = true;
    chatContainer.scrollTop = chatContainer.scrollHeight;
});

let previousMessageCount = 0;

function loadExistingMessages(forceScroll = false) {
    const messagesContainer = document.getElementById('chat-messages-container');
    if (!messagesContainer) return;

    messagesContainer.innerHTML = '';

    try {
        const jobChats = (typeof MessagesAPI !== 'undefined' && typeof MessagesAPI.getJobAllChats === 'function') 
            ? MessagesAPI.getJobAllChats(currentJobId) 
            : {};

        const chatKey = `${currentJobId}_${currentTechUid}`;
        const chatData = jobChats ? jobChats[chatKey] : null;

        // যদি চ্যাট ডাটা বা মেসেজ না থাকে
        if (!chatData || !Array.isArray(chatData.messages) || chatData.messages.length === 0) {
            messagesContainer.innerHTML = `<p style="text-align: center; color: #888; margin-top: 20px;">কোনো মেসেজ নেই</p>`;
            return;
        }

        const messages = chatData.messages;
        const techAvatar = chatData.senderInfo && chatData.senderInfo.senderAvatar 
            ? chatData.senderInfo.senderAvatar 
            : 'assets/tech.png';

        // মেসেজগুলো রেন্ডার করার লুপ
     messages.forEach(msg => {
    let messageDiv = document.createElement('div');
    
    // ডিলিট এবং এডিট হ্যান্ডেল করার জন্য লোকাল ভেরিয়েবল
    let displayText = msg.text;
    let messageStyle = '';
    let editTagHtml = '';

    if (msg.isDeleted) {
        displayText = `🚫 এই মেসেজটি ডিলিট করা হয়েছে`;
        messageStyle = 'background-color: #e4e6eb !important; color: #555 !important; font-style: italic; border: 1px dashed #ccd0d5;';
    }

    if (msg.isEdited && !msg.isDeleted) {
        editTagHtml = `<div style="position: absolute; bottom: -14px; left: 0px; font-size: 9px; color: #8c8c8c; font-style: italic; white-space: nowrap;">Edited</div>`;
    }

    if (msg.sender === 'incoming') {
        // ডাটাবেজে incoming থাকলে ক্লায়েন্টের স্ক্রিনে outgoing (ডান দিক) দেখাবে
        messageDiv.className = 'message outgoing';
        messageDiv.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: flex-end;">
                <div class="msg-text" style="${messageStyle} position: relative; margin-bottom: 4px;">
                    ${escapeHtml(displayText)}
                    ${editTagHtml}
                </div>
            </div>
            <img src="${escapeHtml(savedImageString)}" alt="Avatar" class="msg-avatar">
        `;
    } else {
        // অন্যথায় incoming (বাম দিক) দেখাবে
        messageDiv.className = 'message incoming';
        messageDiv.innerHTML = `
            <img src="${escapeHtml(techAvatar)}" alt="Tech" class="msg-avatar">
            <div style="display: flex; flex-direction: column; align-items: flex-start;">
                <div class="msg-text" style="${messageStyle} position: relative; margin-bottom: 4px;">
                    ${escapeHtml(displayText)}
                    ${editTagHtml}
                </div>
            </div>
        `;
    }

    messagesContainer.appendChild(messageDiv);
 
    
});
        