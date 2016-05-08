import { setExplanation, setDescription, getInput } from '../helpers/domHelpers';
export default class Adventure {
    constructor(options = {}) {
      //set up basic options
      const { playerName, inventory, worldState, gameState, log } = options;
      this.playerName = playerName || "Bringer";
      this.inventory = inventory || ['Notebook', 'Watch'];
      this.worldState = worldState || this.getInitialWorldState();
      this.gameState = gameState || this.getInitialGameState();

      //set up other properties
      this.log = log || []; //the player should be able to see a log of everything that has happened so far
      this.uniqueListeners = []; //functions looking for special listeners


      //set up event handlers
      getInput().addEventListener('keypress', this.onKeyPress.bind(this));

      //put some basic stuff in the dom
      this.setDescription(this.gameState.description);
      this.setExplanation(this.gameState.explanation);
    }

    //parse function: this is where the dumb magic happens
    parse(input) {
      if (!input) {
        return; //don't do anything if there's nothing in the box
      }

      this.addToLog(">: " + input); //log everything the player says to us

      //unique listeners are situational listeners. They should supersede our
      //basic listeners, so check those with the input first. They'll return
      //false if they can't use the input.
      let matchedUniqueListener = false;
      this.inputListeners.forEach((listener) => {
        if (!matchedUniqueListener) {
          const feedback = listener(input);
          if (feedback) {
            matchedUniqueListener = true;
          }
        }
      });

      //if we don't match a special listener, go back to basics

      if (!matchedInputListener) {
        console.log('i did not find a unique listener match');
        console.log('delegating to basic functions');

      }
    }


    //basic getters
    getName() {
      return this.playerName;
    }

    getInventory() {
      return this.inventory;
    }

    getWorldState() {
      return this.worldState;
    }

    //initialize stuff

    getInitialWorldState() {
      return {
        time: 0
      }
    }

    getInitialGameState() {
      return {
        description: "You are in a bedroom.",
        explanation: "Suggestions: use \"check\" to look around or \"inventory\" to see what you're carrying."
      }
    }

    //basic setters


    //log stuff

    addToLog(input) {
      this.log.push(input);
    }

    outputLog() {
      return this.log.join('\n');
    }

    //event handlers

    onKeyPress(e) {
      const {target, keyIdentifier} = e;
      if (keyIdentifier === "Enter") {
        this.parse(target.value);
        target.value = "";
      }
    }

    //dom stuff
    setExplanation(content) {
      setExplanation(content);
      this.addToLog(content);
    }

    setDescription(content) {
      setDescription(content);
      this.addToLog(content);
    }

    respondToNonsense() {
      const rand = Math.random();
      const nonsenseArr = [
        "What?",
        "Invalid command",
        "I don't know what that means",
        "Sorry, I don't understand"
      ];

      const index = Math.floor(nonsenseArr.length * rand);

      this.setExplanation(nonsenseArr[index]);
    }
}
