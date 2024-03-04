# C 语言数学解析器

<p class="archive-time">archive time: 2022-10-26</p>

<p class="sp-comment">很久没更新了, 今天我们用 C 做一个数学计算器</p>

[[toc]]

最近突然想尝试写一个 _Parser_，不过一直没有思路，所以不知道如何实践

然后在看 **_tauri_** 相关的例子的时候突然想到可以做一个数学式的 _Parser_

虽然 **_tauri_** 是 _Rust_ 的，但是我打算先用 _C_ 写个原型

## 自定义类型

我打算使用自定义类型来存储结果

原式 `2 - (3 + sin(3.14 / 2)) / 7 + 2 ^ 2`，结果

```text
Add(
  Sub(
    Const(
      value: 2.0000
    )
    Div(
      Par(
        Add(
          Const(
            value: 3.0000
          )
          Sin(
            Par(
              Div(
                Const(
                  value: 3.1400
                )
                Const(
                  value: 2.0000
                )
              )
            )
          )
        )
      )
      Const(
        value: 7.0000
      )
    )
  )
  Pow(
    Const(
      value: 2.0000
    )
    Const(
      value: 2.0000
    )
  )
)
```

大概可以分解为

$$
  \begin{align}
    \mathrm{Expr} ::&= \mathrm{Expr} \circ \mathrm{Expr} \notag \\
    &|\quad \mathrm{sign}(\mathrm{Expr}) \notag \\
    &|\quad f(\mathrm{Expr}) \notag \\
    &|\quad \mathrm{Const}(N) \notag
  \end{align}
$$

对应 **Expr** 的类型定义为

```c
typedef struct pm_Expr {
  PM_FUNC func;
  struct pm_Expr *e1;
  struct pm_Expr *e2;
  float value;
} pm_Expr;
```

而这里我定义了几类函数，日后可以按需扩充

```c
typedef enum PM_FUNC {
  ADD = 10,
  SUB = 11,
  MUL = 20,
  DIV = 21,
  NEG = 30,
  POS = 31,
  POW = 40,
  SIN = 50,
  COS = 51,
  EXP = 52,
  PAR = 60,
  CONST = 61,
} PM_FUNC;
```

每项的值都是 _优先级_ + _序号_ 的组合

例如 `ADD` 的值为 `10`，则，优先级为 **1**，对应优先级中序号为 _0_

## 函数原型

我将解析功能拆分成了一下几个函数来完成

```c
extern pm_Expr *pm_parse(const char *orgExpr);
extern pm_Expr *pm_number(const char *expr, size_t *bias);
extern pm_Expr *pm_parentheses(const char *expr, size_t *bias);
extern pm_Expr *pm_function(const char *expr, size_t *bias);
```

分别是

- 对整个式子的解析
- 对于单个数字的解析
- 对于一组括号的解析
- 对于函数调用的解析

## 函数主要实现

由于一些细节比较繁琐，这里只介绍主要部分的实现，详细可以参考我的[仓库](https://github.com/kands-code/c-rust-examples/tree/main/c-examples/darfts)

### main

整个解析的部分就是不断根据当前字符来判断该用什么来解析

```c
pm_Expr *pm_parse(const char *orgExpr) {
  // ignore all whitespace characters
  char *expr = pm_ignoreBlank(orgExpr);
  char *handle = expr;
  // store the result
  pm_Expr *parsedExpr = NULL;
  pm_Expr *tempExpr = NULL;
  // store the current state
  char curChar = *expr;
  // start to parse
  while (*expr != '\0') {
    // the offset
    size_t bias = 0;
    if (isdigit(curChar) || '.' == curChar) {
      // parse number
      tempExpr = pm_number(expr, &bias);
      expr += bias;
    } else if (pm_isOperator(curChar)) {
      // the operator
      // ...
    } else if ('(' == curChar) {
      // parse parentheses
      tempExpr = pm_parentheses(expr, &bias);
      expr += bias;
    } else if (isalpha(curChar)) {
      // parse function call
      tempExpr = pm_function(expr, &bias);
      expr += bias;
    } else {
      fprintf(stderr, "Error: wrong math expression syntax\n");
      exit(EXIT_FAILURE);
    }
  // ...
  free(handle);
  return parsedExpr;
}
```

首先调用 `pm_ignoreBlank` 将字符串中的空白字符给去掉，同时复制一份可以操作的字符串

使用 `handle` 存储首地址，在解析完毕后释放空间

`parsedExpr` 和 `tempExpr` 分别用于存储最终结果和临时解析结果

每得到一个临时结果都需要按照优先级规律插入到最终结果中

解析时，通过当前字符类型来判别调用函数

- 如果是当前字符是数字，则使用 `pm_number`
- 如果是一个左括号，则调用 `pm_parentheses`
- 如果是字母，则可能是函数调用，使用 `pm_function`

如果是个符号，若符号是操作符，则需要按照规律插入到结果中

```c
bool isPrefix = false;
if (NULL == parsedExpr) {
  // E ::= sign(E)
  isPrefix = true;
}
// insert new operator
PM_FUNC opSym = pm_getOperatorSymbol(curChar, isPrefix);
// E ::= E o E
if (NULL == parsedExpr || !pm_comparePriority(opSym, parsedExpr->func)) {
  pm_Expr *newExpr = malloc(sizeof(pm_Expr));
  newExpr->func = opSym;
  newExpr->e1 = parsedExpr;
  newExpr->e2 = NULL;
  parsedExpr = newExpr;
} else {
  pm_Expr *currExpr = parsedExpr;
  pm_Expr *nextExpr = NULL;
  while (NULL != currExpr->e1 || NULL != currExpr->e2) {
    size_t curType = pm_getFuncType(currExpr->func);
    if (1 == curType) {
      nextExpr = currExpr->e1;
    } else if (2 == curType) {
      nextExpr = currExpr->e2;
    } else {
      fprintf(stderr, "Error: wrong func type!\n");
      exit(EXIT_FAILURE);
    }
    if (pm_comparePriority(opSym, nextExpr->func)) {
      currExpr = nextExpr;
    } else {
      pm_Expr *newExpr = malloc(sizeof(pm_Expr));
      newExpr->func = opSym;
      newExpr->e1 = nextExpr;
      if (1 == curType) {
        currExpr->e1 = newExpr;
      } else if (2 == curType) {
        currExpr->e2 = newExpr;
      }
      break;
    }
  }
  // check
  if (NULL == nextExpr) {
    fprintf(stderr, "Error: wrong expression syntax with operator!\n");
    exit(EXIT_FAILURE);
  }
}
expr++;
curChar = *expr;
continue;
```

具体操作我就不解释了，简而言之，就是在构建一棵树

### number

解析数字，我们默认是 `float`，所以需要考虑小数的判别

```c
pm_Expr *pm_number(const char *expr, size_t *bias) {
  if (NULL == expr) {
    fprintf(stderr, "Error: expression cannot be null!\n");
    exit(EXIT_FAILURE);
  }
  // store state
  bool inFrac = false;
  char curChar = *expr;
  float fracCnt = 0;
  float number = 0.0f;
  // start to parse
  while ('\0' != curChar && (isdigit(curChar) || '.' == curChar)) {
    if (inFrac) {
      // fractional number part
      if ('.' == curChar) {
        fprintf(stderr, "Error: fraction do not have dot!\n");
        exit(EXIT_FAILURE);
      } else {
        number += fracCnt * (curChar - '0');
        fracCnt *= 0.1f;
      }
    } else {
      // whole number part
      if ('.' != curChar) {
        number *= 10;
        number += (curChar - '0');
      } else {
        inFrac = true;
        fracCnt = 0.1;
      }
    }
    // move on
    expr++;
    *bias += 1;
    curChar = *expr;
  }
  // build expression
  pm_Expr *numExpr = malloc(sizeof(pm_Expr));
  numExpr->e1 = NULL;
  numExpr->e2 = NULL;
  numExpr->func = CONST;
  numExpr->value = number;
  // return expression
  return numExpr;
}
```

由于一开始我们就将空格滤掉了，所以我们就无须考虑空格之类的问题

数字解析整体过程比较粗暴，不过真的好用

### parentheses

括号的解析关键在于找到对应的括号

```c
pm_Expr *pm_parentheses(const char *expr, size_t *bias) {
  if (NULL == expr) {
    fprintf(stderr, "Error: expression cannot be null!\n");
    exit(EXIT_FAILURE);
  }
  // store state
  int pCnt = 0;
  size_t insideCnt = 0;
  char curChar = *expr;
  // match all content inside parentheses
  do {
    if ('(' == curChar) {
      pCnt++;
    } else if (')' == curChar) {
      pCnt--;
    }
    insideCnt++;
    curChar = *(expr + insideCnt);
    *bias += 1;
  } while ('\0' != curChar && pCnt != 0);
  if (pCnt != 0) {
    fprintf(stderr, "Error: cannot match all parentheses!\n");
    exit(EXIT_FAILURE);
  }
  // get the inside content
  char *insideContent = calloc(insideCnt - 1, sizeof(char));
  insideContent = strncpy(insideContent, expr + 1, insideCnt - 2);
  // get the inside expression
  pm_Expr *insideExpr = pm_parse(insideContent);
  free(insideContent);
  pm_Expr *wrapExpr = malloc(sizeof(pm_Expr));
  wrapExpr->func = PAR;
  wrapExpr->e1 = insideExpr;
  return wrapExpr;
}
```

匹配出括号中的内容后可以直接使用 `pm_parse` 函数解析内容，而后使用 `PAR` 包裹

### function

函数部分依赖括号的解析，总之，就是将参数部分当成括号解析，而后使用相应函数包裹

```c
pm_Expr *pm_function(const char *expr, size_t *bias) {
  size_t funNameLen = 0;
  while (isalpha(*(expr + funNameLen))) {
    funNameLen++;
  }
  char *funName = calloc(funNameLen + 1, sizeof(char));
  for (size_t i = 0; i < funNameLen; ++i) {
    funName[i] = expr[i];
  }
  expr += funNameLen;
  pm_Expr *paramExpr = NULL;
  size_t paramBias = 0;
  if ('(' == *expr) {
    paramExpr = pm_parentheses(expr, &paramBias);
  } else {
    fprintf(stderr, "Error: wrong function call syntax!\n");
    exit(EXIT_FAILURE);
  }
  *bias += funNameLen + paramBias;
  pm_Expr *funExpr = malloc(sizeof(pm_Expr));
  funExpr->func = pm_getFuncSym(funName);
  funExpr->e1 = paramExpr;
  funExpr->e2 = NULL;

  return funExpr;
}
```

## 求值

求值的时候可以通过 `pm_Expr` 的 `func` 字段判断使用何种方式计算

```c
float pm_evaluation(const pm_Expr *expr) {
  if (ADD == expr->func) {
    return pm_evaluation(expr->e1) + pm_evaluation(expr->e2);
  } else if (SUB == expr->func) {
    return pm_evaluation(expr->e1) - pm_evaluation(expr->e2);
  } else if (MUL == expr->func) {
    return pm_evaluation(expr->e1) * pm_evaluation(expr->e2);
  } else if (DIV == expr->func) {
    float d = pm_evaluation(expr->e2);
    if (fabsf(d) < 1e-4) {
      fprintf(stderr, "Error: cannot divide zero!\n");
      exit(EXIT_FAILURE);
    }
    return pm_evaluation(expr->e1) / d;
  } else if (NEG == expr->func) {
    return -pm_evaluation(expr->e1);
  } else if (POW == expr->func) {
    return powf(pm_evaluation(expr->e1), pm_evaluation(expr->e2));
  } else if (SIN == expr->func) {
    return sinf(pm_evaluation(expr->e1));
  } else if (COS == expr->func) {
    return cosf(pm_evaluation(expr->e1));
  } else if (EXP == expr->func) {
    return expf(pm_evaluation(expr->e1));
  } else if (PAR == expr->func) {
    return pm_evaluation(expr->e1);
  } else if (CONST == expr->func) {
    return expr->value;
  } else {
    fprintf(stderr, "Error: wrong expression when evaluation!\n");
    exit(EXIT_FAILURE);
  }
  return 0.0f;
}
```

不断递归调用，最后求得最后结果

---

以上就是我这个解析器的实现大概，通过这次实践，大概算是知道如何写 _Parser_ 了，多少还算有些收获吧
