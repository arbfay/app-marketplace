

Template.lessonCard.events({
  "click .card" : (event,template) => {
    event.preventDefault();
    var id = template.data._id;


    var path =FlowRouter.path('/class/:lessonId',{lessonId : id},{});

    FlowRouter.go(path);
  }
});

Template.lessonCard.helpers({
  path:function(){
    return "/class/"+this._id;
  },
  euro:function(){
    console.log(this);
    var res="€";

    if(this.price > 12){
      res = "€€";
    }else if (this.price > 16) {
      res = "€€€";
    }

    return res;
  },
  distance:function(){
    //Time from now
    var mom = moment(this.date);
    var str= mom.fromNow();
    return str;
  },
  dateForHuman : function(){
    var d = this.date;
    var mom = moment(d);
    var str=mom.format("ddd DD MMM");
    return str;
  },
  timeForHuman : function(){
    var d = this.date;
    var mom = moment(d);
    var str=mom.format("HH:mm");
    return str;
  }
});

Template.lessonCard2.helpers({
  path:function(){
    return "/class/"+this._id;
  },
  distance:function(){
    //Time from now
    var mom = moment(this.date);
    var str= mom.fromNow();
    return str;
  },
  dateForHuman : function(){
    var d = this.date;
    var mom = moment(d);
    var str=mom.format("DD");
    return str;
  },
  timeForHuman : function(){
    var d = this.date;
    var mom = moment(d);
    var str=mom.format("HH:mm");
    return str;
  },
  dayForHuman:function(){
    var d = this.date;
    var mom = moment(d);
    var str=mom.format("ddd");
    return str;
  },
  monthForHuman:function(){
    var d = this.date;
    var mom = moment(d);
    var str=mom.format("MMM");
    return str;
  },
  city :function(){
    var address = this.address;
    var splitted = address.split(" ");
    var city = splitted[splitted.length - 1];
    return city;
  },
  coachName : function(){
    Meteor.subscribe("userNames", this.coachEmail);
    var profile = UserProfiles.findOne({email:this.coachEmail});
    return profile.firstName+" "+profile.lastName;
  },
  coachImgUrl : function(){
    Meteor.subscribe("coachBasics", this.coachEmail);
    var coach = Coaches.findOne({email:this.coachEmail});
    return coach.imgUrl;
  }
});

Template.lessonCard2.events({
  "click .card-lesson-title" : (event,template) => {
    event.preventDefault();
    var id = template.data._id;

    var path =FlowRouter.path('/class/:lessonId',{lessonId : id},{});

    FlowRouter.go(path);
  }
});
