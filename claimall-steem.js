const steemjs = require('steem');
//steemjs.api.setOptions({ url: 'https://api.steem.blog', rebranded_api:true });
require('dotenv').config()
const dsteem = require('dsteem');
const client = new dsteem.Client('https://api.steemit.com');
const fs = require('fs');
const k = dsteem.PrivateKey.fromString(process.env.K);
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
    console.log(account);
    if(parseFloat(account.reward_sbd_balance.split(' ')[0])==0 &&
    parseFloat(account.reward_steem_balance.split(' ')[0])==0 &&
    parseFloat(account.reward_vesting_balance.split(' ')[0])==0) return;
    const op = [
        'claim_reward_balance',
        {
            account: account.name,
            reward_sbd: account.reward_sbd_balance,
            reward_steem: account.reward_steem_balance,
            reward_vests: account.reward_vesting_balance,
        },
    ];
    console.log(op)
    try {
        await client.broadcast.sendOperations([op], k);
    } catch(e) {
        console.error(e);
    }
};

(async () => {
    props = await steemjs.api.getDynamicGlobalPropertiesAsync();
    try {
    //await new Promise(res => feed.on('ready', res));
    const out = [];
    var x=0;
    const accounts = fs.readdirSync('data/member-steem')
        for(const name of accounts) {
            const account = JSON.parse(fs.readFileSync('data/member-steem/'+name))
            if(account.posting.account_auths.length) {
                for(let auth of account.posting.account_auths) {
                    if(auth[0] == 'minnowschool') {
                        const rc = await getRc(account);
                        if(rc > 0 && rc > 80) {
                            console.log(x++)
                            //if(account.name != 'wxzurd') continue
                            console.log(account.name)
                            const accounts = await steemjs.api.getAccountsAsync([account.name]);
                            console.log(accounts)
                            await claim(accounts[0]);
                            await new Promise(res => setTimeout(res, 1000));
                        }
                        /*let posts = await steemjs.api.getBlogAsync(name, 0, 30);
                        for(let post of posts) {
                            if((new Date(post.comment.created).getTime())+604800000-new Date().getTime()>0) {
                                fs.writeFileSync("post-steem/" + new Date().getTime(), JSON.stringify(post.comment, null, 2));
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
