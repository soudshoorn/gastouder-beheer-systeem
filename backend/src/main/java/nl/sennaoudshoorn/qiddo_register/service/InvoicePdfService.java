package nl.sennaoudshoorn.qiddo_register.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import nl.sennaoudshoorn.qiddo_register.model.Invoice;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class InvoicePdfService {

    public byte[] generateInvoicePdf(Invoice invoice) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Add header
        document.add(new Paragraph("FACTUUR")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(20)
                .setBold());

        // Add invoice details
        document.add(new Paragraph("\nFactuurnummer: " + invoice.getId()));
        document.add(new Paragraph("Datum: " + invoice.getInvoiceDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"))));
        document.add(new Paragraph("Klant: " + invoice.getParent().getNaam()));
        document.add(new Paragraph("Telefoon: " + invoice.getParent().getTelefoonnummer()));
        document.add(new Paragraph("Email: " + invoice.getParent().getEmail()));

        // Add table for invoice items
        Table table = new Table(UnitValue.createPercentArray(2)).useAllAvailableWidth();
        table.addCell("Omschrijving");
        table.addCell("Bedrag");

        table.addCell("Kinderopvang");
        table.addCell("€ " + String.format("%.2f", invoice.getAmount()));

        document.add(table);

        // Add total
        document.add(new Paragraph("\nTotaalbedrag: € " + String.format("%.2f", invoice.getAmount()))
                .setTextAlignment(TextAlignment.RIGHT)
                .setBold());

        // Add payment status
        String paymentStatus = invoice.isPaid() ? "Betaald" : "Nog te betalen";
        document.add(new Paragraph("\nStatus: " + paymentStatus));

        // Add footer
        document.add(new Paragraph("\n\nMet vriendelijke groet,"));
        document.add(new Paragraph("Qiddo Register"));

        document.close();
        return baos.toByteArray();
    }
} 