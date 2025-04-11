package nl.sennaoudshoorn.qiddo_register.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import nl.sennaoudshoorn.qiddo_register.model.Person;
import nl.sennaoudshoorn.qiddo_register.service.PersonService;

@RestController
@RequestMapping("/api/persons")
public class PersonController {

    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping
    public List<Person> getAll() {
        return personService.findAll();
    }

    @GetMapping("/{id}")
    public Person getById(@PathVariable Long id) {
        return personService.findById(id);
    }

    @PostMapping
    public Person create(@RequestBody Person person) {
        return personService.save(person);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        personService.deleteById(id);
    }
}