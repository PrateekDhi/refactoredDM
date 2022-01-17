/**
 * Abstract Class Aggregation
 */

module.exports =  class Aggregation{
    constructor(){
        if(this.constructor == Aggregation){
            throw new Error("Aggregation class cannot be instantiated");
        }
    }
    aggregate(pipeline){
        throw new Error("aggregate method must be implemented");
    }
}