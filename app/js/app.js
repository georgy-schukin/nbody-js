"use strict";

var NBJS = NBJS || {};

(function(nbjs) {
	var scene, camera, renderer, controls;	
	var bodies = [];	

	function initLights() {
		var ambLight = new THREE.AmbientLight(0x222222);
		scene.add(ambLight);

	   	var dirLight = new THREE.DirectionalLight(0xffffff, 1);
		dirLight.position.set(100, 100, 50);
    	scene.add(dirLight);
	}

	function initControls() {
		controls = new THREE.OrbitControls(camera, renderer.domElement);				
		controls.target = new THREE.Vector3(0, 0, 0);
		controls.enableZoom = true;
	}

	function generateBodies(numOfBodies) {
		var material = new THREE.MeshPhongMaterial( { color: 0xffaa00 } );	
		for (var i = 0; i < numOfBodies; i++) {
			var body = new Body();
			body.setRandomCoord(-10, 10);
			body.setRandomVelocity(-1, 1);
			body.setRandomMass(0.1, 1000);
			bodies.push(body);
			scene.add(body.makeSphereMesh(1, 10, material));			
		}			
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
	
	var init = function () {	
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
		renderer = new THREE.WebGLRenderer();

		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);		
		
		camera.position.z = 15;

		initLights();
		initControls();    	
		generateBodies(50);

		window.addEventListener('resize', onWindowResize, false);
	}

	function updateBodies(delta) {		
		bodies.forEach(function (body) {
			body.resetForce();
			bodies.forEach(function (otherBody) {
				if (body !== otherBody) {
					body.addForce(body.computeForce(otherBody));
				}
			});
		});
		bodies.forEach(function (body) {
			body.update(delta);
		});		
	}

	var render = function () {
		requestAnimationFrame(render);		

		updateBodies(0.1);

		renderer.render(scene, camera);
	 	controls.update();
	};		

	nbjs.init = init;
	nbjs.render = render;
})(NBJS);