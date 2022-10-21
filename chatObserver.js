const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length){
        console.log(mutation.addedNodes);
    }
  });
});
const chatWindow = document.getElementsByClassName('tiktok-1gwk1og-DivChatMessageList')[0];
console.log(chatWindow);

observer.observe(chatWindow, {
  childList: true,
});
