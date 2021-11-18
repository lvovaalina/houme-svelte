export let config = function(){
    switch(env){
        case 'development':
            return {api: 'http://localhost:10000'};

        case 'production':
            return {api: 'https://houme-api.herokuapp.com'};
        
        case 'qa':
            return {api: 'https://houmly-dev-api.herokuapp.com'}

        default:
            return {api: 'http://localhost:10000'};
    }
};