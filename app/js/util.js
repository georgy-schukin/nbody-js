"use strict";

var Util = Util || {};

(function (util) {
	function getRandomInRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	function getRandomVector(min, max) {
		var x = getRandomInRange(min, max);
		var y = getRandomInRange(min, max);
		var z = getRandomInRange(min, max);
		return [x, y, z];
	}

	function lerpRadiusByMass(minRadius, maxRadius, mass, minMass, maxMass) {
		var t = (mass - minMass)/(maxMass - minMass);
		return minRadius*(1 - t) + (maxRadius - minRadius)*t;
	}

	function addVectors(dest, source) {
		dest[0] += source[0];
		dest[1] += source[1];
		dest[2] += source[2];	
	}

	util.getRandomInRange = getRandomInRange;
	util.getRandomVector = getRandomVector;
	util.lerpRadiusByMass = lerpRadiusByMass;
	util.addVectors = addVectors;
})(Util);


