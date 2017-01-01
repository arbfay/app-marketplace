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
  birthdate: function(){
    if(Accounts.user()){
      var userMail = Accounts.user().emails[0].address;
    } else{
      return "";
    }
    var userProfile = UserProfiles.findOne({email:userMail});

    if(userProfile){
      var mom = moment(userProfile.birthdate);
      return mom.format("YYYY-MM-DD");
    } else{
      return "";
    }
  },
  phoneNumber: function(){
    if(Accounts.user()){
      var userMail = Accounts.user().emails[0].address;
    } else{
      return "";
    }
    var userProfile = UserProfiles.findOne({email:userMail});

    if(userProfile){
      return userProfile.phone;
    } else{
      return "";
    }
  },
  isMale :function(){
    if(Accounts.user()){
      var userMail = Accounts.user().emails[0].address;
    } else{
      return "";
    }
    var userProfile = UserProfiles.findOne({email:userMail});

    if(userProfile.gender === "male"){
      return "checked";
    } else{
      return "";
    }
  },
  isFemale :function(){
    if(Accounts.user()){
      var userMail = Accounts.user().emails[0].address;
    } else{
      return "";
    }
    var userProfile = UserProfiles.findOne({email:userMail});

    if(userProfile.gender === "female"){
      return "checked";
    } else{
      return "";
    }
  },
  progressBar : function(){
    if(Accounts.user()){
      var userMail = Accounts.user().emails[0].address;
    } else{
      return "";
    }
    var userProfile = UserProfiles.findOne({email:userMail});

    var i = 5;
    if(userProfile.firstName.length >= 2){i += 10;}
    if(userProfile.lastName.length >= 2){i += 10;}
    if(userProfile.phone.length >= 4){i += 15;}
    if(userProfile.birthdate){i += 15;}
    if(userProfile.address.zip.length >= 4){i += 15;}
    if(userProfile.address.street.length >= 2){i += 10;}
    if(userProfile.address.city.length >= 3){i += 10;}
    if(userProfile.gender.length >= 2){i += 10;}

    return i+'%';
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
    var birthdate = $("#birthdate").val();
    var phone = $("#phoneNumber").val();
    var gender = $('input[name=gender]:checked').val();

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

    var d = new Date(birthdate);
    birthdate = d.getTime();

    var toUpdate = {
      firstName:firstName,
      lastName:lastName,
      address:{
        street:street,
        city:city,
        zip:zip
      },
      birthdate : birthdate,
      phone:phone,
      gender:gender,
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

Template.promoCodeForm.events({
  "click .addPromoCode" : function(event){
    event.preventDefault();
    var insertedCode = $("#promoCode").val();

    Session.set("promoCode", insertedCode);
    Meteor.subscribe('promoCode', insertedCode);
    $("#promoCode").val('');
  }
});

Template.promoCodeForm.helpers({
  insertedCode : function(){
    return Session.get("promoCode");
  },
  whatCode : function(){
    if(Session.get("promoCode")){
      var code = Session.get("promoCode");

      var email = Accounts.user().emails[0].address;
      var profile = UserProfiles.findOne({email:email});
      /*Vérification que le code n'a pas déjà été utilisé plus de fois
      que permis*/
      var codeUsed = [];
      if(profile.promoCodeUsage){
        var pCU = profile.promoCodeUsage;
        for(var i = 0; i<pCU.length; i++){
          codeUsed.push(pCU[i].code); //On recupère tous les codes déjà utilisés
        }
      }

      if(codeUsed.indexOf(code) >=0){//Si le code est bien présent dans la liste
        var times = 0;
        for(var i = 0; i < codeUsed.length;i++){//Calcul le nombre de fois que le code a été utilisé
          if(codeUsed[i] === code){
            times++;
          }
        }
        var pC = PromoCodes.findOne({code:code});
        if(times >= pC.maxPerUser){ //Déjà utilisé un maximum de fois possible
          Session.set("promoCode",false); //Pour que le reste sache que ce n'est plus possible de l'utiliser
          return "Ce code ne peut plus être utilisé.";
        } else {
          return code;
        }
      } else {
        return code;//Le code n'a pas encore été utilisé une seule fois et est valide.
      }
    } else {
      return "Ce code ne peut plus être utilisé.";
    }
  },
  whatReduction : function(){
    if(Session.get("promoCode")){
      var code = Session.get("promoCode");
      var promo = PromoCodes.findOne({code :code});
      return promo.reductionToApply;
    } else {
      return "";
    }
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
        price = lesson.price;
        var promoCode = Session.get('promoCode');
        if(!promoCode){promoCode="";}

        Meteor.call('applyPromoCode',promoCode, (err,res)=>{
          if(res != false){
              Meteor.call('addPromoCodeUsage',res, Accounts.user().emails[0].address,(error,results)=>{
                if(error){
                  console.log('Attempt to add the usage of the promo code failed');
                  console.log(error);
                } else {
                  console.log(res);
                  Meteor.subscribe('promoCode',promoCode);
                }
              });

          } else{
            console.log(res);
            console.log(err);
          }
        });
        var promo = PromoCodes.findOne({code:promoCode});
        if(promo){
          var rTA = promo.reductionToApply > 0 ? promo.reductionToApply : 0;
          price -= rTA;
        }

        if(lesson.maxAttendeesLeft > 0){

          var priceInCents = price * 100;

          var handler = StripeCheckout.configure({
            key: 'pk_live_35CsmegR7Q0ww6wi8QupJ9rp',
            //key : 'pk_test_LqluwQNx3xv8VtbJwYme8XJc',
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
                        Session.set("promoCode",false);
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
          Session.set("promoCode",false);
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
