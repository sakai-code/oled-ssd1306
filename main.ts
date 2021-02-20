let map = 0
let aaaaaaaa = 0
let aa = 0
let asa = 0
input.onButtonPressed(Button.B, function () {
    map = 1
})
basic.forever(function () {
    OLED.showNumber(180, 0, 0, 1)
    OLED.showNumber(0, 0, 4, 1)
    OLED.showNumber(-180, 0, 7, 1)
    if (true) {
        OLED.unshowString(
        convertToText(aaaaaaaa),
        57,
        7,
        1
        )
        aa = Math.map(input.rotation(Rotation.Roll), -180, 180, 1, 64)
        aa = 64 - aa
        aaaaaaaa = input.rotation(Rotation.Roll)
        OLED.showNumber(aaaaaaaa, 57, 7, 1)
        OLED.pixel(asa, aa, 1)
        if (asa == 120) {
            asa = 0
            OLED.clear()
            OLED.showNumber(180, 0, 0, 1)
            OLED.showNumber(0, 0, 4, 1)
            OLED.showNumber(-180, 0, 7, 1)
        }
        asa += 1
    }
})
