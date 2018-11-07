const data = []

if (window.localStorage.trainingData) {
	JSON.parse(window.localStorage.trainingData).forEach((item) => data.push(item))
} else {
	window.localStorage.trainingData = "[]"
}

let net = new brain.NeuralNetwork({ activation: "leaky-relu" })

const hasData = () => data.length > 0
let isTrained = false

function getFeatures({ back, one, two, three }) {
	return [
		Math.round(back.r / 2.55) / 100, // divide by 255 and round to 2 decimal places
		Math.round(back.g / 2.55) / 100,
		Math.round(back.b / 2.55) / 100,
		Math.round(one.r / 2.55) / 100,
		Math.round(one.g / 2.55) / 100,
		Math.round(one.b / 2.55) / 100,
		Math.round(two.r / 2.55) / 100,
		Math.round(two.g / 2.55) / 100,
		Math.round(two.b / 2.55) / 100,
		Math.round(three.r / 2.55) / 100,
		Math.round(three.g / 2.55) / 100,
		Math.round(three.b / 2.55) / 100,
	]
}

const score = (colorSet) => {
	if (!isTrained) return ""

	const colors = getFeatures(colorSet)

	const [score] = net.run(colors)

	return Math.min(Math.max(score, 0), 1) // must be between 0 and 1
}

const train = (colorSet, score) => {

	console.log("score", score)
	console.log(colorSet)

	let item = { input: getFeatures(colorSet), output: [score] }

	data.push(item)

	if (score == 0 || score == 1) {
		const tmp = JSON.parse(window.localStorage.trainingData)
		tmp.push(item)
		window.localStorage.trainingData = JSON.stringify(tmp)
	}

	net = new brain.NeuralNetwork({ activation: "leaky-relu" })
	net.train(data)
	isTrained = true
}


const ML = { hasData, score, train }

