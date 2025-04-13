package nl.sennaoudshoorn.qiddo_register.controller;

import nl.sennaoudshoorn.qiddo_register.model.Invoice;
import nl.sennaoudshoorn.qiddo_register.repository.InvoiceRepository;
import nl.sennaoudshoorn.qiddo_register.service.InvoicePdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
public class InvoicePdfController {

    private static final Logger logger = LoggerFactory.getLogger(InvoicePdfController.class);

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InvoicePdfService invoicePdfService;

    @GetMapping("/invoice-pdf/{id}")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id) {
        logger.info("Attempting to download invoice with ID: {}", id);
        
        Invoice invoice = invoiceRepository.findById(id).orElse(null);
        if (invoice == null) {
            logger.warn("Invoice not found with ID: {}", id);
            return ResponseEntity.notFound().build();
        }

        logger.info("Found invoice: {}", invoice);
        try {
            byte[] pdfBytes = invoicePdfService.generateInvoicePdf(invoice);
            logger.info("PDF generated successfully, size: {} bytes", pdfBytes.length);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "factuur_" + id + ".pdf");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            logger.error("Error generating PDF for invoice {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
} 