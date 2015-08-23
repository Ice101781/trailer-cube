/*KNOWN BUGS:
  1) this web app is optimized for the Google Chrome(c) browser, so some functionality/features may be lost when
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

//some global vars
var clock       = new THREE.Clock(), 
    innerWidth  = window.innerWidth, 
    innerHeight = window.innerHeight,
    fov         = 48.5,
    aspect      = 16/9,
    near        = 0.01,
    far         = 100,
    mouse       = {x: 0, y:0},
    camHome    = new THREE.Vector3(  2*Math.sin(0)*Math.cos(0),  2*Math.sin(0)*Math.sin(0),  2*Math.cos(0) ),
    camLoad    = new THREE.Vector3( 60*Math.sin(0)*Math.cos(0), 60*Math.sin(0)*Math.sin(0), 60*Math.cos(0) ),
    spinBox,
    load,
    cube;
  
var scene    = new THREE.Scene(), 
    camera   = new THREE.PerspectiveCamera(fov, aspect, near, far),
    renderer = new THREE.WebGLRenderer({antialias: false, alpha: false}),
    controls = new THREE.OrbitControls( camera, $("container") );

//add the camera to the scene to enable rendering of any children of the camera
scene.add(camera);

//append the container to the document, then the renderer to the container
if(document.body != null) { 
  append( $("container"), document.body );
};

if($("container") != null) {
  renderer.setSize(innerWidth, innerHeight); 
  renderer.setClearColor(0x000000);
  append( renderer.domElement, $("container") );
};



  var dimensions = [[1280, 720], [1280, 128], [1280, 256]],
      click = false,
      a=0,

      
      video_screen_geometry         = new THREE.PlaneBufferGeometry(.16000, .09000, 1, 1),
      
      trailer_title_geometry        = new THREE.PlaneBufferGeometry(.02880, .00280, 1, 1),
      trailer_plot_geometry         = new THREE.PlaneBufferGeometry(.05750, .01150, 1, 1),
      
      //video_controls_bkgnd_geometry = new THREE.PlaneBufferGeometry(.15750, .00500, 1, 1),
    button_geometry               = new THREE.PlaneBufferGeometry(.00720, .00405, 1, 1),
      //timeline_bkgnd_geometry       = new THREE.PlaneBufferGeometry(.09200, .00050, 1, 1),
      //video_progress_geometry       = new THREE.PlaneBufferGeometry(.00010, .00050, 1, 1),
      
      trailer_title                 = new THREEx.DynamicTexture(dimensions[1][0], dimensions[1][1]),
      trailer_plot                  = new THREEx.DynamicTexture(dimensions[2][0], dimensions[2][1]),
      trailer_time_length           = new THREEx.DynamicTexture(dimensions[0][0], dimensions[0][1]),
      trailer_time_progress         = new THREEx.DynamicTexture(dimensions[0][0], dimensions[0][1]),
 
      
      trailer_title_material           = new THREE.MeshBasicMaterial({map: trailer_title.texture, transparent: true}),
      trailer_plot_material            = new THREE.MeshBasicMaterial({map: trailer_plot.texture, transparent: true}),
      
      //video_controls_bkgnd_material    = new THREE.MeshBasicMaterial({color: 0x000000}),
      //restart_button_material          = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('public_assets/restart_button.png')}),
      //rewind_button_material           = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('public_assets/rewind_button.png')}),
      //play_button_material             = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('public_assets/play_button.png')}),
      //pause_button_material            = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('public_assets/pause_button.png')}),
      fastforward_button_material      = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('public_assets/fastforward_button.png')}),
      enter_fullscreen_button_material = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('public_assets/enter_fullscreen_button.png')}),
      exit_fullscreen_button_material  = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('public_assets/exit_fullscreen_button.png')}),
      exit_button_material             = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('public_assets/exit_button.png')}),
      //timeline_bkgnd_material          = new THREE.MeshBasicMaterial({color: 0x261958}),
      //timeline_progress_material       = new THREE.MeshBasicMaterial({color: 0x4B32AF}),
      //buffer_progress_material         = new THREE.MeshBasicMaterial({color: 0x9999CC}),
      trailer_time_length_material     = new THREE.MeshBasicMaterial({map: trailer_time_length.texture, color: 0x4B32AF}),
      trailer_time_progress_material   = new THREE.MeshBasicMaterial({map: trailer_time_progress.texture, color: 0x4B32AF}),
   
      
      trailer_title_mesh = new THREE.Mesh(trailer_title_geometry, trailer_title_material),
      trailer_plot_mesh  = new THREE.Mesh(trailer_plot_geometry, trailer_plot_material),

    video_controls = new THREE.Object3D(),
      video_controls_meshes = [ //restart_button             = new THREE.Mesh(button_geometry, restart_button_material),
                                //rewind_button              = new THREE.Mesh(button_geometry, rewind_button_material),
                                //play_button                = new THREE.Mesh(button_geometry, play_button_material),
                                //pause_button               = new THREE.Mesh(button_geometry, pause_button_material),
                                fastforward_button         = new THREE.Mesh(button_geometry, fastforward_button_material),
                                enter_fullscreen_button    = new THREE.Mesh(button_geometry, enter_fullscreen_button_material),
                                exit_fullscreen_button     = new THREE.Mesh(button_geometry, exit_fullscreen_button_material),
                                exit_button                = new THREE.Mesh(button_geometry, exit_button_material),
                                //video_controls_bkgnd       = new THREE.Mesh(video_controls_bkgnd_geometry, video_controls_bkgnd_material),
                                //timeline_bkgnd             = new THREE.Mesh(timeline_bkgnd_geometry, timeline_bkgnd_material),
                                //timeline_progress          = new THREE.Mesh(video_progress_geometry, timeline_progress_material),
                                //buffer_progress            = new THREE.Mesh(video_progress_geometry, buffer_progress_material),
                                trailer_time_length_mesh   = new THREE.Mesh(button_geometry, trailer_time_length_material),
                                trailer_time_progress_mesh = new THREE.Mesh(button_geometry, trailer_time_progress_material) ];
      
      for(i=0; i<video_controls_meshes.length; i++) {video_controls.add(video_controls_meshes[i])};
      //video_controls.visible = false;
  

  //LOAD AND TRAILER INFO STUFF - MOVE // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
  
  trailer_title_mesh.position.set(camera.position.x-.04485, camera.position.y-.02625, camera.position.z-.075);
  trailer_plot_mesh.position.set(camera.position.x-.03050, camera.position.y-.03375, camera.position.z-.075);
  trailer_title.clear('red');
  trailer_plot.clear('red');
  camera.add(trailer_title_mesh, trailer_plot_mesh);
  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //




  //generate positions for the video screens - NEED TO FIX THIS! // // // // // // // // // // // // // // // // // // // //
  var locations = [];

  for(i=0; i<titles.length; i++) {locations[i] = [(-.42+(i*.17)), .455, .51]};
  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //




  var videos = [], video_images = [], video_image_contexts = [], video_textures = [], 
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


//listen for events
  window.addEventListener('resize',    on_resize,     false);
  window.addEventListener('mousemove', on_mouse_move, false);
  window.addEventListener('mousedown', on_mouse_down, false);

//user functions
  function on_resize() {
    innerWidth = window.innerWidth;
    innerHeight = window.innerHeight;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = 16/9;
  };


  function on_mouse_move(event) { 
    event.preventDefault(); 
    mouse.x = (event.clientX/innerWidth)*2-1; 
    mouse.y = -(event.clientY/innerHeight)*2+1;
  };


  function on_mouse_over() {
    var mouseover_raycaster = new THREE.Raycaster(),
        mouseover_vector    = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        
    mouseover_vector.unproject(camera);    
    mouseover_raycaster.set(camera.position, mouseover_vector.sub(camera.position).normalize());
  
    var intersects = mouseover_raycaster.intersectObjects(scene.children, true);
    //console.log(intersects);

    //logic for trailer info and video controls
    if(intersects[0] != undefined && video_controls.parent != scene) {       
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
      if(intersects[0].object.parent == video_controls) {
        video_controls.visible = true;
        return; 
      }
      else {
        video_controls.visible = false;
      };
    };
  };  


  function on_mouse_down() {
    var mousedown_raycaster = new THREE.Raycaster(),
        mousedown_vector    = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    
    mousedown_vector.unproject(camera);    
    mousedown_raycaster.set(camera.position, mousedown_vector.sub(camera.position).normalize());
  
    var intersects = mousedown_raycaster.intersectObjects(scene.children, true);
    //console.log(intersects);

    if(intersects[0] == undefined) {return};
    
    var no_click_effect = [ load.mesh,
                            cube.mesh, 
                            //video_controls_bkgnd, 
                            //timeline_bkgnd, 
                            //timeline_progress, 
                            //buffer_progress, 
                            trailer_time_length_mesh, 
                            trailer_time_progress_mesh ];
                            
    for(i=0; i<no_click_effect.length; i++) {if(intersects[0].object == no_click_effect[i]) {return}};
      
    if(intersects[0].object == restart_button) {
      videos[a].pause();
      videos[a].currentTime = 0;
      if(play_button.visible == true) {video_controls.remove(play_button); video_controls.add(pause_button)};
      videos[a].play();
      return;
    }
    else if(intersects[0].object == rewind_button) {
      videos[a].pause();
      videos[a].currentTime -= 5;
      if(play_button.visible == true) {video_controls.remove(play_button); video_controls.add(pause_button)};
      videos[a].play();
      return;
    }
    else if(intersects[0].object == play_button) {
      videos[a].play();
      video_controls.remove(play_button);
      video_controls.add(pause_button);
      return; 
    }
    else if(intersects[0].object == pause_button) {
      videos[a].pause();
      video_controls.remove(pause_button);
      video_controls.add(play_button);
      return;
    }
    else if(intersects[0].object == fastforward_button) {
      videos[a].pause();
      videos[a].currentTime += 5;
      if(play_button.visible == true) {video_controls.remove(play_button); video_controls.add(pause_button)};
      videos[a].play();
      return;
    }
    else if(intersects[0].object == enter_fullscreen_button) {
      container.webkitRequestFullscreen();
      return;
    }
    else if(intersects[0].object == exit_fullscreen_button) {
      document.webkitExitFullscreen();
      return;
    }
    else if(intersects[0].object == exit_button) {
      if(play_button.visible == true) {video_controls.remove(play_button); video_controls.add(pause_button)};
      scene.remove(video_controls);
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


  function on_click() {
    if(video_controls.parent != scene) {
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
        video_images[a].width  = dimensions[0][0];
        video_images[a].height = dimensions[0][1];  
        video_image_contexts[a].fillStyle = '0#000000';
        video_image_contexts[a].fillRect(0, 0, video_images[a].width, video_images[a].height);
        video_screen_materials[a].map = video_textures[a];
        videos[a].src = media_sources[a][1];
        videos[a].load();
        videos[a].play();
     
      //set button, etc. locations and add video controls to the scene
        //restart_button.position.set             (locations[a][0]+(0.0350), locations[a][1]-(0.0360), locations[a][2]+(0.0001));
        //rewind_button.position.set              (locations[a][0]+(0.0430), locations[a][1]-(0.0360), locations[a][2]+(0.0001));
        //pause_button.position.set               (locations[a][0]+(0.0510), locations[a][1]-(0.0360), locations[a][2]+(0.0001));
        //play_button.position.set                (locations[a][0]+(0.0510), locations[a][1]-(0.0360), locations[a][2]+(0.00009));
        fastforward_button.position.set         (locations[a][0]+(0.0590), locations[a][1]-(0.0360), locations[a][2]+(0.0001));
        enter_fullscreen_button.position.set    (locations[a][0]+(0.0670), locations[a][1]-(0.0360), locations[a][2]+(0.0001));
        exit_fullscreen_button.position.set     (locations[a][0]+(0.0670), locations[a][1]-(0.0360), locations[a][2]+(0.00009));
        exit_button.position.set                (locations[a][0]+(0.0750), locations[a][1]-(0.0360), locations[a][2]+(0.0001));
        //video_controls_bkgnd.position.set       (locations[a][0]-(0.0000), locations[a][1]-(0.0360), locations[a][2]+(0.00005));  
        //timeline_bkgnd.position.set             (locations[a][0]-(0.0500)+.025, locations[a][1]-(0.0360), locations[a][2]+(0.00010));
        //timeline_progress.position.set          (locations[a][0]-(0.0710)+.025, locations[a][1]-(0.0360), locations[a][2]+(0.00012));
        //buffer_progress.position.set            (locations[a][0]-(0.0710)+.025, locations[a][1]-(0.0360), locations[a][2]+(0.00011));
        trailer_time_length_mesh.position.set   (locations[a][0]+(0.0250), locations[a][1]-(0.0360), locations[a][2]+(0.0001));
        trailer_time_progress_mesh.position.set (locations[a][0]-(0.0750), locations[a][1]-(0.0360), locations[a][2]+(0.0001));
        
        scene.add(video_controls);

      //listen for the end of the video
        videos[a].addEventListener('ended', function(event){video_controls.remove(pause_button); video_controls.add(play_button)}, false);
    };
    
    //reset boolean value of 'click' variable
      click = false;
  };


  function images_loaded() {
    //remove the loading screen and go to home camera position
      scene.remove(spinBox.mesh, load.mesh);
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
      loaded_images = null;
  };


  function video_update() {
    if(videos[a].readyState === videos[a].HAVE_ENOUGH_DATA) {video_image_contexts[a].drawImage(videos[a], 0, 0)};
    
    if(videos[a].readyState > 0) {
      trailer_time_length.clear('black');
      trailer_time_length.drawText(sec_to_string(Math.round(videos[a].duration)-Math.round(videos[a].currentTime)), undefined, 475, 'white', '500px Corbel');
        
      trailer_time_progress.clear('black');
      trailer_time_progress.drawText(sec_to_string(Math.round(videos[a].currentTime)), undefined, 475, 'white', '500px Corbel');

      timeline_progress.scale.x = ((timeline_bkgnd.geometry.parameters.width*(Math.round(videos[a].currentTime)/Math.round(videos[a].duration)))-timeline_progress.geometry.parameters.width)/(timeline_progress.geometry.parameters.width);
      timeline_progress.position.x = locations[a][0]-(0.0710)+((timeline_progress.scale.x*timeline_progress.geometry.parameters.width)/2);
        
      buffer_progress.scale.x = ((timeline_bkgnd.geometry.parameters.width*(Math.round(videos[a].buffered.end(0))/Math.round(videos[a].duration)))-buffer_progress.geometry.parameters.width)/(buffer_progress.geometry.parameters.width);
      buffer_progress.position.x = locations[a][0]-(0.0710)+((buffer_progress.scale.x*buffer_progress.geometry.parameters.width)/2);
    };
    
    video_textures[a].needsUpdate = true;
  };


  function fullscreen_check() {
    if(document.webkitIsFullScreen) {
      video_controls.remove(enter_fullscreen_button);
      video_controls.add(exit_fullscreen_button);
    }
    else {
      video_controls.remove(exit_fullscreen_button);
      video_controls.add(enter_fullscreen_button);
    };  
  };


//global vars needed for the scene
var image_stills = [];

function init() {
  controls.minDistance = 30;
  controls.maxDistance = 90;
  camera.position.copy(camLoad);
  controls.enabled = false;

  //add the light sources
  var light = new pointLights();

  //add the loading screen's animation
  spinBox = new rhombicDodecahedron();

  //add the load bar to monitor image load progress
  load = new loadBar();

  //add the cube
  cube = new wireFrameCube(10);
  
  //add objects to the scene
  scene.add(light.one, light.two, light.three, spinBox.mesh, load.mesh, cube.mesh);



  //allow CORS, load the image stills
    THREE.ImageUtils.crossOrigin = '';

    for(i=0; i<media_sources.length; i++) {
      image_stills[i] = THREE.ImageUtils.loadTexture(media_sources[i][0], undefined, function() {loaded_images++});
      video_screen_materials[i].map = image_stills[i];
    };
};


function render() {
  var delta = clock.getDelta();
  
  //loading screen animation and image load progress
  if(spinBox.mesh.parent == scene) {spinBox.animation()};

  if(load.mesh.parent == scene) {load.progress()};





  //view homepage if all images have been loaded
    if(loaded_images == media_sources.length) {images_loaded()};

  //click logic
    if(click == true) {on_click()};

  //update the video
    if(videos[a] != undefined) {video_update()};

  //check for mouse_over events
    on_mouse_over();

  //fullscreen button check
    fullscreen_check();    

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
