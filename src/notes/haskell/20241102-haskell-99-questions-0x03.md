# Haskell 99 Questions :: 0x03

<p class="archive-time">archive time: 2024-11-02</p>

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

---

> TODO
