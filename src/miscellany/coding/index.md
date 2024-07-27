# Coding

这里主要记录了我学习编程的过程中遇到的问题或者一些小想法

```haskell
fib = fib' 0 1
  where
    fib' a b n = case n of
      0 -> a
      1 -> b
      _ -> fib' b (a + b) (n - 1)
```
