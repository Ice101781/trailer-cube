window.onload = function() {
/////////////////////////////////////////scene objects, etc.///////////////////////////////////////////////////////////////////////////////////////

//append the container to the document, then the renderer to the container
if( document.body != null ) { 
  append( $("container"), document.body );
};

if( $("container") != null ) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000);
  append( renderer.domElement, $("container") );
};


var light            = new pointLights(),
    spinBox          = new rhombicDodecahedron(.75),
    loading          = new loadBar(),
    cube             = new wireFrameCube(20, 0x000000),
    info             = new trailerInfo(),
    playbackControls = new videoPlaybackControls();

/////////////////////////////////////////user functions////////////////////////////////////////////////////////////////////////////////////////////

//listen for events
window.addEventListener('resize', onWindowResize);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mousedown', onMouseClick);
document.addEventListener('keydown', preventHotKey);
renderer.domElement.addEventListener('webkitfullscreenchange', onFullScreenChange);

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
  hoverRaycaster.vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  hoverRaycaster.vector.unproject(camera);
  hoverRaycaster.set( camera.position, hoverRaycaster.vector.sub(camera.position).normalize() );

  var intersects = hoverRaycaster.intersectObjects(scene.children, true);
  //console.log(intersects);

  //logic for trailer info visibility
  if(intersects[0] != undefined && playbackControls.object3D.parent != scene) {
    switch(clickCount) {
      case 0:
        if(intersects[0].object.parent == cube.mesh) {
          for(var key in trailers) {
            if(intersects[0].object == trailers[key].videoScreen && hoverKey !== undefined) {
              info.clearAll();//change to debug trailer info position(s)
              hoverKey = key;
              info.draw();
            };
          };
        } else {
            info.clearAll();
        };
        break;

      case 1:
        switch(intersects[0].object) {
          //clear trailer info and redraw when another video screen's been clicked
          default:
            info.clearAll();
            info.draw(clickKey);
            break;

          //trailer info highlighting
          case info.titleMesh:
            info.clearAll();
            info.textColors.one = deepSkyBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.one = t_cBlue;
            break;

          case info.directorMesh:
            info.clearAll();
            info.textColors.two = deepSkyBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.two = t_cBlue;
            break;

          case info.castMeshOne:
            info.clearAll();
            info.textColors.three = deepSkyBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.three = t_cBlue;
            break;

          case info.castMeshTwo:
            info.clearAll();
            info.textColors.four = deepSkyBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.four = t_cBlue;
            break;

          case info.castMeshThree:
            info.clearAll();
            info.textColors.five = deepSkyBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.five = t_cBlue;
            break;

          case info.castMeshFour:
            info.clearAll();
            info.textColors.six = deepSkyBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.six = t_cBlue;
            break;

          case info.castMeshFive:
            info.clearAll();
            info.textColors.seven = deepSkyBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.seven = t_cBlue;
            break;

          case info.cinematographyMeshOne:
            info.clearAll();
            info.textColors.eight = deepSkyBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.eight = t_cBlue;
            break;

          case info.cinematographyMeshTwo:
            info.clearAll();
            info.textColors.nine = deepSkyBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.nine = t_cBlue;
            break;

          case info.writingMeshOne:
            info.clearAll();
            info.textColors.ten = deepSkyBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.ten = t_cBlue;
            break;

          case info.writingMeshTwo:
            info.clearAll();
            info.textColors.eleven = deepSkyBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.eleven = t_cBlue;
            break;

          case info.writingMeshThree:
            info.clearAll();
            info.textColors.twelve = deepSkyBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.twelve = t_cBlue;
            break;

          case info.clearingMesh:
            info.clearAll();
            info.textColors.thirteen = deepSkyBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.thirteen = t_cBlue;
            break;
        };
        break;
    };
  } else if(intersects[0] != undefined && playbackControls.object3D.parent == scene) {
      //logic for playback controls visibility
      switch(intersects[0].object.parent) {
        default:
          playbackControls.object3D.visible = false;
          break;

        case playbackControls.object3D:
          playbackControls.object3D.visible = true;
          break;
      };
  } else {
      switch(clickCount) {
        //clear to prevent trailer info flashing on video exit; this also prevents "sticky" info when intersects[0] is empty
        case 0:
          info.clearAll();
          break;
      
        //clear trailer info and redraw if intersects[0] is empty; this prevents "sticky" highlighting
        case 1:
          info.clearAll();
          info.draw(clickKey);
          break;
      };
  };
};


function onMouseClick() {
  clickRaycaster.vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  clickRaycaster.vector.unproject(camera);
  clickRaycaster.set( camera.position, clickRaycaster.vector.sub(camera.position).normalize() );

  var intersects = clickRaycaster.intersectObjects(scene.children, true);
  //console.log(intersects);

  if(intersects[0] == undefined || intersects[0].object == cube.mesh) { return };

  if(spinBox.mesh.parent == scene && intersects[0].object == spinBox.mesh) {
    window.open(spinBox.link);
  };

  //logic for clicked objects if no video is playing
  if(spinBox.mesh.parent != scene && playbackControls.object3D.parent != scene) {
    if(intersects[0].object.parent == cube.mesh) {
      for(var key in trailers) {
        if(intersects[0].object == trailers[key].videoScreen) {
          //update the click count 
          if(key == clickKey) {
            clickCount++;
          } else {
            clickCount = 1;
          };

          //retrieve a global-scope key
          clickKey = key;
        };
      };
    } else if(intersects[0].object.parent = info.object3D) {
        switch(intersects[0].object) {
          case info.titleMesh:
            window.open(trailers[clickKey].title.link);
            break;

          case info.directorMesh:
            window.open(trailers[clickKey].director.link);
            break;

          case info.castMeshOne:
            window.open(trailers[clickKey].cast.one.link);
            break;

          case info.castMeshTwo:
            if(trailers[clickKey].cast.two.link != '') {
              window.open(trailers[clickKey].cast.two.link);
            };
            break;

          case info.castMeshThree:
            if(trailers[clickKey].cast.three.link != '') {
              window.open(trailers[clickKey].cast.three.link);
            };
            break;

          case info.castMeshFour:
            if(trailers[clickKey].cast.four.link != '') {
              window.open(trailers[clickKey].cast.four.link);
            };
            break;

          case info.castMeshFive:
            if(trailers[clickKey].cast.five.link != '') {
              window.open(trailers[clickKey].cast.five.link);
            };
            break;

          case info.cinematographyMeshOne:
            if(trailers[clickKey].cinematography.one.link != '') {
              window.open(trailers[clickKey].cinematography.one.link);
            };
            break;

          case info.cinematographyMeshTwo:
            if(trailers[clickKey].cinematography.two.link != '') {
              window.open(trailers[clickKey].cinematography.two.link);
            };
            break;

          case info.writingMeshOne:
            if(trailers[clickKey].writing.one.link != '') {
              window.open(trailers[clickKey].writing.one.link);
            };
            break;

          case info.writingMeshTwo:
            if(trailers[clickKey].writing.two.link != '') {
              window.open(trailers[clickKey].writing.two.link);
            };
            break;

          case info.writingMeshThree:
            if(trailers[clickKey].writing.three.link != '') {
              window.open(trailers[clickKey].writing.three.link);
            };
            break;

          case info.clearingMesh:
            info.clearAll();
            clickCount = 0;
            clickKey = null;
            break;
        };
    };

    if(clickCount == 2) {
      //darken the background for video playback
      renderer.setClearColor(0x000000);

      //remove the trailer info and position the camera in front of the video
      camera.remove(info.object3D);
      camera.position.copy(trailers[clickKey].videoScreen.position);
      camera.position.z += .1;

      //handle any trailer formatting
      if(trailers[clickKey].formatting.videoHeightError == true) {
          camera.position.y += .0115;
          for(var name in playbackControls.params) { 
            playbackControls[name].position.y += .0115; 
          };
      } else if(trailers[clickKey].formatting.aspectRatio == 'type2') {
          camera.position.z += .0075;
          for(var name in playbackControls.params) { 
            playbackControls[name].position.y -= .0045;
          };
      };

      //source the video, then load and play
      trailers[clickKey].video.src = "https://files9.s3-us-west-2.amazonaws.com/hd_trailers/"+clickKey+"/"+clickKey+".mp4";
      trailers[clickKey].loadVideo();

      //mute for development
      trailers[clickKey].video.muted = true;

      //position and add the playback controls
      playbackControls.object3D.position.copy(trailers[clickKey].videoScreen.position);
      scene.add(playbackControls.object3D);

      //swap for play button at video end
      trailers[clickKey].video.addEventListener('ended', function(event) { if(playbackControls.pauseButton.visible == true) {playbackControls.playButtonSwap()} });

      //reset the click count
      clickCount = 0;
    };
  };

  //logic for clicked objects if video is playing
  if(playbackControls.object3D.parent == scene) {
    switch(intersects[0].object) {
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
        trailers[clickKey].unloadVideo();

        //reverse any trailer formatting
        if(trailers[clickKey].formatting.videoHeightError == true) {
            camera.position.y -= .0115;
            for(var name in playbackControls.params) { 
              playbackControls[name].position.y -= .0115;
            };        
        } else if(trailers[clickKey].formatting.aspectRatio == 'type2') {
            camera.position.z -= .0075;
            for(var name in playbackControls.params) { 
              playbackControls[name].position.y += .0045
            };
        };

        if(playbackControls.playButton.visible == true) { playbackControls.pauseButtonSwap() };
        playbackControls.object3D.visible = false;
        scene.remove(playbackControls.object3D);

        //lighten the background for app navigation
        renderer.setClearColor(0x111111);
        
        camera.position.set(0, 0, 2);
        camera.add(info.object3D);

        if(document.webkitIsFullScreen) { document.webkitExitFullscreen() };

        //assign hoverKey to be undefined so that trailer info won't flash on exit 
        hoverKey = undefined;
        clickKey = null;
        break;
    };
  };
};


//prevent the F11 key from allowing the user to enter fullscreen mode
function preventHotKey(event) {
  if(event.keyCode == 122) {
    event.preventDefault();
    //event.stopPropagation();
  };
};


//handle any fullscreen trailer formatting
function onFullScreenChange() {
  if (!window.screenTop && !window.screenY) {
      if(clickKey != null && trailers[clickKey].formatting.aspectRatio == 'type2') { 
        camera.position.z += .0075;
      };     
  } else {
      if(trailers[clickKey].formatting.aspectRatio == 'type2') { 
        camera.position.z -= .0075;
      };      
  };
};


function imagesLoaded() {
  //remove the loading screen
  scene.remove(spinBox.mesh, loading.mesh);

  //set background color to gray
  renderer.setClearColor(0x111111);

  //add trailer info to the camera
  camera.add(info.object3D);

  //toggle object visibility
  cube.mesh.visible = true;
  info.object3D.visible = true;

  //reset value of loaded images
  loadedImages = 0;
};


function init() {
  //set camera position at load
  camera.position.set( 60*Math.sin(0)*Math.cos(0), 60*Math.sin(0)*Math.sin(0), 60*Math.cos(0) );

  //add objects to the scene
  scene.add(camera, light.object3D, spinBox.mesh, loading.mesh, cube.mesh);

  //allow CORS for images
  THREE.ImageUtils.crossOrigin = 'anonymous';
  
  //set trailer locations, position the video screens and add them to the cube, then load the image stills
  for(var key in trailers) {
    trailers[key].location = screenLocations[Object.keys(trailers).indexOf(key)];
    trailers[key].videoScreen.position.copy(trailers[key].location);
    trailers[key].videoScreen.position.z += .001;
    trailers[key].imageStill = THREE.ImageUtils.loadTexture( 'public_assets/'+key+'.jpg', undefined, function(){loadedImages++} );
    trailers[key].videoScreen.material.map = trailers[key].imageStill;

    cube.mesh.add(trailers[key].videoScreen);
  };
};

function animate() {
  //check for highlighted objects; order onMouseHover() and //controls this way to prevent trailer info "flicker"
  onMouseHover();

  //controls
  if(loading.mesh.parent != scene && clickCount != 1 && playbackControls.object3D.parent != scene) {

    //PARABOLIC CONTROLS IN THE X-Z PLANE
    //camera.position.x = mouse.x;
    //camera.position.z = Math.pow(mouse.x, 2)+1;

    //MORE OLD CONTROLS
    //camera.position.x = mouse.x/2;
    //camera.position.z = Math.abs(mouse.y)+1;

    //EXPONENTIAL CONTROLS
    camera.position.x = mouse.x/4;
    camera.position.y = mouse.y/2.5;
    camera.position.z = Math.pow(2, -3*Math.abs(mouse.y))+.75;
  };
  
  //remain at the loading screen until all images have loaded, then go to the home page
  if(loadedImages != 0) {
    switch(loadedImages) {
      default:
        spinBox.animation();
        loading.progress();
        break;

      case Object.keys(trailers).length:
        imagesLoaded();
        break;
    };
  };

  //update a video if it's playing, and verify the correct fullscreen button is visible
  if(clickKey != null && trailers[clickKey].video.readyState == 4) {
    trailers[clickKey].updateVideo();
    playbackControls.trailerTimeUpdate();
  };

  if(playbackControls.object3D.parent == scene) {
    playbackControls.fullscreenButtonCheck();
  };

  //render the scene
  renderer.render(scene, camera);  
  //update the scene
  requestAnimationFrame(animate);

  //console.log(variable name(s) here);
};

init();
animate();

//console.log(variable name(s) here);
};

