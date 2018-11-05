const doublePI = Math.PI * 2

function render() {
	context.fillStyle = '#111'
	context.globalAlpha = 0.4
	context.fillRect(0, 0, screenWidth, screenHeight)
	context.globalAlpha = 1

	renderShip()
	renderParticles()
	renderBullets()
	renderAsteroids()
	renderScanlines()
}

function renderShip() {
	if (ship.idle) return

	context.save()
	context.translate(ship.pos.getX() >> 0, ship.pos.getY() >> 0)
	context.rotate(ship.angle)

	context.strokeStyle = ship.color
	context.lineWidth = (Math.random() > 0.9) ? 2 : 1
	context.beginPath()
	context.moveTo(10, 0)
	context.lineTo(-10, -10)
	context.lineTo(-10, 10)
	context.lineTo(10, 0)
	context.stroke()
	context.closePath()

	context.restore()
}

function renderParticles() {
	//inverse for loop = more performance.

	let i = particles.length - 1

	for (i; i > -1; --i) {
		let p = particles[i]

		context.beginPath()
		context.strokeStyle = p.color
		context.arc(p.pos.getX() >> 0, p.pos.getY() >> 0, p.radius, 0, doublePI)
		if (Math.random() > 0.4) context.stroke()
		context.closePath()
	}
}

function renderBullets() {
	//inverse for loop = more performance.

	let i = bullets.length - 1

	for (i; i > -1; --i) {
		let b = bullets[i]

		context.beginPath()
		context.strokeStyle = b.color
		context.arc(b.pos.getX() >> 0, b.pos.getY() >> 0, b.radius * 2, 0, doublePI)
		if (Math.random() > 0.2) context.stroke()
		context.closePath()
	}
}

function renderAsteroids() {
	//inverse for loop = more performance.

	let i = asteroids.length - 1

	for (i; i > -1; --i) {
		let a = asteroids[i]

		context.beginPath()
		context.lineWidth = (Math.random() > 0.2) ? 4 : 3
		context.strokeStyle = a.color

		let j = a.sides

		context.moveTo((a.pos.getX() + Math.cos(doublePI * (j / a.sides) + a.angle) * a.radius) >> 0, (a.pos.getY() + Math.sin(doublePI * (j / a.sides) + a.angle) * a.radius) >> 0)

		for (j; j > -1; --j) {
			context.lineTo((a.pos.getX() + Math.cos(doublePI * (j / a.sides) + a.angle) * a.radius) >> 0, (a.pos.getY() + Math.sin(doublePI * (j / a.sides) + a.angle) * a.radius) >> 0)

		}

		if (Math.random() > 0.2) context.stroke()

		context.closePath()
	}
}

function renderScanlines() {
	//inverse for loop = more performance.

	let i = hScan

	context.globalAlpha = 0.05
	context.lineWidth = 1

	for (i; i > -1; --i) {
		context.beginPath()
		context.moveTo(0, i * 4)
		context.lineTo(screenWidth, i * 4)
		context.strokeStyle = (Math.random() > 0.0001) ? '#FFF' : '#222'
		context.stroke()
	}

	context.globalAlpha = 1
}
