insertUP=function(userId,email, fN, lN){
  if(Meteor.userId()){

    var toInsert = {
                        user:Meteor.userId(),
                        createdAt : new Date(),
                        updatedAt : new Date(),
                        firstName: fN,
                        lastName: lN,
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
        Materialize.toast("Echec lors de l'insertion du profil",4000,'rounded');
      } else{
        Materialize.toast("Bienvenue sur Trys !",4000,'rounded');
        redirectionLogin();
      }
    });
  }
};


Template.signupForm.events({
  "click .fb-auth" : (event)=>{
      event.preventDefault();
      Meteor.loginWithFacebook({
        requestPermissions: ['public_profile', 'email']
      }, (err) => {
        if (err) {
          Materialize.toast("Echec de connexion à Facebook.",4000,'rounded');
          console.log(err);
        } else {
          if(Meteor.userId()){
            var account = Meteor.users.findOne(Meteor.userId()).services.facebook;
            var e = account.email;
            var fN = account.first_name;
            var lN = account.last_name;
          } else { var e = "contact@trys.be";
            var fN ="";
            var lN="";
          }

          if(UserProfiles.findOne(Meteor.userId())){
            Materialize.toast("Bienvenue sur Trys !",4000,'rounded');
            redirectionLogin();
          }
          else {insertUP(Meteor.userId(),e, fN, lN);}
        }
      });
  },
  "submit form" : (event)=>{
    event.preventDefault();

    var target=event.target;
    var email = target.email.value;
    var password= target.password.value;

    var userId=Accounts.createUser({email:email, password:password},function(err){
      if(err){
        console.log(err);
      } else {
        inserUP(Meteor.userId(),email,"","");
      }
    });
  },
})
