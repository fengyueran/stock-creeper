const axios = require('axios');
const { makeEmailAndSend } = require('./email');
const INTERESTED_STOCKS = require('./interested-stocks-config.json');

const BASE_URL = 'https://api.gucheng.com/lg/zg/base.php';

const getStocks = async (stockBaseInfos) => {
  const jobs = stockBaseInfos.map(({ code }) =>
    axios.get(BASE_URL, {
      params: {
        code,
      },
    }),
  );
  const res = await Promise.all(jobs);
  return res;
};

const checkStocksPrice = (stockInfos, interestedStocks) => {
  const keyStocks = [];
  stockInfos.forEach(({ data }, index) => {
    const { stockInfo } = data.data;
    const currentPrice = stockInfo.now;
    const { targetPrice } = interestedStocks[index];
    if (currentPrice <= targetPrice) {
      keyStocks.push(data.data);
    }
  });
  return keyStocks;
};

const logStockInfo = (stockInfos) => {
  stockInfos.forEach(({ data }) => {
    console.log('stockInfos', data);
  });
};

const run = async () => {
  const stockInfos = await getStocks(INTERESTED_STOCKS);
  logStockInfo(stockInfos);
  const keyStocks = checkStocksPrice(stockInfos, INTERESTED_STOCKS);
  if (keyStocks.length) {
    makeEmailAndSend(keyStocks);
  }
};

setInterval(() => {
  run();
}, 1000 * 60);
