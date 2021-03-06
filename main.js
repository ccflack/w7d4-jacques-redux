$(document).ready(function(){
  load_notes();
});

$(window).on("hashchange", function(){
  fill_modal()
});

var modal_source = $('#modal-template').html()
var modal_template = Handlebars.compile(modal_source)

function fill_modal(){
  if(window.location.hash) {
    if(window.location.hash.match(/#\d+/).length > 0) {
      id = window.location.hash.substring(1);
      $.getJSON('https://desolate-badlands-26376.herokuapp.com/api/notes/' + id)
        .then(function(response){
          console.log(response.note);
          var  display_modal = modal_template(response.note);
          $('#modal').append(display_modal);
          $('#modal_toggle').modal('show');
        });
    }
  }
}

function form_handler(selector){
  clear_alerts();
  clear_form(selector);
}

function clear_alerts(){
  $('#alerts').html('');
}

function clear_form(selector){
  $(selector)[0].reset();
  toggle_loading(selector);
}

function toggle_loading(selector){
  if($(selector + ' input[type=submit]').length > 0){
    $(selector + ' input[type=submit]').replaceWith('<img src="img/loading.gif" class="loading pull-right" />');
  } else {
    $(selector + ' .loading').replaceWith('<input type="submit" name="submit" value="Say it!" class="btn btn-primary pull-right" />');
  }
}

function alert_handler(selector, response){
  response.responseJSON.errors.forEach(function(err){
    $('#alerts').html('');
    $('#alerts').append('<div class="alert alert-danger" role="alert">' + err.error + '</div>');
  })
  toggle_loading(selector);
}

var notes_source = $("#notes-template").html();
var note_template = Handlebars.compile(notes_source);

function load_notes(){
  $.getJSON('https://desolate-badlands-26376.herokuapp.com/api/notes')
  .then(function(response){
    return response.notes.forEach(function(note){
      var display_notes = note_template(note);
      $('#notes').prepend(display_notes);
    });
  });
}

$('#notes').on('click', '.tag', function(ev){
  ev.preventDefault();
  $('#notes').html('');
  $.getJSON('https://desolate-badlands-26376.herokuapp.com/api/notes/tag/' + encodeURIComponent($(this).html()))
  .then(function(response){
    $('#headline').html('')
    $('#headline').append('Notemeister 5000: ' + response.tag.name);
      response.tag.notes.forEach(function(note){
      var display_notes = note_template(note);
      $('#notes').prepend(display_notes);
    });
  });
});

$('#note').on('submit', function(ev){
  ev.preventDefault();
  toggle_loading('#note');
  $.post(
    'https://desolate-badlands-26376.herokuapp.com/api/notes', $(this).serialize()
    ).done(function(response){
      form_handler('#note');
      var display_notes = note_template(response.note);
      $('#notes').prepend(display_notes);
    }).fail(function(response){
      alert_handler('#note', response);
    });
  });
