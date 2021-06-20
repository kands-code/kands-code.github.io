---
title: "*C Primer Plus* Chapter12 01"
date: 2021-06-20T21:52:23+08:00
lastmod: 2021-06-20T21:52:23+08:00
draft: false
summary: "我们继续学习C Primer Plus"
katex: true
mermaid: true
comments: true
tags: ["C Primer Plus", "C", "Storage", "Scope"]
categories: ["Notes", "C"]
dropCap: false
indent: false
---

在之前的博客里，我已经将 *C Primer Plus* 的上本，也就是ch01到ch11，已经讲完了，相关代码已经存在了我的github上，大家有兴趣可以翻翻我的课后习题题解，虽然不是最优解，但是也算个思路

而ch12之后的内容，也就是下本，我也出过几期，但是零零散散，不成体系，而且没留下什么痕迹，所以现在从ch12开始将 *C Primer Plus* 学完

我这个系列基本上算是我将原文以自己的理解翻译一遍，再在需要提醒的地方点出来，所以主要是我个人的总结，希望对你们也能有所帮助

# Storage Classes, Linkage, and Memory Management

## 本章内容

你将会学习到一下内容：

- 关键字：

    `auto`, `extern`, `static`, `register`, `const`, `volatile`, `restricted`, `_Thread_local`, `_Atomic`

- 函数：

    `rand()`, `srand()`, `time()`, `malloc()`, `calloc()`, `free()`

- 如何在C语言中界定一个变量的作用域 (scope) 以及其生命周期 (lifetime)

- 设计更为复杂的程序

## 存储类别

### 词汇表

- go over 仔细检查; 用心思考

- appropriate adj. 合适的; 恰当的 v. 盗用; 挪用; 占用

- encompass v. 包含, 涉及

- designate v. 命名, 指定; adj. 未就职的

- capable adj. 有能力的; 足以胜任的

### Object

在C语言的术语里，`Object`并不是像某些 *OOP* 的语言一样指的是类的具体化 (instance) 的所谓的**对象**，而是只存储了值的**一块 (a chunck of) 内存**，一块内存可以存储一个或多个值，也可能没有存储值，但是有合适的 (appropriate) 空间能够存储对应的值

也就是说，C的Object只包含 (encompass) Data部分，而不含操作，而 *OOP* 中的对象则是既包含数据本身，还包含了对数据允许的 (permissible) 操作

以上是硬件层面，在软件层 (software aspect)，或者说代码上，需要一种操作Object的方式，这可以通过**声明** (declare) 变量来实现

```c
int entity = 3;
```

这样一个声明的动作 *生成 (create)* 了一个标<ruby><rp>(</rp>识<rt>$zh\grave{\text{\i}}$</rt><rp>)</rp></ruby>符 (identifier) `entity`

标识符可以看作是给Object取了个名字 (designate) 以方便我们操作Object

除了给变量命名外，还有其他方式供我们操作Object，比如

```c
int * pt = &entity;
int ranks[10];
```

在这里面，`pt`是个标识符，存储了一个地址指向了`entity`这样一个变量，或者说一个Object

类似的，`*pt`不是标识符，但同样，它也被指定了一块空间，也就是`entity`所在的那块空间

> An expression that designate an object is called an **lvalue**

所以`*pt`和`entity`是 *左值*，类似的，`*(ranks + 2 * entity)`也是个左值，`ranks`就是个很好的例子说明了 *并没有存储值，但是有合适的空间存储相应的值*，这里，`ranks`能够存储10个`int`值，每个`int`值也是一个Object

大部分左值是可以修改的 (modifiable)，但不是所有的左值都可以修改，例如

```c
const char * pc = "Behold a string literal!";
```

这里字符串字面值本身就是一个左值，但是不可修改，而`*pc`对应着`'B'`这样一个字符，也是个左值，但是同样不可修改

> 目前一个比较统一的说法，左值就是有名字的，可以取地址的值，反之即为右值

要描述Object，可以通过 *storage duration* 来描述，关于存储时间，也就是说这个值可以在内存中呆多久

而对于 *用于访问 (access) Object的* 标识符的可见性 (visible)，你可以通过 *scope* 以及 *linkage* 来描述

### Scope

作用域，也就是说一个变量或者标识符可以被访问到的范围，或者说这个标识符的有效范围，大致可以分为以下几种

- Block Scope
- Functiom Scope
- Function Prototype Scope
- File Scope

块作用域可以通过大括号来看，对于一个在有大括号界定的范围内，从这个变量被声明到大括号结束，就是这个变量的块作用域

函数作用域也是一种块作用域，特指函数中定义的参数的作用域

而函数原型作用域就是说名在函数原型中参数的名称**无所谓**，因为出了原型就没用了

文件作用域，或者说编译单元作用域，简单来看就是在一个`.o`文件内都可以生效，这里的 *文件* 是对于编译器而言的一个文件

一般而言，在大括号外定义的变量都具有文件作用域，具体的分类之后有个表可以参照

#### Translation Units and Files

When you view as several files may appear to the compiler as a single file. For example, suppose that, as often is the case, you include one or more header files (.h extension) in a source code file (.c extension). A header file, in turn, may include other header files. So several separate physical files may be involved. However, C preprocessing essentially replaces an `#include` directive with the contents of the header file. Thus the compiler sees a single file is containing information from your source code file and all the header files. This single file is called a *translation unit`. When we describe a variable as having file scope, it's actually visible to the whole translation unit. If your program consists of several source code files, then it will consist of several translation units, with each translation unit corresponding to a source code and its included files.

### Linkage

> 对于Linkage，我将其翻译为 *链接*，不知道在其他译本里称为什么

对于链接，在C语言中可以分为以下三类

- external linkage
- internal linkage
- no linkage

对于拥有文件作用域的标识符而言，既可能是外部链接，也可能是内部链接

如果一个变量或标识符有外部链接的话，就可以用于多个程序，或者说在多个编译单元内使用，而内部链接则只能在单个编译单元内访问使用

一般，全局作用域 (global scope) 或程序作用域 (program scope) 用于称呼 *file scope with external linkage*，而文件作用域 (file scope) 特指 *file scope with internal scope*，这些都是不标准 (informal) 的术语，但是比较常用

一般对于外部定义的变量，都是具有外部链接的，但是加上`static`关键字后就变为了内部链接

```c
int giants = 5; // file scope with external linkage
static int dodgers = 3; // file scope with internal linkage
int main() {
    ...
}
```

而对于非文件作用域的标识符是**没有链接**的

### Storage Duration

存储时间，这个是硬件层面描述一个值 (Object) 能够在内存中存在 (stay) 多久，或者说可以通过某标识符**被访问到**的时间 (persistence)，大致可分为 *static* 和 *automatic* 两类

static就是说在整个程序的执行期间都存在，都能够被访问到，而automatic就是说在某个函数[^1]结束后就被自动释放了

还有个 *Thread storage duration*，但是这本书不讲，就跳过，感兴趣的可以自己查查，是通过`_Thread_local`关键字定义的文件作用域变量会具有这样一个存储时间，自其被声明到线程结束 (termiante) 为止

#### Automatic Variables

块作用域的变量默认拥有`Automatic`周期，你也可以显式使用`auto`关键字用于区分外部变量以及内部变量

关于变量隐藏 (hide)，作用域小的同名变量会隐藏作用域大的同名变量，详情参考`chapter12/hiding.c`

```c
// hiding.c -- variables in blocks
#include <stdio.h>
int main()
{
    int x = 30;         // original x

    printf("x in outer block: %d at %p\n", x, &x);
    {
        int x = 77;     // new x, hides first x
        printf("x in inner block: %d at %p\n", x, &x);
    }
    printf("x in outer block: %d at %p\n", x, &x);
    while (x++ < 33)    // original x
    {
        int x = 100;    // new x, hides first x
        x++;
        printf("x in while loop: %d at %p\n", x, &x);
    }
        printf("x in outer block: %d at %p\n", x, &x);

    return 0;
}
```

自动存储时间的变量不会自动初始化，需要通过我们显式 (explicitly) 赋值来进行初始化

```c
int tents = 5; // initialized
```

#### Static Variables with Block Scope

一个块作用域的变量配合上`static`关键字，那么在这个块作用域结束后，这个变量不会被自动释放，而是在下次访问时仍旧有效

```c
/* loc_stat.c -- using a local static variable */
#include <stdio.h>
void trystat(void);

int main(void)
{
    int count;

    for (count = 1; count <= 3; count++)
    {
        printf("Here comes iteration %d:\n", count);
        trystat();
    }

    return 0;
}

void trystat(void)
{
    int fade = 1;
    static int stay = 1;

    printf("fade = %d and stay = %d\n", fade++, stay++);
}
```

这里，`stay`就不会被释放，其中的值会一直保留

#### Register Variables

这玩意比较玄学，~~如果不是嵌入式，一般用不到~~

### 本节小结

至于多文件以及函数的存储时间[^2]什么的我在这里就不提了，都是极为类似的多文件之前章节[^3]就有个例子`chapter09/hotel/`，大家可以参考看看，感受一下，下面就是C语言中除了线程以及并发等概念外的存储类型以及周期，作用域，链接的一个总结，供大家参考

| Storage Classes | Duration | Scope | Linakge | How Declare |
|:--:|:--:|:--:|:--:|:--:|
|automatic|Automatic|Block|None|In a block|
|register|Automatic|Block|None|In a block with the keyword `register`|
|static with external linkage|Static|File|External|Outside of all functions|
|static with internal linkage|Static|File|Internal|Outside of all functions with the keyword `static`|
|static with no linkage|Static|Block|None|In a block with the keyword `static`|

---

这篇博客的整体节奏比较快，主要是没什么特别难的概念，之后我也会保持这样的节奏，比较难的部分可能会出一个单独的小节来分析，望周知

[^1]: 包括主函数
[^2]: 感觉称为生命周期比较准确?
[^3]: Ch09
