//Normal cons list
/*
function cons(head,tail) {
    return function(selector){
        return selector(head,tail)
    }
}

function head(list) {
    return list((h,t) => h)
}

function tail(list) {
    return list((h,t) => t)
}
*/
//curried cons list
var K = function (x) { return function (y) { return x; }; };
var I = function (x) { return x; };
var cons = function (head) { return function (rest) { return function (selector) { return selector(head)(rest); }; }; };
var head = function (list) { return list(K); };
var rest = function (list) { return list(K(I)); };
var mylist = cons(1)(cons(2)(cons(3)(null)));
console.log(head(mylist));
console.log(head(rest(mylist)));
console.log(head(rest(rest(mylist))));
//uncurried reduce 
var reduce = function (f, acc, list) {
    if (!list) {
        return acc;
    }
    {
        return reduce(f, f(acc, head(list)), rest(list));
    }
};
console.log(reduce(function (acc, elem) { return acc + 1; }, 0, mylist));
//curried reduce
console.log('hello');
var curriedreduce = function (f) { return function (acc) { return function (list) {
    if (list === null) {
        return acc;
    }
    else {
        return curriedreduce(f)(f(acc)(head(list)))(rest(list));
    }
}; }; };
console.log(curriedreduce(function (acc) { return function (elem) { return acc + 1; }; })(0)(mylist));
//for each
var foreach = function (f) { return function (list) { return curriedreduce(function (_) { return function (elem) { return f(elem); }; })(undefined)(list); }; };
console.log('hello');
foreach(console.log)(mylist);
//using combinators to see a common pattern
var foreach2 = function (f) { return function (list) { return curriedreduce(K(I(f)))(undefined)(list); }; };
//K = x => y => x
//I = x => x
//I(console.log) = console.log
//K(I) = y => x => x 
console.log('hello111');
foreach2(console.log)(mylist);
//reverse conslist using reduce
var flip = function (f) { return function (x) { return function (y) { return f(y)(x); }; }; };
var reverse = function (l) { return curriedreduce(flip(cons))(null)(l); };
var revlist = reverse(mylist);
console.log('reverse');
foreach2(console.log)(revlist);
//concat two lists l1 and l2
function concat(l1, l2) {
    if (l1 == null) {
        return l2;
    }
    else if (l2 == null) {
        return l1;
    }
    else {
        return cons(head(l1))(concat(rest(l1), l2));
    }
}
console.log('cncat');
var newlist = concat(revlist, mylist);
foreach(console.log)(newlist);
function filter(f, list) {
    if (list == null) {
        return null;
    }
    else {
        if (f(head(list))) {
            return cons(head(list))(filter(f, rest(list)));
        }
        else {
            return filter(f, rest(list));
        }
    }
}
console.log('filter');
var filterlist = filter(function (x) { return x < 3; }, mylist);
foreach(console.log)(filterlist);
function zip(f, l1, l2) {
    if (l1 === null) {
        return null;
    }
    else if (l2 === null) {
        return null;
    }
    else {
        return cons(f(head(l1), head(l2)))(zip(f, rest(l1), rest(l2)));
    }
}
console.log('zip');
var ziplist = zip(function (x, y) { return [x, y]; }, revlist, mylist);
foreach(console.log)(ziplist);
// from array
function fromarr(arr) {
    if (arr.length === 0) {
        return null;
    }
    else {
        return cons(arr[0])(fromarr(arr.slice(1)));
    }
}
console.log('fromarry');
foreach(console.log)(fromarr([9, 8, 7]));
// to array
function toarray(conslist) {
    if (conslist === null) {
        return [];
    }
    else {
        return [head(conslist)].concat(toarray(rest(conslist)));
    }
}
console.log('toarray');
console.log(toarray(ziplist));
function quicksort(list) {
    if (list === null) {
        return null;
    }
    else {
        var pivot_1 = head(list);
        var lessPivot = filter(function (x) { return x < pivot_1; }, rest(list));
        var grePivot = filter(function (x) { return x >= pivot_1; }, rest(list));
        return concat(quicksort(lessPivot), cons(pivot_1)(quicksort(grePivot)));
    }
}
console.log('quicksort');
foreach(console.log)(quicksort(newlist));
var closureQuickSort = function (l) { return ((l === null) ? null : (function (pivot) { return (function (lesspivot, grepivot) { return (concat(closureQuickSort(lesspivot), cons(pivot)(closureQuickSort(grepivot)))); })(filter(function (x) { return x < pivot; }, rest(l)), filter(function (x) { return x >= pivot; }, rest(l))); })(head(l))); };
console.log('CLOSUREquicksort');
foreach(console.log)(closureQuickSort(newlist));
