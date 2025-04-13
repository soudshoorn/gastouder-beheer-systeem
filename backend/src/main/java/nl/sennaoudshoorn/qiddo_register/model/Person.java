package nl.sennaoudshoorn.qiddo_register.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Basis klasse voor alle personen in het systeem.
 * Deze klasse bevat de gemeenschappelijke eigenschappen van zowel ouders als kinderen.
 */
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
public abstract class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String naam;

    @Column(nullable = false)
    private String geboortedatum;

    @Column(nullable = false)
    private String gender = "Onbekend"; // Standaardwaarde voor geslacht

    public Person() {
        this.gender = "Onbekend";
    }

    public Person(String naam, String geboortedatum, String gender) {
        this.naam = naam;
        this.geboortedatum = geboortedatum;
        this.gender = gender != null ? gender : "Onbekend";
    }

    // Getters en setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNaam() {
        return naam;
    }
    public void setNaam(String naam) {
        this.naam = naam;
    }

    public String getGeboortedatum() {
        return geboortedatum;
    }
    public void setGeboortedatum(String geboortedatum) {
        this.geboortedatum = geboortedatum;
    }

    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }

    /**
     * Abstracte methode die door subklassen moet worden geïmplementeerd
     * om de rol van de persoon te beschrijven.
     * @return Een beschrijving van de rol van de persoon
     */
    public abstract String getRolOmschrijving();
}