/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */


var Detector = {

	canvas: !! window.CanvasRenderingContext2D,
	webgl: ( function () { try { var canvas = document.createElement( 'canvas' ); return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) ); } catch( e ) { return false; } } )(),
	workers: !! window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage: function () {

		var element = document.createElement( 'div' );
		element.id = 'webgl-error-message';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '25px';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'top';
		element.style.background = '#000';
		element.style.color = '#fff';
		element.style.padding = '15em';
		element.style.width = '4800px';
		element.style.height = '2700px';
		element.style.margin = '0em auto 0';

		if ( ! this.webgl ) {

			element.innerHTML = window.WebGLRenderingContext ? [
				'Your graphics card does not seem to support <b style="color:#4B32AF">trailer_cube</b>.',
				'Find out about WebGL <a href="http://get.webgl.org/" style="color:#888888">here</a>.'
			].join( '\n' ) : [
				'Your browser does not seem to support <b style="color:#4B32AF">trailer_cube</b>.',
				'Find out about WebGL <a href="http://get.webgl.org/" style="color:#888888">here</a>.'
			].join( '\n' );

		}

		return element;

	},

	addGetWebGLMessage: function ( parameters ) {

		var parent, id, element;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		element = Detector.getWebGLErrorMessage();
		element.id = id;

		parent.appendChild( element );

	}

};

// browserify support
if ( typeof module === 'object' ) {

	module.exports = Detector;

}
;
