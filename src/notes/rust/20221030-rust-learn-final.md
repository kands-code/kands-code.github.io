# Rust 学习 Final

<p class="archive-time">archive time: 2022-10-30</p>

<p class="sp-comment">总算看完杨旭大佬的 Rust 视频了，这是 Rust 学习的最后一篇了</p>

[[toc]]

## Rust 的 OOP

OOP，即 _Object Oriented Programming_，是一种目前比较通用的 _编程范式_ [^1]

Rust 中，`struct` 和 `enum` 中包含数据，同时可以使用 `impl` 来提供方法或函数，这可以被看成是对象的一种

而 OOP 总结下来就是三种特点，**封装**，**继承** 和 **多态**

### 封装

Rust 中，封装这个特性应该是最好体现的了

Rust 的 `struct` 和 `enum`，默认情况下是 _private_ 的，只有写了 `pub` 关键字才能够从外部访问

而且 Rust 的 `enum` 在标记 `pub` 后，每个字段也变成公开的了

而 `struct` 则还需要将需要公开的字段加上 `pub` 标记才能公开

### 继承

这点，Rust 中是没有继承机制的，但是我们可以使用 `trait` 来做到

我们可以为我们的 `enum` 或者 `struct` 实现 (即 `impl`) 某个 `trait` 来当作继承了这个 `trait`

### 多态

多态在 Rust 里也是通过 `trait` 来实现的，我们可以通过 `trait` 约束和泛型来做到 [^2]

相关 RFC 可以参考 [这里](https://rust-lang.github.io/rfcs/0034-bounded-type-parameters.html)

> 这种方案我们还可以称为组合 [^3]

### Example

这里我们来定义一个 `traie` 叫做 `Draw`

```rust
pub trait Draw {
    fn draw(&self);
}

pub struct Screen {
    pub components: Vec<Box<dyn Draw>>,
}

impl Screen {
    pub fn run(&self) {
        for component in self.components.iter() {
            component.draw();
        }
    }
}

pub struct Button {
    pub width: u8,
    pub height: u8,
    pub label: String,
}

impl Draw for Button {
    fn draw(&self) {
        println!(
            "Draw Button w: {} h: {} s: {}",
            self.width, self.height, self.label
        );
    }
}

pub struct SelectBox {
    pub width: u8,
    pub height: u8,
    pub options: Vec<String>,
    pub selected: bool,
}

impl Draw for SelectBox {
    fn draw(&self) {
        println!(
            "Draw Selected state: {} w: {} h: {} s: {:?}",
            self.selected, self.width, self.height, self.options
        );
    }
}
```

`Draw` 里面有一个方法需要我们来实现 `draw()`

而我们可以使用 `impl` 为 `Button` 和 `SelectBox` 来实现 `Draw`

配合 `Box<dyn Draw>`，就好像 `Button` 和 `SelectBox` 继承了 `Draw`

使用一下

```rust
use rustex::rust::{self, Button, SelectBox};

fn main() {
    let s = rust::Screen {
        components: vec![
            Box::new(SelectBox {
                width: 75,
                height: 10,
                options: vec![String::from("Here")],
                selected: false,
            }),
            Box::new(Button {
                width: 50,
                height: 10,
                label: String::from("Ok"),
            }),
        ],
    };

    s.run();
}
```

输出如下

```text
Draw Selected state: false w: 75 h: 10 s: ["Here"]
Draw Button w: 50 h: 10 s: Ok
```

可以看到是正常执行了

## 模式匹配

这个我们就很常见了，例如 `match`，`while let`，`if let` 以及 `let` 都可以使用模式匹配

```rust
let x = Some(10);
if let Some(v) = x {
    println!("val in x is: {}", v);
}
```

`for` 循环里面也有模式匹配

```rust
let vals = vec![1, 2, 3, 4];
for (i, v) in vals.iter().enumerate() {
    println!("{}: {}", i, v);
}
```

函数参数也可以使用模式匹配

```rust
fn print_point(&(x, y): &(f32, f32)) {
    println!("(x: {}, y: {})", x, y);
}
```

模式匹配的规则可以参考 [这里](https://doc.rust-lang.org/reference/patterns.html)

## 宏

宏也是 Rust 的一大特色

> the functionality and syntax of Rust can be extended with custom definitions called macros

宏在 Rust 中可以用在如下场景 [^4]

- 宏作为表达式或语句
- 模式 (patterns)
- 类型 (types)
- item，包括 关联 item
- `macro_rules` 的 transcribers
- 外部语句块

下面是官方给出的例子

```rust
// Used as an expression.
let x = vec![1,2,3];

// Used as a statement.
println!("Hello!");

// Used in a pattern.
macro_rules! pat {
    ($i:ident) => (Some($i))
}

if let pat!(x) = Some(1) {
    assert_eq!(x, 1);
}

// Used in a type.
macro_rules! Tuple {
    { $A:ty, $B:ty } => { ($A, $B) };
}

type N2 = Tuple!(i32, i32);

// Used as an item.
use std::cell::RefCell;
thread_local!(static FOO: RefCell<u32> = RefCell::new(1));

// Used as an associated item.
macro_rules! const_maker {
    ($t:ty, $v:tt) => { const CONST: $t = $v; };
}
trait T {
    const_maker!{i32, 7}
}

// Macro calls within macros.
macro_rules! example {
    () => { println!("Macro call in a macro!") };
}
// Outer macro `example` is expanded, then inner macro `println` is expanded.
example!();
```

而过程宏 [^5] 可以分为 _衍生 (derive) 宏_，_属性宏_，_函数宏_，分别用在 `#[derive(xxx)]`，自定义属性，以及作为函数调用

### Example

这里我直接用例子来实践，一般，需要包含 [syn](https://crates.io/crates/syn), 和 [quote](https://crates.io/crates/quote) 这两个包

#### 组织项目

项目目录结构如下

```text
$ tree -L 1 .
.
├── Cargo.toml
├── hello_macro
│   ├── Cargo.toml
│   └── src
└── proc_test
    ├── Cargo.toml
    └── src
```

即，我们需要创建一个工作空间，包含 `proc_test` 和 `hello_macro` 两个包

```toml
[workspace]

members = ["proc_test", "hello_macro"]
```

#### hello_macro

`hello_macro` 是我们的测试包，即我们的 `trait` 和 `main` 都在这个包里

```toml
[package]
name = "hello_macro"
version = "0.1.0"
edition = "2021"

[lib]
name = "hello_macro"
crate-type = ["rlib", "staticlib"]

[dependencies]
proc_test = { path = "../proc_test" }
```

在 `hello_macro/src/lib.rs` 里，我们仅需要定义 `trait`

```rust
pub trait HelloMacro {
    fn hello_macro();
}
```

#### proc_test

我们的宏定义在 `proc_test` 里

```toml
[package]
name = "proc_test"
version = "0.1.0"
edition = "2021"

[lib]
name = "proc_test"
proc-macro = true

[dependencies]
syn = "1.0.103"
quote = "1.0.21"
```

重点来了，每个包含过程宏的包必定是 `proc-macro` 类型的 _crate_

而 `proc-macro` 不允许导出除了过程宏以外的其他函数或宏，所以一般需要单独成包

在 `proc_test/src/lib.rs` 下就是我们主要的内容了

```rust
extern crate proc_macro;

use crate::proc_macro::TokenStream;
use quote::quote;
use syn;

#[proc_macro_derive(HelloMacro)]
pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
    let ast = syn::parse(input).unwrap();
    impl_hello_macro(&ast)
}

fn impl_hello_macro(ast: &syn::DeriveInput) -> TokenStream {
    let name = &ast.ident;
    let gen = quote! {
        impl HelloMacro for #name {
            fn hello_macro() {
                println!("Hello, Macro! My name is {}", stringify!(#name));
            }
        }
    };
    gen.into()
}
```

首先使用 `extern crate proc_macro;` 将 `proc_macro` 引入 `crate` 层级，而后导入 `syn` 和 `quote::quote!`

我们这里写的是一个衍生宏，所以使用 `#[proc_macro_derive(HelloMacro)]` 标注，而括号里面就是我们要衍生的 `trait` 了

一开始，我们使用 `syn::parse` 将传入的内容，一般就是需要衍生的 `struct` 或者 `enum` 的代码，解析为 **_AST_** 形式 [^6]

而后将解析好的内容传给 `impl_hello_macro`

在 `impl_hello_macro` 里，我们从 **AST** 中获取到标识符的名称 `ident`，在 `quote!` 里我们实现了 `hello_macro()`

最后将实现的内容返回，这就完成了衍生过程

#### 结果

我们将测试代码放在 `hello_macro` 包下，在 `hello_macro/src/main.rs` 里，就是我们要做到的效果了

```rust
use hello_macro::HelloMacro;
use proc_test::HelloMacro;

#[derive(HelloMacro)]
struct Pank;

fn main() {
    Pank::hello_macro();
}
```

我们在工作空间目录下使用 `cargo run -p hello_macro` 即可看到效果

```text
Hello, Macro! My name is Pank
```

可以看到，我们使用 `hello_macro` 成功输入了 stuct 的名称 `Pank`

### 属性宏

属性宏的用法一般是 `#[macro_name(params)]`，定义方式为

```rust
#[proc_macro_attribute]
pub fn macro_name(attr: TokenStream, item: TokenStream) -> TokenStream {
    ...
}
```

第一个 `attr` 就是我们使用宏的时候的参数 `params`，而后面的 `item` 就是我们要修饰的函数

### 函数宏

函数宏就是类似函数的宏，例子就是 `format!` 和 `println!`，例如

```rust
let s = sql!(SELECT * FROM posts WHERE id=1);
```

而定义方式如下

```rust
#[proc_macro]
pub fn sql(input: TokenStream) -> TokenStream {
    ...
}
```

---

好，到这里，Rust 大致内容就算是过了一遍了，不过具体使用还是需要好好看文档，写代码

写 Rust 就是和所有权做 ~~斗争~~ 朋友，后面大部分就是实例和小提示了，加油吧！

[^1]:
    Wikipedia.Programming Paradigm \[DB/OL\].
    [https://en.wikipedia.org/wiki/Programming_paradigm](https://en.wikipedia.org/wiki/Programming_paradigm),
    2022-10-28/2022-10-30

[^2]:
    Wikipedia.Bounded Quantification \[DB/OL\].
    [https://en.wikipedia.org/wiki/Bounded_quantification](https://en.wikipedia.org/wiki/Bounded_quantification),
    2021-11-10/2022-10-30

[^3]:
    Rust Reference.Type Layout \[S/OL\].
    [https://doc.rust-lang.org/reference/type-layout.html](https://doc.rust-lang.org/reference/type-layout.html),
    2022-10-30

[^4]:
    Rust Reference.Macro \[S/OL\].
    [https://doc.rust-lang.org/reference/macros.html](https://doc.rust-lang.org/reference/macros.html),
    2022-10-30

[^5]:
    Rust Docs.proc_macro \[S/OL\].
    [https://doc.rust-lang.org/proc_macro/](https://doc.rust-lang.org/proc_macro/),
    2022-10-30

[^6]:
    Wikipedia.Abstract Syntax Tree \[DB/OL\].
    [https://en.wikipedia.org/wiki/Abstract_syntax_tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree),
    2022-8-10/2022-10-30
