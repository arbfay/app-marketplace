//var settings = Meteor.settings.private.MailChimp,
//   chimp    = new MailChimp( settings.apiKey, { version: '2.0' } ),
//   listId   = settings.listId;

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
   loginLinkSecure : function(tok,userEmail,emailTo){
     check(tok, 'bonbon');
     var user = Accounts.findUserByEmail(userEmail);

     const token = LoginLinks.generateAccessToken(user);
     Email.send({
       to:emailTo,
       from:'contact@trys.be',
       subject:'Lien de connexion automatique sur Trys',
       html:'Voici le lien pour vous connecter sur Trys : https://app.trys.be/autologin/'+token,
     });
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

     //sendRegularEmail(data,'welcome-email.html',
    //                    "Fayçal de Trys <faycal@trys.be>","Mot de bienvenue et petite question");

      try {
           var subscribe = chimp.call( 'lists', 'subscribe', {
             id: listId,
             email: {
               email: data.email,
             }
           });

          return subscribe;
     } catch( exception ) {
       return exception;
     }

     return true;
   },
   insertUserProfileForCoach : function(data){
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

     sendRegularEmail(data,'welcome-coach-email.html',
                        "Team Trys <contact@trys.be>","Vous avez maintenant accès au Trys Coach Panel !");

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

     if(data.email !== "" && Meteor.users.find({"emails.0.address":data.email})){
       d.isUser=true;
       d.userId = Meteor.users.find({"emails.0.address":data.email})._id;
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
     console.log("clientId : ", clientId);
     console.log("lessonId : ", lessonId);
     console.log("cardData : ", cardData);
     var client = Clients.findOne(clientId);
     var lesson = Lessons.findOne(lessonId);
     var aL = AttendeesList.findOne(lesson.attendeesList);
     var toMatch = {
       firstName:client.firstName,
       lastName:client.lastName,
       email:client.email,
       createdAt:date
     };
     console.log(toMatch);

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

     var data = {
       email : userProfile.email,
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
       lessonDate:lessonDate.format("dddd DD MMMM, HH:mm"),
       pricePaid:pricePaid/100,
       duration:lesson.duration,
     };

     sendRegularEmail(data,'billing-email.html',
                         "Team Trys <contact@trys.be>","Votre réservation sur Trys");

      var dataTwo = {
        email : coachProfile.email,
        lessonTitle:lesson.title,
        firstName:userProfile.firstName,
        lastName:userProfile.lastName,
        dateForHuman:lessonDate.format('ddd DD MMM'),
        timeForHuman:lessonDate.format('HH:mm'),
      };

     sendRegularEmail(dataTwo,'reservation-email.html',
                         "Team Trys <contact@trys.be>","Nouvelle réservation sur Trys");

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

      var data = {
        resetPasswordUrl:resetPasswordUrl,
        email:email,
      };

      sendRegularEmail(data,'reset-password-email.html',
                          "Trys <contact@trys.be>","Mot de passe oublié ?");
    },
});

sendRegularEmail = function (data, htmlFile, from, subject){
  SSR.compileTemplate('htmlEmail', Assets.getText(htmlFile));

  Email.send({
     to: data.email,
     from: from,
     subject: subject,
     html: SSR.render('htmlEmail',{}),
   });
};
