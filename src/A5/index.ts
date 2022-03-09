import { defer, Observable, repeat, Subscription } from "rxjs";
import * as inquirer from "inquirer";

type Model = {
  iterationCount: number
  isOrange: boolean
};

type Action = {
  color: string;
};

type CMD = {
  value: string 
}

const newAction = (color: string): Action => ({ color });

class IsOrange {
  modelHistory: Model[] = [];
  constructor(initalState: Model, actionSource: Observable<CMD>) {
    this.init(initalState)
    this.modelHistory.push(initalState);
    const subscription = actionSource.subscribe((cmd) => {
      const latestModel = this.modelHistory[this.modelHistory.length - 1];
      const newModel = this.update(latestModel, newAction(cmd.value));
      this.modelHistory.push(newModel);
    });
    setTimeout(() => subscription.unsubscribe(), 100000);
  }
  
  init(model: Model){
    this.view(model);
  }

  view(model: Model): void {
    if (model.isOrange) {
      console.log("This color is orange!", "iteration: ", model.iterationCount);
    } else {
      console.log(
        "This color is not orange!",
        "iteration: ",
        model.iterationCount
      );
    }
  }

  reducer(model: Model, action: Action): Model {
    console.log("rducer");
    return {
      isOrange: action.color === "FFA500",
      iterationCount: model.iterationCount + 1,
    };
  }

  update(model: Model, action: Action): Model {
    const newModel = this.reducer(model, action);
    this.view(newModel);
    return newModel;
  }
}

const source = defer(() =>
  inquirer.prompt([
    {
      type: "input",
      name: "value",
      message: "Enter a hex code :",
    },
  ])
);

const actionSource = source.pipe(repeat());

new IsOrange({ isOrange: false, iterationCount: 0 }, actionSource)

// In react it would look like initial 
// 1. Create initial state
// 2. React render initial state
// 3. User create action
// 4. Reducer create new state based on current state and user action
// 5. React render new state
// Using redux in HeyAuto can be identified as FRP
// If we have more than one action, partial function applicaiton can be applied in the app.
// Update function can be composition of reducer function, action creation function