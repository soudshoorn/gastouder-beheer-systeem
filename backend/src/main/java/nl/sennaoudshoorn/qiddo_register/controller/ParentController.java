package nl.sennaoudshoorn.qiddo_register.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import nl.sennaoudshoorn.qiddo_register.model.Parent;
import nl.sennaoudshoorn.qiddo_register.service.ParentService;

@RestController
@RequestMapping("/api/parents")
public class ParentController {

    private final ParentService parentService;

    public ParentController(ParentService parentService) {
        this.parentService = parentService;
    }

    @GetMapping
    public ResponseEntity<List<Parent>> getAllParents() {
        return ResponseEntity.ok(parentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Parent> getParentById(@PathVariable Long id) {
        Parent parent = parentService.findById(id);
        return parent != null ? ResponseEntity.ok(parent) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Parent> createParent(@RequestBody Parent parent) {
        // Ensure gender is set
        if (parent.getGender() == null) {
            parent.setGender("Onbekend");
        }
        return ResponseEntity.ok(parentService.save(parent));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParent(@PathVariable Long id) {
        parentService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Parent> updateParent(@PathVariable Long id, @RequestBody Parent updatedParent) {
        Parent parent = parentService.updateParent(id, updatedParent);
        return parent != null ? ResponseEntity.ok(parent) : ResponseEntity.notFound().build();
    }
}