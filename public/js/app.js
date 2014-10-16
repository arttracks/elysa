(function() {
  var handleProvenanceDetail, handleProvenanceSubmission, startOver, toggleExtendedFields;

  handleProvenanceSubmission = function(e) {
    var prov, structure_call;
    e.preventDefault();
    prov = $('#provenance-input').val();
    structure_call = $.post('/get_structure', {
      provenance: prov
    });
    return structure_call.done(function(val) {
      window.CurrentProvenance = val;
      $('#full_results').show();
      $('#enter_data').hide();
      $('#prov').html(val.provenance);
      $('#provenance-results').html(window.HandlebarsTemplates["period_index"](val));
      $('#results').html("");
      return $('#record_0').trigger('click');
    });
  };

  handleProvenanceDetail = function(e) {
    var record_num;
    e.preventDefault();
    $('.provenance_party').removeClass("selected");
    $(this).addClass("selected");
    record_num = $(this).attr("id").replace("record_", "");
    console.log(window.CurrentProvenance.period[record_num]);
    return $('#results').html(window.HandlebarsTemplates["period"](window.CurrentProvenance.period[record_num]));
  };

  toggleExtendedFields = function(e) {
    e.preventDefault();
    return $('.extended_fields').toggle();
  };

  startOver = function(e) {
    e.preventDefault();
    $('#provenance-input').val("");
    $('#full_results').hide();
    return $('#enter_data').show();
  };

  $(document).on("click", "#submit-provenance", handleProvenanceSubmission);

  $(document).on("click", '.provenance_party', handleProvenanceDetail);

  $(document).on("click", '#show_extended_fields', toggleExtendedFields);

  $(document).on("click", '#start_over', startOver);

  Handlebars.registerHelper('yes_no', function(val) {
    if (val === null || val === void 0 || val === "") {
      return "";
    }
    if (val) {
      return "yes";
    } else {
      return "no";
    }
  });

  Handlebars.registerHelper('possibly', function(val) {
    if (val === null || val === void 0 || val === "" || val === true) {
      return "";
    }
    return "Possibly ";
  });

  Handlebars.registerHelper('problem', function(val) {
    if (val) {
      return "";
    } else {
      return "problem";
    }
  });

}).call(this);
