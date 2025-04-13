package nl.sennaoudshoorn.qiddo_register.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Klasse die een ouder in het systeem vertegenwoordigt.
 * Een ouder kan meerdere kinderen hebben en heeft contactgegevens.
 */
@Entity
@Table(name = "parent")
@DiscriminatorValue("PARENT")
@Getter
@Setter
public class Parent extends Person {
    @Column
    private String email; // E-mailadres van de ouder

    @Column
    private String phone; // Telefoonnummer van de ouder

    @Column
    private String address; // Adres van de ouder

    public Parent() {
        super();
    }

    public Parent(String naam, String geboortedatum, String gender) {
        super(naam, geboortedatum, gender);
    }

    @Override
    public String getRolOmschrijving() {
        return "Ouder";
    }

    // Explicit getters and setters for compatibility
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}