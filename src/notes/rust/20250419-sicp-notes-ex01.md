# SICP 笔记 - ex01

<p class="archive-time">archive time: 2025-04-19</p>

<p class="sp-comment">也算是了结了自己的一个心事吧</p>

## 番外

这一篇博客是 Rust 写 SICP 的番外，也就是具体课程内容之外的事情

那么这篇番外要说什么呢？

嗯哼，那就是介绍一下自己设计[^1]的语言，[**_KSL_**](https://github.com/kands-code/rswk/tree/repo-src/ksl)！

KSL 这个名字，_L_ 很好理解，就是 Language，而 _KS_ 则是我的名字的两个部分的首字母拼接而成，非常直白

## KSL 使用指南

> **更新**：本篇指南已经过时，具体文档请参考 <https://ksl.qarks.top>

### 语法特点

我们先来看一段 KSL 代码吧，
下面的代码展示的是分别通过递归函数和循环两种方式来求 `$13$` 的阶乘的过程：

```plaintext
(** 使用递归函数 *)
Let[Factorial, Fun[{n},
  Block[
    Let[Factorial', Fun[{n, acc},
      If[Less[n, 0],
        #err,
        If[Eq[n, 0],
          acc,
          Factorial'[Sub[n, 1], Mul[acc, n]]]]]],
    Factorial'[n, 1]]]];
Print[Factorial[13]]; (* 打印 6227020800 *)

(** 使用循环 *)
Print[
  Block[
    Let[fac, 1],
    Do[Let[fac, Mul[fac, n]], n, Range[13, -1, 2]],
    fac]]; (* 打印 6227020800 *)
```

如果熟悉 Mathematica 就会发现，这和 Wolfram[^2] 十分相像，但是细看又会发现许多不同

最重要的一点，那就是 KSL **不支持** 中缀运算符，
也就是说，哪怕加减乘除这种也要显式使用函数调用，
所以我对于 KSL 的语法定位是介于 Wolfram 和 LISP 之间 `$\textnormal{---}$`
注释，列表 以及 函数调用 类似 Wolfram，但是使用体验类似 LISP

> 多行注释目前在 REPL 中不能使用，在脚本中可以正常使用

### 基本元素

KSL 支持的元素类型 **目前** 定义如下：

```rust
pub enum Value {
    Unit,
    Module(String, Environment),
    Symbol(String),
    Atom(String),
    String(String),
    Number(f64),
    List(Vec<Value>),
    Lambda(Vec<String>, Box<Value>, Environment),
    Builtin(&'static str),
    Plugin(String, String),
    Object(String, Environment),
    RawObject(String, *mut u8),
    Apply(Vec<Value>, Box<Value>),
}
```

分别对应于：

- **Unit**: 空类型，一般作为 `Print` 这种不实际返回值的函数的返回值，显示为 `()`
- **Module**: 模块对象，无法更改，每个模块只能加载一次，**不能重复加载**
  - 模块可以通过 `Load` 函数加载，例如 `Load[ss, "std/string"]`，
    这样 `ss` 就是一个模块对象，对应 `"std/string"` 模块
  - 要访问模块中的元素，可以使用 `Use` 函数，例如 `Let[f, Use[ss, StringSplit]]`，
    这样 `f` 与 `ss` 中的 `StringSplit` 符号对应的值绑定起来了
- **Symbol**: 符号，也就是各种名称，支持数字，英文字母，下划线以及单引号，但是需要字母开头
- **Atom**: 原子，也就是标签或者说字面值，一般用于标记结果的类型，例如 `#err` 和 `#ok`
  - boolean 也是原子，其中 True 对应 `#t`，而 False 对应 `#f`
- **String**: 字符串，使用双引号标记，字符串默认支持多行，但 **不支持转义字符**
  - 如果需要转义字符，可以使用 `#<ascii>` 的方式输入，然后通过 `Concat` 函数拼接，
    例如 要在 `"hello, world"` 的 `,` 后插入换行符，可以使用 `Concat["hello," #10, "world"]`
- **Number**: 数字，数字默认使用 `f64`，如果要判断是否是整数，可以使用 `IsInteger` 函数
- **List**: 列表，内部使用 `Vec<Value>` 来存储，使用 `{ }` 输入，例如 `{1, 2}`
- **Lambda**: 函数对象，除了内置函数和插件函数，所有的函数都是函数对象
  - 获得函数对象可以使用 `Fun` 函数，例如 `Fun[{x}, Add[x, 1]]`
  - 函数对象不能直接调用，例如 `Fun[{x}, Add[x, 1]][2]` 就是无效的，
    如果需要调用函数对象，可以先将函数对象绑定到某个符号上，
    或者使用 `Apply` 函数调用，`Apply` 函数是一个支持变长参数，
    基本语法为 `Apply[<function>, ...<args>]`，
    例如对于：

    ```ksl
    Fun[{x, y}, Mul[Add[x, y], x]]
    ```

    可以使用：

    ```ksl
    Apply[Fun[{x, y}, Mul[Add[x, y], x]], 2, 3]
    ```

    得到结果 `10`

- **Builtin**: 内置函数，KSL 内部提供的函数
- **Plugin**: 插件函数，通过插件方式加载的函数
- **Object**: 数据对象类型，包含对象类型名称和一个字典
- **RawObject**: 原始对象类型，只能由插件函数返回和使用，使用后一定要使用对应的函数释放
- **Apply**: 函数调用产生的对象

在 KSL 中，值的绑定和更新都是使用 `Let` 函数，
例如 `Let[a, 1]`，那么 `a` 这个符号就和 `1` 绑定上了，
但是如果我再使用 `Let[a, "2"]`，这时 `a` 的值就更新为了 `"2"`

如果想要自己构建类型，简单的可以使用列表，例如 `{#ok, 12}`，
复杂的可以使用 `Object` 函数，然后自己往对象中填充数据，例如：

```plaintext
Let[obj, Object[A]];

Let[obj, Set[obj, "key1", 1]];
Let[obj, Set[obj, "key2", 2]];
Let[obj, Set[obj, "key3", 3]];

Print[obj]; (* 打印 #(A){key1, key2, key3} *)
Print[GetType[obj]]; (* 打印 A *)
Print[{Has[obj, "key1"], Get[obj, "key1"]}]; (* 打印 {#t, 1} *)
Print[Get[obj, "key2"]]; (* 打印 2 *)
Print[Get[obj, "key3"]]; (* 打印 3 *)
```

### 控制流

在 KSL 中，基本控制流有三种，分别是 `If`，`Do` 以及 `While`

`If` 接受三个参数，第一个参数是一个 boolean，
第二个参数对应结果是 `#t` 的情况，
第三个参数则对应结果是 `#f` 的情况，例如：

```plaintext
Print[If[#t, 2, 3]]; (* 打印 2 *)
```

`Do` 用于迭代一个列表，一共有三个参数，要执行的表达式，绑定的符号以及列表，例如：

```ksl
Let[x, 0];
Do[Let[x, Add[x, n]], n, Range[1, 1, 4]];
Print[x]; (* 输出 10 *)
```

等价于 Rust 中的：

```rust
let mut x = 0;
for n in (1..=4).step_by(1) {
    x = x + n;
}
println!("{}", x);
```

`While` 接受两个参数，第一个参数是一个 boolean，第二个参数推荐使用列表，但是可以是任意表达式，例如：

```ksl
Let[i, 0];
While[Less[i, 5], {Print[i], Let[i, Add[i, 1]]}];
```

等价于 Rust 中的：

```rust
let mut i = 0;
while i < 5 {
    println!("{}", i);
    i = i + 1;
}
```

注意，`Do` 和 `While` 都有返回值，返回值是最后一次执行表达式得到的结果

### 函数定义

在 [基本元素](#基本元素) 中提到了，函数除了 Builtin 和 Plugin，其他的都是 Lambda

Builtin 是语言内提供的，至于 Plugin，在 [语言插件](#语言插件) 部分会详细说明如何使用

Lambda 的定义使用 `Fun` 函数，下面是一个编写和使用斐波那契函数的示例：

```plaintext
Let[Fib, Fun[{n},
  If[And[IsInteger[n], Greater[n, 0]],
    Block[
      Let[Fib', Fun[{n, a, b},
        If[Eq[n, 0], a,
          If[Eq[n, 1], b,
            Fib'[Sub[n, 1], b, Add[a, b]]]]]],
      Fib'[n, 0, 1]
  ], #err]]];

Print[Fib[24]];
```

当然，除了绑定到符号上，还可以作为参数使用，例如：

```plaintext
Let[Map, Fun[{f, lst},
  If[And[IsList[lst],
    Or[IsLambda[f],
      Or[IsBuiltin[f], IsPlugin[f]]]],
    Block[
      Let[mapped, {}],
      Do[Let[mapped,
          Append[mapped, f[element]]],
        element, lst],
      mapped
    ],
    #err]]];

Print[Map[Fun[{x}, Add[x, 2]], {1, 2, 3}]]; (* 打印 {3, 4, 5} *)
```

### 作用域

通过上述代码示例，大家估计发现了，如果想要执行多条语句，可以使用 `Block` 或者 列表

但是这两种方式有个非常大的区别，那就是作用域，
在 Block 中的修改是不会影响到外面环境的，
但是在 列表 中的修改是会影响的，
也就是说，`Block` 开辟了一个新的作用域，但是列表没有

事实上，只有使用 `Block` 和 加载模块 以及 构建函数 的时候会开辟新的作用域，
其他情况下，对于环境的修改都会影响到外部

```ksl
Let[x, 1];

Print[Block[Let[x, 2], x]]; (* 打印 2 *)
Print[x]; (* 打印 1 *)

Print[{Let[x, 3], x}]; (* 打印 {(), 3} *)
Print[x]; (* 打印 3 *)

If[Eq[x, 3], Let[x, 4], Let[x, 5]];
Print[x]; (* 打印 4 *)

Let[addOneToX, Fun[{}, Let[x, Add[x, 1]]]];
Print[x]; (* 打印 4 *)
addOneToX[];
Print[x]; (* 打印 5 *)
addOneToX[];
Print[x]; (* 打印 4 *)
```

### 错误处理

KSL 没有内置的错误处理相关函数，但是提供了 原子，除了可以用作 枚举 外，
还可以用来展示状态，例如我们可以 **规定** 函数返回的样式是 `{#ok, <return>}` 或 `{#err, <message>}`，
或者如果不想要错误信息，也可以只返回 `#err`

这样一来，我们可以通过查看返回值是否是列表，
以及如果是列表，第一个元素是 `#ok` 还是 `#err`，
来判断函数是否正常执行，也算是变相拥有了错误处理的能力

### 语言插件

作为可用性的最重要的部分，也就是能否调用其他语言已经有的库

而在这里，由于类型限制，KSL 仅支持调用 Rust 编写的库

这里作为示例，来展示一下如何调用，我们可以先创建一个 Rust 项目：

```bash
cargo new <lib_name> --lib
```

其中 `<lib_name>` 可以替换为任何你想要使用的名称，然后修改项目的 `Cargo.toml` 添加必要依赖：

```toml
[package]
name = "example"
version = "0.1.0"
edition = "2024"

[lib]
name = "example"
crate-type = ["lib", "dylib"]

[dependencies]
ksl = "^0.1.10"
```

在这里，我创建了一个 `example` 库，这个库会编译成一个 Rust 动态库，这个库依赖 `ksl`

然后在 `lib.rs` 中，编写插件函数：

```rust
use ksl::{Environment, eval::apply::eval_apply, value::Value};

#[unsafe(no_mangle)]
pub fn hello(args: &[Value], env: &Environment) -> Option<(Value, Environment)> {
    if let [name] = &args[..] {
        match eval_apply(name, env) {
            Some((Value::String(name_string), _)) => {
                println!("hello from plugin example, {}!", name_string);
                Some((Value::Unit, Environment::new()))
            }
            Some((e, _)) => {
                eprintln!(
                    concat!(
                        "Error[example::hello]: ",
                        "Expected an object, but got `{:?}`."
                    ),
                    e
                );
                None
            }
            None => {
                eprintln!(
                    concat!(
                        "Error[example::hello]: ",
                        "Cannot evaluate expression {:?}."
                    ),
                    name
                );
                None
            }
        }
    } else {
        eprintln!(
            concat!(
                "Error[example::hello]: ",
                "Only accepts 1 argument, ",
                "but {} were passed."
            ),
            args.len()
        );
        None
    }
}
```

注意，插件函数的类型一定是 `fn(&[Value], &Environment) -> Option<(Value, Environment)>`，
并且需要使用 `#[unsafe(no_mangle)]` 标记，让 KSL 能够找到这个函数

返回值中，第一个就是这个函数执行的结果，一般如果这个函数不返回任何值，那么就使用 `Value::Unit`，
`Environment` 部分是这个函数修改的环境，比如这个函数会往环境中添加一些绑定，或者会修改现有绑定的内容

编写好后，使用 `cargo build`，我们可以得到一个动态库，一般是 `<project-root>/target/debug/lib<lib_name>.so`，
其中这个动态库的尾缀会根据操作系统不同而不同，macOS 是 `dylib`，而 Windows 是 `dll`

为了让 KSL 能够找到这个动态库，我们可以将这个动态库移动到 `<project-root>/lib/` 下，然后编写包裹模块：

```ksl
Module["example"];

Plugin[Hello, "example/hello"];
```

其中 `Module` 定义了这个 KSL 文件内容是一个模块，模块名是 `example`，
其次 `Plugin` 定义了一个插件函数，函数名称是自定义的，这里叫做 `Hello`，后面是这个插件对应的“路径”

`example/hello` 会被拆分为 `example` 和 `hello` 两个部分，
前者是这个动态库的名称，即去掉 `lib` 前缀和尾缀后的名字，
后者是这个动态库中函数的名称，这里就是我们 `lib.rs` 中的 `hello` 这个函数

现在我们来尝试使用一下这个模块吧！

```ksl
Load[m_e, "example"];

Apply[Use[m_e, Hello], "Kevin"];
```

执行后输出如下：

```plaintext
> ksl use_example.ksl

hello from plugin example, Kevin!
()
```

可以看到，这个函数被正确调用了！到目前为止这个示例项目的代码结构（去掉 `target/`)如下：

```plaintext
.
├── Cargo.lock
├── Cargo.toml
├── example.ksl
├── lib
│   └── libexample.so
├── src
│   └── lib.rs
└── use_example.ksl
```

如果你需要加载的插件函数很多，可以分文件编写，例如我想要有一个 `test` 函数，
这个函数不接收参数，只打印一个 `test`，并且往环境中添加一执行这个函数的次数，那么可以有：

```rust
use ksl::{Environment, value::Value};

#[unsafe(no_mangle)]
pub fn test_func(args: &[Value], env: &Environment) -> Option<(Value, Environment)> {
    if args.is_empty() {
        println!("test");
        let mut local_env = Environment::new();
        let count = match env.get("EXAMPLE_TEST_FUNC_COUNT") {
            Some(Value::Number(n)) => n + 1.0,
            _ => 1.0,
        };
        let _ = local_env.insert(
            String::from("EXAMPLE_TEST_FUNC_COUNT"),
            Value::Number(count),
        );
        Some((Value::Unit, local_env))
    } else {
        eprintln!(
            concat!(
                "Error[example::test_func]: ",
                "Only accepts 0 arguments, ",
                "but {} were passed."
            ),
            args.len()
        );
        None
    }
}
```

然后修改 `lib.rs` 和 `example.ksl` 将这个函数暴露出来：

```diff
+ mod another;
+ pub use another::test_func;
```

```diff
+ Plugin[Test, "example/test_func"];
```

此时，项目结构如下：

```plaintext
.
├── Cargo.lock
├── Cargo.toml
├── example.ksl
├── lib
│   └── libexample.so
├── src
│   ├── another.rs
│   └── lib.rs
└── use_example.ksl
```

然后编译项目，再在 `use_example.ksl` 中调用函数：

```ksl
Load[m_e, "example"];

Apply[Use[m_e, Hello], "Kevin"];
Apply[Use[m_e, Test]];
Print[Has[EXAMPLE_TEST_FUNC_COUNT]];
Apply[Use[m_e, Test]];
Print[EXAMPLE_TEST_FUNC_COUNT];
```

输出如下：

```plaintext
> ksl use_example.ksl

hello from plugin example, Kevin!
test
#t
test
2
```

## 后记

这门语言实际上是我在大概两年半前就已经在构思了，但是中间总是有各种事情干扰，要么没有时间做，要么就忘记有这回事了

也就最近闲下来了，突然想到我还要做一门语言，再加上 SICP 课程内容中也提及了解释器该如何写，我这个 KSL 算是课后实践吧

不管怎样，KSL 目前还属于半可用状态，核心库代码也没有很好注释，后续有时间了会补上

[^1]: 基本语法并非完全自己设计，有参考 Wolfram 和 LISP，但是其他部分都是自己独立实现的

[^2]:
    Wolfram Language.Wikipedia \[DB/OL\].(2025-04-11)\[2025-04-14\].
    <https://en.wikipedia.org/wiki/Wolfram_Language>
