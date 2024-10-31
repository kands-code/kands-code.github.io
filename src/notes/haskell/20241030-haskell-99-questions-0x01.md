# Haskell 99 Questions :: 0x01

<p class="archive-time">archive time: 2024-10-30</p>

<p class="sp-comment">闲来无事，来练习一下 Haskell</p>

[[toc]]

## 缘起

我最近不知为何突然喜欢上了 [Tsoding](https://www.youtube.com/@TsodingDaily) 的视频，
其中 [有一期视频](https://www.youtube.com/watch?v=9nik-50ET3Q) 提到了 [99 questions](https://wiki.haskell.org/99_questions)，
那么我也就顺便来做一下吧

## 准备

我打算使用 Haskell 来解决这些问题，
实际上，基本所有的支持函数式编程的语言（包括 **_C 语言_**）都能解决这些问题，
只是有些语言实现起来方便一些罢了

但是如果仔细看里面的问题的话就会发现，其中还有随机数这种问题，
虽然我们可以通过某些算法来生成一些不那么随机的伪随机数，
但是更加方便的方案还是调用 [random 库](https://hackage.haskell.org/package/random-1.2.1.2/docs/System-Random.html)，
不过这就要求我们需要创建一个 Haskell 项目才行

不过我们还有一种方法，那就是读取 `/dev/random` 文件，具体实现如下：

```haskell
module Qarks.Random (readRandomBytes) where

import Data.Word (Word8)
import Foreign.Marshal.Alloc (mallocBytes)
import Foreign.Ptr (plusPtr)
import Foreign.Storable (peek)
import System.IO (IOMode (..), hClose, hGetBuf, openFile)

readRandomBytes :: Int -> IO [Word8]
readRandomBytes n = do
  handle <- openFile "/dev/random" ReadMode
  buf <- mallocBytes n
  _ <- hGetBuf handle buf n
  bytes <- mapM (peek . plusPtr buf) [0 .. (n - 1)]
  hClose handle
  return bytes
```

使用 `Foreign` 是为了避免读取到非法字符编码出错，所以读取字节，
最后返回的是一个 `Word8` 列表，可以通过其他方法把这些数字变成具体的想要随即的内容，例如浮点数或字符

## 题目

### Question 01

> **_Find the last element of a list._**

返回列表中的最后一个元素，空列表返回 `Nothing`

```haskell
qLastOne :: [a] -> Maybe a
```

<details>
    
<summary>答案</summary>

```haskell
qLastOne :: [a] -> Maybe a
qLastOne [] = Nothing
qLastOne [e] = Just e
qLastOne (_ : t) = qLastOne t
```

</details>

### Question 02

> **_Find the last-but-one (or second-last) element of a list._**

返回列表中的倒数第二个元素，
列表元素长度小于 `2` 返回 `Nothing`

```haskell
qLastTwo :: [a] -> Maybe a
```

<details>
    
<summary>答案</summary>

```haskell
qLastTwo :: [a] -> Maybe a
qLastTwo [] = Nothing
qLastTwo [_] = Nothing
qLastTwo [e, _] = Just e
qLastTwo (_ : t) = qLastTwo t
```

</details>

### Question 03

> **_Find the K-th element of a list._**

返回第 `K` 位元素，
列表长度小于 `K` 返回 `Nothing`，`K` 从 `1` 开始

```haskell
qKthElement :: [a] -> Int -> Maybe a
```

<details>
    
<summary>答案</summary>

```haskell
qKthElement :: [a] -> Int -> Maybe a
qKthElement (e : _) 1 = Just e
qKthElement [] _ = Nothing
qKthElement (_ : t) k
  | k < 1 = Nothing
  | otherwise = qKthElement t (k - 1)
```

</details>

### Question 04

> **_Find the number of elements in a list._**

返回列表长度，这个比较直接

```haskell
qLength :: [a] -> Int
```

<details>
    
<summary>答案</summary>

```haskell
qLength :: [a] -> Int
qLength lst = qLengthI lst 0
  where
    qLengthI :: [a] -> Int -> Int
    qLengthI [] n = n
    qLengthI (_ : t) n = qLengthI t (n + 1)
```

</details>

### Question 05

> **_Reverse a list._**

翻转列表

```haskell
qReverse :: [a] -> [a]
```

<details>
    
<summary>答案</summary>

```haskell
qReverse :: [a] -> [a]
qReverse [] = []
qReverse lst = qReverseI lst []
  where
    qReverseI :: [a] -> [a] -> [a]
    qReverseI [] acc = acc
    qReverseI (h : t) acc = qReverseI t (h : acc)
```

</details>

### Question 06

> **_Find out whether a list is a palindrome._**

判断列表是否是回文列表

```haskell
qIsPalindrome :: (Eq a) => [a] -> Bool
```

<details>
    
<summary>答案</summary>

```haskell
qIsPalindrome :: (Eq a) => [a] -> Bool
qIsPalindrome lst = lst == qReverse lst
```

</details>

### Question 07

> **_Flatten a nested list structure._**

将一个嵌套结构的列表摊平，也就是变成一维结构

```haskell
data QNestedList a = QElem a | QList [QNestedList a]

qFlatten :: QNestedList a -> [a]
```

<details>
    
<summary>答案</summary>

```haskell
data QNestedList a = QElem a | QList [QNestedList a]

qFlatten :: QNestedList a -> [a]
qFlatten (QElem e) = [e]
qFlatten (QList nlst) = qReverse (qFlattenI nlst [])
  where
    qFlattenI :: [QNestedList a] -> [a] -> [a]
    qFlattenI [] acc = acc
    qFlattenI (QElem e : t) acc = qFlattenI t (e : acc)
    qFlattenI (QList qlst : t) acc = qFlattenI t (qFlattenI qlst [] ++ acc)
```

</details>

### Question 08

> **_Eliminate consecutive duplicates of list elements._**

将连续的重复元素合并成一个

```haskell
qCompress :: (Eq a) => [a] -> [a]
```

<details>
    
<summary>答案</summary>

```haskell
qCompress :: (Eq a) => [a] -> [a]
qCompress lst = qCompressI lst []
  where
    qCompressI :: (Eq a) => [a] -> [a] -> [a]
    qCompressI [] acc = acc
    qCompressI [e] acc = e : acc
    qCompressI (x : y : t) acc =
      qCompressI
        (y : t)
        (if x == y then acc else x : acc)
```

</details>

### Question 09

> **_Pack consecutive duplicates of list elements into sublists._**

将重复元素合并成一个子列表

```haskell
qPack :: (Eq a) => [a] -> [[a]]
```

<details>
    
<summary>答案</summary>

```haskell
qPack :: (Eq a) => [a] -> [[a]]
qPack lst = qReverse (qPackI lst [] [])
  where
    qPackI :: (Eq a) => [a] -> [a] -> [[a]] -> [[a]]
    qPackI [] p acc = p : acc
    qPackI (h : t) [] acc = qPackI t [h] acc
    qPackI (h : t) (x : xs) acc
      | h == x = qPackI t (h : x : xs) acc
      | otherwise = qPackI t [h] ((x : xs) : acc)
```

</details>

### Question 10

> **_Run-length encoding of a list._**

利用 Question 9 的结果来实现 **_Run-length_** 编码

```haskell
qRunLengthEncode :: (Eq a) => [a] -> [(Int, a)]
```

<details>
    
<summary>答案</summary>

```haskell
qRunLengthEncode :: (Eq a) => [a] -> [(Int, a)]
qRunLengthEncode lst = map (\p -> (qLength p, head p)) (qPack lst)
```

</details>

## 测试用例

我这里使用了 hspec 测试框架来测试结果，具体的测试代码如下：

<details>

<summary>测试代码</summary>

```haskell
module Main (main) where

import Qarks.Nnp
  ( QNestedList (..),
    qCompress,
    qFlatten,
    qIsPalindrome,
    qKthElement,
    qLastOne,
    qLastTwo,
    qLength,
    qPack,
    qReverse,
    qRunLengthEncode,
  )
import Test.Hspec (describe, hspec, it, shouldBe, shouldNotSatisfy, shouldSatisfy)

main :: IO ()
main = hspec $ do
  describe "Qarks.Nnp.qLastOne" $ do
    it "[1 .. 4]" $ do
      qLastOne [1 .. 4] `shouldBe` Just (4 :: Int)
    it "['a' .. 'z']" $ do
      qLastOne ['a' .. 'z'] `shouldBe` Just 'z'
  describe "Qarks.Nnp.qLastTwo" $ do
    it "[1 .. 4]" $ do
      qLastTwo [1 .. 4] `shouldBe` Just (3 :: Int)
    it "['a' .. 'z']" $ do
      qLastTwo ['a' .. 'z'] `shouldBe` Just 'y'
  describe "Qarks.Nnp.qKthElement" $ do
    it "2-nd of [1, 2, 3]" $ do
      qKthElement [1, 2, 3] 2 `shouldBe` Just (2 :: Int)
    it "5-th of \"haskell\"" $ do
      qKthElement "haskell" 5 `shouldBe` Just 'e'
  describe "Qarks.Nnp.qLength" $ do
    it "[123, 456, 789]" $ do
      qLength [123 :: Int, 456, 789] `shouldBe` 3
    it "\"Hello, world!\"" $ do
      qLength "Hello, world!" `shouldBe` 13
  describe "Qarks.Nnp.qReverse" $ do
    it "\"A man, a plan, a canal, panama!\"" $ do
      qReverse "A man, a plan, a canal, panama!"
        `shouldBe` "!amanap ,lanac a ,nalp a ,nam A"
    it "[1 .. 4]" $ do
      qReverse [1 .. 4] `shouldBe` [4 :: Int, 3, 2, 1]
  describe "Qarks.Nnp.qIsPalindrome" $ do
    it "[1, 2, 3]" $ do
      [1 :: Int, 2, 3] `shouldNotSatisfy` qIsPalindrome
    it "\"madamimadam\"" $ do
      "madamimadam" `shouldSatisfy` qIsPalindrome
    it "[1, 2, 4, 8, 16, 8, 4, 2, 1]" $ do
      [1 :: Int, 2, 4, 8, 16, 8, 4, 2, 1] `shouldSatisfy` qIsPalindrome
  describe "Qarks.Nnp.qFlatten" $ do
    it "QElem 5" $ do
      qFlatten (QElem 5) `shouldBe` [5 :: Int]
    it "QList [QElem 1, QList [QElem 2, QList [QElem 3, QElem 4], QElem 5]]" $ do
      qFlatten (QList [QElem 1, QList [QElem 2, QList [QElem 3, QElem 4], QElem 5]])
        `shouldBe` [1 :: Int .. 5]
    it "QList []" $ do
      qFlatten (QList []) `shouldBe` ([] :: [Int])
  describe "Qarks.Nnp.qCompress" $ do
    it "\"aaaabccaadeeee\"" $ do
      qCompress "aaaabccaadeeee" `shouldBe` "abcade"
  describe "Qarks.Nnp.qPack" $ do
    it "\"aaaabccaadeeee\"" $ do
      qPack "aaaabccaadeeee"
        `shouldBe` ["aaaa", "b", "cc", "aa", "d", "eeee"]
  describe "Qarks.Nnp.qRunLengthEncode" $ do
    it "\"aaaabccaadeeee\"" $ do
      qRunLengthEncode "aaaabccaadeeee"
        `shouldBe` [(4, 'a'), (1, 'b'), (2, 'c'), (2, 'a'), (1, 'd'), (4, 'e')]
```

<details>
