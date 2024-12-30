function cursor() {
  const possibleEmoji = ["🟥", "🔴"]
  let element = document.body

  let width = window.innerWidth
  let height = window.innerHeight
  const cursor = { x: width / 2, y: width / 2 }
  const lastPos = { x: width / 2, y: width / 2 }
  let lastTimestamp = 0
  const particles = []
  const canvImages = []
  let canvas, context

  function init() {
    canvas = document.createElement("canvas")
    context = canvas.getContext("2d")

    canvas.style.top = "0px"
    canvas.style.left = "0px"
    canvas.style["z-index"] = "99999"
    canvas.style.pointerEvents = "none"

    canvas.style.position = "fixed"
    document.body.appendChild(canvas)
    canvas.width = width
    canvas.height = height

    context.font = "6px Arial"
    context.textBaseline = "middle"
    context.textAlign = "center"

    possibleEmoji.forEach((emoji) => {
      let measurements = context.measureText(emoji)
      let bgCanvas = document.createElement("canvas")
      let bgContext = bgCanvas.getContext("2d")

      bgCanvas.width = measurements.width
      bgCanvas.height = measurements.actualBoundingBoxAscent * 2

      bgContext.textAlign = "center"
      bgContext.font = "6px Arial"
      bgContext.textBaseline = "middle"
      bgContext.fillText(
        emoji,
        bgCanvas.width / 2,
        measurements.actualBoundingBoxAscent
      )

      canvImages.push(bgCanvas)
    })

    bindEvents()
    loop()
  }

  function bindEvents() {
    element.addEventListener("mousemove", onMouseMove, { passive: true })
    element.addEventListener("touchmove", onTouchMove, { passive: true })
    element.addEventListener("touchstart", onTouchMove, { passive: true })
    window.addEventListener("resize", onWindowResize)
  }

  function onWindowResize(e) {
    width = window.innerWidth
    height = window.innerHeight

    canvas.width = width
    canvas.height = height
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      for (let i = 0; i < e.touches.length; i++) {
        addParticle(
          e.touches[i].clientX,
          e.touches[i].clientY,
          canvImages[Math.floor(Math.random() * canvImages.length)]
        )
      }
    }
  }

  function onMouseMove(e) {
    if (e.timeStamp - lastTimestamp < 19) {
      return
    }

    window.requestAnimationFrame(() => {
      cursor.x = e.clientX
      cursor.y = e.clientY

      const distBetweenPoints = Math.hypot(
        cursor.x - lastPos.x,
        cursor.y - lastPos.y
      )

      if (distBetweenPoints > 1) {
        addParticle(
          cursor.x,
          cursor.y,
          canvImages[Math.floor(Math.random() * possibleEmoji.length)]
        )

        lastPos.x = cursor.x
        lastPos.y = cursor.y
        lastTimestamp = e.timeStamp
      }
    })
  }

  function addParticle(x, y, img) {
    particles.push(new Particle(x, y, img))
  }

  function updateParticles() {
    context.clearRect(0, 0, width, height)

    for (let i = 0; i < particles.length; i++) {
      particles[i].update(context)
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].lifeSpan < 0) {
        particles.splice(i, 1)
      }
    }
  }

  function loop() {
    updateParticles()
    requestAnimationFrame(loop)
  }

  function Particle(x, y, canvasItem) {
    const lifeSpan = 200
    this.initialLifeSpan = lifeSpan
    this.lifeSpan = lifeSpan
    this.velocity = {
      x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
      y: Math.random() * 0.4 + 0.8,
    }
    this.position = { x: x+25, y: y+30 }
    this.canv = canvasItem

    this.update = function(context) {
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
      this.lifeSpan--

      this.velocity.y += 0.05

      const scale = Math.max(this.lifeSpan / this.initialLifeSpan, 0)

      context.drawImage(
        this.canv,
        this.position.x - (this.canv.width / 2) * scale,
        this.position.y - this.canv.height / 2,
        this.canv.width * scale,
        this.canv.height * scale
      )
    }
  }

  init()
}

cursor()
