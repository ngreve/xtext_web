/*
 * FILE: <vue_project>/public/Events.js
 * Stolen from Alex Taujenis: https://gist.github.com/alextaujenis/0dc81cf4d56513657f685a22bf74893d
 * MIT license
 */

class Events {
  constructor () {
    this._callbacks = {}
  }

  on (key, callback) {
    // create an empty array for the event key
    if (this._callbacks[key] === undefined) { this._callbacks[key] = [] }
    // save the callback in the array for the event key
    this._callbacks[key].push(callback)
  }

  emit (key, ...params) {
    // if the key exists
    if (this._callbacks[key] !== undefined) {
      // iterate through the callbacks for the event key
      for (let i=0; i<this._callbacks[key].length; i++) {
        // trigger the callbacks with all provided params
        this._callbacks[key][i](...params)
      }
    }
  }
}
