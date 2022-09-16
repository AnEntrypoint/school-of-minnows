const hypercore = require('hypercore');
global.chain = require('steem');
chain.api.setOptions({ url: 'https://api.steemit.com', rebranded_api:true });
require('dotenv').config()
global.dchain = require('dsteem');
global.client = new dchain.Client('https://api.steemit.com');
global.k = dchain.PrivateKey.fromString(process.env.K);
global.dollar = 'sbd';
global.vest = 'steem';
