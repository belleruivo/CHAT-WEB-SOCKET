let username = '';
let avatarUrl = '';
let userId = '';

const socket = io();
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const loginName = document.getElementById('login-name');
const loginAvatar = document.getElementById('login-avatar');
const chatContainer = document.getElementById('chat-container');
const form = document.getElementById('form');
const input = document.getElementById('message');
const chat = document.getElementById('chat');
const themeToggle = document.getElementById('theme-toggle');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');

const customEmojiContainer = document.createElement('div');
customEmojiContainer.id = 'custom-emoji-container';
customEmojiContainer.style.cssText = `
    display: none;
    position: absolute;
    background: #232a36;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    padding: 10px;
    z-index: 5000;
    flex-wrap: wrap;
    justify-content: center;
`;
document.body.appendChild(customEmojiContainer);

const commonEmojis = ['🫦', '🚀', '🤢', '😈', '🔥'];
commonEmojis.forEach(emoji => {
    const emojiElement = document.createElement('span');
    emojiElement.textContent = emoji;
    emojiElement.style.cssText = `
        font-size: 24px;
        cursor: pointer;
        margin: 5px;
        padding: 5px;
        transition: transform 0.1s;
    `;
    emojiElement.addEventListener('click', () => {
        input.value += emoji;
        customEmojiContainer.style.display = 'none';
        input.focus();
    });
    emojiElement.addEventListener('mouseover', () => {
        emojiElement.style.transform = 'scale(1.2)';
    });
    emojiElement.addEventListener('mouseout', () => {
        emojiElement.style.transform = 'scale(1)';
    });
    customEmojiContainer.appendChild(emojiElement);
});

emojiBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (customEmojiContainer.style.display === 'none' || customEmojiContainer.style.display === '') {
        const rect = emojiBtn.getBoundingClientRect();
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            customEmojiContainer.style.left = '10px';
            customEmojiContainer.style.bottom = '70px';
        } else {
            customEmojiContainer.style.left = Math.max(10, rect.left - 40) + 'px';
            customEmojiContainer.style.bottom = (window.innerHeight - rect.top + 10) + 'px';
        }
        customEmojiContainer.style.display = 'flex';
    } else {
        customEmojiContainer.style.display = 'none';
    }
});

document.body.addEventListener('click', (e) => {
    if ((customEmojiContainer.style.display === 'flex') && 
        !customEmojiContainer.contains(e.target) && 
        e.target !== emojiBtn) {
        customEmojiContainer.style.display = 'none';
    }
});

function setTheme(dark) {
    document.body.classList.toggle('light', !dark);
    themeToggle.textContent = dark ? '🌙' : '☀️';
    themeToggle.classList.toggle('active', !dark);
}
themeToggle.addEventListener('click', () => {
    setTheme(document.body.classList.contains('light'));
});
setTheme(true);

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    username = loginName.value.trim().substring(0, 20);
    if (!username || !loginAvatar.files[0]) return;

    const formData = new FormData();
    formData.append('avatar', loginAvatar.files[0]);
    formData.append('username', username);
    const res = await fetch('/upload_avatar', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
        avatarUrl = data.avatar_url;
        userId = data.user_id;
        loginModal.style.display = 'none';
        chatContainer.style.display = '';
        input.focus();
    } else {
        alert('Erro ao fazer upload do avatar.');
    }
});

function getInitials(name) {
    return name.split(' ').map(p => p[0]).join('').substring(0,2).toUpperCase();
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value.trim()) {
        const now = new Date();
        const time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        socket.emit('message', {
            user: username,
            avatar: avatarUrl,
            user_id: userId,
            text: input.value,
            time: time
        });
        input.value = '';
    }
});

socket.on('message', function(msg) {
    const div = document.createElement('div');
    div.classList.add('msg');
    if (msg.user_id === userId) {
        div.classList.add('msg-own');
    } else {
        div.classList.add('msg-other');
    }

    const userBlock = document.createElement('div');
    userBlock.className = 'user-block';
    if (msg.avatar) {
        const img = document.createElement('img');
        img.src = msg.avatar;
        img.className = 'avatar';
        img.alt = msg.user;
        userBlock.appendChild(img);
    } else {
        const av = document.createElement('div');
        av.className = 'avatar';
        av.textContent = getInitials(msg.user);
        userBlock.appendChild(av);
    }
    const userName = document.createElement('span');
    userName.className = 'user';
    userName.textContent = msg.user;
    userBlock.appendChild(userName);
    div.appendChild(userBlock);

    const contentContainer = document.createElement('div');
    contentContainer.className = 'content-container';
    contentContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
    `;
    div.appendChild(contentContainer);

    const text = document.createElement('span');
    text.className = 'text';
    text.innerHTML = msg.text.replace(/\n/g, '<br>');
    contentContainer.appendChild(text);

    if (msg.time) {
        const time = document.createElement('span');
        time.className = 'time';
        time.textContent = msg.time;
        contentContainer.appendChild(time);
    }
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
});

window.addEventListener('DOMContentLoaded', () => {
    input && input.focus();
});

input.setAttribute('inputmode', 'text');
input.setAttribute('pattern', '.*');
