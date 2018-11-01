function loop() {

	let state = {
		input: { keyLeft, keyUp, keyRight, keySpace },
		ship: { pos: ship.pos, vel: ship.vel, trust: ship.trust, angle: ship.angle },
		asteroids: asteroids.map((asteroid) => ({ radius: asteroid.radius, pos: asteroid.pos, vel: asteroid.vel })),
		bullets: bullets.map((bullet) => ({ pos: bullet.pos, vel: bullet.vel })),
	}
	let scoreWas = score

	updateShip()
	updateParticles()
	updateBullets()
	updateAsteroids()

	checkCollisions()


	render()

	state.score = score | 0
	state.deltaScore = score - scoreWas
	state.ship.alive = ship.alive
	IO.emit("state_changed", state)

	getAnimationFrame(loop)
}

IO.once("init", () => {
	getAnimationFrame(loop)
})


function updateShip() {
	ship.update()

	if (ship.idle) return

	score += ship.vel.getLength() / 10

	if (keySpace) ship.shoot()
	if (keyLeft) ship.angle -= 0.04
	if (keyRight) ship.angle += 0.04

	if (keyUp) {
		ship.thrust.setLength(0.1)
		ship.thrust.setAngle(ship.angle)

		generateThrustParticle()
	} else {
		ship.vel.mul(0.94)
		ship.thrust.setLength(0)
	}

	if (ship.pos.getX() > screenWidth) {
		ship.pos.setX(0)
	} else if (ship.pos.getX() < 0) {
		ship.pos.setX(screenWidth)
	}

	if (ship.pos.getY() > screenHeight) {
		ship.pos.setY(0)
	} else if (ship.pos.getY() < 0) {
		ship.pos.setY(screenHeight)
	}
}

function generateThrustParticle() {
	let p = particlePool.getElement()

	//if the particle pool doesn't have more elements, will return 'null'.

	if (!p) return

	p.radius = Math.random() * 3 + 2
	p.color = '#DDD'
	p.lifeSpan = 80
	p.pos.setXY(ship.pos.getX() + Math.cos(ship.angle) * -14, ship.pos.getY() + Math.sin(ship.angle) * -14)
	p.vel.setLength(8 / p.radius)
	p.vel.setAngle(ship.angle + (1 - Math.random() * 2) * (Math.PI / 18))
	p.vel.mul(-1)

	//particles[particles.length] = p; same as: particles.push(p);

	particles[particles.length] = p
}

function updateParticles() {
	let i = particles.length - 1

	for (i; i > -1; --i) {
		let p = particles[i]

		if (p.blacklisted) {
			p.reset()

			particles.splice(particles.indexOf(p), 1)
			particlePool.disposeElement(p)

			continue
		}

		p.update()
	}
}

function updateBullets() {
	let i = bullets.length - 1

	for (i; i > -1; --i) {
		let b = bullets[i]

		if (b.blacklisted) {
			b.reset()

			bullets.splice(bullets.indexOf(b), 1)
			bulletPool.disposeElement(b)

			continue
		}

		b.update()

		if (b.pos.getX() > screenWidth) {
			b.blacklisted = true
		} else if (b.pos.getX() < 0) b.blacklisted = true

		if (b.pos.getY() > screenHeight) {
			b.blacklisted = true
		} else if (b.pos.getY() < 0) b.blacklisted = true
	}
}

function updateAsteroids() {
	let i = asteroids.length - 1

	for (i; i > -1; --i) {
		let a = asteroids[i]

		if (a.blacklisted) {
			a.reset()

			asteroids.splice(asteroids.indexOf(a), 1)
			asteroidPool.disposeElement(a)

			continue
		}

		a.update()

		if (a.pos.getX() > screenWidth + a.radius) {
			a.pos.setX(-a.radius)
		} else if (a.pos.getX() < -a.radius) a.pos.setX(screenWidth + a.radius)

		if (a.pos.getY() > screenHeight + a.radius) {
			a.pos.setY(-a.radius)
		} else if (a.pos.getY() < -a.radius) a.pos.setY(screenHeight + a.radius)
	}

	if (asteroids.length < maxAsteroids) {
		let xFactor = (Math.random() * 2) >> 0
		let yFactor = (Math.random() * 2) >> 0

		if (xFactor == 0) {
			yFactor = Math.random()
		} else if (yFactor == 0) {
			xFactor = Math.random()
		}

		generateAsteroid(screenWidth * xFactor, screenHeight * yFactor, 60, 'b')
	}
}

function generateAsteroid(x, y, radius, type, color) {
	let a = asteroidPool.getElement()

	//if the bullet pool doesn't have more elements, will return 'null'.

	if (!a) return

	IO.emit("asteroid_created", { asteroid: a })

	a.radius = radius
	a.type = type
	if (color) {
		a.color = color
	}
	a.pos.setXY(x, y)
	a.vel.setLength(1 + asteroidVelFactor)
	a.vel.setAngle(Math.random() * doublePI)

	//bullets[bullets.length] = b; same as: bullets.push(b);

	asteroids[asteroids.length] = a
	asteroidVelFactor += 0.025
}

function checkCollisions() {
	checkBulletAsteroidCollisions()
	checkShipAsteroidCollisions()
}

function checkBulletAsteroidCollisions() {
	let i = bullets.length - 1
	let j

	for (i; i > -1; --i) {
		j = asteroids.length - 1

		for (j; j > -1; --j) {
			let b = bullets[i]
			let a = asteroids[j]

			if (checkDistanceCollision(b, a)) {
				b.blacklisted = true

				score += (100 - a.radius) * (ship.vel.getLength() / 3 + 0.2)
				destroyAsteroid(a)
				IO.emit("asteroid_hit", { asteroid: a })
			}
		}
	}
}

function checkShipAsteroidCollisions() {
	let i = asteroids.length - 1

	for (i; i > -1; --i) {
		let a = asteroids[i]
		let s = ship

		if (checkDistanceCollision(a, s)) {
			if (s.idle) return

			s.idle = true
			s.alive = false
			IO.emit("ship_crash", { asteroid: a })
			generateShipExplosion()
			destroyAsteroid(a)
		}
	}
}

function generateShipExplosion() {
	let i = 18

	for (i; i > -1; --i) {
		let p = particlePool.getElement()

		//if the particle pool doesn't have more elements, will return 'null'.

		if (!p) return

		p.radius = Math.random() * 6 + 2
		p.lifeSpan = 80
		p.color = ship.color
		p.vel.setLength(20 / p.radius)
		p.vel.setAngle(ship.angle + (1 - Math.random() * 2) * doublePI)
		p.pos.setXY(ship.pos.getX() + Math.cos(p.vel.getAngle()) * (ship.radius * 0.8), ship.pos.getY() + Math.sin(p.vel.getAngle()) * (ship.radius * 0.8))

		//particles[particles.length] = p; same as: particles.push(p);

		particles[particles.length] = p
	}
}

function checkDistanceCollision(obj1, obj2) {
	let vx = obj1.pos.getX() - obj2.pos.getX()
	let vy = obj1.pos.getY() - obj2.pos.getY()
	let vec = Vec2D.create(vx, vy)

	if (vec.getLength() < obj1.radius + obj2.radius) {
		return true
	}

	return false
}

function destroyAsteroid(asteroid) {
	asteroid.blacklisted = true

	generateAsteroidExplosion(asteroid)
	resolveAsteroidType(asteroid)
}

function generateAsteroidExplosion(asteroid) {
	let i = 18

	for (i; i > -1; --i) {
		let p = particlePool.getElement()

		//if the particle pool doesn't have more elements, will return 'null'.

		if (!p) return

		p.radius = Math.random() * (asteroid.radius >> 2) + 2
		p.lifeSpan = 80
		p.color = asteroid.color
		p.vel.setLength(20 / p.radius)
		p.vel.setAngle(ship.angle + (1 - Math.random() * 2) * doublePI)
		p.pos.setXY(asteroid.pos.getX() + Math.cos(p.vel.getAngle()) * (asteroid.radius * 0.8), asteroid.pos.getY() + Math.sin(p.vel.getAngle()) * (asteroid.radius * 0.8))

		//particles[particles.length] = p; same as: particles.push(p);

		particles[particles.length] = p
	}
}

function resolveAsteroidType(asteroid) {
	switch (asteroid.type) {
		case 'b':

			generateAsteroid(asteroid.pos.getX(), asteroid.pos.getY(), 40, 'm', asteroid.color)
			generateAsteroid(asteroid.pos.getX(), asteroid.pos.getY(), 40, 'm', asteroid.color)

			break

		case 'm':

			generateAsteroid(asteroid.pos.getX(), asteroid.pos.getY(), 20, 's', asteroid.color)
			generateAsteroid(asteroid.pos.getX(), asteroid.pos.getY(), 20, 's', asteroid.color)

			break
		case 's':

			generateAsteroid(asteroid.pos.getX(), asteroid.pos.getY(), 10, 't', asteroid.color)
			generateAsteroid(asteroid.pos.getX(), asteroid.pos.getY(), 10, 't', asteroid.color)

			break
	}
}

function generateShot() {
	let b = bulletPool.getElement()

	//if the bullet pool doesn't have more elements, will return 'null'.

	if (!b) return

	b.radius = 1
	b.pos.setXY(ship.pos.getX() + Math.cos(ship.angle) * 14, ship.pos.getY() + Math.sin(ship.angle) * 14)
	b.vel.setLength(10)
	b.vel.setAngle(ship.angle)

	//bullets[bullets.length] = b; same as: bullets.push(b);

	bullets[bullets.length] = b

	score -= Math.min(score, 5)
	IO.emit("shot_fired", { bullet: b })
}