module.exports = function calculateDistance(center, point){
    const toRadians = (degrees) => degrees * (Math.PI/180);

    const radius = 6371;

    const d = { 
        latitude  : (point.latitude  - center.latitude ),
        longitude : (point.longitude - center.longitude),
    }

    const a = (Math.sin(toRadians(d.latitude) / 2))
        + (Math.cos(toRadians(center.latitude)) * Math.cos(toRadians(point.latitude)))
        + (Math.sin(toRadians(d.longitude)));

    const centerPosition = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = radius * centerPosition;

    return distance;
}