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
      console.log(kt.keys);
      cases[[...kt.keys].join('-')].click();
   }
});

/* document.addEventListener('click', (e) => {
   //console.log(e.target.closest('button'));
   e.stopPropagation();
   e.preventDefault();
}, true); */


// keeps track of currently hovered object and previous inline style
let highlighted = {
   obj: null,
   prevStyle: null,
};

chrome.storage.local.get('hotkeys', function(result) {
   console.log('Value currently is ', result);
});

// highlights hovered buttons
document.addEventListener('mousemove', (e) => {
   let btn = e.target.closest('button');

   // if highlighted button is not currently hovered, reset its style 
   if (highlighted.obj && btn != highlighted.obj) {
      if (highlighted.prevStyle)
         highlighted.obj.style = highlighted.prevStyle;
      else
         highlighted.obj.removeAttribute('style');

      highlighted.obj = null;
      highlighted.prevStyle = null;
   }

   // if hovering a new button, style it
   if (btn && btn != highlighted.obj) {
      highlighted.obj = btn;
      highlighted.prevStyle = highlighted.obj.getAttribute('style');
      highlighted.obj.style.setProperty('box-shadow', '0 0 0 5px red', 'important');
   }
});