# SICP 笔记 - ex02

<p class="archive-time">archive time: 2025-11-09</p>

<p class="sp-comment">做一些补充内容吧</p>

## 番外（补）

好久没有更新博客了，心血来潮更新一篇番外

这篇番外还是延续上一个番外的内容，即补充一点 KSL 现在的内容

### KSL 的现状

目前 KSL 经过陆陆续续的完善，我可以说，KSL 已经是一门能用的玩具语言了

特别是在添加了 `UDPSocket` 的支持后，KSL 已经是可以做到很多有趣的事情了

而且由于 Rust 出色的跨平台支持，KSL 也能在手机上使用，大大增加了 KSL 的可玩性

不过问题还是有不少的，比如性能，比如迟迟未实现的 IR 生成

## REPL

KSL 的体积对比之前的版本已经膨胀了三四倍[^1]，
主要是使用了 _Clap_[^2] 支持命令行参数，以及使用了 _Reedline_[^3] 作为 REPL 支持

### 语法高亮

Reedline 支持自定义语法高亮，这给了我很大的便利，我可以基于 KSL 生成的 Token 来生成语法高亮，
并且如果我的 Token 规则改了，那么高亮也会一起修改，非常省心

```rust
struct KSLHighlighter {
    bif: nu_ansi_term::Style,
    symbol: nu_ansi_term::Style,
    atom: nu_ansi_term::Style,
    constant: nu_ansi_term::Style,
    string: nu_ansi_term::Style,
    chr: nu_ansi_term::Style,
    number: nu_ansi_term::Style,
    normal: nu_ansi_term::Style,
}

impl Default for KSLHighlighter {
    fn default() -> Self {
        KSLHighlighter {
            bif: nu_ansi_term::Color::Default.bold().italic(),
            symbol: nu_ansi_term::Color::Yellow.normal(),
            atom: nu_ansi_term::Color::Red.normal(),
            constant: nu_ansi_term::Color::LightRed.bold().italic(),
            string: nu_ansi_term::Color::LightGreen.normal(),
            chr: nu_ansi_term::Color::Purple.normal().italic(),
            number: nu_ansi_term::Color::Cyan.bold(),
            normal: nu_ansi_term::Color::DarkGray.normal(),
        }
    }
}

fn convert_pos_to_chr_index(full_text: &str, line_num: usize, col_num: usize, line_starts: &[usize]) -> Option<usize> {
    if line_num == 0 || col_num == 0 {
        return None;
    }
    let line_start_byte = *line_starts.get(line_num - 1)?;
    let line_content = full_text.get(line_start_byte..)?.lines().next()?;
    match line_content.char_indices().nth(col_num - 1) {
        Some((col_byte_offset, _)) => Some(line_start_byte + col_byte_offset),
        None => Some(line_start_byte + line_content.len()),
    }
}

impl reedline::Highlighter for KSLHighlighter {
    fn highlight(&self, line: &str, _cursor: usize) -> reedline::StyledText {
        let mut st = reedline::StyledText::new();
        if line.is_empty() {
            return st;
        }

        let line_starts: Vec<usize> = std::iter::once(0)
            .chain(line.match_indices('\n').map(|(i, _)| i + 1))
            .collect();

        match source_to_token(line) {
            Ok(toks) => {
                let mut last_pos = 0;

                for tok in toks {
                    let (start_line, start_col) = tok.position.0;
                    let (end_line, end_col) = tok.position.1;

                    let start_byte = match convert_pos_to_chr_index(line, start_line, start_col, &line_starts) {
                        Some(b) => b,
                        None => continue,
                    };
                    let end_char_byte = match convert_pos_to_chr_index(line, end_line, end_col, &line_starts) {
                        Some(b) => b,
                        None => continue,
                    };

                    let end_byte = end_char_byte
                        + line
                            .get(end_char_byte..)
                            .and_then(|s| s.chars().next())
                            .map_or(0, |c| c.len_utf8());

                    if last_pos < start_byte {
                        st.push((self.normal, String::from(&line[last_pos..start_byte])));
                    }

                    let style = match &tok.value {
                        TokenType::Symbol(sym) => {
                            if BUILTIN_FUNCTIONS.contains(&sym.iter().collect::<String>().as_str()) {
                                self.bif
                            } else {
                                self.symbol
                            }
                        }
                        TokenType::Atom(atm) => {
                            if ["t", "f", "ok", "err"].contains(&atm.iter().collect::<String>().as_str()) {
                                self.constant
                            } else {
                                self.atom
                            }
                        }
                        TokenType::String(_) => self.string,
                        TokenType::Char(_) => self.chr,
                        TokenType::Number(_) => self.number,
                        _ => self.normal,
                    };
                    st.push((style, String::from(&line[start_byte..end_byte])));

                    last_pos = end_byte;
                }

                if last_pos < line.len() {
                    st.push((self.normal, String::from(&line[last_pos..])));
                }
            }
            Err(_) => {
                st.push((self.normal, line.to_string()));
            }
        }

        st
    }
}
```

### 基本补全

由于内置函数比较多[^4]，很多情况下如果在 REPL 中能补全内置函数，那自然会方便很多

```rust
struct KSLCompleter;

impl reedline::Completer for KSLCompleter {
    fn complete(&mut self, line: &str, pos: usize) -> Vec<reedline::Suggestion> {
        let mut word_start = pos;
        while word_start > 0 {
            let (idx, ch) = line[..word_start]
                .char_indices()
                .next_back()
                .unwrap_or((0, ' '));
            if ch.is_whitespace() || "[]{},;".contains(ch) {
                break;
            }
            word_start = idx;
        }

        let word_to_complete = &line[word_start..pos];

        BUILTIN_FUNCTIONS
            .iter()
            .filter(|bif| {
                bif.to_lowercase()
                    .starts_with(word_to_complete.to_lowercase().as_str())
            })
            .map(|bif| reedline::Suggestion {
                value: (*bif).to_string(),
                description: None,
                extra: None,
                span: reedline::Span::new(word_start, pos),
                style: None,
                append_whitespace: false,
            })
            .collect()
    }
}
```

### 多行输入支持

由于 KSL 的字符串性质，支持多行输入就显得十分重要，好在 Reedline 中有 `Validator` 来实现这个功能

```rust
#[derive(Default)]
struct KSLValidator;

impl reedline::Validator for KSLValidator {
    fn validate(&self, line: &str) -> reedline::ValidationResult {
        fn is_input_complete(buffer: &str) -> bool {
            if buffer.trim_end().ends_with(';') {
                return true;
            }
            let mut brace_balance = 0;
            let mut bracket_balance = 0;
            let mut in_string = false;
            for char in buffer.chars() {
                match char {
                    '"' => in_string = !in_string,
                    '{' if !in_string => brace_balance += 1,
                    '}' if !in_string => brace_balance -= 1,
                    '[' if !in_string => bracket_balance += 1,
                    ']' if !in_string => bracket_balance -= 1,
                    _ => (),
                }
            }
            brace_balance == 0 && bracket_balance == 0 && !in_string
        }

        if is_input_complete(line) {
            reedline::ValidationResult::Complete
        } else {
            reedline::ValidationResult::Incomplete
        }
    }
}
```

## 符号命名

之前由于某些原因，KSL 的符号支持一直限制在 ASCII 字符内

现在，KSL 终于支持 Unicode 了，也就意味着如下代码是可以正常运行了：

```ksl
Let[你好, "Hello"];
Print[你好]; (* 打印 Hello *)
```

并且在 `Load` 函数中增加限制，现在下划线开头的符号不会被加载，这样可以避免暴露过多的实现细节，例如：

```ksl
(* 文件 A.ksl *)
Module["A"];

Let[_a, 16];
Let[MulA, Fun[{ n },
  Div[Mul[n, _a], Max[Abs[Add[n, _a]], 2]]]];
```

在 REPL，我们可以检查是否导入了 `_a`：

```ksl
Load[A, "A"];

Print[Try[Use[A, MulA], #f]];
(* 打印 λ(n) => <lambda> *)

Print[Try[Use[A, _a], #f]];
(* 打印 #f *)

Print[Apply[Use[A, MulA], 12]];
(* 打印 6.85714285714286 *)
```

## 语法改进

之前 `Thread` 函数是直接返回一个 `Thread` 对象，但现在，`Thread` 以及 `OpenStream` 函数一定需要绑定一个变量了

这是在语法层面上要求用户去保存这些资源，防止到时候需要释放这些资源时完全无法访问，例如：

```ksl
Let[GLOBAL_CONST, 16];
Thread[t1, { GLOBAL_CONST }, Block[
  Sleep[Div[GLOBAL_CONST, 8]],
  Div[GLOBAL_CONST, 2],
]];
Print[Consume[t1]];
```

另外，不知道改进了什么，总之，KSL 现在支持使用 `Plugin` 来加载 Raylib 库了，
例子可以参考 [ksl_cplugin](https://github.com/kands-code/rswk/tree/repo-src/ksl_cplugin)，
使用起来还算是方便，最起码比之前只能用一个函数调用要好很多

---

嗯，KSL 确实是越来越像样了，可惜目前只有我一个用户，希望这点也能有所改善吧

[^1]: 之前二进制体积大约是 `$950 \,\mathrm{KB}$`，但是现在已经是 `$2.97 \,\mathrm{MB}$` 了
[^2]:
    clap \[CP/OL\].(2025-11-04)\[2025-11-09\].
    <https://github.com/clap-rs/clap>

[^3]:
    reedline \[CP/OL\].(2025-11-04)\[2025-11-09\].
    <https://github.com/nushell/reedline>

[^4]: 目前内置函数已经有 `$108$` 个了
