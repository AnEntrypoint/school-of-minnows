const express = require("express");
const app = express();
const Packr = require("msgpackr").Packr;
const packr = new Packr();
const imgbbUploader = require("imgbb-uploader");
var bodyParser = require("body-parser");
global.crypto = require("hypercore-crypto");
const fs = require("fs");
let poster = {};

let post = (module.exports = (title, paragraphs, images, id, msg, vest) => {
  console.log({title, paragraphs, images, id, msg, vest});
  let members = fs.readdirSync("data/posters-" + vest);
  for (let member of members) {
    if (!members[member]) {
      const memid = fs.readFileSync("data/posters-" + vest + "/" + member);
      poster[memid] = member;
    }
  }
  let name = poster[id];
  if(!images.length)
  if (!name) {
    return false;
  }
  const body = [];
  function findHashtags(searchText) {
    var regexp = /\B\#\w\w+\b/g;
    result = searchText.match(regexp);
    if (result)
      return result.map((a) => a.replace("#", "")).filter((a) => a.length);
    else return [];
  }
  let taglist = [];
  let index = 0;
  for (let paragraph of paragraphs) {
    for (let tag of findHashtags(paragraph)) taglist.push(tag);
    if(images[index]) body.push(`![](${images[index]})`);
    body.push(paragraph);
    index++;
  }
  if (!taglist.length)
    taglist = ["schoolofminnows", "hive", "blog", "curation"];
  const json_metadata = JSON.stringify({ tags: taglist });
  const permlink = "post" + Math.random().toString(36).substring(2);

  const op = [
    "comment",
    {
      author: name,
      body: body.join("\n\n"),
      json_metadata: json_metadata,
      parent_author: "",
      parent_permlink: taglist[0],
      permlink: permlink.toString("hex"),
      title,
    }
  ];
  console.log(op);
  fs.writeFileSync('data/created-'+vest+'/'+permlink.toString('hex'), JSON.stringify(op));
  return true;
});

const verify = (message) => {
  console.log({ message });
  const input = packr.unpack(message);
  const verified = crypto.verify(
    input["transaction"[0]],
    input["signature"[0]],
    input["key"[0]]
  );

  if (!verified) throw new Error("could not verify transaction");
  input["transaction"[0]] = packr.unpack(input["transaction"[0]]);
  return input;
};

app.post(
  "*",
  express.raw({ inflate: true, limit: "50mb", type: () => true }),
  async (req, res) => {
    let output = { message: "done" };
    try {
      const out = verify(req.body);
      const data = out.t.i;
      console.log({data});
      if (!data.images.length) {
        throw new Error("no images");
      }
      for (index in data.images) {
        const image = data.images[index];
        const img = await imgbbUploader({
          apiKey: "003a324ba181ce21b645179b27113b44",
          base64string: image.split(",").pop(),
          name: new Date().getTime(),
        });
        data.images[index] = img.url;
      }
      let title = data.title;
      let paragraphs = data.body.split(/\n+/);

      if (!paragraphs.length) {
        output = { message: "no paragraphs" };
      }
      console.log('queueing steem')
      if (
        !post(
          title,
          [...paragraphs],
          Object.assign({}, data.images),
          out.k.toString("hex"),
          (message) => {
            res.json({ message });
          },
          "steem"
        )
      ) {
        output = { message: "steem failed" };
      }
      console.log('queueing hive')
      if (
        !post(
          title,
          [...paragraphs],
          Object.assign({}, data.images),
          out.k.toString("hex"),
          (message) => {
            res.json({ message });
          },
          "hive"
        )
      ) {
        output = { message: "hive failed" };
      }
    } catch (e) {
      console.trace(e)
      output = { error: e.message };
    }

    console.log({ output });
    res.json(output);
    res.end();
  }
);

app.use(express.static("public"));
app.listen(8082);
console.log('listening on 8082')