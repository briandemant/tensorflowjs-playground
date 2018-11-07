const editorWrapper = document.querySelector(".editor-wrapper")
const colorOne = document.querySelectorAll(".color-1")
const colorTwo = document.querySelectorAll(".color-2")
const colorThree = document.querySelectorAll(".color-3")
const stars = document.querySelectorAll(".star")
const themes = document.getElementById("themes")
const guess = document.getElementById("guess")

window.localStorage.trainingData = window.localStorage.trainingData || JSON.stringify([])


// our current voting combination
const currentColors = {
	back: {},
	one: {},
	two: {},
	three: {},
}
let good = false

generateRandomTheme()
predictThemeCombinations()

stars.forEach((star, i) => {
	const score = i / 4
	console.log("score", score)

	star.addEventListener("mouseenter", setStars.bind(setStars, i))
	star.addEventListener("mouseleave", clearStars)
	star.addEventListener("click", saveTrainingData.bind(saveTrainingData, score))
})

function saveTrainingData(score) {
	console.log("scoreX", score)
	ML.train(currentColors, score)

	predictThemeCombinations()
	clearStars()
	generateRandomTheme()
}

// once we have a good set of data, generate some color combinations!
function predictThemeCombinations() {

	if (!ML.hasData()) {
		return
	}

	themes.innerHTML = ""
	const results = []

	for (let i = 0; i < 100000; i++) {
		const back = getRandomBackgroundRgb()
		const one = getRandomRgb()
		const two = getRandomRgb()
		const three = getRandomRgb()

		const score = ML.score({ back, one, two, three })

		if (score > 2 || results.length < 20) {
			results.push({ back, one, two, three, score: Math.min(Math.max((score * 10 | 0 )/ 10, 0), 1) })
		}
	}

	// sort results
	const sortedResults = results.sort(function(a, b) {
		var a = a.score
		var b = b.score

		return b - a
	})

	// keep the top 20 results!
	for (let i = 0; i < 20; i++) {
		addNewTheme(sortedResults[i])
	}
}

function addNewTheme({ back, one, two, three, score }) {
	const newTheme = document.createElement("div")
	newTheme.classList.add("predicted-theme")
	newTheme.innerHTML = `
  <div class="editor-wrapper" style="background:rgb(${back.r}, ${back.g}, ${back.b})">
    <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">import</span> React <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">from</span> <span style="color: rgb(${two.r}, ${two.g}, ${two.b})">"react"</span><br/>
    <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">import</span> ReactDOM <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">from</span> <span style="color: rgb(${two.r}, ${two.g}, ${two.b})">"react-dom"</span><br/>
    <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">import {</span> Provider <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">} from</span> <span style="color: rgb(${two.r}, ${two.g}, ${two.b})">"react-redux"</span><br/>
    <br/>
    <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">import</span> Layout <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">from</span> <span style="color: rgb(${two.r}, ${two.g}, ${two.b})">"./components/Layout"</span><br/>
    <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">import</span> store <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">from</span> <span style="color: rgb(${two.r}, ${two.g}, ${two.b})">"./store"</span><br/>
    <br/>
    <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">const</span> app<span style="color:rgb(${one.r}, ${one.g}, ${one.b})"> = </span>document.<span style="color: rgb(${three.r}, ${three.g}, ${three.b})">getElementById</span><span style="color:rgb(${one.r}, ${one.g}, ${one.b})">(</span><span style="color: rgb(${two.r}, ${two.g}, ${two.b})">'app'</span><span style="color:rgb(${one.r}, ${one.g}, ${one.b})">)</span><br/>
    <br/>
    ReactDOM.render<span style="color:rgb(${one.r}, ${one.g}, ${one.b})">(</span>&lt;<span style="color: rgb(${three.r}, ${three.g}, ${three.b})">Provider store={</span>store<span style="color: rgb(${three.r}, ${three.g}, ${three.b})">}</span>&gt;<br/>
    &nbsp;&nbsp;&lt;<span style="color: rgb(${three.r}, ${three.g}, ${three.b})">Layout </span>/&gt;<br/>
    &lt;/<span style="color: rgb(${three.r}, ${three.g}, ${three.b})">Provider</span>&gt;, app<span style="color:rgb(${one.r}, ${one.g}, ${one.b})"">)</span>
  </div>
  <li>Score ${score}</li>
  <li>Background rgb(${back.r}, ${back.g}, ${back.b})</li>
  <li>Color 1 rgb(${one.r}, ${one.g}, ${one.b})</li>
  <li>Color 2 rgb(${two.r}, ${two.g}, ${two.b})</li>
  <li>Color 3 rgb(${three.r}, ${three.g}, ${three.b})</li>
  `
	themes.appendChild(newTheme)
}

function setStars(whichStar) {
	for (let i = 0; i < stars.length; i++) {
		stars[i].classList.add("gold")
		if (i >= whichStar) {
			break
		}
	}
}

function clearStars() {
	for (const star of stars) {
		star.classList.remove("gold")
	}
}


function generateRandomTheme() {
	let tries = 10000
	if (good) {
		console.log("find something good")
	} else {
		console.log("find something bad")
	}

	let score = ""
	while (tries--) {
		currentColors.back = getRandomBackgroundRgb()
		currentColors.one = getRandomRgb()
		currentColors.two = getRandomRgb()
		currentColors.three = getRandomRgb()
		score = ML.score(currentColors)

		if (!hasData()) {
			break
		} else if (good) {
			if (score > 0.6) {
				good = false
				console.log("good found", score)
				break
			}
		} else {
			if (score < 0.2) {
				good = true
				console.log("bad found", score)
				break
			}
		}
	}

	editorWrapper.style.background = `rgb(${currentColors.back.r},${currentColors.back.g},${currentColors.back.b})`
	for (let color of colorOne) {
		color.style.color = `rgb(${currentColors.one.r},${currentColors.one.g},${currentColors.one.b})`
	}
	for (let color of colorTwo) {
		color.style.color = `rgb(${currentColors.two.r},${currentColors.two.g},${currentColors.two.b})`
	}
	for (let color of colorThree) {
		color.style.color = `rgb(${currentColors.three.r},${currentColors.three.g},${currentColors.three.b})`
	}

	guess.innerText = (score * 10 | 0) / 10
}

function getRandomRgb() {
	return {
		r: Math.round(Math.random() * 205 + 50), // number between 50 and 255
		g: Math.round(Math.random() * 205 + 50),
		b: Math.round(Math.random() * 205 + 50),
	}
}

function getRandomBackgroundRgb() {
	return {
		r: Math.round(Math.random() * 50), // number between 0 and 50
		g: Math.round(Math.random() * 50),
		b: Math.round(Math.random() * 50),
	}
}

