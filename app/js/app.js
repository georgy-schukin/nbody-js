"use strict";

var NBJS = NBJS || {};

(function(nbjs) {
	var scene, camera, renderer, controls;	
	var bodies = [];	
	
	var init = function () {	
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
		renderer = new THREE.WebGLRenderer();

		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );	
		for (var i = 0; i < 10; i++) {
			var body = new Body();
			body.setCoord(new THREE.Vector3(-10 + Math.random()*20, 
				-10 + Math.random()*20, -10 + Math.random()*20));
			bodies.push(body);
			scene.add(body.makeSphereMesh(1, 10, material));			
		}			
		
		camera.position.z = 15;

		var ambLight = new THREE.AmbientLight(0x222222);
		scene.add(ambLight);

	   	var dirLight = new THREE.DirectionalLight(0xffffff, 1);
		dirLight.position.set(100, 100, 50);
    	scene.add(dirLight);

    	controls = new THREE.OrbitControls(camera, renderer.domElement);				
		controls.target = new THREE.Vector3(0, 0, 0);
		controls.enableZoom = true;
	}

	var render = function () {
		requestAnimationFrame( render );		

		bodies.forEach(function(body) {
			var shift = new THREE.Vector3(-0.1 + Math.random()*0.2, 
				-0.1 + Math.random()*0.2, -0.1 + Math.random()*0.2);
			var newPos = new THREE.Vector3().addVectors(body.coord, shift);			
			body.setCoord(newPos);
		});

		renderer.render(scene, camera);
	 	controls.update();
	};	

	nbjs.init = init;
	nbjs.render = render;
})(NBJS);