# Haskell 99 Questions :: 0x03

<p class="archive-time">archive time: 2024-11-04</p>

<p class="sp-comment">还是要继续练习才行</p>

[[toc]]

之前已经完成了前二十题，今天我们继续写 $21 \sim 28$ 题

## 题目

### Question 21

> **_Insert an element at a given position into a list._**

插入元素到给定的列表中

```haskell
qInsertAt :: [a] -> Int -> a -> Maybe [a]
```

<details>

<summary>答案</summary>

```haskell
qInsertAt :: [a] -> Int -> a -> Maybe [a]
qInsertAt lst k e = if k < 1 then Nothing else qInsertAtI lst k e []
  where
    qInsertAtI :: [a] -> Int -> a -> [a] -> Maybe [a]
    qInsertAtI xs 1 x acc = Just (qReverse acc ++ (x : xs))
    qInsertAtI [] _ _ _ = Nothing
    qInsertAtI (h : t) n x acc = qInsertAtI t (n - 1) x (h : acc)
```

</details>

### Question 22

> **_Create a list containing all integers within a given range._**

根据所给范围创建整数列表

```haskell
qRange :: Int -> Int -> [Int]
```

<details>

<summary>答案</summary>

```haskell
qRange :: Int -> Int -> [Int]
qRange a b = [a .. b]
```

</details>

### Question 23

> **_Extract a given number of randomly selected elements from a list._**

从列表中随机选择 `n` 个元素

```haskell
qRandomSelect :: [a] -> Int -> IO (Maybe [a])
```

<details>

<summary>答案</summary>

```haskell
qRandomSelect :: [a] -> Int -> IO (Maybe [a])
qRandomSelect lst n = qRandomSelectI lst n []
  where
    qRandomSelectI :: [a] -> Int -> [a] -> IO (Maybe [a])
    qRandomSelectI (h : _) 1 acc = return (Just (h : acc))
    qRandomSelectI [] _ _ = return Nothing
    qRandomSelectI l k acc =
      if k < 1
        then return Nothing
        else do
          idx <- randomRIO (1, qLength l)
          case qRemoveAt l idx of
            (Just e, rest) -> qRandomSelectI rest (k - 1) (e : acc)
            (Nothing, _) -> return Nothing
```

</details>

### Question 24

> **_Lotto: draw n different random numbers from the set [1 .. m]._**

从 `[1 .. m]` 中随机选择 `n` 个数字

```haskell
qLotto :: Int -> Int -> IO (Maybe [Int])
```

<details>

<summary>答案</summary>

```haskell
qLotto :: Int -> Int -> IO (Maybe [Int])
qLotto n m = qRandomSelect [1 .. m] n
```

</details>

### Question 25

> **_Generate a random permutation of the elements of a list._**

给出所给列表的一个随机排列

```haskell
qRandomPermutation :: [a] -> IO (Maybe [a])
```

<details>

<summary>答案</summary>

```haskell
qRandomPermutation :: [a] -> IO (Maybe [a])
qRandomPermutation lst = qRandomSelect lst (qLength lst)
```

</details>

### Question 26

> **_Generate the combinations of k elements chosen from the n elements of a list._**

生成所有的 $C(n, k)$ 的选择可能

```haskell
qCombinantion :: [a] -> Int -> Maybe [[a]]
```

<details>

<summary>答案</summary>

```haskell
qCombination :: [a] -> Int -> Maybe [[a]]
qCombination lst k
  | k < 1 || k > qLength lst = Nothing
  | otherwise = Just (qCombinationI lst k [] [])
  where
    qCombinationI :: [a] -> Int -> [a] -> [[a]] -> [[a]]
    qCombinationI l m c acc = case m of
      0 -> c : acc
      _ -> case l of
        [] -> acc
        h : t ->
          qCombinationI t m c (qCombinationI t (m - 1) (h : c) acc)
```

</details>

### Question 27

> **_Group the elements of a set into disjoint subsets._**

按照所给组合来选择元素并分组

```haskell
qRange :: Int -> Int -> [Int]
```

<details>

<summary>答案</summary>

```haskell
qRange :: Int -> Int -> [Int]
qRange a b = [a .. b]
```

</details>
