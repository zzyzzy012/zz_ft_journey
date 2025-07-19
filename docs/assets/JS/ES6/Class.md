# 类

## 基本语法

`Class` 可以简单理解为构造函数的语法糖，默认有 `constructor()` 方法，必须使用 `new` 生成实例，否则会报错。

1. 构造函数的 `prototype` 属性在类上继续存在，类的所有方法都是定义在 `prototype` 上的。
2. 类的 `prototype` 原型对象上的 `constructor` 属性还是指向类本身。

类的方法在 ES5 是定义在 `prototype` 上的，ES6 可以直接写在类里面。

```js
// ES5
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.sayHello = function() {
  alert(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
}
const p1 = new Person("John", 30);
const p2 = Person("Mary", 25);

// ES6
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  country = '中国'
  sayHello() {
    alert(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
  }
}

const p1 = new Person("John", 30);
console.log(p1 instanceof Function)  // false
console.log(p1 instanceof Object)  // true
console.log(typeof p1)  // object
console.log(Person instanceof Function)  // true
console.log(Person instanceof Object)  // true
console.log(typeof Person)  // function
```

### （1）类的实例

类的属性和方法，除非显式定义在其本身（即定义在 `this` 对象上），否则都是定义在原型上（即定义在 `class`上）。

ES2022 规定实例属性现在除了可以定义在 `constructor()` 方法里面的 `this` 上面，也可以定义在类内部的最顶层。

```js
console.log(p1.country)
console.log(Object.hasOwnProperty(p1, "country"))  // false
```

### （2）取值函数`getter`和存值函数`setter`

在类的内部可以使用 `get` 和 `set` 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

```js
class Prop {
  type = 't1'
  // constructor() {
  //   this.type = 't1'
  // }
  get getProp() {
    return this.type
  }
  set setProp(value) {
    this.type = value
  }
}

const p1 = new Prop()
console.log(p1.getProp) // t1
p1.setProp = 't2'
console.log(p1.getProp) // t2
```

### （3）属性表达式、class表达式

类的属性名，可以采用表达式。

```js
let methodName = 'getArea';

class Square {
  constructor() {}

  [methodName]() {}
}
```

类也可以使用表达式的形式定义。`Me` 只在 `Class` 的内部可用，指代当前类。在 `Class` 外部，这个类只能用`MyClass` 引用。如果类内部没用到可以省略。

```js
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};

let inst = new MyClass();
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined

const MyClass = class { /* ... */ };

// 立即执行的Class
let person = new class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('张三');

person.sayName(); // "张三"
```

### （4）静态属性&静态方法

1. 静态属性 / 静态方法：表示 `Class` 类自身的属性和方法。
2. 加上 `static` 关键字，该属性/ 方法不会被实例继承，而是直接通过类来调用。
3. 如果包含 `this` 关键字，这个 `this` 指的是类，而不是实例。
4. 静态属性 / 方法 可以与非静态属性 / 方法 重名。
5. 父类的静态属性 / 方法，可以被子类继承。

```js
class Foo {
  static bar() {
    this.baz();
  }
  static baz() {
    console.log('hello');
  }
  // 可以重名
  baz() {
    console.log('world');
  }
}

Foo.bar() // hello

// 静态属性
// 老写法
class Foo {
  // ...
}
Foo.prop = 1;

// 新写法
class Foo {
  static prop = 1;
}

// 子类继承父类静态属性和方法
class Bar extends Foo {
}

Bar.baz() // 'hello'
```

### （5）私有属性&私有方法

私有属性 / 方法：只能在类的内部访问的属性和方法，外部不能访问。在属性名之前使用 `#` 表示。

```js
class Foo {
  #a;
  #b;
  constructor(a, b) {
    this.#a = a;
    this.#b = b;
  }
  #sum() {
    return this.#a + this.#b;
  }
  printSum() {
    console.log(this.#sum());
  }
}
```

私有属性也可以设置 `getter` 和 `setter` 方法。

```js
class Counter {
  #xValue = 0;

  constructor() {
    console.log(this.#x);
  }

  get #x() { return this.#xValue; }
  set #x(value) {
    this.#xValue = value;
  }
}
```

在私有属性和私有方法前面，也可以加上 `static` 关键字，表示这是一个静态的私有属性或私有方法。

不管在类的内部或外部，读取一个不存在的私有属性，都会报错；这跟公开属性的行为完全不同，如果读取一个不存在的公开属性，不会报错，只会返回 `undefined`。这个特性可以用来判断，某个对象是否为类的实例。

```js
class C {
  #brand;

  static isC(obj) {
    if (#brand in obj) {
      // 私有属性 #brand 存在
      return true;
    } else {
      // 私有属性 #foo 不存在
      return false;
    }
  }
}
```

### （6）注意点

`new.target` 属性一般用在构造函数之中，返回 `new` 命令作用于的那个构造函数（在函数外部，使用 `new.target` 会报错）。如果构造函数不是通过 `new` 命令或 `Reflect.construct()` 调用的，`new.target` 会返回 `undefined`，因此这个属性可以用来确定构造函数是怎么调用的。

**`Class` 内部调用 `new.target`，返回当前 `Class`。子类继承父类时，`new.target`会返回子类。**

```js
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错
```

类内部使用严格模式。

类内部不存在变量提升，为了便于继承。

`this` 指向：默认指向类的实例。

`printName` 方法中的 `this`，默认指向 `Logger` 类的实例。但是，如果将这个方法提取出来单独使用，`this` 会指向该方法运行时所在的环境（由于 `class` 内部是严格模式，所以 `this` 实际指向的是 `undefined`），从而导致找不到 `print` 方法而报错。

```js
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
```

在构造方法中绑定 `this`。

```js
class Logger {
  constructor() {
    this.printName = this.printName.bind(this);
  }
}
```

使用箭头函数。

```js
class Obj {
  constructor() {
    this.getThis = () => this;
  }
}

const myObj = new Obj();
myObj.getThis() === myObj // true
```

## 类的继承

`extends` 关键字，子类继承父类的属性和方法。

子类必须在 `constructor()` 方法中调用 `super()`，否则就会报错。不管有没有显式定义，任何一个子类都有 `constructor()` 方法。

**（1）必须调用 `super()` 的原因**

- ES5 的继承机制，是先创造一个独立的子类的实例对象，然后再将父类的方法添加到这个对象上面，即**实例在前，继承在后**。
- ES6 的继承机制，则是先将父类的属性和方法，加到一个空的对象上面，然后再将该对象作为子类的实例，即**继承在前，实例在后**。这就是为什么 ES6 的继承必须先调用 `super()` 方法，因为这一步会生成一个继承父类的 `this` 对象，没有这一步就无法继承父类。
  - 子类自己的 `this` 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，添加子类自己的实例属性和方法。

**（2）注意**

1. 新建子类实例时，父类的构造函数必定会先运行一次。
2. 在子类的构造函数中，只有调用 `super()` 之后，才可以使用 `this` 关键字，否则会报错。
3. 如果子类没有定义 `constructor()` 方法，这个方法会默认添加，并且里面会调用 `super()`。不管有没有显式定义，任何一个子类都有 `constructor()` 方法。
4. `Object.getPrototypeOf()` 可以用来从子类上获取父类。可以用这个方法判断，一个类是否继承了另一个类。

```js
class Point { /*...*/ }

class ColorPoint extends Point { /*...*/ }

Object.getPrototypeOf(ColorPoint) === Point
// true
```

### （1）私有属性和私有方法的继承

父类所有的属性和方法，都会被子类继承，除了**私有属性和方法**。

如果父类定义了私有属性的读写方法，子类就可以通过这些方法，读写私有属性。

```js
class Father {
  #house_BJ = '北京1套'
  getHouse() {
    return this.#house_BJ
  }
}

class Son extends Father {
  constructor() {
    super()
  }
}
const f1 = new Father()
const s1 = new Son()
console.log(s1.getHouse())  // 获取父类私有属性
```

### （2） 静态属性和静态方法的继承

父类的静态属性和静态方法，也会被子类继承。静态属性是通过**浅拷贝**实现继承的。

```js
class Father {
  money = 1000
  static money = 100000
  static children = ['女儿A', '女儿B', '儿子A']
}

class Son extends Father {
  constructor() {
    super()
  }
}
const f1 = new Father()
const s1 = new Son()

// 浅拷贝
// 基本数据类型，拷贝父类静态属性的值，互不影响
Son.money--
console.log(Son.money)  // 99999
console.log(Father.money)  // 100000
// 引用数据类型，拷贝父类静态属性的内存引用，会相互影响
Son.children.push('女儿二')
console.log(Son.children)  // [ '女儿A', '女儿B', '儿子A', '女儿二' ]
console.log(Father.children)  // [ '女儿A', '女儿B', '儿子A', '女儿二' ]
```

### （3）`super` 关键字⭐

> `super` 关键字，既可以当作函数使用，也可以当作对象使用。
>

#### `super` 作为函数调用

`super` 作为函数调用时，代表父类的构造函数。子类的构造函数必须执行一次 `super()` 函数。作为函数时，`super()` 只能用在子类的构造函数之中，用在其他地方就会报错。

调用 `super()` 的作用是形成子类的 `this` 对象，把父类的实例属性和方法放到这个 `this` 对象上面。子类在调用 `super()` 之前，是没有 `this` 对象的，任何对 `this` 的操作都要放在 `super()` 的后面。

`super` 虽然代表父类的构造函数，但返回子类的 ` this`，即子类的实例。`super` 内部的 `this` 代表子类的实例，而不是父类的实例，这里的 `super()` 相当于 `A.prototype.constructor.call(this)` 在子类的 `this` 上运行父类的构造函数。

```js
class A {
  constructor() {
    console.log(new.target.name);  // new.target指向当前正在执行的函数
  }
}
class B extends A {
  constructor() {
    super();  // 指向B的构造函数
  }
}
new A() // A
new B() // B
```

由于 `super()` 在子类构造方法中执行时，子类的属性和方法还没有绑定到 `this`，所以如果存在同名属性，此时拿到的是父类的属性。

```js
class A {
  name = 'A';
  constructor() {
    console.log('My name is ' + this.name);
  }
}

class B extends A {
  name = 'B';
}

const b = new B(); // My name is A
```

#### `super` 作为对象

**① `super` 作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。**

由于 `super` 指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过 `super` 调用的。

```js
class A {
  constructor() {
    // 定义在实例对象
    this.num = 100;
  }
  // 定义在类原型
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    // A.prototype.p() 相当于 super.p()
    console.log(super.p()); // 2
    console.log(super.num); // undefined
  }
}

let b = new B();
```

在子类普通方法中通过 `super` 调用父类的方法时，方法内部的 `this` 指向当前的子类实例。

```js
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;  // 指向子类实例
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m() // 2
```

**由于 `this` 指向子类实例，所以如果通过 `super` 对某个属性赋值，这时 `super` 就是 `this`，赋值的属性会变成子类实例的属性。**

```js
class A {
  constructor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;  // 赋值相当于子类实例的this
    console.log(super.x); // undefined  // super指向父类原型，没有
    console.log(this.x); // 3
  }
}

let b = new B();
```

**② `super` 作为对象，用在静态方法之中，这时 `super` 将指向父类，而不是父类的原型对象。**

```js
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }

  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);  // 静态方法中super指向父类Parent，而不是父类原型
  }

  myMethod(msg) {
    super.myMethod(msg);  // 普通方法中super指向父类原型
  }
}

Child.myMethod(1); // static 1

var child = new Child();
child.myMethod(2); // instance 2
```

在子类的静态方法中通过 `super` 调用父类的方法时，方法内部的 `this` 指向当前的子类，而不是子类的实例。

```js
class A {
  constructor() {
    this.x = 1;
  }
  static print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  static m() {
    super.print();  // 指向子类B，而不是子类实例
  }
}

B.x = 3;
B.m() // 3
```

### （4）类的 `prototype` 属性和 `__proto__` 属性

每一个对象都有 `__proto__` 属性，指向对应的构造函数的 `prototype` 属性。`Class` 作为构造函数的语法糖，同时有 `prototype` 属性和 `__proto__` 属性，因此同时存在两条继承链。

1. 子类的 `__proto__` 属性，表示构造函数的继承，总是指向父类。

2. 子类 `prototype` 属性的 `__proto__` 属性，表示方法的继承，总是指向父类的 `prototype` 属性。

3. 子类实例的 `__proto__` 属性的 `__proto__` 属性，指向父类实例的 `__proto__` 属性。子类的原型的原型，是父类的原型。


```js
var p1 = new Point(2, 3);
var p2 = new ColorPoint(2, 3, 'red');

p2.__proto__ === p1.__proto__ // false
p2.__proto__.__proto__ === p1.__proto__ // true
```

原生构造函数是无法继承的，如 `Boolean()`、`Number()`、`String()`、`Array()`、`Date()`、`Function()`、`RegExp()`、`Error()`、`Object()`