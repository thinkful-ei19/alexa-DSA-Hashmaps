'use strict';

class HashMap {
  constructor(initialCapacity=8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i=0; i<string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      throw new Error('Key Error');
    }
    return this._slots[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);

    if (this._slots[index] === undefined) {
      this._slots[index] = {
        key,
        value,
        deleted: false
      };
      this.length++; // only increment when key is unique
    } else if (this._slots[index].key === key) {
      this._slots[index] = {
        key,
        value,
        deleted: false
      };
    }
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }
    slot.deleted = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;

    for (let i=start; i<start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._slots[index];
      if (slot === undefined || (slot.key == key && !slot.deleted)) {
        return index;
      }
    }
  }

  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._slots = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.deleted) {
        this.set(slot.key, slot.value);
      }
    }
  }

}

HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

const lor = new HashMap();

function main() {
  lor.set('Hobbit', 'Bilbo');
  lor.set('Hobbit', 'Frodo'); // => replaces Bilbo
  lor.set('Wizard', 'Gandolf');
  lor.set('Human', 'Aragon');
  lor.set('Elf', 'Legolas');
  lor.set('Maiar', 'The Necromancer');
  lor.set('Maiar', 'Sauron'); // => replaces The Necromancer
  lor.set('RingBearer', 'Gollum');
  lor.set('LadyOfLight', 'Galadriel');
  lor.set('HalfElven', 'Arwen');
  lor.set('Ent', 'Treebeard');
  // length should be 9 not 11

  console.log(lor.get('Wizard'));
  //   console.log(lor.get('Maiar'));

  //   console.log(lor.get('Hobbit'));


  console.log(JSON.stringify(lor, null, 2));
}

main();

// create a helper function - check if it contains key
// containKey(map, key)
// for loop - slots length
// use get method - if key returns twice, then

// palindrome -> if every char in string going to have an even number except for one will be odd
// identify even and odd char
// hash map helps because it would lower the complexity
// split string into letters
// calc odd or even 
// key -> each letter
// value -> how many times you've seen it 

// "racecar"
// r- 2, a- 2, c- 2, e- 1
// anything else - only one char could have just one occur

//racecars - not a palindrome
