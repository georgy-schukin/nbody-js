"use strict";

function Body() {
	this.coord = new THREE.Vector3(0, 0, 0);
	this.velocity = new THREE.Vector3(0, 0, 0);		
	this.force = new THREE.Vector3(0, 0, 0);
	this.mass = 0.0;
	this.mesh = null;	
}

Body.prototype.setCoord = function (coord) {
	this.coord.copy(coord);
	this.updateMesh();
	return this;
}

Body.prototype.setRandomCoord = function (min, max) {	
	return this.setCoord(getRandomVector(min, max));	
}

Body.prototype.setVelocity = function (velocity) {
	this.velocity.copy(velocity);
	return this;
}

Body.prototype.setRandomVelocity = function (min, max) {	
	return this.setVelocity(getRandomVector(min, max));	
}

Body.prototype.setMass = function (mass) {
	this.mass = mass;
	return this;
}

Body.prototype.setRandomMass = function (min, max) {
	return this.setMass(getRandomInRange(min, max));
}

Body.prototype.computeForce = function (otherBody) {
	var G = 6.673e-11;
    var dx = otherBody.coord.x - this.coord.x;
    var dy = otherBody.coord.y - this.coord.y;
    var dz = otherBody.coord.z - this.coord.z;    
    var dist = Math.sqrt(dx*dx + dy*dy + dz*dz) + 1e-12; // avoid zero distance
    var temp = G*otherBody.mass*this.mass/(dist*dist*dist);
	return new THREE.Vector3(temp*dx, temp*dy, temp*dz);
}

Body.prototype.resetForce = function () {
	this.force.set(0, 0, 0);
	return this;
}

Body.prototype.addForce = function (force) {
	this.force.add(force);
	return this;
}

Body.prototype.setMesh = function (mesh) {
	this.mesh = mesh;
	return this;
}

Body.prototype.update = function (delta) {
	var coordShift = this.velocity.clone().multiplyScalar(delta);
	var velocityShift = this.force.clone().multiplyScalar(delta).divideScalar(this.mass);
	this.coord.add(coordShift);	   
	this.velocity.add(velocityShift); 
	this.updateMesh();
	return this;
}

Body.prototype.makeMesh = function (geom, mat) {
	this.mesh = new THREE.Mesh(geom, mat);	
	this.updateMesh();
	return this.mesh;
}

Body.prototype.makeSphereMesh = function (radius, segments, mat) {
	var sphereGeom = new THREE.SphereGeometry(radius, segments, segments);
	this.mesh = new THREE.Mesh(sphereGeom, mat);
	this.updateMesh();	
	return this.mesh;
}

Body.prototype.updateMesh = function () {
	if (this.mesh !== null) {
		this.mesh.position.copy(this.coord);
	}
}

Body.prototype.addToScene = function (scene) {
	if (this.mesh !== null) {
		scene.add(this.mesh);
	}
	return this;
}

Body.prototype.removeFromScene = function (scene) {
	if (this.mesh !== null) {
		scene.remove(this.mesh);
	}
	return this;
}

