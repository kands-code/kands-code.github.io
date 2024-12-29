# 向量与矩阵的模

<p class="archive-time">archive time: 2024-12-25</p>

<p class="sp-comment">记录一下向量与矩阵的模的定义与计算</p>

[[toc]]

模是对于向量或者矩阵本身的一种衡量指标，不过通常是用在差值上，
例如判断两个向量 $v_1$ 和 $v_2$ 是否接近，可以尝试计算 $\lVert v_1 - v_2 \rVert$

## 内积

要了解向量的模，首先要了解内积

内积又称为标量积，点积，是两个列向量进行运算后得到某个标量的过程

对于 $x, y \in \mathbb{F}^n$，
$x \cdot y = x^\dagger y = \sum_{i = 1}^n {\overline{x}_i y_i}$

其中 $x^\dagger$ 表示对 $x$ 进行共轭转置，
而 $\overline{x}_i$ 表示将 $x$ 向量的第 $i$ 个元素取共轭

对于实数，$x^\dagger = x^T$，$\overline{x}_i = x_i$

所以对于 $A\,x \cdot y$，我们可以表示为 $(A\,x)^\dagger\,y$，
即 $x^\dagger\,A^\dagger\,y = x \cdot (A^\dagger\,y)$

## 向量模

向量的模是一种运算，定义为 $\lVert \cdot \rVert = \mathbb{F}^n \mapsto \mathbb{F}$，
其中 $\lVert x \rVert \ge 0$，并且 $\lVert x \rVert = 0 \iff x = \mathbf{0}$

特别的，$\lVert \alpha x \rVert = |\alpha| \cdot \lVert x \rVert$，其中 $\alpha \in \mathbb{F}$，
并且 $\lVert x + y \rVert \le \lVert x \rVert + \lVert y \rVert$

- $L$-$2$ 模：又称为 **欧几里得模**，定义为 $\lVert x \rVert_2 = \sqrt{x \cdot x} = \sqrt{x^\dagger\,x}$
- $L$-$1$ 模：定义为 $\lVert x \rVert_1 = \sum_{i = 1}^n{|x_i|}$
- $L$-$\infty$ 模：定义为 $\lVert{}x\rVert{}_{\infty} = \max_{1 \le i \le n}{|x_i|}$

其中对于复向量，其 $L$-$\infty$ 模，对应其各自元素的模的最大值

> 通常描述中的模指的是 $L$-$2$ 模

对于 $L$-$1$ 模和 $L$-$2$ 模，
通常有 $\lVert x \rVert_1 \le \sqrt{n} \lVert x \rVert_2$，
其中 $x \in \mathbb{F}^n$

## 特殊矩阵

要介绍矩阵模之前，需要了解一些特殊矩阵：

- 对称矩阵：对于 $A \in \mathbb{F}^{n \times n}$，如果 $A^T = A$，那么 $A$ 就是对称矩阵
- 反对称矩阵：对于 $A \in \mathbb{F}^{n \times n}$，如果 $A^T = -A$，那么 $A$ 就是反对称矩阵
- 正规矩阵：对于 $A \in \mathbb{R}^{n \times n}$，如果 $A^T\,A = A\,A^T$，那么 $A$ 就是正规矩阵
- 正交矩阵：对于 $A \in \mathbb{R}^{n \times n}$，如果 $A^T\,A = \mathcal{I}$，那么 $A$ 就是正交矩阵

对于正规矩阵 $A \in \mathbb{R}^{n \times n}$，
我们有 $\lVert A^T\,x \rVert_2 = \lVert A\,x \rVert_2$

$$
\begin{aligned}
\lVert A^T\,x \rVert_2^2 &= (A^T\,x) \cdot (A^T\,x) = x^T\,A\,A^T\,x \\
  &= x^T\,A^T\,A\,x = A\,x \cdot A\,x \\
  &= \lVert A\,x \rVert_2^2
\end{aligned}
$$

对于正交矩阵 $A \in \mathbb{R}^{n \times n}$，
我们有 $\lVert A\,x \rVert_2 = \lVert x \rVert_2$

$$
\begin{aligned}
\lVert A\,x \rVert_2^2 &= (A\,x) \cdot (A\,x) = x^T\,A^T\,A\,x \\
  &= x^T\,\mathcal{I}\,x = x^T\,x \\
  &= \lVert x \rVert_2^2
\end{aligned}
$$

换言之，正交矩阵保留了向量的长度特征，
特别的，正交矩阵 $A$ 的每一个列向量组成了一个正交归一系统，
即列向量之间两两正交且模长都是 $1$

对于复矩阵，我们有类似实矩阵的特殊矩阵：

- 厄米矩阵：对于 $A \in \mathbb{C}^{n \times n}$，如果 $A^\dagger = A$，那么 $A$ 就是厄米矩阵
- 反厄米矩阵：对于 $A \in \mathbb{C}^{n \times n}$，如果 $A^\dagger = -A$，那么 $A$ 就是反厄米矩阵
- 复正规矩阵：对于 $A \in \mathbb{C}^{n \times n}$，如果 $A^\dagger\,A = A\,A^T$，那么 $A$ 就是复正规矩阵
- 酉矩阵：对于 $A \in \mathbb{C}^{n \times n}$，如果 $A^\dagger\,A = \mathcal{I}$，那么 $A$ 就是酉矩阵

## 矩阵模

接下来就是矩阵的模，类似向量模的定义，
矩阵模定义为 $\lVert \cdot \rVert = \mathbb{F}^{n \times n} \mapsto \mathbb{F}$，
其中 $\lVert A \rVert \ge 0$，并且 $\lVert A \rVert = 0 \iff A = \mathbf{0}$

同样，$\lVert \alpha A \rVert = |\alpha| \cdot \lVert A \rVert$，其中 $\alpha \in \mathbb{F}$，
并且 $\lVert A + B \rVert \le \lVert A \rVert + \lVert B \rVert$

如果定义了向量模，我们可以用向量模来定义矩阵模，即 **_诱导矩阵模（induced matrix norm）_**

其中对于诱导矩阵模，有 $\lVert A\,B \rVert \le \lVert A \rVert \cdot \lVert B \rVert$，
定义 $\lVert \mathcal{I} \rVert = 1$

### 实矩阵模

对于 $A \in \mathbb{R}^{n \times n}$，我们有：

$$
\lVert A \rVert = \max_{x \in \mathbb{R}^n,\,x \ne \mathbf{0}}{\dfrac{\lVert A\,x \rVert}{\lVert x \rVert}}
$$

即对于所有的 $x \in \mathbb{R}^n$，$\lVert A\,x \rVert \le \lVert A \rVert \cdot \lVert x \rVert$

所以我们也有 $\lVert A \rVert_1$，$\lVert A \rVert_2$ 和 $\lVert{}A\rVert{}_{\infty}$

#### 谱半径估计

对于 $A \in \mathbb{R}^{n \times n}$，对于所有的诱导矩阵模，都应该满足 $\rho(A) \le \lVert A \rVert$

令 $\lambda \in \sigma(A)$，其中 $|\lambda| = \rho(A)$，设 $u$ 是 $\lambda$ 对应的特征向量，
则 $\lVert A\,u \rVert = \lVert \lambda\,u \rVert = \rho(A)\,\lVert u \rVert$，
又有 $\lVert A\,u \rVert \le \lVert A \rVert \cdot \lVert u \rVert$，
即 $\rho(A)\,\lVert u \rVert \le \lVert A \rVert \cdot \lVert u \rVert$，
由于 $u \ne \mathbf{0},\,\lVert u \rVert \ne 0$，可得 $\rho(A) \le \lVert A \rVert$

#### 诱导实矩阵模

定义 $A \in \mathbb{R}^{m \times n}$ 的 $L$-$1$ 模为：$\max_{1 \le j \le n}{\sum_{i = 1}^m{|a_{i\,j}|}}$，
即各个列向量元素的绝对值的和的最大值

定义 $A \in \mathbb{R}^{m \times n}$ 的 $L$-$\infty$ 模为：$\max_{1 \le i \le m}{\sum_{j = 1}^n{|a_{i\,j}|}}$，
即各个行向量元素的绝对值的和的最大值

定义 $A \in \mathbb{R}^{n \times n}$ 的 $L$-$2$ 模为：$\sqrt{\rho(A^T\,A)} = \sqrt{\rho(A\,A^T)}$，
即矩阵与其转置的积的谱半径的平方根

### 复矩阵模

复矩阵的模和实矩阵类似，但是需要说明的是，$A^\dagger A$ 是厄米矩阵，这意味着其特征值虚部一定为 $0$，
或者说，其特征值可以认为是实数[^1]，是可以比较的，而复数的绝对值就是复数的模，也是实数，
所以对应的将绝对值换成取模，转置换成共轭转置就可以得到对应复数模的定义

### Frobenius 模

不过不是所有的矩阵模都是从向量模诱导出来的，
例如对于 $A \in \mathbb{F}^{m \times n}$，其 Frobenius 模定义如下：

$$
\lVert{}A\rVert{}_F = \sqrt{\sum_{i = 1}^m{\sum_{j = 1}^n{a_{i\,j}^2}}}
$$

## 后记

矩阵模，或者说模，非常具有迷惑性的一点就是模的结果的类型可以和矩阵元素类型不同，
这点在复数矩阵上体现得淋漓尽致，归结到一点就是复数无序，无法比较，
但是我们又时常需要对元素进行比较，所以有了一定的妥协

> It works!

---

[^1]:
    厄米矩阵.Wikipedia \[DB/OL\].(2024-11-10)\[2024-12-26\].
    <https://en.wikipedia.org/wiki/Hermitian_matrix#Spectral_properties>
