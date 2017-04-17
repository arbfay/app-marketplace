Template.ambassadors.events({
  "submit form": function(event, template){
     event.preventDefault();
     var t=event.target;
     var firstName = t.firstName.value;
     var lastName = t.lastName.value;
     var email = t.email.value;
     var phone = t.phone.value;
     var city = t.city.value;
     var sports = t.sports.value;

     var mail =  "Nom : <b>"+lastName+"</b><br>"
               +"Prénom : <b>"+firstName+"</b><br>"
               +"Email : <b>"+email+"</b><br>"
               +"Phone : <b>"+phone+"</b><br>"
               +"Commune : <b>"+city+"</b><br>"
               +"Sports : <b>"+sports+"</b><br>";

     Meteor.call('sendMail', 'contact@trys.be', email, "Nouvel ambassadeur enregistré", mail);
     Meteor.call('sendMail', 'amine@trys.be', email, "Nouvel ambassadeur enregistré", mail,(err,res)=>{
       if(res){
         t.firstName.value = '';
         t.lastName.value='';
         t.email.value='';
         t.phone.value='';
         t.city.value='';
         t.sports.value='';

         Materialize.toast("Message envoyé ! Nous vous recontacterons le plus vite possible.", 4000, 'rounded');
         Meteor.call("newsletterSubscribe",email);
       }
       else {
         Materialize.toast("Il y a un problème avec le serveur. Réessayez plus tard.", 4000, 'rounded');
       }
     });

   }
});
