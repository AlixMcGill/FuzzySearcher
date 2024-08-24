export default class api {
    constructor() {
        this.hostAddress = 'http://localhost:5273';
    }

    async anonymous(endPoint, parameters, callback){
        const url = `${this.hostAddress}${endPoint}`;
        try {
            const response = await fetch(url, parameters);
            callback(response)
        } catch (error) { 
            console.error(error.message);
        }
    }

    async authorized(endPoint, parameters, callback){
        const url = `${this.hostAddress}${endPoint}`;
        try {
            console.log(url)
            const response = await fetch(url, parameters);
            console.log(response)
            callback(response)
        } catch (error) { 
            console.error(error.message);
        }
    }
}
