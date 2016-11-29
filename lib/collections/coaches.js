Coaches = new Mongo.Collection('coaches');

/*
  Fields :
    userId
    email
    createdAt
    updatedAt
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
