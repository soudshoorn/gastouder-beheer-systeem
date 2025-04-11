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
    public List<Parent> getAllParents() {
        return parentService.findAll();
    }

    @GetMapping("/{id}")
    public Parent getParentById(@PathVariable Long id) {
        return parentService.findById(id);
    }

    @PostMapping
    public Parent createParent(@RequestBody Parent parent) {
        return parentService.save(parent);
    }

    @DeleteMapping("/{id}")
    public void deleteParent(@PathVariable Long id) {
        parentService.deleteById(id);
    }

    @PutMapping("/{id}")
    public Parent updateParent(@PathVariable Long id, @RequestBody Parent updatedParent) {
      return parentService.updateParent(id, updatedParent);
    }
}