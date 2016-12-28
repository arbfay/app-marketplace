Template.coachInsert.events({
  "submit form" (event){
    event.preventDefault();

    var coachMail = event.target.coachEmail.value;
    var imgUrl = event.target.imgUrl.value;
    var shortDesc = event.target.shortDesc.value;

    Meteor.subscribe('userByMail',""+coachMail);


    var userCoach = Meteor.users.findOne({'emails.address':coachMail});
    console.log(userCoach);

    var toInsert = {
      createdAt:new Date(),
      updatedAt: new Date(),
      userId:userCoach._id,
      email:coachMail,
      imgUrl:imgUrl,
      description : shortDesc,
    };

    var coachId = Meteor.call("insertCoach",toInsert,function(err,res){
      if(err){
        console.log("Erreur lors de l'insertion d'un coach : " + err);
        alert("Erreur lors de l'insertion d'un coach");
      } else{
        Materialize.toast('Nouveau coach enregistré !', 4000, 'rounded');
      }
    });


    event.target.coachEmail.value='';
  }
});
