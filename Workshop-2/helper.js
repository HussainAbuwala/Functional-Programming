/**
 * insertInArray takes an array and inserts
 * the item into position i.
 * @param {Array} arr - array to insert item into 
 * @param {Number} i - index which item will inhabit
 * @param {any} item  - item to insert (can be anything)
 */
function insertInArray(arr, i, item) {
    // Return new array with item in position i.
    // `...` is the JavaScript spread syntax
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator
    return [...arr.slice(0, i), item, ...arr.slice(i)]
}



// Exercise 6 and beyond.

// Get the signal from a wire
function getSignal(wire) {
    return wire.signalValue;
}

/**
 * Places a probe on a wire.
 * Whenever the signal is changed,
 * logs new signal to the console.
 * Example usage:
 * ```
 * let w = new Wire();
 * probe("wire 1", w);
 * ```
 * @param {String} name - name of your wire
 * @param {Wire} wire - the wire to inspect
 */
function probe(name, wire) {
    wire.addAction(() => {
        console.log("PROBE:", name);
        console.log(`Value: ${getSignal(wire)}`);
    });
}