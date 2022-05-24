window.addEventListener("needJengaData", (e) => {
  console.log('我是inject，我收到来自content的消息');
  if(e.detail.needJengaData) {
    const event = new CustomEvent("sendJengaData", {
      detail: {
        jengaData: window.__KLOOK__
      }
    });
    window.dispatchEvent(event);
  }
});
