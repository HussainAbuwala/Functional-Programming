module List where

data List = List {size :: Int, elems :: [Int], low :: Int, high :: Int}
  deriving(Show)

-- $setup
-- >>> import Data.List(sort)
-- >>> list = (List 7 [1, 7, 9, 2, 6, 11, 3] 1 11)

-- | Create a `List` instance from a list of elements.
--
-- >>> fromList [1, 7, 9, 2, 6, 11, 3]
-- List {size = 7, elems = [1,7,9,2,6,11,3], low = 1, high = 11}
fromList :: [Int] -> List
fromList l = List (length l) (l) (minimum l) (maximum l)

-- | Sort the list of elements in a list
--
-- >>> sortList list
-- List {size = 7, elems = [1,2,3,6,7,9,11], low = 1, high = 11}
--
-- prop> elems (sortList (List a l b c)) == sort l
sortList :: List -> List
sortList (List s e l h) = List (length e) (mySort e) (l) (h)
						where
							mySort :: [Int] -> [Int]
							mySort [] = []
							mySort list@(pivot:rest) = (mySort $ lessThan pivot rest ) ++ [pivot] ++ (mySort $ greaterThan pivot rest )
								where
									lessThan    = filter.(>)
									greaterThan = filter.(<)

sortList2 :: List -> List
sortList2 (List s e l h) = let
								mySort :: [Int] -> [Int]
								mySort [] = []
								mySort list@(pivot:rest) = (mySort $ lessThan pivot rest ) ++ [pivot] ++ (mySort $ greaterThan pivot rest )
									where
										lessThan    = filter.(>)
										greaterThan = filter.(<)
										
						   in   List (length e) (mySort e) (l) (h)




-- | Add an element to a list.
--
-- >>> sortList $ addElem 4 list
-- List {size = 8, elems = [1,2,3,4,6,7,9,11], low = 1, high = 11}
--
-- >>> sortList $ addElem 13 list
-- List {size = 8, elems = [1,2,3,6,7,9,11,13], low = 1, high = 13}
--
-- >>> sortList $ addElem 0 list
-- List {size = 8, elems = [0,1,2,3,6,7,9,11], low = 0, high = 11}
addElem :: Int -> List -> List
addElem i (List s e l h)= List (length (i:e)) (i:e) (minimum (i:e)) (maximum (i:e))

-- | Returns the longest of two lists.
--
-- >>> longest list (fromList [1, 2, 3])
-- List {size = 7, elems = [1,7,9,2,6,11,3], low = 1, high = 11}
--
-- >>> longest list (fromList [1..10])
-- List {size = 10, elems = [1,2,3,4,5,6,7,8,9,10], low = 1, high = 10}
longest :: List -> List -> List
longest firstList@(List s e l h) secondList@(List s1 e1 l1 h1) | (s >= s1) = firstList
															   | otherwise = secondList
