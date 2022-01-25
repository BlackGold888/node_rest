require('./work');

mp.events.addCommand("veh",(player, name) => {
    const vehicle = mp.vehicles.new(mp.joaat(name), player.position);
    player.putIntoVehicle(vehicle, 0);
});

mp.events.add("playerReady",(player) => {
    player.setVariable('money', 0);
    player.spawn(new mp.Vector3(-4.5174078941345215, 7.921111583709717, 70.99921417236328));
    mp.vehicles.new(
        mp.joaat('coach'),
        new mp.Vector3(-2.8988280296325684, 13.373432159423828, 70.94503784179688),
        {
            heading: 70
        }
    );
});