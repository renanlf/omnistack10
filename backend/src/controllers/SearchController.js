const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response){
        const { latitude, longitude, techs } = request.query;
        const techsArray = parseStringAsArray(techs);

        console.log('Techs Array', techsArray);

        const locationFilter = {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                $maxDistance : 10000,
            },
        };

        var filter = null;

        if(techsArray.length > 0){
            filter = {
                location : locationFilter,
                techs : {
                    $in: techsArray,
                },
            }
        } else {
            filter = {
                location : locationFilter,
            }
        }

        console.log(filter);

        const devs = await Dev.find(filter);

        return response.json({ devs });
    },
};