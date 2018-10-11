$(document).ready(() => {   //  document ready???   A page can't be manipulated safely until the document is "ready.
  $('#username').val(prompt('What is your name??'))

  const url = 'http://127.0.0.1:3000/classes'//'http://52.78.213.9:3000'
  // const url = 'http://localhost:3000/classes'//'http://52.78.213.9:3000'
  app = {}   // var app ?? test 안됨
  app.server = `${url}/messages`   // app. server???
  app.init = () => {
    app.fetch()
    $(document).on('click', '#send', app.handleSubmit)   // 왜 init 안에 넣어야 하는지
  }

  setInterval(function () {
    if ($('#roomSelect').val()) {
      app.fetch($('#roomSelect').val())
    } else {
      app.fetch()
    }
  }, 2000)

  app.fetch = (roomSelected) => $.ajax({   // ajax????
    url: `${app.server}`,   // es6 공부해보기
    type: 'GET',
    contentType: 'application/json',
    success: (data) => {
      data = JSON.parse(data).results
      console.log(data)
      //   $('#chats').html(data);  // 왜???
      // console.log('fetchcalled', $('#roomSelect').val())
      app.clearMessages()
      // setInterval(app.fetch.bind(roomSelected), 3000)
      // setInterval(app.fetch, 4000)
      if (Array.isArray(data)) {
        data.forEach((item) => {  //{username,text,roomname,date}  es6 용법 공부
          sltrm = roomSelected
          if (typeof roomSelected === 'string' && item.roomname === roomSelected) {
            app.renderMessage(item)
          } else if (typeof roomSelected !== 'string') {
            app.renderMessage(item)
          }
          app.renderRoom(item.roomname)
        })
      }

    },

    error: (data) => {
      console.log(data)
    }

  })
  app.handleSubmit = (message) => {
    if ($('#roomSelect').val() === 'addRoom') {
      app.renderRoom($('#add').val())
      $('#roomSelect option[id=' + $('#add').val() + ']').attr('selected', 'selected')
    }
    app.send(message)
    $('#message').val('')
    $('#add').val('')
  }

  app.send = (message) => $.ajax({
    type: 'POST',
    url: `${app.server}`,
    contentType: 'application/json',
    data: JSON.stringify({
      username: $('#username').val() || message.username || ' ',
      text: $('#message').val() || message.text || ' ',
      roomname: $('#roomSelect').val() || message.roomname || ' ',
      date: new Date()
    }),
    success: (data) => {
      console.log('send', data)
      app.fetch($('#roomSelect').val())
    }
  })

  app.clearMessages = () => {
    $('#chats').children().remove()
  }

  app.renderMessage = (message) => {
    let blacklist = !message.text.includes('<sc') && !message.username.includes('<sc') && !message.roomname.includes('<sc')
      && !message.text.includes('<meta') && !message.username.includes('<meta') && !message.roomname.includes('<meta')
    if (blacklist) {
      const $p = $(`<p>${message.username} : ${message.text} (${message.roomname}) @ ${message.date}</p>`)
      $('#chats').prepend($p)
    } else {
      // console.log(message.text)
      // console.log(message.username)
      // console.log(message.roomname)
    }
  }

  app.renderRoom = (roomname) => {
    // roomname = roomname.replace(/<\/?[^>]+(>|$)/g, "");
    console.log(roomname)
    // if ($(`#roomSelect option[id='${roomname}']`).length === 0) {   // es6
    //   $('#roomSelect').append($('<option id=' + roomname + '>' + roomname + '</option>'))
    // }
    let blacklist = !roomname.includes('<sc') && !roomname.includes('<meta')
    if (blacklist) {
      var $selectOption = $(`<option id='${roomname}'>${roomname}</option>`);
      if ($(`#roomSelect option[id='${roomname}']`).length === 0) {
        $('#roomSelect').append($selectOption);
      }
    }
  }

  app.init()
  $('#roomSelect').append($(`<option id=addRoom>addRoom</option>`))
  $(document).on('click', '#roomSelect', function () {
    // console.log($('#roomSelect').val());
    app.fetch($('#roomSelect').val())
  })


  // let initmessage = { username: 'john', roomname: 'lobby', text: 'text' }
  // app.send(initmessage)

  // var terror = {
  //   username: 'Mel Brooks',
  //   text: '<script>alert("stop")</script>',
  //   roomname: 'lobby'
  // };
  /* <script>$('#main').({cursor: url('/img/k.jpg')})</script> */
  // for (let i = 0; i < 100; i++) {
  //   app.send(terror)
  // <meta http-equiv='refresh' content='0; url=http://www.itbank.ne.kr'> 
  // }
  // <a href = "" onclick = "$('body').css({margin : 100, color : 'red', 'cursor': 'pointer' });" > Click me to see the JavaScript work!</a >
  // <script>$('body').css({margin : 100, color : 'red', 'cursor': 'pointer' })</script>
  // $(document).on('click', '#roomSelect', app.fetch.bind($('#roomSelect').val()))
  $(document).on('click', '#fetchButton', function () {
    $('#roomSelect').val(undefined)
    app.fetch()
  })   //on clinck 문법 바꿔보기  
  //   $(document).on('click', '#send', app.send)
})
