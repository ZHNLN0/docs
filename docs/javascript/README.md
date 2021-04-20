# JavaScript

  **通过表象看本质**

## 重识原型链

  **问题来源于对JS继承的思考与总结**
  描述：JS 的继承是通过对原型链的操作进行的继承，通过绑定作用域，重写原型对象，修改原型链等方式实现的继承。（目前最完美的是寄生组合继承，但是对于私有属性的处理还是存在着很多的问题，在多继承是还要操作 \_\_proto\_\_）

```js
// 例子代码 以下需要使用到的代码说明根据此处代码
const Foo = function (name) {
  this.name = name
}

const f1 = new Foo('zhn')
```

### prototype

  prototype 仅存在在函数对象上，即只有函数才有 prototype，而 prototype 本质就是一个对象。代码角度理解为：Person 为函数对象，存在着一个对象属性 Person.prototype

  prototype 在没有经过任何的修改时，只有两个不可枚举的对象，constructor 和 __proto__

### constructor

  constructor 意为构造函数，存在于原型对象上，并不是函数对象的属性，通过 ``` Reflect.getOwnPropertyDescriptor(Person.prototype, 'constructor') ``` 可以获取到 constructor 的描述信息。（个人理解：构造函数 constructor 也是函数对象对外暴露值的形式）

### 实例

  实例是构造函数实例化的后的结果，一般使用 new 关键字实例化对象（[new 实现](code.html#new-的实现)），直接声明赋值也是一种实例化（注意：证明和赋值是两个过程，未显式赋值时默认会赋值 undefined）。

### __proto__

  __proto__ 并不是 JavaScript 的标准语言特性，这是各浏览器（IE 不支持，个人理解为是原型链的规则的体现）自己实现的特性，\_\_proto\_\_ 的类型是一个对象，但是本质是对构造函数原型对象的引用。代码角度的理解为：``` instance.__proto__ === Person.prototype ```

### 原型链查找规则

  ![原型链](/javascript/prototype.jpg)

## 重识 var/let/const

  **问题来源于LHS和RHS对 let 关键字的声明变量的处理**
  描述：let 的变量声明使得在声明之前不能使用该变量，那么它的 LHS 和 RHS又是怎么执行的，在编译阶段是否会先创建变量呢 ？

### LHS（赋值操作的目标是谁）和RHS（谁是赋值操作的源头，即操作的值时什么）

  ``` var a = 1; console.log(a) ``` 在使用声明一个变量的时候，编译器会先在内存中定义一个变量 a，此时内存中的内容还没有分配，当进行赋值的操作的时候，在将值填入到内存中。而这个赋值的操作就存在了 LHS和RHS的过程。
  首先会对 a 命名空间进行 LRH 查找，是否存在 a 这一命名空间，即为 = 1 这一操作寻找到目标，当对 a 的值进行输出是，又要对 a 进行 RHS，即查找 a 的值是什么。

### 暂时性死区（Temporal Dead Zone，TDZ）

  具体表现：

  ```js
    consloe.log(a) // undefined
    consloe.log(b) // ReferenceError

    var a = 1
    let b = 1
  ```

  对 a 的访问没有报错，b 的访问时引用报错，即不存在 b 这个值。
  那么真的是不存在 b 这个值吗？

  在声明变量之后，赋值之前，a，b 其实都已经被创建，但是变量 a 被直接存放到了顶部的作用域（此处是顶部作用域，在函数中则是函数作用域），而 b 被存放在一个暂时性死区中，当代码对暂时性死区中的变量进行访问的时候，抛出 ReferenceError，只有在赋值操作的时候才会将其移除暂时性死区。

### 块级作用域

  ES6中引入了块级作用域，作用域函数的内部和块中（代码 {} 中的区域），块级作用域中的变量不能在块以外被访问。

  ```js
    function func () {
      for (var a = 0; a < 5; a++) {
        console.log(a)
        setTimeout(() => {
          console.log(a)
        }, 10) // 5 * 5
      }
      for (let b = 0; b < 5; b++) {
        console.log(b)
        setTimeout(() => {
          console.log(b)
        }, 10) // 0,1,2,3,4
      }
      console.log(a) // 5
      console.log(b) // 输出：ReferenceError
    }
    func()
    // 输出：5，ReferenceError，5 * 5，0，1，2，3，4 （setTimeOut 是异步的）
  ```

  对于 var 是不存在块级作用域的，所以第一个 for 循环的操作只不过是在对函数作用域下的变量 a 进行了 a++ 的操作，所以当 ``` setTimeOut ``` 的执行时，只是访问函数作用下的变量 a，而异步执行 ``` setTimeOut ``` 时，a在函数作用域中的值变成了5。

### 循环中的块级作用域

  按照之前的解释，let 在for 循环中即使存在着块级作用域，也只能保证 for 循环外的 ``` console.log(b) ```无法访问，但是``` setTimeout ``` 中依旧会输出 5 * 5。
  ECMAScript 为循环中的块级作用域进行了专门的定义，``` for (let b = 0; b < 5; b++) ``` 会建立一个隐藏的作用域，所以即使在 for 循环内再次声明 let b = 'abc' 循环还是会一样正常执行。（const则会保留特性无法被修改，Uncaught TypeError: Assignment to constant variable.）

  闭包模拟实现块级作用域

  ```js
  for (var i = 0; i < 5; i++) {
    (
      function(i) {
        setTimeout(function() {
          console.log(i)
        }, 10)
      }
    )(i)
  }
  ```

## 浏览器中的事件循环

  **问题来源：Proimse的认识，到微任务和宏任务，再到时间循环**

  描述：
