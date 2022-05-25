global.chain = require('@hivechain/hivejs');
chain.api.setOptions({ url: 'https://api.openhive.network/', rebranded_api:true });
require('dotenv').config()
global.dchain = require('@hiveio/dhive');
global.client = new dchain.Client('https://api.openhive.network/');
global.k = dchain.PrivateKey.fromString(process.env.K);
global.dollar = 'hbd';
global.vest = 'hive';
