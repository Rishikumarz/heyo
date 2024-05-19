
const socket = io();

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('end-chat').addEventListener('click', endChat);
document.getElementById('find-next').addEventListener('click', findNext);

socket.on('chat-start', () => {
    console.log('Chat started');
    // Update UI to show chat is active
});

socket.on('receive-message', (message) => {
    appendMessage('Partner', message);
});

socket.on('chat-ended', () => {
    console.log('Chat ended');
    // Update UI to show chat has ended
});

socket.on('partner-disconnected', () => {
    console.log('Partner disconnected');
    // Update UI to show partner has disconnected
});

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    if (message.trim() !== '') {
        appendMessage('You', message);
        messageInput.value = '';
        socket.emit('send-message', message);
    }
}

function appendMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function endChat() {
    socket.emit('end-chat');
    // Update UI to show chat has ended
}

function findNext() {
    socket.emit('find-next');
    // Update UI to show finding next user
}
