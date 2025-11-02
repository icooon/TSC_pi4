// TSC Raspberry Pi Version - Simplified and Fixed
let p5Instance;

document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    
    // Initialize P5 sketch
    p5Instance = new p5(piSketch, 'sketch-container');
    
    // Button click handler
    generateBtn.addEventListener('click', function() {
        p5Instance.generateNewCard();
        generateBtn.textContent = 'צור קלף נוסף';
    });
    
    // Spacebar handler
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            p5Instance.generateNewCard();
            generateBtn.textContent = 'צור קלף נוסף';
        }
    });
});

function piSketch(p) {
    let canvas;
    let currentReading = '';
    
    // Canvas dimensions
    p.setup = function() {
        console.log('Starting setup...');
        
        // Calculate responsive size
        const maxWidth = Math.min(window.innerWidth * 0.4, 400);
        const maxHeight = Math.min(window.innerHeight * 0.8, 650);
        
        p.w = maxWidth;
        p.h = maxHeight;
        
        // Maintain TSC aspect ratio
        const ratio = 1.625;
        if (p.w / p.h > 1 / ratio) {
            p.w = p.h / ratio;
        } else {
            p.h = p.w * ratio;
        }
        
        canvas = p.createCanvas(p.w, p.h);
        console.log('Canvas created:', p.w, 'x', p.h);
        
        // Initialize variables
        p.initializeParameters();
        p.generateParameters();
        p.drawCard();
        p.generateReading();
        
        console.log('Setup complete');
    };
    
    p.initializeParameters = function() {
        // TSC color palette
        p.palette = ["#fff9ed","#825F33","#8A9A7C","#D19700","#B4693B","#C63F44","#416482","#EBD0D0","#6A5F93","#000000"];
        p.frameColors = [p.palette[0], p.palette[9]]; // white, black
        
        // Canvas setup
        p.margin = p.w * 0.015;
        p.masterSize = p.w * 0.97;
        p.strokeWeightValue = p.masterSize / 600;
    };
    
    p.generateParameters = function() {
        // Generate the 8 core parameters
        p.s1 = p.int(p.random(0, 10));  // Base element (0-9)
        p.s2 = p.int(p.random(0, 10));  // Main action (0-9)
        p.s3 = p.int(p.random(0, 10));  // Vision element (0-9)
        p.g1 = p.int(p.random(3, 7));   // Base density (3-6)
        p.g2 = p.int(p.random(3, 10));  // Vision density (3-9)
        p.rc2 = p.int(p.random(0, 9));  // Base color (0-8)
        p.rc3 = p.int(p.random(0, 9));  // Vision color (0-8)
        
        // Point of view (weighted)
        const povRand = p.random();
        if (povRand < 0.8) p.pv = 0;      // Normal 80%
        else if (povRand < 0.9) p.pv = 1; // Chaotic 10%
        else if (povRand < 0.95) p.pv = 2; // Fixed 5%
        else if (povRand < 0.98) p.pv = 3; // Dream 3%
        else p.pv = 4;                     // Light 2%
        
        console.log('Parameters:', {s1: p.s1, s2: p.s2, s3: p.s3, g1: p.g1, g2: p.g2, rc2: p.rc2, rc3: p.rc3});
    };
    
    p.drawCard = function() {
        // Background
        p.background(p.frameColors[0]);
        
        // Main card area
        p.fill(p.frameColors[1]);
        p.noStroke();
        p.rect(p.margin, p.margin, p.masterSize, p.h - p.margin * 2);
        
        // Draw simple patterns
        p.drawSimplePattern(p.s1, p.palette[p.rc2], p.g1, 0.3);
        p.drawSimplePattern(p.s3, p.palette[p.rc3], p.g2, 0.2);
        
        // Draw center symbol
        p.drawCenterSymbol(p.s2);
        
        // Frame
        p.stroke(p.frameColors[1]);
        p.strokeWeight(2);
        p.noFill();
        p.rect(p.margin, p.margin, p.masterSize, p.h - p.margin * 2);
    };
    
    p.drawSimplePattern = function(elementId, color, density, alpha) {
        p.push();
        
        const c = p.color(color);
        p.fill(p.red(c), p.green(c), p.blue(c), alpha * 255);
        p.stroke(p.frameColors[1]);
        p.strokeWeight(1);
        
        for (let i = 0; i < density; i++) {
            const x = p.margin + p.random(50, p.masterSize - 50);
            const y = p.margin + p.random(50, p.h - p.margin * 2 - 50);
            const size = 20 + p.random(20);
            
            switch (elementId % 4) {
                case 0: p.ellipse(x, y, size); break;
                case 1: p.rect(x - size/2, y - size/2, size, size); break;
                case 2: p.triangle(x, y - size/2, x - size/2, y + size/2, x + size/2, y + size/2); break;
                case 3: 
                    p.line(x - size/2, y, x + size/2, y);
                    p.line(x, y - size/2, x, y + size/2);
                    break;
            }
        }
        
        p.pop();
    };
    
    p.drawCenterSymbol = function(actionId) {
        p.push();
        
        const centerX = p.margin + p.masterSize / 2;
        const centerY = p.margin + (p.h - p.margin * 2) / 2;
        const size = 40;
        
        p.fill(p.frameColors[0]);
        p.stroke(p.frameColors[1]);
        p.strokeWeight(3);
        
        switch (actionId % 5) {
            case 0: p.ellipse(centerX, centerY, size); break;
            case 1: p.rect(centerX - size/2, centerY - size/2, size, size); break;
            case 2: p.triangle(centerX, centerY - size/2, centerX - size/2, centerY + size/2, centerX + size/2, centerY + size/2); break;
            case 3: 
                p.line(centerX - size/2, centerY, centerX + size/2, centerY);
                p.line(centerX, centerY - size/2, centerX, centerY + size/2);
                break;
            case 4:
                p.line(centerX - size/2, centerY - size/2, centerX + size/2, centerY + size/2);
                p.line(centerX + size/2, centerY - size/2, centerX - size/2, centerY + size/2);
                break;
        }
        
        p.pop();
    };
    
    p.generateReading = function() {
        if (typeof elementsData === 'undefined') {
            currentReading = `קלף מספר ${p.s2} עם אלמנט בסיס ${p.s1} וחזון ${p.s3}. השפעות: ${p.g1} ו-${p.g2}.`;
        } else {
            const baseElement = elementsData.elements[p.s1];
            const visionElement = elementsData.elements[p.s3];
            
            currentReading = `אתה במצב של ${baseElement.name.hebrew} ומכוון אל ${visionElement.name.hebrew}. ` +
                           `האלמנט הבסיסי יוצר ${baseElement.emotionalInfluence.hebrew} ` +
                           `והחזון מביא ${visionElement.emotionalInfluence.hebrew}.`;
        }
        
        // Update reading display
        const readingEl = document.getElementById('reading-content');
        if (readingEl) {
            readingEl.innerHTML = currentReading;
        }
    };
    
    p.generateNewCard = function() {
        p.generateParameters();
        p.drawCard();
        p.generateReading();
    };
    
    p.draw = function() {
        // Static drawing - no animation needed
        p.noLoop();
    };
}