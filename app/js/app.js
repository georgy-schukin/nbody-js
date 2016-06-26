"use strict";

var NBJS = NBJS || {};

(function(nbjs) {
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	var renderer = new THREE.WebGLRenderer();
	
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube = new THREE.Mesh( geometry, material );
	
	var init = function () {	
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
	
		scene.add( cube );
		
		camera.position.z = 5;
	}

	var render = function () {
		requestAnimationFrame( render );

		cube.rotation.x += 0.1;
		cube.rotation.y += 0.1;

		renderer.render(scene, camera);
	};	

	nbjs.init = init;
	nbjs.render = render;
})(NBJS);