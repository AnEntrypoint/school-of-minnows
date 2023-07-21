const axios = require('axios');
const randomFile = require('select-random-file')
const tor_axios = require('tor-axios');
const fetch = require('node-fetch');
const axiosCookieJarSupport = require('axios-cookiejar-support').wrapper;
const tough = require('tough-cookie');
const https = require('https');
const tor = tor_axios.torSetup({
    ip: 'localhost',
    port: 9050,
    controlPort: '9051',
    controlPassword: 'giraffe',
})

axiosCookieJarSupport(axios);

const cheerio = require('cheerio');

const url = require('url');
const current_url = new URL('https://www.google.com/?utf8=%E2%9C%93&authenticity_token=Co1XEpYjqoGMLfbHC%2BVAORuoGRnxqmkCjMzk%2Fk3NfZtZjjNDurHAiEumInFbD1Ua7QPWO%2F9A4JWsMaOkinjU1w%3D%3D&report%5Breported_by_username%5D=guiltyparties&report%5Bpost_url%5D=&report%5Bdetails%5D=&report%5Bsupporting_link%5D=&report%5Babuse_type%5D=&report%5Babuse_type%5D=Spam&commit=Report+Abuse');
const search_params = current_url.searchParams;
const sentences = [
    "I believe this post is spam or a scam because it's repetitive and lacks substance.",
    "In my opinion, this post is either spam or a scam because it's so repetitive and seems automated.",
    "I suspect this post is spam or a scam due to its repetitive and robotic nature.",
    "It's my guess that this post is either spam or a scam because it's so repetitive and seems artificial.",
    "I have a feeling that this post is either spam or a scam because it's so repetitive and lacks any real content.",
    "I think this post is either spam or a scam because it's repetitive and seems to be written by a bot.",
    "My guess is that this post is either spam or a scam because it's so repetitive and mindless.",
    "I think it's possible that this post is either spam or a scam because it's so repetitive and seems artificial.",
    "I have a hunch that this post is either spam or a scam because it's repetitive and lacks any real substance.",
    "I'm pretty sure this post is either spam or a scam because it's so repetitive and seems to be written by a bot or AI.",
    "I think it's likely that this post is either spam or a scam because it's repetitive and lacks any real content.",
    "I believe this post is either spam or a scam because it's so repetitive and seems to be written by a machine.",
    "In my opinion, this post is either spam or a scam because it's repetitive and lacks any real substance.",
    "I suspect this post is either spam or a scam because it's repetitive and seems to be written by a bot or AI.",
    "It's my guess that this post is either spam or a scam because it's so repetitive and lacks any real content.",
    "I have a feeling that this post is either spam or a scam because it's repetitive and seems automated.",
    "I think this post is either spam or a scam because it's so repetitive and lacks any real substance.",
    "My guess is that this post is either spam or a scam because it's repetitive and seems to be written by a machine.",
    "I think it's possible that this post is either spam or a scam because it's so repetitive and lacks any real content.",
    "I have a hunch that this post is either spam or a scam because it's repetitive and seems to be written by a bot or AI.",
    "I'm pretty sure this post is either spam or a scam because it's repetitive and lacks any real substance.",
    "I think it's likely that this post is either spam or a scam because it's so repetitive and seems to be written by a machine.",
    "I believe this post is either spam or a scam because it's repetitive and lacks any real content.",
    "In my opinion, this post is either spam or a scam because it's so repetitive and seems automated.",
    "I suspect this post is either spam or a scam because it's repetitive and seems to be written by a bot or AI.",
    "It's my guess that this post is either spam or a scam because it's so repetitive and lacks any real substance.",
    "I have a feeling that this post is either spam or a scam because it's repetitive and seems to be written by a machine.",
    "I can tell that this post is spam because it's clearly written by a machine",
    "There's no doubt in my mind that this post is spam because it's so obvious that it was written by a machine",
    "The fact that this post was written by a machine is clear evidence that it's spam",
    "It's obvious to me that this post is spam because it was clearly written by a machine",
    "I have no doubt that this post is spam because the writing style and structure indicate that it was written by a machine",
    "There's no question that this post is spam because the writing is clearly that of a machine",
    "The writing in this post is so robotic that it's clear it's spam",
    "It's clear that this post is spam because the writing lacks the human touch and reads like it was written by a machine",
    "There's no mistaking that this post is spam because it's written in a way that can only be produced by a machine",
    "The lack of personality in the writing of this post makes it clear that it's spam",
    "It's evident that this post is spam because the writing style and structure are too perfect and clearly not human",
    "There's no denying that this post is spam because the writing style and content are clearly that of a machine",
    "The writing in this post is so formulaic and robotic that it's clear it's spam",
    "I have no doubt that this post is spam because the writing lacks any sense of personality or humanity",
    "It's obvious that this post is spam because the writing style and content are clearly not that of a human",
    "There's no question that this post is spam because the writing is too perfect and lacks any human touch",
    "The fact that this post was written by a machine is clear in the writing style and structure",
    "It's clear that this post is spam because the writing lacks any sense of personality or individuality",
    "There's no mistaking that this post is spam because the writing is too perfect and lacks any human error or imperfection",
    "The writing in this post is so robotic and formulaic that it's clear it's spam",
    "I can tell that this post is spam because the writing lacks any sense of humanity or personality",
    "There's no doubt in my mind that this post is spam because the writing style and structure indicate a machine wrote it",
    "The lack of personality in the writing of this post makes it clear that it's not written by a human",
    "It's evident that this post is spam because the writing style and structure are too perfect and clearly not human-produced",
    "There's no denying that this post is spam because the writing style and content are clearly machine-generated",
    "The writing in this post is so formulaic and robotic that it's clear it's not written by a human",
    "I have no doubt that this post is spam because the writing lacks any sense of personality or humanity",
    "It's obvious that this post is spam because the writing style and content are clearly not that of a human",
    "There's no question that this post is spam because the writing is too perfect and lacks any human touch",
    "The fact that this post was written by a machine is clear in the writing style and structure"];

const report = async (user, url) => {
    let cookieJar = new tough.CookieJar();
    const chromeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
    let instance = await axios.create({
        jar: cookieJar,
        withCredentials: true,
    });
    console.log('getting');
    instance.get('https://hivewatchers.com/reports/new', { jar: cookieJar, withCredentials: true, headers: { 'user-agent': chromeUserAgent } }).then(async a => {
        const attribs = {};
        console.log(a);
        const $ = cheerio.load(a.data);
        const input = $('input,textarea');
        const csrf = [...Object.values($('meta'))]
        console.log(csrf[1].attribs.content);
        //console.log({input});
        for (x of Object.keys(input)) {
            if (!input[x].attribs) continue
            attribs[input[x].attribs.name] = input[x].attribs.value;
        }
        attribs['report[details]'] = sentences[Math.floor(Math.random() * sentences.length)];
        attribs['report[post_url]'] = url;
        const types = [
            'Other', 'Spam', 'Plagarism'
        ]
        const supporting = [
            url, ''
        ]
        const user = await new Promise(res => {
            randomFile('data/hive-known', (err, file) => {
                console.log(err)
                console.log(file);
                res(file)
            })
        })
        attribs['report[reported_by_username]'] = user;
        attribs['report[supporting_link]'] = url;
        attribs['report[abuse_type]'] = types[Math.floor(Math.random() * types.length)];
        const qs = require('qs');
        const options = {
            "headers": {
                "X-CSRF-TOKEN":csrf[1].attribs.content,
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "Referer": "https://hivewatchers.com/reports/new",
                "Referrer-Policy": "strict-origin-when-cross-origin",
                'user-agent': chromeUserAgent
            },
            withCredentials: true
        };
        console.log({ attribs });

        console.log(await instance.post('https://hivewatchers.com/reports', qs.stringify(attribs), options));
        //console.log(await tor.post('https://hivewatchers.com/reports', encodeURI(attribs)))
        await tor.torNewSession(); //change tor ip
        console.log((await instance.get('https://api.ipify.org?format=json')).data.ip);

    });

}
module.exports = { default: report }