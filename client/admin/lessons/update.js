Template.updateLessonByAdmin.events({
  "submit form": function(event){
     event.preventDefault();
     var t=event.target;
     var lessonId = FlowRouter.getParam('id');

     var title=t.title.value;
     var shortDesc=t.shortDesc.value;
     var longDesc = t.longDesc.value;
     var duration = t.duration.value;
     var category = t.category.value;
     var coachEmail = t.userEmail.value;
     var address = t.address.value;
     var instructions = t.instructions.value;
     var maxAttendees = t.maxAttendees.value;
     var price=t.price.value;
     var date = t.date.value;
     var time = t.time.value;
     var imgUrl = t.imgUrl.value;

     var attendeesList = "";

     //Date in milliseconds since 1st january 1970
     var d = new Date(date+" "+time);
     var dateInMilli = d.getTime();

     //Pricing
     var commission=2.0;
     if(category ==="Tai Chi"){
       commission=1.5;
       if(price >= 10.0 && price < 15.0){
         commission+= price*0.05;
       } else if (price >= 15.0){
         commission+= price*0.08;
       }
     } else {
       if(price >= 12.0 && price < 16.0){
         commission+= price*0.05;
       } else if (price >= 16.0){
         commission+= price*0.08;
       }
     }

     var coord;
     var lat=50.843;
     var lng=4.371;

     var loc = {
       type:"Point",
       coordinates:[
         4.371,
         50.843
       ]
     };

     GoogleMaps.load({key:'AIzaSyCuNWnVv37wxgpCzzPK_tPJdMhbdys_Y64'});
     if(GoogleMaps.loaded()){

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
               Session.set('loc',loc);
             } else {
               console.log("Problem with the geocoder : " + status);
             }
           });
     } else {
       console.log("error with GoogleMaps");
     }

     maxAttendees= parseInt(maxAttendees);

     Session.setDefault("loc", loc);
     var l = Session.get('loc');

     var toUpdate={
       imgUrl:imgUrl,
       title:title,
       shortDesc:shortDesc,
       longDesc:longDesc,
       duration:duration,
       category:category,
       coachEmail:coachEmail,
       address:address,
       instructions:instructions,
       geospatial:l,
       maxAttendeesLeft:maxAttendees,
       price:price,
       commission:commission,
       date:dateInMilli,
       attendeesList:attendeesList,
       updatedAt: new Date(),
     };

     Meteor.call("updateLessonByAdmin",lessonId, toUpdate, (err,res)=>{
      if(res){
        Materialize.toast('Cours mis à jour avec succès !', 4000,'rounded');
      } else {
        Materialize.toast("Erreur lors de la modification: "+err, 4000,'rounded');
      }
     });

  }
});

Template.updateLessonByAdmin.helpers({
  lesson : function(){
    var id = FlowRouter.getParam("id");
    Meteor.subscribe("matchingLesson", id);
    return Lessons.findOne({_id:id});
  },
  title : function(){
    return this.title;
  },
  shortDesc : function(){
    return this.shortDesc;
  },
  longDesc : function(){
    return this.longDesc;
  },
  coachEmail : function(){
    return this.coachEmail
  },
  address : function(){
    return this.address;
  },
  instructions : function(){
    return this.instructions;
  },
  maxAttendeesLeft : function(){
    return this.maxAttendeesLeft;
  },
  price : function(){
    return this.price;
  },
  duration : function(){
    return this.duration;
  },
  dateDay : function(){
    var mom = moment(this.date);
    return mom.format("YYYY-MM-DD");
  },
  dateTime : function(){
    var mom = moment(this.date);
    return mom.format("HH:MM");
  },
  imgUrl : function(){
    return this.imgUrl;
  },
});

Template.findLessonByAdmin.events({
  "submit form" : function(event){
    event.preventDefault();

    var id = event.target.lessonId.value;
    var path='/admin/lessons/update/'+id;
    FlowRouter.go(path);
  },
})
