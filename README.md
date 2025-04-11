# Gastouder Beheer Systeem

## API Routes

### Kinderen (Children)
- **GET** `/api/children`  
  Haal een lijst met alle kinderen op.

- **GET** `/api/children/{id}`  
  Haal de gegevens van één kind op aan de hand van het ID.

- **POST** `/api/children`  
  Maak een nieuw kind aan (stuur JSON met velden als `naam`, `geboortedatum`, `allergieen`, `urenPerWeek`, enz.).

- **PUT** `/api/children/{id}`  
  Werk een bestaand kind bij (stuur JSON met de volledige of gewijzigde data).

- **DELETE** `/api/children/{id}`  
  Verwijder een kind op basis van het ID.

---

### Ouders (Parents)
- **GET** `/api/parents`  
  Haal een lijst met alle ouders op.

- **GET** `/api/parents/{id}`  
  Haal de gegevens van één ouder op aan de hand van het ID.

- **POST** `/api/parents`  
  Maak een nieuwe ouder aan (stuur JSON met velden als `naam`, `geboortedatum`, `telefoonnummer`, `email`).

- **PUT** `/api/parents/{id}`  
  Werk een bestaande ouder bij (stuur JSON met de volledige of gewijzigde data).

- **DELETE** `/api/parents/{id}`  
  Verwijder een ouder op basis van het ID.
