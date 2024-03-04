# Coding

这一部分主要记录一些关于代码的杂项

大部分都是我学习过程中遇到的问题或想法，所以不少地方还是需要完善

如果有哪些地方有错误，请各位大佬在评论区指出

```haskell
fib = fib' 0 1
    where
        fib' a b n = case n of
            0 -> a
            1 -> b
            _ -> fib' b (a + b) (n - 1)
```
