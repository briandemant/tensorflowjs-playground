(() => {
	const trainingData = []

	let gather = true
	let autopilot = false
	let prevState = null

	EventBus.once("init", () => {

		EventBus.on("state_changed", ({ value }) => {

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

		EventBus.on("reset", (e) => {
			gather = true
		})

		EventBus.on("autopilot_enabled", ({ value }) => {

			console.log(value)
			console.log(trainingData)

			autopilot = setInterval(() => {

				let straight = Math.random() > 0.5
				let left = !straight && Math.random() > 0.5
				let right = !straight && !left

				let fly = Math.random() > 0.3
				let back = !fly && Math.random() > 0.3
				let shoot = back || fly || Math.random() > 0.8

				let command = {
					keySpace: shoot,
					keyUp: fly,
					keyDown: back,
					keyLeft: left,
					keyRight: right,
				}

				if (Math.random() > 0.8) {
					EventBus.emit("autopilot", command)
				}
			}, 100)
		})

		EventBus.on("autopilot_disabled", () => {
			console.log(autopilot)
			EventBus.emit("autopilot", {
				keySpace: false,
				keyUp: false,
				keyLeft: false,
				keyRight: false,
			})
			clearInterval(autopilot)
			autopilot = false
		})


		EventBus.on("*", (e) => {
			if (e.value.event != "state_changed") {
				console.log(e.value.event)
			}
		})
	})
})()