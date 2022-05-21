// keeps track of which hotkeys currently pressed
let kt = new KeyTracker();

function keyDown(e) {
   this.setVal 

   let upper = e.key.toUpperCase();
   let assign = (val, operator) => {
      if (this.nodeName === 'INPUT')
         this.value = operator(this.value, val);
      else if (this.nodeName === 'TD') {
         let newval = operator(this.innerText, val);

         let range = document.createRange();
         this.innerText = newval;

         var sel = window.getSelection();

         sel.removeAllRanges();
         sel.addRange(range);
         range.setStart(this.firstChild, newval.length);
         range.collapse(true);
      }
      else
         console.log("???????????????????? HELLO")
   }

   let get = () => {
      if (this.nodeName === 'INPUT')
         return this.value;
      else if (this.nodeName === 'TD')
         return this.innerText
      else
         console.log("???????????????????? HELLO2")
   }

   if (upper === 'BACKSPACE') {
      let thisval = get();

      if (this.selectionEnd - this.selectionStart === this.value.length) {
         assign('', (a, b) => b);
         //this.value = '';
      } else {
         let last = thisval.lastIndexOf(' ', thisval.lastIndexOf(' ') - 1);
         assign(thisval.substring(0, last), (a, b) => b);
      }
   } else if (upper === 'A' && e.ctrlKey) {
      this.select();
   } else {
      if (!kt.keys.has(upper)) {
         if (kt.done)
            assign(upper, (a, b) => b);
            //this.value = upper;
         else
            assign(upper, (a, b) => a += ` + ${b}`);
            //this.value += ` + ${upper}`;

         kt.keyDown(e);
      }
   }
   e.preventDefault();
}


function keyUp(e) {
   kt.keyUp(e);

   if (kt.done)
      console.log('done', kt.keys);
}


let keyEntry = document.querySelectorAll('.keyEntry');

keyEntry.forEach((elem) => elem.addEventListener('keydown', keyDown));

// handles custom editor keyboard shortcuts
keyEntry.forEach((elem) => elem.addEventListener('keyup', keyUp));



chrome.storage.local.get({ hotkeys: {} }, (result) => {
   let hotkeys = result.hotkeys;

   console.log('dide', hotkeys);

   for (const [k, v] of Object.entries(hotkeys)) {
      console.log('swag', k, v);
      let row = document.getElementById('mappings').insertRow();
      let s_cell = row.insertCell(0);
      let m_cell = row.insertCell(1);

      s_cell.innerText = k;

      m_cell.setAttribute('contenteditable', 'true');
      m_cell.innerText = v;
      m_cell.addEventListener('keydown', keyDown);
      m_cell.addEventListener('keyup', keyUp);
   }
});



// send message to content_script (handler.js)
document.getElementById('submit').addEventListener('click', () => {
   console.log('waiting');
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { route: 'addShortcut' });
   });
});
