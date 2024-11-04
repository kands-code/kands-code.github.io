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
qGroup :: [a] -> [Int] -> Maybe [[[a]]]
```

<details>

<summary>答案</summary>

```haskell
qGroup :: (Eq a) => [a] -> [Int] -> Maybe [[[a]]]
qGroup lst g
  | sum g > qLength lst || any (< 1) g = Nothing
  | otherwise = mapM (`partList` g) (permu lst)
  where
    partList :: [a] -> [Int] -> Maybe [[a]]
    partList xs p
      | null xs
          || null p
          || sum p > qLength xs
          || any (< 1) p =
          Nothing
      | otherwise = Just (partListI xs g [] [])
      where
        partListI :: [a] -> [Int] -> [a] -> [[a]] -> [[a]]
        partListI l ps c acc = case ps of
          [] -> qReverse acc
          ph : pt -> case ph of
            0 -> partListI l pt [] (qReverse c : acc)
            _ -> case l of
              [] -> qReverse acc
              lh : lt ->
                partListI lt ((ph - 1) : pt) (lh : c) acc
    permu :: (Eq a) => [a] -> [[a]]
    permu [] = [[]]
    permu l = concatMap (\x -> map (x :) (permu (remove x l))) l
      where
        remove y = foldl (\acc z -> if y == z then acc else z : acc) []
```

</details>

### Question 28

> **_Sorting a list of lists according to length of sublists._**

根据所给范围创建整数列表

```haskell
qListSort :: (Eq a, Ord a) => [[a]] -> [[a]]
```

<details>

<summary>答案</summary>

```haskell
-- TODO
qListSort :: (Eq a, Ord a) => [[a]] -> [[a]]
qListSort _ = []
```

</details>

## 测试用例

这一部分的测试代码如下：

<details>

<summary>测试代码</summary>

```haskell
module Part03 (part03) where

import Qarks.Nnp
  ( qCombination,
    qInsertAt,
    qLotto,
    qRandomPermutation,
    qRandomSelect,
    qRange,
  )
import Test.Hspec
  ( context,
    describe,
    it,
    shouldBe,
    shouldSatisfy,
  )
import Test.Hspec.Runner (SpecWith)

maybeAllElem :: (Eq a) => [a] -> Maybe [a] -> Bool
maybeAllElem xs lst = case lst of
  Nothing -> False
  Just l -> all (`elem` xs) l

maybeLength :: Maybe [a] -> Int
maybeLength Nothing = 0
maybeLength (Just lst) = length lst

part03 :: SpecWith ()
part03 = describe "Part03" $ do
  context "Qarks.Nnp.qInsertAt" $ do
    it "insert 'X' to \"abcd\" at 2" $ do
      qInsertAt "abcd" 2 'X' `shouldBe` Just "aXbcd"
  context "Qarks.Nnp.qRange" $ do
    it "range from 4 to 9" $ do
      qRange 4 9 `shouldBe` [4 .. 9]
  context "Qarks.Nnp.qRandomSelect" $ do
    it "randomly select 3 from ['a' .. 'h']" $ do
      res <- qRandomSelect ['a' .. 'h'] 3
      res
        `shouldSatisfy` \lst ->
          maybeAllElem ['a' .. 'h'] lst
            && maybeLength lst == 3
  context "Qarks.Nnp.qLotto" $ do
    it "randomly select 6 from [1 .. 49]" $
      do
        res <- qLotto 6 49
        res
          `shouldSatisfy` \lst ->
            maybeAllElem [1 .. 49] lst
              && maybeLength lst == 6
  context "Qarks.Nnp.qRandomPermutation" $ do
    it "random permutation of ['a' .. 'f']" $ do
      res <- qRandomPermutation ['a' .. 'f']
      res
        `shouldSatisfy` \lst ->
          maybeAllElem ['a' .. 'f'] lst
            && maybeLength lst == length ['a' .. 'f']
  context "Qarks.Nnp.qCombination" $ do
    it "combinan of [1 .. 4] with 2" $ do
      qCombination [1 .. 4 :: Int] 2
        `shouldBe` Just [[4, 3], [4, 2], [3, 2], [4, 1], [3, 1], [2, 1]]
```

</details>
