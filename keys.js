class KeyTracker {
   #pressed
   #combo

   constructor() {
      this.#pressed = new Set();
      this.#combo = new Set();

      // prevent keyup focus issues
      window.addEventListener('focus', () => {
         this.#pressed.clear();
         this.#combo.clear();
      });
   }

   get done() {
      return this.#pressed.size === 0;
   }

   get keys() {
      return this.#combo;
   }

   get pressed() {
      return this.#pressed.size;
   }

   keyDown(e) {
      if (this.#pressed.size === 0)
         this.#combo.clear();

      let upper = e.key.toUpperCase();

      this.#pressed.add(upper);
      this.#combo.add(upper);
   }

   keyUp(e) {
      let upper = e.key.toUpperCase();

      this.#pressed.delete(upper);
   }
}

function toString(set) {
   return Array.from(set).sort().join('-');
}