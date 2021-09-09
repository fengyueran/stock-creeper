const axios = require('axios');
const INTERESTED_STOCKS = require('./config.json');

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

const run = async () => {
  const stockInfos = await getStocks(INTERESTED_STOCKS);
  const keyStocks = checkStocksPrice(stockInfos, INTERESTED_STOCKS);
  console.log('keyStocks', keyStocks);
};

run();
