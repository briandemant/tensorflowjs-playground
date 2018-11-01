(() => {
	const trainingData = []

	let gather = true
	let autopilot = false
	let prevState = null

	IO.once("init", () => {

		IO.on("state_changed", ({ value }) => {

			if (gather) {
				// print 1% of events
				if (Math.random() < 0.01 && Math.abs(prevState.score - value.score) > 1) console.log(value)

				// gather 5% of events
				if (value.score > 10 && Math.random() < 0.05 && Math.abs(prevState.score - value.score) > 10) {
					prevState = value
					trainingData.push(value)
				}
				if (!prevState) prevState = value

				if (!value.ship.alive) {
					gather = false
					// last state alive
					trainingData.push(prevState)
				}
			}
		})

		IO.on("reset", (e) => {
			gather = true
		})

		IO.on("autopilot_enabled", ({ value }) => {
			autopilot = true
			console.log(value)
			console.log(trainingData)

			setInterval(() => {
				let straight = Math.random() > 0.5
				let left = !straight && Math.random() > 0.5
				let right = !straight && !left

				let fly = Math.random() > 0.3
				let shoot = fly || Math.random() > 0.8

				let command = {
					keySpace: shoot,
					keyUp: fly,
					keyLeft: left,
					keyRight: right,
				} 

				if (Math.random() > 0.8) {
					IO.emit("autopilot", command)
				}
			}, 100)
		})
		IO.on("autopilot_disabled", ({ value }) => {
			autopilot = false
			console.log(value)
			console.log(trainingData)
		})


		IO.on("*", (e) => {
			if (e.value.event != "state_changed") {
				console.log(e.value.event)
			}
		})
	})
})()