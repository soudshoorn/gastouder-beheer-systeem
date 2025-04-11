package nl.sennaoudshoorn.qiddo_register.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import nl.sennaoudshoorn.qiddo_register.model.Parent;

public interface ParentRepository extends JpaRepository<Parent, Long> {
}