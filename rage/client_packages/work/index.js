let stationPosition = [];
let currentStation = 0;
let stationShape = null;
let stationMarker = null;
let stationTimer = 0;

mp.events.add("render",() => {
    mp.game.graphics.drawText(`~p~Balance: ~g~${mp.players.local.getVariable('money')}`, [0.5, 0.005], {
      font: 4,
      color: [255, 255, 255, 255],
      scale: [0.5, 0.5],
      outline: true
    });
});

const setMarker = () => {
    if (currentStation === stationPosition.length) currentStation = 0;
    stationMarker = mp.markers.new(1, stationPosition[currentStation], 3.0);
    stationShape = mp.colshapes.newCircle(stationPosition[currentStation].x, stationPosition[currentStation].y, 3.0);
    stationShape.active = true;
    mp.game.ui.setNewWaypoint(stationPosition[currentStation].x, stationPosition[currentStation].y);
    currentStation++;
}

mp.events.add("START:JOB",() => {
    setMarker();
    mp.game.graphics.notify(`~p~[ Bus Driver ] ~g~You start work`);
});

mp.events.add("STOP:JOB",(player) => {
    stationShape.active = false;
    stationMarker.destroy();
    stationShape.destroy();
    mp.game.ui.setNewWaypoint(stationPosition[currentStation].x, stationPosition[currentStation].y);
    mp.game.ui.setNewWaypoint(mp.players.local.position.x, mp.players.local.position.y);
});

mp.events.add("playerEnterColshape",(shape) => {
    if (shape == stationShape) {
        mp.game.graphics.notify(`~p~[ Bus Driver ] ~g~ Please stay on station 10 sec`);
        stationTimer = setTimeout(function ()  {
            stationShape.active = false;
            stationMarker.destroy();
            stationShape.destroy();
            [stationMarker, stationShape] = [undefined, undefined];
            setMarker();
            mp.events.callRemote('MONEY:UPDATE');
        }, 10000)

    }
});

mp.events.add("playerExitColshape",(shape) => {
    if (shape == stationShape && stationShape.active) {
        clearTimeout(stationTimer);
        mp.game.graphics.notify(`~p~[ Bus Driver ] ~g~ Back to Station`);
    }
});

(async () => {
    stationPosition = await mp.events.callRemoteProc('GET:STATION:POSITION');
})();