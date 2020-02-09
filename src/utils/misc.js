function findHandlers(namespaceValue) {
  var events = $._data(document, "events"),
      buddyHandlers = 0;
  for (const handlerId in events) {
      if (events.hasOwnProperty(handlerId)) {
          var handler = events[handlerId];
          for (const name in handler) {
              if (handler.hasOwnProperty(name)) {
                  if (typeof handler[name] == 'object') {
                      var specificHandler = handler[name];
                      for (const attr in specificHandler) {
                          if (specificHandler.hasOwnProperty(attr)) {
                              const attrValue = specificHandler[attr];
                              if (attr == 'namespace' && attrValue == namespaceValue) {
                                  buddyHandlers++;
                              }
                          }
                      }
                  }
              }
          }
      }
  }
  return buddyHandlers;
}
// usage
//console.log('Buddy handlers = ' + findHandlers('buddy'));

export {findHandlers}