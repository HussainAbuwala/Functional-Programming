
/**
    Exercise 1
 */

const myObj = {
    aProperty: "rar",
    anotherProperty: 1
};

//Please create a function operationOnTwoNumbers that takes a function as its argument
// and returns a function that must be called twice (like the add function above) before returning an answer.

/**
    Exercise 2
 */

// Assigning functions to variable names:
//     const operationOnTwoNumbers = function (someFunction) { ... };
//     const operationOnTwoNumbers = someFunction => { ... };

//operationOnTwoNumbers :: (->(x->y->x+y))
const operationOnTwoNumbers = f => x => y => f(x,y);
const add = operationOnTwoNumbers((x,y) => x + y)
const addNine = add(9)
console.log(addNine(3))

/**
    Exercise 3
 */

const callEach = array => array.forEach(f => f());

/**
    Exercise 4
 */

/**
 * Constructor for the UniversalClock
 * this.schedule contains a list of pairs. [time, function]
 * this.simulationTime is the current time of the simulation.
 */
function UniversalClock() {
    this.schedule = []; // This should be a queue sort of structure.
    this.simulationTime = 0;
};

UniversalClock.prototype.isEmpty = function() {
    return this.schedule.length === 0;
};

// Use helper method insertInArray(arr, index, item)
UniversalClock.prototype.addToSchedule = undefined;


/**
    Exercise 5
 */

/**
 * Runs UniversalClock until it is empty.
 */
function runSimulation(clock) {
   if (clock.isEmpty()) {
       return;
   }
   clock.getFirstItem()();
   return runSimulation(clock);
}

/**
    Exercise 6
 */

/**
 * Constructor function for the Wire.
 */
function Wire() {
    this.signalValue = 0;
    this.actions = [];
}

/** 
    Exercise 7
 */

function addAfterDelay(clock) {
   return (delay, action) => clock.addToSchedule(delay, action);
}

const logicalNot = signal => {
    if (!(signal === 0 || signal === 1)) {
        throw new Error("Invalid Signal:", signal)
    }
    return signal === 0 ? 1 : 0;
}
const notFactory = (delay, afterDelayFn) => (input, output) => {
   const notAction = () => {
       afterDelayFn(delay, () => output.setSignal(logicalNot(getSignal(input))))
   }
   input.addAction(notAction);
}

const andFactory = (delay, afterDelay) => (in1, in2, output) => {
    const andAction = () => {
        afterDelay(delay, () => {
            output.setSignal(getSignal(in1) & getSignal(in2));
        });
    }
    in1.addAction(andAction);
    in2.addAction(andAction);
}

/**
  ___  _   _    __    __    __    ____  _  _  ___  ____ 
 / __)( )_( )  /__\  (  )  (  )  ( ___)( \( )/ __)( ___)
( (__  ) _ (  /(__)\  )(__  )(__  )__)  )  (( (_-. )__) 
 \___)(_) (_)(__)(__)(____)(____)(____)(_)\_)\___/(____)
 
 */

const halfAdderFactory = (or, and, invert) => (x, y, sum, carry) => {
    // Your code here!
}
