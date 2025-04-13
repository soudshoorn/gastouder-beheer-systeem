package nl.sennaoudshoorn.qiddo_register.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import nl.sennaoudshoorn.qiddo_register.model.Child;
import nl.sennaoudshoorn.qiddo_register.model.Parent;
import nl.sennaoudshoorn.qiddo_register.service.ChildService;
import nl.sennaoudshoorn.qiddo_register.service.ParentService;

@RestController
@RequestMapping("/api/children")
public class ChildController {

    @Autowired
    private ChildService childService;

    @Autowired
    private ParentService parentService;

    @GetMapping
    public ResponseEntity<List<Child>> getAllChildren() {
        return ResponseEntity.ok(childService.getAllChildren());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Child> getChildById(@PathVariable Long id) {
        return childService.getChildById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Child> createChild(@RequestBody Child child) {
        // Ensure parent exists
        if (child.getParent() == null || child.getParent().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        // Fetch the parent to ensure it exists
        Optional<Parent> parentOpt = parentService.getParentById(child.getParent().getId());
        if (parentOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Set the parent
        child.setParent(parentOpt.get());
        
        // Create the child
        Child createdChild = childService.createChild(child);
        return ResponseEntity.ok(createdChild);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Child> updateChild(@PathVariable Long id, @RequestBody Child child) {
        // Ensure parent exists
        if (child.getParent() == null || child.getParent().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        // Fetch the parent to ensure it exists
        Optional<Parent> parentOpt = parentService.getParentById(child.getParent().getId());
        if (parentOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Set the parent
        child.setParent(parentOpt.get());
        
        return childService.updateChild(id, child)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChild(@PathVariable Long id) {
        if (childService.deleteChild(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<Child>> getChildrenByParent(@PathVariable Long parentId) {
        return ResponseEntity.ok(childService.getChildrenByParentId(parentId));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Child>> getActiveChildren() {
        return ResponseEntity.ok(childService.getActiveChildren());
    }

    @GetMapping("/inactive")
    public ResponseEntity<List<Child>> getInactiveChildren() {
        return ResponseEntity.ok(childService.getInactiveChildren());
    }
}