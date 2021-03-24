module BinTree where

data BinTree = Nil | Node Int BinTree BinTree
  deriving (Show,Eq)

-- $setup
-- >>> tree = Node 16 (Node 23 Nil (Node 73 Nil Nil)) (Node 42 Nil Nil)
-- >>> one = Node 1 Nil Nil

-- | Find the depth of a tree (number of levels)
--
-- >>> depth Nil
-- 0
--
-- >>> depth (Node 1 Nil Nil)
-- 1
--
-- >>> depth tree
-- 3
depth :: BinTree -> Int
depth Nil = 0
depth (Node num tree1 tree2) = 1 + max (depth tree1) (depth tree2)

-- | Find the number of nodes in a tree.
--
-- >>> size Nil
-- 0
--
-- >>> size one
-- 1
--
-- >>> size tree
-- 4
size :: BinTree -> Int
size Nil = 0
size (Node num tree1 tree2) = 1 + (size tree1) + (size tree2)

-- | Sum the elements of a numeric tree.
--
-- >>> sumTree Nil
-- 0
--
-- >>> sumTree one
-- 1
--
-- >>> sumTree tree
-- 154
--
-- prop> sumTree (Node v Nil Nil) == v
sumTree :: BinTree -> Int
sumTree Nil = 0
sumTree (Node num tree1 tree2) = num + (sumTree tree1) + (sumTree tree2)

-- | Find the minimum element in a tree.
-- | e.g. minTree <your pattern here> = error "Tree is empty"
--
-- >>> minTree one
-- 1
--
-- >>> minTree tree
-- 16
--
minTree :: BinTree -> Int
minTree Nil = error "Tree is empty"
minTree (Node num tree1 tree2) | ((tree1 == Nil) && (tree2 == Nil)) = num
							   | (tree1 == Nil) = minTree tree2
							   | (tree2 == Nil) = minTree tree1
							   |  otherwise = min num $ min (minTree tree1) (minTree tree2)

-- | Map a function over a tree.
--
-- >>> mapTree (+1) Nil
-- Nil
--
-- >>> mapTree (*1) one
-- Node 1 Nil Nil
--
-- >>> mapTree ((flip mod) 2) tree
-- Node 0 (Node 1 Nil (Node 1 Nil Nil)) (Node 0 Nil Nil)
mapTree :: (Int -> Int) -> BinTree -> BinTree
mapTree _ Nil = Nil
mapTree f (Node num tree1 tree2) = Node (f num) (mapTree f tree1) (mapTree f tree2) 
