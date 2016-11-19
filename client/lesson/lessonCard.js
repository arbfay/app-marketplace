

Template.lessonCard.events({
  "click #see": function(event, template){
     event.preventDefault();
     var id = this._id;

     var path =FlowRouter.path('/class/:lessonId',{lessonId : id},{});

     FlowRouter.go(path);
  }
});
