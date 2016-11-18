Meteor.methods({
  'geoNear' (loc){
    return Lessons.aggregate([
       {
         $geoNear: {
            near: loc,
            distanceField: "dist.calculated",
            //query: { $lt: {date: new Date() + 2 weeks}},
            includeLocs: "dist.location",
            limit: 20, //max number of returned lessons
            spherical: true
         }
       }
    ]);
  }
});
