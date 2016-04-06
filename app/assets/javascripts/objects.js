/////////////////////////////////////////global vars///////////////////////////////////////////////////////////////////////////////////////////////

var scene          = new THREE.Scene(),
    renderer       = new THREE.WebGLRenderer({antialias: false, alpha: false}),
    camera         = new THREE.PerspectiveCamera(48.5, (16/9), 0.01, 100),

    mouse          = {x: 0, y: 0},
    hoverRaycaster = new THREE.Raycaster(),
    clickRaycaster = new THREE.Raycaster(),

    loadedImages   = 0,
    clickCount     = 0,
    hoverKey       = null,
    clickKey       = null,
    t_cBlue        = 'rgb(75, 50, 175)',
    deepSkyBlue    = 'rgb(0, 191, 255)',

    screenLocations =  {  face1: { 0: new THREE.Vector3(-0.4,  0.452500, 0.5),  1: new THREE.Vector3(-0.2,  0.452500, 0.5),  2: new THREE.Vector3( 0.0,  0.452500, 0.5),  3: new THREE.Vector3( 0.2,  0.452500, 0.5),  4: new THREE.Vector3( 0.4,  0.452500, 0.5),
                                   5: new THREE.Vector3(-0.4,  0.339375, 0.5),  6: new THREE.Vector3(-0.2,  0.339375, 0.5),  7: new THREE.Vector3( 0.0,  0.339375, 0.5),  8: new THREE.Vector3( 0.2,  0.339375, 0.5),  9: new THREE.Vector3( 0.4,  0.339375, 0.5),
                                  10: new THREE.Vector3(-0.4,  0.226250, 0.5), 11: new THREE.Vector3(-0.2,  0.226250, 0.5), 12: new THREE.Vector3( 0.0,  0.226250, 0.5), 13: new THREE.Vector3( 0.2,  0.226250, 0.5), 14: new THREE.Vector3( 0.4,  0.226250, 0.5),
                                  15: new THREE.Vector3(-0.4,  0.113125, 0.5), 16: new THREE.Vector3(-0.2,  0.113125, 0.5), 17: new THREE.Vector3( 0.0,  0.113125, 0.5), 18: new THREE.Vector3( 0.2,  0.113125, 0.5), 19: new THREE.Vector3( 0.4,  0.113125, 0.5),
                                  20: new THREE.Vector3(-0.4,  0.000000, 0.5), 21: new THREE.Vector3(-0.2,  0.000000, 0.5), 22: new THREE.Vector3( 0.0,  0.000000, 0.5), 23: new THREE.Vector3( 0.2,  0.000000, 0.5), 24: new THREE.Vector3( 0.4,  0.000000, 0.5),
                                  25: new THREE.Vector3(-0.4, -0.113125, 0.5), 26: new THREE.Vector3(-0.2, -0.113125, 0.5), 27: new THREE.Vector3( 0.0, -0.113125, 0.5), 28: new THREE.Vector3( 0.2, -0.113125, 0.5), 29: new THREE.Vector3( 0.4, -0.113125, 0.5),
                                  30: new THREE.Vector3(-0.4, -0.226250, 0.5), 31: new THREE.Vector3(-0.2, -0.226250, 0.5), 32: new THREE.Vector3( 0.0, -0.226250, 0.5), 33: new THREE.Vector3( 0.2, -0.226250, 0.5), 34: new THREE.Vector3( 0.4, -0.226250, 0.5),
                                  35: new THREE.Vector3(-0.4, -0.339375, 0.5), 36: new THREE.Vector3(-0.2, -0.339375, 0.5), 37: new THREE.Vector3( 0.0, -0.339375, 0.5), 38: new THREE.Vector3( 0.2, -0.339375, 0.5), 39: new THREE.Vector3( 0.4, -0.339375, 0.5),
                                  40: new THREE.Vector3(-0.4, -0.452500, 0.5), 41: new THREE.Vector3(-0.2, -0.452500, 0.5), 42: new THREE.Vector3( 0.0, -0.452500, 0.5), 43: new THREE.Vector3( 0.2, -0.452500, 0.5), 44: new THREE.Vector3( 0.4, -0.452500, 0.5) }  };

/////////////////////////////////////////objects///////////////////////////////////////////////////////////////////////////////////////////////////

//the trailer object
function trailer(title, genre, plot, director, cast, cinematography, writing, release, formatting) {
   
  title          = typeof title          !== 'undefined' ? title          : { name:'', link:'' };
  genre          = typeof genre          !== 'undefined' ? genre          : '';
  plot           = typeof plot           !== 'undefined' ? plot           : { line1:'', line2:'', line3:'', line4:'', line5:'', line6:'' };
  director       = typeof director       !== 'undefined' ? director       : { name:'', link:'' };
  cast           = typeof cast           !== 'undefined' ? cast           : { one: { name:'', link:'' }, two: { name:'', link:'' }, three: { name:'', link:'' }, four: { name:'', link:'' }, five: { name:'', link:'' } };
  cinematography = typeof cinematography !== 'undefined' ? cinematography : { one: { name:'', link:'' }, two: { name:'', link:'' } };
  writing        = typeof writing        !== 'undefined' ? writing        : { one: { name:'', link:'' }, two: { name:'', link:'' }, three: { name:'', link:'' } };
  release        = typeof release        !== 'undefined' ? release        : '';
  formatting     = typeof formatting     !== 'undefined' ? formatting     : { videoHeightError: false, aspectRatio: 'type1' };

  this.title          = title;
  this.genre          = genre;
  this.plot           = plot;
  this.director       = director;
  this.cast           = cast;
  this.cinematography = cinematography;
  this.writing        = writing;
  this.release        = release;
  this.formatting     = formatting; 

  this.video = document.createElement("video");
    this.video.crossOrigin = 'anonymous';

  this.canvas = document.createElement("canvas");
    this.canvas.width  = 1280;
    this.canvas.height = 720;

  this.texture = new THREE.Texture(this.canvas);

  this.context = this.canvas.getContext('2d');
    this.context.fillStyle = '0#000000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

  this.imageStill = null;

  this.videoScreen = new THREE.Mesh( 
    new THREE.PlaneBufferGeometry(.16, .09, 1, 1), 
    new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("/public_assets/t_c.png"), overdraw: true})
  );

    this.videoScreen.visible = true;
};

trailer.prototype = {

  constructor: trailer,

  playVideo: function() {
    this.videoScreen.material.map = this.texture;
    this.video.load();
    this.video.play();
  },

  updateVideo: function() {
    this.context.drawImage(this.video, 0, 0);
    this.texture.needsUpdate = true;
  },

  stopVideo: function() {
    this.video.pause();
    this.video.currentTime = 0;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.videoScreen.material.map = this.imageStill;
  },

  darkenScreen: function() {
    this.videoScreen.material.color.setHex(0x333333);
  },

  lightenScreen: function() {
    this.videoScreen.material.color.setHex(0xFFFFFF);
  }
};


//controls
setCameraPosition = function() {
  
  camera.position.x = .25*mouse.x;
  camera.position.y = .4*mouse.y;
  camera.position.z = .9;
};


//lights
function pointLights() {
  
  this.object3D = new THREE.Object3D();

  this.params = {  one:   { hex: 0xFF0000, coords: { x: -175, y: 0, z:   0} }, 
                   two:   { hex: 0x00FF00, coords: { x:  175, y: 0, z:   0} },
                   three: { hex: 0x0000FF, coords: { x:    0, y: 0, z: 175} }  };

  params = this.params;

  for(var num in params) {
     
    this[num] = new THREE.PointLight(params[num].hex);

    this[num].position.set(params[num].coords.x, params[num].coords.y, params[num].coords.z);

    this[num].visible = true;

    this.object3D.add(this[num]);
  };
};


//the loading screen animation
function rhombicDodecahedron(scalar, hex) {

  scalar = typeof scalar !== 'undefined' ? scalar : 1;
  hex    = typeof hex    !== 'undefined' ? hex    : 0x4B32AF;

  this.geometry = new THREE.Geometry();
    this.geometry.vertices = [ new THREE.Vector3( 2.04772293123743050, -4.09327412386437040, -5.74908146957292670).multiplyScalar(scalar),
                               new THREE.Vector3( 7.02732984841516030,  1.40331541320251810, -1.62706516545639390).multiplyScalar(scalar),
                               new THREE.Vector3( 4.22549114271519950, -1.62031854283173550,  5.78962800381778210).multiplyScalar(scalar),
                               new THREE.Vector3( 0.75411577446253997,  7.11690807989861880, -1.66761169970125600).multiplyScalar(scalar),
                               new THREE.Vector3(-0.75411577446252998, -7.11690807989862510,  1.66761169970125020).multiplyScalar(scalar),
                               new THREE.Vector3(-4.22549114271518980,  1.62031854283173260, -5.78962800381778920).multiplyScalar(scalar),
                               new THREE.Vector3( -2.0477229312374288,  4.09327412386436950,  5.74908146957292670).multiplyScalar(scalar),
                               new THREE.Vector3(-7.02732984841515230, -1.40331541320252740,  1.62706516545639970).multiplyScalar(scalar),
                               new THREE.Vector3( 6.27321407395262300, -5.71359266669610030,  0.04054653424485652).multiplyScalar(scalar),
                               new THREE.Vector3( 2.80183870569996340,  3.02363395603425690, -7.41669316927418000).multiplyScalar(scalar),
                               new THREE.Vector3( 4.97960691717773150,  5.49658953706689160,  4.12201630411653590).multiplyScalar(scalar),
                               new THREE.Vector3(-2.80183870569996340, -3.02363395603425690,  7.41669316927418000).multiplyScalar(scalar),
                               new THREE.Vector3(-4.97960691717773150, -5.49658953706689160, -4.12201630411653590).multiplyScalar(scalar),
                               new THREE.Vector3(-6.27321407395262480,  5.71359266669610210, -0.04054653424485653).multiplyScalar(scalar) ];

    this.geometry.faces.push(  new THREE.Face3( 8, 0, 9 ),     new THREE.Face3( 9, 1, 8 ),
                               new THREE.Face3( 8, 1, 10 ),    new THREE.Face3( 10, 2, 8 ),  
                               new THREE.Face3( 8, 2, 11 ),    new THREE.Face3( 11, 4, 8 ),
                               new THREE.Face3( 8, 4, 12 ),    new THREE.Face3( 12, 0, 8 ),
                               new THREE.Face3( 12, 5, 9 ),    new THREE.Face3( 9, 0, 12 ),
                               new THREE.Face3( 13, 3, 9 ),    new THREE.Face3( 9, 5, 13 ),
                               new THREE.Face3( 10, 1, 9 ),    new THREE.Face3( 9, 3, 10 ),
                               new THREE.Face3( 10, 3, 13 ),   new THREE.Face3( 13, 6, 10 ),
                               new THREE.Face3( 11, 2, 10 ),   new THREE.Face3( 10, 6, 11 ),
                               new THREE.Face3( 11, 7, 12 ),   new THREE.Face3( 12, 4, 11 ),
                               new THREE.Face3( 12, 7, 13 ),   new THREE.Face3( 13, 5, 12 ),
                               new THREE.Face3( 13, 7, 11 ),   new THREE.Face3( 11, 6, 13 )  );

    this.geometry.computeVertexNormals();
    this.geometry.computeFaceNormals();

  this.material = new THREE.MeshLambertMaterial({color: hex, wireframe: false, shading: THREE.FlatShading});

  this.mesh = new THREE.Mesh(this.geometry, this.material);
    
    this.mesh.visible = true;
    this.mesh.position.set(0, 5, 0);

  this.link = 'http://en.wikipedia.org/wiki/Rhombic_dodecahedron';
};

rhombicDodecahedron.prototype = {

  constructor: rhombicDodecahedron,

  animation: function(speed) {

    speed = typeof speed !== 'undefined' ? speed : 600;

    this.mesh.rotation.x += 2*Math.PI/speed;
    this.mesh.rotation.z -= 2*Math.PI/speed;
  }
};


//the loading screen progress bar
function loadBar() {

  this.mesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(.0001, .35, 1, 1), 
    new THREE.MeshBasicMaterial({color: 0x00FF00})
  );
    
    this.mesh.maxsize = 95.5;
    this.mesh.visible = true;
    this.mesh.position.set(-10, -25, 0);
};

loadBar.prototype = {

  constructor: loadBar,

  progress: function() {

    this.mesh.scale.x = (this.mesh.maxsize*(loadedImages/Object.keys(trailers).length)-this.mesh.geometry.parameters.width)/this.mesh.geometry.parameters.width;
    this.mesh.position.x = (-this.mesh.maxsize+this.mesh.scale.x*this.mesh.geometry.parameters.width)/2;
  }
};


//behind the cube
function theVoid() {

};


//the cube
function wireFrameCube(segments, hex) {

  segments   = typeof segments   !== 'undefined' ? segments   : 100;
  hex        = typeof hex        !== 'undefined' ? hex        : 0x4B32AF;

  this.mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, segments, segments, segments),
    new THREE.MeshBasicMaterial({color: hex, wireframe: true})
  );

    this.mesh.visible = false;
    this.mesh.position.set(0, 0, 0);
};


//the info
function trailerInfo() {

  this.object3D = new THREE.Object3D();

    this.object3D.visible = false;

  this.params =      {   genreMesh: {  pixelength:     480,
                                       pixelwidth:      60,
                                       meshlength:     .02,
                                       meshwidth:    .0025,
                                       posadjust:    { x: -.05, y: -.0087, z: -.075 }  },

                       releaseMesh: {  pixelength:     240,
                                       pixelwidth:      60,
                                       meshlength:     .01,
                                       meshwidth:    .0025,
                                       posadjust:    { x: .05475, y: -.0087, z: -.075 }  },

                      clearingMesh: {  pixelength:    1280,
                                       pixelwidth:      16,
                                       meshlength:   .1201,
                                       meshwidth:    .0015,
                                       posadjust:    { x: 0, y: -.0108, z: -.075 }  },

                         titleMesh: {  pixelength:    1280,
                                       pixelwidth:      80,
                                       meshlength:     .04,
                                       meshwidth:    .0025,
                                       posadjust:    { x: -.0395, y: -.0129, z: -.075 }  },

                          plotMesh: {  pixelength:    1280,
                                       pixelwidth:     256,
                                       meshlength:    .077,
                                       meshwidth:    .0154,
                                       posadjust:    { x: -.02, y: -.02205, z: -.075 }  },

                  directorTextMesh: {  pixelength:     200,
                                       pixelwidth:      50,
                                       meshlength:    .008,
                                       meshwidth:     .002,
                                       posadjust:    { x: .0245, y: -.0128, z: -.075 }  },

                      directorMesh: {  pixelength:     400,
                                       pixelwidth:      50,
                                       meshlength:    .016,
                                       meshwidth:     .002,
                                       posadjust:    { x: .0305, y: -.01505, z: -.075 }  },

                      castTextMesh: {  pixelength:     200,
                                       pixelwidth:      50,
                                       meshlength:    .008,
                                       meshwidth:     .002,
                                       posadjust:    { x: .0245, y: -.01805, z: -.075 }  },

                       castMeshOne: {  pixelength:     400,
                                       pixelwidth:      50,
                                       meshlength:    .016,
                                       meshwidth:     .002,
                                       posadjust:    { x: .0305, y: -.0203, z: -.075 }  },

                       castMeshTwo: {  pixelength:     400,
                                       pixelwidth:      50,
                                       meshlength:    .016,
                                       meshwidth:     .002,
                                       posadjust:    { x: .0305, y: -.02255, z: -.075 }  },

                     castMeshThree: {  pixelength:     400,
                                       pixelwidth:      50,
                                       meshlength:    .016,
                                       meshwidth:     .002,
                                       posadjust:    { x: .0305, y: -.0248, z: -.075 }  },

                      castMeshFour: {  pixelength:     400,
                                       pixelwidth:      50,
                                       meshlength:    .016,
                                       meshwidth:     .002,
                                       posadjust:    { x: .0305, y: -.02705, z: -.075 }  },

                      castMeshFive: {  pixelength:     400,
                                       pixelwidth:      50,
                                       meshlength:    .016,
                                       meshwidth:     .002,
                                       posadjust:    { x: .0305, y: -.0293, z: -.075 }  },

            cinematographyTextMesh: {  pixelength:     400,
                                       pixelwidth:      50,
                                       meshlength:    .016,
                                       meshwidth:     .002,
                                       posadjust:    { x: .04925, y: -.0128, z: -.075 }  },

             cinematographyMeshOne: {  pixelength:     400,
                                       pixelwidth:      50,
                                       meshlength:    .016,
                                       meshwidth:     .002,
                                       posadjust:    { x: .0515, y: -.01515, z: -.075 }  },

             cinematographyMeshTwo: {  pixelength:     400,
                                       pixelwidth:      50,
                                       meshlength:    .016,
                                       meshwidth:     .002,
                                       posadjust:    { x: .0515, y: -.0174, z: -.075 }  },

                   writingTextMesh: {  pixelength:     400,
                                       pixelwidth:      50,
                                       meshlength:    .016,
                                       meshwidth:     .002,
                                       posadjust:    { x: .04925, y: -.0203, z: -.075 }  },

                    writingMeshOne: {  pixelength:     400,
                                       pixelwidth:      50,
                                       meshlength:    .016,
                                       meshwidth:     .002,
                                       posadjust:    { x: .0515, y: -.02255, z: -.075 }  },

                    writingMeshTwo: {  pixelength:     400,
                                       pixelwidth:      50,
                                       meshlength:    .016,
                                       meshwidth:     .002,
                                       posadjust:    { x: .0515, y: -.0248, z: -.075 }  },

                  writingMeshThree: {  pixelength:     400,
                                       pixelwidth:      50,
                                       meshlength:    .016,
                                       meshwidth:     .002,
                                       posadjust:    { x: .0515, y: -.02705, z: -.075 }  },

                       dividerMesh: {  pixelength:    1280,
                                       pixelwidth:      16,
                                       meshlength:   .1201,
                                       meshwidth:    .0015,
                                       posadjust:    { x: 0, y: -.0316, z: -.075 }  }   };

  params = this.params;

  //info elements
  this.dynamicTextures = {};

  for(var name in params) {

    this.dynamicTextures[name] = new THREEx.DynamicTexture(params[name].pixelength, params[name].pixelwidth);
    this.dynamicTextures[name].clear();

    this[name] = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(params[name].meshlength, params[name].meshwidth, 1, 1),
      new THREE.MeshBasicMaterial({map: this.dynamicTextures[name].texture, transparent: true})
    );

      this[name].position.set(params[name].posadjust.x, params[name].posadjust.y, params[name].posadjust.z);

    this.object3D.add(this[name]);
  };

  //info background
  this.backgroundMesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(.1201, .025, 1, 1),
    new THREE.MeshBasicMaterial({color: 0x111111, transparent: true, opacity: .9})//change color to debug background position
  );
    
    this.backgroundMesh.posadjust = { x: 0, y: -.0199, z: -.07501 };
    this.backgroundMesh.position.set(this.backgroundMesh.posadjust.x, this.backgroundMesh.posadjust.y, this.backgroundMesh.posadjust.z);

  this.object3D.add(this.backgroundMesh);
};

trailerInfo.prototype = {

  constructor: trailerInfo,

  draw: function(key, textColors) {

    key        = typeof key        !== 'undefined' ? key        : hoverKey;
    textColors = typeof textColors !== 'undefined' ? textColors : {  one:      t_cBlue,  two:    t_cBlue,  three:  t_cBlue,  four: t_cBlue,  five:   t_cBlue,  six:    t_cBlue,
                                                                     seven:    t_cBlue,  eight:  t_cBlue,  nine:   t_cBlue,  ten:  t_cBlue,  eleven: t_cBlue,  twelve: t_cBlue,
                                                                     thirteen: t_cBlue  };

    this.textColors = textColors;

    this.dynamicTextures.genreMesh.drawText(trailers[key].genre, 10, 47, 'white', corbel('50'));

    this.dynamicTextures.releaseMesh.drawText(trailers[key].release, 50, 45, 'white', corbel('40'));

    this.dynamicTextures.clearingMesh.drawText("_________________________________________________________________________________________________________", 0, 4, textColors.thirteen, corbel('25'))//method.chain
                                     .drawText("_________________________________________________________________________________________________________", 1, 4, textColors.thirteen, corbel('25'));

    this.dynamicTextures.titleMesh.drawText(trailers[key].title.name, 15, 60, textColors.one, ricasso('55'));

    this.dynamicTextures.plotMesh.drawText(trailers[key].plot.line1, 20,  30, 'white', corbel('28'))//method.chain
      .drawText(trailers[key].plot.line2, 20,  65, 'white', corbel('28'))
      .drawText(trailers[key].plot.line3, 20, 100, 'white', corbel('28'))
      .drawText(trailers[key].plot.line4, 20, 135, 'white', corbel('28'))
      .drawText(trailers[key].plot.line5, 20, 170, 'white', corbel('28'))
      .drawText(trailers[key].plot.line6, 20, 205, 'white', corbel('28'));

    this.dynamicTextures.directorTextMesh.drawText("Director:", 15, 38, 'white', corbel('40'));
    this.dynamicTextures.directorMesh.drawText(trailers[key].director.name, 10, 37, textColors.two, corbel('40'));

    this.dynamicTextures.castTextMesh.drawText("Cast:", 15, 38, 'white', corbel('40'));
    this.dynamicTextures.castMeshOne.drawText(trailers[key].cast.one.name, 10, 37, textColors.three, corbel('40'));
    this.dynamicTextures.castMeshTwo.drawText(trailers[key].cast.two.name, 10, 37, textColors.four, corbel('40'));
    this.dynamicTextures.castMeshThree.drawText(trailers[key].cast.three.name, 10, 37, textColors.five, corbel('40'));
    this.dynamicTextures.castMeshFour.drawText(trailers[key].cast.four.name, 10, 37, textColors.six, corbel('40'));
    this.dynamicTextures.castMeshFive.drawText(trailers[key].cast.five.name, 10, 37, textColors.seven, corbel('40'));

    this.dynamicTextures.cinematographyTextMesh.drawText("Cinematography:", 10, 37, 'white', corbel('40'));
    this.dynamicTextures.cinematographyMeshOne.drawText(trailers[key].cinematography.one.name, 10, 37, textColors.eight, corbel('40'));
    this.dynamicTextures.cinematographyMeshTwo.drawText(trailers[key].cinematography.two.name, 10, 37, textColors.nine, corbel('40'));

    this.dynamicTextures.writingTextMesh.drawText("Writing:", 10, 38, 'white', corbel('40'));
    this.dynamicTextures.writingMeshOne.drawText(trailers[key].writing.one.name, 10, 37, textColors.ten, corbel('40'));
    this.dynamicTextures.writingMeshTwo.drawText(trailers[key].writing.two.name, 10, 37, textColors.eleven, corbel('40'));
    this.dynamicTextures.writingMeshThree.drawText(trailers[key].writing.three.name, 10, 37, textColors.twelve, corbel('40'));

    this.dynamicTextures.dividerMesh.drawText("_________________________________________________________________________________________________________", 0, 6, 'white', corbel('25'))//method.chain
                                    .drawText("_________________________________________________________________________________________________________", 1, 6, 'white', corbel('25'));

    this.backgroundMesh.visible = true;
  },

  clearAll: function(col) {

    for(var name in this.params) {this.dynamicTextures[name].clear(col)};

    this.backgroundMesh.visible = false;

    hoverKey = null;
  },

  positionCheck: function() {
    
    if(mouse.y <= 0) {

        this.backgroundMesh.position.y = this.backgroundMesh.posadjust.y + .0398;
        for(var name in this.params) {this[name].position.y = this.params[name].posadjust.y + .0394};
    
    } else {
   
        this.backgroundMesh.position.y = this.backgroundMesh.posadjust.y;
        for(var name in this.params) {this[name].position.y = this.params[name].posadjust.y};
    };
  }
};


//controls for video playback
function videoPlaybackControls() {

  this.object3D = new THREE.Object3D();

    this.object3D.visible = false;

  this.params = {   backgroundMesh:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:       .16, 
                                         meshwidth:      .005,
                                             color:  0x000000,//change to debug playback controls position
                                        dynamicmap:     false,     
                                        texturemap:      null, 
                                         posadjust:  { x: 0.0, y: -0.03880, z: 0.00005 }  },

                      timelineMesh:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:      .092,
                                         meshwidth:     .0005,
                                             color:  0x261958,
                                        dynamicmap:     false,     
                                        texturemap:      null, 
                                         posadjust:  { x: -0.025, y: -0.03880, z: 0.0001 }  },

                      bufferedMesh:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0001,
                                         meshwidth:     .0005,
                                             color:  0x9999CC,
                                        dynamicmap:     false,     
                                        texturemap:      null,
                                         posadjust:  { x: -0.046, y: -0.03880, z: 0.000101 }  },

                      progressMesh:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0001, 
                                         meshwidth:     .0005,
                                             color:  0x4B32AF,
                                        dynamicmap:     false,     
                                        texturemap:      null, 
                                         posadjust:  { x: -0.046, y: -0.03880, z: 0.000102 }  },

                   timeElapsedMesh:  {  pixelength:       128,
                                        pixelwidth:        72,
                                        meshlength:     .0072,
                                         meshwidth:    .00405,
                                             color:  0x4B32AF,
                                        dynamicmap:      true,
                                        texturemap:      null,
                                         posadjust:  { x: -0.075, y: -0.03880, z: 0.0001 }  },

                 timeRemainingMesh:  {  pixelength:       128,
                                        pixelwidth:        72,
                                        meshlength:     .0072, 
                                         meshwidth:    .00405,
                                             color:  0x4B32AF,
                                        dynamicmap:      true,
                                        texturemap:      null,
                                         posadjust:  { x: 0.025, y: -0.03880, z: 0.0001 }  },

                     restartButton:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0072,
                                         meshwidth:    .00405,
                                             color:  0xFFFFFF,
                                        dynamicmap:     false,
                                        texturemap:  THREE.ImageUtils.loadTexture('public_assets/restart_button.png'),
                                         posadjust:  { x: 0.035, y: -0.03880, z: 0.0001 }  },

                      rewindButton:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0072, 
                                         meshwidth:    .00405,
                                             color:  0xFFFFFF,
                                        dynamicmap:     false,
                                        texturemap:  THREE.ImageUtils.loadTexture('public_assets/rewind_button.png'),
                                         posadjust:  { x: 0.043, y: -0.03880, z: 0.0001 }  },

                        playButton:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0072, 
                                         meshwidth:    .00405,
                                             color:  0xFFFFFF,
                                        dynamicmap:     false,
                                        texturemap:  THREE.ImageUtils.loadTexture('public_assets/play_button.png'), 
                                         posadjust:  { x: 0.051, y: -0.03880, z: 0.00009 }  },

                       pauseButton:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0072,
                                         meshwidth:    .00405,
                                             color:  0xFFFFFF,
                                        dynamicmap:     false,
                                        texturemap:  THREE.ImageUtils.loadTexture('public_assets/pause_button.png'), 
                                         posadjust:  { x: 0.051, y: -0.03880, z: 0.0001 }  },

                 fastForwardButton:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0072, 
                                         meshwidth:    .00405,
                                             color:  0xFFFFFF,
                                        dynamicmap:     false,
                                        texturemap:  THREE.ImageUtils.loadTexture('public_assets/fastforward_button.png'),
                                         posadjust:  { x: 0.059, y: -0.03880, z: 0.0001 }  },

              exitFullscreenButton:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0072, 
                                         meshwidth:    .00405,
                                             color:  0xFFFFFF,
                                        dynamicmap:     false,
                                        texturemap:  THREE.ImageUtils.loadTexture('public_assets/exit_fullscreen_button.png'),
                                         posadjust:  { x: 0.067, y: -0.03880, z: 0.00009 }  },

             enterFullscreenButton:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0072, 
                                         meshwidth:    .00405,
                                             color:  0xFFFFFF,
                                        dynamicmap:     false,
                                        texturemap:  THREE.ImageUtils.loadTexture('public_assets/enter_fullscreen_button.png'),
                                         posadjust:  { x: 0.067, y: -0.03880, z: 0.0001 }  },

                        exitButton:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0072, 
                                         meshwidth:    .00405,
                                             color:  0xFFFFFF,
                                        dynamicmap:     false,
                                        texturemap:  THREE.ImageUtils.loadTexture('public_assets/exit_button.png'),
                                         posadjust:  { x: 0.075, y: -0.03880, z: 0.0001 }  }   };

  params = this.params;

  this.dynamicTextures = {};

  for(var name in params) {
    
    if(params[name].dynamicmap == true) {

      this.dynamicTextures[name] = new THREEx.DynamicTexture(params[name].pixelength, params[name].pixelwidth);
      this.dynamicTextures[name].clear();

      params[name].texturemap = this.dynamicTextures[name].texture;
    };

    this[name] = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(params[name].meshlength, params[name].meshwidth, 1, 1),
      new THREE.MeshBasicMaterial({map: params[name].texturemap, color: params[name].color})
    );

      this[name].position.set(this.object3D.position.x + params[name].posadjust.x, this.object3D.position.y + params[name].posadjust.y, this.object3D.position.z + params[name].posadjust.z);

    this.object3D.add(this[name]);
  };
};

videoPlaybackControls.prototype = {

  constructor: videoPlaybackControls,

  trailerTimeUpdate: function() {
        
    this.dynamicTextures.timeElapsedMesh.clear('black');
    this.dynamicTextures.timeElapsedMesh.drawText(sec_to_string(Math.round(trailers[clickKey].video.currentTime)), 20, 45, 'white', corbel('50'));

    this.bufferedMesh.scale.x = (this.timelineMesh.geometry.parameters.width*(Math.round(trailers[clickKey].video.buffered.end(0))/Math.round(trailers[clickKey].video.duration))-this.bufferedMesh.geometry.parameters.width)/this.bufferedMesh.geometry.parameters.width;
    this.bufferedMesh.position.x = (2*this.timelineMesh.position.x-params.timelineMesh.meshlength+this.bufferedMesh.scale.x*this.bufferedMesh.geometry.parameters.width)/2;

    this.progressMesh.scale.x = (this.timelineMesh.geometry.parameters.width*(Math.round(trailers[clickKey].video.currentTime)/Math.round(trailers[clickKey].video.duration))-this.progressMesh.geometry.parameters.width)/this.progressMesh.geometry.parameters.width;
    this.progressMesh.position.x = (2*this.timelineMesh.position.x-params.timelineMesh.meshlength+this.progressMesh.scale.x*this.progressMesh.geometry.parameters.width)/2;

    this.dynamicTextures.timeRemainingMesh.clear('black');
    this.dynamicTextures.timeRemainingMesh.drawText(sec_to_string(Math.round(trailers[clickKey].video.duration)-Math.round(trailers[clickKey].video.currentTime)), 20, 45, 'white', corbel('50'));
  },

  pauseButtonSwap: function() {

    this.object3D.remove(this.playButton);
    this.object3D.add(this.pauseButton);
  },

  playButtonSwap: function() {

    this.object3D.remove(this.pauseButton);
    this.object3D.add(this.playButton);
  },

  fullscreenButtonCheck: function() {

    if (!window.screenTop && !window.screenY) {
        this.object3D.remove(this.exitFullscreenButton);
        this.object3D.add(this.enterFullscreenButton);
    } else {
        this.object3D.remove(this.enterFullscreenButton);
        this.object3D.add(this.exitFullscreenButton);
    };
  },

  formatAdjustments: function() {
    if(trailers[clickKey].formatting.videoHeightError == true) {
        
        camera.position.y += .0115;
        for(var name in this.params) {this[name].position.y += .0115};
      
    } else if(trailers[clickKey].formatting.aspectRatio == 'type2') {
      
        camera.position.z += .0075;
        for(var name in this.params) {this[name].position.y -= .0045};
    };
  },

  formatAdjustmentsUndo: function() {
    if(trailers[clickKey].formatting.videoHeightError == true) {

        camera.position.y -= .0115;
        for(var name in this.params) {this[name].position.y -= .0115};        
        
    } else if(trailers[clickKey].formatting.aspectRatio == 'type2') {

        camera.position.z -= .0075;
        for(var name in this.params) {this[name].position.y += .0045};
    };
  }
};

