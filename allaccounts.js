const hivejs = require('@hivechain/hivejs');
const fs = require('fs');
(async () => {
    const count = await chain.api.getAccountCountAsync();
    await new Promise(res => setTimeout(res, 1000));
    let feed = {length:0};
    let last = null;
    while (feed.length < count) {
        try {
            const offset = feed.length + 299 < count ? 299 : count % 299;
            const names = await chain.api.lookupAccountsAsync(last?.name?last.name:'', offset);
            const accounts = await chain.api.getAccountsAsync(names);
            last = accounts[accounts.length-1];
            console.log(last.name)
            for (x = 0; x < accounts.length; x++) {
                ++feed.length;
                const account = accounts[x];
                if(account.posting.account_auths.length) {
                    for(let auth of account.posting.account_auths) {
                        if(auth[0] == 'minnowschool') {
                            fs.writeFileSync("member-"+vest+"/"+account.name, JSON.stringify(account));
                        }
                    }
                }
            }
        } catch(e) {
            console.error(e);
        }
    }
})()
