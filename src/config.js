export let config = function(){
    const nodeEnv = env;
    switch(nodeEnv){
        case 'development':
            return { api: 'http://localhost:10000', analyticsId: 86669773 };

        case 'production':
            return {api: 'https://houme-api.herokuapp.com', analyticsId: 86669567 };
        
        case 'qa':
            return {api: 'https://houmly-dev-api.herokuapp.com', analyticsId: 86668354 }

        default:
            return {api: 'http://localhost:10000', analyticsId: 86669773};
    }
};