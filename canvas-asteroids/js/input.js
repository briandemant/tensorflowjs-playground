//keyboard vars

let keyLeft = false
let keyUp = false
let keyDown = false
let keyRight = false
let keySpace = false

let autopilot = false

function keyboardInit() {
	window.onkeydown = function(e) {
		if (autopilot && e.keyCode != 84) return

console.log(e.keyCode )
		switch (e.keyCode) {
			case 65: // a
			case 37: // left
			case 90: // z
				keyLeft = true
				break

			case 87: // w
			case 38: // up
			case 68: // d
				keyUp = true
				break

			case 83: // s
			case 40: // down
			case 88: // x
				keyDown = true
				break

			case 68: // d
			case 39: // right
			case 67: // c
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
					EventBus.emit("autopilot_enabled")
				} else {
					EventBus.emit("autopilot_disabled")
				}
				break
		}
	}

	window.onkeyup = function(e) {
		switch (e.keyCode) {
			case 65: // a
			case 37: // left
			case 90: // z
				keyLeft = false
				break

			case 87: // w
			case 38: // up
			case 68: // d
				keyUp = false
				break

			case 83: // s
			case 40: // down
			case 88: // x
				keyDown = false
				break

			case 68: // d
			case 39: // right
			case 67: // c
				keyRight = false
				break

			//key Space
			case 32:
				keySpace = false
				break
		}

		e.preventDefault()
	}

	EventBus.on("autopilot", function({ value }) {
		keyLeft = value.keyLeft
		keyRight = value.keyRight
		keyUp = value.keyUp
		keyDown = value.keyDown
		keySpace = value.keySpace
	})
}

