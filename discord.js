require('dotenv').config(); //initialize dotenv
const Discord = require('discord.js'); //import discord.js
module.exports = (meme, post)=>{
    const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]}); //create new client
    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('messageCreate', msg => {
        if (msg.content.startsWith('.stats')) { 
            const username = msg.content.replace('.stats ', '');
            let stats = '';
            try {
                let hiveuser = JSON.parse(fs.readFileSync('altruism-hive/'+username)); //{"up":0.000599604963780028,"down":0}
                let hivealtruism = hiveuser.up-hiveuser.down;
                stats += `Hive altruism ${hivealtruism} \n`;
            } catch(e) {

            }
            try {
                let steemuser = JSON.parse(fs.readFileSync('altruism-steem/'+username)); //{"up":0.000599604963780028,"down":0}
                let steemaltruism = steemuser.up-steemuser.down;
                stats += `Steem altruism ${steemaltruism} \n`;
            } catch(e) {

            }
            msg.reply(stats);
        }

        if (msg.content.startsWith('.meme')) {
            let body = msg.content.replace('.meme', '').replace('.meme ', '');
            const image = msg.attachments.first().url;
            console.log(msg.author);
            meme(body.length?body:null,image, msg.author.id, msg);
        }
        if (msg.content.startsWith('.post')) {
            let body = msg.content.replace('.meme', '').replace('.meme ', '');
            let urls = [];
            let paragraphs = body.split(/\n+/);
            for (let file of msg.attachments) {
                console.log(file);
                urls.push(file[1].url)
            }
            paragraphs.shift();
            if(paragraphs.length<2) {
                msg.reply('Need at least one paragraph and a title');
            }
            if(!paragraphs.length) {
                msg.reply('Need at least one image');
            }
            if(!post(paragraphs, urls, msg.author.id, msg)) msg.reply('You need to register first');
        }
    });
    
    //make sure this line is the last line
    client.login(process.env.CLIENT_TOKEN); //login bot using token
}
