window.App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

App.ProvenanceController = Ember.ObjectController.extend({
  provenance: "Possibly Mme. J. van Gogh-Bonger, Amsterdam; Possibly Mme. Maria Slavona, Paris; Possibly Paul Cassirer Art Gallery, Berlin; Harry Graf von Kessler, Berlin and Weimar, by 1901 until at least 1929 [1]; Reid and Lefevre Art Gallery, London, by 1939 until at least 1941; E. Bignou Art Gallery, New York, NY; Mr. and Mrs. Marshall Field, New York, NY, by 1939 until at least 1958 [2]; Galerie Beyeler, Basel, Switzerland; purchased by Museum, October 1968. NOTES: 1. probably 1897 to likely Fall 1931. 2. Referenced several times between 1939 and 1958.",
});

App.TimelineController = Ember.ArrayController.extend({});
App.PeriodController = Ember.ObjectController.extend({});

// App.Timeline = DS.Model.extend({
//   party        : DS.attr(),
//   order        : DS.attr(),
//   location     : DS.attr(),
//   birth        : DS.attr(),
//   death        : DS.attr(),
//   stock_number : DS.attr(),
//   parsable:
// });
App.Router.map(function() {
  this.resource("provenance");
  this.resource("timeline", function() {
    this.resource("period", { path: '/:period_id' });      
  });
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('provenance');
  }
});

App.ProvenanceRoute = Ember.Route.extend({})

App.TimelineRoute = Ember.Route.extend({
  model: function() {
    var prov = this.controllerFor('provenance').get('provenance')
    return Ember.$.post('/get_structure', {provenance: prov}).then(function(data){
      return data.period;
    });
  }
});

App.PeriodRoute = Ember.Route.extend({
  model: function(params) {
    return this.controllerFor('timeline').objectAt(params.period_id);
  }
})
;
Ember.TEMPLATES['index'] = Ember.Handlebars.compile('{{title}}');
Ember.TEMPLATES['period'] = Ember.Handlebars.compile('location: {{location}}');
Ember.TEMPLATES['provenance'] = Ember.Handlebars.compile('<div id=\'enter_data\' {{bind-attr class=":row hidden"}} >  <div class =\'col-md-8 col-md-offset-2\'>    <form>      <div class=\'form-group\'>        <label for=\'provenance-input\'>Provenance Text:</label>        {{textarea value=provenance class=\'form-control\' rows=8 }}        </div>    </form>    {{#link-to \'timeline\'}}      <button class=\'btn btn-primary\' id =\'submit-provenance\'> Generate Structured Data</button>    {{/link-to}}  </div></div>{{outlet}}');
Ember.TEMPLATES['timeline'] = Ember.Handlebars.compile('<ul class="list-unstyled">  {{#each}}    <li>      {{#link-to \'period\' order}}      <span  {{bind-attr class=\'parsable\'}}>        {{party}}       </span>      {{/link-to}}    </li>  {{/each}}</ul>{{outlet}}');




