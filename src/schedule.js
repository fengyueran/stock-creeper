const { differenceInSeconds, isSaturday, isSunday } = require('date-fns');

const getTradingRange = () => {
  const date = new Date();
  const dateStr = date.toISOString();
  const ymd = dateStr.split('T')[0];
  const tradingTime = ['09:30', '15:00']; //'9:30'-'15:00'
  const startTime = new Date(`${ymd}T${tradingTime[0]}`);
  console.log(`${ymd}T${tradingTime[0]}`);
  const endTime = new Date(`${ymd}T${tradingTime[1]}`);
  return [startTime, endTime];
};

const shouldRunTask = () => {
  const now = new Date();
  if (isSaturday(now)) return false;
  if (isSunday(now)) return false;

  const range = getTradingRange();

  const isAfterStart = differenceInSeconds(now, range[0]) < 0;
  if (isAfterStart) return false;
  const isbeforeEnd = differenceInSeconds(now, range[1]) > 0;
  if (isbeforeEnd) return false;

  return true;
};

const delay = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 60 * 1000);
  });

const pollTask = async (task) => {
  if (shouldRunTask()) {
    await task();
    await delay();
    await pollTask(task);
  } else {
    console.log('Sleep now...');
  }
};

exports.pollTask = pollTask;
