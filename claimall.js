const hivejs = require('@hivechain/hivejs');
hivejs.api.setOptions({ url: 'https://api.hive.blog', rebranded_api:true });
require('dotenv').config()
const dhive = require('@hiveio/dhive');
const client = new dhive.Client('https://api.hive.blog');
const fs = require('fs');
const k = dhive.PrivateKey.fromString(process.env.K);
var props;
const getRc = async (account) => {
    var CURRENT_UNIX_TIMESTAMP = parseInt((new Date(props.time).getTime() / 1000).toFixed(0))
    var totalShares = parseFloat(account.vesting_shares) + parseFloat(account.received_vesting_shares) - parseFloat(account.delegated_vesting_shares);
    var elapsed = CURRENT_UNIX_TIMESTAMP - account.voting_manabar.last_update_time;
    var maxMana = totalShares * 1000000;
    var currentMana = parseFloat(account.voting_manabar.current_mana) + elapsed * maxMana / 432000;
    if (currentMana > maxMana) {
        currentMana = maxMana;
    }
    var currentManaPerc = currentMana * 100 / maxMana;
    if(currentMana == 0 || maxMana == 0) return 0;
    else return currentManaPerc;
}

claim = async (account) => {
    if(parseFloat(account.reward_hbd_balance.split(' ')[0])==0 &&
    parseFloat(account.reward_hive_balance.split(' ')[0])==0 &&
    parseFloat(account.reward_vesting_balance.split(' ')[0])==0) return;
    const op = [
        'claim_reward_balance',
        {
            account: account.name,
            reward_hbd: account.reward_hbd_balance,
            reward_hive: account.reward_hive_balance,
            reward_vests: account.reward_vesting_balance,
        },
    ];
    console.log(op)
    await client.broadcast.sendOperations([op], k);
};

(async () => {
    props = await hivejs.api.getDynamicGlobalPropertiesAsync();
    try {
    //await new Promise(res => feed.on('ready', res));
    const out = [];
    var x=0;
    const accounts = fs.readdirSync('data/member-hive')
        for(const name of accounts) {
            const account = JSON.parse(fs.readFileSync('data/member-hive/'+name))
            if(account.posting.account_auths.length) {
                for(let auth of account.posting.account_auths) {
                    if(auth[0] == 'minnowschool') {
                        const rc = await getRc(account);
                        if(rc > 0 && rc > 80) {
                            console.log(x++)
                            console.log(account.name)
                            const accounts = await hivejs.api.getAccountsAsync([account.name]);
                            console.log(accounts)
                            await claim(accounts[0]);
                            await new Promise(res => setTimeout(res, 1000));
                        }
                        /*let posts = await hivejs.api.getBlogAsync(name, 0, 30);
                        for(let post of posts) {
                            if((new Date(post.comment.created).getTime())+604800000-new Date().getTime()>0) {
                                fs.writeFileSync("post-hive/" + new Date().getTime(), JSON.stringify(post.comment, null, 2));
                            }
                        }*/
                    }
                }
            }
    
        }

        console.log('end');
  } catch (e) {
    console.error(e);
  }
})()
