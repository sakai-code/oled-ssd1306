

// 6x8 font
const Font_5x7 = hex`000000000000005F00000007000700147F147F14242A072A12231308646237495522500005030000001C2241000041221C00082A1C2A0808083E080800503000000808080808006060000020100804023E5149453E00427F400042615149462141454B311814127F1027454545393C4A49493001710905033649494936064949291E003636000000563600000008142241141414141441221408000201510906324979413E7E1111117E7F494949363E414141227F4141221C7F494949417F090901013E414151327F0808087F00417F41002040413F017F081422417F404040407F0204027F7F0408107F3E4141413E7F090909063E4151215E7F09192946464949493101017F01013F4040403F1F2040201F7F2018207F63140814630304780403615149454300007F4141020408102041417F000004020102044040404040000102040020545454787F484444383844444420384444487F3854545418087E090102081454543C7F0804047800447D40002040443D00007F10284400417F40007C041804787C0804047838444444387C14141408081414187C7C080404084854545420043F4440203C4040207C1C2040201C3C4030403C44281028440C5050503C4464544C44000836410000007F000000413608000201020402`

//% color=#27b0ba icon="\uf26c" block="OD01"
//% groups='["Scrolling Display", "Positional Display", "Drawing", "Optional","graph"]'
namespace  OLED {
    export enum Display {
        //% block="ON"
        On = 1,
        //% block="OFF"
        Off = 0
    }

    const MIN_X = 0
    const MIN_Y = 0
    const MAX_X = 127
    const MAX_Y = 63
    let set = 0
    let coled = 0
    let rowed = 0
    let lastnum = 0
    let lasts = ""

    let _I2CAddr = 60
    let _screen = pins.createBuffer(1025)
    let _buf2 = pins.createBuffer(2)
    let _buf3 = pins.createBuffer(3)
    let _buf4 = pins.createBuffer(4)
    let _buf7 = pins.createBuffer(7)
    let _buf13 = pins.createBuffer(13)
    _buf7[0] = 0x40
    _buf13[0] = 0x40
    let _DRAW = 1
    let _cx = 0
    let _cy = 0

    let _ZOOM = 0
    let _DOUBLE = 0

    function cmd1(d: number) {
        let n = d % 256;
        pins.i2cWriteNumber(_I2CAddr, n, NumberFormat.UInt16BE);
    }

    function cmd2(d1: number, d2: number) {
        _buf3[0] = 0;
        _buf3[1] = d1;
        _buf3[2] = d2;
        pins.i2cWriteBuffer(_I2CAddr, _buf3);
    }

    function cmd3(d1: number, d2: number, d3: number) {
        _buf4[0] = 0;
        _buf4[1] = d1;
        _buf4[2] = d2;
        _buf4[3] = d3;
        pins.i2cWriteBuffer(_I2CAddr, _buf4);
    }

    function set_pos(col: number = 0, page: number = 0) {
        cmd1(0xb0 | page) // page number
        cmd1(0x00 | (col % 16)) // lower start column address
        cmd1(0x10 | (col >> 4)) // upper start column address    
    }

    // clear bit
    function clrbit(d: number, b: number): number {
        if (d & (1 << b))
            d -= (1 << b)
        return d
    }

    

    /**
     * draw / refresh screen
     */
    function draw(d: number) {
        if (d > 0) {
            set_pos()
            pins.i2cWriteBuffer(_I2CAddr, _screen)
        }
    }

    //% block="文字を拡大"
    //% weight=60 blockGap=8
    //% group="Optional"
    export function zoomIn() {
        _ZOOM = 1
       cmd2(0xd6, _ZOOM)
    }

    //% block="文字を縮小"
    //% weight=60 blockGap=8
    //% group="Optional"
    export function zoomOut() {
        _ZOOM = 0
        cmd2(0xd6, _ZOOM)
    }

    //% block="文字サイズを大にする"
    //% weight=60 blockGap=8
    //% group="Optional"
    export function set2X()
    {
        _DOUBLE = 1
    }

    //% block="文字サイズを小にする（デフォルト）"
    //% weight=60 blockGap=8
    //% group="Optional"
    export function set1X()
    {
        _DOUBLE = 0
    }
    
    function handan():number{
        return set

    }
    
    let initcount = 0
    let count = 0
   
 



    /**
     * param h 入力する最大の値　0の時自動で255に設定されます
     * param l 入力する最大の値　0の時自動で-255に設定されます
     */
    //% group="graph"
    //%block="グラフを書く　入力:|$n| 最大値：|$h| 最低値|$l | (ずっとブロック内に置く)"
    //% h.defl=255
    //% l.defl=-255
    
    export function graph(n:number,h:number,l:number):void {
       
        let point = Math.map(n,l,h, 1, 64)
        point = 64 - point
        

        let x = (h+l)/2

        if (initcount == 0){
            
            
        showNumber(h, 0, 0, 1)
        showNumber(x, 0, 4, 1)
        showNumber(l, 0, 7, 1)
        
        showNumber(count, 100, 7,1)
       
        pixel(count, point,1)
        count += 1
        initcount = 1
        set = 1 
        



        }else{
            initcount = 1
           if(handan()==1){
                showNumber(n ,100, 7, 1)
                pixel(count,point,1)

                
                if (count == 128) {
                count= 0
                clear()
                showNumber(h, 0, 0, 1)
                showNumber(x, 0, 4, 1)
                showNumber(l, 0, 7, 1)
                }
                count +=1
             
                basic.pause(1)
                
                
            }
           
            
            
            
            
            
           
        }
      
        
           
        
       
           
            
            
            
            
            
          
           
            



               

}
            





        

        

       

        
    
    /**
     * グラフを停止
     */
    //%block="グラフを停止する"
    //% group="graph"
    export function stopgraph(){
        set = 0

    }
     /**
     * グラフを再開
     */
    //%block="グラフを再開する"
    //% group="graph"
    export function regraph(){
        set = 1

    }
    


    /**
     * set a single pixel to be on (color = 1) or off (color = 0)
     */
    //% blockId="OLED12864_I2C_PIXEL" block="点を x %x|y %y| 色　%color　で表示"
    //% x.max=127 x.min=0 x.defl=0
    //% y.max=63 y.min=0 y.defl=0
    //% color.max=1 color.min=0 color.defl=1
    //% weight=30 blockGap=8
    //% group="Drawing"
    export function pixel(x: number, y: number, color: number = 1) {
    
        
        let page = y >> 3
        let shift_page = y % 8
        let ind = x + page * 128 + 1
        let b = (color) ? (_screen[ind] | (1 << shift_page)) : clrbit(_screen[ind], shift_page)
        _screen[ind] = b
        if (_DRAW) {
            set_pos(x, page)
            _buf2[0] = 0x40
            _buf2[1] = b
            pins.i2cWriteBuffer(_I2CAddr, _buf2)
        }
    }

    function char(c: string, col: number, row: number, color: number = 1) {
        let p = (Math.min(127, Math.max(c.charCodeAt(0), 32)) - 32) * 5
        let m = 0
        let ind = col + row * 128 + 1


        if(_DOUBLE)
        {

            for(let i = 0; i < 5; i++)
            {
                let l = 0
                for(let j = 0; j < 8; j++)
                {
                     if(color > 0 ? Font_5x7[p + i] & (1 << j) : !(Font_5x7[p + i] & (1 << j)))
                    {
                        pixel(col + m, row * 8 + l)
                        pixel(col + m, row * 8 + l + 1)

                        pixel(col + m + 1, row * 8 + l)
                        pixel(col + m + 1, row * 8 + l + 1)
                    }

                    l += 2
                }
                m += 2
            }

            let l = 0
            for(let j = 0; j < 8; j++)
            {
                if(color == 0)
                {
                    pixel(col + 10, row * 8 + l)
                    pixel(col + 10, row * 8 + l + 1)

                    pixel(col + 11, row * 8 + l)
                    pixel(col + 11, row * 8 + l + 1)
                }

                l += 2
            }

        }else{

            let j = 0

            for (let i = 0; i < 5; i++) {
                _screen[ind + i] = (color > 0) ? Font_5x7[p + i] : Font_5x7[p + i] ^ 0xFF
                
                if(_ZOOM){
                    _buf13[j + 1] = _screen[ind + i]
                    _buf13[j + 2] = _screen[ind + i]

                }else{
                    _buf7[i + 1] = _screen[ind + i]
                }

                j += 2
            }

            _screen[ind + 5] = (color > 0) ? 0 : 0xFF

            if(_ZOOM)
            {
            _buf13[12] = _screen[ind + 5] 
            }else{
            _buf7[6] = _screen[ind + 5]
            }
            
            set_pos(col, row)
            if(_ZOOM)
            {
                pins.i2cWriteBuffer(_I2CAddr, _buf13)
            }else{
                pins.i2cWriteBuffer(_I2CAddr, _buf7)
            }

        }
    }

    export function unchar(c: string, col: number, row: number, color: number = 1) {
        let p = (Math.min(127, Math.max(c.charCodeAt(0), 32)) - 32) * 5
        let m = 0
        let ind = col + row * 128 + 1


        if(_DOUBLE)
        {

            for(let i = 0; i < 5; i++)
            {
                let l = 0
                for(let j = 0; j < 8; j++)
                {
                     if(color > 0 ? Font_5x7[p + i]^0 & (1 << j) : !(Font_5x7[p + i]^0 & (1 << j)))
                    {
                        pixel(col + m, row * 8 + l,0)
                        pixel(col + m, row * 8 + l + 1,0)

                        pixel(col + m + 1, row * 8 + l,0)
                        pixel(col + m + 1, row * 8 + l + 1,0)
                    }

                    l += 2
                }
                m += 2
            }

            let l = 0
            for(let j = 0; j < 8; j++)
            {
                if(color == 0)
                {
                    pixel(col + 10, row * 8 + l,0)
                    pixel(col + 10, row * 8 + l + 1,0)

                    pixel(col + 11, row * 8 + l,0)
                    pixel(col + 11, row * 8 + l + 1,0)
                }

                l += 2
            }

        }else{

            let j = 0

            for (let i = 0; i < 5; i++) {
                _screen[ind + i] = (color > 0) ? Font_5x7[p + i]^0 : Font_5x7[p + i]^0 ^ 0xFF               
                if(_ZOOM){
                    _buf13[j + 1] = 0x00
                    _buf13[j + 2] = 0x00

                }else{
                    _buf7[i + 1] =0x00
                }

                j += 2
            }

            _screen[ind + 5] = (color > 0) ? 0 : 0xFF

            if(_ZOOM)
            {
            _buf13[12] = 0x00
            }else{
            _buf7[6] = 0x00
            }
            
            set_pos(col, row)
            if(_ZOOM)
            {
                pins.i2cWriteBuffer(_I2CAddr, _buf13)
            }else{
                pins.i2cWriteBuffer(_I2CAddr, _buf7)
            }

        }
    }

    /**
     * show text at a specific location on screen. Note - to remove the text print an empty string ("  ") to the same location.
     */
    //% blockId="OLED12864_I2C_SHOWSTRING" block="文字列%s|を 列 %col|行 %row|色　%color　で表示"
    //% s.defl="Hello"
    //% col.max=120 col.min=0 col.defl=0
    //% row.max=7 row.min=0 row.defl=0
    //% color.max=1 color.min=0 color.defl=1
    //% weight=50 blockGap=8 inlineInputMode=inline
    //% group="Positional Display"
    export function showString(s: string, col: number, row: number, color: number = 1) {
       
    
        let steps = 0
        if(_DOUBLE)
        {
            steps = 12
            row *= 2
        }else{
            steps = 6
        }
        for (let n = 0; n < s.length; n++) {
            char(s.charAt(n), col, row, color)
            col += steps

        }

        if(_DOUBLE)draw(1)
    }

   
　 function unshowString(s: string, col: number, row: number, color: number = 1) {
       
        let steps = 0
        if(_DOUBLE)
        {
            steps = 12
            row *= 2
        }else{
            steps = 6
        }
        for (let n = 0; n < s.length; n++) {
            unchar(s.charAt(n), col, row, color)
            col += steps

        }

        if(_DOUBLE)draw(1)
        
    }


    /**
     * show a number at a specific location on screen. Note - to remove the number print an empty string ("  ") to the same location.
     */
    //% blockId="OLED12864_I2C_NUMBER" block="数字 %num|aを 列 %col|行 %row|色 %color　で表示"
    //% num.defl=100
    //% col.max=120 col.min=0 col.defl=0
    //% row.max=7 row.min=0 row.defl=0
    //% color.max=1 color.min=0 color.defl=1
    //% weight=45 blockGap=8 inlineInputMode=inline
    //% group="Positional Display"
    export function showNumber(num: number, col: number, row: number, color: number = 1) {
        if( coled == col && rowed == row){
            unshowString(lasts, col, row,1)


        }
        showString(num.toString(), col, row, color)
        lasts = num.toString()
        coled = col
        rowed = row
    }

    function scroll() {
        _cx = 0

        if(_DOUBLE)
        {
            _cy +=2
        }else{
            _cy++
        }
        if (_cy > 7) {
            _cy = 7
            _screen.shift(128)
            _screen[0] = 0x40
            draw(1)
        }
    }
     

    /**
     * print text to screen
     */
    //% block="文字列　%s|を(次に置く文字を改行するか選択： %newline　)して表示"
    //% s.defl="HELLO!"
    //% newline.defl=true
    //% weight=88 blockGap=8 inlineInputMode=inline
    //% group="Scrolling Display"
    export function printString(s: string, newline: boolean = true) {
        let steps = 0
        if(_DOUBLE)
        {
            steps = 12
        }else{
            steps = 6
        }
    
        for (let n = 0; n < s.length; n++) {
            char(s.charAt(n), _cx, _cy, 1)
            _cx += steps
            if (_cx > 120) {
                scroll()
            }
        }
        if (newline) {
            scroll()
        }
        
        if(_DOUBLE)draw(1)
    }

    /**
    * print a number to screen 
    */
    //% block="数字 %num|を（次に置く文字を改行するか選択： %newline　)して表示"
    //% s.defl="0"
    //% newline.defl=true
    //% weight=86 blockGap=8 inlineInputMode=inline
    //% group="Scrolling Display"
    export function printNumber(num: number, newline: boolean = true) {
        printString(num.toString(), newline)
    }

    /**
     * draw a horizontal line. Use color = 1 to draw the line and color = 0 to erase it.
     */
    //% blockId="OLED12864_I2C_HLINE" block="横線 x %x|y %y|から長さ(pixel) %len|　色 %colorで表示"
    //% x.max=127 x.min=0 x.defl=0
    //% y.max=63 y.min=0 y.defl=0
    //% len.max=128 len.min=1 len.defl=16
    //% color.max=1 color.min=0 color.defl=1
    //% weight=30 blockGap=8 inlineInputMode=inline
    //% group="Drawing"
    export function horizontalLine(x: number, y: number, len: number, color: number = 1) {
        let _sav = _DRAW
        if ((y < MIN_Y) || (y > MAX_Y)) return
        _DRAW = 0
        for (let i = x; i < (x + len); i++)
            if ((i >= MIN_X) && (i <= MAX_X))
                pixel(i, y, color)
        _DRAW = _sav
        draw(_DRAW)
    }

    /**
     * draw a vertical line. Use color = 1 to draw the line and color = 0 to erase it.
     */
    //% blockId="OLED12864_I2C_VLINE" block="縦線を x %x|y %y|で長さ %len|色 %color　で表示"
    //% x.max=127 x.min=0 x.defl=0
    //% y.max=63 y.min=0 y.defl=0
    //% len.max=128 len.min=1 len.defl=16
    //% color.max=1 color.min=0 color.defl=1
    //% weight=25 blockGap=8 inlineInputMode=inline
    //% group="Drawing"
    export function verticalLine(x: number, y: number, len: number, color: number = 1) {
        let _sav = _DRAW
        _DRAW = 0
        if ((x < MIN_X) || (x > MAX_X)) return
        for (let i = y; i < (y + len); i++)
            if ((i >= MIN_Y) && (i <= MAX_Y))
                pixel(x, i, color)
        _DRAW = _sav
        draw(_DRAW)
    }

    /**
     * draw a rectangle. Use color = 1 to draw the rectangle and color = 0 to erase it.
     */
    //% blockId="OLED12864_I2C_RECT" block="四角形を始点 x1 %x1|y1 %y1|終点　x2 %x2|y2 %y2|色 %color　で表示"
    //% color.defl=1
    //% weight=20 blockGap=8 inlineInputMode=inline
    //% group="Drawing"
    export function rectangle(x1: number, y1: number, x2: number, y2: number, color: number = 1) {
        if (x1 > x2)
            x1 = [x2, x2 = x1][0];
        if (y1 > y2)
            y1 = [y2, y2 = y1][0];
        _DRAW = 0
        horizontalLine(x1, y1, x2 - x1 + 1, color)
        horizontalLine(x1, y2, x2 - x1 + 1, color)
        verticalLine(x1, y1, y2 - y1 + 1, color)
        verticalLine(x2, y1, y2 - y1 + 1, color)
        _DRAW = 1
        draw(1)
    }

    /**
     * invert display
     * @param d true: invert / false: normal, eg: true
     */
    //% blockId="OLED12864_I2C_INVERT" block="ディスプレイの色を反転 %d"
    //% weight=62 blockGap=8
    //% group="Scrolling Display"
    export function invert(d: boolean = true) {
        let n = (d) ? 0xA7 : 0xA6
        cmd1(n)
    }

    /**
     * clear screen
     */
    //% blockId="OLED12864_I2C_CLEAR" block="画面を初期化する"
    //% weight=85 blockGap=8
    //% group="Scrolling Display"
    export function clear() {
        _cx = _cy = 0
        _screen.fill(0)
        _screen[0] = 0x40
        draw(1)
    }

    /**
     * turn the display on / off. Display is ON by default.
     */
    //% blockId="OLED12864_I2C_ON" block="OD01 電源 %on"
    //% on.defl=1
    //% weight=10 blockGap=8
    //% group="Optional"
    //% on.shadow="toggleOnOff"
    export function display(on: boolean) {
        if (on)
            cmd1(0xAF);
        else
            cmd1(0xAE);
    }

    /**
     * power up the OD01. OD01 is initialised by default on startup. 
     */
    // % blockId="OLED12864_I2C_init" block="start OD01"
    // % weight=5 blockGap=8
    function init() {
        cmd1(0xAE)       // SSD1306_DISPLAYOFF
        cmd1(0xA4)       // SSD1306_DISPLAYALLON_RESUME
        cmd2(0xD5, 0xF0) // SSD1306_SETDISPLAYCLOCKDIV
        cmd2(0xA8, 0x3F) // SSD1306_SETMULTIPLEX
        cmd2(0xD3, 0x00) // SSD1306_SETDISPLAYOFFSET
        cmd1(0 | 0x0)    // line #SSD1306_SETSTARTLINE
        cmd2(0x8D, 0x14) // SSD1306_CHARGEPUMP
        cmd2(0x20, 0x00) // SSD1306_MEMORYMODE
        cmd3(0x21, 0, 127) // SSD1306_COLUMNADDR
        cmd3(0x22, 0, 63)  // SSD1306_PAGEADDR
        cmd1(0xa0 | 0x1) // SSD1306_SEGREMAP
        cmd1(0xc8)       // SSD1306_COMSCANDEC
        cmd2(0xDA, 0x12) // SSD1306_SETCOMPINS
        cmd2(0x81, 0xCF) // SSD1306_SETCONTRAST
        cmd2(0xd9, 0xF1) // SSD1306_SETPRECHARGE
        cmd2(0xDB, 0x40) // SSD1306_SETVCOMDETECT
        cmd1(0xA6)       // SSD1306_NORMALDISPLAY
        cmd2(0xD6, 0)    // zoom off
        cmd1(0xAF)       // SSD1306_DISPLAYON
        clear()
    }

    init();
} 
