# 在 macOS 上使用 Rust 链接静态库

<p class="archive-time">archive time: 2024-11-22</p>

<p class="sp-comment">macOS 是这样的，看似开发者友好，但是全都是坑</p>

[[toc]]

## 缘起

使用 Rust 链接静态库，这个在大部分情况下还是比较简单的，
只需要在使用的地方使用 `#[link]` 特性修饰符[^1] 说明库的名称 `name` 以及库的类型 `kind`，
再配合 `extern` 代码块说明要使用的符号就好了，例如：

```rust
#[link(name = "raylib", kind = "static")]
unsafe extern "C" {
    #[link_name = "InitWindow"]
    fn rl_init_window(width: c_int, height: c_int, title: *const c_char) -> c_void;
    // ...
}
```

在编译的时候还需要指定链接库的位置和链接库的名称，这部分一般使用 **编译脚本**[^2] 来实现，例如：

```rust
fn main() {
    // get the absolute path of the project
    let Ok(pkg_root) = std::env::var("CARGO_MANIFEST_DIR").map(|e| std::path::PathBuf::from(e)) else {
        unreachable!()
    };
    // add library path to link search path
    println!(
        "cargo::rustc-link-search={}/extern/raylib-5.5_{}/lib",
        pkg_root.display(),
        if cfg!(target_os = "windows") {
            "win64_mingw-w64"
        } else if cfg!(target_os = "macos") {
            "macos"
        } else {
            "linux_amd64"
        }
    );
    //? link static library
    println!("cargo:rustc-link-lib=static=raylib");
    // other dependencies for library
    if cfg!(target_os = "windows") {
        println!("cargo:rustc-link-lib=dylib=winmm");
        println!("cargo:rustc-link-lib=dylib=gdi32");
        println!("cargo:rustc-link-lib=dylib=user32");
        println!("cargo:rustc-link-lib=dylib=shell32");
    } else if cfg!(target_os = "macos") {
        println!("cargo:rustc-link-search=native=/usr/local/lib");
        println!("cargo:rustc-link-lib=framework=OpenGL");
        println!("cargo:rustc-link-lib=framework=Cocoa");
        println!("cargo:rustc-link-lib=framework=IOKit");
        println!("cargo:rustc-link-lib=framework=CoreFoundation");
        println!("cargo:rustc-link-lib=framework=CoreVideo");
    } else {
        println!("cargo:rustc-link-search=/usr/local/lib");
        println!("cargo:rustc-link-lib=wayland-client");
        println!("cargo:rustc-link-lib=glfw");
    }
}
```

别看内容多，但是每一步都非常明确，所以写起来还算方便

上面这个做法在 Windows 和 Linux 上都没有什么问题，
但是一旦来到 macOS，问题就来了

因为 **Raylib**[^3] 的分发版下载下来后，`lib` 目录下是既包含动态库，也包含静态库的，
在 Windows 和 Linux 上，Rust 会根据 `#[link]` 中的 `kind`
或者在 编译脚本中指定的类型 来决定要链接动态库还是静态库，所以不会有问题，
但是在 macOS 上，Rust 似乎并不会查看要链接的库的类型是静态还是动态，
而是会根据你提供的库的路径中是否包含静态库决定的

也就是说，在 macOS 上，如果你要链接静态库，
而提供的路径中也只有一个静态库版本，那么很好，Rust 会正确的链接你要的库，
但是如果路径中还有动态库版本，那么 Rust 会 **优先链接动态库** 而忽视静态库

## 问题分析

这个问题是我在 macOS 上试图运行 **ksl_raylib**[^4] 的示例代码时发现的，
编译的过程中没有任何报错或警告，看似一切正常，但是当我运行程序，却出现了一个报错：

```log
dlopen(/Users/kevinstephen/.local/share/ksl/lib/libksl_raylib.dylib, 0x0005): Library not loaded: @rpath/libraylib.550.dylib
  Referenced from: <822DA870-8970-38FA-9772-20A658BA7C43> /Users/kevinstephen/projects/rswk/target/debug/libksl_raylib.dylib
  Reason: no LC_RPATH's found
```

嗯？我不是指定了只链接静态库吗，为什么会要求动态库？

然后在尝试修改 `build.rs` 和 cargo 配置都没有正确链接后，
我在 Rust 论坛上 [发帖求助](https://users.rust-lang.org/t/static-library-not-being-linked-correctly-in-rust-dylib-on-macos-arm/128689)

不过好在，很快就有人回帖开始帮忙分析问题

最开始，回帖人以为我是没有正确指明要链接的库，
在我说明清楚问题的背景后，回帖人开始怀疑起链接参数是否正确，
我以为回帖人是没有仔细看我的问题背景描述，
不过我还是按照他的要求使用 `RUSTFLAGS='--print link-args'` 打印了实际链接参数

```log
# ...
"-lraylib" "-framework" "OpenGL" "-framework" "Cocoa" "-framework" "IOKit" "-framework" "CoreFoundation" "-framework" "CoreVideo"
# ...
```

在看到我给出的实际参数后，回帖人发现了问题所在，链接过程中 **没有** `-Bstatic` 或者 `-Bdynamic` 参数！

在看到他的分析后，我想到了一个解决方法，
**那就是把多余的动态库删掉，只保留静态库**，
然后，程序终于可以正常运行了！

## 真正的原因

那么这个问题真正的原因是什么呢？

在回帖人的帮忙下，找到了引起这个问题的 [代码](https://github.com/rust-lang/rust/blob/645d0ad2a4f145ae576e442ec5c73c0f8eed829b/compiler/rustc_codegen_ssa/src/back/linker.rs#L367-L377)

> Really this function only returns true if the underlying linker
> configured for a compiler is binutils `ld.bfd` and `ld.gold`. We
> don't really have a foolproof way to detect that, so rule out some
> platforms where currently this is guaranteed to _not_ be the case:
>
> - On OSX they have their own linker, not binutils'
> - For WebAssembly the only functional linker is LLD, which doesn't
>   support hint flags

也就是说由于平台差异，对于 macOS，Rust 不会指明要使用动态库还是静态库，
所以 `kind` 参数在 macOS 上就是无效的，
由于没有指明需要哪种库，在有动态库的情况下，链接器优先链接动态库，这才导致了这个问题

## 后记

只能说跨平台还是任重道远，
C 和 C++ 最大的问题就是没有一个规范的编译器和相关组件实现，
导致各个平台都有自己的实现，自己的扩展，代码就失去了跨平台能力

~~如果都改用 Rust 就没有这个问题了~~

[^1]:
    the link attribute.The Rust Reference \[S/OL\].(2025-04-14)\[2025-04-23\].
    <https://doc.rust-lang.org/stable/reference/items/external-blocks.html#the-link-attribute>

[^2]:
    Build Scripts.The Cargo Book \[\M/OL\]. (2025-03-19)\[2025-04-23\].
    <https://doc.rust-lang.org/cargo/reference/build-scripts.html>

[^3]:
    Raylib: v5.5.0 \[CP/OL\].(2024-11-18)\[2025-04-23].
    <https://github.com/raysan5/raylib>

[^4]:
    ksl_raylib \[CP/OL\]. (2025-04-22)\[2025-04-23\].
    <https://github.com/kands-code/rswk/tree/repo-src/ksl_raylib>
