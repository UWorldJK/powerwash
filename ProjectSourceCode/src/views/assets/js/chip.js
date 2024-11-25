// Object to track the boolean state of each chip
const chipStates = {};

// Predefined list of chips
const predefinedChips = [
    "graphing","normalization", "granularity", "standardization", "missing value removal", "classification", "duplicate removal", "standardize time format", "standardize date format","scaling", "binning", "encoding", "data type conversion", "feature extraction", "noise reduction", "data augmentation", "anomaly detection", "dimensionality reduction", "text cleaning", "tokenization", "stemming", "lemmatization", "data smoothing", "aggregation", "data transformation", "categorical conversion", "time series decomposition", "data discretization", "feature selection"
];

// Function to create a new chip
function createChip(name) {
    if(name != null){
        const chipGrid = document.getElementById("chipGrid");
    const chip = document.createElement("div");
    chip.classList.add("chip");

    // Initialize chip state as false
    chipStates[name] = false;

    // Chip name
    const chipName = document.createElement("span");
    chipName.textContent = name;

    // Toggle selection on click
    chip.addEventListener("click", function () {
        chip.classList.toggle("selected");
        chipStates[name] = !chipStates[name];
    });

    // Append elements to the chip
    chip.appendChild(chipName);
    chipGrid.appendChild(chip);
    }   
}

// Load predefined chips into the grid on page load
function loadPredefinedChips() {
    predefinedChips.forEach(chipName => {
        if(chipName != null)
            createChip(chipName);
    });
}

// Initialize chips on window load
window.onload = loadPredefinedChips();

// Function to submit chip states to the backend
async function submitChipStates() {
    try {
        const response = await fetch('http://localhost:5001/submit-choices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chipStates)
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        if(response.status == 201){
            window.location.href="http://localhost:3000/graphSelection";
        }
        else if(response.status == 202){
            window.location.href="http://localhost:3000/classifyColumns";
        }
        else if(response.status == 200){
            window.location.href="http://localhost:3000/result";
        }

        const result = await response.json();
        console.log("Backend response:", result);
        // window.location.href="http://localhost:3000/result";
    } catch (error) {
        console.error("Error submitting choices:", error);
    }
}

