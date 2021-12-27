let last = new Date().getTime();
const fs = require('fs');
let members;
const getMembers = () => {
    members = fs.readdirSync('member-'+vest);
    if(new Date().getTime() - last > 60000) process.exit(1);
}
setInterval(getMembers, 60000);
getMembers();
(() => {

    chain.api.streamOperations(function (err, operations) {
        last = new Date().getTime();
        try {
            if (operations && operations[0] == 'account_update') {
                const tx = operations[1];
                console.log('account update');
                
                if (tx.posting && tx.posting.account_auths.length) {
                    for (let auth of tx.posting.account_auths) {
                        if (auth[0] == 'minnowschool') {
                            console.log('enrolled');
                            fs.writeFileSync("member-"+vest+"/" + tx.account, '');
                        }
                    }
                }
            }
            if (operations && operations[0] == 'comment') {
                const post = operations[1];
                if (!post.parent_author) {
                    if (members.includes(post.author)) {
                        if(post.title == 'SOMDID') {
                            fs.writeFileSync("discord-"+vest+"/" + post.author, post.body);
                        } else {
                            fs.writeFileSync("post-"+vest+"/" + new Date().getTime(), JSON.stringify(operations[1], null, 2));
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