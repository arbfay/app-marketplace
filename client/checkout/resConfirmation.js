var userId = Meteor.userId();

Template.profileEditingCard.helpers({
  firstName: function(){

    if(Accounts.user()){
      var userMail = Accounts.user().emails[0].address;
    } else{
      return "";
    }

    Meteor.subscribe('userProfileByMail', userMail);
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
      FlowRouter.go('/login');
    }

    var toUpdate = {
      firstName:firstName,
      lastName:lastName,
      address:{
        street:street,
        city:city,
        zip:zip
      }
    };

    Meteor.call('updateUserProfile', userProfileId, toUpdate, function(err){
      if(err){
        console.log(err);
      } else {
        Materialize.toast("Modifications enregistrées.", 4000, 'rounded');
      }
    });
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
  title : function(){
    var lessonId = FlowRouter.getParam('lessonId');
    Meteor.subscribe("matchingLesson",lessonId);
    var lesson = Lessons.findOne();

    var coachEmail = lesson.coachEmail;
    Meteor.subscribe('matchingCoachByMail', coachEmail);
    var coach = Coaches.findOne();
    Session.set("coach", coach);

    var coachId = coach._id;
    Meteor.subscribe('matchingUserProfileByCoachId', coachId);
    Session.set("coachProfile", UserProfiles.findOne({email:coachEmail}));
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

    return lesson.title;

  },
  imgUrl : function(){
    var lesson = Session.get("lesson");
    return lesson.imgUrl;
  },
  shortDesc : function(){
    var lessonId = FlowRouter.getParam('lessonId');
    var lesson = Lessons.findOne({_id:lessonId});
    if (lesson){
      return lesson.shortDesc;
    } else {
      return "";
    }
  },
  coachName : function(){
    var prof = Session.get("coachProfile");
    return ""+prof.firstName+" "+prof.lastName;
  },
  coachShortDesc: function(){
    var coach = Coaches.findOne();
    return coach.shortDesc;
  },
  coachImgUrl: function(){
    var coach = Coaches.findOne();
    return coach.imgUrl;
  },
  day : function(){
    var selection= Session.get("selectedDate");

    return selection.day;
  },
  date : function(){
    var selection= Session.get("selectedDate");

    return selection.date;
  },
  month : function(){
    var selection= Session.get("selectedDate");

    return selection.month;
  },
  hour : function(){
    var selection= Session.get("selectedDate");

    return selection.hour;
  },
  duration : function(){
    var selection = Session.get("selectedDate");
    return selection.duration;
  },
  price : function(){
    var selection= Session.get("selectedDate");

    return selection.price;
  }
});

Template.reservationConfirmation.events({
  "click .payBtn" (event) {
    event.preventDefault();

    var reservationId = FlowRouter.getParam('reservationId');
    var lesson = Lessons.findOne();

    var price;
    var email = Accounts.user().emails[0].address;
    if(UserProfiles.findOne({email:email}).firstName===""
        || UserProfiles.findOne({email:email}).lastName===""
        || UserProfiles.findOne({email:email}).address.street===""){
          Materialize.toast("Veuillez modifier vos informations pour qu'elles soient correctes, merci.", 4000, "rounded");
    } else {
      /*if(lesson !==""){
        price = lesson.price;
        if(Session.get('promoCode')){
          var pC = Session.get('promoCode');
          var rTA = new ReactiveVar(0);

          Meteor.call('applyPromoCode',pC, (err,res)=>{
            if(res){
              if(res.maxUsage >0){
                rTA.set(res.reductionToApply);
                Meteor.call('addPromoCodeUsage',res, Accounts.user().emails[0].address,(error,results)=>{
                  if(err){
                    console.log('Attempt to add the usage of the promo code');
                    console.log(error);
                  }
                });

              }
            } else{
              console.log(res);
              console.log(err);
            }
          });

          price = price - rTA.get();
        }
      } else {
        alert('Mauvaise tentative');
      }
      */

        if(lesson.maxAttendeesLeft > 0){

          var priceInCents = lesson.price * 100;

          var handler = StripeCheckout.configure({
            key: 'pk_test_LqluwQNx3xv8VtbJwYme8XJc',
            image : "http://res.cloudinary.com/trys/image/upload/v1480159845/logo-trys-2-v1.2_b_w_transp_cut_icqbo8.png",
            token: function(token) {
              var userMail = Accounts.user().emails[0].address;
              var userProfile = UserProfiles.findOne({email:userMail});
              var userProfileId = userProfile._id;
              Meteor.call("reservationPayment", token, userProfile._id,userMail,lesson._id,reservationId,priceInCents,
                    function(err,res){
                      if(err){
                        Materialize.toast("Erreur lors du process du paiement " + err,4000,'rounded');
                      } else{
                        FlowRouter.go('/reservation/:reservationId/confirmation',{reservationId:reservationId},{});
                      }
                    });
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
