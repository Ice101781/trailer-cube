###What is *trailer_cube*?  

&nbsp; *trailer_cube* is a desktop design concept for a movie trailer web application that leverages the power of the Three.js API. Every aspect of the UI on the main page, with the exception of the header and footer, takes place in '3D'. For example, video playback is achieved via a canvas element that's been mapped to a plane in 3-space. When the user clicks on a trailer to play it, no other page is loaded; the camera in the scene is simply positioned in front of the plane containing the video canvas so that playback occurs as expected. Similarly, the buttons that control video playback are images that have been mapped to different planes in the space; these are then positioned in front of the current trailer and displayed accordingly.

###Is *trailer_cube* still in development?

&nbsp; *trailer_cube* is no longer in development. The amount of time required to maintain a database of the latest movie trailers proved to be prohibitive, and it seemed more productive to focus on creating applications that don't necessitate daily management. In addition to this, there are intellectual property considerations. Hopefully, this demo and the code supporting it still prove useful to those looking for examples of Three.js implementations that focus on HTML5 video as a medium.

###Why is it called *trailer_cube* and not *trailer_plane*?

&nbsp; The original intent was to give the user the ability to access more trailers by clicking the far sides of the browser window; this action would trigger a 90-degree rotation of the cube thereby displaying the next face of trailers. The present design allows the user to navigate around a single "face of the cube" with the mouse and select any trailer for more info or viewing.
