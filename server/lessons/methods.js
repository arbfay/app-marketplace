Meteor.methods({
  'geoNear' (loc,lim){
    return Lessons.aggregate([
       {
         $geoNear: {
            near: loc,
            distanceField: "dist.calculated",
            //query: { $lt: {date: new Date() + 2 weeks}},
            includeLocs: "dist.location",
            limit: lim, //max number of returned lessons
            spherical: true
         }
       }
    ]);
  },
});
