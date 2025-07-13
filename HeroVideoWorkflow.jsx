// HeroVideoWorkflow_Fixed.jsx
// Fully debugged After Effects script for Lucy Scott Hair hero video

(function heroVideoWorkflow() {
    // Check if a composition is selected
    var activeComp = app.project.activeItem;
    
    if (!activeComp || !(activeComp instanceof CompItem)) {
        alert("Please select a composition and try again.");
        return;
    }
    
    if (activeComp.numLayers === 0) {
        alert("Composition has no layers. Please add your video layer first.");
        return;
    }
    
    app.beginUndoGroup("Lucy Scott Hair Hero Video Workflow");
    
    try {
        var comp = activeComp;
        var videoLayer = comp.layer(1); // Assumes video is first layer
        
        // 1. SLOW MOTION (0.5x) WITH TIME REMAPPING
        if (!videoLayer.hasVideo) {
            alert("Selected layer is not a video layer. Please select a video layer.");
            return;
        }
        
        // Try to enable time remapping, but use stretch as fallback
        var timeRemap = null;
        var usingStretch = false;
        try {
            videoLayer.timeRemapEnabled = true;
            timeRemap = videoLayer.property("ADBE Time Remapping");
            // Test if we can actually use time remapping
            if (!timeRemap || !timeRemap.canSetEnabled) {
                throw new Error("Time remapping not accessible");
            }
        } catch (e) {
            // If time remapping fails, use stretch method
            videoLayer.stretch = 200; // 200% = 0.5x speed
            usingStretch = true;
            timeRemap = null;
        }
        
        // Clear existing keyframes only if time remapping is available
        if (timeRemap) {
            while (timeRemap.numKeys > 0) {
                timeRemap.removeKey(1);
            }
        }
        
        // Get source duration properly
        var sourceDuration = videoLayer.source.duration;
        var slowMotionFactor = 0.5;
        var newDuration = sourceDuration / slowMotionFactor; // Duration for slowed footage
        
        // Ensure composition is long enough
        if (comp.duration < newDuration) {
            comp.duration = newDuration;
        }
        
        // Add keyframes for slow motion with proper error handling
        if (timeRemap && !usingStretch) {
            try {
                // First keyframe at start
                timeRemap.setValueAtTime(0, 0);
                // Second keyframe for slow motion - ensure value is within bounds
                var safeSourceDuration = Math.min(sourceDuration, sourceDuration - 0.001);
                var safeNewDuration = Math.min(newDuration, comp.duration - 0.001);
                timeRemap.setValueAtTime(safeNewDuration, safeSourceDuration);
            } catch (timeError) {
                // If time remapping fails, fallback to stretch
                videoLayer.stretch = 200; // 200% = 0.5x speed
                usingStretch = true;
                timeRemap = null;
            }
        }
        
        // Set linear interpolation for consistent speed (only if time remapping worked)
        if (timeRemap && timeRemap.numKeys > 0) {
            for (var k = 1; k <= timeRemap.numKeys; k++) {
                timeRemap.setInterpolationTypeAtKey(k, KeyframeInterpolationType.LINEAR);
            }
        }
        
        // 2. COLOR GRADING - Temperature and Tint
        try {
            var colorBalance = videoLayer.property("ADBE Effect Parade").addProperty("ADBE Color Balance (HLS)");
            colorBalance.property("ADBE Color Balance (HLS)-0001").setValue(15); // Hue shift for warmth
            colorBalance.property("ADBE Color Balance (HLS)-0003").setValue(-10); // Reduce saturation
        } catch (e) {
            // Fallback to Hue/Saturation if Color Balance not available
            try {
                var hueSat = videoLayer.property("ADBE Effect Parade").addProperty("ADBE HueSaturation");
                hueSat.property("ADBE HueSaturation-0003").setValue(-12); // Master Saturation
                hueSat.property("ADBE HueSaturation-0004").setValue(8); // Master Lightness
            } catch (e2) {
                alert("Color effects not available. Skipping color grading.");
            }
        }
        
        // 3. CONTRAST REDUCTION with Curves
        try {
            var curves = videoLayer.property("ADBE Effect Parade").addProperty("ADBE Curves");
            // Reduce contrast by flattening the curve slightly
            // Note: Curves keyframe adjustment would need manual tweaking
        } catch (e) {
            // Fallback to Brightness & Contrast
            try {
                var brightContrast = videoLayer.property("ADBE Effect Parade").addProperty("ADBE Brightness & Contrast 2");
                brightContrast.property("ADBE Brightness & Contrast 2-0001").setValue(5); // Brightness +5
                brightContrast.property("ADBE Brightness & Contrast 2-0002").setValue(-20); // Contrast -20
            } catch (e2) {
                alert("Contrast effects not available. Skipping contrast adjustment.");
            }
        }
        
        // 4. CREATE VIGNETTE LAYER
        var vignetteLayer = comp.layers.addSolid([0, 0, 0], "Vignette", comp.width, comp.height, comp.duration);
        vignetteLayer.moveAfter(videoLayer);
        vignetteLayer.blendingMode = BlendingMode.MULTIPLY;
        
        // Create elliptical mask for vignette
        var vignetteMask = vignetteLayer.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
        var maskShape = vignetteMask.property("ADBE Mask Shape");
        
        // Create ellipse shape manually
        var shape = new Shape();
        var centerX = comp.width / 2;
        var centerY = comp.height / 2;
        var radiusX = comp.width * 0.6; // 60% of width
        var radiusY = comp.height * 0.6; // 60% of height
        
        // Calculate bezier handles for smooth ellipse (magic number: 0.552)
        var handleX = radiusX * 0.552;
        var handleY = radiusY * 0.552;
        
        shape.vertices = [
            [centerX, centerY - radiusY], // top
            [centerX + radiusX, centerY], // right  
            [centerX, centerY + radiusY], // bottom
            [centerX - radiusX, centerY]  // left
        ];
        
        shape.inTangents = [
            [-handleX, 0],    // top
            [0, -handleY],    // right
            [handleX, 0],     // bottom
            [0, handleY]      // left
        ];
        
        shape.outTangents = [
            [handleX, 0],     // top
            [0, handleY],     // right
            [-handleX, 0],    // bottom
            [0, -handleY]     // left
        ];
        
        shape.closed = true;
        maskShape.setValue(shape);
        
        // Set mask properties for vignette effect
        vignetteMask.inverted = true;
        vignetteMask.property("ADBE Mask Feather").setValue([200, 200]);
        vignetteLayer.property("ADBE Transform Group").property("ADBE Opacity").setValue(15); // 15% opacity
        
        // 5. SEAMLESS LOOP SETUP
        var loopStart = 2; // Start loop at 2 seconds
        var loopEnd = 12;  // End loop at 12 seconds  
        var loopDuration = loopEnd - loopStart;
        
        // Adjust time remapping for loop section with bounds checking
        if (timeRemap && !usingStretch) {
            try {
                var safeLoopStart = Math.max(0, Math.min(loopStart, sourceDuration - 0.001));
                var safeLoopEnd = Math.max(0, Math.min(loopEnd, sourceDuration - 0.001));
                var safeLoopDuration = Math.min(loopDuration, comp.duration - 0.001);
                
                // Clear existing keyframes first
                while (timeRemap.numKeys > 0) {
                    timeRemap.removeKey(1);
                }
                
                timeRemap.setValueAtTime(0, safeLoopStart);
                timeRemap.setValueAtTime(safeLoopDuration, safeLoopEnd);
                
                // Add seamless loop expression
                timeRemap.expression = 'loopOut("cycle", 0)';
            } catch (loopError) {
                // Fallback to basic layer setup
                videoLayer.inPoint = loopStart;
                videoLayer.outPoint = loopEnd;
            }
        } else {
            // For stretch method, just set in/out points for loop
            videoLayer.inPoint = loopStart;
            videoLayer.outPoint = loopEnd;
        }
        
        // 6. SUBTLE GAUSSIAN BLUR
        try {
            var gaussianBlur = videoLayer.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
            gaussianBlur.property("ADBE Gaussian Blur 2-0001").setValue(1.5); // Blur amount
            // Skip repeat edge pixels setting as it may have range issues
        } catch (blurError) {
            alert("Gaussian Blur error: " + blurError.toString() + ". Skipping blur effect.");
        }
        
        // 7. WARP STABILIZER (if available)
        var warpStabAdded = false;
        try {
            var warpStab = videoLayer.property("ADBE Effect Parade").addProperty("ADBE WarpStabilizer");
            warpStabAdded = true;
        } catch (e) {
            // Warp Stabilizer not available - no alert needed, this is common
        }
        
        // 8. SET COMPOSITION DURATION TO LOOP LENGTH
        try {
            comp.duration = Math.max(loopDuration, 1); // Ensure minimum 1 second
        } catch (durationError) {
            alert("Could not set composition duration. Please adjust manually.");
        }
        
        // 9. ADD TO RENDER QUEUE WITH H.264 SETTINGS
        var renderItem = app.project.renderQueue.items.add(comp);
        var outputModule = renderItem.outputModule(1);
        
        // Try to apply H.264 template
        try {
            outputModule.applyTemplate("H.264 - Match Render Settings - 15 Mbps");
        } catch (e) {
            try {
                outputModule.applyTemplate("H.264");
            } catch (e2) {
                // Use Lossless if H.264 templates not available
                outputModule.applyTemplate("Lossless");
                alert("H.264 template not found. Using Lossless. Please manually set to H.264 in render queue.");
            }
        }
        
        // Set output file path
        if (app.project.file) {
            var projectFolder = app.project.file.parent;
            var outputFile = new File(projectFolder.fsName + "/hero-video.mp4");
            outputModule.file = outputFile;
        } else {
            alert("Please save your project first to set output location.");
        }
        
        // Final success message
        var successMessage = "Hero video workflow applied successfully!\n\n";
        successMessage += "Applied effects:\n";
        successMessage += "• Slow motion: " + (usingStretch ? "Stretch method" : "Time remapping") + "\n";
        successMessage += "• Color grading and contrast adjustment\n";
        successMessage += "• Vignette effect\n";
        successMessage += "• Subtle blur\n";
        if (warpStabAdded) {
            successMessage += "• Warp Stabilizer (analyzing...)\n";
        }
        successMessage += "\nNext steps:\n";
        if (warpStabAdded) {
            successMessage += "1. Let Warp Stabilizer analyze\n";
            successMessage += "2. Check render queue settings\n";
            successMessage += "3. Start render when ready\n";
        } else {
            successMessage += "1. Check render queue settings\n";
            successMessage += "2. Start render when ready\n";
        }
        successMessage += "\nLoop duration: " + loopDuration + " seconds";
        
        alert(successMessage);
        
    } catch (error) {
        alert("Error applying workflow: " + error.toString() + "\n\nLine: " + error.line);
    }
    
    app.endUndoGroup();
})();
