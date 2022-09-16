const fs = require("fs");
require("./advertorial.js");
let discord = {};
const accountname = 'angelsands';
const reblog = async () => {
  let posts = fs.readdirSync("data/reblog-" + vest);
  for (let post of posts) {
    console.log('processing')
    try {
      //const account = (await chain.api.getAccountsAsync([accountname]))[0];
      const rc = await client.rc.getRCMana(accountname);
      if (rc.current_mana < 2507386908) {
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
  setTimeout(reblog, 60000);
};
reblog();