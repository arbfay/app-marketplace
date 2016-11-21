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
   }
});
