const fs = require("fs");
const accountname = 'minnowswarm';
const reblog = async () => {
  count = 0;
  let posts = fs.readdirSync("data/reblog-" + vest);
  for (let post of posts) {
    count++;
    if(count == 5) return;
    console.log('processing')
    try {
      //const account = (await chain.api.getAccountsAsync([accountname]))[0];
      const rc = await client.rc.getRCMana(accountname);
      if (rc.current_mana < 1807386908) {
        console.log(
          accountname,
          "rc",
          rc.current_mana,
          "needs",
          2607386908 - rc.current_mana,
          "more"
        );
        return;
      }
      const file = fs.readFileSync("data/reblog-" + vest + '/' + post)
      const postdata = JSON.parse(file);
      console.log(postdata)
      const jsonOp = JSON.stringify([
            'reblog',
            {
                account:accountname,
                author: postdata.author,
                permlink: postdata.permlink,
            },
        ]);
        console.log({jsonOp});
        const op = {
            id: 'follow',
            json: jsonOp,
            required_auths: [],
            required_posting_auths: [accountname],
        };
        console.log({op});
        client.broadcast.json(op, k);
      
      
        fs.unlinkSync(
            "data/reblog-" + vest + "/" + post,
        );
        console.log('procesed')
    } catch (e) {
        console.log('failed')
      console.trace(e);
    }
  }
};
setInterval(reblog, 60000);
