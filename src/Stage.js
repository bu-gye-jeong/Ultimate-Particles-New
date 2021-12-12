import Action from "./Action.js";
import drawCanvas from "./drawCanvas.js";

/**
 * @typedef StageOptions
 * @property {Action[]} actions
 */

class Stage {
  /**
   * @param {StageOptions} options 
   */
  constructor(options) {
    this.actions = options.actions.sort((a, b) => a.time - b.time);
    /** @type {boolean} */
    this.playing = false;
    /**
     * @typedef PlayingData
     * @property {number} time
     * @property {Map<string, import("./Particle.js").default>} particles
     * @property {number} actionIdx
     */
    /** @type {PlayingData} */
    this.playingData = {};
  }

  play() {
    this.playing = true;
    this.playingData = {
      time: 0,
      particles: new Map([]),
      actionIdx: 0
    };
  }

  tick(dt) {
    if (!this.playing) return;

    this.playingData.time += dt;

    let actionsToPerform = [];
    for (let i = this.playingData.actionIdx; i < this.actions.length; i++) {
      const action = this.actions[i];
      if (action.time > this.playingData.time) break;
      actionsToPerform.push(action);
      this.playingData.actionIdx++;
    }
    for (let i = 0; i < actionsToPerform.length; i++) {
      const action = actionsToPerform[i];
      action.perform(this);
    }

    drawCanvas(this);
  }

  stop() {
    this.playing = false;
  }

  /** @param {import("./Particle.js").default} particle */
  createParticle(particle) {
    if (
      !particle.id ||
      this.playingData.particles.has(particle.id)
    ) return;
    this.playingData.particles.set(particle.id, particle);
  }
}

export default Stage;