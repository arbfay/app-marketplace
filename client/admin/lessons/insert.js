
Template.insertLessonByAdmin.events({
  "submit form": function(event){
     event.preventDefault();
     var t=event.target;

     var title=t.title.value;
     var shortDesc=t.shortDesc.value;
     var longDesc = t.longDesc.value;
     var duration = t.duration.value;
     var category = t.category.value;
     var coachEmail = t.userEmail.value;
     var address = t.address.value;
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

     var loc = "";
     GoogleMaps.load({key:'AIzaSyCuNWnVv37wxgpCzzPK_tPJdMhbdys_Y64'});
     if(GoogleMaps.loaded()){

         loc = {
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
               Session.set('loc',loc);
             } else {
               console.log("Problem with the geocoder : " + status);
             }
           });
     } else {
       console.log("error with GoogleMaps");
     }

     maxAttendees= parseInt(maxAttendees);

     var l = Session.get('loc');
     var toInsert={
       imgUrl:imgUrl,
       title:title,
       shortDesc:shortDesc,
       longDesc:longDesc,
       duration:duration,
       category:category,
       coachEmail:coachEmail,
       address:address,
       geospatial:l,
       maxAttendeesLeft:maxAttendees,
       price:price,
       commission:commission,
       date:dateInMilli,
       attendeesList:attendeesList,
       createdAt: new Date(),
       updatedAt: new Date(),
     };

     Meteor.call("insertLessonByAdmin", toInsert, (err,res)=>{
      if(res){
        Materialize.toast('Cours enregistré avec succès !', 4000,'rounded');
      } else {
        Materialize.toast("Erreur lors de l'insertion: "+err, 4000,'rounded');
      }
     });


     t.maxAttendees='';
     t.price.value='';
     t.date.value='';
     t.time.value='';

  }
});
