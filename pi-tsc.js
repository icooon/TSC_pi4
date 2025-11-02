// TSC Raspberry Pi Version - Simplified Card Generation
let p5Instance;

document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const readingContent = document.getElementById('reading-content');
    
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
        
        // Initialize variables
        p.initializeParameters();
        p.generateParameters();
        p.drawCard();
        p.generateReading();
    };
    
    p.initializeParameters = function() {
        // TSC color palettes
        p.colorPalettes = [
            ["#fff9ed","#654630","#9dbd82","#ffba08","#fdc09b","#fd353c","#2999c2","#a399c4","#89429e","#040825"],
            ["#F2EEE5","#4B3F35","#7F8C73","#D19700","#EE9E6D","#C63F44","#558BA6","#D3D3D3","#6A5F93","#040825"],
            ["#fff9ed","#825F33","#8A9A7C","#D19700","#B4693B","#C63F44","#416482","#EBD0D0","#6A5F93","#000000"]
        ];
        
        p.palette = p.colorPalettes[2]; // Use palette 2 as default
        p.frameColors = [p.palette[0], p.palette[9]]; // white, black
        
        // Canvas setup
        p.margin = p.w * 0.015;
        p.masterSize = p.w * 0.97;
        p.strokeWeightValue = p.masterSize / 600;
        p.cellSize = p.masterSize / 3;
    };
    
    p.generateParameters = function() {
        // Generate the 8 core parameters
        p.pva = p.random(1, 1000);
        p.s1 = p.int(p.random(0, 10));  // Base element (0-9)
        p.s2 = p.int(p.random(0, 10));  // Main action (0-9)
        p.s3 = p.int(p.random(0, 10));  // Vision element (0-9)
        p.g1 = p.int(p.random(3, 7));   // Base density (3-6)
        p.g2 = p.int(p.random(3, 10));  // Vision density (3-9)
        p.rc2 = p.int(p.random(0, 9));  // Base color (0-8)
        p.rc3 = p.int(p.random(0, 9));  // Vision color (0-8)
        
        // Calculate point of view with weighted probability
        const povRand = p.random();
        if (povRand < 0.8) p.pv = 0;      // Normal 80%
        else if (povRand < 0.9) p.pv = 1; // Chaotic 10%
        else if (povRand < 0.95) p.pv = 2; // Fixed 5%
        else if (povRand < 0.98) p.pv = 3; // Dream 3%
        else p.pv = 4;                     // Light 2%
        
        console.log('Generated parameters:', {
            pv: p.pv, s1: p.s1, s2: p.s2, s3: p.s3, 
            g1: p.g1, g2: p.g2, rc2: p.rc2, rc3: p.rc3
        });
    };
    
    p.drawCard = function() {
        p.background(p.frameColors[0]);
        
        // Draw main card area
        p.fill(p.frameColors[1]);
        p.noStroke();
        p.rect(p.margin, p.margin, p.masterSize, p.h - p.margin * 2);
        
        // Draw base layer pattern
        p.drawElementPattern(p.s1, p.palette[p.rc2], p.g1, true);
        
        // Draw vision layer pattern  
        p.drawElementPattern(p.s3, p.palette[p.rc3], p.g2, false);
        
        // Draw core action symbol
        p.drawCoreAction(p.s2);
        
        // Draw frame elements
        p.drawFrame();
    };
    
    p.drawElementPattern = function(elementId, color, density, isBase) {
        p.push();
        p.translate(p.margin, p.margin);
        
        const element = elementsData.elements[elementId];
        p.fill(color);
        p.stroke(p.frameColors[1]);
        p.strokeWeight(p.strokeWeightValue);
        
        // Simple geometric patterns based on element
        const patternSize = p.masterSize / (density + 2);
        const alpha = isBase ? 150 : 100;
        
        // Set color with alpha
        const c = p.color(color);
        p.fill(p.red(c), p.green(c), p.blue(c), alpha);
        
        for (let i = 0; i < density; i++) {
            const x = p.random(patternSize, p.masterSize - patternSize);
            const y = p.random(patternSize, p.h - p.margin * 4 - patternSize);
            
            switch (elementId) {
                case 0: // Crystalize - diamonds
                    p.drawDiamond(x, y, patternSize);
                    break;
                case 1: // Hold - rectangles
                    p.rect(x - patternSize/2, y - patternSize/2, patternSize, patternSize/2);
                    break;
                case 2: // Settle - horizontal lines
                    p.line(x - patternSize/2, y, x + patternSize/2, y);
                    break;
                case 3: // Heal - crosses
                    p.drawCross(x, y, patternSize);
                    break;
                case 4: // Teleport - arcs
                    p.noFill();
                    p.arc(x, y, patternSize, patternSize, 0, p.PI);
                    break;
                case 5: // Fight - triangles
                    p.triangle(x, y - patternSize/2, x - patternSize/2, y + patternSize/2, x + patternSize/2, y + patternSize/2);
                    break;
                case 6: // Flow - waves
                    p.drawWave(x, y, patternSize);
                    break;
                case 7: // Look - circles
                    p.ellipse(x, y, patternSize);
                    break;
                case 8: // Visit - triangular path
                    p.drawPath(x, y, patternSize);
                    break;
                case 9: // End - X shape
                    p.drawX(x, y, patternSize);
                    break;
            }
        }
        p.pop();
    };
    
    p.drawCoreAction = function(actionId) {
        p.push();
        const centerX = p.margin + p.masterSize / 2;
        const centerY = p.margin + (p.h - p.margin * 2) / 2;
        const size = p.masterSize / 6;
        
        p.fill(p.frameColors[0]);
        p.stroke(p.frameColors[1]);
        p.strokeWeight(p.strokeWeightValue * 3);
        
        switch (actionId) {
            case 0: // Crystalize
                p.drawDiamond(centerX, centerY, size);
                break;
            case 1: // Hold
                p.rect(centerX - size/2, centerY - size/4, size, size/2);
                break;
            case 2: // Settle
                p.line(centerX - size/2, centerY, centerX + size/2, centerY);
                break;
            case 3: // Heal
                p.drawCross(centerX, centerY, size);
                break;
            case 4: // Teleport
                p.noFill();
                p.arc(centerX, centerY, size, size, 0, p.PI);
                p.line(centerX - size/2, centerY, centerX + size/2, centerY);
                break;
            case 5: // Fight
                p.line(centerX, centerY - size/2, centerX, centerY + size/2);
                p.triangle(centerX - size/4, centerY - size/4, centerX, centerY, centerX + size/4, centerY - size/4);
                break;
            case 6: // Flow
                p.drawWave(centerX, centerY, size);
                break;
            case 7: // Look
                p.ellipse(centerX, centerY, size);
                p.ellipse(centerX, centerY, size/2);
                break;
            case 8: // Visit
                p.drawPath(centerX, centerY, size);
                break;
            case 9: // End
                p.drawX(centerX, centerY, size);
                break;
        }
        p.pop();
    };
    
    p.drawFrame = function() {
        // Draw simple frame
        p.stroke(p.frameColors[1]);
        p.strokeWeight(p.strokeWeightValue * 2);
        p.noFill();
        p.rect(p.margin, p.margin, p.masterSize, p.h - p.margin * 2);
    };
    
    // Helper drawing functions
    p.drawDiamond = function(x, y, size) {
        const half = size / 2;
        p.quad(x, y - half, x + half, y, x, y + half, x - half, y);
    };
    
    p.drawCross = function(x, y, size) {
        const half = size / 2;
        p.line(x, y - half, x, y + half);
        p.line(x - half, y, x + half, y);
    };
    
    p.drawWave = function(x, y, size) {
        p.noFill();
        p.beginShape();
        for (let i = 0; i <= size; i += 5) {
            const waveY = y + p.sin((i / size) * p.TWO_PI) * size/4;
            p.vertex(x - size/2 + i, waveY);
        }
        p.endShape();
    };
    
    p.drawPath = function(x, y, size) {
        const half = size / 2;
        p.line(x - half, y + half, x + half, y - half);
        p.line(x + half, y - half, x + half, y + half);
    };
    
    p.drawX = function(x, y, size) {
        const half = size / 2;
        p.line(x - half, y - half, x + half, y + half);
        p.line(x + half, y - half, x - half, y + half);
    };
    
    p.generateReading = function() {
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
            currentReading = `קלף ${baseElement.name.hebrew} עם חזון של ${visionElement.name.hebrew}. ` +
                           `השפעת הבסיס: ${densityTranslations[p.g1].hebrew}, השפעת החזון: ${densityTranslations[p.g2].hebrew}.`;
        }
        
        // Update reading display
        document.getElementById('reading-content').innerHTML = currentReading;
    };
    
    p.generateNewCard = function() {
        p.generateParameters();
        p.drawCard();
        p.generateReading();
    };
    
    p.draw = function() {
        // Static drawing - no animation loop needed
        p.noLoop();
    };
}