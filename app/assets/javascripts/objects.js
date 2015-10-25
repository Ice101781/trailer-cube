/////////////////////////////////////////global vars///////////////////////////////////////////////////////////////////////////////////////////////

var scene        = new THREE.Scene(),
    renderer     = new THREE.WebGLRenderer({antialias: false, alpha: false}),
    camera       = new THREE.PerspectiveCamera(48.5, (16/9), 0.01, 100),

    mouse        = {x: 0, y: 0},

    loadedImages = 0,
    clickCount   = 0,
    hoverKey     = null,
    clickKey     = null,
    t_cBlue      = 'rgb(75, 50, 175)',
    deepSkyBlue  = 'rgb(0, 191, 255)';

/////////////////////////////////////////objects///////////////////////////////////////////////////////////////////////////////////////////////////

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
    this.mesh.position.set(0, 10, 0);

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
    this.mesh.position.set(-10, -24.5, 0);
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

  segments = typeof segments !== 'undefined' ? segments : 100;
  hex      = typeof hex      !== 'undefined' ? hex      : 0x4B32AF;
  
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

  this.params = {   titleMesh: {  pixelength:    1280,
                                  pixelwidth:     128,
                                  meshlength:   .0286,
                                  meshwidth:   .00286,
                                  posadjust:  { x: -.04475, y: -.0175, z: -.075 }  },

                    genreMesh: {  pixelength:    1280,
                                  pixelwidth:     205,
                                  meshlength: .017875,
                                  meshwidth:   .00286,
                                  posadjust:  { x: -.0185, y: -.0175, z: -.075 }  },

                     plotMesh: {  pixelength:    1280,
                                  pixelwidth:     220,
                                  meshlength:    .067,
                                  meshwidth:    .0115,
                                  posadjust:  { x: -.02525, y: -.025, z: -.075 }  },

             directorTextMesh: {  pixelength:    1280,
                                  pixelwidth:     320,
                                  meshlength:  .00715,
                                  meshwidth: .0017875,
                                  posadjust:  { x: .012175, y: -.0175, z: -.075 }  },

                 directorMesh: {  pixelength:    1280,
                                  pixelwidth:     160,
                                  meshlength:   .0143,
                                  meshwidth: .0017875,
                                  posadjust:  { x: .02305, y: -.0175, z: -.075 }  },

                 castTextMesh: {  pixelength:    1280,
                                  pixelwidth:     320,
                                  meshlength:  .00715,
                                  meshwidth: .0017875,
                                  posadjust:  { x: .012175, y: -.0205, z: -.075 }  },

                  castMeshOne: {  pixelength:    1280,
                                  pixelwidth:     160,
                                  meshlength:   .0143,
                                  meshwidth: .0017875,
                                  posadjust:  { x: .02305, y: -.0205, z: -.075 }  },

                  castMeshTwo: {  pixelength:    1280,
                                  pixelwidth:     160,
                                  meshlength:   .0143,
                                  meshwidth: .0017875,
                                  posadjust:  { x: .02305, y: -.0225, z: -.075 }  },

                castMeshThree: {  pixelength:    1280,
                                  pixelwidth:     160,
                                  meshlength:   .0143,
                                  meshwidth: .0017875,
                                  posadjust:  { x: .02305, y: -.0245, z: -.075 }  },

                 castMeshFour: {  pixelength:    1280,
                                  pixelwidth:     160,
                                  meshlength:   .0143,
                                  meshwidth: .0017875,
                                  posadjust:  { x: .02305, y: -.0265, z: -.075 }  },

                 castMeshFive: {  pixelength:    1280,
                                  pixelwidth:     160,
                                  meshlength:   .0143,
                                  meshwidth: .0017875,
                                  posadjust:  { x: .02305, y: -.0285, z: -.075 }  },

       cinematographyTextMesh: {  pixelength:    1280,
                                  pixelwidth:     160,
                                  meshlength:   .0143,
                                  meshwidth: .0017875,
                                  posadjust:  { x: .0375, y: -.0175, z: -.075 }  },

        cinematographyMeshOne: {  pixelength:    1280,
                                  pixelwidth:     160,
                                  meshlength:   .0143,
                                  meshwidth: .0017875,
                                  posadjust:  { x: .05195, y: -.0175, z: -.075 }  },

        cinematographyMeshTwo: {  pixelength:    1280,
                                  pixelwidth:     160,
                                  meshlength:   .0143,
                                  meshwidth: .0017875,
                                  posadjust:  { x: .05195, y: -.0195, z: -.075 }  },

              writingTextMesh: {  pixelength:    1280,
                                  pixelwidth:     160,
                                  meshlength:   .0143,
                                  meshwidth: .0017875,
                                  posadjust:  { x: .0375, y: -.0225, z: -.075 }  },

               writingMeshOne: {  pixelength:    1280,
                                  pixelwidth:     160,
                                  meshlength:   .0143,
                                  meshwidth: .0017875,
                                  posadjust:  { x: .05195, y: -.0225, z: -.075 }  },

               writingMeshTwo: {  pixelength:    1280,
                                  pixelwidth:     160,
                                  meshlength:   .0143,
                                  meshwidth: .0017875,
                                  posadjust:  { x: .05195, y: -.0245, z: -.075 }  },

             writingMeshThree: {  pixelength:    1280,
                                  pixelwidth:     160,
                                  meshlength:   .0143,
                                  meshwidth: .0017875,
                                  posadjust:  { x: .05195, y: -.0265, z: -.075 }  },

                  releaseMesh: {  pixelength:    1280,
                                  pixelwidth:     340,
                                  meshlength: .010725,
                                  meshwidth:   .00286,
                                  posadjust:  { x: -.001, y: -.0175, z: -.075 }  },

                  dividerMesh: {  pixelength:    1280,
                                  pixelwidth:      16,
                                  meshlength:    .118,
                                  meshwidth:  .001475,
                                  posadjust:  { x: 0, y: -.01515, z: -.075 }  },

                 clearingMesh: {  pixelength:    1280,
                                  pixelwidth:      16,
                                  meshlength:    .118,
                                  meshwidth:  .001475,
                                  posadjust:  { x: 0, y: -.03175, z: -.075 }  }   };

  params = this.params;
  
  this.dynamicTextures = {};

  for(var name in params) {

    this.dynamicTextures[name] = new THREEx.DynamicTexture(params[name].pixelength, params[name].pixelwidth);
    this.dynamicTextures[name].clear();

    this[name] = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(params[name].meshlength, params[name].meshwidth, 1, 1),
      new THREE.MeshBasicMaterial({map: this.dynamicTextures[name].texture, transparent: true})
    );
    
    this[name].position.set( camera.position.x + params[name].posadjust.x,
                             camera.position.y + params[name].posadjust.y, 
                             camera.position.z + params[name].posadjust.z );
    
    this.object3D.add(this[name]);
  };
};

trailerInfo.prototype = {

  constructor: trailerInfo,

  draw: function(key, textColors) {

    key        = typeof key        !== 'undefined' ? key        : hoverKey;
    textColors = typeof textColors !== 'undefined' ? textColors : { one:   t_cBlue,  two:    t_cBlue,  three:  t_cBlue,//continue
                                                                    four:  t_cBlue,  five:   t_cBlue,  six:    t_cBlue,//continue
                                                                    seven: t_cBlue,  eight:  t_cBlue,  nine:   t_cBlue,//continue
                                                                    ten:   t_cBlue,  eleven: t_cBlue,  twelve: t_cBlue };

    this.textColors = textColors;

    this.dynamicTextures.titleMesh.drawText(trailers[key].identifiers.title.name, 15, 80, textColors.one, ricasso('55'));

    this.dynamicTextures.genreMesh.drawText(trailers[key].genre, 90, 125, 'white', ricasso('75'));

    this.dynamicTextures.plotMesh.drawText(trailers[key].plot.line1, 5,  25, 'white', ricasso('17'))//method.chain
      .drawText(trailers[key].plot.line2, 5,  60, 'white', ricasso('17'))
      .drawText(trailers[key].plot.line3, 5,  95, 'white', ricasso('17'))
      .drawText(trailers[key].plot.line4, 5, 130, 'white', ricasso('17'))
      .drawText(trailers[key].plot.line5, 5, 165, 'white', ricasso('17'))
      .drawText(trailers[key].plot.line6, 5, 200, 'white', ricasso('17'));

    this.dynamicTextures.directorTextMesh.drawText("Director:", 20, 215, 'white', ricasso('170'));
    this.dynamicTextures.directorMesh.drawText(trailers[key].director.name, 20, 110, textColors.two, ricasso('75'));

    this.dynamicTextures.castTextMesh.drawText("Cast:", 540, 215, 'white', ricasso('170'));
    this.dynamicTextures.castMeshOne.drawText(trailers[key].cast.one.name, 20, 105, textColors.three, ricasso('75'));
    this.dynamicTextures.castMeshTwo.drawText(trailers[key].cast.two.name, 20, 105, textColors.four, ricasso('75'));
    this.dynamicTextures.castMeshThree.drawText(trailers[key].cast.three.name, 20, 105, textColors.five, ricasso('75'));
    this.dynamicTextures.castMeshFour.drawText(trailers[key].cast.four.name, 20, 105, textColors.six, ricasso('75'));
    this.dynamicTextures.castMeshFive.drawText(trailers[key].cast.five.name, 20, 105, textColors.seven, ricasso('75'));

    this.dynamicTextures.cinematographyTextMesh.drawText("Cinematography:", 105, 100, 'white', ricasso('85'));
    this.dynamicTextures.cinematographyMeshOne.drawText(trailers[key].cinematography.one.name, 20, 105, textColors.eight, ricasso('75'));
    this.dynamicTextures.cinematographyMeshTwo.drawText(trailers[key].cinematography.two.name, 20, 105, textColors.nine, ricasso('75'));

    this.dynamicTextures.writingTextMesh.drawText("Writing:", 740, 105, 'white', ricasso('85'));
    this.dynamicTextures.writingMeshOne.drawText(trailers[key].writing.one.name, 20, 105, textColors.ten, ricasso('75'));
    this.dynamicTextures.writingMeshTwo.drawText(trailers[key].writing.two.name, 20, 105, textColors.eleven, ricasso('75'));
    this.dynamicTextures.writingMeshThree.drawText(trailers[key].writing.three.name, 20, 105, textColors.twelve, ricasso('75'));

    this.dynamicTextures.releaseMesh.drawText(trailers[key].release, 40, 200, 'white', ricasso('125'));

    this.dynamicTextures.dividerMesh.drawText("___________________________________________________________________________________________________________________________________", 0, 10, 'white', '20px Corbel');
  },

  clearAll: function(col) {

    for(var name in this.params) {this.dynamicTextures[name].clear(col)};

    hoverKey = null;
  }
};


//controls for video playback
function videoPlaybackControls() {

  this.object3D = new THREE.Object3D();

    this.object3D.visible = false;

  this.params = {   backgroundMesh:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .1575, 
                                         meshwidth:      .005,
                                             color:  0x000000,
                                        dynamicmap:     false,     
                                        texturemap:      null, 
                                         posadjust:  { x: 0.0, y: -0.036, z: 0.00005 }  },

                      timelineMesh:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:      .092,
                                         meshwidth:     .0005,
                                             color:  0x261958,
                                        dynamicmap:     false,     
                                        texturemap:      null, 
                                         posadjust:  { x: -0.025, y: -0.036, z: 0.0001 }  },

                      bufferedMesh:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0001,
                                         meshwidth:     .0005,
                                             color:  0x9999CC,
                                        dynamicmap:     false,     
                                        texturemap:      null, 
                                         posadjust:  { x: -0.046, y: -0.036, z: 0.000101 }  },

                      progressMesh:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0001, 
                                         meshwidth:     .0005,
                                             color:  0x4B32AF,
                                        dynamicmap:     false,     
                                        texturemap:      null, 
                                         posadjust:  { x: -0.046, y: -0.036, z: 0.000102 }  },

                   timeElapsedMesh:  {  pixelength:      1280,
                                        pixelwidth:       720,
                                        meshlength:     .0072,
                                         meshwidth:    .00405,
                                             color:  0x4B32AF,
                                        dynamicmap:      true,
                                        texturemap:      null,   
                                         posadjust:  { x: -0.075, y: -0.036, z: 0.0001 }  },

                 timeRemainingMesh:  {  pixelength:      1280,
                                        pixelwidth:       720,
                                        meshlength:     .0072, 
                                         meshwidth:    .00405,
                                             color:  0x4B32AF,
                                        dynamicmap:      true,
                                        texturemap:      null,
                                         posadjust:  { x: 0.025, y: -0.036, z: 0.0001 }  },

                     restartButton:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0072,
                                         meshwidth:    .00405,
                                             color:  0xFFFFFF,
                                        dynamicmap:     false,
                                        texturemap:  THREE.ImageUtils.loadTexture('public_assets/restart_button.png'),
                                         posadjust:  { x: 0.035, y: -0.036, z: 0.0001 }  },

                      rewindButton:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0072, 
                                         meshwidth:    .00405,
                                             color:  0xFFFFFF,
                                        dynamicmap:     false,
                                        texturemap:  THREE.ImageUtils.loadTexture('public_assets/rewind_button.png'),
                                         posadjust:  { x: 0.043, y: -0.036, z: 0.0001 }  },

                        playButton:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0072, 
                                         meshwidth:    .00405,
                                             color:  0xFFFFFF,
                                        dynamicmap:     false,
                                        texturemap:  THREE.ImageUtils.loadTexture('public_assets/play_button.png'), 
                                         posadjust:  { x: 0.051, y: -0.036, z: 0.00009 }  },

                       pauseButton:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0072,
                                         meshwidth:    .00405,
                                             color:  0xFFFFFF,
                                        dynamicmap:     false,     
                                        texturemap:  THREE.ImageUtils.loadTexture('public_assets/pause_button.png'), 
                                         posadjust:  { x: 0.051, y: -0.036, z: 0.0001 }  },

                 fastForwardButton:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0072, 
                                         meshwidth:    .00405,
                                             color:  0xFFFFFF,
                                        dynamicmap:     false,
                                        texturemap:  THREE.ImageUtils.loadTexture('public_assets/fastforward_button.png'),
                                         posadjust:  { x: 0.059, y: -0.036, z: 0.0001 }  },

              exitFullscreenButton:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0072, 
                                         meshwidth:    .00405,
                                             color:  0xFFFFFF,
                                        dynamicmap:     false,
                                        texturemap:  THREE.ImageUtils.loadTexture('public_assets/exit_fullscreen_button.png'),
                                         posadjust:  { x: 0.067, y: -0.036, z: 0.00009 }  },

             enterFullscreenButton:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0072, 
                                         meshwidth:    .00405,
                                             color:  0xFFFFFF,
                                        dynamicmap:     false,
                                        texturemap:  THREE.ImageUtils.loadTexture('public_assets/enter_fullscreen_button.png'),
                                         posadjust:  { x: 0.067, y: -0.036, z: 0.0001 }  },

                        exitButton:  {  pixelength:      null,
                                        pixelwidth:      null,
                                        meshlength:     .0072, 
                                         meshwidth:    .00405,
                                             color:  0xFFFFFF,
                                        dynamicmap:     false,
                                        texturemap:  THREE.ImageUtils.loadTexture('public_assets/exit_button.png'),
                                         posadjust:  { x: 0.075, y: -0.036, z: 0.0001 }  }   };

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

    this[name].position.set( this.object3D.position.x + params[name].posadjust.x,
                             this.object3D.position.y + params[name].posadjust.y,
                             this.object3D.position.z + params[name].posadjust.z );

    this.object3D.add(this[name]);
  };
};

videoPlaybackControls.prototype = {

  constructor: videoPlaybackControls,

  trailerTimeUpdate: function() {
        
    this.dynamicTextures.timeElapsedMesh.clear('black');
    this.dynamicTextures.timeElapsedMesh.drawText(sec_to_string(Math.round(trailers[clickKey].video.currentTime)), undefined, 475, 'white', '500px Corbel');

    this.bufferedMesh.scale.x = (this.timelineMesh.geometry.parameters.width*(Math.round(trailers[clickKey].video.buffered.end(0))/Math.round(trailers[clickKey].video.duration))-this.bufferedMesh.geometry.parameters.width)/this.bufferedMesh.geometry.parameters.width;
    this.bufferedMesh.position.x = (2*this.timelineMesh.position.x-params.timelineMesh.meshlength+this.bufferedMesh.scale.x*this.bufferedMesh.geometry.parameters.width)/2;

    this.progressMesh.scale.x = (this.timelineMesh.geometry.parameters.width*(Math.round(trailers[clickKey].video.currentTime)/Math.round(trailers[clickKey].video.duration))-this.progressMesh.geometry.parameters.width)/this.progressMesh.geometry.parameters.width;
    this.progressMesh.position.x = (2*this.timelineMesh.position.x-params.timelineMesh.meshlength+this.progressMesh.scale.x*this.progressMesh.geometry.parameters.width)/2;

    this.dynamicTextures.timeRemainingMesh.clear('black');
    this.dynamicTextures.timeRemainingMesh.drawText(sec_to_string(Math.round(trailers[clickKey].video.duration)-Math.round(trailers[clickKey].video.currentTime)), undefined, 475, 'white', '500px Corbel');
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
  
    if(document.webkitIsFullScreen) {
      this.object3D.remove(this.enterFullscreenButton);
      this.object3D.add(this.exitFullscreenButton);
    } else {
      this.object3D.remove(this.exitFullscreenButton);
      this.object3D.add(this.enterFullscreenButton);
    };
  }
};

