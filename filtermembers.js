const hypercore = require('hypercore');
var feed = hypercore('./accounts-'+vest, { valueEncoding: 'json' });
(async () => {
    await new Promise(res=>feed.on('ready', res));
    console.log(feed.length)
    fs.mkdirSync('member-'+vest+'/', { recursive: true });

    for(let x = 0; x < feed.length; x++) {
        const account = await new Promise(ret=>feed.get(x, (e,r)=>ret(r)));
        if(account.posting.account_auths.length) {
            for(let auth of account.posting.account_auths) {
                if(auth[0] == 'minnowschool') {
                    fs.writeFileSync("member-"+vest+"/"+account.name, JSON.stringify(account));
                }
            }
        }
    }
})()
