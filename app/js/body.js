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
}

Body.prototype.setVelocity = function (velocity) {
	this.velocity.copy(velocity);
}

Body.prototype.setForce = function (force) {
	this.force.copy(force);
}

Body.prototype.setMass = function (mass) {
	this.mass = mass;
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

