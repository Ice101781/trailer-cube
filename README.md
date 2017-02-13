###What is *trailer_cube*?  

&nbsp; *trailer_cube* is a design concept for a movie trailer website that leverages the power of the Three.js API. Every aspect of the UI on the main page, with the exception of the header and footer, takes place in '3D'. For example, video playback is achieved via a canvas element that's been mapped to a plane in 3-space. When the user clicks on a trailer to play it, no other page is loaded; the camera in the scene is simply positioned in front of the plane containing the video canvas so that playback occurs as expected. Similarly, the buttons that control video playback are images that have been mapped to different planes in the space, which are then positioned in front of the current trailer and displayed accordingly.

###What are the limitations of the user-experience (UX)?

&nbsp; The current design allows the user to navigate around the active face of the cube with the mouse and select any trailer for more info or viewing. As of now, there is only one face of the cube available, so an important part of the design concept is missing. The original intent was to give the user the ability to access more trailers by clicking the far sides of the active face; this action would trigger a 90 degree rotation of the cube thereby displaying the next face of trailers. It's also worth noting that *trailer_cube* is not a mobile-friendly experience.

###Why was development on *trailer_cube* stopped?

&nbsp; *trailer_cube* is no longer in development mainly because of the amount of time that proved necessary to manage a database of the latest movie trailers. It seemed more prudent to focus on developing applications that don't demand daily upkeep. In addition to this, there are intellectual property considerations. Hopefully, this demo and the code supporting it still prove useful in some way to those looking for examples of Three.js implementations that focus on HTML5 video as a medium.
