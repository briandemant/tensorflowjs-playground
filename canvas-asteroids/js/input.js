//keyboard vars

let keyLeft = false
let keyUp = false
let keyRight = false
let keySpace = false

function keyboardInit() {
	window.onkeydown = function(e) {
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
		}

		// developer console :)
		if (e.keyCode != 73) {
			e.preventDefault()
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
}

