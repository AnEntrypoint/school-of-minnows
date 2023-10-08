pm2 start meme-hive.js meme-steem.js voter-hive.js voter-steem.js stream-hive.js stream-steem.js poster.js reblog-steem.js reblog-hive.js
#pm2 start ./socksify -- "node stream-hive.js" 127.0.0.1 9050
#cd schoolofminnows-blog
#http-server -p 3000 &
cd ..
