global.chain = require('@blurtfoundation/blurtjs');
chain.api.setOptions({ url: 'https://rpc.blurt.world', rebranded_api:true });
require('dotenv').config()
global.dchain = require('dblurt');
global.client = new dchain.Client('https://api.blurt.world');
global.k = dchain.PrivateKey.fromString(process.env.K);
global.vk = dchain.PrivateKey.fromString(process.env.VK);
global.dollar = 'hbd';
global.vest = 'blurt';
