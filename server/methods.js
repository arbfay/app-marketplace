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
});
