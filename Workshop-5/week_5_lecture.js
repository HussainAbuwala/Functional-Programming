//Normal cons list
function cons(head, tail) {
    return function (selector) {
        return selector(head, tail);
    };
}
function head(list) {
    return list(function (h, t) { return h; });
}
function tail(list) {
    return list(function (h, t) { return t; });
}
//curried conslist
/*

Kcombinator(x => x) = (x => x) => y => x
                    = y => (x => x)
                    = y => x => x


*/
var Icombinator = function (x) { return x; };
var Kcombinator = function (x) { return function (y) { return x; }; };
function curried_cons(head) {
    return function (tail) {
        return function (selector) {
            return selector(head)(tail);
        };
    };
}
function Kcom_head(list) {
    return list(Kcombinator);
}
function KIcom_tail(list) {
    return list(Kcombinator(Icombinator));
}
var myList = curried_cons(1)(curried_cons(2)(curried_cons(3)(null)));
console.log(Kcom_head(myList));
console.log(Kcom_head(KIcom_tail(myList)));
console.log(Kcom_head(KIcom_tail(KIcom_tail(myList))));
//uncurried reduce
function reduce(f, l, start) {
    if (l !== null) {
        return reduce(f, KIcom_tail(l), f(start, Kcom_head(l)));
    }
    else {
        return start;
    }
}
console.log(reduce(function (acc, elem) { return acc + 1; }, myList, 0));
//curried reduce
var curriedReduce = function (f) { return function (l) { return function (start) {
    return (l !== null) ?
        curriedReduce(f)(KIcom_tail(l))(f(start)(Kcom_head(l)))
        : start;
}; }; };
console.log(curriedReduce(function (acc) { return function (elem) { return acc + 1; }; })(myList)(0));
var forElem = function (f) { return function (list) {
    return curriedReduce(function (_) { return function (elem) { return f(elem); }; })(list)(null);
}; };
//using combinators to see a common pattern
var forElemComb = function (f) { return function (list) {
    return curriedReduce(Kcombinator(Icombinator(f)))(list)(null);
}; };
/*
Kcombinator(x => x) = (x => x) => y => x
                    = y => (x => x)
                    = y => x => x


*/
forElemComb(console.log)(myList);
var reverse = function (l) { return curriedReduce(function (acc) { return function (elem) { return curried_cons(elem)(acc); }; })(l)(null); };
forElemComb(console.log)(reverse(myList));
var flip = function (f) { return function (a) { return function (b) { return f(b)(a); }; }; };
var Ireverse = function (l) { return curriedReduce(flip(curried_cons))(l)(null); };
forElemComb(console.log)(Ireverse(myList));
function concat(list1, list2) {
    if (list1 === null) {
        return list2;
    }
    if (list2 === null) {
        return list1;
    }
    else {
        return curried_cons(Kcom_head(list1))(concat(KIcom_tail(list1), list2));
    }
}
function filter(f, list) {
    if (!list)
        return null;
    var t = Kcom_head(list);
    var l = filter(f, KIcom_tail(list));
    return f(t) ? curried_cons(t)(l) : l;
}
function zip(f, list1, list2) {
    if (list1 === null) {
        return null;
    }
    if (list2 === null) {
        return null;
    }
    else {
        return curried_cons(f(Kcom_head(list1))(Kcom_head(list2)))(zip(f, KIcom_tail(list1), KIcom_tail(list2)));
    }
}
var student = ['Hussain', 'Legend', 'Boss'];
var marks = [1, 2, 3];
function fromArray(arr) {
    return arr.length === 0 ? null : curried_cons(arr[0])(fromArray(arr.slice(1)));
}
function quickSort(list) {
    //take head of list as pivot
    //take list of elements less than head
    //take list of elements > pivot
    // < p >
    if (list === null) {
        return null;
    }
    else {
        var head_1 = Kcom_head(list);
        return concat(quickSort(filter(function (a) { return a < head_1; }, KIcom_tail(list))), curried_cons(head_1)(quickSort(filter(function (a) { return a >= head_1; }, KIcom_tail(list)))));
    }
}
forElemComb(console.log)(zip((function (x) { return function (y) { return [x, y]; }; }), fromArray(student), fromArray(marks)));
//forElemComb(console.log)(concat(fromArray(student),fromArray(marks)))
var unSortedList = [9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 6, 6, 7];
forElemComb(console.log)(quickSort(fromArray(unSortedList)));
