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
    var now = moment().valueOf();
    return Lessons.find({date:{$gt:now}},{sort:{date:1},limit:3});
  }
});

Template.newsletterForm.events({
  "submit form" : (event, template)=>{
    event.preventDefault();

    var zip = event.target.zip.value;
    var email = event.target.email.value;

    Meteor.call("newsletterSubscribe", zip, email, (err,res)=>{
      if(err){
        Materialize.toast('Erreur');
      } else {
        Materialize.toast('Succès');
        event.target.zip.value='';
        event.target.email.value='';
      }
    });
  }
});
