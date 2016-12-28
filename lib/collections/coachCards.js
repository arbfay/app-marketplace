CoachCards = new Mongo.Collection("coachCards");

/*
  Fields:
    coachId : ObjectId
    name : String
    price : Number
    maxAttendings : Number
    duration : Number
*/

CoachCards.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return false;
  },
  remove: function(){
    return false;
  }
});
