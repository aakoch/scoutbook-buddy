// import storage from "../utils/storage";

// storage.get('logging', function (resp) {
//   if (resp.logging) {
//     logger.log('logging enabled? ', resp.logging);
//     isProduction = true;
//   }
// });

function fakeConsole() {
  return {
    log: function () {},
    info: function () {},
    debug: function () {},
    warn: function () {},
    error: function () {}
  };
}

// const Level = {
//   'ALL': {}
// }

let isProduction = process.env.NODE_ENV === 'production';

// // TODO: check to see if the option is selected at runtime
// // TODO: add 'INFO', 'DEBUG' to log statements

// class Logger {

//   constructor(className, level) {
//     this.className = className;
//     this.level = level;
//   }

//   get log() {
//     console.log(className, level, msg);
//   }
// }

// module.exports = Logger.constructor

// module.exports = Level

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

const prompt = 'sb>';
const Level = {
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
}

class Logger {
  return {
    debug: function (...args) {
      if (this.level >= Level.DEBUG)
        console.debug(prompt, getTime(), ...args);
    },
    log: function (...args) {
      console.log(prompt, getTime(), ...args);
    },
    info: function (...args) {
      if (this.level >= Level.INFO)
        console.info(prompt, getTime(), ...args);
    },
    warn: function (...args) {
      if (this.level >= Level.WARN)
        console.warn(prompt, getTime(), ...args);
    },
    error: function (...args) {
      console.error(prompt, getTime(), ...args);
    },
    level: (level) => {
      this.level = level;
      return level;
    }
  }
}

logger.level = 'debug';

export default isProduction ? fakeConsole() : logger;