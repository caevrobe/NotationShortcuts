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
         if (newval.length === 0)
            return;

         var sel = window.getSelection();

         sel.removeAllRanges();
         sel.addRange(range);
         console.log('newval', newval)
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

   if (upper === 'BACKSPACE')
      assign('', (a, b) => b);
   else if (upper === 'A' && e.ctrlKey)
      this.select();
   else {
      kt.keyDown(e);
      assign(null, () => [...kt.keys].join('-'));
   }
   e.preventDefault();
}


document.getElementById('mappings').addEventListener('mousemove', (e) => {
   //console.log(e.target.closest('td'));
});

function keyUp(e) {
   kt.keyUp(e);

   console.log(e);

   if (kt.done)
      chrome.runtime.sendMessage({
         route: 'b:set_hotkey',
         data: {
            selector: e.target.id, 
            keys: e.target.innerText
         }
      });
      //console.log('done', kt.keys);
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
      s_cell.classList.add('sel');

      m_cell.setAttribute('contenteditable', 'true');
      m_cell.id = k;
      m_cell.innerText = v;
      m_cell.addEventListener('keydown', keyDown);
      m_cell.addEventListener('keyup', keyUp);
      m_cell.setAttribute('spellcheck', false);

      m_cell.addEventListener('focusout', (e) => {
         chrome.runtime.sendMessage({selector: k, keys: m_cell.innerText});
      });
   }
});



// send message to content_script (handler.js)
document.getElementById('submit').addEventListener('click', () => {
   console.log('waiting');
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { route: 'c:add_hotkey' });
   });
});
