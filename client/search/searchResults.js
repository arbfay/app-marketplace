
Template.lessonsResults.onCreated(function() {
  var self = this;
  GoogleMaps.load({key:'AIzaSyCuNWnVv37wxgpCzzPK_tPJdMhbdys_Y64'});
  self.autorun(function() {
    var address =FlowRouter.getQueryParam('address');
    var r = "";
    var ready = GoogleMaps.loaded();


    if(ready){
        var coord;
        var loc = {
          type:"Point",
          coordinates:[
            4.371,
            50.843
          ]
        };
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function(results, status){
          if(status === google.maps.GeocoderStatus.OK){
              coord=results[0].geometry.location;
              lat = coord.lat();
              lng = coord.lng();
              loc = {
                type:"Point",
                coordinates:[
                  lng,
                  lat
                ]
              };
              Session.set('searchedLoc', loc);
            } else {
              console.log("Problem with the geocoder : " + status);
            }
          });
    } else {
      console.log("error with GoogleMaps : " + ready);
    }

    var limit = Session.get('searchLimit');
    const handle = self.subscribe('nearLessons', Session.get('searchedLoc'), limit);
  });
});

Template.map.onCreated(function() {
  GoogleMaps.ready('map', function(map) {
    var res = Session.get('searchResults');

    for(var i = 0; i < res.length; i++) {

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(res[i].geospatial.coordinates[1],
                                            res[i].geospatial.coordinates[0]),
            map: map.instance,
            title : res[i].title,
            icon : 'http://res.cloudinary.com/trys/image/upload/v1479832863/loc_marker_v1axu1.png'
                                      });
        var contentString = '<div><strong>' + res[i].title + '</strong></div>'+
                            '<div>'+ res[i].price+' €</div>' +
                            '<a href="/class/'+ res[i]._id +'" class="btn-flat"> Voir </a>';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
    }

  });
});

Template.searchResults.onCreated(function(){
  GoogleMaps.load({key:'AIzaSyCuNWnVv37wxgpCzzPK_tPJdMhbdys_Y64'});
  Session.set("searchLimit", 6);
});

Template.map.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      Session.setDefault('searchedLoc', {type:"place",coordinates:[4.371, 50.843]});

      var l = Session.get('searchedLoc');
      return {
        center: new google.maps.LatLng(l.coordinates[1], l.coordinates[0]),
        zoom: 14,
        styles : [
          {"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},
          {"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},
          {"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},
          {"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},
          {"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},
          {"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}
        ],
      };
    }
  }
});

Template.lessonsResults.helpers({
  results : function(){
    Session.setDefault("filterCategory",["Yoga", "Pilates", "Tai Chi"]);

    var cat = Session.get("filterCategory");

    Session.set('searchResults',  Lessons.find({category : {$in : cat}}).fetch());
    return Lessons.find({category : {$in : cat}}).fetch();
  },
});


Template.searchResults.events({
  "click .showMore" : function(event){
    event.preventDefault();

    Session.setDefault("searchLimit", 6);
    var s = Session.get("searchLimit");
    Session.set("searchLimit", s + 6);
  }
});

Template.filterCategory.events({
  "click #categoryYoga" : (event) =>{

    var s = Session.get("filterCategory");
    var i = s.indexOf("Yoga");
    if(i < 0){
      s.push("Yoga");
      Session.set("filterCategory",s);
      document.getElementById("categoryYoga").checked = true;
    } else {
      s.splice(i, 1);
      Session.set("filterCategory",s);
      document.getElementById("categoryYoga").checked = false;
    }
  },
  "click #categoryPilates" : (event) =>{

    var s = Session.get("filterCategory");
    var i = s.indexOf("Pilates");
    if(i < 0){
      s.push("Pilates");
      Session.set("filterCategory",s);
      document.getElementById("categoryPilates").checked = true;
    } else {
      s.splice(i, 1);
      Session.set("filterCategory",s);
      document.getElementById("categoryPilates").checked = false;
    }
  },
  "click #categoryTaiChi" : (event) =>{

    var s = Session.get("filterCategory");
    var i = s.indexOf("Tai Chi");
    if(i < 0){
      s.push("Tai Chi");
      Session.set("filterCategory",s);
      document.getElementById("categoryTaiChi").checked = true;;
    } else {
      s.splice(i, 1);
      Session.set("filterCategory",s);
      document.getElementById("categoryTaiChi").checked = false;
    }
  },
});
