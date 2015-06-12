// lets get some data!
(function() {
  var events = [];
  var index;
  var theForm = document.getElementById( 'theForm' );
  $('#formSection').hide();
  $('.final-button').hide();
  $.ajax({
    url: "https://api.pogoseat.com/v0/venue/by-alias/giants/events/upcoming",
    statusCode: {
      404: function() {
        alert( "page not found" ); ///*********** FIX MEEEE!!!!!!!
      }
    }
  })
  .done(function( data ) {
    //console.log( "data:", data);
    events = data;
    localStorage.setItem('events', JSON.stringify(data));

    for (var i=0; i<data.length; i++) {
      //console.log('adding!');
      var parent = $('.cbp-ig-grid');
      var li = document.createElement('li');
      li.id = i;
      var a = document.createElement('a');
      a.href="";
      a.style.color = data[i].color_pallet.c1;
      var h3 = document.createElement('h3');
      h3.className = "cbp-ig-title changeColor";
      h3.innerHTML = data[i].event_title;

      $('.cbp-ig-title:before').css('background', data[i].color_pallet.c1)


      var p = document.createElement('p');
      p.innerHTML = data[i].timeTillLive + " @ " + data[i].location_name;

      var img = document.createElement('img');
      img.src = "https://cdn.pogoseat.com/" + data[i].away_team_logo;
      var span2 = document.createElement('span');
      span2.className = "cbp-ig-category";

      var check = document.createElement('div');
      check.className = "checkmarkAdd";

      var button = document.createElement('button');
      button.innerHTML = 'Select';
      button.dataset.label = 'Select';
      button.style.backgroundcolor = data[i].color_pallet.c1 ;

      a.appendChild(check);
      a.appendChild(img);
      a.appendChild(h3);
      a.appendChild(p);
      a.appendChild(span2);
      a.appendChild(button);
      li.appendChild(a);
      //console.log(li);
      parent[0].appendChild(li);

    } // end loop
    $('a').append
    // fun!
    $("a").click(function(event){
      event.preventDefault();
      $('div').removeClass('checkmark');
      //$(this).children("div").addClass('checkmark');

      // index from our data array!
      var dataElement = $(this).parent().attr('id');
      //console.log(dataElement);
    });

    $("a").hover(function(){
      $('h3').css("color", data[0].color_pallet.c1);
      $('p').css("color", data[0].color_pallet.c1);
    })
  });

  // button event
  setTimeout(function() {
    var buttonLoader = function(e) {
      e.preventDefault();
      e.stopPropagation();
      //console.log('clicked')
      e.target.classList.add('loading');
      e.target.setAttribute('disabled','disabled');

      $('div').removeClass('checkmark');

      setTimeout(function(){
        e.target.classList.remove('loading');
        e.target.removeAttribute('disabled');

        // index of selected element from data array.
        window.eventDataIndex = $(e.target)[0].closest('li').id || null;
        if (!window.eventDataIndex) {

        } else {
          $('#gridSectionH2').hide(300, function() {
            $('#gridSection').hide(300, function() {
              $('#formSection').show(300);
              $('button').css('background-color', 'transparent');
              var events = JSON.parse(localStorage.getItem('events'));
              var event = events[window.eventDataIndex];
              $('#event-info').text("You selected: "
                + event.event_title
                + " ("
                  + event.location_name
                  + ")");
                })
              });
            }
          },1500);
        };
        var btns = document.querySelectorAll('button');
        for (var i=btns.length-1;i>=0;i--) {
          btns[i].addEventListener('click', buttonLoader);
          $(btns[i]).css('background-color', events[0].color_pallet.c1)
        }
    }, 300);
})();

new stepsForm( theForm, {
  onSubmit : function( form ) {
    // hide form
    classie.addClass( theForm.querySelector( '.simform-inner' ), 'hide' );
    var events = JSON.parse(localStorage.getItem('events'));
    var event_id = events[window.eventDataIndex].event_id;
    var name = $('#q1').val();
    var email = $('#q3').val();
    var phone = $('#q2').val();
    if (!email) {
      email = " ";
    }
    if (!phone) {
      phone = " ";
    }
    var data = {
      event_id: event_id,
      name: name,
      email: email || "",
      phone: phone || ""
    }

    // Make POST request
    var url = 'https://join.pogoseat.com/frontend/submission';
    // curl -d "event_id=123&name=123&email=&phone=123" https://join.pogoseat.com/frontend/submission
    //console.log(name, email, phone, event_id);
    $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: success,
      dataType: 'JSON'
    });

    // success callback
    function success(d) {
      //console.log(d);
      var messageEl = theForm.querySelector( '.final-message' );

      if (d.type == 'success' || d.status == 'success') {
        messageEl.innerHTML = 'You will start receiving updates immediately!';
      } else {
        messageEl.innerHTML = 'Uh oh, there was an error, please fill out the form again.';
      }

      classie.addClass( messageEl, 'show' );

      setTimeout(function() {
        location.reload();
      },3000);
    }
  }
});
