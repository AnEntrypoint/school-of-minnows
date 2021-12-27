const fs = require('fs');
let discord = {};
const getMembers = async () => {
    let send = fs.readdirSync('created-'+vest); 
    const done = [];
    for(let post of send) {
        const op = JSON.parse(fs.readFileSync('created-'+vest+'/'+post));
        const account = (await chain.api.getAccountsAsync([op[1].author]))[0];
        
        if(done.includes(op[1].author)) continue;
        var props = await client.database.getDynamicGlobalProperties()
        var CURRENT_UNIX_TIMESTAMP = parseInt((new Date(props.time).getTime() / 1000).toFixed(0))
        if(CURRENT_UNIX_TIMESTAMP -  parseInt((new Date(account.last_root_post).getTime() / 1000).toFixed(0)) < 360) {
            console.log('posted last 5 minutes');
            done.push(op[1].author);
            continue;
        }
        done.push(op[1].author);
        const rc = await client.rc.getRCMana(op[1].author);
        if(rc.current_mana < 922966515) return 0;
        const res = await client.broadcast.sendOperations([op],k);
        console.log(res);
        if(res && res.id) fs.renameSync('created-'+vest+'/'+post, 'finished-'+vest+'/'+post);            
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
            parent_permlink: taglist[0],
            permlink: permlink.toString('hex'),
            title: title,
        },
    ];
    fs.writeFileSync('created-'+vest+'/'+permlink.toString('hex'), JSON.stringify(op));
   }

