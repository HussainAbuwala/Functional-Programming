/**
 * Exercise 1: 
 * in tsconfig.json set: 
        "noImplicitAny": true,
 * and add types to the following until there are no more typescript compile errors
 */

let someNum:number = 10;
let aString:string = "Hello!!!!!!! :)";

function addStuff(a: number, b: number):number {
    return a + b;
}
function numberToString(input:string):string {
    return JSON.stringify(input);
}
// Use the any type and void type.
function myLog(anything: any):void {
    console.log("log: " + anything);
}

/**
 * Exercise 2: implement the map function for the cons list below
 */

type Selector<T> = (head:T, rest?:Cons<T>)=> T|Cons<T>;
type Cons<T> = (selector: Selector<T>) => T|Cons<T>;

function cons<T>(head:T, rest?: Cons<T>): Cons<T> {
    return (selector: Selector<T>) => selector(head, rest);
}

function head<T>(list:Cons<T>):T {
    return <T>list((head, rest?) => head);
}

function rest<T>(list:Cons<T>):Cons<T> {
    return <Cons<T>>list((head, rest?) => rest);
}

function forEach<T>(f: (_:T)=>void, l: Cons<T>):void {
     if (l) {
         f(head(l));
         forEach(f, rest(l));
     }
}

function map<T,V>(f: (_:T)=>V, l: Cons<T>): Cons<V> {
    return !l ? null : cons(f(head(l)), map(f, rest(l)));
}


/**
 * Exercise 3: Implement the following functions over cons lists
 */

function fromArray<T>(arr: T[]): Cons<T> {
    return arr.length === 0 ? null : cons(arr[0], fromArray(arr.slice(1)));
}

function filter<T>(f: (t:T)=>boolean, list: Cons<T>): Cons<T> {
    if (!list) return null;
    const t = head(list);
    const l = filter(f, rest(list));
    return f(t) ? cons(t, l) : l; 
}

function reduce<T,V>(f: (v:V, t:T)=>V, initial:V , list: Cons<T>):V {
    return !list ? initial : reduce(f, f(initial, head(list)), rest(list));
}


/**
 * Exercise 4: complete the constructor and add methods as per the worksheet
 * the List is backed by a Cons list, so use the functions you have 
 * already implemented above to do the actual work.
 */
class List<T> {
    // Define fields here
    private head: Cons<T>;

    constructor(list: T[] | Cons<T>) {
        if (list instanceof Array) {        
            this.head = fromArray(list);
        } else {
            this.head = list;
        }
    }

    toArray(): T[] {
        return reduce((a,t)=>(a.push(t), a), [], this.head).reverse();
    }

    // Add methods here:
    map<V>(f: (item: T) => V): List<V> {
        return new List(map(f, this.head));
    }

    forEach(f: (item: T)=>void): List<T> {
        forEach(f, this.head);
        return this;
    }

    filter(f: (t:T)=>boolean): List<T> {
        return new List(filter(f, this.head));
    }

    reduce<V>(f: (a:V,t:T)=>V, a:V) : V {
        return reduce(f, a, this.head);
    }

    static concat<T>(u:Cons<T>, v: Cons<T>): Cons<T> {
        return !u ? v : cons(head(u), List.concat(rest(u),v));
    }
    concat(b: List<T>): List<T> {
        return new List(List.concat(this.head, b.head));
    }
}

/**
 * Exercise 5:
 * define types for and implement the function line
 * and complete lineToList
 */

function line(text: string): [number, string] {
    return [0, text];
}
function lineToList(line: [number, string]): List<[number, string]> {
    return new List([line]);
}


/**
 * Exercise 6
 */

function nest (indent: number, layout: List<[number, string]>): List<[number, string]> {
    /** Your code here */
    return layout.map<[number, string]>(([num, _]) => [num + indent, _]);
}


class BinaryTree<T> {
    constructor(
        public data: T,
        public leftChild?: BinaryTree<T>,
        public rightChild?: BinaryTree<T>,
    ){}
}

function prettyPrintBinaryTree<T>(node: BinaryTree<T>): List<[number, string]> {
    return !node
        ? new List([])
        : lineToList(line(node.data.toString()))
            .concat(nest(1, prettyPrintBinaryTree(node.leftChild)
                                .concat(prettyPrintBinaryTree(node.rightChild))))
}

const myTree = new BinaryTree(
    1,
    new BinaryTree(
        2,
        new BinaryTree(3)
    ),
    new BinaryTree(4)
);

const output = prettyPrintBinaryTree(myTree)
                    .map(aLine => new Array(aLine[0] + 1).join('-') + aLine[1])
                    .reduce((a,b) => a + '\n' + b,
                        '').trim();
console.log(output);


/**
 * Exercise 7:
 *  implement prettyPrintNaryTree, which takes a NaryTree as input
 *  and returns a list of the type expected by your nest function
 */

class NaryTree<T> {
   constructor(
       public data: T,
       public children: NaryTree<T>[] = [],
   ){}
}

// Example tree for you to print:
let naryTree = new NaryTree(1,
   [
       new NaryTree(2),
       new NaryTree(3,
       [
           new NaryTree(4),
       ]),
       new NaryTree(5)
   ]
)

function prettyPrintNaryTree<T>(node: BinaryTree<T>): List<[number, string]> {
     return !node
         ? new List([])
         : lineToList(line(node.data.toString()))
             .concat(nest(1, prettyPrintNaryTree(node.leftChild)
                                 .concat(prettyPrintNaryTree(node.rightChild))))
}

//Loop through each child of parent from list
//call prettyPrintNaryTree for each child



// implement: function prettyPrintNaryTree(...)

/**
  ___  _   _    __    __    __    ____  _  _  ___  ____ 
 / __)( )_( )  /__\  (  )  (  )  ( ___)( \( )/ __)( ___)
( (__  ) _ (  /(__)\  )(__  )(__  )__)  )  (( (_-. )__) 
 \___)(_) (_)(__)(__)(____)(____)(____)(_)\_)\___/(____)

 */

const jsonPrettyToDoc: (json: object | string | boolean | number | null) => any = undefined;
