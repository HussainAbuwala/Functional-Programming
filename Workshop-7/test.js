const Y = f=> (x => f(x(x)))(x=> f(x(x))) // Direct translation from Lambda Calc

// A simple function that recursively calculates 'n!'.
const FAC = f => n => n>1 ? n * f(n-1) : 1
const fac = Y(FAC)
console.log(fac(6))

x => <some expression of x>