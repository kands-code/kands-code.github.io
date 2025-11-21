# Haskell 99 Questions :: 0x02

<p class="archive-time">archive time: 2024-10-31</p>

<p class="sp-comment">继续写写题目......</p>

昨天写了前十题，今天我们继续写 `$11 \sim 20$` 题

## 题目

### Question 11

> **_Modified run-length encoding._**

将之前的元组形式的 Run-length 编码改成使用 `QCount` 的形式

```haskell
data QCount a = QSingle a | QMultiple Int a
  deriving (Show, Eq)

qEncodeModified :: (Eq a) => [a] -> [QCount a]
```

<details>

<summary>答案</summary>

```haskell
data QCount a = QSingle a | QMultiple Int a
  deriving (Show, Eq)

qEncodeModified :: (Eq a) => [a] -> [QCount a]
qEncodeModified lst =
  map qModify (qPack lst)
  where
    qModify :: (Eq a) => [a] -> QCount a
    qModify p = case qLength p of
      1 -> QSingle (head p)
      len -> QMultiple len (head p)
```

</details>

### Question 12

> **_Decode a run-length encoded list._**

解码 Run-length 编码

```haskell
qRunLengthDecode :: [QCount a] -> [a]
```

<details>

<summary>答案</summary>

```haskell
qRunLengthDecode :: [QCount a] -> [a]
qRunLengthDecode clst = qReverse (qRunLengthDecodeI clst [])
  where
    qRunLengthDecodeI :: [QCount a] -> [a] -> [a]
    qRunLengthDecodeI [] acc = acc
    qRunLengthDecodeI (QSingle e : t) acc = qRunLengthDecodeI t (e : acc)
    qRunLengthDecodeI (QMultiple 0 _ : t) acc = qRunLengthDecodeI t acc
    qRunLengthDecodeI (QMultiple n e : t) acc = qRunLengthDecodeI (QMultiple (n - 1) e : t) (e : acc)
```

</details>

### Question 13

> **_Run-length encoding of a list (direct solution)._**

直接实现 Run-length 编码，不使用 Question 09 的结果，
实际上就是把 Question 09 的过程修改一下就好

```haskell
qRunLengthEncodeDirect :: (Eq a) => [a] -> [QCount a]
```

<details>

<summary>答案</summary>

```haskell
qRunLengthEncodeDirect :: (Eq a) => [a] -> [QCount a]
qRunLengthEncodeDirect [] = []
qRunLengthEncodeDirect (h : t) = qReverse (qRunLengthEncodeDirectI t (1, h) [])
  where
    qTupleToCount :: (Int, a) -> QCount a
    qTupleToCount (n, e) = case n of
      1 -> QSingle e
      _ -> QMultiple n e
    qRunLengthEncodeDirectI :: (Eq a) => [a] -> (Int, a) -> [QCount a] -> [QCount a]
    qRunLengthEncodeDirectI [] p acc = qTupleToCount p : acc
    qRunLengthEncodeDirectI (hI : tI) (n, e) acc
      | hI == e = qRunLengthEncodeDirectI tI (n + 1, e) acc
      | otherwise = qRunLengthEncodeDirectI tI (1, hI) (qTupleToCount (n, e) : acc)
```

</details>

### Question 14

> **_Duplicate the elements of a list._**

将列表中每个元素都重复一次

```haskell
qDuplicate :: [a] -> [a]
```

<details>

<summary>答案</summary>

```haskell
qDuplicate :: [a] -> [a]
qDuplicate lst = qReverse (qDuplicateI lst [])
  where
    qDuplicateI :: [a] -> [a] -> [a]
    qDuplicateI [] acc = acc
    qDuplicateI (h : t) acc = qDuplicateI t (h : h : acc)
```

</details>

### Question 15

> **_Replicate the elements of a list a given number of times._**

将列表中每个元素都重复 `n` 次

```haskell
qReplicate :: [a] -> Int -> [a]
```

<details>

<summary>答案</summary>

```haskell
qReplicate :: [a] -> Int -> [a]
qReplicate lst n = qReverse (qReplicateI lst 0 [])
  where
    qReplicateI :: [a] -> Int -> [a] -> [a]
    qReplicateI [] _ acc = acc
    qReplicateI (h : t) k acc
      | n == k = qReplicateI t 0 acc
      | otherwise = qReplicateI (h : t) (k + 1) (h : acc)
```

</details>

### Question 16

> **_Drop every N'th element from a list._**

将列表中的 **每个第 `n` 个** 元素剔除

```haskell
qDropEveryNth :: [a] -> Int -> [a]
```

<details>

<summary>答案</summary>

```haskell
qDropEveryNth :: [a] -> Int -> [a]
qDropEveryNth lst n = qReverse (qDropEveryNthI lst 1 [])
  where
    qDropEveryNthI :: [a] -> Int -> [a] -> [a]
    qDropEveryNthI [] _ acc = acc
    qDropEveryNthI (h : t) k acc
      | k == n = qDropEveryNthI t 1 acc
      | otherwise = qDropEveryNthI t (k + 1) (h : acc)
```

</details>

### Question 17

> **_Split a list into two parts; the length of the first part is given._**

将列表分割成两个列表，其中第一个列表有 `n` 个元素

```haskell
qSplitAt :: [a] -> Int -> ([a], [a])
```

<details>

<summary>答案</summary>

```haskell
qSplitAt :: [a] -> Int -> ([a], [a])
qSplitAt lst n = qSplitAtI lst 0 []
  where
    qSplitAtI :: [a] -> Int -> [a] -> ([a], [a])
    qSplitAtI [] _ acc = (acc, [])
    qSplitAtI (h : t) k p
      | k == n = (qReverse p, h : t)
      | otherwise = qSplitAtI t (k + 1) (h : p)
```

</details>

### Question 18

> **_Extract a slice from a list._**

返回一个列表切片

```haskell
qSlice :: [a] -> Int -> Int -> [a]
```

<details>

<summary>答案</summary>

```haskell
qSlice :: [a] -> Int -> Int -> [a]
qSlice lst start end
  | start <= end = qReverse (qSliceI lst 1 [])
  | otherwise = []
  where
    qSliceI :: [a] -> Int -> [a] -> [a]
    qSliceI [] _ acc = acc
    qSliceI (h : t) k acc
      | k < start = qSliceI t (k + 1) acc
      | k <= end = qSliceI t (k + 1) (h : acc)
      | otherwise = acc
```

</details>

### Question 19

> **_Rotate a list N places to the left._**

将列表的前 `n` 个元素和后面元素翻转，负数表示倒数

```haskell
qRotate :: [a] -> Int -> [a]
```

<details>

<summary>答案</summary>

```haskell
qRotate :: [a] -> Int -> [a]
qRotate lst k
  | abs k > len = lst
  | otherwise = (\(a, b) -> b ++ a) (qSplitAt lst (mod k len))
  where
    len :: Int
    len = qLength lst
```

</details>

### Question 20

> **_Remove the K'th element from a list._**

删除列表中的第 `k` 个元素，返回这个元素和修改后的列表

```haskell
qRemoveAt :: [a] -> Int -> (a, [a])
```

<details>

<summary>答案</summary>

```haskell
qRemoveAt :: [a] -> Int -> (Maybe a, [a])
qRemoveAt lst k = qRemoveAtI lst 1 []
  where
    qRemoveAtI :: [a] -> Int -> [a] -> (Maybe a, [a])
    qRemoveAtI [] _ acc = (Nothing, qReverse acc)
    qRemoveAtI (h : t) n acc
      | n == k = (Just h, qReverse acc ++ t)
      | otherwise = qRemoveAtI t (n + 1) (h : acc)
```

</details>

## 测试用例

这一部分的测试代码如下：

<details>

<summary>测试代码</summary>

```haskell
module Part02 (part02) where

import Qarks.Nnp
  ( QCount (..),
    qDropEveryNth,
    qDuplicate,
    qEncodeModified,
    qRemoveAt,
    qReplicate,
    qRotate,
    qRunLengthDecode,
    qRunLengthEncodeDirect,
    qSlice,
    qSplitAt,
  )
import Test.Hspec
  ( context,
    describe,
    it,
    shouldBe,
  )
import Test.Hspec.Runner (SpecWith)

part02 :: SpecWith ()
part02 = describe "Part02" $ do
  context "Qarks.Nnp.qEncodeModified" $ do
    it "\"aaaabccaadeeee\"" $ do
      qEncodeModified "aaaabccaadeeee"
        `shouldBe` [ QMultiple 4 'a',
                     QSingle 'b',
                     QMultiple 2 'c',
                     QMultiple 2 'a',
                     QSingle 'd',
                     QMultiple 4 'e'
                   ]
  context "Qarks.Nnp.qRunLengthDecode" $ do
    it "[ QMultiple 4 'a', QSingle 'b', QMultiple 2 'c', QMultiple 2 'a', QSingle 'd', QMultiple 4 'e']" $ do
      qRunLengthDecode
        [ QMultiple 4 'a',
          QSingle 'b',
          QMultiple 2 'c',
          QMultiple 2 'a',
          QSingle 'd',
          QMultiple 4 'e'
        ]
        `shouldBe` "aaaabccaadeeee"
  context "Qarks.Nnp.qRunLengthEncodeDirect" $ do
    it "\"aaaabccaadeeee\"" $ do
      qRunLengthEncodeDirect "aaaabccaadeeee"
        `shouldBe` [ QMultiple 4 'a',
                     QSingle 'b',
                     QMultiple 2 'c',
                     QMultiple 2 'a',
                     QSingle 'd',
                     QMultiple 4 'e'
                   ]
  context "Qarks.Nnp.qDuplicate" $ do
    it "[1, 2, 3]" $ do
      qDuplicate [1 :: Int, 2, 3] `shouldBe` [1, 1, 2, 2, 3, 3]
  context "Qarks.Nnp.qReplicate" $ do
    it "\"abc\"" $ do
      qReplicate "abc" 3 `shouldBe` "aaabbbccc"
  context "Qarks.Nnp.qDropEveryNth" $ do
    it "3 of ['a' .. 'k']" $ do
      qDropEveryNth ['a' .. 'k'] 3 `shouldBe` "abdeghjk"
  context "Qarks.Nnp.qSplitAt" $ do
    it "3 of ['a' .. 'k']" $ do
      qSplitAt ['a' .. 'k'] 3 `shouldBe` ("abc", "defghijk")
  context "Qarks.Nnp.qSlice" $ do
    it "['a' .. 'k'] from 3 to 7" $ do
      qSlice ['a' .. 'k'] 3 7 `shouldBe` "cdefg"
  context "Qarks.Nnp.qRotate" $ do
    it "['a' .. 'h'] at 3" $ do
      qRotate ['a' .. 'h'] 3 `shouldBe` "defghabc"
    it "['a' .. 'h'] at -2" $ do
      qRotate ['a' .. 'h'] (-2) `shouldBe` "ghabcdef"
  context "Qarks.Nnp.qRemoveAt" $ do
    it "['a' .. 'd'] at 2" $ do
      qRemoveAt ['a' .. 'd'] 2 `shouldBe` (Just 'b', "acd")
```

</details>
