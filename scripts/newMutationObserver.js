//use this js with the url you get for the tikfinity chat overlay

let chatContainer = document.getElementById('chatContainer');

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length) {
      let tryMessage = mutation.addedNodes[0].getElementsByClassName('comment')[0];
      console.log(tryMessage.innerHTML);
    }
  });
});

observer.observe(chatContainer, {
  childList: true,
});
