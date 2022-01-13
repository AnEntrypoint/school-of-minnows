const express = require('express');
const app = express();
const Packr = require("msgpackr").Packr;
const packr = new Packr();
const imgbbUploader = require("imgbb-uploader");
var bodyParser = require('body-parser')
global.crypto = require("hypercore-crypto");
const fs = require('fs');
let poster = {};

let post = module.exports = (paragraphs, images, id, msg, vest)=>{
    let members = fs.readdirSync('posters-'+vest);
    for(let member of members) {
        if(!members[member]) {
            const memid = fs.readFileSync('posters-'+vest+'/'+member);
            poster[memid] = member;
        }
    }
    console.log(poster);
    let name = poster[id];
    if(!name) {
        return false;
    }
    const title = paragraphs.shift();
    const body = [];
    function findHashtags(searchText) {
        var regexp = /\B\#\w\w+\b/g
        result = searchText.match(regexp);
        if(result) return result.map(a=>a.replace('#','')).filter(a=>a.length)
        else return [];
    }
    const taglist = [];
    for(let paragraph of paragraphs) {
        for(let tag of findHashtags(paragraph)) taglist.push(tag);
        const image = images.shift();
        console.log(image);
        if(image) body.push(`![](${image})`);
        body.push(paragraph);
    }
    console.log({body, taglist})
    if(!taglist.length) throw new Error('must include at least one #hashtag');
    const json_metadata = JSON.stringify({ tags: taglist });
    const permlink = 'post' + Math.random().toString(36).substring(2);

    const op = [
        'comment',
        {
            author: name,
            body: body.join("\n\n"),
            json_metadata: json_metadata,
            parent_author: '',
            parent_permlink: taglist[0],
            permlink: permlink.toString('hex'),
            title: title,
        },
        'comment_options',
        {
            author: name,
            permlink: permlink.toString('hex'),
            max_accepted_payout: '1000000000 HBD',
            percent_hbd:	0,
            allow_votes:	true,
            allow_curation_rewards:	true,
            extensions:	[]
        }
    ];
    fs.writeFileSync('created-'+vest+'/'+permlink.toString('hex'), JSON.stringify(op));
    return true;
};


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



app.put('*', express.raw({ inflate: true, limit: '50mb', type: () => true }), async (req, res) => {
  const out = verify(req.body);
  console.log(req.body.length, out);
  const data = out.t.i;
  if(!data.images.length) {
      res.json({'message':'no images'});
      return;
  }
  for(index in data.images) {
      const image = data.images[index];
      const img = await imgbbUploader({
        apiKey: "003a324ba181ce21b645179b27113b44",
        base64string:image.split(',').pop(),
        name: new Date().getTime()
      });
      data.images[index]=img.url;
  }
  //fs.writeFileSync('poster-steem/'+new Date().getTime(), JSON.stringify(data));
  //fs.writeFileSync('poster-hive/'+new Date().getTime(), JSON.stringify(data));
  let urls = [];
  let paragraphs = data.body.split(/\n+/);

  if(data.images.length<1) {
      console.log({'message':'no images'})
      res.json({'message':'no images'});
      return;
  }
  if(!paragraphs.length) {
      console.log({'message':'no paragraphs'})
      res.json({'message':'no paragraphs'});
      return;
  }
  const output = {'message':''};
  if(!post( [...paragraphs], Object.assign({},data.images), out.k.toString('hex'), (message)=>{res.json({message})}, 'steem')) {
    console.log({'message':'steem failed'})
    output.message += 'steem failed\n'
  } 
  if(!post([...paragraphs], Object.assign({},data.images), out.k.toString('hex'), (message)=>{res.json({message})}, 'hive')) {
    console.log({'message':'hive failed'})
    output.message += 'hive failed\n'
  } 
  res.json(output)
});

app.use(express.static('public'))
app.listen(3000);
var b32 = require("hi-base32");
console.log('listening', b32.encode(require('./relay.js')().serve('schoolofminnowsbitch', '3000', false, '127.0.0.1')).replace('====','').toLowerCase());
