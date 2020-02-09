1. using the matches block in the manifest won't load a page in a SPA unless the page is re/loaded
 ```
 "matches": [
        "http://*.scoutbook.com/mobile/dashboard/messages/default.asp*",
        "https://*.scoutbook.com/mobile/dashboard/messages/default.asp*"
      ],...
```

2. Reloading the messages page (https://www.scoutbook.com/mobile/dashboard/messages/default.asp) there are 2 pageshow events triggered. But navigating to it, there is only one. I'm not sure what is causing this. It doesn't seem to be SBFA. There is also a pageshow event triggered when switching between the 2 units.