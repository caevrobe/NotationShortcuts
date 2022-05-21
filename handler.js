let cases = {
   'ALT-ARROWLEFT': document.querySelector('button[data-code="12"]'),
   'ALT-ARROWRIGHT': document.querySelector('button[data-code="13"]'),
};

let pressed = new Set();
let currentChord = new Set();

kt = new KeyTracker();


document.addEventListener('keydown', (e) => {
   kt.keyDown(e);
});

// handles custom editor keyboard shortcuts
document.addEventListener('keyup', (e) => {
   kt.keyUp(e);

   if (kt.done) {
      let key = [...kt.keys].join('-');

      cases[key]?.click();
   }
});

// keeps track of currently hovered object and previous inline style
let highlighted = {
   obj: null,
   prevStyle: null,
};


chrome.storage.local.get('hotkeys', function(result) {
   console.log('Value currently is ', result);
});

chrome.runtime.onMessage.addListener(
   function(request, sender) {
      //console.log(sender.tab);
      if (request.route == 'addShortcut') {
         document.addEventListener('mousemove', highlightButtons);
         document.addEventListener('click', disableClick, true);
         document.callback = (btn) => {
            console.log("yourbtn", btn);

            document.removeEventListener('click', disableClick, true);
            document.removeEventListener('mousemove', highlightButtons);

            removeHighlight();

            // check if it exists bro
            let code = btn.getAttribute('data-code');

            // todo add callback
            chrome.runtime.sendMessage({selector: `button[data-code="${code}"]`})
         };
         return true;
      }
   }
);


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