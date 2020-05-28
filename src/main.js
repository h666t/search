const $add = $("#add");
const $siteList = $(".siteList");
const removeHttp = (url) => {
  return url
    .replace("http://", "")
    .replace("https://", "")
    .replace("www.", "")
    .replace(/\/.*/, "");
};

const theTrueOpenHttp = (url) => {
  return url.replace("http://", "").replace("https://", "").replace("www.", "");
};

const getLocalStorageItem = localStorage.getItem("stringHashTable");
const objectStringHashTable = JSON.parse(getLocalStorageItem);
//获取存入的hashTable
let hashTable = objectStringHashTable || [
  { siteLogo: "M", url: "https://developer.mozilla.org/zh-CN/" },
  { siteLogo: "G", url: "https://github.com" },
  { siteLogo: "I", url: "https://www.iconfont.cn" },
  { siteLogo: "F", url: "https://www.figma.com" },
];
//使用数组（内有多个哈希表）来存放创建出来的siteM

const sort = (x) => {
  x.sort((x, y) => {
    if (x.siteLogo < y.siteLogo) {
      return -1;
    } else if (x.siteLogo > y.siteLogo) {
      return 1;
    }
    return 0;
  });
  //实现对siteLogo的排序
};

const render = () => {
  sort(hashTable);
  $siteList.find("li:not(#add)").remove();
  //每次渲染把除最后一个以外都删除

  hashTable.forEach((node, index) => {
    const $li = $(`<li class="site longPressCanTouchDelete">
    <div class = 'close'>
    <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-close"></use>
              </svg>
              </div>
    <div class="siteLogo">
          ${node.siteLogo}
        </div>
        <div class="url">
        ${removeHttp(node.url)}
        </div>
      </li>
    `).insertBefore($add);
    //遍历哈希表，为里面的对象创建li

    $li.on("click", () => {
      window.open("https://" + theTrueOpenHttp(node.url), "_self");
    });
    //给li添加点击事件（pc端）
    $li.on("click", ".close", (event) => {
      event.stopPropagation();
      hashTable.splice(index, 1);
      render();
      let stringHashTable = JSON.stringify(hashTable);
      let x = localStorage.setItem("stringHashTable", stringHashTable);
      //立即更新localStorage，解决删除后不能及时将数据存储到localStorage
      console.log(hashTable);
    });
    //删除事件
    let longClick = 0;
    //避免长按结束后只能执行touchend中的事件
    const $siteLogo = $li.find(".siteLogo");
    //不能用$li监听,因为它已经被赋予一个监听了
    $siteLogo.on({
      touchstart: function () {
        longClick = 0; //设置初始为0
        timeOutEvent = setTimeout(function () {
          $li.find(".icon").css("visibility", "visible");
          //此处为长按事件-----在此显示遮罩层及删除按钮
          longClick = 1; //假如长按，则设置为1
        }, 500);
      },
      touchmove: function () {
        clearTimeout(timeOutEvent);
        // timeOutEvent = 0;
        // preventDefault();
      },
      touchend: function () {
        clearTimeout(timeOutEvent);
        if (timeOutEvent !== 0 && longClick === 0) {
          //点击
          //此处为点击事件----在此处添加跳转详情页(移动端)
          window.open("https://" + removeHttp(node.url), "_self");
        }
      },
    });

    //长按事件
    $(document).on("click", () => {
      $li.find(".icon").css("visibility", "hidden");
    });
    // //在长按点击其他地方，删除按钮隐藏
  });
};

render();

$add.on("click", () => {
  const url = window.prompt("请输入您要添加的网址");
  hashTable.push({
    siteLogo: removeHttp(url)[0].toUpperCase(),
    url: url,
  });
  render();
  //每次添加新网址重新渲染
  let stringHashTable = JSON.stringify(hashTable);
  let x = localStorage.setItem("stringHashTable", stringHashTable);
  //将hashTable存入localStorage
});

// window.onbeforeunload = () => {
//   let stringHashTable = JSON.stringify(hashTable);
//   let x = localStorage.setItem("stringHashTable", stringHashTable);
// };

$(document).on("keypress", (k) => {
  const { key } = k;

  for (let i = 0; i < hashTable.length; i++) {
    if (key.toUpperCase() === hashTable[i].siteLogo) {
      console.log("ok");
      window.open(hashTable[i].url, "_self");
    }
  }
});
//加入键盘事件
$(document).on("keypress", ".searchInput", (event) => {
  event.stopPropagation();
});
//在input中输入时，阻止键盘事件
