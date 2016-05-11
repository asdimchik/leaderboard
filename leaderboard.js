/**
 * Created by dkrichilsky on 25/04/2016.
 */

PlayersList = new Mongo.Collection('players');

if(Meteor.isClient){
    Meteor.subscribe('thePlayers');

    Template.leaderboard.helpers({
        'player': function(){
            var currentUserId = Meteor.userId(); //отображать только тех players которых создал текущий пользователь
            return PlayersList.find({createdBy: currentUserId},
                                        {sort: {score: -1, name: 1}});
        },
        'count': function(){
          return PlayersList.find().count();
        },
        'selectedClass': function(){
            var playerId = this._id;
            var selectedPlayer = Session.get('selectedPlayer');
            if(playerId == selectedPlayer){
                return "selected";
            }
        },
        'selectedPlayer': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            return PlayersList.findOne({_id: selectedPlayer});
        }
    });

    Template.leaderboard.events({
        'click .player': function () {
            var playerId = this._id;
            Session.set('selectedPlayer', playerId);
        },
        'click .increment': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            Meteor.call('updateScore', selectedPlayer, 5);
        },
        'click .decrement': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            Meteor.call('updateScore', selectedPlayer, -5);
            //PlayersList.update({ _id: selectedPlayer}, {$inc: {score:-5}});
        },
        'click .remove': function (e){
            e.preventDefault();
            $('#messageRem').modal('show');
        },
        'click .yes-delete': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            Meteor.call('removePlayer', selectedPlayer);
        }
    });

    Template.addPlayerForm.events({
        'submit form': function(event){
            event.preventDefault();
            var playerNameVar = event.target.playerName.value;
            var playerScore = +event.target.playerScore.value;
            Meteor.call('createPlayer',playerNameVar,playerScore );
            event.target.playerName.value = "";
            event.target.playerScore.value = "";
        }
    })
}

if (Meteor.isServer) {
    Meteor.publish('thePlayers', function(){
        var currentUserId = this.userId;
        return PlayersList.find({createdBy: currentUserId});
    });
}

Meteor.methods({
    'createPlayer': function(playerNameVar, playerScore) {
        check(playerNameVar, String);
        var currentUserId = Meteor.userId(); //Id пользователя под которым был создан новый player
        if(currentUserId) {
            PlayersList.insert({
                name: playerNameVar,
                score: playerScore,
                createdBy: currentUserId
            });
        }
    },
    'removePlayer': function(selectedPlayer){
        check(selectedPlayer, String);
        var currentUserId = Meteor.userId();
        if(currentUserId) {
            PlayersList.remove({_id: selectedPlayer, createdBy: currentUserId});
        }
        $('#messageRem').modal('hide');
    },
    'updateScore': function(selectedPlayer, scoreValue){
        check(selectedPlayer, String);
        check(scoreValue, Number);
        var currentUserId = Meteor.userId();
        if(currentUserId) {
            PlayersList.update({_id: selectedPlayer, createdBy: currentUserId},
                {$inc: {score: scoreValue}});
        }
    }
});