var ogMeta = function(description, url, title, img) {
  $('meta[property^="og:"]').remove();
  $('<meta>', {
    property: 'og:type',
    content: 'article'
  }).appendTo('head');
  $('<meta>', {
    property: 'og:site_name',
    content: location.hostname
  }).appendTo('head');
  $('<meta>', {
    property: 'og:url',
    content: url
  }).appendTo('head');
  $('<meta>', {
    property: 'og:title',
    content: title
  }).appendTo('head');
  $('<meta>', {
    property: 'og:description',
    content: description
  }).appendTo('head');
  $('<meta>', {
    property: 'og:image',
    content: img
  }).appendTo('head');
};

/*var twitterMeta = function(author,url,title,imgUrl){
  $('meta[property^="twitter:"]').remove();
  $('<meta>', {
    property: 'twitter:card',
    content: 'summary'
  }).appendTo('head');
  if (author) {
    $('<meta>', {
      property: 'twitter:creator',
      content: author
    }).appendTo('head');
  }

  $('<meta>', {
    property: 'twitter:url',
    content: location.origin + location.pathname
  }).appendTo('head');
  $('<meta>', {
    property: 'twitter:title',
    content: "" + title
  }).appendTo('head');

  $('<meta>', {
    property: 'twitter:description',
    content: description
  }).appendTo('head');
  $('<meta>', {
    property: 'twitter:image',
    content: img
  }).appendTo('head');
}*/


Template.lessonMap.onRendered(function() {
  GoogleMaps.ready('lessonMap', function(map) {
    var res = Lessons.findOne();
    if(res)
      {var geospatial = res.geospatial;
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
      });}
  });

});

Template.lessonMap.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      var lesson = Lessons.findOne();
      var geo = lesson.geospatial;
      return {
        center: new google.maps.LatLng(geo.coordinates[1], geo.coordinates[0]),
        zoom: 12,
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

Template.lessonPage.onRendered(function(){
      var now = new Date();
      var dateNow = now.getTime() + 600000; //Heure de maintenant + 10 minutes
      var id = FlowRouter.getParam('lessonId');

      const h1 = Meteor.subscribe('matchingLessonsByFirstId', id, dateNow);
      var lesson = Lessons.findOne(id);

      const h2 = Meteor.subscribe('matchingCoachByMail', lesson.coachEmail);
      const h3 = Meteor.subscribe('userProfileByMail', lesson.coachEmail);

      Session.set("coachProfile", UserProfiles.findOne({email:lesson.coachEmail}));

      if(Meteor.userId()){
        Meteor.subscribe('myReservations',Meteor.userId(),function(err,res){
          if(err){
            console.log('Problème avec reservations: ',err);
          }
        });
      }
  });

Template.lessonPage.helpers({
  lesson : function(){
    var template = Template.instance();
    var lessonId = FlowRouter.getParam('lessonId');
    var lesson = Lessons.findOne(lessonId);
    template.selectedLesson = new ReactiveVar(lesson);
    ogMeta(lesson.shortDesc,$(location).attr('href'), lesson.title, lesson.imgUrl);
    return lesson;
  },
  currentUrl : function(){
    return $(location).attr('href');
  },
  coach : function(){
    var coachEmail = this.coachEmail;
    var coach = Coaches.findOne({email : coachEmail});
    var coachProfile = UserProfiles.findOne({email : coachEmail});
    var url = coach.imgUrl;
    if(!url){
      url = "https://res.cloudinary.com/trys/image/upload/q_80/v1483720491/Coaches/blank-profile-picture.png";
    }
    return {
      coachName : coachProfile.firstName+" "+coachProfile.lastName,
      description:coach.description,
      coachImgUrl:url
    };
  },
  level : function(){
    var l = this.level;
    var res="?";
    switch(l){
      case "Beginner" : res="Débutant"; break;
      case "Intermediate" : res="Intermédiaire"; break;
      case "Advanced" : res="Avancé"; break;
      case "All" : res="Tous niveaux"; break;
    }
    return res;
  },
  longDesc : function(){
    if(this.longDesc ===""){
      return this.shortDesc;
    } else {
      return this.longDesc;
    }
  },
  facility : function(){
    if(this.facilities){
      var f = this.facilities;
      var str = "";

      for(var i=0; i<f.length ; i++){
        str += ", "+facilityTranslation(f[i]);
      }
      str = str.slice(1,str.length);
      return str;
    } else {
      return 'Aucune';
    }
  },
  preparation : function(){
    if(this.preparation){
      return this.preparation;
    } else {
      return "Aucune indication.";
    }
  },
  nextDates : function(){
    var lessons = Lessons.find().fetch();
    var limit = 3;
    var res = [];
    for(var i =0;i<limit;i++){
      var dateInMilli=lessons[i].date;
      var mom = moment(dateInMilli);
      res.push({dateForHuman : mom.format("ddd DD MMM"),
                timeForHuman : mom.format("HH:mm"),
                thisDuration:lessons[i].duration,
                thisPrice:lessons[i].price,
                id:lessons[i]._id
              });
    }
    return res;
  },
  selectedDate : function(){
    var template = Template.instance();
    var selection = template.selectedLesson.get();
    var dateInMilli=selection.date;
    var mom = moment(dateInMilli);
    return {
                date : mom.format("ddd DD MMM"),
                time : mom.format("HH:mm"),
                duration:selection.duration,
                price:selection.price,
                id:selection._id,
                earning : calcEarning(selection.duration,selection.date),
              };
  }
});

Template.lessonPage.events({
  'click .nextDate' : function(event,template){
    event.preventDefault();
    template.selectedLesson.set(Lessons.findOne(this.id));
  },
  "click #reservation" : (event,template)=>{
    event.preventDefault();
    var lesson = template.selectedLesson.get()
    var userId = Meteor.userId();

    if(!userId){
      Session.set('reservationLogin',FlowRouter.getParam("lessonId"));
      FlowRouter.go('/signup');
    }
      var userMail = Accounts.user().emails[0].address;

      var lessonId = lesson._id;
      var coachEmail= lesson.coachEmail;

      if(lesson && userId && userMail){
        var toInsert = {
          userId:userId,
          userEmail :userMail,
          lessonId : lessonId,
          lessonTitle:lesson.title,
          lessonDate:lesson.date,
          coachEmail : coachEmail,
          isComplete:false,
          isPaid:false,
          createdAt : new Date(),
          updatedAt : new Date(),
        };
        Meteor.call('insertReservation', toInsert, function(err,res){
          if(err){
            Materialize.toast("Erreur lors de l'insertion d'une réservation",4000,'rounded');
          } else{
            FlowRouter.go('/class/:lessonId/:reservationId',{lessonId:lessonId,
                                                            reservationId:res},{});
          }
        });
      }
  },
});

var facilityTranslation = function(word){
  return word;
}
