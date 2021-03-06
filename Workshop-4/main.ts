
/**
    Exercise 1
 */

interface LazySequence<T> {
    value: T;
    next(): LazySequence<T>;
}

// Implement the function:
function initSequence<T>(transform: (value: T) => T): (initialValue: T) => LazySequence<T> {
    return function (initialValue: T) {
        return function _next(v: T): LazySequence<T> {
            return {
                value: v,
                next: () => _next(transform(v)),
            }
        }(initialValue)
    }
}


/**
 * Exercise 2
 */


function map<T>(func: (v: T)=>T, seq: LazySequence<T>): LazySequence<T> {
    return {
        value: func(seq.value),
        next: () => map(func, seq.next())
    }

    // Alternative answer that redefines the _next function:
    // function _next(val: LazySequence<T>) {
    //     const {value, next} = val;

    //     return {
    //         value: func(value),
    //         next: () => _next(next())
    //     }
    // }
    // return _next(seq);
}

function filter<T>(func: (v: T)=>boolean, seq: LazySequence<T>): LazySequence<T> {
    if (func(seq.value)){
        return {
            value: seq.value,
            next: () => filter(func, seq.next())
        };
    }
    return filter(func, seq.next());

    // Alternative answer (that redefines the next function):
    // function _next(val: LazySequence<T>):LazySequence<T> {
    //     const {value, next} = val;
    //     if (func(value)){
    //         return {
    //             value: value,
    //             next: () => _next(next())
    //         }
    //     }
    //     return _next(next());
    // }
    // return _next(seq);
}

function take<T>(amount: number, seq: LazySequence<T>) {
    if (amount < 1) {
        throw new Error("take must only take numbers greater than 1");
    }
    if (amount == 1){
        return {
            value: seq.value,
            next: undefined
        }
    }
    return {
        value: seq.value,
        next: () => take(amount - 1, seq.next())
    }
    

    // Alternative answer which again redefines _next:
    // let count = 1
    // function _next(val: LazySequence<T>) {
    //     const {value, next} = val;
    //     if (count < amount) {
    //         count ++;
    //         return {
    //             value: value,
    //             next: () => _next(next())
    //         }
    //     } else {
    //         return {
    //             value: value,
    //             next: undefined
    //         }
    //     }
        
    // }
    // return _next(seq);
}

function reduce<T,V>(func: (_:V, x: T)=>V, seq: LazySequence<T>, start:V): V {
    if (seq !== undefined) {
        return reduce(func, seq.next !== undefined ? seq.next() : undefined, func(start, seq.value));
    }
    return start;
}

/**
 * Exercise 3 - Reduce Practice
 */
function maxNumber(generator: LazySequence<number>): number {
    // ******** YOUR CODE HERE ********
    // Use __only__ reduce on the generator passed in.
    // The generator will terminate so don't use `take`.
    // return undefined;

    return reduce((a, e) => a > e ? a : e , generator, -10000);
}

function lengthOfSequence(generator: LazySequence<any>): number {
    // ******** YOUR CODE HERE ********
    // Again only use reduce.
    // return undefined;

    return reduce((a, _) => a + 1, generator, 0)
}


/**
 * Exercise 4 - Lazy Pi Approximations
 */

function exercise4Solution(seriesLength: number){
    // Your code here ...
    return reduce((acc,elem) => acc + elem ,take(seriesLength,generatePiSequence()),0);
}


function generatePiSequence(): LazySequence<number>{

    return function _next(num:number,val:number){
        return {
            value: (num % 2 == 0) ? 1/val : 1/-val ,
            next: () => _next(num+1,val+2)
        }
    }(1,1)

}

/**
 * Exercise 5 - Simple implementation of an
 * observable and observer.
 */

interface Observer<T> {
  next(e: T): void;
  complete(): void;
  unsub?: ()=>void;
}


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////// NAIVE EXAMPLE FOR DEMONSTRATION /////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// Answer the questions from the worksheet here:
// a) ...
// b) ...
// c) ...
// d) ...
// e) ...

// // This is the very simple "Observable" which subscribes
// // a data source to the Observer.
// function observableNumberStream_simple_subscribe(milliseconds: number, o: Observer<number>){
//     // Sets a timer to emit random integers every milliseconds period.
//     let handle = setInterval(() => {
//         o.next(Math.floor(Math.random()*100));
//     }, milliseconds);

//     setTimeout(() => {
//         // This function kills the interval above and
//         // calls complete on the observer.
//         clearInterval(handle);
//         o.complete();
//     }, 1000);
// }

// const loggingObserver = {
//     next: e => console.log(e),
//     complete: () => console.log("logging complete - data stream closed")
// }

// observableNumberStream_simple_subscribe(50, loggingObserver);


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//////////////////////// END NAIVE EXAMPLE ////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////


/**
 * Exercise 6 - SafeObserver
 */

class SafeObserver<T> implements Observer<T> {
  // constructor enforces that we are always subscribed to destination
  private isUnsubscribed = false;
  private destination: Observer<T>;
  
  constructor(destination: Observer<T>) {
      this.destination = destination;
      if (destination.unsub) {
          this.unsub = destination.unsub;
      }
  }

  next(value: T) {
  }

  complete() {
  }

  unsubscribe(): void {
  }

  unsub?: ()=>void;
}



/**
 * Exercise 7 - map, filter and forEach on
 * an Observable.
 * Exercise 8 - interval method.
 */
class Observable<T>{
  constructor(private _subscribe: (_:Observer<T>)=>()=>void) {}

  // subscribes an observer to this observable and returns the unsubscribe function
  subscribe(next:(_:T)=>void, complete?: ()=>void): ()=>void {
    const safeObserver = new SafeObserver(<Observer<T>>{
        next: next,
        complete: complete ? complete : ()=>console.log('complete')
      });
    safeObserver.unsub = this._subscribe(safeObserver);
    return safeObserver.unsubscribe.bind(safeObserver);
  }

  static fromArray<V>(arr: V[]):Observable<V> {
      return new Observable<V>((observer: Observer<V>) => {
        arr.forEach(el => observer.next(el));
        return () => {};
      });
  }
  static interval(milliseconds: number): Observable<number> {
      // Your code here (Exercise 8) ...
      return undefined;
  }

  // create a new observable that observes this observable and applies the project function on next
  map<R>(project: (_:T)=>R): Observable<R> {
      // Your code here ...
      return undefined;
  }

  forEach(f: (_:T)=>void): Observable<T> {
      // Your code here ...
      return undefined;
  }

  // create a new observable that observes this observable but only conditionally notifies next
  filter(condition: (_:T)=>boolean): Observable<T> {
      // Your code here ...
      return undefined;
  }

  // http://reactivex.io/documentation/operators/scan.html
  scan<V>(initialVal:V, f: (a:V, el:T) => V): Observable<V> {
    return new Observable<V>((observer: Observer<V>) => {
        let accumulator = initialVal;
        return this.subscribe(
            v => {
                accumulator = f(accumulator, v);
                observer.next(accumulator);
            },
            () => observer.complete()
        )
    });
  }
}


Observable.fromArray([1,2,3,5,12,3,1])
    .subscribe(e => console.log(e));


/**
  ___  _   _    __    __    __    ____  _  _  ___  ____ 
 / __)( )_( )  /__\  (  )  (  )  ( ___)( \( )/ __)( ___)
( (__  ) _ (  /(__)\  )(__  )(__  )__)  )  (( (_-. )__) 
 \___)(_) (_)(__)(__)(____)(____)(____)(_)\_)\___/(____)
 
 *
 * Open challenge.html in the browser.
 * Fix createDot, and add it to the Observable
 * chain so that dots are drawn onto the canvas.
 * Make the dots within the circle a different colour
 * to the dots outside the circle.
 */


(function challenge() {
    try {
        document;
    } catch (e) {
        console.log("Not in browser - run challenge in challenge.html");
        return;
    }
    if (document.getElementById("value_piApproximation") === null) {
        console.log("Not on the challenge.html page")
        return;
    }

    const pseudoRandomNum = seed => (prime1, prime2) => v => ((((prime1 * v) + seed) % prime2) - (prime2 / 2)) / (prime2 / 2);
    const randomNum1 = pseudoRandomNum(1)(1262099, 77237);
    const randomNum2 = pseudoRandomNum(1)(1246499, 77237);
    const inCircle = ([x, y]: [number, number]) => (x * x) + (y * y) <= 1;

    function createDot(x, y, color) {
        const canvas = document.getElementById("canvas");
        const dot = document.createElementNS(canvas.namespaceURI, "circle");
        // Set circle properties
        dot.setAttribute("cx", "30");   // Hardcoded x point
        dot.setAttribute("cy", "50");   // Hardcoded y point
        dot.setAttribute("r", "10");
        dot.setAttribute("fill", "red");// All points red

        // Add the dot to the canvas
        canvas.appendChild(dot);
    }

    Observable.interval(100)
        .map(v => Math.floor(v/100))                // Turn the timer into a stream of incrementing integers.
        .map(v => [randomNum1(v), randomNum2(v)] as [number, number])   // Create two random numbers, the x and y coordinates
        .map(inCircle)                              // Check if the point is inside the circle
        .scan([0, 0], ([i, t], e) => e ? [i+1, t+1] : [i, t+1]) // Tally up points within circle against total points
        .map(([inside, total]) => inside / total)   // points inside / total points
        .map(e => e * 4)                            // multiply by 4 to get to pi
        .subscribe(e => {
            // Update the value of pi on the html page.
            document.getElementById("value_piApproximation").textContent = e.toString();
        });
})();