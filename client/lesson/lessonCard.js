

Template.lessonCard.events({
  "click #see": function(event, template){
     event.preventDefault();
     var id = this._id;

     var path =FlowRouter.path('/class/:lessonId',{lessonId : id},{});

     FlowRouter.go(path);
  }
});

Template.lessonCard.helpers({
  path:function(){
    return "/class/"+this._id;
  },
  euro:function(){
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
    var str=mom.format("ddd DD MMM, HH:mm");
    return str;
  }
});
