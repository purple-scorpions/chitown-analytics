var activeCollection = [];
var tallyObj = {};
var graphable = [];
var sorted = [];

document.onreadystatechange = function () {
  if (document.readyState == "interactive") {

    draw(sorted);
    var chart = $('#chart_div').highcharts();

    grabProperty('description','hiddenPrimaryCrime','description option:selected');
    grabProperty('type','hiddenSubcrime','type option:selected');
    grabProperty('startDate','hiddenTimeStart','startDate');
    grabProperty('endDate','hiddenTimeEnd','endDate');

    function grabProperty(idToWatch, idToGet, idToGive) {
      $('#'+idToWatch).on('change', function() {
        $('#'+idToGet).prop('value', $('#'+idToGive).val());
      });
    };

    console.log('Hello, Chicago.');

    // Elements to get values from and to watch.
    var pType = document.getElementById("primary_type");
    var sDate = document.getElementById('start_date');
    var eDate = document.getElementById('end_date');
    var submit = document.getElementById('submit');
    var clear = document.getElementById('clear');

    // Backbone collection created by search parameters on submit.
    submit.onclick = function () {
      console.log('submit clicked.');
      var selected_sDate = parseToUrlString(timeLord(sDate.value));
      var selected_eDate = parseToUrlString(timeLord(eDate.value));
      var selected_pType = parseToUrlString(pType.value);
      var tempUrl = '/api?primary=' + selected_pType + '&start=' + selected_sDate + '&end=' + selected_eDate;

      // Revving up a new collection for use.
      var fuckBackbone = {
        type: 'get',
        url: tempUrl,
        success: function(data) {
          console.log(data);
          activeCollection = data;
          tallyObj = {};
          tally(activeCollection);
          convertObjToArray(tallyObj);
          sortGraphable(graphable);
          draw(sorted);
          populateMap();
          cards();
        },
        error: function() {
          console.log('ajax error.');
        }
      };
      $.ajax(fuckBackbone);
    };

    clear.onclick = function() {
      $('#chart_div').highcharts().destroy();
    };
  };
};

function tally(collection_thing) {
  for (var i = 0; i < collection_thing.length; i++) {
    if (tallyObj.hasOwnProperty(collection_thing[i].date.substr(0,10)) === false) {
      tallyObj[collection_thing[i].date.substr(0,10)] = 1;
    }
    else {
      tallyObj[collection_thing[i].date.substr(0,10)] += 1;
    };
  };
  console.log(tallyObj);
};

function convertObjToArray(tallied) {
  for (var key in tallied) {
    if (tallied.hasOwnProperty(key)) {
      console.log(key, tallied[key]);
      graphable.push([timeLord2(key), tallied[key]]);
    };
  };
  console.log('graphable: ', graphable);
};

function timeLord2 (something) {
  var newStageOne = '';
  for (var i = 0; i < something.length; i++) {
    if (something[i] == '-') {
      newStageOne = newStageOne + '/';
    }
    else {
      newStageOne = newStageOne + something[i];
    };
  };
  return newStageOne;
};

function sortGraphable(graphable_array) {
  while (graphable_array.length > 0) {
    var latest = new Date(graphable_array[0][0]).getTime();
    var latest_index = 0;
    for (var i = 0; i < graphable_array.length; i++) {
      var current = new Date(graphable_array[i][0]).getTime();
      if (current > latest) {
        latest = current;
        latest_index = i;
      };
    };
    sorted.unshift(graphable_array[latest_index]);
    graphable_array.splice(latest_index, 1);
  };
  console.log(sorted);
};

function cards() {
  var caseNum = document.getElementById('csnm');
  var primtyp = document.getElementById('crm');
  var day = document.getElementById('dt');
  var loc = document.getElementById('lctn');
  var subType = document.getElementById('crmsbtyp');
  var descr = document.getElementById('aic_description');

  var timer = setInterval(function() {
    var rndm = parseInt(Math.random() * (activeCollection.length - 1));
    console.log(rndm);
    caseNum.innerText = activeCollection[rndm].case_number;
    primtyp.innerText = activeCollection[rndm].primary_type;
    day.innerText = activeCollection[rndm].date;
    loc.innerText = activeCollection[rndm].block;
    subType.innerText = 'IUCR: ' + activeCollection[rndm].iucr;
    descr.innerText = activeCollection[rndm].description;
  }, 5000);
};

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

function draw (our_data) {
  console.log(our_data);
    $('#chart_div').highcharts({
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Crime Incidences of This Type over the Given Period: ' + sorted.length + '.'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'date'
        },
        yAxis: {
            title: {
                text: 'Incidents'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: 'Incidents',
            data: our_data
        }]
    });
};

function initMap() {
  // var myOptions = {
  //   zoom: 4,
  //   center: new google.maps.LatLng(41.836944,92.315278)
  // };
  // var map = new google.maps.Map(document.getElementById('map'), myOptions);
};

function populateMap() {
  var myOptions = {
    zoom: 10,
    center: new google.maps.LatLng(41.881832, -87.623177)
  };
  var map = new google.maps.Map(document.getElementById('map'), myOptions);

  for (var i = 0; i < activeCollection.length; i++) {
    var myLatLng = {lat: parseFloat(activeCollection[i].latitude), lng: parseFloat(activeCollection[i].longitude)};
    console.log(myLatLng);
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: activeCollection[i].primary_type + ', ' + activeCollection[i].description + ', ' + activeCollection[i].block + ', ' + activeCollection[i].date + '.',
      icon: '/images/ic_directions_run_black_24px.svg'
    });
  };
};
