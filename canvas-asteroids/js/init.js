//common vars
let canvas
let context
let screenWidth
let screenHeight

//game vars
let ship

let particlePool
let particles

let bulletPool
let bullets

let asteroidPool
let asteroids

let hScan
let asteroidVelFactor = 0
let maxAsteroids = 4
let score = 0

let eventTarget = document.getElementsByTagName("head")[0]

const IO = {
	emit: (name, value) => {
		var event = new Event(name)
		event.value = value
		eventTarget.dispatchEvent(event)

		var event = new Event("*")
		event.value = { ...value, event: name }
		eventTarget.dispatchEvent(event)
	},
	on: (name, fn) => {
		eventTarget.addEventListener(name, fn, { capture: true })
	},
	once: (name, fn) => {
		eventTarget.addEventListener(name, fn, { once: true, capture: true })
	},
}

window.getAnimationFrame =
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 16.6)
	}


window.onload = function() {

	canvas = document.getElementById('canvas')
	context = canvas.getContext('2d')

	window.onresize()

	keyboardInit()
	particleInit()
	bulletInit()
	asteroidInit()
	shipInit()
	render()

	setInterval(() => {
		maxAsteroids = Math.min(10, maxAsteroids + 1)
	}, 5000)


	setInterval(() => {
		document.getElementById("score").innerText = score | 0
	}, 100)

	IO.emit("init")
}

window.onresize = function() {
	if (!canvas) return

	screenWidth = canvas.clientWidth
	screenHeight = canvas.clientHeight

	canvas.width = screenWidth
	canvas.height = screenHeight

	hScan = (screenHeight / 4) >> 0
}


function particleInit() {
	particlePool = Pool.create(Particle, 100)
	particles = []
}

function bulletInit() {
	bulletPool = Pool.create(Bullet, 40)
	bullets = []
}

function asteroidInit() {
	asteroidPool = Pool.create(Asteroid, 30)
	asteroids = []
}

function shipInit() {
	ship = Ship.create(screenWidth >> 1, screenHeight >> 1, this)
}


function resetGame() {
	asteroidVelFactor = 0
	maxAsteroids = 4
	score = 0
	ship.pos.setXY(screenWidth >> 1, screenHeight >> 1)
	ship.vel.setXY(0, 0)

	resetAsteroids()
}

function resetAsteroids() {
	let i = asteroids.length - 1

	for (i; i > -1; --i) {
		let a = asteroids[i]
		a.blacklisted = true
	}
}