
/*
$('input#commission').val(parseFloat(
  function(index, value) {
    var rowPrice = $('input#price').val();
    var price= parseFloat(rowPrice);
    var commission=1.0;

    if(price < 12.0 ){
      commission = 0.2*price;
    } else if (price < 20.0) {
      commission=0.25*price;
    }else {
      commission=0.3*price;
    }

    return commission;
}));
*/


Template.insertLessonByAdmin.events({
  "submit form": function(event){
     event.preventDefault();
     var t=event.target;

     var title=t.title.value;
     var shortDesc=t.shortDesc.value;
     var longDesc = t.longDesc.value;
     var category = t.category.value;
     var coachEmail = t.userEmail.value;
     var address = t.address.value;
     var maxAttendees = t.maxAttendees.value;
     var price=t.price.value;
     var date = t.date.value;
     var time = t.time.value;
     var imgUrl = t.imgUrl.value;
     var attendeesList = AttendeesList.insert({reservations:[],users:[]});

     //Pricing
     var commission=2.0;
     if(price<12.0){
       commission=price*0.2;
     } else if (price < 16.0) {
       commission=price*0.25;
     } else {
       commission=price*0.28;
     }

     var coord;
     var lat=50.843;
     var lng=4.371;
     GoogleMaps.load({key:'AIzaSyCuNWnVv37wxgpCzzPK_tPJdMhbdys_Y64'});

     if(GoogleMaps.loaded()){
             var geocoder = new google.maps.Geocoder();
             geocoder.geocode({'address': address}, function(resultats, status){
                   if(status == google.maps.GeocoderStatus.OK){
                     coord=resultats[0].geometry.location;
                     lat = coord.lat();
                     lng = coord.lng();
                   } else {
                     console.log("Problem with the geocoder : " + status);
                   }
            });

     } else {
       Materialize.toast("Error with GoogleMaps Geocoding", 4000, 'rounded');
     }

     maxAttendees= parseInt(maxAttendees);




     var toInsert={
       imgUrl:imgUrl,
       title:title,
       shortDesc:shortDesc,
       longDesc:longDesc,
       category:category,
       coachEmail:coachEmail,
       address:address,
       geospatial:{
         type:"place",
         coordinates:[
           lng,
           lat
         ]
       },
       maxAttendeesLeft:maxAttendees,
       price:price,
       commission:commission,
       date:date,
       time:time,
       attendeesList:attendeesList,
       createdAt: new Date(),
       updatedAt: new Date(),
     };

     console.log(toInsert);

     Lessons.insert(toInsert);

     t.title.value = '';
     t.shortDesc.value='';
     t.longDesc.value='';
     t.category.value='';
     t.userEmail.value='';
     t.address.value='';
     t.maxAttendees='';
     t.price.value='';
     t.commission.value='';
     t.date.value='';
     t.time.value='';

     FlowRouter.go('/');
  }
});
