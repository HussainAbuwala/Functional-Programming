include "globals.mzn";

int: n;
array[1..n,1..n] of var 1..n : x;

%All numbers in each row must be different

constraint

%forall (i in 1..n) (alldifferent ([x[i,j] | j in 1..n]));

forall (i in 1..n) (alldifferent (row(x,i)));

%All numbers in each column must be different

constraint

%forall (i in 1..n) (alldifferent([x[j,i] | j in 1..n]));

forall (i in 1..n) (alldifferent(col(x,i)));

%All numbers in each subsquare must be different

constraint

alldifferent([x[i,j] | i in 1..2, j in 1..2]);

constraint

alldifferent([x[i,j] | i in 1..2, j in 3..4]);

constraint

alldifferent([x[i,j] | i in 3..4, j in 1..2]);

constraint

alldifferent([x[i,j] | i in 3..4, j in 3..4]);


solve satisfy;
output [show2d(x)];