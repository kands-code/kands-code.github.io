# 计算 QR 分解

<p class="archive-time">archive time: 2024-12-23</p>

<p class="sp-comment">记录一下计算过程，防止之后想要重构的时候不会算</p>

[[toc]]

## 缘起

为什么会有这么一篇记录呢？

最主要的就是为自己留一个思路备份，防止之后如果自己又想要实现 QR 分解，不知道如何计算，
同时也是让自己在记录的时候理一下思路，对于计算的过程更加清楚

## QR 分解

那么什么是 QR 分解呢？

对于一个维数为 $n \times k$ 的矩阵 $A$，如果这个矩阵的列向量 $a_1,\ a_2,\ \dots,\ a_k$ 是两两线性无关的，
这要求这个矩阵的应该是一个高矩阵或者是方阵，即 $n \ge k,\,\textnormal{rank}(A) = k$，
那么我们可以说这个矩阵可以通过某些方法得到 $A = Q R$，其中 $Q^T Q = \mathcal{I}$，而 $R$ 是一个上三角矩阵[^1]

由于 $R$ 是上三角矩阵，对于位于 $i$ 行 $j$ 列的元素，如果 $j > i$，那么 $r_{i\,j} = 0$，
则对于 $A$ 的列向量 $a_k$，可以用 $Q$ 的列向量 $q_k$ 和 $R$ 的元素来表示，即：

$$
a_k = \sum_i^k r_{i\,k} q_i
$$

这个“某些方法”有很多，不过常见的方法只有三种，那就是 **_Gram-Schmidt 过程_**，**_Householder 方法_** 以及 **_Givens 旋转_**

但是由于 Givens 旋转只在相对较少的非对角线元素为零的时候比较有用，通常我们只会使用 Gram-Schmidt 过程 和 Householder 方法

### Gram-Schmidt 过程

Gram-Schmidt 过程计算是相对简单的，不过因此也是相对数值不稳定的[^2]，整个计算大概可以分成 $4$ 步：

1. 将原矩阵 $A$ 拆分成列向量表示，即 $\left[a_1 \mid a_2 \mid \cdots \mid a_k \right]$
2. 我们有辅助向量 $u_k$，其中 $u_1 = a_1$，对于 $k > 1$，$u_k = a_k - \sum_{n = 1}^{k - 1}{(a_k \cdot e_n)\, e_n}$
3. 对应的，我们可以对其归一化，即 $e_k = u_k / \lVert u_k \rVert_2$
4. 那么 $Q = \left[e_1 \mid e_2 \mid \cdots \mid e_k \right]$，$R = Q^T A$ 或者 $r_{i\,j}=a_i \cdot e_j$

其中对于辅助向量 $u_k$ 的计算是误差的关键，
所以就有了 **_MGS_**，即修正 Gram-Schmidt 过程，
将计算 $u_k$ 的过程展开为了：

$$
\begin{aligned}
    u_k^{(1)} &= a_k - (a_k \cdot e_1) e_1 \\
    u_k^{(2)} &= u_k^{(1)} - (u_k^{(1)} \cdot e_2) e_2 \\
    &\vdots \\
u_k^{(k - 1)} &= u_k^{(k - 2)} - (u_k^{(k - 2)} \cdot e_{k - 1}) e_{k - 1}
\end{aligned}
$$

这样可以有效的减少计算误差

### Householder 方法

Householder 方法的 QR 分解主要是靠 Householder 变换，
即对于某个已经归一化的向量 $v$，我们可以有：

$$
P = \mathcal{I} - 2 v v^{\dagger}
$$

其中 $v^{\dagger}$ 是 $v$ 的共轭转置，也可表示为 $v^H$，对于实向量，等价为转置，即 $v^T$

对于计算出来的这个 $P$ 我们称为 Householder 矩阵，而这个过程就是 Householder 变换

这个 Householder 矩阵有非常多的性质，其中非常重要的就是这个矩阵是自反矩阵，即 $P P = \mathcal{I}$

具体的 QR 分解的步骤如下：

1. 先令 $R^{(1)} = A$，然后取 $R^{(k)}$ 的第 $k$ 列 $x_k$，并且令取出来的列向量中位置 $i < k$ 的元素都为 $0$ 得到 $\tilde{x}_k$
2. 然后让 $\tilde{x}_k$ 的第 $k$ 位加上自身的模 $\lVert \tilde{x}_k \rVert_2$ 乘以 **_符号数_**[^3]，记为 $v_k$
3. 对 $v_k$ 进行 Householder 变换，即
   $$
   P_k = \mathcal{I} - \dfrac{2}{v_k^{\dagger} \cdot v_k} v_k v_k^{\dagger}
   $$
4. 则 $R^{(k)} = P_{k - 1} R^{(k - 1)}$，其中对于纬度为 $m \times n$ 的矩阵 $A$，$1 \le k \le \min{(m, n)}$
5. $Q = P_1 P_2 \dots P_{k - 1}$

整个计算过程相对 Gram-Schmidt 过程要复杂一点，但是通过对 $x_k$ 的处理得到 $v_k$，可以尽可能保证计算的精度，即有一定的数值稳定性

更进一步，对于高矩阵，$R$ 通常会有部分行为 $0$，对此我们可以进行消减，
即对于 $m > n$ 的矩阵 $A$，我们可以仅保留 $Q$ 的前 $n$ 列和 $R$ 的前 $n$ 行

### Gram-Schmidt 过程 和 Householder 方法的比较

QR 分解是不唯一的，即你使用不同方法得到的矩阵 $Q$ 和 $R$ 也大概率是不一样的，特别是维度

对于 $m \times n$ 的矩阵 $A$，
Gram-Schmidt 过程得到的 $Q$ 是 $m \times n$ 的，而 $R$ 是 $n \times n$ 的，
不过 Householder 方法得到的 $Q$ 是 $m \times m$ 的，而 $R$ 是 $m \times n$ 的，

但是通过优化，即舍去“多余”部分，我们可以得到与 Gram-Schmidt 过程的结果维度接近的 $Q_1$ 和 $R_1$

### Givens 旋转过程

使用 Givens 旋转来计算 QR 分解，实际上就是利用 Givens 旋转矩阵来将特定的位置变成零，从而构造出一个上三角矩阵，
一般这个过程是按照列来进行的，即先将 $A_{m\,1}$ 变成零，然后 $A_{m - 1\,1}$，直到将第一列第 $2$ 到 $m$ 行元素变为零，
第二列也是如此，直到将第二列第 $3$ 到 $m$ 行的元素也就是主对角线下的元素变成零

而这一系列的构造过程中，也就是这些 Givens 旋转矩阵的乘积就是我们的 $Q^T$，
所以 Givens 旋转计算 QR 分解的关键就是构造 Givens 旋转矩阵

假设我想要将 $m \times n$ 的矩阵 $A$ 的 $x$ 行 $y$ 列元素 $A_{x\,y}$ 变成零，通常做法是使用其上一行元素即 $A_{x - 1\,y}$ 进行消元

Givens 旋转矩阵是基于单位矩阵的，所以我们可以先构造一个 $m \times m$ 的单位矩阵称为 $G$

既然被称为旋转矩阵，那么自然是有“转”的部分的，令要被消元的元素为 $e_1$，辅助消元的元素为 $e_2$，
那么对应旋转的半径就是这两个元素构成向量的模长，即 $r = \sqrt{|e_1|^2 + |e_2|^2}$，
那么对应的 $\sin{(\theta)} = e_1 / r$，$\cos{(\theta)} = e_2 / r$

那么对应例子中的 Givens 旋转矩阵只需要将 $G$ 的 $G_{x\,x}$ 和 $G_{x - 1\,x - 1}$ 元素设置为 $\cos{(\theta)}$，
$G_{x\,x - 1}$ 设置为 $-\sin{(\theta)}$，而 $G{x - 1\,x}$ 设置为 $\sin{(\theta)}$，
这样，一个合适的 Givens 旋转矩阵就构造好了，即：

$$
G_{(x-1,\,x)} = \begin{bmatrix}
    1 & 0 & \cdots & 0_{x-1} & 0_x & \cdots & 0 \\
    0 & 1 & \cdots & 0 & 0 & \cdots & 0 \\
    \vdots & & \ddots & \vdots & \vdots & \cdots & \vdots \\
    0_{x - 1} &  & \cdots & \overline{\cos{(\theta)}} & \overline{\sin{(\theta)}} & \cdots & 0 \\
    0_x &  & \cdots & -\sin{(\theta)} & \cos{(\theta)} & \cdots & 0 \\
    \vdots & & & \vdots & \vdots & \ddots  & \vdots \\
    0_n & 0 & \cdots & \cdots & \cdots & & 1
\end{bmatrix}
$$

## 附记：Nullspace 计算

这边再来记录一下如何计算 Nullspace

Nullspace 又称为 Kernel 或者零空间，其在矩阵中的定义为：

$$
\textnormal{Null}(A) = \textnormal{ker}(A) = \left\{ x \mid A x = 0 \right\}
$$

其中 $A$ 是一个 $m \times n$ 的矩阵，$x$ 是一个长度为 $n$ 的向量[^4]

Nullspace 一般在 $\textnormal{rank}(A) < n$ 的时候用于表示该矩阵对应的齐次解对应的解空间，那么该如何计算呢？

其实还是比较简单的，也不用待定系数，通过比较就可以计算：

1. 将矩阵化简成行最简形式，如果是满秩矩阵，那么 Nullspace 就是空集，否则就继续运算
2. 记录每一行第一个不为零的元素的列数，所有的列数一起记为 $C$
3. 我们可以依次按列检查 $\{1,\,2,\,\dots,\,n\} - C$ 并设置对应向量
4. 对应向量的元素中，如果位置属于 $C$，对应元素取反，位置等于自身列数，记为 $1$，其他位置记为 $0$
5. 将所有向量集合就是对应 Nullspace

### 例子

假如我们有矩阵：

$$
A = \begin{bmatrix}
    -3 & 6 & -1 & 1 & -7 \\
    1 & -2 & 2 & 3 & -1 \\
    2 & -4 & 5 & 8 & -4
\end{bmatrix}
$$

要求这个矩阵的 Nullspace，首先将其化简为行最简形式：

$$
\tilde{A} = \begin{bmatrix}
    1 & -2 & 0 & -1 & 3 \\
    0 & 0 & 1 & 2 & -2 \\
    0 & 0 & 0 & 0 & 0
\end{bmatrix}
$$

我们可以标记第一列为第一行首个非零元素，第三列为第二行首个非零元素，
那么 $C = {1, 3}$，对应 $\{1,\,2,\,3,\,4,\,5\} - C = \{2,\,4,\,5\}$

首先检查第二列，对应向量初始化为 $\left[0,\,0,\,0,\,0,\,0\right]$，
第一列属于 $C$，并且对应第一行，那么第一个元素就是第二列第一行的元素的相反数，
向量变成 $\left[2,\,0,\,0,\,0,\,0\right]$，第二列是自身，那么对应位置设为 $1$，
第四列和第五列是其他位置，设置为 $0$，第三列属于 $C$，且对应第二行，那么第三个元素就是第二列第二行元素的相反数，
综合下来，第二列对应的向量就是 $\left[2,\,1,\,0,\,0,\,0\right]$

然后是第四列，第一个元素对应第四列第一行元素的相反数，第二个和第五个元素是其他位置，设为 $0$，
第三个元素对应第四列第二行元素的相反数，最后第四个元素是自身，设为 $1$，
综合下来第四列对应向量就是 $\left[1,\,0,\,-2,\,1,\,0\right]$

第五列也是一样的流程，第一个和第三个元素分别对应第五列第一行和第二行元素的相反数，第二个和第四个元素是其他位置，设为 $0$，
第五个元素是自身，设为 $1$，即 $\left[-3,\,0,\,2,\,0,\,1\right]$

那么这个矩阵 $A$ 对应的 Nullspace 就是：

$$
\textnormal{Null}(A) = \textnormal{ker}(A) = \left\{
        \begin{bmatrix} 2 \\ 1 \\ 0 \\ 0 \\ 0 \end{bmatrix},\,
        \begin{bmatrix} 1 \\ 0 \\ -2 \\ 1 \\ 0 \end{bmatrix},\,
        \begin{bmatrix} -3 \\ 0 \\ 2 \\ 0 \\ 1 \end{bmatrix}
    \right\}
$$

## 后记

整体实现的难度不是很大，按照步骤一步步实现即可，但是对于细节的处理还是需要多注意，
例如 Householder 方法中，究竟是加上 模 与 符号数 的乘积，还是减去，这个有一个取舍，
对于浮点数实现，一般是使用加上，从而避免得到 `NaN`

还有就是对于这几种分解背后的方法，特别是 Gram-Schimdt 正交化和 Householder 变换，
对于其几何解释的理解也是难点之一

[^1]:
    BOYD S, VANDENBERGEHE L. 应用线性代数：向量、矩阵及最小二乘\[M\]. 张文博, 张丽静, 译.
    北京: 机械工业出版社, 2020.8: 163\[2024-12-22\]

[^2]:
    Gram–Schmidt 过程.Wikipedia \[DB/OL\].(2024-11-26)\[2024-12-22\].
    <https://en.wikipedia.org/wiki/Gram%E2%80%93Schmidt_process#Numerical_stability>

[^3]: 对于实数，符号数对于正数就是 $1$，负数就是 $-1$，零就是 $0$，而对于复数，符号数就是对其归一化的值，即 $c / |c|$
[^4]:
    零空间.Wikipedia \[DB/OL\].(2024-12-4)\[2024-12-23\].
    <https://en.wikipedia.org/wiki/Kernel_(linear_algebra)>
