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
    debug: function () {}
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

export default isProduction ? fakeConsole() : console;