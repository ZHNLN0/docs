// 这是 babel 编译后实现 class 的方法
// 包含 super constructor extends 寄生组合继承基本原理的实现
// #private 私有变量 WeakMap 的实现方案
// static 静态成员 _defineProperty 的实现方案
// 以及一些具备兼容性的写法


class A {
  constructor(name) {
    this.name = name;
  }
  #zhn = 'zhn'
  static a = 12
  aFunc () {}
}

class B extends A {
  constructor(name, age) {
    super(name);
    this.age = age
  }
  
  bFunc () {}
}

class C extends B {
  constructor(name, age, sex) {
    super(name, age)
    this.sex = sex
  }
}





"use strict";

function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function () {})
    );
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var _zhn = new WeakMap();

var A = /*#__PURE__*/ (function () {
  function A(name) {
    _classCallCheck(this, A);

    _zhn.set(this, {
      writable: true,
      value: "zhn"
    });

    this.name = name;
  }

  _createClass(A, [
    {
      key: "aFunc",
      value: function aFunc() {}
    }
  ]);

  return A;
})();

_defineProperty(A, "a", 12);

var B = /*#__PURE__*/ (function (_A) {
  _inherits(B, _A);

  var _super = _createSuper(B);

  function B(name, age) {
    var _this;

    _classCallCheck(this, B);

    _this = _super.call(this, name);
    _this.age = age;
    return _this;
  }

  _createClass(B, [
    {
      key: "bFunc",
      value: function bFunc() {}
    }
  ]);

  return B;
})(A);

var C = /*#__PURE__*/ (function (_B) {
  _inherits(C, _B);

  var _super2 = _createSuper(C);

  function C(name, age, sex) {
    var _this2;

    _classCallCheck(this, C);

    _this2 = _super2.call(this, name, age);
    _this2.sex = sex;
    return _this2;
  }

  return C;
})(B);
