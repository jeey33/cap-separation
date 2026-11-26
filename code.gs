
/**
 * CAP SÉPARATION
 * Google Apps Script — endpoint de contact facultatif
 *
 * IMPORTANT :
 * - Ne pas utiliser ce script pour enregistrer les réponses sensibles
 *   du diagnostic de séparation.
 * - Créer une feuille Google Sheets dédiée.
 * - Remplacer SPREADSHEET_ID par l'identifiant du fichier.
 */

const SPREADSHEET_ID = "REMPLACER_PAR_ID_GOOGLE_SHEETS";
const SHEET_NAME = "Contacts";

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      service: "CAP SÉPARATION",
      message: "Service de contact disponible."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Aucune donnée reçue.");
    }

    const data = JSON.parse(e.postData.contents);

    // Validation minimale des champs
    const name = String(data.name || "").trim().slice(0, 100);
    const email = String(data.email || "").trim().slice(0, 200);
    const message = String(data.message || "").trim().slice(0, 2000);

    if (!email || !email.includes("@")) {
      throw new Error("Adresse e-mail invalide.");
    }

    if (!message) {
      throw new Error("Message manquant.");
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Date",
        "Nom",
        "E-mail",
        "Message"
      ]);
    }

    sheet.appendRow([
      new Date(),
      name,
      email,
      message
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: "Votre demande a bien été enregistrée."
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.message || "Une erreur est survenue."
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
