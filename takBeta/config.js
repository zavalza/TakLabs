
Jobs = new Meteor.Collection("jobs");
Companies = new Meteor.Collection("companies");
Tags = new Meteor.Collection("tags");

//File Storage
var imageStore = new FS.Store.GridFS("images");
Images = new FS.Collection("images", {
  stores: [imageStore],
  filter: {
      allow: {
        contentTypes: ['image/*'] //allow only images in this FS.Collection
      }
    }
});

Router.map(function() {
  this.route('welcome', {path: '/'});
  this.route('loginForm', {path: '/entrar'});
  this.route('newUserForm', {path: '/registro'});
  this.route('news', {path: '/noticias'});
  this.route('startups', {path: '/startups'});
  this.route('people', {path: '/personas'});
  this.route('editCompany', {path: '/editarCompania'});
  this.route('editProfile', {path: '/editarPerfil'});
  this.route('userProfile', {path: '/algo'})
  this.route('companyProfile', {path: '/algomas'})
});
