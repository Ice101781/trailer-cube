/////////////////////////////////////////bugs//////////////////////////////////////////////////////////////////////////////////////////////////////
/*
  1) trailer_cube is optimized for the Google Chrome(c) browser, so some functionality/features may be lost when
     using other browsers.

  3) sometimes when exiting a video the camera will position itself above the cube, shooting downward.
     this behavior seems to occur randomly. (possibly an orbitcontrols.js issue?)

  4) sometimes when playing a video the following console error will appear: "Uncaught IndexSizeError: Failed to execute
     'end' on 'TimeRanges': The index provided (0) is greater than or equal to the maximum bound (0)". the error doesn't
     seem to affect playback much.

  5) if a video is paused, it's possible to fast-forward beyond the point of what's been buffered;
     this causes playback to lag.

  ***FIXED 07/18/15 @ 1:00am*****************************************************************************
  2) when playing the first video of a given user session, the pause button will need to be pressed twice 
     in order to function correctly, unless another playback button is initially pressed.
  *******************************************************************************************************
*/

window.onload = function() {

/////////////////////////////////////////scene objects, global vars, etc.//////////////////////////////////////////////////////////////////////////
var light            = new pointLights(),
    spinBox          = new rhombicDodecahedron(.75),
    loading          = new loadBar(),
    cube             = new wireFrameCube(10),
    info             = new trailerInfo(),
    playbackControls = new videoPlaybackControls(),

    noClickEffect    = [ loading.mesh,
                         cube.mesh,
                         info.object3D,
                         playbackControls.backgroundMesh,
                         playbackControls.timelineMesh,
                         playbackControls.bufferedMesh,
                         playbackControls.progressMesh,
                         playbackControls.timeElapsedMesh,
                         playbackControls.timeRemainingMesh ];

//append the container to the document, then the renderer to the container
if( document.body != null ) { 
  append( $("container"), document.body );
};

if( $("container") != null ) {
  renderer.setSize(window.innerWidth, window.innerHeight); 
  renderer.setClearColor(0x000000);
  append( renderer.domElement, $("container") );
};

/////////////////////////////////////////user functions////////////////////////////////////////////////////////////////////////////////////////////
//listen for events
window.addEventListener('resize', onWindowResize);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mousedown', onMouseClick);


function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = (16/9);
};


function onMouseMove(event) {
  event.preventDefault(); 
  mouse.x = (event.clientX/window.innerWidth)*2-1; 
  mouse.y = -(event.clientY/window.innerHeight)*2+1;
};


function onMouseHover() {
  var hoverRaycaster = new THREE.Raycaster();

  hoverRaycaster.vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);

  hoverRaycaster.vector.unproject(camera);

  hoverRaycaster.set( camera.position, hoverRaycaster.vector.sub(camera.position).normalize() );

  var intersects = hoverRaycaster.intersectObjects(scene.children, true);
  //console.log(intersects);

  //logic for trailer info visibility
  if(intersects[0] != undefined && playbackControls.object3D.parent != scene) {    
    for(var key in trailers) {
      if(intersects[0].object == trailers[key].videoScreen) {
        //retrieve a global-scope key
        hoverKey = key;

        //clear a color for debugging and render the trailer info
        info.clearAll('red'); 
        info.draw();
      };
    };
  }
  else {
    info.clearAll();
    hoverKey = null;
  };

  //logic for playback controls visibility
  if(intersects[0] != undefined && playbackControls.object3D.parent == scene) {
    if(intersects[0].object.parent == playbackControls.object3D) {
      playbackControls.object3D.visible = true;
      return; 
    }
    else {
      playbackControls.object3D.visible = false;
      return;
    };
  };
};


function onMouseClick() {
  var clickRaycaster = new THREE.Raycaster();

  clickRaycaster.vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);

  clickRaycaster.vector.unproject(camera);

  clickRaycaster.set( camera.position, clickRaycaster.vector.sub(camera.position).normalize() );

  var intersects = clickRaycaster.intersectObjects(scene.children, true);
  //console.log(intersects);

  //logic for objects that produce no effect when clicked
  if(intersects[0] == undefined) { return };
  for(i=0; i<noClickEffect.length; i++) { if(intersects[0].object == noClickEffect[i]) { return } };

  //logic for clicked objects if no video is playing
  if(playbackControls.object3D.parent != scene) {
    if(intersects[0].object == spinBox.mesh) {
        spinBox.clicked();
    };

    for(var key in trailers) {
      if(intersects[0].object == trailers[key].videoScreen) {
        //retrieve a global-scope key
        clickKey = key;

        //adjust and disable controls, then remove the trailer info object
        controls.minDistance = .1;
        controls.enabled = false;
        camera.remove(info.object3D);

        //position the camera in front of the video screen that's been clicked, then target it
        camera.position.copy(trailers[key].videoScreen.position);
        camera.position.z += controls.minDistance;
        controls.target = trailers[key].videoScreen.position;

        //remove the image still and replace it with the video texture, then load and play the video
        trailers[key].videoScreen.material.map = trailers[key].texture;
        trailers[key].video.load();
        trailers[key].video.play();

        //position and add the playback controls
        playbackControls.object3D.position.copy(trailers[key].videoScreen.position);
        scene.add(playbackControls.object3D);

        //swap for play button at video end
        trailers[key].video.addEventListener('ended', function(event) { if(playbackControls.pauseButton.visible == true) {playbackControls.playButtonSwap()} });
      };
    };
  };

  //logic for clicked objects if video is playing
  if(playbackControls.object3D.parent == scene) {
    if(intersects[0].object == trailers[clickKey].videoScreen) {
      return;
    }
    else if(intersects[0].object == playbackControls.restartButton) {
      trailers[clickKey].video.currentTime = 0;
      trailers[clickKey].video.play();
      if(playbackControls.playButton.visible == true) { playbackControls.pauseButtonSwap() };
      return;
    }
    else if(intersects[0].object == playbackControls.rewindButton) {
      trailers[clickKey].video.currentTime -= 5;
      return;
    }
    else if(intersects[0].object == playbackControls.playButton) {
      trailers[clickKey].video.play();
      playbackControls.pauseButtonSwap();
      return;
    }
    else if(intersects[0].object == playbackControls.pauseButton) {
      trailers[clickKey].video.pause();
      playbackControls.playButtonSwap();
      return;
    }
    else if(intersects[0].object == playbackControls.fastForwardButton) {
      trailers[clickKey].video.currentTime += 5;
      if(trailers[clickKey].video.currentTime == trailers[clickKey].video.duration) { return };
      return;
    }
    else if(intersects[0].object == playbackControls.enterFullscreenButton) {
      renderer.domElement.webkitRequestFullscreen();
      return;
    }
    else if(intersects[0].object == playbackControls.exitFullscreenButton) {
      document.webkitExitFullscreen();
      return;
    }
    else if(intersects[0].object == playbackControls.exitButton) {
      if(playbackControls.playButton.visible == true) { playbackControls.pauseButtonSwap() };
      playbackControls.object3D.visible = false;
      scene.remove(playbackControls.object3D);
      trailers[clickKey].video.pause();
      trailers[clickKey].video.currentTime = 0;
      trailers[clickKey].context.clearRect(0, 0, trailers[clickKey].canvas.width, trailers[clickKey].canvas.height);
      trailers[clickKey].videoScreen.material.map = trailers[clickKey].imageStill;
      camera.position.y = trailers[clickKey].location.y+.25;
      camera.position.z = trailers[clickKey].location.z+.50;
      camera.add(info.object3D);
      controls.target = new THREE.Vector3();
      controls.minDistance = 1;
      controls.enabled = true;
      clickKey = null;
      return;
    };
  };
};


function init() {
  //adjust and disable controls, then move camera to loading screen position
  controls.minDistance = 30;
  controls.maxDistance = 90;
  controls.enabled = false;
  camera.position.copy(camLoad);
    
  //add objects to the scene;
  scene.add(camera, light.object3D, spinBox.mesh, loading.mesh, cube.mesh);

  //allow CORS for images
  THREE.ImageUtils.crossOrigin = 'anonymous';
  
  //set trailer locations, position the video screens and add them to the scene, then load the image stills
  for(var key in trailers) {
    trailers[key].location = cube.mesh.geometry.vertices[440+2*Object.keys(trailers).indexOf(key)];
    
    trailers[key].videoScreen.position.copy(trailers[key].location);
    trailers[key].videoScreen.position.z += 0.001;
    scene.add(trailers[key].videoScreen);

    trailers[key].imageStill = THREE.ImageUtils.loadTexture( trailers[key].filesource+".jpg", undefined, function() { loadedImages++ } );
    trailers[key].videoScreen.material.map = trailers[key].imageStill;
  };
};


function imagesLoaded() {
  //remove the loading screen
  scene.remove(spinBox.mesh, loading.mesh);

  //adjust and enable controls, then move camera to home position and add to it the trailer info object
  controls.minDistance = 1;
  controls.maxDistance = 3;
  controls.enabled = true;
  camera.position.copy(camHome);
  camera.add(info.object3D);

  //toggle object visibility
  cube.mesh.visible = true;
  info.object3D.visible = true;
  for(var key in trailers) { trailers[key].videoScreen.visible = true };

  //reset count of loaded images
  loadedImages = 0;
};


function render() {
  //get the number of seconds passed since the last render
  var delta = clock.getDelta();
  
  //loading screen animation and image load progress
  if(spinBox.mesh.parent == scene) { spinBox.animation() };
  if(loading.mesh.parent == scene) { loading.progress() };

  //view homepage if all images have been loaded
  if(loadedImages == Object.keys(trailers).length) { imagesLoaded() };

  //check for highlighted objects
  onMouseHover();

  //update the video if it's playing
  if(clickKey != null && trailers[clickKey].video != undefined) {

    trailers[clickKey].videoUpdate();
    
    if(trailers[clickKey].video.readyState > 0) { playbackControls.trailerTimeUpdate() };
  };

  //monitor fullscreen button during playback
  if(playbackControls.object3D.parent == scene) { playbackControls.fullscreenButtonCheck() };

  controls.update(delta);
  renderer.render(scene, camera);
  //console.log(variable name(s) here);
};


function animate() {
  requestAnimationFrame(animate);
  render();
};

init();
animate();
//console.log(variable name(s) here);
};

