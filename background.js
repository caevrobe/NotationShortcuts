var hotkeys = {};

const routes = {
   'b:get_hotkeys': getHotkeys,
   'b:set_hotkey': setHotkey,
}

chrome.runtime.onMessage.addListener(
   function(request, sender, callback) {
      let route = request.route;

      console.log(request);

      routes[route]?.(request.data, sender, callback);
   }
);

function getHotkeys(data, sender, callback) {
   callback(hotkeys);
}

function setHotkey(data) {
   chrome.storage.local.get({hotkeys: {}}, (result) => {
      let saved = result.hotkeys;

      saved[data.selector] = data.keys || null;
      chrome.storage.local.set({hotkeys: saved});
      hotkeys = hotkeys;
   });
}


function loadHotkeys() {
   chrome.storage.local.get({hotkeys: {}}, (result) => {
      hotkeys = result.hotkeys;
   });
}

loadHotkeys();




function saveSelector(sel, kcode) {
   chrome.storage.local.get({hotkeys: {}}, (result) => {
      let hotkeys = result.hotkeys;

      hotkeys[sel] = kcode;
      console.log(hotkeys);
      chrome.storage.local.set({hotkeys: hotkeys}, (idk) => {
         console.log(idk);
         console.log('Value is set to ',hotkeys);
      });
   });
}







// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
   // Replace all rules ...
   chrome.declarativeContent.onPageChanged.removeRules(undefined,
      function() {
         // With a new rule ...
         chrome.declarativeContent.onPageChanged.addRules([{
            // That fires when a page's URL contains ...
            conditions: [
               new chrome.declarativeContent.PageStateMatcher({
                  pageUrl: {
                     hostSuffix: "soundslice.com",
                     pathContains: "/edit"
                  },
               })
            ],
            // And shows the extension's page action.
            actions: [new chrome.declarativeContent.ShowPageAction()]
         }]);
      });
});