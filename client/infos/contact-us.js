
Template.contactUs.helpers({

});

Template.contactUs.events({
  "submit form": function(event, template){
     event.preventDefault();
     var t=event.target;
     var firstName = t.firstName.value;
     var lastName = t.lastName.value;
     var email = t.email.value;
     var subject = t.subject.value;
     var message = t.comments.value;

     var mail =  "Nom : "+lastName+"<br>"
               +"Prénom : "+firstName+"<br>"
               +"Email : "+email+"<br>"
               +"Message : "+message+"<br>";

     Meteor.call('sendMail', 'contact@trys.be', email, subject, mail,(err,res)=>{
       if(res){
         t.firstName.value = '';
         t.lastName.value='';
         t.email.value='';
         t.subject.value='';
         t.comments.value='';

         Materialize.toast("Message envoyé ! Nous vous recontacterons le plus vite possible.", 4000, 'rounded');
       }
       else {
         Materialize.toast("Il y a un problème avec le serveur. Réessayez plus tard.", 4000, 'rounded');
       }
     });
  }
});
