import * as PIXI from 'pixi.js'
import ShootingGamesScene from './ShootingGamesScene';

import { TextButton, TextLabel } from './TextButton';

// Main menu scene that launch the game
export class MainMenuScene extends ShootingGamesScene {
    public buttons: PIXI.Sprite

    public buttonsHeight: number = 0;
    public createMenuButton(lable: string, onClick: () => void) {


        const button = new PIXI.Sprite();
        const buttonBack = new PIXI.Sprite(this.mainTextureAtlas.getFrame("button"));
        button.anchor.set(0.5, 0.5)
        buttonBack.anchor.set(0.5, 0.5)
        button.addChild(buttonBack)
        button.addChild(new TextButton(lable, onClick))


        this.buttons.addChild(button);
        buttonBack.scale.set(3, 3)
        button.y = this.buttons.children.length * (buttonBack.height * 0.75)
        this.buttonsHeight = button.y + buttonBack.height;

    }


    public build(resources: Partial<Record<string, PIXI.LoaderResource>>) {

        this.buttons = new PIXI.Sprite();

        const gotoGame1 = () => {
            this.engine.setActiveScene("game1");
        }


        this.createMenuButton("GAME1", gotoGame1)
        this.createMenuButton("GAME2", gotoGame1)
        this.createMenuButton("GAME3", gotoGame1)
        this.createMenuButton("EXIT", () => {
            window.location.href = "https://www.playngo.com/"
        })
        this.addChild(this.buttons)
        this.buttons.anchor.set(0.5, 0.5)

        const logo = new PIXI.Sprite(this.mainTextureAtlas.getFrame("logo"))
        logo.anchor.set(0.5, 0.5);
        logo.position.set(10, -32);
        logo.scale.set(1.5, 1.5)
        this.buttons.addChild(logo)

        this.buttonsHeight -= logo.texture.height;

        this.buttons.x = (this.engine.renderer.width / 2) - (this.buttons.width / 2)
        this.buttons.y = (this.engine.renderer.height / 2) - (this.buttonsHeight / 2)

        const splash = new PIXI.Sprite(this.mainTextureAtlas.getFrame("splash"));
        splash.anchor.set(0.5, 0.5);
        splash.scale.set(2, 2)
        this.addChild(splash)


        const label = new TextLabel("LEFT/RIGHT/UP/DOWN for movements and SPACE for shoot missile")
        this.buttons.addChild(label)
        label.y = this.buttonsHeight + 50
        label.x = this.buttons.width / 2

        label.scale.set(0.75)

        splash.x = (this.engine.renderer.width / 2);
        splash.y = (this.engine.renderer.height / 2);
        this.buttons.renderable = false;
        //create timer to fade out the splash screen
        this.timers.create((time: number) => {
            if (time > 2) {
                splash.alpha -= 0.05;
            }
            if (splash.alpha <= 0) {
                this.buttons.renderable = true;
                return false

            }
            return true

        }, 0.25 * 0.3);
    }
}