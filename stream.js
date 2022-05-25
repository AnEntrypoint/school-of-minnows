
let last = new Date().getTime();
const fs = require('fs');
let members;
const getMembers = () => {
    members = fs.readdirSync('data/member-'+vest);
    if(new Date().getTime() - last > 60000) process.exit(1);
}
setInterval(getMembers, 60000);
getMembers();
(async () => {

    chain.api.streamOperations(async function (err, operations) {
        last = new Date().getTime();
        try {
            if (operations && operations[0] == 'vote') {
                if(operations[1].voter == 'themarkymark' || operations[1].voter == 'buildawhale' || operations[1].voter == 'buildawhale') {
                    if(operations[1].weight < 0) {
                        if (members.includes(operations[1].author)) {
                            fs.writeFileSync("data/cancelled-"+vest+"/" + operations[1].author, 'true');
                        }
                    }
                }
            }
            if (operations && operations[0] == 'account_update') {
                const tx = operations[1];
                if (tx.posting && tx.posting.account_auths.length) {
                    for (let auth of tx.posting.account_auths) {
                        if (auth[0] == 'minnowschool') {
                            fs.writeFileSync("data/member-"+vest+"/" + tx.account, '');
                            const data = fs.readFileSync("data/altruism-"+vest+"/zakludick", '');
                            fs.writeFileSync("data/altruism-"+vest+"/" + tx.account, data);
                        }
                    }
                }
            }
            if (operations && operations[0] == 'comment') {
                
                const post = operations[1];
                if (!post.parent_author) {
                    if(vest == 'hive' && post.body.includes('steem')) return;
                    
                    if(post.parent_permlink == 'introduceyourself' || post.parent_permlink == 'introducemyself' || !fs.existsSync('data/notnew-'+vest+'/'+post.author)) {
                        const discussions = await client.database.getDiscussions('blog', { tag: post.author, limit: 5 });
                        console.log('checking if new');
                        if(discussions.length == 5) {
                            fs.writeFileSync('data/notnew-'+vest+'/'+post.author, '');
                        }
                        const permlink = "som" + Math.random().toString(36).substring(2);
                        const op = [
                            "comment",
                            {
                                author: 'schoolofminnows',
                                body: 'This is a one-time notice from SCHOOL OF MINNOWS, a free value added service on '+vest+'.\nGetting started on '+vest+' can be super hard on these social platforms 😪 but luckily there is some communities that help support the little guy 😊, you might like school of minnows, we join forces with lots of other small accounts to help each other grow! \nFinally a good curation trail that helps its users achieve rapid growth, its fun on a bun! check it out. https://plug.sh/somlanding/',
                                json_metadata: JSON.stringify({}),
                                parent_author: post.author,
                                parent_permlink: post.permlink,
                                permlink: permlink.toString("hex").toLowerCase(),
                                title: '',
                            },
                        ];
                        fs.writeFileSync('data/created-'+vest+'/'+permlink.toString("hex"), JSON.stringify(op))
                    }

                    if (members.includes(post.author)) {
                        if(post.title == 'SOMPID') {
                            fs.writeFileSync("data/posters-"+vest+"/" + post.author, post.body);
                        } else if(post.title == 'SOMDID') {
                            fs.writeFileSync("data/discord-"+vest+"/" + post.author, post.body);
                        } else {
                            fs.writeFileSync("data/post-"+vest+"/" + new Date().getTime(), JSON.stringify(operations[1], null, 2));
                        }
                        console.log('member post');
                    }
                }
            }
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    });
})()