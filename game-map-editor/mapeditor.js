var pregame = {
  tbTriggerTemplate(text,font,bg,fg) {
    this.text = text;
    this.font = font;
    this.bg = bg;
    this.fg = fg;
    this.padding = 5;
    this.posType = "RelativeMinusHalf";
    return this;
  },
  enemyTemplate: function (x,y,hp) {
    this.w = this.h = 16;
    this.hp = hp;
    this.maxhp = hp;
    this.x = x;
    this.y = y;
    this.gravity = false;
    this.spd = {
      x:0,
      y:0
    };
    this.cols = {
      up: {t:false,ent:{},geom:{}},
      down: {t:false,ent:{},geom:{}},
      left: {t:false,ent:{},geom:{}},
      right: {t:false,ent:{},geom:{}},
      middle: {trigger: {}, touch:false}
    };
    return this;
  },
  gwhst: function (text,font,padding) {
    var whs = {width:0,height:0,sigleHeight:0};
    var fontheight = parseInt(font);
    whs.singleHeight = fontheight;
    var tcanv = document.createElement("CANVAS");
    var tdraw = tcanv.getContext("2d");
    tdraw.font = font;
    var longestText = {
      text:"",
      size: 0
    };
    if (Array.isArray(text)) {
      for (var t = 0;t < text.length;t++) {
        if (tdraw.measureText(text[t]).width > longestText.size) {
          longestText.text = text[t];
          longestText.size = tdraw.measureText(text[t]).width;
        }
      }
      whs.height = (fontheight * text.length) + (padding * 2);
    }
    else if (typeof text === "string") {
      longestText.text = text;
      longestText.size = tdraw.measureText(text).width;
      whs.height = fontheight + (padding * 2);
    }
    whs.width = longestText.size + (padding * 2);
    return whs;
  },
  textboxTemplate: function (x,y,font,text,padding,fg,bg,enabled) {
    var pad = padding;
    var tempwhst = pregame.gwhst(text,font,pad);
    var textbox = {
      x:x,
      y:y,
      text: text,
      font: font,
      width: tempwhst.width,
      height: tempwhst.height,
      singleHeight: tempwhst.singleHeight,
      bg: bg,
      fg: fg,
      pad: pad,
      enabled: enabled
    };
    return textbox;
  },
  randomInt(min,max) {
    return Math.round(Math.random() * (max - min) + min);
  },
  flashingColors: {},
  colorFlash: {
    make(name,colora,colorb,time) {
      if (typeof pregame.flashingColors[name] === "undefined") {
        //btw, credit to chroma js lib
        pregame.flashingColors[name] = {
          colora: colora,
          colorb: colorb,
          currColor: "",
          time: time,
          frame: 0,
          minus: false,
          colorScale: chroma.scale([colora,colorb])
        };
      }
    },
    remove(name) {
      if (typeof pregame.flashingColors[name] !== "undefined") {
        delete pregame.flashingColors[name];
      }
    },
    retr(name) {
      return pregame.flashingColors[name].currColor;
    },
    update() {
      for (var color in pregame.flashingColors) {
        if (pregame.flashingColors.hasOwnProperty(color)) {
          if (pregame.flashingColors[color].frame > pregame.flashingColors[color].time) {
            pregame.flashingColors[color].minus = true;
            pregame.flashingColors[color].frame--;
          }
          else if (pregame.flashingColors[color].frame === -1) {
            pregame.flashingColors[color].minus = false
            pregame.flashingColors[color].frame++;
          }
          else if (pregame.flashingColors[color].minus) {
            pregame.flashingColors[color].frame--;
          }
          else if (!pregame.flashingColors[color].minus) {
            pregame.flashingColors[color].frame++;
          }
          pregame.flashingColors[color].currColor = pregame.flashingColors[color].colorScale(pregame.flashingColors[color].frame / pregame.flashingColors[color].time);
        }
      }
    }
  },
  rectTemplate(x1,y1,x2,y2,color) {
    this.type = "rect";
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.color = color;
    return this;
  }
};
var mapeditor = {
  statusbar: {
    screenname: document.getElementById("sbscreenName"),
    createselectmode: document.getElementById("sbcreateselectmode"),
    objecttype: document.getElementById("sbobjecttype")
  },
  selbox: {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
    enabled: false,
    currColor: "#FFFFFF",
    currSecColor: "#000000",
    pointSelect: false,
    selType: "none",
    selNum: 0,
    clickdown: false,
    prop: {
      enemy:{
        hp:10
      },
      trigger: {
        get selType() {
          return document.querySelector('input[name="tben"]:checked').value;
        },
        tbox: {
          text: "",
          font: "10px Monospace",
          get bg() {
            return mapeditor.selbox.currSecColor;
          },
          get fg() {
            return mapeditor.selbox.currColor;
          },
        }
      }
    }
  },
  colorPickers: {
    Primary: {},
    Secondary: {},
    Colors: {}
  },
  toolmenu: document.getElementById("toolpicker"),
  mtoolmenu: document.getElementById("mtoolpicker"),
  get currTool() {
    return document.querySelector('input[name="cbsb"]:checked').value;
  },
  get currmTool() {
    return mapeditor.mtoolmenu.value;
  },
  tools: {
  },
  canv: {},
  draw: {},
  get currmap() {
    return mapeditor.maps[mapeditor.view.currmap];
  },
  view: {
    currmap: "start"
  },
  data: {
    compiledmap: "",
    player: {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
      map: "start"
    }
  },
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
        right: "jump over",
        left: "finish"
      },
      enemies: [
        new pregame.enemyTemplate(100,450,2),
        new pregame.enemyTemplate(64,450,6)
      ]
    }
  },
  setDown(mouseevent) {
    if (mapeditor.currTool === "wandbox") {
      mapeditor.selbox.pointSelect = false;
      mapeditor.selbox.enabled = false;
      mapeditor.selbox.x1 = mouseevent.offsetX;
      mapeditor.selbox.y1 = mouseevent.offsetY;
    }
    if (mapeditor.currTool === "selbox") {
      mapeditor.selbox.pointSelect = true;
      mapeditor.selbox.enabled = false;
      mapeditor.selbox.x1 = mouseevent.offsetX;
      mapeditor.selbox.y1 = mouseevent.offsetY;
    }
    mapeditor.selbox.clickdown = true;
  },
  setUp(mouseevent) {
    if (mapeditor.currTool === "wandbox") {
      mapeditor.selbox.enabled = true;
      mapeditor.selbox.x2 = mouseevent.offsetX;
      mapeditor.selbox.y2 = mouseevent.offsetY;
    }
    mapeditor.selbox.clickdown = false;
  },
  onDrag(mouseevent) {
    if (mapeditor.selbox.clickdown) {
      //moveobject
      if (mapeditor.currTool === "selbox") {
        if ((mapeditor.selbox.selType === "enemy") && (typeof mapeditor.maps[mapeditor.view.currmap].enemies[mapeditor.selbox.selNum] !== "undefined")) {
          mapeditor.maps[mapeditor.view.currmap].enemies[mapeditor.selbox.selNum].x = mouseevent.offsetX;
          mapeditor.maps[mapeditor.view.currmap].enemies[mapeditor.selbox.selNum].y = mouseevent.offsetY;
        }
      }
      //moveandupdate
      if (mapeditor.currTool === "selbox") {
        mapeditor.selbox.x1 = mouseevent.offsetX;
        mapeditor.selbox.y1 = mouseevent.offsetY;
      }
      if (mapeditor.currTool === "wandbox") {
        mapeditor.selbox.enabled = true;
        mapeditor.selbox.x2 = mouseevent.offsetX;
        mapeditor.selbox.y2 = mouseevent.offsetY;
      }
    }

  },
  setColor(event) {
    mapeditor.selbox.currColor = event.target.value;
  },
  setSecondaryColor(event) {
    mapeditor.selbox.currSecColor = event.target.value;
  },
  createRect() {
    let rect = {
      type: "rect",
      x1: mapeditor.selbox.x1,
      x2: mapeditor.selbox.x2,
      y1: mapeditor.selbox.y1,
      y2: mapeditor.selbox.y2,
      color: mapeditor.selbox.currColor
    };
    mapeditor.maps[mapeditor.view.currmap].geoms.push(rect);
  },
  save() {
    let jsonMaps = JSON.stringify(mapeditor.maps);
    let encodedJson = btoa(jsonMaps);
    let dataUri = "data:application/octet-stream;base64," + encodeURIComponent(encodedJson);
    window.open(dataUri,"_blank");
    window.focus();
  },
  load(event) {
    let reader = new FileReader();
    reader.onload = function (event) {
      mapeditor.maps = JSON.parse(event.target.result);
    };
    reader.readAsText(event.target.files[0]);
  },
  loadDialog() {
    let fileElem = document.createElement("INPUT");
    fileElem.type = "file";
    fileElem.addEventListener("change",mapeditor.load);
    fileElem.click();
  },
  init() {
    pregame.colorFlash.make("warn","black","red","15");
    //mapeditor.colorPickers.Primary = new ColorPicker("input.color", {color: "#FFFFFF", actionCallback: mapeditor.setColor});
    //mapeditor.colorPickers.Secondary = new ColorPicker("input.color", {color: "#FFFFFF", actionCallback: mapeditor.setSecondaryColor});
    mapeditor.colorPickers.Colors = jsColorPicker("input.color", {
      init: function (elem, colors) {
        elem.style.backgroundColor = elem.value;
      }
    });
    mapeditor.canv = document.createElement("CANVAS");
    mapeditor.draw = mapeditor.canv.getContext("2d");
    mapeditor.canv.width = 640;
    mapeditor.canv.height = 480;
    mapeditor.canv.onmousedown = mapeditor.setDown;
    mapeditor.canv.onmouseup = mapeditor.setUp;
    mapeditor.canv.onmousemove = mapeditor.onDrag;
    document.getElementById("canv").appendChild(mapeditor.canv);
    window.requestAnimationFrame(mapeditor.loop);
  },
  loop() {
    mapeditor.update();
    mapeditor.render();
    window.requestAnimationFrame(mapeditor.loop);
  },
  render() {
    //clear screen
    mapeditor.draw.fillStyle = "#0ce4ff";
    mapeditor.draw.fillRect(0, 0, mapeditor.canv.width, mapeditor.canv.height);
    //render geoms
    for (var geomno = 0;geomno < mapeditor.maps[mapeditor.view.currmap].geoms.length;geomno++) {
      var simpleGeom = mapeditor.maps[mapeditor.view.currmap].geoms[geomno];
      mapeditor.draw.fillStyle = simpleGeom.color;
      if (simpleGeom.type === "rect") {
        mapeditor.draw.fillRect(simpleGeom.x1,simpleGeom.y1,simpleGeom.x2 - simpleGeom.x1,simpleGeom.y2 - simpleGeom.y1);
      }
    }
    //render player if on map
    if (mapeditor.view.currmap === mapeditor.data.player.map) {
      mapeditor.draw.fillStyle = "red";
      mapeditor.draw.fillRect(mapeditor.data.player.x - mapeditor.data.player.width / 2,mapeditor.data.player.y - mapeditor.data.player.height / 2,mapeditor.data.player.width,mapeditor.data.player.height);
    }
    //render enemies and make blue if selected
    if ("enemies" in mapeditor.maps[mapeditor.view.currmap]) {
      for (var enemyno = 0;enemyno < mapeditor.maps[mapeditor.view.currmap].enemies.length;enemyno++) {
        if ((mapeditor.selbox.selType === "enemy") && (mapeditor.selbox.selNum === enemyno)) {
          mapeditor.draw.fillStyle = "rgb(33, 199, 194)";
        }
        else {
          mapeditor.draw.fillStyle = "#56090d";
        }
        mapeditor.draw.fillRect(mapeditor.maps[mapeditor.view.currmap].enemies[enemyno].x - 8, mapeditor.maps[mapeditor.view.currmap].enemies[enemyno].y - 8, 16, 16);
        mapeditor.draw.fillStyle = "#2a2840";
        mapeditor.draw.fillRect(mapeditor.maps[mapeditor.view.currmap].enemies[enemyno].x - 16,mapeditor.maps[mapeditor.view.currmap].enemies[enemyno].y - 16,32,4);
        if (mapeditor.maps[mapeditor.view.currmap].enemies[enemyno].hp < mapeditor.maps[mapeditor.view.currmap].enemies[enemyno].maxhp / 2) {
          mapeditor.draw.fillStyle = "#f58905";
        }
        else if (mapeditor.maps[mapeditor.view.currmap].enemies[enemyno].hp === 1) {
          mapeditor.draw.fillStyle = pregame.colorFlash.retr("warn");
        }
        else {
          mapeditor.draw.fillStyle = "#0ee81c";
        }
        mapeditor.draw.fillRect(mapeditor.maps[mapeditor.view.currmap].enemies[enemyno].x - 15,mapeditor.maps[mapeditor.view.currmap].enemies[enemyno].y - 15,(30 / mapeditor.maps[mapeditor.view.currmap].enemies[enemyno].maxhp) * mapeditor.maps[mapeditor.view.currmap].enemies[enemyno].hp,2)
      }
    }
    //space
    //render Triggers if triggers
    if (typeof mapeditor.maps[mapeditor.view.currmap].triggers !== "undefined") {
      for (let trig = 0;trig < mapeditor.maps[mapeditor.view.currmap].triggers.length;trig++) {
        let trigObj = mapeditor.maps[mapeditor.view.currmap].triggers[trig];
        mapeditor.draw.fillStyle = "rgba(177, 63, 187, 0.76)";
        mapeditor.draw.strokeStyle = "rgb(177, 63, 187)";
        mapeditor.draw.fillRect(trigObj.x1,trigObj.y1,trigObj.x2 - trigObj.x1,trigObj.y2 - trigObj.y1);
      }
    }

    //render selection box if enabled
    if (mapeditor.selbox.enabled) {
      mapeditor.draw.strokeStyle = "rgb(63, 97, 219)";
      mapeditor.draw.fillStyle = "rgba(56, 155, 227, 0.68)";
      mapeditor.draw.fillRect(mapeditor.selbox.x1,mapeditor.selbox.y1,mapeditor.selbox.x2 - mapeditor.selbox.x1,mapeditor.selbox.y2 - mapeditor.selbox.y1);
      mapeditor.draw.strokeRect(mapeditor.selbox.x1,mapeditor.selbox.y1,mapeditor.selbox.x2 - mapeditor.selbox.x1,mapeditor.selbox.y2 - mapeditor.selbox.y1);
    }
    //render point selection if enabled
    if (mapeditor.selbox.pointSelect) {
      mapeditor.draw.fillStyle = "rgb(31, 49, 170)";
      mapeditor.draw.shadowBlur = 3;
      mapeditor.draw.shadowColor = "rgb(31, 49, 170)";
      mapeditor.draw.fillRect(mapeditor.selbox.x1 - 1,mapeditor.selbox.y1 - 1,3,3);
      mapeditor.draw.shadowBlur = 0;
    }
  },
  onEnemyHpChange(event) {
    mapeditor.selbox.prop.enemy.hp = event.value;
  },
  onEnemySelect() {

  },
  update() {
    //pmText
    let pmText = document.getElementById("pMText");
    let pmCS = "Create";
    let pmOBJ = "Rectangle";
    if (mapeditor.currmTool === "selProp") {
      pmCS = "Select";
      switch (mapeditor.selbox.selType) {
        case "enemy":
          pmOBJ = "Enemy";
          break;
        case "rect":
          pmOBJ = "Rectangle";
          break;
        case "trig":
          pmOBJ = "Trigger";
          break;
        case "player":
          pmOBJ = "Player";
          break;
      }
    }
    else {
      switch (mapeditor.currmTool) {
        case "rectangle":
          pmOBJ = "Rectangle";
          break;
        case "enemy":
          pmOBJ = "Enemy";
          break;
        case "trigger":
          pmOBJ = "Trigger";
          break;
      }
    }
    pmText.innerHTML = "Mode: " + pmCS + " " + pmOBJ;
    //also, status bar
    mapeditor.statusbar.screenname.innerHTML = mapeditor.view.currmap;
    mapeditor.statusbar.createselectmode.innerHTML = pmCS;
    mapeditor.statusbar.objecttype.innerHTML = pmOBJ;
    //colision with point select if point select is on, select enemies
    // remember, over 1 and under 2 (over close and under far)
    if (mapeditor.selbox.pointSelect) {
      let selected = false;
      if ("enemies" in mapeditor.maps[mapeditor.view.currmap]) {
        for (var enemyno = 0;enemyno < mapeditor.maps[mapeditor.view.currmap].enemies.length;enemyno++) {
          let currEnemy = mapeditor.maps[mapeditor.view.currmap].enemies[enemyno];
          if ((mapeditor.selbox.x1 > (currEnemy.x - (currEnemy.w / 2))) && (mapeditor.selbox.x1 < (currEnemy.x + (currEnemy.w / 2))) && (mapeditor.selbox.y1 > (currEnemy.y - (currEnemy.h / 2))) && (mapeditor.selbox.y1 < (currEnemy.y + (currEnemy.h / 2)))) {
            mapeditor.selbox.selType = "enemy";
            mapeditor.selbox.selNum = enemyno;
            selected = true;
          }
        }
      }
      if (selected === false) {
        mapeditor.selbox.selType = "none"
      }
    }
    //display correct div based on mtool
    let epropdiv = document.getElementById("enemy");
    let trpropdiv = document.getElementById("trigger");
    //triggers
    let tbtrpropdiv = document.getElementById("tbtrigger");
    tbtrpropdiv.style.display = "none";
    epropdiv.style.display = "none";
    trpropdiv.style.display = "none";
    if (mapeditor.currmTool === "enemy") {
      epropdiv.style.display = "inline-flex";
    }
    if (mapeditor.currmTool === "trigger") {
      trpropdiv.style.display = "inline-flex";
      //now correct trigger
      if (mapeditor.selbox.prop.trigger.selType === "textbox") {
        tbtrpropdiv.style.display = "inline-flex";
      }
    }
  },
  createEnemy() {
    mapeditor.maps[mapeditor.view.currmap].enemies.push(new pregame.enemyTemplate(mapeditor.selbox.x1,mapeditor.selbox.y1,mapeditor.selbox.prop.enemy.hp));
  },
  createTrigger() {
    if (mapeditor.selbox.prop.trigger.selType === "textbox") {
      mapeditor.createTextboxTrigger();
    }
  },
  createTextboxTrigger() {
    let dummyTextbox = {
      textbox: {
        location: "RelativeMinusHalf",
        text: mapeditor.selbox.prop.trigger.tbox.text,
        font: mapeditor.selbox.prop.trigger.tbox.font,
        fontHeight: mapeditor.selbox.prop.trigger.tbox.font.substr(0, mapeditor.selbox.prop.trigger.tbox.font.indexOf("p")),
        fg: mapeditor.selbox.currColor,
        bg: mapeditor.selbox.currSecColor
      },
      x1: mapeditor.selbox.x1,
      x2: mapeditor.selbox.x2,
      y1: mapeditor.selbox.y1,
      y2: mapeditor.selbox.y2,
      type: "textbox"
    };
    if (typeof mapeditor.maps[mapeditor.view.currmap].triggers === "undefined") {
      mapeditor.maps[mapeditor.view.currmap].triggers = [];
    }
    mapeditor.maps[mapeditor.view.currmap].triggers.push(dummyTextbox);
  },
  settextbox: {
    text(event) {
      mapeditor.selbox.prop.trigger.tbox.text = event.target.value.split("/n");
    },
    font(event) {
      mapeditor.selbox.prop.trigger.tbox.font = event.target.value;
    }
  },
  creatething() {
    if (mapeditor.currmTool === "rectangle") {
      mapeditor.createRect();
    }
    if (mapeditor.currmTool === "enemy") {
      mapeditor.createEnemy();
    }
    if (mapeditor.currmTool === "trigger") {
      mapeditor.createTrigger();
    }
  },
  deletething() {
    if (mapeditor.selbox.pointSelect) {
      if (mapeditor.selbox.selType === "enemy") {
        mapeditor.maps[mapeditor.view.currmap].enemies.splice(mapeditor.selbox.selNum, 1);
      }
    }
  }
}
mapeditor.init();
