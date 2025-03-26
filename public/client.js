const socket = io();
const form = document.getElementById('chat-form');
const messagesContainer = document.getElementById('messages');
const input = document.getElementById('message-input');
const usernameInput = document.getElementById('username');

// Xabarni ko‘rsatish funksiyasi
function addMessage(data) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<div><strong>${data.user}</strong>: ${data.text}</div>
                   <div class="meta">${data.time}</div>`;
  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Eski xabarlarni yuklash
socket.on('load messages', (messages) => {
  messages.forEach(addMessage);
});

// Yangi xabar kelganda
socket.on('chat message', (msg) => {
  addMessage(msg);
});

// Yuborish
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  const user = usernameInput.value.trim() || 'Anonymous';
  if (!text) return;

  const msg = {
    user,
    text,
    time: new Date().toLocaleTimeString(),
  };

  socket.emit('chat message', msg);
  input.value = '';
});
