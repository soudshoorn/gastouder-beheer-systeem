package nl.sennaoudshoorn.qiddo_register.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import nl.sennaoudshoorn.qiddo_register.model.Child;

public interface ChildRepository extends JpaRepository<Child, Long> {
}