suite('player', function() {
  setup(function() {
    document.timeline.players = [];
  });
  test('playing works as expected', function() {
    tick(100);
    var p = document.body.animate([], 2000);
    assert.equal(p.startTime, 100);
    assert.equal(p.currentTime, 0);
    tick(300);
    assert.equal(p.startTime, 100);
    assert.equal(p.currentTime, 200);
  });
  test('pause at start of play', function() {
    tick(100);
    var p = document.body.animate([], 2000);
    p.pause();
    assert.equal(p.currentTime, 0);
    tick(300);
    p.play();
    assert.equal(p.currentTime, 0);
    tick(400);
    assert.equal(p.currentTime, 100);
    assert.equal(p.startTime, 300);

    var p = document.body.animate([], 2000);
    p.startTime -= 1000;
    p.pause();
    assert.equal(p.currentTime, 1000);
    return;
    tick(700);
    p.play();
    assert.equal(p.currentTime, 1000);
    tick(800);
    assert.equal(p.currentTime, 1100);
    assert.equal(p.startTime, -300);
  });
  test('pausing works as expected', function() {
    tick(200);
    var p = document.body.animate([], 3000);
    tick(1500);
    assert.equal(p.startTime, 200);
    assert.equal(p.currentTime, 1300);
    p.pause();
    assert.equal(p.startTime, null);
    assert.equal(p.currentTime, 1300);
    tick(2500);
    assert.equal(p.startTime, null);
    assert.equal(p.currentTime, 1300);
    p.play();
    assert.equal(p.startTime, 1200);
    assert.equal(p.currentTime, 1300);
    tick(3500);
    assert.equal(p.startTime, 1200);
    assert.equal(p.currentTime, 2300);
  });
  test('reversing works as expected', function() {
    tick(300);
    var p = document.body.animate([], 1000);
    assert.equal(p.startTime, 300);
    assert.equal(p.currentTime, 0);
    tick(600);
    assert.equal(p.startTime, 300);
    assert.equal(p.currentTime, 300);
    assert.equal(p.playbackRate, 1);
    p.reverse();
    assert.equal(p.startTime, 900);
    assert.equal(p.currentTime, 300);
    assert.equal(p.playbackRate, -1);
    tick(700);
    assert.equal(p.startTime, 900);
    assert.equal(p.currentTime, 200);
  });
  test('limiting works as expected', function() {
    tick(400);
    var p = document.body.animate([], 1000);
    assert.equal(p.startTime, 400);
    assert.equal(p.currentTime, 0);
    tick(900);
    assert.equal(p.startTime, 400);
    assert.equal(p.currentTime, 500);
    tick(1400);
    assert.equal(p.startTime, 400);
    assert.equal(p.currentTime, 1000);
    tick(1500);
    assert.equal(p.startTime, 400);
    assert.equal(p.currentTime, 1000);
    p.reverse();
    assert.equal(p.playbackRate, -1);
    assert.equal(p.currentTime, 1000);
    assert.equal(p.startTime, 2500);
    tick(2000);
    assert.equal(p.currentTime, 500);
    assert.equal(p.startTime, 2500);
    tick(2500);
    assert.equal(p.currentTime, 0);
    assert.equal(p.startTime, 2500);
    tick(2600);
    assert.equal(p.currentTime, 0);
    assert.equal(p.startTime, 2500);
  });
  test('play after limit works as expected', function() {
    tick(500);
    var p = document.body.animate([], 2000);
    tick(2600);
    assert.equal(p.currentTime, 2000);
    assert.equal(p.startTime, 500);
    assert.equal(p.finished, true);
    assert.equal(p.playbackRate, 1);
    p.play();
    assert.equal(p.startTime, 2600);
    assert.equal(p.currentTime, 0);
    assert.equal(p.finished, false);
    assert.equal(p.playbackRate, 1);
  });
  test('play after limit works as expected (reversed)', function() {
    tick(600);
    var p = document.body.animate([], 3000);
    tick(700);
    p.reverse();
    tick(900);
    assert.equal(p.startTime, 800);
    assert.equal(p.currentTime, 0);
    assert.equal(p.finished, true);
    assert.equal(p.playbackRate, -1);
    p.play();
    assert.equal(p.startTime, 3900);
    assert.equal(p.currentTime, 3000);
    assert.equal(p.finished, false);
    assert.equal(p.playbackRate, -1);
  });
  test('seeking works as expected', function() {
    tick(700);
    var p = document.body.animate([], 2000);
    tick(900);
    assert.equal(p.currentTime, 200);
    p.currentTime = 600;
    assert.equal(p.currentTime, 600);
    assert.equal(p.startTime, 300);
    p.reverse();
    assert.equal(p.startTime, 1500);
    p.currentTime = 300;
    assert.equal(p.currentTime, 300);
    assert.equal(p.startTime, 1200);
  });
  test('seeking while paused works as expected', function() {
    tick(800);
    var p = document.body.animate([], 1000);
    tick(1000);
    p.pause();
    assert.equal(p.currentTime, 200);
    assert.equal(p.startTime, null);
    assert.equal(p.paused, true);
    p.currentTime = 500;
    assert.equal(p.startTime, null);
    assert.equal(p.paused, true);
  });
  test('setting start time while paused is ignored', function() {
    tick(900);
    var p = document.body.animate([], 1234);
    p.pause();
    assert.equal(p.startTime, null);
    assert.equal(p.currentTime, 0);
    p.startTime = 2232;
    assert.equal(p.startTime, null);
    assert.equal(p.currentTime, 0);
  });
  test('finishing works as expected', function() {
    tick(1000);
    var p = document.body.animate([], 2000);
    p.finish();
    assert.equal(p.startTime, -1000);
    assert.equal(p.currentTime, 2000);
    p.reverse();
    p.finish();
    assert.equal(p.currentTime, 0);
    assert.equal(p.startTime, 1000);
  });
  test('cancelling does what it does', function() {
    tick(1100);
    var p = document.body.animate([], 1000);
    tick(1600);
    assert.equal(p.currentTime, 500);
    p.cancel();
    assert.equal(p.currentTime, 0);
    tick(2000);
    assert.equal(p.currentTime, 0);
  });
  test('startTime is set on first tick if timeline hasn\'t started', function() {
    document.timeline.currentTime = undefined;
    var p = document.body.animate([], 1000);
    tick(0);
    tick(100);
    assert.equal(p.startTime, 0);
  });
  test('players which are finished and not filling get discarded', function() {
    tick(100);
    var nofill = document.body.animate([], 100);
    var fill = document.body.animate([], {duration: 100, fill: 'forwards'});
    assert.deepEqual(document.timeline.players, [nofill, fill]);
    tick(400);
    assert.deepEqual(document.timeline.players, [fill]);
  });
  test('discarded players get re-added on modification', function() {
    tick(100);
    var player = document.body.animate([], 100);
    tick(400);
    assert.deepEqual(document.timeline.players, []);
    player.currentTime = 0;
    assert.deepEqual(document.timeline.players, [player]);
  });
  test('players in the before phase are not discarded', function() {
    tick(100);
    var player = document.body.animate([], 100);
    player.currentTime = -50;
    tick(110);
    assert.deepEqual(document.timeline.players, [player]);
  });
  test('animations starting in the future are not in effect', function() {
    var fractions = [];
    tick(100);
    var player = document.body.animate(function(fraction) { fractions.push(fraction); }, 1000);
    player.startTime = 1000;
    tick(200);
    tick(1000);
    tick(1100);
    assert.deepEqual(fractions, [null, 0, 0.1]);
  });
  test('players that go out of effect should not clear the effect of players that are in effect', function() {
    var target = document.createElement('div');
    document.body.appendChild(target);
    tick(0);
    var playerBehind = target.animate([{width: '111px'}, {width: '111px'}], 200);
    var playerInfront = target.animate([{width: '222px'}, {width: '222px'}], 100);
    tick(50);
    assert.equal(getComputedStyle(target).width, '222px', 't = 50');
    tick(150);
    assert.equal(getComputedStyle(target).width, '111px', 't = 150');
    target.remove();
  });
  test('player modifications should update CSS effects immediately', function() {
    var target = document.createElement('div');
    document.body.appendChild(target);
    tick(0);
    var playerBehind = target.animate([{width: '1234px'}, {width: '1234px'}], {duration: 1, fill: 'both'});
    var playerInfront = target.animate([{width: '0px'}, {width: '100px'}], 100);
    assert.equal(getComputedStyle(target).width, '0px');
    playerInfront.currentTime = 50;
    assert.equal(getComputedStyle(target).width, '50px');
    playerInfront.currentTime = 100;
    assert.equal(getComputedStyle(target).width, '1234px');
    playerInfront.play();
    assert.equal(getComputedStyle(target).width, '0px');
    playerInfront.startTime = -50;
    assert.equal(getComputedStyle(target).width, '50px');
    target.remove();
  });
});
