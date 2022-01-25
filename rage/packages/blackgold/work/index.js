const stationPosition = [
    new mp.Vector3(-82.33802032470703, 44.20296859741211, 71.62043762207031),
    new mp.Vector3(-278.346923828125, 118.35195922851562, 68.33942413330078),
    new mp.Vector3(-452.792236328125, 121.2022933959961, 64.17211151123047),
];

const allowedVehicles = [2222034228, 3581397346];

mp.events.addProc('GET:STATION:POSITION', (player) => {
    return stationPosition;
});

mp.events.add("MONEY:UPDATE",(player) => {
    let currentBalance = player.getVariable('money');
    player.setVariable('money', currentBalance + 10);
});

mp.events.addCommand("startjob",(player) => {
    if (!player.vehicle) return player.notify('~p~[Bus Driver] ~g~You need be in the bus');
    if (!allowedVehicles.includes(player.vehicle.model)) return player.notify('~p~[Bus Driver] ~g~Your car not allowed');
    if (player.work) return player.notify('~p~[Bus Driver] ~g~You already work bus driver');
    player.call('START:JOB');
    player.work = true;
});
mp.events.addCommand("stopjob",(player) => {
    player.work = false;
});

mp.events.add("playerExitVehicle",(player) => {
    if (player.work) {
        player.work = false;
        player.call('STOP:JOB');
    }
});