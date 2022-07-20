global.chain = require('@hivechain/hivejs');
chain.api.setOptions({ url: 'https://anyx.io/', rebranded_api:true });
require('dotenv').config()
global.dchain = require('@hiveio/dhive');
global.client = new dchain.Client('https://anyx.io/');
global.k = dchain.PrivateKey.fromString(process.env.K);
global.dollar = 'hbd';
global.vest = 'hive';
