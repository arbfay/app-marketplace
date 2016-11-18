Template.coachInsert.events({
  "submit form" (event){
    event.preventDefault();

    var coachMail = event.target.coachEmail.value;

    var userCoach = Meteor.users.findOne({'emails.address':coachMail},{});
    var userCoachId = userCoach._id;
    var toInsert = {
      createdAt:new Date(),
      updatedAt: new Date(),
      userId:userCoachId,
      email:coachMail,
    };

    var coachId = Coaches.insert(toInsert,function(err,id){
      if(err){
        console.log("Erreur lors de l'insertion d'un coach : " + err);
        alert("Erreur lors de l'insertion d'un coach");
      } else{
        Materialize.toast('Nouveau coach enregistré !', 4000, 'rounded');
      }
    });
    var userProfile = UserProfiles.findOne({email:coachMail});

    var s= UserProfiles.update(
      {_id:userProfile._id},{
      $set : {
        coachId:coachId,}
      },
      function(err){
        if(err){
          console.log(err);
        }
      });
    console.log(s);
    event.target.coachEmail.value='';
  }
});
