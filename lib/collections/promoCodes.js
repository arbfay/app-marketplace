PromoCodes = new Mongo.Collection('promoCodes');

/*
  Fields :
    code : String,
    author : Email,
    maxUsage : Number,
    maxPerUser : Number,
    reductionToApply : Number,
    comment : String,
    createdAt : Date,
*/

PromoCodes.allow({ 
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
