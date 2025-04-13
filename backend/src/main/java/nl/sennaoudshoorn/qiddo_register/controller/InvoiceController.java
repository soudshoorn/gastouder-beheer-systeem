package nl.sennaoudshoorn.qiddo_register.controller;

import nl.sennaoudshoorn.qiddo_register.model.Invoice;
import nl.sennaoudshoorn.qiddo_register.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @GetMapping
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id) {
        return invoiceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Invoice createInvoice(@RequestBody Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Invoice> updateInvoice(@PathVariable Long id, @RequestBody Invoice invoiceDetails) {
        return invoiceRepository.findById(id)
                .map(invoice -> {
                    invoice.setAmount(invoiceDetails.getAmount());
                    invoice.setPaid(invoiceDetails.isPaid());
                    invoice.setInvoiceDate(invoiceDetails.getInvoiceDate());
                    invoice.setParent(invoiceDetails.getParent());
                    return ResponseEntity.ok(invoiceRepository.save(invoice));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvoice(@PathVariable Long id) {
        return invoiceRepository.findById(id)
                .map(invoice -> {
                    invoiceRepository.delete(invoice);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/parent/{parentId}")
    public List<Invoice> getInvoicesByParent(@PathVariable Long parentId) {
        return invoiceRepository.findByParentId(parentId);
    }

    @GetMapping("/parent/{parentId}/unpaid")
    public List<Invoice> getUnpaidInvoicesByParent(@PathVariable Long parentId) {
        return invoiceRepository.findByParentIdAndPaidFalse(parentId);
    }
} 