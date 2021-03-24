int: n;
% map each queen to its column 
array[1..n] of var 1..n: q;
% no two queens in the same column
constraint
forall (i in 1..n, j in 1..n where i < j) (
q[i] != q[j] );
% no two queens in the same diagonal
constraint
forall (i,j in 1..n where i < j) (
q[i] + i != q[j] + j );
constraint
forall (i,j in 1..n where i < j) (
q[i] - i != q[j] - j );
solve satisfy; output [show(q)];