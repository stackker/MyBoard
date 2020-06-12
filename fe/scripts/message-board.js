
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
    threadID:"",
    parentID:"",
    messageText: getInputValue('messageText'),
    author: 'Anonymous',
    messageDate: todaysDateString()
  }
}

// Asif code:
function getMessageFromReply(parID) {
  console.log(parID,getInputValue('messageText2'))
  return {
    threadID:"",
    parentID:`${parID}`,
    messageText: getInputValue('messageText2'),
    author: 'Anonymous',
    messageDate: todaysDateString()
  }
}

function postButtonPressed() {
  let postedMessage = getMessageFromForm();
  // console.log("PostedMessage:", postedMessage)
  addMessageToPage(postedMessage)
  postMessageToServerAndUpdatePage(postedMessage)
  setInputValue("messageText", "")
  setButtonStatus("messageText","postMessageButton")
  // cleanOutElement("messageText.value")
}

async function replyButtonPosted() {
  let postedMessage2 = getMessageFromReply(event.target.id);
  addMessageToPage(postedMessage2)
  let result = await getIDandPostReply(postedMessage2)
  setInputValue("messageText2", "")
  setButtonStatus("messageText2","replyMessageButton")
  // cleanOutElement("messageText.value")
}

function setButtonStatus(checkId, actionId) {
  // debugger
  if (inputHasSomeText(checkId)) enable(actionId)
  else disable(actionId)
}

// Asif code:
async function replyButtonPressed() {
  //let replyHtml = `<div id="text1"    class="reply">
  // let messageID = `{id:${(event.target.id).slice(2)}}`
  let messageID = (event.target.id).slice(2)
  console.log(`"${messageID}"`)
  let replyMessageID =  "MS" + event.target.id
  // let postReplyMessageID = "PS" +replyMessageID
  // let IDsOfParent = await(getAllID4Message(messageID))
  // console.log("IDofParent:",IDsOfParent);
   let replyHtml = 
   `<div id=${replyMessageID}  class="reply">
      <div id="replyContainer"> Your Reply: </div>
      <textarea id="messageText2" rows="5" columns="80"
      oninput="setButtonStatus('messageText2','${messageID}')"></textarea>
      <div class="entry-form-footer"> 
        <button id= '${messageID}' class = "postReplyButton"
        onclick="replyButtonPosted()"> POST Reply! </button> </div>
      </div>
   </div>`
  appendHtml(replyMessageID, replyHtml)
  setButtonStatus('messageText2', messageID)
  // setButtonStatus('messageText2', `${messageID}`)


  // let repliedMessage = getMessageFromReply();
  // addMessageToPage(repliedMessage)
  // postMessageToServerAndUpdatePage(repliedMessage)
}

//---- server interaction

function getIDandPostReply(message) {
  $.ajax({
    url: '/api/v1//postReply',
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



//>>> Not used---------------
function getAllID4Message(messageID) {
  // $.getJSON('/api/v1/getIDs')
  $.ajax({
    url: '/api/v1/getIDs',
    type: "POST",
    data: JSON.stringify(messageID),
    contentType: "application/json; charset=utf-8",
    success: function () {
      console.log('In post callback')

      // updateMessagesFromServer()
    },
    fail: function (error) {
      // what do we do here?
    }
  })
}
//<<<<Not used---------------

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
  setButtonStatus('messageText', 'postMessageButton')
  // setButtonStatus('messageText2', 'replyMessageButton') // ID not avlb at this time
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
