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
    birthdate (in milliseconds since 1st january)
    address
      street
      city
      zip
    phone
    promoCodeUsage
    createdAt
    updatedAt

    coachId
*/
