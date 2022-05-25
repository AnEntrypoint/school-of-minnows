const fs = require('fs');
let votes = 0;
let rates = [];

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
},3600000)
const run = async () => {
    console.log('getting dynammics');
    let props = await chain.api.getDynamicGlobalPropertiesAsync()
    console.log('getting price');
    const getprice = await chain.api.getCurrentMedianHistoryPriceAsync||(()=>1);
    let price = parseFloat((getprice()).base?.split(' ')[0])||1;
    let fund = await chain.api.getRewardFundAsync('post');
    const members = fs.readdirSync('data/member-' + vest);

    const pindexes = fs.readdirSync('data/post-' + vest);
    const posts = [];
    console.log('test');
    for (const pindex of pindexes) {
        if((parseFloat(pindex)+604800000-new Date().getTime())<0) {
            console.log('post over  7 days')
            fs.unlinkSync('data/post-' + vest + '/' + pindex);
            continue;
        }
        let post;
        try {
            post = JSON.parse(fs.readFileSync('data/post-' + vest + '/' + pindex));
        } catch(e) {
            fs.unlinkSync('data/post-' + vest + '/' + pindex);
            continue;
        }
        if((new Date(post.last_update).getTime()+604800000-new Date().getTime())<0) {
            console.log('post over 7 days')
            fs.unlinkSync('data/post-' + vest + '/' + pindex);
            continue;
        }
        if(!post) continue;
        if (new Date().getTime() - parseInt(pindex) < (60000 * 15)) {
            continue;
        }
        if(post.active_votes > members.length*0.85) {
            console.log('post over 85% votes')
            fs.unlinkSync('data/post-' + vest + '/' + pindex);
            continue;
        }
        if(!post.author) {
            console.log('no post author')
            fs.unlinkSync('data/post-' + vest + '/' + pindex);
            continue;
        }

        const posteraltruism = fs.existsSync('data/altruism-' + vest + '/' + post.author) ? JSON.parse(fs.readFileSync('data/altruism-' + vest + '/' + post.author)) : { up: 0, down: 25, last:new Date().getTime() };
        if(posteraltruism.down == 24.36287603576817) {
            posteraltruism.down = posteraltruism.down = 0;
            fs.writeFileSync('data/altruism-' + vest + '/' + post.author, JSON.stringify(posteraltruism));
        }
        if(!posteraltruism.last || new Date().getTime() - posteraltruism.last > 86400000) {
            posteraltruism.down = posteraltruism.down * 0.97;
            posteraltruism.last = new Date().getTime();
            fs.writeFileSync('data/altruism-' + vest + '/' + post.author, JSON.stringify(posteraltruism));
        }
        if (!post.last_round || new Date().getTime() - post.last_round > (1000 * 180)) {
            posts.push({ post, pindex, posteraltruism });
        }
    }
    posts.sort((a, b) => { return (b.posteraltruism.up - b.posteraltruism.down)-(a.posteraltruism.up - a.posteraltruism.down) });
    const dopost = async (data, props) => {
        const { pindex } = data;
        let post;
        try {
            post = data.post = await chain.api.getContentAsync(data.post.author, data.post.permlink);
        } catch(e) {
            console.log(data.post.author, data.post.permlink);
            console.error(e.message);
            console.trace(e);
            fs.unlinkSync('data/post-' + vest + '/' + pindex);
        }
        if(!post) return;
        //console.log(post.permlink, 'by', post.author)
        if((new Date(post.last_update_time).getTime()+604800000-new Date().getTime())<0) {
            console.log('post over 7 days')
            fs.unlinkSync('data/post-' + vest + '/' + pindex);
            return;
        }

        post.last_round = new Date().getTime();
        fs.writeFileSync('data/post-' + vest + '/' + pindex, JSON.stringify(post));
        let smembers = [];
        try {
            const cancelled = fs.readFileSync('data/cancelled-' + vest + '/' + post.author);
            if (cancelled) {
                fs.unlinkSync('data/post-' + vest + '/' + pindex);
                return;
            }
        } catch(e) {
        }
        for(const name of members) {
            const json = fs.readFileSync('data/member-' + vest + '/' + name);
            try {
                const account = JSON.parse(json);
                let add = true;
                if(post.active_votes.filter(a => { return a.voter == name }).length) {
                    add = false;
                }
                if(new Date().getTime() - account.last_round < 60000) {
                    add = false;
                }

                if (post.author == name) {
                    add = false;
                }
                if(getRc(account, props) < 98 ) {
                    add = false
                }
        
                if(add) smembers.push(account);

            } catch(e) {
                console.error(e);
                console.trace(e);

                const account = (await chain.api.getAccountsAsync([name]))[0];
                fs.writeFileSync('data/member-' + vest + '/' + name, JSON.stringify(account));
                continue;
            }
        }
        for (let memberData of smembers.reverse().sort((a, b) => {return getRc(b,props)-getRc(a,props)})) {
            if(memberData.skip) {
                console.log(memberData.name, 'skipping');
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
            const r = await client.rc.getRCMana(name);
            //const v = await client.rc.getVPMana(name);
            //if(v.current_mana < 14485) {
            //    console.log(name, 'too low vp mana on file', name, v.current_mana)
            //    continue;
            //}
            if(r.current_mana < 150144850) {
                console.log(name, 'too low rc mana on file', name, r.current_mana)
                memberData.last_round = new Date().getTime()+3600000;
                fs.writeFileSync('data/member-' + vest + '/' + name, JSON.stringify(memberData));
                continue;
            }

            var authed = false;
            const account = (await chain.api.getAccountsAsync([name]))[0];
            if(account.posting.account_auths.length) {
                for(let auth of account.posting.account_auths) {
                    if(auth[0] === 'minnowschool') {
                        authed = true;
                    }
                }
            }

            if(!authed) {
                fs.unlinkSync("data/member-"+vest+"/"+account.name);
                console.log(memberData.name, 'not authed');
                continue;
            }
            fs.writeFileSync('data/member-' + vest + '/' + name, JSON.stringify(account));

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
            const modAlt = (name, mod, quant)=>{
                const file = 'data/altruism-' + vest + '/' + name;
                let alt = { up:0, down:0 }
                if(fs.existsSync(file)) {
                    alt = JSON.parse(fs.readFileSync(file));
                }
                alt[mod] += quant;
                fs.writeFileSync(file, JSON.stringify(alt));
            }
            try {
                votes++;
                await client.broadcast.sendOperations([op], k);
                console.log('voted', op[1])
                votes++;
                const quant = parseFloat(value * weight) / 100;
                modAlt(name, 'up', quant);
                modAlt(post.author,'down',quant);
                account.last_vote_time = new Date().getTime();
                fs.writeFileSync('data/member-' + vest + '/' + name, JSON.stringify(account));
            } catch(e) {
                console.error(e.message);
                console.trace(e);
                return;
            }
            if(votes>10)return true;
        }
    }
    try {
        
        for (const data of posts) {
            try {
                if(await dopost(data,props)) {
                    setTimeout(run, 0);
                    return;
                }
            } catch (e) {
                console.error(e);
                console.trace(e);
            }
        }
    } catch(e) {
        console.error(e);
        console.trace(e);
    }
    setTimeout(run, 5000);
}
setTimeout(run, 1000);
setInterval(()=>{
    rates.push(votes);
    while(rates.length > 60) rates.shift();
    var rate = 0;
    rates.forEach((r)=>{
        rate += r/rates.length;
    });
    fs.writeFileSync('data/rate-'+vest, votes.toString());
    votes = 0;
}, 30000)