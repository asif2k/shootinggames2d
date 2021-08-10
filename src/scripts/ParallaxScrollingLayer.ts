import * as PIXI from 'pixi.js'


export class ParallaxScrollingLayer extends PIXI.Container {

    public fieldSize: PIXI.Rectangle;
    public fieldDirection: PIXI.Point
    constructor(fieldSize: PIXI.Rectangle, fieldDirection: PIXI.Point) {
        super();
        this.fieldSize = fieldSize;
        this.fieldDirection = fieldDirection;
    }
    public addSprite(sprite: PIXI.Sprite, x: number, y: number) {
        this.addChild(sprite);
        sprite.position.set(x, y)

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

            if (sprite.x + sprite.width < left) {
                sprite.x = right + sprite.width
            }
            else if (sprite.x - sprite.width > right) {
                sprite.x = left + sprite.width
            }

            else if (sprite.y + sprite.height < top) {
                sprite.y = bottom + sprite.height
            }
            else if (sprite.y - sprite.height > bottom) {
                sprite.y = top + sprite.height
            }



        }


    }








}