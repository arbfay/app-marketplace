Clients = new Mongo.Collection('clients');

/*
  Fields :
    isUser : Boolean
    userId : ObjectId (optional)
    firstName:String
    lastName : String
    email : String
    tel : String
    coachId : ObjectId
    reservations : [{
                    lessonId : ObjectId
                    price : Number
                    fromCard : Boolean
                    isPaid : Boolean
                    comment : String
                    wasPresent : Boolean
                  }]
    cards :[{
              name : String
              maxAttending : Number
              attendingsLeft : Number
              expirationDate : Number (date in milliseconds)
            }]
*/

Clients.allow({
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
