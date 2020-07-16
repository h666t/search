// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $add = $("#add");
var $siteList = $(".siteList");

var removeHttp = function removeHttp(url) {
  return url.replace("http://", "").replace("https://", "").replace("www.", "").replace(/\..*/, "");
};

var theTrueOpenHttp = function theTrueOpenHttp(url) {
  return url.replace("http://", "").replace("https://", "").replace("www.", "");
};

var getLocalStorageItem = localStorage.getItem("stringHashTable");
var objectStringHashTable = JSON.parse(getLocalStorageItem); //获取存入的hashTable

var hashTable = objectStringHashTable || [{
  siteLogo: 'B',
  url: 'https://www.bootcdn.cn/'
}, {
  siteLogo: "G",
  url: "https://github.com"
}, {
  siteLogo: "I",
  url: "https://www.iconfont.cn"
}, {
  siteLogo: "F",
  url: "https://www.figma.com"
}]; //使用数组（内有多个哈希表）来存放创建出来的siteM

var render = function render() {
  var sort = function sort(x) {
    x.sort(function (x, y) {
      if (x.siteLogo < y.siteLogo) {
        return -1;
      } else if (x.siteLogo > y.siteLogo) {
        return 1;
      }

      return 0;
    }); //实现对siteLogo的排序
  };

  sort(hashTable);
  $siteList.find("li:not(#add)").remove(); //每次渲染把除最后一个以外都删除

  hashTable.forEach(function (node, index) {
    var $li = $("<li class=\"site longPressCanTouchDelete\">\n    <div class = 'close'>\n    <svg class=\"icon\" aria-hidden=\"true\">\n                <use xlink:href=\"#icon-close\"></use>\n              </svg>\n              </div>\n    <div class=\"siteLogo\">\n          ".concat(node.siteLogo, "\n        </div>\n        <div class=\"url\">\n        ").concat(removeHttp(node.url), "\n        </div>\n      </li>\n    ")).insertBefore($add); //遍历哈希表，为里面的对象创建li

    $li.on("click", function () {
      window.open("https://" + theTrueOpenHttp(node.url), "_self");
    }); //给li添加点击事件（pc端）

    $li.on("click", ".close", function (event) {
      event.stopPropagation();
      hashTable.splice(index, 1);
      var stringHashTable = JSON.stringify(hashTable);
      var x = localStorage.setItem("stringHashTable", stringHashTable);
      render(); //立即更新localStorage，解决删除后不能及时将数据存储到localStorage
    }); //删除事件

    var $siteLogo = $li.find(".siteLogo"); //不能用$li监听,因为它已经被赋予一个监听了

    $siteLogo.on({
      touchstart: function touchstart() {
        timeOutEvent = setTimeout(function () {
          $li.find(".icon").css("visibility", "visible"); //此处为长按事件-----在此显示遮罩层及删除按钮
        }, 500);
      },
      touchmove: function touchmove() {
        clearTimeout(timeOutEvent);
      }
    }); //长按事件

    $(document).on("click", function () {
      $li.find(".icon").css("visibility", "hidden");
    }); // //在长按点击其他地方，删除按钮隐藏
  });
};

render();
$add.on("click", function () {
  var url = window.prompt("请输入您要添加的网址");
  hashTable.push({
    siteLogo: removeHttp(url)[0].toUpperCase(),
    url: url
  });
  render(); //每次添加新网址重新渲染

  var stringHashTable = JSON.stringify(hashTable);
  var x = localStorage.setItem("stringHashTable", stringHashTable); //将hashTable存入localStorage
}); //点击加号输入网址

$(document).on("keypress", function (k) {
  var key = k.key;

  for (var i = 0; i < hashTable.length; i++) {
    if (key.toUpperCase() === hashTable[i].siteLogo) {
      console.log(i);
      window.open(hashTable[i].url, "_self");
      break; //防止有相同logo的网站，点击后多次遍历，导致打开的是i最大的那个网站，所以要break
    }
  }
}); //加入键盘事件

$(document).on("keypress", ".searchInput", function (event) {
  event.stopPropagation();
}); //在input中输入时，阻止键盘事件
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.f90b53f1.js.map