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
        "it": "Signore e signori, ci aspettiamo qualche leggera turbolenza in vista. Vi preghiamo di ritornare ai vostri posti e di allacciare le cinture di sicurezza.",
        "tr": "Bayanlar ve baylar, önümüzde hafif bir türbülans bekliyoruz. Lütfen koltuklarınıza dönün ve emniyet kemerlerinizi bağlayın.",
        "nl": "Dames en heren, er is lichte turbulentie op komst. Neemt u alstublieft plaats in uw stoel met uw stoelriem vast.",
        "ko": "승객 여러분, 잠시 후 약간의 난기류가 있을 것으로 예상됩니다. 자리로 돌아가 좌석벨트를 착용해 주시기 바랍니다."
      },
      {
        "en": "Ladies and gentlemen, we've just received information about some light turbulence ahead. Please return to your seats and remain seated until the seatbelt sign is turned off.",
        "pl": "Szanowni państwo, właśnie otrzymaliśmy informację o lekkich turbulencjach przed nami. Prosimy o powrót na miejsca i pozostanie na nich do momentu wyłączenia sygnału zapięcia pasów.",
        "de": "Sehr geehrte Damen und Herren, wir haben gerade Informationen über leichte Turbulenzen erhalten. Bitte kehren Sie zu Ihren Plätzen zurück und bleiben Sie sitzen, bis die Anschnallzeichen erloschen sind.",
        "pt": "Senhoras e senhores, acabamos de receber informações sobre uma leve turbulência à frente. Por favor, retornem aos seus assentos e permaneçam sentados até que o aviso de atar os cintos seja desligado.",
        "es": "Damas y caballeros, acabamos de recibir información sobre una ligera turbulencia que se avecina. Por favor regrese a sus asientos y permanezca sentado hasta que se apague la señal del cinturón de seguridad.",
        "fr": "Mesdames et messieurs, nous venons de recevoir des informations concernant de légères turbulences à venir. Veuillez retourner à vos sièges et rester assis jusqu'à ce que le signal de ceinture de sécurité s'éteigne.",
        "it": "Signore e signori, abbiamo appena ricevuto informazioni su alcune leggere turbolenze in vista. Si prega di tornare ai propri posti e rimanere seduti fino allo spegnimento del segnale delle cinture di sicurezza.",
        "tr": "Bayanlar ve baylar, az önce önümüzdeki hafif türbülansa dair bilgi aldık. Lütfen koltuklarınıza dönün ve emniyet kemeri işareti sönene kadar yerlerinizde kalın.",
        "nl": "Dames en heren, we zijn zojuist geïnformeerd over lichte turbulentie op komst. Neemt u alstublieft plaats in uw stoel en blijft u zitten totdat het stoelriemen vast teken is uitgeschakeld.",
        "ko": "승객 여러분, 방금 앞에 가벼운 난기류가 있다는 정보를 받았습니다. 좌석벨트 싸인이 꺼질 때까지 자리로 돌아가 자리를 지켜주세요."
      },
      {
        "en": "Hello, this is your captain speaking. We had to turn on the seatbelt sign due to some light turbulence ahead. Please return to your seats and fasten your seat belts.",
        "pl": "Szanowni państwo, tu kapitan. Musieliśmy włączyć sygnał zapięcia pasów z powodu lekkich turbulencji przed nami. Prosimy o powrót na miejsca i zapięcie pasów.",
        "de": "Hallo, hier spricht Ihr Kapitän. Aufgrund leichter Turbulenzen vor uns wurden die Anschnallzeichen aktiviert. Bitte kehren Sie zu Ihren Plätzen zurück und schnallen Sie sich an.",
        "pt": "Olá pessoal, aqui é o comandante da aeronave. Tivemos que ligar o aviso de atar os cintos devido a uma turbulância leve a frente, por favor, retornem aos seus assentos e afivelem os cintos de segurança.",
        "es": "Hola, les habla su capitán. Tuvimos que encender la señal de cinturón de seguridad debido a unas ligeras turbulencias más adelante. Por favor regresen a sus asientos y abróchense los cinturones.",
        "fr": "Bonjour, c'est votre capitaine qui parle. Nous avons dû allumer le panneau de ceinture de sécurité en raison de légères turbulences à venir. Veuillez retourner à vos places et attacher vos ceintures de sécurité.",
        "it": "Salve, qui parla il vostro capitano. Abbiamo dovuto accendere il segnale delle cinture di sicurezza a causa di una leggera turbolenza davanti a noi. Vi preghiamo di ritornare ai vostri posti e di allacciare le cinture di sicurezza.",
        "tr": "Merhaba, kaptanınız konuşuyor. İlerideki hafif türbülans nedeniyle emniyet kemeri işaretini açmak zorunda kaldık. Lütfen koltuklarınıza dönün ve emniyet kemerlerinizi bağlayın.",
        "nl": "Hallo, hier spreekt uw gezagvoerder. We hebben het stoelriemen vast teken moeten activeren door wat lichte turbulentie op komst. Gaat u alstublieft terug naar uw stoel en maak uw stoelriem vast.",
        "ko": "안녕하세요, 기장입니다. 앞에 가벼운 난기류가 있기 때문에 좌석벨트 싸인을 켰습니다. 자리로 돌아가 좌석벨트를 착용해 주세요."
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
        "de": "Meine Damen und Herren, unser Kapitän hat uns gerade mitgeteilt, dass wir mit leichten Turbulenzen rechnen. Bitte kehren Sie zu Ihren Plätzen zurück und bleiben Sie sitzen, bis die Anschnallzeichen erlischen. Die Nutzung der Toiletten ist derzeit nicht gestattet.",
        "pt": "Senhoras e senhores, o comandante acaba de nos informar que passaremos por uma turbulência leve à frente. Permaneçam sentados até que o aviso de atar os cintos seja apagado. Neste momento não está permitido o uso dos lavatórios.",
        "es": "Damas y caballeros, nuestro capitán nos acaba de informar que esperamos ligeras turbulencias por delante. Por favor regrese a sus asientos y permanezca sentado hasta que se apague la señal del cinturón de seguridad. No se permite el uso de los baños en este momento.",
        "fr": "Mesdames et Messieurs, notre capitaine vient de nous informer que nous attendons de légères turbulences devant nous. Veuillez retourner à vos sièges et rester assis jusqu'à ce que le signal de ceinture de sécurité s'éteigne. L'utilisation des toilettes n'est pas autorisée pour le moment.",
        "it": "Signore e signori, il nostro capitano ci ha appena informato che ci aspettiamo qualche leggera turbolenza in vista. Si prega di tornare ai propri posti e rimanere seduti fino allo spegnimento del segnale delle cinture di sicurezza. Al momento non è consentito l'uso dei servizi igienici.",
        "tr": "Bayanlar ve baylar, kaptanımız az önce önümüzde hafif bir türbülans beklediğimizi bildirdi. Lütfen koltuklarınıza dönün ve emniyet kemeri işareti sönene kadar yerlerinizde kalın. Şu anda tuvaletlerin kullanılmasına izin verilmiyor.",
        "nl": "Dames en heren, de gezagvoerder heeft ons zojuist geïnformeerd dat we lichte turbulentie verwachten. Gaat u alstublieft terug naar uw stoel en blijft u zitten totdat het stoelriemen vast teken is uitgeschakeld. Het gebruik van de toiletten is momenteel niet toegestaan.",
        "ko": "승객 여러분, 기장님께서 곧 가벼운 난기류가 예상된다고 하셨습니다. 자리로 돌아가 좌석벨트 싸인이 꺼질 때까지 자리에 앉아계시기 바랍니다. 지금은 화장실을 사용할 수 없습니다."
      },
      {
        "en": "Our captain has just informed us that we are expecting some light turbulence ahead. Please fasten your seatbelts.",
        "pl": "Nasz kapitan właśnie poinformował nas, że spodziewamy się lekkich turbulencji. Prosimy o zapięcie pasów.",
        "de": "Unser Kapitän hat uns gerade mitgeteilt, dass wir mit leichten Turbulenzen rechnen. Bitte schnallen sie sich an.",
        "pt": "Senhoras e senhores, o comandante acaba de nos informar que passaremos por uma turbulência leve à frente. Por favor, afivelem seus cintos de segurança.",
        "es": "Nuestro capitán nos acaba de informar que se esperan ligeras turbulencias por delante. Por favor, abrochen sus cinturones.",
        "fr": "Notre capitaine vient de nous informer que nous attendons de légères turbulences devant nous. Veuillez attacher vos ceintures de sécurité.",
        "it": "Il nostro capitano ci ha appena informato che ci aspettiamo una leggera turbolenza in vista. Per favore, allacciate le cinture di sicurezza.",
        "tr": "Kaptanımız az önce önümüzde hafif bir türbülans beklediğimizi bildirdi. Lütfen emniyet kemerlerinizi bağlayın.",
        "nl": "Dames en heren, de gezagvoerder heeft ons zojuist geïnformeerd dat er lichte turbulentie op komst is. Maakt u alstublieft uw stoelriem vast.",
        "ko": "기장님께서 조금 전에 가벼운 난기류가 예상된다고 하셨습니다. 좌석벨트를 착용해 주시기 바랍니다."
      },
      {
        "en": "As you heard from our captain, we are expecting some light turbulence ahead. Please return to your seats and fasten your seat belts. Use of the lavatories is not allowed at this time.",
        "pl": "Jak mogli państwo usłyszeć od naszego kapitana, spodziewamy się lekkich turbulencji. Prosimy o powrót na miejsca i zapięcie pasów. Używanie toalet nie jest dozwolone w tym czasie.",
        "de": "Wie Sie von unserem Kapitän erfahren haben, rechnen wir mit leichten Turbulenzen. Bitte kehren Sie zu Ihren Plätzen zurück und schnallen Sie sich an. Die Nutzung der Toiletten ist derzeit nicht gestattet.",
        "pt": "Reforçamos que entraremos em uma área de turbulência à frente. Por favor, retornem aos seus assentos e afivelem os seus cintos. Neste momento não está permitido o uso dos lavatórios.",
        "es": "Como le dijo nuestro capitán, esperamos algunas turbulencias ligeras más adelante. Por favor regresen a sus asientos y abróchense los cinturones. No se permite el uso de los baños en este momento.",
        "fr": "Comme vous l'a dit notre capitaine, nous nous attendons à de légères turbulences à venir. Veuillez retourner à vos places et attacher vos ceintures de sécurité. L'utilisation des toilettes n'est pas autorisée pour le moment.",
        "it": "Come avete sentito dal nostro capitano, ci aspettiamo una leggera turbolenza in vista. Vi preghiamo di ritornare ai vostri posti e di allacciare le cinture di sicurezza. Al momento non è consentito l'uso dei servizi igienici.",
        "tr": "Kaptanımızdan duyduğunuza göre önümüzde hafif bir türbülans bekliyoruz. Lütfen koltuklarınıza dönün ve emniyet kemerlerinizi bağlayın. Şu anda tuvaletlerin kullanılmasına izin verilmiyor.",
        "nl": "Zoals u van de gezagvoerder heeft gehoord, verwachten wij lichte turbulentie op komst. Gaat u alstublieft terug naar uw stoel en blijft u zitten totdat het stoelriemen vast teken is uitgeschakeld. Het gebruik van de toiletten is momenteel niet toegestaan.",
        "ko": "기장님 말씀대로 앞으로 약간의 난기류가 예상됩니다. 자리로 돌아가 좌석벨트를 착용해 주시기 바랍니다. 지금은 화장실을 사용할 수 없습니다."
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
        "de": "Meine Damen und Herren, der Kapitän hat die Anschnallzeichen eingeschaltet. Bitte kehren Sie zu Ihren Plätzen zurück und schnallen Sie sich an.",
        "pt": "Senhoras e senhores, o comandante ligou o aviso de atar os cintos. Por favor, retornem aos seus assentos e afivelem seus cintos de segurança.",
        "es": "Damas y caballeros, el capitán ha activado la señal de cinturón de seguridad. Por favor regresen a sus asientos y abróchense los cinturones.",
        "fr": "Mesdames et messieurs, le capitaine a allumé le panneau de ceinture de sécurité. Veuillez retourner à vos places et attacher vos ceintures de sécurité.",
        "it": "Signore e signori, il capitano ha acceso il segnale delle cinture di sicurezza. Vi preghiamo di ritornare ai vostri posti e di allacciare le cinture di sicurezza.",
        "tr": "Bayanlar ve baylar, kaptan emniyet kemeri işaretini yaktı. Lütfen koltuklarınıza dönün ve emniyet kemerlerinizi bağlayın.",
        "nl": "Dames en heren, de gezagvoerder heeft het stoelriemen vast teken aangezet. Gaat u alstublieft terug naar uw stoel en maak uw stoelriem vast.",
        "ko": "승객 여러분, 기장님께서 좌석벨트 싸인을 켰습니다. 자리로 돌아가 좌석벨트를 착용해 주시기 바랍니다."
      },
      {
        "en": "Ladies and gentlemen, the seatbelt sign has been turned on. Please return to your seats and fasten your seat belts. Use of the lavatories is not allowed at this time.",
        "pl": "Szanowni państwo, sygnał zapięcia pasów został właśnie włączony. Prosimy o powrót na miejsca i zapięcie pasów. Używanie toalet nie jest dozwolone w tym czasie.",
        "de": "Meine Damen und Herren, die Anschnallzeichen sind eingeschaltet. Bitte kehren Sie zu Ihren Plätzen zurück und schnallen Sie sich an. Die Nutzung der Toiletten ist derzeit nicht gestattet.",
        "pt": "Senhoras e senhores, o aviso de atar os cintos foi aceso. Por favor, retornem aos seus assentos e afivelem os cintos de segurança. Neste momento não está permitido o uso dos lavatórios.",
        "es": "Damas y caballeros, se ha encendido la señal del cinturón de seguridad. Por favor regresen a sus asientos y abróchense los cinturones. No se permite el uso de los baños en este momento.",
        "fr": "Mesdames et messieurs, le signal de ceinture de sécurité est allumé. Veuillez retourner à vos places et attacher vos ceintures de sécurité. L'utilisation des toilettes n'est pas autorisée pour le moment.",
        "it": "Signore e signori, il segnale delle cinture di sicurezza è stato acceso. Vi preghiamo di ritornare ai vostri posti e di allacciare le cinture di sicurezza. Al momento non è consentito l'uso dei servizi igienici.",
        "tr": "Bayanlar ve baylar, emniyet kemeri işareti açıldı. Lütfen koltuklarınıza dönün ve emniyet kemerlerinizi bağlayın. Şu anda tuvaletlerin kullanılmasına izin verilmiyor.",
        "nl": "Dames en heren, het stoelriemen vast teken is geactiveerd. Neemt u alstublieft plaats in uw stoel met uw stoelriem vast. Het gebruik van de toiletten is momenteel niet toegestaan.",
        "ko": "승객 여러분, 좌석벨트 싸인이 켜졌습니다. 자리로 돌아가 좌석벨트를 착용해 주시기 바랍니다. 지금은 화장실 사용이 금지되어 있습니다."
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
        "de": "Meine Damen und Herren, der Kapitän hat die Anschnallzeichen ausgeschaltet. Sie können sich jetzt in der Kabine frei bewegen, wir empfehlen Ihnen jedoch, im Sitzen jederzeit angeschnallt zu sein, um verletzungen bei unerwartete Turbulenzen zu vermeiden.",
        "pt": "Senhoras e senhores, o comandante desligou o aviso de atar os cintos. A partir de agora você pode se movimentar pela cabine, mas nós recomendamos o uso do cinto de segurança enquanto estiver sentado, em caso de turbulência inesperada.",
        "es": "Damas y caballeros, el capitán ha desactivado la señal de cinturón de seguridad. Ahora puedes moverte por la cabina, pero te recomendamos que mantengas abrochado el cinturón de seguridad mientras estás sentado en caso de turbulencias inesperadas.",
        "fr": "Mesdames et messieurs, le capitaine a éteint le signal de ceinture de sécurité. Vous pouvez désormais vous déplacer dans la cabine, mais nous vous recommandons de garder votre ceinture de sécurité attachée lorsque vous êtes assis en cas de turbulences inattendues.",
        "it": "Signore e signori, il capitano ha spento il segnale delle cinture di sicurezza. Ora potete muovervi all'interno della cabina, ma vi consigliamo di tenere la cintura di sicurezza allacciata mentre siete seduti, in caso di turbolenze impreviste.",
        "tr": "Bayanlar ve baylar, kaptan emniyet kemeri işaretini kapattı. Artık kabin içinde hareket edebilirsiniz ancak beklenmedik bir türbülansa karşı oturduğunuzda emniyet kemerinizi takılı tutmanızı öneririz.",
        "nl": "Dames en heren, de gezagvoerder heeft het stoelriemen vast teken uitgeschakeld. U mag nu vrij door de cabine bewegen, maar wij raden u aan om uw stoelriem vast te houden terwijl u zit in geval van onverwachte turbulentie.",
        "ko": "승객 여러분, 기장님께서 좌석벨트 싸인을 껐습니다. 이제 기내를 이동할 수 있지만 예기치 않은 난기류를 대비하여 좌석에 앉은 상태에서 좌석벨트를 계속 착용하는 것이 좋습니다."
      },
      {
        "en": "As you can see, the seatbelt sign has been turned off. You may now move around the cabin, but we recommend that you keep your seatbelt fastened while seated in case of unexpected turbulence.",
        "pl": "Jak mogli państwo zauważyć, sygnał zapięcia pasów został wyłączony. Możecie państwo teraz poruszać się po kabinie, ale zalecamy, aby pasy były zapięte podczas siedzenia na wypadek niespodziewanych turbulencji.",
        "de": "Wie Sie sehen, wurden die Anschnallzeichen ausgeschaltet. Sie können sich jetzt in der Kabine bewegen, wir empfehlen Ihnen jedoch, im Sitzen jederzeit angeschnallt zu sein, um verletzungen bei unerwartete Turbulenzen zu vermeiden.",
        "pt": "Como você pode ver, o aviso de atar os cintos foi apagado. A partir de agora você pode se movimentar pela cabine, mas nós recomendamos o uso do cinto de segurança enquanto estiver sentado, em caso de turbulência inesperada.",
        "es": "Como puede ver, la señal del cinturón de seguridad se ha apagado. Ahora puedes moverte por la cabina, pero te recomendamos que mantengas abrochado el cinturón de seguridad mientras estás sentado en caso de turbulencias inesperadas.",
        "fr": "Comme vous pouvez le constater, le signal de ceinture de sécurité a été éteint. Vous pouvez désormais vous déplacer dans la cabine, mais nous vous recommandons de garder votre ceinture de sécurité attachée lorsque vous êtes assis en cas de turbulences inattendues.",
        "it": "Come potete vedere, il segnale della cintura di sicurezza è stato spento. Ora potete muovervi all'interno della cabina, ma vi consigliamo di tenere la cintura di sicurezza allacciata mentre siete seduti, in caso di turbolenze impreviste.",
        "tr": "Gördüğünüz gibi emniyet kemeri işareti kapatılmış. Artık kabin içinde hareket edebilirsiniz ancak beklenmedik bir türbülansa karşı oturduğunuzda emniyet kemerinizi takılı tutmanızı öneririz.",
        "nl": "Zoals u kunt zien, is het stoelriemen vast teken uitgeschakeld. U mag nu vrij door de cabine bewegen, maar wij raden u aan om uw stoelriem vast te houden terwijl u zit in geval van onverwachte turbulentie.",
        "ko": "좌석벨트 싸인이 꺼졌습니다. 이제 객실 주변을 이동할 수 있지만 예기치 않은 난기류를 대비하여 좌석에 앉은 상태에서 좌석벨트를 착용하고 있는것이 좋습니다."
      },
      {
        "en": "Seatbelt sign has just been turned off. You may now move around the cabin. We recommend that you keep your seatbelt fastened while seated in case of unexpected turbulence.",
        "pl": "Sygnał zapięcia pasów został właśnie wyłączony. Możecie państwo teraz poruszać się po kabinie. Zalecamy jednak, aby pasy były zapięte podczas siedzenia na wypadek niespodziewanych turbulencji.",
        "de": "Die Anschnallzeichen wurden gerade ausgeschaltet. Sie können sich nun in der Kabine bewegen. Für den Fall unerwarteter Turbulenzen empfehlen wir Ihnen, im Sitzen den Sicherheitsgurt angelegt zu lassen.",
        "pt": "Senhoras e senhores, o comandante desligou o aviso de atar os cintos. A partir de agora você pode se movimentar pela cabine, mas nós recomendamos o uso do cinto de segurança enquanto estiver sentado, em caso de turbulência inesperada.",
        "es": "La señal de cinturón de seguridad acaba de ser apagada. Ahora puedes moverte por la cabina. Le recomendamos que mantenga abrochado el cinturón de seguridad mientras está sentado en caso de turbulencias inesperadas.",
        "fr": "Le panneau de ceinture de sécurité vient d'être éteint. Vous pouvez maintenant vous déplacer dans la cabine. Nous vous recommandons de garder votre ceinture de sécurité attachée lorsque vous êtes assis en cas de turbulences inattendues.",
        "it": "Il segnale della cintura di sicurezza è appena stato spento. Ora potete muovervi in cabina. Vi consigliamo di tenere la cintura di sicurezza allacciata mentre restate seduti, in caso di turbolenze impreviste.",
        "tr": "Emniyet kemeri işareti yeni kapatıldı. Artık kabinin içinde hareket edebilirsiniz. Beklenmedik bir türbülansa karşı oturduğunuzda emniyet kemerinizi bağlı tutmanızı öneririz.",
        "nl": "Het stoelriem vast teken is zojuist uitgeschakeld. U mag nu vrij door de cabine bewegen, maar wij raden u aan om uw stoelriem vast te houden terwijl u zit in geval van onverwachte turbulentie.",
        "ko": "좌석벨트 싸인이 방금 꺼졌습니다. 이제 객실 주변을 이동할 수 있습니다. 하지만 예기치 않은 난기류가 발생할 수 있기 때문에 좌석에 앉은 상태에서 좌석벨트를 계속 착용하고 있는 것이 좋습니다."
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
    "timeout": [60, 70],
    "runtimeGenerated": true,
    "texts": [
      {
        "en": "Ladies and gentlemen, we are currently experiencing a delay. We apologize for the inconvenience and we will keep you updated on the progress. We are working hard to get you on your way as soon as possible. Thank you for your patience.",
        "pl": "Szanowni państwo, obecnie mamy drobne opóźnienie. Przepraszamy za niedogodności i będziemy informować państwa o postępach. Pracujemy nad tym, aby jak najszybciej ruszyć w drogę. Dziękujemy za cierpliwość.",
        "de": "Sehr geehrte Damen und Herren, wir erleben derzeit eine Verzögerung. Wir entschuldigen uns für die Unannehmlichkeiten und werden Sie über den weiteren Verlauf auf dem Laufenden halten. Wir arbeiten hart daran, Sie so schnell wie möglich auf den Weg zu bringen. Vielen Dank für Ihre Geduld.",
        "pt": "Senhoras e Senhores, infelizmente nós teremos um pequeno atraso em nossa partida. Pedimos desculpas pelo transtorno e manteremos vocês atualizados sobre o andamento. Estamos trabalhando para que você chegue ao seu destino o mais rápido possível. Obrigado pela paciência.",
        "es": "Damas y caballeros, actualmente estamos experimentando un retraso. Nos disculpamos por las molestias y lo mantendremos informado sobre el progreso. Estamos trabajando duro para que puedas seguir tu camino lo antes posible. Gracias por su paciencia.",
        "fr": "Mesdames et messieurs, nous connaissons actuellement un retard. Nous nous excusons pour la gêne occasionnée et nous vous tiendrons au courant des progrès. Nous travaillons dur pour vous mettre en route le plus rapidement possible. Merci pour votre patience.",
        "it": "Signore e signori, stiamo attualmente riscontrando un ritardo. Ci scusiamo per il disagio e vi terremo aggiornati sugli sviluppi. Faremo il possibile per recuperare il ritardo. Grazie per la vostra pazienza.",
        "tr": "Bayanlar ve baylar, şu anda bir gecikme yaşıyoruz. Bu rahatsızlıktan dolayı özür dileriz ve sizi gelişmelerden haberdar edeceğiz. Sizi en kısa sürede yolunuza çıkarmak için çok çalışıyoruz. Sabrınız için teşekkürler.",
        "nl": "Dames en heren, momenteel ondervinden wij vertraging. Onze excuses voor het ongemak, wij zullen u op de hoogte houden. Wij werken er hard aan om u zo snel mogelijk de lucht in te krijgen. Bedankt voor uw geduld.",
        "ko": "승객 여러분, 현재 우리 비행기가 지연되고 있습니다. 불편을 드려 죄송합니다. 진행 상황을 계속 알려드리겠습니다. 승무원들은 현재 최대한 빨리 진행될 수 있도록 노력하고 있습니다. 기다려 주셔서 감사합니다."
      },
      {
        "en": "Hi, this is your captain speaking. We are currently experiencing a delay. We apologize for the inconvenience and we will keep you updated on the progress. Thank you for your patience and understanding.",
        "pl": "Witajcie, tu kapitan. Obecnie mamy drobne opóźnienie. Przepraszamy za niedogodności i będziemy informować państwa o postępach. Dziękujemy za cierpliwość i zrozumienie.",
        "de": "Hallo, hier spricht Ihr Kapitän. Leider kommt es derzeit zu einer Verzögerung. Wir entschuldigen uns für die Unannehmlichkeiten und werden Sie über den weiteren Verlauf auf dem Laufenden halten. Vielen Dank für Ihre Geduld und Ihr Verständnis.",
        "pt": "Olá, aqui é o comandante falando. No momento estamos enfrentando um atraso. Pedimos desculpas pelo transtorno e manteremos vocês atualizados sobre o andamento. Obrigado pela sua paciência e compreensão.",
        "es": "Hola, habla tu capitán. Actualmente estamos experimentando un retraso. Nos disculpamos por las molestias y lo mantendremos informado sobre el progreso. Gracias por su paciencia y comprensión.",
        "fr": "Salut, c'est votre capitaine qui parle. Nous connaissons actuellement un retard. Nous nous excusons pour la gêne occasionnée et nous vous tiendrons au courant des progrès. Merci pour votre patience et votre compréhension.",
        "it": "Signore e signori, vi parla il vostro Comandante. Attualmente stiamo riscontrando un ritardo. Ci scusiamo per il disagio e vi terremo aggiornati sugli sviluppi. Grazie per la pazienza e la comprensione.",
        "tr": "Merhaba, kaptanınız konuşuyor. Şu anda bir gecikme yaşıyoruz. Yaşanan rahatsızlıktan dolayı özür dileriz. Gelişmeler hakkında sizi bilgilendireceğiz. Sabrınız ve anlayışınız için teşekkür ederiz.",
        "nl": "Hallo, hier spreekt uw gezagvoerder. We ondervinden momenteel wat vertraging. Onze excuses voor het ongemak, wij zullen u op de hoogte houden. Bedankt voor uw geduld en begrip.",
        "ko": "안녕하세요, 저는 이 비행기의 기장입니다. 현재 우리 비행기는 지연되고 있습니다. 불편을 드려 죄송합니다. 진행 상황을 계속 알려드리겠습니다. 기다려주시고 이해해주셔서 감사드립니다."
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
        "it": "Desideriamo scusarci nuovamente per il ritardo. Ci auguriamo che il volo sia stato piacevole, e non vediamo l'ora di ritrovarvi a bordo.",
        "tr": "Gecikmeden dolayı tekrar özür dileriz. Keyifli bir uçuş geçirmenizi dileriz. Sizi en kısa zamanda tekrar aramızda görmekten mutluluk duyarız.",
        "nl": "Wij willen u nogmaals onze excuses aanbieden voor de vertraging. We hopen dat u een goede vlucht heeft gehad en kijken er naar uit om u binnenkort weer aan boord te verwelkomen.",
        "ko": "비행기 지연에 대해 다시 한번 사과드립니다. 즐거운 비행이 되셨기를 바라며 곧 다시 뵙기를 기대하겠습니다."
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
        "it": "[Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Il mio nome è {captainName} e sono il comandante di questo volo. Desidero darvi un caloroso benvenuto a bordo e vi ringrazio per aver scelto il nostro vettore. Stiamo ultimando le procedure di partenza e presto inizieremo a rullare. Il nostro volo durerà circa [{flightTime}]. Se avete domande, non esitate a chiedere a uno dei membri del nostro equipaggio. Grazie per aver scelto di volare con {airlineName}.",
        "tr": "[Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Adım {captainName} ve bu uçuşun kaptanıyım. Bu uçuşta size hoş geldiniz diyor ve bugün bizimle uçmayı seçtiğiniz için teşekkür ediyorum. Şu anda kalkışa hazırlanıyoruz ve kısa süre sonra yola çıkacağız. [Our flight today will take approximately {flightTime}.] Herhangi bir sorunuz varsa veya yardıma ihtiyacınız varsa lütfen kabin ekibimizden birine sormaktan çekinmeyin. [Thank you for flying with {airlineName}.]",
        "nl": "[Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Mijn naam is {captainName} en ik ben de gezagvoerder op deze vlucht. Ik heet u graag welkom aan boord en dank u dat u ervoor heeft gekozen om vandaag met ons te vliegen. Wij bereiden ons momenteel voor op vertrek en zullen binnenkort opstijgen. [Our flight today will take approximately {flightTime}.] Als u vragen of hulp nodig heeft, stel deze dan gerust aan het cabinepersoneel. [Thank you for flying with {airlineName}.]",
        "ko": "[Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] [My name is {captainName} and I am the captain of this flight.] 여러분의 탑승을 환영하고 오늘 저희 비행기를 이용해 주셔서 감사의 말씀을 드립니다. 승무원들은 현재 출발을 준비하고 있으며 곧 이륙할 예정입니다. 오늘 저희 항공편은 약 {flightTime} 정도 소요될 예정입니다. 질문이 있거나 도움이 필요한 경우 주저하지 마시고 객실 승무원 중 한명에게 문의해 주시기 바랍니다. 저희와 함께 해주셔서 감사합니다."
      },
      {
        "en": "Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}. My name is {captainName} and I am the captain of this flight. We are currently preparing for departure and we will be taking off shortly. Thank you for choosing {airlineName}. Enjoy your flight.",
        "pl": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Nazywam się {captainName} i jestem kapitanem podczas tego lotu. Obecnie przygotowujemy się do startu i wkrótce rozpoczniemy kołowanie. [Thank you for choosing {airlineName}.] Życzymy miłego lotu.",
        "de": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mein Name ist {captainName} und ich bin der Kapitän dieses Fluges. Wir bereiten uns derzeit auf den Abflug vor und werden in Kürze abheben. [Thank you for choosing {airlineName}.] Guten Flug.",
        "pt": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Eu me chamo {captainName} e sou o comandante deste voo. No momento estamos nos preparando para a partida e decolaremos em breve. [Thank you for choosing {airlineName}.] Aproveite seu voo.",
        "es": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mi nombre es {captainName} y soy el capitán de este vuelo. Actualmente nos estamos preparando para el despegue y pronto comenzaremos a rodar. [Thank you for choosing {airlineName}.] Que tengas un buen vuelo.",
        "fr": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Je m'appelle {captainName} et je suis le capitaine de ce vol. Nous préparons actuellement le décollage et commencerons bientôt à rouler. [Thank you for choosing {airlineName}.] Bon vol.",
        "it": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mi chiamo {captainName} e sono il capitano di questo volo. Stiamo ultimando le procedure di partenza e presto inizieremo a rullare. [Thank you for choosing {airlineName}.] Vi augriamo un buon volo.",
        "tr": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Adım {captainName} ve bu uçuşun kaptanıyım. Şu anda kalkışa hazırlanıyoruz ve kısa süre sonra yola çıkacağız. [Thank you for choosing {airlineName}.] İyi uçuşlar.",
        "nl": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mijn naam is {captainName} en ik ben de gezagvoerder op deze vlucht. Wij bereiden ons momenteel voor op vertrek en zullen binnenkort opstijgen. [Thank you for choosing {airlineName}.] Fijne vlucht.",
        "ko": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] [My name is {captainName} and I am the captain of this flight.] 현재 출발 준비 중이며 곧 이륙할 예정입니다. {airlineName} 비행편을 선택해 주셔서 감사합니다. 즐거운 비행 되세요."
      },
      {
        "en": "Hello, this is your captain speaking. Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}. We are currently preparing for departure and we will be taking off shortly. Thank you for choosing to fly with us today.",
        "pl": "Szanowni państwo, tu kapitan. [Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Obecnie przygotowujemy się do startu i wkrótce rozpoczniemy kołowanie. Dziękujemy za wybór naszego przewoźnika.",
        "de": "Hallo, hier spricht Ihr Kapitän. [Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Wir bereiten uns derzeit auf den Abflug vor und werden in Kürze abheben. Vielen Dank, dass Sie sich entschieden haben, heute mit uns zu fliegen.",
        "pt": "Olá pessoal aqui é o comandante falando. [Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] No momento estamos nos preparando para a partida e decolaremos em breve. Obrigado por escolher voar conosco hoje.",
        "es": "Este es el capitán. [Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Actualmente nos estamos preparando para el despegue y pronto comenzaremos a rodar. Gracias por elegir nuestro transportista.",
        "fr": "C'est le capitaine. [Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Nous préparons actuellement le décollage et commencerons bientôt à rouler. Merci d'avoir choisi notre transporteur.",
        "it": "Vi parla il comandante. [Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Stiamo ultimando le procedure di partenza e presto inizieremo a rullare. Vi ringraziamo per averci scelto.",
        "tr": "Merhaba, kaptanınız konuşuyor. [Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Şu anda kalkışa hazırlanıyoruz ve kısa süre sonra yola çıkacağız. Bugün bizimle uçmayı seçtiğiniz için teşekkür ederiz.",
        "nl": "Hallo, hier spreekt uw gezagvoerder. [Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] Wij bereiden ons momenteel voor op vertrek en zullen binnenkort opstijgen. Bedankt dat u heeft gekozen om vandaag met ons te vliegen.",
        "ko": "안녕하세요, 기장님입니다. [Welcome aboard on this {airlineName} flight from {originCityName} to {destinationCityName}.] 현재 출발 준비 중이며 곧 이륙할 예정입니다. 오늘 저희 비행기를 이용해 주셔서 감사합니다."
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
        "en": "Hello and welcome aboard. My name is {crewName} and I am the purser on this flight. As you could hear from our captain - we are currently preparing for departure and we will be taking off shortly. Please make sure that your seatbelt is fastened and your seat back and tray table are in the upright position. Please turn off all personal electronic devices, including laptops and cell phones. Smoking is prohibited for the duration of the flight. If you have any questions or need assistance, please don't hesitate to ask me or one of my colleagues.",
        "pl": "Witamy na pokładzie. Nazywam się {crewName} i jestem członkiem załogi pokładowej podczas tego lotu. Jak mogli państwo usłyszeć od naszego kapitana - obecnie przygotowujemy się do startu i wkrótce rozpoczniemy kołowanie. Prosimy o zapięcie pasów bezpieczeństwa, ustawienie oparcia fotela i stolika w pozycji pionowej. Prosimy o wyłączenie wszystkich urządzeń elektronicznych, w tym laptopów i telefonów komórkowych. Palenie jest zabronione podczas trwania lotu. Jeśli mają państwo jakieś pytania lub potrzebują pomocy, proszę zwrocić się do mnie lub jednego z moich kolegów.",
        "de": "Hallo und willkommen an Bord. Mein Name ist {crewName} und ich bin ihr Purser auf diesem Flug. Wie Sie von unserem Kapitän hören konnten, bereiten wir uns derzeit auf den Abflug vor und werden in Kürze starten. Bitte stellen Sie sicher, dass Ihr Sicherheitsgurt angelegt ist und sich Ihre Rückenlehne und Ihr Tabletttisch in einer aufrechten Position befinden. Bitte schalten Sie alle persönlichen elektronischen Geräte, einschließlich Laptops und Mobiltelefone, aus. Für die Dauer des Fluges ist das Rauchen verboten. Wenn Sie Fragen haben oder Hilfe benötigen, zögern Sie bitte nicht, mich oder einen meiner Kollegen zu fragen.",
        "pt": "Olá bem-vindos a bordo. Meu nome é {crewName} e sou o membro do time de comissários deste voo. Como vocês puderam ouvir do nosso comandante, estamos nos preparando para a partida e decolaremos em breve. Pedimos que afivelem os cintos de segurança neste momento e guardem toda a bagagem embaixo do assento ou nos compartimentos superiores. Pedimos também que retornem seus assentos para a posição vertical, feche e trave a mesinha a sua frente. Desligue todos os dispositivos eletrônicos pessoais, incluindo laptops e telefones celulares. É proibido fumar durante o voo. Caso tenha alguma dúvida ou se precisar de ajuda, não hesite em perguntar a um dos comissários.",
        "es": "Hola y bienvenido a bordo. Mi nombre es {crewName} y soy miembro de la tripulación de cabina de este vuelo. Como pudo saber de nuestro capitán, actualmente nos estamos preparando para la salida y despegaremos en breve. Asegúrese de que su cinturón de seguridad esté abrochado y que el respaldo del asiento y la bandeja estén en posición vertical. Apague todos los dispositivos electrónicos personales, incluidas las computadoras portátiles y los teléfonos celulares. Está prohibido fumar durante la duración del vuelo. Si tiene alguna pregunta o necesita ayuda, no dude en preguntarme a mí o a uno de mis colegas.",
        "fr": "Bonjour et bienvenue à bord. Je m'appelle {crewName} et je suis le membre de l'équipage de cabine sur ce vol. Comme vous avez pu l'entendre de notre capitaine, nous préparons actuellement le départ et nous décollerons sous peu. Veuillez vous assurer que votre ceinture de sécurité est bouclée et que votre dossier de siège et votre tablette sont en position verticale. Veuillez éteindre tous les appareils électroniques personnels, y compris les ordinateurs portables et les téléphones portables. Il est interdit de fumer pendant toute la durée du vol. Si vous avez des questions ou avez besoin d'aide, n'hésitez pas à me les poser ou à l'un de mes collègues.",
        "it": "Signoe e signori vi do il benvenuto a bordo. Mi chiamo {crewName} e sono il membro dell'equipaggio di cabina di questo volo. Come avete potuto sentire dal comandante, al momento ci stiamo preparando per la partenza e decolleremo a breve. Assicurati che la cintura di sicurezza sia allacciata e che lo schienale e il tavolino siano in posizione verticale. Si prega di spegnere tutti i dispositivi elettronici personali, inclusi laptop e telefoni cellulari. È vietato fumare per tutta la durata del volo. Se hai domande o hai bisogno di assistenza, non esitare a chiedere a me o a uno dei miei colleghi. Grazie.",
        "tr": "Merhaba ve aramıza hoş geldiniz. Adım {crewName} ve bu uçuşta kabin ekibi üyesiyim. Kaptanımızdan da öğrendiğiniz üzere, şu anda kalkışa hazırlanıyoruz ve kısa süre sonra yola çıkacağız. Lütfen emniyet kemerinizin takılı olduğundan ve koltuk arkalığınızın ve tepsi masanızın dik konumda olduğundan emin olun. Lütfen dizüstü bilgisayarlar ve cep telefonları dahil tüm kişisel elektronik cihazları kapatın. Uçuş süresince sigara içmek yasaktır. Herhangi bir sorunuz varsa veya yardıma ihtiyacınız varsa lütfen bana veya meslektaşlarımdan birine sormaya çekinmeyin.",
        "nl": "Hallo en welkom aan boord. Mijn naam is {crewName} en ik ben uw purser op deze vlucht. Zoals u van de gezagvoerder kon horen -  bereiden wij ons momenteel voor op vertrek en zullen we binnenkort opstijgen. Zorg ervoor dat uw veiligheidsgordel is vastgemaakt en dat de rugleuning en het tafelblad rechtop staan. Schakel alle persoonlijke elektronische apparaten uit, inclusief laptops en mobiele telefoons. Roken is niet toegestaan gedurende de hele vlucht. Als u vragen of hulp nodig heeft, stel deze dan gerust aan een van mijn collega's.",
        "ko": "안녕하세요. 승객 여러분, 탑승을 환영합니다. 저는 이 비행기의 객실 승무원입니다. 기장님이 말씀하신 것처럼, 현재 출발을 준비하고 있으며 곧 이륙할 예정입니다. 좌석벨트를 매고 좌석 등받이와 앞좌석 선반이 똑바로 접혀있는지 확인하십시오. 노트북과 휴대전화를 포함한 모든 개인 전자 기기의 전원을 꺼주세요. 비행 중에는 흡연이 금지되어 있습니다. 궁금한 점이나 도움이 필요한 경우 주저하지 마시고 객실 승무원들에게 문의바랍니다."
      },
      {
        "en": "Ladies and gentlemen, welcome onboard. My name is {crewName} and I am the cabin crew member on this flight. We ask that you please fasten your seatbelts at this time and secure all baggage underneath your seat or in the overhead compartments. We also ask that your seats and table trays are in the upright position for take-off. Please turn off all personal electronic devices, including laptops and cell phones. Smoking is prohibited for the duration of the flight. Thank you for choosing {airlineName}. Enjoy your flight.",
        "pl": "Panie i panowie, witamy na pokładzie. Nazywam się {crewName} i jestem członkiem załogi pokładowej podczas tego lotu. Prosimy o zapięcie pasów bezpieczeństwa i umieszczenie bagażu pod siedzeniem lub w schowkach bagażowych. Prosimy również o ustawienie oparcia fotela i stolika w pozycji pionowej przed startem. Prosimy o wyłączenie wszystkich urządzeń elektronicznych, w tym laptopów i telefonów komórkowych. Palenie jest zabronione podczas trwania lotu. [Thank you for choosing {airlineName}.] Życzymy miłego lotu.",
        "de": "Sehr geehrte Damen und Herren, willkommen an Bord. Mein Name ist {crewName} und ich bin ihr Flugbegleiter auf diesem Flug. Wir bitten Sie, zu diesem Zeitpunkt Ihre Sicherheitsgurte anzulegen und das gesamte Gepäck unter Ihrem Sitz oder in den Gepäckfächern zu verstauen. Wir bitten Sie außerdem, dass sich Ihre Sitze und Tischablagen zum Abflug in aufrechter Position befinden. Bitte schalten Sie alle persönlichen elektronischen Geräte, einschließlich Laptops und Mobiltelefone, aus. Für die Dauer des Fluges ist das Rauchen verboten. [Thank you for choosing {airlineName}.] Guten Flug.",
        "pt": "Senhoras e senhores, sejam bem-vindos a bordo. Meu nome é {crewName} e sou o membro do time de comissários deste voo. Pedimos que afivelem os cintos de segurança neste momento e guarde toda a bagagem embaixo do assento ou nos compartimentos superiores. Pedimos também que retornem seus assentos para a posição vertical, feche e trave a mesinha a sua frente. Desligue todos os dispositivos eletrônicos pessoais, incluindo laptops e telefones celulares. É proibido fumar durante o voo. [Thank you for choosing {airlineName}.] Aproveite seu voo.",
        "es": "Damas y caballeros, bienvenidos a bordo. Mi nombre es {crewName} y soy miembro de la tripulación de cabina de este vuelo. Le pedimos que se abrochen los cinturones de seguridad en este momento y aseguren todo el equipaje debajo de su asiento o en los compartimentos superiores. También solicitamos que sus asientos y bandejas de mesa estén en posición vertical para el despegue. Apague todos los dispositivos electrónicos personales, incluidas las computadoras portátiles y los teléfonos celulares. Está prohibido fumar durante la duración del vuelo. [Thank you for choosing {airlineName}.] Disfruta tu vuelo.",
        "fr": "Mesdames et messieurs, bienvenue à bord. Je m'appelle {crewName} et je suis le membre de l'équipage de cabine sur ce vol. Nous vous demandons d'attacher vos ceintures de sécurité à ce moment-là et de sécuriser tous les bagages sous votre siège ou dans les compartiments supérieurs. Nous demandons également que vos sièges et plateaux de table soient en position verticale pour le décollage. Veuillez éteindre tous les appareils électroniques personnels, y compris les ordinateurs portables et les téléphones portables. Il est interdit de fumer pendant toute la durée du vol. [Thank you for choosing {airlineName}.] Appréciez votre vol.",
        "it": "Signore e signori, benvenuti a bordo. Mi chiamo {crewName} e sono il membro dell'equipaggio di cabina di questo volo. Vi chiediamo di allacciare le cinture di sicurezza e di posizionare i vostri bagagli sotto il sedile o negli scomparti soprastanti. Vi raccomandiamo inoltre di porre il tavolinetto e lo schienale della poltrona in posizione verticale per il decollo. Siete pregati di spegnere tutti i dispositivi elettronici, inclusi laptop e telefoni cellulari. È vietato fumare per tutta la durata del volo. [Thank you for choosing {airlineName}.] Buon volo.",
        "tr": "Bayanlar ve baylar, gemiye hoş geldiniz. Adım {crewName} ve bu uçuşta kabin ekibi üyesiyim. Bu sırada emniyet kemerlerinizi takmanızı ve tüm bagajlarınızı koltuğunuzun altına veya baş üstü bölmelere yerleştirmenizi rica ediyoruz. Ayrıca kalkış için koltuklarınızın ve masa tablalarınızın dik konumda olmasını rica ediyoruz. Lütfen dizüstü bilgisayarlar ve cep telefonları dahil tüm kişisel elektronik cihazları kapatın. Uçuş süresince sigara içmek yasaktır. [Thank you for choosing {airlineName}.] İyi uçuşlar.",
        "nl": "Dames en heren, welkom aan boord. Mijn naam is {crewName} en ik ben uw purser op deze vlucht. Wij vragen u om op dit moment uw veiligheidsgordels vast te maken en alle bagage onder uw stoel of in de bagagevakken boven uw hoofd op te bergen. We vragen ook dat uw stoelen en tafelbladen rechtop staan voor het opstijgen. Schakelt u alstublieft alle persoonlijke elektronische apparaten uit, inclusief laptops en mobiele telefoons. Roken is niet toegestaan gedurende de hele vlucht. [Thank you for choosing {airlineName}.] Fijne vlucht.",
        "ko": "승객 여러분, 탑승을 환영합니다. [My name is {crewName} and I am the cabin crew member on this flight.] 자리에 앉으셔서 좌석벨트를 매시고 좌석 아래 또는 머리 위 칸의 모든 수하물을 고정해 주시기 바랍니다. 또한 이륙을 위해 좌석과 앞좌석 선반이 똑바로 접혀있는지 확인해주시고 노트북과 휴대전화를 포함한 모든 개인 전자 기기의 전원을 꺼주시기 바랍니다. 비행 중에는 흡연이 금지되어 있습니다. {airlineName} 항공편을 선택해 주셔서 감사합니다. 즐거운 비행 되세요."
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
        "it": "[Welcome aboard on this {airlineName} flight.] [Today we are flying from {originCityName} to {destinationCityName}.] Mi chiamo {crewName} e sono un membro dell'equipaggio di questo volo. Attualmente ci stiamo preparando per la partenza e a breve inizieremo a rullare. Siete pregati di allacciare le cinture di sicurezza e di posizionare lo schienale e il tavolino in posizione verticale. Se avete domande o bisogno di aiuto, non esitate a contattare me o uno dei miei colleghi. [Thank you for flying with {airlineName}.]",
        "tr": "[Welcome aboard on this {airlineName} flight.] [Today we are flying from {originCityName} to {destinationCityName}.] Adım {crewName} ve bu uçuşta kabin ekibi üyesiyim. Şu anda kalkışa hazırlanıyoruz ve kısa süre sonra yola çıkacağız. Lütfen emniyet kemerinizin takılı olduğundan ve koltuk arkalığınızın ve tepsi masanızın dik konumda olduğundan emin olun. Herhangi bir sorunuz varsa veya yardıma ihtiyacınız varsa lütfen bana veya meslektaşlarımdan birine sormaya çekinmeyin. [Thank you for flying with {airlineName}.]",
        "nl": "[Welcome aboard on this {airlineName} flight.] [Today we are flying from {originCityName} to {destinationCityName}.] Mijn naam is {crewName} en ik ben uw purser op deze vlucht. Wij bereiden ons momenteel voor op vertrek en zullen binnenkort opstijgen. Zorgt u er alstublieft voor dat uw veiligheidsgordel is vastgemaakt en dat de rugleuning en het tafelblad rechtop staan. Als u vragen of hulp nodig heeft, stel deze dan gerust aan een van mijn collega's. [Thank you for flying with {airlineName}.]",
        "ko": "[Welcome aboard on this {airlineName} flight.] [Today we are flying from {originCityName} to {destinationCityName}.] 제 이름은 {crewName}이고 이 항공편의 객실 승무원입니다. 현재 출발을 준비하고 있으며 곧 이륙할 예정입니다. 좌석벨트가 잘 매여 있고 좌석 등받이와 앞좌석 선반이 똑바로 접혀있는지 확인하십시오. 질문이 있거나 도움이 필요하면 주저하지 말고 객실 승무원에게 물어보세요. [Thank you for flying with {airlineName}.]"
      },
      {
        "en": "Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}. My name is {crewName} and I am the cabin crew member on this flight. We ask that you please fasten your seatbelts at this time and secure all baggage underneath your seat or in the overhead compartments. We also ask that your seats and table trays are in the upright position for take-off. Please turn off all personal electronic devices, including laptops and cell phones. Smoking is prohibited for the duration of the flight. Thank you for choosing {airlineName}. Enjoy your flight.",
        "pl": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Nazywam się {crewName} i jestem członkiem załogi podczas tego lotu. Prosimy o zapięcie pasów bezpieczeństwa i umieszczenie bagażu pod siedzeniem lub w schowkach bagażowych. Prosimy również o ustawienie oparcia fotela i stolika w pozycji pionowej przed startem. Prosimy o wyłączenie wszystkich urządzeń elektronicznych, w tym laptopów i telefonów komórkowych. Palenie jest zabronione podczas trwania lotu. [Thank you for choosing {airlineName}.] Życzymy miłego lotu.",
        "de": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mein Name ist {crewName} und ich bin ihr Flugbegleiter auf diesem Flug. Wir bitten Sie, zu diesem Zeitpunkt Ihre Sicherheitsgurte anzulegen und das gesamte Gepäck unter Ihrem Sitz oder in den Gepäckfächern zu verstauen. Wir bitten Sie außerdem, Ihre Sitze und Tischablagen zum Abflug in eine aufrechte Position zu bringen. Bitte schalten Sie alle persönlichen elektronischen Geräte, einschließlich Laptops und Mobiltelefone, aus. Für die Dauer des Fluges ist das Rauchen verboten. [Thank you for choosing {airlineName}.] Guten Flug.",
        "pt": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Meu nome é {crewName} e sou o membro do time de comissários deste voo. Pedimos que afivelem os cintos de segurança neste momento e guarde toda a bagagem embaixo do assento ou nos compartimentos superiores. Pedimos também que retornem seus assentos para a posição vertical, feche e trave a mesinha a sua frente. Desligue todos os dispositivos eletrônicos pessoais, incluindo laptops e telefones celulares. É proibido fumar durante o voo. [Thank you for choosing {airlineName}.] Aproveite seu voo.",
        "es": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mi nombre es {crewName} y soy miembro de la tripulación de este vuelo. Abróchense los cinturones de seguridad y coloquen su equipaje debajo del asiento o en los maleteros. También le pedimos que coloque el respaldo del asiento y la mesa en posición vertical antes del despegue. Apague todos los dispositivos electrónicos, incluidas las computadoras portátiles y los teléfonos celulares. Está prohibido fumar durante el vuelo. [Thank you for choosing {airlineName}.] Que tengas un buen vuelo.",
        "fr": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Je m'appelle {crewName} et je suis membre d'équipage sur ce vol. Veuillez attacher vos ceintures de sécurité et placer vos bagages sous le siège ou dans les coffres à bagages. Nous vous demandons également de régler le dossier et la table en position verticale avant le décollage. Veuillez éteindre tous les appareils électroniques, y compris les ordinateurs portables et les téléphones portables. Il est interdit de fumer pendant le vol. [Thank you for choosing {airlineName}.] Bon vol.",
        "it": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mi chiamo {crewName} e sono un membro dell'equipaggio di questo volo. Siete pregati di allacciare le cinture di sicurezza e di posizionare i bagagli sotto il sedile o nel vano sovrastante. Vi chiediamo inoltre di posizionare lo schienale e il tavolino in posizione verticale prima del decollo. Siete pregati di spegnere tutti i dispositivi elettronici, inclusi laptop e telefoni cellulari. È vietato fumare durante il volo. [Thank you for choosing {airlineName}.] Buon volo.",
        "tr": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Adım {crewName} ve bu uçuşta kabin ekibi üyesiyim. Bu sırada emniyet kemerlerinizi takmanızı ve tüm bagajlarınızı koltuğunuzun altına veya baş üstü bölmelere yerleştirmenizi rica ediyoruz. Ayrıca kalkış için koltuklarınızın ve tepsi masalarınızın dik konumda olmasını rica ediyoruz. Lütfen dizüstü bilgisayarlar ve cep telefonları dahil tüm kişisel elektronik cihazları kapatın. Uçuş süresince sigara içmek yasaktır. [Thank you for choosing {airlineName}.] İyi uçuşlar.",
        "nl": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mijn naam is {crewName} en ik ben uw purser op deze vlucht. Wij vragen u om op dit moment uw veiligheidsgordels vast te maken en alle bagage onder uw stoel of in de bagagevakken boven uw hoofd op te bergen. We vragen ook dat uw stoelen en tafelbladen rechtop staan voor het opstijgen. Schakelt u alstublieft alle persoonlijke elektronische apparaten uit, inclusief laptops en mobiele telefoons. Roken is niet toegestaan gedurende de hele vlucht. [Thank you for choosing {airlineName}.] Fijne vlucht.",
        "ko": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] 저는 이 항공편의 객실 승무원입니다. 자리에 앉아서 좌석벨트를 매시고 좌석 아래 또는 머리 위칸에 모든 수하물을 고정해 주시기 바랍니다. 또한 이륙을 위해 좌석과 앞좌석 선반이 똑바로 접혀있는지 확인해주세요. 노트북과 휴대전화를 포함한 모든 개인 전자 기기의 전원을 꺼주시기 바랍니다. 비행 중에는 흡연이 금지되어 있습니다. [Thank you for flying with {airlineName}.]"
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
        "it": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Vi invitiamo a tenere allacciata la cintura di sicurezza quando siete seduti ed ogni volta che il segnale luminoso è attivo.",
        "tr": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Lütfen oturduğunuzda ve emniyet kemeri işareti yandığında emniyet kemerinizi bağlı tutmayı unutmayın.",
        "nl": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Vergeet niet om uw stoelriem gesloten te houden terwijl u zit en wanneer het stoelriemen vast teken brandt.",
        "ko": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] 자리에 앉아 좌석벨트 싸인에 불이 켜질 때마다 좌석벨트 착용 하는것을 잊지마세요."
      },
      {
        "en": "Ladies ang gentleman, this is your captain speaking again. Our flight today will take approximately {flightTime}. The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}. We expect a smooth flight with a small chance of light turbulences. Please relax and enjoy the flight.",
        "pl": "Panie i Panowie, z tej strony Wasz kapitan. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Spodziwamy się spokojnego lotu z małymi szansami na lekkie turbulencje. Życzę miłego lotu.",
        "de": "Hallo, ich bin es wieder. Ich dachte, ich teile einige Informationen mit Ihnen. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Wir erwarten einen ruhigen Flug mit einer geringen Wahrscheinlichkeit leichter Turbulenzen. Bitte entspannen Sie sich und genießen Sie den Flug.",
        "pt": "Olá, sou eu de novo. Gostaria de compartilhar algumas informações com vocês. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.]  Esperamos um vôo tranquilo com pequenas chances de turbulências leve. Por favor, relaxe e aproveite o vôo.",
        "es": "Hola, soy yo de nuevo. Quería compartir algo de información contigo. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Esperamos un vuelo tranquilo con pocas posibilidades de ligeras turbulencias. Que tengas un buen vuelo.",
        "fr": "Bonjour, c'est encore moi. Je voulais partager quelques informations avec vous. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Nous nous attendons à un vol calme avec peu de risque de légères turbulences. Bon vol.",
        "it": "Vi parla ancora il comandante. Ecco alcune brevi informazioni sul nostro volo. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Si prevede un volo tranquillo, senza turbolenze. Buon volo.",
        "tr": "Merhaba, yine ben. Sizinle bazı bilgileri paylaşacağımı düşündüm. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Hafif türbülans ihtimalinin düşük olduğu, sorunsuz bir uçuş bekliyoruz. Lütfen rahatlayın ve uçuşun tadını çıkarın.",
        "nl": "Hallo, ik ben het weer. Ik dacht, laat ik wat informatie met jullie delen. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Wij verwachten een voorspoedige vlucht met een kleine kans op lichte turbulentie. Ontspan en geniet van de vlucht.",
        "ko": "안녕하세요. 다시 기장입니다. 승객 여러분들에게 몇가지 정보를 알려드릴까 합니다. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] 가벼운 난기류가 발생할 가능성은 있지만 순조로운 비행을 예상하고 있습니다. 긴장을 풀고 비행을 즐기시기 바랍니다."
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
        "it": "Signore e signori, subito dopo il decollo inizieremo a servire snack e bevande. Potete consultare il menu nella tasca del sedile di fronte a voi.",
        "tr": "Bayanlar ve baylar, kalkıştan kısa bir süre sonra atıştırmalık ve içecek servisi yapmaya başlayacağız. Gökyüzü menümüzü önünüzdeki koltuk cebinde bulabilirsiniz.",
        "nl": "Dames en heren, kort na het opstijgen beginnen we met het serveren van snacks en drankjes. Ons Sky-menu vindt u in het stoelvak voor u.",
        "ko": "승객 여러분, 이륙 직후 간식과 음료 서비스를 시작하겠습니다. 앞 좌석 주머니에서 스카이 메뉴를 찾을 수 있습니다."
      },
      {
        "en": "Shortly after takeoff we'll start serving snacks and drinks. You can find our sky menu in the seat pocket in front of you.",
        "pl": "Krótko po starcie rozpoczniemy serwowanie przekąsek i napojów. Nasze menu znajdą państwo w kieszeni siedzenia przed państwem.",
        "de": "Kurz nach dem Start beginnen wir mit dem Servieren von Snacks und Getränken. Unser Sky-Menü finden Sie in der Sitztasche vor Ihnen.",
        "pt": "Logo após a decolagem começaremos a servir lanches e bebidas. Você pode encontrar nosso menu Sky no bolso do assento à sua frente.",
        "es": "Poco después del despegue comenzaremos a servir snacks y bebidas. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted.",
        "fr": "Peu après le décollage, nous commencerons à servir des collations et des boissons. Vous trouverez notre menu ciel dans la pochette du siège devant vous.",
        "it": "Poco dopo il decollo inizieremo a servire snack e bevande. Potete trovare il nostro menu nella tasca del sedile di fronte.",
        "tr": "Kalkıştan kısa bir süre sonra atıştırmalık ve içecek servisi yapmaya başlayacağız. Gökyüzü menümüzü önünüzdeki koltuk cebinde bulabilirsiniz.",
        "nl": "Kort na het opstijgen beginnen we met het serveren van snacks en drankjes. Ons Sky-menu vindt u in het stoelvak voor u.",
        "ko": "이륙 직후 간식과 음료 서비스를 시작합니다. 앞 좌석 주머니에서 스카이 메뉴를 찾을 수 있습니다."
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
        "it": "[Our flight today will take approximately {flightTime}.] Il comandante informa che il volo dovrebbe procedere senza intoppi. Poco dopo il decollo inizieremo a servire snack e bevande. Potete trovare il nostro menu nella tasca del sedile di fronte.",
        "tr": "[Our flight today will take approximately {flightTime}.] Kaptan bana uçuşun sorunsuz olması gerektiğini söyledi. Kalkıştan kısa bir süre sonra atıştırmalık ve içecek servisi yapmaya başlayacağız. Gökyüzü menümüzü önünüzdeki koltuk cebinde bulabilirsiniz.",
        "nl": "[Our flight today will take approximately {flightTime}.] De gezagvoerder heeft mij zojuist laten weten dat het een voorspoedige vlucht gaat worden. Kort na het opstijgen beginnen we met het serveren van snacks en drankjes. Ons Sky-menu vindt u in het stoelvak voor u.",
        "ko": "[Our flight today will take approximately {flightTime}.] 기장님께서 비행이 원활해야 한다고 알려주셨습니다. 이륙 직후 간식과 음료 서비스를 시작하겠습니다. 앞 좌석 주머니에서 스카이 메뉴를 찾을 수 있습니다."
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
        "de": "Meine Damen und Herren im Namen von Kapitän {captainName} und der Besatzung möchten wir sie nocheinmal rechtherzlich an Bord begrüßen. Wir möchten Sie nun mit den Sicherheitsvorkehrungen an Bord vertraut machen. Richten sie hierzu ihre gesamte Aufmerksamkeit auf ihre Flugbegleiter. Es gibt {aircraftEmergencyExistsCount} Notausgänge in diesem Flugzeug. Nehmen Sie sich einen Moment Zeit, um den nächstgelegenen Ausgang zu finden. Beachten Sie, dass sich der nächste Ausgang möglicherweise hinter Ihnen befindet. Sollte es in der Kabine zu einem plötzlichen Druckverlust kommen, bleiben Sie ruhig und achten Sie auf die Anweisungen des Kabinenpersonals. Sauerstoffmasken fallen von über Ihrem Sitz herunter. Legen Sie die Maske wie folgt über Mund und Nase. Ziehen Sie am Riemen, um die Maske festzuziehen. Wenn Sie mit Kindern reisen, stellen Sie sicher, dass Sie zuerst Ihre eigene Maske anlegen, bevor Sie Ihren Kindern helfen. Lassen Sie im unwahrscheinlichen Fall einer Notlandung und Evakuierung Ihr Handgepäck zurück. Unter Ihren Sitzen befinden sich Rettungswesten und eine Notbeleuchtung führt Sie zum nächstgelegenen Ausgang. Wir bitten Sie, während des Fluges darauf zu achten, dass das gesamte Handgepäck sicher verstaut ist. Während wir auf den Abflug warten, nehmen Sie sich bitte einen Moment Zeit und überprüfen Sie die Sicherheitsdatenkarte in der Sitztasche vor Ihnen. Vielen Dank für Ihre Aufmerksamkeit.",
        "pt": "Senhores passageiros sua atenção por favor, apresentaremos agora as informações de segurança deste avião. Para afivelar seu cinto de segurança encaixe as extremidades e ajuste-o puxando a tira, para soltá-lo levante a parte externa da fivela. Por lei é proibido fumar a bordo inclusive cigarros eletrônicos. Também é proibido manipular os detectores de fumaça dos lavatórios. Luzes de emergência no piso e no teto indicarão o caminho para as saídas da aeronave, localize a saída mais próxima lembrando que ela poderá estar atrás de você. Se a cabine perder pressão, máscaras de oxigênio cairão automaticamente dos compartimentos acima dos seus assentos. Puxe uma delas coloque sobre o nariz e a boca e respire normalmente. Somente ajude outras pessoas após ter colocado a sua máscara. O equipamento para auxílio à flutuação está indicado a sua frente, verifique o cartão com as informações de segurança localizado no bolsão da poltrona. Agradecemos a atenção e desejamos a todos uma ótima viagem.",
        "es": "Damas y caballeros, en nombre de la tripulación les pido que dirija su atención a los miembros de la tripulación mientras revisamos los procedimientos de emergencia. Hay {aircraftEmergencyExistsCount} salidas de emergencia en esta aeronave. Tómate un minuto para localizar la salida más cercana a ti. Tenga en cuenta que la salida más cercana puede estar detrás de usted. Si la cabina experimenta una pérdida repentina de presión, mantenga la calma y escuche las instrucciones de la tripulación de cabina. Las máscaras de oxígeno caerán desde encima de su asiento. Coloque la mascarilla sobre su boca y nariz, así. Tire de la correa para apretarla. Si viaja con niños, asegúrese primero de que su propia mascarilla esté puesta antes de ayudar a sus hijos. En el improbable caso de un aterrizaje de emergencia y una evacuación, deje atrás su equipaje de mano. Las balsas salvavidas están ubicadas debajo de sus asientos y la iluminación de emergencia lo llevará a la salida más cercana. Le pedimos que se asegure de que todo el equipaje de mano esté guardado de forma segura durante el vuelo. Mientras esperamos el despegue, tómese un momento para revisar la tarjeta de datos de seguridad en el bolsillo del asiento frente a usted. Gracias por su atención.",
        "fr": "Mesdames et messieurs, au nom de l'équipage, je vous demande de bien vouloir porter votre attention sur les membres de l'équipage pendant que nous examinons les procédures d'urgence. Il y a {aircraftEmergencyExistsCount} sorties de secours sur cet avion. Prenez une minute pour localiser la sortie la plus proche de chez vous. Notez que la sortie la plus proche peut être derrière vous. Si la cabine subit une perte de pression soudaine, restez calme et écoutez les instructions du personnel de cabine. Les masques à oxygène tomberont du dessus de votre siège. Placez le masque sur votre bouche et votre nez, comme ceci. Tirez sur la sangle pour la serrer. Si vous voyagez avec des enfants, assurez-vous d'abord que votre propre masque est en place avant d'aider vos enfants. Dans le cas peu probable d’un atterrissage et d’une évacuation d’urgence, laissez vos bagages à main derrière vous. Les radeaux de sauvetage sont situés sous vos sièges et un éclairage de secours vous mènera à la sortie la plus proche. Nous vous demandons de vous assurer que tous les bagages à main sont rangés en toute sécurité pendant le vol. Pendant que nous attendons le décollage, veuillez prendre un moment pour consulter la fiche de données de sécurité dans la poche du siège devant vous. Merci pour votre attention.",
        "it": "Signore e signori, vi invitiamo a rivolgere la vostra attenzione ai membri dell'equipaggio che vi illustrano le procedure di emergenza. Ci sono {aircraftEmergencyExistsCount} uscite di emergenza su questo aereo. Individuate quella più vicina a voi. Tenete presente che l'uscita più vicina potrebbe essere dietro di voi. Nel caso di un'improvvisa perdita di pressione, mantenete la calma e ascoltare le istruzioni dell'equipaggio di cabina. Le maschere di ossigeno cadranno da sopra di voi. Mettete la maschera coprendo naso e bocca. Tirate la cinghia per stringerla. Se viaggiate con bambini, assicuratevi di indossare correttamente la vostra maschera prima di aiutarli. Nell'improbabile caso di atterraggio ed evacuazione di emergenza, lasciate a bordo il bagaglio a mano. I giubbotti salvagente si trovano sotto il sedile, e l'illuminazione di emergenza vi condurrà all'uscita più vicina. Accertatevi che i bagagli a mano siano riposti in modo sicuro durante il volo. In attesa del decollo, vi invitiamo a leggere la scheda con le norme di sicurezza, posta nella tasca del sedile di fronte. Grazie per l'attenzione.",
        "tr": "Bayanlar ve baylar, mürettebat adına, biz acil durum prosedürlerini incelerken lütfen dikkatinizi mürettebat üyelerine yöneltmenizi rica ediyorum. Bu uçakta {aircraftEmergencyExistsCount} acil çıkış bulunmaktadır. Size en yakın çıkışı bulmak için bir dakikanızı ayırın. En yakın çıkışın arkanızda olabileceğini unutmayın. Kabinde ani basınç kaybı olması durumunda sakin olun ve kabin ekibinin talimatlarını dinleyin. Oksijen maskeleri koltuğunuzun üzerinden aşağıya düşecek. Maskeyi ağzınıza ve burnunuza bu şekilde yerleştirin. Sıkmak için kayışı çekin. Çocuklarla seyahat ediyorsanız çocuklarınıza yardım etmeden önce kendi maskenizin takılı olduğundan emin olun. Nadir de olsa acil iniş ve tahliye durumunda, yanınızda taşıyabileceğiniz eşyalarınızı geride bırakın. Can salları koltuklarınızın altında bulunmaktadır ve acil durum aydınlatması sizi en yakın çıkışa yönlendirecektir. Uçuş sırasında tüm el bagajınızın güvenli bir şekilde saklandığından emin olmanızı rica ediyoruz. Biz kalkışı beklerken lütfen bir dakikanızı ayırıp önünüzdeki koltuk cebinde bulunan güvenlik kartını inceleyin. İlginiz için teşekkür ederiz.",
        "nl": "Dames en heren, namens de bemanning vraag ik u alstublieft uw aandacht terwijl wij de veiligheidsvoorzieningen demonstreren. Er zijn {aircraftEmergencyExistsCount} nooduitgangen in dit vliegtuig. Neem even de tijd om de dichtstbijzijnde uitgang te vinden. Houd er rekening mee dat de dichtstbijzijnde uitgang zich mogelijk achter u bevindt. Mocht er in de cabine plotseling drukverlies optreden, blijf dan kalm en luister naar de instructies van het cabinepersoneel. Zuurstofmaskers vallen van boven uw stoel naar beneden. Plaats het masker op deze manier over uw mond en neus. Trek aan de band om deze strakker te maken. Als u met kinderen reist, zorg er dan voor dat u eerst uw eigen masker op heeft voordat u uw kinderen helpt. In het onwaarschijnlijke geval van een noodlanding en evacuatie laat u uw handbagage achter. Reddingsvlotten bevinden zich onder uw stoelen en noodverlichting leidt u naar de dichtstbijzijnde uitgang. Wij vragen u ervoor te zorgen dat alle handbagage tijdens de vlucht veilig opgeborgen is. Terwijl we wachten op het opstijgen, verzoeken wij u even de tijd te nemen om de veiligheidskaart in het stoelvak voor u te bekijken. Bedankt voor uw aandacht.",
        "ko": "승객 여러분, 승무원을 대표하여 비상 절차를 검토하는 동안 승무원에게 주의를 기울여 주시기를 부탁드립니다. 이 항공기에는 {aircircuitEmergencyExistCount}개의 비상구가 있습니다. 잠시 시간을 내어 여러분과 가장 가까운 출구를 찾아보세요. 가장 가까운 출구는 뒤에 있을 수 있습니다. 객실에 갑작스러운 압력 이상이 발생하면 침착하게 객실 승무원의 지시를 따라주세요. 좌석 위에서 산소 마스크가 떨어질 것입니다. 이렇게 입과 코에 마스크를 착용하세요. 스트랩을 당겨 단단히 조입니다. 어린이와 함께 여행하는 경우 어린이를 돕기 전에 마스크를 먼저 착용하세요. 비상 착륙 및 대피 시 예상치 못한 경우 휴대품을 두고 가세요. 구명 뗏목은 좌석 아래에 있으며 비상등이 가장 가까운 출구로 안내해 줄 것입니다. 비행 중에 모든 휴대품을 안전하게 보관하십시오. 이륙을 기다리는 동안 잠시 시간을 내어 앞 좌석 주머니에 있는 안전 데이터 카드를 읽어봐주세요. 감사합니다."
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
        "it": "Assistenti di volo, prepararsi al decollo.",
        "tr": "Kabin ekibi, kalkışa hazırlanın.",
        "nl": "Cabinepersoneel, klaarmaken voor opstijgen.",
        "ko": "캐빈크루, 이륙 준비해주세요."
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
        "it": "Signore e signori, rimanete seduti mentre saliamo alla quota di crociera. A breve inizieremo il nostro servizio a bordo. Potete consultare il menu nella tasca del sedile di fronte.",
        "tr": "Bayanlar ve baylar, seyir irtifamıza tırmanırken lütfen yerlerinizde kalın. Kısa süre içerisinde uçak içi hizmetimize başlayacağız. Gökyüzü menümüzü önünüzdeki koltuk cebinde bulabilirsiniz.",
        "nl": "Dames en heren, blijft u alstublieft zitten terwijl we naar onze kruishoogte stijgen. We beginnen zo met onze service tijdens de vlucht. U vindt ons skymenu in de stoelzak voor u.",
        "ko": "승객 여러분, 비행기가 순항 고도에 올라가는 동안 자리에 앉아 계십시오. 잠시 후 기내 서비스를 시작하겠습니다. 앞쪽 좌석 주머니에서 스카이 메뉴를 찾을 수 있습니다."
      },
      {
        "en": "We are now climbing to our cruising altitude. We will be starting our in-flight service shortly. You can find our sky menu in the seat pocket in front of you.",
        "pl": "Obecnie wznosimy się do naszej wysokości przelotowej. Wkrótce rozpoczniemy serwis pokładowy. Menu znajdą państwo w kieszeni siedzenia przed sobą.",
        "de": "Wir steigen jetzt auf unsere Reiseflughöhe. Wir werden in Kürze mit unserem Bordservice beginnen. Unser Sky-Menü finden Sie in der Sitztasche vor Ihnen.",
        "pt": "Agora estamos subindo para a nossa altitude de cruzeiro. Em breve iniciaremos nosso serviço de bordo. Você pode encontrar nosso menu Sky no bolsão do assento à sua frente.",
        "es": "Ahora estamos subiendo a nuestra altitud de crucero. En breve iniciaremos nuestro servicio a bordo. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted.",
        "fr": "Nous remontons désormais à notre altitude de croisière. Nous commencerons prochainement notre service en vol. Vous trouverez notre menu ciel dans la pochette du siège devant vous.",
        "it": "Stiamo ora salendo alla nostra quota di crociera. A breve inizieremo il nostro servizio a bordo. Potete consultare il menu nella tasca del sedile di fronte.",
        "tr": "Artık seyir irtifamıza tırmanıyoruz. Kısa süre içerisinde uçak içi hizmetimize başlayacağız. Gökyüzü menümüzü önünüzdeki koltuk cebinde bulabilirsiniz.",
        "nl": "We klimmen nu naar onze kruishoogte. We beginnen zo met onze service tijdens de vlucht. U vindt ons skymenu in de stoelzak voor u.",
        "ko": "우리 비행기 이제 순항 고도로 올라갑니다. 곧 기내 서비스를 시작할 예정입니다. 앞 좌석 주머니에서 스카이 메뉴를 찾을 수 있습니다."
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
        "it": "Signore e signori, stiamo iniziando il nostro servizio di bordo. Ti ricordiamo che accettiamo pagamenti sia con carta che in contanti. Potete consultare il menu nella tasca del sedile di fronte. Vi invitiamo a rimanere seduti mentre vi serviamo. Per qualunque necessità, non esitate a chiedere a uno dei membri dell'equipaggio di cabina. Grazie.",
        "tr": "Bayanlar ve baylar, artık uçak içi hizmetimize başlıyoruz. Nakit ödemenin yanı sıra kartla da ödeme kabul ettiğimizi hatırlatmak isteriz. Gökyüzü menümüzü önünüzdeki koltuk cebinde bulabilirsiniz. Size hizmet ederken lütfen yerlerinizde kalın. Bir şeye ihtiyacınız olursa lütfen kabin ekibimizden birine sormaktan çekinmeyin. Teşekkür ederim.",
        "nl": "Dames en heren, we beginnen nu met onze in-flight service. We willen u eraan herinneren dat we zowel kaartbetalingen als contante betalingen accepteren. U vindt ons skymenu in de stoelzak voor u. Blijf alstublieft zitten terwijl wij u bedienen. Als u iets nodig hebt, aarzel dan niet om het aan een van onze cabinemedewerkers te vragen. Hartelijk dank.",
        "ko": "승객 여러분, 기내 서비스를 시작합니다. 저희는 현금뿐만 아니라 카드 결제도 가능하다는 것을 알려드리고자 합니다. 앞 좌석 주머니에 스카이 메뉴판이 있습니다. 서비스를 제공하는 동안 자리에 앉아 계십시오. 필요한 것이 있으시면 주저하지 마시고 객실 승무원을 불러주세요. 감사합니다."
      },
      {
        "en": "We are now starting our in-flight service. We'd like to remind you that we accept card payments as well as cash. You can find our sky menu in the seat pocket in front of you. Please remain seated while we serve you. If you need anything, please don't hesitate to ask one of our cabin crew members. Thank you.",
        "pl": "Rozpoczynamy serwis pokładowy. Przypominamy, że akceptujemy płatności kartą oraz gotówką. Menu znajdą państwo w kieszeni siedzenia przed sobą. Prosimy o pozostanie na miejscach podczas naszej obsługi. Jeśli mają Państwo specjalne potrzeby, prosimy zwrócić się do jednego z członków naszej załogi. Dziękujemy.",
        "de": "Wir starten jetzt unseren Bordservice. Wir möchten Sie daran erinnern, dass wir sowohl Kartenzahlungen als auch Bargeld akzeptieren. Unser Sky-Menü finden Sie in der Sitztasche vor Ihnen. Bitte bleiben Sie sitzen, während wir Sie bedienen. Wenn Sie etwas benötigen, zögern Sie bitte nicht, eines unserer Kabinenpersonalmitglieder zu fragen. Danke schön.",
        "pt": "Agora vamos iniciar o nosso serviço de bordo. Gostaríamos de lembrar que aceitamos pagamentos com cartão e dinheiro. Você pode encontrar nosso menu Sky no bolsão do assento à sua frente. Por favor, permaneça sentado enquanto o atendemos. Se precisar de alguma coisa, não hesite em perguntar a um dos nossos comissários. Obrigado.",
        "es": "Ahora estamos iniciando nuestro servicio a bordo. Te recordamos que aceptamos pagos con tarjeta además de efectivo. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted. Por favor permanezca sentado mientras le atendemos. Si necesitas algo, no dudes en preguntar a uno de nuestros miembros de la tripulación de cabina. Gracias.",
        "fr": "Nous commençons maintenant notre service en vol. Nous vous rappelons que nous acceptons les paiements par carte ainsi que les espèces. Vous trouverez notre menu ciel dans la pochette du siège devant vous. Veuillez rester assis pendant que nous vous servons. Si vous avez besoin de quoi que ce soit, n'hésitez pas à demander à l'un de nos membres d'équipage de cabine. Merci.",
        "it": "Stiamo iniziando il nostro servizio di bordo. Ci teniamo a ricordarti che accettiamo pagamenti sia con carta che in contanti. Puoi trovare il nostro menu nella tasca del sedile di fronte a te. Prego vogliate rimanete seduti mentre vi serviamo. Se avete bisogno di qualcosa, non esitate a chiedere a uno dei membri dell'equipaggio di cabina. Grazie.",
        "tr": "Artık uçak içi hizmetimize başlıyoruz. Nakit ödemenin yanı sıra kartla da ödeme kabul ettiğimizi hatırlatmak isteriz. Gökyüzü menümüzü önünüzdeki koltuk cebinde bulabilirsiniz. Size hizmet ederken lütfen yerlerinizde kalın. Bir şeye ihtiyacınız olursa lütfen kabin ekibimizden birine sormaktan çekinmeyin. Teşekkür ederim.",
        "nl": "We beginnen nu met onze in-flight service. We willen u eraan herinneren dat we zowel kaartbetalingen als contante betalingen accepteren. U vindt ons skymenu in de stoelzak voor u. Blijf alstublieft zitten terwijl wij u bedienen. Als u iets nodig hebt, aarzel dan niet om het aan een van onze cabinemedewerkers te vragen. Hartelijk dank.",
        "ko": "이제 기내 서비스를 시작합니다. 저희는 현금뿐만 아니라 카드 결제도 가능하다는 것을 알려드리고 싶습니다. 스카이 메뉴는 앞 좌석 포켓에 있습니다. 서비스를 제공하는 동안 자리에 앉아 계십시오. 필요한 것이 있으시면 주저하지 마시고 객실 승무원 중 한명에게 물어보세요. 감사합니다."
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
        "it": "Signore e signori, stiamo avviando il nostro servizio di shopping a bordo. Oggi abbiamo un'offerta speciale per voi. I nostri gratta e vinci sono ora disponibili per l'acquisto. Potete vincere un volo gratuito o altri fantastici premi, come un pasto gratuito o uno sconto sul vostro prossimo volo. I passeggeri più fortunati potranno vincere anche una vacanza gratis. Buona fortuna!",
        "tr": "Hanımlar beyler, artık uçak içi alışveriş hizmetimize başlıyoruz. Bugün size özel bir teklifimiz var. Kazı kazan kartlarımız artık satın alınabilir. Ücretsiz bir uçuş veya ücretsiz yemek ya da bir sonraki uçuşunuzda indirim gibi başka harika ödüller kazanabilirsiniz. En şanslı yolcular bedava tatil bile kazanabilirler. İyi şanlar!",
        "nl": "Dames en heren, we beginnen nu met onze in-flight shopping service. Vandaag hebben we een speciale aanbieding voor u. Onze kraskaarten zijn nu te koop. Je kunt een gratis vlucht winnen of andere geweldige prijzen, zoals een gratis maaltijd of korting op je volgende vlucht. De gelukkigste passagiers kunnen zelfs een gratis vakantie winnen. Veel succes!",
        "ko": "승객 여러분, 이제 기내 쇼핑 서비스를 시작합니다. 오늘 우리는 여러분을 위한 특별한 제안이 있습니다. 우리의 스크래치 카드를 구매할 수 있습니다. 여러분은 무료 비행기 또는 무료 식사 또는 다음 비행기 할인과 같은 다른 훌륭한 상품을 얻을 수 있습니다. 가장 운이 좋은 분은 무료 휴일도 얻을 수 있습니다. 행운을 빌어요!"
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
        "it": "Signore e signori, stiamo avviando il nostro servizio di shopping a bordo. Oggi abbiamo un'offerta speciale per te. Se acquisti due profumi, avrai uno sconto del 10% sul terzo. Su questo volo consigliamo vivamente le ultime fragranze della nostra collezione. Puoi trovare il nostro catalogo acquisti nella tasca del sedile di fronte a te. Accettiamo pagamenti con carta e contanti.",
        "tr": "Hanımlar beyler, artık uçak içi alışveriş hizmetimize başlıyoruz. Bugün size özel bir teklifimiz var. İki parfüm alana üçüncüsünde %10 indirim uygulanacaktır. Bu uçuşta koleksiyonumuzdaki en yeni kokuları şiddetle tavsiye ediyoruz. Alışveriş kataloğumuzu önünüzdeki koltuk cebinde bulabilirsiniz. Nakit ödemenin yanı sıra kartla ödeme de kabul ediyoruz.",
        "nl": "Dames en heren, we beginnen nu met onze in-flight shopping service. Vandaag hebben we een speciale aanbieding voor u. Als je twee parfums koopt, krijg je 10% korting op de derde. Tijdens deze vlucht raden we u de nieuwste geuren uit onze collectie aan. Je vindt onze winkelcatalogus in de stoelzak voor je. We accepteren zowel kaartbetalingen als contante betalingen.",
        "ko": "승객 여러분, 이제 기내 쇼핑 서비스를 시작합니다. 오늘은 특별한 이벤트가 있습니다. 향수를 두개 구매하시면 세 번째 향수를 10% 할인해 드립니다. 이번 비행에서는 컬렉션의 최신 향수를 적극 추천합니다. 앞 좌석 주머니에서 쇼핑 카탈로그를 찾을 수 있습니다. 현금뿐만 아니라 카드 결제도 가능합니다."
      },
      {
        "en": "We are now starting our in-flight shopping service. Today we highly recommend our special offer - a set of three perfumes for the price of two. We also have a wide selection of other products available for purchase, like souvenirs, cosmetics, and snacks. You can find our shopping catalog in the seat pocket in front of you. We accept card payments as well as cash.",
        "pl": "Rozpoczynamy serwis pokładowy. Dziś polecamy naszą specjalną ofertę - zestaw trzech zapachów w cenie dwóch. Mamy również szeroki wybór innych produktów dostępnych do zakupu, takich jak pamiątki, kosmetyki i przekąski. Katalog produktów znajdą państwo w kieszeni siedzenia przed sobą. Akceptujemy płatności kartą oraz gotówką.",
        "de": "Wir starten jetzt unseren Bordeinkaufsservice. Heute empfehlen wir Ihnen unser Sonderangebot – ein Set mit drei Parfums zum Preis von zwei. Wir haben auch eine große Auswahl an anderen Produkten zum Kauf, wie Souvenirs, Kosmetik und Snacks. Sie finden unseren Einkaufskatalog in der Sitztasche vor Ihnen. Wir akzeptieren Kartenzahlungen sowie Bargeld.",
        "pt": "Estamos iniciando agora nosso serviço de compras a bordo. Hoje recomendamos a nossa oferta especial - um conjunto de três perfumes pelo preço de dois. Também temos uma ampla seleção de outros produtos disponíveis para compra, como lembranças, cosméticos e lanches. Você pode encontrar nosso catálogo de compras no bolso do assento à sua frente. Aceitamos pagamentos com cartão e dinheiro.",
        "es": "Ahora estamos iniciando nuestro servicio de compras a bordo. Hoy recomendamos encarecidamente nuestra oferta especial: un juego de tres perfumes por el precio de dos. También tenemos una amplia selección de otros productos disponibles para comprar, como souvenirs, cosméticos y snacks. Puede encontrar nuestro catálogo de compras en el bolsillo del asiento frente a usted. Aceptamos pagos con tarjeta y también en efectivo.",
        "fr": "Nous démarrons maintenant notre service d'achats à bord. Aujourd'hui, nous vous recommandons vivement notre offre spéciale : un coffret de trois parfums pour le prix de deux. Nous proposons également une large sélection d'autres produits disponibles à l'achat, comme des souvenirs, des cosmétiques et des collations. Vous trouverez notre catalogue d'achats dans la pochette du siège devant vous. Nous acceptons les paiements par carte ainsi que les espèces.",
        "it": "Stiamo avviando il nostro servizio di shopping a bordo. Oggi vi consigliamo vivamente la nostra offerta speciale: un set di tre profumi al prezzo di due. Abbiamo anche un'ampia selezione di altri prodotti disponibili per l'acquisto, come souvenir, cosmetici e snack. Potete consultare il nostro catalogo acquisti nella tasca del sedile di fronte a te. Accettiamo pagamenti con carta e contanti.",
        "tr": "Artık uçak içi alışveriş hizmetimize başlıyoruz. Bugün özel teklifimizi şiddetle tavsiye ediyoruz - iki fiyatına üç parfümden oluşan set. Ayrıca hediyelik eşyalar, kozmetik ürünler ve atıştırmalıklar gibi satın alınabilecek geniş bir ürün yelpazemiz de mevcuttur. Alışveriş kataloğumuzu önünüzdeki koltuk cebinde bulabilirsiniz. Nakit ödemenin yanı sıra kartla ödeme de kabul ediyoruz.",
        "nl": "We beginnen nu met onze in-flight shopping service. Vandaag bevelen we onze speciale aanbieding van harte aan - een set van drie parfums voor de prijs van twee. We hebben ook een ruime keuze aan andere producten, zoals souvenirs, cosmetica en snacks. Je vindt onze winkelcatalogus in de stoelzak voor je. We accepteren zowel kaartbetalingen als contante betalingen.",
        "ko": "우리는 이제 기내 쇼핑 서비스를 시작합니다. 오늘 우리는 특별한 제안인 투 플러스 원 향수 세트를 적극 추천합니다. 또한 기념품, 화장품, 그리고 간식과 같은 다양한 구매 가능한 다른 상품들이 준비되어 있습니다. 앞의 좌석 주머니에서 쇼핑 카탈로그를 찾을 수 있습니다. 현금뿐만 아니라 카드 결제도 가능합니다."
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
        "it": "Signore e signori, vi parla il comandante. Attualmente stiamo volando a un'altitudine di {currentAltitudeFt} piedi a una velocità di {groundSpeedKm} chilometri all'ora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Il resto del volo dovrebbe essere tranquillo e senza turbolenze. Ricordatevi di allacciare le cinture di sicurezza quando siete seduti e ogni volta che l'avviso di cintura di sicurezza è attivo. Grazie e buon volo.",
        "tr": "Bayanlar ve baylar, kaptanınız konuşuyor. Sizinle bazı bilgileri paylaşayım. Şu anda {currentAltitudeFt} fit yükseklikte saatte {groundSpeedKm} kilometre hızla seyrediyoruz. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Uçuşun geri kalanı, hafif türbülansların az da olsa yaşanması ihtimaliyle birlikte sorunsuz geçmelidir. Lütfen oturduğunuzda ve emniyet kemeri işareti yandığında emniyet kemerinizi bağlı tutmayı unutmayın. Teşekkür ederim ve uçuşun tadını çıkarın.",
        "nl": "Dames en heren, hier spreekt uw gezagvoerder. Ik wil graag wat informatie met u delen. We vliegen momenteel op een hoogte van {currentAltitudeFt} voet met een snelheid van {groundSpeedKm} kilometer per uur. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] De rest van de vlucht zou vlot moeten verlopen, met een kleine kans op lichte turbulentie. Vergeet niet uw veiligheidsgordel te dragen wanneer u zit en wanneer het stoelriemen vast teken is geactiveerd. Bedankt en geniet van uw vlucht.",
        "ko": "승객 여러분, 기장입니다. 몇 가지 정보를 여러분과 공유하겠습니다. 우리는 현재 {currentAtlightFt}피트의 고도에서 시속 {groundSpeedKm}km로 순항하고 있습니다. {destinationCityName}의 날씨는 {destinationCityWheatherHumanDescription}이며 온도는 {destinationCityTemperature}도입니다. 앞으로 난기류가 발생할 가능성이 적으며 순조로운 비행이 될 것으로 보입니다. 자리에 앉아 좌석벨트 싸인에 불이 켜질 때마다 좌석벨트 착용하는 것을 기억하시기 바랍니다. 감사합니다, 즐거운 비행 되세요."
      },
      {
        "en": "Hi, it's me again. I just wanted to share some information with you. We are currently cruising at an altitude of {currentAltitudeFt} feet at an speed of {groundSpeedKm} kilometers per hour. The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees. The rest of the flight should be smooth. In case of any questions, please don't hesitate to ask one of our cabin crew members. Thank you, and enjoy the flight.",
        "pl": "Proszę Państwa, tu kapitan. Chciałem podzielić się z wami kilkoma informacjami. Obecnie przelatujemy na wysokości {currentAltitudeFt} stóp z prędkością {groundSpeedKm} kilometrów na godzinę. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Reszta lotu powinna być spokojna. W przypadku pytań, proszę zwrócić się do jednego z członków naszej załogi. Dziękuję i miłego lotu.",
        "de": "Hallo, ich bin es wieder. Ich möchte ein paar Informationen mit Ihnen teilen. Wir fliegen derzeit in einer Höhe von {currentAltitudeFt} Fuß mit einer Geschwindigkeit von {groundSpeedKm} Kilometern pro Stunde. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Der Rest des Fluges sollte ruhig verlaufen. Bei Fragen wenden Sie sich bitte an eines unserer Kabinenpersonalmitglieder. Danke und genießen Sie den Flug.",
        "pt": "Olá, sou eu de novo. Eu gostaria de compartilhar algumas informações com vocês. No momento, estamos navegando a uma altitude de {currentAltitudeFt} pés a uma velocidade de {groundSpeedKm} quilômetros por hora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] O restante do voo deve ser tranquilo. Em caso de dúvidas, não hesite em perguntar a um dos nossos comissários. Obrigado e aproveite o vôo.",
        "es": "Damas y caballeros, este es el capitán. Quería compartir algo de información contigo. Actualmente estamos volando a una altitud de {currentAltitudeFt} pies a una velocidad de {groundSpeedKm} kilómetros por hora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] El resto del vuelo debería transcurrir sin incidentes. Si tiene alguna pregunta, consulte a uno de los miembros de nuestra tripulación. Gracias y que tengas un buen vuelo.",
        "fr": "Mesdames et messieurs, voici le capitaine. Je voulais partager quelques informations avec vous. Nous volons actuellement à une altitude de {currentAltitudeFt} pieds à une vitesse de {groundSpeedKm} kilomètres par heure. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Le reste du vol devrait se dérouler sans incident. Si vous avez des questions, veuillez les poser à l'un de nos membres d'équipage. Merci et bon vol.",
        "it": "Signore e signori, è il vostro comandante che vi parla. Attualmente stiamo volando a un'altitudine di {currentAltitudeFt} piedi a una velocità di {groundSpeedKm} chilometri all'ora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Il resto del volo dovrebbe svolgersi tranquillamente. Se avete domande, potete rivolgervi ad uno dei membri dell'equipaggio. Grazie e buon volo.",
        "tr": "Merhaba, yine ben. Sadece sizinle bazı bilgileri paylaşmak istedim. Şu anda {currentAltitudeFt} fit yükseklikte saatte {groundSpeedKm} kilometre hızla seyrediyoruz. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Uçuşun geri kalanı sorunsuz olmalı. Herhangi bir sorunuz olması durumunda lütfen kabin ekibimizden birine sormaktan çekinmeyin. Teşekkür ederim ve uçuşun tadını çıkarın.",
        "nl": "Hallo, ik ben het weer. Ik wil graag wat informatie met u delen. We vliegen momenteel op een hoogte van {currentAltitudeFt} voet met een snelheid van {groundSpeedKm} kilometer per uur. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] De rest van de vlucht zou vlot moeten verlopen. Als u vragen heeft, stel ze dan gerust aan het cabinepersoneel. Bedankt en geniet van uw vlucht.",
        "ko": "안녕하세요. 또 저예요. 여러분과 정보를 나누고 싶어서요. 저희는 현재 {currentAttributeFt}피트의 고도에서 시속 {groundSpeedKm}km로 순항하고 있습니다. {destinationCityName}의 날씨는 {destinationCityWeatherHumanDescription}이며 온도는 {destinationCityTemperature}도입니다. 남은 비행은 순조로울 것으로 보입니다. 궁금한 점이 있으시면 주저하지 말고 객실 승무원에게 물어보세요. 감사합니다. 즐거운 비행 되세요."
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
        "it": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Si prega di seguire le istruzioni dell'equipaggio di cabina mentre ci prepariamo per l'atterraggio. Grazie.",
        "tr": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] İnişe hazırlanırken lütfen kabin ekibinin talimatlarını takip edin. Teşekkür ederim.",
        "nl": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Volg alstublieft de instructies van het cabinepersoneel terwijl we ons klaarmaken voor de landing. Hartelijk dank.",
        "ko": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] 착륙을 준비하는 동안 객실 승무원의 지시에 따라 주시기 바랍니다. 감사합니다."
      },
      {
        "en": "Ladies and gentlemen, we are starting our descent. Please follow the instructions of the cabin crew as we prepare for landing. Thank you.",
        "pl": "Panie i Panowie, rozpoczynamy zniżanie. Proszę postępować zgodnie z instrukcjami członków załogi. Dziękujemy.",
        "de": "Sehr geehrte Damen und Herren, wir beginnen unseren Sinkflug. Bitte folgen Sie den Anweisungen des Kabinenpersonals, während wir uns auf die Landung vorbereiten. Danke schön.",
        "pt": "Senhoras e senhores, estamos iniciando a descida. Por favor, siga as instruções dos comissários enquanto nos preparamos para o pouso. Obrigado.",
        "es": "Damas y caballeros, estamos iniciando nuestro descenso. Siga las instrucciones de la tripulación de cabina mientras nos preparamos para el aterrizaje. Gracias.",
        "fr": "Mesdames et messieurs, nous entamons notre descente. Veuillez suivre les instructions du personnel de cabine pendant que nous préparons l'atterrissage. Merci.",
        "it": "Signore e signori, stiamo iniziando la nostra discesa. Si prega di seguire le istruzioni dell'equipaggio di cabina mentre ci prepariamo per l'atterraggio. Grazie.",
        "tr": "Bayanlar ve baylar, inişimize başladık. İnişe hazırlanırken lütfen kabin ekibinin talimatlarına uyun. Teşekkür ederim.",
        "nl": "Dames en heren, we beginnen aan onze daling. Volg alstublieft de instructies van het cabinepersoneel terwijl we ons klaarmaken voor de landing. Hartelijk dank.",
        "ko": "승객 여러분, 이제 하강을 시작합니다. 착륙을 준비하는 동안 객실 승무원의 지시에 따라 주시기 바랍니다. 감사합니다."
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
        "it": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Assicuratevi che le cinture di sicurezza siano allacciate e che lo schienale e il tavolino siano in posizione verticale. Raccoglieremo tutti gli articoli di servizio rimanenti in pochi minuti. Grazie.",
        "tr": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Lütfen emniyet kemerinizin takılı olduğundan ve koltuk arkalığınızın ve tepsi masanızın dik konumda olduğundan emin olun. Kalan hizmet öğelerini birkaç dakika içinde toplayacağız. Teşekkür ederim.",
        "nl": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Zorg ervoor dat uw stoelriem vastzit en dat de rugleuning en stoeltafel rechtop staan. We zullen de resterende service-items over een paar minuten ophalen. Alvast bedankt.",
        "ko": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] 좌석벨트를 매고 좌석 등받이와 앞좌석 선반이 똑바로 접혀있는지 확인하십시오. 몇 분안에 남은 서비스 물품을 수거하겠습니다. 감사합니다."
      },
      {
        "en": "Ladies and gentlemen, as you heard from our captain, we are starting our descent. Please make sure that your seatbelt is fastened and your seat back and tray table are in the upright position. We will collect any remaining service items in a few minutes. Thank you.",
        "pl": "Szanowni Państwo, jak mogli Państwo usłyszeć - rozpoczynamy nasze zniżanie. Prosimy o upewnienie się, że pasy są zapięte, a oparcie fotela i stolik są w pozycji pionowej. Wkrótce zbierzemy pozostałe śmieci. Dziękujemy.",
        "de": "Sehr geehrte Damen und Herren, wie Sie von unserem Kapitän gehört haben, beginnen wir mit dem Sinkflug. Bitte stellen Sie sicher, dass Ihr Sicherheitsgurt angelegt ist und sich Ihre Rückenlehne und Ihr Tabletttisch in einer aufrechten Position befinden. Wir holen alle verbleibenden Serviceartikel in wenigen Minuten ab. Danke schön.",
        "pt": "Senhoras e senhores, como dito pelo comandante, já iniciamos a nossa descida. Certifique-se de que seu cinto de segurança esteja afivelado e que o encosto do seu assento esteja na posição vertical. Feche a trave a mesinha a sua frente. Coletaremos todos os itens de serviço restantes em alguns minutos. Obrigado.",
        "es": "Damas y caballeros, como les dijo nuestro capitán, estamos iniciando nuestro descenso. Asegúrese de que su cinturón de seguridad esté abrochado y que el respaldo del asiento y la bandeja estén en posición vertical. Recogeremos los artículos de servicio restantes en unos minutos. Gracias.",
        "fr": "Mesdames et messieurs, comme vous l'a dit notre capitaine, nous commençons notre descente. Veuillez vous assurer que votre ceinture de sécurité est bouclée et que votre dossier de siège et votre tablette sont en position verticale. Nous récupérerons tous les éléments de service restants dans quelques minutes. Merci.",
        "it": "Signore e signori, come avete sentito dal nostro comandante, stiamo iniziando la discesa. Assicuratevi che le cinture di sicurezza siano allacciate e che lo schienale e il tavolino siano in posizione verticale. Raccoglieremo tutti gli articoli di servizio rimanenti in pochi minuti. Grazie.",
        "tr": "Bayanlar ve baylar, kaptanımızdan duyduğunuz gibi inişe başlıyoruz. Lütfen emniyet kemerinizin takılı olduğundan ve koltuk arkalığınızın ve tepsi masanızın dik konumda olduğundan emin olun. Kalan hizmet öğelerini birkaç dakika içinde toplayacağız. Teşekkür ederim.",
        "nl": "Dames en heren, zoals u van onze gezagvoerder hebt gehoord, beginnen we aan de daling. Zorg ervoor dat uw veiligheidsgordel vastzit en dat uw rugleuning en stoeltafel rechtop staan. We zullen over een paar minuten alle resterende service-items ophalen. Alvast bedankt.",
        "ko": "승객 여러분, 기장님 말씀대로 하강을 시작합니다. 좌석벨트를 매고 좌석 등받이와 앞좌석 선반이 똑바로 접혀있는지 확인하십시오. 몇 분 후에 남은 서비스 물품을 수거하겠습니다. 감사합니다."
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
        "it": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Assicuratevi che le cinture di sicurezza siano allacciate e che lo schienale e il tavolino siano in posizione verticale. Raccoglieremo tutti gli articoli di servizio rimanenti in pochi minuti. Grazie.",
        "tr": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Lütfen emniyet kemerinizin takılı olduğundan ve koltuk arkalığınızın ve tepsi masanızın dik konumda olduğundan emin olun. Kalan hizmet öğelerini birkaç dakika içinde toplayacağız. Teşekkür ederim.",
        "nl": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Zorg ervoor dat uw veiligheidsgordel vastzit en dat uw rugleuning en stoeltafel rechtop staan. We zullen over een paar minuten alle resterende service-items ophalen. Alvast bedankt.",
        "ko": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] 좌석벨트가 매여 있고 좌석 등받이와 앞좌석 선반이 똑바로 접혀있는지 확인하십시오. 몇 분 후에 남은 서비스 항목을 수거하겠습니다. 감사합니다."
      },
      {
        "en": "Ladies and gentlemen, we are starting our descent. Please make sure that your seatbelt is fastened and your seat back and tray table are in the upright position. We will collect any remaining service items in a few minutes. Thank you.",
        "pl": "Ladies and gentlemen, we are starting our descent. Prosimy o upewnienie się, że Państwa pasy są zapięte, a oparcie fotela i stolik są w pozycji pionowej. Wkrótce zbierzemy śmieci. Dziękujemy.",
        "de": "Sehr geehrte Damen und Herren, wir beginnen unseren Sinkflug. Bitte stellen Sie sicher, dass Ihr Sicherheitsgurt angelegt ist und sich Ihre Rückenlehne und Ihr Tabletttisch in einer aufrechten Position befinden. Wir holen alle verbleibenden Serviceartikel in wenigen Minuten ab. Danke schön.",
        "pt": "Senhoras e senhores, estamos iniciando a descida. Certifique-se de que seu cinto de segurança esteja afivelado e que o encosto do seu assento esteja na posição vertical. Feche a trave a mesinha a sua frente. Coletaremos todos os itens de serviço restantes em alguns minutos. Obrigado.",
        "es": "Damas y caballeros, estamos iniciando nuestro descenso. Asegúrese de que su cinturón de seguridad esté abrochado y que el respaldo del asiento y la bandeja estén en posición vertical. Recogeremos los artículos de servicio restantes en unos minutos. Gracias.",
        "fr": "Mesdames et messieurs, nous entamons notre descente. Veuillez vous assurer que votre ceinture de sécurité est bouclée et que votre dossier de siège et votre tablette sont en position verticale. Nous récupérerons tous les éléments de service restants dans quelques minutes. Merci.",
        "it": "Signore e signori, stiamo iniziando la nostra discesa. Assicuratevi che le cinture di sicurezza siano allacciate e che lo schienale e il tavolino siano in posizione verticale. Raccoglieremo tutti gli articoli di servizio rimanenti in pochi minuti. Grazie.",
        "tr": "Bayanlar ve baylar, inişimize başladık. Lütfen emniyet kemerinizin takılı olduğundan ve koltuk arkalığınızın ve tepsi masanızın dik konumda olduğundan emin olun. Kalan hizmet öğelerini birkaç dakika içinde toplayacağız. Teşekkür ederim.",
        "nl": "Dames en heren, we beginnen aan de daling. Zorg ervoor dat uw veiligheidsgordel vastzit en dat uw rugleuning en stoeltafel rechtop staan. We zullen over een paar minuten alle resterende service-items ophalen. Dank u wel.",
        "ko": "승객 여러분, 하강을 시작합니다. 좌석벨트를 매고 좌석 등받이와 앞좌석 선반이 똑바로 접혀있는지 확인하십시오. 몇 분 후에 남은 서비스 물품을 수거하겠습니다. 감사합니다."
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
        "it": "Assistenti di volo, prepararsi per l'atterraggio.",
        "tr": "Kabin ekibi, iniş için yerlerinizi alın.",
        "nl": "Cabinepersoneel, neem plaats voor de landing.",
        "ko": "캐빈크루, 곧 착륙할 예정이니 자리에 앉아주세요."
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
        "it": "[Ladies and gentlemen, welcome to {destinationCityName}.] Si prega di rimanere seduti con la cintura di sicurezza allacciata finché l'aereo non si è fermato completamente e il segnale della cintura di sicurezza non è stato spento. Assicuratevi di avere con te tutti i vostri effetti personali prima di lasciare l'aereo. A nome dell'equipaggio, grazie per aver volato con noi oggi. Ci auguriamo che abbiate trascorso un volo piacevole e non vediamo l'ora di darvi nuovamente il benvenuto a bordo.",
        "tr": "[Ladies and gentlemen, welcome to {destinationCityName}.] Uçak tamamen durana ve emniyet kemeri işareti kapatılana kadar lütfen emniyet kemeriniz bağlı olarak yerinizde kalın. Lütfen uçaktan ayrılmadan önce tüm kişisel eşyalarınızın yanınızda olduğundan emin olun. Mürettebat adına bugün bizimle uçtuğunuz için teşekkür etmek istiyorum. Keyifli bir uçuş geçirdiğinizi umar, sizi en kısa zamanda tekrar gemimizde ağırlamayı sabırsızlıkla bekliyoruz.",
        "nl": "[Ladies and gentlemen, welcome to {destinationCityName}.] Blijft u alstublieft zitten met uw veiligheidsgordel om totdat het toestel volledig tot stilstand is gekomen en het stoelriemen vast teken is uitgezet. Zorg ervoor dat u al uw persoonlijke bezittingen bij u heeft voordat u het toestel verlaat. Namens de bemanning wil ik u bedanken voor het vliegen met ons vandaag. We hopen dat u een prettige vlucht heeft gehad en we hopen u snel weer aan boord te mogen verwelkomen.",
        "ko": "[Ladies and gentlemen, welcome to {destinationCityName}.] 비행기가 완전히 정지하고 좌석벨트 싸인이 꺼질 때까지 좌석벨트를 매고 앉아 계십시오. 비행기를 떠나기 전에 잊으신 물건은 없는지 확인하시기 바랍니다. 승무원을 대표하여 오늘 저희와 함께 비행해 주셔서 감사드립니다. 즐거운 비행이 되셨기를 바라며 다시 만날 수 있기를 기대합니다."
      },
      {
        "en": "Welcome to {destinationCityName}. Please remain seated with your seatbelt fastened until the aircraft has come to a complete stop and the seatbelt sign has been turned off. Please make sure you have all your personal belongings with you before you leave the aircraft. On behalf of the crew, I would like to thank you for flying with us today. We hope you had a pleasant flight and we look forward to welcoming you on board again soon.",
        "pl": "[Welcome to {destinationCityName}.] Prosimy o pozostanie na miejscach z zapiętymi pasami bezpieczeństwa, aż samolot całkowicie się zatrzyma i sygnał zapięcia pasów zostanie wyłączony. Upewnijcie się, że macie ze sobą wszystkie swoje rzeczy osobiste przed opuszczeniem samolotu. Dziękuję za lot z nami w dniu dzisiejszym. Mamy nadzieję, że mieli państwo przyjemny lot i mamy nadzieję gościć państwa ponownie w najbliższej przyszłości.",
        "de": "[Welcome to {destinationCityName}.] Bitte bleiben Sie mit angelegtem Sicherheitsgurt sitzen, bis das Flugzeug vollständig zum Stillstand gekommen ist und das Anschnallzeichen ausgeschaltet ist. Bitte stellen Sie sicher, dass Sie alle Ihre persönlichen Gegenstände bei sich haben, bevor Sie das Flugzeug verlassen. Im Namen der Crew möchte ich Ihnen dafür danken, dass Sie heute mit uns geflogen sind. Wir hoffen, Sie hatten einen angenehmen Flug und freuen uns, Sie bald wieder an Bord begrüßen zu dürfen.",
        "pt": "[Welcome to {destinationCityName}.] Por favor, permaneça sentado com o cinto de segurança afivelado até que a aeronave pare completamente e o aviso de atar os cintos seja apagado. Certifique-se de ter todos os seus pertences pessoais com você antes de sair da aeronave. Em nome da tripulação, gostaria de agradecer por voar conosco hoje. Esperamos que você tenha tido um voo agradável e esperamos recebê-lo novamente a bordo em breve.",
        "es": "[Welcome to {destinationCityName}.] Permanezca sentado con el cinturón de seguridad abrochado hasta que el avión se detenga por completo y se apague la señal de cinturón de seguridad. Asegúrese de tener todas sus pertenencias personales consigo antes de abandonar el avión. En nombre de la tripulación, me gustaría agradecerle por volar con nosotros hoy. Esperamos que haya tenido un vuelo agradable y esperamos darle la bienvenida a bordo nuevamente pronto.",
        "fr": "[Welcome to {destinationCityName}.] Veuillez rester assis avec votre ceinture de sécurité attachée jusqu'à ce que l'avion soit complètement arrêté et que le signal de ceinture de sécurité soit éteint. Veuillez vous assurer d'avoir tous vos effets personnels avec vous avant de quitter l'avion. Au nom de l'équipage, je tiens à vous remercier d'avoir volé avec nous aujourd'hui. Nous espérons que votre vol a été agréable et nous espérons vous accueillir à nouveau bientôt à bord.",
        "it": "[Welcome to {destinationCityName}.] Vi invitiamo di rimanere seduti con la cintura di sicurezza allacciata finché l'aereo non si è fermato completamente e il segnale della cintura di sicurezza non è stato spento. Assicuratevi di avere con te tutti i vostri effetti personali prima di lasciare l'aereo. A nome dell'equipaggio, grazie per aver volato con noi oggi. Ci auguriamo che abbiate trascorso un volo piacevole e non vediamo l'ora di darvi nuovamente il benvenuto a bordo.",
        "tr": "[Welcome to {destinationCityName}.] Uçak tamamen durana ve emniyet kemeri işareti kapatılana kadar lütfen emniyet kemeriniz bağlı olarak yerinizde kalın. Lütfen uçaktan ayrılmadan önce tüm kişisel eşyalarınızın yanınızda olduğundan emin olun. Mürettebat adına bugün bizimle uçtuğunuz için teşekkür etmek istiyorum. Keyifli bir uçuş geçirdiğinizi umar, sizi en kısa zamanda tekrar gemimizde ağırlamayı sabırsızlıkla bekliyoruz.",
        "nl": "[Welcome to {destinationCityName}.] Blijft u alstublieft zitten met uw veiligheidsgordel om totdat het vliegtuig volledig tot stilstand is gekomen en het stoelriemen vast teken is uitgeschakeld. Zorg ervoor dat u al uw persoonlijke bezittingen bij u heeft voordat u het toestel verlaat. Namens de bemanning wil ik u bedanken voor het vliegen met ons vandaag. We hopen dat u een prettige vlucht heeft gehad en verwelkomen u graag binnenkort weer aan boord.",
        "ko": "[Welcome to {destinationCityName}.] 비행기가 완전히 정지하고 좌석벨트 싸인이 꺼질 때까지 좌석벨트를 매고 앉아 계십시오. 항공기를 떠나기 전에 잊으신 물건은 없는지 확인하시기 바랍니다. 승무원을 대표하여 오늘 저희와 함께 비행해 주셔서 감사합니다. 즐거운 비행이 되었기를 바라며 곧 기내에서 다시 만날 수 있기를 기대합니다."
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
        "it": "Le porte verranno aperte a breve. Ricordatevi di portare con voi tutti i vostri effetti personali. Assicuratevi di avere tutto ciò che avete portato a bordo. Grazie.",
        "tr": "Kapılar kısa süre içerisinde açılacaktır. Lütfen tüm kişisel eşyalarınızı yanınıza almayı unutmayın. Gemiye getirdiğiniz her şeyin yanınızda olduğundan emin olun. Teşekkür ederim.",
        "nl": "De deuren worden binnenkort geopend. Vergeet niet al uw persoonlijke bezittingen mee te nemen. Zorgt u ervoor dat u alles wat u heeft meegenomen aan boord meeneemt. Bedankt voor uw medewerking.",
        "ko": "곧 문이 열립니다. 개인 소지품은 모두 챙기시는 것을 잊지마세요. 잊으신 물건이 없는지 다시 한번 확인바랍니다. 감사합니다."
      },
      {
        "en": "We have arrived at the gate. Please remember to take all your personal belongings with you. Have a great day.",
        "pl": "Dotarliśmy do bramki. Prosimy pamiętać, aby zabrać ze sobą wszystkie swoje rzeczy osobiste. Miłego dnia.",
        "de": "Wir sind am Gate angekommen. Bitte denken Sie daran, alle Ihre persönlichen Gegenstände mitzunehmen. Ich wünsche ihnen einen wunderbaren Tag.",
        "pt": "Chegamos ao portão. Lembrem-se de levar todos os seus pertences pessoais com você, tenham todos um bom dia.",
        "es": "Hemos llegado a la puerta. Recuerde llevar consigo todas sus pertenencias personales. Qué tengas un lindo día.",
        "fr": "Nous sommes arrivés à la porte. N'oubliez pas d'emporter toutes vos affaires personnelles avec vous. Passe une bonne journée.",
        "it": "Siamo arrivati al gate. Ricordatevi di portare con voi tutti i vostri effetti personali. Vi auguriamo una buona giornata.",
        "tr": "Terminal kapısına geldik. Lütfen tüm kişisel eşyalarınızı yanınıza almayı unutmayın. İyi günler.",
        "nl": "We zijn aangekomen bij de gate. Vergeet niet al uw persoonlijke bezittingen mee te nemen. We wensen u een fijne dag.",
        "ko": "게이트에 도착했습니다. 개인 소지품은 모두 챙겨가시기 바랍니다. 좋은 하루 되세요."
      }
    ]
  }
]

export default texts;
