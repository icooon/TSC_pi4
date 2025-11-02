// TSC Raspberry Pi Version - More Precise Original Implementation
let p5Instance;

document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    
    p5Instance = new p5(piSketch, 'sketch-container');
    
    generateBtn.addEventListener('click', function() {
        p5Instance.generateNewCard();
        generateBtn.textContent = 'צור קלף נוסף';
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            p5Instance.generateNewCard();
            generateBtn.textContent = 'צור קלף נוסף';
        }
    });
});

function piSketch(p) {
    let currentReading = '';
    
    p.setup = function() {
        console.log('Starting precise TSC setup...');
        
        // Calculate responsive size with exact TSC proportions
        const maxWidth = Math.min(window.innerWidth * 0.4, 400);
        const maxHeight = Math.min(window.innerHeight * 0.8, 650);
        
        p.w = maxWidth;
        p.h = maxHeight;
        
        // TSC exact aspect ratio
        p.ratio = 1.625;
        p.as = 1/p.ratio;
        
        if(p.w / p.h < p.as) { // w = max
            p.h = p.w * p.ratio;
        } else { // h = max  
            p.w = p.h * p.as;
        }
        
        p.createCanvas(p.w, p.h);
        
        p.initializePreciseSystem();
        p.generateParameters();
        p.drawPrecise();
        p.generateReading();
        
        console.log('Precise TSC setup complete');
    };
    
    p.initializePreciseSystem = function() {
        // Exact TSC color palettes from original
        p.Cl = [
            ["#fff9ed","#654630","#9dbd82","#ffba08","#fdc09b","#fd353c","#2999c2","#a399c4","#89429e","#040825"],
            ["#F2EEE5","#4B3F35","#7F8C73","#D19700","#EE9E6D","#C63F44","#558BA6","#D3D3D3","#6A5F93","#040825"],
            ["#fff9ed","#825F33","#8A9A7C","#D19700","#B4693B","#C63F44","#416482","#EBD0D0","#6A5F93","#000000"]
        ];
        
        // Use palette 2 like original
        p.plt = 2;
        p.sc1 = p.Cl[p.plt];
        p.bc2 = p.Cl[p.plt];
        p.bc3 = p.Cl[p.plt];
        p.c1 = [p.Cl[p.plt][0], p.Cl[p.plt][9]]; // white, black
        
        // Exact TSC layout parameters
        p.mrg = p.w * 0.015; // margin
        p.ms = p.w * 0.97;   // master size
        p.msh = p.h * 0.95;  // master height
        p.gsw = p.ms / 600;  // stroke weight
        
        // Create exact layer structure
        p.l1 = p.createGraphics(p.w, p.h);    // Base layer
        p.l2 = p.createGraphics(p.w, p.h);    // Vision layer
        p.lCore = p.createGraphics(p.w, p.h); // Core layer
        p.lf = p.createGraphics(p.w, p.h);    // Frame layer
        p.m1 = p.createGraphics(p.w, p.h);    // Mask 1
        p.m2 = p.createGraphics(p.w, p.h);    // Mask 2
        
        // TSC parameters
        p.e1 = p.ms / 3;  // Base cell size
        p.e2 = p.ms / 3;  // Vision cell size
        p.hor = 0.75;     // Horizontal multiplier
        p.xg = 0.2;
        p.xg2 = 1 - p.xg;
        
        // Color indices
        p.rsc2 = 9;
        p.rsc3 = 9;
        p.baw = 1;
        p.wab = 0;
        p.co = 0;
        p.isc = 1;
    };
    
    p.generateParameters = function() {
        // Generate exact TSC 8 parameters
        p.pva = p.random(1, 1000);
        p.s1 = p.int(p.random(0, 10));  // Base element
        p.s2 = p.int(p.random(0, 10));  // Main action  
        p.s3 = p.int(p.random(0, 10));  // Vision element
        p.g1 = p.int(p.random(3, 7));   // Base density
        p.g2 = p.int(p.random(3, 10));  // Vision density
        p.rc2 = p.int(p.random(0, 9));  // Base color
        p.rc3 = p.int(p.random(0, 9));  // Vision color
        
        // Point of view calculation
        const povRand = p.random();
        if (povRand < 0.8) p.pv = 0;
        else if (povRand < 0.9) p.pv = 1;
        else if (povRand < 0.95) p.pv = 2; 
        else if (povRand < 0.98) p.pv = 3;
        else p.pv = 4;
        
        console.log('Precise TSC Parameters:', {
            pv: p.pv, s1: p.s1, s2: p.s2, s3: p.s3,
            g1: p.g1, g2: p.g2, rc2: p.rc2, rc3: p.rc3
        });
    };
    
    p.drawPrecise = function() {
        // Follow exact original sequence
        p.noFill();
        
        // Generate base and vision patterns exactly like original
        p.wr(true, p.l1, 0, 0, p.s1, p.e1, p.bc2[p.rc2], p.sc1[p.rsc2], p.isc);
        p.wr(true, p.l2, 0, 0, p.s3, p.e2, p.bc2[p.rc3], p.sc1[p.rsc3], 1);
        
        // Create masks exactly like original
        p.mM(p.m1, 0, p.e1);
        p.mM(p.m2, p.s2, p.e2);
        
        // Apply masking and composition like original
        let mi1 = p.pgMask(p.l1, p.m1);
        p.image(mi1, 0, 0);
        let mi2 = p.pgMask(p.l2, p.m2);
        p.image(mi2, 0, 0);
        
        // Background and second masking pass
        p.background(p.c1[p.wab]);
        
        p.mM(p.m1, 10, p.e1);
        p.mM(p.m2, p.s2, p.e2);
        let mi1_2 = p.pgMask(p.l1, p.m1);
        p.image(mi1_2, 0, 0);
        let mi2_2 = p.pgMask(p.l2, p.m2);
        p.image(mi2_2, 0, 0);
        
        // Core drawing
        p.preCore();
        p.image(p.lCore, 0, 0);
        p.makeCore();
        
        // Frame masking
        p.fill(p.c1[p.wab]);
        p.noStroke();
        p.rect(0, 0, p.mrg, p.h);
        p.rect(p.w - p.mrg, 0, p.mrg, p.h);
        p.rect(0, 0, p.w, p.mrg);
        p.rect(0, p.h - p.mrg, p.w, p.mrg);
    };
    
    // Exact original wr function with all patterns
    p.wr = function(isPatt, l, xd, yd, sign, cell, bg_color, st_color, isCaos) {
        let sz = cell;
        let h5;
        
        l.stroke(st_color);
        l.fill(bg_color);
        
        if(bg_color == 0) {
            l.noFill();
        }
        
        let ax, bx, ay, by;
        if(isPatt == true) {
            l.background(bg_color);
            ax = p.mrg + xd / 2;
            bx = p.ms;
            ay = p.mrg;
            by = p.msh;
        } else {
            ax = cell + xd;
            bx = cell + xd;
            ay = cell + yd;
            by = cell + yd;
        }
        
        for(let x = ax; x <= bx; x += cell) {
            for(let y = ay; y <= by; y += cell) {
                if (isCaos == 0) {
                    sign = p.int(p.random(0, 9));
                }
                
                // All 10 original patterns exactly as written
                switch (sign) {
                    case 7: // Look pattern
                        h5 = sz * 0.85;
                        l.beginShape();
                        l.vertex(x - sz, y);
                        l.bezierVertex(x - sz / 3, y + h5, x + sz / 3, y + h5, x + sz, y);
                        l.bezierVertex(x + sz / 3, y - h5, x - sz / 3, y - h5, x - sz, y);
                        l.endShape();
                        break;
                        
                    case 2: // Settle pattern  
                        l.line(x-sz,y,x+sz,y);
                        break;
                        
                    case 4: // Teleport pattern
                        h5 = sz*1.4;
                        l.noFill();
                        l.beginShape();
                        l.vertex(x-sz,y+sz);
                        l.vertex(x-sz,y);
                        l.bezierVertex(x-sz,y-h5,x+sz,y-h5,x+sz,y);
                        l.vertex(x+sz,y+sz);
                        l.endShape();
                        break;
                        
                    case 0: // Crystalize pattern
                        l.line(x-sz,y-sz,x+sz,y+sz);
                        l.line(x+sz,y+sz,x+sz,y-sz);
                        l.line(x-sz,y+sz,x+sz,y-sz);
                        break;
                        
                    case 6: // Flow pattern
                        h5 = sz*3;
                        l.noFill();
                        l.beginShape();
                        l.vertex(x-sz,y);
                        l.bezierVertex(x-sz/3,y+h5,x+sz/3,y-h5,x+sz,y);
                        l.endShape();
                        break;
                        
                    case 5: // Fight pattern
                        l.line(x-sz,y-sz,x,y);
                        l.line(x,y,x+sz,y-sz);
                        l.line(x,y-sz,x,y+sz);
                        break;
                        
                    case 1: // Hold pattern
                        l.line(x-sz,y-sz,x,y-sz);
                        l.line(x,y-sz,x,y);
                        l.line(x,y,x+sz,y);
                        l.line(x+sz,y,x+sz,y+sz);
                        break;
                        
                    case 8: // Visit pattern
                        l.line(x-sz,y+sz,x+sz,y-sz);
                        l.line(x+sz,y-sz,x+sz,y+sz);
                        break;
                        
                    case 9: // End pattern
                        l.line(x-sz,y-sz,x+sz,y+sz);
                        l.line(x-sz,y+sz,x+sz,y-sz);
                        break;
                        
                    case 3: // Heal pattern
                        l.line(x - sz, y + sz, x + sz, y - sz);
                        l.line(x + sz, y - sz, x, y - sz);
                        l.line(x, y - sz, x, y + sz);
                        break;
                }
            }
        }
    };
    
    // Exact original mM masking function
    p.mM = function(mN, mT, cell) {
        mN.fill(255);
        mN.noStroke();
        mN.background(0);
        
        switch (mT) {
            case 7:
                mN.beginShape();
                mN.vertex(p.mrg + p.ms * 0.5, p.mrg + p.e1 * p.hor);
                mN.vertex(p.mrg + p.ms * 0.5, p.mrg + p.e1 * p.hor);
                mN.vertex(p.w - p.mrg, p.msh + p.mrg);
                mN.vertex(p.mrg, p.msh + p.mrg);
                mN.endShape(p.CLOSE);
                break;
                
            case 2:
                mN.beginShape();
                mN.vertex(p.mrg, p.mrg + p.e1 * p.hor);
                mN.vertex(p.w - p.mrg, p.mrg + p.e1 * p.hor);
                mN.vertex(p.w - p.mrg, p.msh + p.mrg);
                mN.vertex(p.mrg, p.msh + p.mrg);
                mN.endShape(p.CLOSE);
                break;
                
            case 4:
                mN.beginShape();
                mN.vertex(p.mrg + p.ms * p.xg, p.msh * 0.6);
                mN.bezierVertex(p.mrg + p.ms * p.xg, p.msh * 0.4 - (p.ms / 5 * 0.6666), p.mrg + p.ms * p.xg2, p.msh * 0.4 - (p.ms / 5 * 0.6666), p.mrg + p.ms * p.xg2, p.msh * 0.6);
                mN.vertex(p.mrg + p.ms * p.xg2, p.msh + p.mrg);
                mN.vertex(p.mrg + p.ms * p.xg, p.msh + p.mrg);
                mN.endShape(p.CLOSE);
                break;
                
            case 3:
                mN.ellipse(p.mrg + p.ms / 2, p.msh / 1, p.ms, p.ms);
                break;
                
            case 0:
            case 10:
            default:
                mN.rect(p.mrg, p.mrg, p.ms, p.msh);
                break;
        }
    };
    
    // Original pgMask function
    p.pgMask = function(_content, _mask) {
        let img = p.createImage(p.int(_mask.width), p.int(_mask.height));
        img.copy(_mask, 0, 0, _mask.width, _mask.height, 0, 0, _mask.width, _mask.height);
        
        img.loadPixels();
        for (let i = 0; i < img.pixels.length; i += 4) {
            let v = img.pixels[i];
            img.pixels[i] = 0;
            img.pixels[i+1] = 0;
            img.pixels[i+2] = 0;
            img.pixels[i+3] = v;
        }
        img.updatePixels();
        
        let contentImg = p.createImage(_content.width, _content.height);
        contentImg.copy(_content, 0, 0, _content.width, _content.height, 0, 0, _content.width, _content.height);
        contentImg.mask(img);
        return contentImg;
    };
    
    // Pre-core layer preparation
    p.preCore = function() {
        // Add core preparation if needed
    };
    
    // Original makeCore function (simplified version for key actions)
    p.makeCore = function() {
        p.stroke(p.c1[p.baw]);
        
        switch(p.s2) {
            case 2: // Settle
                p.line(p.mrg, p.mrg + p.e1 * p.hor, p.w - p.mrg, p.mrg + p.e1 * p.hor);
                break;
                
            case 1: // Hold
                p.rect(p.mrg, p.mrg, p.e1, p.msh);
                p.rect(p.w - p.mrg - p.e1, p.mrg, p.e1, p.msh);
                break;
                
            case 7: // Look
                p.fill(p.sc1[p.rsc2]);
                p.stroke(p.c1[1]);
                p.ellipse(p.mrg + p.ms / 2, p.mrg + p.e1 * p.hor, p.ms / (p.g1 * 1));
                p.fill(255);
                p.ellipse(p.mrg + p.ms / 2, p.mrg + p.e1 * p.hor, p.ms / (p.g1 * 1) * 0.8);
                break;
                
            case 9: // End
                p.stroke(p.c1[p.baw]);
                p.beginShape();
                p.vertex(p.mrg, p.msh + p.mrg);
                p.bezierVertex(p.ms / 2 - p.e1, p.e1 * p.hor * 0.5, p.ms / 2 + p.e1, p.e1 * p.hor * 0.5, p.w - p.mrg, p.msh + p.mrg);
                p.vertex(p.w - p.mrg, p.msh + p.mrg);
                p.endShape(p.CLOSE);
                p.fill(p.c1[p.wab]);
                p.ellipse(p.mrg + p.ms / 2, p.mrg + p.e1 * p.hor, p.ms / (p.g1 * 0.6));
                break;
        }
    };
    
    p.generateReading = function() {
        if (typeof elementsData === 'undefined') {
            currentReading = `קלף מספר ${p.s2} עם אלמנט בסיס ${p.s1} וחזון ${p.s3}. השפעות: ${p.g1} ו-${p.g2}.`;
        } else {
            const baseElement = elementsData.elements[p.s1];
            const visionElement = elementsData.elements[p.s3];
            const actionId = p.s2;
            
            if (readingTemplates[actionId]) {
                currentReading = readingTemplates[actionId].hebrew(
                    baseElement, visionElement, p.g1, p.g2
                );
            } else {
                currentReading = `אתה במצב של ${baseElement.name.hebrew} ומכוון אל ${visionElement.name.hebrew}. ` +
                               `האלמנט הבסיסי יוצר ${baseElement.emotionalInfluence.hebrew} ` +
                               `והחזון מביא ${visionElement.emotionalInfluence.hebrew}.`;
            }
        }
        
        const readingEl = document.getElementById('reading-content');
        if (readingEl) {
            readingEl.innerHTML = currentReading;
        }
    };
    
    p.generateNewCard = function() {
        p.generateParameters();
        p.drawPrecise();
        p.generateReading();
    };
    
    p.draw = function() {
        p.noLoop();
    };
}