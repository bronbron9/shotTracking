document.addEventListener('DOMContentLoaded', function() {
    var svg = document.getElementById('rinkSvg');
    var dotTable = document.getElementById('dotTable');
    var index = 1;
	var defaultFontSize = 10; // Default font size
    var currentFontSize = defaultFontSize; // Current font size

    // Autopopulate game date input with today's date
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    var day = ('0' + currentDate.getDate()).slice(-2);
    var today = year + '-' + month + '-' + day;
    document.getElementById('game-date-input').value = today;

    svg.addEventListener('click', function(event) {
        var playerName = prompt('Enter Player Name:');
        if (!playerName) return; // If user cancels prompt, do nothing

        var pt = svg.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        var svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());

        var rinkWidth = 603.67; // Width of the rink image
        var rinkHeight = 258.04; // Height of the rink image

        var locX = (svgPt.x / rinkWidth) * 200; // Calculate locX
        var locY = (svgPt.y / rinkHeight) * 85; // Calculate locY
        locX = Math.round(locX * 1) / 1; // Round locX to 1 decimal place
        locY = Math.round(locY * 1) / 1; // Round locY to 1 decimal place

        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', svgPt.x + 5);
        text.setAttribute('y', svgPt.y + 2);
        text.textContent = index + '. ' + playerName + '  ' + locX + ', ' + locY; // Display index, playerName, locX, and locY
        text.classList.add('dot-label'); // Add a class for styling
        svg.appendChild(text);

        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', svgPt.x);
        circle.setAttribute('cy', svgPt.y);
        circle.setAttribute('r', '2');
        circle.setAttribute('fill', 'red');
        circle.classList.add('dot'); // Add the "dot" class
        svg.appendChild(circle);

        var row = dotTable.insertRow(-1);
        var cellIndex = row.insertCell(0);
        var cellPlayerName = row.insertCell(1);
        var cellGameDate = row.insertCell(2);
        var cellTeam = row.insertCell(3);
        var cellOpponent = row.insertCell(4);
        var cellMisc = row.insertCell(5);
        var cellLocX = row.insertCell(6);
        var cellLocY = row.insertCell(7);

        cellIndex.textContent = index;
        cellPlayerName.textContent = playerName;
        cellGameDate.textContent = today; // Use today's date
        cellTeam.textContent = document.getElementById('team-input').value;
        cellOpponent.textContent = document.getElementById('opponent-input').value;
        cellMisc.textContent = document.getElementById('misc-input').value;
        cellLocX.textContent = locX;
        cellLocY.textContent = locY;

        index++;
    });

     // Export data as CSV when exportButton is clicked
    document.getElementById('exportButton').addEventListener('click', function() {
        var csvContent = 'data:text/csv;charset=utf-8;';
        
        // Include headers without newline character
        csvContent += 'index,playerName,gameDate,team,opponent,misc,locX,locY';

        var rows = dotTable.querySelectorAll('tr');
        rows.forEach(function(row, rowIndex) {
            if (rowIndex !== 0) { // Skip the first row (header row)
                var rowData = [];
                row.querySelectorAll('td').forEach(function(cell) {
                    rowData.push(cell.textContent);
                });
                csvContent += '\n' + rowData.join(',');
            }
        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'shot_data.csv');
        document.body.appendChild(link); // Required for Firefox
        link.click();
    });

    // Switch teams when switch-teams-button is clicked
    document.getElementById('switch-teams-btn').addEventListener('click', function() {
        var teamInput = document.getElementById('team-input');
        var opponentInput = document.getElementById('opponent-input');
        var temp = teamInput.value;
        teamInput.value = opponentInput.value;
        opponentInput.value = temp;
    });
	
	
	// Remove the most recently created dot, text, and table row when remove-button is clicked
    document.getElementById('remove-button').addEventListener('click', function() {
        var dots = document.getElementsByClassName('dot');
        var lastDot = dots[dots.length - 1];
        if (lastDot) {
            lastDot.remove();
        }

        var labels = document.getElementsByClassName('dot-label');
        var lastLabel = labels[labels.length - 1];
        if (lastLabel) {
            lastLabel.remove();
        }

        var rows = dotTable.rows;
        if (rows.length > 1) {
            dotTable.deleteRow(rows.length - 1);
            index--; // Decrement index
        }
    });

	// Increase font size when size-up-btn is clicked
    document.getElementById('size-up-btn').addEventListener('click', function() {
        currentFontSize += 1; // Increase font size by 1 pixel
        updateDotLabelFontSize();
    });

    // Decrease font size when size-down-btn is clicked
    document.getElementById('size-down-btn').addEventListener('click', function() {
        if (currentFontSize > 1) { // Ensure font size doesn't go below 1 pixel
            currentFontSize -= 1; // Decrease font size by 1 pixel
            updateDotLabelFontSize();
        }
    });

    // Function to update font size of dot labels
    function updateDotLabelFontSize() {
        var dotLabels = document.querySelectorAll('.dot-label');
        dotLabels.forEach(function(label) {
            label.style.fontSize = currentFontSize + 'px';
        });
    }
	



});
