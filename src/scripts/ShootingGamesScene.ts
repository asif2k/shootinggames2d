import { AppEngine } from "./PIXIAppEngine"
import { PIXIScene } from "./PIXIScene";
import { TextureAtlas } from './TextureAtlas';

//base screen used in shooting game app

export default class ShootingGamesScene extends PIXIScene {


    public mainTextureAtlas: TextureAtlas

    constructor(engine: AppEngine) {
        super(engine)


    }


}