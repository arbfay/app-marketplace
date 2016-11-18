var userId = Meteor.userId();

Template.profileEditingCard.helpers({
  firstName: function(){

    if(Accounts.user()){
      var userMail = Accounts.user().emails[0].address;
    } else{
      return "";
    }
    var userProfile = UserProfiles.findOne({email:userMail});

    if(userProfile){
      return userProfile.firstName;
    } else{
      return "";
    }
  },
  lastName: function(){
    if(Accounts.user()){
      var userMail = Accounts.user().emails[0].address;
    } else{
      return "";
    }

    var userProfile = UserProfiles.findOne({email:userMail});

    if(userProfile){
      return userProfile.lastName;
    } else{
      return "";
    }
  },
  street: function(){
    if(Accounts.user()){
      var userMail = Accounts.user().emails[0].address;
    } else{
      return "";
    }
    var userProfile = UserProfiles.findOne({email:userMail});

    if(userProfile){
      return userProfile.address.street;
    } else{
      return "";
    }
  },
  city: function(){
    if(Accounts.user()){
      var userMail = Accounts.user().emails[0].address;
    } else{
      return "";
    }
    var userProfile = UserProfiles.findOne({email:userMail});

    if(userProfile){
      return userProfile.address.city;
    } else{
      return "";
    }
  },
  zip: function(){
    if(Accounts.user()){
      var userMail = Accounts.user().emails[0].address;
    } else{
      return "";
    }
    var userProfile = UserProfiles.findOne({email:userMail});

    if(userProfile){
      return userProfile.address.zip;
    } else{
      return "";
    }
  },
});


Template.profileEditingCard.events({
  "click .updateProfile" (event) {
    event.preventDefault();

    var t = event.target;
    var firstName= $("#firstName").val();
    var lastName = $("#lastName").val();
    var street = $("#street").val();
    var city = $("#city").val();
    var zip = $("#zip").val();

    if(Accounts.user()){
      var userMail = Accounts.user().emails[0].address;
    } else{
      return "";
    }
    var userProfile = UserProfiles.findOne({email:userMail});
    if(userProfile){
      var userProfileId = userProfile._id;
    } else{
      FlowRouter.go('/profile');
    }

    UserProfiles.update(userProfileId,{
      $set : {
        firstName:firstName,
        lastName:lastName,
        address:{
          street:street,
          city:city,
          zip:zip
        }
      }
    });

    Materialize.toast("Modifications enregistrées.", 4000, 'rounded');
  },
});

function getCurrentLesson(){
  var lessonId = FlowRouter.getParam('lessonId');
  if(lessonId){
    var lesson = Lessons.findOne(lessonId);
  } else{
    var lesson = "";
  }
  return lesson;
}

Template.lessonConfirmationCard.helpers({
  lessonTitle : function(){
    var lesson = getCurrentLesson();
    if(lesson !==""){
      return lesson.title;
    }
  },
  lessonShortDesc : function(){
    var lesson = getCurrentLesson();
    if(lesson !==""){
      return lesson.shortDesc;
    }
  },
  lessonDate : function(){
    var lesson = getCurrentLesson();
    if(lesson !==""){
      return lesson.date;
    }
  },
  lessonTime: function(){
    var lesson = getCurrentLesson();
    if(lesson !==""){
      return lesson.time;
    }
  },
  lessonPrice: function(){
    var lesson = getCurrentLesson();
    if(lesson !==""){
      return lesson.price;
    }
  }
});

Template.reservationConfirmation.events({
  "click .payBtn" (event) {
    event.preventDefault();

    var reservationId = FlowRouter.getParam('reservationId');
    var lesson = getCurrentLesson();
    if(lesson.maxAttendeesLeft > 0){
      var email = Accounts.user().emails[0].address;
      var priceInCents = lesson.price * 100;

      var handler = StripeCheckout.configure({
        key: 'pk_test_LqluwQNx3xv8VtbJwYme8XJc',
        image : "http://res.cloudinary.com/trys/image/upload/v1479316560/logo-trys-2-v1_transp_cut_unyjvh.png",
        token: function(token) {
          var userMail = Accounts.user().emails[0].address;
          var userProfile = UserProfiles.findOne({email:userMail});
          var userProfileId = userProfile._id;
          UserProfiles.update(userProfileId,{$set:{stripeToken : token.id}});
          Lessons.update(lesson._id,{
            $inc:{maxAttendeesLeft : -1},
          });
          Reservations.update(reservationId,{
            $set:{isPaid:true},
          });

          var attendeesList = lesson.attendeesList;
          console.log(attendeesList);
          var s = AttendeesList.update({_id:attendeesList},{
            $push : {
              users:
                    {
                      email:userMail,
                      wasPresent:false,
                    },
                  },
                }
              );
          console.log(s + ' update of AttendeesList');

          FlowRouter.go('/reservation/:reservationId/confirmation',{reservationId:reservationId},{});
        }
      });

      handler.open({
        name:"trys",
        description:lesson.title,
        zipCode:false,
        email:email,
        currency:'eur',
        amount:priceInCents,
      });

    } else {
      Materialize.toast("Zut ! Le cours est déjà complet :'(", 5000, 'rounded');
      FlowRouter.go('/class/:lessonId',{lessonId:lesson.id},{});
    }

  },
  "click .cancelBtn" (event){
    event.preventDefault();

    //Remove the reservation

    //Go backward
    var lessonId = FlowRouter.getParam('lessonId');
    FlowRouter.go('/class/:lessonId',{lessonId:lessonId},{});
  }
});
