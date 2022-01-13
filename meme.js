const fs = require('fs');
let discord = {};
const getMembers = async () => {
    let send = fs.readdirSync('created-'+vest); 
    const done = [];
    for(let post of send) {
        const op = JSON.parse(fs.readFileSync('created-'+vest+'/'+post));
        if(done.includes(op[1].author)) {
            console.log('already checked', op[1].author)
            continue;
        }
        const account = (await chain.api.getAccountsAsync([op[1].author]))[0];
        
        var props = await client.database.getDynamicGlobalProperties()
        var CURRENT_UNIX_TIMESTAMP = parseInt((new Date(props.time).getTime() / 1000).toFixed(0))
        if(CURRENT_UNIX_TIMESTAMP -  parseInt((new Date(account.last_root_post).getTime() / 1000).toFixed(0)) < 360) {
            console.log('posted last 5 minutes');
            done.push(op[1].author);
            continue;
        }
        done.push(op[1].author);
        const rc = await client.rc.getRCMana(op[1].author);
        if(rc.current_mana < 1407386908) {
            console.log(op[1].author, 'rc', rc.current_mana, 'needs', 914399162-rc.current_mana, 'more');
            continue;
        }
        try {
            op[1].title = op[1].title.slice(253);
            op[1].parent_permlink = op[1].parent_permlink||'School of minnows';
            console.log(op);
            const adjust = [        
                'comment_options',
                {
                    author: op[1].author,
                    permlink: op[1].permlink,
                    max_accepted_payout:	'1000000000 '+vest=='steem'?'SBD':'HBD',
                    percent_hbd:	0,
                    allow_votes:	true,
                    allow_curation_rewards:	true,
                    extensions:	[]
                }
            ];

            const res = await client.broadcast.sendOperations([op],k);
            setTimeout(()=>{client.broadcast.sendOperations([adjust],k)}, 60000);
            console.log(res);
            if(res && res.id) fs.renameSync('created-'+vest+'/'+post, 'finished-'+vest+'/'+post);
            else  fs.renameSync('created-'+vest+'/'+post, 'failed-'+vest+'/'+post);

        } catch(e) {
            console.trace(e);
            if(fs.existsSync('created-'+vest+'/'+post)) fs.renameSync('created-'+vest+'/'+post, 'failed-'+vest+'/'+post);
        }
        return;
    }
}
getMembers();
setInterval(getMembers, 180000);
console.log('poster ready');

module.exports = (msgtitle, imglink, id)=>{
    let members = fs.readdirSync('discord-'+vest);
    console.log(members, vest);
    for(let member of members) {
        if(!members[member]) {
            const memid = fs.readFileSync('discord-'+vest+'/'+member);
            members[member] = memid;
            discord[memid] = member;
        }
    }
    console.log('poster meme', id, discord);
    const name = discord[id];
    if(!name) {
        console.log('no user');
        return;
    }
    const title = msgtitle || 'An ENTRYPOINT MEME';
    const body = `# ${title}

${imglink}

A heclgang meme

Brought to you by ENTRYPOINT
Visit entrypoint discord https://discord.com/invite/t7dDTnd
#weareone #onethreethreeseven
`;
    
    const taglist = 'meme weareone onetrheethreeseven heclgang entrypoint'.split(' ');
    const json_metadata = JSON.stringify({ tags: taglist });
    const permlink = 'meme' + Math.random()
        .toString(36)
        .substring(2);
    console.log(permlink)
    
    const op = [
        'comment',
        {
            author: name,
            body: body,
            json_metadata: json_metadata,
            parent_author: '',
            parent_permlink: taglist[0]?taglist[0].toString():'steemit',
            permlink: permlink.toString('hex'),
            title: title,
        }
    ];
    fs.writeFileSync('created-'+vest+'/'+permlink.toString('hex'), JSON.stringify(op));
   }

