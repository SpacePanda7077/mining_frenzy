import { Scene } from "phaser";
import uniqid from "uniqid";
import { EventBus } from "../EventBus";
import { numberToBytes } from "viem";

export class Setup extends Scene {
    width: number;
    height: number;
    MenuContainer: any;
    playBtntext: Phaser.GameObjects.Text;
    playBtn: Phaser.GameObjects.Image;
    leaderBoardBtntext: Phaser.GameObjects.Text;
    leaderBoardBtn: Phaser.GameObjects.Image;
    marketBtntext: Phaser.GameObjects.Text;
    marketBtn: Phaser.GameObjects.Image;
    mintNewNFTButton: Phaser.GameObjects.Image;
    mintNewNFTContainer: Phaser.GameObjects.Container;
    constructor() {
        super("Setup");
    }
    preload() {}
    create() {
        const width = Number(this.game.config.width);
        const height = Number(this.game.config.height);

        this.add
            .text(width / 2, height / 2 - 300, "Setup Page !!")
            .setScale(2)
            .setOrigin(0.5);
        this.add
            .text(
                width / 2,
                height / 2 + 150,
                "NOTE: this is a debug setup page for the hackathon alone"
            )
            .setOrigin(0.5);
        EventBus.emit("current-scene-ready", this);
        EventBus.emit("setKey", this.scene.key);

        EventBus.on("Menu", () => {
            try {
                this.scene.start("Menu");
                EventBus.removeListener("Menu");
            } catch (err) {}
        });
    }
}

