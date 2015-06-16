// on ready, hide the form and get events
$(document).ready(function() {
  var events = [];
  var index;
  var theForm = document.getElementById( 'theForm' );
  $('#formSection').hide();
  $('.final-button').hide();
  $.ajax({
    url: "https://api.pogoseat.com/v0/venue/by-alias/giants/events/upcoming",
    statusCode: {
      404: function() {
        console.log('error 404');
      }
    }
  })
  .done(function( data ) {
    console.log( "data:", data);
    events = data;
    localStorage.setItem('events', JSON.stringify(data));
    setEvents(data);
  });
}); // on ready end


// click handler for button
function buttonLoader(e) {
  e.preventDefault();
  e.stopPropagation();
  $('#gridSectionH2').hide(500, function() {
    $('#gridSection').hide(400, function() {
      $('#formSection').show(300);
    }); // end hide grid section
  }); // end hide grid section h2
  e.target.classList.add('loading');
  e.target.setAttribute('disabled','disabled');

  setTimeout(function(){
    // index of selected element from data array.
    var index = $(e.target).parent().parent()[0].id;

    //set this as global to retrieve from the form
    window.eventDataIndex = index;

    $('button').css('background-color', 'transparent');
    var events = JSON.parse(localStorage.getItem('events'));
    console.log(events);
    var event = events[index];
    $('#event-info').text("You selected: "
      + event.event_title
      + " ("
        + event.location_name
        + ")");
      },900); // end set timeout
    }; // end of click event function


// create nodes for each event and put them on the DOM
function setEvents(data) {
  console.log(data.length);
  for (var i=0; i<data.length; i++) {
    if (!data[i].color_pallet.c1) {
      data[i].color_pallet.c1 = 'rgb(247, 124, 51)';
    }
    //create list element, append to grid container
    $( "<li id='" + i + "'>" ).appendTo($('.cbp-ig-grid'));
    // create element, append inside list element
    $("<a href='#' id='a"+i+"' style='color:'" + data[i].color_pallet.c1 +"'>").appendTo($('#' + i));

    // if away team logo isn't there, use home team logo
    if (data[i].away_team_logo) {
      $("<img src=https://cdn.pogoseat.com" + data[i].away_team_logo + ">").appendTo($('#a' + i));
    } else {
      $("<img src=https://cdn.pogoseat.com" + data[i].home_team_logo + ">").appendTo($('#a' + i));
    }
    $("<h3 class='cbp-ig-title changeColor'>" + data[i].event_title + "</h3>").appendTo($('#a' + i));
    $("<p>" + data[i].timeTillLive + " @ " + data[i].location_name+ "</p>").appendTo($('#a' + i));
    $("<span class='cbp-ig-category'> </span>").appendTo($('#a' + i));
    $("<button id='' label='Select' style='color:white;background-color:" + data[i].color_pallet.c1 +"'> Select </button>").appendTo($('#a' + i));
    $('a').on('click', 'button', buttonLoader);

    $('.cbp-ig-title:before').css('background', data[i].color_pallet.c1);

    $("a").hover(function(){
      $('h3').css("color", data[0].color_pallet.c1);
      $('p').css("color", data[0].color_pallet.c1);
    })

  } // end loop
} // end setEvents



// instantiate new form
new stepsForm( theForm, {
  onSubmit : function( form ) {
    // hide form
    $('.simform-inner').hide();
    //classie.addClass( theForm.querySelector( '.simform-inner' ), 'hide' );
    var events = JSON.parse(localStorage.getItem('events'));
    var event_id = events[window.eventDataIndex].event_id;

    // form values
    var name = $('#q1').val();
    var email = $('#q3').val();
    var phone = $('#q2').val();
    if (!email) { email = " "; }
    if (!phone) { phone = " "; }
    var data = {
      event_id: event_id,
      name: name,
      email: email || " ",
      phone: phone || " "
    }

    // Make POST request
    var url = 'https://join.pogoseat.com/frontend/submission';
    $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: success,
      error: error
    });

    function error(d) {
      $( '.final-message' ).HTML = 'Uh oh, there was an error, please fill out the form again.';
      messageEl.innerHTML =
      classie.addClass( messageEl, 'show' );
      // reload page to reset the form.
      setTimeout(function() {
        location.reload();
      },3000);
    }

    // success callback
    function success(d) {
      var messageEl = theForm.querySelector( '.final-message' );

      if (d.type == 'success' || d.status == 'success') {
        messageEl.innerHTML = 'You will start receiving updates immediately!';
      } else {
        messageEl.innerHTML = 'Uh oh, there was an error, please fill out the form again.';
      }

      // show final message
      classie.addClass( messageEl, 'show' );

      // reload page to reset the form.
      setTimeout(function() {
        location.reload();
      },3000);

    }
  }
});
