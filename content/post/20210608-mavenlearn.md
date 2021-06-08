---
title: "Maven基础操作"
date: 2021-06-08T17:04:24+08:00
lastmod: 2021-06-08T17:04:24+08:00
draft: false
summary: "出于某些原因，我选择放弃了IDE，所以不得不学习一下如何使用Maven手动创建工程"
katex: true
mermaid: true
comments: true
tags: ["Maven", "Notes"]
categories: ["Miscellany", "Coding"]
dropCap: false
indent: false
---

## 起因

由于某些 *心理洁癖*，我将系统上的所有不必要的组件和IDE都卸载删除了，特别是喷气大脑[^1]**IDEA**，删除后在清理掉不必要的缓存和配置[^2]后，整整空出了`5G`的空间，到目前为止，我的系统硬盘空间使用情况为

```shell
[kands@ksc ~ 17:27] [$] [ yes ]
In[1]:= df -h
Out[1]:=
文件系统        容量  已用  可用 已用% 挂载点
dev             7.5G     0  7.5G    0% /dev
run             7.6G  1.6M  7.6G    1% /run
/dev/nvme0n1p3  472G   45G  427G   10% /
tmpfs           7.6G   16K  7.6G    1% /dev/shm
tmpfs           7.6G   44K  7.6G    1% /tmp
/dev/nvme0n1p1  511M  144K  511M    1% /boot/efi
tmpfs           1.6G   56K  1.6G    1% /run/user/1000
```

启动后内存占用也基本在`900M`左右，平常使用[^3]时在`3G`左右，相较于之前使用 *IDE* 的情况好了不知道多少，而且由于我使用了`environment.d`配置方法，且拒绝使用 *电子系* 软件[^4]，配置文件基本统一集中在`./config`目录下，除了`.ssh`这样比较特殊的文件夹外，基本无隐藏文件，我的家目录也是极为干净的，目前身心~~极度愉悦~~

```shell
[kands@ksc ~ 17:28] [$] [ yes ]
In[9]:= ls -alh
Out[9]:=
总用量 24K
drwx------ 20 kands kands  313  6月  8 17:02 .
drwxr-xr-x  3 root  root    19  2月 20 11:59 ..
drwxr-xr-x 46 kands kands 4.0K  6月  8 17:02 .cache
drwx------ 45 kands kands 4.0K  6月  8 17:18 .config
drwxr-xr-x  3 kands kands   23  2月 23 14:59 .designer
drwxr-xr-x  2 kands kands   49  6月  6 21:47 Desktop
drwxr-xr-x  7 kands kands   92  6月  1 14:31 Documents
drwxr-xr-x  2 kands kands  125  6月  7 21:37 Downloads
-rw-r--r--  1 kands kands  276  6月  8 17:02 .gtkrc-2.0
drwxr-xr-x  4 kands kands   37  6月  8 12:48 .java
drwxr-xr-x  5 kands kands   41  6月  5 20:30 .local
drwxr-xr-x 14 kands kands 4.0K  5月 22 17:55 .minecraft
drwx------  5 kands kands   66  2月 20 13:04 .mozilla
drwxr-xr-x  2 kands kands    6  4月  5 20:28 Music
drwxr-xr-x  2 kands kands   95  6月  7 21:02 Pictures
drwx------  3 kands kands   19  3月 13 12:18 .pki
drwxr-xr-x  2 kands kands    6  2月 20 12:57 Public
drwx------  2 kands kands   65  3月 15 13:54 .ssh
drwxr-xr-x  3 kands kands   22  6月  7 20:23 Templates
drwxr-xr-x  2 kands kands    6  6月  7 00:45 Videos
drwxr-xr-x  4 kands kands   33  5月 24 14:47 .Wolfram
-rw-------  1 kands kands   48  6月  8 17:02 .Xauthority
```

不过我这种状态完全不是做事的状态，真要做事还得将效率，该用IDE还是得用，但是自己折腾一下也是十分有意思的，反正很闲（qs

下面我就来讲讲`Maven`的使用方法吧

> 注：文中出现的路径均为本人配置路径，需要根据你的配置进行一定的修改

## Maven

要使用Maven，那首先得去下载一个，建议到官网去下载，而不是使用源里面的Maven

### 安装

不是说源里面的版本老[^5]，arch源里面的软件还是很新的，如果你想 <ruby>体验最新<rp>(</rp><rt>自 己 作 死</rt><rp>)</rp></ruby>，那么你还可以试试`test`源

但从源里面下载的软件有一个比较大的缺点，那就是不好该配置，基本上都需要使用 *root权限*，本着**最小权限原则**[^6]，我们应该自己到官网去下载对应二进制包或源码包，源码包还需要自行编译，我这里选择下载二进制包

将下载好的二进制包解压后放进一个你喜欢的目录即可，还需要配置好`M2_HOME`和`PATH`等环境变量，这样就算安装好了，可以使用`mvn -v`来验证一下是否能够使用了

```shell
[kands@ksc ~ 18:19] [$] [ yes ]
In[14]:= echo $M2_HOME
Out[14]:=
/home/kands/.local/bin/self-bin/maven-3.8
[kands@ksc ~ 18:19] [$] [ yes ]
In[15]:= echo $PATH
Out[15]:=
/usr/local/sbin:/usr/local/bin:/usr/bin:/usr/lib/jvm/default/bin:/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl:/home/kands/.local/bin/self-bin/maven-3.8/bin
[kands@ksc ~ 18:19] [$] [ yes ]
In[17]:= mvn -v
Out[17]:=
Apache Maven 3.8.1 (05c21c65bdfed0f71a2f2ada8b84da59348c4c5d)
Maven home: /home/kands/.local/bin/self-bin/maven-3.8
Java version: 11.0.11, vendor: Oracle Corporation, runtime: /usr/lib/jvm/java-11-openjdk
Default locale: zh_CN, platform encoding: UTF-8
OS name: "linux", version: "5.12.9-arch1-1", arch: "amd64", family: "unix"
```

### 配置本地仓库

修改`M2_HOME/conf/settings.xml`文件，找到`<localRepository>`这个配置

```xml
<!-- localRepository
| The path to the local repository maven will use to store artifacts.
|
| Default: ${user.home}/.m2/repository
<localRepository>/path/to/local/repo</localRepository>
-->
```

默认是没有配置的，而是在注释中，你需要在这个注释底下的空白位置自己补充配置

```xml
<localRepository>/home/kands/.local/lib/mavenRepo</localRepository>
```

我这里是配置到我的`~/.local/lib/mavenRepo`目录下了，你们找个空闲点的位置就可以了，这个不是特别重要，只要你能找到就行

### 文件结构

首先，我们要来看看一个Maven项目的基本文件结构，这里介绍一个很好的用法，`archetype`

有了`archetype`就不需要我们自己手动创建文件结构和写初始的`pom.xml`了

要看有那些模板，可以查看[这个网站](http://maven.apache.org/archetypes/index.html)，这里，我们使用`maven-archetype-simple`

```shell
.
└── TestMaven
    ├── pom.xml
    └── src
        ├── main
        │   └── java
        │       └── top
        │           └── kands
        │               └── App.java
        └── test
            └── java
                └── top
                    └── kands
                        └── AppTest.java

10 directories, 3 files
```

上面显示的就是创建的项目结构，在使用了官方提供的命令后

```shell
mvn archetype:generate -DarchetypeGroupId=org.apache.maven.archetypes -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4
```

Maven以交互式方式为我们创建好了项目并配置了基本的`pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>top.kands</groupId>
  <artifactId>TestMaven</artifactId>
  <version>0.0.1-SNAPSHOT</version>

  <name>TestMaven</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.7</maven.compiler.source>
    <maven.compiler.target>1.7</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <pluginManagement><!-- lock down plugins versions to avoid using Maven defaults (may be moved to parent pom) -->
      <plugins>
        <!-- clean lifecycle, see https://maven.apache.org/ref/current/maven-core/lifecycles.html#clean_Lifecycle -->
        <plugin>
          <artifactId>maven-clean-plugin</artifactId>
          <version>3.1.0</version>
        </plugin>
        <!-- default lifecycle, jar packaging: see https://maven.apache.org/ref/current/maven-core/default-bindings.html#Plugin_bindings_for_jar_packaging -->
        <plugin>
          <artifactId>maven-resources-plugin</artifactId>
          <version>3.0.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-compiler-plugin</artifactId>
          <version>3.8.0</version>
        </plugin>
        <plugin>
          <artifactId>maven-surefire-plugin</artifactId>
          <version>2.22.1</version>
        </plugin>
        <plugin>
          <artifactId>maven-jar-plugin</artifactId>
          <version>3.0.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-install-plugin</artifactId>
          <version>2.5.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-deploy-plugin</artifactId>
          <version>2.8.2</version>
        </plugin>
        <!-- site lifecycle, see https://maven.apache.org/ref/current/maven-core/lifecycles.html#site_Lifecycle -->
        <plugin>
          <artifactId>maven-site-plugin</artifactId>
          <version>3.7.1</version>
        </plugin>
        <plugin>
          <artifactId>maven-project-info-reports-plugin</artifactId>
          <version>3.0.0</version>
        </plugin>
      </plugins>
    </pluginManagement>
  </build>
</project>
```

可以见到`<groupId>`，`<artifactId>`以及`<version>`，也就是常说的 *gav坐标*，已经在交互模式下，根据我们提供的信息为我们配置好了

所谓的 *gav坐标* 也就是Maven项目的**唯一标识**，也就是说，每一个Maven项目都有独一无二的gav坐标，Maven会根据这三个值来区分是否为同一项目

### pom.xml 文件简述

在项目根目录下的`pom.xml`文件就是这个项目的配置文件，规定了项目的方方面面，主要要看的就是 *gav*，*dependencies* 以及 *build* 这几个配置项

在创建项目时，gav坐标就已经创建好了，除了`<version>`还需要自己手动修改一下，其他两项就不必再动

`<dependencies>`下定义的是这个项目要用到的依赖，都可以到[这个网站](https://mvnrepository.com/)去查询，需要什么依赖，什么版本的，就直接复制网页提供的配置方法到`<dependencies>`下就好了，比如

```xml
<dependencies>
  <dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.11</version>
    <scope>test</scope>
  </dependency>
</dependencies>
```

这个是默认生成的一个依赖，其中`<scope>`项定义的就是这个依赖使用的范围，这里，这个`junit`依赖使用的范围就是`test`，也就是测试环节需要使用到这个依赖，一般不需要额外指定这个选项

`<build>`说明了你的编译时的配置，比如使用什么版本的jdk，要编译出什么版本上的jre上可以运行的项目等等，还有打包等事宜都是在这里配置的

### Maven生命周期

Maven的生命周期，简单来说就是Maven完成一次项目所要经过的步骤，或者说功能，与我们要使用的指令都是一一对应的

- 清理 `mvn clean`
- 编译 `mvn compile`
- 测试 `mvn test-compile` 用来编译测试文件 `mvn test` 来测试
- 报告
- 打包 `mvn package`
- 安装 `mvn install`

Maven的功能是通过Maven插件（jar包）来实现的，这个在你们运行`mvn`命令时自然就会看见它会`download`一些`jar`包，即便你没有依赖到那个包，因为要完成生命周期需要那些jar包，或者说插件，的支持

由于 *生命周期*，某个阶段之前的命令在某个阶段前都会被执行，意思是说如果你执行 `mvn install`，那么前面的 `compile` 什么的也都会先执行一遍

#### 编译

默认的 `mvn compile` 只会编译 `src/main/java` 目录下的所有 `.java` 文件，而要编译`src/test/java`则需要使用`mvn test-compile`

编译出来的文件默认存放在 `target/classes` 目录下，test目录的则会编译到 `target/test-classes` 目录下

#### 创建测试程序

在Maven项目中的`src/test/java`目录下，创建测试程序

推荐的创建类和方法的提示

- 测试类的名称是 `<test-class> + Test`
- 测试的方法是 `test + <test-method>`

例如测试`HelloMaven`类中的`add`方法是否正确

```java
import org.junit.Assert;
import org.junit.Test;

class Main {
@Test
    public void testAddInt(int a, int b) {
        System.out.println("Test started!");
        Main m1 = new Main();
        int res = m1.addInt(10, 20);
        // 验证 10 + 20 是不是30
        // assertEquals(期望, 实际)
        Assert.assertEquals(30, res);
    }
}
```

`testAdd()`的定义规则是

- 方法是`public`的
- 返回值是`void`
- 推荐按照规则定义方法名
- `@Test` 的测试标签

#### resources文件夹

这个目录在`quickstart`这个模板里没有生成，需要我们手动创建

test也是，这个目录对于项目本身是在`src/main/resources`，对于测试文件则在`src/test/resources`目录

编译时，resources文件夹下的所有文件都会被拷贝到 `target/classes/` 目录下，而在`test-compile`命令下，test目录的`resources`目录下的所有内容也会被拷贝到`target/test-classes`目录下

#### install

会把打包出来的jar包安装到本地仓库里

至于如何打包，一般而言直接 `mvn package` 就足够了，如果要打包出一个可以使用 `java -jar` 执行的jar包，则需要额外配置，我这里就不细说了，因为太多了

---

好了，Maven的大致使用方法就是上面这些，希望能够帮到大家

[^1]: 即Jetbrains，Jet 喷射，brains 大脑，由此得名
[^2]: 缓存一般在 `~/.cache/Jetbrains` 底下，配置一般在 `~/.config/Jetbrains` 底下，还要检查一下 `~/.local/share` 看看有无喷气大脑的文件
[^3]: 指开三个左右终端，分别用来编辑，查看，监测，以及10个网页标签
[^4]: 指用[electron](https://github.com/electron/electron)开发的项目
[^5]: 点名批评**Debian**系
[^6]: 百度文库.最小权限原则 [DB/OL].[https://baike.baidu.com/item/最小权限原则](https://baike.baidu.com/item/%E6%9C%80%E5%B0%8F%E6%9D%83%E9%99%90%E5%8E%9F%E5%88%99),2019-12-06/2021-06-08
