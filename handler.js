let hotkeys = {
   'ALT-ARROWLEFT': document.querySelector('button[data-code="12"]'),
   'ALT-ARROWRIGHT': document.querySelector('button[data-code="13"]'),
};

chrome.runtime.sendMessage({
   route: 'b:get_hotkeys'
}, (hk) => {
   for (const [k, v] of Object.entries(hk)) {
      console.log(k, v);
      hotkeys[v] = document.querySelector(k);
   }
   console.log(hk);
   console.log(hotkeys);
});


/* Key tracking + handling **************************************/

kt = new KeyTracker();

document.addEventListener('keydown', (e) => kt.keyDown(e));

// handles custom editor keyboard shortcuts when all keys released
document.addEventListener('keyup', (e) => {
   kt.keyUp(e);

   if (kt.done) {
      let keys = [...kt.keys].join('-');

      hotkeys[keys]?.click();
   }
});



/* Message routing **********************************************/

let routes = {
   'c:add_hotkey': addHotkey,
}

chrome.runtime.onMessage.addListener((request, sender) => {
   routes[request.route]?.(request);
   return true; 
});

function addHotkey() {
   document.addEventListener('click', disableClick, true);
   document.addEventListener('mousemove', highlightButtons);
   
   document.callback = (btn) => {
      document.removeEventListener('click', disableClick, true);
      document.removeEventListener('mousemove', highlightButtons);

      removeHighlight();

      let code = btn.getAttribute('data-code');

      chrome.runtime.sendMessage({
         route: 'b:set_hotkey',
         data: {
            selector: `button[data-code="${code}"]`
         }
      });
   }
}



/* UI interaction for adding hotkeys ****************************/

// keeps track of currently hovered object and previous inline style
let highlighted = {
   obj: null,
   prevStyle: null,
}

function disableClick(e) {
   e.stopPropagation();
   e.preventDefault();

   let btn = e.target.closest('button')
   if (btn)
      e.currentTarget.callback(btn);
}


// highlights hovered buttons
function highlightButtons(e) {
   let btn = e.target.closest('button');

   // if highlighted button is not currently hovered, reset its style 
  
   removeHighlight(btn);
   // if hovering a new button, style it
   if (btn && btn != highlighted.obj) {
      highlighted.obj = btn;
      highlighted.prevStyle = highlighted.obj.getAttribute('style');
      highlighted.obj.style.setProperty('box-shadow', '0 0 0 5px red', 'important');
   }
}

function removeHighlight(btn) {
   if (highlighted.obj && btn != highlighted.obj) {
      if (highlighted.prevStyle)
         highlighted.obj.style = highlighted.prevStyle;
      else
         highlighted.obj.removeAttribute('style');

      highlighted.obj = null;
      highlighted.prevStyle = null;
   }
}