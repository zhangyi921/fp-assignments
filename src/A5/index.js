"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var inquirer = require("inquirer");
var newAction = function (color) { return ({ color: color }); };
var IsOrange = /** @class */ (function () {
    function IsOrange(initalState, actionSource) {
        var _this = this;
        this.modelHistory = [];
        this.init(initalState);
        this.modelHistory.push(initalState);
        var subscription = actionSource.subscribe(function (cmd) {
            var latestModel = _this.modelHistory[_this.modelHistory.length - 1];
            var newModel = _this.update(latestModel, newAction(cmd.value));
            _this.modelHistory.push(newModel);
        });
        setTimeout(function () { return subscription.unsubscribe(); }, 100000);
    }
    IsOrange.prototype.init = function (model) {
        this.view(model);
    };
    IsOrange.prototype.view = function (model) {
        if (model.isOrange) {
            console.log("This color is orange!", "iteration: ", model.iterationCount);
        }
        else {
            console.log("This color is not orange!", "iteration: ", model.iterationCount);
        }
    };
    IsOrange.prototype.reducer = function (model, action) {
        console.log("rducer");
        return {
            isOrange: action.color === "FFA500",
            iterationCount: model.iterationCount + 1
        };
    };
    IsOrange.prototype.update = function (model, action) {
        var newModel = this.reducer(model, action);
        this.view(newModel);
        return newModel;
    };
    return IsOrange;
}());
var source = (0, rxjs_1.defer)(function () {
    return inquirer.prompt([
        {
            type: "input",
            name: "value",
            message: "Enter a hex code :"
        },
    ]);
});
var actionSource = source.pipe((0, rxjs_1.repeat)());
new IsOrange({ isOrange: false, iterationCount: 0 }, actionSource);
