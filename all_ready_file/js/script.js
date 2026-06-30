function openPopup(title, desc) {
    document.getElementById('popupTitle').innerText = title;
    document.getElementById('popupDesc').innerText = desc;
    document.getElementById('servicePopup').style.display = 'flex';
    document.body.classList.add('stop-scrolling');
}

function closePopup() {
    document.getElementById('servicePopup').style.display = 'none';
    document.body.classList.remove('stop-scrolling');
}