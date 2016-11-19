
Template.contactUs.helpers({

});

Template.contactUs.events({
  "submit form": function(event, template){
     event.preventDefault();
     var t=event.target;
     var fullName = t.fullName.value;
     var email = t.email.value;
     var subject = t.subject.value;
     var message = t.message.value;

     var mail = 'De la part de ' + fullName +" .<br> " + message;

     Meteor.call('sendMail', 'contact@trys.be', email, subject, mail,(err,res)=>{
       if(res){
         t.fullName.value = '';
         t.email.value='';
         t.subject.value='';
         t.message.value='';

         Materialize.toast("Message envoyé ! Nous vous recontacterons le plus vite possible.", 4000, 'rounded');
       }
       else {
         Materialize.toast("Il y a un problème avec le serveur. Réessayez plus tard.", 4000, 'rounded');
       }
     });
  }
});
