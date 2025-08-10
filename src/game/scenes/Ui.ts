import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import RAPIER from "@dimforge/rapier2d-compat";

export class UI extends Scene {
    width: number;
    height: number;
    UI_Container: Phaser.GameObjects.Container;
    button: Phaser.GameObjects.Sprite;
    winnerContainer: Phaser.GameObjects.Container;
    frame: Phaser.GameObjects.Sprite;
    homeBtn: Phaser.GameObjects.Sprite;
    playBtn: Phaser.GameObjects.Sprite;
    banner: Phaser.GameObjects.Sprite;
    winnerText: Phaser.GameObjects.Text;
    claimBtn: Phaser.GameObjects.Sprite;
    LoserContainer: Phaser.GameObjects.Container;
    LoserText: Phaser.GameObjects.Text;
    timer: Phaser.GameObjects.Text;
    SpreadBombButton: Phaser.GameObjects.Sprite;
    DrillBombButton: Phaser.GameObjects.Sprite;
    SpreadBombAmount: Phaser.GameObjects.Text;
    DrillBombAmount: Phaser.GameObjects.Text;
    LocatorButton: Phaser.GameObjects.Sprite;
    LocatorAmount: Phaser.GameObjects.Text;
    constructor() {
        super("UI");
    }
    preload() {
        this.load.setPath("assets");
    }
    async create() {
        this.width = Number(this.game.config.width);
        this.height = Number(this.game.config.height);
        this.UI_Container = this.add.container(this.width / 2, this.height / 2);
        this.LocatorButton = this.add
            .sprite(250, -200, "button")
            .setScale(2)
            .setInteractive()
            .on("pointerdown", () => {
                const gameScene: any = this.scene.get("Game");
                gameScene.player.activatePickup("Locator");
            });
        this.LocatorAmount = this.add.text(270, -190, "0").setColor("black");
        this.SpreadBombButton = this.add
            .sprite(250, -100, "button")
            .setScale(2)
            .setInteractive()
            .on("pointerdown", () => {
                const gameScene: any = this.scene.get("Game");
                gameScene.player.activatePickup("SpreadBomb");
            });
        this.SpreadBombAmount = this.add.text(270, -90, "0").setColor("black");
        this.DrillBombButton = this.add
            .sprite(250, 0, "button")
            .setScale(2)
            .setInteractive()
            .on("pointerdown", () => {
                const gameScene: any = this.scene.get("Game");
                gameScene.player.activatePickup("DrillBomb");
            });
        this.DrillBombAmount = this.add.text(270, 10, "0").setColor("black");

        this.addTimer();

        this.UI_Container.add([
            this.LocatorButton,
            this.LocatorAmount,
            this.SpreadBombButton,
            this.SpreadBombAmount,
            this.DrillBombButton,
            this.DrillBombAmount,
        ]);

        this.winnerContainer = this.add.container(
            this.width / 2,
            this.height / 2
        );
        this.LoserContainer = this.add.container(
            this.width / 2,
            this.height / 2
        );
        this.createWinnerBoard();
        this.createLoserBoard();

        EventBus.emit("current-scene-ready", this);
    }
    // update(time: number, delta: number): void {

    // }
    createWinnerBoard() {
        this.frame = this.add
            .sprite(0, 0, "frame")
            .setScale(4, 7)
            .setAlpha(0.7);
        this.winnerText = this.add
            .text(0, -40, "WINNER Diamond Found !!!")
            .setOrigin(0.5)
            .setScale(1.3);
        this.banner = this.add.sprite(0, 10, "banner").setScale(3, 2);
        this.claimBtn = this.add
            .sprite(0, 70, "button")
            .setScale(4, 1.2)
            .setInteractive()
            .on("pointerdown", () => {
                EventBus.emit("claim");
            });
        const claimBtnText = this.add
            .text(0, 70, "CLAIM")
            .setColor("black")
            .setOrigin(0.5);
        this.homeBtn = this.add
            .sprite(-100, 150, "button")
            .setScale(4, 1.2)
            .setInteractive()
            .on("pointerdown", () => {
                this.cameras.main.fade(1000, 0, 0, 0);
                this.cameras.main.once("camerafadeoutcomplete", () => {
                    this.scene.stop();
                    this.scene.get("Game").scene.stop();
                    this.scene.start("Menu");
                });
            });
        const homeBtnText = this.add
            .text(-100, 150, "HOME")
            .setColor("black")
            .setOrigin(0.5);
        this.playBtn = this.add
            .sprite(100, 150, "button")
            .setScale(4, 1.2)
            .setInteractive()
            .on("pointerdown", () => {
                this.cameras.main.fade(1000, 0, 0, 0);
                this.cameras.main.once("camerafadeoutcomplete", () => {
                    this.scene.restart();
                    this.scene.get("Game").scene.restart();
                });
            });
        const playBtnText = this.add
            .text(100, 150, "PLAY AGAIN")
            .setColor("black")
            .setOrigin(0.5);
        this.winnerContainer
            .add([
                this.frame,
                this.claimBtn,
                claimBtnText,
                this.homeBtn,
                homeBtnText,
                this.playBtn,
                playBtnText,
                this.banner,
                this.winnerText,
            ])
            .setActive(false)
            .setVisible(false);
    }
    createLoserBoard() {
        this.frame = this.add
            .sprite(0, 0, "frame")
            .setScale(4, 7)
            .setAlpha(0.7);
        this.LoserText = this.add
            .text(0, -40, "Time Out try again !!!")
            .setOrigin(0.5)
            .setScale(1.3);

        this.claimBtn = this.add.sprite(0, 70, "button").setScale(4, 1.2);
        const claimBtnText = this.add
            .text(0, 70, "CLAIM")
            .setColor("black")
            .setOrigin(0.5);
        this.homeBtn = this.add.sprite(-100, 150, "button").setScale(4, 1.2);
        const homeBtnText = this.add
            .text(-100, 150, "HOME")
            .setColor("black")
            .setOrigin(0.5);
        this.playBtn = this.add
            .sprite(100, 150, "button")
            .setScale(4, 1.2)
            .setInteractive()
            .on("pointerdown", () => {
                this.cameras.main.fade(1000, 0, 0, 0);
                this.cameras.main.once("camerafadeoutcomplete", () => {
                    this.scene.restart();
                    this.scene.get("Game").scene.restart();
                });
            });
        const playBtnText = this.add
            .text(100, 150, "PLAY AGAIN")
            .setColor("black")
            .setOrigin(0.5);
        this.LoserContainer.add([
            this.frame,
            this.homeBtn,
            homeBtnText,
            this.playBtn,
            playBtnText,
            this.LoserText,
        ])
            .setActive(false)
            .setVisible(false);
    }
    addTimer() {
        this.timer = this.add.text(0, -250, "0:00").setScale(1.2);
        this.UI_Container.add([this.timer]);
    }
}

