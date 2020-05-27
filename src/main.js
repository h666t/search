const $add = $("#add");
const $siteList = $(".siteList");
const removeHttp = (url) => {
  return url
    .replace("http://", "")
    .replace("https://", "")
    .replace("www.", "")
    .replace(/\/.*/, "");
};

const getLocalStorageItem = localStorage.getItem("stringHashTable");
const objectStringHashTable = JSON.parse(getLocalStorageItem);
//获取存入的hashTable
let hashTable = objectStringHashTable || [{ siteLogo: "G", url: "google.com" }];
//使用数组（内有多个哈希表）来存放创建出来的site

const render = () => {
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
      window.open("https://" + removeHttp(node.url), "_self");
    });
    //给li添加点击事件（pc端）
    $li.on("click", ".close", (event) => {
      event.stopPropagation();
      hashTable.splice(index, 1);
      render();
    });
    //删除事件
    let longClick = 0;
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
        timeOutEvent = 0;
        e.preventDefault();
      },
      touchend: function () {
        clearTimeout(timeOutEvent);
        if (timeOutEvent != 0 && longClick == 0) {
          //点击
          //此处为点击事件----在此处添加跳转详情页(移动端)
          window.open("https://" + removeHttp(node.url), "_self");
        }
        return false;
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

window.onbeforeunload = () => {
  let stringHashTable = JSON.stringify(hashTable);
  let x = localStorage.setItem("stringHashTable", stringHashTable);
};
