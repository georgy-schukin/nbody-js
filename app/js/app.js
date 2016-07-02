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

	function initSkyBox() {
		var boxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
		var textureLoader = new THREE.TextureLoader();
		var boxTex = textureLoader.load('../resources/images/space.png'); 
		var boxMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, 
			side: THREE.BackSide, map: boxTex} );		
		var skyBox = new THREE.Mesh(boxGeometry, boxMaterial);
		scene.add(skyBox);
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
	
	var init = function () {	
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 2000);
		camera.position.z = 15;

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);						

		initLights();
		initControls();    			
		initSkyBox();

		window.addEventListener('resize', onWindowResize, false);
	}

	function generateBodies(numOfBodies) {
		var bodyMaterial = new THREE.MeshPhongMaterial( { color: 0xffaa00 } );	
		var minMass = 1000;
		var maxMass = 100000;
		for (var i = 0; i < numOfBodies; i++) {
			var body = new Body();
			body.setRandomCoord(-10, 10);
			body.setRandomVelocity(-1, 1);
			body.setRandomMass(minMass, maxMass);			
			var meshRadius = lerpRadiusByMass(0.1, 1, body.mass, minMass, maxMass);
			var bodyMesh = body.makeSphereMesh(meshRadius, 10, bodyMaterial);
			body.setMesh(bodyMesh);
			body.addToScene(scene);			
			bodies.push(body);
		}			
	}

	function clearBodies() {
		bodies.forEach( function (body) {
			body.removeFromScene(scene);
		})
		bodies.splice(0, bodies.length);
	}

	function initBodies(numOfBodies) {
		clearBodies();
		generateBodies(numOfBodies);
	}

	function updateBodies(delta) {		
		bodies.forEach( function (body) {
			body.resetForce();
			bodies.forEach( function (otherBody) {
				if (body !== otherBody) {
					body.addForce(body.computeForce(otherBody));
				}
			});
		});
		bodies.forEach( function (body) {
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
	nbjs.initBodies = initBodies;
	nbjs.render = render;
})(NBJS);