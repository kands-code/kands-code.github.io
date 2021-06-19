---
title: "一个有趣的例子"
date: 2021-06-19T11:43:07+08:00
lastmod: 2021-06-19T11:43:07+08:00
draft: false
summary: "很久没更新了，今天我们就来看一个比较有趣的编程小例子"
katex: true
mermaid: true
comments: true
tags: ["Go", "C", "Rust", "Python", "Examples"]
categories: ["Miscellany", "Coding"]
dropCap: false
indent: false
---

有一段时间没有更新博客了，主要也是因为没时间看书，要<ruby>复习考试<rp>(</rp><rt>疯 狂 摸 鱼</rt><rp>)</rp></ruby>，但是最近又在慢慢开始学习编程这一块的东西了，博客也会慢慢恢复更新的

## 题目

首先来看看这道有趣的题目，这道题既不是 *算法题* 也不是 *面试题* 什么的，就是单纯的一道练习编程语言语法的题目，不过题目还算有意思，就稍微写一下，看看用不同语言来实现是什么样子的

不过我的编程技术还是很菜，所以我使用的不一定就是最优解，所以不需要太过于纠结

### 题目内容

> 原题是`go`语言的一道题，相关概念不同语言可能不一样

> 括号内数字代表的是字符长度

假设我们要去火星，但是有多条航线，每条航线的时间、票的类型 (单程、往返)、价格都不同:

- 使用 变量、常量、switch、if、for、fmt、math/rand 等编写这个程序。随机生成格式如<ruby>右表<rp>(</rp><rt>下表<rt><rp>)</rp></ruby>所示的 10 条数据

- 一共四列

- Spaceline 就是航空公司:

    - Space Adventure (15)

    - SpaceX (6)

    - Virgin Galactic (15)

- Days 是指到火星**单程**所需的天数

    - 距离火星`62_100_000`公里

    - 速度随机生成 \[16, 30\] km/s

- Trip-type 就是指单程 (One-way) 还是往返 (Round-trip) (10)

- Price 的单位是百万美元，随机生成，**单程** \[36, 50\] 之间

### 表格格式

这就是要输出的格式了

```
Spaceline       Days Trip-type  Price
=====================================
Virgin Galactic   23 Round-trip $  96
Virgin Galactic   39 One-way    $  37
SpaceX            31 One-way    $  41
Space Adventure   22 Round-trip $ 100
Space Adventure   22 One-way    $  50
Virgin Galactic   30 Round-trip $  84
Virgin Galactic   24 Round-trip $  94
Space Adventure   27 One-way    $  44
Space Adventure   28 Round-trip $  86
SpaceX            41 Round-trip $  72
```

## 实现

下面就是我的代码实现了

### `Go`语言

本来就是道`Go`语言的题目，所以这里我就是先用`Go`来实现一遍

```go
package main

import (
        "fmt"
        "time"
        "math/rand"
)

func main() {
    // 输出表头
    fmt.Println("Spaceline       Days Trip-type  Price")
    fmt.Println("=====================================")

    // 使用系统时间作为seed
    rand.Seed(time.Now().Local().Unix())

    var (
            spaceline = "Spaceline"
            velocity = 0
            trip_type = "One-way"
            price = 0
        )

    // 使用for循环来生成内容
    for i:= 0; i < 10; i++ {
        // 使用 `rand.Intn()` 来生成随机整数
        velocity = rand.Intn(15) + 16
        price = rand.Intn(15) + 36

        switch rand.Intn(3) {
        case 0:
            spaceline = "Space Adventure"
        case 1:
            spaceline = "SpaceX"
        case 2:
            spaceline = "Virgin Galactic"
        default:
            fmt.Println("Error!")
        }

        days := 62100000.0 / velocity / 60.0 / 60 / 24

        switch rand.Intn(2) {
        case 0:
            trip_type = "One-way"
        case 1:
            trip_type = "Round-trip"
            price *= 2
        default:
            fmt.Println("Error!")
        }

        fmt.Printf("%-15v %4v %-10v $%4v\n", spaceline, days, trip_type, price)
    }
}
```

> 话说`Go`竟然不会自动采取系统时间作为种子，好屑啊

### `Rust`实现

接下来就是`Rust`的实现方案了

```rust
use rand::{Rng, thread_rng};

fn main() {
    // 输出表头
    println!("Spaceline       Days Trip-type  Price");
    println!("=====================================");

    for _i in 0..10 {
        let spaceline = match thread_rng().gen_range(0..3) {
            0 => "Virgin Galactic",
            1 => "Space Adventure",
            2 => "SpaceX",
            _ => panic!("Error")
        };

        let velocity = thread_rng().gen_range(16..=30);
        let mut price = thread_rng().gen_range(36..=50);
        let days = 62100000 / velocity / 3600 / 24;

        let trip_type = match thread_rng().gen_range(0..2) {
            0 => "One-way",
            1 => {
                price *= 2;
                "Round-trip"
            },
            _ => panic!("Error")
        };

        println!("{:15} {:>4} {:10} ${:4}", spaceline, days, trip_type, price)
    }
}
```

比起`Go`语言来说，的确是简洁了点

### `Python`实现

接下来就是`Python`的方案

```python
#! /usr/bin/python3

import random
import math

# 主函数
if __name__ == "__main__":
    print("Spaceline       Days Trip-type  Price")
    print("=====================================")

    for i in range(10):
        spaceline = random.choice(
            ["Virgin Galactic", "SpaceX", "Space Adventure"])

        velocity = random.randint(16, 30)
        price = random.randint(36, 50)
        days = math.ceil(62100000 / velocity / 3600 / 24)

        trip_type = random.choice(["One-way", "Round-trip"])
        if trip_type == "Round-trip":
            price = price * 2

        print(f"{spaceline:15} {days:>4} {trip_type:10} ${price:4}")
```

### `C`实现

最后就是C语言版本

```c
#include <stdio.h> // for printf()
#include <stdlib.h> // for rand() and srand()
#include <string.h> // for strcmp()
#include <math.h> // for ceil()
#include <time.h> // for time()

int main(void) {
    // srand
    srand((unsigned) time(NULL));

    puts("Spaceline       Days Trip-type  Price");
    puts("=====================================");

    int i = 0;
    for(i = 0; i < 10; ++i) {
        char * spaceline;
        switch (rand() % 3) {
            case 0:
                spaceline = "Space Adventure";
                break;
            case 1:
                spaceline = "SpaceX";
                break;
            case 2:
                spaceline = "Virgin Galactic";
                break;
            default:
                exit(-1); // error, exit
        }

        char * trip_type;
        switch (rand() % 2) {
            case 0:
                trip_type = "One-way";
                break;
            case 1:
                trip_type = "Round-trip";
                break;
            default:
                exit(-1); // error exit
        }

        int velocity = rand() % 15 + 16;
        int price = rand() % 15 + 36;
        int days = ceil(62100000.0 / velocity / 3600 / 24);

        if (!strcmp(trip_type, "Round-trip")) price *= 2;

        printf("%-15s %4d %-10s $%4d\n", spaceline, days, trip_type, price);
    }

    return 0;
}
```

---

难得有时间写博客，就分享一道题给大家，希望能给你们一点帮助
