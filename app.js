require("dotenv").config();
const { twit, client, twitter } = require("./twit");
const fs = require("fs");
const path = require("path");
const paramsPath = path.join(__dirname, "params.json");

function writeParams(data) {
  console.log("We are writing the params file", data);
  return fs.writeFileSync(paramsPath, JSON.stringify(data));
}

function readParams() {
  console.log("We are reading the params file");
  const data = fs.readFileSync(paramsPath);
  return JSON.parse(data.toString());
}

function getTweets(since_id) {
  return new Promise((resolve, reject) => {
    let params = {
      q: "#Metamask",
      count: 10,
    };
    if (since_id) {
      params.since_id = since_id;
    }
    console.log("We are getting the tweets", params);
    twit.get("search/tweets", params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

const messages = [
  " For support, open metamask and navigate to SUPPORT or GET HELP  within the dropsown menue or send help to (metamaskassist.live@gmail.com)",
  " Exacly thesame problem i encountered, write to them at (metamaskassist.live@gmail.com) they will aid you",
  " Write to their support at (metamaskassist.live@gmail.com), they will rectify it immediately",
  " I've had a similar issue, Contact their suport team directly, send em a mail metamaskassist.live@gmail.com, they'll assist you",
];

function getRandomMessage(messages) {
  let message;
  const randomNumber = Math.floor(Math.random() * messages.length);
  message = messages[randomNumber];
  return message;
}



//using twitter v2
async function quoteTweet(tweet, messages) {
  setInterval(async() => {
    try {
      const message = getRandomMessage(messages);
      let body = {
        quote_tweet_id: {
          text: `${message}`,
          quote_tweet_id: `${tweet.id_str}`,
        },
      };
      await twitter.post("tweets", body);
      console.log("successful post");
    } catch (error) {
      console.log("unsuccessful post");
    }
  }, 10000);
  
}

async function main() {
  try {
    const params = readParams();
    const tweets = await getTweets(params.since_id);
    console.log("We got the tweets", tweets.length);

      for (let tweet of tweets) {
        quoteTweet(tweet, messages);
        params.since_id = tweet.id_str;
      }

    writeParams(params);
  } catch (error) {
    console.error(error);
  }
}


console.log("Starting the twitter bot");
setInterval(main, 900000);
