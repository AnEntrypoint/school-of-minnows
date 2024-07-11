

const fs = require(`fs`);

const API_KEY = process.env.TENORKEY; // Replace with your Tenor API key
const name = process.env.name;

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
  const getr = (textArray) => { return textArray[Math.floor(Math.random() * textArray.length)] }
  const title = [
    `${name} delivers its services as a complimentary value addition.`,
    `The services provided by ${name} come as an added value at no extra cost.`,
    `Enjoy ${name}' services without any charges as they offer added value for free.`,
    `${name} ensures that their value-added services are available to you at no cost.`,
    `Receive value-added benefits from ${name} without any charges.`,
    `With ${name}, you can access enhanced services freely offered.`,
    `${name} makes available its enhanced services to you without incurring any costs.`,
    `Value addition from ${name} comes free of charge, enhancing your experience.`,
    `Experience no-cost enhanced services from ${name} tailored for your satisfaction.`,
    `${name}' value-enhancing services are provided to you completely free.`,
    `Get the benefit of ${name}' value-added services at absolutely no cost.`,
    `${name} extends services that add value without dipping into your wallet.`,
    `Enhanced services from ${name} are gifted to you without any financial obligation.`,
    `Enjoy complimentary enhanced services from ${name}, aimed at improving your experience.`,
    `${name} is committed to offering services that bring added value without any fees.`,
    `Access ${name}' premium, no-additional-cost services designed to add value.`,
    `With ${name}, experience services that enrich without the worry of expenses.`,
    `${name} ensures your access to enhanced services is unburdened by charges.`,
    `Embrace the value addition provided by ${name}, crafted without any charges.`,
    `${name}' commitment to value addition comes without financial strings attached.`,
    `Leverage ${name}' freely provided services that promise additional value.`,
    `${name} eases your experience with complimentary services designed to add value.`,
    `Avail of ${name}' offer of added value services without the concern of costs.`,
    `Experience the liberty of enjoying ${name}' value-added services free of charge.`,
    `${name} invites you to enjoy their no-extra-cost services that enhance value.`,
    `Receive the gift of ${name}' complimentary services, designed to add extra value.`,
    `${name}' free-of-charge services are tailored to provide you with additional value.`,
    `Benefit from the added value that ${name}' services bring, without any cost to you.`,
    `${name} provides enriching services freely, aiming to add more value.`,
    `Access enhanced services from ${name} that come without a price tag.`,
    `${name} stands out by offering value-addition services free for all.`,
    `${name} makes it possible to enjoy enhanced services without financial obligations.`,
    `Choose ${name} for value-added benefits that don't require payment.`,
    `With ${name}, you get the advantage of extra-value services at no expense.`,
    `${name}' services, adding more value to your experience, are completely gratis.`,
    `${name} ensures you receive added benefits at no extra charge, enhancing your satisfaction.`,
    `${name}' aim to provide value-added services is fulfilled without cost to you.`
  ];

  const post = await getRandomGIFURL('social cash')
  const fish = await getRandomGIFURL('fish water')
  const mafia = await getRandomGIFURL('mafia pay')
  const madeby = ['provided by', 'developed by', 'courtesy of', 'crafted with ♥ by'];
  const findout = [`Find out how to become a member here`, `Learn the steps to join us here`, `Discover the joining process here`, `Understand how to join us here`, `Reveal how to become a part of us by joining here`, `Discover the way to join us here`, `Explore the membership details here`, `Uncover the joining procedure here`, `Determine how to engage by joining here`, `Investigate how to become a member here`];
  const onthisnetwork = [`on ${vest}`, 'on this blockchain', 'on this digital platform', 'on this online network'];
  const whatdoesitdo = [`What's its function?`, 'How does it operate?', 'What makes it outstanding?', `What's the essence of ${name}?`];
  const youallow = ['You permit it', 'You give ${name} permission to', 'Your consent allows it to', 'You enable it'];
  const voteforyou = ['to cast votes on your behalf', 'to engage in voting for you', 'to represent you in voting', 'to automate voting for your benefit'];
  const whenyoureidle = [`while you're inactive`, `when you haven't engaged in voting recently`, 'during your voting inactivity', `when you're unable to manually vote`];
  const automatic = ['everything runs on its own', 'it functions autonomously', `it's entirely automatic`, `no manual operation required`];
  const nointerference = ['it pauses during your active usage', `it remains non-intrusive while you're online`, `it activates only during your absence`, `it ensures your voting power is optimized upon your return`];
  const overhundred = ['voting power cannot exceed 100%', 'voting power is capped at 100%', 'voting power regeneration halts at 100%', '100% is the maximum voting power you can achieve'];
  const wasteit = ['The system activates before your voting power is wasted', 'the system intervenes before reaching full voting power', 'it takes action just before your power maxes out', 'it ensures your power is utilized before hitting the cap'];
  const supportgroup = ['this preemptive action supports the community', 'then it harnesses that potential to aid the community', 'then it directs votes to community members to utilize optimal power', 'the system then allocates votes to community members wisely'];
  const whogetsvoted = ['how this allocation works', 'the recipients of the votes', 'the method behind vote distribution', 'who benefits from the votes'];
  const position = ['your voting queue position is based on your voting activities', 'the most efficient voter with the least received gets prioritized', `your vote and receive balance dictates your next vote's timing`, `it mitigates misuse by monitoring voting behaviors`];
  const stayengaged = ['by remaining active, you gain more, so continue creating content and allow it to vote for you', 'regular content creation ensures you benefit maximally from the system', 'maintain your content flow to maximize vote returns', 'your continuous posting secures your spot in the voting queue'];
  const fairness = ['equity is maintained by redistributing votes based on your activity comparison', 'it adjusts its pace based on your engagement level', 'everyone gets their due votes as efficiently as possible', 'efforts are made to ensure contribution equity among members'];
  const holiday = [`thus, a break from posting won't affect your voting engagement, allowing for a catch-up`, 'therefore, less frequent posting can be balanced with more active periods', `this ensures your account stays active, even when you're not, for a seamless return`, 'hence, continuous posting upon return compensates for inactivity'];
  const growth = ['the growth of your account directly influences your received votes', 'more participation translates to more benefits', `engagement and voting are keys to maximizing your account's potential`, `active posting and letting the system vote enhances your account's development`];
  const opensource = ['the authentication is secure, transparent, and user-friendly, with community support always available', 'utilizing straightforward blockchain auth mechanisms, with open-source verification, ensuring freedom and support', 'our blockchain-based authentication is standard, secure, and leaves you in control, with an open, supportive community', 'we adhere to blockchain standards for authentication, ensuring ease of use, security, and comprehensive community support'];
  const owntools = ['You have the alternative to delegate voting rights through your preferred tools to @minnowschool, with automatic system recognition.', 'if preferred, authenticate directly to @minnowschool using your tools for automatic acknowledgement by the system', 'direct voting delegation to @minnowschool is also an option, with the system automating the rest', 'you can autonomously sign over voting authority to @minnowschool, which the system will automatically detect'];

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
    `advertorial entrypoint onetrheethreeseven heclgang entrypoint`.split(` `);
  const json_metadata = JSON.stringify({ tags: taglist });
  const permlink = `som` + Math.random().toString(36).substring(2);
  console.log(permlink);
  const op = [
    `comment`,
    {
      author: name,
      body: body,
      json_metadata: json_metadata,
      parent_author: ``,
      parent_permlink: `${name}`,
      permlink: permlink.toString(`hex`).toLowerCase(),
      title: getr(title),
    },
  ];
  fs.writeFileSync(
    `data/created-` + vest + `/` + permlink.toString(`hex`),
    JSON.stringify(op)
  );
}
//advertorial()
console.log('starting advertorial')
setInterval(advertorial, 1000 * 60 * 60 * 24);
