import { class_a
       } from './class_a';
export class class_b {
    readonly a:class_a
constructor(){
    this.a = class_a.instance;
}
}