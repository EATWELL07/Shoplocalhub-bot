const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED');
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('ready', () => {
    console.log('WHATSAPP BOT READY');
});

client.on('message', async (message) => {

    const text = message.body.toLowerCase();

    console.log('MESSAGE:', text);

    if (text === 'hi' || text === 'hello') {

        await message.reply(
`👋 Welcome to ShopLocalHub

1️⃣ View Products
2️⃣ Offers
3️⃣ Contact Support

Reply with 1, 2 or 3`
        );

    }

    else if (text === '1') {

    const shops = require('./shops.json');

    let productMessage = '🛍 Product List:\n\n';

    shops.forEach((shop, index) => {

        productMessage +=
`${index + 1}. ${shop.name}
📍 Pincode: ${shop.pincode}
💰 Price: ₹${shop.price}
🔗 ${shop.link}

`;

    });

    await message.reply(productMessage);

}

    else if (text === '2') {

        await message.reply(
`🔥 Today's Offers:

• Buy 2 Get 1 Free
• 20% OFF on Shoes`
        );

    }

    else if (text === '3') {

        await message.reply(
`📞 Support Team

Call: +91XXXXXXXXXX`
        );

    }

    else {

        await message.reply(
`❌ Invalid option.

Type "hi" to open menu.`
        );

    }

});

client.initialize();