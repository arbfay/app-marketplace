Template.becomeCoach.events({
  "submit #form" : function(event){
    event.preventDefault();

    var t = event.target;
    var lastName = t.lastName.value;
    var firstName = t.firstName.value;
    var email="";
    if(t.email.value){email=t.email.value;}
    var phone = t.phone.value;
    var city = t.city.value;
    var category = t.cat.value;
    var password="123";
    if(!Meteor.userId()){password=t.password.value;}

    var text = "Nom : "+lastName+"<br>"
              +"Prénom : "+firstName+"<br>"
              +"Email : "+email+"<br>"
              +"Telephone : "+phone+"<br>"
              +"Commune : "+city+"<br>"
              +"Discipline : "+category+"<br>";

    Meteor.call("sendMail","contact@trys.be",email,"Inscription d'un coach",text,
            (err,res)=>{
              if(err){
                Materialize.toast("Problème avec l'envoi de l'email : "+err,4000,'rounded');
              } else{
                Materialize.toast("Nous vous souhaitons la bienvenue sur Trys !",4000,'rounded');
              }
            });

    if(!Meteor.userId()){
      var userId=Accounts.createUser({email:email, password:password});
      var toInsert = {
                        user:userId,
                        createdAt : new Date(),
                        updatedAt : new Date(),
                        firstName: firstName,
                        lastName: lastName,
                        points:0,
                        address:{
                          street:"",
                          city:city,
                          zip:"",
                          country:"Belgium"
                        },
                        email:email,
                        phone:phone,
                      };
        Meteor.call("insertUserProfileForCoach", toInsert, function(err,res){
          if(err){
            Materialize.toast("Echec lors de l'insertion du profil, veuillez réessayer plus tard.", 4000, 'rounded');
          } else {
            Meteor.loginWithPassword(email,password);
          }
        });

        var coachMail = email;
        var shortDesc = "Professeur de "+category;

        var toInsert = {
          createdAt:new Date(),
          updatedAt:new Date(),
          userId:Meteor.userId(),
          email:coachMail,
          imgUrl:"",
          description : shortDesc,
        };

        var coachId = Meteor.call("insertCoach",toInsert,function(err,res){
          if(err){
            console.log("Erreur lors de l'insertion d'un coach : " + err);
            alert("Erreur lors de l'insertion d'un coach");
          } else{
            Materialize.toast('Visitez votre Coach Panel !', 4000, 'rounded');
            FlowRouter.go('/coaching/panel');
          }
        });
      }
      else {
        var coachMail = email;
        var shortDesc = "Professeur de "+category;

        var toInsert = {
          createdAt:new Date(),
          updatedAt:new Date(),
          userId:Meteor.userId(),
          email:coachMail,
          imgUrl:"",
          description : shortDesc,
        };

        var coachId = Meteor.call("insertCoach",toInsert,function(err,res){
          if(err){
            console.log("Erreur lors de l'insertion d'un coach : " + err);
            alert("Erreur lors de l'insertion d'un coach");
          } else{
            Materialize.toast('Visitez votre Coach Panel !', 4000, 'rounded');
            FlowRouter.go('/coaching/panel');
          }
        });
      }

      t.firstName.value = "";
      t.lastName.value='';
      t.email.value='';
      t.phone.value='';
      t.password.value='';
      t.city.value='';
  }
});


Template.becomeCoach.helpers({
  email : function(){
    if(Meteor.userId()){
      return Accounts.user().emails[0].address;
    } else {
      return '';
    }
  }
})
