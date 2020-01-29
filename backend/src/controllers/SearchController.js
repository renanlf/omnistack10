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
            // converte o array de elementos da busca em expressoes regulares
            // agora ele busca devs que tenham pelo menos uma das techs
            // sem levar em consideracao maiuscula/minuscula
            // ou se a palavra esta completa
            regexpArrays = techsArray.map(el => new RegExp(el, 'i'))

            filter = {
                location : locationFilter,
                techs : {
                    $in: regexpArrays,
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