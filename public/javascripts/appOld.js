var app = app || {};
var active = active || {};

app.Model = Backbone.Model.extend({
  initialize: function() {
    console.log('A model was dynamically generated');
  }
});

// mongodb support
// override the model's idAttribute to '_id'
Backbone.Model.idAttribute = "_id";

app.Collection = Backbone.Collection.extend({
  model: app.Model,
  initialize: function(apiUrl, graphTitle) {
    this.title = graphTitle;
    this.url = apiUrl;
    var self = this;
    console.log('Crimes have been committed!');
    this.on('change', function() {
      console.log('Collection changed.');
      var view = new app.CollectionView(
        {collection: self}
      );
    });
    this.on('sync', function() {
      console.log('Collection synced.');
      var view = new app.CollectionView(
        {collection: self}
      );
    });
    this.fetch();
  },
});

app.CollectionView = Backbone.View.extend({
  initialize: function() {
    console.log('CollectionView start.');
    this.render();
  },
  render: function() {
    console.log('CollectionView render go.');
    var models = this.collection.models;

    graphIt(models);
  }
});

// ---------------
// Times have the dashes removed before joining the url. I wrote this after my
// url parser in the routes. I suppose I could take out both this function and the
// dash injecting code in the other one, but it's just fine.
// ---------------

function timeLord (something) {
  var newStageOne = '';
  for (var i = 0; i < something.length; i++) {
    if (something[i] == '-') {
      newStageOne = newStageOne + '';
    }
    else {
      newStageOne = newStageOne + something[i];
    };
  };
  var newStageTwo = newStageOne.substr(4,2) + newStageOne.substr(6,2) + newStageOne.substr(0,4);
  return newStageTwo;
};

// ---------------
// Takes out spaces and puts dashes, because spaces are taboo.
// ---------------

function parseToUrlString (something) {
  var newString = '';
  for (var i = 0; i < something.length; i++) {
    if (something[i] == ' ') {
      newString = newString + '-';
    }
    else {
      newString = newString + something[i];
    };
  };
  return newString;
};

$(document).ready(function () {
  console.log('Crimes!');

  // Elements to get values from and to watch.
  var pType = document.getElementById("primary_type");
  var sDate = document.getElementById('start_date');
  var eDate = document.getElementById('end_date');
  var submit = document.getElementById('submit');

  // Backbone collection created by search parameters on submit.
  submit.onclick = function () {
    var selected_sDate = parseToUrlString(timeLord(sDate.value));
    var selected_eDate = parseToUrlString(timeLord(eDate.value));
    var selected_pType = parseToUrlString(pType.value);
    var url = '/api?primary=' + selected_pType + '&start=' + selected_sDate + '&end=' + selected_eDate;
    console.log(url);

    active.Collection = new app.Collection(url, selected_pType.toUpperCase());
  };

  // ---------------
  // Removes the graph from view. For some reason, the graph values persist when
  // you try to graph something else, so everything just piles on to the same
  // graph. Still need to find a solution to this problem.
  // ---------------

  var clear = document.getElementById('clear');
  clear.onclick = function () {
    var chart_box = document.getElementById('chart_div');
    while (chart_box.firstChild) {
      chart_box.removeChild(chart_box.firstChild);
    }
  };
});
