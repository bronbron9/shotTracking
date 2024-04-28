var noteIndex = 0; // Initialize note index counter

// Auto-populate game date field with today's date
function populateGameDate() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0'); // Adding padding for month
    var day = String(today.getDate()).padStart(2, '0'); // Adding padding for day
    var formattedDate = year + '-' + month + '-' + day;
    document.getElementById('game-date-input').value = formattedDate;
}

// Function to handle click event on the rink image
function handleClick(event) {
    var notesContainer = document.getElementById('notes-container');
    var shotTableBody = document.querySelector('#shot-table tbody');
    var hockeyField = document.getElementById('hockey-field');

    var rect = hockeyField.getBoundingClientRect();
    var scaleX = hockeyField.naturalWidth / hockeyField.width;
    var scaleY = hockeyField.naturalHeight / hockeyField.height;

    var x = Math.round(((event.clientX - rect.left) * scaleX) / 1600 * 200);
    var y = Math.round(((event.clientY - rect.top) * scaleY) / 680 * 80);

    var gameDate = document.getElementById('game-date-input').value;
    var team = document.getElementById('team-input').value;
    var opponent = document.getElementById('opponent-input').value;
    var userNote = prompt("Player Name:");
	var misc = document.getElementById('misc-input').value;

    if (userNote) {
        var noteText = ++noteIndex + ". " + userNote+", "+x+", "+y;
        var note = document.createElement('div');
        note.className = 'note';
        note.style.left = event.clientX + 'px';
        note.style.top = event.clientY + 'px';
        note.textContent = noteText;
        notesContainer.appendChild(note);

        var dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.left = (event.clientX - 12.5) + 'px'; // Adjust for dot size
        dot.style.top = (event.clientY - 12.5) + 'px'; // Adjust for dot size
        notesContainer.appendChild(dot);

        // Add shot data to table
        var newRow = shotTableBody.insertRow();
        newRow.innerHTML = `<td>${noteIndex}</td><td>${userNote}</td><td>${x}</td><td>${y}</td><td>${gameDate}</td><td>${team}</td><td>${opponent}</td><td>${misc}</td>`;
    }
}

// Function to remove the last added note
function removeLastNote() {
    var notesContainer = document.getElementById('notes-container');
    var shotTableBody = document.querySelector('#shot-table tbody');
    var notes = notesContainer.querySelectorAll('.note');
    var dots = notesContainer.querySelectorAll('.dot');

    if (notes.length > 0) {
        var lastNote = notes[notes.length - 1];
        var lastDot = dots[dots.length - 1];

        notesContainer.removeChild(lastNote);
        notesContainer.removeChild(lastDot);
        shotTableBody.deleteRow(-1); // Remove the last row from the table

        noteIndex--; // Decrement the note index
    }
}

// Function to export notes as CSV
function exportNotes() {
    var rows = document.querySelectorAll('#shot-table tbody tr');
    if (rows.length === 0) {
        alert("No notes to export!");
        return;
    }

    var csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(row => {
        var rowData = Array.from(row.cells).map(cell => cell.textContent).join(",");
        csvContent += rowData + "\n";
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "shot_data.csv");
    document.body.appendChild(link);
    link.click();
}

// Function to clear all notes
function clearNotes() {
    var notesContainer = document.getElementById('notes-container');
    var shotTableBody = document.querySelector('#shot-table tbody');
    notesContainer.innerHTML = ''; // Clear all child elements
    shotTableBody.innerHTML = ''; // Clear all rows
    noteIndex = 0; // Reset note index counter
}


// Call the function to populate game date field with today's date
populateGameDate();

// Event listeners for click events on the rink image and buttons
document.getElementById('hockey-field-container').addEventListener('click', handleClick);
document.getElementById('remove-last-note-btn').addEventListener('click', removeLastNote);
document.getElementById('export-notes-btn').addEventListener('click', exportNotes);
document.getElementById('clear-notes-btn').addEventListener('click', clearNotes);


// Function to switch the values of 'team-input' and 'opponent-input'
function switchTeams() {
    var teamInput = document.getElementById('team-input');
    var opponentInput = document.getElementById('opponent-input');

    var temp = teamInput.value;
    teamInput.value = opponentInput.value;
    opponentInput.value = temp;
}

// Event listener for click event on the switch button
document.getElementById('switch-teams-btn').addEventListener('click', switchTeams);
