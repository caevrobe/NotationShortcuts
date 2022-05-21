/* searchBar = document.getElementById("searchBar");

let pressed = new Set();
let currentChord = new Set();


document.getElementById('submit').addEventListener('click', () => {

   chrome.storage.local.get({hotkeys: []}, (result) => {
      let hotkeys = result.hotkeys;

      hotkeys.push(searchBar.value);
      searchBar.value = '';
      
      chrome.storage.local.set({hotkeys: hotkeys}, () => {
         console.log(hotkeys);
         console.log('Value is set to ' + hotkeys);
      });
   });
});*/


let keyEntry = document.querySelectorAll('.keyEntry');

let kt = new KeyTracker();

keyEntry.forEach((elem) => elem.addEventListener('keydown', function (e) {
   let upper = e.key.toUpperCase();

   if (upper === 'Backspace') {
      if (this.selectionEnd - this.selectionStart === this.value.length) {
         this.value = '';
      } else {
         let last = this.value.lastIndexOf(' ', this.value.lastIndexOf(' ') - 1);
         this.value = this.value.substring(0, last);
      }
   } else if (upper === 'a' && e.ctrlKey) {
      this.select();
   } else {
      if (!kt.keys.has(upper)) {
         if (kt.pressed == 0)
            this.value = upper;
         else
            this.value += ` + ${upper}`;

         kt.keyDown(e);
      }
   }
   e.preventDefault();
}));

// handles custom editor keyboard shortcuts
keyEntry.forEach((elem) => elem.addEventListener('keyup', function (e) {
   kt.keyUp(e);

   if (kt.done)
      console.log(kt.keys);
}));


/* document.getElementById('submit').addEventListener('click', () => {
   chrome.storage.local.get({hotkeys: []}, (result) => {
      let hotkeys = result.hotkeys;

      hotkeys.push(searchBar.value);
      searchBar.value = '';
      
      chrome.storage.local.set({hotkeys: hotkeys}, () => {
         console.log(hotkeys);
         console.log('Value is set to ' + hotkeys);
      });
   });
}); */
