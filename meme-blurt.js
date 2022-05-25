require('./load-blurt.js');
const post = require('./post.js');
require('./discord.js')(require('./meme.js'), post);
