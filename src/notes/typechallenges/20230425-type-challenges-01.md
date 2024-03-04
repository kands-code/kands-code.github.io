# TypeScript 类型体操 01

<p class="archive-time">archive time: 2023-04-25</p>

<p class="sp-comment">今天开始尝试写一下 TypeScript 的类型体操</p>

[[toc]]

闲来无事，<ruby>整<rt>删</rt>理<rt>除</rt>了</ruby> 一些老的博客，
单纯是为了清理一些内容，打算把一些内容重新写一下，
然后有些内容我大概是不会再写了，所以就删了，因为我不太能忍受烂尾行为

至于这个类型体操，题目的链接在[这里](https://github.com/type-challenges/type-challenges)，
感兴趣的可以看看，嘛，就是图个好玩

至于更新计划什么的，最近几天应该会比较经常的更新这个，
由于题目数量比较多，我大概就是按照难度顺序慢慢做，做到什么程度就什么程度罢

## Hello World (13) {Warm-up}

### Question

> Hello, World!
>
> In Type Challenges, we use the type system itself to do the assertion.
>
> For this challenge, you will need to change the following code
> to make the tests pass (no type check errors).
>
> ```typescript
> // expected to be string
> type HelloWorld = any;
> ```
>
> ```typescript
> // you should make this work
> type test = Expect<Equal<HelloWorld, string>>;
> ```
>
> Click the `Take the Challenge` button to start coding! Happy Hacking!

### Answer

这里的大意就是要让 `Expect<Equal<HelloWorld, string>>` 不报错，
要做到这个，那就要使得 `HelloWorld` 的类型是 `string`，即:

```typescript
type HelloWorld = string;
```

还是非常简单的

## Pick (4) {Easy}

### Question

> Implement the built-in `Pick<T, K>` generic without using it.
>
> Constructs a type by picking the set of properties K from T
>
> For example:
>
> ```typescript
> interface Todo {
>   title: string;
>   description: string;
>   completed: boolean;
> }
>
> type TodoPreview = MyPick<Todo, "title" | "completed">;
>
> const todo: TodoPreview = {
>   title: "Clean room",
>   completed: false,
> };
> ```

### Answer

> 一开始没做出来，直接看答案

这个题目就是要我们实现一个 `Pick<T, K>` 这样一个泛型类型，
对应代码里就是那个 `MyPick`

```typescript
type MyPick<T, K extends keyof T> = {
  [k in K]: T[k];
};
```

这里我们需要 `K` 可以用来索引 `T` 的每一项，
所以 `K extends keyof T`，即 `K` 是 `T` 的所有键的子集

> 应该是子集罢

然后我们使用 `[k in K]` 来迭代 `K` 中的项，即我们所需要的键，
然后通过这个键来索引出 `T` 中对应的项的类型，然后使用 `{}` 包裹，构成我们新的类型

## Readonly (7) {Easy}

### Question

> Implement the built-in `Readonly<T>` generic without using it.
>
> Constructs a type with all properties of T set to readonly,
> meaning the properties of the constructed type cannot be reassigned.
>
> For example:
>
> ```typescript
> interface Todo {
>   title: string;
>   description: string;
> }
>
> const todo: MyReadonly<Todo> = {
>   title: "Hey",
>   description: "foobar",
> };
>
> todo.title = "Hello"; // Error: cannot reassign a readonly property
> todo.description = "barFoo"; // Error: cannot reassign a readonly property
> ```

### Answer

> 这一题也是直接看答案的

这一题也是要实现 TypeScript 内置的 `Readonly<T>` 类型，
这个类型的作用就是把你的类中的每一项都设置为 `readonly`，即得到一个只读的元素

```typescript
type MyReadonly<T> = {
  readonly [p in keyof T]: T[p];
};
```

这里我们只需要给每一项加上一个 `readonly` 属性即可

## Tuple to Object (11) {Easy}

### Question

> Given an array, transform it into an object type
> and the key/value must be in the provided array.
>
> For example:
>
> ```typescript
> const tuple = ["tesla", "model 3", "model X", "model Y"] as const;
>
> type result = TupleToObject<typeof tuple>;
> // expect {
> //   tesla: "tesla";
> //   "model 3": "model 3";
> //   "model X": "model X";
> //   "model Y": "model Y";
> // };
> ```

### Answer

> 这个依旧是抄的

这里要我们实现一个 `TupleToObject` 类型，使得元组中的每一项既是项，也是类型

```typescript
type TupleToObject<T extends readonly string[]> = {
  [p in T[number]]: p;
};
```

这里，主要要注意[索引访问类型](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)的使用，即 `[p in T[number]]`，
这样就可以索引出 `T` 中所有的值

## First of Array (14) {Easy}

> Implement a generic `First<T>` that takes an Array T
> and returns its first element's type.
>
> For example:
>
> ```typescript
> type arr1 = ["a", "b", "c"];
> type arr2 = [3, 2, 1];
>
> type head1 = First<arr1>; // expected to be 'a'
> type head2 = First<arr2>; // expected to be 3
> ```

### Answer

在经过了 _Tuple to Object_ 这道题后，这道题应该不难写了

不过我的答案还是有疏漏，我原本的答案是:

```typescript
type First<T extends Array<number | string | symbol>> = T[0];
```

不过我小看了 TypeScript 类型的灵活，
除了 `number`，`string` 和 `symbol` 可以作为类型使用外，
`boolean` 之类的字面值也可以作为类型，导致我这个题解不全面，
看了答案后得到了下面这个答案

```typescript
type First<T extends any[]> = T extends [] ? never : T[0];
```

至此，才大概完全覆盖了 TypeScript 的类型

## Length of Tuple (18) {Easy}

### Question

> For given a tuple, you need create a generic Length,
> pick the length of the tuple
>
> For example:
>
> ```typescript
> type tesla = ["tesla", "model 3", "model X", "model Y"];
> type spaceX = [
>   "FALCON 9",
>   "FALCON HEAVY",
>   "DRAGON",
>   "STARSHIP",
>   "HUMAN SPACEFLIGHT"
> ];
>
> type teslaLength = Length<tesla>; // expected 4
> type spaceXLength = Length<spaceX>; // expected 5
> ```

### Answer

> 还是看了答案

我们可以使用 `Type["属性"]` 的语法来获取类型的属性，
这或许就是 TypeScript 类型如此厉害的原因罢，太灵活了

```typescript
type Length<T extends any[]> = T extends [] ? never : T["length"];
```

感觉脑袋完全不够用啊

---

今天的题就写到这里罢，什么都不会，全是抄答案，
到目前为止只有一个体会，那就是 TypeScript 文档还远远不够，
很多操作无法直接查到，或许这就是类型体操的魅力罢（大嘘
