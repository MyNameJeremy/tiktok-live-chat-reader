let messageContent = '';
let messageAuthor = '';
let slayCounter = {};

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length) {
      messageAuthor = mutation.addedNodes[0].childNodes[1].childNodes[0].getElementsByClassName('tiktok-batvl-SpanNickName')[0].innerHTML;
      messageContent = mutation.addedNodes[0].childNodes[1].childNodes[1].innerHTML;

      if (messageContent.toLowerCase().includes('slay')) {
        if (!slayCounter.hasOwnProperty(messageAuthor)) {
          slayCounter[messageAuthor] = 0;
        }
        slayCounter[messageAuthor] += (messageContent.toLowerCase().match(/slay/g) || []).length;
        console.log(messageAuthor + "'s slay counter is now: " + slayCounter[messageAuthor]);
      }

      //   console.log(messageAuthor + ' schreibt: ' + messageContent);
    }
  });
});
const chatWindow = document.getElementsByClassName('tiktok-1gwk1og-DivChatMessageList')[0];
console.log(chatWindow);

observer.observe(chatWindow, {
  childList: true,
});
