Template.becomeCoach.events({
  "submit #form" : function(event){
    event.preventDefault();

    var t = event.target;
    var lastName = t.lastName.value;
    var firstName = t.firstName.value;
    var email = t.email.value;
    var phone = t.phone.value;
    var city = t.city.value;
    var category = t.cat.value;
    var password = t.password.value;

    var text = "Nom : "+lastName+"<br>"
              +"Prénom : "+firstName+"<br>"
              +"Email : "+email+"<br>"
              +"Telephone : "+phone+"<br>"
              +"Commune : "+city+"<br>"
              +"Discipline : "+category+"<br>";

    Meteor.call("sendMail","contact@trys.be",email,"Message/inscription d'un coach",text,
            (err,res)=>{
              if(err){
                Materialize.toast("Problème avec l'envoi de l'email : "+err,4000,'rounded');
              } else{
                Materialize.toast("Nous vous recontacterons aussi vite que possible !",4000,'rounded');
              }
            });

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
                          city:"",
                          zip:"",
                          country:"Belgium"
                        },
                        email:email,
                        phone:phone,
                      };
      Meteor.call("insertUserProfile", toInsert, function(err,res){
        if(err){
          Materialize.toast("Echec lors de l'insertion du profil, veuillez réessayer plus tard.", 4000, 'rounded');
        }
      });

    t.firstName.value = "";
    t.lastName.value='';
    t.email.value='';
    t.phone.value='';
    t.password.value='';
    t.city.value='';
  }
});
