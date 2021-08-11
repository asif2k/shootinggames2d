import * as PIXI from 'pixi.js'

export class TextureAtlas {
    public frames = new Map<string, PIXI.Texture>();
    public baseTexture: PIXI.BaseTexture
    public allFrames: PIXI.Texture[] = []

    public addFrame(key: string, x: number, y: number, width: number, height: number): PIXI.Texture {
        const frame = new PIXI.Texture(this.baseTexture, new PIXI.Rectangle(x, y, width, height));
        this.frames.set(key, frame)
        this.allFrames.push(frame);
        return frame;
    }

    public addFramePer(key: string, x: number, y: number, width: number, height: number): PIXI.Texture {
        return this.addFrame(key,
            x * this.baseTexture.width, y * this.baseTexture.height,
            width * this.baseTexture.width, height * this.baseTexture.height
        )
    }

    public addFramesList(keyPrefix: string, xStart: number, yStart: number, frameWidth: number, frameHeight: number, width: number, height: number) {
        let i = 0, x = 0, y = 0;
        for (y = yStart; y < yStart + height; y += frameHeight) {
            for (x = xStart; x < xStart + width; x += frameWidth) {
                this.addFrame(`${keyPrefix}-${i++}`, x, y, frameWidth, frameHeight)
            }
        }
    }

    public prepareAllFrames(keyPrefix: string, frameWidth: number, frameHeight: number) {
        this.addFramesList(keyPrefix, 0, 0, frameWidth, frameHeight, this.baseTexture.width, this.baseTexture.height)
    }

    public getFramesList(...keys: string[]): PIXI.Texture[] {
        const textures: PIXI.Texture[] = []
        keys.forEach(key => textures.push(this.getFrame(key)))
        return textures
    }

    public getFramesListByPrefix(prefix: string) {

        const textures: PIXI.Texture[] = []

        this.frames.forEach((texture: PIXI.Texture, key: string) => {

            if (key.indexOf(prefix) > -1) {
                textures.push(texture)
            }
        });

        return textures
    }

    public getFrame(key: string): PIXI.Texture {
        return this.frames.get(key) as PIXI.Texture
    }

    constructor(baseTexture: PIXI.BaseTexture) {
        this.baseTexture = baseTexture;
    }
}

