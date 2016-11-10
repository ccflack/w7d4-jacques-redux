function clear_form(selector){
  $(selector)[0].reset();
  toggle_submit(selector)
}

var notes_source   = $("#notes-template").html()
var note_template = Handlebars.compile(notes_source)

$.getJSON('https://desolate-badlands-26376.herokuapp.com/api/notes')
.then(function(response){
  return response.notes.forEach(function(note){
    var display_notes = note_template(note)
    $('#notes').prepend(display_notes)
  })
})

$('#note_form').on('submit', function(ev){
  ev.preventDefault()
  $.post('https://desolate-badlands-26376.herokuapp.com/api/notes',
    $(this).serializeArray()
  ).done(function(response){
    handle_user_forms(response, '#note_form')
  }).fail(function(response){
    handle_errors('#note_form', response)
  })
})
