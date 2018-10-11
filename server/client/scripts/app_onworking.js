$(document).ready(() => {   //  document ready???   A page can't be manipulated safely until the document is "ready.
  $('#username').val(prompt('What is your name??'))
  const url = 'http://localhost:3000/classes/messages'//'http://52.78.213.9:3000'
  app = {
    server: `${url}/messages`,
    username: 'anonymous',
    roomname: 'lobby',
    lastMessageId: 0,
    friend: {},
    message: [],
  }

  app.init = () => {
    $('#send').on('click', app.handleSubmit)
    $('#chats').on('click', '.username', app.handleUsernameClick)
    $('#roomSelect').on('click', app.handleRoomChange)


    app.startSpinner()
    app.fetch(false)

    setInterval(() => {
      app.fetch(true)
    }, 3000)
  }

  app.handleSubmit = (message) => {
    let initmsg = {
      username: 'anonymous',
      roomname: 'lobby',
      text: 'text'
    }
    message = message || initmsg
    app.send(message)
  }


  app.send = (input) => {
    app.startSpinner()
    $.ajax({
      url: app.server,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(input),
      success: () => {
        $('#message').val('')
        app.fetch()
      },
      error: () => {
        console.error('send error')
      }
    })
  }

  app.fetch = () => $.ajax({
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: (data) => {
      data.forEach(function (item) {
        app.renderMessage(item)
      })
      console.log(data)

    }
  })


  app.clearMessages = () => {
    $('#chats').empty()
  }
  app.renderMessage = (item) => {
    const $p = $(`<p>${item.username} : ${item.text} (${item.roomname}) @ ${item.date} </p>`)
    $('#chats').prepend($p)
  }
  app.renderRoom = (room) => {
    $('#roomSelect').append($(`<div>${room}</div>`))
  }

  app.init()
})
