let isInitMgicFloor = false;
let btn = null;
let floorJQ = []

// 获取后端存储的配置
chrome.storage.sync.get('openMgicFloor', (res) => {
  if(res.openMgicFloor === 'true') {
    initMgicFloor()
  }
});

// 获取popup的配置
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(!isInitMgicFloor && request.openMgicFloor) {
    initMgicFloor()
  } else {
    request.openMgicFloor ? btn.show() : btn.hide()
  }
  console.log('我是content,接收到popup发送的消息：' + request.openMgicFloor);
  sendResponse({msg: '我是content,已经拿到popup发送的消息了'});
});

const initMgicFloor = () => {
  isInitMgicFloor = true;
  // 动态注入inject脚本
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('../inject-scripts/mgicfloor.js');
  // s.onload = () => {
  //   this.remove();
  // };
  (document.head || document.documentElement).appendChild(s);

  // 创建点击按钮
  const mgicBtn = "<div id='mgic-floor'>mgicFloor</div>";
  $(document.body).append(mgicBtn);

  btn = $('#mgic-floor');

  btn.click(() => {
    // 发送信息给inject获取jenga楼层数据
    const event = new CustomEvent("needJengaData", {
      detail: {
        needJengaData: true
      }
    });
    window.dispatchEvent(event);

    floorJQ = $(".wrapper__list-container").find(".wrapper__item")
    $.each(floorJQ, (index, item) => {
      if($(item).find('.header_title')[0]) {
        $(item).find('.header_title p').remove()
        $(item).find('.header_title').append(`<p style="color: red">${item.id.replace("s-","*****")}</p>`);
      }
    })
  })
};

window.addEventListener("sendJengaData", (e) => {
  console.log('我是content，我收到来自inject的数据');
  mgicfloor(e.detail.jengaData)
});

const mgicfloor = (jengaData) => {
  let floor = '无floor数据，请确认是否为jenga楼层，或与thomas联系';
  let floorArray = [];
  if(jengaData && jengaData.data[0].pageData) {
    const sections = jengaData.data[0].pageData.page.body.sections;
    sections.forEach((item, index) => {
      const key = `${item.meta.name}-${item.body.content.data_type}`;
      floorArray.push({[key]: item.body})
    })
  }
  console.log('%c由于存在异步楼层懒加载，若无楼层数据，请滑动到页面底部触发全部加载完成后再点击获取数据按钮', 'color: red')
  console.log('floorName-dataType: floorData');
  console.log(floorArray.length > 0 ? floorArray : floor)
};
