import RAPIER from "@dimforge/rapier2d-compat";
import { SpreadBomb, DrillBomb, diamond, Locator } from "./pickUps";

export class RewardSoil {
    tileSize: number;
    world: RAPIER.World;
    scene: Phaser.Scene;
    body: Phaser.GameObjects.Sprite;
    RB: RAPIER.RigidBody;
    collider: RAPIER.Collider;
    health: number;
    animation: { key: string; start: number; end: number; repeat: number };
    constructor(
        scene: Phaser.Scene,
        world: RAPIER.World,
        x: number,
        y: number
    ) {
        this.tileSize = 32;
        this.scene = scene;
        this.world = world;
        this.health = 5;
        this.animation = { key: "rewardTile", start: 12, end: 14, repeat: -1 };
        this.body = scene.add.sprite(x, y, "tiles", 11);
        if (!this.scene.anims.exists("rewardTile")) {
            this.createAnim();
        }
        this.body.play(this.animation.key);

        const rbDesc = RAPIER.RigidBodyDesc.fixed()
            .setTranslation(x, y)
            .setUserData({ type: "RewardSoil" });
        this.RB = this.world.createRigidBody(rbDesc);
        const colDesc = RAPIER.ColliderDesc.cuboid(
            this.tileSize / 2,
            this.tileSize / 2
        );
        this.collider = this.world.createCollider(colDesc, this.RB);
    }

    destroy(pickups: (SpreadBomb | DrillBomb | diamond | Locator)[]) {
        this.body.destroy();
        this.world.removeRigidBody(this.RB);
        this.scene.sound.play("rockBreak");
    }

    createAnim() {
        this.scene.anims.create({
            key: this.animation.key,
            frames: this.scene.anims.generateFrameNumbers("tiles", {
                start: this.animation.start,
                end: this.animation.end,
            }),
            frameRate: 10,
            repeatDelay: 1000,
            repeat: -1,
        });
    }
}
export class MysterySoil {
    tileSize: number;
    world: RAPIER.World;
    scene: Phaser.Scene;
    body: Phaser.GameObjects.Sprite;
    RB: RAPIER.RigidBody;
    collider: RAPIER.Collider;
    health: number;
    mysteryReward: any[];
    mysteryRewardWeight: number[];
    constructor(
        scene: Phaser.Scene,
        world: RAPIER.World,
        x: number,
        y: number
    ) {
        this.tileSize = 32;
        this.scene = scene;
        this.world = world;
        this.health = 5;
        this.mysteryReward = [SpreadBomb, DrillBomb, Locator, diamond];
        this.mysteryRewardWeight = [48, 28, 23, 1];

        this.body = scene.add.sprite(x, y, "tiles", 8);

        const rbDesc = RAPIER.RigidBodyDesc.fixed()
            .setTranslation(x, y)
            .setUserData({ type: "MysterySoil" });
        this.RB = this.world.createRigidBody(rbDesc);
        const colDesc = RAPIER.ColliderDesc.cuboid(
            this.tileSize / 2,
            this.tileSize / 2
        );
        this.collider = this.world.createCollider(colDesc, this.RB);
        this.scene.sound.play("rockBreak");
    }

    destroy(pickups: (SpreadBomb | DrillBomb | diamond | Locator)[]) {
        this.body.destroy();
        const pos = this.RB.translation();
        const randReward = weightedRandom(
            this.mysteryReward,
            this.mysteryRewardWeight
        );
        const reward = new randReward(this.scene, this.world, pos.x, pos.y);
        pickups.push(reward);
        this.world.removeRigidBody(this.RB);
        this.scene.sound.play("rockBreak");
    }
}
export class HardSoil {
    tileSize: number;
    world: RAPIER.World;
    scene: Phaser.Scene;
    body: Phaser.GameObjects.Sprite;
    RB: RAPIER.RigidBody;
    collider: RAPIER.Collider;
    health: number;
    constructor(
        scene: Phaser.Scene,
        world: RAPIER.World,
        x: number,
        y: number
    ) {
        this.tileSize = 32;
        this.scene = scene;
        this.world = world;
        this.health = 5;
        this.body = scene.add.sprite(x, y, "tiles", 7);

        const rbDesc = RAPIER.RigidBodyDesc.fixed()
            .setTranslation(x, y)
            .setUserData({ type: "HardSoil" });
        this.RB = this.world.createRigidBody(rbDesc);
        const colDesc = RAPIER.ColliderDesc.cuboid(
            this.tileSize / 2,
            this.tileSize / 2
        );
        this.collider = this.world.createCollider(colDesc, this.RB);
    }

    destroy(pickups: (SpreadBomb | DrillBomb | diamond | Locator)[]) {
        this.body.destroy();
        this.world.removeRigidBody(this.RB);
        this.scene.sound.play("rockBreak");
    }
}
export class NormalSoil {
    tileSize: number;
    world: RAPIER.World;
    scene: Phaser.Scene;
    body: Phaser.GameObjects.Sprite;
    RB: RAPIER.RigidBody;
    collider: RAPIER.Collider;
    health: number;
    constructor(
        scene: Phaser.Scene,
        world: RAPIER.World,
        x: number,
        y: number
    ) {
        this.tileSize = 32;
        this.scene = scene;
        this.world = world;
        this.health = 5;
        this.body = scene.add.sprite(x, y, "tiles", 10);

        const rbDesc = RAPIER.RigidBodyDesc.fixed()
            .setTranslation(x, y)
            .setUserData({ type: "NormalSoil" });
        this.RB = this.world.createRigidBody(rbDesc);
        const colDesc = RAPIER.ColliderDesc.cuboid(
            this.tileSize / 2,
            this.tileSize / 2
        );
        this.collider = this.world.createCollider(colDesc, this.RB);
    }

    destroy(pickups: (SpreadBomb | DrillBomb | diamond | Locator)[]) {
        this.body.destroy();
        this.world.removeRigidBody(this.RB);
        this.scene.sound.play("rockBreak");
    }
}
export class Daimond {
    tileSize: number;
    world: RAPIER.World;
    scene: Phaser.Scene;
    body: Phaser.GameObjects.Sprite;
    RB: RAPIER.RigidBody;
    collider: RAPIER.Collider;
    health: number;
    constructor(
        scene: Phaser.Scene,
        world: RAPIER.World,
        x: number,
        y: number
    ) {
        this.tileSize = 32;
        this.scene = scene;
        this.world = world;
        this.health = 5;
        this.body = scene.add.sprite(x, y, "tiles", 29).setDepth(-5);

        const rbDesc = RAPIER.RigidBodyDesc.fixed()
            .setTranslation(x, y)
            .setUserData({ type: "Daimond" });
        this.RB = this.world.createRigidBody(rbDesc);
        const colDesc = RAPIER.ColliderDesc.cuboid(
            this.tileSize / 4,
            this.tileSize / 4
        );
        this.collider = this.world.createCollider(colDesc, this.RB);
    }

    destroy(pickups: (SpreadBomb | DrillBomb | Locator | diamond)[]) {
        this.body.destroy();
        this.world.removeRigidBody(this.RB);
    }
}

function weightedRandom(items: any[], weights: number[]) {
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

