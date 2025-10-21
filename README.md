# Cabby Texts

Hello and welcome to the Cabby Texts project. This project is a part of the Cabby project, which is an AI-based cabin crew announcements generator.

You can find more information about the Cabby [on the official website](https://www.flyingart.dev/cabby).

## Currently supported languages
- English (en)
- German (de)
- Spanish (es)
- French (fr)
- Italian (it)
- Portuguese - Brazil (pt_br)
- Portuguese - Portugal (pt_pt)
- Polish (pl)
- Turkish (tr)
- Dutch (nl)
- Korean (ko)
- Norwegian (no)
- Thai (th) - Temporary disabled due to translation service issues
- Chinese - Simplified (zh)
- Japanese (ja)
- Arabic (ar)
- Hungarian (hu)

Please feel free to add more languages by creating a pull request. The more languages we have, the better the service will be.

### Language selection algorithm

Cabby always puts English as the first language in the list. 

The second language is taken using the following algorithm:
- get origin airport country language
- get destination airport country language
- order them by predefined priority (subject to change)
- take the first language from the list
- combine it with English

## Basics

You can find all the texts used in the Cabby project here. They're located in the `texts.ts` file, together with the `Text` type definition. 

Please pay attention to the `Text` type definition, as it contains all the necessary information about the text, it's definition, and has some comments to help you understand the structure.

## Structure

Typical text structure looks like this:

```json
{
  ...,
  "texts": [
    {
      "en": "Ladies and gentlemen, we are starting our descent into {destinationCityName}. Please make sure that your seatbelt is fastened and your seat back and tray table are in the upright position. We will collect any remaining service items in a few minutes. Thank you.",
      "pl": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Prosimy o upewnienie się, że Państwa pasy są zapięte, a oparcie fotela i stolik są w pozycji pionowej. Wkrótce zbierzemy śmieci. Dziękujemy."
    }
  ]
}
```

### Variables

You can use one of the following variables in the text, by wrapping them in curly braces `{}`:

- **originCityName** - _example: "Warsaw"_
- **destinationCityName** - _example: "London"_
- **captainName** - _example: "John"_
- **airlineName** - _example: "Lufthansa"_
- **crewName** - _example: "Emily"_
- **aircraftEmergencyExistsCount** - _example: "6"_
- **flightTime** - _example: "2 hours and 30 minutes"_
- **destinationCityTemperature** - _example: "25"_
- **destinationCityWeatherHumanDescription** - _example: "sunny"_
- **flightNumber** - _example: "123EW"_

### Translation

Some of the languages may have different declinations for specific words. For example, in Polish, we have different declinations for the word "Warsaw" depending on the context:

- Lot do **Warszaw-y**
- Lądownie w **Warszaw-ie**
- Nasza destynacja to **Warszaw-a**

This may apply to other words as well, for example airline names, cities, etc.

To avoid headaches, you can wrap such sentence **(in ENGLISH)** in square brackets `[]`. Such sentence will be sent to the translation service, and the translation will be used in the final text. AI based translation services are pretty good at handling such cases.

## Airline-specific context

Cabby now supports airline-specific context to provide more accurate and relevant announcements. This feature allows for customized announcements that reflect each airline's unique characteristics, loyalty programs, and branding. This will be used for the "AI-generated scenarios" only.

### Airline context files

Airline-specific context is stored in individual text files within the `airlines/` folder. Each file follows a specific naming convention and format:

**File naming format:** `{AIRLINE_ICAO}.txt`

Where `{AIRLINE_ICAO}` is the 3-letter ICAO airline code (e.g., `AAL` for American Airlines, `DLH` for Lufthansa, `SIA` for Singapore Airlines).

### File format

Each airline context file should contain:

1. **Program name:** The airline's loyalty program name
2. **Description:** Detailed information about the loyalty program, including:
   - How members earn miles/points
   - Status tiers and their benefits
   - Partner relationships
   - Unique program features

### Example

```
Program name: Miles & More

This is the central loyalty / frequent flyer programme used across Lufthansa Group. 
It has status levels (Frequent Traveller, Senator, HON Circle) and uses "miles / points / qualifying / HON Circle points" depending on the level. 
Also, many partner airlines use Miles & More (including LOT, Swiss, Austrian, etc.).
```

### Adding new airlines

To add context for a new airline:

1. Create a new text file in the `airlines/` folder
2. Use the airline's 3-letter ICAO code as the filename (e.g., `ABC.txt`)
3. Follow the format described above
4. Include the program name and detailed description

## Contact

If you have any questions, feel free to contact me at [Discord](https://discord.gg/pmAtpESgbH) or any other way you prefer. I'm always happy to help.
