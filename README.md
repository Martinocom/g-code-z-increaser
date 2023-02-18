# g-code-z-increaser

I made this code for my old Anet A8 3D printer. In order to make the filament stick to the bed, I needed to print it very close to the bed. But then subsequent layers was squished, since height was not correct.

This node.js script just takes and increases all the Z coordinates by +0.2mm after the first Z is encountered.

If someone is wondering how this works:
![It works](https://i.redd.it/rskneik2r4h41.jpg)

For example:

```
M107 ;start with the fan off
G28 X0 Y0 ;move X/Y to min endstops
G28 Z0 ;move Z to min endstops
G1 Z15.0 F9000 ;move the platform down 15mm

// At this point the program found the first reference to Z
// Does nothing, just set isFirstZFound = true

G92 E0 ;zero the extruded length
G1 F200 E3 ;extrude 3mm of feed stock
G92 E0 ;zero the extruded length again
G1 F9000
M117 Printing...
G92 E0
G92 E0
G1 F1500 E-6.5
;LAYER_COUNT:104
;LAYER:0
M107
M204 T1000
G0 F7500 X62.565 Y94.134 Z0.3

// At this point the program found the first reference to correct Z
// Does nothing, just set isFirstZAlreadyPassed = true

G0 X61.179 Y97.424
M204 P1000
;TYPE:SKIRT
...
G0 F7500 X66.818 Y105.709
G1 F1500 X65.879 Y104.77 E183.89897
G0 F7500 X65.879 Y105.477
M104 S200
G1 F1500 X66.32 Y105.918 E183.93786
G1 F1500 E177.43786
;MESH:NONMESH
G0 F300 X66.32 Y105.918 Z0.5

// At this point the program found the second reference to correct Z
// It needs to change it and increase by 0.2.
// The output will be => G0 F300 X66.32 Y105.918 Z0.7

G0 F7500 X65.33 Y105.918
G0 X64.94 Y107.518
...
G1 F1500 X122.344 Y99.687 E117.69585
;TIME_ELAPSED:4690.248696
G1 F1500 E111.19585
M204 P500

// At this point program already set the last Z so subsequent strings containing Z
// are just ignored. Add all the rest of the file as is.

M204 T500
M107
M117 Positioning
...
```


G Code Z Increaser
G-Code ZIncreaser
G-Code Z Increase
