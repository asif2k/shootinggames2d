
import * as PIXI from 'pixi.js'
import { PIXIScene, AppEngine } from './PIXIAppEngine';

//generic textbutton that are used to display clickable text on screen
export class TextButton extends PIXI.Text {
    static labelStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'],
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
        lineJoin: 'round',
    });
    constructor(label: string, onClick: () => void) {
        super(label, TextButton.labelStyle)
        this.interactive = true
        this.buttonMode = true
        this.anchor.set(0.5)

        this.on('pointerover', () => {
            this.tint = 0xFF0000;
        })
        this.on('touchstart', () => {
            this.tint = 0xFF0000;
        })

        this.on('click', () => {
            onClick();
        })

        this.on('touchend', () => {
            this.tint = 0xFFFFFF;
            onClick();
        })

        this.on('pointerout', () => {
            this.tint = 0xFFFFFF;
        })




    }
}



//generic menu scene class that display vertical menu using textbuttons
export class TextMenuScene extends PIXIScene {
    public buttons = new PIXI.Sprite()
    constructor(engine: AppEngine) {
        super(engine)

        this.addChild(this.buttons)
        this.buttons.anchor.set(0.5);


    }
    public resize(width: number, height: number) {
        this.buttons.x = (width / 2) - (this.buttons.width / 2)
        this.buttons.y = (height / 2) - (this.buttons.height / 2)

    }
    public add(label: string, onClick: () => void): PIXI.Sprite {
        const button = new TextButton(label, onClick)
        button.y = this.buttons.children.length * 60
        this.buttons.addChild(button)
        return button;
    }
}

