let messageContent;
let messageAuthor;
// let slayCounter = {};

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length) {
      messageAuthor = mutation.addedNodes[0].getElementsByClassName('tiktok-batvl-SpanNickName')[0].innerHTML || null;
      messageContent = mutation.addedNodes[0].getElementsByClassName('tiktok-1o9hp7f-SpanChatRoomComment')[0].innerHTML || null;

      // if (messageContent.toLowerCase().includes('slay')) {
      //   if (!slayCounter.hasOwnProperty(messageAuthor)) {
      //     slayCounter[messageAuthor] = 0;
      //   }
      //   slayCounter[messageAuthor] += (messageContent.toLowerCase().match(/slay/g) || []).length;
      //   console.log(messageAuthor + "'s slay counter is now: " + slayCounter[messageAuthor]);
      // }
      if (messageAuthor && messageContent) {
        console.log(messageAuthor + ' schreibt: ' + messageContent);
        document.getElementById('messagesTableBody').innerHTML += '<tr><td>' + messageAuthor + '</td><td>' + messageContent + '</td></tr>';
      }
    }
  });
});
window.addEventListener('load', function () {
  this.setTimeout(() => {
    const chatWindow = document.getElementsByClassName('tiktok-1gwk1og-DivChatMessageList')[0];
    console.log(chatWindow);

    let display = document.createElement('div');
    display.innerHTML += '<style>table, td, th {border: 1px solid #fff;}table {width: 100%;border-collapse: collapse;}</style>';
    display.style.zIndex = '1000';
    display.style.position = 'fixed';
    display.style.top = '0';
    display.style.width = '100%';
    display.style.height = '100%';
    display.style.backgroundColor = '#232323';

    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');

    thead.innerHTML = '<tr><th>Author</th><th>Message</th></tr>';
    table.appendChild(thead);
    tbody.setAttribute('id', 'messagesTableBody');
    table.appendChild(tbody);
    table.style.color = '#fff';
    display.appendChild(table);

    this.document.getElementsByTagName('body')[0].appendChild(display);

    if (chatWindow) {
      observer.observe(chatWindow, {
        childList: true,
      });
    }
  }, 5000);
});
