let Asteroid = (function() {
	//exposed methods:

	let colors = ['#00FF59', '#FF5900', '#5900FF', '#0059FF', '#FF0059', '#59FF00']

	let create = function() {
		let obj = Object.create(def)
		obj.radius = 40

		let color = colors.pop()
		colors.unshift(color)
		console.log(colors)

		obj.color = color
		obj.pos = Vec2D.create(0, 0)
		obj.vel = Vec2D.create(0, 0)
		obj.blacklisted = false
		obj.type = 'b'
		obj.sides = (Math.random() * 2 + 7) >> 0
		obj.angle = 0
		obj.angleVel = (1 - Math.random() * 2) * 0.01

		return obj
	}

	//Asteroid definition:
	let def = {
		radius: null,
		color: null,
		pos: null,
		vel: null,
		blacklisted: null,
		type: null,
		sides: null,
		angle: null,
		angleVel: null,

		update: function() {
			this.pos.add(this.vel)
			this.angle += this.angleVel
		},

		reset: function() {
			this.blacklisted = false
		},
	}

	return { create: create }
}())