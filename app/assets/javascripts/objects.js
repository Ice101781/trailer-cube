/////////////////////////////////////////global vars///////////////////////////////////////////////////////////////////////////////////////////////

var scene    = new THREE.Scene(),
    renderer = new THREE.WebGLRenderer( {antialias: false, alpha: false} ),
    camera   = new THREE.PerspectiveCamera(48.5, (16/9), 0.01, 100),
    camHome  = new THREE.Vector3(  2*Math.sin(0)*Math.cos(0),  2*Math.sin(0)*Math.sin(0),  2*Math.cos(0) ),
    camLoad  = new THREE.Vector3( 60*Math.sin(0)*Math.cos(0), 60*Math.sin(0)*Math.sin(0), 60*Math.cos(0) ),

    clock    = new THREE.Clock(),

    mouse    = {x: 0, y: 0},
    controls = new THREE.OrbitControls( camera, $("container") ),
    
    locations = [ [-.42, .455, .51], [-.25, .455, .51] ];



var loaded_images = 0,
    click = false,
    a = 0,
    videos = [];


/////////////////////////////////////////objects///////////////////////////////////////////////////////////////////////////////////////////////////

//lights
function pointLights() {
  
  this.object3D = new THREE.Object3D();

  this.params = {  one:   { hex: 0xFF0000, coords: { x: -175, y: 0, z:   0} }, 
                   two:   { hex: 0x00FF00, coords: { x:  175, y: 0, z:   0} },
                   three: { hex: 0x0000FF, coords: { x:    0, y: 0, z: 175} }  };

  params = this.params;

  for(var num in params) {
     
    this[num] = new THREE.PointLight( params[num].hex );

    this[num].position.set( params[num].coords.x, params[num].coords.y, params[num].coords.z );

    this[num].visible = true;

    this.object3D.add(this[num]);
  };
};


//the loading screen animation
function rhombicDodecahedron(scalar) {

  scalar = typeof scalar !== 'undefined' ? scalar : 1;

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

  this.material = new THREE.MeshLambertMaterial( {color: 0x4B32AF, wireframe: false, shading: THREE.FlatShading} );

  this.mesh = new THREE.Mesh(this.geometry, this.material);
    
    this.mesh.visible = true;
    this.mesh.position.set(0, 10, 0);
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
    new THREE.MeshBasicMaterial( {color: 0x00FF00} )
  );
    
    this.mesh.maxsize = 95.5;
    this.mesh.visible = true;
    this.mesh.position.set(-10, -24.5, 0);
};

loadBar.prototype = {

  constructor: loadBar,

  progress: function() {

    this.mesh.scale.x = (this.mesh.maxsize*(loaded_images/media_sources.length)-this.mesh.geometry.parameters.width)/this.mesh.geometry.parameters.width;
    this.mesh.position.x = (-this.mesh.maxsize+this.mesh.scale.x*this.mesh.geometry.parameters.width)/2;
  }
};


//the cube
function wireFrameCube(segments) {

  segments = typeof segments !== 'undefined' ? segments : 100;
  
  this.mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, segments, segments, segments), 
    new THREE.MeshBasicMaterial( {color: 0x4B32AF, wireframe: true} )
  );

    this.mesh.visible = false;
    //this.mesh.position.set(0, 0, 0);
};


function trailer(identifiers, genre, plot, director, actors, release) {
  
  identifiers = typeof identifiers !== 'undefined' ? identifiers : {title:'', filename:''};
  genre       = typeof genre       !== 'undefined' ? genre       : '';
  plot        = typeof plot        !== 'undefined' ? plot        : {line1:'', line2:'', line3:'', line4:'', line5:'', line6:''};
  director    = typeof director    !== 'undefined' ? director    : '';
  actors      = typeof actors      !== 'undefined' ? actors      : {1:'', 2:'', 3:'', 4:'', 5:''};
  release     = typeof release     !== 'undefined' ? release     : '';  
  
  this.identifiers = identifiers;
  this.genre       = genre;
  this.plot        = plot;
  this.director    = director;
  this.actors      = actors;
  this.release     = release;

  this.filesource = "https://files9.s3-us-west-2.amazonaws.com/hd_trailers/"+this.identifiers.filename+"/"+this.identifiers.filename;

  this.video = create("video");
    this.video.crossOrigin = 'anonymous';
    this.video.src = this.filesource + ".mp4";

  this.canvas = create("canvas");
    this.canvas.width  = 1280;
    this.canvas.height = 720;

  this.context = this.canvas.getContext('2d');
    this.context.fillStyle = '0#000000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

  this.texture = new THREE.Texture(this.canvas);

  this.videoScreen = new THREE.Mesh( 
    new THREE.PlaneBufferGeometry(.16, .09, 1, 1), 
    new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture("/public_assets/t_c.png"), overdraw: true} )
  );

    this.videoScreen.visible = false;
};

trailer.prototype = {

  constructor: trailer,

  videoUpdate: function() {

    if(this.video.readyState === this.video.HAVE_ENOUGH_DATA) { this.context.drawImage(this.video, 0, 0) };

    this.texture.needsUpdate = true;
  }
};


function trailerInfo() {

  this.object3D = new THREE.Object3D();

    this.object3D.visible = true;

  this.params = {  titleMesh: {  pixelength:    1280, 
                                 pixelwidth:     128, 
                                 meshlength:   .0288,
                                  meshwidth:  .00288, 
                                  posadjust:  { x: -.04485, y: -.02625, z: -.075 }  },
                   
                    plotMesh: {  pixelength:    1280, 
                                 pixelwidth:     256, 
                                 meshlength:   .0575,  
                                  meshwidth:   .0115,
                                  posadjust:  { x: -.0305, y: -.03375, z: -.075 }  }  };

  params = this.params;
  
  this.dynamicTextures = {};

  for(var name in params) {

    this.dynamicTextures[name] = new THREEx.DynamicTexture( params[name].pixelength, params[name].pixelwidth );
    this.dynamicTextures[name].clear();

    this[name] = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(params[name].meshlength, params[name].meshwidth, 1, 1),
      new THREE.MeshBasicMaterial( {map: this.dynamicTextures[name].texture, transparent: true} )
    );
    
    this[name].position.set( camera.position.x + params[name].posadjust.x,
                             camera.position.y + params[name].posadjust.y, 
                             camera.position.z + params[name].posadjust.z );
    
    this.object3D.add( this[name] );
  };
};


function videoPlaybackControls() {

  this.object3D = new THREE.Object3D();

    this.object3D.visible = false;

  this.params = {  backgroundMesh:  {  pixelength:      null,
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
                                        posadjust:  { x: 0.075, y: -0.036, z: 0.0001 }  }  };
  
  params = this.params;

  this.dynamicTextures = {};

  for(var name in params) {
    
    if( params[name].dynamicmap == true ) {

      this.dynamicTextures[name] = new THREEx.DynamicTexture( params[name].pixelength, params[name].pixelwidth );
      this.dynamicTextures[name].clear();

      params[name].texturemap = this.dynamicTextures[name].texture;
    };

    this[name] = new THREE.Mesh( 
      new THREE.PlaneBufferGeometry(params[name].meshlength, params[name].meshwidth, 1, 1),
      new THREE.MeshBasicMaterial( {map: params[name].texturemap, color: params[name].color} )
    );

    this[name].position.set( this.object3D.position.x + params[name].posadjust.x,
                             this.object3D.position.y + params[name].posadjust.y,
                             this.object3D.position.z + params[name].posadjust.z );

    this.object3D.add( this[name] );
  };
};

videoPlaybackControls.prototype = {

  constructor: videoPlaybackControls,

  trailerTimeUpdate: function() {
        
    this.dynamicTextures.timeElapsedMesh.clear('black');
    this.dynamicTextures.timeElapsedMesh.drawText(sec_to_string(Math.round(videos[a].currentTime)), undefined, 475, 'white', '500px Corbel');

    this.bufferedMesh.scale.x = (this.timelineMesh.geometry.parameters.width*(Math.round(videos[a].buffered.end(0))/Math.round(videos[a].duration))-this.bufferedMesh.geometry.parameters.width)/this.bufferedMesh.geometry.parameters.width;
    this.bufferedMesh.position.x = (2*this.timelineMesh.position.x-params.timelineMesh.meshlength+this.bufferedMesh.scale.x*this.bufferedMesh.geometry.parameters.width)/2;

    this.progressMesh.scale.x = (this.timelineMesh.geometry.parameters.width*(Math.round(videos[a].currentTime)/Math.round(videos[a].duration))-this.progressMesh.geometry.parameters.width)/this.progressMesh.geometry.parameters.width;
    this.progressMesh.position.x = (2*this.timelineMesh.position.x-params.timelineMesh.meshlength+this.progressMesh.scale.x*this.progressMesh.geometry.parameters.width)/2;

    this.dynamicTextures.timeRemainingMesh.clear('black');
    this.dynamicTextures.timeRemainingMesh.drawText(sec_to_string(Math.round(videos[a].duration)-Math.round(videos[a].currentTime)), undefined, 475, 'white', '500px Corbel');
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
    }
    else {
      this.object3D.remove(this.exitFullscreenButton);
      this.object3D.add(this.enterFullscreenButton);
    };
  }
};

