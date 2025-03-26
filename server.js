// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

const PORT = 3000;
const messagesFile = './messages.json';

// Statik fayllarni uzatish
app.use(express.static('public'));

// Chat sahifasini yuborish
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Xabarlar saqlangan faylni o‘qish
const loadMessages = () => {
  if (fs.existsSync(messagesFile)) {
    return JSON.parse(fs.readFileSync(messagesFile));
  } else {
    return [];
  }
};

// Xabarlar faylga yozish
const saveMessages = (messages) => {
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
};

// Socket.io logikasi
io.on('connection', (socket) => {
  console.log('Foydalanuvchi ulandi');

  // Eski xabarlarni yuborish
  const oldMessages = loadMessages();
  socket.emit('load messages', oldMessages);

  // Yangi xabar kelganda
  socket.on('chat message', (msg) => {
    const messages = loadMessages();
    messages.push(msg);
    saveMessages(messages);
    io.emit('chat message', msg); // Barchaga yuborish
  });
});

http.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}`);
});
