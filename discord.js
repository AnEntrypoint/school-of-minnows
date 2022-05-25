require('dotenv').config(); //initialize dotenv
const Discord = require('discord.js'); //import discord.js
const fs = require('fs');
const axios = require('axios').default;
module.exports = (meme, post) => {
    const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] }); //create new client
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('messageCreate', msg => {
        if(msg.author.bot) return;
        if(msg.author.id === client.user.id) return;
        if(vest == 'hive') axios.get('https://lann8n.matic.ml/webhook/3a58bd92-76ca-4bbb-a24c-8399942959de', {
            params: msg
        })

        if (msg.content.startsWith('.stats')) {
            const username = msg.content.replace('.stats ', '').replace('.stats', '');
            let stats = '';
            if (username) {
                try {
                    let user = JSON.parse(fs.readFileSync('data/altruism-' + vest + '/' + username)); //{"up":0.000599604963780028,"down":0}
                    let altruism = user.up - user.down;
                    console.log(altruism);
                    stats += vest + ` (RECEIVED ${Math.round(user.down * 100) / 100} - VOTED ${Math.round(user.up * 100) / 100}) = ${-(Math.round(altruism * 100) / 100)} OVERUNITY\n`;
                } catch (e) {
                    console.log(e);
                }
            } else {
                let send = fs.readdirSync('data/altruism-' + vest);
                let done = [];

                for (let member of send) {
                    try {
                        console.log(fs.readFileSync('data/altruism-' + vest + '/' + member).toString())
                        let user = JSON.parse(fs.readFileSync('data/altruism-' + vest + '/' + member)); //{"up":0.000599604963780028,"down":0}
                        let altruism = user.up - user.down;
                        done.push({ up: user.up, down: user.down, altruism, name: member });
                    } catch (e) {
                        fs.unlinkSync('data/altruism-' + vest + '/' + member)
                    }
                }
                done.sort(function (a, b) { return a.altruism - b.altruism });
                if (done.length > 100) done = done.splice(0, 20);
                console.log(done.length);
                for (let user of done) {
                    stats += vest + ` ${user.name} (RECEIVED ${Math.round(user.down * 100) / 100} - VOTED ${Math.round(user.up * 100) / 100}) = ${-(Math.round(user.altruism * 100) / 100)} OVERUNITY\n`;
                }
            }
            msg.reply(stats);
        }

        if (msg.content.startsWith('.meme')) {
            let body = msg.content.replace('.meme', '').replace('.meme ', '');
            const image = msg.attachments.first().url;
            console.log(msg.author);
            meme(body.length ? body : null, image, msg.author.id, msg);
        }
        if (msg.content.startsWith('.post')) {
            let body = msg.content.replace('.meme', '').replace('.meme ', '');
            let urls = [];
            let paragraphs = body.split(/\n+/);
            for (let file of msg.attachments) {
                console.log(file);
                urls.push(file[1].url)
            }
            paragraphs[0].replace('.post ', '').replace('.post', '');
            if (paragraphs.length < 2) {
                msg.reply('Need at least one paragraph and a title');
            } else
                if (!paragraphs.length) {
                    msg.reply('Need at least one image');
                } else
                    if (!post(paragraphs, urls, msg.author.id, msg)) msg.reply('You need to register first');
        }
    });

    //make sure this line is the last line
    client.login(process.env.CLIENT_TOKEN); //login bot using token
}
