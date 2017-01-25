Template.mainParallax.onRendered(()=>{
  Session.set('reservationLogin',false);
});

Template.mainParallax.onCreated(()=>{
  var template = Template.instance();

  var dateNow = new Date();
  var now = dateNow.getTime() + 2100000;

  template.searchQuery = {
    maxAttendeesLeft :
      {$gt : 0},
    date :
      {$gt : now},
    category :
      {$in : ["Yoga","Pilates","Tai Chi"]}
  };

  template.searchOptions = {
    sort : {date : 1},
    limit : 3,
    fields : {
      attendeesList:0,
      commission:0
    }
  };

  template.autorun(()=>{
    template.subscribe("searchLessons",template.searchQuery,template.searchOptions);
  });

});

Template.lessonsExample.helpers({
  results : function(){
    return Lessons.find({},{limit:3});
  }
})
