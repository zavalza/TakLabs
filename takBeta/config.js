//MongoDB
Jobs = new Meteor.Collection("jobs");
Companies = new Meteor.Collection("companies");
Tags = new Meteor.Collection("tags");

//File Storage in MongoDb using FS
var imageStore = new FS.Store.GridFS("images");
Images = new FS.Collection("images", {
  stores: [imageStore],
  filter: {
      allow: {
        contentTypes: ['image/*'] //allow only images in this FS.Collection
      }
    }
});

//Iron Router configuration, specify which templates are loaded under which path
Router.map(function() {
  this.route('welcome', {path: '/'});
  this.route('loginForm', {path: '/entrar'});
  this.route('newUserForm', {path: '/registro'});
  this.route('news', {path: '/noticias'});
  this.route('companies', {path: '/startups'});
  this.route('people', 
  {path: '/personas',
  waitOn: function() { return Meteor.subscribe('allUserProfiles')},
  });
  this.route('editCompany', {path: '/editarCompania'});
  this.route('editProfile', {path: '/editarPerfil'});
  this.route('userProfile', 
    {path: '/profile/:_id',
    waitOn: function()
    { 
      Session.set("userToShow", this.params._id);
      return Meteor.subscribe('userProfile', this.params._id);
    }
    });
  this.route('companyProfile', {path: '/company/:_id',
    waitOn: function()
    { 
      Session.set('screenshotToShow', "");
      Session.set("currentCompanyId", this.params._id);
      return Meteor.subscribe('companyProfile', this.params._id);
    }
    });
});
