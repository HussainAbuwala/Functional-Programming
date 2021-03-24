-- | Implementation of "safe" list procedures.
module SafeList (
  head
  , tail
  , sum
  ) where

import Prelude hiding (head, tail, sum)

-- | @head@ returns the first element of a list if the list is not empty.
--
-- >>> head []
-- Nothing
--
-- >>> head [1]
-- Just 1
--
-- >>> head [1..10]
-- Just 1
head :: [a] -> Maybe a
head [] = Nothing
head (a:_) = Just a

-- | @tail@ returns a list without its first element if the list is not empty.
--
-- >>> tail []
-- Nothing
--
-- >>> tail [1]
-- Just []
--
-- >>> tail [1..10]
-- Just [2,3,4,5,6,7,8,9,10]
tail :: [t] -> Maybe [t]
tail [] = Nothing
tail (_:rest) = Just rest

-- | @sum@ sums the elements of a list if the list is not empty (a sum equals to
-- zero means that there __are__ elements in the list).
--
-- >>> sum []
-- Nothing
--
-- >>> sum [1]
-- Just 1
--
-- >>> sum [1..10]
-- Just 55
sum :: Num a => [a] -> Maybe a
sum [] = Nothing
sum (x:rest) = Just $ x + unmaybe (sum rest)
  where
    unmaybe Nothing = 0
    unmaybe (Just y) = y
