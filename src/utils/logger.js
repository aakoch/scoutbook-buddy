// import storage from "../utils/storage";

// storage.get('logging', function (resp) {
//   if (resp.logging) {
//     logger.log('logging enabled? ', resp.logging);
//     isProduction = true;
//   }
// });

function fakeConsole() {
    return {
        log: function() {},
        info: function() {},
        debug: function() {}
    };
}

let isProduction = process.env.NODE_ENV === 'production';

// TODO: check to see if the option is selected at runtime
// TODO: add 'INFO', 'DEBUG' to log statements

export default isProduction ? fakeConsole() : console;