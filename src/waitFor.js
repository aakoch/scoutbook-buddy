
      // Doesn't handle indexes "[]"
      // function waitFor(str, context, startTime) {
      //   console.log("passed in str = ", str);
      //   console.log("passed in context = ", context);
      //   return new Promise((resolve, reject) => {
      //     if (Date.now() - startTime > 2000) {
      //       reject({err: 'nothing in 2 seconds'});
      //     }
      //     else if (str.indexOf(".") == -1) {

      //       if (str.length == 0) {
      //         resolve({
      //           str: 'empty string on line 28'
      //         })
      //       } else if (!!context[str]) {
      //         resolve({
      //           str: 'object is defined: ' + str
      //         });

      //       } else {
      //         console.log("!!context['" + first + "'] = false line 32");
      //         setTimeout(function () {
      //           console.log('line 38 first', first);
      //           console.log('line 39 context', context);
      //           waitFor(first, context, startTime).then(resolve).catch(reject);
      //         }, 100);
      //       }
      //     } else {
      //       var first = str.substr(0, str.indexOf("."));

      //       console.log("first element=", first);

      //       if (first == "window") {
      //         console.log("first element was a window=", first);
      //         console.log('line 50 first', first);
      //         console.log('line 51 context', context);
      //         waitFor(str.substr(str.indexOf(".") + 1), window, startTime)
      //           .then(resolve)
      //           .catch(reject);
      //       } else if (first == "") {
      //         resolve({
      //           str: str
      //         });
      //       } else if (!!context[first]) {
      //         console.log("!!context['" + first + "'] = true");
      //         console.log('line 61 first', first);
      //         console.log('line 62 context', context);
      //         return waitFor(str.substr(str.indexOf(".") + 1), context[first], startTime);
      //       } else {
      //         console.log("!!context['" + first + "'] = false line 65");
      //         console.log('context', context);
      //         setTimeout(function () {
      //           console.log('str', str);
      //           console.log('context', context);
      //           waitFor(str, context, startTime).then(resolve).catch(reject);
      //         }, 100);
      //       }
      //     }
      //   });
      // }