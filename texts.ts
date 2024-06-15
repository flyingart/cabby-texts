type Text = {
  category: string; // Category of the text. If the same category is used in multiple texts, only one of them will be played if text is triggered by flightStateChange event.
  weight?: number; // >= 1, default 1. This may be useful when determining which text to play when multiple texts are in the same category, and one of them should be played more often than others (basing on conditions for example).
  chanceOfPlaying?: number; // 0 - 1. If set, the text will be played with this chance. If not set, the text will always be played.
  runtimeGenerated?: boolean; // If set to true, the text will be generated at runtime, not in pre-flight generation. This may be useful when the text should be generated based on the current state of the flight (e.g. captain random information about the flight).
  onlyPriorityLanguage?: boolean; // If set to true, the text will be played only in the priority language.
  numberOfEagerTextGenerations?: number; // Number of eager text generations. If some message can be played multiple times (like Seatbelt sign change), you can set this number to generate multiple texts in advance.
  chime?: 'DING' | 'DONG' | 'DING_DONG'; // If set, the sound will be played before the text.

  // Trigger event
  trigger: {
    event: 'simValueChanged';
    key: string[];
    newValue: number[];
  } | {
    event: 'flightStateChange';
    value: string[];
    ignoreFlightStateChange?: string[]; // By default, Cabby will ignore messages scheduled to be played during one phase, when the flight state changes to another phase. If you want to play the message anyway, you can add the flight state to this array.
  } | {
    event: 'messagePlayed';
    category: string[];
  } | {
    event: 'runtimeFlightMetadataChange';
    key: string[];
    newValue: number[];
  },

  // Additional conditions. If trigger was met, the text will be played only if all conditions are met.
  conditions?: ({
    type: 'flightState' | 'settingActive' | 'settingNotActive' | 'airlineCode';
    value: string[];
  } | {
    type: 'runtimeFlightMetadata';
    key: string;
    value: (string|number)[];
  })[];

  // Timeout for the text to be played after the trigger event was met. The text will be played after a random time between the two values (in seconds).
  timeout: [number, number],

  // Set of texts in different languages. One of them will be played randomly
  texts: {
    [key: string]: string;
  }[];
};

const texts: Text[] = [
  // Event changes

  // Seatbelt sign changes
  {
    "category": "captain-seatbelt-sign-change-information",
    "trigger": {"event": "simValueChanged", "key": ["seatBelt"], "newValue": [1]},
    "conditions": [
      {"type": "flightState", "value": ["FLIGHT_CRUISE"]}
    ],
    "timeout": [2, 5],
    "numberOfEagerTextGenerations": 2,
    "texts": [
      {
        "en": "Ladies and gentlemen, we are expecting some light turbulence ahead. Please return to your seats and fasten your seat belts.",
        "pl": "Szanowni państwo, spodziewamy się lekkich turbulencji. Prosimy o powrót na miejsca i zapięcie pasów bezpieczeństwa.",
        "de": "Sehr geehrte Damen und Herren, wir rechnen mit leichten Turbulenzen. Bitte kehren Sie zu Ihren Plätzen zurück und schnallen Sie sich an.",
        "pt": "Senhoras e senhores, nós esperamos uma leve turbulência a frente. Por favor, retornem aos seus assentos e afivelem o cinto de segurança.",
        "es": "Señorías, se esperan ligeras turbulencias en el futuro. Por favor regresen a sus asientos y abróchense los cinturones.",
        "fr": "Mesdames et messieurs, nous nous attendons à de légères turbulences. Veuillez retourner à vos places et attacher vos ceintures de sécurité.",
        "it": "Signore e signori, ci aspettiamo qualche leggera turbolenza in vista. Vi preghiamo di ritornare ai vostri posti e di allacciare le cinture di sicurezza."
      },
      {
        "en": "Ladies and gentlemen, we've just received information about some light turbulence ahead. Please return to your seats and remain seated until the seatbelt sign is turned off.",
        "pl": "Szanowni państwo, właśnie otrzymaliśmy informację o lekkich turbulencjach przed nami. Prosimy o powrót na miejsca i pozostanie na nich do momentu wyłączenia sygnału zapięcia pasów.",
        "de": "Sehr geehrte Damen und Herren, wir haben gerade Informationen über leichte Turbulenzen erhalten. Bitte kehren Sie zu Ihren Plätzen zurück und bleiben Sie sitzen, bis das Anschnallzeichen erlischt.",
        "pt": "Senhoras e senhores, acabamos de receber informações sobre uma leve turbulência à frente. Por favor, retornem aos seus assentos e permaneçam sentados até que o aviso de atar os cintos seja desligado.",
        "es": "Damas y caballeros, acabamos de recibir información sobre una ligera turbulencia que se avecina. Por favor regrese a sus asientos y permanezca sentado hasta que se apague la señal del cinturón de seguridad.",
        "fr": "Mesdames et messieurs, nous venons de recevoir des informations concernant de légères turbulences à venir. Veuillez retourner à vos sièges et rester assis jusqu'à ce que le signal de ceinture de sécurité s'éteigne.",
        "it": "Signore e signori, abbiamo appena ricevuto informazioni su alcune leggere turbolenze in vista. Si prega di tornare ai propri posti e rimanere seduti fino allo spegnimento del segnale delle cinture di sicurezza."
      },
      {
        "en": "Hello, this is your captain speaking. We had to turn on the seatbelt sign due to some light turbulence ahead. Please return to your seats and fasten your seat belts.",
        "pl": "Szanowni państwo, tu kapitan. Musieliśmy włączyć sygnał zapięcia pasów z powodu lekkich turbulencji przed nami. Prosimy o powrót na miejsca i zapięcie pasów.",
        "de": "Hallo, hier spricht Ihr Kapitän. Aufgrund leichter Turbulenzen vor uns wurde das Anschnallzeichen aktiviert. Bitte kehren Sie zu Ihren Plätzen zurück und schnallen Sie sich an.",
        "pt": "Olá pessoal, aqui é o comandante da aeronave. Tivemos que ligar o aviso de atar os cintos devido a uma turbulância leve a frente, por favor, retornem aos seus assentos e afivelem os cintos de segurança.",
        "es": "Hola, les habla su capitán. Tuvimos que encender la señal de cinturón de seguridad debido a unas ligeras turbulencias más adelante. Por favor regresen a sus asientos y abróchense los cinturones.",
        "fr": "Bonjour, c'est votre capitaine qui parle. Nous avons dû allumer le panneau de ceinture de sécurité en raison de légères turbulences à venir. Veuillez retourner à vos places et attacher vos ceintures de sécurité.",
        "it": "Salve, qui parla il vostro capitano. Abbiamo dovuto accendere il segnale delle cinture di sicurezza a causa di una leggera turbolenza davanti a noi. Vi preghiamo di ritornare ai vostri posti e di allacciare le cinture di sicurezza."
      }
    ]
  },
  {
    "category": "crew-seatbelt-sign-change-information",
    "trigger": {"event": "messagePlayed", "category": ["captain-seatbelt-sign-change-information"]},
    "conditions": [
      {"type": "flightState", "value": ["FLIGHT_CRUISE"]}
    ],
    "timeout": [2, 5],
    "numberOfEagerTextGenerations": 2,
    "texts": [
      {
        "en": "Ladies and gentlemen, our captain has just informed us that we are expecting some light turbulence ahead. Please return to your seats and remain seated until the seatbelt sign is turned off. Use of the lavatories is not allowed at this time.",
        "pl": "Szanowni państwo, nasz kapitan właśnie poinformował nas, że spodziewamy się lekkich turbulencji. Prosimy o powrót na miejsca i zapięcie pasów do momentu wyłączenia sygnału. Używanie toalet nie jest dozwolone w tym czasie.",
        "de": "Meine Damen und Herren, unser Kapitän hat uns gerade mitgeteilt, dass wir mit leichten Turbulenzen rechnen. Bitte kehren Sie zu Ihren Plätzen zurück und bleiben Sie sitzen, bis das Anschnallzeichen erlischt. Die Nutzung der Toiletten ist derzeit nicht gestattet.",
        "pt": "Senhoras e senhores, o comandante acaba de nos informar que passaremos por uma turbulência leve à frente. Permaneçam sentados até que o aviso de atar os cintos seja apagado. Neste momento não está permitido o uso dos lavatórios.",
        "es": "Damas y caballeros, nuestro capitán nos acaba de informar que esperamos ligeras turbulencias por delante. Por favor regrese a sus asientos y permanezca sentado hasta que se apague la señal del cinturón de seguridad. No se permite el uso de los baños en este momento.",
        "fr": "Mesdames et Messieurs, notre capitaine vient de nous informer que nous attendons de légères turbulences devant nous. Veuillez retourner à vos sièges et rester assis jusqu'à ce que le signal de ceinture de sécurité s'éteigne. L'utilisation des toilettes n'est pas autorisée pour le moment.",
        "it": "Signore e signori, il nostro capitano ci ha appena informato che ci aspettiamo qualche leggera turbolenza in vista. Si prega di tornare ai propri posti e rimanere seduti fino allo spegnimento del segnale delle cinture di sicurezza. Al momento non è consentito l'uso dei servizi igienici."
      },
      {
        "en": "Our captain has just informed us that we are expecting some light turbulence ahead. Please fasten your seatbelts.",
        "pl": "Nasz kapitan właśnie poinformował nas, że spodziewamy się lekkich turbulencji. Prosimy o zapięcie pasów.",
        "de": "Unser Kapitän hat uns gerade mitgeteilt, dass wir mit leichten Turbulenzen rechnen. Bitte legen Sie den Gurt an.",
        "pt": "Senhoras e senhores, o comandante acaba de nos informar que passaremos por uma turbulência leve à frente. Por favor, afivelem seus cintos de segurança.",
        "es": "Nuestro capitán nos acaba de informar que se esperan ligeras turbulencias por delante. Por favor, abrochen sus cinturones.",
        "fr": "Notre capitaine vient de nous informer que nous attendons de légères turbulences devant nous. Veuillez attacher vos ceintures de sécurité.",
        "it": "Il nostro capitano ci ha appena informato che ci aspettiamo una leggera turbolenza in vista. Per favore, allacciate le cinture di sicurezza."
      },
      {
        "en": "As you heard from our captain, we are expecting some light turbulence ahead. Please return to your seats and fasten your seat belts. Use of the lavatories is not allowed at this time.",
        "pl": "Jak mogli państwo usłyszeć od naszego kapitana, spodziewamy się lekkich turbulencji. Prosimy o powrót na miejsca i zapięcie pasów. Używanie toalet nie jest dozwolone w tym czasie.",
        "de": "Wie Sie von unserem Kapitän erfahren haben, rechnen wir mit leichten Turbulenzen. Bitte kehren Sie zu Ihren Plätzen zurück und schnallen Sie sich an. Die Nutzung der Toiletten ist derzeit nicht gestattet.",
        "pt": "Reforçamos que entraremos em uma área de turbulência à frente. Por favor, retornem aos seus assentos e afivelem os seus cintos. Neste momento não está permitido o uso dos lavatórios.",
        "es": "Como le dijo nuestro capitán, esperamos algunas turbulencias ligeras más adelante. Por favor regresen a sus asientos y abróchense los cinturones. No se permite el uso de los baños en este momento.",
        "fr": "Comme vous l'a dit notre capitaine, nous nous attendons à de légères turbulences à venir. Veuillez retourner à vos places et attacher vos ceintures de sécurité. L'utilisation des toilettes n'est pas autorisée pour le moment.",
        "it": "Come avete sentito dal nostro capitano, ci aspettiamo una leggera turbolenza in vista. Vi preghiamo di ritornare ai vostri posti e di allacciare le cinture di sicurezza. Al momento non è consentito l'uso dei servizi igienici."
      }
    ]
  },
  {
    "category": "crew-seatbelt-sign-change-information",
    "trigger": {"event": "simValueChanged", "key": ["seatBelt"], "newValue": [1]},
    "conditions": [
      {"type": "flightState", "value": ["FLIGHT_CRUISE"]},
      {"type": "settingNotActive", "value": ["captain-seatbelt-sign-change-information"]}
    ],
    "timeout": [2, 5],
    "numberOfEagerTextGenerations": 2,
    "texts": [
      {
        "en": "Ladies and gentlemen, the captain has turned on the seatbelt sign. Please return to your seats and fasten your seat belts.",
        "pl": "Szanowni państwo, kapitan właśnie włączył sygnał zapięcia pasów. Prosimy o powrót na miejsca i zapięcie pasów bezpieczeństwa.",
        "de": "Meine Damen und Herren, der Kapitän hat das Anschnallzeichen eingeschaltet. Bitte kehren Sie zu Ihren Plätzen zurück und schnallen Sie sich an.",
        "pt": "Senhoras e senhores, o comandante ligou o aviso de atar os cintos. Por favor, retornem aos seus assentos e afivelem seus cintos de segurança.",
        "es": "Damas y caballeros, el capitán ha activado la señal de cinturón de seguridad. Por favor regresen a sus asientos y abróchense los cinturones.",
        "fr": "Mesdames et messieurs, le capitaine a allumé le panneau de ceinture de sécurité. Veuillez retourner à vos places et attacher vos ceintures de sécurité.",
        "it": "Signore e signori, il capitano ha acceso il segnale delle cinture di sicurezza. Vi preghiamo di ritornare ai vostri posti e di allacciare le cinture di sicurezza."
      },
      {
        "en": "Ladies and gentlemen, the seatbelt sign has been turned on. Please return to your seats and fasten your seat belts. Use of the lavatories is not allowed at this time.",
        "pl": "Szanowni państwo, sygnał zapięcia pasów został właśnie włączony. Prosimy o powrót na miejsca i zapięcie pasów. Używanie toalet nie jest dozwolone w tym czasie.",
        "de": "Meine Damen und Herren, das Anschnallzeichen ist eingeschaltet. Bitte kehren Sie zu Ihren Plätzen zurück und schnallen Sie sich an. Die Nutzung der Toiletten ist derzeit nicht gestattet.",
        "pt": "Senhoras e senhores, o aviso de atar os cintos foi aceso. Por favor, retornem aos seus assentos e afivelem os cintos de segurança. Neste momento não está permitido o uso dos lavatórios.",
        "es": "Damas y caballeros, se ha encendido la señal del cinturón de seguridad. Por favor regresen a sus asientos y abróchense los cinturones. No se permite el uso de los baños en este momento.",
        "fr": "Mesdames et messieurs, le signal de ceinture de sécurité est allumé. Veuillez retourner à vos places et attacher vos ceintures de sécurité. L'utilisation des toilettes n'est pas autorisée pour le moment.",
        "it": "Signore e signori, il segnale delle cinture di sicurezza è stato acceso. Vi preghiamo di ritornare ai vostri posti e di allacciare le cinture di sicurezza. Al momento non è consentito l'uso dei servizi igienici."
      }
    ]
  },
  {
    "category": "crew-seatbelt-sign-change-information",
    "trigger": {"event": "simValueChanged", "key": ["seatBelt"], "newValue": [0]},
    "conditions": [
      {"type": "flightState", "value": ["FLIGHT_CLIMB", "FLIGHT_CRUISE"]}
    ],
    "timeout": [2, 5],
    "numberOfEagerTextGenerations": 2,
    "texts": [
      {
        "en": "Ladies and gentlemen, the captain has turned off the seatbelt sign. You may now move around the cabin, but we recommend that you keep your seatbelt fastened while seated in case of unexpected turbulence.",
        "pl": "Szanowni państwo, kapitan wyłączył sygnał zapięcia pasów. Możecie państwo teraz poruszać się po kabinie, ale zalecamy, aby pasy były zapięte podczas siedzenia na wypadek niespodziewanych turbulencji.",
        "de": "Meine Damen und Herren, der Kapitän hat das Anschnallzeichen ausgeschaltet. Sie können sich jetzt in der Kabine bewegen, wir empfehlen Ihnen jedoch, im Sitzen den Sicherheitsgurt angelegt zu lassen, um unerwartete Turbulenzen zu vermeiden.",
        "pt": "Senhoras e senhores, o comandante desligou o aviso de atar os cintos. A partir de agora você pode se movimentar pela cabine, mas nós recomendamos o uso do cinto de segurança enquanto estiver sentado, em caso de turbulência inesperada.",
        "es": "Damas y caballeros, el capitán ha desactivado la señal de cinturón de seguridad. Ahora puedes moverte por la cabina, pero te recomendamos que mantengas abrochado el cinturón de seguridad mientras estás sentado en caso de turbulencias inesperadas.",
        "fr": "Mesdames et messieurs, le capitaine a éteint le signal de ceinture de sécurité. Vous pouvez désormais vous déplacer dans la cabine, mais nous vous recommandons de garder votre ceinture de sécurité attachée lorsque vous êtes assis en cas de turbulences inattendues.",
        "it": "Signore e signori, il capitano ha spento il segnale delle cinture di sicurezza. Ora puoi muoverti all'interno della cabina, ma ti consigliamo di tenere la cintura di sicurezza allacciata mentre sei seduto in caso di turbolenze impreviste."
      },
      {
        "en": "As you can see, the seatbelt sign has been turned off. You may now move around the cabin, but we recommend that you keep your seatbelt fastened while seated in case of unexpected turbulence.",
        "pl": "Jak mogli państwo zauważyć, sygnał zapięcia pasów został wyłączony. Możecie państwo teraz poruszać się po kabinie, ale zalecamy, aby pasy były zapięte podczas siedzenia na wypadek niespodziewanych turbulencji.",
        "de": "Wie Sie sehen, wurden die Anschnallzeichen ausgeschaltet. Sie können sich jetzt in der Kabine bewegen, wir empfehlen Ihnen jedoch, im Sitzen den Sicherheitsgurt angelegt zu lassen, um unerwartete Turbulenzen zu vermeiden.",
        "pt": "Como você pode ver, o aviso de atar os cintos foi apagado. A partir de agora você pode se movimentar pela cabine, mas nós recomendamos o uso do cinto de segurança enquanto estiver sentado, em caso de turbulência inesperada.",
        "es": "Como puede ver, la señal del cinturón de seguridad se ha apagado. Ahora puedes moverte por la cabina, pero te recomendamos que mantengas abrochado el cinturón de seguridad mientras estás sentado en caso de turbulencias inesperadas.",
        "fr": "Comme vous pouvez le constater, le signal de ceinture de sécurité a été éteint. Vous pouvez désormais vous déplacer dans la cabine, mais nous vous recommandons de garder votre ceinture de sécurité attachée lorsque vous êtes assis en cas de turbulences inattendues.",
        "it": "Come puoi vedere, il segnale della cintura di sicurezza è stato spento. Ora puoi muoverti all'interno della cabina, ma ti consigliamo di tenere la cintura di sicurezza allacciata mentre sei seduto in caso di turbolenze impreviste."
      },
      {
        "en": "Seatbelt sign has just been turned off. You may now move around the cabin. We recommend that you keep your seatbelt fastened while seated in case of unexpected turbulence.",
        "pl": "Sygnał zapięcia pasów został właśnie wyłączony. Możecie państwo teraz poruszać się po kabinie. Zalecamy jednak, aby pasy były zapięte podczas siedzenia na wypadek niespodziewanych turbulencji.",
        "de": "Die Anschnallzeichen wurden gerade ausgeschaltet. Sie können sich nun in der Kabine bewegen. Für den Fall unerwarteter Turbulenzen empfehlen wir Ihnen, im Sitzen den Sicherheitsgurt angelegt zu lassen.",
        "pt": "Senhoras e senhores, o comandante desligou o aviso de atar os cintos. A partir de agora você pode se movimentar pela cabine, mas nós recomendamos o uso do cinto de segurança enquanto estiver sentado, em caso de turbulência inesperada.",
        "es": "La señal de cinturón de seguridad acaba de ser apagada. Ahora puedes moverte por la cabina. Le recomendamos que mantenga abrochado el cinturón de seguridad mientras está sentado en caso de turbulencias inesperadas.",
        "fr": "Le panneau de ceinture de sécurité vient d'être éteint. Vous pouvez maintenant vous déplacer dans la cabine. Nous vous recommandons de garder votre ceinture de sécurité attachée lorsque vous êtes assis en cas de turbulences inattendues.",
        "it": "Il segnale della cintura di sicurezza è appena stato spento. Ora puoi spostarti nella cabina. Ti consigliamo di tenere la cintura di sicurezza allacciata mentre sei seduto in caso di turbolenze impreviste."
      }
    ]
  },

  // Delay
  {
    "category": "captain-delay-information",
    "trigger": {"event": "runtimeFlightMetadataChange", "key": ["departureDelay"], "newValue": [1]},
    "conditions": [
      {"type": "flightState", "value": ["FLIGHT_STARTED"]}
    ],
    "timeout": [10, 20],
    "runtimeGenerated": true,
    "texts": [
      {
        "en": "Ladies and gentlemen, we are currently experiencing a delay. We apologize for the inconvenience and we will keep you updated on the progress. We are working hard to get you on your way as soon as possible. Thank you for your patience.",
        "pl": "Szanowni państwo, obecnie mamy drobne opóźnienie. Przepraszamy za niedogodności i będziemy informować państwa o postępach. Pracujemy nad tym, aby jak najszybciej ruszyć w drogę. Dziękujemy za cierpliwość.",
        "de": "Sehr geehrte Damen und Herren, wir erleben derzeit eine Verzögerung. Wir entschuldigen uns für die Unannehmlichkeiten und werden Sie über den weiteren Verlauf auf dem Laufenden halten. Wir arbeiten hart daran, Sie so schnell wie möglich auf den Weg zu bringen. Vielen Dank für Ihre Geduld.",
        "pt": "Senhoras e Senhores, infelizmente nós teremos um pequeno atraso em nossa partida. Pedimos desculpas pelo transtorno e manteremos vocês atualizados sobre o andamento. Estamos trabalhando para que você chegue ao seu destino o mais rápido possível. Obrigado pela paciência.",
        "es": "Damas y caballeros, actualmente estamos experimentando un retraso. Nos disculpamos por las molestias y lo mantendremos informado sobre el progreso. Estamos trabajando duro para que puedas seguir tu camino lo antes posible. Gracias por su paciencia.",
        "fr": "Mesdames et messieurs, nous connaissons actuellement un retard. Nous nous excusons pour la gêne occasionnée et nous vous tiendrons au courant des progrès. Nous travaillons dur pour vous mettre en route le plus rapidement possible. Merci pour votre patience.",
        "it": "Signore e signori, stiamo attualmente riscontrando un ritardo. Ci scusiamo per il disagio e vi terremo aggiornati sugli sviluppi. Stiamo lavorando duramente per rimetterti in viaggio il più presto possibile. Grazie per la vostra pazienza."
      },
      {
        "en": "Hi, this is your captain speaking. We are currently experiencing a delay. We apologize for the inconvenience and we will keep you updated on the progress. Thank you for your patience and understanding.",
        "pl": "Witajcie, tu kapitan. Obecnie mamy drobne opóźnienie. Przepraszamy za niedogodności i będziemy informować państwa o postępach. Dziękujemy za cierpliwość i zrozumienie.",
        "de": "Hallo, hier spricht Ihr Kapitän. Leider kommt es derzeit zu einer Verzögerung. Wir entschuldigen uns für die Unannehmlichkeiten und werden Sie über den weiteren Verlauf auf dem Laufenden halten. Vielen Dank für Ihre Geduld und Ihr Verständnis.",
        "pt": "Olá, aqui é o comandante falando. No momento estamos enfrentando um atraso. Pedimos desculpas pelo transtorno e manteremos vocês atualizados sobre o andamento. Obrigado pela sua paciência e compreensão.",
        "es": "Hola, habla tu capitán. Actualmente estamos experimentando un retraso. Nos disculpamos por las molestias y lo mantendremos informado sobre el progreso. Gracias por su paciencia y comprensión.",
        "fr": "Salut, c'est votre capitaine qui parle. Nous connaissons actuellement un retard. Nous nous excusons pour la gêne occasionnée et nous vous tiendrons au courant des progrès. Merci pour votre patience et votre compréhension.",
        "it": "Ciao, qui parla il tuo capitano. Attualmente stiamo riscontrando un ritardo. Ci scusiamo per il disagio e vi terremo aggiornati sugli sviluppi. Grazie per la pazienza e la comprensione."
      }
    ]
  },
  {
    "category": "crew-delay-apologies",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_TAXI_POST_LANDING']},
    "conditions": [
      {"type": "runtimeFlightMetadata", "key": "arrivalDelay", "value": [1]}
    ],
    "timeout": [21, 21],
    "runtimeGenerated": true,
    "texts": [
      {
        "en": "We would like to apologize you again for the delay. We hope that you had a pleasant flight and we are looking forward to seeing you again soon.",
        "pl": "Chcielibyśmy jeszcze raz przeprosić za opóźnienie. Mamy nadzieję, że mieli państwo przyjemny lot i z niecierpliwością czekamy na ponowne spotkanie.",
        "de": "Für die Verzögerung möchten wir uns noch einmal bei Ihnen entschuldigen. Wir hoffen, dass Sie einen angenehmen Flug hatten und freuen uns auf ein baldiges Wiedersehen.",
        "pt": "Gostaríamos de pedir desculpas novamente pelo atraso. Esperamos que você tenha tido um voo agradável e esperamos vê-lo novamente em breve.",
        "es": "Nos gustaría disculparnos nuevamente por el retraso. Esperamos que haya tenido un vuelo agradable y esperamos volver a verle pronto.",
        "fr": "Nous tenons à vous excuser encore une fois pour le retard. Nous espérons que votre vol a été agréable et nous espérons vous revoir bientôt.",
        "it": "Desideriamo scusarci nuovamente per il ritardo. Ci auguriamo che tu abbia trascorso un volo piacevole e non vediamo l'ora di rivederti presto."
      }
    ]
  },

  // Flight state changes

  // Pre-flight
  {
    "category": "captain-pre-flight-welcome-message",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_STARTED']},
    "timeout": [0, 60],
    "chime": "DING_DONG",
    "texts": [
      {
        "en": "Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}. My name is {captainName} and I am the captain of this flight. I would like to welcome you on board and thank you for choosing to fly with us today. We are currently preparing for departure and we will be taking off shortly. Our flight today will take approximately {flightTime}. If you have any questions or need assistance, please don't hesitate to ask one of our cabin crew members. Thank you for flying with {airlineName}.",
        "pl": "[Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Nazywam się {captainName} i jestem kapitanem podczas tego lotu. Chciałbym państwa serdecznie powitać na pokładzie i podziękować za wybór naszego przewoźnika. Obecnie przygotowujemy się do startu i wkrótce rozpoczniemy kołowanie. [Our flight today will take approximately {flightTime}.] Jeśli mają państwo jakieś pytania, nie wahajcie się zwrócić do jednego z członków naszej załogi. [Thank you for flying with {airlineName}.]",
        "de": "[Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Mein Name ist {captainName} und ich bin der Kapitän dieses Fluges. Ich begrüße Sie an Bord und danke Ihnen, dass Sie sich entschieden haben, heute mit uns zu fliegen. Wir bereiten uns derzeit auf den Abflug vor und werden in Kürze abheben. [Our flight today will take approximately {flightTime}.] Wenn Sie Fragen haben oder Hilfe benötigen, wenden Sie sich bitte an einen unserer Flugbegleiter. [Thank you for flying with {airlineName}.]",
        "pt": "[Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Eu me chamo {captainName} e sou o comandante deste voo. Gostaria de lhe dar as boas-vindas a bordo e agradecer pela preferência. No momento estamos nos preparando para a partida e decolaremos em breve. [Our flight today will take approximately {flightTime}.] Se tiver alguma dúvida ou precisar de assistência, não hesite em perguntar a um dos nossos comissários. [Thank you for flying with {airlineName}.]",
        "es": "[Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Mi nombre es {captainName} y soy el capitán de este vuelo. Me gustaría darle una calurosa bienvenida a bordo y agradecerle por elegir nuestra aerolínea. Actualmente nos estamos preparando para el despegue y pronto comenzaremos a rodar. [Our flight today will take approximately {flightTime}.] Si tiene alguna pregunta, no dude en preguntarle a uno de los miembros de nuestra tripulación. [Thank you for flying with {airlineName}.]",
        "fr": "[Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Je m'appelle {captainName} et je suis le capitaine de ce vol. Je vous souhaite chaleureusement la bienvenue à bord et vous remercie d'avoir choisi notre transporteur. Nous préparons actuellement le décollage et commencerons bientôt à rouler. [Our flight today will take approximately {flightTime}.] Si vous avez des questions, n'hésitez pas à les poser à l'un de nos membres d'équipage. [Thank you for flying with {airlineName}.]",
        "it": "[Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Mi chiamo {captainName} e sono il capitano di questo volo. Desidero darvi un caloroso benvenuto a bordo e ringraziarvi per aver scelto il nostro vettore. Attualmente ci stiamo preparando per il decollo e presto inizieremo a rullare. [Our flight today will take approximately {flightTime}.] Se avete domande, non esitate a chiedere a uno dei membri del nostro equipaggio. [Thank you for flying with {airlineName}.]"
      },
      {
        "en": "Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}. My name is {captainName} and I am the captain of this flight. We are currently preparing for departure and we will be taking off shortly. Thank you for choosing {airlineName}. Enjoy your flight.",
        "pl": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Nazywam się {captainName} i jestem kapitanem podczas tego lotu. Obecnie przygotowujemy się do startu i wkrótce rozpoczniemy kołowanie. [Thank you for choosing {airlineName}.] Życzymy miłego lotu.",
        "de": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mein Name ist {captainName} und ich bin der Kapitän dieses Fluges. Wir bereiten uns derzeit auf den Abflug vor und werden in Kürze abheben. [Thank you for choosing {airlineName}.] Guten Flug.",
        "pt": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Eu me chamo {captainName} e sou o comandante deste voo. No momento estamos nos preparando para a partida e decolaremos em breve. [Thank you for choosing {airlineName}.] Aproveite seu voo.",
        "es": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mi nombre es {captainName} y soy el capitán de este vuelo. Actualmente nos estamos preparando para el despegue y pronto comenzaremos a rodar. [Thank you for choosing {airlineName}.] Que tengas un buen vuelo.",
        "fr": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Je m'appelle {captainName} et je suis le capitaine de ce vol. Nous préparons actuellement le décollage et commencerons bientôt à rouler. [Thank you for choosing {airlineName}.] Bon vol.",
        "it": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mi chiamo {captainName} e sono il capitano di questo volo. Attualmente ci stiamo preparando per il decollo e presto inizieremo a rullare. [Thank you for choosing {airlineName}.] Avere un bel volo."
      },
      {
        "en": "Hello, this is your captain speaking. Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}. We are currently preparing for departure and we will be taking off shortly. Thank you for choosing to fly with us today.",
        "pl": "Szanowni państwo, tu kapitan. [Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Obecnie przygotowujemy się do startu i wkrótce rozpoczniemy kołowanie. Dziękujemy za wybór naszego przewoźnika.",
        "de": "Hallo, hier spricht Ihr Kapitän. [Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Wir bereiten uns derzeit auf den Abflug vor und werden in Kürze abheben. Vielen Dank, dass Sie sich entschieden haben, heute mit uns zu fliegen.",
        "pt": "Olá pessoal aqui é o comandante falando. [Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] No momento estamos nos preparando para a partida e decolaremos em breve. Obrigado por escolher voar conosco hoje.",
        "es": "Este es el capitán. [Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Actualmente nos estamos preparando para el despegue y pronto comenzaremos a rodar. Gracias por elegir nuestro transportista.",
        "fr": "C'est le capitaine. [Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Nous préparons actuellement le décollage et commencerons bientôt à rouler. Merci d'avoir choisi notre transporteur.",
        "it": "Questo è il capitano. [Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Attualmente ci stiamo preparando per il decollo e presto inizieremo a rullare. Grazie per aver scelto il nostro corriere."
      }
    ]
  },
  {
    "category": "crew-pre-flight-welcome-message",
    "trigger": {"event": "messagePlayed", "category": ["captain-pre-flight-welcome-message"]},
    "conditions": [
      {"type": "flightState", "value": ["FLIGHT_STARTED"]}
    ],
    "timeout": [10, 20],
    "texts": [
      {
        "en": "Hello and welcome aboard. My name is {crewName} and I am the cabin crew member on this flight. As you could hear from our captain - we are currently preparing for departure and we will be taking off shortly. Please make sure that your seatbelt is fastened and your seat back and tray table are in the upright position. Please turn off all personal electronic devices, including laptops and cell phones. Smoking is prohibited for the duration of the flight. If you have any questions or need assistance, please don't hesitate to ask me or one of my colleagues.",
        "pl": "Witamy na pokładzie. Nazywam się {crewName} i jestem członkiem załogi pokładowej podczas tego lotu. Jak mogli państwo usłyszeć od naszego kapitana - obecnie przygotowujemy się do startu i wkrótce rozpoczniemy kołowanie. Prosimy o zapięcie pasów bezpieczeństwa, ustawienie oparcia fotela i stolika w pozycji pionowej. Prosimy o wyłączenie wszystkich urządzeń elektronicznych, w tym laptopów i telefonów komórkowych. Palenie jest zabronione podczas trwania lotu. Jeśli mają państwo jakieś pytania lub potrzebują pomocy, proszę zwrocić się do mnie lub jednego z moich kolegów.",
        "de": "Hallo und willkommen an Bord. Mein Name ist {crewName} und bin ihr Flugbegleiter auf diesem Flug. Wie Sie von unserem Kapitän hören konnten, bereiten wir uns derzeit auf die Abreise vor und werden in Kürze abheben. Bitte stellen Sie sicher, dass Ihr Sicherheitsgurt angelegt ist und sich Ihre Rückenlehne und Ihr Tabletttisch in einer aufrechten Position befinden. Bitte schalten Sie alle persönlichen elektronischen Geräte, einschließlich Laptops und Mobiltelefone, aus. Für die Dauer des Fluges ist das Rauchen verboten. Wenn Sie Fragen haben oder Hilfe benötigen, zögern Sie bitte nicht, mich oder einen meiner Kollegen zu fragen.",
        "pt": "Olá bem-vindos a bordo. Meu nome é {crewName} e sou o membro do time de comissários deste voo. Como vocês puderam ouvir do nosso comandante, estamos nos preparando para a partida e decolaremos em breve. Pedimos que afivelem os cintos de segurança neste momento e guardem toda a bagagem embaixo do assento ou nos compartimentos superiores. Pedimos também que retornem seus assentos para a posição vertical, feche e trave a mesinha a sua frente. Desligue todos os dispositivos eletrônicos pessoais, incluindo laptops e telefones celulares. É proibido fumar durante o voo. Caso tenha alguma dúvida ou se precisar de ajuda, não hesite em perguntar a um dos comissários.",
        "es": "Hola y bienvenido a bordo. Mi nombre es {crewName} y soy miembro de la tripulación de cabina de este vuelo. Como pudo saber de nuestro capitán, actualmente nos estamos preparando para la salida y despegaremos en breve. Asegúrese de que su cinturón de seguridad esté abrochado y que el respaldo del asiento y la bandeja estén en posición vertical. Apague todos los dispositivos electrónicos personales, incluidas las computadoras portátiles y los teléfonos celulares. Está prohibido fumar durante la duración del vuelo. Si tiene alguna pregunta o necesita ayuda, no dude en preguntarme a mí o a uno de mis colegas.",
        "fr": "Bonjour et bienvenue à bord. Je m'appelle {crewName} et je suis le membre de l'équipage de cabine sur ce vol. Comme vous avez pu l'entendre de notre capitaine, nous préparons actuellement le départ et nous décollerons sous peu. Veuillez vous assurer que votre ceinture de sécurité est bouclée et que votre dossier de siège et votre tablette sont en position verticale. Veuillez éteindre tous les appareils électroniques personnels, y compris les ordinateurs portables et les téléphones portables. Il est interdit de fumer pendant toute la durée du vol. Si vous avez des questions ou avez besoin d'aide, n'hésitez pas à me les poser ou à l'un de mes collègues.",
        "it": "Ciao e benvenuto a bordo. Mi chiamo {crewName} e sono il membro dell'equipaggio di cabina di questo volo. Come hai potuto sentire dal nostro capitano, al momento ci stiamo preparando per la partenza e decolleremo a breve. Assicurati che la cintura di sicurezza sia allacciata e che lo schienale e il tavolino siano in posizione verticale. Si prega di spegnere tutti i dispositivi elettronici personali, inclusi laptop e telefoni cellulari. È vietato fumare per tutta la durata del volo. Se hai domande o hai bisogno di assistenza, non esitare a chiedere a me o a uno dei miei colleghi."
      },
      {
        "en": "Ladies and gentlemen, welcome onboard. My name is {crewName} and I am the cabin crew member on this flight. We ask that you please fasten your seatbelts at this time and secure all baggage underneath your seat or in the overhead compartments. We also ask that your seats and table trays are in the upright position for take-off. Please turn off all personal electronic devices, including laptops and cell phones. Smoking is prohibited for the duration of the flight. Thank you for choosing {airlineName}. Enjoy your flight.",
        "pl": "Panie i panowie, witamy na pokładzie. Nazywam się {crewName} i jestem członkiem załogi pokładowej podczas tego lotu. Prosimy o zapięcie pasów bezpieczeństwa i umieszczenie bagażu pod siedzeniem lub w schowkach bagażowych. Prosimy również o ustawienie oparcia fotela i stolika w pozycji pionowej przed startem. Prosimy o wyłączenie wszystkich urządzeń elektronicznych, w tym laptopów i telefonów komórkowych. Palenie jest zabronione podczas trwania lotu. [Thank you for choosing {airlineName}.] Życzymy miłego lotu.",
        "de": "Sehr geehrte Damen und Herren, willkommen an Bord. Mein Name ist {crewName} und ich bin ihr Flugbegleiter auf diesem Flug. Wir bitten Sie, zu diesem Zeitpunkt Ihre Sicherheitsgurte anzulegen und das gesamte Gepäck unter Ihrem Sitz oder in den Gepäckfächern zu verstauen. Wir bitten Sie außerdem, dass sich Ihre Sitze und Tischablagen zum Abflug in aufrechter Position befinden. Bitte schalten Sie alle persönlichen elektronischen Geräte, einschließlich Laptops und Mobiltelefone, aus. Für die Dauer des Fluges ist das Rauchen verboten. [Thank you for choosing {airlineName}.] Guten Flug.",
        "pt": "Senhoras e senhores, sejam bem-vindos a bordo. Meu nome é {crewName} e sou o membro do time de comissários deste voo. Pedimos que afivelem os cintos de segurança neste momento e guarde toda a bagagem embaixo do assento ou nos compartimentos superiores. Pedimos também que retornem seus assentos para a posição vertical, feche e trave a mesinha a sua frente. Desligue todos os dispositivos eletrônicos pessoais, incluindo laptops e telefones celulares. É proibido fumar durante o voo. [Thank you for choosing {airlineName}.] Aproveite seu voo.",
        "es": "Damas y caballeros, bienvenidos a bordo. Mi nombre es {crewName} y soy miembro de la tripulación de cabina de este vuelo. Le pedimos que se abrochen los cinturones de seguridad en este momento y aseguren todo el equipaje debajo de su asiento o en los compartimentos superiores. También solicitamos que sus asientos y bandejas de mesa estén en posición vertical para el despegue. Apague todos los dispositivos electrónicos personales, incluidas las computadoras portátiles y los teléfonos celulares. Está prohibido fumar durante la duración del vuelo. [Thank you for choosing {airlineName}.] Disfruta tu vuelo.",
        "fr": "Mesdames et messieurs, bienvenue à bord. Je m'appelle {crewName} et je suis le membre de l'équipage de cabine sur ce vol. Nous vous demandons d'attacher vos ceintures de sécurité à ce moment-là et de sécuriser tous les bagages sous votre siège ou dans les compartiments supérieurs. Nous demandons également que vos sièges et plateaux de table soient en position verticale pour le décollage. Veuillez éteindre tous les appareils électroniques personnels, y compris les ordinateurs portables et les téléphones portables. Il est interdit de fumer pendant toute la durée du vol. [Thank you for choosing {airlineName}.] Appréciez votre vol.",
        "it": "Signore e signori, benvenuti a bordo. Mi chiamo {crewName} e sono il membro dell'equipaggio di cabina di questo volo. Ti chiediamo di allacciare le cinture di sicurezza in questo momento e di fissare tutti i bagagli sotto il sedile o negli scomparti soprastanti. Chiediamo inoltre che i sedili e i vassoi del tavolo siano in posizione verticale per il decollo. Si prega di spegnere tutti i dispositivi elettronici personali, inclusi laptop e telefoni cellulari. È vietato fumare per tutta la durata del volo. [Thank you for choosing {airlineName}.] Goditi il tuo volo."
      }
    ]
  },
  {
    "category": "crew-pre-flight-welcome-message",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_STARTED']},
    "conditions": [
      {"type": "settingNotActive", "value": ["captain-pre-flight-welcome-message"]}
    ],
    "timeout": [0, 60],
    "chime": "DING_DONG",
    "texts": [
      {
        "en": "Welcome aboard on this {airlineName} flight. Today we are flying from {originCityName} to {destinationCityName}. My name is {crewName} and I am the cabin crew member on this flight. We are currently preparing for departure and we will be taking off shortly. Please make sure that your seatbelt is fastened and your seat back and tray table are in the upright position. If you have any questions or need assistance, please don't hesitate to ask me or one of my colleagues. Thank you for flying with {airlineName}.",
        "pl": "[Welcome aboard on this {airlineName} flight.] [Today we are flying from {originCityName} to {destinationCityName}.] Nazywam się {crewName} i jestem członkiem załogi podczas tego lotu. Obecnie przygotowujemy się do startu i wkrótce rozpoczniemy kołowanie. Prosimy o zapięcie pasów bezpieczeństwa, ustawienie oparcia fotela i stolika w pozycji pionowej. Jeśli mają państwo jakieś pytania lub potrzebują pomocy, proszę nie wahajcie się zwrócić do mnie lub jednego z moich kolegów. [Thank you for flying with {airlineName}.]",
        "de": "[Welcome aboard on this {airlineName} flight.] [Today we are flying from {originCityName} to {destinationCityName}.] Mein Name ist {crewName} und ich bin ihr Flugbegleiter auf diesem Flug. Wir bereiten uns derzeit auf den Abflug vor und werden in Kürze abheben. Bitte stellen Sie sicher, dass Ihr Sicherheitsgurt angelegt ist und sich Ihre Rückenlehne und Ihr Tabletttisch in einer aufrechten Position befinden. Wenn Sie Fragen haben oder Hilfe benötigen, zögern Sie bitte nicht, mich oder einen meiner Kollegen zu fragen. [Thank you for flying with {airlineName}.]",
        "pt": "[Welcome aboard on this {airlineName} flight.] [Today we are flying from {originCityName} to {destinationCityName}.] Meu nome é {crewName} e sou o membro do time de comissários deste voo. No momento estamos nos preparando para a partida e decolaremos em breve. Pedimos que afivelem o seu cinto de segurança e retornem seus assentos para a posição vertical. feche e trave a mesinha a sua frente. Caso tenha alguma dúvida ou se precisar de ajuda, não hesite em perguntar a um dos comissários. [Thank you for flying with {airlineName}.]",
        "es": "[Welcome aboard on this {airlineName} flight.] [Today we are flying from {originCityName} to {destinationCityName}.] Mi nombre es {crewName} y soy miembro de la tripulación de este vuelo. Actualmente nos estamos preparando para el despegue y pronto comenzaremos a rodar. Abróchese los cinturones de seguridad y coloque el respaldo del asiento y la mesa en posición vertical. Si tiene alguna pregunta o necesita ayuda, no dude en ponerse en contacto conmigo o con uno de mis colegas. [Thank you for flying with {airlineName}.]",
        "fr": "[Welcome aboard on this {airlineName} flight.] [Today we are flying from {originCityName} to {destinationCityName}.] Je m'appelle {crewName} et je suis membre d'équipage sur ce vol. Nous préparons actuellement le décollage et commencerons bientôt à rouler. Veuillez attacher vos ceintures de sécurité et placer le dossier et la table en position verticale. Si vous avez des questions ou avez besoin d'aide, n'hésitez pas à me contacter ou à contacter l'un de mes collègues. [Thank you for flying with {airlineName}.]",
        "it": "[Welcome aboard on this {airlineName} flight.] [Today we are flying from {originCityName} to {destinationCityName}.] Mi chiamo {crewName} e sono un membro dell'equipaggio di questo volo. Attualmente ci stiamo preparando per il decollo e presto inizieremo a rullare. Si prega di allacciare le cinture di sicurezza e di posizionare lo schienale e il tavolino in posizione verticale. Se hai domande o hai bisogno di aiuto, non esitare a contattare me o uno dei miei colleghi. [Thank you for flying with {airlineName}.]"
      },
      {
        "en": "Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}. My name is {crewName} and I am the cabin crew member on this flight. We ask that you please fasten your seatbelts at this time and secure all baggage underneath your seat or in the overhead compartments. We also ask that your seats and table trays are in the upright position for take-off. Please turn off all personal electronic devices, including laptops and cell phones. Smoking is prohibited for the duration of the flight. Thank you for choosing {airlineName}. Enjoy your flight.",
        "pl": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Nazywam się {crewName} i jestem członkiem załogi podczas tego lotu. Prosimy o zapięcie pasów bezpieczeństwa i umieszczenie bagażu pod siedzeniem lub w schowkach bagażowych. Prosimy również o ustawienie oparcia fotela i stolika w pozycji pionowej przed startem. Prosimy o wyłączenie wszystkich urządzeń elektronicznych, w tym laptopów i telefonów komórkowych. Palenie jest zabronione podczas trwania lotu. [Thank you for choosing {airlineName}.] Życzymy miłego lotu.",
        "de": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mein Name ist {crewName} und ich bin ihr Flugbegleiter auf diesem Flug. Wir bitten Sie, zu diesem Zeitpunkt Ihre Sicherheitsgurte anzulegen und das gesamte Gepäck unter Ihrem Sitz oder in den Gepäckfächern zu verstauen. Wir bitten Sie außerdem, Ihre Sitze und Tischablagen zum Abflug in eine aufrechte Position zu bringen. Bitte schalten Sie alle persönlichen elektronischen Geräte, einschließlich Laptops und Mobiltelefone, aus. Für die Dauer des Fluges ist das Rauchen verboten. [Thank you for choosing {airlineName}.] Guten Flug.",
        "pt": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Meu nome é {crewName} e sou o membro do time de comissários deste voo. Pedimos que afivelem os cintos de segurança neste momento e guarde toda a bagagem embaixo do assento ou nos compartimentos superiores. Pedimos também que retornem seus assentos para a posição vertical, feche e trave a mesinha a sua frente. Desligue todos os dispositivos eletrônicos pessoais, incluindo laptops e telefones celulares. É proibido fumar durante o voo. [Thank you for choosing {airlineName}.] Aproveite seu voo.",
        "es": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mi nombre es {crewName} y soy miembro de la tripulación de este vuelo. Abróchense los cinturones de seguridad y coloquen su equipaje debajo del asiento o en los maleteros. También le pedimos que coloque el respaldo del asiento y la mesa en posición vertical antes del despegue. Apague todos los dispositivos electrónicos, incluidas las computadoras portátiles y los teléfonos celulares. Está prohibido fumar durante el vuelo. [Thank you for choosing {airlineName}.] Que tengas un buen vuelo.",
        "fr": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Je m'appelle {crewName} et je suis membre d'équipage sur ce vol. Veuillez attacher vos ceintures de sécurité et placer vos bagages sous le siège ou dans les coffres à bagages. Nous vous demandons également de régler le dossier et la table en position verticale avant le décollage. Veuillez éteindre tous les appareils électroniques, y compris les ordinateurs portables et les téléphones portables. Il est interdit de fumer pendant le vol. [Thank you for choosing {airlineName}.] Bon vol.",
        "it": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mi chiamo {crewName} e sono un membro dell'equipaggio di questo volo. Si prega di allacciare le cinture di sicurezza e di posizionare i bagagli sotto il sedile o nel vano bagagli. Ti chiediamo inoltre di posizionare lo schienale e il tavolino in posizione verticale prima del decollo. Si prega di spegnere tutti i dispositivi elettronici, inclusi laptop e telefoni cellulari. È vietato fumare durante il volo. [Thank you for choosing {airlineName}.] Avere un bel volo."
      }
    ]
  },

  // Basic information about the flight
  {
    "category": "captain-basic-information-about-the-flight",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_STARTED']},
    "timeout": [60, 120],
    "chime": "DING_DONG",
    "texts": [
      {
        "en": "Our flight today will take approximately {flightTime}. The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}. Please remember to keep your seatbelt fastened while seated and whenever the seatbelt sign is illuminated.",
        "pl": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Prosimy pamiętać o tym, aby mieć zapięte pasy zawszy gdy Państwo siedzą i zawsze, gdy sygnał zapięcia pasów jest włączony.",
        "de": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Bitte denken Sie daran, Ihren Sicherheitsgurt immer anzulegen, wenn Sie sitzen und die Sicherheitsgurtwarnung aktiviert ist.",
        "pt": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Lembre-se de manter o cinto de segurança afivelado enquanto estiver sentado e sempre que o aviso de atar os cintos estiver aceso.",
        "es": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Recuerde usar el cinturón de seguridad siempre que esté sentado y siempre que esté encendido el aviso de cinturón de seguridad.",
        "fr": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] N'oubliez pas de boucler votre ceinture de sécurité chaque fois que vous êtes assis et chaque fois que l'avertissement de ceinture de sécurité est activé.",
        "it": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Ricordati di indossare la cintura di sicurezza ogni volta che sei seduto e ogni volta che l'avviso di cintura di sicurezza è attivo."
      },
      {
        "en": "Hi, it's me again. I just thought I'll share some information with you. Our flight today will take approximately {flightTime}. The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}. We expect a smooth flight with a small chance of light turbulences. Please relax and enjoy the flight.",
        "pl": "Witajcie, to znowu ja. Chciałem podzielić się z wami kilkoma informacjami. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Spodziwamy się spokojnego lotu z małymi szansami na lekkie turbulencje. Życzę miłego lotu.",
        "de": "Hallo, ich bin es wieder. Ich dachte, ich teile einige Informationen mit Ihnen. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Wir erwarten einen ruhigen Flug mit einer geringen Wahrscheinlichkeit leichter Turbulenzen. Bitte entspannen Sie sich und genießen Sie den Flug.",
        "pt": "Olá, sou eu de novo. Gostaria de compartilhar algumas informações com vocês. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.]  Esperamos um vôo tranquilo com pequenas chances de turbulências leve. Por favor, relaxe e aproveite o vôo.",
        "es": "Hola, soy yo de nuevo. Quería compartir algo de información contigo. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Esperamos un vuelo tranquilo con pocas posibilidades de ligeras turbulencias. Que tengas un buen vuelo.",
        "fr": "Bonjour, c'est encore moi. Je voulais partager quelques informations avec vous. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Nous nous attendons à un vol calme avec peu de risque de légères turbulences. Bon vol.",
        "it": "Ciao, sono di nuovo io. Volevo condividere con te alcune informazioni. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Ci aspettiamo un volo tranquillo con poche possibilità di leggere turbolenze. Avere un bel volo."
      }
    ]
  },
  {
    "category": "crew-basic-information-about-the-flight",
    "trigger": {"event": "messagePlayed", "category": ["captain-basic-information-about-the-flight"]},
    "conditions": [
      {"type": "flightState", "value": ["FLIGHT_STARTED"]}
    ],
    "timeout": [30, 60],
    "texts": [
      {
        "en": "Ladies and gentlemen, shortly after takeoff we'll start serving snacks and drinks. You can find our sky menu in the seat pocket in front of you.",
        "pl": "Szanowni państwo, krótko po starcie rozpoczniemy serwowanie przekąsek i napojów. Nasze menu znajdą państwo w kieszeni siedzenia przed państwem.",
        "de": "Sehr geehrte Damen und Herren, kurz nach dem Start servieren wir Ihnen Snacks und Getränke. Unser Sky-Menü finden Sie in der Sitztasche vor Ihnen.",
        "pt": "Senhoras e senhores, logo após a decolagem começaremos a servir lanches e bebidas. Você pode encontrar nosso menu Sky no bolso do assento à sua frente.",
        "es": "Damas y caballeros, poco después del despegue comenzaremos a servir bocadillos y bebidas. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted.",
        "fr": "Mesdames et messieurs, peu après le décollage, nous commencerons à servir des collations et des boissons. Vous trouverez notre menu ciel dans la pochette du siège devant vous.",
        "it": "Signore e signori, subito dopo il decollo inizieremo a servire snack e bevande. Puoi trovare il nostro menu sky nella tasca del sedile di fronte a te."
      },
      {
        "en": "Shortly after takeoff we'll start serving snacks and drinks. You can find our sky menu in the seat pocket in front of you.",
        "pl": "Krótko po starcie rozpoczniemy serwowanie przekąsek i napojów. Nasze menu znajdą państwo w kieszeni siedzenia przed państwem.",
        "de": "Kurz nach dem Start beginnen wir mit dem Servieren von Snacks und Getränken. Unser Sky-Menü finden Sie in der Sitztasche vor Ihnen.",
        "pt": "Logo após a decolagem começaremos a servir lanches e bebidas. Você pode encontrar nosso menu Sky no bolso do assento à sua frente.",
        "es": "Poco después del despegue comenzaremos a servir snacks y bebidas. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted.",
        "fr": "Peu après le décollage, nous commencerons à servir des collations et des boissons. Vous trouverez notre menu ciel dans la pochette du siège devant vous.",
        "it": "Poco dopo il decollo inizieremo a servire snack e bevande. Puoi trovare il nostro menu sky nella tasca del sedile di fronte a te."
      }
    ]
  },
  {
    "category": "crew-basic-information-about-the-flight",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_STARTED']},
    "conditions": [
      {"type": "settingNotActive", "value": ["captain-basic-information-about-the-flight"]}
    ],
    "timeout": [60, 120],
    "chime": "DING_DONG",
    "texts": [
      {
        "en": "Our flight today will take approximately {flightTime}. Captain just let me know that flight should be smooth. Shortly after takeoff we'll start serving snacks and drinks. You can find our sky menu in the seat pocket in front of you.",
        "pl": "[Our flight today will take approximately {flightTime}.] Kapitan właśnie poinformował mnie, że lot powinien być spokojny. Krótko po starcie rozpoczniemy serwowanie przekąsek i napojów. Nasze menu znajdą państwo w kieszeni siedzenia przed państwem.",
        "de": "[Our flight today will take approximately {flightTime}.] Der Kapitän hat mir mitgeteilt, dass der Flug reibungslos verlaufen sollte. Kurz nach dem Start beginnen wir mit dem Servieren von Snacks und Getränken. Unser Sky-Menü finden Sie in der Sitztasche vor Ihnen.",
        "pt": "[Our flight today will take approximately {flightTime}.] Capitão, me avise sobre as condições do voo para hoje. Logo após a decolagem começaremos a servir lanches e bebidas. Você pode encontrar nosso menu Sky no bolso do assento à sua frente.",
        "es": "[Our flight today will take approximately {flightTime}.] Capitán, simplemente hágame saber que el vuelo debería ser tranquilo. Poco después del despegue comenzaremos a servir snacks y bebidas. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted.",
        "fr": "[Our flight today will take approximately {flightTime}.] Le capitaine vient de me faire savoir que le vol devrait se dérouler sans problème. Peu après le décollage, nous commencerons à servir des collations et des boissons. Vous trouverez notre menu ciel dans la pochette du siège devant vous.",
        "it": "[Our flight today will take approximately {flightTime}.] Il capitano mi ha solo fatto sapere che il volo dovrebbe procedere senza intoppi. Poco dopo il decollo inizieremo a servire snack e bevande. Puoi trovare il nostro menu sky nella tasca del sedile di fronte a te."
      }
    ]
  },

  // Safety briefing
  {
    "category": "crew-safety-briefing",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_TAXI_PRE_TAKEOFF']},
    "timeout": [10, 20],
    "texts": [
      {
        "en": "Ladies and gentlemen, on behalf of the crew I ask that you please direct your attention to the crew members as we review the emergency procedures. There are {aircraftEmergencyExistsCount} emergency exits on this aircraft. Take a minute to locate the exit closest to you. Note that the nearest exit may be behind you. Should the cabin experience sudden pressure loss, stay calm and listen for instructions from the cabin crew. Oxygen masks will drop down from above your seat. Place the mask over your mouth and nose, like this. Pull the strap to tighten it. If you are traveling with children, make sure that your own mask is on first before helping your children. In the unlikely event of an emergency landing and evacuation, leave your carry-on items behind. Life rafts are located below your seats and emergency lighting will lead you to your closest exit. We ask that you make sure that all carry-on luggage is stowed away safely during the flight. While we wait for take off, please take a moment to review the safety data card in the seat pocket in front of you. Thank you for your attention.",
        "pl": "Szanowni państwo, w imieniu załogi proszę o uwagę. Na pokładzie samolotu znajduje się {aircraftEmergencyExistsCount} wyjść awaryjnych. Proszę poświęcić chwilę, aby zlokalizować wyjście najbliższe Państwu. Zwróć szczególną uwagę, ponieważ najbliższe wyjście może znajdować się za Państwem. W przypadku nagłej utraty ciśnienia w kabinie, zachowaj spokój i słuchaj instrukcji członków załogi. Maseczki tlenowe spadną z góry nad Państwa miejscem. Umieść maseczkę na ustach i nosie. Pociągnij za pasek, aby ją naciągnąć. Jeśli podróżujesz z dziećmi, upewnij się, że najpierw założysz swoją maseczkę, zanim pomożesz swoim dzieciom. W przypadku awaryjnego lądowania i ewakuacji, pozostaw swoje bagaże podręczne. Kamizelki ratunkowe znajdują się pod Państwa siedzeniami, a oświetlenie awaryjne poprowadzi Państwa do najbliższego wyjścia. Prosimy upewnić się, że wszystkie bagaże podręczne są bezpiecznie schowane podczas lotu. Podczas oczekiwania na start, proszę poświęcić chwilę na zapoznanie się z kartą bezpieczeństwa znajdującą się w kieszeni siedzenia przed Państwem. Dziękujemy za uwagę.",
        "de": "Sehr geehrte Damen und Herren, im Namen der Besatzung bitte ich Sie, Ihre Aufmerksamkeit auf die Besatzungsmitglieder zu richten, während wir die Notfallmaßnahmen überprüfen. Es gibt {aircraftEmergencyExistsCount} Notausgänge in diesem Flugzeug. Nehmen Sie sich einen Moment Zeit, um den nächstgelegenen Ausgang zu finden. Beachten Sie, dass sich der nächste Ausgang möglicherweise hinter Ihnen befindet. Sollte es in der Kabine zu einem plötzlichen Druckverlust kommen, bleiben Sie ruhig und achten Sie auf die Anweisungen des Kabinenpersonals. Sauerstoffmasken fallen von über Ihrem Sitz herunter. Legen Sie die Maske wie folgt über Mund und Nase. Ziehen Sie am Riemen, um ihn festzuziehen. Wenn Sie mit Kindern reisen, stellen Sie sicher, dass Sie zuerst Ihre eigene Maske tragen, bevor Sie Ihren Kindern helfen. Lassen Sie im unwahrscheinlichen Fall einer Notlandung und Evakuierung Ihr Handgepäck zurück. Unter Ihren Sitzen befinden sich Rettungsinseln und eine Notbeleuchtung führt Sie zum nächstgelegenen Ausgang. Wir bitten Sie, während des Fluges darauf zu achten, dass das gesamte Handgepäck sicher verstaut ist. Während wir auf den Abflug warten, nehmen Sie sich bitte einen Moment Zeit und überprüfen Sie die Sicherheitsdatenkarte in der Sitztasche vor Ihnen. Vielen Dank für Ihre Aufmerksamkeit.",
        "pt": "Senhores passageiros sua atenção por favor, apresentaremos agora as informações de segurança deste avião. Para afivelar seu cinto de segurança encaixe as extremidades e ajuste-o puxando a tira, para soltá-lo levante a parte externa da fivela. Por lei é proibido fumar a bordo inclusive cigarros eletrônicos. Também é proibido manipular os detectores de fumaça dos lavatórios. Luzes de emergência no piso e no teto indicarão o caminho para as saídas da aeronave, localize a saída mais próxima lembrando que ela poderá estar atrás de você. Se a cabine perder pressão, máscaras de oxigênio cairão automaticamente dos compartimentos acima dos seus assentos. Puxe uma delas coloque sobre o nariz e a boca e respire normalmente. Somente ajude outras pessoas após ter colocado a sua máscara. O equipamento para auxílio à flutuação está indicado a sua frente, verifique o cartão com as informações de segurança localizado no bolsão da poltrona. Agradecemos a atenção e desejamos a todos uma ótima viagem.",
        "es": "Damas y caballeros, en nombre de la tripulación les pido que dirija su atención a los miembros de la tripulación mientras revisamos los procedimientos de emergencia. Hay {aircraftEmergencyExistsCount} salidas de emergencia en esta aeronave. Tómate un minuto para localizar la salida más cercana a ti. Tenga en cuenta que la salida más cercana puede estar detrás de usted. Si la cabina experimenta una pérdida repentina de presión, mantenga la calma y escuche las instrucciones de la tripulación de cabina. Las máscaras de oxígeno caerán desde encima de su asiento. Coloque la mascarilla sobre su boca y nariz, así. Tire de la correa para apretarla. Si viaja con niños, asegúrese primero de que su propia mascarilla esté puesta antes de ayudar a sus hijos. En el improbable caso de un aterrizaje de emergencia y una evacuación, deje atrás su equipaje de mano. Las balsas salvavidas están ubicadas debajo de sus asientos y la iluminación de emergencia lo llevará a la salida más cercana. Le pedimos que se asegure de que todo el equipaje de mano esté guardado de forma segura durante el vuelo. Mientras esperamos el despegue, tómese un momento para revisar la tarjeta de datos de seguridad en el bolsillo del asiento frente a usted. Gracias por su atención.",
        "fr": "Mesdames et messieurs, au nom de l'équipage, je vous demande de bien vouloir porter votre attention sur les membres de l'équipage pendant que nous examinons les procédures d'urgence. Il y a {aircraftEmergencyExistsCount} sorties de secours sur cet avion. Prenez une minute pour localiser la sortie la plus proche de chez vous. Notez que la sortie la plus proche peut être derrière vous. Si la cabine subit une perte de pression soudaine, restez calme et écoutez les instructions du personnel de cabine. Les masques à oxygène tomberont du dessus de votre siège. Placez le masque sur votre bouche et votre nez, comme ceci. Tirez sur la sangle pour la serrer. Si vous voyagez avec des enfants, assurez-vous d'abord que votre propre masque est en place avant d'aider vos enfants. Dans le cas peu probable d’un atterrissage et d’une évacuation d’urgence, laissez vos bagages à main derrière vous. Les radeaux de sauvetage sont situés sous vos sièges et un éclairage de secours vous mènera à la sortie la plus proche. Nous vous demandons de vous assurer que tous les bagages à main sont rangés en toute sécurité pendant le vol. Pendant que nous attendons le décollage, veuillez prendre un moment pour consulter la fiche de données de sécurité dans la poche du siège devant vous. Merci pour votre attention.",
        "it": "Signore e signori, a nome dell'equipaggio vi chiedo di rivolgere la vostra attenzione ai membri dell'equipaggio mentre esaminiamo le procedure di emergenza. Ci sono {aircraftEmergencyExistsCount} uscite di emergenza su questo aereo. Prenditi un minuto per individuare l'uscita più vicina a te. Tieni presente che l'uscita più vicina potrebbe essere dietro di te. Se nella cabina si verifica un'improvvisa perdita di pressione, mantenere la calma e ascoltare le istruzioni dell'equipaggio di cabina. Le maschere di ossigeno cadranno da sopra il tuo posto. Metti la maschera sulla bocca e sul naso, in questo modo. Tirare la cinghia per stringerla. Se viaggi con bambini, assicurati di indossare la tua maschera prima di aiutare i tuoi figli. Nell'improbabile caso di atterraggio ed evacuazione di emergenza, lascia a bordo il tuo bagaglio a mano. Le zattere di salvataggio si trovano sotto i tuoi posti e l'illuminazione di emergenza ti condurrà all'uscita più vicina. Ti chiediamo di assicurarti che tutti i bagagli a mano siano riposti in modo sicuro durante il volo. Mentre aspettiamo il decollo, prenditi un momento per rivedere la scheda dati di sicurezza nella tasca del sedile di fronte a te. Grazie per l'attenzione."
      }
    ]
  },

  // Takeoff
  {
    "category": "captain-ready-for-takeoff-message",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_TAKEOFF']},
    "timeout": [3, 5],
    "onlyPriorityLanguage": true,
    "texts": [
      {
        "en": "Cabin crew, prepare for takeoff.",
        "pl": "Załogo, przygotujcie się do startu.",
        "de": "Kabinenpersonal, bereitet euch auf den Start vor.",
        "pt": "Tripulação de cabine, prepare-se para a decolagem.",
        "es": "Tripulación de cabina, prepárense para el despegue.",
        "fr": "Equipage de cabine, préparez-vous au décollage.",
        "it": "Equipaggio di cabina, preparatevi al decollo."
      }
    ]
  },

  // Climb
  {
    "category": "crew-information-about-upcoming-service",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_CLIMB']},
    "timeout": [30, 60],
    "runtimeGenerated": true,
    "chime": "DING",
    "texts": [
      {
        "en": "Ladies and gentlemen, please remain seated while we climb to our cruising altitude. We will be starting our in-flight service shortly. You can find our sky menu in the seat pocket in front of you.",
        "pl": "Szanowni państwo, prosimy o pozostanie na miejscach podczas wznoszenia do naszej wysokości przelotowej. Wkrótce rozpoczniemy serwis pokładowy. Menu znajdą państwo w kieszeni siedzenia przed sobą.",
        "de": "Sehr geehrte Damen und Herren, bitte bleiben Sie sitzen, während wir auf unsere Reiseflughöhe steigen. Wir werden in Kürze mit unserem Bordservice beginnen. Unser Sky-Menü finden Sie in der Sitztasche vor Ihnen.",
        "pt": "Senhoras e senhores, por favor permaneçam sentados enquanto subimos para nossa altitude de cruzeiro. Em breve iniciaremos nosso serviço de bordo. Você pode encontrar nosso menu Sky no bolsão do assento à sua frente.",
        "es": "Damas y caballeros, permanezcan sentados mientras subimos a nuestra altitud de crucero. En breve iniciaremos nuestro servicio a bordo. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted.",
        "fr": "Mesdames et messieurs, restez assis pendant que nous montons à notre altitude de croisière. Nous commencerons prochainement notre service en vol. Vous trouverez notre menu ciel dans la pochette du siège devant vous.",
        "it": "Signore e signori, rimanete seduti mentre saliamo alla quota di crociera. A breve inizieremo il nostro servizio a bordo. Puoi trovare il nostro menu sky nella tasca del sedile di fronte a te."
      },
      {
        "en": "We are now climbing to our cruising altitude. We will be starting our in-flight service shortly. You can find our sky menu in the seat pocket in front of you.",
        "pl": "Obecnie wznosimy się do naszej wysokości przelotowej. Wkrótce rozpoczniemy serwis pokładowy. Menu znajdą państwo w kieszeni siedzenia przed sobą.",
        "de": "Wir steigen jetzt auf unsere Reiseflughöhe. Wir werden in Kürze mit unserem Bordservice beginnen. Unser Sky-Menü finden Sie in der Sitztasche vor Ihnen.",
        "pt": "Agora estamos subindo para a nossa altitude de cruzeiro. Em breve iniciaremos nosso serviço de bordo. Você pode encontrar nosso menu Sky no bolsão do assento à sua frente.",
        "es": "Ahora estamos subiendo a nuestra altitud de crucero. En breve iniciaremos nuestro servicio a bordo. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted.",
        "fr": "Nous remontons désormais à notre altitude de croisière. Nous commencerons prochainement notre service en vol. Vous trouverez notre menu ciel dans la pochette du siège devant vous.",
        "it": "Stiamo ora salendo alla nostra quota di crociera. A breve inizieremo il nostro servizio a bordo. Puoi trovare il nostro menu sky nella tasca del sedile di fronte a te."
      }
    ]
  },

  // Service
  {
    "category": "crew-service-information",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_CLIMB'], "ignoreFlightStateChange": ['FLIGHT_CRUISE']},
    "timeout": [240, 360],
    "runtimeGenerated": true,
    "chime": "DING",
    "texts": [
      {
        "en": "Ladies and gentlemen, we are now starting our in-flight service. We'd like to remind you that we accept card payments as well as cash. You can find our sky menu in the seat pocket in front of you. Please remain seated while we serve you. If you need anything, please don't hesitate to ask one of our cabin crew members. Thank you.",
        "pl": "Szanowni państwo, rozpoczynamy serwis pokładowy. Przypominamy, że akceptujemy płatności kartą oraz gotówką. Menu znajdą państwo w kieszeni siedzenia przed sobą. Prosimy o pozostanie na miejscach podczas naszej obsługi. Jeśli mają Państwo specjalne potrzeby, prosimy zwrócić się do jednego z członków naszej załogi. Dziękujemy.",
        "de": "Meine Damen und Herren, wir starten jetzt unseren Bordservice. Wir möchten Sie daran erinnern, dass wir sowohl Kartenzahlungen als auch Bargeld akzeptieren. Unser Sky-Menü finden Sie in der Sitztasche vor Ihnen. Bitte bleiben Sie sitzen, während wir Sie bedienen. Wenn Sie etwas benötigen, zögern Sie bitte nicht, eines unserer Kabinenpersonalmitglieder zu fragen. Vielen Dank.",
        "pt": "Senhoras e senhores, agora vamos iniciar o nosso serviço de bordo. Gostaríamos de lembrar que aceitamos pagamentos com cartão e dinheiro. Você pode encontrar nosso menu Sky no bolsão do assento à sua frente. Por favor, permaneça sentado enquanto o atendemos. Se precisar de alguma coisa, não hesite em perguntar a um dos nossos comissários. Obrigado.",
        "es": "Damas y caballeros, ahora estamos iniciando nuestro servicio a bordo. Te recordamos que aceptamos pagos con tarjeta además de efectivo. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted. Por favor permanezca sentado mientras le atendemos. Si necesitas algo, no dudes en preguntar a uno de nuestros miembros de la tripulación de cabina. Gracias.",
        "fr": "Mesdames et messieurs, nous commençons maintenant notre service en vol. Nous vous rappelons que nous acceptons les paiements par carte ainsi que les espèces. Vous trouverez notre menu ciel dans la pochette du siège devant vous. Veuillez rester assis pendant que nous vous servons. Si vous avez besoin de quoi que ce soit, n'hésitez pas à demander à l'un de nos membres d'équipage de cabine. Merci.",
        "it": "Signore e signori, stiamo iniziando il nostro servizio a bordo. Ci teniamo a ricordarti che accettiamo pagamenti sia con carta che in contanti. Puoi trovare il nostro menu sky nella tasca del sedile di fronte a te. Per favore, rimanete seduti mentre vi serviamo. Se hai bisogno di qualcosa, non esitare a chiedere a uno dei membri dell'equipaggio di cabina. Grazie."
      },
      {
        "en": "We are now starting our in-flight service. We'd like to remind you that we accept card payments as well as cash. You can find our sky menu in the seat pocket in front of you. Please remain seated while we serve you. If you need anything, please don't hesitate to ask one of our cabin crew members. Thank you.",
        "pl": "Rozpoczynamy serwis pokładowy. Przypominamy, że akceptujemy płatności kartą oraz gotówką. Menu znajdą państwo w kieszeni siedzenia przed sobą. Prosimy o pozostanie na miejscach podczas naszej obsługi. Jeśli mają Państwo specjalne potrzeby, prosimy zwrócić się do jednego z członków naszej załogi. Dziękujemy.",
        "de": "Wir starten jetzt unseren Bordservice. Wir möchten Sie daran erinnern, dass wir sowohl Kartenzahlungen als auch Bargeld akzeptieren. Unser Sky-Menü finden Sie in der Sitztasche vor Ihnen. Bitte bleiben Sie sitzen, während wir Sie bedienen. Wenn Sie etwas benötigen, zögern Sie bitte nicht, eines unserer Kabinenpersonalmitglieder zu fragen. Danke schön.",
        "pt": "Agora vamos iniciar o nosso serviço de bordo. Gostaríamos de lembrar que aceitamos pagamentos com cartão e dinheiro. Você pode encontrar nosso menu Sky no bolsão do assento à sua frente. Por favor, permaneça sentado enquanto o atendemos. Se precisar de alguma coisa, não hesite em perguntar a um dos nossos comissários. Obrigado.",
        "es": "Ahora estamos iniciando nuestro servicio a bordo. Te recordamos que aceptamos pagos con tarjeta además de efectivo. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted. Por favor permanezca sentado mientras le atendemos. Si necesitas algo, no dudes en preguntar a uno de nuestros miembros de la tripulación de cabina. Gracias.",
        "fr": "Nous commençons maintenant notre service en vol. Nous vous rappelons que nous acceptons les paiements par carte ainsi que les espèces. Vous trouverez notre menu ciel dans la pochette du siège devant vous. Veuillez rester assis pendant que nous vous servons. Si vous avez besoin de quoi que ce soit, n'hésitez pas à demander à l'un de nos membres d'équipage de cabine. Merci.",
        "it": "Stiamo iniziando il nostro servizio a bordo. Ci teniamo a ricordarti che accettiamo pagamenti sia con carta che in contanti. Puoi trovare il nostro menu sky nella tasca del sedile di fronte a te. Per favore, rimanete seduti mentre vi serviamo. Se hai bisogno di qualcosa, non esitare a chiedere a uno dei membri dell'equipaggio di cabina. Grazie."
      }
    ]
  },

  // Shopping
  {
    "category": "crew-shopping-information",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_CRUISE']},
    "conditions": [
      {"type": "airlineCode", "value": ["RYR"]}
    ],
    "timeout": [300, 420],
    "chime": "DING",
    "runtimeGenerated": true,
    "weight": 9,
    "texts": [
      {
        "en": "Ladies and gentlemen, we are now starting our in-flight shopping service. Today we have a special offer for you. Our scratch cards are now available for purchase. You can win a free flight or other great prizes, like a free meal or a discount on your next flight. The luckiest passengers can even win a free holiday. Good luck!",
        "pl": "Szanowni państwo, rozpoczynamy sprzedaż naszych produktów premium. Dziś mamy dla państwa specjalną ofertę. Kupując zdrapkę, możecie państwo wygrać darmowy lot lub inne wspaniałe nagrody. Najszczęśliwsi pasażerowie mogą nawet wygrać darmowe wakacje. Powodzenia!",
        "de": "Sehr Damen und Herren, wir starten jetzt unseren Bordeinkaufsservice. Heute haben wir ein besonderes Angebot für Sie. Unsere Rubbellose sind jetzt erhältlich. Sie können einen kostenlosen Flug oder andere tolle Preise gewinnen. Die glücklichsten Passagiere können sogar einen kostenlosen Urlaub gewinnen. Viel Glück!",
        "pt": "Senhoras e senhores, iniciamos agora o nosso serviço de compras a bordo. Hoje temos uma oferta especial para você. Nossos cartões de raspadinha estão disponíveis para compra. Você pode ganhar um voo grátis ou outros prêmios incríveis, como uma refeição grátis ou um desconto no seu próximo voo. Os passageiros mais sortudos podem até ganhar umas férias grátis. Boa sorte!",
        "es": "Damas y caballeros, ahora estamos iniciando nuestro servicio de compras a bordo. Hoy tenemos una oferta especial para ti. Nuestras tarjetas rasca y gana ya están disponibles para su compra. Puedes ganar un vuelo gratis u otros fantásticos premios, como una comida gratis o un descuento en tu próximo vuelo. Los pasajeros más afortunados pueden incluso ganar unas vacaciones gratis. ¡Buena suerte!",
        "fr": "Mesdames et messieurs, nous lançons maintenant notre service d'achats en vol. Aujourd'hui, nous avons une offre spéciale pour vous. Nos cartes à gratter sont désormais disponibles à l'achat. Vous pouvez gagner un vol gratuit ou d'autres prix intéressants, comme un repas gratuit ou une réduction sur votre prochain vol. Les passagers les plus chanceux pourront même gagner des vacances gratuites. Bonne chance!",
        "it": "Signore e signori, stiamo avviando il nostro servizio di shopping a bordo. Oggi abbiamo un'offerta speciale per te. I nostri gratta e vinci sono ora disponibili per l'acquisto. Puoi vincere un volo gratuito o altri fantastici premi, come un pasto gratuito o uno sconto sul tuo prossimo volo. I passeggeri più fortunati potranno vincere anche una vacanza gratis. Buona fortuna!"
      }
    ]
  },
  {
    "category": "crew-shopping-information",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_CRUISE']},
    "timeout": [300, 420],
    "chime": "DING_DONG",
    "runtimeGenerated": true,
    "texts": [
      {
        "en": "Ladies and gentlemen, we are now starting our in-flight shopping service. Today we have a special offer for you. If you buy two perfumes, you will get a 10% discount on the third one. On this flight we highly recommend latest fragrances from our collection. You can find our shopping catalog in the seat pocket in front of you. We accept card payments as well as cash.",
        "pl": "Szanowni państwo, rozpoczynamy serwis pokładowy. Dziś mamy dla państwa specjalną ofertę. Jeśli kupią państwo dwa zapachy, trzeci będzie tańszy o 10%. Na tym locie polecamy najnowsze zapachy z naszej kolekcji. Katalog produktów znajdą państwo w kieszeni siedzenia przed sobą. Akceptujemy płatności kartą oraz gotówką.",
        "de": "MSehr geehrte Damen und Herren, wir starten jetzt unseren Bordeinkaufsservice. Heute haben wir ein besonderes Angebot für Sie. Wenn Sie zwei Parfums kaufen, erhalten Sie 10 % Rabatt auf das dritte. Auf diesem Flug empfehlen wir Ihnen die neuesten Düfte aus unserer Kollektion. Sie finden unseren Einkaufskatalog in der Sitztasche vor Ihnen. Wir akzeptieren Kartenzahlungen sowie Bargeld.",
        "pt": "Senhoras e senhores, iniciamos agora o nosso serviço de compras a bordo. Hoje temos uma oferta especial para você. Na compra de dois perfumes, você ganha 10% de desconto no terceiro. Neste voo, recomendamos os últimos perfumes da nossa coleção. Você pode encontrar nosso catálogo de compras no bolso do assento à sua frente. Aceitamos pagamentos com cartão e dinheiro.",
        "es": "Damas y caballeros, ahora estamos iniciando nuestro servicio de compras a bordo. Hoy tenemos una oferta especial para ti. Si compras dos perfumes, obtendrás un 10% de descuento en el tercero. En este vuelo recomendamos encarecidamente las últimas fragancias de nuestra colección. Puede encontrar nuestro catálogo de compras en el bolsillo del asiento frente a usted. Aceptamos pagos con tarjeta y también en efectivo.",
        "fr": "Mesdames et messieurs, nous lançons maintenant notre service d'achats en vol. Aujourd'hui, nous avons une offre spéciale pour vous. Si vous achetez deux parfums, vous bénéficierez d'une réduction de 10 % sur le troisième. Sur ce vol, nous recommandons fortement les derniers parfums de notre collection. Vous trouverez notre catalogue d'achats dans la pochette du siège devant vous. Nous acceptons les paiements par carte ainsi que les espèces.",
        "it": "Signore e signori, stiamo avviando il nostro servizio di shopping a bordo. Oggi abbiamo un'offerta speciale per te. Se acquisti due profumi, avrai uno sconto del 10% sul terzo. Su questo volo consigliamo vivamente le ultime fragranze della nostra collezione. Puoi trovare il nostro catalogo acquisti nella tasca del sedile di fronte a te. Accettiamo pagamenti con carta e contanti."
      },
      {
        "en": "We are now starting our in-flight shopping service. Today we highly recommend our special offer - a set of three perfumes for the price of two. We also have a wide selection of other products available for purchase, like souvenirs, cosmetics, and snacks. You can find our shopping catalog in the seat pocket in front of you. We accept card payments as well as cash.",
        "pl": "Rozpoczynamy serwis pokładowy. Dziś polecamy naszą specjalną ofertę - zestaw trzech zapachów w cenie dwóch. Mamy również szeroki wybór innych produktów dostępnych do zakupu, takich jak pamiątki, kosmetyki i przekąski. Katalog produktów znajdą państwo w kieszeni siedzenia przed sobą. Akceptujemy płatności kartą oraz gotówką.",
        "de": "Wir starten jetzt unseren Bordeinkaufsservice. Heute empfehlen wir Ihnen unser Sonderangebot – ein Set mit drei Parfums zum Preis von zwei. Wir haben auch eine große Auswahl an anderen Produkten zum Kauf, wie Souvenirs, Kosmetik und Snacks. Sie finden unseren Einkaufskatalog in der Sitztasche vor Ihnen. Wir akzeptieren Kartenzahlungen sowie Bargeld.",
        "pt": "Estamos iniciando agora nosso serviço de compras a bordo. Hoje recomendamos a nossa oferta especial - um conjunto de três perfumes pelo preço de dois. Também temos uma ampla seleção de outros produtos disponíveis para compra, como lembranças, cosméticos e lanches. Você pode encontrar nosso catálogo de compras no bolso do assento à sua frente. Aceitamos pagamentos com cartão e dinheiro.",
        "es": "Ahora estamos iniciando nuestro servicio de compras a bordo. Hoy recomendamos encarecidamente nuestra oferta especial: un juego de tres perfumes por el precio de dos. También tenemos una amplia selección de otros productos disponibles para comprar, como souvenirs, cosméticos y snacks. Puede encontrar nuestro catálogo de compras en el bolsillo del asiento frente a usted. Aceptamos pagos con tarjeta y también en efectivo.",
        "fr": "Nous démarrons maintenant notre service d'achats à bord. Aujourd'hui, nous vous recommandons vivement notre offre spéciale : un coffret de trois parfums pour le prix de deux. Nous proposons également une large sélection d'autres produits disponibles à l'achat, comme des souvenirs, des cosmétiques et des collations. Vous trouverez notre catalogue d'achats dans la pochette du siège devant vous. Nous acceptons les paiements par carte ainsi que les espèces.",
        "it": "Stiamo avviando il nostro servizio di shopping a bordo. Oggi ti consigliamo vivamente la nostra offerta speciale: un set di tre profumi al prezzo di due. Abbiamo anche un'ampia selezione di altri prodotti disponibili per l'acquisto, come souvenir, cosmetici e snack. Puoi trovare il nostro catalogo acquisti nella tasca del sedile di fronte a te. Accettiamo pagamenti con carta e contanti."
      }
    ]
  },

  // Random information about the flight
  {
    "category": "captain-random-information-about-the-flight",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_CRUISE']},
    "timeout": [600, 720],
    "chime": "DING_DONG",
    "runtimeGenerated": true,
    "texts": [
      {
        "en": "Ladies and gentleman, this is your captain speaking. Let me share some information with you. We are currently cruising at an altitude of {currentAltitudeFt} feet at an speed of {groundSpeedKm} kilometers per hour. The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees. The rest of the flight should be smooth, with a small chance of light turbulences. Please remember to keep your seatbelt fastened while seated and whenever the seatbelt sign is illuminated. Thank you, and enjoy the flight.",
        "pl": "Szanowni państwo, tu kapitan. Podzielę się z Wami kilkoma informacjami. Obecnie przelatujemy na wysokości {currentAltitudeFt} stóp z prędkością {groundSpeedKm} kilometrów na godzinę. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Reszta lotu powinna być spokojna, z małymi szansami na lekkie turbulencje. Proszę pamiętać o zapięciu pasów bezpieczeństwa podczas siedzenia i zawsze, gdy sygnał zapięcia pasów jest włączony. Dziękuję i miłego lotu.",
        "de": "Sehr geehrte Damen und Herren, hier spricht Ihr Kapitän. Ich möchte Ihnen einige Informationen mitteilen. Wir fliegen derzeit in einer Höhe von {currentAltitudeFt} Fuß mit einer Geschwindigkeit von {groundSpeedKm} Kilometern pro Stunde. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Der Rest des Fluges sollte ruhig verlaufen, mit einer geringen Wahrscheinlichkeit leichter Turbulenzen. Bitte denken Sie daran, Ihren Sicherheitsgurt immer anzulegen, wenn Sie sitzen und immer wenn das Sicherheitsgurtwarnzeichen aktiviert ist. Danke und genießen Sie den Flug.",
        "pt": "Senhoras e senhores, aqui é o comandante falando. Deixe-me compartilhar algumas informações com você. Eu gostaria de compartilhar algumas informações com vocês. No momento, estamos navegando a uma altitude de {currentAltitudeFt} pés a uma velocidade de {groundSpeedKm} quilômetros por hora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] O restante do voo deve ser tranquilo, com pequenas chances de turbulências leves. Lembre-se de manter o cinto de segurança afivelado enquanto estiver sentado e sempre que o aviso de atar os cintos estiver aceso. Obrigado e aproveite o vôo.",
        "es": "Damas y caballeros, este es el capitán. Compartiré alguna información contigo. Actualmente estamos volando a una altitud de {currentAltitudeFt} pies a una velocidad de {groundSpeedKm} kilómetros por hora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] El resto del vuelo debería transcurrir en calma, con pocas posibilidades de que se produzcan ligeras turbulencias. Recuerde abrocharse los cinturones de seguridad cuando esté sentado y siempre que esté encendido el aviso de cinturón de seguridad. Gracias y que tengas un buen vuelo.",
        "fr": "Mesdames et messieurs, voici le capitaine. Je vais partager quelques informations avec vous. Nous volons actuellement à une altitude de {currentAltitudeFt} pieds à une vitesse de {groundSpeedKm} kilomètres par heure. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Le reste du vol devrait être calme, avec peu de risque de légères turbulences. N'oubliez pas d'attacher vos ceintures de sécurité lorsque vous êtes assis et chaque fois que l'avertissement de ceinture de sécurité est activé. Merci et bon vol.",
        "it": "Signore e signori, questo è il capitano. Condividerò alcune informazioni con te. Attualmente stiamo volando a un'altitudine di {currentAltitudeFt} piedi a una velocità di {groundSpeedKm} chilometri all'ora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Il resto del volo dovrebbe essere calmo, con poche possibilità di leggere turbolenze. Ricordatevi di allacciare le cinture di sicurezza quando siete seduti e ogni volta che l'avviso di cintura di sicurezza è attivo. Grazie e buon volo."
      },
      {
        "en": "Hi, it's me again. I just wanted to share some information with you. We are currently cruising at an altitude of {currentAltitudeFt} feet at an speed of {groundSpeedKm} kilometers per hour. The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees. The rest of the flight should be smooth. In case of any questions, please don't hesitate to ask one of our cabin crew members. Thank you, and enjoy the flight.",
        "pl": "Proszę Państwa, tu kapitan. Chciałem podzielić się z wami kilkoma informacjami. Obecnie przelatujemy na wysokości {currentAltitudeFt} stóp z prędkością {groundSpeedKm} kilometrów na godzinę. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Reszta lotu powinna być spokojna. W przypadku pytań, proszę zwrócić się do jednego z członków naszej załogi. Dziękuję i miłego lotu.",
        "de": "Hallo, ich bin es wieder. Ich möchte ein paar Informationen mit Ihnen teilen. Wir fliegen derzeit in einer Höhe von {currentAltitudeFt} Fuß mit einer Geschwindigkeit von {groundSpeedKm} Kilometern pro Stunde. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Der Rest des Fluges sollte ruhig verlaufen. Bei Fragen wenden Sie sich bitte an eines unserer Kabinenpersonalmitglieder. Danke und genießen Sie den Flug.",
        "pt": "Olá, sou eu de novo. Eu gostaria de compartilhar algumas informações com vocês. No momento, estamos navegando a uma altitude de {currentAltitudeFt} pés a uma velocidade de {groundSpeedKm} quilômetros por hora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] O restante do voo deve ser tranquilo. Em caso de dúvidas, não hesite em perguntar a um dos nossos comissários. Obrigado e aproveite o vôo.",
        "es": "Damas y caballeros, este es el capitán. Quería compartir algo de información contigo. Actualmente estamos volando a una altitud de {currentAltitudeFt} pies a una velocidad de {groundSpeedKm} kilómetros por hora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] El resto del vuelo debería transcurrir sin incidentes. Si tiene alguna pregunta, consulte a uno de los miembros de nuestra tripulación. Gracias y que tengas un buen vuelo.",
        "fr": "Mesdames et messieurs, voici le capitaine. Je voulais partager quelques informations avec vous. Nous volons actuellement à une altitude de {currentAltitudeFt} pieds à une vitesse de {groundSpeedKm} kilomètres par heure. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Le reste du vol devrait se dérouler sans incident. Si vous avez des questions, veuillez les poser à l'un de nos membres d'équipage. Merci et bon vol.",
        "it": "Signore e signori, questo è il capitano. Volevo condividere con te alcune informazioni. Attualmente stiamo volando a un'altitudine di {currentAltitudeFt} piedi a una velocità di {groundSpeedKm} chilometri all'ora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Il resto del volo dovrebbe svolgersi senza incidenti. Se avete domande, rivolgetevi a uno dei membri del nostro equipaggio. Grazie e buon volo."
      }
    ]
  },

  // Descent
  {
    "category": "captain-information-about-upcoming-actions",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_DESCENT']},
    "timeout": [10, 30],
    "chime": "DING_DONG",
    "runtimeGenerated": true,
    "texts": [
      {
        "en": "Ladies and gentlemen, we are starting our descent into {destinationCityName}. Please follow the instructions of the cabin crew as we prepare for landing. Thank you.",
        "pl": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Proszę postępować zgodnie z instrukcjami członków załogi. Dziękujemy.",
        "de": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Bitte folgen Sie den Anweisungen des Kabinenpersonals, während wir uns auf die Landung vorbereiten. Danke schön.",
        "pt": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Por favor, siga as instruções dos comissários enquanto nos preparamos para o pouso. Obrigado.",
        "es": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Siga las instrucciones de la tripulación de cabina mientras nos preparamos para el aterrizaje. Gracias.",
        "fr": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Veuillez suivre les instructions du personnel de cabine pendant que nous préparons l'atterrissage. Merci.",
        "it": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Si prega di seguire le istruzioni dell'equipaggio di cabina mentre ci prepariamo per l'atterraggio. Grazie."
      },
      {
        "en": "Ladies and gentlemen, we are starting our descent. Please follow the instructions of the cabin crew as we prepare for landing. Thank you.",
        "pl": "Ladies and gentlemen, we are starting our descent. Proszę postępować zgodnie z instrukcjami członków załogi. Dziękujemy.",
        "de": "Sehr geehrte Damen und Herren, wir beginnen unseren Sinkflug. Bitte folgen Sie den Anweisungen des Kabinenpersonals, während wir uns auf die Landung vorbereiten. Danke schön.",
        "pt": "Senhoras e senhores, estamos iniciando a descida. Por favor, siga as instruções dos comissários enquanto nos preparamos para o pouso. Obrigado.",
        "es": "Damas y caballeros, estamos iniciando nuestro descenso. Siga las instrucciones de la tripulación de cabina mientras nos preparamos para el aterrizaje. Gracias.",
        "fr": "Mesdames et messieurs, nous entamons notre descente. Veuillez suivre les instructions du personnel de cabine pendant que nous préparons l'atterrissage. Merci.",
        "it": "Signore e signori, stiamo iniziando la nostra discesa. Si prega di seguire le istruzioni dell'equipaggio di cabina mentre ci prepariamo per l'atterraggio. Grazie."
      }
    ]
  },
  {
    "category": "crew-information-about-upcoming-actions",
    "trigger": {"event": "messagePlayed", "category": ["captain-information-about-upcoming-actions"]},
    "conditions": [
      {"type": "flightState", "value": ["FLIGHT_DESCENT"]}
    ],
    "timeout": [5, 10],
    "runtimeGenerated": true,
    "texts": [
      {
        "en": "Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}. Please make sure that your seatbelt is fastened and your seat back and tray table are in the upright position. We will collect any remaining service items in a few minutes. Thank you.",
        "pl": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Prosimy o upewnienie się, że pasy są zapięte, a oparcie fotela i stolik są w pozycji pionowej. Wkrótce zbierzemy pozostałe śmieci. Dziękujemy.",
        "de": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Bitte stellen Sie sicher, dass Ihr Sicherheitsgurt angelegt ist und sich Ihre Rückenlehne und Ihr Tabletttisch in einer aufrechten Position befinden. Wir holen alle verbleibenden Serviceartikel in wenigen Minuten ab. Danke schön.",
        "pt": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Certifique-se de que seu cinto de segurança esteja afivelado e que o encosto do seu assento esteja na posição vertical. Feche a trave a mesinha a sua frente. Coletaremos todos os itens de serviço restantes em alguns minutos. Obrigado.",
        "es": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Asegúrese de que su cinturón de seguridad esté abrochado y que el respaldo del asiento y la bandeja estén en posición vertical. Recogeremos los artículos de servicio restantes en unos minutos. Gracias.",
        "fr": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Veuillez vous assurer que votre ceinture de sécurité est bouclée et que votre dossier de siège et votre tablette sont en position verticale. Nous récupérerons tous les éléments de service restants dans quelques minutes. Merci.",
        "it": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Assicurati che la cintura di sicurezza sia allacciata e che lo schienale e il tavolino siano in posizione verticale. Raccoglieremo tutti gli articoli di servizio rimanenti in pochi minuti. Grazie."
      },
      {
        "en": "Ladies and gentlemen, as you heard from our captain, we are starting our descent. Please make sure that your seatbelt is fastened and your seat back and tray table are in the upright position. We will collect any remaining service items in a few minutes. Thank you.",
        "pl": "Szanowni Państwo, jak mogli Państwo usłyszeć - rozpoczynamy nasze zniżanie. Prosimy o upewnienie się, że pasy są zapięte, a oparcie fotela i stolik są w pozycji pionowej. Wkrótce zbierzemy pozostałe śmieci. Dziękujemy.",
        "de": "Sehr geehrte Damen und Herren, wie Sie von unserem Kapitän gehört haben, beginnen wir mit dem Sinkflug. Bitte stellen Sie sicher, dass Ihr Sicherheitsgurt angelegt ist und sich Ihre Rückenlehne und Ihr Tabletttisch in einer aufrechten Position befinden. Wir holen alle verbleibenden Serviceartikel in wenigen Minuten ab. Danke schön.",
        "pt": "Senhoras e senhores, como dito pelo comandante, já iniciamos a nossa descida. Certifique-se de que seu cinto de segurança esteja afivelado e que o encosto do seu assento esteja na posição vertical. Feche a trave a mesinha a sua frente. Coletaremos todos os itens de serviço restantes em alguns minutos. Obrigado.",
        "es": "Damas y caballeros, como les dijo nuestro capitán, estamos iniciando nuestro descenso. Asegúrese de que su cinturón de seguridad esté abrochado y que el respaldo del asiento y la bandeja estén en posición vertical. Recogeremos los artículos de servicio restantes en unos minutos. Gracias.",
        "fr": "Mesdames et messieurs, comme vous l'a dit notre capitaine, nous commençons notre descente. Veuillez vous assurer que votre ceinture de sécurité est bouclée et que votre dossier de siège et votre tablette sont en position verticale. Nous récupérerons tous les éléments de service restants dans quelques minutes. Merci.",
        "it": "Signore e signori, come avete sentito dal nostro capitano, stiamo iniziando la discesa. Assicurati che la cintura di sicurezza sia allacciata e che lo schienale e il tavolino siano in posizione verticale. Raccoglieremo tutti gli articoli di servizio rimanenti in pochi minuti. Grazie."
      }
    ]
  },
  {
    "category": "crew-information-about-upcoming-actions",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_DESCENT']},
    "conditions": [
      {"type": "settingNotActive", "value": ["captain-information-about-upcoming-actions"]}
    ],
    "timeout": [10, 30],
    "chime": "DING_DONG",
    "runtimeGenerated": true,
    "texts": [
      {
        "en": "Ladies and gentlemen, we are starting our descent into {destinationCityName}. Please make sure that your seatbelt is fastened and your seat back and tray table are in the upright position. We will collect any remaining service items in a few minutes. Thank you.",
        "pl": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Prosimy o upewnienie się, że Państwa pasy są zapięte, a oparcie fotela i stolik są w pozycji pionowej. Wkrótce zbierzemy śmieci. Dziękujemy.",
        "de": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Bitte stellen Sie sicher, dass Ihr Sicherheitsgurt angelegt ist und sich Ihre Rückenlehne und Ihr Tabletttisch in einer aufrechten Position befinden. Wir holen alle verbleibenden Serviceartikel in wenigen Minuten ab. Danke schön.",
        "pt": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Certifique-se de que seu cinto de segurança esteja afivelado e que o encosto do seu assento esteja na posição vertical. Feche a trave a mesinha a sua frente. Coletaremos todos os itens de serviço restantes em alguns minutos. Obrigado.",
        "es": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Asegúrese de que su cinturón de seguridad esté abrochado y que el respaldo del asiento y la bandeja estén en posición vertical. Recogeremos los artículos de servicio restantes en unos minutos. Gracias.",
        "fr": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Veuillez vous assurer que votre ceinture de sécurité est bouclée et que votre dossier de siège et votre tablette sont en position verticale. Nous récupérerons tous les éléments de service restants dans quelques minutes. Merci.",
        "it": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Assicurati che la cintura di sicurezza sia allacciata e che lo schienale e il tavolino siano in posizione verticale. Raccoglieremo tutti gli articoli di servizio rimanenti in pochi minuti. Grazie."
      },
      {
        "en": "Ladies and gentlemen, we are starting our descent. Please make sure that your seatbelt is fastened and your seat back and tray table are in the upright position. We will collect any remaining service items in a few minutes. Thank you.",
        "pl": "Ladies and gentlemen, we are starting our descent. Prosimy o upewnienie się, że Państwa pasy są zapięte, a oparcie fotela i stolik są w pozycji pionowej. Wkrótce zbierzemy śmieci. Dziękujemy.",
        "de": "Sehr geehrte Damen und Herren, wir beginnen unseren Sinkflug. Bitte stellen Sie sicher, dass Ihr Sicherheitsgurt angelegt ist und sich Ihre Rückenlehne und Ihr Tabletttisch in einer aufrechten Position befinden. Wir holen alle verbleibenden Serviceartikel in wenigen Minuten ab. Danke schön.",
        "pt": "Senhoras e senhores, estamos iniciando a descida. Certifique-se de que seu cinto de segurança esteja afivelado e que o encosto do seu assento esteja na posição vertical. Feche a trave a mesinha a sua frente. Coletaremos todos os itens de serviço restantes em alguns minutos. Obrigado.",
        "es": "Damas y caballeros, estamos iniciando nuestro descenso. Asegúrese de que su cinturón de seguridad esté abrochado y que el respaldo del asiento y la bandeja estén en posición vertical. Recogeremos los artículos de servicio restantes en unos minutos. Gracias.",
        "fr": "Mesdames et messieurs, nous entamons notre descente. Veuillez vous assurer que votre ceinture de sécurité est bouclée et que votre dossier de siège et votre tablette sont en position verticale. Nous récupérerons tous les éléments de service restants dans quelques minutes. Merci.",
        "it": "Signore e signori, stiamo iniziando la nostra discesa. Assicurati che la cintura di sicurezza sia allacciata e che lo schienale e il tavolino siano in posizione verticale. Raccoglieremo tutti gli articoli di servizio rimanenti in pochi minuti. Grazie."
      }
    ]
  },

  // Final
  {
    "category": "captain-crew-take-seats",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_FINAL']},
    "timeout": [5, 10],
    "onlyPriorityLanguage": true,
    "texts": [
      {
        "en": "Cabin crew, take your seats for landing.",
        "pl": "Załogo, zajmijcie miejsca do lądowania.",
        "de": "Kabinenpersonal, nehmen Sie Ihre Sitze für die Landung ein.",
        "pt": "Tripulação, preparar para o pouso.",
        "es": "Tripulación de cabina, tomen asiento para aterrizar.",
        "fr": "Personnel de cabine, prenez place pour l'atterrissage.",
        "it": "Equipaggio di cabina, prendete posto per l'atterraggio."
      }
    ]
  },

  // Taxi to the gate
  {
    "category": "crew-taxi-to-gate-welcome-message",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_TAXI_POST_LANDING']},
    "timeout": [15, 20],
    "runtimeGenerated": true,
    "texts": [
      {
        "en": "Ladies and gentlemen, welcome to {destinationCityName}. Please remain seated with your seatbelt fastened until the aircraft has come to a complete stop and the seatbelt sign has been turned off. Please make sure you have all your personal belongings with you before you leave the aircraft. On behalf of the crew, I would like to thank you for flying with us today. We hope you had a pleasant flight and we look forward to welcoming you on board again soon.",
        "pl": "[Ladies and gentlemen, welcome to {destinationCityName}.] Prosimy o pozostanie na miejscach z zapiętymi pasami bezpieczeństwa, aż samolot całkowicie się zatrzyma i sygnał zapięcia pasów zostanie wyłączony. Upewnijcie się, że macie ze sobą wszystkie swoje rzeczy osobiste przed opuszczeniem samolotu. Dziękuję za lot z nami w dniu dzisiejszym. Mamy nadzieję, że mieli państwo przyjemny lot i mamy nadzieję gościć państwa ponownie w najbliższej przyszłości.",
        "de": "[Ladies and gentlemen, welcome to {destinationCityName}.] Bitte bleiben Sie mit angelegtem Sicherheitsgurt sitzen, bis das Flugzeug vollständig zum Stillstand gekommen ist und das Anschnallzeichen ausgeschaltet ist. Bitte stellen Sie sicher, dass Sie alle Ihre persönlichen Gegenstände bei sich haben, bevor Sie das Flugzeug verlassen. Im Namen der Crew möchte ich Ihnen dafür danken, dass Sie heute mit uns geflogen sind. Wir hoffen, Sie hatten einen angenehmen Flug und freuen uns, Sie bald wieder an Bord begrüßen zu dürfen.",
        "pt": "[Ladies and gentlemen, welcome to {destinationCityName}.] Por favor, permaneçam sentados com o cinto de segurança afivelados até que a aeronave pare completamente e o aviso de atar os cintos se apague. Certifique-se de ter todos os seus pertences pessoais com você antes de sair da aeronave. Em nome da tripulação, gostaria de agradecer por voar conosco hoje. Esperamos que você tenha tido um voo agradável e esperamos recebê-lo novamente a bordo em breve.",
        "es": "[Ladies and gentlemen, welcome to {destinationCityName}.] Permanezca sentado con el cinturón de seguridad abrochado hasta que el avión se detenga por completo y se apague la señal de cinturón de seguridad. Asegúrese de tener todas sus pertenencias personales consigo antes de abandonar el avión. En nombre de la tripulación, me gustaría agradecerle por volar con nosotros hoy. Esperamos que haya tenido un vuelo agradable y esperamos darle la bienvenida a bordo nuevamente pronto.",
        "fr": "[Ladies and gentlemen, welcome to {destinationCityName}.] Veuillez rester assis avec votre ceinture de sécurité attachée jusqu'à ce que l'avion soit complètement arrêté et que le signal de ceinture de sécurité soit éteint. Veuillez vous assurer d'avoir tous vos effets personnels avec vous avant de quitter l'avion. Au nom de l'équipage, je tiens à vous remercier d'avoir volé avec nous aujourd'hui. Nous espérons que votre vol a été agréable et nous espérons vous accueillir à nouveau bientôt à bord.",
        "it": "[Ladies and gentlemen, welcome to {destinationCityName}.] Si prega di rimanere seduti con la cintura di sicurezza allacciata finché l'aereo non si è fermato completamente e il segnale della cintura di sicurezza non è stato spento. Assicurati di avere con te tutti i tuoi effetti personali prima di lasciare l'aereo. A nome dell'equipaggio, vorrei ringraziarvi per aver volato con noi oggi. Ci auguriamo che tu abbia trascorso un volo piacevole e non vediamo l'ora di darti nuovamente il benvenuto a bordo."
      },
      {
        "en": "Welcome to {destinationCityName}. Please remain seated with your seatbelt fastened until the aircraft has come to a complete stop and the seatbelt sign has been turned off. Please make sure you have all your personal belongings with you before you leave the aircraft. On behalf of the crew, I would like to thank you for flying with us today. We hope you had a pleasant flight and we look forward to welcoming you on board again soon.",
        "pl": "[Welcome to {destinationCityName}.] Prosimy o pozostanie na miejscach z zapiętymi pasami bezpieczeństwa, aż samolot całkowicie się zatrzyma i sygnał zapięcia pasów zostanie wyłączony. Upewnijcie się, że macie ze sobą wszystkie swoje rzeczy osobiste przed opuszczeniem samolotu. Dziękuję za lot z nami w dniu dzisiejszym. Mamy nadzieję, że mieli państwo przyjemny lot i mamy nadzieję gościć państwa ponownie w najbliższej przyszłości.",
        "de": "[Welcome to {destinationCityName}.] Bitte bleiben Sie mit angelegtem Sicherheitsgurt sitzen, bis das Flugzeug vollständig zum Stillstand gekommen ist und das Anschnallzeichen ausgeschaltet ist. Bitte stellen Sie sicher, dass Sie alle Ihre persönlichen Gegenstände bei sich haben, bevor Sie das Flugzeug verlassen. Im Namen der Crew möchte ich Ihnen dafür danken, dass Sie heute mit uns geflogen sind. Wir hoffen, Sie hatten einen angenehmen Flug und freuen uns, Sie bald wieder an Bord begrüßen zu dürfen.",
        "pt": "[Welcome to {destinationCityName}.] Por favor, permaneça sentado com o cinto de segurança afivelado até que a aeronave pare completamente e o aviso de atar os cintos seja apagado. Certifique-se de ter todos os seus pertences pessoais com você antes de sair da aeronave. Em nome da tripulação, gostaria de agradecer por voar conosco hoje. Esperamos que você tenha tido um voo agradável e esperamos recebê-lo novamente a bordo em breve.",
        "es": "[Welcome to {destinationCityName}.] Permanezca sentado con el cinturón de seguridad abrochado hasta que el avión se detenga por completo y se apague la señal de cinturón de seguridad. Asegúrese de tener todas sus pertenencias personales consigo antes de abandonar el avión. En nombre de la tripulación, me gustaría agradecerle por volar con nosotros hoy. Esperamos que haya tenido un vuelo agradable y esperamos darle la bienvenida a bordo nuevamente pronto.",
        "fr": "[Welcome to {destinationCityName}.] Veuillez rester assis avec votre ceinture de sécurité attachée jusqu'à ce que l'avion soit complètement arrêté et que le signal de ceinture de sécurité soit éteint. Veuillez vous assurer d'avoir tous vos effets personnels avec vous avant de quitter l'avion. Au nom de l'équipage, je tiens à vous remercier d'avoir volé avec nous aujourd'hui. Nous espérons que votre vol a été agréable et nous espérons vous accueillir à nouveau bientôt à bord.",
        "it": "[Welcome to {destinationCityName}.] Si prega di rimanere seduti con la cintura di sicurezza allacciata finché l'aereo non si è fermato completamente e il segnale della cintura di sicurezza non è stato spento. Assicurati di avere con te tutti i tuoi effetti personali prima di lasciare l'aereo. A nome dell'equipaggio, vorrei ringraziarvi per aver volato con noi oggi. Ci auguriamo che tu abbia trascorso un volo piacevole e non vediamo l'ora di darti nuovamente il benvenuto a bordo."
      }
    ]
  },

  // Deboarding
  {
    "category": "crew-deboarding",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_ON_BLOCKS']},
    "timeout": [10, 20],
    "chime": "DING_DONG",
    "runtimeGenerated": true,
    "texts": [
      {
        "en": "Doors will be opened shortly. Please remember to take all your personal belongings with you. Make sure you have everything you brought on board. Thank you.",
        "pl": "Drzwi zostaną otwarte wkrótce. Prosimy pamiętać, aby zabrać ze sobą wszystkie swoje rzeczy osobiste. Upewnijcie się, że macie ze sobą wszystko, co przynieśliście na pokład. Dziękujemy.",
        "de": "Die Türen werden in Kürze geöffnet. Bitte denken Sie daran, alle Ihre persönlichen Gegenstände mitzunehmen. Stellen Sie sicher, dass Sie alles dabei haben, was Sie an Bord mitgebracht haben. Danke schön.",
        "pt": "As portas serão abertas em breve. Lembre-se de levar todos os seus pertences pessoais com você. Certifique-se de ter tudo o que trouxe a bordo. Obrigado.",
        "es": "Las puertas se abrirán en breve. Recuerde llevar consigo todas sus pertenencias personales. Asegúrate de tener todo lo que trajiste a bordo. Gracias.",
        "fr": "Les portes seront ouvertes prochainement. N'oubliez pas d'emporter toutes vos affaires personnelles avec vous. Assurez-vous d'avoir tout ce que vous avez apporté à bord. Merci.",
        "it": "Le porte verranno aperte a breve. Ricordati di portare con te tutti i tuoi effetti personali. Assicurati di avere tutto ciò che hai portato a bordo. Grazie."
      },
      {
        "en": "We have arrived at the gate. Please remember to take all your personal belongings with you. Have a great day.",
        "pl": "Dotarliśmy do bramki. Prosimy pamiętać, aby zabrać ze sobą wszystkie swoje rzeczy osobiste. Miłego dnia.",
        "de": "Wir sind am Gate angekommen. Bitte denken Sie daran, alle Ihre persönlichen Gegenstände mitzunehmen. Ich wünsche ihnen einen wunderbaren Tag.",
        "pt": "Chegamos ao portão. Lembrem-se de levar todos os seus pertences pessoais com você, tenham todos um bom dia.",
        "es": "Hemos llegado a la puerta. Recuerde llevar consigo todas sus pertenencias personales. Qué tengas un lindo día.",
        "fr": "Nous sommes arrivés à la porte. N'oubliez pas d'emporter toutes vos affaires personnelles avec vous. Passe une bonne journée.",
        "it": "Siamo arrivati ​​al cancello. Ricordati di portare con te tutti i tuoi effetti personali. Vi auguro una buona giornata."
      }
    ]
  }
]

export default texts;
