package nl.sennaoudshoorn.qiddo_register.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;

@Entity
public class Child extends Person {

    private String allergieen;
    private String voorkeurEten;
    private LocalDate startDatum;
    private LocalDate eindDatum;
    private int urenPerWeek;
    private String contactPersoon;

    public Child() {
    }

    public Child(String naam, LocalDate geboortedatum,
                 String allergieen, String voorkeurEten,
                 LocalDate startDatum, LocalDate eindDatum,
                 int urenPerWeek, String contactPersoon) {
        super(naam, geboortedatum);
        this.allergieen = allergieen;
        this.voorkeurEten = voorkeurEten;
        this.startDatum = startDatum;
        this.eindDatum = eindDatum;
        this.urenPerWeek = urenPerWeek;
        this.contactPersoon = contactPersoon;
    }

    // Getters en setters
    public String getAllergieen() {
        return allergieen;
    }
    public void setAllergieen(String allergieen) {
        this.allergieen = allergieen;
    }

    public String getVoorkeurEten() {
        return voorkeurEten;
    }
    public void setVoorkeurEten(String voorkeurEten) {
        this.voorkeurEten = voorkeurEten;
    }

    public LocalDate getStartDatum() {
        return startDatum;
    }
    public void setStartDatum(LocalDate startDatum) {
        this.startDatum = startDatum;
    }

    public LocalDate getEindDatum() {
        return eindDatum;
    }
    public void setEindDatum(LocalDate eindDatum) {
        this.eindDatum = eindDatum;
    }

    public int getUrenPerWeek() {
        return urenPerWeek;
    }
    public void setUrenPerWeek(int urenPerWeek) {
        this.urenPerWeek = urenPerWeek;
    }

    public String getContactPersoon() {
        return contactPersoon;
    }
    public void setContactPersoon(String contactPersoon) {
        this.contactPersoon = contactPersoon;
    }

    @Override
    public String getRolOmschrijving() {
        return "Ik ben een kind in het Qiddo-register.";
    }
}