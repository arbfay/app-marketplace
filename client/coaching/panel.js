Template.coachingPanel.helpers({
  coachProfile:function(){
    var coach = Coaches.findOne();

    var up = UserProfiles.findOne({email:coach.email});
    var address = up.address.street+ "," + up.address.zip + " " + up.address.city;
    var imgUrl = coach.imgUrl;
    if(coach.imgUrl==""){
      imgUrl="http://placehold.it/300/9e9e9e/000000?text=Photo";
    }

    return {
      firstName:up.firstName,
      lastName:up.lastName,
      address:address,
      email:coach.email,
      description:coach.description,
      imgUrl:imgUrl,
    };
  }

/*
  coachLessons : function(){
    //partant du principe que celui qui arrive sur cette page est forcement un coach
    var coachEmail =Accounts.user().emails[0].address;
    Meteor.subscribe("lessonsFromCoach",coachEmail)
    var l = Lessons.find({coachEmail:coachEmail}).fetch();

    if(l){
      return l;
    }
    else {
      return {};
    }
  },
  title : function(){
    var lessonId = Session.get('lessonId');
    var lesson = Lessons.findOne(lessonId);

    return lesson.title;
  },
  dateTime : function(){
    var lessonId = Session.get('lessonId');
    var lesson = Lessons.findOne(lessonId);
    var mom = moment(lesson.date);
    return mom.format("ddd DD MMM, HH:mm");
  }
  */
});

Template.coachingPanel.events({
  /*
  "click .probBtn" : function(event,template){
    event.preventDefault();

    swal("Pas encore disponible",
    "Pour l'instant, vous pouvez utiliser notre formulaire de contact pour nous joindre");
  },
  "click .addBtn" : function(event,template){
    event.preventDefault();

    swal("Pas encore disponible",
    "Pour l'instant, vous pouvez utiliser notre formulaire de contact pour nous joindre");
  },
  "click .editBtn" : function(event,template){
    event.preventDefault();

    swal("Pas encore disponible",
    "Pour l'instant, vous pouvez utiliser notre formulaire de contact pour nous joindre");
  }
  */
});

/*
Template.attendingListTemplate.helpers({
  users: function(){
    var lessonId=Session.get('lessonId');
    var aL = Lessons.findOne(lessonId).attendeesList;
    Meteor.subscribe('attendessListById', aL);

    var res = AttendeesList.findOne(aL).users;
    if(res){
      return res;
    } else {
      return {};
    }
  },
  nonUsers : function() {
    var lessonId=Session.get('lessonId');
    var aLId = Lessons.findOne(lessonId).attendeesList;
    var res = AttendeesList.findOne(aLId).nonUsers;
    if(res){
      return res;
    } else {
      return [];
    }
  },
  firstName : function(){
    var email = this.email;
    Meteor.subscribe('namesOfUser',email);
    var user = UserProfiles.findOne({email:email});

    return user.firstName;
  },
  firstNameNonUser : function(){
    return this.firstName;
  },
  lastName : function(){
    var email = this.email;
    var user = UserProfiles.findOne({email:email});

    return user.lastName;
  },
  lastNameNonUser : function(){
    return this.lastName;
  },
  birthdate : function(){
    var email = this.email;
    var user = UserProfiles.findOne({email:email});

    var bd = user.birthdate;
    var mom = moment(bd);
    return mom.format("D/M/YYYY");
  },
  canGiveBonus: function(){
    var email = this.email;
    var user = UserProfiles.findOne({email:email});
    var lessonId=Session.get('lessonId');
    var lesson = Lessons.findOne(lessonId);
    var lessonDate = lesson.date;
    var date = moment();
    var now = date.valueOf();

    var alreadyHadThisBonus = false;
    if(user.bonus){
      function rightB (bonus){
        if(bonus.lessonId === lesson._id && bonus.gotIt == true){
          return true;
        }else{
          return false;
        }
      }
      var t = user.bonus.find(rightB);
      if(t){
        alreadyHadThisBonus = true;
      }
    }
    if(now <= (lessonDate + 3600000) && !alreadyHadThisBonus){
      return true;
    } else {
      return false;
    }

  },
  emailNonUser : function(){
    return this.email;
  },
  commentNonUser : function(){
    return this.comment;
  }
});

Template.attendingListTemplate.events({
  "click .giveBonus" : function(event){
    event.preventDefault();
    var email = this.email;
    var user = UserProfiles.findOne({email:email});
    var lessonId=Session.get('lessonId');

    Meteor.call("addBonus","bonbon", user.email,lessonId, function(err,res){
      if(err){
        Materialize.toast("Il y a eu une erreur lors de l'octroi du bonus. Veuillez réessayer plus tard.", 5000,'rounded');
      } else {
        Materialize.toast("Bonus octroyé !", 4000,'rounded');
      }
    });
  },
  "click .addAttendeeModalButton" : function(event){
    event.preventDefault();
    $('#modalFormNewAttendee').openModal();

  },
  "click .btnModal":function(event){
    event.preventDefault();
    var lessonId=Session.get('lessonId');
    var aL = Lessons.findOne(lessonId).attendeesList;

    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var email = $("#email").val();
    var comment = $("#comment").val();

    if(!email){
      email ="";
    }

    if(!comment){
      comment="";
    }

    var data={
      firstName:firstName,
      lastName:lastName,
      email:email,
      comment:comment,
      createdAt:new Date()
    };

    Meteor.call('addNonUserAttendee', lessonId, aL, data, function(err){
      if(err){
        Materialize.toast("Il y a eu une erreur lors de l'insertion. Veuillez réessayer plus tard.", 5000, 'rounded');
      } else {
        Materialize.toast("Participant ajouté !",5000,'rounded');
      }
    });

    $("#firstName").val('');
    $("#lastName").val('');
    $("#email").val('');
    $("#comment").val('');
  },
  "submit form" : function(event){
    event.preventDefault();
    Materialize.toast("OK", 5000, 'rounded');

    var lessonId=Session.get('lessonId');
    var aL = Lessons.findOne(lessonId).attendeesList;

    var firstName = event.target.firstName.value;
    var lastName = event.target.lastName.value;
    var email = event.target.email.value;
    var comment = event.target.comment.value;

    if(!email){
      email ="";
    }

    if(!comment){
      comment="";
    }

    var data={
      firstName:firstName,
      lastName:lastName,
      email:email,
      comment:comment,
    };

    Meteor.call('addNonUserAttendee', lessonId, aL, data, function(err){
      if(err){
        Materialize.toast("Il y a eu une erreur lors de l'insertion. Veuillez réessayer plus tard.", 5000, 'rounded');
      } else {
        Materialize.toast("Participant ajouté !",5000,'rounded');
      }
    });

    event.target.firstName.value = '';
    event.target.lastName.value = '';
    event.target.email.value='';
    event.target.comment.value='';
    $('#modalFormNewAttendee').closeModal();
  }
}); */

/*
Template.coachingLessonItem.events({
  "click a" : function(event){
    event.preventDefault();
    console.log('Before : ' +Session.get('lessonId'));
    Session.set('lessonId', this._id);
    console.log('After : ' +Session.get('lessonId'));
  }
});

Template.coachingLessonItem.helpers({
  dateForHuman : function(){
    var mom = moment(this.date);
    return mom.format("ddd DD MMM, HH:mm");
  }
});
*/

Template.coachingProfile.events({
  "submit #updateCoachProfile" : function(event,template){
    event.preventDefault();

    var t = event.target;
    var firstName = t.firstName.value;
    var lastName = t.lastName.value;
    var street = t.street.value;
    var zip = t.zip.value;
    var city = t.city.value;

    var upData = {
      firstName :firstName,
      lastName : lastName,
      address : {
        street : street,
        zip : zip,
        city : city,
      },
      updatedAt: new Date()
    };
    var coach = Coaches.findOne();
    var up = UserProfiles.findOne({email:coach.email});

    Meteor.call("updateUserProfile", up._id, upData, function(error, result){
      if(error){
        console.log("error", error);
      }
    });

    var description = t.description.value;

    var coachData = {
      description :description,
      updatedAt : new Date()
    };

    Meteor.call("updateCoach", coach._id, coachData, function(error, result){
      if(error){
        console.log("error", error);
      } else {
        Materialize.toast('Modifications enregistrées !', 4000, 'rounded');
      }
    });

  }
});

Template.pastLessons.helpers({
    lessons:function(){
      if(!Accounts.user()){ return [];}
      var coachEmail =Accounts.user().emails[0].address;
      Meteor.subscribe("lessonsFromCoach",coachEmail, function(err,res){
        if(err){Materialize.toast("Une erreur s'est produite dans le serveur.", 4000, 'rounded');}
      });
      var dateNow = new Date();
      var now = dateNow.getTime() - 5000;
      var l = Lessons.find({coachEmail:coachEmail,
                            date:{$lt:now}
                          },{sort : {date : 1}});
      if(l){
        return l;
      }
      else {
        return [];
      }
    },
    dateTime:function(){

        var mom = moment(this.date);
        return mom.format("ddd DD MMM, HH:mm");
    }
});

Template.futureLessons.helpers({
    lessons:function(){
      if(!Accounts.user()){ return [];}
      var coachEmail =Accounts.user().emails[0].address;
      var dateNow = new Date();
      var now = dateNow.getTime();
      var l = Lessons.find({coachEmail:coachEmail,
                            date:{$gt:now}
                          },{sort : {date : -1}});
      if(l){
        return l;
      }
      else {
        return [];
      }
    },
    dateTime:function(){

        var mom = moment(this.date);
        return mom.format("ddd DD MMM, HH:mm");
    }
});

Template.coachingClients.helpers({
  clients : function(){

    var coach = Coaches.findOne();
    var coachId="";
    if(coach){coachId = coach._id;}

    Meteor.subscribe('coachClients',coachId,
      function(err,res){
        if(err){
          Materialize.toast('Erreur avec les cartes');
          console.log(err);
        }
      }
    );

    return Clients.find();
  },
  coachCards : function(){
    var coach = Coaches.findOne();
    var coachId="";
    if(coach){coachId = coach._id;}


    Meteor.subscribe('coachCards',coachId,
      function(err,res){
        if(err){
          Materialize.toast('Erreur avec les cartes');
          console.log(err);
        }
      }
    );

      var res = CoachCards.find().fetch();
      if(res){
        var html= '';
        for(var i = 0; i<res.length;i++){
          html += '<option value="'+res[i]._id+'">'+res[i].name+'</option>';
        }

        $('#selectCoachCards').append(html);
        $('#selectCoachCards').material_select();
      }
    },
});

Template.coachingClients.events({
  "submit #addCoachingClient" : function(event){
    event.preventDefault();

    var t = event.target;

    var firstName = t.firstName.value;
    var lastName = t.lastName.value;
    var email = t.email.value;
    var tel = t.tel.value;
    var cardId = t.card.value;

    var coachId = Coaches.findOne()._id;

    var data = {
      firstName:firstName,
      lastName:lastName,
      email : email,
      tel : tel,
      coachId : coachId,
      card : cardId,
      createdAt : new Date (),
      updatedAt : new Date(),
    };

    Meteor.call('insertClient', data , function(err,res){
      if(err){
        console.log("erreur lors de l'insert d'un nouveau client : ",err);
      } else {
        Materialize.toast('Nouveau client ajouté',4000,'rounded');
      }
    });

    t.firstName.value ="";
    t.lastName.value='';
    t.email.value='';
    t.tel.value='';
    t.tel.value='0';
  },
  "submit .updateClientForm" : function(event,template){
    event.preventDefault();

    var t = event.target;

    var firstName = t.firstName.value;
    var lastName = t.lastName.value;
    var email = t.email.value;
    var tel = t.tel.value;

    var coachId = Coaches.findOne()._id;

    var data = {
      firstName:firstName,
      lastName:lastName,
      email : email,
      tel : tel,
      coachId : coachId,
      updatedAt : new Date()
    };

    var clientId = this._id;

    Meteor.call('updateClient',clientId, data, function(err,res){
      if(err){
        console.log(err);
      } else {
        Materialize.toast('Client mis à jour.', 4000, 'rounded');
      }
    });
  },
  "click .deleteClient" : function(event, template){
    event.preventDefault();
    var clientId=this._id;
    swal({
      title: "Êtes-vous certain(e) ?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Effacer",
      cancelButtonText: "Annuler",
      closeOnConfirm: false,
    },
    function(){
        swal("Effacé!", "Le client a été effacé", "success");
        Meteor.call('removeClient', clientId);
    });
  },
  "click .addCardToClient" : function(event){
    event.preventDefault();

    var clientId=this._id;
    var res = CoachCards.find().fetch();
    var r1; var r2;

    if(res){
      var options= {};
      for(var i = 0; i<res.length;i++){
        r1 = res[i]._id;
        r2 = res[i].name;
        options[r1]=r2;
      }

            
      swal({
      title: 'Input something',
      input: 'text',
      showCancelButton: true,
      inputValidator: function (value) {
        return new Promise(function (resolve, reject) {
          if (value) {
            resolve()
          } else {
            reject('You need to write something!')
          }
        })
      }
      }).then(function (result) {
      swal({
        type: 'success',
        html: 'You entered: ' + result
      })
      })
    }
  }
});

Template.coachingCards.helpers({
  cards : function(){
    var coach = Coaches.findOne();
    var coachId="";
    if(coach){coachId = coach._id;}

    Meteor.subscribe('coachCards',coachId,
      function(err,res){
        if(err){
          Materialize.toast('Erreur avec les cartes');
          console.log(err);
        }
      }
    );

    return CoachCards.find();
  },
});

Template.clientCard.helpers({
  dateTime:function(){
      var mom = moment(this.expirationDate);
      return mom.format("ddd DD MMM YYYY");
  }
});

Template.coachingCards.events({
  "submit #addCoachingCard" : function(event,template){
    event.preventDefault();
    var t = event.target;

    var name = t.name.value;
    var maxAttendings = t.maxAttendings.value;
    var duration = t.duration.value;
    var price = t.price.value;

    var coach = Coaches.findOne();
    var coachId=coach._id;

    if(CoachCards.findOne({name:name})){
      Materialize.toast('Il y a déjà une carte avec ce nom !', 4000, 'rounded');
    }
    else {
      CoachCards.insert({
          name:name,
          duration:duration,
          price:price,
          maxAttendings:maxAttendings,
          coachId:coachId,
      });

      t.name.value='';
      t.maxAttendings.value='';
      t.duration.value='';
      t.price.value='';
    }
  }
});
