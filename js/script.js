// Cargar JSON pegado o desde archivo
function loadJSON() {
    var input = document.getElementById('jsonInput').value;
    var fileInput = document.getElementById('jsonFile');

    if (input) {
        var jsonData = JSON.parse(input);
        displayComponentInfo(jsonData.Component);
        generateTable(jsonData);
    } else if (fileInput.files.length > 0) {
        var file = fileInput.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
            var jsonData = JSON.parse(event.target.result);
            displayComponentInfo(jsonData.Component);
            generateTable(jsonData);
        };
        reader.readAsText(file);
    }
}

// Mostrar información del componente
function displayComponentInfo(component) {
    var componentInfoDiv = document.getElementById("componentInfo");
    componentInfoDiv.innerHTML = `
        <h2>Información del Componente</h2>
        <p><strong>StartDate:</strong> ${component.StartDate}</p>
        <p><strong>EndDate:</strong> ${component.EndDate}</p>
        <p><strong>ComponentID:</strong> ${component.ComponentID}</p>
        <p><strong>ComponentNumber:</strong> ${component.ComponentNumber}</p>
        <p><strong>ComponentName:</strong> ${component.ComponentName}</p>
    `;
}

// Generar tabla con paginación
function generateTable(jsonData) {
    var tableBody = document.getElementById("menuTableBody");
    tableBody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

    var menuInfo = jsonData.MenuInfo;
    
    // Recorrer los menús
    menuInfo.forEach(function(menu) {
        var days = menu.Days;
        
        // Recorrer los días
        days.forEach(function(day) {
            var recipes = day.Recipes;
            
            // Recorrer las recetas
            recipes.forEach(function(recipe) {
                var row = document.createElement("tr");

                // Celda MenuID
                var cellMenuID = document.createElement("td");
                cellMenuID.textContent = menu.MenuID;
                row.appendChild(cellMenuID);

                // Celda MenuName
                var cellMenuName = document.createElement("td");
                cellMenuName.textContent = menu.MenuName;
                row.appendChild(cellMenuName);

                // Celda Day
                var cellDay = document.createElement("td");
                cellDay.textContent = day.Day;
                row.appendChild(cellDay);

                // Celda RecipeID
                var cellRecipeID = document.createElement("td");
                cellRecipeID.textContent = recipe.RecipeID;
                row.appendChild(cellRecipeID);

                // Celda RecipeDescription
                var cellRecipeDescription = document.createElement("td");
                cellRecipeDescription.textContent = recipe.RecipeDescription;
                row.appendChild(cellRecipeDescription);

                // Celda CourseName
                var cellCourseName = document.createElement("td");
                var courseName = recipe.CourseName ? recipe.CourseName : "N/A";
                cellCourseName.textContent = courseName;
                row.appendChild(cellCourseName);

                // Celda CourseObject (Course.Name)
                var cellCourseObject = document.createElement("td");
                var courseObjName = recipe.Course && recipe.Course.Name ? recipe.Course.Name : "N/A";
                cellCourseObject.textContent = courseObjName;
                row.appendChild(cellCourseObject);

                // Añadir la fila a la tabla
                tableBody.appendChild(row);
            });
        });
    });

    paginateTable(); // Llamar la función para paginar la tabla
}

// Función para exportar la tabla a formato .xlsx usando SheetJS
function exportTableToExcelXLSX() {
    var table = document.getElementById("menuTable");
    var tableData = [];

    // Recorrer filas de la tabla (incluyendo cabecera)
    for (var i = 0; i < table.rows.length; i++) {
        var row = [];
        var cells = table.rows[i].getElementsByTagName("td");

        if (i === 0) {
            cells = table.rows[i].getElementsByTagName("th");
        }

        for (var j = 0; j < cells.length; j++) {
            row.push(cells[j].innerText);
        }
        tableData.push(row);
    }

    // Crear el archivo Excel
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(tableData);

    XLSX.utils.book_append_sheet(wb, ws, "Menús y Recetas");
    XLSX.writeFile(wb, "menu_recetas.xlsx");
}

// Función para ordenar la tabla
function sortTable(n) {
    var table = document.getElementById("menuTable");
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    dir = "asc";

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            if (dir == "asc") {
                if (x.textContent.toLowerCase() > y.textContent.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.textContent.toLowerCase() < y.textContent.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

// Función para filtrar la tabla
function filterTable() {
    var menuFilter = document.getElementById("menuFilter").value.toLowerCase();
    var recipeFilter = document.getElementById("recipeFilter").value.toLowerCase();
    var table = document.getElementById("menuTableBody");
    var rows = table.getElementsByTagName("tr");

    for (var i = 0; i < rows.length; i++) {
        var menuName = rows[i].getElementsByTagName("td")[1].textContent.toLowerCase();
        var recipeDescription = rows[i].getElementsByTagName("td")[4].textContent.toLowerCase();
        
        if (menuName.includes(menuFilter) && recipeDescription.includes(recipeFilter)) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}