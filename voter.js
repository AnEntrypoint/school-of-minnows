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

let fund;
let price;
let props;
const sync = async () => {
    props = await chain.api.getDynamicGlobalPropertiesAsync()
    fund = await chain.api.getRewardFundAsync('post');
    gotprice = (await chain.api.getCurrentMedianHistoryPriceAsync()) || 1;
    console.log({ gotprice });
    price = parseFloat((gotprice).quote.split(' ')[0]) / parseFloat((gotprice).base.split(' ')[0]);
}
setInterval(sync, 1000 * 60 * 60);

setTimeout(() => {
    process.exit();
}, 1000*60*10)
const run = async () => {
    if (!props) await sync();
    const members = fs.readdirSync('data/member-' + vest);

    const pindexes = fs.readdirSync('data/post-' + vest);
    const posts = [];
    for (const pindex of pindexes) {
        if ((parseFloat(pindex) + 518400000 - new Date().getTime()) < 0) {
            console.log('post over  6 days')
            fs.unlinkSync('data/post-' + vest + '/' + pindex);
            continue;
        }
        let post;
        try {
            post = JSON.parse(fs.readFileSync('data/post-' + vest + '/' + pindex));
        } catch (e) {
            fs.unlinkSync('data/post-' + vest + '/' + pindex);
            continue;
        }
        if ((new Date(post.last_update).getTime() + 518400000 - new Date().getTime()) < 0) {
            console.log('post over 6 days')
            fs.unlinkSync('data/post-' + vest + '/' + pindex);
            continue;
        }
        if (!post) continue;
        if (new Date().getTime() - parseInt(pindex) < (60000 * 7920)) {
            continue;
        }
        if (global.vest == 'hive' && post.active_votes > members.length * 0.85) {
            console.log('post over 85% votes')
            fs.unlinkSync('data/post-' + vest + '/' + pindex);
            continue;
        }
        if (!post.author) {
            console.log('no post author')
            fs.unlinkSync('data/post-' + vest + '/' + pindex);
            continue;
        }
        let posteraltruism;
        try {
            posteraltruism = fs.existsSync('data/altruism-' + vest + '/' + post.author) ? JSON.parse(fs.readFileSync('data/altruism-' + vest + '/' + post.author)) : { up: 0, down: 25, last: new Date().getTime() }
        } catch {
            posteraltruism = { up: 0, down: 25, last: new Date().getTime() };
        }
        if (!posteraltruism.last || new Date().getTime() - posteraltruism.last > 86400000) {
            posteraltruism.down = posteraltruism.down * 0.97;
            posteraltruism.last = new Date().getTime();
            fs.writeFileSync('data/altruism-' + vest + '/' + post.author, JSON.stringify(posteraltruism));
        }
        if (!post.last_round || new Date().getTime() - post.last_round > (1000 * 180)) {
            posts.push({ post, pindex, posteraltruism });
        }
    }
    posts.sort((a, b) => { return (b.posteraltruism.up - b.posteraltruism.down) - (a.posteraltruism.up - a.posteraltruism.down) });
    const dopost = async (data, props) => {
        const { pindex } = data;
        let post;
        try {
            try {
                post = JSON.parse(fs.readFileSync('data/post-' + vest + '/' + pindex));
                if(!post.active_votes) post.active_votes = []
            } catch (e) {
                post = data.post = await chain.api.getContentAsync(data.post.author, data.post.permlink);
            }
        } catch (e) {
            console.log(data.post.author, data.post.permlink);
            console.error(e.message);
            console.trace(e);
            fs.unlinkSync('data/post-' + vest + '/' + pindex);
        }
        if (!post) return;
        //console.log(post.permlink, 'by', post.author)
        if ((new Date(post.last_update_time).getTime() + 518400000 - new Date().getTime()) < 0) {
            console.log('post over 6 days')
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
        } catch (e) {
        }
        for (const name of members) {
            let json = fs.readFileSync('data/member-' + vest + '/' + name);
            try {
                //console.log({name});
                const account = JSON.parse(json);
                let add = true;

                if ((post.active_votes).filter(a => { return a.voter == name }).length) {
                    add = false;
                }
                if (new Date().getTime() - account.last_round < 60000) {
                    add = false;
                }

                if (post.author == name) {
                    add = false;
                }
                if (global.vest == 'hive' && getRc(account, props) < 98) {
                    add = false
                }

                if (add) smembers.push(account);

            } catch (e) {
                console.error(e);
                console.trace(e);

                const account = (await chain.api.getAccountsAsync([name]))[0];
                fs.writeFileSync('data/member-' + vest + '/' + name, JSON.stringify(account));
                continue;
            }
        }
        for (let memberData of smembers.reverse().sort((a, b) => { return getRc(b, props) - getRc(a, props) })) {
            /*if (memberData.skip) {
                console.log(memberData.name, 'skipping');
                continue;
            }*/
            const name = memberData.name;
            if (getRc(memberData, props) < 98) {
                //memberData.skip = true;
                continue;
            }
            if (new Date().getTime() - new Date(memberData.last_vote_time).getTime() < 6000) {
                continue;
            }
            const r = await client.rc.getRCMana(name);
            //const v = await client.rc.getVPMana(name);
            //if(v.current_mana < 14485) {
            //    console.log(name, 'too low vp mana on file', name, v.current_mana)
            //    continue;
            //}
            if (global.vest == 'hive' && r.current_mana < 300144850 ) {
                console.log(name, 'too low rc mana on file', name, r.current_mana)
                memberData.last_round = new Date().getTime() + 3600000;
                fs.writeFileSync('data/member-' + vest + '/' + name, JSON.stringify(memberData));
                continue;
            }

            var authed = false;
            const account = (await chain.api.getAccountsAsync([name]))[0];
            if (account.posting.account_auths.length) {
                for (let auth of account.posting.account_auths) {
                    if (auth[0] === 'minnowschool') {
                        authed = true;
                    }
                }
            }

            if (!authed) {
                fs.unlinkSync("data/member-" + vest + "/" + account.name);
                console.log(memberData.name, 'not authed');
                continue;
            }
            fs.writeFileSync('data/member-' + vest + '/' + name, JSON.stringify(account));

            if (new Date().getTime() - new Date(account.last_vote_time).getTime() < 6000) {
                console.log('too recently voted on chain')
                memberData.skip = true;
                continue;
            }
            if (global.vest == 'hive' && getRc(account, props) < 96) {
                console.log(name, 'too low rc on chain', getRc(account, props), getRc(memberData, props), post.permlink)
                memberData.skip = true;
                continue;
            }
            if ((post.active_votes).filter(a => { return a.voter == account.name }).length) {
                console.log(name, 'already voted on ', post.permlink)
                continue;
            }
            const value = await getValue(account, fund, price);

            let weight = 10000;
            if (value > 0.20) {
                weight = (1 / (value / 0.20)) * 10000;
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
            const modAlt = (name, mod, quant) => {
                const file = 'data/altruism-' + vest + '/' + name;
                let alt = { up: 0, down: 0 }
                if (fs.existsSync(file)) {
                    try {
                        alt = JSON.parse(fs.readFileSync(file) || "{}");

                    } catch (e) {
                        alt = {};
                    }
                }
                alt[mod] += quant;
                fs.writeFileSync(file, JSON.stringify(alt));
            }
            try {
                votes++;
                (post.active_votes).push(op[1])
                fs.writeFileSync('data/post-' + vest + '/' + pindex, JSON.stringify(post));
                await client.broadcast.sendOperations([op], vk);
                console.log('voted', op[1])
                votes++;
                const quant = parseFloat(value * weight) / 100;
                modAlt(name, 'up', quant);
                modAlt(post.author, 'down', quant);
                const test = {"abs_rshares":377503828166,"active_votes":[{"percent":150,"reputation":40236346821628,"rshares":5843542145,"time":"2024-01-02T18:08:12","voter":"ahmadmangazap","weight":5843542145},{"percent":250,"reputation":16602018415670,"rshares":1004226015,"time":"2024-01-02T18:08:09","voter":"nathansenn","weight":1004226015},{"percent":10000,"reputation":15540206457432,"rshares":2319641195,"time":"2024-01-02T17:14:09","voter":"amigoponc","weight":2319641195},{"percent":500,"reputation":263295391359063,"rshares":34664261808,"time":"2024-01-02T18:08:00","voter":"dbuzz","weight":34664261808},{"percent":3700,"reputation":26966062763649,"rshares":2593286467,"time":"2024-01-03T21:14:48","voter":"reenave","weight":1296643233},{"percent":250,"reputation":10857941961452,"rshares":2206685229,"time":"2024-01-02T18:08:12","voter":"richardslater","weight":2206685229},{"percent":10000,"reputation":9136754382346,"rshares":3053837878,"time":"2024-01-02T22:32:09","voter":"landrover007","weight":3053837878},{"percent":500,"reputation":0,"rshares":325818347429,"time":"2024-01-02T18:09:15","voter":"dpservice","weight":325818347429}],"allow_curation_rewards":true,"allow_replies":true,"allow_votes":true,"author":"aileen1984","author_reputation":1274058010841,"author_rewards":0,"beneficiaries":[],"body":"...  #hive #pob #archon #creativecoin #cents #neoxian #pob #philippines #foods #foodgraphy #yummyfood \n\nhttps://images.d.buzz/dbuzz-image-1704214915585.jpeg <br /><br /> Posted via <a href=\"https://d.buzz\" data-link=\"promote-link\">D.Buzz</a>","body_length":241,"cashout_time":"2024-01-09T17:03:54","category":"hive-193084","children":2,"children_abs_rshares":0,"created":"2024-01-02T17:03:54","curator_payout_value":"0.000 HBD","depth":0,"id":130168364,"json_metadata":"{\"app\":\"dBuzz/v3.0.0\",\"tags\":[\"dbuzz\",\"cryptocurrency\",\"hive\",\"pob\",\"archon\",\"creativecoin\",\"cents\",\"neoxian\",\"philippines\",\"foods\",\"foodgraphy\",\"yummyfood\"],\"shortForm\":true}","last_payout":"1969-12-31T23:59:59","last_update":"2024-01-02T17:03:54","max_accepted_payout":"1.000 HBD","max_cashout_time":"1969-12-31T23:59:59","net_rshares":377503828166,"net_votes":8,"parent_author":"","parent_permlink":"hive-193084","pending_payout_value":"0.186 HBD","percent_hbd":10000,"permlink":"ev8an9e3a6wmzn0t69cfob","promoted":"0.000 HBD","reblogged_by":[],"replies":[],"reward_weight":10000,"root_author":"aileen1984","root_permlink":"ev8an9e3a6wmzn0t69cfob","root_title":"Sharing this yummy ham we cooked during New Year's eve.\n#dbuzz #cryptocurrency ...","title":"Sharing this yummy ham we cooked during New Year's eve.\n#dbuzz #cryptocurrency ...","total_payout_value":"0.000 HBD","total_pending_payout_value":"0.000 HBD","total_vote_weight":376207184932,"url":"/hive-193084/@aileen1984/ev8an9e3a6wmzn0t69cfob","vote_rshares":377503828166,"last_round":1704709668474}

                account.last_vote_time = new Date().getTime();
                fs.writeFileSync('data/member-' + vest + '/' + name, JSON.stringify(account));
            } catch (e) {
                console.error(e.message);
                console.trace(e);
            }
            if (votes > 10) return true;
        }
    }
    try {

        for (const data of posts) {
            try {
                if (await dopost(data, props)) {
                    setTimeout(run, 0);
                    return;
                }
            } catch (e) {
                console.error(e);
                console.trace(e);
            }
        }
    } catch (e) {
        console.error(e);
        console.trace(e);
    }
    setTimeout(run, 5000);
}
setTimeout(run, 1000);
setInterval(() => {
    rates.push(votes);
    while (rates.length > 60) rates.shift();
    var rate = 0;
    rates.forEach((r) => {
        rate += r / rates.length;
    });
    fs.writeFileSync('data/rate-' + vest, votes.toString());
    votes = 0;
}, 30000)
