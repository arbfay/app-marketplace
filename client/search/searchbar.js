Template.searchbar.events({
  "submit .search" (event, template){
    event.preventDefault();

    var c=event.target.address.value;
    analytics.track("Search", {
      eventName: "Homepage",
    });
    event.target.address.value = '';
    FlowRouter.go('/search',{},{address:c});
  }
});

Template.searchbarForResults.events({
  "submit .search2" (event, template){
    event.preventDefault();

    var c = event.target.address.value;

    event.target.address.value = '';
    FlowRouter.go('/search',{},{address:c});

  }
});

Template.searchbarForResults.onRendered(function(){
  $("#address").val(FlowRouter.getQueryParam('address'));
});

Template.searchbarNav.events({
  "submit .search-bar-nav" (event, template){
    event.preventDefault();

    var c=event.target.address.value;
    analytics.track("Search", {
      eventName: "Homepage",
    });
    event.target.address.value = '';
    FlowRouter.go('/search',{},{address:c});
  }
});
