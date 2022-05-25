require('./load-hive.js');
const fs = require('fs');
(async () => {
    let acc = fs.readdirSync('member-'+vest); 
    const done = [];
    for(let aindex of acc) {
        const account = fs.readFileSync('data/member-'+vest+'/'+aindex);
        const filter = 'blog';
        const query = {
            tag: aindex,
            limit: 5,
        };
        const discussions = await client.database.getDiscussions(filter, query);
        discussions.forEach((post)=>{
            fs.writeFileSync('data/post-'+vest+'/'+new Date().getTime(), JSON.stringify(post))
        })
    }
})()
