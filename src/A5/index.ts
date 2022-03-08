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
    const subscription = actionSource.subscribe((cmd) => {
      const latestModel = this.modelHistory[this.modelHistory.length - 1];
      const newModel = this.update(latestModel, newAction(cmd.value));
      this.modelHistory.push(newModel);
    });
    setTimeout(() => subscription.unsubscribe(), 100000);
  }
  
  init(model: Model){
    this.modelHistory.push(model);
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
