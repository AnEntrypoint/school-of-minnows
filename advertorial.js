const fs = require("fs");
advertorial  = () => {
  const name = "schoolofminnows";
  const title = "SCHOOL OF MINNOWS IS A FREE VALUE ADDED SERVICE";
  const body = `You allow the group to vote for you, the rest is automatic.

  Find out how to join here: https://plug.sh/somlanding/

https://media.discordapp.net/attachments/880507766345728100/914191196652445716/5vq702.png

# WHAT DOES IT DO?

Your voting power can not go over 100%. It waits till voting power is about to go to waste, then prevents that waste to support the group. If your voting power reaches close to 100% it will vote on your behalf for other group members.

https://media.discordapp.net/attachments/880507766345728100/914192883148541982/2Q.png?width=478&height=683

# HOW IS THIS DONE

Your position for a vote is determined by how many votes has been produced on your behalf, you will be refunded for your votes, keep posting, keep letting it vote, and you'll get the maximum out, when you're behind, you will get more votes, when you're overpaid, it will spread to other users a bit first, so if you don't post for a while, you can post more often to catch up.

You just join, and post, that's all you do, the more you let your voting idle, the more you'll get from the group.

https://media.discordapp.net/attachments/880507766345728100/914191619295703061/Z.png

You can also use your own tools or wallet to delegate post access to the @minnowschool account

# How do I join?

All you have to do is give voting access to the account, the rest is automatic.

Find out how to join here: https://plug.sh/somlanding/`;

  const taglist =
    "advertorial entrypoint onetrheethreeseven heclgang entrypoint".split(" ");
  const json_metadata = JSON.stringify({ tags: taglist });
  const permlink = "som" + Math.random().toString(36).substring(2);
  console.log(permlink);
  const op = [
    "comment",
    {
      author: name,
      body: body,
      json_metadata: json_metadata,
      parent_author: "",
      parent_permlink: "schoolofminnows",
      permlink: permlink.toString("hex").toLowerCase(),
      title: title,
    },
  ];
  fs.writeFileSync('data/advertorial-'+vest+'/last', permlink.toString("hex").toLowerCase())
  fs.writeFileSync(
    "data/created-"+vest+"/" + permlink.toString("hex"),
    JSON.stringify(op)
  );
}

setInterval(advertorial, 1000 * 60 * 60 * 24);
