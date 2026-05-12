const { Client, LocalAuth } = require('whatsapp-web.js');
const qr = require('qr-image');
const fs = require('fs');
const express = require('express');
const os = require('os');

const app = express();

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

setInterval(() => {
    const used = process.memoryUsage();
    console.log('MEMORY:', Math.round(used.heapUsed / 1024 / 1024), 'MB');
}, 30000);

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "client-one"
    }),

    webVersionCache: {
        type: 'none'
    },

    puppeteer: {
        headless: true,
        executablePath: '/usr/bin/google-chrome-stable',

        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qrCode) => {

    console.log('QR RECEIVED');

    const qr_svg = qr.image(qrCode, { type: 'png' });

    const qrPath = './qr.png';

    qr_svg.pipe(fs.createWriteStream(qrPath));

    console.log('QR IMAGE SAVED');

    console.log('OPEN THIS URL:');
    console.log('https://shoplocalhub-bot.onrender.com/qr.png');

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

client.on('disconnected', (reason) => {
    console.log('WHATSAPP DISCONNECTED:', reason);
});

client.on('message_create', async message => {

    console.log('MESSAGE:', message.body);

    if (message.body.toLowerCase() === 'hi') {

        message.reply('Bot is working 🚀');

    }

});

client.initialize();

app.get('/', (req, res) => {
    res.send('Bot is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});