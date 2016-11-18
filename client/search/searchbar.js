Template.searchbar.events({
  "submit .search" (event, template){
    event.preventDefault();

    var c=event.target.address.value;

    if(c==="tai chi"){
        c="taiChi";
    }

    event.target.address.value = '';
    FlowRouter.go('/search',{},{address:c});
  }
});
