Template.signupForm.events({
  "submit form" (event) {
    event.preventDefault();

    var target=event.target;
    var email = target.email.value;
    var password= target.password.value;

    var userId=Accounts.createUser({email:email, password:password});

    if(userId){
      var toInsert = {
                          user:userId,
                          createdAt : new Date(),
                          updatedAt : new Date(),
                          firstName: "",
                          lastName:"",
                          points:0,
                          address:{
                            street:"",
                            city:"",
                            zip:"",
                            country:"Belgium"
                          },
                          email:email,
                        };

      Meteor.call("insertUserProfile", toInsert, function(err,res){
        if(err){
          Materialize.toast("Echec lors de l'insertion du profil");
        } else{
          redirectionLogin();
        }
      });

      target.email.value="";
    } else {
      Materialize.toast("Un compte avec cette adresse e-mail existe déjà.");
    }
  }
});
