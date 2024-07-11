
let last = new Date().getTime();
const fs = require('fs');
const axios = require('axios');
let members;
const getMembers = () => {
    members = fs.readdirSync('data/member-' + vest);
    if (new Date().getTime() - last > 60000) process.exit(1);
}
setInterval(getMembers, 60000);
getMembers();
const guilty = require('./guilty.js').default;
console.log({ guilty });
let fund;
let price;
const sync = async () => {
    console.log('getting price');
    fund = await chain.api.getRewardFundAsync('post');
    gotprice = (await chain.api.getCurrentMedianHistoryPriceAsync()) || 1;
    console.log({ gotprice });
    price = parseFloat((gotprice).quote.split(' ')[0]) / parseFloat((gotprice).base.split(' ')[0]);
}
setInterval(sync, 1000 * 60 * 60);
sync();
const getValue = async (name) => {
    const account = (await chain.api.getAccountsAsync([name]))[0];
    const total_vests = parseFloat(account.vesting_shares.split(' ')[0]) + parseFloat(account.received_vesting_shares.split(' ')[0]) - parseFloat(account.delegated_vesting_shares.split(' ')[0]);
    const final_vest = total_vests * 1e6;
    const power = (account.voting_power * 100 / 10000) / 50;
    const rshares = power * final_vest / 10000;
    const estimate = rshares / parseFloat(fund.recent_claims) * parseFloat(fund.reward_balance.split(' ')[0]) * price;
    return estimate;
}


const blacklisters = {};
(async () => {

    chain.api.streamOperations(async function (err, operations) {
        last = new Date().getTime();
        try {
            if (operations && operations[0] == 'vote') {
                if (!members.includes(operations[1].author)) {
                    return;
                }
                if (operations[1].weight < - 0) {
                    if (await getValue(operations[1].voter) < 1) return;
                    try {
                        blacklisters[operations[1].voter] = parseInt(fs.readFileSync("data/blacklisters/" + operations[1].voter));
                    } catch (e) {
                        blacklisters[operations[1].voter] = 0;
                    }
                    if (blacklisters[operations[1].voter] > 3) {
                        if (members.includes(operations[1].author)) {
                            fs.writeFileSync("data/cancelled-" + vest + "/" + operations[1].author, 'true');
                        }
                    }
                    ++blacklisters[operations[1].voter];
                    fs.writeFileSync("data/blacklisters/" + operations[1].voter, blacklisters[operations[1].voter].toString())
                }
            }
            if (operations && operations[0] == 'account_update') {
                const tx = operations[1];
                if (tx.posting && tx.posting.account_auths.length) {
                    for (let auth of tx.posting.account_auths) {
                        if (auth[0] == 'minnowschool') {
                            fs.writeFileSync("data/member-" + vest + "/" + tx.account, '')
                            const data = fs.readFileSync("data/altruism-" + vest + "/zakludick", '')
                            fs.writeFileSync("data/altruism-" + vest + "/" + tx.account, data)
                        }
                    }
                }
            }
            if (operations && operations[0] == 'comment') {
                //console.log('post')
                const post = operations[1];
                if (!post.parent_author) {
                    fs.writeFileSync('data/' + vest + '-known/' + post.author, '');
                    if (vest == 'hive' && post.body.includes('steem')) return;

                    if (members.includes(post.author) || Math.random() < 0.001) {
                        const discussions = await client.database.getDiscussions('blog', { tag: post.author, limit: 5 });
                        console.log('checking if new');
                        if (discussions.length == 5) {
                            fs.writeFileSync('data/notnew-' + vest + '/' + post.author, '');
                        }
                        const permlink = "som" + Math.random().toString(36).substring(2);
                        const op = [
                            "comment",
                            {
                                author: process.env.name,
                                body: 'This post is supported by the '+process.env.name+' community, using a free service.\nA community that helps support the little guy 😊, we join lots of other small accounts to help each other grow! \nFinally a good curation trail that helps small users achieve growth, its fun on a bun! check it out. https://som.lan.247420.xyz/ \nWe are open source and have been audited by many users and its easy to confirm that there is no risk in using it.\nBoth our enrollment system and upvote bot is open source and whitelisted by MalwareBytes, accepted by Github, and we\'ve serviced thousands of users since 2017, our bot is free and will only ever vote on your behalf if your idle reaches 100%.\n We respect our users freedom, enrollement as well as unenrollment from our system is done directly on the blockchain and you do not need our services to join/leave.\n\nBot source: https://github.com/AnEntrypoint/school-of-minnows\n\nLanding page source: https://github.com/AnEntrypoint/school-of-minnows-landing\n\nSchool of minnows is FREE OPEN SOURCE software, if you need to contact us, meet up on the 247420 discord: https://discord.gg/NED33mNpms\nWe are always active and happy to answer any questions you may have.',
                                json_metadata: JSON.stringify({}),
                                parent_author: post.author,
                                parent_permlink: post.permlink,
                                permlink: permlink.toString("hex").toLowerCase(),
                                title: '',
                            },
                        ];
                        //fs.writeFileSync('data/created-' + vest + '/' + permlink.toString("hex"), JSON.stringify(op))

                        if (post.title == 'SOMPID') {
                            fs.writeFileSync("data/posters-" + vest + "/" + post.author, post.body);
                        } else if (post.title == 'SOMDID') {
                            fs.writeFileSync("data/discord-" + vest + "/" + post.author, post.body);
                        } else {
                            try {
                                const cancelled = fs.readFileSync('data/cancelled-' + vest + '/' + post.author);
                            } catch (e) {
                                fs.writeFileSync("data/reblog-" + vest + "/" + new Date().getTime(), JSON.stringify(operations[1], null, 2));
                                fs.writeFileSync("data/post-" + vest + "/" + new Date().getTime(), JSON.stringify(operations[1], null, 2));
                                if(fs.existsSync("data/lens-" + vest + "/" + tx.account)) fs.writeFileSync("../schwemplate/newposts" + vest + "/" + new Date().getTime(), JSON.stringify(operations[1], null, 2));
                            }
                        }
                        console.log('member post');
                    } else {
                        if (vest == 'hive' && Math.random() < 0.001) {
                            guilty(post.author, 'https://hive.blog/@' + post.author + '/' + post.permlink);
                        }
                    }
                }
            }
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    });
})()
//guilty('test', 'https://hive.blog/@' + 'test' + '/');
