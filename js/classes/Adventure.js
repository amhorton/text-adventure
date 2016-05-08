export default class Adventure {
    constructor(options = {}) {
      const { playerName, inventory } = options;
      this.playerName = playerName || "Bringer";
      this.inventory = inventory || ['Memories'];
    }

    getName() {
      return this.playerName;
    }

    getInventory() {
      return this.inventory;
    }
}
