
function cleanOutElement(id) {
  $('#' + id).html('')
}

function appendHtml(id, htmlToAdd) {
  $('#' + id).append(htmlToAdd)
}

function setInputValue(id, newValue) {
  return $('#' + id).val(newValue)
}

function getInputValue(id) {
  return $('#' + id).val()
}

function hide(id) {
  $('#' + id).hide()
}

function show(id) {
  $('#' + id).show()
}

function disable(id) {
  $('#' + id).prop("disabled", true)
}

function enable(id) {
  $('#' + id).prop("disabled", false)
}

function inputHasSomeText(id) {
  return (getInputValue(id)) !== ''
  // return $(trim(getInputValue(id))) !== ''
}

function todaysDateString() {
  return new Date().toISOString().substring(0, 10)
}

// getting and setting messages on the page
exampleMessage = { messageText: "Hi, this is a test message 0", author: "Tony Enerson", messageDate: "2020-05-19" }

function addMessageToPage(message) {
  replyID = "RP" + message._id;
  messID= "MS" + replyID;
  let messageHtml =
    `<div class="message">${message._id}, ${message.messageText}
    <div class="buttonss" id =${replyID} onclick="replyButtonPressed()" >REPLY</div>
    <div id =${messID}></div>
    <div class="message-footer">${message.author}: ${message.messageDate}</div>
    </div>`
  appendHtml('messagesArea', messageHtml)
}

function updatePageMessages(messages) {
  cleanOutElement('messagesArea')
  messages.forEach(function (message) {
    addMessageToPage(message)
  })
}

function getMessageFromForm() {
  return {
    messageText: getInputValue('messageText'),
    author: 'Anonymous',
    messageDate: todaysDateString()
  }
}

// Asif code:
function getMessageFromReply() {
  return {
    messageText: getInputValue('reply'),
    author: 'Anonymous',
    messageDate: todaysDateString()
  }
}


function postButtonPressed() {
  let postedMessage = getMessageFromForm();
  addMessageToPage(postedMessage)
  postMessageToServerAndUpdatePage(postedMessage)
  setInputValue("messageText", "")
  // cleanOutElement("messageText.value")

}

function setButtonStatus(checkId, actionId) {
  if (inputHasSomeText(checkId)) enable(actionId)
  else disable(actionId)

}

// Asif code:
function replyButtonPressed() {
  //debugger
 
  //let replyHtml = `<div id="text1"    class="reply">
  let replyMessageID =  "MS" + event.target.id
  let replyHtml = `<div id=${replyMessageID}  class="reply">
  <div> Your Reply: </div>
  <textarea id="messageText" rows="5" columns="80"
  oninput="setButtonStatus('messageText','postMessageButton')"></textarea>
  <div class="entry-form-footer"> 
    <button id="replyMessageButton"
    onclick="postButtonPressed()"> POST Reply! </button> </div>
</div>
</div>`
  appendHtml(replyMessageID, replyHtml)

  // let repliedMessage = getMessageFromReply();
  // addMessageToPage(repliedMessage)
  // postMessageToServerAndUpdatePage(repliedMessage)
}

//---- server interaction
function postMessageToServerAndUpdatePage(message) {
  $.ajax({
    url: '/api/v1/addPost',
    type: "POST",
    data: JSON.stringify(message),
    contentType: "application/json; charset=utf-8",
    success: function () {
      console.log('In post callback')
      updateMessagesFromServer()
    },
    fail: function (error) {
      // what do we do here?
    }
  })
}

function updateMessagesFromServer() {
  $.getJSON('/api/v1/posts')
    .done(function (messages) {
      updatePageMessages(messages)
    })
    .fail(function (error) {
      // what do we do here????
    })
}

$(document).ready(function () {
  setButtonStatus("messageText", "postMessageButton")
  updateMessagesFromServer()
})

// some test data lying around
testMessages = [
  { messageText: "Hi, this is a test message 0", author: "Tony Enerson", messageDate: "2020-05-19" },
  { messageText: "Hi, this is a test message 1", author: "Chris Desmarais", messageDate: "2020-05-20" },
  { messageText: "Hi, this is a test message 2", author: "Sheldon Manabat", messageDate: "2020-05-20" },
  { messageText: "Hi, this is a test message 3", author: "Tony Enerson", messageDate: "2020-05-21" },
  { messageText: "Hi, this is a test message 4", author: "Tony Enerson", messageDate: "2020-05-22" }
]