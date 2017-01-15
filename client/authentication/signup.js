Template.signupForm.events({
  "submit form" : (event)=>{
    event.preventDefault();

    var target=event.target;
    var email = target.email.value;
    var password= target.password.value;

    var userId=Accounts.createUser({email:email, password:password},function(err){
      if(err){
        console.log(err);
      } else {
        if(Meteor.userId()){

          var toInsert = {
                              user:Meteor.userId(),
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
              Materialize.toast("Bienvenue sur Trys !",4000,'rounded');
            } else{
              Materialize.toast("Echec lors de l'insertion du profil",4000,'rounded');
              redirectionLogin();
            }
          });
        } else {
          Materialize.toast("Un compte existe déjà avec cette adresse e-mail",4000,'rounded');
        }
      }
    });
  },
});
