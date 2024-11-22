# 使用 Meson 构建 Cpp 项目

<p class="archive-time">archive time: 2024-11-22</p>

<p class="sp-comment">这也算自己的一个备份，防止自己忘记</p>

[[toc]]

有一段时间没更新博客了，主要是一直在瞎忙，导致 SICP 和 99 Questions 这两个系列完结遥遥无期，
反正债多不愁，所以今天还是不更新另外两个系列，而是来看看 Meson 这个编译工具

## 缘起

Meson 的定位是 CMake，底下使用的是 Ninja，对应 GNU Make

那么我为什么要放着好好的 CMake 不用，而来用 Meson 呢？

因为 Meson 足够简单，比起冗长的 `CMakeLists.txt`，`meson.build` 要更加易读，
而且许多的 Linux 项目都是使用 Meson，特别是 Gnome 和 GTK 的项目

## 入门

我们先来看一个简单示例，来编译一个单文件项目，其目录结构如下：

```plaintext
.
├── main.cpp
└── meson.build
```

其中 `meson.build` 内容如下：

```meson
project('meson tutorial', 'cpp')
executable('tutorial', 'main.cpp')
```

### 初始化

要使用 Meson 来构建项目，首先要使用 Meson 来初始化：

```bash
meson setup --prefix="$HOME/.local/sdk/user" --backend="ninja" --buildtype="debug" "./build/debug" "./"
```

其中 `--prefix` 指定了软件安装位置，`--backend` 指定了底层编译工具，
而 `--buildtype` 指定了编译类型，是调试类型还是发行类型

而如果要优化编译，可以使用发行类型：

```bash
meson setup --prefix="$HOME/.local/sdk/user" --backend="ninja" --buildtype="release" --debug "./build/release" "./"
```

其实这些选项都可以忽略，默认情况的安装位置是 `/local/usr`，而编译类型则默认是调试类型，所以一般来说可以简化为如下指令：

```bash
meson setup "./build/debug" "./"
```

后面两个是位置参数，分别代表编译到的位置以及源代码所在目录

更为直接的，可以使用 `meson build` 来初始化项目，
默认编译内容会放到 `./build` 目录下，但是为了方便区分，一般还是会放到类似 `./build/debug` 这种目录下

### 编译

初始化项目后就是要编译项目了，指令也非常简单：

```bash
meson compile -C "./build/debug"
```

其中 `-C` 表示执行编译指令前先切换到对应目录，这是因为 `meson compile` 只有在 Meson Build 目录下才能编译

也可与手动使用对应的编译后端来编译，例如 `ninja`：

```bash
ninja -C "./build/debug"
```

## 复杂一点的例子

当然，一般的项目没有这么简单，下面是一个正常项目的结构

```plaintext
.
├── include
│   ├── meson.build
│   └── tut
│       └── tut.hpp
├── meson.build
├── src
│   ├── main.cpp
│   ├── meson.build
│   └── tut
│       ├── meson.build
│       └── tut.cpp
└── subprojects
    └── libtutorial
        ├── include
        │   ├── meson.build
        │   └── tutorial
        │       └── tutorial.hpp
        ├── meson.build
        └── tutorial.cpp
```

其中 `tut` 是项目内部库，而 `libtutorial` 则是子项目，可以是用源码管理的外部项目

我们自顶向下来看看每个 `meson.build` 文件里写了什么，以及各自的作用

### 项目配置

```meson
# ./meson.build

project(
    'example',
    'cpp',
    version: '0.1',
    default_options: ['cpp_std=c++17'],
)

# headers
subdir('include')
incs = include_directories('include')

# subprojects
libtutorial_dep = dependency('libtutorial', fallback: ['libtutorial', 'libtutorial_dep'])

# sources
subdir('src')

executable(
    'example',
    sources,
    include_directories: incs,
    dependencies: [libtutorial_dep, libtut_dep],
    install: true,
)
```

在 `project()` 中，我们可以设置非常多的东西，例如项目的版本，使用的语言，以及标准等级

然后，通过 `subdir()` 将 `include` 目录加入项目，
这是一个推荐做法，也就是将头文件专门用一个目录存放，而不是和源码放在一起，
这样也方便 `pkgconfig` 之类的工具安装库和设置对应变量

`include_directories()` 则是为了生成 `compile_commands.json` 文件，方便 IDE 提示

对于外部依赖，如果是通过源码管理的，我们可以使用 `subproject()` 来加入依赖，
但是由于需求非常常见，所以我们可以直接使用 `dependency()` 的 `fallback` 选项快捷地添加依赖

而后就是将源文件目录加入项目，通过 `executable()` 从而编译生成一个可执行文件

### 头文件管理

在 `include` 目录中，文件内容如下：

```meson
# ./include/meson.build

install_subdir('tut', install_dir: get_option('includedir'))
```

而在 `subprojects/libtutorial/include` 文件夹中的内容大同小异，只是将目录名改成了 `tutorial`

`install_subdir()` 指定了要安装的头文件，方便之后寻找头文件

### 源码管理

这里源码分成了两部分，一个是可执行文件对应的 `main.cpp`，另一个就是项目自己的库 `tut`

```meson
# ./src/meson.build

# all source file for executable
sources = files('main.cpp')

# local libs
subdir('tut')
```

内容非常简单，通过 `files` 指定有哪些文件，然后在 `./meson.build` 中就可以通过 `sources` 变量来使用这些文件，然后将 `tut` 加入项目

```meson
# ./src/tut/meson.build

# sources
tut_sources = files('tut.cpp')

# math dependency
cxx = meson.get_compiler('cpp')
m_dep = cxx.find_library('m', required: true)

# declare a shared library
# can use static_library() for static libraries
# or just use library() and declare by options
libtut = shared_library(
    'tut',
    tut_sources,
    include_directories: incs,
    dependencies: [m_dep],
    install: true,
)

# declare as a dependency
libtut_dep = declare_dependency(include_directories: incs, link_with: libtut)

# generate pkgconfig files
pkg_config = import('pkgconfig')
pkg_config.generate(
    name: 'Tut',
    filebase: 'tut',
    description: 'a meson tutorial dependcies',
    libraries: libtut,
)
```

在 `tut` 中我们定义了一个库，库的定义一般使用 `library()` 就可以了，
但是如果要指定库的形式，那么也可以使用 `static_library()` 和 `shared_library()` 来指定

编译器有时候并不会自动链接一些库，例如数学库 `m` 和线程库，
所以我们需要通过编译器来链接对应的库依赖，即 `cxx.find_library()`，
其中 `required` 选项如果是 `true`，那么在找不到库的情况下编译过程就会停止，而 `false` 则不会

为了方便别人链接我们的库，我们可以自己暴露一些变量，例如 `libtut_dep`，而其他人就可以通过 `get_variable()` 来获取这些内容

如果要更进一步使用 `pkgconfig` 管理，
我们可以使用 `import` 加载 `pkgconfig` 的相关内容，
然后通过 `generate` 为我们的库生成对应的 `.pc` 文件

### 子项目

子项目一定要放在 `./subprojects` 文件夹下，而 `./subprojects/libtutorial/meson.build` 文件则是项目文件，也就是需要有 `project()`

```meson
# ./subprojects/libtutorial/meson.build

# library project declare
project('libtutorial', 'cpp', default_options: ['cpp_std=c++17'])

# headers
subdir('include')
headers = include_directories('include')

# sources
sources = files('tutorial.cpp')

# declare a static library
# can use shared_library() for shared libraries
# or just use library() and declare by options
libtutorial = static_library(
    'tutorial',
    sources,
    include_directories: headers,
    install: true,
)

# declare as a dependency
libtutorial_dep = declare_dependency(include_directories: headers, link_with: libtutorial)

# generate pkgconfig files
pkg_config = import('pkgconfig')
pkg_config.generate(
    name: 'Tutorial',
    filebase: 'tutorial',
    description: 'a meson tutorial subproject',
    libraries: libtutorial,
)
```

### 编译和安装

准备好这些文件后，我们就可以开始编译了，初始化过程和普通项目一样，编译可以使用 `meson compile -C "./build/debug"` 来编译

```bash
meson setup --prefix="$HOME/.local/sdk/user" --backend="ninja" --buildtype="debug" "./build/debug" "./"
meson compile -C "./build/debug"
meson install -C "./build/debug"
```

## 后记

Meson 看起来比较繁琐，但是功能上比较直观，并且非常方便配合 `pkgconfig` 工具使用，所以还是非常值得一学的
