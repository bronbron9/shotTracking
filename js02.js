// Keep track of the number of notes created
var noteIndex = 0;

// Function to handle click events on the hockey field
function handleClick(event) {
    if (event.target.id === 'hockey-field') {
        var notesContainer = document.getElementById('notes-container');
        var hockeyField = document.getElementById('hockey-field');
        var teamInput = document.getElementById('team-input');
        var gameDateInput = document.getElementById('game-date-input');
        var opponentInput = document.getElementById('opponent-input');
        var dotColorSelect = document.getElementById('dot-color-select');

        var rect = hockeyField.getBoundingClientRect();
        var scaleX = hockeyField.naturalWidth / hockeyField.width;
        var scaleY = hockeyField.naturalHeight / hockeyField.height;

        var x = Math.round(((event.clientX - rect.left) * scaleX) / 1600 * 200);
        var y = Math.round(((event.clientY - rect.top) * scaleY) / 680 * 80);

        var team = teamInput.value.trim();
        var gameDate = gameDateInput.value.trim();
        var opponent = opponentInput.value.trim();
        var noteText = gameDate + ", " + team + ", " + opponent + ", " + prompt("Enter your note:") + ", " + x + ", " + y;

        if (noteText) {
            noteIndex++; // Increment the note index
            var note = document.createElement('div');
            note.className = 'note';
            note.style.left = event.clientX + 'px';
            note.style.top = event.clientY + 'px';
            note.textContent = noteIndex + ', ' + noteText; // Add index to note text
            notesContainer.appendChild(note);

            var dot = document.createElement('div');
            dot.className = 'dot';
            var selectedColor = dotColorSelect.value; // Get the selected color
            dot.style.backgroundColor = selectedColor; // Set the background color of the dot
            dot.style.left = (event.clientX - 12.5) + 'px'; // Adjust for dot size
            dot.style.top = (event.clientY - 12.5) + 'px'; // Adjust for dot size
            notesContainer.appendChild(dot);
        }
    }
}

// Function to remove the last note and its corresponding dot
function removeLastNote() {
    var notesContainer = document.getElementById('notes-container');
    var notes = notesContainer.querySelectorAll('.note');
    var dots = notesContainer.querySelectorAll('.dot');
    if (notes.length > 0) {
        var lastNote = notes[notes.length - 1];
        var lastDot = dots[dots.length - 1];
        notesContainer.removeChild(lastNote);
        notesContainer.removeChild(lastDot);
        noteIndex--; // Decrement the note index when a note is removed
    }
}


// Event listener for the "Remove Last Note" button
document.getElementById('remove-last-note-btn').addEventListener('click', removeLastNote);

// Function to clear all notes and reset note index
function clearNotes() {
    var notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = ''; // Clear all child elements
    noteIndex = 0; // Reset note index when all notes are cleared
}

// Event listener for the "Clear Notes" button
document.getElementById('clear-notes-btn').addEventListener('click', clearNotes);

// Event listener for the hockey field click events
document.getElementById('hockey-field-container').addEventListener('click', handleClick);

// Event listener for the "Export Notes" button
document.getElementById('export-notes-btn').addEventListener('click', function() {
    var notes = document.querySelectorAll('.note');
    if (notes.length === 0) {
        alert("No notes to export!");
        return;
    }

    // Prepend the header line to the notes text
    var headerLine = "index, gameDate, team, opponent, player, locX, locY\n";
    var notesText = Array.from(notes).map(function(note) {
        return note.textContent;
    }).join('\n');
    notesText = headerLine + notesText;

    var blob = new Blob([notesText], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.href = url;
    a.download = 'notes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});



// Function to get the current date in the format YYYY-MM-DD
function getCurrentDate() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

// Set the default value for the "Game Date" input field
document.getElementById('game-date-input').value = getCurrentDate();
