/**
 * Google Apps Script - Project Progress Tracker API
 *
 * SETUP INSTRUCTIONS:
 * 1. Buka Google Sheets baru (https://sheets.new)
 * 2. Beri nama sheet pertama: "Projects"
 * 3. Di baris pertama (header), isi:
 *    A1: ID | B1: Project Name | C1: Client Name | D1: Description | E1: Date | F1: Status | G1: Dev Notes
 * 4. Buka Extensions > Apps Script
 * 5. Hapus semua code default, paste seluruh code ini
 * 6. Klik Deploy > New deployment
 * 7. Pilih type: Web app
 * 8. Execute as: Me
 * 9. Who has access: Anyone
 * 10. Klik Deploy, copy URL-nya
 * 11. Paste URL ke file .env.local di project Next.js (GOOGLE_SHEET_API_URL)
 */

// ============================================
// CONFIGURATION
// ============================================
const SHEET_NAME = "only me";

/**
 * Mendapatkan sheet yang aktif
 */
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  // Jika sheet "Projects" belum ada, buat otomatis
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Set header row
    const headers = ["ID", "Project Name", "Client Name", "Description", "Date", "Status", "Dev Notes"];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Format header
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#1a1a2e");
    headerRange.setFontColor("#ffffff");

    // Set column widths
    sheet.setColumnWidth(1, 80);   // ID
    sheet.setColumnWidth(2, 200);  // Project Name
    sheet.setColumnWidth(3, 150);  // Client Name
    sheet.setColumnWidth(4, 300);  // Description
    sheet.setColumnWidth(5, 120);  // Date
    sheet.setColumnWidth(6, 120);  // Status
    sheet.setColumnWidth(7, 300);  // Dev Notes

    // Freeze header row
    sheet.setFrozenRows(1);
  }

  return sheet;
}

// ============================================
// GENERATE UNIQUE ID
// ============================================
function generateId() {
  return "PRJ-" + new Date().getTime().toString(36).toUpperCase();
}

// ============================================
// FORMAT DATE
// ============================================
function formatDate(date) {
  const d = date || new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return year + "-" + month + "-" + day;
}

// ============================================
// GET ALL PROJECTS
// ============================================
function getAllProjects() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  // Jika hanya ada header atau kosong
  if (lastRow <= 1) {
    return [];
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();

  const projects = data
    .filter(function(row) { return row[0] !== ""; }) // Skip empty rows
    .map(function(row) {
      return {
        id: String(row[0]),
        projectName: String(row[1]),
        clientName: String(row[2]),
        description: String(row[3]),
        date: row[4] instanceof Date ? formatDate(row[4]) : String(row[4]),
        status: String(row[5]),
        devNotes: String(row[6])
      };
    });

  // Return newest first
  return projects.reverse();
}

// ============================================
// ADD NEW PROJECT
// ============================================
function addProject(projectName, clientName, description) {
  const sheet = getSheet();

  const id = generateId();
  const date = formatDate(new Date());
  const status = "Waiting";
  var devNotes = "";

  // Append new row
  sheet.appendRow([id, projectName, clientName, description, date, status, devNotes]);

  return {
    success: true,
    message: "Project added successfully",
    project: {
      id: id,
      projectName: projectName,
      clientName: clientName,
      description: description,
      date: date,
      status: status,
      devNotes: devNotes
    }
  };
}

// ============================================
// UPDATE PROJECT (Status & Dev Notes)
// ============================================
function updateProject(id, status, devNotes) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return { success: false, message: "No projects found" };
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();

  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      var rowIndex = i + 2; // +2 karena index 0 dan header row

      // Update Status (column F = 6)
      if (status !== undefined && status !== null) {
        sheet.getRange(rowIndex, 6).setValue(status);
      }

      // Update Dev Notes (column G = 7)
      if (devNotes !== undefined && devNotes !== null) {
        sheet.getRange(rowIndex, 7).setValue(devNotes);
      }

      return {
        success: true,
        message: "Project updated successfully",
        id: id
      };
    }
  }

  return { success: false, message: "Project with ID " + id + " not found" };
}

// ============================================
// EDIT PROJECT (Name, Client, Description)
// ============================================
function editProject(id, projectName, clientName, description) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return { success: false, message: "No projects found" };
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();

  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      var rowIndex = i + 2;

      // Update Project Name (column B = 2)
      if (projectName !== undefined && projectName !== null) {
        sheet.getRange(rowIndex, 2).setValue(projectName);
      }

      // Update Client Name (column C = 3)
      if (clientName !== undefined && clientName !== null) {
        sheet.getRange(rowIndex, 3).setValue(clientName);
      }

      // Update Description (column D = 4)
      if (description !== undefined && description !== null) {
        sheet.getRange(rowIndex, 4).setValue(description);
      }

      return {
        success: true,
        message: "Project edited successfully",
        id: id
      };
    }
  }

  return { success: false, message: "Project with ID " + id + " not found" };
}

// ============================================
// DELETE PROJECT
// ============================================
function deleteProject(id) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return { success: false, message: "No projects found" };
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 1).getValues();

  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 2);
      return { success: true, message: "Project deleted successfully" };
    }
  }

  return { success: false, message: "Project not found" };
}

// ============================================
// WEB APP HANDLERS
// ============================================

/**
 * Handle GET requests
 * URL?action=getAll
 */
function doGet(e) {
  var action = e.parameter.action || "getAll";
  var result;

  switch (action) {
    case "getAll":
      result = getAllProjects();
      break;
    case "getById":
      var id = e.parameter.id;
      var allProjects = getAllProjects();
      result = allProjects.filter(function(p) { return p.id === id; })[0] || null;
      break;
    default:
      result = { error: "Unknown action: " + action };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests
 * Body: { action: "addProject" | "updateProject" | "deleteProject", ... }
 */
function doPost(e) {
  var result;

  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;

    switch (action) {
      case "addProject":
        result = addProject(
          body.projectName,
          body.clientName,
          body.description
        );
        break;

      case "updateProject":
        result = updateProject(
          body.id,
          body.status,
          body.devNotes
        );
        break;

      case "editProject":
        result = editProject(
          body.id,
          body.projectName,
          body.clientName,
          body.description
        );
        break;

      case "deleteProject":
        result = deleteProject(body.id);
        break;

      default:
        result = { error: "Unknown action: " + action };
    }
  } catch (err) {
    result = { error: "Invalid request: " + err.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// UTILITY: Setup Sheet (Run manually once)
// ============================================
/**
 * Jalankan fungsi ini SEKALI untuk setup awal sheet.
 * Klik fungsi ini di dropdown, lalu klik Run.
 */
function setupSheet() {
  var sheet = getSheet(); // This will auto-create the sheet with headers

  // Add conditional formatting for Status column
  var lastRow = Math.max(sheet.getLastRow(), 100); // Apply to 100 rows
  var statusRange = sheet.getRange(2, 6, lastRow, 1);

  // Clear existing rules
  sheet.clearConditionalFormatRules();

  var rules = sheet.getConditionalFormatRules();

  // Waiting - Yellow
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Waiting")
    .setBackground("#fef3c7")
    .setFontColor("#92400e")
    .setRanges([statusRange])
    .build());

  // In Progress - Blue
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("In Progress")
    .setBackground("#dbeafe")
    .setFontColor("#1e40af")
    .setRanges([statusRange])
    .build());

  // Done - Green
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Done")
    .setBackground("#d1fae5")
    .setFontColor("#065f46")
    .setRanges([statusRange])
    .build());

  // Revision - Orange
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Revision")
    .setBackground("#fed7aa")
    .setFontColor("#9a3412")
    .setRanges([statusRange])
    .build());

  // Maintenance - Purple
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Maintenance")
    .setBackground("#e9d5ff")
    .setFontColor("#6b21a8")
    .setRanges([statusRange])
    .build());

  sheet.setConditionalFormatRules(rules);

  // Add data validation for Status column
  var statusValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Waiting", "In Progress", "Done", "Revision", "Maintenance"])
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(statusValidation);

  Logger.log("Sheet setup complete! Sheet name: " + sheet.getName());
}
