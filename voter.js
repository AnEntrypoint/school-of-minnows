const fs = require('fs');
let votes = 0;

const getRc = (account, props) => {
    var CURRENT_UNIX_TIMESTAMP = parseInt((new Date(props.time).getTime() / 1000).toFixed(0))
    var totalShares = parseFloat(account.vesting_shares) + parseFloat(account.received_vesting_shares) - parseFloat(account.delegated_vesting_shares);
    var elapsed = CURRENT_UNIX_TIMESTAMP - account.voting_manabar.last_update_time;
    var maxMana = totalShares * 1000000;
    //if (parseFloat(account.voting_manabar.current_mana) < 160409289) return 0;
    var currentMana = parseFloat(account.voting_manabar.current_mana) + elapsed * maxMana / 432000;
    if (currentMana > maxMana) {
        currentMana = maxMana;
    }
    var currentManaPerc = currentMana * 100 / maxMana;
    if (currentMana == 0 || maxMana == 0) return 0;
    else return currentManaPerc;
}

const getValue = async (account, fund, price) => {
    const total_vests = parseFloat(account.vesting_shares.split(' ')[0]) + parseFloat(account.received_vesting_shares.split(' ')[0]) - parseFloat(account.delegated_vesting_shares.split(' ')[0]);
    const final_vest = total_vests * 1e6;
    const power = (account.voting_power * 100 / 10000) / 50;
    const rshares = power * final_vest / 10000;
    const estimate = rshares / parseFloat(fund.recent_claims) * parseFloat(fund.reward_balance.split(' ')[0]) * price;
    return estimate;
}

setTimeout(()=>{
    process.exit();
},300000)
const run = async () => {
    console.log('vote run', vest)
    let props = await chain.api.getDynamicGlobalPropertiesAsync()
    let price = parseFloat((await chain.api.getCurrentMedianHistoryPriceAsync()).base.split(' ')[0])
    let fund = await chain.api.getRewardFundAsync('post');
    const members = fs.readdirSync('member-' + vest);

    const pindexes = fs.readdirSync('post-' + vest);
    const posts = [];
    for (const pindex of pindexes) {
        if (new Date().getTime() - parseInt(pindex) < (60000 * 15)) {
            console.log('post under 15 minutes')
            continue;
        }
        if((parseFloat(pindex)+604800000-new Date().getTime())<0) {
            console.log('post over  7 days')
            fs.unlinkSync('post-' + vest + '/' + pindex);
            continue;
        }
        let post;
        try {
            post = JSON.parse(fs.readFileSync('post-' + vest + '/' + pindex));
        } catch(e) {
            fs.unlinkSync('post-' + vest + '/' + pindex);
            return;
        }
        if(!post) return;
        console.log(post.permlink);
        if(post.active_votes > members.length*0.75) {
            console.log('post over 75% votes')
            fs.unlinkSync('post-' + vest + '/' + pindex);
        }
        if(!post.author) {
            console.log('no post author')
            fs.unlinkSync('post-' + vest + '/' + pindex);
            continue;
        }
        const posteraltruism = fs.existsSync('altruism-' + vest + '/' + post.author) ? JSON.parse(fs.readFileSync('altruism-' + vest + '/' + post.author)) : { up: 0, down: 0 };
        if (!post.last_round || new Date().getTime() - post.last_round > (1000 * 60)) {
            posts.push({ post, pindex, posteraltruism });
        } else {
            console.log('post last round too recent')
        }
    }
    posts.sort((a, b) => { return (b.posteraltruism.up - b.posteraltruism.down)-(a.posteraltruism.up - a.posteraltruism.down) });
    const dopost = async (data, props) => {
        const { posteraltruism, pindex } = data;
        const post = data.post = await chain.api.getContentAsync(data.post.author, data.post.permlink);
        console.log('loaded', post.author, post.permlink)
        post.last_round = new Date().getTime();
        fs.writeFileSync('post-' + vest + '/' + pindex, JSON.stringify(post));
        let smembers = [];
        for(name of members) {
            const json = fs.readFileSync('member-' + vest + '/' + name);
            //console.log(json.toString());
            try {
                const account = JSON.parse(json);
                let add = true;
                if(post.active_votes.filter(a => { return a.voter == name }).length) add = false;
                if(add) smembers.push(account);

            } catch(e) {
                const account = (await chain.api.getAccountsAsync([name]))[0];
                fs.writeFileSync('member-' + vest + '/' + name, JSON.stringify(account));
                continue;
            }
            //console.log(account.name);
        }
        for (let memberData of smembers.reverse().sort((a, b) => {return getRc(b,props)-getRc(a,props)})) {
            if(memberData.skip) {
                continue;
            }
            const name = memberData.name;
            if(getRc(memberData, props) < 98 ) {
                memberData.skip = true;
                continue;
            }
            if(new Date().getTime() - new Date(memberData.last_vote_time).getTime() < 6000) {
                continue;
            }
            if (post.author == name) {
                continue;
            }
            var authed = false;
            const account = (await chain.api.getAccountsAsync([name]))[0];
            if(account.posting.account_auths.length) {
                for(let auth of account.posting.account_auths) {
                    if(auth[0] == 'minnowschool') {
                        authed = true;
                    }
                }
            }
            if(!authed) {
                fs.unlinkSync("member-"+vest+"/"+account.name);
                continue;
            }
            fs.writeFileSync('member-' + vest + '/' + name, JSON.stringify(account));

            if(new Date().getTime() - new Date(account.last_vote_time).getTime() < 6000) {
                console.log('too recently voted on chain')
                memberData.skip = true;
                continue;
            }
            if (getRc(account, props) < 96) {
                console.log(name, 'too low rc on chain', getRc(account, props), getRc(memberData, props), post.permlink)
                memberData.skip = true;
                continue;
            }
            if (post.active_votes.filter(a => { return a.voter == account.name }).length) {
                console.log(name, 'already voted voted on ', post.permlink)
                continue;
            }
            const value = await getValue(account, fund, price);

            const rc = await client.rc.getRCMana(account.name);
            const vp = await client.rc.getVPMana(account.name);
            if(vp.current_mana < 205144852) {
                continue;
            }
            if(rc.current_mana < 205144852) {
                continue;
            }
            let weight = 10000;
            if (value > 0.10) {
                weight = (1 / (value / 0.10)) * 10000;
                if (weight < 500) weight = 500;
            }

            const op = [
                'vote',
                {
                    "voter": name,
                    "author": post.author,
                    "permlink": post.permlink,
                    "weight": parseInt(weight)
                },
            ];
            console.log('voting');
            await client.broadcast.sendOperations([op], k);
            const voterexists = fs.existsSync('altruism-' + vest + '/' + name);
            const posterexists = fs.existsSync('altruism-' + vest + '/' + post.author);
            let voteraltruism = voterexists ? JSON.parse(fs.readFileSync('altruism-' + vest + '/' + name)) : { up: 0, down: 0 };
            let postaltruism = posterexists ? JSON.parse(fs.readFileSync('altruism-' + vest + '/' + post.author)) : { up: 0, down: 0 };
            const add = parseFloat(value * weight) / 100;
            const rem = parseFloat(value * weight) / 100;
            voteraltruism.up = parseFloat(voteraltruism.up)+add;
            posteraltruism.down = parseFloat(postaltruism.down)+rem;
            fs.writeFileSync('altruism-' + vest + '/' + name, JSON.stringify(voteraltruism));
            fs.writeFileSync('altruism-' + vest + '/' + post.author, JSON.stringify(postaltruism));
            account.last_vote_time = new Date().getTime();
            console.log('voted',post.permlink, post.author, 'as', name);
            //await new Promise(res=>setTimeout(res,5000))
            if(votes>100)return true;
        }
    }
    try {
        for (const data of posts) {
            try {
                if(await dopost(data,props)) return;
            } catch (e) {
                console.error(e);
            }
        }
    } catch(e) {
        console.error(e);
    }
}
setTimeout(run, 5000);