// TSC Raspberry Pi Version - Authentic Original Design
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
    let layers = {};
    
    p.setup = function() {
        console.log('Starting authentic TSC setup...');
        
        // Calculate responsive size with proper TSC aspect ratio
        const maxWidth = Math.min(window.innerWidth * 0.4, 400);
        const maxHeight = Math.min(window.innerHeight * 0.8, 650);
        
        p.w = maxWidth;
        p.h = maxHeight;
        
        // TSC aspect ratio is 1:1.625
        const ratio = 1.625;
        if (p.w / p.h > 1 / ratio) {
            p.w = p.h / ratio;
        } else {
            p.h = p.w * ratio;
        }
        
        p.createCanvas(p.w, p.h);
        console.log('Canvas created:', p.w, 'x', p.h);
        
        p.initializeTSCSystem();
        p.generateParameters();
        p.drawAuthentic();
        p.generateReading();
        
        console.log('Authentic TSC setup complete');
    };
    
    p.initializeTSCSystem = function() {
        // TSC Color Palettes (authentic)
        p.colorPalettes = [
            ["#fff9ed","#654630","#9dbd82","#ffba08","#fdc09b","#fd353c","#2999c2","#a399c4","#89429e","#040825"],
            ["#F2EEE5","#4B3F35","#7F8C73","#D19700","#EE9E6D","#C63F44","#558BA6","#D3D3D3","#6A5F93","#040825"],
            ["#fff9ed","#825F33","#8A9A7C","#D19700","#B4693B","#C63F44","#416482","#EBD0D0","#6A5F93","#000000"]
        ];
        
        p.plt = 2; // Use palette 2 (authentic)
        p.palette = p.colorPalettes[p.plt];
        p.frameColors = [p.palette[0], p.palette[9]]; // white, black
        
        // TSC Layout parameters (authentic proportions)
        p.margin = p.w * 0.015;
        p.masterSize = p.w * 0.97;
        p.masterHeight = p.h * 0.95;
        p.strokeWeightValue = p.masterSize / 600;
        
        // Create graphics layers like original
        layers.l1 = p.createGraphics(p.w, p.h); // Base layer
        layers.l2 = p.createGraphics(p.w, p.h); // Vision layer
        layers.lCore = p.createGraphics(p.w, p.h); // Core action layer
        layers.lf = p.createGraphics(p.w, p.h); // Frame layer
        layers.m1 = p.createGraphics(p.w, p.h); // Mask 1
        layers.m2 = p.createGraphics(p.w, p.h); // Mask 2
        
        // Cell dimensions for patterns
        p.e1 = p.masterSize / 3; // Base cell size
        p.e2 = p.masterSize / 3; // Vision cell size
        p.hor = 0.75; // Horizontal position multiplier
    };
    
    p.generateParameters = function() {
        // Generate the authentic 8 TSC parameters
        p.pva = p.random(1, 1000);
        p.s1 = p.int(p.random(0, 10));  // Base element (0-9)
        p.s2 = p.int(p.random(0, 10));  // Main action (0-9)
        p.s3 = p.int(p.random(0, 10));  // Vision element (0-9)
        p.g1 = p.int(p.random(3, 7));   // Base density (3-6)
        p.g2 = p.int(p.random(3, 10));  // Vision density (3-9)
        p.rc2 = p.int(p.random(0, 9));  // Base color (0-8)
        p.rc3 = p.int(p.random(0, 9));  // Vision color (0-8)
        
        // Point of view with authentic weighted probability
        const povRand = p.random();
        if (povRand < 0.8) p.pv = 0;      // Normal 80%
        else if (povRand < 0.9) p.pv = 1; // Chaotic 10%
        else if (povRand < 0.95) p.pv = 2; // Fixed 5%
        else if (povRand < 0.98) p.pv = 3; // Dream 3%
        else p.pv = 4;                     // Light 2%
        
        console.log('TSC Parameters:', {
            pv: p.pv, s1: p.s1, s2: p.s2, s3: p.s3, 
            g1: p.g1, g2: p.g2, rc2: p.rc2, rc3: p.rc3
        });
    };
    
    p.drawAuthentic = function() {
        // Clear main canvas
        p.background(p.frameColors[0]);
        
        // Draw base layer pattern (authentic TSC wr function)
        p.wr(true, layers.l1, 0, 0, p.s1, p.e1, p.palette[p.rc2], p.frameColors[1], 1);
        
        // Draw vision layer pattern
        p.wr(true, layers.l2, 0, 0, p.s3, p.e2, p.palette[p.rc3], p.frameColors[1], 1);
        
        // Create masks
        p.mM(layers.m1, 0, p.e1);
        p.mM(layers.m2, p.s2, p.e2);
        
        // Apply masks and composite layers (simplified masking)
        p.image(layers.l1, 0, 0);
        p.image(layers.l2, 0, 0);
        
        // Draw core action symbol
        p.makeCore();
        p.image(layers.lCore, 0, 0);
        
        // Draw frame
        p.drawFrame();
    };
    
    // Authentic TSC pattern generator (wr function)
    p.wr = function(isPatt, l, xd, yd, sign, cell, bg_color, st_color, isCaos) {
        let sz = cell;
        let h5;
        
        l.stroke(st_color);
        l.fill(bg_color);
        
        if (bg_color == 0) {
            l.noFill();
        }
        
        let ax, bx, ay, by;
        if (isPatt == true) {
            l.background(bg_color);
            ax = p.margin + xd / 2;
            bx = p.masterSize;
            ay = p.margin;
            by = p.masterHeight;
        } else {
            ax = cell + xd;
            bx = cell + xd;
            ay = cell + yd;
            by = cell + yd;
        }
        
        for (let x = ax; x <= bx; x += cell) {
            for (let y = ay; y <= by; y += cell) {
                if (isCaos == 0) {
                    sign = p.int(p.random(0, 9));
                }
                
                switch (sign) {
                    case 7: // Eye/oval shape
                        h5 = sz * 0.85;
                        l.beginShape();
                        l.vertex(x - sz, y);
                        l.bezierVertex(x - sz / 3, y + h5, x + sz / 3, y + h5, x + sz, y);
                        l.bezierVertex(x + sz / 3, y - h5, x - sz / 3, y - h5, x - sz, y);
                        l.endShape();
                        break;
                        
                    case 2: // Horizontal line
                        l.line(x - sz, y, x + sz, y);
                        break;
                        
                    case 4: // Arc/curve
                        h5 = sz * 1.4;
                        l.noFill();
                        l.beginShape();
                        l.vertex(x - sz, y + sz);
                        l.vertex(x - sz, y);
                        l.bezierVertex(x - sz, y - h5, x + sz, y - h5, x + sz, y);
                        l.vertex(x + sz, y + sz);
                        l.endShape();
                        break;
                        
                    case 0: // Crystal/diamond pattern
                        l.line(x - sz, y - sz, x + sz, y + sz);
                        l.line(x + sz, y + sz, x + sz, y - sz);
                        l.line(x - sz, y + sz, x + sz, y - sz);
                        break;
                        
                    case 6: // Flow/wave
                        h5 = sz * 3;
                        l.noFill();
                        l.beginShape();
                        l.vertex(x - sz, y);
                        l.bezierVertex(x - sz / 3, y + h5, x + sz / 3, y - h5, x + sz, y);
                        l.endShape();
                        break;
                        
                    case 5: // Fight/conflict
                        l.line(x - sz, y - sz, x, y);
                        l.line(x, y, x + sz, y - sz);
                        l.line(x, y - sz, x, y + sz);
                        break;
                        
                    case 1: // Hold/step pattern
                        l.line(x - sz, y - sz, x, y - sz);
                        l.line(x, y - sz, x, y);
                        l.line(x, y, x + sz, y);
                        l.line(x + sz, y, x + sz, y + sz);
                        break;
                        
                    case 8: // Visit/path
                        l.line(x - sz, y + sz, x + sz, y - sz);
                        l.line(x + sz, y - sz, x + sz, y + sz);
                        break;
                        
                    case 9: // End/cross
                        l.line(x - sz, y - sz, x + sz, y + sz);
                        l.line(x - sz, y + sz, x + sz, y - sz);
                        break;
                        
                    case 3: // Heal/medicine
                        l.line(x - sz, y + sz, x + sz, y - sz);
                        l.line(x + sz, y - sz, x, y - sz);
                        l.line(x, y - sz, x, y + sz);
                        break;
                }
            }
        }
    };
    
    // Mask creation (simplified version of original mM function)
    p.mM = function(maskLayer, type, cell) {
        maskLayer.background(255);
        maskLayer.fill(0);
        maskLayer.noStroke();
        
        // Create different mask shapes based on type
        switch (type) {
            case 0: // Default rectangular mask
                maskLayer.rect(p.margin, p.margin, p.masterSize, p.masterHeight);
                break;
            default: // Centered circular/organic mask
                let centerX = p.margin + p.masterSize / 2;
                let centerY = p.margin + p.masterHeight / 2;
                maskLayer.ellipse(centerX, centerY, p.masterSize * 0.8, p.masterHeight * 0.6);
                break;
        }
    };
    
    // Authentic TSC core action symbols
    p.makeCore = function() {
        layers.lCore.clear();
        layers.lCore.stroke(p.frameColors[1]);
        layers.lCore.fill(p.frameColors[0]);
        
        let centerX = p.margin + p.masterSize / 2;
        let centerY = p.margin + p.e1 * p.hor;
        
        switch (p.s2) {
            case 0: // Crystalize
                // Diamond pattern with internal structure
                let size = p.masterSize / (p.g1 * 1.5);
                layers.lCore.beginShape();
                layers.lCore.vertex(centerX, centerY - size);
                layers.lCore.vertex(centerX + size, centerY);
                layers.lCore.vertex(centerX, centerY + size);
                layers.lCore.vertex(centerX - size, centerY);
                layers.lCore.endShape(p.CLOSE);
                break;
                
            case 1: // Hold
                // Rectangular pillars
                let pillarWidth = p.e1 / p.g1;
                layers.lCore.rect(p.margin, p.margin, pillarWidth, p.masterHeight);
                layers.lCore.rect(p.w - p.margin - pillarWidth, p.margin, pillarWidth, p.masterHeight);
                break;
                
            case 2: // Settle
                // Horizontal foundation line
                layers.lCore.line(p.margin, centerY, p.w - p.margin, centerY);
                break;
                
            case 3: // Heal
                // Cross with healing symbol
                let crossSize = p.masterSize / (p.g1 * 2);
                layers.lCore.line(centerX - crossSize, centerY, centerX + crossSize, centerY);
                layers.lCore.line(centerX, centerY - crossSize, centerX, centerY + crossSize);
                layers.lCore.ellipse(centerX, centerY, crossSize * 0.5);
                break;
                
            case 4: // Teleport
                // Portal/arch shape
                layers.lCore.noFill();
                layers.lCore.beginShape();
                layers.lCore.vertex(p.margin, p.masterHeight + p.margin);
                layers.lCore.bezierVertex(p.margin, centerY - p.e1, p.w - p.margin, centerY - p.e1, p.w - p.margin, p.masterHeight + p.margin);
                layers.lCore.endShape();
                break;
                
            case 5: // Fight
                // Sword/conflict symbol
                layers.lCore.line(centerX, p.margin, centerX, p.masterHeight + p.margin);
                layers.lCore.line(p.margin, centerY - p.e1/2, centerX, centerY);
                layers.lCore.line(p.w - p.margin, centerY - p.e1/2, centerX, centerY);
                break;
                
            case 6: // Flow
                // Wave pattern
                layers.lCore.noFill();
                layers.lCore.beginShape();
                layers.lCore.vertex(p.margin, centerY);
                layers.lCore.bezierVertex(p.margin + p.masterSize/3, centerY + p.e1, p.margin + 2*p.masterSize/3, centerY - p.e1, p.w - p.margin, centerY);
                layers.lCore.endShape();
                break;
                
            case 7: // Look
                // Eye symbol
                let eyeSize = p.masterSize / (p.g1 * 1.2);
                layers.lCore.fill(p.palette[p.rc2]);
                layers.lCore.ellipse(centerX, centerY, eyeSize);
                layers.lCore.fill(p.frameColors[0]);
                layers.lCore.ellipse(centerX, centerY, eyeSize * 0.8);
                break;
                
            case 8: // Visit
                // Door/pathway
                layers.lCore.beginShape();
                layers.lCore.vertex(centerX - p.masterSize/(p.g1 * 5), centerY);
                layers.lCore.vertex(centerX + p.masterSize/(p.g1 * 5), centerY);
                layers.lCore.vertex(p.w - p.margin * 10, p.masterHeight + p.margin);
                layers.lCore.vertex(p.margin * 10, p.masterHeight + p.margin);
                layers.lCore.endShape(p.CLOSE);
                break;
                
            case 9: // End
                // X with circle
                let endSize = p.masterSize / (p.g1 * 0.6);
                layers.lCore.ellipse(centerX, centerY, endSize);
                layers.lCore.line(centerX - endSize/2, centerY - endSize/2, centerX + endSize/2, centerY + endSize/2);
                layers.lCore.line(centerX - endSize/2, centerY + endSize/2, centerX + endSize/2, centerY - endSize/2);
                break;
        }
    };
    
    p.drawFrame = function() {
        // Draw authentic TSC frame
        p.stroke(p.frameColors[1]);
        p.fill(p.frameColors[0]);
        p.noFill();
        p.rect(p.margin, p.margin, p.masterSize, p.masterHeight);
        
        // Add frame details
        p.fill(p.frameColors[0]);
        p.rect(0, 0, p.margin, p.h); // Left margin
        p.rect(p.w - p.margin, 0, p.margin, p.h); // Right margin
        p.rect(0, 0, p.w, p.margin); // Top margin
        p.rect(0, p.h - p.margin, p.w, p.margin); // Bottom margin
    };
    
    p.generateReading = function() {
        if (typeof elementsData === 'undefined') {
            currentReading = `קלף מספר ${p.s2} עם אלמנט בסיס ${p.s1} וחזון ${p.s3}. ` +
                           `השפעת הבסיס: ${p.g1}, השפעת החזון: ${p.g2}.`;
        } else {
            const baseElement = elementsData.elements[p.s1];
            const visionElement = elementsData.elements[p.s3];
            const actionId = p.s2;
            
            if (readingTemplates[actionId]) {
                currentReading = readingTemplates[actionId].hebrew(
                    baseElement, 
                    visionElement, 
                    p.g1, 
                    p.g2
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
        p.drawAuthentic();
        p.generateReading();
    };
    
    p.draw = function() {
        p.noLoop();
    };
}