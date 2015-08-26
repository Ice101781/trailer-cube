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

//global vars, etc.////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var spinBox,
    loading,
    cube,
    info,
    playbackControls;
    
//append the container to the document, then the renderer to the container
if( document.body != null ) { append( $("container"), document.body ) };

if( $("container") != null ) {
  renderer.setSize(innerWidth, innerHeight); 
  renderer.setClearColor(0x000000);
  append( renderer.domElement, $("container") );
};


//user functions///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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



















function raySelect() {  
  var rayVector = new THREE.Vector3(cursor.x, cursor.y, 0.5);
    
    rayVector.unproject(camera);
    
  raycaster.set(camera.position, rayVector.sub(camera.position).normalize());
  
  intersects = raycaster.intersectObjects(scene.children, true);
  //console.log(intersects);
  };

  function onCursorHover() {
    //logic for trailer info and video controls
    if(intersects[0] != undefined && playbackControls.object3D.parent != scene) {
      for(i=0; i<video_screens.length; i++) {
        if(intersects[0].object == video_screens[i]) {
          trailer_title.clear('red');
          trailer_plot.clear('red');
          trailer_title.drawText(titles[i], 10, 90, 'white', '100px Corbel');
          trailer_plot.drawText(plots[i][0], 10, 40, 'white', '35px Corbel') //method chain
                      .drawText(plots[i][1], 10, 80, 'white', '35px Corbel')
                      .drawText(plots[i][2], 10, 120, 'white', '35px Corbel')
                      .drawText(plots[i][3], 10, 160, 'white', '35px Corbel')
                      .drawText(plots[i][4], 10, 200, 'white', '35px Corbel')
                      .drawText(plots[i][5], 10, 240, 'white', '35px Corbel');
        };
      };
    }
    else {
      trailer_title.clear('red');
      trailer_plot.clear('red');
    };

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


  var click = false,
      
      video_screen_geometry   = new THREE.PlaneBufferGeometry(.16000, .09000, 1, 1),
      
      //trailer_title_geometry  = new THREE.PlaneBufferGeometry(.02880, .00280, 1, 1),
      //trailer_plot_geometry   = new THREE.PlaneBufferGeometry(.05750, .01150, 1, 1),
      
      //trailer_title           = new THREEx.DynamicTexture(1280, 128),
      //trailer_plot            = new THREEx.DynamicTexture(1280, 256), 
      
      //trailer_title_material  = new THREE.MeshBasicMaterial({map: trailer_title.texture, transparent: true}),
      //trailer_plot_material   = new THREE.MeshBasicMaterial({map: trailer_plot.texture, transparent: true}),
        
      //trailer_title_mesh = new THREE.Mesh(trailer_title_geometry, trailer_title_material),
      //trailer_plot_mesh  = new THREE.Mesh(trailer_plot_geometry, trailer_plot_material);
  

  //LOAD AND TRAILER INFO STUFF - MOVE // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
  //trailer_title_mesh.position.set(camera.position.x-.04485, camera.position.y-.02625, camera.position.z-.075);
  //trailer_plot_mesh.position.set(camera.position.x-.03050, camera.position.y-.03375, camera.position.z-.075);
  //trailer_title.clear('red');
  //trailer_plot.clear('red');
  //camera.add(trailer_title_mesh, trailer_plot_mesh);
  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //


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
    var noClickEffect = [ undefined,
                          spinBox.mesh,
                          loading.mesh,
                          cube.mesh,
                          videoControlsBackground, 
                          timelineBackground, 
                          bufferProgress,
                          timelineProgress, 
                          trailerTimeProgress, 
                          trailerTimeLength ];
                            
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


function init() {
  controls.minDistance = 30;
  controls.maxDistance = 90;
  camera.position.copy(camLoad);
  controls.enabled = false;

  //light sources
  var light = new pointLights();

  //load screen animation
  spinBox = new rhombicDodecahedron();

  //load bar to monitor image load progress
  loading = new loadBar();

  //the cube
  cube = new wireFrameCube(10);

  //trailer info
  info = new trailerInfo();

  //video controls
  playbackControls = new videoPlaybackControls();
  
  //add objects to the scene; add camera so that children of the camera (trailer info) will be rendered
  scene.add(camera, light.one, light.two, light.three, spinBox.mesh, loading.mesh, cube.mesh, info.object3D);

  



  //allow CORS, load the image stills
  THREE.ImageUtils.crossOrigin = '';

  for(i=0; i<media_sources.length; i++) {
    video_screen_materials[i].map = THREE.ImageUtils.loadTexture(media_sources[i][0], undefined, function() { loaded_images++ } );
  };
};


function render() {
  //get the number of seconds passed since the last render
  var delta = clock.getDelta();
  
  //loading screen animation and image load progress
  if(spinBox.mesh.parent == scene) { spinBox.animation() };
  if(loading.mesh.parent == scene) { loading.progress() };

  //check for selected objects

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
