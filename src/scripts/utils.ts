//generic objects pooling object that is used in demos
export class ObjectsPool {
    public free_objects: any[] = []
    public alocated: number = 0
    public freed: number = 0
    public get(params?: any): any {
        if (this.freed > 0) {
            return this.free_objects[--this.freed]
        }
        else {
            if (this.alocated >= this.poolSize) return undefined
            this.alocated++;
            return this.creator(params)
        }
    }
    public free(obj: any) {

        this.free_objects[this.freed++] = obj;
    }

    constructor(public creator: (params?: any) => void, public poolSize: number = Infinity) {

    }
}

// easing functions used for animations in demos
export const EasingsFunc = {
    "Linear": function (t: number) {
        return t
    },
    "BounceIn": function (t: number) {
        return 1 - EasingsFunc.BounceOut(1 - t);
    },
    "BounceOut": function (t: number) {
        if (t < (1 / 2.75)) { return 7.5625 * t * t; }
        else if (t < (2 / 2.75)) { return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75; }
        else if (t < (2.5 / 2.75)) { return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375; }
        else { return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375; }
    },
    "BackOut": function (t: number) {
        return --t * t * ((1.70158 + 1) * t + 1.70158) + 1;
    },

    "CubicOut": function (t: number) {
        return (--t) * t * t + 1;
    },
}


export const GuidInteger = (function () {
    var guidCounter = 0;
    return function () {
        return (Date.now() + guidCounter++);
    }
})();


export function Distance2d(x1: number, y1: number, x2: number, y2: number) {
    x1 = x2 - x1;
    y1 = y2 - y1;

    return Math.abs(Math.sqrt(x1 * x1 + y1 * y1))

}