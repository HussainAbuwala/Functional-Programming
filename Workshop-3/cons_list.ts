
type selector<T> = (head: T,rest: cons<T>) => T|cons<T>;
type cons<T> = (selector: selector<T>) => T|cons<T>; 

function cons<T> (head: T,tail: cons<T>): cons<T>{
    return function(f: selector<T>): T|cons<T>{
        return f(head,tail)
    }
}
function head<T>(consList: cons<T>):T{
    return <T>consList((head,tail) => head)
}

function tail<T>(consList: cons<T>): cons<T>{
    return <cons<T>> consList((head,tail) => tail)
}


const list = cons(1,cons(2,cons(3,undefined)))

console.log(head(tail(tail(list))))
