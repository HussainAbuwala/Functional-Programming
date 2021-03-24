describe("Exercise 1", function() {
  describe("myObj", function() {
    it("Please create a variable that contains an empty object called `myObj`.", function() {
      expect(myObj).is.a('object');
    });
    it("Please give the object myObj a property called 'aProperty' that is a string.", function() {
      expect(myObj).to.include.keys('aProperty');
      expect(myObj.aProperty).is.a('string');
    });
    it("Please give the object myObj a property called 'anotherProperty' that is a number.", function() {
      expect(myObj).to.include.keys('anotherProperty');
      expect(myObj.anotherProperty).is.a('number');
    });
  });
});

describe("Exercise 2", function() {
  describe("operationOnTwoNumbers", function() {
    it("operationOnTwoNumbers exists and is a function", function() {
      expect(operationOnTwoNumbers).is.a('function');
    });
    it("operationOnTwoNumbers((x,y) => x + y) should return a function", function() {
      expect(operationOnTwoNumbers((x,y) => x + y)).is.a('function');
    });
    it("operationOnTwoNumbers((x,y) => x * y)(2) should return a function", function() {
      expect(operationOnTwoNumbers((x,y) => x * y)(2)).is.a('function');
    });
    it("operationOnTwoNumbers((x,y) => x + y)(number1)(number2) should be equal to number1 + number2", function() {
      for(let i = 0; i < 100; i++){
        const a = Math.floor(Math.random() * 100);
        const b = Math.floor(Math.random() * 100);
        expect(operationOnTwoNumbers((x,y) => x + y)(a)(b)).to.equal(a + b);
      }
    });
  });
});

describe("Exercise 3", function() {
  describe("callEach(array)", function() {
    it("Please create a function `callEach` that takes an array as an argument.", function() {
      expect(callEach).is.a('function');
    });
    it("Passing an array into `callEach` will call each function in the array once.", function() {
      const repeatTest = new Array(10).fill(0);
      repeatTest.forEach(_ => {
        // Setup spy functions
        let spies = [];
        for (let i = 0; i < (Math.floor(Math.random() * 10 + 1)); i ++) {
          spies = [...spies, sinon.spy()];
        }
        // Run callEach function
        callEach(spies);
        // Check each spy was called exactly once.
        spies.forEach(spy => {
          expect(spy.calledOnce).is.true;
        });
      });
    });
  });
});

describe("Exercise 4", function() {
  describe("UniversalClock", function() {
    describe("Constructor", function() {
      it("Constructor exists.", function() {
        expect(() => new UniversalClock()).to.not.throw();
      });
      it("UniveralClock.schedule exists and is an array", function() {
        const clock = new UniversalClock();
        expect(clock).to.include.keys('schedule');
        expect(Array.isArray(clock.schedule)).is.true;
      });
      it("UniversalClock.simulationTime exists and starts at 0", function() {
        const clock = new UniversalClock();
        expect(clock).to.include.keys('simulationTime');
        expect(clock.simulationTime).is.equal(0);
      });
    });

    describe("UniversalClock.isEmpty", function() {
      it("isEmpty exists as a prototype property", function() {
        expect(UniversalClock.prototype).to.include.keys('isEmpty');
      });
      it("isEmpty() works as expected", function() {
        let clock = new UniversalClock();
        expect(clock.isEmpty()).is.true;
        clock.schedule.push(() => {});
        expect(clock.isEmpty()).is.false;
      });
    });

    describe("UniversalClock.addToSchedule", function() {
      it("addToSchedule exists on the prototype", function() {
        expect(UniversalClock.prototype).to.include.keys('addToSchedule');
      });
      it("addToSchedule(1, () => {}) correctly adds the object [1, () => {}] to the scheduler", function() {
        const clock = new UniversalClock();
        clock.addToSchedule(1, () => {});
        expect(clock.schedule.length).to.equal(1);
        expect(clock.schedule[0].length, 'Expected a 2 element array [number, function] in the scheduler').to.equal(2);
        expect(clock.schedule[0][0], 'time field is set to 1 (simulationTime + delay)').is.equal(1);
        expect(clock.schedule[0][1]).is.a('function');
      });
      it("if UniversalClock.simulationTime == 3, addToSchedule(1, () => {}) adds [4, () => {}] to the schedule", function() {
        const clock = new UniversalClock();
        clock.simulationTime = 3;
        clock.addToSchedule(1, () => {});
        expect(clock.schedule[0][0], 'time field is set to 4 (simulationTime + delay)').is.equal(4);
      });
      it("Multiple functions added with the same delay are kept in the order added", function() {
        const clock = new UniversalClock();
        const incFactory = _ => {
          let i = 0;
          return _ => i++;
        }
        let iterator = incFactory();
        clock.addToSchedule(2, () => iterator());
        clock.addToSchedule(2, () => iterator());
        clock.addToSchedule(5, () => 10);
        clock.addToSchedule(2, () => iterator());

        clock.schedule.reduce((a, b) => {
          let aVal = a[1](),
              bVal = b[1]();
          expect(aVal < bVal, `Order wasn't preserved in the scheduler.`).is.true;
          return b;
        });
      });
    });
  });
});

describe("Exercise 5", function() {
  it('getFirstItem exists on prototype', function() {
    expect(UniversalClock.prototype).to.include.keys('getFirstItem');
  });
  it('getFirstItem triggers a specific error when the scheduler is empty', function() {
    const clock = new UniversalClock();
    expect(() => clock.getFirstItem()).to.throw('UniversalClock is empty -- UniversalClock.getFirstItem');
  });
  it('getFirstItem only returns a function', function() {
    const clock = new UniversalClock();
    clock.addToSchedule(0, () => {});
    expect(clock.getFirstItem()).is.a('function');
  });
  it('getFirstItem updates the simulationTime to whatever function it returned', function() {
    const clock = new UniversalClock();
    clock.addToSchedule(1, () => {});
    clock.getFirstItem();
    expect(clock.simulationTime).is.equal(1);
    clock.addToSchedule(3, () => {});
    clock.getFirstItem();
    expect(clock.simulationTime).to.equal(4);
  });
});

describe("UniversalClock works properly checkpoint!", function() {
  it("Sample Simulation", function() {
    const clock = new UniversalClock();
    let first = sinon.spy(),
        second = sinon.spy(),
        third = sinon.spy();
    clock.addToSchedule(1, first);
    clock.addToSchedule(3, third);
    clock.addToSchedule(1, second);
    runSimulation(clock);

    expect(first.calledBefore(second), "The scheduler didn't keep it's events in order").is.true;
    expect(second.calledBefore(third)).is.true;
  });
});

describe("Exercise 6", function() {
  it("Wire constructor exists", function() {
    expect(() => new Wire()).to.not.throw();
  });
  describe("setSignal", function() {
    it("setSignal exists on the Wire prototype", function() {
      expect(Wire.prototype).to.include.keys('setSignal');
    });
    it("Wire signalValue changes", function() {
      const w = new Wire();
      expect(w.signalValue, 'signalValue should initiate to 0').to.equal(0);
      w.setSignal(1);
      expect(w.signalValue).to.equal(1);
      w.setSignal(0);
      expect(w.signalValue).to.equal(0);
    });
    it("Changing the signal calls the functions in the actions array", function() {
      const w = new Wire();
      w.actions = [sinon.spy(), sinon.spy(), sinon.spy()];
      w.actions.map(v => expect(v.callCount, "On initiation spy's should not have been called").to.equal(0));
      w.setSignal(0);
      w.actions.map(v => expect(v.callCount, "Changing the signal from 0 -> 0 should not call actions.").to.equal(0));
      w.setSignal(1);
      w.actions.map(v => expect(v.callCount, "Changing the signal from 0 -> 1 should call actions.").to.equal(1));
      w.setSignal(1);
      w.actions.map(v => expect(v.callCount, "Changing the signal from 1 -> 1 should not call actions.").to.equal(1));
    });
  });
  describe("addAction", function() {
    it("addAction exists on the Wire prototype", function() {
      expect(Wire.prototype).to.include.keys('addAction');
    });
    it("addAction calls the function being added", function() {
      const w = new Wire();
      const action = sinon.spy();
      w.addAction(action);
      expect(action.calledOnce, "Expected the action to be called once.").is.true;
    });
    it("addAction adds the function to the actions array in the Wire", function() {
      const w = new Wire();
      expect(w.actions.length, "Wire should initiate with empty actions array").to.equal(0);
      const action = sinon.spy();
      action.specialId = 1;
      const action2 = sinon.spy();
      action2.specialId = 2;
      w.addAction(action);
      expect(w.actions.length).to.equal(1);
      expect(w.actions[0].specialId, "function added to the actions isn't the function passed in.").to.equal(1);
      w.addAction(action2);
      expect(w.actions.length).to.equal(2);
      expect(w.actions.reduce((a, b) => {
        return a + b.specialId;
      }, 0), "Two functions have been added to the actions array").to.equal(3);
    });
  });
});

describe("Exercise 7", function() {
  it("Or test", function() {
    let c = new UniversalClock();
    const actionAfterDelay = addAfterDelay(c);
    let a = new Wire();
    let b = new Wire();
    let sink = new Wire();

    const or = orFactory(2, actionAfterDelay)
    or(a, b, sink);
    expect(sink.signalValue, 'sink should start with a signalValue of 0').to.equal(0);
    a.setSignal(1);
    b.setSignal(1);
    runSimulation(c);
    expect(sink.signalValue, '1 | 1 = 1').to.equal(1);
    b.setSignal(0);
    runSimulation(c);
    expect(sink.signalValue, '1 | 0 = 1').to.equal(1);
    a.setSignal(0);
    runSimulation(c);
    expect(sink.signalValue, '0 | 0 = 0').to.equal(0);
  });
});

describe("Testing the UniversalClock with a halfAdder", function() {
  it("Example from 3.3.4 A Sample Simulation", function() {
    let clock = new UniversalClock();
    const actionAfterDelay = addAfterDelay(clock);
    let and = andFactory(3, actionAfterDelay);
    let not = notFactory(2, actionAfterDelay);
    let or = orFactory(5, actionAfterDelay);
    let halfAdder = halfAdderFactory(or, and, not);

    let input1 = new Wire();
    let input2 = new Wire();
    let sum = new Wire();
    let carry = new Wire();

    probe('Sum', sum, clock);
    probe('Carry', carry, clock);

    halfAdder(input1, input2, sum, carry);

    input1.setSignal(1);

    runSimulation(clock);
    expect(sum.signalValue).to.equal(1);
    expect(carry.signalValue).to.equal(0);

    input2.setSignal(1);
    runSimulation(clock);

    expect(sum.signalValue).to.equal(0);
    expect(carry.signalValue).to.equal(1);
  });
});