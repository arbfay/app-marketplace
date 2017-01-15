calcEarning=function(d,n){
  var i=1;
  var m = 43800;

  var w=10;
  if(Reservations.find().fetch().length != 0){
    var lastResDate = Reservations.findOne({},{sort:{lessonDate:-1}}).lessonDate;
    w = (n - lastResDate)/1000/60;
  }

  return Math.round(Math.min(183,((2/3)*d*(1.18^(i-1))*Math.log(m/w))));
};


Template.searchResults.onCreated(()=>{
  var template = Template.instance();

  if(! GoogleMaps.loaded()){
    GoogleMaps.load({key:'AIzaSyCuNWnVv37wxgpCzzPK_tPJdMhbdys_Y64'});
  }

  template.searchLocation = new ReactiveVar({
    type:"Point",
    coordinates:[4.371,50.843],
  },function(elem1,elem2){
    if(elem1.coordinates[1]===elem2.coordinates[1] && elem1.coordinates[0]===elem2.coordinates[0]){
      return true;
    }else {
      return false;
    }
  });

  template.searchLimit = new ReactiveVar(6);
  template.searchResults = new ReactiveVar();
  template.categories = new ReactiveVar(["Yoga","Pilates","Tai Chi"]);

  var address = FlowRouter.getQueryParam('address');
  var coord;

  if(GoogleMaps.loaded()){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address':address}, function(res,status){
      if(status === google.maps.GeocoderStatus.OK){
        coord = res[0].geometry.location;
        template.searchLocation.set({
          type:"Point",
          coordinates : [
            coord.lng(),
            coord.lat()
          ]
        });
      }
      else{
        console.log(status);
      }
    });
  } else{
    console.log("Google Maps not loaded");
  }

  var dateNow = new Date();
  var now = dateNow.getTime() + 2100000;

  template.searchQuery = new ReactiveVar({
    geospatial:
      {$nearSphere: [template.searchLocation.get().coordinates[0],
                     template.searchLocation.get().coordinates[1]]},
    maxAttendeesLeft :
      {$gt : 0},
    date :
      {$gt : now},
    category :
      {$in : ["Yoga","Pilates","Tai Chi"]}
    }, (elem1, elem2)=>{
      if(elem1.category.length === elem2.category.length){
        return true;
      } else{
        return false;
      }
    });

    template.searchOptions = new ReactiveVar({
      sort : {date : 1},
      limit : 6,
      fields : {
        attendeesList:0,
        commission:0
      }
    }, (elem1, elem2)=>{
      if(elem1.limit === elem2.limit){
        return true;
      } else {
        return false;
      }
    });

    template.autorun(()=>{
      template.subscribe("searchLessons", {
                                            geospatial:
                                              {$nearSphere: [template.searchLocation.get().coordinates[0],
                                                             template.searchLocation.get().coordinates[1]]},
                                            maxAttendeesLeft :
                                              {$gt : 0},
                                            date :
                                              {$gt : now},
                                            category :
                                              {$in : template.categories.get()}
                                          },
                                          {
                                            sort : {date : 1},
                                            limit : template.searchLimit.get(),
                                            fields : {
                                              attendeesList:0,
                                              commission:0
                                            }
                                          },
                                          ()=>{
                                            Meteor.setTimeout(()=>{

                                            }, 300);
                                          });
    });

    GoogleMaps.ready('map', function(map) {
      var res = template.searchResults.get();
      var marker;

      for(var i = 0; i < res.length; i++) {

          var infowindow=new google.maps.InfoWindow();

          marker = new google.maps.Marker({
              position: new google.maps.LatLng(res[i].geospatial.coordinates[1],
                                              res[i].geospatial.coordinates[0]),
              map: map.instance,
              title : res[i].title,
              icon : 'http://res.cloudinary.com/trys/image/upload/v1479832863/loc_marker_v1axu1.png',

          });
          var content = '<div><strong>' + res[i].title + '</strong></div>'+
                                '<div>'+ res[i].price+' €</div>' +
                                '<a href="/class/'+ res[i]._id +'" class="btn-flat">Voir</a>';

          google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
              return function() {
                  infowindow.setContent(content);
                  infowindow.open(map,marker);
              };
          })(marker,content,infowindow));

      }

    });


});

Template.searchResults.helpers({
  results : function(){
    var template = Template.instance();
    var lessons = Lessons.find().fetch();
    var titles = [];

    function filtreTitles (element){
      if(titles.indexOf(element.title)<0){
        titles.push(element.title);
        return true;
      } else{
        return false;
      }
    }

    if(Meteor.userId()){
      Meteor.subscribe('myReservations',Meteor.userId(),function(err,res){
        if(err){
          console.log('Problème avec reservations: ',err);
        }
      });
    }

    var filteredLessons = lessons.filter(filtreTitles);
    template.searchResults.set(filteredLessons);
    console.log(filteredLessons);
    return filteredLessons;
  },
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      var template = Template.instance();
      var l = template.searchLocation.get();
      return {
        center: new google.maps.LatLng(l.coordinates[1], l.coordinates[0]),
        zoom: 13,
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
  },
});

Template.lessonsResults.helpers({
  results : function(){
    Session.setDefault("filterCategory",["Yoga", "Pilates", "Tai Chi"]);

    var cat = Session.get("filterCategory");

    var lessonsAll = Lessons.find({category : {$in : cat}}).fetch();
    var titles = new ReactiveVar([]);

    function filtreTitles (element){
      var tit = titles.get();

      if(tit.indexOf(element.title)==-1){
        tit.push(element.title);
        titles.set(tit);
        return true;
      } else{
        return false;
      }
    }

    var filteredLessons = lessonsAll.filter(filtreTitles);

    Session.set('searchResults', filteredLessons);
    console.log(filteredLessons);
    return filteredLessons;
  },
});

Template.lessonCard.helpers({
  earning:function(){
    var duration = parseInt(this.duration);
    var lessonDate = this.date;
    return calcEarning(duration,lessonDate);
  }
});

Template.searchResults.events({
  "click .showMore" : function(event,template){
    event.preventDefault();
    var currentLimit=template.searchLimit.get();
    template.searchLimit.set(currentLimit+6);

  },
  "click #categoryYoga" : (event,template) =>{
    var s = template.categories.get();
    var i = s.indexOf("Yoga");
    if(i < 0){
      s.push("Yoga");
      template.categories.set(s);
      document.getElementById("categoryYoga").checked = true;;
    } else {
      s.splice(i, 1);
      template.categories.set(s);
      document.getElementById("categoryYoga").checked = false;
    }

  },
  "click #categoryPilates" : (event,template) =>{

    var s = template.categories.get();
    var i = s.indexOf("Pilates");
    if(i < 0){
      s.push("Pilates");
      template.categories.set(s);
      document.getElementById("categoryPilates").checked = true;;
    } else {
      s.splice(i, 1);
      template.categories.set(s);
      document.getElementById("categoryPilates").checked = false;
    }

  },
  "click #categoryTaiChi" : (event,template) =>{

    var s = template.categories.get();
    var i = s.indexOf("Tai Chi");
    if(i < 0){
      s.push("Tai Chi");
      template.categories.set(s);
      document.getElementById("categoryTaiChi").checked = true;;
    } else {
      s.splice(i, 1);
      template.categories.set(s);
      document.getElementById("categoryTaiChi").checked = false;
    }
  },
});
