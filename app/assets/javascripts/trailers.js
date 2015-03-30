var trailers = [],
      titles = [],
      dimensions = [],
      locations = [],
      image_still_sources = [],
      video_sources = [],
      videos = [],
      video_images = [],
      video_image_contexts = [],
      video_textures = [],
      video_screen_materials = [],
      video_screens = [],
    video_screen_geometry = new THREE.PlaneBufferGeometry(.16, .09, 4, 4),
    t_c_logo = THREE.ImageUtils.loadTexture("/public_assets/t_c.png");

trailers[0] = [
                titles[0] = "Furious 7",
                dimensions[0] = [1280, 720],
                locations[0] = [-.42, .455, .51],
                image_still_sources[0] = "hd_trailers/furious7/furious7.jpg",
                video_sources[0] = "hd_trailers/furious7/furious7.mp4",
                videos[0] = create( "video" ),
                video_images[0] = create( "canvas" ),
                video_image_contexts[0] = video_images[0].getContext( '2d' ),
                video_textures[0] = new THREE.Texture( video_images[0] ),
                video_screen_materials[0] = new THREE.MeshBasicMaterial( {map: t_c_logo, overdraw: true} ),
                video_screens[0] = new THREE.Mesh( video_screen_geometry, video_screen_materials[0] )
              ];

trailers[1] = [
                titles[1] = "Avengers 2: Age of Ultron",
                dimensions[1] = [1280, 720],
                locations[1] = [-.25, .455, .51],
                image_still_sources[1] = "hd_trailers/avengers2/avengers2.jpg",
                video_sources[1] = "hd_trailers/avengers2/avengers2.mp4",
                videos[1] = create( "video" ),
                video_images[1] = create( "canvas" ),
                video_image_contexts[1] = video_images[1].getContext( '2d' ),
                video_textures[1] = new THREE.Texture( video_images[1] ),
                video_screen_materials[1] = new THREE.MeshBasicMaterial( {map: t_c_logo, overdraw: true} ),
                video_screens[1] = new THREE.Mesh( video_screen_geometry, video_screen_materials[1] ) 
              ];

