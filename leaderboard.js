/**
 * Created by dkrichilsky on 25/04/2016.
 */

PlayersList = new Mongo.Collection('players');

if(Meteor.isClient){
    Template.leaderboard.helpers({
        'player': function(){
            return PlayersList.find({}, {sort: {score: -1, name: 1}});
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
            var selectedPlayer = Session.get('selectedPlayer'); //по нажатию кнопки вызывается сессия и передается в консоль значение ID
            PlayersList.update({ _id: selectedPlayer}, {$inc: {score:5}}); //изменяем значени в БД, первый аргумент ищет по id кого хотим изменть, 2й документ какое поле на какое значение
        },
        'click .decrement': function(){
            var selectedPlayer = Session.get('selectedPlayer'); //по нажатию кнопки вызывается сессия и передается в консоль значение ID
            PlayersList.update({ _id: selectedPlayer}, {$inc: {score:-5}}); //изменяем значени в БД, первый аргумент ищет по id кого хотим изменть, 2й документ какое поле на какое значение
        }
    });
}

if (Meteor.isServer) {
}