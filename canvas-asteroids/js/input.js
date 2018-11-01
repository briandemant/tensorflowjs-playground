//keyboard vars

let keyLeft = false
let keyUp = false
let keyRight = false
let keySpace = false

let autopilot = false

function keyboardInit() {
	window.onkeydown = function(e) {
		if (autopilot && e.keyCode != 84) return

		switch (e.keyCode) {
			//key A or LEFT
			case 65:
			case 37:
				keyLeft = true
				break

			//key W or UP
			case 87:
			case 38:
				keyUp = true
				break

			//key D or RIGHT
			case 68:
			case 39:
				keyRight = true
				break

			//key Space
			case 32:
				keySpace = true
				break

			//key T
			case 84:
				autopilot = !autopilot
				if (autopilot) {
					IO.emit("autopilot_enabled")
				} else {
					IO.emit("autopilot_disabled")
				}
				break
		}
	}

	window.onkeyup = function(e) {
		switch (e.keyCode) {
			//key A or LEFT
			case 65:
			case 37:
				keyLeft = false
				break

			//key W or UP
			case 87:
			case 38:
				keyUp = false
				break

			//key D or RIGHT
			case 68:
			case 39:
				keyRight = false
				break

			//key Space
			case 32:
				keySpace = false
				break
		}

		e.preventDefault()
	}

	IO.on("autopilot", function({ value }) {
		keyLeft = value.keyLeft
		keyRight = value.keyRight
		keyUp = value.keyUp
		keySpace = value.keySpace
	})
}

