package nl.sennaoudshoorn.qiddo_register.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import nl.sennaoudshoorn.qiddo_register.model.Child;
import nl.sennaoudshoorn.qiddo_register.repository.ChildRepository;

@Service
public class ChildService {

    private final ChildRepository childRepository;

    public ChildService(ChildRepository childRepository) {
        this.childRepository = childRepository;
    }

    public List<Child> findAll() {
        return childRepository.findAll();
    }

    public Child findById(Long id) {
        return childRepository.findById(id).orElse(null);
    }

    public Child save(Child child) {
        return childRepository.save(child);
    }

    public void deleteById(Long id) {
        childRepository.deleteById(id);
    }

        public Child updateChild(Long id, Child updatedChild) {
        Child existing = childRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Kind niet gevonden met id " + id));

        existing.setNaam(updatedChild.getNaam());
        existing.setGeboortedatum(updatedChild.getGeboortedatum());
        existing.setAllergieen(updatedChild.getAllergieen());
        existing.setVoorkeurEten(updatedChild.getVoorkeurEten());
        existing.setStartDatum(updatedChild.getStartDatum());
        existing.setEindDatum(updatedChild.getEindDatum());
        existing.setUrenPerWeek(updatedChild.getUrenPerWeek());
        existing.setContactPersoon(updatedChild.getContactPersoon());

        return childRepository.save(existing);
    }
}