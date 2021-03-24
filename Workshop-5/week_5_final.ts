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

const K = x => y => x
const I = x => x

const cons = head => rest => selector => selector(head)(rest)
const head = list => list(K)
const rest = list => list(K(I))

const mylist = cons(1)(cons(2)(cons(3)(null)))

console.log(head(mylist))
console.log(head(rest(mylist)))
console.log(head(rest(rest(mylist))))

//uncurried reduce 


const reduce = (f,acc,list) => {
    if (!list) {
        return acc
    }
    {

        return reduce(f,f(acc,head(list)),rest(list))

    }
}

console.log(reduce((acc,elem) => acc + 1,0,mylist))

//curried reduce
console.log('hello')
const curriedreduce = f => acc => list => {
    if  (list === null) {
        return acc
    } 
    else {
        return curriedreduce(f) (f(acc)(head(list))) (rest(list))
    }
}

console.log(curriedreduce (acc => elem => acc + 1)(0)(mylist))


//for each

const foreach = f => list => curriedreduce (_ => elem => f(elem)) (undefined) (list)

console.log('hello')

foreach(console.log)(mylist)

//using combinators to see a common pattern

const foreach2 = f => list => curriedreduce (K(I(f))) (undefined) (list)


//K = x => y => x
//I = x => x
//I(console.log) = console.log
//K(I) = y => x => x 

console.log('hello111')

foreach2(console.log)(mylist)

//reverse conslist using reduce
const flip = f => x => y => f(y)(x)

const reverse = l => curriedreduce ( flip(cons)  )  (null)  (l)

const revlist = reverse(mylist)

console.log('reverse')

foreach2(console.log)(revlist)


//concat two lists l1 and l2

function concat (l1,l2) {

    if (l1 == null) {
        return l2
    }

    else if (l2 == null) {
        return l1
    }

    else {

        return cons(head(l1))(  concat(rest(l1),l2)    )

    }

}

console.log('cncat')
const newlist = concat(revlist,mylist)
foreach(console.log)(newlist)

function filter(f,list) {

    if (list == null) {
        return null
    }
    else {

        if (f(head(list))) {
            return cons(head(list))(filter(f,rest(list)))
        } 
        else {
            return filter(f,rest(list))
        }
    }

}

console.log('filter')

const filterlist = filter(x => x < 3,mylist)

foreach(console.log)(filterlist)

function zip (f,l1,l2) {

    if (l1 === null) {
        return null
    }
    else if (l2 === null) {
        return null
    }
    else {

        return cons(f(head(l1),head(l2)))(zip(f,rest(l1),rest(l2)))

    }


}

console.log('zip')

const ziplist = zip((x,y) => [x,y],revlist,mylist)
foreach(console.log)(ziplist)


// from array

function fromarr (arr) {

    if(arr.length === 0) {

        return null

    }

    else {

        return cons(arr[0])(fromarr(arr.slice(1)))

    }

}

console.log('fromarry')
foreach(console.log)(fromarr([9,8,7]))

// to array

function toarray(conslist) {

    if (conslist === null) {
        return []
    }
    else {

        return [head(conslist)].concat(toarray(rest(conslist)))

    }

}

console.log('toarray')
console.log(toarray(ziplist))


function quicksort(list) {


    if (list === null) {
        return null
    }

    else {
        const pivot = head(list)
        const lessPivot = filter(x => x < pivot,rest(list))
        const grePivot = filter(x => x >= pivot,rest(list))

        return concat(quicksort(lessPivot),cons(pivot)(quicksort(grePivot)))

    }


}

console.log('quicksort')

foreach(console.log)(quicksort(newlist))

const closureQuickSort = l => (

    (l === null) ? null : (

        pivot => (

            (lesspivot,grepivot) => (

                concat(closureQuickSort(lesspivot),cons(pivot)(closureQuickSort(grepivot)))

            )

        )(filter(x => x < pivot,rest(l)),filter(x => x >= pivot,rest(l)))

    )(head(l))

)

console.log('CLOSUREquicksort')

foreach(console.log)(closureQuickSort(newlist))