# node

## node 基本概述

### node 的定义

- Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。
- Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。

## Buffer

  Buffer 是类似16进制的两位数的数组，当值小于0时，依次加255直到0~255之间，超出255则依次减255，小数则舍弃小数部分。

### 内存分配

  Buffer的内存分配不在V8的堆内存中，属于堆外内存，由底层C++申请内存，JavaScript分配内存，采用slab动态内存分配策略。

#### slab 动态内存分配
  每个最小slab最小分配单元是8kb，slab 具有三种状态：

  1. full：完全分配状态
  2. partial：部分分配状态
  3. empty：没有分配状态

  当 `new buffer(size)` 分配原则：

  ``` js
  Buffer.poolSize = 8 * 1024
  var pool
  function allocPool () {
    pool = new SlowBuffer(Buffer.poolSize)
    pool.used = 0
  }
  ```

  1. `new Buffer(1024)` 先检查是否有 pool 被创建，pool 没有被创建时，创建 slab 单元并指向他，即 `if(!pool || pool.length - pool.used < this.length) allocPool()`，同时创建的Buffer对象的parent指向slab，并记录slab开始使用位置。

  ```js
    this.parent = pool
    this.offset = pool.used
    pool.used += this.length
  ```

  2. 当再次 `new Buffer(3000)`，pool已经被创建，此时Buffer对象所申请的空间会在原pool的used位置继续分配空间。
  3. 继续 `new Buffer(5000)`时，原pool空间无法存储这个Buffer对象，只能再申请一个slab单元，旧的pool剩余空间依旧占用内存中，只是未分配使用。只有当前两个Buffer都被释放的时候才会回收slab单元，释放内存。
  4. 分配一个大Buffer对象的时候，会直接分配一个 slowBuffer（C++底层方法）对象为slab单元。
