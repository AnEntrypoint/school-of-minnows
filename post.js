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
        const res = await client.broadcast.sendOperations([op],k);
        console.log(res);
        if(res && res.id) fs.renameSync('created-'+vest+'/'+post, 'finished-'+vest+'/'+post);            
        return;
    }
}
getMembers();
setInterval(getMembers, 180000);
console.log('poster ready');

module.exports = (paragraphs, images, id, msg)=>{
    let members = fs.readdirSync('discord-'+vest);
    console.log(members, vest);
    for(let member of members) {
        if(!members[member]) {
            const memid = fs.readFileSync('discord-'+vest+'/'+member);
            members[member] = memid;
            discord[memid] = member;
        }
    }  
    const name = discord[id];
    if(!name) {
        return false;
    }
    const title = paragraphs.shift();
    const body = [];
    function findHashtags(searchText) {
        var regexp = /\B\#\w\w+\b/g
        result = searchText.match(regexp);
        if(result) return result.map(a=>a.replace('#','')).filter(a=>a.length)
        else return [];
    }
    const taglist = [];
    for(let paragraph of paragraphs) {
        for(let tag of findHashtags(paragraph)) taglist.push(tag);
        const image = images.shift();
        console.log(image);
        if(image) body.push(`![](${image})`);
        body.push(paragraph);
    }
    if(!taglist.length) msg.reply('must include at least one #hashtag');
    const json_metadata = JSON.stringify({ tags: taglist });
    const permlink = 'post' + Math.random().toString(36).substring(2);

    const op = [
        'comment',
        {
            author: name,
            body: body.join("\n\n"),
            json_metadata: json_metadata,
            parent_author: '',
            parent_permlink: taglist[0],
            permlink: permlink.toString('hex'),
            title: title,
        },
        'comment_options',
        {
            author: name,
            permlink: permlink.toString('hex'),
            max_accepted_payout: '1000000000 HBD',
            percent_hbd:	0,
            allow_votes:	true,
            allow_curation_rewards:	true,
            extensions:	[]
        }
    ];
    fs.writeFileSync('created-'+vest+'/'+permlink.toString('hex'), JSON.stringify(op));
    return true;
    }

