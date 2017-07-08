import { Meteor } from 'meteor/meteor';
Tanyas= new Mongo.Collection('tanyas');
Meteor.startup(() => {
  // code to run on server at startup
});
//Publish and Subscribe
Meteor.publish("tanyas", function(){
	return Tanyas.find({
		$or : [ //when private is not equal to true or when it is not the owner
		   {private: {$ne: true} },
			{ owner: this.userId}
		]
	});
});
Meteor.methods({
	//For security of adding new resolutions
	addResolution: function(title){
			Tanyas.insert({  //saving the value
			title: title,
			createdAt: new Date(),
			owner: Meteor.userId()
		});
	},
	updateResolution: function(id, checked){
		var res = Tanyas.findOne(id);
		if(res.owner !== Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		Tanyas.update(id,{$set: {checked: checked}});
	},
	deleteResolution: function(id){
		var res = Tanyas.findOne(id);
		if(res.owner !== Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		Tanyas.remove(id);
	},
	setPrivate: function(id, private){
		var res = Tanyas.findOne(id); //findOne is mongo db method
		if(res.owner !== Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		Tanyas.update(id,{$set: {private: private}});
	}
});