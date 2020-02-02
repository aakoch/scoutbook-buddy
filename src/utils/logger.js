import Logger from 'logplease';

let isProduction = process.env.NODE_ENV === 'production';

let getTime = () => {
  let date = new Date();
  let times = [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()].map((num) => {
    if (num < 10)
      return '0' + num;
    return num;
  })
  let millis = date.getUTCMilliseconds().toString().padStart(3, '0');
  return times.join(':') + '.' + millis;
}

export default isProduction ? fakeConsole() : Logger;