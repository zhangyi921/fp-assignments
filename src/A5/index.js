"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var inquirer = require("inquirer");
var newAction = function (color) { return ({ color: color }); };
var IsOrange = /** @class */ (function () {
    function IsOrange(initalState, actionSource) {
        var _this = this;
        this.render(initalState);
        actionSource.subscribe(function (cmd) { return _this.update(initalState, newAction(cmd.value)); });
    }
    IsOrange.prototype.render = function (model) {
        if (model.isOrange) {
            console.log('This color is orange!', model.iterationCount);
        }
        else {
            console.log('This color is not orange!', model.iterationCount);
        }
    };
    IsOrange.prototype.reducer = function (model, action) {
        console.log('rducer');
        return {
            isOrange: action.color === '123',
            iterationCount: model.iterationCount + 1,
            subscriptions: subscriptions
        };
    };
    IsOrange.prototype.update = function (model, action) {
        var newModel = this.reducer(model, action);
        console.log(model, newModel);
        this.render(newModel);
    };
    return IsOrange;
}());
var IsOrange2 = /** @class */ (function () {
    function IsOrange2(actionSource) {
        var _this = this;
        this.actionSource = actionSource;
        var initalState = {
            isOrange: false,
            iterationCount: 0,
            subscriptions: [this.actionSource.subscribe(function (cmd) { return _this.update(initalState, newAction(cmd.value)); })]
        };
        this.render(initalState);
    }
    IsOrange2.prototype.render = function (model) {
        if (model.isOrange) {
            console.log('This color is orange!', model.iterationCount);
        }
        else {
            console.log('This color is not orange!', model.iterationCount);
        }
    };
    IsOrange2.prototype.reducer = function (model, action) {
        var _this = this;
        console.log('rducer');
        model.subscriptions[0].unsubscribe();
        return {
            isOrange: action.color === '123',
            iterationCount: model.iterationCount + 1,
            subscriptions: [this.actionSource.subscribe(function (cmd) { return _this.update(model, newAction(cmd.value)); })]
        };
    };
    IsOrange2.prototype.update = function (model, action) {
        var newModel = this.reducer(model, action);
        console.log(model, newModel);
        this.render(newModel);
    };
    return IsOrange2;
}());
var processCommand = function (cmd) { return console.log(cmd); };
var source = (0, rxjs_1.defer)(function () {
    return inquirer.prompt([
        {
            type: "input",
            name: "value",
            message: "Enter a hex code :"
        },
    ]);
});
var example = source.pipe((0, rxjs_1.repeat)());
new IsOrange({ iterationCount: 0, isOrange: false }, example);
// const subscription = example.subscribe((cmd) => processCommand(cmd));
// Unsubscribe/kill after a duration
// setTimeout(() => subscription.unsubscribe(), 100000);
