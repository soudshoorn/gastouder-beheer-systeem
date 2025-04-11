package nl.sennaoudshoorn.qiddo_register;

import com.fasterxml.jackson.databind.ObjectMapper;
import nl.sennaoudshoorn.qiddo_register.model.Child;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Deze klasse demonstreert drie tests die elk
 * een ander onderdeel van de User Stories en acceptatiecriteria testen.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ChildControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper; // voor JSON-conversie

    /**
     * User Story 1 (voorbeeld):
     * "Als gastouder wil ik snel een kind kunnen toevoegen, 
     * zodat ik de gegevens niet in Word of papier hoef bij te houden."
     *
     * Acceptatiecriterium (verkort):
     * "Gegeven dat de gastouder een JSON met basisgegevens invult
     * (als de gastouder op 'Kind toevoegen' klikt) 
     * is het resultaat dat het kind wordt opgeslagen en verschijnt in de lijst."
     */
    @Test
    @DisplayName("Test het aanmaken van een nieuw kind via POST /api/children")
    void testCreateChild() throws Exception {
        Child newChild = new Child();
        newChild.setNaam("Lisa");
        newChild.setGeboortedatum(LocalDate.of(2017, 3, 21));
        newChild.setAllergieen("Pinda's");
        newChild.setVoorkeurEten("Pasta");
        newChild.setStartDatum(LocalDate.of(2023, 9, 1));
        newChild.setEindDatum(LocalDate.of(2024, 1, 31));
        newChild.setUrenPerWeek(20);
        newChild.setContactPersoon("Janet");

        mockMvc.perform(post("/api/children")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newChild)))
                .andExpect(status().isOk()) // of isCreated() als je dat zo hebt ingesteld
                .andExpect(jsonPath("$.naam").value("Lisa"))
                .andExpect(jsonPath("$.voorkeurEten").value("Pasta"));
    }

    /**
     * User Story 2 (voorbeeld):
     * "Als gastouder wil ik de details van een kind kunnen inzien,
     * zodat ik gemakkelijk contact kan opnemen met de ouder."
     *
     * Acceptatiecriterium (verkort):
     * "Gegeven dat het kind in de database staat
     * (als de gastouder de child-details opvraagt),
     * is het resultaat dat alle informatie correct wordt teruggegeven."
     */
    @Test
    @DisplayName("Test het ophalen van een kind via GET /api/children/{id}")
    void testGetChildById() throws Exception {
        // We kunnen eerst een kind toevoegen (Arrange)
        Child newChild = new Child();
        newChild.setNaam("Tom");
        newChild.setGeboortedatum(LocalDate.of(2016, 7, 11));
        newChild.setAllergieen("Geen");
        newChild.setVoorkeurEten("Hutspot");
        newChild.setStartDatum(LocalDate.of(2023, 9, 15));
        newChild.setEindDatum(LocalDate.of(2024, 6, 1));
        newChild.setUrenPerWeek(15);
        newChild.setContactPersoon("Linda");

        // Sla het kind op
        String response = mockMvc.perform(post("/api/children")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newChild)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Haal de gegenereerde id eruit (of parse via Jackson)
        Child createdChild = objectMapper.readValue(response, Child.class);
        Long childId = createdChild.getId();

        // When: de gastouder haalt het kind op via GET
        mockMvc.perform(get("/api/children/{id}", childId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.naam").value("Tom"))
                .andExpect(jsonPath("$.urenPerWeek").value(15));
    }

    /**
     * User Story 3 (voorbeeld):
     * "Als gastouder wil ik de gegevens van een kind kunnen bijwerken,
     * zodat ik veranderingen, zoals voedselvoorkeuren, direct kan aanpassen."
     *
     * Acceptatiecriterium (verkort):
     * "Gegeven dat het kind al bestaat
     * (als de gastouder een PUT met gewijzigde gegevens stuurt),
     * is het resultaat dat de nieuwe velden zijn opgeslagen."
     */
    @Test
    @DisplayName("Test het bijwerken van een kind via PUT /api/children/{id}")
    void testUpdateChild() throws Exception {
        // 1. Eerst een kind aanmaken (Arrange)
        Child newChild = new Child();
        newChild.setNaam("Mila");
        newChild.setGeboortedatum(LocalDate.of(2018, 1, 5));
        newChild.setAllergieen("Gluten");
        newChild.setVoorkeurEten("Brood");
        newChild.setStartDatum(LocalDate.of(2023, 10, 1));
        newChild.setEindDatum(LocalDate.of(2024, 3, 15));
        newChild.setUrenPerWeek(25);
        newChild.setContactPersoon("Peter");

        String response = mockMvc.perform(post("/api/children")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newChild)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Child createdChild = objectMapper.readValue(response, Child.class);
        Long childId = createdChild.getId();

        // 2. Wijzig nu bijvoorbeeld de allergie en de urenPerWeek
        createdChild.setAllergieen("Pinda's en Gluten");
        createdChild.setUrenPerWeek(30);

        // 3. Voer de PUT-request uit (Act)
        mockMvc.perform(put("/api/children/{id}", childId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createdChild)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.allergieen").value("Pinda's en Gluten"))
                .andExpect(jsonPath("$.urenPerWeek").value(30));
    }
}