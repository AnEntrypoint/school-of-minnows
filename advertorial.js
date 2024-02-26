

const fs = require("fs");

const API_KEY = process.env.TENORKEY; // Replace with your Tenor API key
async function getRandomGIFURL(searchQuery) {
  try {
    const response = await fetch(`https://g.tenor.com/v2/search?key=${API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=50`);
    
    if (!response.ok) {
      console.log(API_KEY)
      console.error(response)
      throw new Error('Failed to fetch GIFs');
    }

    const data = await response.json();
    const gifs = data.results.map(item => item.media_formats.gif.url);

    const randomIndex = Math.floor(Math.random() * gifs.length);
    const randomGIFURL = gifs[randomIndex];

    console.log('Random GIF URL:', randomGIFURL);
    return randomGIFURL;
  } catch (error) {
    console.error('Error fetching GIF:', error);
    return null;
  }
}

advertorial = async () => {
  const name = "swarmofminnows";
  const getr = (textArray) => { return textArray[Math.floor(Math.random() * textArray.length)] }
  const title = [
    "swarm-of-minnows is a free value added service",
    "swarm-of-minnows provides a complimentary value-added service",
    "swarm-of-minnows offers a no-cost value addition service",
    "swarm-of-minnows delivers a free value-added service",
    "swarm-of-minnows grants a value-added service at no charge",
    "swarm-of-minnows furnishes a value-added service for free",
    "swarm-of-minnows presents a value-added service for no cost",
    "swarm-of-minnows bestows a free value addition service",
    "swarm-of-minnows supplies a value-added service without charge",
    "swarm-of-minnows affords a value-added service for free",
    "swarm-of-minnows dispenses a free value-added service",
    "swarm-of-minnows yields a no-cost value-added service",
    "swarm-of-minnows offers a complimentary value addition service",
    "swarm-of-minnows provides a free value-added service",
    "swarm-of-minnows gives a value-added service at no charge",
    "swarm-of-minnows furnishes a no-cost value addition service",
    "swarm-of-minnows delivers a value-added service for free",
    "swarm-of-minnows grants a value-added service without cost",
    "swarm-of-minnows offers a value-added service for no cost",
    "swarm-of-minnows bestows a no-cost value addition service",
    "swarm-of-minnows supplies a free value-added service",
    "swarm-of-minnows affords a value-added service without charge",
    "swarm-of-minnows dispenses a value-added service for free",
    "swarm-of-minnows yields a free value addition service",
    "swarm-of-minnows provides a no-cost value-added service",
    "swarm-of-minnows gives a complimentary value addition service",
    "swarm-of-minnows furnishes a free value-added service",
    "swarm-of-minnows delivers a value-added service at no charge",
    "swarm-of-minnows grants a no-cost value addition service",
    "swarm-of-minnows offers a free value-added service",
    "swarm-of-minnows bestows a value-added service without cost",
    "swarm-of-minnows supplies a no-cost value addition service",
    "swarm-of-minnows affords a free value-added service",
    "swarm-of-minnows dispenses a value-added service without charge",
    "swarm-of-minnows yields a value-added service for free",
    "swarm-of-minnows provides a free value addition service",
    "swarm-of-minnows gives a value-added service without cost",
    "swarm-of-minnows furnishes a no-cost value-added service",
    "swarm-of-minnows delivers a free value-added service",
    "swarm-of-minnows grants a value-added service for no cost",
    "swarm-of-minnows offers a no-cost value addition service",
    "swarm-of-minnows bestows a free value-added service",
    "swarm-of-minnows supplies a value-added service at no charge",
    "swarm-of-minnows affords a value-added service for free",
    "swarm-of-minnows dispenses a free value addition service",
    "swarm-of-minnows yields a no-cost value-added service",
    "swarm-of-minnows provides a complimentary value-added service"
];

  const post = await getRandomGIFURL('post money')
  const fish = await getRandomGIFURL('fish ocean')
  const mafia = await getRandomGIFURL('mafia make money')
  const madeby = ['provisioned by', 'created by', 'brought to you by', 'made with ♥ by'];
  const findout = ["Discover how to become a member here", "Learn how to join right here", "Explore the process of joining here", "Find out the steps to join here", "Uncover how to become a part of this by joining here", "Get to know how to join here", "Learn more about joining right here", "Discover the process to join here", "Find out how to get involved by joining here", "Explore how you can join right here"];
  const onthisnetwork = ['on ' + vest, 'on this chain', 'on this network', 'on this social network'];
  const whatdoesitdo = ['What does it do?', 'How does it work?', 'Why is it great?', 'What exactly is swarm-of-minnows?'];
  const youallow = ['You allow it', 'You authorize swarm-of-minnows to', 'You allow it to', 'You let it'];
  const voteforyou = ['to vote for your account', 'to trigger votes for you', 'to vote other members for you', 'to trigger votes on your behalf for other members'];
  const whenyoureidle = ['when youre idle', 'when you havent voted for a while', 'when your account hasnt been voting', 'when you cant reach your computer to vote'];
  const automatic = ['the rest is automatic', 'it operates by itself', 'its fully automated', 'you dont need to operate it'];
  const nointerference = ['it sleeps when you use the network', 'it doesnt interfere with your use', 'it only runs when youre away', 'it keeps your voting power full for when you return'];
  const overhundred = ['your voting power can not go over 100%', 'you cant have more than hundred percent voting power', 'your VP stops regenerating when it hits 100%', 'you cant have more than 100% voting power'];
  const wasteit = ['This system waits till your voting power is about to go to waste', 'the system waits till you have nearly 100%', 'it waits till that point', 'it waits for your power to be nearly full'];
  const supportgroup = ['this waste is prevented to support the group', 'then prevents that waste to support the group', 'then votes other members of the group to prevent that waste', 'it then prevents that scenario by voting other members'];
  const whogetsvoted = ['how is this done', 'who gets voted', 'how is this determined', 'who receives votes'];
  const position = ['your position for a vote is determined by how many votes has been produced on your behalf', 'the person with an available post whos voted the most and received the least gets the next vote', 'it balances the votes you make and receive to determine your position for the next vote', 'it prevents abuse by tracking who votes and whos received votes']
  const stayengaged = ['your votes get returned with a surplus, keep posting, keep letting it vote, and youll get the maximum out', 'if you post every so often you should be able to get what you can get from it', 'just keep posting and it will give you your outstanding votes', 'all you need to do is keep posting and youll get your votes based on your queue position'];
  const fairness = ['when youre behind, you will get more votes, when youre overpaid, it will spread to other users a bit first', 'it will slow down when youre overpaid and speed up otherwise', 'you will get all your outstanding votes as fast as possible', 'ot makes a best effort to keep you on track numerically with the other users'];
  const holiday = ['so if your unavailable to post for a while your account will remain active voting, and you can come back and enjoy more votes', 'so if you dont post for a while, you can post more often to catch up', 'so if you have to leave your computer for a while, you can come back and your account will catch up', 'so all you have to do to catch up with votes is keep posting']
  const growth = ['as your account grows, so will the votes you receive', 'the more you let the system vote on your behalf, the more youll receive', 'letting it vote and keeping posting maximises your rewards', 'letting it vote and posting is how you optimize your accounts growth']
  const opensource = ['the auth mechanisms are safe, open source, extremely simple and easy to verify and you are free to leave at any time, if you ever need help our community is very active', 'swarm-of-minnows uses ordinary ' + vest + ' authentication mechanisms, the trigger pages that calls the authentication mechanisms are opensourced and easy to inspect, you are free to leave at any time, if you have any problems we also have a very active community that have always provent to be helpful', 'we use standard authentication mechanisms provided by the blockchain, we use standard singing tools as provided by the blockchains documentation, you can leave at any time, the tools we use to join are easy to inspect, and we do not keep any of our users keys']
  const owntools = ['Alternatively, you can also use your own tools or wallet to delegate voting access to the @minnowschool account, the system will likewise detect it automatically.', 'you can also sign the authentication yourself if your tools allows you to do it, the account is @minnowschool the system will pick you up automatically', 'you can also sign voting auth to @minnowschool yourself, the rest is automatic']

  const fetch = require('node-fetch');
  const fs = require('fs');



  const body = `tl;dr: ${getr(youallow)} ${getr(voteforyou)} ${getr(whenyoureidle)}, ${getr(automatic)}, ${getr(nointerference)}.
  
  ${getr(findout)}: https://som.lan.247420.xyz

${post}

# ${await getr(whatdoesitdo)}?

${getr(onthisnetwork)}, ${getr(overhundred)}. ${getr(wasteit)}, ${getr(supportgroup)}.

${fish}

# ${getr(whogetsvoted)}

${getr(position)}, ${getr(stayengaged)}. ${getr(fairness)}, ${getr(fairness)} ${getr(holiday)}.

${getr(growth)}

${mafia}

# How do I join?

${getr(opensource)}

${getr(owntools)}

${getr(findout)}: https://som.lan.247420.xyz

${getr(madeby)}`;

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
      parent_permlink: "swarmofminnows",
      permlink: permlink.toString("hex").toLowerCase(),
      title: getr(title),
    },
  ];
  fs.writeFileSync(
    "data/created-" + vest + "/" + permlink.toString("hex"),
    JSON.stringify(op)
  );
}
advertorial()
console.log('starting advertorial')
setInterval(advertorial, 1000 * 60 * 60 * 24);
