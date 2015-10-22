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
        if(intersects[0].object == cube.mesh) {
          info.clearAll();
        };

        for(var key in trailers) {
          if(intersects[0].object == trailers[key].videoScreen && hoverKey !== undefined) {
            info.clearAll();
            hoverKey = key;
            info.draw();
          };
        };
        break;

      case 1:
        switch(intersects[0].object) {
          default:
            info.clearAll();
            info.draw(clickKey);
            break;

          case info.titleMesh:
            info.clearAll();
            info.textColors.one = t_cBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.one = deepSkyBlue;
            break;

          case info.directorMesh:
            info.clearAll();
            info.textColors.two = t_cBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.two = deepSkyBlue;
            break;

          case info.castMeshOne:
            info.clearAll();
            info.textColors.three = t_cBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.three = deepSkyBlue;
            break;

          case info.castMeshTwo:
            info.clearAll();
            info.textColors.four = t_cBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.four = deepSkyBlue;
            break;

          case info.castMeshThree:
            info.clearAll();
            info.textColors.five = t_cBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.five = deepSkyBlue;
            break;

          case info.castMeshFour:
            info.clearAll();
            info.textColors.six = t_cBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.six = deepSkyBlue;
            break;

          case info.castMeshFive:
            info.clearAll();
            info.textColors.seven = t_cBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.seven = deepSkyBlue;
            break;

          case info.cinematographyMeshOne:
            info.clearAll();
            info.textColors.eight = t_cBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.eight = deepSkyBlue;
            break;

          case info.cinematographyMeshTwo:
            info.clearAll();
            info.textColors.nine = t_cBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.nine = deepSkyBlue;
            break;

          case info.writingMeshOne:
            info.clearAll();
            info.textColors.ten = t_cBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.ten = deepSkyBlue;
            break;

          case info.writingMeshTwo:
            info.clearAll();
            info.textColors.eleven = t_cBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.eleven = deepSkyBlue;
            break;

          case info.writingMeshThree:
            info.clearAll();
            info.textColors.twelve = t_cBlue;
            info.draw(clickKey, info.textColors);
            info.textColors.twelve = deepSkyBlue;
            break;

          case info.clearingMesh:
            info.clearAll();
            clickCount = 0;
            clickKey = null;
            break;
        };
        break;
    };
  } else {
    switch(clickCount) {
      default:
        info.clearAll();
        info.draw(clickKey);
        break;

      case 0:
        info.clearAll();
     
        //logic for playback controls visibility
        if(intersects[0] != undefined && playbackControls.object3D.parent == scene) {
          switch(intersects[0].object.parent) {
            default:
              playbackControls.object3D.visible = false;
              break;

            case playbackControls.object3D:
              playbackControls.object3D.visible = true;
              break;
          };
        };
        break;
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

  if(intersects[0] == undefined) { 
    return;
  };

  //logic for clicked objects if no video is playing
  if(playbackControls.object3D.parent != scene) {
    switch(intersects[0].object) {
      case spinBox.mesh:
        window.open(spinBox.link);
        break;

      case info.titleMesh:
        window.open(trailers[clickKey].identifiers.title.link);
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
    };

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

        if(clickCount == 2) {
          //remove the trailer info and position the camera in front of the screen
          camera.remove(info.object3D);
          camera.position.copy(trailers[key].videoScreen.position);
          camera.position.z += .1;

          //remove the image still and replace it with the video texture, then load and play the video
          trailers[key].videoScreen.material.map = trailers[key].texture;
          trailers[key].video.load();
          trailers[key].video.play();

          //mute for debugging
          trailers[key].video.muted = true;

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
      default:
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
        if(playbackControls.playButton.visible == true) {
          playbackControls.pauseButtonSwap();
        };
        playbackControls.object3D.visible = false;
        scene.remove(playbackControls.object3D);
        trailers[clickKey].video.pause();
        trailers[clickKey].video.currentTime = 0;
        trailers[clickKey].context.clearRect(0, 0, trailers[clickKey].canvas.width, trailers[clickKey].canvas.height);
        trailers[clickKey].videoScreen.material.map = trailers[clickKey].imageStill;
        camera.position.z += .35;
        camera.add(info.object3D);
        //assign hoverKey to be undefined so that trailer info won't flash on exit 
        hoverKey = undefined;
        clickKey = null;
        break;
    };
  };
};


function init() {
  //move camera to loading screen position
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

  //move camera to home position and add to it the trailer info
  camera.position.copy(camHome);
  camera.add(info.object3D);

  //toggle object visibility
  cube.mesh.visible = true;
  info.object3D.visible = true;

  //reset value of loaded images
  loadedImages = 0;
};


function render() {
  //remain at the loading screen until all images have loaded, then go to the home page
  if(loading != undefined && loading.mesh.parent == scene) { 
    spinBox.animation();
    loading.progress();
  };
  if(loadedImages == Object.keys(trailers).length) {
    imagesLoaded();
  };

  //controls
  if(loading != undefined && loading.mesh.parent != scene && clickCount != 1//continue
       && playbackControls != undefined && playbackControls.object3D.parent != scene) {

    camera.position.x += ( mouse.x - 3*camera.position.x) * .003;
    camera.position.y += ( mouse.y - 2.25*camera.position.y) * .003;
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

  //update the scene
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

