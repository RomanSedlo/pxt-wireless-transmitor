//radio.setFrequencyBand(0)
radio.setTransmitPower(3)
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

avrglight = lightCalibrate()

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
            basic.showString("Ready")
            break;
        case STATE.running:
            if (input.lightLevel() + 20 < avrglight) {
                radio.sendValue("state", 2)
                mode = STATE.finish
            }
            break;
        case STATE.finish:
            basic.showNumber(runtime)
            if (input.buttonIsPressed(Button.A)) {
                radio.sendValue("state", 0)
                mode = STATE.ready
            }
            break;
    }
})

radio.onReceivedValue(function (name: string, value: number) {
    if (name === "state" && value === 1) {
        mode = STATE.running
    }
})

radio.onReceivedValue(function (name: string, value: number) {
    if (name === "runtime") {
        runtime = value
    }
})

radio.onReceivedValue(function (name: string, value: number) {
    if (name === "state" && value === 0) {
        mode = STATE.ready
    }
})