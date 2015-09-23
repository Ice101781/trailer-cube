/////////////////////////////////////////bugs//////////////////////////////////////////////////////////////////////////////////////////////////////
/*
  1) trailer_cube is optimized for the Google Chrome(c) browser, so some functionality/features may be lost when
     using other browsers.

  ***FIXED 07/18/15 @ 1:00am*****************************************************************************
  2) when playing the first video of a given user session, the pause button will need to be pressed twice 
     in order to function correctly, unless another playback button is initially pressed.
  *******************************************************************************************************

  3) sometimes when exiting a video the camera will position itself above the cube, shooting downward.
     this behavior seems to occur randomly.

  4) sometimes when playing a video the following console error will appear: "Uncaught IndexSizeError: Failed to execute
     'end' on 'TimeRanges': The index provided (0) is greater than or equal to the maximum bound (0)". the error doesn't
     seem to affect playback much.
*/

window.onload = function() {

/////////////////////////////////////////scene objects, global vars, etc.//////////////////////////////////////////////////////////////////////////

       var light = new pointLights(),
         spinBox = new rhombicDodecahedron(.75),
         loading = new loadBar(),
            cube = new wireFrameCube(10),
            info = new trailerInfo(),
playbackControls = new videoPlaybackControls(),

   noClickEffect = [ spinBox.mesh,
                     loading.mesh,
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

    for(i=0; i<video_screens.length; i++) {

      if(intersects[0].object == video_screens[i]) {
        info.dynamicTextures.titleMesh.clear();
        info.dynamicTextures.plotMesh.clear();
      
        info.dynamicTextures.titleMesh.drawText(titles[i], 10, 90, 'white', '100px Corbel');
      
        info.dynamicTextures.plotMesh.drawText(plots[i][0], 10,  40, 'white', '35px Corbel') //chain
                                     .drawText(plots[i][1], 10,  80, 'white', '35px Corbel')
                                     .drawText(plots[i][2], 10, 120, 'white', '35px Corbel')
                                     .drawText(plots[i][3], 10, 160, 'white', '35px Corbel')
                                     .drawText(plots[i][4], 10, 200, 'white', '35px Corbel')
                                     .drawText(plots[i][5], 10, 240, 'white', '35px Corbel');
      };
    };
  }
  //for debugging trailer info
  else {
    info.dynamicTextures.titleMesh.clear();
    info.dynamicTextures.plotMesh.clear();
  };

  //logic for video controls visibility
  if(intersects[0] != undefined && playbackControls.object3D.parent == scene) {
      
    if(intersects[0].object.parent == playbackControls.object3D) {
      playbackControls.object3D.visible = true;
      return; 
    }
    else {
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

  for(i=0; i<noClickEffect.length; i++) { if(intersects[0].object == noClickEffect[i]) { return } };
      
  //logic for video playback controls
  if(intersects[0].object == playbackControls.restartButton) {
    collection[preview].video.currentTime = 0;
    collection[preview].video.play();
    if(playbackControls.playButton.visible == true) { playbackControls.pauseButtonSwap() };
    return;
  }
  else if(intersects[0].object == playbackControls.rewindButton) {
    collection[preview].video.currentTime -= 5;
    return;
  }
  else if(intersects[0].object == playbackControls.playButton) {
    collection[preview].video.play();
    playbackControls.pauseButtonSwap();
    return;
  }
  else if(intersects[0].object == playbackControls.pauseButton) {
    collection[preview].video.pause();
    playbackControls.playButtonSwap();
    return;
  }
  else if(intersects[0].object == playbackControls.fastForwardButton) {
    collection[preview].video.currentTime += 5;
    if(collection[preview].video.currentTime == collection[preview].video.duration) { return };
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
    scene.remove(playbackControls.object3D);
    collection[preview].video.pause();
    collection[preview].video.currentTime = 0;
    collection[preview].videoScreen.material.map = collection[preview].imageStill;
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    camera.position.set(locations[a][0], locations[a][1]+.25, locations[a][2]+controls.minDistance+.5);
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    controls.target = new THREE.Vector3();
    controls.minDistance = 1;
    controls.enabled = true;
    return;
  };

  //determine which screen has been selected
  //for(a=0; a<video_screens.length; a++) {
    //if(intersects[0].object == video_screens[a]) {
      //click = true; 
      //return a;
    //};
  //};

  for(var preview in collection) {
    if(intersects[0].object == preview.videoScreen) {
      click = true;
      return preview; 
    };
  };
};


function clicked() {
  if(playbackControls.object3D.parent != scene) {
    //adjust minimum camera distance to target and toggle controls
    controls.minDistance = .1;
    controls.enabled = false;
  
    //position the camera in front of the video screen that's been clicked, and target it
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    camera.position.set( locations[a][0], locations[a][1], locations[a][2]+(controls.minDistance) );
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    controls.target = collection[preview].videoScreen.position;

    //allow CORS, prepare and play the video
      //videos[a].crossOrigin = '';  
      //video_image_contexts[a].fillStyle = '0#000000';
      //video_images[a].width = 1280;
      //video_images[a].height = 720;
      //video_image_contexts[a].fillRect(0, 0, video_images[a].width, video_images[a].height);
      //videos[a].src = media_sources[a][1];

    collection[preview].videoScreen.material.map = collection[preview].texture;
    collection[preview].video.load();
    collection[preview].video.play();

    playbackControls.object3D.position.copy(collection[preview].videoScreen.position);
    scene.add(playbackControls.object3D);

    //swap for play button at video end
    collection[preview].video.addEventListener('ended', function(event) {  if(playbackControls.pauseButton.visible == true) { playbackControls.playButtonSwap() }  } );
  };
    
  //reset boolean value of 'click' variable
  click = false;
};


function images_loaded() {
  //remove the loading screen
  scene.remove(spinBox.mesh, loading.mesh);
  if( $("rhombic-info") != null ) { $("rhombic-info").remove() };

  controls.minDistance = 1;
  controls.maxDistance = 3;
  camera.position.copy(camHome);
  camera.add(info.object3D);
  controls.enabled = true;

  //toggle object visibility
  cube.mesh.visible = true;
  //video_cube.visible = true;

  //reset count of loaded images
  loaded_images = 0;
};





  //video_screen_geometry   = new THREE.PlaneBufferGeometry(.16, .09, 1, 1);

  //var //video_images = [], 
      //video_image_contexts = [], 
      //video_textures = [], 
      //video_screen_materials = [], 
      //video_screens = [], 
      //video_cube = new THREE.Object3D();

  //video_cube.visible = false;
  //scene.add(video_cube);

  for(i=0; i<titles.length; i++) {
    //videos[i] = create("video");
    //video_images[i] = create("canvas");
    //video_image_contexts[i] = video_images[i].getContext('2d');
    //video_textures[i] = new THREE.Texture(video_images[i]);
    //video_screen_materials[i] = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("/public_assets/t_c.png"), overdraw: true});
    //video_screens[i] = new THREE.Mesh(video_screen_geometry, video_screen_materials[i]);
    video_screens[i].position.set(locations[i][0], locations[i][1], locations[i][2]);
    scene.add(video_screens[i]);
    //video_cube.add(video_screens[i]);
  };


  //function video_update() {
    //if(videos[a].readyState === videos[a].HAVE_ENOUGH_DATA) {
      //video_image_contexts[a].drawImage(videos[a], 0, 0)
    //};
    
    //video_textures[a].needsUpdate = true;
  //};
  








function init() {
  controls.minDistance = 30;
  controls.maxDistance = 90;
  camera.position.copy(camLoad);
  controls.enabled = false;
  
  //add objects to the scene;
  scene.add(camera, light.object3D, spinBox.mesh, loading.mesh, cube.mesh);

  //allow CORS, load the image stills
  //image_stills = [];

  //for(i=0; i<media_sources.length; i++) {
    //image_stills[i] = THREE.ImageUtils.loadTexture( media_sources[i][0], undefined, function() { loaded_images++ } );
    //video_screen_materials[i].map = image_stills[i];
  //};

  THREE.ImageUtils.crossOrigin = 'anonymous';
  
  for(var prevue in collection) {
    prevue.imageStill = THREE.ImageUtils.loadTexture( prevue.filesource + ".jpg", undefined, function() { loaded_images++ } );
    prevue.videoScreen.material.map = prevue.imageStill;    
  };
};


function render() {
  //get the number of seconds passed since the last render
  var delta = clock.getDelta();
  
  //loading screen animation and image load progress
  if(spinBox.mesh.parent == scene) { spinBox.animation() };
  if(loading.mesh.parent == scene) { loading.progress() };

  //view homepage if all images have been loaded
  if(loaded_images == Object.keys(collection).length) { images_loaded() };

  //check for highlighted objects
  onMouseHover();

  //play video if screen click detected
  if(click == true) { clicked() };

  //update the video if it's playing
  if(preview != undefined) { 
    collection[preview].videoUpdate();
    
    if(collection[preview].video.readyState > 0) { 
      playbackControls.trailerTimeUpdate() 
    };
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
