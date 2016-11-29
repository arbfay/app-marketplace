UserProfiles = new Mongo.Collection("userProfiles");

UserProfiles.allow({
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
