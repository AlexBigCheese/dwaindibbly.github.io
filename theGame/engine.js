var pregame = {
  enemyTemplate: function (x,y,hp) {
    this.w = this.h = 16;
    this.hp = hp;
    this.x = x;
    this.y = y;
    this.gravity = false;
    this.spd = {
      x:0,
      y:0
    };
    this.cols = {};
    return this;
  }
};
var game = {
  screenfx:{
    hud: false,
  },
  bulletTemplate: function (spdx2,spdy2) {
    var spdx = spdx2;
    var spdy = spdy2;
    var toReturn = {
      speeds:{
        x: spdx,
        y: spdy,
      },
      pos: {
        x: game.data.player.wep.x,
        y: game.data.player.wep.y
      }
    };
    return toReturn;
  },
  data: {
    map: "start",
    get p() {
      return game.data.player;
    },
    player: {
      gravity:true,
      x: 0,
      y: 0,
      w: 16,
      h: 16,
      hp: 10,
      stamina: 1000,
      maxstam: 1000,
      stamTimeout:500,
      clip: 10,
      reloads: 10,
      floor: 0,
      still: true,
      cols: {middle: {touch: false,trigger: {}}},
      spd: {
        x: 0,
        y: 0,
      },
      forces:{
        gravity: false
      },
      mvs: {
        attack: false,
        attackTimeout: 0,
        jump: false,
        jumpTimeout: 0,
        jumps: 1,
        wallJump: false,
        wallJumpTimeout: 0,
        hang: false,
        reload: false,
      },
      wep: {
        get x() {return (game.gamepads[0].sticks.r.dist + 8) * Math.cos(game.gamepads[0].sticks.r.rot) + game.data.player.x;},
        get y() {return (game.gamepads[0].sticks.r.dist + 8) * Math.sin(game.gamepads[0].sticks.r.rot) + game.data.player.y;},
        show: false,
        bullets: [],
        bulletsMoving: true
      }
    }
  },
  options: {
    renderAnons: true,
  },
  rawpads: [],
  gamepads: [
    {
      id: 0,
      buttons: {
        a: {
          pressed: false,
          pressedlf: false
        },
        b: {
          pressed: false,
          pressedlf: false},
        x: {
          pressed: false,
          pressedlf: false},
        y: {
          pressed: false,
          pressedlf: false},
        l1: {
          pressed: false,
          pressedlf: false
        },
        r1: {
          pressed:false,
          pressedlf:false
        },
        select: {
          pressed:false,
          pressedlf:false
        }
      },
      sticks: {
        l: {
          x: 0,
          y: 0,
          rot: 0,
          dist: 0
        },
        r: {
          x: 0,
          y: 0,
          rot: 0,
          dist: 0
        }
      },
      dpad: {
        u: {pressed: false, pressedlf: false},
        d: {pressed: false, pressedlf: false},
        l: {pressed: false, pressedlf: false},
        r: {pressed: false, pressedlf: false},
      },
      buttonsraw: [],
      axesraw: []
    }
  ],
  renderpoints: {
    anons: [

    ],
    player: {
      rtype: "solid",
      color: "#fb0df3",
      get x() {return game.data.player.x;},
      get y() {return game.data.player.y;},
      width: 16,
      height: 16,
      weapon: {
        rtype: "solid",
        color: "#ebf0f5",
        get x() {return game.data.player.wep.x;},
        get y() {return game.data.player.wep.y;},
        width: 4,
        height: 4,
        get show() {return game.data.player.wep.show;},
      }
    },
    hud: {
      hptxt: {
        x:16,
        y:480 - 16,
        get color() {
          return "rgb(" + game.data.player.hp / 10 * 256 + ",0,0)";
        },
        get text() {
          return game.data.player.hp;
        },
        font: "20px Monospace"
      },
      cliptxt: {
        x: 360,
        y: 480 - 16,
        color: "#baf704",
        get text() {
          return game.data.player.clip;
        },
        font:"20px Monospace"
      }
    }
  },
  canv: {},
  draw: {},
  ents: [
    {
      name:"spawnpoint",
      x:18,
      y:2,
      map: "start"
    },

  ],
  maps: {
    "start":{
      number: 1,
      name: "start",
      geoms: [
        {
          type: "rect",
          x1: 30,
          x2: 40,
          y1: 50,
          y2: 60,
          color: "#32b910"
        },
        {
          type: "rect",
          x1: 40,
          x2: 50,
          y1: 50,
          y2: 60,
          color: "#ec0849"
        },
        {
          type: "rect",
          x1: 0,
          x2: 640,
          y1: 464,
          y2: 480,
          color: "#55f107"
        }
      ],
      sides: {
        right: "jump over"
      },
      triggers: [
        {
          func: function () {
            alert("BOI!");
          },
          x1: 100 - 16,
          x2: 100,
          y1: 10,
          y2: 32
        }
      ],
      enemies: [
        new pregame.enemyTemplate(100,450,2),
        new pregame.enemyTemplate(64,450,6)
      ]
    },
    "jump over": {
      geoms: [
        {
          type:"rect",
          x1:0,
          x2:640,
          y1:464,
          y2:480,
          color:"#00FF00",
        },
        {
          type:"rect",
          x1:600,
          x2:616,
          y1:432,
          y2:464,
          color:"#00FF00",
        }

      ],
      sides: {
        left: "start",
        right: "finish"
      }
    }
  },
  init:function () {
    game.canv = document.createElement("CANVAS");
    game.canv.width = 640;
    game.canv.height = 480;
    document.body.appendChild(game.canv);
    game.draw = game.canv.getContext("2d");
    window.addEventListener("keydown", function(ev) {
      switch (ev.key) {
        case "d":
          game.gamepads[0].dpad.r.pressed = true;
          game.gamepads[0].dpad.r.pressedlf = true;
          break;
        case "a":
          game.gamepads[0].dpad.l.pressed = true;
          game.gamepads[0].dpad.l.pressedlf = true;
          break;
        case "w":
          game.gamepads[0].dpad.u.pressed = true;
          game.gamepads[0].dpad.u.pressedlf = true;
          break;
        case "s":
          game.gamepads[0].dpad.d.pressed = true;
          game.gamepads[0].dpad.d.pressedlf = true;
          break;
        case "e":
          game.gamepads[0].buttons.y.pressed = true;
          game.gamepads[0].buttons.y.pressedlf = true;
          break;
        case "space" || " ":
          game.gamepads[0].buttons.a.pressed = true;
          game.gamepads[0].buttons.a.pressedlf = true;
          break;
        case "f":
          game.gamepads[0].buttons.l1.pressed = true;
          game.gamepads[0].buttons.l1.pressedlf = true;
          break;
      }
    });
    window.addEventListener("keyup", function(ev) {
      switch (ev.key) {
        case "d":
          game.gamepads[0].dpad.r.pressed = false;
          game.gamepads[0].dpad.r.pressedlf = false;
          break;
        case "a":
          game.gamepads[0].dpad.l.pressed = false;
          game.gamepads[0].dpad.l.pressedlf = false;
          break;
        case "w":
          game.gamepads[0].dpad.u.pressed = false;
          game.gamepads[0].dpad.u.pressedlf = false;
          break;
        case "s":
          game.gamepads[0].dpad.d.pressed = false;
          game.gamepads[0].dpad.d.pressedlf = false;
          break;
        case "space" || " ":
          game.gamepads[0].buttons.a.pressed = false;
          game.gamepads[0].buttons.a.pressedlf = false;
          break;
        case "f":
          game.gamepads[0].buttons.l1.pressed = false;
          game.gamepads[0].buttons.l1.pressedlf = false;
          break;
      }
    });
    window.requestAnimationFrame(game.loop);
  },
  loop:function () {
    game.updateGamepads();
    game.updateColls();
    game.update();
    game.render();
    window.requestAnimationFrame(game.loop);
  },
  updateColls: function () {
    var colObj = {
      up: {t:false,ent:{},geom:{}},
      down: {t:false,ent:{},geom:{}},
      left: {t:false,ent:{},geom:{}},
      right: {t:false,ent:{},geom:{}},
      middle: {trigger: {}, touch:false}
    };
    var gdp = game.data.player;
    var colLocs = {
      m: {x:gdp.x ,y: gdp.y},
      u: {x:[gdp.x - gdp.w / 2,gdp.x + gdp.w / 2],y: gdp.y - gdp.h / 2 - 1},
      d: {x:[gdp.x - gdp.w / 2,gdp.x + gdp.w / 2],y: gdp.y + gdp.h / 2 + 1},
      l: {x:gdp.x - gdp.w / 2 - 1,y:[gdp.y - gdp.h / 2, gdp.y + gdp.h / 2]},
      r: {x:gdp.x + gdp.w / 2 + 1,y:[gdp.y - gdp.h / 2, gdp.y + gdp.h / 2]},
    };
    var currMap = game.maps[game.data.map];
    for (var trig in currMap.triggers) {
      if ((colLocs.m.x > trig.x1) && (colLocs.m.x < trig.x2) && (colLocs.m.y > trig.y1) && (colLocs.m.y < trig.y2)) {
        colObj.middle.touch = true;
        colObj.middle.trigger = trig;
      }
      else {
        colObj.middle.touch = false;
      }
    }
    for (var geomno = 0;geomno < currMap.geoms.length;geomno++) {
      var simpleGeom = currMap.geoms[geomno];
      if (simpleGeom.type === "rect") {
        if ((colLocs.u.x.some(ux => (ux > simpleGeom.x1) && (ux < simpleGeom.x2))) && ((colLocs.u.y > simpleGeom.y1) && (colLocs.u.y < simpleGeom.y2))) {
          colObj.up.t = true;
        }
        if ((colLocs.d.x.some(dx => (dx > simpleGeom.x1) && (dx < simpleGeom.x2))) && ((colLocs.d.y > simpleGeom.y1) && (colLocs.d.y < simpleGeom.y2))) {
          colObj.down.t = true;
        }
        if (((colLocs.l.x > simpleGeom.x1) && (colLocs.l.x < simpleGeom.x2)) && (colLocs.l.y.some(lx => (lx > simpleGeom.y1) && (lx < simpleGeom.y2)))) {
          colObj.left.t = true;
        }
        if (((colLocs.r.x > simpleGeom.x1) && (colLocs.r.x < simpleGeom.x2)) && (colLocs.r.y.some(rx => (rx > simpleGeom.y1) && (rx < simpleGeom.y2)))) {
          colObj.right.t = true;
        }
      }
    }
    if ("enemies" in currMap) {
      for (var enemyno = 0;enemyno < currMap.enemies.length;enemyno++) {
        var enemyColLocs = {
          m: {x:currMap.enemies[enemyno].x ,y: currMap.enemies[enemyno].y},
          u: {x:[currMap.enemies[enemyno].x - currMap.enemies[enemyno].w / 2,currMap.enemies[enemyno].x + currMap.enemies[enemyno].w / 2],y: currMap.enemies[enemyno].y - currMap.enemies[enemyno].h / 2 - 1},
          d: {x:[currMap.enemies[enemyno].x - (currMap.enemies[enemyno].w / 2),currMap.enemies[enemyno].x + (currMap.enemies[enemyno].w / 2)],y: currMap.enemies[enemyno].y + currMap.enemies[enemyno].h / 2 + 1},
          l: {x:currMap.enemies[enemyno].x - currMap.enemies[enemyno].w / 2 - 1,y:[currMap.enemies[enemyno].y - currMap.enemies[enemyno].h / 2, currMap.enemies[enemyno].y + currMap.enemies[enemyno].h / 2]},
          r: {x:currMap.enemies[enemyno].x + currMap.enemies[enemyno].w / 2 + 1,y:[currMap.enemies[enemyno].y - currMap.enemies[enemyno].h / 2, currMap.enemies[enemyno].y + currMap.enemies[enemyno].h / 2]},
        };
        var enemyColObj = {
          up: {t:false,ent:{},geom:{}},
          down: {t:false,ent:{},geom:{}},
          left: {t:false,ent:{},geom:{}},
          right: {t:false,ent:{},geom:{}},
          middle: {trigger: {}, touch:false}
        };
        for (var geomno = 0;geomno < currMap.geoms.length;geomno++) {
          var simpleGeom = currMap.geoms[geomno];
          if (simpleGeom.type === "rect") {
            if ((enemyColLocs.u.x.some(ux => (ux > simpleGeom.x1) && (ux < simpleGeom.x2))) && ((enemyColLocs.u.y > simpleGeom.y1) && (enemyColLocs.u.y < simpleGeom.y2))) {
              enemyColObj.up.t = true;
            }
            if ((enemyColLocs.d.x.some(dx => (dx > simpleGeom.x1) && (dx < simpleGeom.x2))) && ((enemyColLocs.d.y > simpleGeom.y1) && (enemyColLocs.d.y < simpleGeom.y2))) {
              enemyColObj.down.t = true;
            }
            if (((enemyColLocs.l.x > simpleGeom.x1) && (enemyColLocs.l.x < simpleGeom.x2)) && (enemyColLocs.l.y.some(lx => (lx > simpleGeom.y1) && (lx < simpleGeom.y2)))) {
              enemyColObj.left.t = true;
            }
            if (((enemyColLocs.r.x > simpleGeom.x1) && (enemyColLocs.r.x < simpleGeom.x2)) && (enemyColLocs.r.y.some(rx => (rx > simpleGeom.y1) && (rx < simpleGeom.y2)))) {
              enemyColObj.right.t = true;
            }
          }
        }
        game.maps[game.data.map].enemies[enemyno].cols = enemyColObj;
      }
    }

    game.data.player.cols = colObj;
  },
  update:function () {
    //controlls stuff
    if ((game.gamepads[0].sticks.l.x > 0.5) || (game.gamepads[0].sticks.l.x< -0.5) || (game.gamepads[0].sticks.l.y > 0.5) || (game.gamepads[0].sticks.l.y < -0.5)) {
      game.data.player.spd.x += game.gamepads[0].sticks.l.x;
      if (game.gamepads[0].buttons.b.pressed) {
        game.data.player.spd.x += game.gamepads[0].sticks.l.x * 2;
      }
    }
    if (game.gamepads[0].dpad.r.pressed) {game.data.player.spd.x++;}
    if (game.gamepads[0].dpad.l.pressed) {game.data.player.spd.x--;}
    if ((game.gamepads[0].dpad.r.pressed) && (game.gamepads[0].buttons.b.pressed)) {game.data.player.x+= 2;}
    if ((game.gamepads[0].dpad.l.pressed) && (game.gamepads[0].buttons.b.pressed)) {game.data.player.x-= 2;}
    if (game.gamepads[0].sticks.r.dist < 0.5) {game.data.player.wep.show = false;}
    else {game.data.player.wep.show = true;}
    if (game.data.player.mvs.attacking) {
      game.data.player.mvs.attackTimeout = 1;
      game.data.player.mvs.attacking = false;
    }
    if (game.data.player.mvs.attackTimeout > 0) {game.data.player.mvs.attackTimeout -= 0.1;}
    if ((game.gamepads[0].buttons.r1.pressed) && (!(game.gamepads[0].buttons.r1.pressedlf))) {
      game.data.player.mvs.attacking = true;
    }
    if (game.data.player.cols.middle.touch === true) {game.data.player.cols.middle.trigger.func();}
    if (game.gamepads[0].buttons.l1.pressed) {game.screenfx.hud = true;}
    else {game.screenfx.hud = false;}
    if ((game.gamepads[0].buttons.r1.pressed) && (!game.gamepads[0].buttons.r1.pressedlf)) {
      game.data.player.mvs.attacking = true;
    }
    if ((game.gamepads[0].buttons.select.pressed) && (!game.gamepads[0].buttons.select.pressedlf)) {
      game.data.player.mvs.reloading = true;
    }
    if ((game.gamepads[0].buttons.a.pressed) && (!game.gamepads[0].buttons.a.pressedlf)) {
      game.data.player.mvs.jump = true;
    }
    if (game.gamepads[0].buttons.l1.pressed && !game.gamepads[0].buttons.l1.pressedlf) {
      switch (game.data.player.wep.bulletsMoving) {
        case true:
          game.data.player.wep.bulletsMoving = false;
          break;
        case false:
          game.data.player.wep.bulletsMoving = true;
          break;
      }
    }
    //player data < == > things

    if (game.data.player.hp <= 0) {
      game.data.player.hp = 10;
    }
    if ((game.gamepads[0].sticks.l.x < 0.5) && (game.gamepads[0].sticks.l.x > -0.5) && (game.data.player.spd.x > 0)) {
      game.data.player.spd.x -= 1;
    }
    else if ((game.gamepads[0].sticks.l.x > -0.5) && (game.gamepads[0].sticks.l.x < 0.5) && (game.data.player.spd.x < 0)) {
      game.data.player.spd.x += 1;
    }
    if (!game.gamepads[0].buttons.b.pressed) {
      if (game.data.player.spd.x >= 5) {
        game.data.player.spd.x = 5;
      }
      if (game.data.player.spd.x <= -5) {
        game.data.player.spd.x = -5;
      }
    }
    else {
      if (game.data.player.spd.x >= 10) {
        game.data.player.spd.x = 10;
      }
      if (game.data.player.spd.x <= -10) {
        game.data.player.spd.x = -10;
      }
    }
    if (game.data.player.spd.y <= -10) {
      game.data.player.spd.y = -10;
    }
    if (!game.gamepads[0].buttons.a.pressed) {
      if (game.data.player.spd.y >= 10) {
        game.data.player.spd.y = 10;
      }
    }
    else {
      if (game.data.player.spd.y >= 2) {
        game.data.player.spd.y = 2;
      }
    }
    if (game.data.player.x > game.canv.width) {
      if ("right" in game.maps[game.data.map].sides) {
        if (game.maps[game.data.map].sides.right !== "finish") {
          game.data.map = game.maps[game.data.map].sides.right;
          game.data.player.x = 0;
        }
        else {
          window.close();
        }
      }
      else {
        game.data.player.x = game.canv.width
      }
    }
    if (game.data.player.x < 0) {
      if ("left" in game.maps[game.data.map].sides) {
        if (game.maps[game.data.map].sides.left !== "finish") {
          game.data.map = game.maps[game.data.map].sides.left;
          game.data.player.x = game.canv.width;
        }
        else {
          window.close();
        }
      }
      else {
        game.data.player.x = 2;
      }

    }

    //collisions stuff?
    game.data.player.gravity = true;
    if ((game.data.player.cols.left.t) && (game.data.player.spd.x < 0)) {
      game.data.player.spd.x = 0;
    }
    if ((game.data.player.cols.right.t) && (game.data.player.spd.x > 0)) {
      game.data.player.spd.x = 0;
    }
    if ((game.data.player.cols.up.t) && (game.data.player.spd.y < 0)) {
      game.data.player.spd.y = 0;
    }
    if ((game.data.player.cols.down.t) && (game.data.player.spd.y > 0)) {
      game.data.player.spd.y = -0.1;
    }
    if (game.data.player.cols.down.t) {
      game.data.player.gravity = false;
      game.data.player.mvs.jumps = 1;
    }

    //change speeds
    if (game.data.player.gravity) {
      game.data.player.spd.y++
    }

    //actions stuff
    if (game.data.player.mvs.attacking && (game.data.player.clip !== 0) && game.data.player.wep.show) {
      game.data.player.clip--;
      game.data.player.wep.bullets.push(game.bulletTemplate(game.gamepads[0].sticks.r.x * 4,game.gamepads[0].sticks.r.y * 4));
      game.data.player.mvs.attacking = false;
    }
    if (game.data.player.mvs.reloading && (game.data.player.reloads !== 0)) {
      game.data.player.clip = 20;
      game.data.player.reloads--;
      game.data.player.mvs.reloading = false;
    }
    if ((game.data.player.mvs.jump) && (game.data.player.mvs.jumps !== 0)) {
      game.data.player.spd.y -= 10,
      game.data.player.mvs.jumps--;
      game.data.player.mvs.jump = false;
    }
    //bullets be moving?
    if (game.data.player.wep.bulletsMoving) {
      for (var bulletno = 0;bulletno < game.data.player.wep.bullets.length;bulletno++) {
        if (typeof game.data.player.wep.bullets[bulletno] !== "undefined") {
          if (typeof game.data.player.wep.bullets[bulletno].pos !== "undefined") {
            game.data.player.wep.bullets[bulletno].pos.x += game.data.player.wep.bullets[bulletno].speeds.x;
            game.data.player.wep.bullets[bulletno].pos.y += game.data.player.wep.bullets[bulletno].speeds.y;
          }
        }
      }
    }

    //kill bullets if touch geom
    for (var geomno = 0;geomno < game.maps[game.data.map].geoms.length;geomno++) {
      var simpleGeom = game.maps[game.data.map].geoms[geomno];
      for (var bulletno = game.data.player.wep.bullets.length - 1;bulletno >= 0;bulletno--) {
        if (typeof game.data.player.wep.bullets[bulletno] !== "undefined") {
          if (simpleGeom.type === "rect") {
            if (((game.data.player.wep.bullets[bulletno].pos.x > simpleGeom.x1) && (game.data.player.wep.bullets[bulletno].pos.x < simpleGeom.x2)) && ((game.data.player.wep.bullets[bulletno].pos.y > simpleGeom.y1) && (game.data.player.wep.bullets[bulletno].pos.y < simpleGeom.y2))) {
              game.data.player.wep.bullets.splice(bulletno, 1);
            }
          }
        }

      }

    }

    //speedstuff
    game.data.player.x += game.data.player.spd.x;
    game.data.player.y += game.data.player.spd.y;

    //enemyupdate
    if ("enemies" in game.maps[game.data.map]) {
      for (var enemyno = game.maps[game.data.map].enemies.length - 1;enemyno >= 0;enemyno--){
        var simpleEnemy = game.maps[game.data.map].enemies[enemyno];
        //colls
        game.maps[game.data.map].enemies[enemyno].gravity = !game.maps[game.data.map].enemies[enemyno].cols.down.t;

        simpleEnemy = game.maps[game.data.map].enemies[enemyno];
        //speedchange
        if (game.maps[game.data.map].enemies[enemyno].gravity) {
          game.maps[game.data.map].enemies[enemyno].spd.y++;
        }
        if ((game.maps[game.data.map].enemies[enemyno].spd.y > 0) && (!game.maps[game.data.map].enemies[enemyno].gravity)) {game.maps[game.data.map].enemies[enemyno].spd.y = -0.1;}
        simpleEnemy = game.maps[game.data.map].enemies[enemyno];
        //movement
        game.maps[game.data.map].enemies[enemyno].x += game.maps[game.data.map].enemies[enemyno].spd.x;
        game.maps[game.data.map].enemies[enemyno].y += game.maps[game.data.map].enemies[enemyno].spd.y;
        //hp-1 if touch bullet and bullet die as well
        for (var bulletno = game.data.player.wep.bullets.length - 1;bulletno >= 0;bulletno--) {
          if ((typeof game.data.player.wep.bullets[bulletno] !== "undefined") && (typeof game.maps[game.data.map].enemies[enemyno] !== "undefined")) {
            if (((game.data.player.wep.bullets[bulletno].pos.x > (game.maps[game.data.map].enemies[enemyno].x - 8)) && (game.data.player.wep.bullets[bulletno].pos.x < game.maps[game.data.map].enemies[enemyno].x + 8)) && ((game.data.player.wep.bullets[bulletno].pos.y > game.maps[game.data.map].enemies[enemyno].y - 8) && (game.data.player.wep.bullets[bulletno].pos.y < game.maps[game.data.map].enemies[enemyno].y + 8))) {
              game.data.player.wep.bullets.splice(bulletno, 1);
              game.maps[game.data.map].enemies[enemyno].hp--;
            }
          }
        }


        //die if hp === 0;

        if (game.maps[game.data.map].enemies[enemyno].hp === 0) {
          game.maps[game.data.map].enemies.splice(enemyno, 1);
        }
      }
    }

  },
  updateGamepads:function () {
    game.rawpads = navigator.getGamepads();

    for (gpn = 0; gpn < game.rawpads.length; gpn++) {
      if (typeof game.rawpads[gpn] !== 'undefined') {
        if (game.gamepads[gpn].buttons.l1.pressed) {game.gamepads[gpn].buttons.l1.pressedlf = true;}
        else {game.gamepads[gpn].buttons.l1.pressedlf = false;}
        if (game.gamepads[gpn].buttons.r1.pressed) {game.gamepads[gpn].buttons.r1.pressedlf = true;}
        else {game.gamepads[gpn].buttons.r1.pressedlf = false;}
        if (game.gamepads[gpn].buttons.a.pressed) {game.gamepads[gpn].buttons.a.pressedlf = true;}
        else {game.gamepads[gpn].buttons.a.pressedlf = false;}
        game.gamepads[gpn].buttons.x.pressedlf = game.rawpads[gpn].buttons[2].pressed;
        game.gamepads[gpn].buttons.select.pressedlf = game.gamepads[gpn].buttons.select.pressed;
        game.gamepads[gpn].buttons.y.pressedlf = game.gamepads[gpn].buttons.y.pressed;
        game.gamepads[gpn].buttons.a.pressed = game.rawpads[gpn].buttons[0].pressed;
        game.gamepads[gpn].buttons.x.pressed = game.rawpads[gpn].buttons[2].pressed;
        game.gamepads[gpn].buttons.b.pressed = game.rawpads[gpn].buttons[1].pressed;
        game.gamepads[gpn].buttons.y.pressed = game.rawpads[gpn].buttons[3].pressed;
        game.gamepads[gpn].sticks.l.x = game.rawpads[gpn].axes[0];
        game.gamepads[gpn].sticks.l.y = game.rawpads[gpn].axes[1];
        game.gamepads[gpn].sticks.r.x = game.rawpads[gpn].axes[2];
        game.gamepads[gpn].sticks.r.y = game.rawpads[gpn].axes[3];
        game.gamepads[gpn].sticks.l.rot = (Math.atan2(game.gamepads[gpn].sticks.l.x, game.gamepads[gpn].sticks.l.y) * -1) + Math.PI / 2;
        game.gamepads[gpn].sticks.r.rot = (Math.atan2(game.gamepads[gpn].sticks.r.x, game.gamepads[gpn].sticks.r.y) * -1) + Math.PI / 2;
        game.gamepads[gpn].sticks.l.dist = Math.sqrt(Math.pow(game.gamepads[gpn].sticks.l.x, 2) + Math.pow(game.gamepads[gpn].sticks.l.y, 2));
        if (game.gamepads[gpn].sticks.l.dist > 1) {
          game.gamepads[gpn].sticks.l.dist = 1;
        }
        game.gamepads[gpn].sticks.r.dist = Math.sqrt(Math.pow(game.gamepads[gpn].sticks.r.x, 2) + Math.pow(game.gamepads[gpn].sticks.r.y, 2));
        if (game.gamepads[gpn].sticks.r.dist > 1) {
          game.gamepads[gpn].sticks.r.dist = 1;
        }
        game.gamepads[gpn].buttonsraw = game.rawpads[gpn].buttons;
        game.gamepads[gpn].axesraw = game.rawpads[gpn].axes;
        game.gamepads[gpn].dpad.u.pressed = game.rawpads[gpn].buttons[12].pressed;
        game.gamepads[gpn].dpad.d.pressed = game.rawpads[gpn].buttons[13].pressed;
        game.gamepads[gpn].dpad.l.pressed = game.rawpads[gpn].buttons[14].pressed;
        game.gamepads[gpn].dpad.r.pressed = game.rawpads[gpn].buttons[15].pressed;
        game.gamepads[gpn].buttons.l1.pressed = game.rawpads[gpn].buttons[4].pressed;
        game.gamepads[gpn].buttons.r1.pressed = game.rawpads[gpn].buttons[5].pressed;
        game.gamepads[gpn].buttons.select.pressed = game.rawpads[gpn].buttons[8].pressed;
      }
    }
  },
  render: function () {
    game.draw.fillStyle = "#0ce4ff";
    game.draw.fillRect(0, 0, game.canv.width, game.canv.height);
    //render anonos
    if (game.options.renderAnons === true) {
      for (anon = 0; anon < game.renderpoints.anons.length; anon++) {
        var anono = game.renderpoints.anons[anon];
        game.draw.fillStyle = anono.drawData.color;
        if (anono.method === "circle") {
          game.draw.beginPath();
          game.draw.moveTo(anono.drawData.x, anono.drawData.y);
          game.draw.arc(anono.drawData.x,anono.drawData.y,anono.drawData.diam/2,0,2*Math.PI);
          game.draw.fill();
        }
        if (anono.method === "rect") {
          game.draw.fillRect(anono.drawData.x, anono.drawData.y, anono.drawData.w, anono.drawData.h);
        }
        if (anono.method === "text") {
          game.draw.font = anono.drawData.font;
          game.draw.fillText(anono.drawData.text, anono.drawData.x, anono.drawData.y);
        }
      }
    }
    //render map
    //render geoms
    for (var geomno = 0;geomno < game.maps[game.data.map].geoms.length;geomno++) {
      var simpleGeom = game.maps[game.data.map].geoms[geomno];
      game.draw.fillStyle = simpleGeom.color;
      if (simpleGeom.type === "rect") {
        game.draw.fillRect(simpleGeom.x1,simpleGeom.y1,simpleGeom.x2 - simpleGeom.x1,simpleGeom.y2 - simpleGeom.y1);
      }
    }

    //render square which is player
    game.draw.fillStyle = game.renderpoints.player.color;
    game.draw.fillRect(game.renderpoints.player.x - game.renderpoints.player.width / 2,game.renderpoints.player.y - game.renderpoints.player.height / 2,game.renderpoints.player.width,game.renderpoints.player.height);
    //render your weapon if showing
    if (game.renderpoints.player.weapon.show) {
      game.draw.fillStyle = game.renderpoints.player.weapon.color;
      game.draw.fillRect(game.renderpoints.player.weapon.x - game.renderpoints.player.weapon.width / 2, game.renderpoints.player.weapon.y - game.renderpoints.player.weapon.height / 2, game.renderpoints.player.weapon.width, game.renderpoints.player.weapon.height);
    }
    //render enemies
    if ("enemies" in game.maps[game.data.map]) {
      for (var enemyno = 0;enemyno < game.maps[game.data.map].enemies.length;enemyno++) {
        game.draw.fillStyle = "#56090d";
        game.draw.fillRect(game.maps[game.data.map].enemies[enemyno].x - 8, game.maps[game.data.map].enemies[enemyno].y - 8, 16, 16);
      }
    }

    //render bullets
    game.draw.fillStyle = "#000000";
    for (var bulletno = 0;bulletno < game.data.player.wep.bullets.length;bulletno++) {
      if (typeof game.data.player.wep.bullets[bulletno].pos !== "undefined") {
        game.draw.fillRect(game.data.player.wep.bullets[bulletno].pos.x - 2, game.data.player.wep.bullets[bulletno].pos.y - 2, 4, 4);
      }
    }
    //render hud.

      game.draw.fillStyle = "rgba(100,100,100,0.8)";
      game.draw.fillRect(8, 480 - 40, 100, 32);
      game.draw.fillRect(360 - 8, 480 - 40, 100, 32);
      game.draw.fillStyle = game.renderpoints.hud.hptxt.color;
      game.draw.font = game.renderpoints.hud.hptxt.font;
      game.draw.fillText(game.renderpoints.hud.hptxt.text,game.renderpoints.hud.hptxt.x,game.renderpoints.hud.hptxt.y);
      game.draw.fillStyle = game.renderpoints.hud.cliptxt.color;
      game.draw.font = game.renderpoints.hud.cliptxt.font;
      game.draw.fillText(game.renderpoints.hud.cliptxt.text,game.renderpoints.hud.cliptxt.x,game.renderpoints.hud.cliptxt.y);


  }
};
game.init();
