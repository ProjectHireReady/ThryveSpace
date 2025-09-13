import jsPDF from "jspdf"; // pulls in the jsPDF library
import autoTable from "jspdf-autotable"; // pulls in the table plugin

export const downloadGuestEntriesPDF = (entries) => {
  if (!entries || entries.length === 0) return; 
  // skip if there is no data

  const doc = new jsPDF(); 
  // create a blank new PDF document

  doc.setFontSize(18); 
  doc.text("Guest Journal Entries", 14, 22); 
  // add a title to the PDF

  // convert the entries to a table:
  const tableData = entries.map((entry, index) => [
    index + 1,                                // numbering
    entry.note || "—",                        // note
    entry.mood?.name || "—",                  // mood name
    entry.mood?.emoji || "—",                 // emoji
    new Date(entry.created_at).toLocaleString(),  // created
    new Date(entry.updated_at).toLocaleString(),  // updated
  ]);

  // actually draw the table inside the PDF
  autoTable(doc, {
    startY: 30, // leave space for the title
    head: [["#", "Note", "Mood Name", "Emoji", "Created At", "Updated At"]], // table headers
    body: tableData,  // the table data rows
    styles: { fontSize: 10, cellPadding: 3 }, // cell text style
    headStyles: { fillColor: [41, 128, 185] }, // header background color
  });

  doc.save("guest_entries.pdf"); 
  // download the file immediately
};
