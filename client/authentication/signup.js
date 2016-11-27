Template.signupForm.events({
  "submit form" (event) {
    event.preventDefault();

    var target=event.target;
    var email = target.email.value;
    var password= target.password.value;

    var userId=Accounts.createUser({email:email, password:password});

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
        Materialize.toast("Faites du bien à votre corps !", 4000, 'rounded');
      }
    });

    target.email.value="";
    target.password.value="";
    FlowRouter.go('/');
  }
});
