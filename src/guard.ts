// TODO: Interface Guard
// TODO: Class InstanceGuard
// TODO: Class TypeGuard


export default class Guard {

    private matchValue: any;
    private matchType: any;
    private matchInstance: any;
    private guardFromInstance: boolean;
    private guardFromType: boolean;

    constructor () {
        this.guardFromInstance = false;
        this.guardFromType = false;
    }

    type(matchType: any): void {
        this.matchType = matchType;
        this.guardFromType = true;
    }

    instance(matchInstance: any): void {
        this.matchInstance = matchInstance;
        this.guardFromInstance = true;
    }

    value(matchValue: any) {
        this.matchValue = matchValue;
    }

    shouldBe(expected: any) : void {
        if(this.guardFromInstance) {
            if(!(this.matchValue instanceof expected)) {
                throw new Error(`Dynamic value ${this.matchValue} should be instance of ${expected}`);
            }
        }

        if(this.guardFromType) {
            if(typeof this.matchValue != expected) {
                throw new Error(`Dynamic value ${this.matchValue} should be ${expected} type`);
            }
        }
    }
}