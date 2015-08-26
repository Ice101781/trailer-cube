//global vars//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var innerWidth  = window.innerWidth,
    innerHeight = window.innerHeight,

    scene    = new THREE.Scene(),
    renderer = new THREE.WebGLRenderer({antialias: false, alpha: false}),
    camera   = new THREE.PerspectiveCamera(48.5, (16/9), 0.01, 100),
    camHome  = new THREE.Vector3(  2*Math.sin(0)*Math.cos(0),  2*Math.sin(0)*Math.sin(0),  2*Math.cos(0) ),
    camLoad  = new THREE.Vector3( 60*Math.sin(0)*Math.cos(0), 60*Math.sin(0)*Math.sin(0), 60*Math.cos(0) ),

    clock    = new THREE.Clock(),

    mouse    = {x: 0, y: 0},
    controls = new THREE.OrbitControls( camera, $("container") ),

    dimensions = {  screenMeshPixels:            { length: 1280,   width: 720    },
                    titleMeshPixels:             { length: 1280,   width: 128    },
                    plotMeshPixels:              { length: 1280,   width: 256    },
                    loadBarMesh:                 { length: .0001,  width: .35    },
                    screenMesh:                  { length: .16,    width: .09    },
                    titleMesh:                   { length: .0288,  width: .00288 },
                    plotMesh:                    { length: .0575,  width: .0115  },
                    videoControlsBackgroundMesh: { length: .1575,  width: .005   },
                    timelineBackgroundMesh:      { length: .092,   width: .0005  },
                    videoProgressMesh:           { length: .0001,  width: .0005  },
                    buttonMesh:                  { length: .0072,  width: .00405 }  },
    
    locations = [ [-.42, .455, .51], [-.25, .455, .51] ],

    


    loaded_images = 0,
    a = 0,
    videos = [];

//scene objects////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//lights
function pointLights() {
  
  this.one   = new THREE.PointLight(0xFF0000);
    this.one.visible = true;
    this.one.position.set(-175, 0, 0);

  this.two   = new THREE.PointLight(0x00FF00);
    this.two.visible = true;
    this.two.position.set(175, 0, 0);

  this.three = new THREE.PointLight(0x0000FF);
    this.three.visible = true;
    this.three.position.set(0, 0, 175);
};


//the loading screen animation
function rhombicDodecahedron() {

  this.geometry = new THREE.Geometry();
    this.geometry.vertices = [ new THREE.Vector3( 2.04772293123743050, -4.09327412386437040, -5.74908146957292670),
                               new THREE.Vector3( 7.02732984841516030,  1.40331541320251810, -1.62706516545639390),
                               new THREE.Vector3( 4.22549114271519950, -1.62031854283173550,  5.78962800381778210),
                               new THREE.Vector3( 0.75411577446253997,  7.11690807989861880, -1.66761169970125600),
                               new THREE.Vector3(-0.75411577446252998, -7.11690807989862510,  1.66761169970125020),
                               new THREE.Vector3(-4.22549114271518980,  1.62031854283173260, -5.78962800381778920),
                               new THREE.Vector3( -2.0477229312374288,  4.09327412386436950,  5.74908146957292670),
                               new THREE.Vector3(-7.02732984841515230, -1.40331541320252740,  1.62706516545639970),
                               new THREE.Vector3( 6.27321407395262300, -5.71359266669610030,  0.04054653424485652),
                               new THREE.Vector3( 2.80183870569996340,  3.02363395603425690, -7.41669316927418000),
                               new THREE.Vector3( 4.97960691717773150,  5.49658953706689160,  4.12201630411653590),
                               new THREE.Vector3(-2.80183870569996340, -3.02363395603425690,  7.41669316927418000),
                               new THREE.Vector3(-4.97960691717773150, -5.49658953706689160, -4.12201630411653590),
                               new THREE.Vector3(-6.27321407395262480,  5.71359266669610210, -0.04054653424485653) ];

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

  this.material = new THREE.MeshLambertMaterial({color: 0x4B32AF, wireframe: false, shading: THREE.FlatShading});

  this.mesh = new THREE.Mesh(this.geometry, this.material);
    
    this.mesh.visible = true;
    //this.mesh.position.set(0, 0, 0);
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
    new THREE.PlaneBufferGeometry(dimensions.loadBarMesh.length, dimensions.loadBarMesh.width, 1, 1), 
    new THREE.MeshBasicMaterial({color: 0x00FF00})
  );
  
    this.mesh.visible = true;
    this.mesh.position.set(-10, -24.25, 0);  
};

loadBar.prototype = {

  constructor: loadBar,

  progress: function() {

    this.mesh.scale.x = (95.5*(loaded_images/media_sources.length)-this.mesh.geometry.parameters.width)/(this.mesh.geometry.parameters.width);
    this.mesh.position.x = (-47.75)+(this.mesh.scale.x*this.mesh.geometry.parameters.width)/2;
  }
};


//the cube
function wireFrameCube(segments) {

  segments = typeof segments !== 'undefined' ? segments : 100;
  
  this.mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, segments, segments, segments), 
    new THREE.MeshBasicMaterial({color: 0x4B32AF, wireframe: true})
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
  
  this.video  = create("video");
    this.video.crossOrigin = 'anonymous';

  this.canvas = create("canvas");
    this.canvas.getContext('2d');
    this.canvas.length = dimensions.screenMeshPixels.length;
    this.canvas.width  = dimensions.screenMeshPixels.width;
 
  this.videoScreen = new THREE.Mesh( 
    new THREE.PlaneBufferGeometry(dimensions.screenMesh.length, dimensions.screenMesh.width, 1, 1), 
    new THREE.MeshBasicMaterial({overdraw: true}) 
  );
  
    this.videoScreen.visible = false;
    this.videoScreen.position.set(new THREE.Vector3());
    //videoCube.add(this.videoScreen);
};


function trailerInfo() {

  this.object3D = new THREE.Object3D();

    this.object3D.visible = true;


  this.dynamicTextures = {
    xTrailerTitle: new THREEx.DynamicTexture(dimensions.titleMeshPixels.length, dimensions.titleMeshPixels.width),
    xTrailerPlot:  new THREEx.DynamicTexture(dimensions.plotMeshPixels.length, dimensions.plotMeshPixels.width)
  };

  infoDynamicTextures = this.dynamicTextures;

  this.titleMesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(dimensions.titleMesh.length, dimensions.titleMesh.width, 1, 1),
    new THREE.MeshBasicMaterial({map: infoDynamicTextures.xTrailerTitle.texture, transparent: true})
  );

    titleMesh = this.titleMesh;
    titleMesh.position.set(camera.position.x-.04485, camera.position.y-.02625, camera.position.z-.075);
    this.object3D.add(titleMesh);

  this.plotMesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(dimensions.plotMesh.length, dimensions.plotMesh.width, 1, 1),
    new THREE.MeshBasicMaterial({map: infoDynamicTextures.xTrailerPlot.texture, transparent: true})
  );

    plotMesh = this.plotMesh;
    plotMesh.position.set(camera.position.x-.03050, camera.position.y-.03375, camera.position.z-.075);
    this.object3D.add(plotMesh);

  infoDynamicTextures.xTrailerTitle.clear('red');
  infoDynamicTextures.xTrailerPlot.clear('red');
};


function videoPlaybackControls() {

  this.object3D = new THREE.Object3D();

    this.object3D.visible = false;


  this.videoControlsBackground = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(dimensions.videoControlsBackgroundMesh.length, dimensions.videoControlsBackgroundMesh.width, 1, 1),
    new THREE.MeshBasicMaterial({color: 0x000000})  
  );

    videoControlsBackground = this.videoControlsBackground;
    videoControlsBackground.position.set( locations[a][0]-(0.0000), locations[a][1]-(0.0360), locations[a][2]+(0.00005) );
    this.object3D.add(videoControlsBackground);


  this.timelineBackground = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(dimensions.timelineBackgroundMesh.length, dimensions.timelineBackgroundMesh.width, 1, 1),
    new THREE.MeshBasicMaterial({color: 0x261958})
  );

    timelineBackground = this.timelineBackground;
    timelineBackground.position.set( locations[a][0]-(0.0500)+.025, locations[a][1]-(0.0360), locations[a][2]+(0.00010) );
    this.object3D.add(timelineBackground);


  this.bufferProgress = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(dimensions.videoProgressMesh.length, dimensions.videoProgressMesh.width, 1, 1),
    new THREE.MeshBasicMaterial({color: 0x9999CC})    
  );

    bufferProgress = this.bufferProgress;
    bufferProgress.position.set( locations[a][0]-(0.0710)+.025, locations[a][1]-(0.0360), locations[a][2]+(0.00011) );
    this.object3D.add(bufferProgress);


  this.timelineProgress = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(dimensions.videoProgressMesh.length, dimensions.videoProgressMesh.width, 1, 1),
    new THREE.MeshBasicMaterial({color: 0x4B32AF})
  );
  
    timelineProgress = this.timelineProgress;
    timelineProgress.position.set( locations[a][0]-(0.0710)+.025, locations[a][1]-(0.0360), locations[a][2]+(0.00012) );
    this.object3D.add(timelineProgress);


  this.restartButton = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(dimensions.buttonMesh.length, dimensions.buttonMesh.width, 1, 1),
    new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('public_assets/restart_button.png')})
  );

    restartButton = this.restartButton;
    restartButton.position.set( locations[a][0]+(0.0350), locations[a][1]-(0.0360), locations[a][2]+(0.0001) );
    this.object3D.add(restartButton);


  this.rewindButton = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(dimensions.buttonMesh.length, dimensions.buttonMesh.width, 1, 1),
    new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('public_assets/rewind_button.png')})
  );

    rewindButton = this.rewindButton;
    rewindButton.position.set( locations[a][0]+(0.0430), locations[a][1]-(0.0360), locations[a][2]+(0.0001) );
    this.object3D.add(rewindButton);


  this.playButton = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(dimensions.buttonMesh.length, dimensions.buttonMesh.width, 1, 1),
    new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('public_assets/play_button.png')})
  );

    playButton = this.playButton;
    playButton.position.set( locations[a][0]+(0.0510), locations[a][1]-(0.0360), locations[a][2]+(0.00009) );
    this.object3D.add(playButton);


  this.pauseButton = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(dimensions.buttonMesh.length, dimensions.buttonMesh.width, 1, 1),
    new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('public_assets/pause_button.png')})
  );

    pauseButton = this.pauseButton;
    pauseButton.position.set( locations[a][0]+(0.0510), locations[a][1]-(0.0360), locations[a][2]+(0.0001) );
    this.object3D.add(pauseButton);


  this.fastForwardButton = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(dimensions.buttonMesh.length, dimensions.buttonMesh.width, 1, 1),
    new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('public_assets/fastforward_button.png')})
  );    

    fastForwardButton = this.fastForwardButton;
    fastForwardButton.position.set( locations[a][0]+(0.0590), locations[a][1]-(0.0360), locations[a][2]+(0.0001) );
    this.object3D.add(fastForwardButton);


  this.exitFullscreenButton = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(dimensions.buttonMesh.length, dimensions.buttonMesh.width, 1, 1),
    new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('public_assets/exit_fullscreen_button.png')})
  );
    
    exitFullscreenButton = this.exitFullscreenButton;
    exitFullscreenButton.position.set( locations[a][0]+(0.0670), locations[a][1]-(0.0360), locations[a][2]+(0.00009) );
    this.object3D.add(exitFullscreenButton);


  this.enterFullscreenButton = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(dimensions.buttonMesh.length, dimensions.buttonMesh.width, 1, 1),
    new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('public_assets/enter_fullscreen_button.png')})
  );

    enterFullscreenButton = this.enterFullscreenButton;
    enterFullscreenButton.position.set( locations[a][0]+(0.0670), locations[a][1]-(0.0360), locations[a][2]+(0.0001) );
    this.object3D.add(enterFullscreenButton);


  this.exitButton = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(dimensions.buttonMesh.length, dimensions.buttonMesh.width, 1, 1),
    new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('public_assets/exit_button.png')})
  );

    exitButton = this.exitButton;
    exitButton.position.set( locations[a][0]+(0.0750), locations[a][1]-(0.0360), locations[a][2]+(0.0001) );
    this.object3D.add(exitButton);


  this.dynamicTextures = {
    xTrailerProgress: new THREEx.DynamicTexture(dimensions.screenMeshPixels.length, dimensions.screenMeshPixels.width),
    xTrailerLength:   new THREEx.DynamicTexture(dimensions.screenMeshPixels.length, dimensions.screenMeshPixels.width)
  };

  timeDynamicTextures = this.dynamicTextures;

  this.trailerTimeProgress = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(dimensions.buttonMesh.length, dimensions.buttonMesh.width, 1, 1),
    new THREE.MeshBasicMaterial({map: timeDynamicTextures.xTrailerProgress.texture, color: 0x4B32AF})
  );

    trailerTimeProgress = this.trailerTimeProgress; 
    trailerTimeProgress.position.set( locations[a][0]-(0.0750), locations[a][1]-(0.0360), locations[a][2]+(0.0001) );
    this.object3D.add(trailerTimeProgress);

  this.trailerTimeLength = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(dimensions.buttonMesh.length, dimensions.buttonMesh.width, 1, 1),
    new THREE.MeshBasicMaterial({map: timeDynamicTextures.xTrailerLength.texture, color: 0x4B32AF})
  );

    trailerTimeLength = this.trailerTimeLength;
    trailerTimeLength.position.set( locations[a][0]+(0.0250), locations[a][1]-(0.0360), locations[a][2]+(0.0001) );
    this.object3D.add(trailerTimeLength);
};

videoPlaybackControls.prototype = {

  constructor: videoPlaybackControls,

  trailerTimeUpdate: function() {
        
    timeDynamicTextures.xTrailerProgress.clear('black');
    timeDynamicTextures.xTrailerProgress.drawText(sec_to_string(Math.round(videos[a].currentTime)), undefined, 475, 'white', '500px Corbel');

    bufferProgress.scale.x = ((timelineBackground.geometry.parameters.width*(Math.round(videos[a].buffered.end(0))/Math.round(videos[a].duration)))-bufferProgress.geometry.parameters.width)/(bufferProgress.geometry.parameters.width);
    bufferProgress.position.x = locations[a][0]-(0.0710)+((bufferProgress.scale.x*bufferProgress.geometry.parameters.width)/2);

    timelineProgress.scale.x = ((timelineBackground.geometry.parameters.width*(Math.round(videos[a].currentTime)/Math.round(videos[a].duration)))-timelineProgress.geometry.parameters.width)/(timelineProgress.geometry.parameters.width);
    timelineProgress.position.x = locations[a][0]-(0.0710)+((timelineProgress.scale.x*timelineProgress.geometry.parameters.width)/2);

    timeDynamicTextures.xTrailerLength.clear('black');
    timeDynamicTextures.xTrailerLength.drawText(sec_to_string(Math.round(videos[a].duration)-Math.round(videos[a].currentTime)), undefined, 475, 'white', '500px Corbel');
  },

  fullscreenButtonCheck: function() {
  
    if(document.webkitIsFullScreen) {
      playbackControls.object3D.remove(enterFullscreenButton);
      playbackControls.object3D.add(exitFullscreenButton);
    }
    else {
      playbackControls.object3D.remove(exitFullscreenButton);
      playbackControls.object3D.add(enterFullscreenButton);
    };
  }
};


