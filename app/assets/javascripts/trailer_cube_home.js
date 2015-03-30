window.onload = function() {

//some global vars, append verifications
  var clock     = new THREE.Clock(),
      container = $("container"),
      width     = window.innerWidth,
      height    = window.innerHeight;
    
  if(document.body != null) { append( container, document.body ) };

  var scene                        = new THREE.Scene(), 
      camera                       = new THREE.PerspectiveCamera(45, (width/height), 0.01, 100),
        cam_home                   = new THREE.Vector3( 2.5*Math.sin(0)*Math.cos(0), 2.5*Math.sin(0)*Math.sin(0), 2.5*Math.cos(0) ),
        cam_load                   = new THREE.Vector3(  75*Math.sin(0)*Math.cos(0),  75*Math.sin(0)*Math.sin(0),  75*Math.cos(0) ),
      controls                     = new THREE.OrbitControls(camera, container),
      renderer                     = new THREE.WebGLRenderer( { antialias: false, alpha: false } );

  if(container != null) {
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);
    append( renderer.domElement, container );   
  };

  var projector           = new THREE.Projector(),
      mousemove_raycaster = new THREE.Raycaster(),
      mousedown_raycaster = new THREE.Raycaster(),
      mouse               = { x: 0, y:0 };
      
  var video_controls  = new THREE.Object3D(),
      button_geometry = new THREE.PlaneBufferGeometry(.0072, .00405, 1, 1),
      
      play_button_material             = new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('public_assets/play_button.png')} ),
      pause_button_material            = new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('public_assets/pause_button.png')} ),
      enter_fullscreen_button_material = new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('public_assets/enter_fullscreen_button.png')} ),
      exit_fullscreen_button_material  = new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('public_assets/exit_fullscreen_button.png')} ),
      exit_button_material             = new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('public_assets/exit_button.png')} ),
      
      play_button             = new THREE.Mesh(button_geometry, play_button_material),
      pause_button            = new THREE.Mesh(button_geometry, pause_button_material),
      enter_fullscreen_button = new THREE.Mesh(button_geometry, enter_fullscreen_button_material),
      exit_fullscreen_button  = new THREE.Mesh(button_geometry, exit_fullscreen_button_material),
      exit_button             = new THREE.Mesh(button_geometry, exit_button_material);

      video_controls.visible = false;
      scene.add(video_controls);
        video_controls.add(pause_button);
        video_controls.add(enter_fullscreen_button);
        video_controls.add(exit_button);


//listen for events
  window.addEventListener('mousemove', mouse_move, false);
  window.addEventListener('mousedown', on_mouse_down, false);
  window.addEventListener('resize', on_window_resize, false);


//user functions
  function mouse_move(event) {
    event.preventDefault();
    
    mouse.x = ( event.clientX / width ) * 2 - 1,
    mouse.y = - ( event.clientY / height ) * 2 + 1;
  };


  function on_mouse_down(event) {  
    mouse_move(event);

    var mousedown_vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
      mousedown_vector.unproject(camera);    
  
    mousedown_raycaster.set( camera.position, mousedown_vector.sub( camera.position ).normalize() );
  
    var intersects = mousedown_raycaster.intersectObjects(scene.children, true);

      if( intersects[0] == undefined || intersects[0].object == trailer_cube ) { return }
      else if( intersects[0].object == play_button ) {
        videos[a].play();
        video_controls.remove(play_button);
        video_controls.add(pause_button);
        return; 
      }
      else if( intersects[0].object == pause_button ) {
        videos[a].pause();
        video_controls.remove(pause_button);
        video_controls.add(play_button);
        return;
      }
      else if( intersects[0].object == enter_fullscreen_button ) {
        container.webkitRequestFullscreen();
        camera.aspect = 16/9;
        return;        
      }
      else if( intersects[0].object == exit_fullscreen_button ) {
        document.webkitExitFullscreen();
        return;        
      }
      else if( intersects[0].object == exit_button ) {
        videos[a].pause();        
        videos[a].currentTime = 0;
        video_screen_materials[a].map = image_stills[a];
      
        if( play_button.visible == true ) {
          video_controls.remove(play_button);
          video_controls.add(pause_button);
        };
      
        video_controls.visible = false;      
        controls.target = new THREE.Vector3();
        camera.position.set( locations[a][0], locations[a][1], locations[a][2]+(.75) );
        controls.enabled = true;
        return;
      }; 

      for( a=0; a<trailers.length; a++ ) {    
        if ( intersects[0].object == video_screens[a] ) {
          click = true;
          return a; 
        };
      };
      
    //console.log(intersects);
  };


  function on_click() {
    controls.enabled = true ? false : null;
  
    if( video_controls.visible == false ) {
      //position the camera in front of the video screen that's been clicked
        controls.target = video_screens[a].position;
        camera.position.set( locations[a][0], locations[a][1], locations[a][2]+(.099485) );

      //load and play the video
        videos[a].src = video_sources[a];
        videos[a].load();
        videos[a].play();

        video_images[a].width  = dimensions[a][0];
        video_images[a].height = dimensions[a][1];
  
        video_image_contexts[a].fillStyle = '0#000000';
        video_image_contexts[a].fillRect(0, 0, video_images[a].width, video_images[a].height);

        video_screen_materials[a].map = video_textures[a];
     
      //display video controls
        pause_button.position.set(            locations[a][0]-(0.0080), locations[a][1]-(0.0360), locations[a][2]+(0.0001) );
        enter_fullscreen_button.position.set( locations[a][0]+(0.0000), locations[a][1]-(0.0360), locations[a][2]+(0.0001) );
        exit_button.position.set(             locations[a][0]+(0.0080), locations[a][1]-(0.0360), locations[a][2]+(0.0001) );
        play_button.position.copy(pause_button.position);
        exit_fullscreen_button.position.copy(enter_fullscreen_button.position);

        video_controls.visible = true;  
    };
    
    click = true ? false : null;
  };


  function on_window_resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = (width/height);
  };


//global vars needed for the scene
  var delta, elapsed,
      rhombic_dodecahedron, trailer_cube,
      image_stills = [], loaded_images = 0,
      click = false, a = 0;


function init() {
  camera.position.copy(cam_load);

  //loading screen mesh - a rhombic dodecahedron
    //geometry
      var rhom_dodec_geo = new THREE.Geometry();
      //vertices
        rhom_dodec_geo.vertices = [ new THREE.Vector3( 2.04772293123743050, -4.09327412386437040, -5.74908146957292670),
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
      //faces 
        rhom_dodec_geo.faces.push(  new THREE.Face3( 8, 0, 9 ),     new THREE.Face3( 9, 1, 8 ),
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
      //compute normals 
        rhom_dodec_geo.computeVertexNormals();
        rhom_dodec_geo.computeFaceNormals();
      //material and mesh
        var rhom_dodec_mat   = new THREE.MeshLambertMaterial( { color: 0x4B32AF, wireframe: false, shading: THREE.FlatShading } );
        rhombic_dodecahedron = new THREE.Mesh( rhom_dodec_geo, rhom_dodec_mat );
          rhombic_dodecahedron.position.set(0, 0, 0);
          scene.add(rhombic_dodecahedron);

  //non-ambient light source(s) needed for Lambert material
    var point_light_1 = new THREE.PointLight(0xFF0000);
      point_light_1.position.set(-175, 0, 0);
      scene.add(point_light_1);
    var point_light_2 = new THREE.PointLight(0x00FF00);
      point_light_2.position.set(175, 0, 0);
      scene.add(point_light_2);
    var point_light_3 = new THREE.PointLight(0x0000FF);
      point_light_3.position.set(0, 0, 175);
      scene.add(point_light_3);

  //add the cube
    var trailer_cube_geo = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100);
    var trailer_cube_mat = new THREE.MeshBasicMaterial( {color: 0x4B32AF, wireframe: true} );
        trailer_cube     = new THREE.Mesh(trailer_cube_geo, trailer_cube_mat); 
          trailer_cube.visible = false;
          trailer_cube.position.set(0, 0, 0);
          scene.add(trailer_cube);        
    
    //add video screens to the cube
      for(b=0; b<trailers.length; b++) {
        video_screens[b].visible = false;
        video_screens[b].position.set( locations[b][0], locations[b][1], locations[b][2] );
        scene.add(video_screens[b]);
      };

  //load the image stills
    for(c=0; c<image_still_sources.length; c++) { 
      image_stills[c] = THREE.ImageUtils.loadTexture( image_still_sources[c], undefined, function(){ loaded_images++ } ) 
    };
};


function loaded() {
  scene.remove(rhombic_dodecahedron); 
  camera.position.copy(cam_home);
      
  //object visibility
    if( $("rhombic-info") != null ) { $("rhombic-info").remove() };
    
    for(d=0; d<trailers.length; d++) { 
      video_screen_materials[d].map = image_stills[d];
      video_screens[d].visible = true;
    };
    
    trailer_cube.visible = true;
};


function render() {
  delta = clock.getDelta();
  elapsed = clock.getElapsedTime();

  controls.update(delta);
  renderer.render(scene, camera);
  
  //update the video texture
    if ( videos[a] != undefined && videos[a].readyState === videos[a].HAVE_ENOUGH_DATA ) {
      video_image_contexts[a].drawImage( videos[a], 0, 0 );
    
      if ( video_textures[a] ) { 
        video_textures[a].needsUpdate = true;
      };
    };  
  
  //listen for mouse-over of video controls

    
  //console.log(variable name(s) here);
};


function animate() {
  //loading screen mesh's rotation
    if( rhombic_dodecahedron != null ) {
      rhombic_dodecahedron.rotation.x += 2*Math.PI/600;
      rhombic_dodecahedron.rotation.z -= 2*Math.PI/600;
    };

  //view homepage if all images have been loaded
    if(loaded_images == image_still_sources.length) { 
      loaded();
      loaded_images = null;
    };

  //click logic
    if (click == true) { on_click() }; 

  //fullscreen button check
    if( document.webkitIsFullScreen ) {
      video_controls.remove(enter_fullscreen_button);
      video_controls.add(exit_fullscreen_button);
    }
    else {
      video_controls.remove(exit_fullscreen_button);
      video_controls.add(enter_fullscreen_button);
    };

  requestAnimationFrame(animate);
  render();   
};


init();
animate();
//console.log(variable name(s) here);

};