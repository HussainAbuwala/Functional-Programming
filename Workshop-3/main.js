/**
 * Exercise 1:
 * in tsconfig.json set:
        "noImplicitAny": true,
 * and add types to the following until there are no more typescript compile errors
 */
let someNum = 10;
let aString = "Hello!!!!!!! :)";
function addStuff(a, b) {
    return a + b;
}
function numberToString(input) {
    return JSON.stringify(input);
}
// Use the any type and void type.
function myLog(anything) {
    console.log("log: " + anything);
}
function cons(head, rest) {
    return (selector) => selector(head, rest);
}
function head(list) {
    return list((head, rest) => head);
}
function rest(list) {
    return list((head, rest) => rest);
}
function forEach(f, l) {
    if (l) {
        f(head(l));
        forEach(f, rest(l));
    }
}
function map(f, l) {
    return !l ? null : cons(f(head(l)), map(f, rest(l)));
}
/**
 * Exercise 3: Implement the following functions over cons lists
 */
function fromArray(arr) {
    return arr.length === 0 ? null : cons(arr[0], fromArray(arr.slice(1)));
}
function filter(f, list) {
    if (!list)
        return null;
    const t = head(list);
    const l = filter(f, rest(list));
    return f(t) ? cons(t, l) : l;
}
function reduce(f, initial, list) {
    return !list ? initial : reduce(f, f(initial, head(list)), rest(list));
}
/**
 * Exercise 4: complete the constructor and add methods as per the worksheet
 * the List is backed by a Cons list, so use the functions you have
 * already implemented above to do the actual work.
 */
class List {
    constructor(list) {
        if (list instanceof Array) {
            this.head = fromArray(list);
        }
        else {
            this.head = list;
        }
    }
    toArray() {
        return reduce((a, t) => (a.push(t), a), [], this.head).reverse();
    }
    // Add methods here:
    map(f) {
        return new List(map(f, this.head));
    }
    forEach(f) {
        forEach(f, this.head);
        return this;
    }
    filter(f) {
        return new List(filter(f, this.head));
    }
    reduce(f, a) {
        return reduce(f, a, this.head);
    }
    static concat(u, v) {
        return !u ? v : cons(head(u), List.concat(rest(u), v));
    }
    concat(b) {
        return new List(List.concat(this.head, b.head));
    }
}
/**
 * Exercise 5:
 * define types for and implement the function line
 * and complete lineToList
 */
function line(text) {
    return [0, text];
}
function lineToList(line) {
    return new List([line]);
}
/**
 * Exercise 6
 */
function nest(indent, layout) {
    /** Your code here */
    return layout.map(([num, _]) => [num + indent, _]);
}
class BinaryTree {
    constructor(data, leftChild, rightChild) {
        this.data = data;
        this.leftChild = leftChild;
        this.rightChild = rightChild;
    }
}
function prettyPrintBinaryTree(node) {
    return !node
        ? new List([])
        : lineToList(line(node.data.toString()))
            .concat(nest(1, prettyPrintBinaryTree(node.leftChild)
            .concat(prettyPrintBinaryTree(node.rightChild))));
}
const myTree = new BinaryTree(1, new BinaryTree(2, new BinaryTree(3)), new BinaryTree(4));
const output = prettyPrintBinaryTree(myTree).toArray()
    //.map(aLine => new Array(aLine[0] + 1).join('-') + aLine[1])
    //.reduce((a, b) => a + '\n' + b, '').trim();



console.log(output);
/**
 * Exercise 7:
 *  implement prettyPrintNaryTree, which takes a NaryTree as input
 *  and returns a list of the type expected by your nest function
 */
class NaryTree {
    constructor(data, children = []) {
        this.data = data;
        this.children = children;
    }
}
// Example tree for you to print:
let naryTree = new NaryTree(1, [
    new NaryTree(2),
    new NaryTree(3, [
        new NaryTree(4),
    ]),
    new NaryTree(5)
]);
function prettyPrintNaryTree(node) {
    return !node
        ? new List([])
        : lineToList(line(node.data.toString()))
            .concat(nest(1, prettyPrintNaryTree(node.leftChild)
            .concat(prettyPrintNaryTree(node.rightChild))));
}
// implement: function prettyPrintNaryTree(...)
/**
  ___  _   _    __    __    __    ____  _  _  ___  ____
 / __)( )_( )  /__\  (  )  (  )  ( ___)( \( )/ __)( ___)
( (__  ) _ (  /(__)\  )(__  )(__  )__)  )  (( (_-. )__)
 \___)(_) (_)(__)(__)(____)(____)(____)(_)\_)\___/(____)

 */
const jsonPrettyToDoc = undefined;
//# sourceMappingURL=main.js.map