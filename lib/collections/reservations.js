Reservations = new Mongo.Collection("reservations");

/*
  Fields
    userId
    userEmail
    lessonId
    lessonTitle
    lessonDate (in milliseconds since 1st jan 1970)
    coachId
    isComplete
    isPaid
    pricePaid (in cents)
    createdAt
    updatedAt
*/

Reservations.allow({
  insert: function(){
    return false;
  },
  update: function(){
    return false;
  },
  remove: function(){
    return false;
  }
});
