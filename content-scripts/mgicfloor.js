let isInitMgicFloor = false;
let btn = null;

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

  btn.mousedown((event)  => {
    const offset = btn.offset();
    let offsetLeft = 0;
    let offsetTop = 0;
    x1 = event.clientX - offset.left;
    y1 = event.clientY - offset.top;

    $(document).mousemove((event) => {
      if (!isNaN(event.clientX) && !isNaN(event.clientY)) {
        offsetLeft = event.clientX - x1;
        offsetTop = event.clientY - y1;
        btn.css("left", offsetLeft + "px");
        btn.css("top", offsetTop + "px");
        btn.css("cursor", "move");
      }
    });
    btn.mouseup((event) => {
      if(offsetLeft < 2 && offsetTop < 2) {
        // 发送信息给inject获取jenga楼层数据
        const event = new CustomEvent("needJengaData", {
          detail: {
            needJengaData: true
          }
        });
        window.dispatchEvent(event);
      }
      btn.css("left", "unset");
      btn.css("right", "0");
      btn.css("cursor", "pointer");
      $(document).unbind("mousemove");
    });
  });
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
  console.log('floorName-dataType: floorData');
  console.log(floorArray.length > 0 ? floorArray : floor)
};
