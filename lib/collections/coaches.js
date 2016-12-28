Coaches = new Mongo.Collection('coaches');

/*
  Fields :
    userId : ObjectId
    email : String
    description : String
    imgUrl : String
    clients : [ObjectId]
    address : String
    createdAt : Date
    updatedAt : Date
*/

Coaches.allow({
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
