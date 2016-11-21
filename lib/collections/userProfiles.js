UserProfiles = new Mongo.Collection("userProfiles");

UserProfiles.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});

/*
  Fields :
    email
    userId
    firstName
    lastName
    address
      street
      city
      zip
    promoCodeUsage
    createdAt
    updatedAt
    
    coachId
*/
