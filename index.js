'use strict';

var AlexaSkill = require('./AlexaSkill'),
    information = require('./information');

var APP_ID = "amzn1.ask.skill.7438d836-806c-41ec-958a-031969a6d481"; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var MyMazda = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
MyMazda.prototype = Object.create(AlexaSkill.prototype);
MyMazda.prototype.constructor = MyMazda;

MyMazda.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to My Mazda. You can ask a question like, when is my car due for a service ... Now, what can I help you with?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

MyMazda.prototype.intentHandlers = {
    "InformationIntent": function (intent, session, response) {
        var itemSlot = intent.slots.Item,
            itemName;
        if (itemSlot && itemSlot.value){
            itemName = itemSlot.value.toLowerCase();
        }

        var cardTitle = "Information about " + itemName,
            info = information[itemName],
            speechOutput,
            repromptOutput;
        if (info) {
            speechOutput = {
                speech: info,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, info);
        } else {
            var speech;
            if (itemName) {
                speech = "I'm sorry, I currently do not know the information for " + itemName + ". What else can I help with?";
            } else {
                speech = "I'm sorry, I currently do not know that information. What else can I help with?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "What else can I help with?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask questions such as, what's the information for, or, you can say exit... Now, what can I help you with?";
        var repromptText = "You can say things like, what's the information for, or you can say exit... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var myMazda = new MyMazda();
    myMazda.execute(event, context);
};
