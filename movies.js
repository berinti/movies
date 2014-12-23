if (Meteor.isClient) {
	Template.body.helpers({
		movies: [
			{ text: "Teenage Mutant Ninja Turtles" } ,
			{ text: "The Maze Runner" } ,
			{ text: "The Skeleton Twins" }
		]
	});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
