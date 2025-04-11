package nl.sennaoudshoorn.qiddo_register.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import nl.sennaoudshoorn.qiddo_register.model.Person;

public interface PersonRepository extends JpaRepository<Person, Long> {
}