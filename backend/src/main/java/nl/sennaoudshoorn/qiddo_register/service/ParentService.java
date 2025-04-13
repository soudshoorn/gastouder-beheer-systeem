package nl.sennaoudshoorn.qiddo_register.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import nl.sennaoudshoorn.qiddo_register.model.Parent;
import nl.sennaoudshoorn.qiddo_register.repository.ParentRepository;

@Service
public class ParentService {

    private final ParentRepository parentRepository;

    public ParentService(ParentRepository parentRepository) {
        this.parentRepository = parentRepository;
    }

    public List<Parent> findAll() {
        return parentRepository.findAll();
    }

    public Optional<Parent> getParentById(Long id) {
        return parentRepository.findById(id);
    }

    public Parent findById(Long id) {
        return parentRepository.findById(id).orElse(null);
    }

    public Parent save(Parent parent) {
        return parentRepository.save(parent);
    }

    public void deleteById(Long id) {
        parentRepository.deleteById(id);
    }

    public Parent updateParent(Long id, Parent updatedParent) {
        Parent existing = parentRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Ouder niet gevonden met id " + id
            ));

        // Velden overschrijven
        existing.setNaam(updatedParent.getNaam());
        existing.setGeboortedatum(updatedParent.getGeboortedatum());
        existing.setPhone(updatedParent.getPhone());
        existing.setEmail(updatedParent.getEmail());
        existing.setAddress(updatedParent.getAddress());

        return parentRepository.save(existing);
    }
}