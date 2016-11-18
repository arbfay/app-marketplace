Template.lessonPage.helpers({
  title: function(){
    var lessonId = FlowRouter.getParam('lessonId');
    var lesson = Lessons.findOne(lessonId);
    if (lesson){
      return lesson.title;
    } else {
      return "";
    }
  },
  longDesc: function(){
    var lessonId = FlowRouter.getParam('lessonId');

    var lesson = Lessons.findOne({_id:lessonId});
    if (lesson){
      return lesson.longDesc;
    } else {
      return "";
    }
  },
});


/*Template.lessonPage.onCreated(
    function(){
      var self = this;
      self.autorun(function(){
        var id = FlowRouter.getQueryParam('lessonId');
        self.subscribe('matchingLesson', id);
      });
    }
);*/
