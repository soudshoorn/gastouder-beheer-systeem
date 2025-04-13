package nl.sennaoudshoorn.qiddo_register.repository;

import nl.sennaoudshoorn.qiddo_register.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByParentId(Long parentId);
    List<Invoice> findByParentIdAndPaidFalse(Long parentId);
} 