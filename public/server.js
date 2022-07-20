//riped from the live server

const express = require('express');
const app = express();
const Packr = require("msgpackr").Packr;
const packr = new Packr();
var bodyParser = require('body-parser')
global.crypto = require("hypercore-crypto");

const verify = (message) => {
      const input = packr.unpack(message);
      const verified = crypto.verify(
        input['transaction'[0]],
        input['signature'[0]],
        input['key'[0]]
      );
      if (!verified) throw new Error("could not verify transaction");
      input['transaction'[0]] = packr.unpack(input['transaction'[0]]);
      return input;
};

app.post('*', express.raw({ inflate: true, limit: '50mb', type: () => true }), async (req, res) => {
  const out = verify(req.body);
  console.log(req.body.length, out);
  const data = out.t.i;
  //generate output
  res.json(output)
});

app.use(express.static('public'))
app.listen(3000);
var b32 = require("hi-base32");
console.log('listening', b32.encode(require('./relay.js')().serve('thekey' ,'3000', false, '127.0.0.1')).replace('====','').toLowerCase());
