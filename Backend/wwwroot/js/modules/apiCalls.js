export default class api {
    constructor() {
        this.hostAddress = 'http://localhost:5273';
    }

    async getAnonymous(endPoint, parameters, callback){
        const url = `${this.hostAddress}${endPoint}`;
        try {
            const response = await fetch(url, parameters);
            callback(response)
        } catch (error) { 
            console.error(error.message);
        }
    }
}
