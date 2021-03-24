import Unsafe.Coerce

y :: (a -> a) -> a
y = \f -> (\x -> f (unsafeCoerce x x)) (\x -> f (unsafeCoerce x x))

main = putStrLn $ y ("circular reasoning works because " ++)