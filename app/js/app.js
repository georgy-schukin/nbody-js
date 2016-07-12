"use strict";

var NBJS = NBJS || {};

(function(nbjs) {
	var scene, camera, renderer, controls;		
	var skyBox = null;
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
		skyBox = new THREE.Mesh(boxGeometry, boxMaterial);
		scene.add(skyBox);
	}

	function toggleSkyBox(boxOn) {
		if (skyBox !== null) {
			if (boxOn) {
				scene.add(skyBox);
			} else {
				scene.remove(skyBox);
			}
		}
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
	
	function init() {	
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

	function initBodies(numOfBodies) {
		clearBodies();
		generateBodies(numOfBodies);
	}	

	function generateBodies(numOfBodies) {
		var minMass = 1000;
		var maxMass = 100000;
		bodies = Body.generateRandomBodies(numOfBodies, minMass, maxMass);
		initBodyMeshes(minMass, maxMass);		
	}		

	function updateBodies(delta) {		
		Body.updateBodies(bodies, delta);
		updateBodyMeshes();
	}

	function clearBodies() {
		clearBodyMeshes();
		bodies.splice(0, bodies.length);
	}

	function initBodyMeshes(minMass, maxMass) {
		var bodyMaterial = new THREE.MeshPhongMaterial( { color: 0xffaa00 } );	
		bodies.forEach( function (body) {
			var meshRadius = Util.lerpRadiusByMass(0.1, 1, body.mass, minMass, maxMass);
			var bodyGeometry = new THREE.SphereGeometry(meshRadius, 10, 10);	
			var bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
			body.mesh = bodyMesh; // attach mesh to body
			updateBodyMesh(body.mesh, body);
			scene.add(body.mesh);
		});				
	}

	function updateBodyMeshes() {
		bodies.forEach( function (body) {			
			updateBodyMesh(body.mesh, body);
		});				
	}

	function updateBodyMesh(mesh, body) {
		mesh.position.set(body.coord[0], body.coord[1], body.coord[2]); // update body mesh
	}

	function clearBodyMeshes() {
		bodies.forEach( function (body) {
			scene.remove(body.mesh);			
		});
	}
	
	function render() {
		requestAnimationFrame(render);				
		renderer.render(scene, camera);
	 	controls.update();
	};		

	var computeId = null;

	function compute() {
		updateBodies(0.1);
		computeId = setTimeout(compute, 10);
	}	

	function startCompute() {
		computeId = setTimeout(compute, 0);
	}

	function stopCompute() {
		if (computeId !== null) {
			clearTimeout(computeId);
		}
	}

	function startSimulation(numOfBodies) {
		stopCompute();
		initBodies(numOfBodies);
		startCompute();
	}

	nbjs.init = init;	
	nbjs.render = render;
	nbjs.start = startSimulation;
	nbjs.pause = stopCompute;
	nbjs.resume = startCompute;
	nbjs.toggleSkyBox = toggleSkyBox;
})(NBJS);