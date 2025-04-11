package nl.sennaoudshoorn.qiddo_register.service;

import java.util.List;

import org.springframework.stereotype.Service;

import nl.sennaoudshoorn.qiddo_register.model.Person;
import nl.sennaoudshoorn.qiddo_register.repository.PersonRepository;

@Service
public class PersonService {

    private final PersonRepository personRepository;

    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public List<Person> findAll() {
        return personRepository.findAll();
    }

    public Person findById(Long id) {
        return personRepository.findById(id).orElse(null);
    }

    public Person save(Person person) {
        return personRepository.save(person);
    }

    public void deleteById(Long id) {
        personRepository.deleteById(id);
    }
}