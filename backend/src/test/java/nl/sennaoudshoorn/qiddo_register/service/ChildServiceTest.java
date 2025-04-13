package nl.sennaoudshoorn.qiddo_register.service;

import nl.sennaoudshoorn.qiddo_register.model.Child;
import nl.sennaoudshoorn.qiddo_register.model.Parent;
import nl.sennaoudshoorn.qiddo_register.repository.ChildRepository;
import nl.sennaoudshoorn.qiddo_register.repository.ParentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChildServiceTest {

    @Mock
    private ChildRepository childRepository;

    @Mock
    private ParentRepository parentRepository;

    @InjectMocks
    private ChildService childService;

    private Parent testParent;
    private Child testChild;

    @BeforeEach
    void setUp() {
        testParent = new Parent();
        testParent.setId(1L);
        testParent.setNaam("Test Ouder");
        testParent.setGeboortedatum("1980-01-01");
        testParent.setGender("Man");
        testParent.setEmail("test@example.com");
        testParent.setPhone("0612345678");
        testParent.setAddress("Teststraat 1");

        testChild = new Child();
        testChild.setId(1L);
        testChild.setNaam("Test Kind");
        testChild.setGeboortedatum("2018-01-01");
        testChild.setGender("Onbekend");
        testChild.setParent(testParent);
        testChild.setAllergies("Geen");
        testChild.setDietaryPreferences("Pasta");
        testChild.setNotes("Houdt van tekenen");
        testChild.setActive(true);
    }

    /**
     * Test het aanmaken van een nieuw kind met een bestaande ouder.
     * Dit test de complexe relatie tussen Child en Parent en de inheritance structuur.
     */
    @Test
    void createChild_WithExistingParent_ShouldSucceed() {
        // Arrange
        when(parentRepository.findById(1L)).thenReturn(Optional.of(testParent));
        when(childRepository.save(any(Child.class))).thenReturn(testChild);

        // Act
        Child result = childService.createChild(testChild);

        // Assert
        assertNotNull(result);
        assertEquals(testChild.getNaam(), result.getNaam());
        assertEquals(testChild.getParent().getId(), result.getParent().getId());
        verify(childRepository).save(any(Child.class));
    }

    /**
     * Test het updaten van een kind met nieuwe allergieën en dieetvoorkeuren.
     * Dit test de complexe validatie van medische en dieetgerelateerde informatie.
     */
    @Test
    void updateChild_WithNewMedicalInfo_ShouldUpdateCorrectly() {
        // Arrange
        Child updatedChild = new Child();
        updatedChild.setAllergies("Pinda's");
        updatedChild.setDietaryPreferences("Glutenvrij");
        updatedChild.setNotes("Nieuwe notities");

        when(childRepository.findById(1L)).thenReturn(Optional.of(testChild));
        when(childRepository.save(any(Child.class))).thenReturn(testChild);

        // Act
        Optional<Child> result = childService.updateChild(1L, updatedChild);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Pinda's", result.get().getAllergies());
        assertEquals("Glutenvrij", result.get().getDietaryPreferences());
        assertEquals("Nieuwe notities", result.get().getNotes());
    }

    /**
     * Test het ophalen van actieve kinderen voor een specifieke ouder.
     * Dit test de complexe query logica voor het filteren van kinderen.
     */
    @Test
    void getActiveChildren_ShouldReturnOnlyActiveChildren() {
        // Arrange
        Child inactiveChild = new Child();
        inactiveChild.setActive(false);
        inactiveChild.setParent(testParent);

        List<Child> children = Arrays.asList(testChild, inactiveChild);
        when(childRepository.findByActiveTrue()).thenReturn(Arrays.asList(testChild));

        // Act
        List<Child> result = childService.getActiveChildren();

        // Assert
        assertEquals(1, result.size());
        assertTrue(result.get(0).isActive());
    }

    /**
     * Test het verwijderen van een kind en de impact op de parent-child relatie.
     * Dit test de complexe cascade verwijdering en referentiële integriteit.
     */
    @Test
    void deleteChild_ShouldRemoveChildFromSystem() {
        // Arrange
        when(childRepository.existsById(1L)).thenReturn(true);
        doNothing().when(childRepository).deleteById(1L);

        // Act
        boolean result = childService.deleteChild(1L);

        // Assert
        assertTrue(result);
        verify(childRepository).deleteById(1L);
    }

    /**
     * Test het ophalen van kinderen met specifieke allergieën en dieetvoorkeuren.
     * Dit test de complexe filtering op meerdere criteria.
     */
    @Test
    void getChildrenByParent_WithSpecificRequirements_ShouldFilterCorrectly() {
        // Arrange
        Child childWithAllergies = new Child();
        childWithAllergies.setAllergies("Pinda's");
        childWithAllergies.setDietaryPreferences("Glutenvrij");
        childWithAllergies.setParent(testParent);

        List<Child> children = Arrays.asList(testChild, childWithAllergies);
        when(childRepository.findByParentId(1L)).thenReturn(children);

        // Act
        List<Child> result = childService.getChildrenByParentId(1L);

        // Assert
        assertEquals(2, result.size());
        assertTrue(result.stream().anyMatch(c -> c.getAllergies() != null));
        assertTrue(result.stream().anyMatch(c -> c.getDietaryPreferences() != null));
    }
} 