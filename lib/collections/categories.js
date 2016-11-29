Categories = new Mongo.Collection("categories");

Categories.insert({cat : "Yoga"});
Categories.insert({cat : "Pilates"});
Categories.insert({cat : "Tai Chi"});
Categories.insert({cat : "Qi Gong"});


Categories.allow({
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
