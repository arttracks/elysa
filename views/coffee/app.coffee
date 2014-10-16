handleProvenanceSubmission = (e) ->
  e.preventDefault()
  prov= $('#provenance-input').val()
  structure_call = $.post('/get_structure', {provenance: prov})  
  structure_call.done (val)->
    window.CurrentProvenance = val
    $('#full_results').show()
    $('#enter_data').hide()
    $('#prov').html val.provenance
    $('#provenance-results').html window.HandlebarsTemplates["period_index"](val)
    $('#results').html ""
    $('#record_0').trigger 'click'

handleProvenanceDetail = (e) ->
  e.preventDefault()
  $('.provenance_party').removeClass("selected")
  $(this).addClass("selected")
  record_num =  $(this).attr("id").replace("record_","")
  console.log window.CurrentProvenance.period[record_num]
  $('#results').html window.HandlebarsTemplates["period"] window.CurrentProvenance.period[record_num]

toggleExtendedFields = (e) ->
  e.preventDefault()
  $('.extended_fields').toggle()

startOver = (e) ->
  e.preventDefault()
  $('#provenance-input').val("")
  $('#full_results').hide()
  $('#enter_data').show()


$(document).on "click", "#submit-provenance", handleProvenanceSubmission
$(document).on "click", '.provenance_party', handleProvenanceDetail
$(document).on "click", '#show_extended_fields', toggleExtendedFields
$(document).on "click", '#start_over', startOver


Handlebars.registerHelper 'yes_no', (val) ->
  return "" if val == null || val == undefined || val == ""
  if val then  "yes" else "no" 

Handlebars.registerHelper 'possibly', (val) ->
  return "" if val == null || val == undefined || val == "" || val == true
  "Possibly "

Handlebars.registerHelper 'problem', (val) ->
  if val then "" else  "problem"