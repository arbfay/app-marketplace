


Template.lessonMap.onCreated(function() {

  GoogleMaps.ready('lessonMap', function(map) {
    var res = Session.get('lesson');
    var geospatial = res.geospatial;
    var coord = geospatial.coordinates;

    var marker = new google.maps.Marker({
            position: new google.maps.LatLng(coord[1],
                                            coord[0]),
            map: map.instance,
            title : res.title,
            icon : 'http://res.cloudinary.com/trys/image/upload/v1479832863/loc_marker_v1axu1.png'
      });
    var contentString = '<div><strong>' + res.title + '</strong></div>'+
                        '<a href="/class/'+ res._id +'" class="btn-flat"> Voir </a>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

  });
});

Template.lessonMap.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      var lesson = Lessons.findOne();
      var geo = lesson.geospatial;
      return {
        center: new google.maps.LatLng(geo.coordinates[1], geo.coordinates[0]),
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


Template.lessonPage.helpers({
  title: function(){

    var now = new Date();
    var dateNow = now.getTime() + 2100000;

    var id = FlowRouter.getParam('lessonId');
    Meteor.subscribe('matchingLessonsByFirstId', id, dateNow);
    Session.set("lesson",Lessons.findOne(id));


    var lesson = Session.get("lesson");
    var coachEmail = lesson.coachEmail;
    Meteor.subscribe('matchingCoachByMail', coachEmail);
    var coach = Coaches.findOne();
    Session.set("coach", coach);

    var coachId = coach._id;
    Meteor.subscribe('matchingUserProfileByCoachId', coachId);
    Session.set("coachProfile", UserProfiles.findOne({email:coachEmail}));

    if(Meteor.userId()){
      Meteor.subscribe('myReservations',Meteor.userId(),function(err,res){
        if(err){
          console.log('Problème avec reservations: ',err);
        }
      });
    }

    //Initialisation du reservationCard
    var lessons = Lessons.find().fetch();
    var lesson = lessons[0];
    var dateInMilli=lesson.date;
    var mom = moment(dateInMilli);
    var selection = {date: mom.date(),
                     day: mom.format("ddd"),
                     month:mom.format("MMM"),
                     hour:mom.format("HH:mm"),
                     duration:lesson.duration,
                     price:lesson.price,
                     select:0,
                   };

    Session.set('selectedDate', selection);

    $('#date1').addClass('active');
    $('#date2').removeClass('active');
    $('#date3').removeClass('active');
    //fin de l'initialisation du reservationCard


    var lessonId = FlowRouter.getParam('lessonId');
    var lesson = Lessons.findOne(lessonId);
    if (lesson){
      return lesson.title;
    } else {
      return "";
    }
  },
  imgUrl : function(){
    var lesson = Session.get("lesson");
    return lesson.imgUrl;
  },
  longDesc: function(){
    var lessonId = FlowRouter.getParam('lessonId');
    var lesson = Lessons.findOne({_id:lessonId});
    if (lesson){
      return lesson.longDesc;
    } else {
      return "";
    }
  },
  address: function(){
    var lessonId = FlowRouter.getParam('lessonId');
    var lesson = Lessons.findOne({_id:lessonId});
    if (lesson){
      return lesson.address;
    } else {
      return "";
    }
  },
  coachName : function(){
    var prof = Session.get("coachProfile");
    return ""+prof.firstName+" "+prof.lastName;
  },
  coachShortDesc : function(){
    var coach = Coaches.findOne();
    return coach.description;
  },
  coachImgUrl : function(){
    var coach = Coaches.findOne();
    return coach.imgUrl;
  },
  date1 : function(){
    var lessons = Lessons.find().fetch();
    var lesson = lessons[0];
    var dateInMilli=lesson.date;
    var mom = moment(dateInMilli);
    var selection = {date: mom.date(),
                     day: mom.format("ddd"),
                     month:mom.format("MMM"),
                     duration:lesson.duration,
                     price:lesson.price,
                   };
    return selection;
  },
  date2 : function() {
    var lessons = Lessons.find().fetch();
    var lesson = lessons[1];
    var dateInMilli=lesson.date;
    var mom = moment(dateInMilli);
    var selection = {date: mom.date(),
                     day: mom.format("ddd"),
                     month:mom.format("MMM"),
                     duration:lesson.duration,
                     price:lesson.price,
                   };
    return selection;
  },
  date3 : function(){
    var lessons = Lessons.find().fetch();
    var lesson = lessons[2];
    var dateInMilli=lesson.date;
    var mom = moment(dateInMilli);
    var selection = {date: mom.date(),
                     day: mom.format("ddd"),
                     month:mom.format("MMM"),
                     duration:lesson.duration,
                     price:lesson.price,
                   };
    return selection;
  },
  earning:function(){
    var lessonId = FlowRouter.getParam('lessonId');
    var lesson = Lessons.findOne(lessonId);
    var duration = parseInt(lesson.duration);
    var lessonDate = lesson.date;
    return calcEarning(duration,lessonDate);
  }
});



Template.lessonPage.events({
  "click #date1" : function(event){
    event.preventDefault();

    var lessons = Lessons.find().fetch();
    var lesson = lessons[0];
    var dateInMilli=lesson.date;
    var mom = moment(dateInMilli);
    var selection = {date: mom.date(),
                     day: mom.format("ddd"),
                     month:mom.format("MMM"),
                     hour:mom.format("HH:mm"),
                     duration:lesson.duration,
                     price:lesson.price,
                     select:0,
                   };

    Session.set('selectedDate', selection);

    $('#date1').addClass('active');
    $('#date2').removeClass('active');
    $('#date3').removeClass('active');
  },
  "click #date2" : function(event){
    event.preventDefault();

    var lessons = Lessons.find().fetch();
    var lesson = lessons[1];
    var dateInMilli=lesson.date;
    var mom = moment(dateInMilli);
    var selection = {date: mom.date(),
                     day: mom.format("ddd"),
                     month:mom.format("MMM"),
                     hour:mom.format("HH:mm"),
                     duration:lesson.duration,
                     price:lesson.price,
                     select:1,
                   };

    Session.set('selectedDate', selection);

    $('#date1').removeClass('active');
    $('#date2').addClass('active');
    $('#date3').removeClass('active');

  },
  "click #date3" : function(event){
    event.preventDefault();

    var lessons = Lessons.find().fetch();
    var lesson = lessons[2];
    var dateInMilli=lesson.date;
    var mom = moment(dateInMilli);
    var selection = {date: mom.date(),
                     day: mom.format("ddd"),
                     month:mom.format("MMM"),
                     hour:mom.format("HH:mm"),
                     duration:lesson.duration,
                     price:lesson.price,
                     select:2,
                   };

    Session.set('selectedDate', selection);

    $('#date1').removeClass('active');
    $('#date2').removeClass('active');
    $('#date3').addClass('active');
  },

});

Template.reservationCard.helpers({
  price : function(){
    var selection= Session.get("selectedDate");

    return selection.price;
  },
  date : function(){
    var selection= Session.get("selectedDate");

    return selection.date;
  },
  day : function(){
    var selection= Session.get("selectedDate");

    return selection.day;
  },
  month : function(){
    var selection= Session.get("selectedDate");

    return selection.month;
  },
  hour : function(){
    var selection= Session.get("selectedDate");

    return selection.hour;
  },
  duration:function(){
    var selection = Session.get("selectedDate");
    return selection.duration;
  }
});
