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
       //reducing maxUsage & send data only if possible to apply => meaning only if
       //maxUsage is > 0
       if(pC.maxUsage > 0){
         PromoCodes.update({code:pC.code}, {
           $inc : {maxUsage : -1}
         });
         pC.maxUsage -= 1;
         return {
           code:pC.code,
           maxUsage:pC.maxUsage,
           maxPerUser:pC.maxPerUser,
           reductionToApply:pC.reductionToApply
         };
       } else {
         return false;
       }
     } else {
       return false;
     }
   },
   addPromoCodeUsage : function(promoCode, userMail){
     UserProfiles.update({email:userMail},{
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
   updateCoach : function(coachId,data){
     Coaches.update(
       {_id:coachId},
       {$set : data},
       function(err){
         if(err){
           console.log(err);
         }
       });
   },
   insertUserProfile : function(data){
     var firstName = data.firstName;
     var lastName = data.lastName;
     var points = data.points;
     var zip = data.address.zip;
     var birthdate = data.birthdate;
     var phone = data.phone;

     if(!points){points=0;}
     if(!birthdate){birthdate=100;}

     check(firstName,String);
     check(lastName,String);
     check(points, Number);
     check(zip, String);
     check(birthdate, Number);

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
   insertClient : function(data){
     check(data.firstName,String);
     check(data.lastName,String);
     check(data.tel,String);

     var card = {};
     var cards = [];
     if(this.userId){
       card = CoachCards.findOne({_id : data.card});
       if(card){
         var dateOfCreation = data.createdAt.getTime();
         var expDate = dateOfCreation + (card.duration * 2629746000);
         cards = [
           {
             name:card.name,
             maxAttendings:card.maxAttendings,
             attendingsLeft:card.maxAttendings,
             expirationDate:expDate,
           }
         ];
       }

     var d = {
       isUser:false,
       firstName:data.firstName,
       lastName:data.lastName,
       email:data.email,
       tel:data.tel,
       coachId:data.coachId,
       reservations:[],
       cards:cards,
       createdAt:data.createdAt,
       updatedAt:data.updatedAt,
     };

     if(Accounts.findUserByEmail(data.email)){
       d.isUser=true;
       d.userId = Accounts.findUserByEmail(data.email)._id;
     }

     var clientId = Clients.insert(d);

     Coaches.update({_id:data.coachId},
       { $push : {
            clients: clientId
       }
     });
     return clientId;
   }
   },
   updateClient : function(clientId, data){
     check(data.firstName,String);
     check(data.lastName,String);
     check(data.tel,String);

     Clients.update({_id:clientId}, {
        $set:data
     });
   },
   addCardToClient : function(clientId, data){
     var card = {};

     if(data.card != '0' || data.card != ''){
       card = CoachCards.findOne({_id : data.card});

       var dateOfCreation = data.createdAt.getTime();
       var expDate = dateOfCreation + (card.duration * 2629746000);

       Clients.update({_id:clientId},{
         $push:{
           cards:{
           $each:[{
             name:card.name,
             maxAttendings:parseInt(card.maxAttendings),
             attendingsLeft:parseInt(card.maxAttendings),
             expirationDate:expDate,
             createdAt:data.createdAt,
                }],
           $sort:{attendingsLeft:1}
         }
       }
       });
     }
   },
   incrementCardOfClient : function(clientId,cardName, expDate,val){
     check(val, Number);
     Clients.update(
       {_id:clientId,
       "cards.expirationDate":expDate},
       {$inc:{"cards.$.attendingsLeft" : val}}
     );
   },
   editClientCard : function(clientId,newCard){
     check(newCard.name, String);
     check(newCard.expirationDate, Number);

     Clients.update(
       {_id:clientId,
       "cards.createdAt":newCard.createdAt},
       {
         $set:{"cards.$.expirationDate":newCard.expirationDate,
               "cards.$.attendingsLeft":newCard.attendingsLeft
              }
       }
     );
   },
   removeClientCard : function(clientId, card){
     check(card.name, String);
     check(card.expirationDate, Number);

     Clients.update(
       {_id:clientId},
       {$pull:{"cards" : card}}
     );
   },
   removeClient : function(clientId){
     var cId = Clients.findOne(clientId).coachId;
     Clients.update({_id:clientId}, {
        $set:{coachId:"0",
              secretCoachId:cId,}
     });
   },
   addBonus : function(token,userEmail, lessonId){
     if(token === "bonbon"){
        var user = UserProfiles.findOne({email:userEmail});
        UserProfiles.update(
         {_id:user._id},
         {$push : {
           bonus : {
             lessonId : lessonId,
             gotIt : true,
             createdAt : new Date(),
           }},
          $inc:{points:10}
        });
        return true;
     } else{
        return false;
     }
   },
   insertAttendeesList : function(s){
    if(s ==="ok"){
      return AttendeesList.insert({reservations:[],users:[]});
    }
   },

   insertLessonByCoach:function(data){
     check(data.title,String);
     check(data.shortDesc,String);
     check(data.longDesc, String);
     check(data.coachEmail, String);
     check(data.address, String);
     check(data.updatedAt, Date);

     return SubmittedLessons.insert(data);
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
   updateLessonByAdmin : function(id,data){
     check(data.title,String);
     check(data.shortDesc,String);
     check(data.longDesc, String);
     check(data.coachEmail, String);
     check(data.address, String);
     check(data.updatedAt, Date);

     Lessons.update(
       {_id:id},
       {$set : data},
       function(err){
         if(err){
           console.log(err);
         }
       });
   },
   removeSubmittedLesson:function(id){
     SubmittedLessons.remove({_id:id});
   },
   addNonUserAttendee : function(lessonId,aLId,data){
     check(data.firstName,String);
     check(data.lastName,String);
     check(data.createdAt,Date);

     AttendeesList.update(
       {_id:aLId},
       {
         $push : {
           nonUsers:
                 {
                   firstName:data.firstName,
                   lastName:data.lastName,
                   email:data.email,
                   createdAt:data.createdAt,
                 },
               },
             }
      );

      Clients.update({_id:data.clientId},
          {
            $push : {
              reservations : {
                lessonId : lessonId,
                fromCard : data.fromCard,
                createdAt : data.createdAt,
              }
            }
          }
      );

      Lessons.update({_id:lessonId},{
        $inc:{maxAttendeesLeft : -1},
      });
   },
   cancelNonUserAttendee : function(clientId,lessonId,date,cardData){
     var client = Clients.findOne(clientId);
     var lesson = Lessons.findOne(lessonId);
     var aL = AttendeesList.findOne(lesson.attendeesList);
     var toMatch = {
       firstName:client.firstName,
       lastName:client.lastName,
       email:client.email,
       createdAt:date
     };

     AttendeesList.update(aL._id,
       {
         $pull : {nonUsers : toMatch}
       }
     );

     Clients.update({_id:clientId},
         {
           $pull : {
             reservations : {
               createdAt : date,
             }
           }
         }
     );

    if(cardData.fromCard){
       Clients.update(
         {_id:clientId,
         "cards.name":cardData.cardName,
         "cards.expirationDate":cardData.expDate},
         {$inc:{"cards.$.attendingsLeft" : 1}}
       );
    }
     Lessons.update({_id:lessonId},{
       $inc:{maxAttendeesLeft : 1},
     });

   },
   insertReservation : function(data){
     check(data.lessonTitle,String);
     check(data.isComplete, Boolean);
     check(data.isPaid, Boolean);

     return Reservations.insert(data);
   },
   reservationPayment : function(token,userProfileId,userMail,lessonId,reservationId,pricePaid,earning){
     check(pricePaid,Number);

     var lesson = Lessons.findOne({_id: lessonId});

     UserProfiles.update(userProfileId,{$set:{stripeToken : token.id},
                                        $inc:{points:earning}});

     Lessons.update(lesson._id,{
       $inc:{maxAttendeesLeft : -1},
     });
     Reservations.update(reservationId,{
       $set:{isPaid:true,
            pricePaid:pricePaid},
     });
     var userProfile = UserProfiles.findOne({_id:userProfileId});
     var birthday = "";
     if(userProfile.birthday){
       birthday=userProfile.birthday;
     }

     AttendeesList.update({_id:lesson.attendeesList},{
       $push : {
         users:
               {
                 firstName:userProfile.firstName,
                 lastName:userProfile.lastName,
                 email:userMail,
                 wasPresent:false,
                 birthday:birthday,
                 pricePaid:pricePaid,
                 createdAt:new Date()
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
       lessonDate:lessonDate.format("dddd DD MMMM, HH:mm");,
       pricePaid:pricePaid/100,
       duration:lesson.duration,
     };

     Email.send({
        to: userProfile.email,
        from: "Team Trys <faycal@trys.be>",
        subject: "Votre réservation sur Trys",
        html: SSR.render('htmlEmail',data),
      });

      SSR.compileTemplate('coachEmail', Assets.getText('reservation-email.html'));

      var dataTwo = {
        lessonTitle:lesson.title,
        firstName:userProfile.firstName,
        lastName:userProfile.lastName,
        dateForHuman:lessonDate.format('ddd DD MMM'),
        timeForHuman:lessonDate.format('HH:mm'),
      };

      Email.send({
         to: userProfile.email,
         from: "Team Trys <faycal@trys.be>",
         subject: "Nouvelle réservation sur Trys",
         html: SSR.render('coachEmail',dataTwo),
       });

     return true;
   },
   sendResPasswordEmail : function(email){
     check(email,String);

     var user = Accounts.findUserByEmail(email);
     var userId = user._id;
     if (!user)
      throw new Error("Ne trouve pas l'utilisateur.");
      // pick the first email if we weren't passed an email.
     if (!email && user.emails && user.emails[0])
      email = user.emails[0].address;
      // make sure we have a valid email
     if (!email || !_.contains(_.pluck(user.emails || [], 'address'), email))
      throw new Error("Adresse e-mail incorrecte.");

      var token = Random.secret();
      var when = new Date();
      var tokenRecord = {
        token: token,
        email: email,
        when: when
      };
      Meteor.users.update(userId, {$set: {
        "services.password.reset": tokenRecord
      }});
      // before passing to template, update user object with new token
      Meteor._ensure(user, 'services', 'password').reset = tokenRecord;

      var relUrl = "reset-password/"+token;
      var resetPasswordUrl = Meteor.absoluteUrl(relUrl);

      SSR.compileTemplate('htmlEmail', Assets.getText('reset-password-email.html'));

      var data = {
        resetPasswordUrl:resetPasswordUrl,
        email:email,
      };

      Email.send({
         to: email,
         from: "Trys <contact@trys.be>",
         subject: "Mot de passe oublié ?",
         html: SSR.render('htmlEmail',data),
       });

    },
});
