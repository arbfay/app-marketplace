/*
Template.searchResults.onCreated(function() {
  var self = this;
  self.autorun(function(){
    var cat = FlowRouter.getQueryParam('category');
    self.subscribe('matchingLessons',cat);
  });
});
*/

Template.map.onCreated(function() {
  GoogleMaps.ready('map', function(map) {
    var res = Session.get('searchResults');

    for(var i = 0; i < res.length; i++) {

        marker = new google.maps.Marker({
       position: new google.maps.LatLng(res[i].geospatial.coordinates[1],
                                        res[i].geospatial.coordinates[0]),
       map: map.instance
      });
      console.log(marker);
    }

  });
});


Template.map.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      var l = Session.get('searchedLoc');
      return {
        center: new google.maps.LatLng(l.coordinates[1], l.coordinates[0]),
        zoom: 14
      };
    }
  }
});




Template.searchResults.helpers({
  results : function(){
    var address =FlowRouter.getQueryParam('address');
    //We transform the address we get into coordinates
    var resultats={};

    GoogleMaps.load({key:'AIzaSyCuNWnVv37wxgpCzzPK_tPJdMhbdys_Y64'});
    if(GoogleMaps.loaded()){
        var coord;
        var loc = {
          type:"place",
          coordinates:[
            4.371,
            50.843
          ]
        };
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function(results, status){
          if(status == google.maps.GeocoderStatus.OK){
              coord=results[0].geometry.location;
              loc = {
                type:"place",
                coordinates:[
                  coord.lng(),
                  coord.lat()
                ]
              };
              Session.set('searchedLoc', loc);
            } else {
              console.log("Problem with the geocoder : " + status);
            }
          });
          //We look for the lessons near the searched location
          var r={};
          Meteor.call('geoNear',loc, (err, res) => {
            if(res){
              r=res;
              Session.set('searchResults', r);
            } else {
              console.log(err);
            }
          });

    }
    else {
      var dateSearch= new Date();
      var daysToAdd = 14;

      dateSearch.setDate(dateSearch.getDate() + daysToAdd);

      //
      r2=Lessons.find({date: { $lt: dateSearch}}).fetch();
      Session.set('searchResults',r2);
    }
    return Session.get('searchResults');
  },

});
