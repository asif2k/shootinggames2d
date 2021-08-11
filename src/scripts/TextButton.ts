import * as PIXI from 'pixi.js'

//generic textbutton that are used to display clickable text on screen



export class TextButton extends PIXI.Text {
    static textButtonStyle = new PIXI.TextStyle({
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
        super(label, TextButton.textButtonStyle)
        this.interactive = true
        this.buttonMode = true
        this.anchor.set(0.5)

        this.on('pointerover', () => {
            this.tint = 0x00FF00;
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

export class TextLabel extends PIXI.Text {
    static textLabelStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 26,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'],
    });
    constructor(label: string) {
        super(label, TextLabel.textLabelStyle)
        this.anchor.set(0.5)

    }
}

