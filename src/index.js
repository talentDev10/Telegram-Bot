const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Telegraf } = require('telegraf');

require('dotenv').config();

const tgOptions = {
    channelMode: true    // Handle `channel_post` updates as messages (optional)
}

const bot = new Telegraf(process.env.TG_TOKEN, tgOptions);
// const cmcClient = url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
const cmcBaseUrl = 'https://pro-api.coinmarketcap.com';
// const query = { start, limit, convert, sort };

const cmcConfig = {
  method: 'GET',
  headers: {
    'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
    Accept: 'application/json',
    'Accept-Charset' : 'utf-8',
    'Accept-Encoding': 'deflate, gzip'
  }
};

const createRequest = (args = {}) => {
  const { url, config, query } = args

  return fetch(`${url}${query ? `?${query}` : ''}`, config).then(res =>
    res.json()
  )
}

console.log(createRequest({
 
  url: `${cmcBaseUrl}/cryptocurrency/listings/latest`,
  config: cmcConfig,
  query: { symbol : 'AXL'}
}), "cmc data");


// cmcClient.getTickers().then(console.log).catch(console.error);
//cmcClient.getGlobal().then(console.log).catch(console.error);

let url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest", 
  qString = "?CMC_PRO_API_KEY=" + process.env.CMC_API_KEY + "&sort=market_cap&start=1&limit=10&cryptocurrency_type=tokens&convert=USD";


// defining the Express app
const app = express();

const rubyReturn = [
  {title: 'Successfully sent notification to Telegram group about ruby'}
];

const diamondReturn = [
    {title: 'Successfully sent notification to Telegram group about diamond'}
];

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/ruby', (req, res) => {
  const { token } = req.query;
  const tg_msg = `"${token}" listed in Ruby Tier in CoinLocator, you can visit here: https://coinlocator.com`;
  bot.telegram.sendMessage(process.env.TG_RUBY_CHANNEL, tg_msg);
  res.send(rubyReturn);
});

app.get('/diamond', (req, res) => {
    const { token } = req.query;
    const tg_msg = `"${token}" listed in Diamond Tier in CoinLocator, you can visit here: https://coinlocator.com`;
    bot.telegram.sendMessage(process.env.TG_DIAMOND_CHANNEL, tg_msg);
    res.send(diamondReturn);
  });
  
// starting the server
app.listen(process.env.PORT || 3001, () => {
  console.log('listening on port 3001');
});;
