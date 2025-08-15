import { Scene } from "phaser";
import uniqid from "uniqid";
import { EventBus } from "../EventBus";

export class Menu extends Scene {
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
        super("Menu");
    }
    preload() {
        this.load.setPath("assets");
        this.load.image("bg", "background.png");
        this.load.image("cloud", "cloud.png");
        this.load.image("banner", "ui/banner.png");
        this.load.image("frame", "ui/frame.png");
        this.load.image("button", "ui/button.png");
        this.load.spritesheet("tiles", "tiles/tiles.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("pickups", "tiles/pickups.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        //sounds
        this.load.audio("rockBreak", "sound/rockBreak.mp3");
        this.load.audio("mining", "sound/mining.mp3");
    }
    create() {
        const uri =
            "https://plum-total-louse-876.mypinata.cloud/ipfs/bafkreiedkprwlic2bhm2u74ctj76lp46ruvremvmmtkcxjyblbq4lcbicq";
        this.width = Number(this.game.config.width);
        this.height = Number(this.game.config.height);
        this.add.sprite(this.width / 2, this.height / 2, "bg");
        this.mintNewNFTContainer = this.add.container(
            this.width / 2,
            this.height / 2
        );
        this.mintNewNFTButton = this.add
            .image(0, 0, "button")
            .setScale(5, 2)
            .setInteractive()
            .on("pointerdown", () => {
                EventBus.emit("mint", uri);
            });

        const mintNewNFTText = this.add
            .text(0, 0, "Mint first Nft")
            .setDepth(2)
            .setOrigin(0.5)
            .setColor("black");

        this.mintNewNFTContainer
            .add([this.mintNewNFTButton, mintNewNFTText])
            .setActive(false)
            .setVisible(false);

        this.MenuContainer = this.add.container(
            this.width / 2,
            this.height / 2
        );

        this.marketBtn = this.add
            .image(-100, -50, "button")
            .setScale(3, 2)
            .setInteractive()
            .on("pointerdown", () => {
                EventBus.emit("openshop");
            });
        this.marketBtntext = this.add
            .text(-100, -50, "Shop")
            .setDepth(2)
            .setOrigin(0.5)
            .setColor("black");
        this.leaderBoardBtn = this.add
            .image(100, -50, "button")
            .setScale(4, 2)
            .setInteractive()
            .on("pointerdown", () => {
                EventBus.emit("openInventory");
            });

        this.leaderBoardBtntext = this.add
            .text(100, -50, "inventory")
            .setDepth(2)
            .setOrigin(0.5)
            .setColor("black");

        this.playBtn = this.add
            .image(0, 100, "button")
            .setScale(5, 2)
            .setInteractive()
            .on("pointerdown", () => {
                EventBus.emit("startGame");
            });

        this.playBtntext = this.add
            .text(0, 100, "Play")
            .setDepth(2)
            .setOrigin(0.5)
            .setColor("black");

        this.MenuContainer.add([
            this.playBtn,
            this.marketBtn,
            this.leaderBoardBtn,
            this.marketBtntext,
            this.leaderBoardBtntext,
            this.playBtntext,
        ]);

        const cloud1 = this.add
            .sprite(200, 300, "cloud")
            .setScale(3, 2)
            .setAlpha(0.8);
        const cloud2 = this.add
            .sprite(400, 250, "cloud")
            .setScale(2, 2)
            .setAlpha(0.8);
        const cloud3 = this.add
            .sprite(500, 320, "cloud")
            .setScale(3, 1)
            .setAlpha(0.8);

        this.tweens.add({
            targets: cloud1,
            x: 180,
            delay: 100,
            yoyo: true,
            loop: -1,
        });
        this.tweens.add({
            targets: cloud2,
            x: 430,
            delay: 100,
            yoyo: true,
            loop: -1,
        });
        this.tweens.add({
            targets: cloud3,
            x: 480,
            delay: 100,
            yoyo: true,
            loop: -1,
        });

        EventBus.emit("current-scene-ready", this);
        EventBus.emit("setKey", this.scene.key);
        EventBus.once("lobbyComfirmed", () => {
            this.scene.start("Initialize");
        });
        EventBus.once("start", (url: string) => {
            try {
                this.scene.start("Initialize", { url });
            } catch (err) {}
        });
    }
}

