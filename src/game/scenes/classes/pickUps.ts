import RAPIER from "@dimforge/rapier2d-compat";
import { Daimond, NormalSoil } from "./tiles";
import { Player } from "./player";

export class Locator {
    scene: Phaser.Scene;
    world: RAPIER.World;
    body: Phaser.GameObjects.Sprite;
    RB: RAPIER.RigidBody;
    tileSize: number;
    collider: RAPIER.Collider;
    constructor(
        scene: Phaser.Scene,
        world: RAPIER.World,
        x: number,
        y: number
    ) {
        this.tileSize = 32;
        this.scene = scene;
        this.world = world;
        this.body = this.scene.add.sprite(x, y, "pickups", 2);
        const rbDesc = RAPIER.RigidBodyDesc.fixed()
            .setTranslation(x, y)
            .setUserData({ type: "Locator" });
        this.RB = this.world.createRigidBody(rbDesc);
        const colDesc = RAPIER.ColliderDesc.cuboid(
            this.tileSize / 4,
            this.tileSize / 4
        ).setSensor(true);
        this.collider = this.world.createCollider(colDesc, this.RB);
    }
    detinate(diamonds: Daimond[], player: Player) {
        if (diamonds.length > 0) {
            const angle = Phaser.Math.Angle.Between(
                player.RB.translation().x,
                player.RB.translation().y,
                diamonds[0].RB.translation().x,
                diamonds[0].RB.translation().y
            );
            const arrow = this.scene.add.sprite(
                player.RB.translation().x,
                player.RB.translation().y,
                "pickups",
                3
            );
            arrow.rotation = angle;
        }
    }
    syncBody() {
        const pos = this.RB.translation();
        this.body.setPosition(pos.x, pos.y);
    }
}
export class SpreadBomb {
    scene: Phaser.Scene;
    world: RAPIER.World;
    body: Phaser.GameObjects.Sprite;
    RB: RAPIER.RigidBody;
    tileSize: number;
    collider: RAPIER.Collider;
    constructor(
        scene: Phaser.Scene,
        world: RAPIER.World,
        x: number,
        y: number
    ) {
        this.tileSize = 32;
        this.scene = scene;
        this.world = world;
        this.body = this.scene.add.sprite(x, y, "pickups", 0);
        const rbDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(x, y)
            .setUserData({ type: "SpreadBomb" });
        this.RB = this.world.createRigidBody(rbDesc);
        const colDesc = RAPIER.ColliderDesc.cuboid(
            this.tileSize / 4,
            this.tileSize / 4
        ).setCollisionGroups(0x00010002);
        this.collider = this.world.createCollider(colDesc, this.RB);
    }
    detinate(
        mapGrid: number[][],
        tileArray: { [key: string]: NormalSoil },
        time: number
    ) {
        const pos = this.RB.translation();
        const tileImOn = {
            x: Math.floor(pos.x / this.tileSize),
            y: Math.floor(pos.y / this.tileSize),
        };
        console.log("detinayte");
        for (let i = tileImOn.y - 1; i < tileImOn.y + 2; i++) {
            for (let j = tileImOn.x - 1; j < tileImOn.x + 2; j++) {
                if (tileArray[`${j},${i}`]) {
                    const tile = tileArray[`${j},${i}`];
                    tile.body.destroy();
                    this.world.removeRigidBody(tile.RB);
                    delete tileArray[`${j},${i}`];
                }
            }
        }
    }
    syncBody() {
        const pos = this.RB.translation();
        this.body.setPosition(pos.x, pos.y);
    }
}
export class DrillBomb {
    scene: Phaser.Scene;
    world: RAPIER.World;
    body: Phaser.GameObjects.Sprite;
    RB: RAPIER.RigidBody;
    tileSize: number;
    collider: RAPIER.Collider;
    constructor(
        scene: Phaser.Scene,
        world: RAPIER.World,
        x: number,
        y: number
    ) {
        this.tileSize = 32;
        this.scene = scene;
        this.world = world;
        this.body = this.scene.add.sprite(x, y, "pickups", 1);
        const rbDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(x, y)
            .setUserData({ type: "DrillBomb" });
        this.RB = this.world.createRigidBody(rbDesc);
        const colDesc = RAPIER.ColliderDesc.cuboid(
            this.tileSize / 4,
            this.tileSize / 4
        ).setCollisionGroups(0x00010002);
        this.collider = this.world.createCollider(colDesc, this.RB);
    }

    detinate(
        mapGrid: number[][],
        tileArray: { [key: string]: NormalSoil },
        time: number
    ) {
        const pos = this.RB.translation();
        const tileImOn = {
            x: Math.floor(pos.x / this.tileSize),
            y: Math.floor(pos.y / this.tileSize),
        };
        for (let i = tileImOn.y; i < tileImOn.y + 4; i++) {
            if (tileArray[`${tileImOn.x},${i}`]) {
                const tile = tileArray[`${tileImOn.x},${i}`];
                tile.body.destroy();
                this.world.removeRigidBody(tile.RB);
                delete tileArray[`${tileImOn.x},${i}`];
            }
        }
    }
    syncBody() {
        const pos = this.RB.translation();
        this.body.setPosition(pos.x, pos.y);
    }
}
export class diamond {
    scene: Phaser.Scene;
    world: RAPIER.World;
    body: Phaser.GameObjects.Rectangle;
    RB: RAPIER.RigidBody;
    tileSize: number;
    collider: RAPIER.Collider;
    constructor(
        scene: Phaser.Scene,
        world: RAPIER.World,
        x: number,
        y: number
    ) {
        this.tileSize = 32;
        this.scene = scene;
        this.world = world;
        this.body = this.scene.add.rectangle(x, y, 16, 16, 0x0000ff);
        const rbDesc = RAPIER.RigidBodyDesc.fixed()
            .setTranslation(x, y)
            .setUserData({ type: "Bomb" });
        this.RB = this.world.createRigidBody(rbDesc);
        const colDesc = RAPIER.ColliderDesc.cuboid(
            this.tileSize / 4,
            this.tileSize / 4
        ).setSensor(true);
        this.collider = this.world.createCollider(colDesc, this.RB);
    }
    detinate() {}
    syncBody() {
        const pos = this.RB.translation();
        this.body.setPosition(pos.x, pos.y);
    }
}

