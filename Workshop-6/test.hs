factorial n 
  | n <= 1 = 1
  | otherwise = n * factorial (n-1)

isDivBy n m = mod n m == 0

ep1 n
  | n < 3 = 0
  | isDivBy n 3 || isDivBy n 5 = n + ep1 (n - 1)
  | otherwise = ep1 (n-1)

-- data Student = Student { id::Integer, name::String, mark::Int }
--   deriving (Show)
data Student = Student Integer String Int
  deriving (Show)

best :: [Student] -> Student -> Student
best [] b = b
best (a@(Student _ _ am):rest) b@(Student _ _ bm) = 
  if am > bm 
  then best rest a 
  else best rest b 

data ConsList = Nil | Cons Int ConsList
l = Cons 1 $ Cons 2 $ Cons 3 Nil

consLength :: ConsList -> Int
consLength Nil = 0
consLength (Cons _ rest) = 1 + consLength rest 