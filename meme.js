const fs = require("fs");
require("./advertorial.js");
let discord = {};
const getMembers = async () => {
  let send = fs.readdirSync("data/created-" + vest);
  const done = [];
  for (let post of send) {
    try {
      const op = JSON.parse(
        fs.readFileSync("data/created-" + vest + "/" + post)
      );
      if (done.includes(op[1].author)) {
        continue;
      }
      const account = (await chain.api.getAccountsAsync([op[1].author]))[0];

      var props = await client.database.getDynamicGlobalProperties();
      var CURRENT_UNIX_TIMESTAMP = parseInt(
        (new Date(props.time).getTime() / 1000).toFixed(0)
      );
      if (
        CURRENT_UNIX_TIMESTAMP -
        parseInt(
          (new Date(account.last_root_post).getTime() / 1000).toFixed(0)
        ) <
        360
      ) {
        console.log("posted last 5 minutes");
        done.push(op[1].author);
        continue;
      }
      done.push(op[1].author);
      const rc = await client.rc.getRCMana(op[1].author);
      if (rc.current_mana < 2707386908) {
        console.log(
          op[1].author,
          "rc",
          rc.current_mana,
          "needs",
          914399162 - rc.current_mana,
          "more"
        );
        continue;
      }
      op[1].title = op[1].title.slice(0, 253);
      op[1].parent_permlink = op[1].parent_permlink || "School of minnows";
      op.push("comment_options")
      
      op.push({
        author: op[1].author,
        permlink: op[1].permlink,
        max_accepted_payout: "1000000000 "+global.dollar.toUpperCase(),
        allow_votes: true,
        allow_curation_rewards: true,
        extensions: [],
      })
      op[3][`percent_${global.dollar.toUpperCase()}`]=100
      console.log(op);
      const res = await client.broadcast.sendOperations([op], k);
      /*setTimeout(()=>{
                const adjust = [        
                    'comment_options',
                    {
                        author: op[1].author,
                        permlink: op[1].permlink,
                        max_accepted_payout:	{
                            "amount": "1000000",
                            "precision": 3,
                            "nai": "@@000000013"
                        },
                        percent_hbd:	000,
                        allow_votes:	true,
                        allow_curation_rewards:	true,
                        extensions:	[]
                    }
                ];
                client.broadcast.sendOperations([adjust],k)
            }, 180000);*/
      if (res && res.id)
        fs.renameSync(
          "data/created-" + vest + "/" + post,
          "data/finished-" + vest + "/" + post
        );
      else
        fs.renameSync(
          "data/created-" + vest + "/" + post,
          "data/failed-" + vest + "/" + post
        );
    } catch (e) {
      console.trace(e);
      if (fs.existsSync("data/created-" + vest + "/" + post))
        fs.renameSync(
          "data/created-" + vest + "/" + post,
          "data/failed-" + vest + "/" + post
        );
    }
    //return;
  }
};
getMembers();
setInterval(getMembers, 180000);
console.log("poster ready");

module.exports = (msgtitle, imglink, id) => {
  let members = fs.readdirSync("data/discord-" + vest);
  console.log(members, vest);
  for (let member of members) {
    if (!members[member]) {
      const memid = fs.readFileSync("data/discord-" + vest + "/" + member);
      members[member] = memid;
      discord[memid] = member;
    }
  }
  console.log("poster meme", id, discord);
  const name = discord[id];
  if (!name) {
    console.log("no user");
    return;
  }
  const title = msgtitle || "An ENTRYPOINT MEME";

  const madeby = ['provisioned by', 'created by', 'brought to you by', 'made with ♥ by'];
  const someonefrom = ['a member of', 'someone from', 'one of the OG members of this social network, from', 'a most illustrious member of'];
  const group = ['ENTRYPOINT', 'ONETHREETHREESEVEN', 'this social networks original community', 'heclgang'];
  const slogan = ['🕉 we are one 🕉', 'we are onethreethreeseven', 'we like triangles', 'in cheese we trust', 'we are heclgang'];
  const hashtags = ['weareone', 'weareonethreethreeseven', 'heclgang', 'onethreethreeseven', 'entrypoint', 'meme'];
  const effect = ["prove that you are not a robot", 'become part of a living community', 'solve earth', 'speed run life', 'make yourself famous', 'be the meme'];
  const getr = (textArray) => { return textArray[Math.floor(Math.random() * textArray.length)] }
  const tags = `${getr(hashtags)} ${getr(hashtags)} ${getr(hashtags)}`;
  const body = `# ${getr(madeby)} ${getr(someonefrom)} ${getr(group)}

${imglink}

A ${getr(group)} meme
${getr(slogan)}

Don't be a NPC! Visit ${getr(group)} discord https://discord.gg/NED33mNpms and ${getr(effect)}!
${tags}
`;

  const taglist = tags.split(
    " "
  );
  const json_metadata = JSON.stringify({ tags: taglist });
  const permlink = "meme" + Math.random().toString(36).substring(2);
  console.log(permlink);

  const op = [
    "comment",
    {
      author: name,
      body: body,
      json_metadata: json_metadata,
      parent_author: "",
      parent_permlink: taglist[0] ? taglist[0].toString() : "meme",
      permlink: permlink.toString("hex"),
      title: title,
    },
  ];
  fs.writeFileSync(
    "data/created-" + vest + "/" + permlink.toString("hex"),
    JSON.stringify(op)
  );
};
