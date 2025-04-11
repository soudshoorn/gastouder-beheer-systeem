package nl.sennaoudshoorn.qiddo_register.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String naam;
    private LocalDate geboortedatum;

    public Person() {
    }

    public Person(String naam, LocalDate geboortedatum) {
        this.naam = naam;
        this.geboortedatum = geboortedatum;
    }

    // Getters en setters
    public Long getId() {
        return id;
    }

    public String getNaam() {
        return naam;
    }
    public void setNaam(String naam) {
        this.naam = naam;
    }

    public LocalDate getGeboortedatum() {
        return geboortedatum;
    }
    public void setGeboortedatum(LocalDate geboortedatum) {
        this.geboortedatum = geboortedatum;
    }

    // Abstracte methode voor polymorfisme
    public abstract String getRolOmschrijving();
}