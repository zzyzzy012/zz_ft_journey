# JS八股整理2

## 一、内存空间⭐

### 内存空间

1. 栈数据结构：后进先出
2. 堆数据结构：是一种树状结构，类比书架上的书，只要知道属性名，即可取出值。

3. 队列：先进先出


（1）变量存放

1. 基础数据类型放在栈内存中，这些类型在内存中分别占有固定大小的空间，通过值访问。
2. 引用数据类型放在堆内存中。因为这种值的大小不固定，因此不能把它们保存到栈内存中，但内存地址大小的固定的，因此保存在堆内存中，**在栈内存中存放的只是该对象的访问地址。**当查询引用类型的变量时， 先从**栈中读取内存地址**， 然后再通过地址**找到堆中的值**。对于这种，我们把它叫做按引用访问。
3. 数组和函数在内存中的存储：
   1. 数组是存放在连续内存空间上的相同类型数据的集合。数组的元素是不能删的，只能覆盖。
   2. 函数在内存中是作为一个对象存储的，包括函数的代码、作用域链和其他内部属性。

（2）生命周期

1. 内存分配：当我们申明变量、函数、对象的时候，系统会自动为他们分配内存
2. 内存使用：即读写内存，也就是使用变量、函数等
3. 内存回收：使用完毕，由垃圾回收机制自动回收不再使用的内存

### 垃圾回收

**垃圾回收(*Garbage Collection*)机制**：找到不再使用的值（哪些值是可达的-可被引用，哪些值是不可达的-不能被引用）然后释放它的内存。

**(1) 引用记术法（*Reference Counting*）**：跟踪变量值使用次数。对象相互引用，循环引用，无法被回收，造成内存泄露。

**(2) 标记-清除算法(*Mark-Sweep*)**：将“不再使用的对象”定义为“**无法到达的对象**”。即从根部（在JS中就是全局对象）出发定时扫描内存中的对象，凡是能从根部到达的对象，**保留**。那些从根部出发无法触及到的对象被标记为**不再使用**，稍后进行回收。

算法：

1. 垃圾回收器创建了一个 `roots` 列表。`roots` 通常是代码中全局变量的引用。JavaScript 中，`window` 对象是一个全局变量，被当作 ` root`。`window` 对象总是存在，因此垃圾回收器可以检查它和它的所有子对象是否存在（即不是垃圾）；
2. 所有的 `roots` 被检查和标记为激活（即不是垃圾）。所有的子对象也被递归地检查。从 `root` 开始的所有对象如果是可达的，它就不被当作垃圾；
3. 所有未被标记的内存会被当做垃圾，收集器现在可以释放内存，归还给操作系统了。

会造成内存空间的不连续，造成内存分配的问题。

![](.\images\标记清除法.jpg)

**(3) 优化-标记整理（*Mark-Compact*）算法**：会将活着的对象（即不需要清理的对象）向内存的一端移动，最后清理掉边界的内存。

![](.\images\标记整理算法.jpg)

**(4) 分代式垃圾回收(*Generational Collection*)**：将内存空间分为新生代和老生代。

- **新生代（*Young Generation*）**：
  - 存活周期较短的 JS 对象，如临时变量、字符串等。
  - 内存在1-8m。
  - 使用 **Scavenge 算法**（复制存活对象到另一块内存，清空当前内存）。
- **老生代（*Old Generation*）**：
  - 经过多次垃圾回收仍然存活，存活周期较长的对象，如主控制器、服务器对象等。
  - 使用**标记-清除或标记-整理**算法。

![](.\images\分代式垃圾回收.jpg)

**(5) 并行回收(*Parallel*)**：垃圾回收器在主线程上执行的过程中，开启多个辅助线程，同时执行同样的回收工作。

> `全停顿（Stop-The-World）`，我们都知道 `JavaScript` 是一门单线程的语言，它是运行在主线程上的，那在进行垃圾回收时就会阻塞 `JavaScript` 脚本的执行，需等待垃圾回收完毕后再恢复脚本执行，我们把这种行为叫做 `全停顿`

![](.\images\并行回收.jpg)

**(6) 增量回收（*Incremental GC*）**：将垃圾回收任务分成多个小任务，穿插在主线程的任务之间执行。

![](.\images\增量.jpg)

**(7) 并发回收(*Concurrent*)**：它指的是主线程在执行 `JavaScript` 的过程中，辅助线程能够在后台完成执行垃圾回收的操作，辅助线程在执行垃圾回收的时候，主线程也可以自由执行而不会被挂起。

![](.\images\并发回收.jpg)

### 内存泄漏

**内存泄漏(*Memory leak*)**：不再使用的内存没有及时释放就叫内存泄露。

**(1) 内存泄露的原因**

① 全局变量不会被回收

```js
function fn(){
  // 没有声明从而制造了隐式全局变量test1
  test1 = new Array(1000).fill('isboyjc1')
  
  // 函数内部this指向window，制造了隐式全局变量test2
  this.test2 = new Array(1000).fill('isboyjc2')
}
fn()
```

② 游离DOM节点引用

```js
<div id="root">
  <ul id="ul">
    <li></li>
    <li></li>
    <li id="li3"></li>
    <li></li>
  </ul>
</div>
<script>
  let root = document.querySelector('#root')
  let ul = document.querySelector('#ul')
  let li3 = document.querySelector('#li3')
  
  // 由于ul变量存在，整个ul及其子元素都不能GC
  root.removeChild(ul)
  
  // 虽置空了ul变量，但由于li3变量引用ul的子节点，所以ul元素依然不能被GC
  ul = null
  
  // 已无变量引用，此时可以GC
  li3 = null
</script>
```

假如我们将父节点置空，但是被删除的父节点其子节点引用也缓存在变量里，那么就会导致整个父 DOM 节点树下整个游离节点树均无法清理，还是会出现内存泄漏，解决办法就是将引用子节点的变量也置空。

![](.\images\游离DOM节点引用.jpg)

③ 遗忘的定时器和回调函数

- 定时器 `setTimeout` 和 `setInterval`，不再使用最好通过 `clearInterval` 和 `clearTimeout` 清除。
- 遗忘的事件监听函数，但是现代浏览器中可以正确检测，不必再强调使用 `removeEventListener`。

④ 闭包：闭包的关键是匿名函数可以访问父级作用域的变量。

⑤ `Map` 和 `Set`。同 `Object` 一致都是强引用，如果不将其主动清除引用，其同样会造成内存不自动进行回收。

可以通过 `WeakMap` 和 `WeakSet`。因为键是弱引用，不会干扰 JS 垃圾回收机制。

- 强引用：持有对一个对象的引用，这个对象就不会被垃圾回收，这里的引用就是强引用。
- 弱引用：就是一个对象若只被弱引用所引用，则被认为是不可访问（或弱可访问）的，因此可能在任何时刻被回收。

⑥ 未清理的 `console` 输出

**（2）解决内存泄漏**

1. 通过 Chrome 浏览器的 `Performance` 和 `Memory` 面板进行排查，浏览器为无痕模式。
2. `Performance` 面板点击 `Memory` 选项—录制——重复操作一定次数——点击GC——观察HEAP（内存情况）

![](.\images\内存泄露排查1.jpg)

3. `Memory` 面板点击 GC 清理无用内存——点击 *heap snapshot*（内存快照）——看 Summary 的筛选区别。

![](.\images\内存泄露排查2.jpg)

**（3）内存三大件**

1. 内存泄漏
2. 内存膨胀：即在短时间内内存占用极速上升到达一个峰值，想要避免需要使用技术手段减少对内存的占用。
3. 频繁 GC：一般出现在频繁使用大的临时变量导致新生代空间被装满的速度极快，而每次新生代装满时就会触发 GC，频繁 GC 会导致页面卡顿。


## 二、执行上下文

**执行上下文（*Execution Context*）**：JavaScript 代码**被解析和执行时**所在的环境的抽象概念。

1. 全局执行上下文（*Global Execution Context* ，GEC）：第一次执行代码的默认环境。
2. 函数执行上下文（*Function Execution Context*，FEC）：每当一个函数被调用时，都会为该函数创建一个新的执行上下文。
3. `Eval` 函数执行上下文：运行在 `eval` 函数中的代码，很少用而且不建议使用。

**(1) 生命周期**

**① 创建阶段（*Creation Phase*）**

1. 创建词法环境（*Lexical Environment*）
   1. 环境记录器（*Environment Record*）：存储变量和函数声明。
      1. 函数声明会被完整提升
      2. `let/const` 声明的变量被记录但未初始化（进入暂时性死区 TDZ）
      3. `var` 声明的变量会被初始化为 `undefined`（发生变量提升）
   2. 变量环境（*Variable Environment*）：也是一个词法环境，主要用于存储 `var` 声明的变量。
   2. 外部环境的引用（*Outer Environment Reference*）：可以访问其外部词法环境，用于作用域链。
3. 确定 `this` 指向

词法环境分为两类：

1. 全局环境：是一个没有外部环境的词法环境，其外部环境引用为 `null`。拥有一个全局对象（`window` 对象）及其关联的方法和属性以及任何用户自定义的全局变量，`this` 的值指向这个全局对象。
2. 函数环境：用户在函数中定义的变量被存储在**环境记录器**中，包含了 `arguments` 对象。对外部环境的引用可以是全局环境，也可以是包含内部函数的外部函数环境。

**② 执行阶段（*Execution Phase*）**

1. 变量赋值
2. 函数调用
3. 逐行执行代码

**（2）执行栈（*Execution Stack / Call Stack*）**

JavaScript 引擎使用调用栈来管理执行上下文，遵循**后进先出**的原则。

1. GEC 首先入栈
2. 每当调用一个函数，其 FEC 就被创建并压入栈顶
3. 函数执行完毕，其 FEC 从栈顶弹出
4. 同步代码执行完毕，GEC 最后弹出（通常在关闭页面或程序结束时）

## 三、变量对象

**（1）变量对象（*Variable Object* - VO）**

变量对象：与执行上下文相关的数据作用域，是一个内部的、抽象的对象，用于存储该上下文中定义的变量、函数声明、函数参数。

与执行上下文的关系：VO 是执行上下文的一个属性。它在执行上下文的**创建阶段**被创建和填充。

**填充过程（创建阶段，以 ES5 的 VO/AO 概念为主）**

1. 函数参数（*Arguments*）：创建 `arguments` 对象，并初始化参数名和值。
2. 函数声明（*Function Declarations*）：按名称存储函数定义，如果 VO 中已存在同名属性，则完全覆盖（函数声明提升）。
3. 变量声明（*Variable Declarations*）：按名称存储变量，如果 VO 中不存在同名属性，则创建并初始化为 `undefined`；如果已存在（比如与函数名冲突），则忽略该变量声明（变量声明提升，但优先级低于函数声明）。

**（2）活动对象（*Activation Object* - AO）**

活动对象：和变量对象都是同一个对象，只是**处于执行上下文的不同生命周期。**只有处于函数调用栈栈顶的执行上下文中的变量对象，才会变成活动对象。

**未进入执行阶段之前，变量对象中的属性都不能访问！**但是进入执行阶段之后，变量对象转变为了活动对象，里面的属性都能被访问了，然后开始进行执行阶段的操作。

> 现代 JavaScript 规范更多使用**词法环境和变量环境**来描述这个过程，尤其为了精确处理 `let` 和 `const` 的块级作用域和暂时性死区 TDZ。
>
> 词法环境是规范中更精确的模型，VO/AO 是早期/经典的对环境内部存储机制的一种理解方式。

## 四、作用域与闭包⭐

### 作用域

作用域：作用域是指**变量和函数的可访问范围**，它在代码**书写阶段（即词法分析时）就已经确定**，不会因调用位置而改变。

主要类型：

1. 全局作用域（*Global Scope*）：在代码任何地方都能访问。
2. 函数作用域（*Function Scope*）：使用 `function` 定义的函数内部形成独立作用域，`var` 声明的变量只在函数内部可见。
3. 块级作用域（*Block Scope*）：`let` 和 `const` 引入了块级作用域，变量在 `{}` 内有效，不存在变量提升。
4. 静态作用域（*Static Scope*）/ 词法作用域（*Lexical Scope*）：JS 使用词法作用域，**变量的作用域由它在代码中定义的位置决定，与函数调用位置无关**（`this` 指向取决于函数被调用的位置）。

### 作用域链

作用域链（*Scope Chain*）：是一个由当前词法环境以及所有**外部环境**（直到全局环境）组成的链式结构。是一种静态结构，用于描述一个变量在嵌套作用域中的查找路径。

**（1）查找规则**

1. 在当前作用域中查找变量；
2. 若未找到，则查找其父作用域（由函数定义位置决定）；
3. 一直向外层查找，直到全局作用域；
4. 如果仍未找到，抛出 `ReferenceError`。

**（2）如何形成？**

1. 当函数定义时，它就记住了它被定义时的**外部词法环境**。
2. 每个函数在执行时，其上下文中会携带一个**指向其外部环境的引用**，多个作用域嵌套形成链。
3. 这条链就是作用域链，它不会因函数调用位置而改变。

**（3）编译与执行阶段**

- 编译阶段：编译器扫描代码，确定变量/函数声明、作用域结构（词法环境）
- 执行阶段：引擎逐句执行代码，创建执行上下文，进行变量赋值、函数调用等操作

### 闭包

（1）闭包定义

闭包（*Closure*）：**一个函数可以访问其定义时的作用域中的变量**，即使这个函数是在其作用域之外执行的。闭包让函数携带定义时的作用域一起工作。换句话说闭包 = 函数 + 它定义时的词法作用域的引用环境

> 通俗版：
>
> 1. 闭包是指有权访问另外一个函数作用域中的变量的函数。
> 2. 一个定义在函数内部的函数（内部函数），如果引用了其外部函数的变量，并且这个内部函数被返回或传递到外部函数的范围之外使用，那么就形成了一个闭包。这个内部函数维持了对其定义时所在作用域（及其父作用域）的引用。
>
>

（2）形成原因

1. **词法作用域**：函数的作用域在定义时确定（不是调用时）。
2. **作用域链**：内部函数可以访问外部函数的变量。
3. **垃圾回收机制**：函数执行完毕时，如果其内部函数被外部引用（如被返回），其外部函数的词法环境仍然被保留，相关变量不会被销毁（内存泄漏）。

（3）应用场景

1. 数据封装和私有变量：模拟私有成员。

```js
function createCounter() {
  // 这里封装了 count，外部无法直接访问，只能通过方法操作，模拟了“私有成员”。
  let count = 0;
  return {
    increment() {
      return ++count;
    },
    decrement() {
      return --count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2
```

2. 模块化

```js
// 自执行函数封装变量
const Module = (function() {
  let privateVar = 'secret';
  return {
    get() {
      return privateVar;
    },
    set(val) {
      privateVar = val;
    }
  };
})();
console.log(Module.get()); // secret
Module.set('new value');
console.log(Module.get()); // new value
```

3. 回调函数和高阶函数：如 `setTimeout`、事件监听器中保持状态。

```js
function delayLog(msg, delay) {
  setTimeout(function () {
    console.log(msg); // 闭包中捕获 msg
  }, delay);
}
delayLog('Hello', 1000);
```

4. 函数柯里化（*Currying*）/ 参数预处理（函数工厂）

```js
function multiply(x) {
  return function(y) {
    return x * y;
  };
}

const double = multiply(2);  // double 函数就是一个闭包，它“记住”了 x=2
console.log(double(5)); // 输出 10
```

## 六、异步编程

（1）同步和异步

1. 同步（*Synchronous Programming*）：代码按照编写的顺序，一行一行地执行。
   1. 阻塞：一个任务耗时时间长，卡顿。
2. 异步（*Asynchronous Programming*）：启动一个任务后，不需要等待它完成，就可以继续执行后续的代码。
   1. 非阻塞式（*Non-blocking*）：程序不会因为等待某个耗时任务而停止，主线程可以继续处理其他任务。

（2）异步编程

JavaScript 本身是**单线程**的，意味着它一次只能执行一个任务。但这并不妨碍它处理异步操作。这主要得益于 JavaScript 的**事件循环（*Event Loop*）**、**任务队列（*Task Queue*）** 和 **Web APIs**（在浏览器环境）或 **C++ APIs** （在 Node 环境）的协同工作。

为什么需要异步？

主要原因是为了避免阻塞主线程。像网络请求（`Workspace`、`XMLHttpRequest`）、定时器（`setTimeout`、`setInterval`）、DOM 事件监听、文件操作（Node）等都是耗时且时间不确定的操作。如果这些操作是同步的，那么在等待它们完成期间，JavaScript 引擎将无事可做，导致页面冻结。

（3）实现异步的操作

![](.\images\异步编程.jpg)

## 七、JS 运行机制⭐

### 进程与线程

**（1）进程**

> `CPU` 是计算机的核心，承担所有的计算任务
>

进程：**是 `CPU` 资源分配的最小单位**。字面意思就是进行中的程序，我将它理解为**是可以独立运行且拥有自己的资源空间的任务程序。进程包括运行中的程序和程序所使用到的内存和系统资源。**

**（2）线程**

线程：是 `CPU` 调度的最小单位。**线程是建立在进程的基础上的一次程序运行单位，通俗点解释线程就是程序中的一个执行流，一个进程可以有多个线程。**

**（3）区别**

1. 进程是操作系统分配资源的最小单位，线程是程序执行的最小单位
2. 一个进程由一个或多个线程组成，线程可以理解为是一个进程中代码的不同执行路线
3. 进程之间相互独立，但同一进程下的各个线程间共享程序的内存空间（包括代码段、数据集、堆等）及一些进程级的资源（如打开文件和信号）
4. 调度和切换：线程上下文切换比进程上下文切换要快得多

**（4）多进程和多线程**

1. 多进程：多进程指的是在同一个时间里，同一个计算机系统中如果允许两个或两个以上的进程处于运行状态。
2. 单线程：一个进程中只有一个执行流，即程序执行时，所走的程序路径按照连续顺序排下来，前面的必须处理好，后面的才会执行。
3. 多线程：一个进程中有多个执行流，即在一个程序中可以同时运行多个不同的线程来执行不同的任务。也就是说允许单个程序创建多个并行执行的线程来完成各自的任务。

### JS 是单线程的

1. **是什么意思？**在任何给定时刻，JS 引擎（如 V8）只能执行一段代码。它有一个主线程来处理所有的执行任务。
2. **为什么是单线程？**主要与它最初作为浏览器脚本语言的用途有关，尤其是与用户交互和 DOM 操作。如果是多线程，同时操作同一个 DOM 节点会带来复杂的同步问题（比如一个线程删除节点，另一个线程修改它的样式）。
3. **单线程的挑战？**如果所有任务都按顺序（同步）执行，一个耗时的任务（如复杂的计算、网络请求等待）会阻塞整个线程，导致页面卡顿、无响应，用户体验极差。
4. **解决方案？**异步机制！通过**事件循环和任务队列**，JavaScript 实现了**非阻塞**的异步操作。JS 的宿主环境使用了**异步**的方式来处理这种无法立即执行的任务。当遇到异步任务时，宿主环境会将其交给**其他线程**处理，执行 JS 的线程则会立即结束当前任务转而去执行后续代码。

### 事件循环

**（1）执行 / 调用栈（*Call Stack*）**：跟踪函数调用的数据结构，遵循**后进先出 (LIFO)** 原则。

- 当一个函数被调用时，它的**执行上下文**会被创建并推入栈顶。
- 函数执行完毕后，其执行上下文从栈顶弹出。
- 所有同步代码都在调用栈中执行。

**（2）堆 (*Heap*)**：内存中用于存储**引用类型**的地方。与调用栈中存储的原始类型值和对象引用地址不同，堆内存分配是动态的。

**（3）Web APIs / 浏览器环境 (或 Node.js APIs)**：是**浏览器**（或 Node.js 环境）提供的 API，不是 JavaScript 引擎自身的一部分。它们负责处理无法立即完成的操作。

- 定时器：`setTimeout`、`setInterval`
- DOM 事件监听：`addEventListener`
- 网络请求：`Workspace`、`XMLHttpRequest`

**（4）任务队列（*Task Queue / Callback Queue*）**：存储**待执行的回调函数**的数据结构，遵循**先进先出（FIFO）** 原则。

**① 宏任务队列（*Macro Task Queue / Task Queue*）**

1. 宏任务：一个完整的、独立的大任务，执行完后才会处理下一轮事件循环。
2. 存放普通任务的回调，每次事件循环只执行一个宏任务。
3. 由于 JS 引擎线程和 GUI 渲染线程是互斥的关系，浏览器为了能够使宏任务和 DOM 任务有序的进行，会在一个宏任务执行结果后，在下一个宏任务执行前，GUI 渲染线程开始工作，对页面进行渲染。
   - 宏任务 -> GUI渲染 -> 宏任务 -> ...

分类

1. `script` 整体代码块
2. `setTimeout`、`setInterval`、`setImmediate`（Node.js 独有，类似 `setTimeout(…, 0)`）
3. `I/O` 操作：网络请求、文件读写、数据库读取
4. `UI rendering`：浏览器绘制/重排/重绘等（如页面更新、动画）
5. `requestAnimationFrame`：浏览器下一帧前执行的任务

**② 微任务队列 (*Micro Task Queue / Job Queue*)**

1. 微任务：在当前宏任务执行完后立即执行的小任务。
2. 存放需要**尽快执行**的任务的回调，通常是对当前执行任务结果的响应。
3. **在当前宏任务执行完毕后，且下一个宏任务开始前，会清空整个微任务队列**（即执行所有已存在的微任务，如果在执行微任务过程中又产生了新的微任务，也会在本轮一并执行）。
4. 当一个宏任务执行完，会在渲染前，将执行期间所产生的所有微任务都执行完。
   - 宏任务 -> 微任务 -> GUI渲染 -> 宏任务 -> ...

分类

1. `Promise.prototype.then/catch/finally`
2. `Promise` 为基础开发的其它技术，比如 `fetch API`、`V8` 的垃圾回收过程
3. `queueMicrotask()`：手动添加微任务（浏览器和 Node.js）
4. `MutationObserver`：监听 DOM 变化
5. `process.nextTick`（Node.js 独有，优先级甚至高于其他微任务）

⚠️注意：在所有任务开始的时候，由于宏任务中包括了 `script`，所以浏览器会先执行一个宏任务，在这个过程中你看到的延迟任务（例如 `setTimeout`）将被放到下一轮宏任务中来执行。

**（5）事件循环（*event loop*）**：是一种运行时机制，它允许 JS 在单线程环境中处理异步任务。通过不断检查任务队列来确保代码的顺序执行。

1. JS 分为同步任务和异步任务。
2. 同步任务都在主线程（ JS 引擎线程）上执行，会形成一个**执行栈**。
3. 主线程之外，事件触发线程管理着一个**任务队列**，只要异步任务有了运行结果，就在任务队列之中放一个事件回调。
4. 一旦执行栈中的所有同步任务执行完毕（也就是 JS 引擎线程空闲了），系统就会读取任务队列，将可运行的异步任务（任务队列中的事件回调，只要任务队列中有事件回调，就说明可以执行）添加到执行栈中，开始执行。

**执行顺序**

1. 一开始整个脚本作为一个宏任务执行
2. 执行过程中同步代码直接执行，宏任务进入宏任务队列，微任务进入微任务队列
3. 当前宏任务执行完出队，检查微任务列表，有则依次执行，直到全部执行完
4. 执行浏览器 UI 线程的渲染工作
5. 检查是否有 `Web Worker` 任务，有则执行
6. 执行完本轮的宏任务，回到2，依此循环，直到宏任务和微任务队列都为空


### 浏览器

#### 浏览器进程

浏览器是**多进程多线程**的应用程序。

1. Browser 主进程（唯一）：核心调度与控制中心，**只有一个**。
   1. 管理界面（地址栏、书签栏、前进后退按钮等）
   2. 管理标签页的创建、销毁
   3. 协调各子进程之间的通信
   4. 负责一部分网络请求（如非页面资源）
   5. 合成渲染结果并显示在屏幕上
2. Renderer 渲染进程（多个）：
   1. 每个标签页/ `iframe` 一般对应一个渲染进程（多进程架构，也叫多标签隔离机制）。
   2. 每个渲染进程是**多线程**的（包含主线程、定时器线程、JS 引擎线程等）。
   3. 主要职责：
      - HTML、CSS、JS 的解析与执行
      - DOM 构建、布局、绘制、合成
      - JS 引擎（如 V8）运行
      - 事件绑定与处理
3. GPU 进程（唯一）
   1. 负责**硬件加速渲染**（如 CSS3 动画、3D 变换、WebGL）。
   2. 和主进程配合完成图层合成与位图绘制。
   3. 默认是单个进程，但在高性能场景下可开启多进程。
4. Network 网络进程（一个或多个）
   1. 专门处理网络请求，如 HTTP、HTTPS、WebSocket。
   2. 原来是由主进程管理，**Chrome 后来将其拆分为独立进程**以提升性能与稳定性。
   3. 下载资源、管理 cookie、缓存等。
5. Storage 存储进程
   1. 负责浏览器中的数据存储模块，如：`IndexedDB`、`LocalStorage`、`Cookie`、`Cache API`
   2. 提高数据访问性能，避免不同渲染进程间的资源竞争。
6. 音频进程（*Audio Service*）
   1. 专门处理音频相关的播放、控制任务。
   2. 允许后台播放时依旧稳定运行，避免音频因页面被挂起而中断。
7. 插件进程 / 扩展进程
   1. 每种第三方插件（如 PDF 阅读器）或扩展程序运行在独立进程中。
   2. 防止插件崩溃导致浏览器整体崩溃。

#### 渲染进程的主要线程

**（1）GUI渲染线程**

1. 解析 HTML、CSS，构建 DOM Tree 和 CSSOM（*CSS Object Model*）
2. 合成 `Rendering Tree`，执行布局（*Layout*）、绘制（*Paint*）、合成（*Composite*）操作
3. 控制页面回流与重绘（*Reflow*、*Repaint*）

**（2）JS 引擎线程**

1. JS 内核，执行 JS 脚本程序（例如 V8 引擎），处理变量、函数、事件回调等
2. 管理执行上下文栈、作用域链、闭包等逻辑
3. 处理来自任务队列的宏任务和微任务
   - JavaScript 是单线程语言，**每个 Tab 页只有一个 JS 执行线程**
   - 同一时刻只能执行一个任务
4. GUI 渲染线程与 JS 引擎线程是互斥的，JS 引擎线程会阻塞 GUI 渲染线程

**（3）事件触发/轮询线程**

1. 用来控制事件循环，管理任务队列，它并不执行任务，只负责将任务按顺序**推进主线程**执行。
2. 检测任务队列中是否有待执行的任务；
3. 将宏任务推入 JS 引擎执行栈中；
4. 管理宏任务 / 微任务队列的调度（执行一个宏任务后清空微任务队列）。
5. `宏任务（主线程执行） → 清空所有微任务 → 下一个宏任务...`

**（4）定时触发器线程**

1. `setInterval` 与 `setTimeout` 所在线程
2. 计时器到期后，将回调函数封装为宏任务，加入任务队列（不是立即执行）
3. 浏览器定时计数器并不是由 JavaScript 引擎计数的，**因为 JavaScript 引擎是单线程的，如果处于阻塞线程状态就会影响记计时的准确**

**（5）异步 HTTP 请求线程**

1. 由浏览器内核负责处理异步请求（如 `XMLHttpRequest`、`fetch`）
2. 状态变更时，将回调函数添加到事件队列，等待 JS 引擎线程来执行

## 八、原型链⭐

### 原型

原型（*prototype*）：每个 JavaScript 对象（除了`null`）都有一个**内部链接**，指向它的原型对象。是 JS 实现对象继承的基础，允许对象通过原型链访问其原型对象的属性和方法。

1. `__proto__`：是一个指向原型对象的指针

2. `Object.getPrototypeOf | Reflect.getPrototypeOf`：获取原型对象


### 原型对象

原型对象是一个具体的对象，通常是某个**构造函数的 `prototype` 属性指向的对象**。

例如：`Array.prototype` 是所有数组实例的原型对象，`Object.prototype` 是所有普通对象的原型对象。

1. 每个函数都有一个 `prototype` 属性，这个属性指向一个对象即原型对象。
2. 原型对象包含共享的属性和方法，供所有通过该构造函数创建的实例对象继承。
3. 当使用 `new` 关键字创建一个构造函数的实例时，这个实例的 `__proto__` 就会指向构造函数的 `prototype`。
4. 原型对象是在构造函数被声明时一同创建的，挂载到构造函数的 `prototype` 属性上。原型对象被创建时，会自动生成一个 `constructor` 属性，指向创建它的构造函数。
5. 原型对象也有自己的 `__proto__` ， 指向的是 `Object.prototype`，`Object.prototype.__proto__` 是不存在的( `null`) 。

![](.\images\原型链.jpg)

### 构造函数

构造函数（*Constructor Function*）：用于创建和初始化对象的函数。可以使用 `new` 关键字来创建它的实例对象。

- 每个构造函数都有一个 `prototype` 属性，指向它的原型对象。
- 构造函数创建的实例对象可以访问这个原型对象上的属性和方法。

```js
// 普通函数
function person () {}

// 构造函数，函数首字母通常大写
// ES5
function Person(name, age) {
  this.name = name
  this.age = age
}
Person.prototype.sayThis = function () {
  console.log(this)
};
const p1 = new Person('Tom', '33岁')
const p2 = Person('Tom', '33岁')
p1.sayThis()  // this指向p1
p2.sayThis() // 报错

// ES6
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // 直接定义方法（自动绑定到原型）
  sayThis() {
    console.log(this);
  }
}
const p1 = new Person('Tom', '33岁')
const p2 = Person('Tom', '33岁')  // 报错，必须使用new关键字
p1.sayThis()  // this指向p1
```

### 原型链

原型链：用于实现继承的机制，`__proto__` 链接起来的链式关系。在 JavaScript 中，当访问对象的属性或方法时，首先在对象本身查找，如果找不到，则沿着对象的原型链向上查找。原型链的末端是 `Object.prototype`，它的 `__proto__` 为 `null`。

注意：

1. `__proto__` 是非标准属性，未来可能直接会修改或者移除该属性。
   - 访问一个对象的原型对象：使用 `Reflect.getPrototypeOf` 或者 `Object.getPrototypeOf`
   - 修改一个对象的原型对象：使用 `Reflect.setPrototypeOf` 或 `Object.setPrototypeOf`
2. **`__proto__` 是任何对象都有的属性；而 `prototype` 是函数才有的属性。**
3. **`__proto__` 是对象的一个内部属性，指向原型对象；而 `prototype` 是函数的一个属性，指向一个用于对象实例继承的对象。**
4. **原型对象是实际包含继承属性和方法的对象，而原型是对象之间建立继承关系的一种机制。**

### 原型污染

原型污染：改写原型链上的属性或方法。

解决方案

1. 使用 `Object.create(null)`， 创建一个原型为 `null` 的新对象，这样无论对原型做怎样的扩展都不会生效。
2. 使用 `Object.freeze(obj)` 冻结指定对象，使之不能被修改属性，成为不可扩展对象。
3. 建立 `JSON schema` ，在解析用户输入内容时，通过 `JSON schema` 过滤敏感键名。
4. 规避不安全的递归性合并。这一点类似 `lodash` 修复手段（只要是碰到有 `constructor` 或者 `__proto__` 这样的敏感词汇，就直接退出执行了），完善了合并操作的安全性，对敏感键名跳过处理。

```js
const obj = Object.create(null);
obj.__proto__ = { hack: '污染原型的属性' };
console.log(obj); // => {}
console.log(obj.hack); // => undefined
```

```js
Object.freeze(Object.prototype);
Object.prototype.toString = 'evil';
console.log(Object.prototype.toString);
// => ƒ toString() { [native code] }
```

## 九、继承⭐

### 原型链继承

原型链继承存在的问题：

1. 原型中包含的引用类型属性将被所有实例共享
2. 子类在实例化的时候不能给父类构造函数传参

```js
function Animal() {
  this.colors = ['black', 'white']
}
Animal.prototype.getColor = function() {
  return this.colors
}
function Dog() {}
Dog.prototype =  new Animal()  // 原型链继承

let dog1 = new Dog()
dog1.colors.push('brown')
let dog2 = new Dog()
console.log(dog2.colors)  // ['black', 'white', 'brown']
```

### 构造函数继承

借助 `call / apply ` 调用父类函数。**只能继承父类的实例属性和方法，不能继承原型属性或者方法。**

借用构造函数实现继承解决了原型链继承的 2 个问题：**引用类型共享问题以及传参问题。**但是由于方法必须定义在构造函数中，所以会导致每次创建子类实例都会创建一遍方法。

```js
function Parent(){
  this.name = 'parent1';
  this.getName = function () {  // 实例方法
    return this.name;
  }
}
// 原型方法
Parent.prototype.getName = function () {
  return this.name;
}

function Child(){
  Parent.call(this);  // 复制Parent，而不是Parent.prototype
  this.type = 'child'
}

let child = new Child();
console.log(child.getName());  // 实例方法不会报错；在原型上，会报错
```

### 组合继承

结合了原型链继承和构造函数继承。在子构造函数中调用 `call / apply` 父类构造函数；子构造函数 `prototype` 绑定父构造函数。

1. 使用原型链上的属性和方法；继承父类实例的属性和方法；
2. 父类的构造函数被调用了两次：创建子类原型时，创建子类实例时，导致子类原型上会存在父类实例属性，浪费内存。

```js
function Parent(value) {
  this.value = value;
}

Parent.prototype.getValue = function() {
  console.log(this.value);
}

function Child(value) {
  Parent.call(this, value)
}

Child.prototype = new Parent();

const child = new Child(1)
child.getValue();
child instanceof Parent;
```

### 寄生组合继承

通过 `Object.create` 只复制 `Parent.prototype` 的结构，避免不必要的构造函数调用。

- 子类继承父类实例的属性和方法（通过 `call`）
- 子类继承父类原型的属性和方法（通过原型链）

```js
function Parent() {
  this.name = 'parent';
}

Parent.prototype.getName = function () {
  return this.name;
};

function Child() {
  Parent.call(this); // 继承实例属性
  this.type = 'child';
}

// 关键：设置原型链
Child.prototype = Object.create(Parent.prototype); // 继承原型方法
Child.prototype.constructor = Child; // 修复 constructor

let child = new Child();
console.log(child.getName()); // 'parent'
```

### `Class` 继承

```js
class Animal {
  constructor(name) {
    this.name = name
  } 
  getName() {
    return this.name
  }
}
class Dog extends Animal {
  constructor(name, age) {
    super(name)
    this.age = age
  }
}
```

## 十、this⭐

`this ` 指向：是在函数被**调用**的时候确定的（而不是声明的时候确定）。在函数执行过程中，**`this` 一旦被确定，就不可更改了。**

查找方法：当前正在执行的函数的**前一个调用**中。

```js
function baz() {
    // 当前调用栈是：baz
    // 因此，当前调用位置是全局作用域
    
    console.log( "baz" );
    bar(); // <-- bar的调用位置
}

function bar() {
    // 当前调用栈是：baz --> bar
    // 因此，当前调用位置在baz中
    
    console.log( "bar" );
    foo(); // <-- foo的调用位置
}

function foo() {
    // 当前调用栈是：baz --> bar --> foo
    // 因此，当前调用位置在bar中
    
    console.log( "foo" );
}

baz(); // <-- baz的调用位置
```

**（1）默认绑定（*Default Binding*）**

函数作为独立函数直接调用时（没有作为对象的方法、没有使用 `new`、没有通过 `apply / call / bind` 调用）。

- 非严格模式（*Non-strict mode*）：`this` 指向全局对象（浏览器中是 `window`，Node.js 中是 `global`）；
- 严格模式（*Strict mode* - `'use strict'`）：`this` 的值为 `undefined`。

```js
function sayHi() {
  console.log('Hello,', this);
}
sayHi(); // 非严格模式: 'Hello,' Window {...} / Global {...}
         // 严格模式: 'Hello,' undefined (可能报错，取决于后续操作)

'use strict';
function sayHiStrict() {
  console.log('Hello Strict,', this);
}
sayHiStrict(); // 'Hello Strict,' undefined
```

**（2）隐式绑定（*Implicit Binding*）**

函数作为**对象的方法**被调用时，`this` 指向调用该方法的**对象**。

**注意隐式丢失**：当函数引用被赋值给其他变量，或作为回调函数传递时，会失去其原有的隐式绑定，通常会应用默认绑定规则。

```js
const person = {
  name: 'Alice',
  greet: function() {
    console.log('Hi, I am', this.name);
  }
};
person.greet(); // 输出: 'Hi, I am Alice' (this 指向 person)

// 隐式丢失 (Implicit Lost) - 面试高频陷阱
const greetFunc = person.greet; // 将方法赋给一个变量，丢失了与 person 的绑定
greetFunc(); 
// 非严格模式: 'Hi, I am undefined' (this 指向全局对象)
// 严格模式: 报错 (Cannot read property 'name' of undefined)
```

**（3）显式绑定（*Explicit Binding*）**

`call | apply | bind` 方法调用函数。`this` 指向这些方法**指定的第一个参数**。

① `call(thisArg, arg1, arg2, ...)`：立即执行函数。参数是一个一个传递。

② `apply(thisArg, [argsArray])`：立即执行函数。参数是一个数组。

```js
function introduce(lang1, lang2) {
  console.log(`My name is ${this.name}. I know ${lang1} and ${lang2}.`);
}
const user = { name: 'Bob' };
const languages = ['JavaScript', 'Python'];

introduce.call(user, 'Java', 'C++');   // 输出: My name is Bob. I know Java and C++.
introduce.apply(user, languages); // 输出: My name is Bob. I know JavaScript and Python.
```

③ `bind(thisArg, arg1, arg2, ...)`：**不立即执行原函数**，而是**返回一个绑定了 `this` 和（可选）部分参数的新函数**。之后无论怎么调用这个新函数，其 `this` 都不会再改变（除非用 `new` 调用）。

- **创建一个新函数**（称为绑定函数）
- 这个新函数的 `this` 值**永久地**被绑定到 `thisArg`
- 可以预先设定（柯里化）一些参数（`arg1, arg2, ...`）

```js
function greet(greeting, punctuation) {
  console.log(`${greeting}, <span class="math-inline">\{this\.name\}</span>{punctuation}`);
}
const cat = { name: 'Tom' };

// 创建一个新函数，this 绑定到 cat，并预设 greeting 参数为 'Meow'
const boundGreet = greet.bind(cat, 'Meow');

boundGreet('!'); // 调用新函数，只需传递剩余参数。输出: Meow, Tom!
boundGreet('?'); // 输出: Meow, Tom?

// 尝试用 call 改变 boundGreet 的 this，无效！
boundGreet.call({ name: 'Jerry' }, '.'); // 输出仍然是: Meow, Tom. (this 还是 cat)

// 解决回调函数 this 丢失问题
class Logger {
    constructor() {
        this.prefix = 'LOG:';
    }
    logMessage(message) {
        console.log(this.prefix, message);
    }
    startLogging() {
        // 错误：直接传递 logMessage，this 会丢失
        // document.addEventListener('click', this.logMessage);

        // 正确：使用 bind 绑定 this
        document.addEventListener('click', this.logMessage.bind(this));
        // 或者使用箭头函数
        // document.addEventListener('click', (event) => this.logMessage(event.type));
    }
}
// const logger = new Logger(); logger.startLogging(); // 点击页面会输出 LOG: click
```

**（4）`new` 绑定（*New Binding*）**：使用 `new` 关键字调用函数（构造函数调用）

1. 创建一个全新的空对象。
2. 这个新对象的 `[[Prototype]]` (或 `__proto__`) 被链接到构造函数的 `prototype` 对象。
3. 这个新对象被**绑定为函数调用的 `this`**。
4. 如果函数没有显式返回其他对象，则**自动返回这个新对象**。

```js
function Person(name) {
  // this 指向 new 创建的新对象
  this.name = name;
  // 隐式返回 this
}
const alice = new Person('Alice');
console.log(alice.name); // 输出: 'Alice' (this 指向 alice 实例)
```

**（5）箭头函数（*Arrow Functions* `=>`）**

箭头函数**没有自己的 `this` 绑定**。它会**捕获其定义时所在的（外层）词法作用域的 `this` 值**，并且这个 `this` 值是**固定不变**的，不能通过 `call \ apply \ bind` 或其他方式改变。

箭头函数解决了传统回调函数中 `this` 丢失的问题，非常适合用在需要保持外层 `this` 的场景（如 `setTimeout`、`map`、`filter` 等的回调）。

**（6）`this` 绑定优先级**

1. **`new` 绑定**，优先级最高
2. **显式绑定**：`call \ apply \ bind`
3. **隐式绑定**：对象方法调用
4. **默认绑定**：全局对象或 `undefined`
5. **箭头函数**：不参与上述规则，其 `this` 在定义时就已确定

**（7）类中的 `this` 指向**

1. `constructor`：`this` 指向新创建的实例（`new` 绑定）。
2. 实例方法：通过实例调用时，`this` 指向实例（隐式绑定）。注意 `this` 丢失问题，可使用 `bind` 或箭头函数类字段解决。
3. `静态方法 (static)`：通过类调用时，`this` 指向类构造函数本身。
4. `Getter/Setter`：通过实例访问时，`this` 指向实例。
5. 箭头函数（作为类字段或在方法内部）：`this` 捕获其定义时的词法作用域的 `this`（通常是实例）。

## 十一、严格模式

`"use strict"`

- 全局启用：在 JS 开头声明
- 函数内部启用：在函数内部

（1）作用

1. 变量：不能使用未声明的变量、防止全局变量的意外创建
2. 禁止删除变量、函数、函数参数
3. 禁止使用 `with` 语句
4. `eval` 不会引入新的变量或函数，避免了 `eval` 的安全隐患
5. 更严格的 `this` 绑定
   - 在非严格模式下，`this` 在全局上下文中会指向 `window`（浏览器中）或 `global`（Node.js 中）。
   - 在严格模式下，`this` 会被设置为 `undefined`，如果没有显式绑定 `this`，就不会隐式地指向全局对象。
6. 禁止使用重复的属性名、参数名
7. 对象：试图修改一个 `readonly` 或 `getter` 只读属性时会抛出错误
8. 函数：禁止使用 `arguments.callee` 和 `arguments.caller`
   - `arguments.callee`：指向当前正在执行的函数
   - `arguments.caller`：指向调用当前函数的函数

（2）优点：减少错误、提升性能、增强代码安全性、更易于维护、减少全局作用域污染

**（3）严格模式下禁用 `with` 语句**

`with` 语句会导致作用域的动态变化，使得代码分析和优化变得困难。易于引发变量冲突，可能会无意间覆盖外部的同名变量。

```js
var obj = {x: 10, y: 20};
with (obj) {
  console.log(x); // 10
  console.log(y); // 20
  x = 100  // 直接修改 obj.x
}
console.log(x); // 报错：x is not defined

var x = 5;
var obj = {x: 10};
with (obj) {
  var x = 20;  // 这里覆盖了外部 x 变量
}
console.log(x);  // 20，而不是 5
```