/*
Template.searchResults.onCreated(function() {
  var self = this;
  self.autorun(function(){
    var cat = FlowRouter.getQueryParam('category');
    self.subscribe('matchingLessons',cat);
  });
});
*/


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
            } else {
              console.log("Problem with the geocoder : " + status);
            }
          });
          //We look for the lessons near the searched location

          var res = Meteor.call('geoNear',loc);
          console.log(res);
    }
    else {
      var dateSearch= new Date();
      var daysToAdd = 14;
      dateSearch.setDate(dateSearch.getDate() + daysToAdd);

      resultats=Lessons.find({date: { $lt: dateSearch}});
      return resultats;
    }

    return resultats;
  },

});
