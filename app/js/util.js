"use strict";

function getRandomInRange(min, max) {
	return Math.random() * (max - min) + min;
}

function getRandomVector(min, max) {
	var x = getRandomInRange(min, max);
	var y = getRandomInRange(min, max);
	var z = getRandomInRange(min, max);
	return new THREE.Vector3(x, y, z);
}

function lerpRadiusByMass(minRadius, maxRadius, mass, minMass, maxMass) {
	var t = (mass - minMass)/(maxMass - minMass);
	return minRadius*(1 - t) + (maxRadius - minRadius)*t;
}


