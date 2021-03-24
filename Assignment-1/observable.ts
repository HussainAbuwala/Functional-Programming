interface Observer<T> {
  next(e: T): void;
  complete(): void;
  unsub?: ()=>void;
}

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

class Observable<T> {
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

  // create an Observable from an DOM Event
  // use fromArray as inspiration
  static fromEvent<E extends Event>(el: Node, name: string): Observable<E> {
    return undefined; // implement this!
  }

  // create an Observable sequence from an Array
  static fromArray<V>(arr: V[]):Observable<V> {
      return new Observable<V>((observer: Observer<V>) => {
        arr.forEach(el => observer.next(el));
        return () => {};
      });
  }

  // The observable notifies after the specified interval
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

  // creates a child Observable that is detached when the given Observable fires
  takeUntil<V>(o: Observable<V>): Observable<T> {
    return undefined; // you code here
  }

  // when this Observable occurs, create an Observable downstream from the specified stream creator 
  // output is "flattened" into the original stream
  flatMap<Output>(streamCreator: (_: T) => Observable<Output>): Observable<Output> {
    return undefined; // your code goes here!  See the test in checklist.html
  }

  // http://reactivex.io/documentation/operators/scan.html
  scan<V>(initialVal:V, fun: (a:V, el:T) => V): Observable<V> {
    return new Observable<V>((observer: Observer<V>) => {
        let accumulator = initialVal;
        return this.subscribe(
            v => {
                accumulator = fun(accumulator, v);
                observer.next(accumulator);
            },
            () => observer.complete()
        )
    })
  }
}
