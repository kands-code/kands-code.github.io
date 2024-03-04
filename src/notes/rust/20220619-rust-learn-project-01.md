# Rust 学习 实例 01

<p class="archive-time">archive time: 2022-06-19</p>

<p class="sp-comment">这是一个实战的例子, 可以帮助掌握之前的内容</p>

[[toc]]

## 介绍

这个实例里面, 我们要写一个类似 `grep` 功能的小程序, 即从文本或文件中找到对应文本的行

不过我们这个例子就不支持 _regex_ 和一些高级功能了, 仅仅是查找对应内容所在的行的内容

## 代码

实例的代码如下

```rust
/// lib.rs
#![feature(io_error_more)]

use std::env;
use std::fs;
use std::io::ErrorKind;
use std::path;

#[derive(Debug)]
pub struct Config {
    query: String,
    filename: String,
    conf: Vec<String>,
}

impl Config {
    pub fn new() -> Result<Self, String> {
        let args = env::args().collect::<Vec<_>>();
        if args.len() < 3 {
            Err(format!("no enough arguments\n{}", print_help()))
        } else {
            let conf = args
                .iter()
                .filter(|&s| s.starts_with("-"))
                .map(|s| s.clone())
                .collect::<Vec<_>>();

            let args = args
                .iter()
                .filter(|&s| !(conf.contains(s) || s == &args[0]))
                .take(2)
                .collect::<Vec<_>>();

            Ok(Config {
                query: args[0].clone(),
                filename: args[1].clone(),
                conf,
            })
        }
    }

    pub fn get_file(&self) -> &String {
        &self.filename
    }

    pub fn get_query(&self) -> &String {
        &self.query
    }

    pub fn get_conf(&self) -> &Vec<String> {
        &self.conf
    }
}

pub fn print_help() -> String {
    format!(
        "\n{}\n{}\n{}\n{}\n{}\n",
        "Usage: learn_rs <text> <file> [<args>]",
        "available args:",
        "  `-h` or `--help`: print this message",
        "  `-c` or `--case`: case sensitive (default)",
        "  `-i` or `--insensitive`: case insensitive"
    )
}

pub fn run(config: Config) -> Result<(), ErrorKind> {
    let available_configs = vec!["-h", "--help", "-c", "--case", "-i", "--insensitive"];

    if config
        .get_conf()
        .iter()
        .filter(|&s| !available_configs.contains(&s.as_str()))
        .count()
        > 0
    {
        // check invalid config
        Err(ErrorKind::InvalidInput)
    } else if config.get_conf().contains(&"-h".to_string())
        || config.get_conf().contains(&"-help".to_string())
    {
        // get helps
        Ok(println!("{}", print_help()))
    } else if path::Path::new(config.get_file()).exists() {
        // find pattern
        let contents = fs::read_to_string(config.get_file()).unwrap();

        if config.get_conf().contains(&"-i".to_string())
            || config.get_conf().contains(&"--insensitive".to_string())
        {
            Ok(search_insensitive(config.get_query(), &contents)
                .iter()
                .for_each(|&s| println!("{}", s)))
        } else {
            Ok(search(config.get_query(), &contents)
                .iter()
                .for_each(|&s| println!("{}", s)))
        }
    } else {
        Err(ErrorKind::InvalidFilename)
    }
}

pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    contents
        .lines()
        .filter(|&s| s.contains(query))
        .collect::<Vec<_>>()
}

pub fn search_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    contents
        .lines()
        .filter(|&s| s.to_lowercase().contains(&query.to_lowercase()))
        .collect::<Vec<_>>()
}

/// main.rs
use learn_rust::{print_help, run, Config};
use std::process;

fn main() {
    let conf = Config::new().unwrap_or_else(|err| {
        eprintln!("\n>> Initializion Failed: `{}`\n", err);
        process::exit(1);
    });
    if let Err(e) = run(conf) {
        eprintln!("\n>> Runtime Error: `{}`\n", e);
        println!("{}", print_help());
        process::exit(1);
    }
}
```

## 解释

我们从头开始看代码

### 使用 feature

首先是 `<projRoot>/src/lib.rs` 里的内容, 第一行

```rust
#![feature(io_error_more)]
```

这里是启用 _unstable feature_, 因为我使用了 `ErrorKind::InvalidFilename` 这样一个枚举,
而这个枚举项被标记为 `unstable`, 所以需要启用这个 _feature_ 才能启用

### 导入需要的库

然后是导入需要的库, 都是标准库下就存在的

```rust
use std::env;
use std::fs;
use std::io::ErrorKind;
use std::path;
```

分别是使用参数, 读取文件, 以及一些错误的定义 和 检查文件是否存在

### 定义类型

我们从命令行收到的参数可以用一个类型来包裹, 我们称其为 `Config`

```rust
#[derive(Debug)]
pub struct Config {
    query: String,
    filename: String,
    conf: Vec<String>,
}
```

其中 `query` 表示要查询的内容, `filename` 表示要从哪个文件里查找, `conf` 则是一些选项

### 实现方法

对于我们自定义的类型, 我们还需要实现一些方法来供我们使用

```rust
impl Config {
    pub fn new() -> Result<Self, String> {
        let args = env::args().collect::<Vec<_>>();
        if args.len() < 3 {
            Err(format!("no enough arguments\n{}", print_help()))
        } else {
            let conf = args
                .iter()
                .filter(|&s| s.starts_with("-"))
                .map(|s| s.clone())
                .collect::<Vec<_>>();

            let args = args
                .iter()
                .filter(|&s| !(conf.contains(s) || s == &args[0]))
                .take(2)
                .collect::<Vec<_>>();

            Ok(Config {
                query: args[0].clone(),
                filename: args[1].clone(),
                conf,
            })
        }
    }

    pub fn get_file(&self) -> &String {
        &self.filename
    }

    pub fn get_query(&self) -> &String {
        &self.query
    }

    pub fn get_conf(&self) -> &Vec<String> {
        &self.conf
    }
}
```

首先就是 `new()` 方法, 这是个惯例, 实例化一个类型对象的方法一般被称为 `new()`, 不过这不是必须的

我们的 `new()` 方法返回的是一个 `Result<T, E>` 类型, 这是因为有可能用户在使用时没有正确的传入对应参数

所以我们需要进行一些处理, 如果没有正确传入参数就返回一个错误 `Err(String)`

如果有足够的参数, 那么我们要对参数进行简单分类

如果参数前面有 `-`, 那么这个参数就是个 `conf`

```rust
let conf = args
    .iter()
    .filter(|&s| s.starts_with("-"))
    .map(|s| s.clone())
    .collect::<Vec<_>>();
```

这里我们使用了 `iter()` 方法将参数转变为迭代器

然后使用 `filter()` 方法筛选出符合条件的参数, 使用 `collect()` 方法将筛选出来的的参数封装成一个 `Vec<T>` 类型

除了这些选项, 剩余的就是给程序的参数

```rust
let args = args
    .iter()
    .filter(|&s| !(conf.contains(s) || s == &args[0]))
    .take(2)
    .collect::<Vec<_>>();
```

由于我们只需要两个参数, 即 需要查询的内容 和 文件地址, 我们使用 `take()` 方法来截断

最后将筛选出来的内容包装成 `Config` 类型

```rust
Config {
    query: args[0].clone(),
    filename: args[1].clone(),
    conf,
}
```

由于我们不允许直接修改 `Config` 类型的字段, 所以我们需要设置 `getter` 并将字段隐藏,
即不设置字段为 `pub`, 而是使用 `get_xxx()` 这种方法来或许字段内容

### 实现函数

对于程序的功能我们需要使用函数来实现

比如打印帮助信息

```rust
pub fn print_help() -> String {
    format!(
        "\n{}\n{}\n{}\n{}\n{}\n",
        "Usage: learn_rs <text> <file> [<args>]",
        "available args:",
        "  `-h` or `--help`: print this message",
        "  `-c` or `--case`: case sensitive (default)",
        "  `-i` or `--insensitive`: case insensitive"
    )
}
```

然后就是搜索, 也就是程序的主逻辑

```rust
pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    contents
        .lines()
        .filter(|&s| s.contains(query))
        .collect::<Vec<_>>()
}

pub fn search_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    contents
        .lines()
        .filter(|&s| s.to_lowercase().contains(&query.to_lowercase()))
        .collect::<Vec<_>>()
}
```

这里我们分成了两个函数, 也就是大小写敏感和大小写不敏感

我们首先将文件内容读取为字符串, 然后使用 `lines()` 函数将字符串按行分割成一个迭代器

然后使用 `filter()` 来筛选, 使用字符串中的 `contains()` 方法来查询我们要查询的内容是否在这一行

然后我们将符合条件的行封装到一个 `Vec<T>` 里返回

对于大小写不敏感, 我们只需要将查询内容和文本内容都 `to_lowercase()` 即可

### 封装逻辑

最后, 我们需要将这些函数的逻辑封装成一个单独的函数

```rust
pub fn run(config: Config) -> Result<(), ErrorKind> {
    let available_configs = vec!["-h", "--help", "-c", "--case", "-i", "--insensitive"];

    if config
        .get_conf()
        .iter()
        .filter(|&s| !available_configs.contains(&s.as_str()))
        .count()
        > 0
    {
        // check invalid config
        Err(ErrorKind::InvalidInput)
    } else if config.get_conf().contains(&"-h".to_string())
        || config.get_conf().contains(&"-help".to_string())
    {
        // get helps
        Ok(println!("{}", print_help()))
    } else if path::Path::new(config.get_file()).exists() {
        // find pattern
        let contents = fs::read_to_string(config.get_file()).unwrap();

        if config.get_conf().contains(&"-i".to_string())
            || config.get_conf().contains(&"--insensitive".to_string())
        {
            Ok(search_insensitive(config.get_query(), &contents)
                .iter()
                .for_each(|&s| println!("{}", s)))
        } else {
            Ok(search(config.get_query(), &contents)
                .iter()
                .for_each(|&s| println!("{}", s)))
        }
    } else {
        Err(ErrorKind::InvalidFilename)
    }
}
```

这里就不一一讲解了

### 调用

我们写好了函数后就可以在 `<projRoot>/src/main.rs` 里调用

```rust
use learn_rust::{print_help, run, Config};
use std::process;

fn main() {
    let conf = Config::new().unwrap_or_else(|err| {
        eprintln!("\n>> Initializion Failed: `{}`\n", err);
        process::exit(1);
    });
    if let Err(e) = run(conf) {
        eprintln!("\n>> Runtime Error: `{}`\n", e);
        println!("{}", print_help());
        process::exit(1);
    }
}
```

这里, `std::process` 库是为在发生错误时退出程序

由于我们以及封装好了程序逻辑, 所以在调用时只需要调用 `run(conf)` 即可

---

以上就是一个 Rust 练手的小例子, 希望大家能有所收获
