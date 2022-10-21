let messageContent;
let messageAuthor;
// let slayCounter = {};

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length) {
      messageAuthor = mutation.addedNodes[0].childNodes[1].childNodes[0].getElementsByClassName('tiktok-batvl-SpanNickName')[0].innerHTML;
      messageContent = mutation.addedNodes[0].childNodes[1].childNodes[1].innerHTML;

      // if (messageContent.toLowerCase().includes('slay')) {
      //   if (!slayCounter.hasOwnProperty(messageAuthor)) {
      //     slayCounter[messageAuthor] = 0;
      //   }
      //   slayCounter[messageAuthor] += (messageContent.toLowerCase().match(/slay/g) || []).length;
      //   console.log(messageAuthor + "'s slay counter is now: " + slayCounter[messageAuthor]);
      // }
      if (messageAuthor && messageContent) {
        console.log(messageAuthor + ' schreibt: ' + messageContent);
      }
    }
  });
});
window.addEventListener('load', function () {
  this.setTimeout(() => {
    const chatWindow = document.getElementsByClassName('tiktok-1gwk1og-DivChatMessageList')[0];
    console.log(chatWindow);

    if (chatWindow) {
      observer.observe(chatWindow, {
        childList: true,
      });
    }
  }, 1000);
});
