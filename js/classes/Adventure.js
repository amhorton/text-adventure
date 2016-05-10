const keys = require('lodash.keys');
const extend = require('lodash.assignin');
const isFunction = require('lodash.isfunction');

import { setExplanation, setDescription, getInput } from '../helpers/domHelpers';
import { locations } from '../content-lists/locations';
import WorldState from './WorldState';
import GameState from './GameState';

export default class Adventure {
    constructor(options = {}) {
      //set up basic options
      const { playerName, inventory, worldState, gameState, description, explanation, log } = options;
      this.playerName = playerName || "Bringer";
      this.inventory = inventory || ['Notebook', 'Watch'];
      this.worldState = worldState || this.getInitialWorldState();
      this.gameState = gameState || this.getInitialGameState();
      this.description = description || this.getInitialDescription();
      this.explanation = explanation || this.getInitialExplanation();

      //set up other properties
      this.log = log || []; //the player should be able to see a log of everything that has happened so far
      this.uniqueListeners = []; //functions looking for special listeners


      //set up event handlers
      getInput().addEventListener('keypress', this.onKeyPress.bind(this));

      //put some basic stuff on the screen
      this.setDescription(this.description);
      this.setExplanation(this.explanation);
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
      this.uniqueListeners.forEach((listener) => {
        if (!matchedUniqueListener) {
          const feedback = listener(input);
          if (feedback) {
            matchedUniqueListener = true;
          }
        }
      });

      if (matchedUniqueListener) {
        return;
      }

      //if we don't match a special listener, go back to basics

      const split = input.split(' ');
      const command = split[0];
      const afterCommand = split.slice(1).join(' ');

      switch (command) {
        case "inventory":
          this.showInventory(afterCommand);
          break;
        case "check":
        case "examine":
          this.check(afterCommand);
          break;
        default:
          console.log('no match bruh');
      }

      return this; //maybe we'll want to chain?
    }

    //understanding interactables
    getCheckables() {
      const worldStateCheckables = this.worldState.getCheckables();
      const gameStateCheckables = this.gameState.getCheckables();

      return new Map([...worldStateCheckables, ...gameStateCheckables]);
    }

    getUseables() {

    }

    getTalkables() {

    }

    //responses

    showInventory(input) {
      const inventoryString = this.inventory.join('\n');
      let output = "Your inventory:" + inventoryString;
      this.setDescription(inventoryString);

    }

    check(input) {
      const checkResult = this.getCheckables().get(input);
      if (!checkResult) {
        this.setExplanation(`I can't check ${input}!`);
        return;
      }

      if (isFunction(checkResult)) {
        checkResult(adventure);
      } else {
        this.setExplanation(checkResult);
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

    getLocations() {
      return this.locations;
    }

    //initialize stuff

    getInitialWorldState() {
      return new WorldState({
        adventure : this,
        state : {
          time : 0
        }
      })
    }

    getInitialGameState() {
      return new GameState({
        adventure : this,
        state : {
          location : locations(this).get('Bedroom')
        }
      })
    }

    getInitialExplanation() {
      return "Suggestions: use \"check\" to look around or \"inventory\" to see what you're carrying."
    }

    getInitialDescription() {
      return "You are in a bedroom."
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
