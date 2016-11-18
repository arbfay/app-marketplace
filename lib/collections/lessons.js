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
