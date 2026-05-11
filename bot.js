const { Client, LocalAuth } = require('whatsapp-web.js');
const qr = require('qr-image');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();

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

client.on('qr', (qrText) => {

    console.log('QR RECEIVED');

    const qr_svg = qr.image(qrText, { type: 'png' });

    qr_svg.pipe(fs.createWriteStream('qr.png'));

    console.log('QR IMAGE SAVED');
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

app.get('/', (req, res) => {
    res.send('Bot is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});