Lessons = new Mongo.Collection("lessons");
Lessons.allow({
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
    imgUrl
    title
    shortDesc
    longDesc
    category
    duration
    coachEmail
    address
    geospatial
      type
      coordinates : [longitude, latitude]
    maxAttendeesLeft
    price
    commission
    date (in milliseconds since 1st jan 1970)
    attendeesList
    createdAt
    updatedAt
*/
