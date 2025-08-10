import RAPIER from "@dimforge/rapier2d-compat";
import {
    NormalSoil,
    RewardSoil,
    MysterySoil,
    HardSoil,
    Daimond,
} from "./tiles";
import { diamond, DrillBomb, Locator, SpreadBomb } from "./pickUps";

export class Player {
    tileSize: number;
    world: RAPIER.World;
    scene: Phaser.Scene;
    body: Phaser.GameObjects.Rectangle;
    RB: RAPIER.RigidBody;
    collider: RAPIER.Collider;
    velocity: Phaser.Math.Vector2;
    inputVector: Phaser.Math.Vector2;
    speed: number;
    digDirection: Phaser.Math.Vector2;
    lastDigTime: number;
    spreadBombAmount: number;
    drillBombAmount: number;
    activePickup: SpreadBomb | DrillBomb | Locator | null;
    collectedPickup: (SpreadBomb | DrillBomb | diamond | Locator)[];
    locatorAmount: number;
    collectedDaimonds: number;
    isClimbing: boolean;
    constructor(
        scene: Phaser.Scene,
        world: RAPIER.World,
        x: number,
        y: number
    ) {
        this.tileSize = 32;
        this.scene = scene;
        this.world = world;
        this.speed = 100;
        this.lastDigTime = 0;
        this.velocity = new Phaser.Math.Vector2(0, 0);
        this.inputVector = new Phaser.Math.Vector2(0, 0);
        this.digDirection = new Phaser.Math.Vector2(0, 0);
        this.isClimbing = false;
        this.spreadBombAmount = 0;
        this.drillBombAmount = 0;
        this.locatorAmount = 0;
        this.collectedPickup = [];
        this.collectedDaimonds = 0;
        this.activePickup = null;
        this.body = scene.add.rectangle(x, y, 16, 16, 0x00ff00);

        const rbDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(x, y)
            .setUserData({ type: "Player" });
        this.RB = this.world.createRigidBody(rbDesc);
        const colDesc = RAPIER.ColliderDesc.cuboid(8, 8).setActiveEvents(
            RAPIER.ActiveEvents.COLLISION_EVENTS
        );
        this.collider = this.world.createCollider(colDesc, this.RB);
    }
    movePlayer(
        mapGrid: number[][],
        tileArray: { [key: string]: NormalSoil },
        time: number,
        pickups: (SpreadBomb | DrillBomb | diamond | Locator)[]
    ) {
        this.getAxis(mapGrid, tileArray, time, pickups);
        if (!this.isClimbing) {
            this.velocity.y = this.RB.linvel().y;
        } else {
            this.velocity.y = (-1 * this.speed) / 2;
        }

        this.velocity.x = this.inputVector.x * this.speed;

        this.RB.setLinvel(this.velocity, true);
    }
    syncPlayer() {
        const pos = this.RB.translation();
        this.body.setPosition(pos.x, pos.y);
        if (this.activePickup !== null) {
            this.activePickup.RB.setGravityScale(0, true);
            this.activePickup.RB.setTranslation(
                { x: pos.x + 20, y: pos.y },
                true
            );
            this.activePickup.syncBody();
        } else {
            const gravity = { x: 0, y: 200 / (0.5 * 0.5) };
            this.collectedPickup.forEach((b) => {
                b.RB.setGravityScale(1, true);
                b.syncBody();
            });
        }
    }
    getAxis(
        mapGrid: number[][],
        tileArray: { [key: string]: NormalSoil },
        time: number,
        pickups: (SpreadBomb | DrillBomb | diamond | Locator)[]
    ) {
        const left = this.scene.input.keyboard?.addKey("a");
        const right = this.scene.input.keyboard?.addKey("d");
        const up = this.scene.input.keyboard?.addKey("w");
        const down = this.scene.input.keyboard?.addKey("s");

        if (left?.isDown) {
            this.inputVector.x = -1;
            this.digDirection.x = -1;
            this.dig(mapGrid, tileArray, time, pickups);
        } else if (right?.isDown) {
            this.inputVector.x = 1;
            this.digDirection.x = 1;
            this.dig(mapGrid, tileArray, time, pickups);
        } else {
            this.inputVector.x = 0;
            this.digDirection.x = 0;
        }
        if (up?.isDown) {
            this.digDirection.y = -1;
            //this.RB.setGravityScale(0, true);
            this.isClimbing = true;
            this.dig(mapGrid, tileArray, time, pickups);
        } else if (down?.isDown) {
            this.digDirection.y = 1;
            this.isClimbing = false;
            this.dig(mapGrid, tileArray, time, pickups);
        } else {
            // this.RB.setGravityScale(1, true);
            this.isClimbing = false;
            this.digDirection.y = 0;
        }
    }
    dig(
        mapGrid: number[][],
        tileArray: { [key: string]: NormalSoil },
        time: number,
        pickups: (SpreadBomb | DrillBomb | diamond | Locator)[]
    ) {
        const pos = this.RB.translation();
        const tileImOn = {
            x: Math.floor(pos.x / this.tileSize),
            y: Math.floor(pos.y / this.tileSize),
        };
        if (
            mapGrid[tileImOn.y + this.digDirection.y] &&
            mapGrid[tileImOn.y + this.digDirection.y][tileImOn.x]
        ) {
            if (time > 150 + this.lastDigTime) {
                if (
                    tileArray[
                        `${tileImOn.x},${tileImOn.y + this.digDirection.y}`
                    ]
                ) {
                    const tile =
                        tileArray[
                            `${tileImOn.x},${tileImOn.y + this.digDirection.y}`
                        ];
                    tile.health--;
                    this.scene.sound.play("mining");
                    if (tile.health <= 0) {
                        tile.destroy(pickups);
                        delete tileArray[
                            `${tileImOn.x},${tileImOn.y + this.digDirection.y}`
                        ];
                        for (
                            let i = tileImOn.y + this.digDirection.y - 1;
                            i < tileImOn.y + this.digDirection.y + 2;
                            i++
                        ) {
                            if (tileArray[`${tileImOn.x},${i}`]) {
                                const nearTiles =
                                    tileArray[`${tileImOn.x},${i}`];
                                nearTiles.body.destroy();
                                this.world.removeRigidBody(nearTiles.RB);
                                delete tileArray[`${tileImOn.x},${i}`];

                                this.replaceTile(
                                    mapGrid,
                                    tileArray,
                                    tileImOn.x,
                                    i
                                );
                            }
                            for (
                                let j = tileImOn.x - 1;
                                j < tileImOn.x + 2;
                                j++
                            ) {
                                if (
                                    tileArray[
                                        `${j},${
                                            tileImOn.y + this.digDirection.y
                                        }`
                                    ]
                                ) {
                                    const nearTiles =
                                        tileArray[
                                            `${j},${
                                                tileImOn.y + this.digDirection.y
                                            }`
                                        ];
                                    nearTiles.body.destroy();
                                    this.world.removeRigidBody(nearTiles.RB);
                                    delete tileArray[
                                        `${j},${
                                            tileImOn.y + this.digDirection.y
                                        }`
                                    ];

                                    this.replaceTile(
                                        mapGrid,
                                        tileArray,
                                        j,
                                        tileImOn.y + this.digDirection.y
                                    );
                                }
                            }
                        }
                    }
                }
                if (
                    mapGrid[tileImOn.y] &&
                    mapGrid[tileImOn.y][tileImOn.x + this.digDirection.x]
                ) {
                    if (
                        tileArray[
                            `${tileImOn.x + this.digDirection.x},${tileImOn.y}`
                        ]
                    ) {
                        const tile =
                            tileArray[
                                `${tileImOn.x + this.digDirection.x},${
                                    tileImOn.y
                                }`
                            ];
                        tile.health--;
                        this.scene.sound.play("mining");
                        if (tile.health <= 0) {
                            tile.destroy(pickups);
                            delete tileArray[
                                `${tileImOn.x + this.digDirection.x},${
                                    tileImOn.y
                                }`
                            ];
                            for (
                                let i = tileImOn.y - 1;
                                i < tileImOn.y + 2;
                                i++
                            ) {
                                if (
                                    tileArray[
                                        `${
                                            tileImOn.x + this.digDirection.x
                                        },${i}`
                                    ]
                                ) {
                                    const nearTiles =
                                        tileArray[
                                            `${
                                                tileImOn.x + this.digDirection.x
                                            },${i}`
                                        ];
                                    nearTiles.body.destroy();
                                    this.world.removeRigidBody(nearTiles.RB);
                                    delete tileArray[
                                        `${
                                            tileImOn.x + this.digDirection.x
                                        },${i}`
                                    ];

                                    this.replaceTile(
                                        mapGrid,
                                        tileArray,
                                        tileImOn.x + this.digDirection.x,
                                        i
                                    );
                                }
                                for (
                                    let j =
                                        tileImOn.x + this.digDirection.x - 1;
                                    j < tileImOn.x + this.digDirection.x + 2;
                                    j++
                                ) {
                                    if (tileArray[`${j},${tileImOn.y}`]) {
                                        const nearTiles =
                                            tileArray[`${j},${tileImOn.y}`];
                                        nearTiles.body.destroy();
                                        this.world.removeRigidBody(
                                            nearTiles.RB
                                        );
                                        delete tileArray[`${j},${tileImOn.y}`];

                                        this.replaceTile(
                                            mapGrid,
                                            tileArray,
                                            j,
                                            tileImOn.y
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
                this.lastDigTime = time;
            }
        }
    }
    replaceTile(
        mapGrid: number[][],
        tileArray: {
            [key: string]: NormalSoil | RewardSoil | MysterySoil | HardSoil;
        },
        x: number,
        y: number
    ) {
        console.log(mapGrid[y][x]);
        if (mapGrid[y][x]) {
            let soil;
            if (mapGrid[y][x] === 1) {
                soil = new NormalSoil(
                    this.scene,
                    this.world,
                    x * this.tileSize + this.tileSize / 2,
                    y * this.tileSize + this.tileSize / 2
                );
            } else if (mapGrid[y][x] === 2) {
                soil = new HardSoil(
                    this.scene,
                    this.world,
                    x * this.tileSize + this.tileSize / 2,
                    y * this.tileSize + this.tileSize / 2
                );
            } else if (mapGrid[y][x] === 3) {
                soil = new MysterySoil(
                    this.scene,
                    this.world,
                    x * this.tileSize + this.tileSize / 2,
                    y * this.tileSize + this.tileSize / 2
                );
            } else if (mapGrid[y][x] === 4) {
                soil = new RewardSoil(
                    this.scene,
                    this.world,
                    x * this.tileSize + this.tileSize / 2,
                    y * this.tileSize + this.tileSize / 2
                );
            }
            if (soil) {
                tileArray[`${x},${y}`] = soil;
            }
        }
    }

    activatePickup(type: string) {
        if (type === "SpreadBomb") {
            const pos = this.RB.translation();
            if (this.activePickup === null && this.spreadBombAmount > 0) {
                this.activePickup = new SpreadBomb(
                    this.scene,
                    this.world,
                    pos.x + 20,
                    pos.y
                );
                this.collectedPickup.push(this.activePickup);
                this.spreadBombAmount--;
            }
        }
        if (type === "DrillBomb") {
            const pos = this.RB.translation();
            if (this.activePickup === null && this.drillBombAmount > 0) {
                this.activePickup = new DrillBomb(
                    this.scene,
                    this.world,
                    pos.x + 20,
                    pos.y
                );
                this.collectedPickup.push(this.activePickup);
                this.drillBombAmount--;
            }
        }
        if (type === "Locator") {
            const pos = this.RB.translation();
            if (this.activePickup === null && this.locatorAmount > 0) {
                this.activePickup = new Locator(
                    this.scene,
                    this.world,
                    pos.x + 20,
                    pos.y
                );
                this.collectedPickup.push(this.activePickup);
                this.locatorAmount--;
            }
        }
    }

    usePickup(
        pickUps: (SpreadBomb | DrillBomb | diamond | Locator)[],
        mapGrid: number[][],
        tileArray: { [key: string]: NormalSoil },
        time: number,
        daimonds: Daimond[]
    ) {
        const pickup = this.collectedPickup.find(
            (p) => p.RB === this.activePickup?.RB
        );

        console.log(pickup);
        console.log(this.activePickup);
        this.activePickup = null;
        if (pickup instanceof SpreadBomb || pickup instanceof DrillBomb) {
            this.scene.time.addEvent({
                delay: 2000,
                callback: () => {
                    console.log("deti");
                    console.log(this.collectedPickup);
                    pickup?.detinate(mapGrid, tileArray, time);
                    pickup?.body.destroy();
                    this.world.removeRigidBody(pickup?.RB as RAPIER.RigidBody);
                    const i = this.collectedPickup.indexOf(
                        pickup as SpreadBomb | DrillBomb | diamond | Locator
                    );
                    this.collectedPickup.splice(i, 1);
                },
            });
        }
        if (pickup instanceof Locator) {
            pickup.detinate(daimonds, this);
            pickup.body.destroy();
            this.world.removeRigidBody(pickup.RB as RAPIER.RigidBody);
            const i = this.collectedPickup.indexOf(pickup as Locator);
            this.collectedPickup.splice(i, 1);
        }
    }

    use(
        pickUps: (SpreadBomb | DrillBomb | diamond | Locator)[],
        mapGrid: number[][],
        tileArray: { [key: string]: NormalSoil },
        time: number,
        daimonds: Daimond[]
    ) {
        const useBtn = this.scene.input.keyboard?.addKey("x");
        if (useBtn?.isDown) {
            console.log("doe");
            if (this.activePickup !== null) {
                this.usePickup(pickUps, mapGrid, tileArray, time, daimonds);
            }
        }
    }

    destroy() {
        this.body.destroy();
        this.world.removeRigidBody(this.RB);
    }
}

