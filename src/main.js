const $add = $("#add");
const $siteList = $(".siteList");
const removeHttp = (url) => {
  return url
    .replace("http://", "")
    .replace("https://", "")
    .replace("www.", "")
    .replace(/\/.*/, "")
    .replace(/\.\w*/, "");
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

const render = () => {
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
      let stringHashTable = JSON.stringify(hashTable);
      let x = localStorage.setItem("stringHashTable", stringHashTable);
      render();
      //立即更新localStorage，解决删除后不能及时将数据存储到localStorage
    });
    //删除事件

    const $siteLogo = $li.find(".siteLogo");
    //不能用$li监听,因为它已经被赋予一个监听了
    $siteLogo.on({
      touchstart: function () {
        timeOutEvent = setTimeout(function () {
          $li.find(".icon").css("visibility", "visible");
          //此处为长按事件-----在此显示遮罩层及删除按钮
        }, 500);
      },
      touchmove: function () {
        clearTimeout(timeOutEvent);
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
//点击加号输入网址
$(document).on("keypress", (k) => {
  const { key } = k;

  for (let i = 0; i < hashTable.length; i++) {
    if (key.toUpperCase() === hashTable[i].siteLogo) {
      console.log(i);
      window.open(hashTable[i].url, "_self");
      break;
      //防止有相同logo的网站，点击后多次遍历，导致打开的是i最大的那个网站，所以要break
    }
  }
});
//加入键盘事件
$(document).on("keypress", ".searchInput", (event) => {
  event.stopPropagation();
});
//在input中输入时，阻止键盘事件
