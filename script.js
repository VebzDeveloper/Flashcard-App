var startBtn = document.getElementById("start-btn")
var flashcard = document.getElementById("flashcard")
var frontCard = document.getElementById("front-card")
var backCard = document.getElementById("back-card")
var knownBtn = document.getElementById("known-btn")
var unknownBtn = document.getElementById("unknown-btn")
var startScreen = document.getElementById("start-screen")
var flashcardScreen = document.getElementById("flashcard-screen")
var knownCount = document.getElementById("known-count")
var unknownCount = document.getElementById("unknown-count")
var toggleDark = document.getElementById("toggle-dark")
var deckSelect = document.getElementById("deck-select")
var beep = document.getElementById("beep")
var toggleTimer = document.getElementById("toggle-timer")
var sessionTimer = document.getElementById("session-timer")



var decks = {
    general: [
        { front: "Who is the first President of India?", back: "Dr. Rajendra Prasad" },
        { front: "What is the capital of Australia?", back: "Canberra" },
        { front: "What comes next: 2, 4, 8, 16, ?", back: "32" },
        { front: "If A = 1, B = 2, ..., what is the value of 'CAB'?", back: "3 + 1 + 2 = 6" },
        { front: "What is 25% of 200?", back: "50" },
        { front: "Which word is opposite of 'Optimistic'?", back: "Pessimistic" },
        { front: "Synonym of 'Rapid'?", back: "Fast / Quick" },
        { front: "What does 'etc.' stand for?", back: "Et cetera" },
        { front: "What is the square root of 144?", back: "12" },
        { front: "Odd one out: Apple, Orange, Banana, Carrot", back: "Carrot (it's a vegetable)" }
    ],
    coding: [
        { front: "What does HTML stand for?", back: "HyperText Markup Language" },
        { front: "What is the use of CSS?", back: "To style and layout web pages" },
        { front: "What is a variable in programming?", back: "A container for storing data values" },
        { front: "What is the output of 2 + '2' in JS?", back: "'22'" },
        { front: "What is a function?", back: "A block of code designed to perform a task" },
        { front: "Difference between == and === in JS?", back: "== compares value, === compares value and type" },
        { front: "What is an array?", back: "A list-like object to store multiple values" },
        { front: "Which keyword declares a constant in JS?", back: "`const`" },
        { front: "What is the main language of Android apps?", back: "Java or Kotlin" },
        { front: "Name a Python web framework.", back: "Django or Flask" }
    ],
    hacking: [
        { front: "What is ethical hacking?", back: "Authorized attempt to gain unauthorized access to a system" },
        { front: "What tool is used for penetration testing?", back: "Metasploit" },
        { front: "What does XSS stand for?", back: "Cross-Site Scripting" },
        { front: "What is a keylogger?", back: "Software that records keystrokes" },
        { front: "Which port does HTTP use?", back: "Port 80" },
        { front: "What is social engineering?", back: "Manipulating people into giving confidential information" },
        { front: "What does SQL Injection target?", back: "Database through vulnerable queries" },
        { front: "What is phishing?", back: "Fake sites or emails to trick users" },
        { front: "What is a brute-force attack?", back: "Trying many passwords until one works" },
        { front: "What is the role of a firewall?", back: "To monitor and control network traffic" }
    ],
    hackatho: [
        { front: "What is a hackathon?", back: "An event to collaborate and build software projects in limited time" },
        { front: "Ideal team size in a hackathon?", back: "3-5 people" },
        { front: "What is MVP?", back: "Minimum Viable Product" },
        { front: "Most important skill in a hackathon?", back: "Problem solving & teamwork" },
        { front: "What should your pitch include?", back: "Problem, solution, tech used, and demo" },
        { front: "What’s the benefit of participating?", back: "Experience, networking, skills, prizes" },
        { front: "Should you focus on innovation or functionality?", back: "Balance both, but MVP first" },
        { front: "Tools for rapid development?", back: "React, Firebase, Bootstrap, Figma" },
        { front: "What is a prototype?", back: "Early version of your product to demonstrate" },
        { front: "Common mistake in hackathons?", back: "Trying to do too much and not finishing" }
    ],
    mindbenders: [
        { front: "What has keys but can’t open locks?", back: "A keyboard" },
        { front: "Which planet has the longest day?", back: "Venus" },
        { front: "What comes once in a minute, twice in a moment, but never in a thousand years?", back: "The letter 'M'" },
        { front: "What is the only even prime number?", back: "2" },
        { front: "Which gas is most abundant in Earth’s atmosphere?", back: "Nitrogen" },
        { front: "Which number is both a square and a cube?", back: "64" },
        { front: "What disappears as soon as you say its name?", back: "Silence" },
        { front: "Who wrote '1984'?", back: "George Orwell" },
        { front: "What is the boiling point of water in °C?", back: "100°C" },
        { front: "What's the fastest land animal?", back: "Cheetah" }
    ],
}


let repetitionQueue = []
let currentIndex = 0
let known = 0
let unknown = 0
let timerOn = false
let timerInterval = null
let elapsedTime = 0


function loadStats() {
    known = parseInt(localStorage.getItem("known")) || 0
    unknown = parseInt(localStorage.getItem("unknown")) || 0
    knownCount.textContent = known
    unknownCount.textContent = unknown
}


function updateStats() {
    localStorage.setItem("known", known)
    localStorage.setItem("unknown", unknown)
    knownCount.textContent = known
    unknownCount.textContent = unknown
}


function loadCard() {
    var card = repetitionQueue[currentIndex]
    frontCard.textContent = card.front
    backCard.textContent = card.back
    flashcard.classList.remove("flip")
}


function nextCard() {
    currentIndex++
    if (currentIndex >= repetitionQueue.length) {
        alert("End of session!")
        flashcardScreen.classList.remove("active")
        startScreen.classList.add("active")
        stopTimer()
        return
    }
    loadCard()
}


function startSession() {
    known = 0
    unknown = 0
    updateStats()
    repetitionQueue = [...decks[deckSelect.value]]
    currentIndex = 0
    elapsedTime = 0
    sessionTimer.textContent = "⏱️ Time: 0s"
    startScreen.classList.remove("active")
    flashcardScreen.classList.add("active")
    loadCard()
    if (timerOn) startTimer()
}


function startTimer() {
    stopTimer()
    timerInterval = setInterval(() => {
        elapsedTime++
        sessionTimer.textContent = `⏱️ Time: ${elapsedTime}s`
        if (elapsedTime % 10 === 0) beep.play()
    }, 1000)
}


function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
    }
}


toggleTimer.addEventListener("click", () => {
    timerOn = !timerOn
    toggleTimer.innerHTML = `<i class="material-icons">timer</i> ${timerOn ? 'On' : 'Off'}`
    if (flashcardScreen.classList.contains("active")) {
        if (timerOn) {
            startTimer()
        } else {
            stopTimer()
        }
    }
})


flashcard.addEventListener("click", () => flashcard.classList.toggle("flip"))
startBtn.addEventListener("click", startSession)


knownBtn.addEventListener("click", () => {
    known++
    updateStats()
    nextCard()
})


unknownBtn.addEventListener("click", () => {
    unknown++
    repetitionQueue.push(repetitionQueue[currentIndex])
    updateStats()
    nextCard()
})


deckSelect.addEventListener("change", () => {
    startScreen.classList.add("active")
    flashcardScreen.classList.remove("active")
    stopTimer()
})


toggleDark.addEventListener("click", () => {
    document.body.classList.toggle("dark")
})

loadStats()