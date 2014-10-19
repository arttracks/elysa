window.App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

App.ProvenanceController = Ember.ObjectController.extend({
  provenance: "Possibly Mme. J. van Gogh-Bonger, Amsterdam; Possibly Mme. Maria Slavona, Paris; Possibly Paul Cassirer Art Gallery, Berlin; Harry Graf von Kessler, Berlin and Weimar, by 1901 until at least 1929 [1]; Reid and Lefevre Art Gallery, London, by 1939 until at least 1941; E. Bignou Art Gallery, New York, NY; Mr. and Mrs. Marshall Field, New York, NY, by 1939 until at least 1958 [2]; Galerie Beyeler, Basel, Switzerland; purchased by Museum, October 1968. NOTES: 1. probably 1897 to likely Fall 1931. 2. Referenced several times between 1939 and 1958.",
});

App.TimelineController = Ember.ArrayController.extend({
  showExtended: false,
  itemController: 'period',
  actions: {
    toggle_extended: function() {
      var current_state = this.get('showExtended');
      this.set('showExtended',!current_state);
    }
  }
});
App.PeriodController = Ember.ObjectController.extend({
  needs: ['timeline'],
  showExtendedBinding: Ember.Binding.oneWay("controllers.timeline.showExtended")
});


App.TileLayer = EmberLeaflet.TileLayer.extend({
    tileUrl:
      'http://{s}.tiles.mapbox.com/v3' +
      '/{key}/' +
      '{z}/{x}/{y}.png',
    options: {key: 'workergnome.jpfo7j72', styleId: 997}
});

App.ProvenanceMapView = EmberLeaflet.MapView.extend({
  center: L.latLng(40.713282, -74.006978),
  options: {
    zoomControl: false,
    attributionControl: false,
    maxZoom: 4,
    minZoom: 4},
  childLayers: [App.TileLayer]
});

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
  redirect: function() {
    this.transitionTo('period',0);
  },
  model: function() {
    var prov = this.controllerFor('provenance').get('provenance')
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.post('/get_structure', {provenance: prov}).then(function(data){
        resolve(data.period)
      });
    });
  }
});

App.PeriodRoute = Ember.Route.extend({
  model: function(params) {
    return this.modelFor('timeline').objectAt(params.period_id);
  }
})
;
Ember.Handlebars.helper('yes_no', function(val) {
  if ( val === null || val === undefined || val === "") { return ""}
  else if (val)                                      { return "yes"}
  else                                               { return "no"}
});

Ember.Handlebars.helper('possibly', function(val) {
  if(val == null || val == undefined || val == "" || val == true) { return "" }
  return "Possibly";
});

Ember.Handlebars.helper('transfer_type', function(val) {
  if(val) { return ";" }
  return ".";
});
Ember.TEMPLATES['index'] = Ember.Handlebars.compile('{{title}}');
Ember.TEMPLATES['period'] = Ember.Handlebars.compile('<div class="row">  <dl class="dl-horizontal col-md-6">    <dt>Party</dt><dd>{{possibly party_certainty}}{{party}}</dd>    <dt>Birth</dt><dd>{{possibly birth_certainty}}{{birth}}</dd>    <dt>Death</dt><dd>{{possibly death_certainty}}{{death}}</dd>    <dt>Location</dt><dd>{{possibly location_certainty}}{{location}}</dd>    <dt>Stock Number</dt><dd>{{stock_number}}</dd>  </dl>  <dl class="dl-horizontal col-md-6">    <dt>Period Certain?</dt><dd>{{yes_no period_certainty}}</dd>    <dt>Acquisition Method</dt><dd>{{acquisition_method}}</dd>    <dt>Transfer in</dt><dd>{{acquisition_time_span}}</dd>    <dt>Transfer out</dt><dd>{{deacquisition_time_span}}</dd>    <dt>Direct Transfer?</dt><dd>{{yes_no direct_transfer}}</dd>  </dl></div><div class ="row">  <dl class="dl-horizontal col-md-12">    <dt>Footnote</dt><dd>{{footnote}}</dd>   </dl></div><div {{bind-attr class=":row :extended_fields showExtended:visible"}}>  <dl class="dl-horizontal col-md-6">    <dt>Party Certainty</dt><dd>{{party_certainty}}</dd>    <dt>Birth Certainty</dt><dd>{{birth_certainty}}</dd>    <dt>Death Certainty</dt><dd>{{death_certainty}}</dd>    <dt>Location Certainty</dt><dd>{{location_certainty}}</dd>    <dt>Period Certainty</dt><dd>{{period_certainty}}</dd>  </dl>  <dl class="dl-horizontal col-md-6">    <dt>BotB</dt><dd>{{botb}}</dd>    <dt>BotB Certainty</dt><dd>{{botb_certainty}}</dd>    <dt>BotB Precision</dt><dd>{{botb_precision}}</dd>    <dt>EotB</dt><dd>{{eotb}}</dd>    <dt>EotB Certainty</dt><dd>{{eotb_certainty}}</dd>    <dt>EotB Precision</dt><dd>{{eotb_precision}}</dd>    <dt>BotE</dt><dd>{{bote}}</dd>    <dt>BotE Certainty</dt><dd>{{bote_certainty}}</dd>    <dt>BotE Precision</dt><dd>{{bote_precision}}</dd>    <dt>EotE</dt><dd>{{eote}}</dd>    <dt>EotE Certainty</dt><dd>{{eote_certainty}}</dd>    <dt>EotE Precision</dt><dd>{{eote_precision}}</dd>   </dl></div>');
Ember.TEMPLATES['provenance'] = Ember.Handlebars.compile('<div class =\'col-md-8 col-md-offset-2\'>  <form>    <div class=\'form-group\'>      <label for=\'provenance-input\'>Provenance Text:</label>      {{textarea value=provenance class=\'form-control\' rows=8 }}      </div>  </form>  {{#link-to \'timeline\'}}    <button class=\'btn btn-primary\' id =\'submit-provenance\'>Generate Structured Data</button>  {{/link-to}}</div>{{outlet}}');
Ember.TEMPLATES['timeline'] = Ember.Handlebars.compile('<div class="row">  <div class="interface col-md-12">    <div class="btn-toolbar pull-right">      <div class="btn-group btn-group-xs">        <button class="btn btn-info" {{action \'toggle_extended\'}}>         {{#if showExtended}}            Hide Extended Fields         {{else}}            Show Extended Fields         {{/if}}        </button>      </div>    </div>  </div></div><div class="row">  <div class="col-md-3">    <label>Party Records:</label>    <hr>    <ul class="list-unstyled">      {{#each}}        <li>          {{#link-to \'period\' order class=\'provenance_party\'}}          <span  {{bind-attr class=\'parsable::unparsable\'}}>            {{party}}           </span>          {{/link-to}}        </li>      {{/each}}    </ul>  </div>  <div class="col-md-9">    <label>      Details:    </label>    <hr>    {{outlet}}  </div></div><div class="row">  <div class="col-md-12 col-md-offset-0 well">    {{#each}}      {{#link-to \'period\' order class=\'provenance_line\'}}        {{#if parsable}}          {{provenance~}}        {{else}}          <span class=\'provenance_text\'>{{~provenance~}}</span><span class=\'provenance_original_text\'>{{~original_text~}}</span>         {{~/if~}}         {{~transfer_type direct_transfer}}      {{/link-to}}    {{/each}}    <div>    NOTES:        {{#each}}        {{#link-to \'period\' order class=\'provenance_line\'}}          {{footnote}}        {{/link-to}}      {{/each}}    </div>  </div></div><div class="row">  <div class=\'col-md-9\'>    <img src="/images/provenance_visualization_v2.png">  </div>  <div class="col-md-3" id=\'provenance_map\'>    {{view "provenance_map"}}  </div></div><hr><div class="row">  <div class="interface col-md-12">    <div class="btn-toolbar pull-right">      <div class="btn-group">        {{#link-to \'provenance\'}}        <button class="btn btn-warning">Start Over</button>        {{/link-to}}      </div>    </div>  </div></div></div><hr>');





