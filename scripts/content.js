let scoreCounter = {};
let donators = [];

let synth = window.speechSynthesis;
let utter = new SpeechSynthesisUtterance();
utter.lang = 'de';
let voices = synth.getVoices();
utter.voice = voices[9];

const ipFile = chrome.runtime.getURL('ip.txt');
// save content to variable called ipAdress
let ipAddress = '';
fetch(ipFile)
  .then((response) => response.text())
  .then((text) => {
    ipAddress = text;
    const webSocket = new WebSocket(`ws://${ipAddress}:8080`);

    webSocket.addEventListener('message', ({ data }) => {
      console.log(data);
      readOutMessage(data);
    });

    window.addEventListener('load', function () {
      this.setTimeout(() => {
        document.getElementsByClassName('tiktok-ba55d9-DivHeaderRightContainer')[0].innerHTML += '<button id="triggerDisplayAndWatcher">test</button>';
        document.getElementById('triggerDisplayAndWatcher').addEventListener('click', function () {
          // triggerDisplay();
          addDonorOnlySwitch();
          triggerWatcher();
        });
      }, 5000);
    });

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length) {
          let tryAuthor = mutation.addedNodes[0].getElementsByClassName('tiktok-batvl-SpanNickName');
          let messageAuthor = tryAuthor.length ? tryAuthor[0].innerHTML : '';

          let tryMessage = mutation.addedNodes[0].getElementsByClassName('tiktok-1o9hp7f-SpanChatRoomComment');
          let message = tryMessage.length ? tryMessage[0].innerHTML : '';

          let tryDonation = mutation.addedNodes[0].getElementsByClassName('tiktok-ntrujy');
          let donation = tryDonation.length ? tryDonation[0].innerHTML : '';

          if (donation) {
            console.log(`DONATION BY ${messageAuthor}`);
            if (messageAuthor && !donators.includes(messageAuthor)) {
              console.log('new donator');
              donators.push(messageAuthor);
              console.table(donators);
            }
          }

          if (messageAuthor && !synth.speaking && message) {
            // console.log(`${messageAuthor} : ${message}`);
            if (document.getElementById('donorOnlyMode').checked) {
              if (!donators.includes(messageAuthor)) {
                return;
              }
              donators.splice(donators.indexOf(messageAuthor), 1);
            }
            webSocket.send(message);
          }

          // changeScore();
        }
      });
    });

    function triggerWatcher() {
      const chatWindow = document.getElementsByClassName('tiktok-1gwk1og-DivChatMessageList')[0];

      if (chatWindow) {
        observer.observe(chatWindow, {
          childList: true,
        });
      }
    }

    function readOutMessage(message) {
      console.log('reading out message');
      utter.text = message;
      synth.speak(utter);
    }

    function changeScore() {
      let scoreOption1value = document.getElementById('scoreOption1value');
      let scoreOption2value = document.getElementById('scoreOption2value');

      if (message == '1' || message == '2') {
        if (!scoreCounter.hasOwnProperty(messageAuthor)) {
          scoreCounter[messageAuthor] = '';
        }
        scoreCounter[messageAuthor] = message;
        console.log(messageAuthor + "'s vote is now: " + scoreCounter[messageAuthor]);
      }

      let score1 = 0;
      let score2 = 0;
      for (vote in scoreCounter) {
        if (scoreCounter[vote] == '1') {
          score1++;
        } else if (scoreCounter[vote] == '2') {
          score2++;
        }
      }

      scoreOption1value.innerHTML = score1;
      scoreOption2value.innerHTML = score2;
    }

    function addDonorOnlySwitch() {
      let switchHTML = `
  <style>
  .switch {
    position: relative;
    display: inline-block;
    width: 120px;
    height: 34px;
   }
   
   .switch input {
    display: none;
   }
   
   .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #3C3C3C;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 34px;
   }
   
   .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
   }
   
   input:checked + .slider {
    background-color: #0E6EB8;
   }
   
   input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
   }
   
   input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(85px);
   }
   
   /*------ ADDED CSS ---------*/
   .slider:after {
    content: 'DISABLED';
    color: white;
    display: block;
    position: absolute;
    transform: translate(-50%,-50%);
    top: 50%;
    left: 50%;
    font-size: 10px;
    font-family: Verdana, sans-serif;
   }
   
   input:checked + .slider:after {
    content: 'ENABLED';
   }
  </style>
  <label class="switch">
  <input id="donorOnlyMode" type="checkbox">
  <span class="slider"></span>
</label>
  `;
      document.getElementsByClassName('tiktok-kidgju-DivHeaderWrapperMain')[0].innerHTML += switchHTML;
    }

    function triggerDisplay() {
      let display = document.createElement('div');
      display.setAttribute('id', 'display');

      let ui_css = `
  body {
    background: #232323;
  }

  #display {
    z-index: 1000;
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #232323;
  }
  table,
  td,
  th {
    border: 1px solid #fff;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }

  .form {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
  }

  .vs {
    color: #e8e8e8;
  }

  .input-group {
    position: relative;
    padding: 20px;
  }

  .input {
    border-radius: 15px;
    padding: 1rem;
    background: #232323;
    color: #fff;
    border: none;
    box-shadow: 11px 11px 21px #181818, -11px -11px 21px #2e2e2e;
    margin-bottom: 20px;
  }

  .input:focus-visible,
  .input:focus,
  .input:valid {
    outline: none;
    box-shadow: inset 11px 11px 21px #181818, inset -11px -11px 21px #2e2e2e;
  }

  .user-label {
    position: absolute;
    left: 30px;
    color: #e8e8e8;
    pointer-events: none;
    transform: translateY(13px);
    transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .input:focus ~ label,
  input:valid ~ label {
    transform: translateY(-50%) scale(0.8);
    background-color: #212121;
    padding: 0 0.2em;
    color: #2196f3;
  }

  /* From uiverse.io by @satyamchaudharydev */
  /* === removing default button style ===*/
  .button {
    margin: 0;
    background: transparent;
    padding: 0;
    border: none;
  }

  /* button styling */
  .button {
    justify-self: center;
    --border-right: 6px;
    --text-stroke-color: rgba(255, 255, 255, 0.6);
    --animation-color: #37ff8b;
    --fs-size: 2em;
    letter-spacing: 3px;
    text-decoration: none;
    font-size: var(--fs-size);
    font-family: 'Arial';
    position: relative;
    text-transform: uppercase;
    color: transparent;
    -webkit-text-stroke: 1px var(--text-stroke-color);
  }

  /* this is the text, when you hover on button */
  .hover-text {
    position: absolute;
    box-sizing: border-box;
    content: attr(data-text);
    color: var(--animation-color);
    width: 0%;
    inset: 0;
    border-right: var(--border-right) solid var(--animation-color);
    overflow: hidden;
    transition: 0.5s;
    -webkit-text-stroke: 1px var(--animation-color);
  }

  /* hover */
  .button:hover .hover-text {
    width: 100%;
    filter: drop-shadow(0 0 23px var(--animation-color));
  }

  .display{
    color: #e8e8e8;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .evaluate {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 10px 30px;
    -webkit-transition: 0.5s;
    transition: 0.5s;
    position: relative;
    font-size: 17px;
    background: #333;
    border: none;
    color: #fff;
    margin-top: 50px;
  }
  
  .evaluate:hover {
    letter-spacing: 0.25em;
    background: #ff1867;
    color: #ff1867;
    -webkit-box-shadow: 0 0 45px #ff1867;
            box-shadow: 0 0 45px #ff1867;
  }
  
  .evaluate::before {
    content: '';
    position: absolute;
    inset: 2px;
    background: #222222;
  }
  
  .evaluate span {
    position: relative;
    z-index: 1;
  }
  
  .evaluate i {
    position: absolute;
    inset: 0;
    display: block;
  }
  
  .evaluate i::before {
    content: '';
    position: absolute;
    border: 2px solid #ff1867;
    width: 7px;
    height: 4px;
    top: -3.5px;
    left: 80%;
    background: #222222;
    -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
            transform: translateX(-50%);
    -webkit-transition: 0.5s;
    transition: 0.5s;
  }
  
  .evaluate:hover i::before {
    width: 20px;
    left: 20%;
  }
  
  .evaluate i::after {
    content: '';
    position: absolute;
    border: 2px solid #ff1867;
    width: 7px;
    height: 4px;
    bottom: -3.5px;
    left: 20%;
    background: #222222;
    -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
            transform: translateX(-50%);
    -webkit-transition: 0.5s;
    transition: 0.5s;
  }
  
  .evaluate:hover i::after {
    width: 20px;
    left: 80%;
  }

  .winner-display {
    position: relative;
    margin-top: 50px;
  }
  
  .winner-display span {
    position: absolute;
    color: #fff;
    transform: translate(-50%, -50%);
    font-size: 38px;
    letter-spacing: 5px;
  }
  
  .winner-display span:nth-child(1) {
    color: transparent;
    -webkit-text-stroke: 0.3px rgb(128, 198, 255);
  }
  
  .winner-display span:nth-child(2) {
    color: rgb(128, 198, 255);
    -webkit-text-stroke: 1px rgb(128, 198, 255);
    animation: uiverse723 3s ease-in-out infinite;
  }
  
  @keyframes uiverse723 {
    0%, 100% {
      clip-path: polygon(0% 45%, 15% 44%, 32% 50%, 
       54% 60%, 70% 61%, 84% 59%, 100% 52%, 100% 100%, 0% 100%);
    }
  
    50% {
      clip-path: polygon(0% 60%, 16% 65%, 34% 66%, 
       51% 62%, 67% 50%, 84% 45%, 100% 46%, 100% 100%, 0% 100%);
    }
  }
  `;

      let ui_html = `
  <div id="display">
  <div class="form">
    <div class="input-group">
      <input required="" type="text" autocomplete="off" class="input" id="option1name" />
      <label class="user-label">Option 1</label>
    </div>
    <p class="vs">vs</p>
    <div class="input-group">
      <input required="" type="text" autocomplete="off" class="input" id="option2name" />
      <label class="user-label">Option 2</label>
    </div>

    <button class="button" id="start-survey">
      <span class="actual-text">&nbsp;Umfrage&nbsp;starten&nbsp;</span>
      <span class="hover-text" aria-hidden="true">&nbsp;Umfrage&nbsp;starten&nbsp;</span>
    </button>
  </div>

  <div class="display">
    <div id="score-option-1"></div>
    <div id="score-option-2"></div>
  </div>
</div>


  `;

      display.innerHTML += '<style>' + ui_css + '</style>';
      display.innerHTML += ui_html;
      this.document.getElementsByTagName('body')[0].appendChild(display);
      document.getElementsByClassName('vidiq-c-lesPJm')[0].remove();

      document.getElementById('start-survey').addEventListener('click', function () {
        let option1 = document.getElementById('option1name').value;
        let option2 = document.getElementById('option2name').value;

        if (option1 && option2) {
          let scoreOption2 = document.getElementById('score-option-2');
          let scoreOption1 = document.getElementById('score-option-1');
          scoreOption1.innerHTML += '<p>Votes for ' + option1 + ' (1 in den chat): <span id="scoreOption1value">0</span></p>';
          scoreOption2.innerHTML += '<p>Votes for ' + option2 + ' (2 in den chat): <span id="scoreOption2value">0</span></p>';
          document.getElementsByClassName('display')[0].innerHTML += '<button class="evaluate"><span>auswerten</span><i></i></button>';
          document.getElementsByClassName('display')[0].innerHTML += `
      <p class="winner-display">
        <span class="winner"></span>
        <span class="winner"></span>
      </p>`;
          document.getElementById('triggerDisplayAndWatcher').addEventListener('click', function () {
            triggerDisplay();
          });
          document.getElementsByClassName('evaluate')[0].addEventListener('click', function () {
            triggerEvaluation();
          });
          triggerWatcher();
        } else {
          console.log('set option names first');
        }
      });
    }

    function triggerEvaluation() {
      let option1 = document.getElementById('option1name').value.replace(' ', '&nbsp;');
      let option2 = document.getElementById('option2name').value.replace(' ', '&nbsp;');
      let winnerDisplays = document.getElementsByClassName('winner');
      if (option1 && option2 && winnerDisplays) {
        let score1 = 0;
        let score2 = 0;
        for (vote in scoreCounter) {
          if (scoreCounter[vote] == '1') {
            score1++;
          } else if (scoreCounter[vote] == '2') {
            score2++;
          }
        }
        if (score1 > score2) {
          for (winner in winnerDisplays) {
            setWinners('Winner:&nbsp;' + option1);
          }
        } else if (score2 > score1) {
          setWinners('Winner:&nbsp;' + option2);
        } else if (score1 == score2) {
          setWinners("No&nbsp;winner.&nbsp;It's&nbsp;a&nbsp;draw");
        }
      }
    }

    function setWinners(winner) {
      let winnerDisplays = document.getElementsByClassName('winner');
      winnerDisplays[0].innerHTML = winner;
      winnerDisplays[1].innerHTML = winner;
    }
  });
