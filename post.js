const fs = require("fs");
let discord = {};

module.exports = (paragraphs, images, id, msg) => {
  unshift(paragraphs);
  let members = fs.readdirSync("data/discord-" + vest);
  console.log(members, vest);
  for (let member of members) {
    if (!members[member]) {
      const memid = fs.readFileSync("data/discord-" + vest + "/" + member);
      members[member] = memid;
      discord[memid] = member;
    }
  }

  let name = discord[id];
  console.log(name, id, discord);
  if (!name) {
    return false;
  }
  const title = paragraphs.shift();
  const body = [];
  function findHashtags(searchText) {
    var regexp = /\B\#\w\w+\b/g;
    result = searchText.match(regexp);
    if (result)
      return result.map((a) => a.replace("#", "")).filter((a) => a.length);
    else return [];
  }
  const taglist = [];
  for (let paragraph of paragraphs) {
    for (let tag of findHashtags(paragraph)) taglist.push(tag);
    const image = images.shift();
    console.log(image);
    if (image) body.push(`![](${image})`);
    body.push(paragraph);
  }

  if (!taglist.length) msg.reply("must include at least one #hashtag");
  const json_metadata = JSON.stringify({ tags: taglist });
  const permlink = "post" + Math.random().toString(36).substring(2);

  const op = [
    "comment",
    {
      author: name,
      body: body.join("\n\n"),
      json_metadata: json_metadata,
      parent_author: "",
      parent_permlink: taglist[0],
      permlink: permlink.toString("hex"),
      title: title,
    },
    "comment_options",
    {
      author: name,
      permlink: permlink.toString("hex"),
      max_accepted_payout: "1000000000 HBD",
      percent_hbd: 0,
      allow_votes: true,
      allow_curation_rewards: true,
      extensions: [],
    }
  ];
  fs.writeFileSync(
    "created-" + vest + "/" + permlink.toString("hex"),
    JSON.stringify(op)
  );
  return true;
};
