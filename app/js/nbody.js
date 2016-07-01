var NBODY = (function() {

	function Body() {
		this.coord = new THREE.Vector3(0, 0, 0);
		this.velocity = new THREE.Vector3(0, 0, 0);		
	}

	return {
		Body: Body
	}
})();