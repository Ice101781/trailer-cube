/////////////////////////////////////////bugs//////////////////////////////////////////////////////////////////////////////////////////////////////
/*
  1) trailer_cube is optimized for the Google Chrome(c) browser, so some functionality/features may be lost when
     using other browsers.

  ****3) sometimes when exiting a video the camera will position itself above the cube, shooting downward.
         this behavior seems to occur randomly. (possibly an orbitcontrols.js issue?)****

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
    cube             = new wireFrameCube(50, 0x111111),
    info             = new trailerInfo(),
    playbackControls = new videoPlaybackControls();

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
    switch(clickCount) {
      case 0:
        for(var key in trailers) {
          if(intersects[0].object == trailers[key].videoScreen && hoverKey !== undefined) {
            info.clearAll();
            hoverKey = key;
            info.draw();
          };
        };
        if(intersects[0].object == cube.mesh) { info.clearAll() };
        break;

      case 1:
        switch(intersects[0].object) {
          case info.titleMesh:
            info.dynamicTextures.titleMesh.drawText(trailers[clickKey].identifiers.title, 15, 80, 'rgb(75, 50, 175)', '55px RicassoRegular');
            break;

          case info.directorMesh:
            info.dynamicTextures.directorMesh.drawText(trailers[clickKey].director, 20, 110, 'rgb(75, 50, 175)', '75px RicassoRegular');
            break;

          case info.castMeshOne:
            info.dynamicTextures.castMeshOne.drawText(trailers[clickKey].cast.one, 20, 105, 'rgb(75, 50, 175)', '75px RicassoRegular');
            break;

          case info.castMeshTwo:
            info.dynamicTextures.castMeshTwo.drawText(trailers[clickKey].cast.two, 20, 105, 'rgb(75, 50, 175)', '75px RicassoRegular');
            break;

          case info.castMeshThree:
            info.dynamicTextures.castMeshThree.drawText(trailers[clickKey].cast.three, 20, 105, 'rgb(75, 50, 175)', '75px RicassoRegular');
            break;

          case info.castMeshFour:
            info.dynamicTextures.castMeshFour.drawText(trailers[clickKey].cast.four, 20, 105, 'rgb(75, 50, 175)', '75px RicassoRegular');
            break;

          case info.castMeshFive:
            info.dynamicTextures.castMeshFive.drawText(trailers[clickKey].cast.five, 20, 105, 'rgb(75, 50, 175)', '75px RicassoRegular');
            break;

          case info.clearingMesh:
            info.clearAll();
            clickCount = 0;
            clickKey = null;
            break;

          default:
            info.clearAll();
            info.draw(clickKey);
        };
        break;
    };
  }
  else {
    switch(clickCount) {
      case 0:
        info.clearAll();
        break;
      
      default:
        info.clearAll();
        info.draw(clickKey);
    };
  };

  //logic for playback controls visibility
  if(intersects[0] != undefined && playbackControls.object3D.parent == scene) {
    switch(intersects[0].object.parent) {
      case playbackControls.object3D:
        playbackControls.object3D.visible = true;
        break;

      default:
        playbackControls.object3D.visible = false;
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

  //logic for clicked objects if no video is playing
  if(playbackControls.object3D.parent != scene) {
    switch(intersects[0].object) {
      case spinBox.mesh:
        spinBox.clicked();
        break;

      case loading.mesh:
        break;

      case cube.mesh:
        break;

      case info.object3D:
        break;
    };

    for(var key in trailers) {
      if(intersects[0].object == trailers[key].videoScreen) {
        if(key == clickKey) {
          clickCount++;
        }
        else {
          clickCount = 1;
        };

        //retrieve a global-scope key
        clickKey = key;

        if(clickCount == 2) {
          //disable controls and target the screen that's been clicked, then remove the trailer info and position the camera in front of the screen
          controls.enabled = false;
          controls.target = trailers[key].videoScreen.position;
          camera.remove(info.object3D);
          camera.position.copy(trailers[key].videoScreen.position);
          camera.position.z += controls.minDistance;

          //remove the image still and replace it with the video texture, then load and play the video
          trailers[key].videoScreen.material.map = trailers[key].texture;
          trailers[key].video.load();
          //mute for debugging
          trailers[key].video.muted = true;
          trailers[key].video.play();

          //position and add the playback controls
          playbackControls.object3D.position.copy(trailers[key].videoScreen.position);
          scene.add(playbackControls.object3D);

          //swap for play button at video end
          trailers[key].video.addEventListener('ended', function(event) { if(playbackControls.pauseButton.visible == true) {playbackControls.playButtonSwap()} });

          //reset the click count
          clickCount = 0;
        };
      };
    };
  };

  //logic for clicked objects if video is playing
  if(playbackControls.object3D.parent == scene) {
    switch(intersects[0].object) {
      case playbackControls.backgroundMesh:
        break;

      case playbackControls.timelineMesh:
        break;

      case playbackControls.bufferedMesh:
        break;

      case playbackControls.progressMesh:
        break;

      case playbackControls.timeElapsedMesh:
        break;

      case playbackControls.timeRemainingMesh:
        break;

      case trailers[clickKey].videoScreen:
        break;

      case playbackControls.restartButton:      
        trailers[clickKey].video.currentTime = 0;
        if(playbackControls.pauseButton.visible == true) {
          trailers[clickKey].video.pause();
          playbackControls.playButtonSwap();
        };
        break;

      case playbackControls.rewindButton:
        trailers[clickKey].video.currentTime -= 5;
        if(trailers[clickKey].video.currentTime == 0 && playbackControls.pauseButton.visible == true) {
          trailers[clickKey].video.pause();
          playbackControls.playButtonSwap();
        };
        break;

      case playbackControls.playButton:
        trailers[clickKey].video.play();
        playbackControls.pauseButtonSwap();
        break;

      case playbackControls.pauseButton:
        trailers[clickKey].video.pause();
        playbackControls.playButtonSwap();
        break;

      case playbackControls.fastForwardButton:
        trailers[clickKey].video.currentTime += 5;
        break;

      case playbackControls.enterFullscreenButton:
        renderer.domElement.webkitRequestFullscreen();
        break;

      case playbackControls.exitFullscreenButton:
        document.webkitExitFullscreen();
        break;

      case playbackControls.exitButton:
        if(playbackControls.playButton.visible == true) {playbackControls.pauseButtonSwap()};
        playbackControls.object3D.visible = false;
        scene.remove(playbackControls.object3D);
        trailers[clickKey].video.pause();
        trailers[clickKey].video.currentTime = 0;
        trailers[clickKey].context.clearRect(0, 0, trailers[clickKey].canvas.width, trailers[clickKey].canvas.height);
        trailers[clickKey].videoScreen.material.map = trailers[clickKey].imageStill;
        controls.enabled = true;
        camera.position.z += .25;
        camera.add(info.object3D);
        //assign hoverKey to be undefined so that trailer info won't flash on exit 
        hoverKey = undefined;
        clickKey = null;
        break;
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
  
  //set trailer locations, position the video screens and add them to the cube, then load the image stills
  for(var key in trailers) {
    trailers[key].location = cube.mesh.geometry.vertices[10302+9*Object.keys(trailers).indexOf(key)];
    
    trailers[key].videoScreen.position.copy(trailers[key].location);
    trailers[key].videoScreen.position.z += 0.001;
    cube.mesh.add(trailers[key].videoScreen);

    trailers[key].imageStill = THREE.ImageUtils.loadTexture( trailers[key].filesource+".jpg", undefined, function() {loadedImages++} );
    trailers[key].videoScreen.material.map = trailers[key].imageStill;
  };
};


function imagesLoaded() {
  //remove the loading screen
  scene.remove(spinBox.mesh, loading.mesh);

  //adjust and enable controls, then move camera to home position and add to it the trailer info
  controls.minDistance = .1;
  controls.maxDistance = 2;
  controls.enabled = true;
  camera.position.copy(camHome);
  camera.add(info.object3D);

  //toggle object visibility
  cube.mesh.visible = true;
  info.object3D.visible = true;

  //reset value of loaded images
  loadedImages = 0;
};


function render() {
  //get the number of seconds passed since the last render
  var delta = clock.getDelta();

  //remain at the loading screen until all images have loaded, then go to the home page
  if(loadedImages < Object.keys(trailers).length) { 
    spinBox.animation();
    loading.progress();
  }
  else if(loadedImages == Object.keys(trailers).length) {
    imagesLoaded();
  };

  //check for highlighted objects
  onMouseHover();

  //update the video if it's playing, and monitor fullscreen button during playback
  if(clickKey != null && trailers[clickKey].video != undefined) {
    trailers[clickKey].videoUpdate();
    
    if(trailers[clickKey].video.readyState > 0) { 
      playbackControls.trailerTimeUpdate();
      playbackControls.fullscreenButtonCheck();
    };
  };

  //update the controls and the scene
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

