{-# LANGUAGE InstanceSigs, NoImplicitPrelude #-}

module Traversable where

import Base
import Functor
import Functions
import Applicative

-- $setup
sieve = (\x -> if even x then Just x else Nothing)

-- | A @Foldable@ is a structure which can be reduced to a single value given a
-- function.
--
-- /Hint/: Use the following "folding" function.
-- mconcat :: (Monoid m) => [m] -> m
--
-- /Hint/: Use the following "Nil."
-- mempty :: Monoid a => a

{-

mempty `mappend` x = x
x `mappend` mempty = x
(x `mappend` y) `mappend` z = x `mappend` (y `mappend` z)


Monoid laws -- binary function has to be associative
            -- There has to be an identity value.

newtype Product a =  Product { getProduct :: a }  
    deriving (Eq, Ord, Read, Show, Bounded)


instance Num a => Monoid (Product a) where  
    mempty = Product 1  
    Product x `mappend` Product y = Product (x * y)


newtype All = All { getAll :: Bool }  
        deriving (Eq, Ord, Read, Show, Bounded)

instance Monoid All where  
        mempty = All True  
        All x `mappend` All y = All (x && y)

newtype Any = Any { getAny :: Bool }  
    deriving (Eq, Ord, Read, Show, Bounded) 


instance Monoid Any where  
        mempty = Any False  
        Any x `mappend` Any y = Any (x || y)  

-}

class Foldable f where
  foldMap :: (Monoid m) => (a -> m) -> f a -> m

-- | A @Traversable@ is a structure which can be /traversed/ while applying an
-- effect. Basically, it is a @Foldable@ with a @Functor@ instance.
--
-- /Hint/: You have to traverse __and__ apply an effect.
class (Functor t, Foldable t) => Traversable t where
  traverse :: (Applicative f) => (a -> f b) -> t a -> f (t b)

-- | Given a list with non-monoidal elements, and a function to put them into
-- a monoid, fold the list into the monoid.
--
-- We have to use a "monoid under addition."
-- >>> getSum $ foldMap Sum [1..10]
-- 55
--
-- >>> getProduct $ foldMap Product [1..10]
-- 3628800
--
-- List is also a monoid under concatenation (append).
-- >>> elems $ foldMap List [[1..10], [11..20]]
-- [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
instance Foldable [] where
  foldMap :: (Monoid m) => (a -> m) -> [a] -> m
  foldMap f l = mconcat $ f <$> l

--foldMap _ [] = mempty
--foldMap f (x:xs) = f x <> foldMap f xs


-- | Traverse a list while producing an effect.
--
-- >>> traverse sieve [2, 4, 6]
-- Just [2,4,6]
--
-- >>> traverse sieve [2, 4, 7]
-- Nothing

instance Traversable [] where
  traverse :: Applicative f => (a -> f b) -> [a] -> f ([b])
  traverse f l = sequence $ (<$>) f l

sequence :: Applicative f => [f a] -> f [a]
sequence [] = pure []
sequence l@(x:xs) = (:) <$> x <*> sequence xs

-- Now unto rose trees.

-- | Fold a RoseTree into a value.
--
-- >>> getSum $ foldMap Sum (Node 7 [Node 1 [], Node 2 [], Node 3 [Node 4 []]])
-- 17
--

-- Node 7 [Node 1 []]

-- >>> getProduct $ foldMap Product (Node 7 [Node 1 [], Node 2 [], Node 3 [Node 4 []]])
-- 168

--RoseTree a = Nil | Node a [RoseTree a]

instance Foldable RoseTree where
  foldMap :: (Monoid m) => (a -> m) -> RoseTree a -> m
  foldMap f t@(Node v l) = mconcat $ (f v):[foldMap f x | x <- l]


---foldMap _ Nil = mempty
---foldMap f (Node e []) = f e <> mempty
---foldMap f (Node e l) = f e <> (foldr mappend mempty [foldMap f x | x <- l])

-- | Traverse a RoseTree while producing an effect.
--
-- >>> traverse sieve (Node 4 [Node 6 []])
-- Just (Node 4 [Node 6 []])
--
-- >>> traverse sieve (Node 4 [Node 6 [], Node 7 []])
-- Nothing
instance Traversable RoseTree where
  traverse :: Applicative f => (a -> f b) -> RoseTree a ->  f (RoseTree b)
  traverse _ Nil = pure Nil
  traverse f (Node v l) = Node <$> f v <*> (sequence [traverse f x| x<-l])



