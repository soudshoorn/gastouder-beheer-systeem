package nl.sennaoudshoorn.qiddo_register.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import nl.sennaoudshoorn.qiddo_register.model.Child;
import nl.sennaoudshoorn.qiddo_register.model.Parent;
import nl.sennaoudshoorn.qiddo_register.repository.ChildRepository;
import nl.sennaoudshoorn.qiddo_register.repository.ParentRepository;

@Service
public class ChildService {

    @Autowired
    private ChildRepository childRepository;

    @Autowired
    private ParentRepository parentRepository;

    public List<Child> getAllChildren() {
        return childRepository.findAll();
    }

    public Optional<Child> getChildById(Long id) {
        return childRepository.findById(id);
    }

    @Transactional
    public Child createChild(Child child) {
        // The Child entity extends Person, so when we save a Child,
        // JPA will automatically create both the person and child records
        return childRepository.save(child);
    }

    @Transactional
    public Optional<Child> updateChild(Long id, Child child) {
        if (!childRepository.existsById(id)) {
            return Optional.empty();
        }

        // Create a new Child instance with the updated data
        Child existingChild = childRepository.findById(id).orElse(null);
        if (existingChild != null) {
            existingChild.setNaam(child.getNaam());
            existingChild.setGeboortedatum(child.getGeboortedatum());
            existingChild.setGender(child.getGender());
            existingChild.setAllergies(child.getAllergies());
            existingChild.setDietaryPreferences(child.getDietaryPreferences());
            existingChild.setNotes(child.getNotes());
            existingChild.setActive(child.isActive());
            existingChild.setParent(child.getParent());
            return Optional.of(childRepository.save(existingChild));
        }
        return Optional.empty();
    }

    @Transactional
    public boolean deleteChild(Long id) {
        if (!childRepository.existsById(id)) {
            return false;
        }

        childRepository.deleteById(id);
        return true;
    }

    public List<Child> getChildrenByParentId(Long parentId) {
        return childRepository.findByParentId(parentId);
    }

    public List<Child> getActiveChildren() {
        return childRepository.findByActiveTrue();
    }

    public List<Child> getInactiveChildren() {
        return childRepository.findByActiveFalse();
    }
}