//Normal cons list

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

//curried conslist
/* 

Kcombinator(x => x) = (x => x) => y => x
                    = y => (x => x)
                    = y => x => x


*/

const Icombinator = x => x
const Kcombinator = x => y => x

function curried_cons(head) {
    return function (tail) {
        return function (selector){
            return selector(head)(tail)
        }
    }
}

function Kcom_head(list){
    return list(Kcombinator)
}
function KIcom_tail(list){
    return list(Kcombinator(Icombinator))
}

const myList = curried_cons(1)(curried_cons(2)(curried_cons(3)(null)))

console.log(Kcom_head(myList))
console.log(Kcom_head(KIcom_tail(myList)))
console.log(Kcom_head(KIcom_tail(KIcom_tail(myList))))

//uncurried reduce

function reduce (f,l,start) {
    if (l !== null) {
        return reduce (f,KIcom_tail(l),f(start,Kcom_head(l)))
    }
    else {
        return start
    }
}


console.log(reduce((acc,elem) => acc + 1,myList,0))


//curried reduce

const curriedReduce = f => l => start =>  
    (l !== null) ?
                    curriedReduce (f) (KIcom_tail(l)) (f(start) (Kcom_head(l)))
                 :  start
    


console.log(curriedReduce (acc => elem => acc + 1) (myList) (0))


const forElem = f => list => 
        curriedReduce(_ => elem => f(elem))(list)(null)

//using combinators to see a common pattern

const forElemComb = f => list => 
        curriedReduce(Kcombinator(Icombinator(f)))(list)(null)


/*
Kcombinator(x => x) = (x => x) => y => x
                    = y => (x => x)
                    = y => x => x


*/

forElemComb(console.log)(myList)

const reverse = l => curriedReduce(acc => elem => curried_cons(elem)(acc)) (l) (null)

forElemComb(console.log)(reverse(myList))

const flip = f => a => b => f(b)(a)
const Ireverse = l => curriedReduce(flip(curried_cons)) (l) (null)

forElemComb(console.log)(Ireverse(myList))

function concat (list1,list2){
    if (list1 === null){
        return list2
    }
    if (list2 === null){
        return list1
    }
    else {
        return curried_cons(Kcom_head(list1)) (concat(KIcom_tail(list1),list2))
    }
}

function filter(f, list){
    if (!list) return null;
    const t = Kcom_head(list);
    const l = filter(f, KIcom_tail(list));
    return f(t) ? curried_cons(t)(l) : l; 
}

function zip (f,list1,list2) {
    
    if (list1 === null ) {
        return null
    }
    if (list2 === null) {
        return null
    }
    else {
        return curried_cons (f(Kcom_head(list1))(Kcom_head(list2))) (zip(f,KIcom_tail(list1),KIcom_tail(list2)))
    }

}

const student = ['Hussain','Legend','Boss']
const marks = [1,2,3]

function fromArray(arr) {
    return arr.length === 0 ? null : curried_cons(arr[0])(fromArray(arr.slice(1)));
}


function quickSort(list){
    //take head of list as pivot
    //take list of elements less than head
    //take list of elements > pivot
    // < p >
    if (list === null) {
        return null
    }
    else {
        const head = Kcom_head(list)
        return concat(quickSort(filter(a => a < head,KIcom_tail(list))), curried_cons(head) (quickSort(filter(a => a >= head,KIcom_tail(list)))))
    }
}

function comparator(a,b){
    
}

forElemComb(console.log)(zip((x => y => [x,y]),fromArray(student),fromArray(marks)))

//forElemComb(console.log)(concat(fromArray(student),fromArray(marks)))

const unSortedList = [9,8,7,6,5,4,3,2,1,1,2,3,4,6,6,7]
forElemComb(console.log)(quickSort(fromArray(unSortedList)))