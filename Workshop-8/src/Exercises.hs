module Exercises where

import Base
import Applicative
import Prelude hiding (Functor, Applicative, pure, return, fmap, (<$>), (<*>), sequence)

-- | Apply a binary function in the environment.
--
-- >>> lift (+) (Id 7) (Id 8)
-- Id 15
--
-- >>> lift (+) [1, 2, 3] [4, 5]
-- [5,6,6,7,7,8]
--
-- >>> lift (+) (Just 7) (Just 8)
-- Just 15
--
-- >>> lift (+) (Just 7) Nothing
-- Nothing
--
-- >>> lift (+) Nothing (Just 8)
-- Nothing
lift :: Applicative f => (a -> b -> c) -> f a -> f b -> f c
lift f a b = (pure f) <*> a <*> b

-- | Turn a list of structured items into a structured list of item, bailing on
-- nils.
--
-- /Hint/: use @foldr@
--
-- >>> sequence [Id 7, Id 8, Id 9]
-- Id [7,8,9]

--Id (9:) -- Id (9:8:7:[])
--Id (8:) -- Id (8:7:[])
--Id (7:) -- Id (7:[])
--[]


--
-- >>> sequence [[1, 2, 3], [1, 2]]
-- [[1,1],[1,2],[2,1],[2,2],[3,1],[3,2]]
--
-- >>> sequence [Just 7, Nothing]
-- Nothing
--
-- >>> sequence [Just 7, Just 8]
-- Just [7,8]
sequence :: Applicative f => [f a] -> f [a]

--sequence l = foldr (\elem acc -> lift (:) (elem) (acc)) (pure []) l

sequence [] = pure []
sequence l@(x:xs) = (:) <$> x <*> sequence xs


-- | Replicate an effect a given number of times.
--
-- /Hint/: use @replicate@
--
-- >>> replicateA 4 (Id "hi")
-- Id ["hi","hi","hi","hi"]
--
-- >>> replicateA 4 (Just "hi")
-- Just ["hi","hi","hi","hi"]
--
-- >>> replicateA 4 Nothing
-- Nothing
--
-- >>> replicateA 3 ['a', 'b', 'c']
-- ["aaa","aab","aac","aba","abb","abc","aca","acb","acc","baa","bab","bac","bba","bbb","bbc","bca","bcb","bcc","caa","cab","cac","cba","cbb","cbc","cca","ccb","ccc"]
replicateA :: Applicative f => Int -> f a -> f [a]
replicateA i  = sequence . (replicate i) 


-- | Filter a list with a predicate that produces an effect.
--
-- >>> filtering (Id . even) [4, 5, 6]
-- Id [4,6]
--
-- Filter all elements under 7, unless there is one over 13.
sieve a = if a > 13 then Nothing else Just (a <= 7)
--
-- >>> filtering sieve [4, 5, 6]
-- Just [4,5,6]
--
-- >>> filtering sieve [4, 5, 6, 7, 8, 9]
-- Just [4,5,6,7]
--
-- >>> filtering sieve [4, 5, 6, 13, 14]
-- Nothing
--
-- >>> filtering (const $ [True, True]) [1, 2, 3]
-- [[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3]]
filtering :: Applicative f => (a -> f Bool) -> [a] -> f [(Bool,a)]
filtering f l = letsDothis (sequence (map f l)) l
					where
						letsDothis f l1 = lift zip f (pure l1)


