Lessons = new Mongo.Collection("lessons");
Lessons.allow({
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
    imgUrl
    title
    shortDesc
    longDesc
    category
    coachEmail
    address
    geospatial
      type
      coordinates : [longitude, latitude]
    maxAttendeesLeft
    price
    commission
    date
    time
    attendeesList
    createdAt
    updatedAt
*/
