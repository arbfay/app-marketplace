Template.coachingPanel.helpers({

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
});

Template.coachingPanel.events({
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
});

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
});

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
