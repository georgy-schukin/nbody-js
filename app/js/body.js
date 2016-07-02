"use strict";

function Body() {
	this.coord = new THREE.Vector3(0, 0, 0);
	this.velocity = new THREE.Vector3(0, 0, 0);		
	this.acceleration = new THREE.Vector3(0, 0, 0);
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

Body.prototype.computeAcceleration = function (otherBody) {
	var G = 6.673e-11;
    var dx = otherBody.coord.x - this.coord.x;
    var dy = otherBody.coord.y - this.coord.y;
    var dz = otherBody.coord.z - this.coord.z;    
    var dist = Math.sqrt(dx*dx + dy*dy + dz*dz) + 1e-12; // avoid zero distance
    var temp = G*otherBody.mass/(dist*dist*dist); 
	return new THREE.Vector3(temp*dx, temp*dy, temp*dz);
}

Body.prototype.addAccountFrom = function (otherBody) {
	return this.addAcceleration(this.computeAcceleration(otherBody));
}

Body.prototype.addAcceleration = function (acceleration) {
	this.acceleration.add(acceleration);
	return this;
}

Body.prototype.resetAcceleration = function () {
	this.acceleration.set(0, 0, 0);
	return this;
}

Body.prototype.prepareForUpdate = function () {
	return this.resetAcceleration();
}

Body.prototype.update = function (delta) {
	var temp = this.acceleration.clone().multiplyScalar(delta); // a*t
	var coordShift = this.velocity.clone().multiplyScalar(delta).
		add(temp.clone().multiplyScalar(delta*0.5)); // v0*t + a*t*t/2	
	this.coord.add(coordShift);	// r = r0 + v0*t + a*t*t/2   
	this.velocity.add(temp); // v = v0 + a*t
	this.updateMesh();
	return this;
}

Body.prototype.setMesh = function (mesh) {
	this.mesh = mesh;
	this.updateMesh();	
	return this;
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

