# Haskell 99 Questions :: 0x04

<p class="archive-time">archive time: 2024-12-08</p>

<p class="sp-comment">突然想起来这里还有个坑没有填，那我就继续写几道题目吧</p>

[[toc]]

有段时间没写了，所以今天我们继续写 $31 \sim 41$ 题

## 题目

### Question 31

> **_Determine whether a given integer number is prime._**

判断所给的数是否是素数，这个的难点在于效率，不过好在我们有很多方法可以减少判断的次数

```haskell
qIsPrime :: Word -> Bool
```

<details>

<summary>答案</summary>

```haskell
qIsPrime :: Word -> Bool
qIsPrime n
  | n < 2 = False
  | n == 2 = True
  | even n = False
  | otherwise = case n of
      2 -> True
      3 -> True
      _ -> not (any (\k -> n `mod` k == 0) [3, 5 .. ub])
  where
    ub :: Word
    ub = round (sqrt (fromIntegral n) :: Double)
```

</details>

### Question 32

> **_Determine the greatest common divisor of two positive integer numbers._**

计算两个数的最大公因数，这个在 Haskell 中实际上有内置函数，但是我们也可以用辗转相除法计算得到

```haskell
qGcd :: Int -> Int -> Int
```

<details>

<summary>答案</summary>

```haskell
qGcd :: Int -> Int -> Int
qGcd 0 m = m
qGcd n 0 = n
qGcd n m
  | n < 0 = qGcd (abs n) m
  | m < 0 = qGcd n (abs m)
  | otherwise =
      let r = (n `mod` m)
          d = m - r
       in qGcd r d
```

要注意这里 `r` 和 `d` 不能使用 `where` 方式定义，而是要使用 `let .. in` 形式，
因为 `where` 的计算会比判断要先一步，所以可能会没有取绝对值就进行计算，使用 `let .. in` 就没有这种问题

</details>

### Question 33

> **_Determine whether two positive integer numbers are coprime._**

判断所给的两个正整数是否是互质的

```haskell
qCoPrime :: Word -> Word -> Bool
```

<details>

<summary>答案</summary>

```haskell
qCoPrime :: Word -> Word -> Bool
qCoPrime 0 _ = False
qCoPrime _ 0 = False
qCoPrime n m =
  qGcd (fromIntegral n) (fromIntegral m)
    == 1
```

</details>

### Question 34

> **_Calculate Euler's totient function phi(m)._**

计算欧拉函数 $\phi(m)$，其中该函数定义为在 $[1, m)$ 中与 $m$ 互质的元素的个数

```haskell
qEulerPhi :: Word -> Word
```

<details>

<summary>答案</summary>

```haskell
qEulerPhi :: Word -> Word
qEulerPhi 0 = 0
qEulerPhi 1 = 1
qEulerPhi m =
  fromIntegral
    (qLength [r | r <- [1 .. m], qCoPrime m r])
```

</details>

### Question 35

> **_Determine the prime factors of a given positive integer._**

将所给正整数分解质因数

```haskell
qFactor :: Word -> [Word]
```

<details>

<summary>答案</summary>

```haskell
qFactor :: Word -> [Word]
qFactor 0 = [0]
qFactor 1 = [1]
qFactor 2 = [2]
qFactor 3 = [3]
qFactor n = qReverse (qFactorI n 2 [])
  where
    qFactorI :: Word -> Word -> [Word] -> [Word]
    qFactorI k m acc
      | m > k = acc
      | otherwise =
          if (qIsPrime m)
            then
              if (k `mod` m == 0)
                then qFactorI (k `div` m) m (m : acc)
                else
                  if m == 2
                    then qFactorI k (m + 1) acc
                    else qFactorI k (m + 2) acc
            else qFactorI k (m + 2) acc
```

但是这里还可以优化一下，也就是提前生成小于等于 `sqrt n` 的所有素数序列，这样可以跳过很多非质数，
不过生成这样一个素数列表也是需要一定的计算，所以这样就可以了

</details>

### Question 36

> **_Determine the prime factors and their multiplicities of a given positive integer._**

同样是分解质因数，但是要求结果形式是 `[(base, exp)]`

```haskell
qMulFactor :: Word -> [(Word, Word)]
```

<details>

<summary>答案</summary>

```haskell
qMulFactor :: Word -> [(Word, Word)]
qMulFactor n =
  map
    (\p -> (head p, fromIntegral (qLength p)))
    (qPack (qFactor n))
```

</details>

### Question 37

> **_Calculate Euler's totient function phi(m) (improved)._**

还是计算 $\phi(m)$，但是可以利用分解质因数来优化计算，即 $\prod{(b - 1) \times b ^ {(e - 1)}}$

```haskell
qEulerPhiF :: Word -> Word
```

<details>

<summary>答案</summary>

```haskell
qEulerPhiF :: Word -> Word
qEulerPhiF 0 = 0
qEulerPhiF 1 = 1
qEulerPhiF n =
  product
    ( map
        (\(p, m) -> (p - 1) * p ^ (m - 1))
        (qMulFactor n)
    )
```

</details>

### Question 39

> **_A list of prime numbers in a given range._**

根据所给范围创建素数列表

```haskell
qPrimesR :: Word -> Word -> [Word]
```

<details>

<summary>答案</summary>

```haskell
qPrimesR :: Word -> Word -> [Word]
qPrimesR n m
  | n > m = []
  | otherwise = [p | p <- [n .. m], qIsPrime p]
```

</details>

### Question 40

> **_Goldbach's conjecture._**

将所给正整数拆分成两个素数之和

```haskell
qGoldbach :: Word -> (Word, Word)
```

<details>

<summary>答案</summary>

```haskell
qGoldbach :: Word -> (Word, Word)
qGoldbach 0 = (0, 0)
qGoldbach 1 = (0, 1)
qGoldbach 2 = (0, 2)
qGoldbach 3 = (1, 2)
qGoldbach n = qGoldbachI (qPrimesR 2 (n `div` 2))
  where
    qGoldbachI :: [Word] -> (Word, Word)
    qGoldbachI [] = (0, 0)
    qGoldbachI (h : t) =
      if (qIsPrime (n - h))
        then (h, n - h)
        else qGoldbachI t
```

</details>

### Question 41

> **_A list of even numbers and their Goldbach compositions in a given range._**

将所给范围内的偶数拆分为两个素数之和

```haskell
qGoldbachR :: Word -> Word -> [(Word, Word)]

qGoldbachRF :: Word -> Word -> Word -> [(Word, Word)]
```

其中第三个参数是指分解后的两个素数都要大于所给的值

<details>

<summary>答案</summary>

```haskell
qGoldbachR :: Word -> Word -> [(Word, Word)]
qGoldbachR n m
  | odd n = qGoldbachR (n + 1) m
  | otherwise = map qGoldbach [n, n + 2 .. m]

qGoldbachRF :: Word -> Word -> Word -> [(Word, Word)]
qGoldbachRF n m k = [p | p@(p1, p2) <- (qGoldbachR n m), p1 > k && p2 > k]
```

</details>

## 测试用例

这一部分的测试代码如下：

<details>

<summary>测试代码</summary>

```haskell
module Part04 (part04) where

import Qarks.Nnp
  ( qCoPrime,
    qEulerPhi,
    qEulerPhiF,
    qFactor,
    qGcd,
    qGoldbach,
    qGoldbachR,
    qGoldbachRF,
    qIsPrime,
    qMulFactor,
    qPrimesR,
  )
import Test.Hspec
  ( context,
    describe,
    it,
    shouldBe,
    shouldNotSatisfy,
    shouldSatisfy,
  )
import Test.Hspec.Runner (SpecWith)

part04 :: SpecWith ()
part04 = describe "Part04" $ do
  context "Qarks.Nnp.qIsPrime" $ do
    it "7 is prime" $ do
      7 `shouldSatisfy` qIsPrime
    it "7919 is prime" $ do
      7919 `shouldSatisfy` qIsPrime
    it "7543 is not prime" $ do
      7543 `shouldNotSatisfy` qIsPrime
  context "Qarks.Nnp.qGcd" $ do
    it "gcd 36 63 is 9" $ do
      qGcd 36 63 `shouldBe` 9
    it "gcd (-3) (-6) is 3" $ do
      qGcd (-3) (-6) `shouldBe` 3
    it "gcd 7919 7541 is 1" $ do
      qGcd 7919 7541 `shouldBe` 1
  context "Qarks.Nnp.qCoPrime" $ do
    it "35 and 64 is coprime" $ do
      qCoPrime 35 64 `shouldBe` True
    it "35 and 65 is not coprime" $ do
      qCoPrime 35 65 `shouldBe` False
  context "Qarks.Nnp.qEulerPhi" $ do
    it "phi(10) = 4" $ do
      qEulerPhi 10 `shouldBe` 4
    it "phi(1) = 1" $ do
      qEulerPhi 1 `shouldBe` 1
    it "phi(73) = 72" $ do
      qEulerPhi 73 `shouldBe` 72
  context "Qarks.Nnp.qFactor" $ do
    it "factor 315 = [3, 3, 5, 7]" $ do
      qFactor 315 `shouldBe` [3, 3, 5, 7]
    it "factor 864 = [2, 2, 2, 2, 2, 3, 3, 3]" $ do
      qFactor 864 `shouldBe` [2, 2, 2, 2, 2, 3, 3, 3]
  context "Qarks.Nnp.qMulFactor" $ do
    it "factor 315 = 3^2 * 5^1 * 7^1" $ do
      qMulFactor 315 `shouldBe` [(3, 2), (5, 1), (7, 1)]
    it "factor 864 = 2^5 * 3^3" $ do
      qMulFactor 864 `shouldBe` [(2, 5), (3, 3)]
  context "Qarks.Nnp.qEulerPhiF" $ do
    it "phi(10) = 4" $ do
      qEulerPhiF 10 `shouldBe` 4
    it "phi(1) = 1" $ do
      qEulerPhiF 1 `shouldBe` 1
    it "phi(73) = 72" $ do
      qEulerPhiF 73 `shouldBe` 72
  context "Qarks.Nnp.qPrimesR" $ do
    it "[10, 20]" $ do
      qPrimesR 10 20 `shouldBe` [11, 13, 17, 19]
  context "Qarks.Nnp.qGoldbach" $ do
    it "28 = 5 + 23" $ do
      qGoldbach 28 `shouldBe` (5, 23)
    it "16 = 3 + 13" $ do
      qGoldbach 16 `shouldBe` (3, 13)
  context "Qarks.Nnp.qGoldbachR" $ do
    it "evens between 9 and 20" $ do
      qGoldbachR 9 20 `shouldBe` [(3, 7), (5, 7), (3, 11), (3, 13), (5, 13), (3, 17)]
  context "Qarks.Nnp.qGoldbachRF" $ do
    it "evens between 1 and 2000 greater than 50" $ do
      qGoldbachRF 1 2000 50 `shouldBe` [(73, 919), (61, 1321), (67, 1789), (61, 1867)]
```

</details>
