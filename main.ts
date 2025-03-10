//radio.setFrequencyBand(0)
radio.setTransmitPower(5)
radio.setGroup(37)
radio.setTransmitSerialNumber(false)

let avrglight: number = 0

const lightCalibrate: () => number = () => {
    let svetlo = input.lightLevel()
    let prumer: number = 0
    for (let i: number = 0; i < 10; i = i + 1) {
        prumer += svetlo
        basic.pause(20)
    }
    return prumer = prumer / 10
}

input.onButtonPressed(Button.A, function () {
    avrglight = lightCalibrate()
    radio.sendValue("state", 0)
    mode = STATE.ready
    music.playTone(400, 100)
})

enum STATE {
    ready,
    running,
    finish
}

let mode = STATE.ready as STATE
let runtime: number

basic.forever(() => {
    switch (mode) {
        case STATE.ready:
            basic.showString("R")
            break;
        case STATE.running:
            basic.showString("")
            if (input.lightLevel() + 50 < avrglight) {
                radio.sendValue("state", 2)
                mode = STATE.finish
            }
        break;
        case STATE.finish:
            basic.showNumber(runtime / 1000)
            break;
    }
})

radio.onReceivedValue(function (name: string, value: number) {
    music.playTone(500, 800)
    if (name === "state" && value === 1) {
        mode = STATE.running
    }
    if (name === "state" && value === 0) {
        mode = STATE.ready
    }
    if (name === "time") {
        runtime = value
    }
})
