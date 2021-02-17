let asa = 0
let aa = 0
basic.forever(function () {
    aa = Math.map(input.rotation(Rotation.Roll), -180, 180, 1, 64)
    aa = 64 - aa
    OLED.showNumber(aa, 0, 0, 1)
    OLED.showNumber(aa, 0, 0, 0)
    OLED.pixel(asa, aa, 1)
    asa += 1
    if (asa == 120) {
        asa = 0
        OLED.clear()
    }
})
