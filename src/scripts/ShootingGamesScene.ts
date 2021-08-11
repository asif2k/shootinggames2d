import { AppEngine } from "./PIXIAppEngine"
import { PIXIScene } from "./PIXIScene";
import { TextureAtlas } from './TextureAtlas';



export default class ShootingGamesScene extends PIXIScene {


    public mainTextureAtlas: TextureAtlas

    constructor(engine: AppEngine) {
        super(engine)


    }


}