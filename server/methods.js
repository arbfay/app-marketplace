Meteor.methods({
  count:function(collectionName){
     if(collectionName==="lessons"){
       return Lessons.find().count();
     } else if (collectionName==="coaches") {
       return Coaches.find().count();
     } else if (collectionName==="reservations") {
       return Reservations.find().count();
     } else if (collectionName==="users") {
       return Meteor.users.find().count();
     }
   },

   sendMail:function(to,from,subject,text){
     check([to, from, subject, text], [String]);

     this.unblock();
      Email.send({
        to: to,
        from: from,
        subject: subject,
        html: text
      });

      return 1;
   },

   insertPromo : function(toInsert){
     check(toInsert, {
       code : String,
       author : String,
       maxUsage : Number,
       maxPerUser : Number,
       reductionToApply : Number,
       comment : String,
       createdAt : Date,
     });
     var id = PromoCodes.insert(toInsert);
     return id;
   },

   applyPromoCode : function(promoCode){
     check(promoCode, String);

     var pC = PromoCodes.findOne({code:promoCode});

     if(pC){
       return {
         code:pc.code,
         maxUsage:pc.maxUsage,
         maxPerUser:pc.maxPerUser,
         reductionToApply:pc.reductionToApply
       };
     } else {
       return false;
     }
   },
   addPromoCodeUsage : function(promoCode, userMail){
     UserProfile.update({email:userMail},{
       $push : {
         promoCodeUsage : {
           code : promoCode.code,
           usage: 1,
           dateOfUse: new Date(),
         }
       }
     });
   },
   insertCoach : function(data){
     check(data.updatedAt, Date);
     var coachId = Coaches.insert(data);
     var coachMail = data.email;
     var userProfile = UserProfiles.findOne({email:coachMail});

     UserProfiles.update(userProfile._id,{
       $set :{
         coachId : coachId,
         coachActive: true,
       }
     });

   },
   insertUserProfile : function(data){
     var firstName = data.firstName;
     var lastName = data.lastName;
     var points = data.points;
     var zip = data.address.zip;

     check(firstName,String);
     check(lastName,String);
     check(points, Number);
     check(zip, String);

     UserProfiles.insert(data);

     SSR.compileTemplate('htmlEmail', Assets.getText('welcome-email.html'));

     Email.send({
        to: data.email,
        from: "Fayçal de Trys <faycal@trys.be>",
        subject: "Mot de bienvenue et petite question",
        html: SSR.render('htmlEmail',{}),
      });

     return true;
   },
   updateUserProfile : function(id,data){
     UserProfiles.update(
       {_id:id},
       {$set : data},
       function(err){
         if(err){
           console.log(err);
         }
       });
   },

   insertAttendeesList : function(s){
    if(s ==="ok"){
      return AttendeesList.insert({reservations:[],users:[]});
    }
   },

   insertLessonByAdmin : function(data){
     check(data.title,String);
     check(data.shortDesc,String);
     check(data.longDesc, String);
     check(data.coachEmail, String);
     check(data.address, String);
     check(data.updatedAt, Date);

     data.attendeesList = AttendeesList.insert({reservations:[],users:[]});

     return Lessons.insert(data);
   },
   insertReservation : function(data){
     check(data.lessonTitle,String);
     check(data.isComplete, Boolean);
     check(data.isPaid, Boolean);

     return Reservations.insert(data);
   },
   reservationPayment : function(token,userProfileId,userMail,lessonId,reservationId,pricePaid){
     check(pricePaid,Number);

     var lesson = Lessons.findOne({_id: lessonId});

     UserProfiles.update(userProfileId,{$set:{stripeToken : token.id},
                                        $inc:{points:50}});

     Lessons.update(lesson._id,{
       $inc:{maxAttendeesLeft : -1},
     });
     Reservations.update(reservationId,{
       $set:{isPaid:true,
            pricePaid:pricePaid},
     });

     AttendeesList.update({_id:lesson.attendeesList},{
       $push : {
         users:
               {
                 email:userMail,
                 wasPresent:false,
               },
             },
           }
         );

     var reservation = Reservations.findOne({_id:reservationId});
     var userProfile = UserProfiles.findOne({_id:userProfileId});
     var lesson = Lessons.findOne({_id:lessonId});

     var coachProfile = UserProfiles.findOne({email : lesson.coachEmail});
     var coachNames = coachProfile.firstName +" "+coachProfile.lastName;
     var reservationDate = moment(reservation.createdAt);
     reservationDate = reservationDate.format("dddd DD MMMM, HH:mm");
     var lessonDate = moment(lesson.date);
     lessonDate = lessonDate.format("dddd DD MMMM, HH:mm");
     SSR.compileTemplate('htmlEmail', Assets.getText('billing-email.html'));

     var data = {
       coachName:coachNames,
       firstName:userProfile.firstName,
       lastName:userProfile.lastName,
       street:userProfile.address.street,
       zip:userProfile.address.zip,
       city:userProfile.address.city,
       reservationDate:reservationDate,
       reservationId:reservationId,
       title:lesson.title,
       address:lesson.address,
       lessonDate:lessonDate,
       pricePaid:pricePaid/100,
       duration:lesson.duration,
     };

     Email.send({
        to: userProfile.email,
        from: "Trys <faycal@trys.be>",
        subject: "Votre réservation sur Trys",
        html: SSR.render('htmlEmail',data),
      });

     return true;
   }
});
