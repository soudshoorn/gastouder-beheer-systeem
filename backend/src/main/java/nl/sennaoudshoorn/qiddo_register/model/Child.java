package nl.sennaoudshoorn.qiddo_register.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Klasse die een kind in het systeem vertegenwoordigt.
 * Een kind heeft specifieke eigenschappen zoals allergieën en dieetvoorkeuren.
 */
@Entity
@Table(name = "child")
@DiscriminatorValue("CHILD")
@Getter
@Setter
public class Child extends Person {
    @Column
    private String allergies; // Allergieën van het kind

    @Column
    private String dietaryPreferences; // Dieetvoorkeuren van het kind

    @Column
    private String notes; // Extra notities over het kind

    @Column
    private boolean active = true; // Geeft aan of het kind nog actief is in de opvang

    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent; // De ouder van het kind

    public Child() {
        super();
    }

    public Child(String naam, String geboortedatum, String gender, Parent parent) {
        super(naam, geboortedatum, gender);
        this.parent = parent;
    }

    @Override
    public String getRolOmschrijving() {
        return "Kind";
    }

    // Getters and Setters
    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getDietaryPreferences() {
        return dietaryPreferences;
    }

    public void setDietaryPreferences(String dietaryPreferences) {
        this.dietaryPreferences = dietaryPreferences;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Parent getParent() {
        return parent;
    }

    public void setParent(Parent parent) {
        this.parent = parent;
    }
}