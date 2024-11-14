// Predefined list of chips
const predefinedChips = [
    "normalization", "standardization", "outlier detection", "missing value imputation", "duplicate removal", "scaling", "binning", "encoding", "data type conversion", "feature extraction", "noise reduction", "data augmentation", "anomaly detection", "dimensionality reduction", "text cleaning", "tokenization", "stemming", "lemmatization", "data smoothing", "aggregation", "data transformation", "categorical conversion", "time series decomposition", "data discretization", "feature selection"
];

// Function to create a new chip
function createChip(name) {
    const chipGrid = document.getElementById("chipGrid");
    const chip = document.createElement("div");
    chip.classList.add("chip");

    // Chip name
    const chipName = document.createElement("span");
    chipName.textContent = name;

    // Toggle selection on click
    chip.addEventListener("click", function () {
        chip.classList.toggle("selected");
    });

    // Append elements to the chip
    chip.appendChild(chipName);
    chipGrid.appendChild(chip);
}

// Load predefined chips into the grid on page load
function loadPredefinedChips() {
    predefinedChips.forEach(chipName => {
        createChip(chipName);
    });
}

// Initialize chips on window load
window.onload = loadPredefinedChips;
