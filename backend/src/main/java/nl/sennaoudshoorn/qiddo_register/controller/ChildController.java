package nl.sennaoudshoorn.qiddo_register.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import nl.sennaoudshoorn.qiddo_register.model.Child;
import nl.sennaoudshoorn.qiddo_register.service.ChildService;

@RestController
@RequestMapping("/api/children")
public class ChildController {

    private final ChildService childService;

    public ChildController(ChildService childService) {
        this.childService = childService;
    }

    @GetMapping
    public List<Child> getAllChildren() {
        return childService.findAll();
    }

    @GetMapping("/{id}")
    public Child getChildById(@PathVariable Long id) {
        return childService.findById(id);
    }

    @PostMapping
    public Child createChild(@RequestBody Child child) {
        return childService.save(child);
    }

    @DeleteMapping("/{id}")
    public void deleteChild(@PathVariable Long id) {
        childService.deleteById(id);
    }
    
    @PutMapping("/{id}")
    public Child updateChild(@PathVariable Long id, @RequestBody Child updatedChild) {
        return childService.updateChild(id, updatedChild);
    }
}