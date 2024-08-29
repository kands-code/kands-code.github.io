# Rust 中的函数与闭包

<p class="archive-time">archive time: 2024-07-27</p>

<p class="sp-comment">这个算是刚接触 Rust 时最不适应的地方</p>

[[toc]]

Rust 最出名的地方就是其一直宣传的内存安全性，各种设计，包括所有权设计，都是为了内存安全服务，但是这就必然导致 Rust 在灵活性上要比其他语言要差一些

## 为什么用 Rust

刚开始写 Rust，最主要的就是被 **_MozillaML_** 这个外号吸引了，认为 Rust 就是一种语法比较另类的 ML 语言

事实也是，Rust 有许多函数式的性质，并且 `enum` 的设计以及模式匹配，无一不在加深“Rust 就是 ML 语言”的印象

但是当接触到 Rust 中的闭包，一下就意识到 Rust 就是 Rust

## 函数和闭包

除了像 C++ 和 Java 这种临时添加了函数式特性的，或者像 C 这种比较老的语言，大部分现代编程语言或多或少都支持闭包的性质，例如 Swift，Ruby

在这些支持闭包的语言中，一般都会说“函数就是一种特殊的全局闭包”，例如 [Swift](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/closures/)

但是 Rust 却不一样，在某些情况下，函数和闭包可以换着用，有的时候不行

而且闭包在使用和运行过程中和 Java 做法类似，即创建了一个 Closure 对象（Java 是 Lambda 对象），这个对象的类型是独有的，所以不能和函数通用[^1]

而且不同的泛型下，例如对于 `foo<U>()`，其中 `foo::<i32>` 和 `foo::<u32>` 是不同的类型

而且由于有所有权的概念，有些情况下，所有权检查器（borrow checker）会认为你的闭包“活不久”或者“所有权已经被转移”，这也是常见的错误

## 解决方法

但是 Rust 还算是支持函数式编程的，要怎么做呢？

这就要使用到 Rust 中的另一个内容， **_trait_**

函数类型都实现了 `Fn`、`FnMut`、`FnOnece`、`Copy`、`Clone`、`Send` 和 `Sync` 这些 trait[^2]，所以在想要既可以接收函数，又可以接收闭包的函数中，可以使用 `impl Fn`，或者使用 `Box<dyn Fn>` 也是可以的

## Fn，FnMut 还是 FnOnce

但是 trait 这么多，该用哪一个呢？

一般来说，用 Fn 就可以了，但是如果你的函数的状态会修改，那就需要使用 FnMut，如果你确定你的函数指使用一次，那就可以使用 FnOnce

**_Fn 作为参数_**

```rust
fn call_with_one<F>(func: F) -> usize
    where F: Fn(usize) -> usize {
    func(1)
}

let double = |x| x * 2;
assert_eq!(call_with_one(double), 2);
```

**_FnMut 作为参数_**

```rust
fn do_twice<F>(mut func: F)
    where F: FnMut()
{
    func();
    func();
}

let mut x: usize = 1;
{
    let add_two_to_x = || x += 2;
    do_twice(add_two_to_x);
}

assert_eq!(x, 5);
```

**_FnOnce 作为参数_**

```rust
fn consume_with_relish<F>(func: F)
    where F: FnOnce() -> String
{
    // `func` consumes its captured variables, so it cannot be run more
    // than once.
    println!("Consumed: {}", func());

    println!("Delicious!");

    // Attempting to invoke `func()` again will throw a `use of moved
    // value` error for `func`.
}

let x = String::from("x");
let consume_and_return_x = move || x;
consume_with_relish(consume_and_return_x);

// `consume_and_return_x` can no longer be invoked at this point
```

总结，Rust 的函数和闭包就是两种东西，但是我认为应该是可以变成一种的，即对于函数而言，捕获的环境是空的，闭包不是，检查的时候先检查捕获环境，再逐层向上检查即可

~~Rust 不这样设计一定有它自己的理由~~

[^1]:
    Closure types.The Rust Reference \[DB/OL\].
    [https://doc.rust-lang.org/reference/types/closure.html](https://doc.rust-lang.org/reference/types/closure.html),
    2021-07-27/2024-07-27

[^2]:
    Function item types.The Rust Reference \[DB/OL\].
    [https://doc.rust-lang.org/reference/types/function-item.html](https://doc.rust-lang.org/reference/types/function-item.html),
    2019-07-16/2024-07-27
