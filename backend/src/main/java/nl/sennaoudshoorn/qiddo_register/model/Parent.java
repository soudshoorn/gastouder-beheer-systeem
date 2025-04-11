package nl.sennaoudshoorn.qiddo_register.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;

@Entity
public class Parent extends Person {

    private String telefoonnummer;
    private String email;

    public Parent() {
    }

    public Parent(String naam, LocalDate geboortedatum,
                  String telefoonnummer, String email) {
        super(naam, geboortedatum);
        this.telefoonnummer = telefoonnummer;
        this.email = email;
    }

    // Getters en setters
    public String getTelefoonnummer() {
        return telefoonnummer;
    }
    public void setTelefoonnummer(String telefoonnummer) {
        this.telefoonnummer = telefoonnummer;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String getRolOmschrijving() {
        return "Ik ben een ouder in het Qiddo-register.";
    }
}