$(document).ready( () => {
  const mgicFloorBtn = $('#mgicfloor-btn');
  let openMgicFloor = false;

// 拿到存储的设定值
  chrome.storage.sync.get('openMgicFloor', (res) => {
    openMgicFloor = res.openMgicFloor === 'true' || false;
    if(openMgicFloor) {
      mgicFloorBtn.text('启用');
      mgicFloorBtn.addClass('open')
    }
  });

  mgicFloorBtn.bind('click', async () => {
    openMgicFloor = !openMgicFloor;
    chrome.storage.sync.set({ openMgicFloor: openMgicFloor + '' });
    if(openMgicFloor) {
      mgicFloorBtn.text('启用');
      mgicFloorBtn.addClass('open')
    } else {
      mgicFloorBtn.text('禁用');
      mgicFloorBtn.removeClass('open')
    }

    const tab = await getCurrentTab();
    await chrome.tabs.sendMessage(tab.id, { openMgicFloor }, (res) => {
      console.log('我是popup向content发送消息的回调：' + res.msg)
    });
  })
});

// 获取当前tab标签
const getCurrentTab = async () => {
  let queryOptions = {active: true, currentWindow: true};
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};
