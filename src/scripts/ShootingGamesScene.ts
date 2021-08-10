import { AppEngine, PIXIScene } from "./PIXIAppEngine"

import { TextButton } from "./MenuScene"
import { TextureAtlas } from './TextureAtlas';

export default class ShootingGamesScene extends PIXIScene {

    protected exitButton: TextButton
    public mainTextureAtlas: TextureAtlas
    constructor(engine: AppEngine, onExit: () => void) {
        super(engine)
        this.exitButton = new TextButton("Exit", onExit)
        this.addChild(this.exitButton)
    }

    public resize(width: number, height: number) {

        this.exitButton.x = width - this.exitButton.width
        this.exitButton.y = 50
    }


}