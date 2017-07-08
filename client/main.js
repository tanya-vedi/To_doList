import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
Tanyas= new Mongo.Collection('tanyas');
Meteor.subscribe("tanyas");
Template.body.helpers({
 tanyas: function()
 {  if (Session.get('hideFinished')){
	 return Tanyas.find({checked: {$ne: true}}); //as long as checked is not equal to true, it's going to go ahead and find one of these resolutions
	}
	else {
		return Tanyas.find();
	}
	 
 },
hideFinished: function(){
	return Session.get('hideFinished');
}
});
Template.body.events({
	'submit .new-resolution':function(event){
		var title = event.target.title.value; //grabing the value
		Meteor.call("addResolution", title);
		event.target.title.value = ""; //deleting the previous value
		return false;﻿                  //makes sure that the page doesn't refresh
	},
	'change .hide-finished': function(event){
		Session.set('hideFinished', event.target.checked); // to be set to the value as second parameter
	}
}); 
Template.tanya.helpers({
	isOwner: function(){
		//to check whether of the resolution is the current owner
		 return this.owner == Meteor.userId();
	}
});
Template.tanya.events({
	'click .toggle-checked': function(){
		Meteor.call("updateResolution",this._id, !this.checked); //update the position if checked
	} ,
	'click .delete':function(){
		Meteor.call("deleteResolution", this._id);
	},
	'click .toggle-private': function(){
		Meteor.call("setPrivate", this._id, !this.private);
	}
});
Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY"
});
