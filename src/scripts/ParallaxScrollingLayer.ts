import * as PIXI from 'pixi.js'


import { PIXIAnimatable } from './PIXIScene';


type ParallaxScrollingSpriteReposition = (sprite: PIXI.Sprite) => void;

export class ParallaxScrollingLayer extends PIXI.Container implements PIXIAnimatable {

    public fieldSize: PIXI.Rectangle;
    public fieldDirection: PIXI.Point


    public respositionCallback: ParallaxScrollingSpriteReposition | null
    constructor(fieldSize: PIXI.Rectangle, fieldDirection: PIXI.Point) {
        super();
        this.fieldSize = fieldSize;
        this.fieldDirection = fieldDirection;
    }

    public addSpritesRandom(texture: PIXI.Texture, count: number) {
        let sc = 1;
        for (let i = 0; i < count; i++) {
            sc = (Math.random() * 0.25) + 0.25
            this.addSprite(new PIXI.Sprite(texture), this.fieldSize.width * Math.random(), this.fieldSize.height * Math.random())
                .scale.set(sc, sc)
        }
    }
    public addSprite(sprite: PIXI.Sprite, x: number, y: number) {
        this.addChild(sprite);
        sprite.position.set(x, y)

        return sprite

    }
    public update(timeDelta: number) {
        let sprite;

        let left = this.fieldSize.x;
        let right = left + this.fieldSize.width;
        let top = this.fieldSize.y;
        let bottom = top + this.fieldSize.height;


        for (let i = 0; i < this.children.length; i++) {
            sprite = this.children[i] as PIXI.Sprite;
            sprite.x += this.fieldDirection.x * timeDelta;
            sprite.y += this.fieldDirection.y * timeDelta;

            if (this.fieldDirection.x < 0 && (sprite.x + sprite.width < left)) {
                sprite.x = right;
                if (this.respositionCallback) this.respositionCallback(sprite)
            }
            else if (this.fieldDirection.x > 0 && (sprite.x - sprite.width > right)) {
                sprite.x = left - sprite.width
                if (this.respositionCallback) this.respositionCallback(sprite)
            }

            else if (this.fieldDirection.y < 0 && (sprite.y + sprite.height < top)) {
                sprite.y = bottom
                if (this.respositionCallback) this.respositionCallback(sprite)
            }
            else if (this.fieldDirection.y > 0 && (sprite.y - sprite.height > bottom)) {
                sprite.y = top - sprite.height
                if (this.respositionCallback) this.respositionCallback(sprite)
            }



        }


    }








}