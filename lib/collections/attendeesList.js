AttendeesList = new Mongo.Collection('attendeesList');

AttendeesList.allow({
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
  fields
    users : [
      email
      wasPresent
    ],
    nonUsers : [
      firstName
      lastName
      hasPaid
      email
      comment
    ]
*/
