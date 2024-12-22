# 计算 QR 分解

<p class="archive-time">archive time: 2024-12-22</p>

<p class="sp-comment">记录一下计算过程，防止之后想要重构的时候不会算</p>

[[toc]]

## 缘起

为什么会有这么一篇记录呢？

最主要的就是为自己留一个思路备份，防止之后如果自己又想要实现 QR 分解，不知道如何计算，
同时也是让自己在记录的时候理一下思路，对于计算的过程更加清楚

## QR 分解

那么什么是 QR 分解呢？

对于一个维数为 $n \times k$ 的矩阵 $A$，如果这个矩阵的列向量 $a_1,\ a_2,\ \dots,\ a_k$ 是两两线性无关的，
这要求这个矩阵的应该是一个高矩阵或者是方阵，即 $n \ge k,\ rank(A) = k$，
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
    u_k^{(2)} &= u_k^{(2)} - (u_k^{(2)} \cdot e_2) e_2 \\
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

## 后记

整体实现的难度不是很大，按照步骤一步步实现即可，但是对于细节的处理还是需要多注意，
例如 Householder 方法中，究竟是加上 模 与 符号数 的乘积，还是减去，这个有一个取舍，
对于浮点数实现，一般是使用加上，从而避免得到 `NaN`

还有就是对于这两种分解背后的方法，即 Gram-Schimdt 正交化和 Householder 变换，
对于其几何解释的理解也是难点之一

---

[^1]:
    BOYD S, VANDENBERGEHE L. 应用线性代数：向量、矩阵及最小二乘\[M\]. 张文博, 张丽静, 译.
    北京: 机械工业出版社, 2020.8: 163\[2024-12-22\]

[^2]:
    Gram–Schmidt 过程.Wikipedia \[DB/OL\].(2024-11-26)\[2024-12-22\].
    <https://en.wikipedia.org/wiki/Gram%E2%80%93Schmidt_process#Numerical_stability>

[^3]: 对于实数，符号数对于正数就是 $1$，负数就是 $-1$，零就是 $0$，而对于复数，符号数就是对其归一化的值，即 $c / |c|$
