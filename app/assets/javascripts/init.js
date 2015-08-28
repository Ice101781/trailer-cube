/*KNOWN BUGS:
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
         spinBox = new rhombicDodecahedron(),
         loading = new loadBar(),
            cube = new wireFrameCube(10),
            info = new trailerInfo(),
playbackControls = new videoPlaybackControls(),

   noClickEffect = [ undefined,
                     spinBox.mesh,
                     loading.mesh,
                     cube.mesh,
                     info.object3D,
                     videoControlsBackground,
                     timelineBackground,
                     bufferProgress,
                     timelineProgress,
                     trailerTimeProgress,
                     trailerTimeLength ];


//append the container to the document, then the renderer to the container
  
  if( document.body != null ) { 
    append( $("container"), document.body );
  };

  if( $("container") != null ) {
    renderer.setSize(innerWidth, innerHeight); 
    renderer.setClearColor(0x000000);
    append( renderer.domElement, $("container") );
  };


/////////////////////////////////////////user functions////////////////////////////////////////////////////////////////////////////////////////////

//listen for events
window.addEventListener('resize',    onWindowResize);
window.addEventListener('mousemove', onMouseMove   );
//window.addEventListener('mousedown',               );


function onWindowResize() {
  innerWidth = window.innerWidth;
  innerHeight = window.innerHeight;
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = (16/9);
};


function onMouseMove(event) {
  event.preventDefault(); 
  mouse.x = (event.clientX/innerWidth)*2-1; 
  mouse.y = -(event.clientY/innerHeight)*2+1;
};


function init() {
  controls.minDistance = 30;
  controls.maxDistance = 90;
  camera.position.copy(camLoad);
  controls.enabled = false;
  
  //add objects to the scene;
  scene.add(camera, light.object3D, spinBox.mesh, loading.mesh, cube.mesh);


  //allow CORS, load the image stills
  THREE.ImageUtils.crossOrigin = '';

  for(i=0; i<media_sources.length; i++) {
    video_screen_materials[i].map = THREE.ImageUtils.loadTexture( media_sources[i][0], undefined, function() { loaded_images++ } );
  };
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
    info.dynamicTextures.titleMesh.clear('red');
    info.dynamicTextures.plotMesh.clear('red');
  };


  //logic for video controls visibility
  if(intersects[0] != undefined && videos[a].readyState > 0) {
      
    if(intersects[0].object.parent == playbackControls.object3D) {
      playbackControls.object3D.visible = true;
      return; 
    }
    else {
      playbackControls.object3D.visible = false;
    };
  };
};



















function raySelect() {  
  var rayVector = new THREE.Vector3(cursor.x, cursor.y, 0.5);
    
    rayVector.unproject(camera);
    
  raycaster.set(camera.position, rayVector.sub(camera.position).normalize());
  
  intersects = raycaster.intersectObjects(scene.children, true);
  //console.log(intersects);
  };


  var click = false,
      
  video_screen_geometry   = new THREE.PlaneBufferGeometry(.16000, .09000, 1, 1);

  var video_images = [], video_image_contexts = [], video_textures = [], 
      video_screen_materials = [], video_screens = [], video_cube = new THREE.Object3D();

  video_cube.visible = false;
  scene.add(video_cube);

  for(i=0; i<titles.length; i++) {
    videos[i] = create("video");
    video_images[i] = create("canvas");
    video_image_contexts[i] = video_images[i].getContext('2d');
    video_textures[i] = new THREE.Texture(video_images[i]);
    video_screen_materials[i] = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("/public_assets/t_c.png"), overdraw: true});
    video_screens[i] = new THREE.Mesh(video_screen_geometry, video_screen_materials[i]);
    video_screens[i].position.set(locations[i][0], locations[i][1], locations[i][2]);
    video_cube.add(video_screens[i]);
  };


  function onLeftClick() {
                            
    for(i=0; i<noClickEffect.length; i++) { if(intersects[0].object == noClickEffect[i]) { return } };
      
    if(intersects[0].object == restartButton) {
      videos[a].pause();
      videos[a].currentTime = 0;
      if(playButton.visible == true) { 
        playbackControls.object3D.remove(playButton); 
        playbackControls.object3D.add(pauseButton);
      };
      videos[a].play();
      return;
    }
    else if(intersects[0].object == rewindButton) {
      videos[a].pause();
      videos[a].currentTime -= 5;
      if(playButton.visible == true) { 
        playbackControls.object3D.remove(playButton); 
        playbackControls.object3D.add(pauseButton);
      };
      videos[a].play();
      return;
    }
    else if(intersects[0].object == playButton) {
      videos[a].play();
      playbackControls.object3D.remove(playButton); 
      playbackControls.object3D.add(pauseButton);
      return;
    }
    else if(intersects[0].object == pauseButton) {
      videos[a].pause();
      playbackControls.object3D.remove(pauseButton); 
      playbackControls.object3D.add(playButton);
      return;
    }
    else if(intersects[0].object == fastForwardButton) {
      videos[a].pause();
      videos[a].currentTime += 5;
      if(playButton.visible == true) {
        playbackControls.object3D.remove(playButton); 
        playbackControls.object3D.add(pauseButton);
      };
      videos[a].play();
      return;
    }
    else if(intersects[0].object == enterFullscreenButton) {
      container.webkitRequestFullscreen();
      return;
    }
    else if(intersects[0].object == exitFullscreenButton) {
      document.webkitExitFullscreen();
      return;
    }
    else if(intersects[0].object == exitButton) {
      if(playButton.visible == true) {
        playbackControls.object3D.remove(playButton);
        playbackControls.object3D.add(pauseButton);
      };
      scene.remove(playbackControls.object3D);
      videos[a].pause();        
      videos[a].currentTime = 0;
      video_screen_materials[a].map = image_stills[a];
      //remove this code once the cube has been tiled // // // // // // // // // // // // // // // // // // // // // // // //
      cube.mesh.visible = true;
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
      camera.position.set(locations[a][0], locations[a][1]+.25, locations[a][2]+controls.minDistance+.5);
      controls.target = new THREE.Vector3();
      controls.minDistance = 1;
      controls.enabled = true;
      return;
    };
    
    //determine which screen has been selected
    for(a=0; a<video_screens.length; a++) {
      if(intersects[0].object == video_screens[a]) {
        click = true; 
        return a;
      };
    };
  };


  function clicked() {
    if(playbackControls.object3D.parent != scene) {
      //adjust minimum camera distance to target and toggle controls
        controls.minDistance = .1;
        controls.enabled = false;
        //remove this code once the cube has been tiled // // // // // // // // // // // // // // // // // // // // // // //  
        cube.mesh.visible = false;
        // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
  
      //position the camera in front of the video screen that's been clicked, and target it
        camera.position.set(locations[a][0], locations[a][1], locations[a][2]+(controls.minDistance));
        controls.target = video_screens[a].position;

      //allow CORS, prepare and play the video
        videos[a].crossOrigin = 'anonymous';
        video_images[a].width  = 1280;
        video_images[a].height = 720;  
        video_image_contexts[a].fillStyle = '0#000000';
        video_image_contexts[a].fillRect(0, 0, video_images[a].width, video_images[a].height);
        video_screen_materials[a].map = video_textures[a];
        videos[a].src = media_sources[a][1];
        videos[a].load();
        videos[a].play();
        
        scene.add(playbackControls.object3D);

      //listen for the end of the video
        videos[a].addEventListener('ended',           
          function(event) {
            playbackControls.object3D.remove(pauseButton);
            playbackControls.object3D.add(playButton); 
          }
        );
    };
    
    //reset boolean value of 'click' variable
      click = false;
  };


  function images_loaded() {
    //remove the loading screen and go to home camera position
      scene.remove(spinBox.mesh, loading.mesh);
      controls.minDistance = 1;
      controls.maxDistance = 3;
      camera.position.copy(camHome);
      camera.add(info.object3D);
      controls.enabled = true;
      
    //toggle object visibility
      if($("rhombic-info") != null) {$("rhombic-info").remove()};
      //comment-out the following code when cube is fully tiled // // // // // // // // // // // // // // // // // // // //
      cube.mesh.visible = true;
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
      video_cube.visible = true;

    //reset count of loaded images
      loaded_images = 0;
  };


  function video_update() {
    if(videos[a].readyState === videos[a].HAVE_ENOUGH_DATA) {
      video_image_contexts[a].drawImage(videos[a], 0, 0)
    };
    
    if(videos[a].readyState > 0) {
      playbackControls.trailerTimeUpdate();
    };

    video_textures[a].needsUpdate = true;
  };





function render() {
  //get the number of seconds passed since the last render
  var delta = clock.getDelta();
  
  //loading screen animation and image load progress
  if(spinBox.mesh.parent == scene) { spinBox.animation() };
  if(loading.mesh.parent == scene) { loading.progress() };

  //check for selected objects
  onMouseHover();

  //if(click == true) { clicked() };

  //correct fullscreen button during playback?
  if(playbackControls.object3D.parent == scene) { playbackControls.fullscreenButtonCheck() };
  



  //view homepage if all images have been loaded
    if(loaded_images == media_sources.length) { images_loaded() };

  //update the video
    if(videos[a] != undefined) {
      video_update();
    };
    

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
