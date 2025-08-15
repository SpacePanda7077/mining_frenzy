import { Game as MainGame } from "./scenes/Game";
import { Initialize } from "./scenes/Initialize_Physics";
import { Setup } from "./scenes/Setup";
import { UI as GameUI } from "./scenes/Ui";
import { Menu as GameMenu } from "./scenes/Menu";
import { AUTO, Game, Types } from "phaser";

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 640,
    height: 960,
    parent: "game-container",
    backgroundColor: "#028af8",
    scene: [Setup, GameMenu, Initialize, MainGame, GameUI],
    pixelArt: true,
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;

