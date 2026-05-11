const { Client, LocalAuth } = require('whatsapp-web.js');
const qr = require('qr-image');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
app.use(express.static(__dirname));
const PORT = process.env.PORT || 3000;

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "client-one"
    }),
    webVersionCache: {
        type: 'none'
    },
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qrCode) => {
    console.log('QR RECEIVED');

    const qr_svg = qr.image(qrCode, { type: 'png' });
    const qrPath = './qr.png';

    qr_svg.pipe(fs.createWriteStream(qrPath));

    console.log('QR IMAGE SAVED');

    console.log(`OPEN THIS URL:
https://shoplocalhub-bot.onrender.com/qr.png`);
});
client.on('ready', () => {
    console.log('WhatsApp Bot is Ready!');
});

client.on('authenticated', () => {
    console.log('Authenticated!');
});

client.on('auth_failure', msg => {
    console.error('Auth Failure:', msg);
});

client.initialize();

client.on('auth_failure', msg => {
    console.error('Auth Failure:', msg);
});

client.initialize();
client.initialize();

client.on('ready', () => {
    console.log('WHATSAPP READY');
});

client.on('authenticated', () => {
    console.log('WHATSAPP AUTHENTICATED');
});

client.on('disconnected', (reason) => {
    console.log('WHATSAPP DISCONNECTED:', reason);
});

client.on('message', async message => {

    console.log('MESSAGE:', message.body);

    if(message.body.toLowerCase() === 'hi'){
        message.reply('Bot is working 🚀');
    }

});

app.get('/', (req, res) => {
    res.send('Bot is running');
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// fresh deploy
// new qr