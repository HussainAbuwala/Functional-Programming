module RockPaperScissors where

data RockPaperScissors = Rock | Paper | Scissors

-- The classes for this type are given for free
data Result = Player1 | Player2 | None
  deriving(Eq, Show)

-- $setup
-- >>> import Control.Applicative
-- >>> rps = [Rock, Paper, Scissors]
-- >>> combinations = liftA2 (,) rps rps
-- >>> insight f = map (liftA2 f fst snd)

-- | A hand should print as:
--  * Rock: 'R'
--  * Paper: 'P'
--  * Scissors: 'S'
--
-- >>> map show rps
-- ["R","P","S"]
instance Show RockPaperScissors where
  show Rock = "R"
  show Paper = "P"
  show Scissors = "S"

-- | Equality between members.
--
-- >>> insight (==) combinations
-- [True,False,False,False,True,False,False,False,True]
instance Eq RockPaperScissors where
  (==) Rock Rock = True
  (==) Paper Paper = True
  (==) Scissors Scissors = True
  (==) _ _ = False

-- | Ordering to determine winning moves.
--
-- >>> insight compare combinations
-- [EQ,LT,GT,GT,EQ,LT,LT,GT,EQ]
instance Ord RockPaperScissors where
  compare Rock Scissors = GT
  compare Scissors Paper = GT
  compare Paper Rock = GT
  compare x y
    | x == y = EQ
    | otherwise = LT

-- | Tell which player won.
--
-- >>> insight whoWon combinations
-- [None,Player2,Player1,Player1,None,Player2,Player2,Player1,None]
whoWon :: RockPaperScissors -> RockPaperScissors -> Result
whoWon p1 p2
  | p1 > p2 = Player1
  | p1 < p2 = Player2
  | otherwise = None 

-- | True if the first player has won @n@ or more times.
--
-- >>> competition 2 [Rock, Paper, Paper, Scissors] [Rock, Scissors, Rock, Paper]
-- True
--
-- >>> competition 2 [Rock, Paper, Paper, Scissors] [Rock, Scissors, Rock, Scissors]
-- False
--
-- >>> competition 2 [Rock, Paper, Paper, Scissors] [Rock, Scissors, Rock, Rock]
-- False
competition :: Int -> [RockPaperScissors] -> [RockPaperScissors] -> Bool
competition n p1 p2 = (>=n) $ length $ filter (==Player1) $ zipWith whoWon p1 p2
