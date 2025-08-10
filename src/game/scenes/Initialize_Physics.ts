import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import RAPIER from "@dimforge/rapier2d-compat";

export class Initialize extends Scene {
    world: RAPIER.World;
    constructor() {
        super("Initialize");
    }
    preload() {}
    async create() {
        await this.initialize_Physics();
        EventBus.emit("current-scene-ready", this);
    }
    // update(time: number, delta: number): void {
    //     if (this.world) {
    //         this.scene.start("Game", this.world);
    //     }
    // }

    async initialize_Physics() {
        await RAPIER.init();
        const gravity = { x: 0, y: 200 / (0.5 * 0.5) };
        //this.world = new RAPIER.World(gravity);
        if (!this.registry.has("RAPIER")) {
            this.registry.set("RAPIER", RAPIER);
        }
        this.scene.start("Game");
    }
}

