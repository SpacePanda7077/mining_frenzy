import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import RAPIER from "@dimforge/rapier2d-compat";
import { Daimond, NormalSoil } from "./classes/tiles";
import { Player } from "./classes/player";
import { huddle01Mainnet } from "viem/chains";
import { SpreadBomb, DrillBomb, diamond, Locator } from "./classes/pickUps";

export class Game extends Scene {
    mapGrid: number[][];
    world: RAPIER.World;
    tilesize: number;
    player: Player;
    tileArray: { [key: string]: NormalSoil };
    eventQueue: RAPIER.EventQueue;
    minute: number;
    seconds: number;
    lastTime: number;
    width: number;
    height: number;
    bg: Phaser.GameObjects.TileSprite;
    pickUps: (SpreadBomb | DrillBomb | diamond | Locator)[];
    diamonds: Daimond[];
    url: string;
    constructor() {
        super("Game");
    }
    init(url: { url: string }) {
        //this.world = world;
        this.url =
            "https://plum-total-louse-876.mypinata.cloud/ipfs/bafybeifkha56e4udq4m7n3l2hybz4ubfrkmlrpi7mgxas2ppmpmy52gqqa/common_john.png";
        console.log(url.url);
    }

    preload() {
        this.load.setPath("assets");
        this.load.image("player", this.url);
    }

    async create() {
        //await this.initialize_Physics();
        this.width = Number(this.game.config.width);
        this.height = Number(this.game.config.height);
        const Rapier = this.registry.get("RAPIER");
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.bg = this.add
            .tileSprite(
                this.width / 2,
                this.height / 2 - 400,
                640 * 4,
                960,
                "bg"
            )
            .setDepth(-20);
        const scene = this.scene.launch("UI");
        const gravity = { x: 0, y: 200 / (0.5 * 0.5) };
        this.world = new Rapier.World(gravity);
        this.eventQueue = new Rapier.EventQueue(true);
        this.tilesize = 32;
        this.mapGrid = [];
        this.tileArray = {};
        this.minute = 2;
        this.seconds = 59;
        this.lastTime = 0;
        this.pickUps = [];
        this.diamonds = [];
        try {
            this.createMapGrid(40, 20);
            this.createMapVisuals();
            this.addDiamonds(2);
        } catch (err) {
            console.log(err);
        }

        this.player = new Player(this, this.world, 200, -50, "player");
        this.cameras.main.startFollow(this.player.body);
        this.cameras.main.roundPixels = true;

        EventBus.emit("current-scene-ready", this);
        EventBus.emit("setKey", this.scene.key);
    }
    update(time: number, delta: number): void {
        if (this.world) {
            const uiscene: any = this.scene.get("UI");
            this.world.step(this.eventQueue);
            //this.bg.tilePositionX += this.cameras.main.scrollX;

            if (this.player) {
                this.player.syncPlayer();
                this.player.movePlayer(
                    this.mapGrid,
                    this.tileArray,
                    time,
                    this.pickUps
                );
                this.player.use(
                    this.pickUps,
                    this.mapGrid,
                    this.tileArray,
                    time,
                    this.diamonds
                );
            }
            type userData = {
                type: string;
            };

            this.eventQueue.drainCollisionEvents((h1, h2, started) => {
                const col1 = this.world.getCollider(h1);
                const col2 = this.world.getCollider(h2);
                const body1 = col1.parent();
                const body2 = col2.parent();
                let b1;
                let b2!: RAPIER.RigidBody | null;
                (body1?.userData as userData).type === "Player"
                    ? (b1 = body1)
                    : (b2 = body1);
                (body2?.userData as userData).type === "Player"
                    ? (b1 = body2)
                    : (b2 = body2);
                if (started) {
                    console.log(b1?.userData, "collided with ", b2?.userData);
                    if (
                        (b1?.userData as userData).type === "Player" &&
                        (b2?.userData as userData).type === "Daimond"
                    ) {
                        console.log("winner");

                        const d = this.diamonds.find((d) => d.RB === b2);
                        if (d) {
                            this.player.collectedDaimonds++;
                            const i = this.diamonds.indexOf(d);
                            d.destroy(this.pickUps);
                            this.diamonds.splice(i, 1);
                            if (this.diamonds.length <= 0) {
                                const uiscene: any = this.scene.get("UI");
                                uiscene.winnerContainer
                                    .setActive(true)
                                    .setVisible(true);
                                this.scene.pause();
                            }
                        }
                    }
                    if (
                        (b1?.userData as userData).type === "Player" &&
                        (b2?.userData as userData).type === "SpreadBomb"
                    ) {
                        this.player.spreadBombAmount++;
                        const bomb = this.pickUps.find((rb) => rb.RB === b2);
                        if (bomb) {
                            console.log("bomb found");
                            const i = this.pickUps.indexOf(bomb);
                            //this.player.collectedPickup.push(bomb);
                            bomb.body.destroy();
                            this.world.removeRigidBody(bomb.RB);
                            this.pickUps.splice(i, 1);
                        }
                    }
                    if (
                        (b1?.userData as userData).type === "Player" &&
                        (b2?.userData as userData).type === "DrillBomb"
                    ) {
                        this.player.drillBombAmount++;
                        const bomb = this.pickUps.find((rb) => rb.RB === b2);
                        if (bomb) {
                            console.log("bomb found");
                            const i = this.pickUps.indexOf(bomb);
                            //this.player.collectedPickup.push(bomb);
                            bomb.body.destroy();
                            this.world.removeRigidBody(bomb.RB);
                            this.pickUps.splice(i, 1);
                        }
                    }
                    if (
                        (b1?.userData as userData).type === "Player" &&
                        (b2?.userData as userData).type === "Locator"
                    ) {
                        this.player.locatorAmount++;
                        const bomb = this.pickUps.find((rb) => rb.RB === b2);
                        if (bomb) {
                            console.log("locator found");
                            const i = this.pickUps.indexOf(bomb);
                            //this.player.collectedPickup.push(bomb);
                            bomb.body.destroy();
                            this.world.removeRigidBody(bomb.RB);
                            this.pickUps.splice(i, 1);
                        }
                    }
                }
            });

            if (time > this.lastTime + 1000) {
                this.seconds--;
                if (this.minute > 0 && this.seconds <= 0) {
                    this.minute--;
                    this.seconds = 60;
                }
                const uiscene: any = this.scene.get("UI");
                uiscene.timer.text = `${this.minute} : ${this.seconds}`;
                this.lastTime = time;
            }
            if (this.minute <= 0 && this.seconds <= 0) {
                console.log("you lose");
                const uiscene: any = this.scene.get("UI");
                uiscene.LoserContainer.setActive(true).setVisible(true);
                this.scene.pause();
            }
            if (uiscene) {
                uiscene.SpreadBombAmount.text =
                    this.player.spreadBombAmount.toString();
                uiscene.DrillBombAmount.text =
                    this.player.drillBombAmount.toString();
                uiscene.LocatorAmount.text =
                    this.player.locatorAmount.toString();
            }
        }
        this.pickUps.forEach((pickup) => {
            pickup.syncBody();
        });
    }

    createMapGrid(width: number, height: number) {
        const soilType = [1, 2, 3, 4];
        const soilWeight = [60, 25, 10, 5];
        for (let i = 0; i < 20; i++) {
            const row = [];
            for (let j = 0; j < 40; j++) {
                const soil = this.weightedRandom(soilType, soilWeight);
                row.push(soil);
            }
            this.mapGrid.push(row);
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < this.mapGrid[i].length; j++) {
                this.mapGrid[i][j] = 1;
            }
        }
        this.cameras.main.setBounds(
            0,
            -600,
            width * this.tilesize,
            height * this.tilesize + this.tilesize / 2 + 800
        );
        this.createBoarders(width, height);
    }
    createMapVisuals() {
        for (let i = 0; i < this.mapGrid.length; i++) {
            for (let j = 0; j < this.mapGrid[i].length; j++) {
                this.add
                    .sprite(
                        j * this.tilesize + this.tilesize / 2,
                        i * this.tilesize + this.tilesize / 2,
                        "tiles",
                        15
                    )
                    .setDepth(-10);
                const soil = new NormalSoil(
                    this,
                    this.world,
                    j * this.tilesize + this.tilesize / 2,
                    i * this.tilesize + this.tilesize / 2
                );
                this.tileArray[`${j},${i}`] = soil;
            }
        }
    }
    addDiamonds(amount: number) {
        const sixtyPercentOfMapHeight = Math.floor(
            (60 / 100) * this.mapGrid.length
        );
        console.log(sixtyPercentOfMapHeight);
        for (let d = 0; d < amount; d++) {
            const randPosY = Math.floor(
                Math.random() *
                    (this.mapGrid.length - sixtyPercentOfMapHeight) +
                    sixtyPercentOfMapHeight
            );
            const availableTile = [];
            for (let i = 0; i < this.mapGrid[randPosY].length; i++) {
                if (this.mapGrid[randPosY][i] === 1) {
                    availableTile.push(i);
                }
            }
            if (availableTile) {
                const randPosIndex = Math.floor(
                    Math.random() * availableTile.length
                );
                const randPosX = availableTile[randPosIndex];
                console.log(randPosX, randPosY);
                const diamond = new Daimond(
                    this,
                    this.world,
                    randPosX * this.tilesize + this.tilesize / 2,
                    randPosY * this.tilesize + this.tilesize / 2
                );
                this.diamonds.push(diamond);
            }
        }
    }
    createBoarders(width: number, height: number) {
        const leftBoarder = this.add.rectangle(
            -16,
            0,
            32,
            height * this.tilesize + this.tilesize / 2 + 800,
            0xff0000
        );
        const leftrbDesc = RAPIER.RigidBodyDesc.fixed()
            .setTranslation(-16, 0)
            .setUserData({ type: "Daimond" });
        const leftRB = this.world.createRigidBody(leftrbDesc);
        const leftcolDesc = RAPIER.ColliderDesc.cuboid(
            32 / 2,
            (height * this.tilesize + this.tilesize / 2 + 800) / 2
        );
        const leftcollider = this.world.createCollider(leftcolDesc, leftRB);

        const rightBoarder = this.add.rectangle(
            width * this.tilesize + 16,
            0,
            32,
            height * this.tilesize + this.tilesize / 2 + 800,
            0xff0000
        );
        const rightrbDesc = RAPIER.RigidBodyDesc.fixed()
            .setTranslation(width * this.tilesize + 16, 0)
            .setUserData({ type: "Daimond" });
        const rightRB = this.world.createRigidBody(rightrbDesc);
        const rightcolDesc = RAPIER.ColliderDesc.cuboid(
            32 / 2,
            (height * this.tilesize + this.tilesize / 2 + 800) / 2
        );
        const rightcollider = this.world.createCollider(rightcolDesc, rightRB);

        const buttomBoarder = this.add.rectangle(
            this.width / 2,
            height * this.tilesize + this.tilesize,
            width * this.tilesize + this.tilesize / 2 + 800,
            32,
            0xff0000
        );
        const buttomrbDesc = RAPIER.RigidBodyDesc.fixed()
            .setTranslation(
                this.width / 2,
                height * this.tilesize + this.tilesize / 2
            )
            .setUserData({ type: "Daimond" });
        const buttomRB = this.world.createRigidBody(buttomrbDesc);
        const buttomcolDesc = RAPIER.ColliderDesc.cuboid(
            (width * this.tilesize + this.tilesize / 2 + 800) / 2,
            32 / 2
        );
        const buttomcollider = this.world.createCollider(
            buttomcolDesc,
            buttomRB
        );
    }
    weightedRandom(items: any[], weights: number[]) {
        // Validate inputs
        if (
            !items ||
            !weights ||
            items.length !== weights.length ||
            items.length === 0
        ) {
            throw new Error(
                "Items and weights must be arrays of equal length and not empty"
            );
        }

        // Calculate total weight
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        if (totalWeight <= 0) {
            throw new Error("Total weight must be greater than 0");
        }

        // Generate a random value between 0 and totalWeight
        const randomValue = Math.random() * totalWeight;

        // Iterate through items to find the selected one
        let currentWeight = 0;
        for (let i = 0; i < items.length; i++) {
            currentWeight += weights[i];
            if (randomValue <= currentWeight) {
                return items[i];
            }
        }

        // Fallback in case of rounding errors
        return items[items.length - 1];
    }
}

