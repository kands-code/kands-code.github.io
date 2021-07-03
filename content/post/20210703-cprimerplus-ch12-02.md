---
title: "*C Primer Plus* Chapter12 02"
date: 2021-07-03T10:15:14+08:00
draft: false
summary: "今天我们来看看C中的随机过程"
katex: true
mermaid: true
comments: true
tags: ["C Primer Plus", "C", "Random", "Notes"]
categories: ["Notes", "C"]
dropCap: false
indent: false
---

前几个小节，我们介绍了有关C语言中的一些存储类型和作用域问题，但是有关进程线程的问题并没有在 *C Primer Plus* 这本书中提起，所以还有个`_Thread_local`及其相关类型，我们不去提他们

今天我们来看看C中的随机过程

## Storage Classes, Linkage, and Memory Management

### 随机数函数与静态变量

#### 词汇表

- despite prep. 尽管, 即使 n. 怨恨, 侮辱
- intention n. 意图
- contrary n. 相反
- indiscriminately adj. 不分青红皂白的, 不加分析的
- superficial adj. 肤浅的
- inadvertent adj. 疏忽的
- spontaneity n. 自发性; 自然发生

#### `rand()` 函数

在 *ANSI C* 中为我们提供了一个很方便的生成随机数，或者说 *伪随机数* 的函数`rand()`

这个函数允许我们在不同的系统中生成合适的随机数，同时也允许我们能够在不同系统生成**相同的随机数**以保证程序的准确性

为什么说相同的随机数呢？这就是称生成的随机数为 *伪随机数* 的原因的，他并非完全随机，而是通过一定的算法来模拟 (simulation) 这样一个随机过程，所以这样的随机过程是可以预测的 (predictable)

现在，我们来尝试着使用 *ANSI C* 可移植版本 (portable version) 的标准来实现一个自己的随机函数

这个随机过程始于一个特殊的数，称之为`seed`，这个函数就是通过`seed`来生成一个数，这个数再作为一个新的`seed`被使用，就生成了新的随机数

为了实现这一构想，我们需要记住`seed`的值，可以使用静态变量，同时我们为了不影响到其他函数，我们需要将其设置为内部链接 (internal linkage)，下面是一个简单的例子

```c
/* rand0.c -- produces random numbers          */
/*              uses ANSI C portable algorithm */
static unsigned long int next = 1; /* the seed */

int rand0(void)
{
/* magic formula to generate pseudorandom number */
    next = next * 110351524 + 12345;
    return (unsigned int) (next / 65536) % 32768;
}
```

静态变量`next`始于`1`，通过 *magic formula* 在 0 到 32767 里变化 (alter)

为什么不将其设置为 *static with no linkage* 呢？这是因为之后我们会对这个函数，或者说程序，进行拓展，其他函数也需要能够访问到`seed`的值

下面是一个简单的测试 (simple driver)

```c
/* r_drive0.c -- test the rand0() function */
/* compile with rand0.c                     */
#include <stdio.h>
extern int rand0(void);

int main(void) {
    int count;

    for (count = 0; count < 5; count++) {
        printf("%d\n", rand0());
    }

    return 0;
}
```

> 编译指令以clang为例 `clang rand0.c r_drive0.c -o r_drive0`

如果你运行程序，你会发现得到的数字还是很随机的，但多次运行程序你会发现得到的结果都是一样的，这就是 *伪随机* 的意思了

#### `srand()`函数

想要让我们的程序不太一样，我们需要改变每次执行程序的`seed`值，所以我们需要一个播种函数，我们可以引入第二个函数`srand1()`来完成播种的操作

```c
/* s_and_r.c -- file for rand1() and srand1()   */
/*                use ANSI C portable algorithm */
static unsigned long int next = 1;  /* the seed */

int rand1(void) {
/* magic formula to generate pseudorandom number */
    next = next * 1103515245 + 12345;
    return (unsigned int) (next / 65536) % 32768;
}

void srand1(unsigned int seed) {
    next = seed;
}
```

这就是我们添加的函数，为我们的`seed`，在这里即`next`，赋值，下面是对应的测试程序

```c
/* r_drive1.c -- test rand1() and srand1() */
/* compile with s_and_r.c                  */
#include <stdio.h>
extern void srand1(unsigned int x);
extern int rand1(void);

int main(void) {
    int count;
    unsigned seed;

    printf("Please enter your choice for seed.\n");
    while (scanf("%u", &seed) == 1) {
        srand1(seed);       /* reset seed */
        for (count = 0; count < 5; count++)
            printf("%d\n", rand1());
        printf("Please enter next seed (q to quit):\n");
    }
    printf("Done\n");

    return 0;
}
```

> 编译指令以clang为例 `clang s_and_r.c r_drive1.c -o r_drive1`

在这个测试程序中，我们使用`scanf()`读取我们输入的值作为`seed`，这样，每次循环我们得到的都是不一样的值，但是如果我们两次输入的`seed`都是一样的话，那就会生成一样的随机数

#### Automated Reseeding

If your C implemnetation gives you access to some changing quantity, such as the system clock, you can use that value (possible truncated) to initialize the seed value. For instance, *ANSI C* has a `time()` function that returns the system time. The time units are system dependent, but what matters here is that the return value is an arithmetic type and that its value changes with time. The exact type is system dependent and is given the label `time_t`, but you can use a type cast. Here's the basic setup:

```c
#include <time.h>   /* ANSI prototype for time() */
    srand((unsigned int) time(0))   /* initialize seed */
```

In general, `time()` takes an argument that is the address of a type `time_t` object. In that case, the time value is also stored at that address. However, you can pass the null pointer (0) as an argument, in which case the value is supplied only through the return value mechanism.

上面这一段话就是说我们可以使用一个可变量作为播种的值，通常是系统时间，在 *ANSI C* 中可以通过`time()`函数来使用

不仅是我们自己实现的`rand1()`和`srand1()`，对于标准库里的`rand()`和`srand()`我们也可以使用类似的做法来生成随机数

---

好，本次博客到这里暂时告一段落，谢谢大家阅读
