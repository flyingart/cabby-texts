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
        "pt_br": "Senhoras e senhores, nós esperamos uma leve turbulência a frente. Por favor, retornem aos seus assentos e afivelem o cinto de segurança.",
        "es": "Señorías, se esperan ligeras turbulencias en el futuro. Por favor regresen a sus asientos y abróchense los cinturones.",
        "fr": "Mesdames et messieurs, nous nous attendons à de légères turbulences. Veuillez retourner à vos places et attacher vos ceintures de sécurité.",
        "it": "Signore e signori, ci aspettiamo qualche leggera turbolenza in vista. Vi preghiamo di ritornare ai vostri posti e di allacciare le cinture di sicurezza.",
        "tr": "Bayanlar ve baylar, önümüzde hafif bir türbülans bekliyoruz. Lütfen koltuklarınıza dönün ve emniyet kemerlerinizi bağlayın.",
        "nl": "Dames en heren, er is lichte turbulentie op komst. Neemt u alstublieft plaats in uw stoel met uw stoelriem vast.",
        "ko": "승객 여러분, 잠시 후 약간의 난기류가 있을 것으로 예상됩니다. 자리로 돌아가 좌석벨트를 착용해 주시기 바랍니다.",
        "pt_pt": "Caros passageiros, esperamos uma ligeira turbulência à frente. Por favor, retornem aos vossos lugares e apertem o cinto de segurança.",
        "no": "Mine damer og herrer, vi forventer litt lett turbulens foran oss. Vennligst returner tilbake til ditt sete og fest sikrrerhetsbeltet.",
        "th": "ท่านผู้โดยสารทุกท่าน เนื่องจากสภาพอากาศแปรปรวน ขอความกรุณาทุกท่านนั่งประจำที่ และรัดเข็มขัดที่นั่งของท่านให้กระชับ",
        "zh": "女士们，先生们，前方预计会有一些轻微的颠簸。请您回到座位并系好安全带。"
      },
      {
        "en": "Ladies and gentlemen, we've just received information about some light turbulence ahead. Please return to your seats and remain seated until the seatbelt sign is turned off.",
        "pl": "Szanowni państwo, właśnie otrzymaliśmy informację o lekkich turbulencjach przed nami. Prosimy o powrót na miejsca i pozostanie na nich do momentu wyłączenia sygnału zapięcia pasów.",
        "de": "Sehr geehrte Damen und Herren, wir haben gerade Informationen über leichte Turbulenzen erhalten. Bitte kehren Sie zu Ihren Plätzen zurück und bleiben Sie sitzen, bis die Anschnallzeichen erloschen sind.",
        "pt_br": "Senhoras e senhores, acabamos de receber informações sobre uma leve turbulência à frente. Por favor, retornem aos seus assentos e permaneçam sentados até que o aviso de atar os cintos seja desligado.",
        "es": "Damas y caballeros, acabamos de recibir información sobre una ligera turbulencia que se avecina. Por favor regrese a sus asientos y permanezca sentado hasta que se apague la señal del cinturón de seguridad.",
        "fr": "Mesdames et messieurs, nous venons de recevoir des informations concernant de légères turbulences à venir. Veuillez retourner à vos sièges et rester assis jusqu'à ce que le signal de ceinture de sécurité s'éteigne.",
        "it": "Signore e signori, abbiamo appena ricevuto informazioni su alcune leggere turbolenze in vista. Si prega di tornare ai propri posti e rimanere seduti fino allo spegnimento del segnale delle cinture di sicurezza.",
        "tr": "Bayanlar ve baylar, az önce önümüzdeki hafif türbülansa dair bilgi aldık. Lütfen koltuklarınıza dönün ve emniyet kemeri işareti sönene kadar yerlerinizde kalın.",
        "nl": "Dames en heren, we zijn zojuist geïnformeerd over lichte turbulentie op komst. Neemt u alstublieft plaats in uw stoel en blijft u zitten totdat het stoelriemen vast teken is uitgeschakeld.",
        "ko": "승객 여러분, 방금 앞에 가벼운 난기류가 있다는 정보를 받았습니다. 좌석벨트 싸인이 꺼질 때까지 자리로 돌아가 자리를 지켜주세요.",
        "pt_pt": "Senhoras e senhores, acabamos de receber informações sobre uma ligeira turbulência à frente. Por favor, regressem aos vossos lugares e permaneçam sentados até que o aviso de apertar os cintos seja desligado.",
        "no": "Mine damer og herrer, vi har nettopp mottatt informasjon om litt lett turbulens foran oss. Vennligst returner tilbake til ditt sete og bli sittende til skiltet med sikkerhetsbeltet er slått av.",
        "th": "ท่านผู้โดยสารทุกท่าน เรากำลังจะบินผ่านเขตสภาพอากาศแปรปรวนเล็กน้อยข้างหน้า ขอความกรุณาทุกท่านนั่งประจำที่ จนกว่าสัญญาณเข็มขัดที่นั่งจะดับลง",
        "zh": "女士们，先生们，我们刚刚收到前方有轻微颠簸的信息。请您回到座位，并保持就座，直到安全带标志熄灭。"
      },
      {
        "en": "Hello, this is your captain speaking. We had to turn on the seatbelt sign due to expected light turbulence. Please return to your seats and fasten your seat belts.",
        "pl": "Szanowni państwo, tu kapitan. Musieliśmy włączyć sygnał zapięcia pasów z powodu przewidywanych lekkich turbulencji. Prosimy o powrót na miejsca i zapięcie pasów.",
        "de": "Hallo, hier spricht Ihr Kapitän. Wir mussten das Anschnallzeichen aufgrund erwarteter leichter Turbulenzen einschalten. Bitte kehren Sie zu Ihren Plätzen zurück und schnallen Sie sich an.",
        "pt_br": "Olá, aqui é o seu comandante. Tivemos que ligar o aviso de atar os cintos devido a uma ligeira turbulência esperada. Por favor",
        "es": "Hola, aquí habla su capitán. Tuvimos que encender la señal de cinturón de seguridad debido a la ligera turbulencia esperada. Por favor regrese a sus asientos y abróchense los cinturones.",
        "fr": "Bonjour, ici votre commandant. Nous avons dû allumer le signal de ceinture de sécurité en raison de légères turbulences attendues. Veuillez retourner à vos sièges et attacher vos ceintures.",
        "it": "Ciao, qui parla il vostro capitano. Abbiamo dovuto accendere il segnale delle cinture di sicurezza a causa di una leggera turbolenza prevista. Si prega di tornare ai propri posti e allacciare le cinture di sicurezza.",
        "tr": "Merhaba, burada kaptanınız konuşuyor. Beklenen hafif türbülans nedeniyle emniyet kemeri işaretini açmak zorunda kaldık. Lütfen koltuklarınıza dönün ve emniyet kemerlerinizi bağlayın.",
        "nl": "Hallo, dit is uw gezagvoerder. We moesten het stoelriemen vast teken aanzetten vanwege verwachte lichte turbulentie. Gaat u alstublieft terug naar uw stoel en maak uw stoelriem vast.",
        "ko": "여러분, 기장입니다. 예상되는 가벼운 난기류로 인해 좌석벨트 싸인을 켜야 했습니다. 자리로 돌아가 좌석벨트를 착용해 주세요.",
        "pt_pt": "Olá, aqui é o seu comandante. Tivemos de ligar o sinal de apertar os cintos devido à ligeira turbulência esperada. Por favor, regressem aos vossos lugares e apertem os cintos de segurança.",
        "no": "Hallo, dette er kapteinen som snakker. Vi måtte slå på sikkerhetsbeltet på grunn av forventet lett turbulens. Vennligst returner tilbake til ditt sete og fest sikkerhetsbeltet.",
        "th": "สวัสดีครับ นี่คือกัปตันของคุณ ที่พูดคุย  เราต้องเปิดสัญญาณรัดเข็มขัดเนื่องจากมีการคาดการณ์ว่าจะมีการแรงอากาศแปรปรวน  ขอความกรุณาทุกท่านนั่งประจำที่ และรัดเข็มขัดที่นั่งของท่านให้กระชับ",
        "zh": "您好，这里是您的机长。由于预计会有轻微颠簸，我们不得不打开安全带标志。请您回到座位并系好安全带。"
      },
      {
        "en": "Ladies and gentlemen, we’re expecting some changes in weather conditions ahead. As a precaution, the seatbelt sign has been turned on. Please remain seated and keep your seatbelt fastened. Thank you for your cooperation.",
        "pl": "Szanowni państwo, spodziewamy się zmian w warunkach pogodowych przed nami. W związku z tym włączono sygnał zapięcia pasów. Prosimy o pozostanie na miejscach i zapięcie pasów. Dziękujemy za współpracę.",
        "de": "Meine Damen und Herren, wir erwarten einige Änderungen in den Wetterbedingungen. Vorsichtshalber wurde das Anschnallzeichen eingeschaltet. Bitte bleiben Sie sitzen und halten Sie Ihren Sicherheitsgurt geschlossen. Vielen Dank für Ihre Kooperation.",
        "pt_br": "Senhoras e senhores, estamos esperando algumas mudanças nas condições climáticas à frente. Como precaução, o aviso de atar os cintos foi ligado. Por favor, permaneçam sentados e mantenham seus cintos de segurança afivelados. Obrigado pela cooperação.",
        "es": "Damas y caballeros, esperamos algunos cambios en las condiciones climáticas por delante. Como precaución, se ha encendido la señal de cinturón de seguridad. Por favor permanezcan sentados y mantengan abrochados sus cinturones de seguridad. Gracias por su cooperación.",
        "fr": "Mesdames et messieurs, nous prévoyons quelques changements dans les conditions météorologiques à venir. Par précaution, le signal de ceinture de sécurité a été allumé. Veuillez rester assis et garder votre ceinture de sécurité attachée. Merci pour votre coopération.",
        "it": "Signore e signori, ci aspettiamo alcuni cambiamenti nelle condizioni meteorologiche in vista. Come precauzione, il segnale delle cinture di sicurezza è stato acceso. Per favore, rimanete seduti e tenete le cinture di sicurezza allacciate. Grazie per la vostra collaborazione.",
        "tr": "Bayanlar ve baylar, önümüzde hava koşullarında bazı değişiklikler bekliyoruz. Tedbir olarak emniyet kemeri işareti açıldı. Lütfen yerlerinizde oturun ve emniyet kemerinizi bağlı tutun. İşbirliğiniz için teşekkür ederiz.",
        "nl": "Dames en heren, we verwachten enkele veranderingen in de weersomstandigheden voor ons. Uit voorzorg is het stoelriemen vast teken aangezet. Blijft u alstublieft zitten en houdt u uw stoelriem vast. Dank u voor uw medewerking.",
        "ko": "여러분, 앞으로 날씨 상황에 변화가 예상됩니다. 예방 조치로 좌석벨트 싸인이 켜졌습니다. 자리에 앉아 좌석벨트를 착용해 주세요. 협조해 주셔서 감사합니다.",
        "pt_pt": "Senhoras e senhores, estamos à espera de algumas mudanças nas condições climáticas à frente. Como precaução, o sinal de apertar os cintos foi ligado. Por favor, permaneçam sentados e mantenham os cintos de segurança apertados. Obrigado pela cooperação.",
        "no": "Mine damer og herrer, vi forventer noen endringer i værforholdene foran oss. Som en forholdsregel har vi slått på sikkerhetsbeltet. Vennligst bli sittende og hold sikkerhetsbeltet festet. Takk for samarbeidet.",
        "th": "ท่านผู้โดยสารทุกท่าน เรากำลังคาดการณ์ว่าจะมีการเปลี่ยนแปลงในสภาพอากาศข้างหน้า  ในการป้องกัน  เราได้เปิดสัญญาณรัดเข็มขัด  ขอความกรุณาทุกท่านนั่งประจำที่ และรัดเข็มขัดท���่นั่งของท่านให้กระชับ ขอบคุณที่ร่วมมือ",
        "zh": "女士们，先生们，我们预计前方的天气条件会有一些变化。作为预防措施，我们已经打开了安全带标志。请您保持就座，并系好安全带。感谢您的合作。"
      },
      {
        "en": "Hello, this is your captain speaking. We’re encountering some unstable airflow at our cruising altitude, so we’ve turned on the seatbelt sign. For your safety, please remain seated with your seatbelts fastened until further notice.",
        "pl": "Witajcie, tu kapitan. Napotkaliśmy niestabilny przepływ powietrza na naszej wysokości przelotowej, dlatego włączyliśmy sygnał zapięcia pasów. Dla waszego bezpieczeństwa prosimy o pozostanie na miejscach z zapiętymi pasami.",
        "de": "Hallo, hier spricht Ihr Kapitän. Wir haben auf unserer Reisehöhe einen instabilen Luftstrom angetroffen, daher haben wir das Anschnallzeichen eingeschaltet. Bitte bleiben Sie aus Sicherheitsgründen sitzen und halten Sie Ihre Sicherheitsgurte geschlossen, bis auf Weiteres.",
        "pt_br": "Olá, aqui é o seu comandante. Estamos encontrando um fluxo de ar instável em nossa altitude de cruzeiro, então ligamos o aviso de atar os cintos. Por sua segurança, permaneçam sentados com os cintos de segurança afivelados até novo aviso.",
        "es": "Hola, aquí habla su capitán. Nos estamos encontrando con un flujo de aire inestable en nuestra altitud de crucero, por lo que hemos encendido la señal de cinturón de seguridad. Por su seguridad, por favor permanezcan sentados con los cinturones abrochados hasta nuevo aviso.",
        "fr": "Bonjour, ici votre commandant. Nous rencontrons un flux d'air instable à notre altitude de croisière, c'est pourquoi nous avons allumé le signal de ceinture de sécurité. Pour votre sécurité, veuillez rester assis et garder vos ceintures attachées jusqu'à nouvel ordre.",
        "it": "Ciao, qui parla il vostro capitano. Stiamo incontrando un flusso d'aria instabile alla nostra altitudine di crociera, quindi abbiamo acceso il segnale delle cinture di sicurezza. Per la vostra sicurezza, rimanete seduti con le cinture di sicurezza allacciate fino a nuovo avviso.",
        "tr": "Merhaba, burada kaptanınız konuşuyor. Seyir irtifamızda karşılaştığımız dengesiz hava akımı nedeniyle emniyet kemeri işaretini açtık. Güvenliğiniz için lütfen yerlerinizde oturun ve emniyet kemerlerinizi bağlı tutun.",
        "nl": "Hallo, dit is uw gezagvoerder. We ondervinden een onstabiele luchtstroom op onze kruishoogte, dus hebben we het stoelriemen vast teken aangezet. Voor uw veiligheid, blijft u alstublieft zitten met uw stoelriem vast tot nader order.",
        "ko": "여러분, 기장입니다. 우리의 크루즈 고도에서 불안정한 공기 흐름을 만나고 있어 좌석벨트 싸인을 켰습니다. 안전을 위해 추가 안내가 있을 때까지 좌석에 앉아 좌석벨트를 착용해 주세요.",
        "pt_pt": "Olá, aqui é o seu comandante. Estamos a encontrar um fluxo de ar instável na nossa altitude de cruzeiro, por isso ligámos o sinal de apertar os cintos. Para sua segurança, permaneçam sentados com os cintos de segurança apertados até novo aviso.",
        "no": "Hallo, dette er kapteinen som snakker. Vi opplever en ustabil luftstrøm på vår cruisehøyde, så vi har slått på sikkerhetsbeltet. For din sikkerhet, vennligst bli sittende med sikkerhetsbeltet festet til ny beskjed gis.",
        "th": "สวัสดีครับ นี่คือกัปตันของคุณ ที่พูดคุย เรากำลังพบกับการไหลลมที่ไม่เสถียรที่ระดับความสูงของเรา  ดังนั้นเราได้เปิดสัญญาณรัดเข็มขัด  สำหรับความปลอดภัยของท่าน  ขอความกรุณาทุกท่านนั่งประจำที่ และรัดเข็มขัดที่นั่งของท่านให้กระชับ จนกว่าจะมีข้อความเพิ่มเติม",
        "zh": "您好，这里是您的机长。我们在巡航高度遇到了一些不稳定的气流，所以我们打开了安全带标志。为了您的安全，请保持就座，并系好安全带，直到进一步通知。"
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
        "pt_br": "Senhoras e senhores, o comandante acaba de nos informar que passaremos por uma turbulência leve à frente. Permaneçam sentados até que o aviso de atar os cintos seja apagado. Neste momento não está permitido o uso dos lavatórios.",
        "es": "Damas y caballeros, nuestro capitán nos acaba de informar que esperamos ligeras turbulencias por delante. Por favor regrese a sus asientos y permanezca sentado hasta que se apague la señal del cinturón de seguridad. No se permite el uso de los baños en este momento.",
        "fr": "Mesdames et messieurs, notre commandant de bord vient de nous informer que nous allons rencontrer de légères turbulences. Nous vous prions de bien vouloir regagner vos sièges et de rester assis jusqu’à ce que le signal lumineux de ceinture soit éteint. L'utilisation des toilettes n'est pas autorisée pour le moment.",
        "it": "Signore e signori, il nostro capitano ci ha appena informato che ci aspettiamo qualche leggera turbolenza in vista. Si prega di tornare ai propri posti e rimanere seduti fino allo spegnimento del segnale delle cinture di sicurezza. Al momento non è consentito l'uso dei servizi igienici.",
        "tr": "Bayanlar ve baylar, kaptanımız az önce önümüzde hafif bir türbülans beklediğimizi bildirdi. Lütfen koltuklarınıza dönün ve emniyet kemeri işareti sönene kadar yerlerinizde kalın. Şu anda tuvaletlerin kullanılmasına izin verilmiyor.",
        "nl": "Dames en heren, de gezagvoerder heeft ons zojuist geïnformeerd dat we lichte turbulentie verwachten. Gaat u alstublieft terug naar uw stoel en blijft u zitten totdat het stoelriemen vast teken is uitgeschakeld. Het gebruik van de toiletten is momenteel niet toegestaan.",
        "ko": "승객 여러분, 기장님께서 곧 가벼운 난기류가 예상된다고 하셨습니다. 자리로 돌아가 좌석벨트 싸인이 꺼질 때까지 자리에 앉아계시기 바랍니다. 지금은 화장실을 사용할 수 없습니다.",
        "pt_pt": "Senhoras e senhores, o nosso comandante acaba de nos informar que estamos a esperar uma ligeira turbulência à frente. Por favor, regressem aos vossos lugares e permaneçam sentados até que o sinal de apertar os cintos seja desligado. O uso das casas de banho não é permitido neste momento.",
        "no": "Mine damer og herrer, kapteinen har nettopp informert oss om at vi forventer litt lett turbulens foran oss. Vennligst returner tilbake til ditt sete og bli sittende til skiltet med sikkerhetsbeltet er slått av. Bruk av toalettene er ikke tillatt på dette tidspunktet.",
        "th": "ท่านผู้โดยสารทุกท่าน ขณะนี้กัปตันกำลังจะบินผ่านเขตสภาพอากาศแปรปรวน   ขอความกรุณาทุกท่านนั่งประจำที่ จนกว่าสัญญาณรัดเข็มขัดที่นั่งจะดับลง และกรุณางดใช้ห้องน้ำในช่วงเวลานี้",
        "zh": "女士们，先生们，机长刚刚通知我们前方预计会有一些轻微的颠簸。请您回到座位并保持就座，直到安全带标志熄灭。目前暂时不允许使用洗手间。"
      },
      {
        "en": "Our captain has just informed us that we are expecting some light turbulence ahead. Please fasten your seatbelts.",
        "pl": "Nasz kapitan właśnie poinformował nas, że spodziewamy się lekkich turbulencji. Prosimy o zapięcie pasów.",
        "de": "Unser Kapitän hat uns gerade mitgeteilt, dass wir mit leichten Turbulenzen rechnen. Bitte schnallen sie sich an.",
        "pt_br": "Senhoras e senhores, o comandante acaba de nos informar que passaremos por uma turbulência leve à frente. Por favor, afivelem seus cintos de segurança.",
        "es": "Nuestro capitán nos acaba de informar que se esperan ligeras turbulencias por delante. Por favor, abrochen sus cinturones.",
        "fr": "Notre commandant de bord nous informe que nous allons rencontrer de légères turbulences. Nous vous prions de bien vouloir attacher vos ceintures.",
        "it": "Il nostro capitano ci ha appena informato che ci aspettiamo una leggera turbolenza in vista. Per favore, allacciate le cinture di sicurezza.",
        "tr": "Kaptanımız az önce önümüzde hafif bir türbülans beklediğimizi bildirdi. Lütfen emniyet kemerlerinizi bağlayın.",
        "nl": "Dames en heren, de gezagvoerder heeft ons zojuist geïnformeerd dat er lichte turbulentie op komst is. Maakt u alstublieft uw stoelriem vast.",
        "ko": "기장님께서 조금 전에 가벼운 난기류가 예상된다고 하셨습니다. 좌석벨트를 착용해 주시기 바랍니다.",
        "pt_pt": "O nosso comandante acaba de nos informar que estamos a prever uma ligeira turbulência à frente. Por favor, apertem os cintos de segurança.",
        "no": "Kapteinen har nettopp informert oss om at vi forventer litt lett turbulens foran oss. Vennligst fest sikkerhetsbeltene deres.",
        "th": "ขณะนี้กัปตันกำลังจะบินผ่านเขตสภาพอากาศแปรปรวน   ขอความกรุณาทุกท่านรัดเข็มขัดนิรภัยของท่าน",
        "zh": "机长刚刚通知我们，前方预计会有一些轻微的颠簸。请您系好安全带。"
      },
      {
        "en": "As you heard from our captain, we are expecting some light turbulence ahead. Please return to your seats and fasten your seat belts. Use of the lavatories is not allowed at this time.",
        "pl": "Jak mogli państwo usłyszeć od naszego kapitana, spodziewamy się lekkich turbulencji. Prosimy o powrót na miejsca i zapięcie pasów. Używanie toalet nie jest dozwolone w tym czasie.",
        "de": "Wie Sie von unserem Kapitän erfahren haben, rechnen wir mit leichten Turbulenzen. Bitte kehren Sie zu Ihren Plätzen zurück und schnallen Sie sich an. Die Nutzung der Toiletten ist derzeit nicht gestattet.",
        "pt_br": "Reforçamos que entraremos em uma área de turbulência à frente. Por favor, retornem aos seus assentos e afivelem os seus cintos. Neste momento não está permitido o uso dos lavatórios.",
        "es": "Como le dijo nuestro capitán, esperamos algunas turbulencias ligeras más adelante. Por favor regresen a sus asientos y abróchense los cinturones. No se permite el uso de los baños en este momento.",
        "fr": "Comme vous l'a annoncé notre commandant de bord, nous allons rencontrer de légères turbulences. Nous vous prions de regagner vos sièges et d'attacher vos ceintures. L'utilisation des toilettes est interdite pour le moment. ",
        "it": "Come avete sentito dal nostro capitano, ci aspettiamo una leggera turbolenza in vista. Vi preghiamo di ritornare ai vostri posti e di allacciare le cinture di sicurezza. Al momento non è consentito l'uso dei servizi igienici.",
        "tr": "Kaptanımızdan duyduğunuza göre önümüzde hafif bir türbülans bekliyoruz. Lütfen koltuklarınıza dönün ve emniyet kemerlerinizi bağlayın. Şu anda tuvaletlerin kullanılmasına izin verilmiyor.",
        "nl": "Zoals u van de gezagvoerder heeft gehoord, verwachten wij lichte turbulentie op komst. Gaat u alstublieft terug naar uw stoel en blijft u zitten totdat het stoelriemen vast teken is uitgeschakeld. Het gebruik van de toiletten is momenteel niet toegestaan.",
        "ko": "기장님 말씀대로 앞으로 약간의 난기류가 예상됩니다. 자리로 돌아가 좌석벨트를 착용해 주시기 바랍니다. 지금은 화장실을 사용할 수 없습니다.",
        "pt_pt": "O comandante acaba de nos informar que estamos a esperar uma ligeira turbulência à frente. Por favor, apertem os cintos de segurança.",
        "no": "Som dere hørte fra kapteinen, forventer vi litt lett turbulens foran oss. Vennligst returner tilbake til ditt sete og fest sikkerhetsbeltet. Bruk av toalettene er ikke tillatt på dette tidspunktet.",
        "th": "ขณะนี้กัปตันกำลังจะบินผ่านเขตสภาพอากาศแปรปรวน ขอความกรุณาทุกท่านนั่งประจำที่ จนกว่าสัญญาณรัดเข็มขัดที่นั่งจะดับลง และกรุณางดใช้ห้องน้ำในช่วงเวลานี้",
        "zh": "正如机长所说，前方预计会有一些轻微的颠簸。请您回到座位并系好安全带。目前暂时不允许使用洗手间。"
      },
      {
        "en": "Ladies and gentlemen, the seatbelt sign is now on. We ask that you remain seated as much as possible. For safety reasons, our cabin crew will also minimize their movement until conditions stabilize.",
        "pl": "Szanowni państwo, sygnał zapięcia pasów jest włączony. Prosimy o pozostanie na miejscach. Ze względów bezpieczeństwa, personel pokładowy również ograniczy swoje ruchy, dopóki warunki nie ustabilizują się.",
        "de": "Meine Damen und Herren, das Anschnallzeichen ist jetzt an. Wir bitten Sie, so viel wie möglich sitzen zu bleiben. Aus Sicherheitsgründen wird auch unser Kabinenpersonal ihre Bewegungen minimieren, bis sich die Bedingungen stabilisieren.",
        "pt_br": "Senhoras e senhores, o aviso de atar os cintos está ligado. Pedimos que permaneçam sentados o máximo possível. Por motivos de segurança, nossa tripulação de cabine também minimizará seus movimentos até que as condições se estabilizem.",
        "es": "Damas y caballeros, la señal de cinturón de seguridad está encendida. Les pedimos que permanezcan sentados tanto como sea posible. Por razones de seguridad, nuestro personal de cabina también minimizará sus movimientos hasta que las condiciones se estabilicen.",
        "fr": "Mesdames et messieurs, le signal de ceinture de sécurité est allumé. Nous vous demandons de rester assis autant que possible. Pour des raisons de sécurité, notre personnel de cabine minimisera également ses mouvements jusqu'à ce que les conditions se stabilisent.",
        "it": "Signore e signori, il segnale delle cinture di sicurezza è acceso. Vi preghiamo di rimanere seduti il più possibile. Per motivi di sicurezza, il nostro personale di cabina ridurrà al minimo anche i propri movimenti fino a quando le condizioni si stabilizzeranno.",
        "tr": "Bayanlar ve baylar, emniyet kemeri işareti şu anda açık. Mümkün olduğunca oturmanızı rica ederiz. Güvenlik nedenleriyle kabin ekibimiz de koşullar stabilize olana kadar hareketlerini en aza indirecektir.",
        "nl": "Dames en heren, het stoelriemen vast teken is nu aan. We vragen u om zoveel mogelijk te blijven zitten. Om veiligheidsredenen zal ons cabinepersoneel ook hun bewegingen minimaliseren totdat de omstandigheden stabiliseren.",
        "ko": "여러분, 좌석벨트 싸인이 켜졌습니다. 최대한 앉아 계시기 바랍니다. 안전상의 이유로 우리의 승무원도 상황이 안정될 때까지 움직임을 최소화할 것입니다.",
        "pt_pt": "Senhoras e senhores, o sinal de apertar os cintos está ligado. Pedimos que permaneçam sentados o máximo possível. Por motivos de segurança, a nossa tripulação de cabine também minimizará os seus movimentos até que as condições se estabilizem.",
        "no": "Mine damer og herrer, skiltet med sikkerhetsbeltet er nå på. Vi ber om at dere forblir sittende så mye som mulig. Av sikkerhetsmessige årsaker vil også vårt kabinpersonell minimere bevegelsene sine til forholdene stabiliserer seg.",
        "th": "ท่านผู้โดยสารทุกท่าน สัญญาณรัดเข็มขัดที่นั่งเปิดอยู่  ขอความกรุณาทุกท่านนั่งประจำที่  ในเวลานี้  ขอให้พนักงานบนเครื่องจำกัดการเคลื่อนไหวของตนเองให้น้อยลงจนกว่าส ภาพจะเสถียร",
        "zh": "女士们，先生们，安全带标志现在已经打开。我们要求您尽量保持就座。出于安全考虑，我们的机组人员也会尽量减少移动，直到条件稳定。"
      },
      {
        "en": "Ladies and gentlemen, for everyone’s safety, we ask that you avoid moving around the cabin while the seatbelt sign is on. If you’re not seated, please return to your seat immediately.",
        "pl": "Szanowni państwo, dla bezpieczeństwa wszystkich, prosimy o unikanie poruszania się po kabinie, gdy sygnał zapięcia pasów jest włączony. Jeśli nie siedzą państwo, prosimy o natychmiastowy powrót na miejsce.",
        "de": "Meine Damen und Herren, zur Sicherheit aller bitten wir Sie, sich während des eingeschalteten Anschnallzeichens nicht in der Kabine zu bewegen. Wenn Sie nicht sitzen, kehren Sie bitte sofort zu Ihrem Platz zurück.",
        "pt_br": "Senhoras e senhores, para a segurança de todos, pedimos que evitem se movimentar pela cabine enquanto o aviso de atar os cintos estiver ligado. Se não estiverem sentados, por favor, retornem imediatamente aos seus assentos.",
        "es": "Damas y caballeros, por la seguridad de todos, les pedimos que eviten moverse por la cabina mientras el cinturón de seguridad esté encendido. Si no están sentados, por favor regresen inmediatamente a sus asientos.",
        "fr": "Mesdames et messieurs, pour la sécurité de tous, nous vous demandons d'éviter de vous déplacer dans la cabine lorsque le signal de ceinture est allumé. Si vous n'êtes pas assis, veuillez retourner immédiatement à votre siège.",
        "it": "Signore e signori, per la sicurezza di tutti, vi chiediamo di evitare di muovervi in cabina mentre il segnale delle cinture di sicurezza è acceso. Se non siete seduti, vi preghiamo di tornare immediatamente al vostro posto.",
        "tr": "Bayanlar ve baylar, herkesin güvenliği için emniyet kemeri işareti açıkken kabin içinde hareket etmekten kaçınmanızı rica ederiz. Eğer oturmuyorsanız, lütfen hemen koltuğunuza geri dönün.",
        "nl": "Dames en heren, voor ieders veiligheid vragen wij u om niet door de cabine te lopen terwijl het stoelriemen vast teken aan staat. Als u niet zit, gaat u alstublieft onmiddellijk terug naar uw stoel.",
        "ko": "여러분, 안전을 위해 좌석벨트 싸인이 켜져 있는 동안 캐빈 내에서 이동을 피해 주시기 바랍니다. 앉아 계시지 않은 경우 즉시 자리로 돌아가 주세요.",
        "pt_pt": "Senhoras e senhores, para a segurança de todos, pedimos que evitem movimentar-se pela cabine enquanto o sinal de apertar os cintos estiver ligado. Se não estiverem sentados, por favor, retornem imediatamente aos vossos lugares.",
        "no": "Mine damer og herrer, for alles sikkerhet ber vi om at dere unngår å bevege dere rund i kabinen mens skiltet med sikkerhetsbeltet er på. Hvis du ikke sitter, vennligst returner umiddelbart til ditt sete.",
        "th": "ท่านผู้โดยสารทุกท่าน  เพื่อความปลอดภัยของทุกคน  ขอความกรุณาท่านงดการเคลื่อนไหวในห้องโดยสารขณะที่สัญญ าณรัดเข็มขัดที่นั่งเปิดอยู่  หากท่านไม่ได้นั่ง  ขอให้ท่านกลับไปนั่งที่นั่งของท่านทันที",
        "zh": "女士们，先生们，为了所有人的安全，我们要求您在安全带标志打开时不要在机舱内移动。如果您没有坐下，请立即返回座位。"
      },
      {
        "en": "Ladies and gentlemen, the seatbelt sign is now illuminated. Even if you’re familiar with flying, we kindly remind you to follow this safety procedure and remain seated. Thank you for your cooperation.",
        "pl": "Szanowni państwo, sygnał zapięcia pasów jest teraz włączony. Nawet jeśli są państwo doświadczeni w podróżowaniu samolotem, uprzejmie przypominamy o przestrzeganiu tej procedury bezpieczeństwa i pozostaniu na miejscach. Dziękujemy za współpracę.",
        "de": "Meine Damen und Herren, das Anschnallzeichen ist jetzt beleuchtet. Auch wenn Sie mit dem Fliegen vertraut sind, erinnern wir Sie höflich daran, dieses Sicherheitsverfahren zu befolgen und sitzen zu bleiben. Vielen Dank für Ihre Kooperation.",
        "pt_br": "Senhoras e senhores, o aviso de atar os cintos está aceso. Mesmo que estejam acostumados a voar, lembramos gentilmente que sigam este procedimento de segurança e permaneçam sentados. Agradecemos a sua cooperação.",
        "es": "Damas y caballeros, la señal de cinturón de seguridad está encendida. Incluso si están familiarizados con volar, les recordamos amablemente que sigan este procedimiento de seguridad y permanezcan sentados. Gracias por su cooperación.",
        "fr": "Mesdames et messieurs, le signal de ceinture de sécurité est maintenant allumé. Même si vous êtes familier avec le vol, nous vous rappelons gentiment de suivre cette procédure de sécurité et de rester assis. Merci pour votre coopération.",
        "it": "Signore e signori, il segnale delle cinture di sicurezza è acceso. Anche se siete abituati a volare, vi ricordiamo gentilmente di seguire questa procedura di sicurezza e di rimanere seduti. Grazie per la vostra collaborazione.",
        "tr": "Bayanlar ve baylar, emniyet kemeri işareti şu anda yanıyor. Uçmaya aşina olsanız bile, bu güvenlik prosedürünü takip etmenizi ve oturmanızı rica ederiz. İşbirliğiniz için teşekkür ederiz.",
        "nl": "Dames en heren, het stoelriemen vast teken is nu verlicht. Ook als u bekend bent met vliegen, herinneren wij u vriendelijk om deze veiligheidsprocedure te volgen en te blijven zitten. Dank u voor uw medewerking.",
        "ko": "여러분, 좌석벨트 싸인이 켜져 있습니다. 비행에 익숙하시더라도 이 안전 절차를 따르고 앉아 계시기 바랍니다. 협조해 주셔서 감사합니다.",
        "pt_pt": "Senhoras e senhores, o sinal de apertar os cintos está aceso. Mesmo que estejam habituados a voar, lembramos gentilmente que sigam este procedimento de segurança e permaneçam sentados. Agradecemos a sua cooperação.",
        "no": "Mine damer og herrer, skiltet med sikkerhetsbeltet er nå tent. Selv om du er kjent med å fly, minner vi deg vennlig om å følge denne sikkerhetsprosedyren og forbli sittende. Takk for din samarbeid.",
        "th": "ท่านผู้โดยสารทุกท่าน  สัญญาณรัดเข็มขัดที่นั่งเปิดอยู่  แม้ว่าท่านจะเคยเคลื่อนไหวในเครื่องบินมาก่อน  ข อความกรุณาท่านปฏิบัติตามขั้นตอนการรักษาความปลอดภัยนี้ และนั่งอยู่ ขอบคุณท่านที่ร่วมมือ",
        "zh": "女士们，先生们，安全带标志现在已经点亮。即使您已经熟悉飞行，我们也要求您遵守这一安全程序并保持就座。感谢您的合作。"
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
        "pt_br": "Senhoras e senhores, o comandante ligou o aviso de atar os cintos. Por favor, retornem aos seus assentos e afivelem seus cintos de segurança.",
        "es": "Damas y caballeros, el capitán ha activado la señal de cinturón de seguridad. Por favor regresen a sus asientos y abróchense los cinturones.",
        "fr": "Mesdames et messieurs, le commandant de bord a allumé le signal de ceinture de sécurité. Veuillez retourner à vos places et attacher vos ceintures de sécurité.",
        "it": "Signore e signori, il capitano ha acceso il segnale delle cinture di sicurezza. Vi preghiamo di ritornare ai vostri posti e di allacciare le cinture di sicurezza.",
        "tr": "Bayanlar ve baylar, kaptan emniyet kemeri işaretini yaktı. Lütfen koltuklarınıza dönün ve emniyet kemerlerinizi bağlayın.",
        "nl": "Dames en heren, de gezagvoerder heeft het stoelriemen vast teken aangezet. Gaat u alstublieft terug naar uw stoel en maak uw stoelriem vast.",
        "ko": "승객 여러분, 기장님께서 좌석벨트 싸인을 켰습니다. 자리로 돌아가 좌석벨트를 착용해 주시기 바랍니다.",
        "pt_pt": "Senhoras e senhores, o comandante ligou o sinal de aperto dos cintos. Por favor, regressem aos vossos lugares e apertem os cintos de segurança.",
        "no": "Mine damer og herrer, kapteinen har slått på skiltet med sikkerhetsbeltet. Vennligst returner tilbake til ditt sete og fest sikkerhetsbelte.",
        "th": "ท่านผู้โดยสารทุกท่าน ขณะนี้เราได้เปิดสัญญาณแจ้งรัดเข็มขัด ขอความกรุณาทุกท่านนั่งประจำที่ และรัดเข็มขัดขัดนิรภัยของท่านให้กระชับ",
        "zh": "女士们，先生们，机长已经打开了安全带标志。请您回到座位并系好安全带。"
      },
      {
        "en": "Ladies and gentlemen, the seatbelt sign has been turned on. Please return to your seats and fasten your seat belts. Use of the lavatories is not allowed at this time.",
        "pl": "Szanowni państwo, sygnał zapięcia pasów został właśnie włączony. Prosimy o powrót na miejsca i zapięcie pasów. Używanie toalet nie jest dozwolone w tym czasie.",
        "de": "Meine Damen und Herren, die Anschnallzeichen sind eingeschaltet. Bitte kehren Sie zu Ihren Plätzen zurück und schnallen Sie sich an. Die Nutzung der Toiletten ist derzeit nicht gestattet.",
        "pt_br": "Senhoras e senhores, o aviso de atar os cintos foi aceso. Por favor, retornem aos seus assentos e afivelem os cintos de segurança. Neste momento não está permitido o uso dos lavatórios.",
        "es": "Damas y caballeros, se ha encendido la señal del cinturón de seguridad. Por favor regresen a sus asientos y abróchense los cinturones. No se permite el uso de los baños en este momento.",
        "fr": "Mesdames et messieurs, le signal de ceinture de sécurité est allumé. Veuillez retourner à vos places et attacher vos ceintures de sécurité. L'utilisation des toilettes n'est pas autorisée pour le moment.",
        "it": "Signore e signori, il segnale delle cinture di sicurezza è stato acceso. Vi preghiamo di ritornare ai vostri posti e di allacciare le cinture di sicurezza. Al momento non è consentito l'uso dei servizi igienici.",
        "tr": "Bayanlar ve baylar, emniyet kemeri işareti açıldı. Lütfen koltuklarınıza dönün ve emniyet kemerlerinizi bağlayın. Şu anda tuvaletlerin kullanılmasına izin verilmiyor.",
        "nl": "Dames en heren, het stoelriemen vast teken is geactiveerd. Neemt u alstublieft plaats in uw stoel met uw stoelriem vast. Het gebruik van de toiletten is momenteel niet toegestaan.",
        "ko": "승객 여러분, 좌석벨트 싸인이 켜졌습니다. 자리로 돌아가 좌석벨트를 착용해 주시기 바랍니다. 지금은 화장실 사용이 금지되어 있습니다.",
        "pt_pt": "Senhoras e senhores passageiros, o sinal de apertar os cintos foi ligado. Por favor, regressem aos vossos lugares e apertem os cintos de segurança. O uso das casas de banho não é permitido neste momento.",
        "no": "Mine damer og herrer, skiltet med sikkerhetsbeltet har blitt slått på.Vennligst returner tilbake til ditt sete og fest sikkerhetsbeltet. Bruk av toalettene er ikke tillatt på dette tidspunktet.",
        "th": "ท่านผู้โดยสารทุกท่าน ขณะนี้เราได้เปิดสัญญาณแจ้งรัดเข็มขัดที่นั่ง ขอความกรุณาทุกท่านนั่งประจำที่ และรัดเข็มขัดขัดนิรภัยของท่านให้กระชับ และกรุณางดใช้ห้องน้ำในช่วงเวลานี้",
        "zh": "女士们，先生们，安全带标志已经打开。请您回到座位并系好安全带。目前暂时不允许使用洗手间。"
      },
      {
        "en": "Ladies and gentlemen, the seatbelt sign is now on. We ask that you remain seated as much as possible. For safety reasons, our cabin crew will also minimize their movement until conditions stabilize.",
        "pl": "Szanowni państwo, sygnał zapięcia pasów jest włączony. Prosimy o pozostanie na miejscach. Ze względów bezpieczeństwa, personel pokładowy również ograniczy swoje ruchy, dopóki warunki nie ustabilizują się.",
        "de": "Meine Damen und Herren, das Anschnallzeichen ist jetzt an. Wir bitten Sie, so viel wie möglich sitzen zu bleiben. Aus Sicherheitsgründen wird auch unser Kabinenpersonal ihre Bewegungen minimieren, bis sich die Bedingungen stabilisieren.",
        "pt_br": "Senhoras e senhores, o aviso de atar os cintos está ligado. Pedimos que permaneçam sentados o máximo possível. Por motivos de segurança, nossa tripulação de cabine também minimizará seus movimentos até que as condições se estabilizem.",
        "es": "Damas y caballeros, la señal de cinturón de seguridad está encendida. Les pedimos que permanezcan sentados tanto como sea posible. Por razones de seguridad, nuestro personal de cabina también minimizará sus movimientos hasta que las condiciones se estabilicen.",
        "fr": "Mesdames et messieurs, le signal de ceinture de sécurité est allumé. Nous vous demandons de rester assis autant que possible. Pour des raisons de sécurité, notre personnel de cabine minimisera également ses mouvements jusqu'à ce que les conditions se stabilisent.",
        "it": "Signore e signori, il segnale delle cinture di sicurezza è acceso. Vi preghiamo di rimanere seduti il più possibile. Per motivi di sicurezza, il nostro personale di cabina ridurrà al minimo anche i propri movimenti fino a quando le condizioni si stabilizzeranno.",
        "tr": "Bayanlar ve baylar, emniyet kemeri işareti şu anda açık. Mümkün olduğunca oturmanızı rica ederiz. Güvenlik nedenleriyle kabin ekibimiz de koşullar stabilize olana kadar hareketlerini en aza indirecektir.",
        "nl": "Dames en heren, het stoelriemen vast teken is nu aan. We vragen u om zoveel mogelijk te blijven zitten. Om veiligheidsredenen zal ons cabinepersoneel ook hun bewegingen minimaliseren totdat de omstandigheden stabiliseren.",
        "ko": "여러분, 좌석벨트 싸인이 켜졌습니다. 최대한 앉아 계시기 바랍니다. 안전상의 이유로 우리의 승무원도 상황이 안정될 때까지 움직임을 최소화할 것입니다.",
        "pt_pt": "Senhoras e senhores, o sinal de apertar os cintos está ligado. Pedimos que permaneçam sentados o máximo possível. Por motivos de segurança, a nossa tripulação de cabine também minimizará os seus movimentos até que as condições se estabilizem.",
        "no": "Mine damer og herrer, skiltet med sikkerhetsbeltet er nå på. Vi ber om at dere forblir sittende så mye som mulig. Av sikkerhetsmessige årsaker vil også vårt kabinpersonell minimere bevegelsene sine til forholdene stabiliserer seg.",
        "th": "ท่านผู้โดยสารทุกท่าน สัญญาณรัดเข็มขัดที่นั่งเปิดอยู่  ขอความกรุณาทุกท่านนั่งประจำที่  ในเวลานี้  ขอให้พนักงานบนเครื่องจำกัดการเคลื่อนไหวของตนเองให้น้อยลงจนกว่าส ภาพจะเสถียร",
        "zh": "女士们，先生们，安全带标志现在已经打开。我们要求您尽量保持就座。出于安全考虑，我们的机组人员也会尽量减少移动，直到条件稳定。"
      },
      {
        "en": "Ladies and gentlemen, for everyone’s safety, we ask that you avoid moving around the cabin while the seatbelt sign is on. If you’re not seated, please return to your seat immediately.",
        "pl": "Szanowni państwo, dla bezpieczeństwa wszystkich, prosimy o unikanie poruszania się po kabinie, gdy sygnał zapięcia pasów jest włączony. Jeśli nie siedzą państwo, prosimy o natychmiastowy powrót na miejsce.",
        "de": "Meine Damen und Herren, zur Sicherheit aller bitten wir Sie, sich während des eingeschalteten Anschnallzeichens nicht in der Kabine zu bewegen. Wenn Sie nicht sitzen, kehren Sie bitte sofort zu Ihrem Platz zurück.",
        "pt_br": "Senhoras e senhores, para a segurança de todos, pedimos que evitem se movimentar pela cabine enquanto o aviso de atar os cintos estiver ligado. Se não estiverem sentados, por favor, retornem imediatamente aos seus assentos.",
        "es": "Damas y caballeros, por la seguridad de todos, les pedimos que eviten moverse por la cabina mientras el cinturón de seguridad esté encendido. Si no están sentados, por favor regresen inmediatamente a sus asientos.",
        "fr": "Mesdames et messieurs, pour la sécurité de tous, nous vous demandons d'éviter de vous déplacer dans la cabine lorsque le signal de ceinture est allumé. Si vous n'êtes pas assis, veuillez retourner immédiatement à votre siège.",
        "it": "Signore e signori, per la sicurezza di tutti, vi chiediamo di evitare di muovervi in cabina mentre il segnale delle cinture di sicurezza è acceso. Se non siete seduti, vi preghiamo di tornare immediatamente al vostro posto.",
        "tr": "Bayanlar ve baylar, herkesin güvenliği için emniyet kemeri işareti açıkken kabin içinde hareket etmekten kaçınmanızı rica ederiz. Eğer oturmuyorsanız, lütfen hemen koltuğunuza geri dönün.",
        "nl": "Dames en heren, voor ieders veiligheid vragen wij u om niet door de cabine te lopen terwijl het stoelriemen vast teken aan staat. Als u niet zit, gaat u alstublieft onmiddellijk terug naar uw stoel.",
        "ko": "여러분, 안전을 위해 좌석벨트 싸인이 켜져 있는 동안 캐빈 내에서 이동을 피해 주시기 바랍니다. 앉아 계시지 않은 경우 즉시 자리로 돌아가 주세요.",
        "pt_pt": "Senhoras e senhores, para a segurança de todos, pedimos que evitem movimentar-se pela cabine enquanto o sinal de apertar os cintos estiver ligado. Se não estiverem sentados, por favor, retornem imediatamente aos vossos lugares.",
        "no": "Mine damer og herrer, for alles sikkerhet ber vi om at dere unngår å bevege dere rund i kabinen mens skiltet med sikkerhetsbeltet er på. Hvis du ikke sitter, vennligst returner umiddelbart til ditt sete.",
        "th": "ท่านผู้โดยสารทุกท่าน  เพื่อความปลอดภัยของทุกคน  ขอความกรุณาท่านงดการเคลื่อนไหวในห้องโดยสารขณะที่สัญญ าณรัดเข็มขัดที่นั่งเปิดอยู่  หากท่านไม่ได้นั่ง  ขอให้ท่านกลับไปนั่งที่นั่งของท่านทันที",
        "zh": "女士们，先生们，为了所有人的安全，我们要求您在安全带标志打开时不要在机舱内移动。如果您没有坐下，请立即返回座位。"
      },
      {
        "en": "Ladies and gentlemen, the seatbelt sign is now illuminated. Even if you’re familiar with flying, we kindly remind you to follow this safety procedure and remain seated. Thank you for your cooperation.",
        "pl": "Szanowni państwo, sygnał zapięcia pasów jest teraz włączony. Nawet jeśli są państwo doświadczeni w podróżowaniu samolotem, uprzejmie przypominamy o przestrzeganiu tej procedury bezpieczeństwa i pozostaniu na miejscach. Dziękujemy za współpracę.",
        "de": "Meine Damen und Herren, das Anschnallzeichen ist jetzt beleuchtet. Auch wenn Sie mit dem Fliegen vertraut sind, erinnern wir Sie höflich daran, dieses Sicherheitsverfahren zu befolgen und sitzen zu bleiben. Vielen Dank für Ihre Kooperation.",
        "pt_br": "Senhoras e senhores, o aviso de atar os cintos está aceso. Mesmo que estejam acostumados a voar, lembramos gentilmente que sigam este procedimento de segurança e permaneçam sentados. Agradecemos a sua cooperação.",
        "es": "Damas y caballeros, la señal de cinturón de seguridad está encendida. Incluso si están familiarizados con volar, les recordamos amablemente que sigan este procedimiento de seguridad y permanezcan sentados. Gracias por su cooperación.",
        "fr": "Mesdames et messieurs, le signal de ceinture de sécurité est maintenant allumé. Même si vous êtes familier avec le vol, nous vous rappelons gentiment de suivre cette procédure de sécurité et de rester assis. Merci pour votre coopération.",
        "it": "Signore e signori, il segnale delle cinture di sicurezza è acceso. Anche se siete abituati a volare, vi ricordiamo gentilmente di seguire questa procedura di sicurezza e di rimanere seduti. Grazie per la vostra collaborazione.",
        "tr": "Bayanlar ve baylar, emniyet kemeri işareti şu anda yanıyor. Uçmaya aşina olsanız bile, bu güvenlik prosedürünü takip etmenizi ve oturmanızı rica ederiz. İşbirliğiniz için teşekkür ederiz.",
        "nl": "Dames en heren, het stoelriemen vast teken is nu verlicht. Ook als u bekend bent met vliegen, herinneren wij u vriendelijk om deze veiligheidsprocedure te volgen en te blijven zitten. Dank u voor uw medewerking.",
        "ko": "여러분, 좌석벨트 싸인이 켜져 있습니다. 비행에 익숙하시더라도 이 안전 절차를 따르고 앉아 계시기 바랍니다. 협조해 주셔서 감사합니다.",
        "pt_pt": "Senhoras e senhores, o sinal de apertar os cintos está aceso. Mesmo que estejam habituados a voar, lembramos gentilmente que sigam este procedimento de segurança e permaneçam sentados. Agradecemos a sua cooperação.",
        "no": "Mine damer og herrer, skiltet med sikkerhetsbeltet er nå tent. Selv om du er kjent med å fly, minner vi deg vennlig om å følge denne sikkerhetsprosedyren og forbli sittende. Takk for din samarbeid.",
        "th": "ท่านผู้โดยสารทุกท่าน  สัญญาณรัดเข็มขัดที่นั่งเปิดอยู่  แม้ว่าท่านจะเคยเคลื่อนไหวในเครื่องบินมาก่อน  ข อความกรุณาท่านปฏิบัติตามขั้นตอนการรักษาความปลอดภัยนี้ และนั่งอยู่ ขอบคุณท่านที่ร่วมมือ",
        "zh": "女士们，先生们，安全带标志现在已经点亮。即使您已经熟悉飞行，我们也要求您遵守这一安全程序并保持就座。感谢您的合作。"
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
        "de": "Meine Damen und Herren, der Kapitän hat die Anschnallzeichen ausgeschaltet. Sie können sich jetzt in der Kabine frei bewegen, wir empfehlen Ihnen jedoch, im Sitzen jederzeit angeschnallt zu sein, um verletzungen bei unerwarteten Turbulenzen zu vermeiden.",
        "pt_br": "Senhoras e senhores, o comandante desligou o aviso de atar os cintos. A partir de agora você pode se movimentar pela cabine, mas nós recomendamos o uso do cinto de segurança enquanto estiver sentado, em caso de turbulência inesperada.",
        "es": "Damas y caballeros, el capitán ha desactivado la señal de cinturón de seguridad. Ahora puedes moverte por la cabina, pero te recomendamos que mantengas abrochado el cinturón de seguridad mientras estás sentado en caso de turbulencias inesperadas.",
        "fr": "Mesdames et messieurs, le commandant de bord a éteint le signal de ceinture de sécurité. Vous pouvez désormais vous déplacer dans la cabine, mais nous vous recommandons de garder votre ceinture de sécurité attachée lorsque vous êtes assis en cas de turbulences inattendues.",
        "it": "Signore e signori, il capitano ha spento il segnale delle cinture di sicurezza. Ora potete muovervi all'interno della cabina, ma vi consigliamo di tenere la cintura di sicurezza allacciata mentre siete seduti, in caso di turbolenze impreviste.",
        "tr": "Bayanlar ve baylar, kaptan emniyet kemeri işaretini kapattı. Artık kabin içinde hareket edebilirsiniz ancak beklenmedik bir türbülansa karşı oturduğunuzda emniyet kemerinizi takılı tutmanızı öneririz.",
        "nl": "Dames en heren, de gezagvoerder heeft het stoelriemen vast teken uitgeschakeld. U mag nu vrij door de cabine bewegen, maar wij raden u aan om uw stoelriem vast te houden terwijl u zit in geval van onverwachte turbulentie.",
        "ko": "승객 여러분, 기장님께서 좌석벨트 싸인을 껐습니다. 이제 기내를 이동할 수 있지만 예기치 않은 난기류를 대비하여 좌석에 앉은 상태에서 좌석벨트를 계속 착용하는 것이 좋습니다.",
        "pt_pt": "Senhoras e senhores, o comandante desligou o sinal de apertar os cintos. Podem agora circular pela cabine, mas recomendamos que mantenham os cintos de segurança apertados sempre que estiverem sentados, em caso de turbulência inesperada.",
        "no": "Mine damer og herrer, kapteinen har slått av skiltet med fest-sikkerhetsbeltet. Dere kan nå bevege dere rundt i kabinen, men vi anbefaler at dere holder sikkerhetsbeltet festet mens dere sitter, i tilfelle uventet turbulens.",
        "th": "ท่านผู้โดยสารทุกท่าน ขณะนี้กัปตันได้ปิดสัญญาณแจ้งรัดเข็มขัดที่นั่งลงแล้ว ท่านสามารถเคลื่อนย้ายภายในห้องโดยสาร เพื่อความปลอดภัยในเวลาสภาพอากาศแปรปรวนฉับพลัน โปรดรัดเข็มขัดนิรภัยของท่านเวลานั่งที่",
        "zh": "女士们，先生们，机长已经关闭了安全带标志。您现在可以在客舱内走动，但我们建议您在就座时继续系好安全带，以防突发颠簸。"
      },
      {
        "en": "As you can see, the seatbelt sign has been turned off. You may now move around the cabin, but we recommend that you keep your seatbelt fastened while seated in case of unexpected turbulence.",
        "pl": "Jak mogli państwo zauważyć, sygnał zapięcia pasów został wyłączony. Możecie państwo teraz poruszać się po kabinie, ale zalecamy, aby pasy były zapięte podczas siedzenia na wypadek niespodziewanych turbulencji.",
        "de": "Wie Sie sehen, wurden die Anschnallzeichen ausgeschaltet. Sie können sich jetzt in der Kabine bewegen, wir empfehlen Ihnen jedoch, im Sitzen jederzeit angeschnallt zu sein, um verletzungen bei unerwarteten Turbulenzen zu vermeiden.",
        "pt_br": "Como você pode ver, o aviso de atar os cintos foi apagado. A partir de agora você pode se movimentar pela cabine, mas nós recomendamos o uso do cinto de segurança enquanto estiver sentado, em caso de turbulência inesperada.",
        "es": "Como puede ver, la señal del cinturón de seguridad se ha apagado. Ahora puedes moverte por la cabina, pero te recomendamos que mantengas abrochado el cinturón de seguridad mientras estás sentado en caso de turbulencias inesperadas.",
        "fr": "Comme vous pouvez le constater, le signal de ceinture de sécurité a été éteint. Vous pouvez désormais vous déplacer dans la cabine, mais nous vous recommandons de garder votre ceinture de sécurité attachée lorsque vous êtes assis en cas de turbulences inattendues.",
        "it": "Come potete vedere, il segnale della cintura di sicurezza è stato spento. Ora potete muovervi all'interno della cabina, ma vi consigliamo di tenere la cintura di sicurezza allacciata mentre siete seduti, in caso di turbolenze impreviste.",
        "tr": "Gördüğünüz gibi emniyet kemeri işareti kapatılmış. Artık kabin içinde hareket edebilirsiniz ancak beklenmedik bir türbülansa karşı oturduğunuzda emniyet kemerinizi takılı tutmanızı öneririz.",
        "nl": "Zoals u kunt zien, is het stoelriemen vast teken uitgeschakeld. U mag nu vrij door de cabine bewegen, maar wij raden u aan om uw stoelriem vast te houden terwijl u zit in geval van onverwachte turbulentie.",
        "ko": "좌석벨트 싸인이 꺼졌습니다. 이제 객실 주변을 이동할 수 있지만 예기치 않은 난기류를 대비하여 좌석에 앉은 상태에서 좌석벨트를 착용하고 있는것이 좋습니다.",
        "pt_pt": "Como podem ver, o sinal de apertar os cintos foi desligado. Podem agora circular pela cabine, mas recomendamos que mantenham os cintos de segurança apertados enquanto estiverem sentados, em caso de turbulência inesperada.",
        "no": "Som dere kan se, har skiltet med fest-sikkerhetsbeltet blitt slått av. Dere kan nå bevege dere rundt i kabinen, men vi anbefaler at dere holder sikkerhetsbeltet fastspent mens dere sitter, i tilfelle uventet turbulens.",
        "th": "ขณะนี้เราได้ปิดสัญญาณแจ้งรัดเข็มขัดที่นั่งลงแล้ว ท่านสามารถเคลื่อนย้ายภายในห้องโดยสารได้ เพื่อความปลอดภัยของท่านในเวลาสภาพอากาศแปรปรวนฉับพลัน กรุณารัดเข็มขัดนิรภัยเวลานั่งที่",
        "zh": "正如您所见，安全带标志已关闭。您现在可以在客舱内走动，但我们建议您在就座时继续系好安全带，以防突发颠簸。"
      },
      {
        "en": "Seatbelt sign has just been turned off. You may now move around the cabin. We recommend that you keep your seatbelt fastened while seated in case of unexpected turbulence.",
        "pl": "Sygnał zapięcia pasów został właśnie wyłączony. Możecie państwo teraz poruszać się po kabinie. Zalecamy jednak, aby pasy były zapięte podczas siedzenia na wypadek niespodziewanych turbulencji.",
        "de": "Die Anschnallzeichen wurden gerade ausgeschaltet. Sie können sich nun in der Kabine bewegen. Für den Fall unerwarteter Turbulenzen empfehlen wir Ihnen, im Sitzen den Sicherheitsgurt angelegt zu lassen.",
        "pt_br": "Senhoras e senhores, o comandante desligou o aviso de atar os cintos. A partir de agora você pode se movimentar pela cabine, mas nós recomendamos o uso do cinto de segurança enquanto estiver sentado, em caso de turbulência inesperada.",
        "es": "La señal de cinturón de seguridad acaba de ser apagada. Ahora puedes moverte por la cabina. Le recomendamos que mantenga abrochado el cinturón de seguridad mientras está sentado en caso de turbulencias inesperadas.",
        "fr": "Le panneau de ceinture de sécurité vient d'être éteint. Vous pouvez maintenant vous déplacer dans la cabine. Nous vous recommandons de garder votre ceinture de sécurité attachée lorsque vous êtes assis en cas de turbulences inattendues.",
        "it": "Il segnale della cintura di sicurezza è appena stato spento. Ora potete muovervi in cabina. Vi consigliamo di tenere la cintura di sicurezza allacciata mentre restate seduti, in caso di turbolenze impreviste.",
        "tr": "Emniyet kemeri işareti yeni kapatıldı. Artık kabinin içinde hareket edebilirsiniz. Beklenmedik bir türbülansa karşı oturduğunuzda emniyet kemerinizi bağlı tutmanızı öneririz.",
        "nl": "Het stoelriem vast teken is zojuist uitgeschakeld. U mag nu vrij door de cabine bewegen, maar wij raden u aan om uw stoelriem vast te houden terwijl u zit in geval van onverwachte turbulentie.",
        "ko": "좌석벨트 싸인이 방금 꺼졌습니다. 이제 객실 주변을 이동할 수 있습니다. 하지만 예기치 않은 난기류가 발생할 수 있기 때문에 좌석에 앉은 상태에서 좌석벨트를 계속 착용하고 있는 것이 좋습니다.",
        "pt_pt": "O sinal de apertar os cintos acabou de ser desligado. Podem agora circular pela cabine. Recomendamos que mantenham os cintos de segurança apertados enquanto estiverem sentados, em caso de turbulência inesperada.",
        "no": "Skiltet med fest-sikkerhetsbeltet har nettopp blitt slått av. Dere kan nå bevege dere rundt i kabinen. Vi anbefaler at dere holder sikkerhetsbeltet fastspent mens dere sitter, i tilfelle uventet turbulens.",
        "th": "ขณะนี้สัญญาณแจ้งรัดเข็มขัดดับลงแล้ว ท่านสามารถเคลื่อนย้ายภายในห้องโดยสารได้ เพื่อความปลอดภัยของท่านในเวลาสภาพอากาศแปรปรวนฉับพลัน กรุณารัดเข็มขัดนิรภัยเวลานั่งที่",
        "zh": "安全带标志刚刚关闭。您现在可以在客舱内走动，但我们建议您在就座时继续系好安全带，以防突发颠簸。"
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
        "de": "Sehr geehrte Damen und Herren, wir sind aktuell verspätet und entschuldigen uns für die Unannehmlichkeiten. Selbstverständlich werden wir Sie über den weiteren Verlauf informieren und bemühen uns, Sie so schnell wie möglich an Ihr Reiseziel zu bringen. Vielen Dank für Ihre Geduld.",
        "pt_br": "Senhoras e Senhores, infelizmente nós teremos um pequeno atraso em nossa partida. Pedimos desculpas pelo transtorno e manteremos vocês atualizados sobre o andamento. Estamos trabalhando para que você chegue ao seu destino o mais rápido possível. Obrigado pela paciência.",
        "es": "Damas y caballeros, actualmente estamos experimentando un retraso. Nos disculpamos por las molestias y lo mantendremos informado sobre el progreso. Estamos trabajando duro para que puedas seguir tu camino lo antes posible. Gracias por su paciencia.",
        "fr": "Mesdames et messieurs, nous subissons actuellement un retard. Nous vous présentons nos excuses pour ce désagrément et nous vous tiendrons informés de l'évolution de la situation. Nous faisons tout notre possible pour vous permettre de repartir dès que possible. Merci de votre patience.",
        "it": "Signore e signori, stiamo attualmente riscontrando un ritardo. Ci scusiamo per il disagio e vi terremo aggiornati sugli sviluppi. Faremo il possibile per recuperare il ritardo. Grazie per la vostra pazienza.",
        "tr": "Bayanlar ve baylar, şu anda bir gecikme yaşıyoruz. Bu rahatsızlıktan dolayı özür dileriz ve sizi gelişmelerden haberdar edeceğiz. Sizi en kısa sürede yolunuza çıkarmak için çok çalışıyoruz. Sabrınız için teşekkürler.",
        "nl": "Dames en heren, momenteel ondervinden wij vertraging. Onze excuses voor het ongemak, wij zullen u op de hoogte houden. Wij werken er hard aan om u zo snel mogelijk de lucht in te krijgen. Bedankt voor uw geduld.",
        "ko": "승객 여러분, 현재 우리 비행기가 지연되고 있습니다. 불편을 드려 죄송합니다. 진행 상황을 계속 알려드리겠습니다. 승무원들은 현재 최대한 빨리 진행될 수 있도록 노력하고 있습니다. 기다려 주셔서 감사합니다.",
        "pt_pt": "Senhoras e senhores passageiros, estamos atualmente a enfrentar um atraso. Pedimos desculpa pelo incómodo e iremos mantê-los informados sobre o progresso. Estamos a trabalhar arduamente para que possam seguir viagem o mais rapidamente possível. Agradecemos a vossa paciência.",
        "no": "Mine damer og herrer, vi opplever for øyeblikket en forsinkelse. Vi beklager ulempene og vil holde dere oppdatert om fremdriften. Vi jobber hardt for å få dere videre så snart som mulig. Takk for tålmodigheten.",
        "th": "ท่านผู้โดยสารทุกท่าน ขณะนี้สายการบินกำลังเผชิญความล่าช้า  เราขออภัยในความไม่สะดวกในที่นี้  และจะอัปเดตความคืบหน้าให้ท่านทราบ  เราคาดการณ์ว่าเราจะเดินทางได้โดยเร็วๆนี้  ขอบคุณสำหรับความเข้าใจของท่าน",
        "zh": "女士们，先生们，我们目前遇到了一些延误。我们对此不便深感抱歉，并将持续向您通报进展。我们正努力尽快让您启程，感谢您的耐心等待。"
      },
      {
        "en": "Hi, this is your captain speaking. We are currently experiencing a delay. We apologize for the inconvenience and we will keep you updated on the progress. Thank you for your patience and understanding.",
        "pl": "Witajcie, tu kapitan. Obecnie mamy drobne opóźnienie. Przepraszamy za niedogodności i będziemy informować państwa o postępach. Dziękujemy za cierpliwość i zrozumienie.",
        "de": "Hallo, hier spricht Ihr Kapitän. Leider kommt es derzeit zu einer Verzögerung. Wir entschuldigen uns für die Unannehmlichkeiten und werden Sie über den weiteren Verlauf auf dem Laufenden halten. Vielen Dank für Ihre Geduld und Ihr Verständnis.",
        "pt_br": "Olá, aqui é o comandante falando. No momento estamos enfrentando um atraso. Pedimos desculpas pelo transtorno e manteremos vocês atualizados sobre o andamento. Obrigado pela sua paciência e compreensão.",
        "es": "Hola, habla tu capitán. Actualmente estamos experimentando un retraso. Nos disculpamos por las molestias y lo mantendremos informado sobre el progreso. Gracias por su paciencia y comprensión.",
        "fr": "Salut, c'est votre capitaine qui parle. Nous connaissons actuellement un retard. Nous nous excusons pour la gêne occasionnée et nous vous tiendrons au courant des progrès. Merci pour votre patience et votre compréhension.",
        "it": "Signore e signori, vi parla il vostro Comandante. Attualmente stiamo riscontrando un ritardo. Ci scusiamo per il disagio e vi terremo aggiornati sugli sviluppi. Grazie per la pazienza e la comprensione.",
        "tr": "Merhaba, kaptanınız konuşuyor. Şu anda bir gecikme yaşıyoruz. Yaşanan rahatsızlıktan dolayı özür dileriz. Gelişmeler hakkında sizi bilgilendireceğiz. Sabrınız ve anlayışınız için teşekkür ederiz.",
        "nl": "Hallo, hier spreekt uw gezagvoerder. We ondervinden momenteel wat vertraging. Onze excuses voor het ongemak, wij zullen u op de hoogte houden. Bedankt voor uw geduld en begrip.",
        "ko": "안녕하세요, 저는 이 비행기의 기장입니다. 현재 우리 비행기는 지연되고 있습니다. 불편을 드려 죄송합니다. 진행 상황을 계속 알려드리겠습니다. 기다려주시고 이해해주셔서 감사드립니다.",
        "pt_pt": "Caros passageiros, fala o vosso comandante. Estamos atualmente a enfrentar um atraso. Pedimos desculpa pelo incómodo e iremos mantê-los informados sobre o progresso. Agradecemos a vossa paciência e compreensão.",
        "no": "Hei, dette er kapteinen som snakker. Vi opplever for øyeblikket en forsinkelse. Vi beklager ulempene og vil holde dere oppdatert om fremdriften. Takk for tålmodigheten og forståelsen.",
        "th": "นี่คือกัปตันของท่าน ขณะนี้เรากำลังเผชิญกับความล่าช้า เราขออภัยในความไม่สะดวกในที่นี้ และจะคอยอัปเดตความคืบหน้าให้ท่านทราบ ขอบคุณสำหรับความอดทนและความเข้าใจของท่าน",
        "zh": "您好，我是您的机长。我们目前遇到了一些延误。我们对此不便深感抱歉，并将持续向您通报进展。感谢您的耐心和理解。"
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
        "pt_br": "Gostaríamos de pedir desculpas novamente pelo atraso. Esperamos que você tenha tido um voo agradável e esperamos vê-lo novamente em breve.",
        "es": "Nos gustaría disculparnos nuevamente por el retraso. Esperamos que haya tenido un vuelo agradable y esperamos volver a verle pronto.",
        "fr": "Nous tenons à vous excuser encore une fois pour le retard. Nous espérons que votre vol a été agréable et nous espérons vous revoir bientôt.",
        "it": "Desideriamo scusarci nuovamente per il ritardo. Ci auguriamo che il volo sia stato piacevole, e non vediamo l'ora di ritrovarvi a bordo.",
        "tr": "Gecikmeden dolayı tekrar özür dileriz. Keyifli bir uçuş geçirmenizi dileriz. Sizi en kısa zamanda tekrar aramızda görmekten mutluluk duyarız.",
        "nl": "Wij willen u nogmaals onze excuses aanbieden voor de vertraging. We hopen dat u een goede vlucht heeft gehad en kijken er naar uit om u binnenkort weer aan boord te verwelkomen.",
        "ko": "비행기 지연에 대해 다시 한번 사과드립니다. 즐거운 비행이 되셨기를 바라며 곧 다시 뵙기를 기대하겠습니다.",
        "pt_pt": "Gostaríamos de pedir desculpa mais uma vez pelo atraso. Esperamos que tenham tido um voo agradável e esperamos vê-los novamente em breve.",
        "no": "Vi vil igjen beklage forsinkelsen. Vi håper dere hadde en behagelig flytur, og vi ser frem til å se dere igjen snart.",
        "th": "เราขออภัยอีกครั้งสำหรับความล่าช้า เราหวังเป็นอย่างยิ่งว่าท่านได้รับความพอใจในการบริการระหว่างการเดินทางของท่าน และเราหวังว่าจะได้พบท่านอีกเร็วๆ นี้",
        "zh": "我们再次对延误深表歉意。希望您有一个愉快的旅程，并期待很快再次见到您。"
      }
    ]
  },

  // Flight state changes

  // Boarding
  {
    "category": "crew-boarding",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_BOARDING']},
    "timeout": [0, 0],
    "texts": [
      {
        "en": "Boarding started.",
      }
    ]
  },

  // Pre-flight
  {
    "category": "captain-pre-flight-welcome-message",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_STARTED']},
    "timeout": [0, 60],
    "chime": "DING_DONG",
    "texts": [
      {
        "en": "Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}. My name is {captainName} and I am the captain of this flight. I would like to welcome you on board and thank you for choosing to fly with us today. We are currently preparing for departure and we will be taking off shortly. Our flight today will take approximately {flightTime}. If you have any questions or need assistance, please don't hesitate to ask one of our cabin crew members. Thank you for flying with {airlineName}.",
        "pl": "[Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Nazywam się {captainName} i jestem kapitanem podczas tego lotu. Chciałbym państwa serdecznie powitać na pokładzie i podziękować za wybór naszego przewoźnika. Obecnie przygotowujemy się do startu i wkrótce rozpoczniemy kołowanie. [Our flight today will take approximately {flightTime}.] Jeśli mają państwo jakieś pytania, nie wahajcie się zwrócić do jednego z członków naszej załogi. [Thank you for flying with {airlineName}.]",
        "de": "[Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Mein Name ist {captainName} und ich bin der Kapitän dieses Fluges. Ich begrüße Sie an Bord und danke Ihnen, dass Sie sich entschieden haben, heute mit uns zu fliegen. Wir bereiten uns derzeit auf den Abflug vor und werden in Kürze abheben. [Our flight today will take approximately {flightTime}.] Wenn Sie Fragen haben oder Hilfe benötigen, wenden Sie sich bitte an einen unserer Flugbegleiter. [Thank you for flying with {airlineName}.]",
        "pt_br": "[Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Eu me chamo {captainName} e sou o comandante deste voo. Gostaria de lhe dar as boas-vindas a bordo e agradecer pela preferência. No momento estamos nos preparando para a partida e decolaremos em breve. [Our flight today will take approximately {flightTime}.] Se tiver alguma dúvida ou precisar de assistência, não hesite em perguntar a um dos nossos comissários. [Thank you for flying with {airlineName}.]",
        "es": "[Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Mi nombre es {captainName} y soy el capitán de este vuelo. Me gustaría darle una calurosa bienvenida a bordo y agradecerle por elegir nuestra aerolínea. Actualmente nos estamos preparando para el despegue y pronto comenzaremos a rodar. [Our flight today will take approximately {flightTime}.] Si tiene alguna pregunta, no dude en preguntarle a uno de los miembros de nuestra tripulación. [Thank you for flying with {airlineName}.]",
        "fr": "[Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Je m'appelle {captainName} et je suis le commandant de bord de ce vol. Je tiens à vous souhaiter la bienvenue à bord et à vous remercier d'avoir choisi de voyager avec nous aujourd'hui. Nous nous préparons actuellement pour le départ et nous décollerons sous peu. [Our flight today will take approximately {flightTime}.] Si vous avez des questions ou besoin d'assistance, n'hésitez pas à demander à l'un de nos membres d'équipage. [Thank you for flying with {airlineName}.]",
        "it": "[Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Il mio nome è {captainName} e sono il comandante di questo volo. Vorrei darvi il benvenuto a bordo e ringraziarvi per aver scelto di volare con noi oggi. Stiamo attualmente preparando il decollo e partiremo a breve. Il nostro volo di oggi durerà circa {flightTime}. Se avete domande o bisogno di assistenza, non esitate a chiedere a uno dei nostri membri dell’equipaggio. Grazie per aver scelto di volare con {airlineName}.",
        "tr": "[Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Adım {captainName} ve bu uçuşun kaptanıyım. Bu uçuşta size hoş geldiniz diyor ve bugün bizimle uçmayı seçtiğiniz için teşekkür ediyorum. Şu anda kalkışa hazırlanıyoruz ve kısa süre sonra yola çıkacağız. [Our flight today will take approximately {flightTime}.] Herhangi bir sorunuz varsa veya yardıma ihtiyacınız varsa lütfen kabin ekibimizden birine sormaktan çekinmeyin. [Thank you for flying with {airlineName}.]",
        "nl": "[Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Mijn naam is {captainName} en ik ben de gezagvoerder op deze vlucht. Ik heet u graag welkom aan boord en dank u dat u ervoor heeft gekozen om vandaag met ons te vliegen. Wij bereiden ons momenteel voor op vertrek en zullen binnenkort opstijgen. [Our flight today will take approximately {flightTime}.] Als u vragen of hulp nodig heeft, stel deze dan gerust aan het cabinepersoneel. [Thank you for flying with {airlineName}.]",
        "ko": "[Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] [My name is {captainName} and I am the captain of this flight.] 여러분의 탑승을 환영하고 오늘 저희 비행기를 이용해 주셔서 감사의 말씀을 드립니다. 승무원들은 현재 출발을 준비하고 있으며 곧 이륙할 예정입니다. 오늘 저희 항공편은 약 {flightTime} 정도 소요될 예정입니다. 질문이 있거나 도움이 필요한 경우 주저하지 마시고 객실 승무원 중 한명에게 문의해 주시기 바랍니다. 저희와 함께 해주셔서 감사합니다.",
        "pt_pt": "[Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] O meu nome é {captainName} e sou o comandante deste voo. Gostaria de dar as boas-vindas a bordo e agradecer por terem escolhido voar connosco hoje. Estamos atualmente a preparar-nos para a descolagem e partiremos em breve. [Our flight today will take approximately {flightTime}.] Se tiverem alguma dúvida ou precisarem de assistência, não hesitem em pedir a um dos membros da nossa tripulação de cabine. [Thank you for flying with {airlineName}.]",
        "no": "[Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Jeg heter {captainName} og jeg er kaptein på denne flyvningen. Jeg vil gjerne ønske dere velkommen om bord og takke for at dere valgte å fly med oss i dag. Vi er for øyeblikket i ferd med å forberede oss til avgang, og forventer å sette i gang straks. [Our flight today will take approximately {flightTime}.] Hvis dere har spørsmål eller trenger assistanse, ikke nøl med å spørre en av våre kabinansatte. [Thank you for flying with {airlineName}.]",
        "th": "[Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] ฉันชื่อ {captainName} และฉันเป็นกัปตันของเที่ยวบินนี้ ฉันขอต้อนรับคุณเข้าสู่เครื่องบินและขอขอบคุณที่เลือกบินกับเราในวันนี้ ขณะนี้เรากำลังเตรียมตัวออกเดินทางและจะออกเดินทางในเร็วๆ นี้ [Our flight today will take approximately {flightTime}.] หากคุณมีคำถามหรือต้องการความช่วยเหลือ โปรดอย่าลังเลที่จะถามสมาชิกลูกเรือของเรา [Thank you for flying with {airlineName}.]",
        "zh": "[Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] 我的名字是{captainName}，我是本次航班的機長。我熱烈歡迎您登機，並感謝您今天選擇搭乘我們的航班。目前我們正在準備出發，不久後就會起飛。[Our flight today will take approximately {flightTime}.] 如果您有任何疑問或需要協助，請隨時詢問我們的機組人員。[Thank you for flying with {airlineName}.]"
      },
      {
        "en": "Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}. My name is {captainName} and I am the captain of this flight. We are currently preparing for departure and we will be taking off shortly. Thank you for choosing {airlineName}. Enjoy your flight.",
        "pl": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Nazywam się {captainName} i jestem kapitanem podczas tego lotu. Obecnie przygotowujemy się do startu i wkrótce rozpoczniemy kołowanie. [Thank you for choosing {airlineName}.] Życzymy miłego lotu.",
        "de": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mein Name ist {captainName} und ich bin der Kapitän dieses Fluges. Wir bereiten uns derzeit auf den Abflug vor und werden in Kürze abheben. [Thank you for choosing {airlineName}.] Guten Flug.",
        "pt_br": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Eu me chamo {captainName} e sou o comandante deste voo. No momento estamos nos preparando para a partida e decolaremos em breve. [Thank you for choosing {airlineName}.] Aproveite seu voo.",
        "es": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mi nombre es {captainName} y soy el capitán de este vuelo. Actualmente nos estamos preparando para el despegue y pronto comenzaremos a rodar. [Thank you for choosing {airlineName}.] Que tengas un buen vuelo.",
        "fr": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Nous sommes en train de finaliser les préparatifs pour le départ et nous prendrons bientôt notre envol. [Thank you for choosing {airlineName}.] Bon vol.",
        "it": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mi chiamo {captainName} e sono il capitano di questo volo. Stiamo ultimando le procedure di partenza e partiremo a breve. [Thank you for choosing {airlineName}.] Vi augriamo un buon volo.",
        "tr": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Adım {captainName} ve bu uçuşun kaptanıyım. Şu anda kalkışa hazırlanıyoruz ve kısa süre sonra yola çıkacağız. [Thank you for choosing {airlineName}.] İyi uçuşlar.",
        "nl": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mijn naam is {captainName} en ik ben de gezagvoerder op deze vlucht. Wij bereiden ons momenteel voor op vertrek en zullen binnenkort opstijgen. [Thank you for choosing {airlineName}.] Fijne vlucht.",
        "ko": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] [My name is {captainName} and I am the captain of this flight.] 현재 출발 준비 중이며 곧 이륙할 예정입니다. {airlineName} 비행편을 선택해 주셔서 감사합니다. 즐거운 비행 되세요.",
        "pt_pt": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] O meu nome é {captainName} e sou o comandante deste voo. Estamos atualmente a preparar-nos para a descolagem e partiremos em breve. [Thank you for choosing {airlineName}.] Desejamos-vos uma excelente viagem.",
        "no": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Jeg heter {captainName} og jeg er kaptein på denne flyvningen. Vi er for øyeblikket i ferd med å forberede oss til avgang, og forventer å sette i gang straks. [Thank you for choosing {airlineName}.] Nyt flyturen.",
        "th": "ท่านผู้โดยสารทุกท่าน ยินดีต้อนรับสู่สายการบิน {airlineName} จาก {originCityName} ซึ่งจะเดินทางไปยัง {destinationCityName} ผมชื่อ {captainName} เป็นกัปตันของท่านในเที่ยวบินนี้ ขณะนี้เรากำลังเตรียมตัวสำหรับการออกเดินทาง และจะออกเดินทางในไม่ช้านี้ ขอบคุณที่เลือกใช้บริการ {airlineName} เราหวังเป็นอย่างยิ่งว่าท่านจะมีความพึงพอใจกับการเดินทาง",
        "zh": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] 我是 {captainName}，此次航班的机长。我们正在准备起飞，稍后即将起飞。[Thank you for choosing {airlineName}.]"
      },
      {
        "en": "{% ['Good morning', 'Good afternoon', 'Good evening'][departureDayPhase]='Hello' %}, this is your captain speaking. Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}. We are currently preparing for departure and we will be taking off shortly. Thank you for choosing to fly with us today.",
        "pl": "{% ['Dzień dobry', 'Dzień dobry', 'Dobry wieczór'][departureDayPhase]='Dzień dobry' %}, tu kapitan. [Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Obecnie przygotowujemy się do startu i wkrótce rozpoczniemy kołowanie. Dziękujemy za wybór naszego przewoźnika.",
        "de": "{% ['Guten Abend', 'Guten Tag', 'Guten Abend'][departureDayPhase]='Hello' %}, hier spricht Ihr Kapitän. [Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Wir bereiten uns derzeit auf den Abflug vor und werden in Kürze abheben. Vielen Dank, dass Sie sich entschieden haben, heute mit uns zu fliegen.",
        "pt_br": "{% ['Bom dia', 'Boa tarde', 'Boa noite'][departureDayPhase]='Olá' %} aqui é o comandante falando. [Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] No momento estamos nos preparando para a partida e decolaremos em breve. Obrigado por escolher voar conosco hoje.",
        "es": "{% ['Buenos días', 'Buenas tardes', 'Buenas noches'][departureDayPhase]='Hola' %}, este es el capitán. [Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Actualmente nos estamos preparando para el despegue y pronto comenzaremos a rodar. Gracias por elegir nuestro transportista.",
        "fr": "{% ['Bonjour', 'Bonjour', 'Bonsoir'][departureDayPhase]='Bonjour' %}, ici votre commandant de bord. [Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Nous sommes en train de finaliser les préparatifs pour le départ et nous allons bientôt nous envoler. Merci d'avoir choisi de voyager avec nous aujourd'hui.",
        "it": "{% ['Buongiorno', 'Buon pomeriggio', 'Buonasera'][departureDayPhase]='Buongiorno' %}, parla il vostro commandante. [Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Stiamo finendo i preparativi per la partenza e decolleremo a breve. Grazie per aver scelto di volare con noi.",
        "tr": "{% ['Günaydın', 'İyi günler', 'İyi akşamlar'][departureDayPhase]='Merhaba' %}, kaptanınız konuşuyor. [Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Şu anda kalkışa hazırlanıyoruz ve kısa süre sonra yola çıkacağız. Bugün bizimle uçmayı seçtiğiniz için teşekkür ederiz.",
        "nl": "{% ['Goedemorgen', 'Goedemiddag', 'Goedenavond'][departureDayPhase]='Hallo' %}, hier spreekt uw gezagvoerder. [Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Wij bereiden ons momenteel voor op vertrek en zullen binnenkort opstijgen. Bedankt dat u heeft gekozen om vandaag met ons te vliegen.",
        "ko": "안녕하세요, 기장님입니다. [Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] 현재 출발 준비 중이며 곧 이륙할 예정입니다. 오늘 저희 비행기를 이용해 주셔서 감사합니다.",
        "pt_pt": "Caros passageiros, fala o vosso comandante. [Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Estamos atualmente a preparar-nos para a descolagem e partiremos em breve. Obrigado por terem escolhido voar connosco hoje.",
        "no": "{% ['God morgen', 'God ettermiddag', 'God kveld'][departureDayPhase]='Hei' %}, dette er kapteinen som snakker. [Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Vi er for øyeblikket i ferd med å forberede oss til avgang, og forventer å sette i gang straks. Takk for at dere valgte å fly med oss i dag.",
        "th": "นี่คือกัปตันของท่าน ยินดีต้อนรับสู่สายการบิน {airlineName} จาก {originCityName} ซึ่งจะเดินทางไปยัง {destinationCityName} ขณะนี้เรากำลังเตรียมตัวสำหรับการออกเดินทาง และเราจะออกเดินทางในไม่ช้า ขอบคุณที่เลือกใช้บริการกับเราในวันนี้",
        "zh": "女士们，先生们，我是您的机长。[Welcome aboard on this {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] 我们正在准备起飞，稍后即将起飞。感谢您今天选择与我们一同飞行。"
      },
      {
        "en": "{% ['Good morning', 'Good afternoon', 'Good evening'][departureDayPhase]='Hello' %}, this is your captain speaking. Welcome onboard this {aircraftName} aircraft. This is {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}. We are currently preparing for departure and we will be taking off shortly. Thank you for choosing to fly with us today.",
        "pl": "{% ['Dzień dobry', 'Dzień dobry', 'Dobry wieczór'][departureDayPhase]='Dzień dobry' %}, tu kapitan. [Welcome onboard this {aircraftName} aircraft.] [This is {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Obecnie przygotowujemy się do startu i wkrótce rozpoczniemy kołowanie. Dziękujemy za wybór naszego przewoźnika.",
        "de": "{% ['Guten Abend', 'Guten Tag', 'Guten Abend'][departureDayPhase]='Hello' %}, hier spricht Ihr Kapitän. [Welcome onboard this {aircraftName} aircraft.] [This is {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Wir bereiten uns derzeit auf den Abflug vor und werden in Kürze abheben. Vielen Dank, dass Sie sich entschieden haben, heute mit uns zu fliegen.",
        "pt_br": "{% ['Bom dia', 'Boa tarde', 'Boa noite'][departureDayPhase]='Olá' %} aqui é o comandante falando. [Welcome onboard this {aircraftName} aircraft.] [This is {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] No momento estamos nos preparando para a partida e decolaremos em breve. Obrigado por escolher voar conosco hoje.",
        "es": "{% ['Buenos días', 'Buenas tardes', 'Buenas noches'][departureDayPhase]='Hola' %}, este es el capitán. [Welcome onboard this {aircraftName} aircraft.] [This is {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Actualmente nos estamos preparando para el despegue y pronto comenzaremos a rodar. Gracias por elegir nuestro transportista.",
        "fr": "{% ['Bonjour', 'Bonjour', 'Bonsoir'][departureDayPhase]='Bonjour' %}, ici votre commandant de bord. [Welcome onboard this {aircraftName} aircraft.] [This is {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Nous sommes en train de finaliser les préparatifs pour le départ et nous allons bientôt nous envoler. Merci d'avoir choisi de voyager avec nous aujourd'hui.",
        "it": "{% ['Buongiorno', 'Buon pomeriggio', 'Buonasera'][departureDayPhase]='Buongiorno' %}, parla il vostro commandante. [Welcome onboard this {aircraftName} aircraft.] [This is {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Stiamo finendo i preparativi per la partenza e decolleremo a breve. Grazie per aver scelto di volare con noi.",
        "tr": "{% ['Günaydın', 'İyi günler', 'İyi akşamlar'][departureDayPhase]='Merhaba' %}, kaptanınız konuşuyor. [Welcome onboard this {aircraftName} aircraft.] [This is {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Şu anda kalkışa hazırlanıyoruz ve kısa süre sonra yola çıkacağız. Bugün bizimle uçmayı seçtiğiniz için teşekkür ederiz.",
        "nl": "{% ['Goedemorgen', 'Goedemiddag', 'Goedenavond'][departureDayPhase]='Hallo' %}, hier spreekt uw gezagvoerder. [Welcome onboard this {aircraftName} aircraft.] [This is {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Wij bereiden ons momenteel voor op vertrek en zullen binnenkort opstijgen. Bedankt dat u heeft gekozen om vandaag met ons te vliegen.",
        "ko": "안녕하세요, 기장님입니다. [Welcome onboard this {aircraftName} aircraft.] [This is {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] 현재 출발 준비 중이며 곧 이륙할 예정입니다. 오늘 저희 비행기를 이용해 주셔서 감사합니다.",
        "pt_pt": "Caros passageiros, fala o vosso comandante. [Welcome onboard this {aircraftName} aircraft.] [This is {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Estamos atualmente a preparar-nos para a descolagem e partiremos em breve. Obrigado por terem escolhido voar connosco hoje.",
        "no": "{% ['God morgen', 'God ettermiddag', 'God kveld'][departureDayPhase]='Hei' %}, dette er kapteinen som snakker. [Welcome onboard this {aircraftName} aircraft.] [This is {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] Vi er for øyeblikket i ferd med å forberede oss til avgang, og forventer å sette i gang straks. Takk for at dere valgte å fly med oss i dag.",
        "th": "นี่คือกัปตันของท่าน ยินดีต้อนรับสู่สายการบิน {airlineName} จาก {originCityName} ซึ่งจะเดินทางไปยัง {destinationCityName} ขณะนี้เรากำลังเตรียมตัวสำหรับการออกเดินทาง และเราจะออกเดินทางในไม่ช้า ขอบคุณที่เลือกใช้บริการกับเราในวันนี้",
        "zh": "女士们，先生们，我是您的机长。[Welcome onboard this {aircraftName} aircraft.] [This is {airlineName} flight number {flightNumber} from {originCityName} to {destinationCityName}.] 我们正在准备起飞，稍后即将起飞。感谢您今天选择与我们一同飞行。"
      },
      {
        "en": "{% ['Good morning', 'Good afternoon', 'Good evening'][departureDayPhase]='Hello' %}, this is your captain speaking. On behalf of {airlineName} I would like to welcome you on board our {aircraftName} aircraft. Today we're flying from {originCityName} to {destinationCityName}. We are currently preparing for departure and we will be taking off shortly. Thank you for choosing to fly with us today.",
        "pl": "{% ['Dzień dobry', 'Dzień dobry', 'Dobry wieczór'][departureDayPhase]='Dzień dobry' %}, tu kapitan. [On behalf of {airlineName} I would like to welcome you on board our {aircraftName} aircraft.] [Today we're flying from {originCityName} to {destinationCityName}.] Obecnie przygotowujemy się do startu i wkrótce rozpoczniemy kołowanie. Dziękujemy za wybór naszego przewoźnika.",
        "de": "{% ['Guten Abend', 'Guten Tag', 'Guten Abend'][departureDayPhase]='Hello' %}, hier spricht Ihr Kapitän. [On behalf of {airlineName} I would like to welcome you on board our {aircraftName} aircraft.] [Today we're flying from {originCityName} to {destinationCityName}.] Wir bereiten uns derzeit auf den Abflug vor und werden in Kürze abheben. Vielen Dank, dass Sie sich entschieden haben, heute mit uns zu fliegen.",
        "pt_br": "{% ['Bom dia', 'Boa tarde', 'Boa noite'][departureDayPhase]='Olá' %} aqui é o comandante falando. [On behalf of {airlineName} I would like to welcome you on board our {aircraftName} aircraft.] [Today we're flying from {originCityName} to {destinationCityName}.] No momento estamos nos preparando para a partida e decolaremos em breve. Obrigado por escolher voar conosco hoje.",
        "es": "{% ['Buenos días', 'Buenas tardes', 'Buenas noches'][departureDayPhase]='Hola' %}, este es el capitán. [On behalf of {airlineName} I would like to welcome you on board our {aircraftName} aircraft.] [Today we're flying from {originCityName} to {destinationCityName}.] Actualmente nos estamos preparando para el despegue y pronto comenzaremos a rodar. Gracias por elegir nuestro transportista.",
        "fr": "{% ['Bonjour', 'Bonjour', 'Bonsoir'][departureDayPhase]='Bonjour' %}, ici votre commandant de bord. [On behalf of {airlineName} I would like to welcome you on board our {aircraftName} aircraft.] [Today we're flying from {originCityName} to {destinationCityName}.] Nous sommes en train de finaliser les préparatifs pour le départ et nous allons bientôt nous envoler. Merci d'avoir choisi de voyager avec nous aujourd'hui.",
        "it": "{% ['Buongiorno', 'Buon pomeriggio', 'Buonasera'][departureDayPhase]='Buongiorno' %}, parla il vostro commandante. [On behalf of {airlineName} I would like to welcome you on board our {aircraftName} aircraft.] [Today we're flying from {originCityName} to {destinationCityName}.] Stiamo finendo i preparativi per la partenza e decolleremo a breve. Grazie per aver scelto di volare con noi.",
        "tr": "{% ['Günaydın', 'İyi günler', 'İyi akşamlar'][departureDayPhase]='Merhaba' %}, kaptanınız konuşuyor. [On behalf of {airlineName} I would like to welcome you on board our {aircraftName} aircraft.] [Today we're flying from {originCityName} to {destinationCityName}.] Şu anda kalkışa hazırlanıyoruz ve kısa süre sonra yola çıkacağız. Bugün bizimle uçmayı seçtiğiniz için teşekkür ederiz.",
        "nl": "{% ['Goedemorgen', 'Goedemiddag', 'Goedenavond'][departureDayPhase]='Hallo' %}, hier spreekt uw gezagvoerder. [On behalf of {airlineName} I would like to welcome you on board our {aircraftName} aircraft.] [Today we're flying from {originCityName} to {destinationCityName}.] Wij bereiden ons momenteel voor op vertrek en zullen binnenkort opstijgen. Bedankt dat u heeft gekozen om vandaag met ons te vliegen.",
        "ko": "안녕하세요, 기장님입니다. [On behalf of {airlineName} I would like to welcome you on board our {aircraftName} aircraft.] [Today we're flying from {originCityName} to {destinationCityName}.] 현재 출발 준비 중이며 곧 이륙할 예정입니다. 오늘 저희 비행기를 이용해 주셔서 감사합니다.",
        "pt_pt": "Caros passageiros, fala o vosso comandante. [On behalf of {airlineName} I would like to welcome you on board our {aircraftName} aircraft.] [Today we're flying from {originCityName} to {destinationCityName}.] Estamos atualmente a preparar-nos para a descolagem e partiremos em breve. Obrigado por terem escolhido voar connosco hoje.",
        "no": "{% ['God morgen', 'God ettermiddag', 'God kveld'][departureDayPhase]='Hei' %}, dette er kapteinen som snakker. [On behalf of {airlineName} I would like to welcome you on board our {aircraftName} aircraft.] [Today we're flying from {originCityName} to {destinationCityName}.] Vi er for øyeblikket i ferd med å forberede oss til avgang, og forventer å sette i gang straks. Takk for at dere valgte å fly med oss i dag.",
        "th": "นี่คือกัปตันของท่าน ยินดีต้อนรับสู่สายการบิน {airlineName} จาก {originCityName} ซึ่งจะเดินทางไปยัง {destinationCityName} ขณะนี้เรากำลังเตรียมตัวสำหรับการออกเดินทาง และเราจะออกเดินทางในไม่ช้า ขอบคุณที่เลือกใช้บริการกับเราในวันนี้",
        "zh": "女士们，先生们，我是您的机长。[On behalf of {airlineName} I would like to welcome you on board our {aircraftName} aircraft.] [Today we're flying from {originCityName} to {destinationCityName}.] 我们正在准备起飞，稍后即将起飞。感谢您今天选择与我们一同飞行。"
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
        "en": "Hello and welcome aboard. My name is {crewName} and I am your purser on this flight. As you could hear from our captain - we are currently preparing for departure and we will be taking off shortly. Please make sure that your seatbelt is fastened and your seat back and tray table are in the upright position. Please turn off all personal electronic devices, including laptops and cell phones. Smoking is prohibited for the duration of the flight. If you have any questions or need assistance, please don't hesitate to ask me or one of my colleagues.",
        "pl": "Witamy na pokładzie. Nazywam się {crewName} i jestem członkiem załogi pokładowej podczas tego lotu. Jak mogli państwo usłyszeć od naszego kapitana - obecnie przygotowujemy się do startu i wkrótce rozpoczniemy kołowanie. Prosimy o zapięcie pasów bezpieczeństwa, ustawienie oparcia fotela i stolika w pozycji pionowej. Prosimy o wyłączenie wszystkich urządzeń elektronicznych, w tym laptopów i telefonów komórkowych. Palenie jest zabronione podczas trwania lotu. Jeśli mają państwo jakieś pytania lub potrzebują pomocy, proszę zwrocić się do mnie lub jednego z moich kolegów.",
        "de": "Hallo und willkommen an Bord. Mein Name ist {crewName} und bin ihr Purser auf diesem Flug. Wie Sie von unserem Kapitän hören konnten, bereiten wir uns derzeit auf die Abreise vor und werden in Kürze abheben. Bitte stellen Sie sicher, dass Ihr Sicherheitsgurt angelegt ist und sich Ihre Rückenlehne und Ihr Tabletttisch in einer aufrechten Position befinden. Bitte schalten Sie alle persönlichen elektronischen Geräte, einschließlich Laptops und Mobiltelefone, aus. Für die Dauer des Fluges ist das Rauchen verboten. Wenn Sie Fragen haben oder Hilfe benötigen, zögern Sie bitte nicht, mich oder einen meiner Kollegen anzusprechen.",
        "pt_br": "Olá bem-vindos a bordo. Meu nome é {crewName} e sou o membro do time de comissários deste voo. Como vocês puderam ouvir do nosso comandante, estamos nos preparando para a partida e decolaremos em breve. Pedimos que afivelem os cintos de segurança neste momento e guardem toda a bagagem embaixo do assento ou nos compartimentos superiores. Pedimos também que retornem seus assentos para a posição vertical, feche e trave a mesinha a sua frente. Desligue todos os dispositivos eletrônicos pessoais, incluindo laptops e telefones celulares. É proibido fumar durante o voo. Caso tenha alguma dúvida ou se precisar de ajuda, não hesite em perguntar a um dos comissários.",
        "es": "Hola y bienvenido a bordo. Mi nombre es {crewName} y soy miembro de la tripulación de cabina de este vuelo. Como pudo saber de nuestro capitán, actualmente nos estamos preparando para la salida y despegaremos en breve. Asegúrese de que su cinturón de seguridad esté abrochado y que el respaldo del asiento y la bandeja estén en posición vertical. Apague todos los dispositivos electrónicos personales, incluidas las computadoras portátiles y los teléfonos celulares. Está prohibido fumar durante la duración del vuelo. Si tiene alguna pregunta o necesita ayuda, no dude en preguntarme a mí o a uno de mis colegas.",
        "fr": "Bonjour et bienvenue à bord. Je m'appelle {crewName} et je suis membre de l'équipage de ce vol. Comme vous l'avez entendu de la part de notre commandant de bord, nous finalisons actuellement les préparatifs pour le départ et nous allons bientôt décoller. Veuillez vous assurer que votre ceinture de sécurité est attachée et que votre dossier de siège ainsi que votre tablette sont en position verticale. Merci d'éteindre tous vos appareils électroniques personnels, y compris les ordinateurs portables et les téléphones portables. Il est interdit de fumer pendant toute la durée du vol. Si vous avez des questions ou besoin d’assistance, n'hésitez pas à me le demander ou à solliciter mes collègues.",
        "it": "Signore e signori vi do il benvenuto a bordo. Mi chiamo {crewName} e sono il membro dell'equipaggio di cabina su questo volo. Come avete sentito dal nostro commandante, al momento ci stiamo preparando per la partenza e decolleremo a breve. Vi preghiamo di assicurarvi che la vostra cintura di sicurezza sia allacciata e che lo schienale del vostro sedile e il tavolino siano in posizione verticale. Spegnete tutti i dispositivi elettronici personali, inclusi laptop e cellulari. È vietato fumare per tutta la durata del volo. Se avete domande o bisogno di assistenza, non esitate a chiedere a me o a uno dei miei colleghi.",
        "tr": "Merhaba ve aramıza hoş geldiniz. Adım {crewName} ve bu uçuşta kabin ekibi üyesiyim. Kaptanımızdan da öğrendiğiniz üzere, şu anda kalkışa hazırlanıyoruz ve kısa süre sonra yola çıkacağız. Lütfen emniyet kemerinizin takılı olduğundan ve koltuk arkalığınızın ve tepsi masanızın dik konumda olduğundan emin olun. Lütfen dizüstü bilgisayarlar ve cep telefonları dahil tüm kişisel elektronik cihazları kapatın. Uçuş süresince sigara içmek yasaktır. Herhangi bir sorunuz varsa veya yardıma ihtiyacınız varsa lütfen bana veya meslektaşlarımdan birine sormaya çekinmeyin.",
        "nl": "Hallo en welkom aan boord. Mijn naam is {crewName} en ik ben uw purser op deze vlucht. Zoals u van de gezagvoerder kon horen -  bereiden wij ons momenteel voor op vertrek en zullen we binnenkort opstijgen. Zorg ervoor dat uw veiligheidsgordel is vastgemaakt en dat de rugleuning en het tafelblad rechtop staan. Schakel alle persoonlijke elektronische apparaten uit, inclusief laptops en mobiele telefoons. Roken is niet toegestaan gedurende de hele vlucht. Als u vragen of hulp nodig heeft, stel deze dan gerust aan een van mijn collega's.",
        "ko": "안녕하세요. 승객 여러분, 탑승을 환영합니다. 저는 이 비행기의 객실 승무원입니다. 기장님이 말씀하신 것처럼, 현재 출발을 준비하고 있으며 곧 이륙할 예정입니다. 좌석벨트를 매고 좌석 등받이와 앞좌석 선반이 똑바로 접혀있는지 확인하십시오. 노트북과 휴대전화를 포함한 모든 개인 전자 기기의 전원을 꺼주세요. 비행 중에는 흡연이 금지되어 있습니다. 궁금한 점이나 도움이 필요한 경우 주저하지 마시고 객실 승무원들에게 문의바랍니다.",
        "pt_pt": "Olá e bem-vindos a bordo. O meu nome é {crewName} e sou o tripulante de cabine deste voo. Como ouviram do nosso comandante, estamos atualmente a preparar-nos para a descolagem e partiremos em breve. Por favor, certifiquem-se de que o vosso cinto de segurança está apertado e o encosto do vosso assento e a mesa estão na posição vertical. Por favor, desliguem todos os dispositivos eletrónicos pessoais, incluindo portáteis e telemóveis. É proibido fumar durante todo o voo. Se tiverem alguma dúvida ou precisarem de assistência, não hesitem em pedir a mim ou a um dos meus colegas.",
        "no": "Hei og velkommen om bord. Jeg heter {crewName} og jeg er kabinpersonalet på denne flyvningen. Som dere har hørt fra kapteinen, forbereder vi oss nå for avgang, og vi vil ta av snart. Vennligst sørg for at sikkerhetsbeltet er festet, og at seteryggen og bordet er i oppreist posisjon. Vennligst slå av alle personlige elektroniske enheter, inkludert bærbare datamaskiner og mobiltelefoner. Røyking er forbudt under hele flyturen. Hvis dere har noen spørsmål eller trenger assistanse, ikke nøl med å spørre meg eller en av mine kolleger.",
        "th": "สวัสดีและยินดีต้อนรับสู่สายการบิน ดิฉัน {crewName} เป็นพนักงานต้อนรับบนเที่ยวบินนี้ ขณะนี้เรากำลังเตรียมตัวสำหรับการออกเดินทาง และจะออกเดินทางในไม่ช้า กรุณานั่งประจำที่และรัดเข็มขัดที่นั่ง ปรับพนักเก้าอี้ของท่านให้อยู่ในระดับตรง พับโต๊ะหน้าที่นั่ง กรุณาปิดอุปกรณ์อิเล็กทรอนิกส์ รวมถึงแล็ปท็อปและโทรศัพท์มือถือ และเราขอเรียนให้ท่านทราบว่า เราเป็นสายการบินปรอดบุหรี่ หากท่านมีข้อสงสัยหรือต้องการความช่วยเหลือ กรุณาติดต่อสอบถามได้จากพนักงานทุกคน",
        "zh": "女士们，先生们，欢迎登机。我叫 {crewName}，是此次航班的乘务员。正如机长所说，我们正在准备起飞，稍后即将起飞。请确保您的安全带已系好，座椅靠背和小桌板处于竖直状态。请关闭所有个人电子设备，包括笔记本电脑和手机。飞行期间禁止吸烟。如有任何问题或需要帮助，请随时向我或其他乘务员提出。"
      },
      {
        "en": "Ladies and gentlemen, welcome onboard. My name is {crewName} and I am your purser on this flight. We ask that you please fasten your seatbelts at this time and secure all baggage underneath your seat or in the overhead compartments. We also ask that your seats and table trays are in the upright position for take-off. Please turn off all personal electronic devices, including laptops and cell phones. Smoking is prohibited for the duration of the flight. Thank you for choosing {airlineName}. Enjoy your flight.",
        "pl": "Panie i panowie, witamy na pokładzie. Nazywam się {crewName} i jestem członkiem załogi pokładowej podczas tego lotu. Prosimy o zapięcie pasów bezpieczeństwa i umieszczenie bagażu pod siedzeniem lub w schowkach bagażowych. Prosimy również o ustawienie oparcia fotela i stolika w pozycji pionowej przed startem. Prosimy o wyłączenie wszystkich urządzeń elektronicznych, w tym laptopów i telefonów komórkowych. Palenie jest zabronione podczas trwania lotu. [Thank you for choosing {airlineName}.] Życzymy miłego lotu.",
        "de": "Sehr geehrte Damen und Herren, willkommen an Bord. Mein Name ist {crewName} und ich bin ihr Purser auf diesem Flug. Wir bitten Sie, zu diesem Zeitpunkt Ihre Sicherheitsgurte anzulegen und das gesamte Gepäck unter Ihrem Sitz oder in den Gepäckfächern zu verstauen. Wir bitten Sie außerdem, dass sich Ihre Sitze und Tischablagen zum Abflug in aufrechter Position befinden. Bitte schalten Sie alle persönlichen elektronischen Geräte, einschließlich Laptops und Mobiltelefone, aus. Für die Dauer des Fluges ist das Rauchen verboten. [Thank you for choosing {airlineName}.] Guten Flug.",
        "pt_br": "Senhoras e senhores, sejam bem-vindos a bordo. Meu nome é {crewName} e sou o membro do time de comissários deste voo. Pedimos que afivelem os cintos de segurança neste momento e guarde toda a bagagem embaixo do assento ou nos compartimentos superiores. Pedimos também que retornem seus assentos para a posição vertical, feche e trave a mesinha a sua frente. Desligue todos os dispositivos eletrônicos pessoais, incluindo laptops e telefones celulares. É proibido fumar durante o voo. [Thank you for choosing {airlineName}.] Aproveite seu voo.",
        "es": "Damas y caballeros, bienvenidos a bordo. Mi nombre es {crewName} y soy miembro de la tripulación de cabina de este vuelo. Le pedimos que se abrochen los cinturones de seguridad en este momento y aseguren todo el equipaje debajo de su asiento o en los compartimentos superiores. También solicitamos que sus asientos y bandejas de mesa estén en posición vertical para el despegue. Apague todos los dispositivos electrónicos personales, incluidas las computadoras portátiles y los teléfonos celulares. Está prohibido fumar durante la duración del vuelo. [Thank you for choosing {airlineName}.] Disfruta tu vuelo.",
        "fr": "Mesdames et messieurs, nous vous souhaitons la bienvenue à bord. Je m'appelle {crewName} et je suis membre de l'équipage de ce vol. Nous vous demandons de bien vouloir attacher vos ceintures de sécurité dès maintenant et de ranger tous vos bagages sous votre siège ou dans les compartiments supérieurs. Veuillez également vous assurer que vos sièges et vos tablettes sont en position verticale pour le décollage. Merci d'éteindre tous les appareils électroniques personnels, y compris les ordinateurs portables et les téléphones portables. Il est interdit de fumer pendant toute la durée du vol. [Thank you for choosing {airlineName}.] Bon vol !",
        "it": "Signore e signori, benvenuti a bordo. Mi chiamo {crewName} e sono il membro dell’equipaggio di cabina su questo volo. Vi chiediamo di allacciare le cinture di sicurezza in questo momento e di riporre tutti i bagagli sotto il sedile o negli appositi alloggiamenti sopra di voi. Vi preghiamo inoltre di mettere i sedili e i tavolini in posizione verticale per il decollo. Spegnete tutti i dispositivi elettronici personali, inclusi laptop e telefoni cellulari. È vietato fumare per tutta la durata del volo. [Thank you for choosing {airlineName}.] Vi auguriamo un buon volo.",
        "tr": "Bayanlar ve baylar, gemiye hoş geldiniz. Adım {crewName} ve bu uçuşta kabin ekibi üyesiyim. Bu sırada emniyet kemerlerinizi takmanızı ve tüm bagajlarınızı koltuğunuzun altına veya baş üstü bölmelere yerleştirmenizi rica ediyoruz. Ayrıca kalkış için koltuklarınızın ve masa tablalarınızın dik konumda olmasını rica ediyoruz. Lütfen dizüstü bilgisayarlar ve cep telefonları dahil tüm kişisel elektronik cihazları kapatın. Uçuş süresince sigara içmek yasaktır. [Thank you for choosing {airlineName}.] İyi uçuşlar.",
        "nl": "Dames en heren, welkom aan boord. Mijn naam is {crewName} en ik ben uw purser op deze vlucht. Wij vragen u om op dit moment uw veiligheidsgordels vast te maken en alle bagage onder uw stoel of in de bagagevakken boven uw hoofd op te bergen. We vragen ook dat uw stoelen en tafelbladen rechtop staan voor het opstijgen. Schakelt u alstublieft alle persoonlijke elektronische apparaten uit, inclusief laptops en mobiele telefoons. Roken is niet toegestaan gedurende de hele vlucht. [Thank you for choosing {airlineName}.] Fijne vlucht.",
        "ko": "승객 여러분, 탑승을 환영합니다. [My name is {crewName} and I am the cabin crew member on this flight.] 자리에 앉으셔서 좌석벨트를 매시고 좌석 아래 또는 머리 위 칸의 모든 수하물을 고정해 주시기 바랍니다. 또한 이륙을 위해 좌석과 앞좌석 선반이 똑바로 접혀있는지 확인해주시고 노트북과 휴대전화를 포함한 모든 개인 전자 기기의 전원을 꺼주시기 바랍니다. 비행 중에는 흡연이 금지되어 있습니다. {airlineName} 항공편을 선택해 주셔서 감사합니다. 즐거운 비행 되세요.",
        "pt_pt": "Senhoras e senhores, bem-vindos a bordo. O meu nome é {crewName} e sou o tripulante de cabine deste voo. Pedimos que, por favor, apertem os cintos de segurança neste momento e guardem toda a bagagem debaixo do vosso assento ou nos compartimentos superiores. Pedimos também que os vossos assentos e mesas estejam na posição vertical para a descolagem. Por favor, desliguem todos os dispositivos eletrónicos pessoais, incluindo portáteis e telemóveis. É proibido fumar durante todo o voo. [Thank you for choosing {airlineName}.] Desejamos-vos um bom voo.",
        "no": "Mine damer og herrer, velkommen om bord. Jeg heter {crewName} og jeg er kabinpersonalet på denne flyvningen. Vi ber dere vennligst om å feste sikkerhetsbeltene nå og sikre alt bagasje under setet deres eller i de oppbevaringsrommene over hodet. Vi ber også om at setene og bordene deres er i oppreist posisjon for avgang. Vennligst slå av alle personlige elektroniske enheter, inkludert bærbare datamaskiner og mobiltelefoner. Røyking er forbudt under hele flyturen. [Thank you for choosing {airlineName}.] Nyt flyturen.",
        "th": "ท่านผู้โดยสารทุกท่าน ยินดีต้อนรับสู่เที่ยวบินนี้ ดิฉัน {crewName} เป็นพนักงานต้อนรับบนสายการบินของท่านในวันนี้ กรุณานั่งประจำที่และรัดเข็มขัดที่นั่ง ปรับพนักเก้าอี้ของท่านให้อยู่ในระดับตรง พับโต๊ะหน้าที่นั่ง กรุณาปิดอุปกรณ์อิเล็กทรอนิกส์ รวมถึงแล็ปท็อปและโทรศัพท์มือถือ และเราขอเรียนให้ท่านทราบว่า เราเป็นสายการบินปรอดบุหรี่  ขอบคุณที่เลือกใช้บริการ {airlineName} ขอให้ท่านมีความสุขกับการเดินทาง",
        "zh": "女士们，先生们，欢迎登上 {airlineName} 航班。我叫 {crewName}，是此次航班的乘务员。请您现在系好安全带，并将所有行李放置在座位下或头顶行李架内。请将座椅靠背和小桌板调整至竖直状态，以便起飞。请关闭所有个人电子设备，包括笔记本电脑和手机。[Thank you for choosing {airlineName}.]"
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
        "en": "Welcome aboard on this {airlineName} flight number {flightNumber}. Today we are flying from {originCityName} to {destinationCityName}. My name is {crewName} and I am your purser on this flight. We are currently preparing for departure and we will be taking off shortly. Please make sure that your seatbelt is fastened and your seat back and tray table are in the upright position. If you have any questions or need assistance, please don't hesitate to ask me or one of my colleagues. Thank you for flying with {airlineName}.",
        "pl": "[Welcome aboard on this {airlineName} flight number {flightNumber}.] [Today we are flying from {originCityName} to {destinationCityName}.] Nazywam się {crewName} i jestem członkiem załogi podczas tego lotu. Obecnie przygotowujemy się do startu i wkrótce rozpoczniemy kołowanie. Prosimy o zapięcie pasów bezpieczeństwa, ustawienie oparcia fotela i stolika w pozycji pionowej. Jeśli mają państwo jakieś pytania lub potrzebują pomocy, proszę nie wahajcie się zwrócić do mnie lub jednego z moich kolegów. [Thank you for flying with {airlineName}.]",
        "de": "[Welcome aboard on this {airlineName} flight number {flightNumber}.] [Today we are flying from {originCityName} to {destinationCityName}.] Mein Name ist {crewName} und ich bin ihr Purser auf diesem Flug. Wir bereiten uns derzeit auf den Abflug vor und werden in Kürze abheben. Bitte stellen Sie sicher, dass Ihr Sicherheitsgurt angelegt ist und sich Ihre Rückenlehne und Ihr Tabletttisch in einer aufrechten Position befinden. Wenn Sie Fragen haben oder Hilfe benötigen, zögern Sie bitte nicht, mich oder einen meiner Kollegen zu anzusprechen. [Thank you for flying with {airlineName}.]",
        "pt_br": "[Welcome aboard on this {airlineName} flight number {flightNumber}.] [Today we are flying from {originCityName} to {destinationCityName}.] Meu nome é {crewName} e sou o membro do time de comissários deste voo. No momento estamos nos preparando para a partida e decolaremos em breve. Pedimos que afivelem o seu cinto de segurança e retornem seus assentos para a posição vertical. feche e trave a mesinha a sua frente. Caso tenha alguma dúvida ou se precisar de ajuda, não hesite em perguntar a um dos comissários. [Thank you for flying with {airlineName}.]",
        "es": "[Welcome aboard on this {airlineName} flight number {flightNumber}.] [Today we are flying from {originCityName} to {destinationCityName}.] Mi nombre es {crewName} y soy miembro de la tripulación de este vuelo. Actualmente nos estamos preparando para el despegue y pronto comenzaremos a rodar. Abróchese los cinturones de seguridad y coloque el respaldo del asiento y la mesa en posición vertical. Si tiene alguna pregunta o necesita ayuda, no dude en ponerse en contacto conmigo o con uno de mis colegas. [Thank you for flying with {airlineName}.]",
        "fr": "[Welcome aboard on this {airlineName} flight number {flightNumber}.] [Today we are flying from {originCityName} to {destinationCityName}.] Je m'appelle {crewName} et je suis membre de l'équipage de ce vol. Nous nous préparons actuellement pour le départ et nous allons bientôt débuter notre voyage. Veuillez vous assurer que votre ceinture de sécurité est attachée et que votre dossier de siège ainsi que votre tablette sont en position verticale. Si vous avez des questions ou besoin d'assistance, n'hésitez pas à me le demander ou à solliciter mes collègues. [Thank you for flying with {airlineName}.]",
        "it": "[Welcome aboard on this {airlineName} flight number {flightNumber}.] [Today we are flying from {originCityName} to {destinationCityName}.] Mi chiamo {crewName} e sono il membro dell’equipaggio di cabina su questo volo. Stiamo attualmente preparando il decollo e partiremo a breve. Vi preghiamo di assicurarvi che la vostra cintura di sicurezza sia allacciata e che lo schienale del vostro sedile e il tavolino siano in posizione verticale. Se avete domande o bisogno di assistenza, non esitate a chiedere a me o a uno dei miei colleghi. [Thank you for flying with {airlineName}.]",
        "tr": "[Welcome aboard on this {airlineName} flight number {flightNumber}.] [Today we are flying from {originCityName} to {destinationCityName}.] Adım {crewName} ve bu uçuşta kabin ekibi üyesiyim. Şu anda kalkışa hazırlanıyoruz ve kısa süre sonra yola çıkacağız. Lütfen emniyet kemerinizin takılı olduğundan ve koltuk arkalığınızın ve tepsi masanızın dik konumda olduğundan emin olun. Herhangi bir sorunuz varsa veya yardıma ihtiyacınız varsa lütfen bana veya meslektaşlarımdan birine sormaya çekinmeyin. [Thank you for flying with {airlineName}.]",
        "nl": "[Welcome aboard on this {airlineName} flight number {flightNumber}.] [Today we are flying from {originCityName} to {destinationCityName}.] Mijn naam is {crewName} en ik ben uw purser op deze vlucht. Wij bereiden ons momenteel voor op vertrek en zullen binnenkort opstijgen. Zorgt u er alstublieft voor dat uw veiligheidsgordel is vastgemaakt en dat de rugleuning en het tafelblad rechtop staan. Als u vragen of hulp nodig heeft, stel deze dan gerust aan een van mijn collega's. [Thank you for flying with {airlineName}.]",
        "ko": "[Welcome aboard on this {airlineName} flight number {flightNumber}.] [Today we are flying from {originCityName} to {destinationCityName}.] 제 이름은 {crewName}이고 이 항공편의 객실 승무원입니다. 현재 출발을 준비하고 있으며 곧 이륙할 예정입니다. 좌석벨트가 잘 매여 있고 좌석 등받이와 앞좌석 선반이 똑바로 접혀있는지 확인하십시오. 질문이 있거나 도움이 필요하면 주저하지 말고 객실 승무원에게 물어보세요. [Thank you for flying with {airlineName}.]",
        "pt_pt": "[Welcome aboard on this {airlineName} flight number {flightNumber}.] [Today we are flying from {originCityName} to {destinationCityName}.] O meu nome é {crewName} e sou o tripulante de cabine deste voo. Estamos atualmente a preparar-nos para a descolagem e partiremos em breve. Por favor, certifiquem-se de que o vosso cinto de segurança está apertado e o encosto do vosso assento e a mesa estão na posição vertical. Se tiverem alguma dúvida ou precisarem de assistência, não hesitem em pedir a mim ou a um dos meus colegas. [Thank you for flying with {airlineName}.]",
        "no": "[Welcome aboard on this {airlineName} flight number {flightNumber}.] [Today we are flying from {originCityName} to {destinationCityName}.] Jeg heter {crewName} og jeg er kabinpersonalet på denne flyvningen. Vi er for øyeblikket i ferd med å forberede avgang, og vi vil ta av snart. Vennligst sørg for at sikkerhetsbeltet er festet, og at seteryggen og bordet er i oppreist posisjon. Hvis dere har spørsmål eller trenger assistanse, ikke nøl med å spørre meg eller en av mine kolleger. [Thank you for flying with {airlineName}.]",
        "th": "ยินดีต้อนรับบนเที่ยวบิน {airlineName} วันนี้เราเดินทางจาก {originCityName} ซึ่งจะเดินทางไป {destinationCityName} ดิฉัน {crewName} เป็นพนักงานต้อนรับบนเที่ยวบินนี้ ขณะนี้เรากำลังเตรียมตัวออกเดินทาง และจะออกเดินทางในไม่ช้า กรุณานั่งประจำที่และรัดเข็มขัดที่นั่ง ปรับพนักเก้าอี้ของท่านให้อยู่ในระดับตรง พับโต๊ะหน้าที่นั่ง หากท่านมีข้อสงสัยหรือต้องการความช่วยเหลือ กรุณาติดต่อสอบถามได้จากพนักงานบริการ ขอบคุณที่เลือกใช้บริการ {airlineName}",
        "zh": "[Welcome aboard on this {airlineName} flight number {flightNumber}.] [Today we are flying from {originCityName} to {destinationCityName}.] 我是 {crewName}，此次航班的乘务员。我们正在准备起飞，稍后即将起飞。请确保您的安全带已系好，座椅靠背和小桌板处于竖直状态。如有任何问题或需要帮助，请随时向我或其他乘务员提出。[Thank you for flying with {airlineName}.]"
      },
      {
        "en": "Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}. My name is {crewName} and I am your purser on this flight. We ask that you please fasten your seatbelts at this time and secure all baggage underneath your seat or in the overhead compartments. We also ask that your seats and table trays are in the upright position for take-off. Please turn off all personal electronic devices, including laptops and cell phones. Smoking is prohibited for the duration of the flight. Thank you for choosing {airlineName}. Enjoy your flight.",
        "pl": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Nazywam się {crewName} i jestem członkiem załogi podczas tego lotu. Prosimy o zapięcie pasów bezpieczeństwa i umieszczenie bagażu pod siedzeniem lub w schowkach bagażowych. Prosimy również o ustawienie oparcia fotela i stolika w pozycji pionowej przed startem. Prosimy o wyłączenie wszystkich urządzeń elektronicznych, w tym laptopów i telefonów komórkowych. Palenie jest zabronione podczas trwania lotu. [Thank you for choosing {airlineName}.] Życzymy miłego lotu.",
        "de": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mein Name ist {crewName} und ich bin ihr Purser auf diesem Flug. Wir bitten Sie, zu diesem Zeitpunkt Ihre Sicherheitsgurte anzulegen und das gesamte Gepäck unter Ihrem Sitz oder in den Gepäckfächern zu verstauen. Wir bitten Sie außerdem, Ihre Sitze und Tischablagen zum Abflug in eine aufrechte Position zu bringen. Bitte schalten Sie alle persönlichen elektronischen Geräte, einschließlich Laptops und Mobiltelefone, aus. Für die Dauer des Fluges ist das Rauchen verboten. [Thank you for choosing {airlineName}.] Guten Flug.",
        "pt_br": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Meu nome é {crewName} e sou o membro do time de comissários deste voo. Pedimos que afivelem os cintos de segurança neste momento e guarde toda a bagagem embaixo do assento ou nos compartimentos superiores. Pedimos também que retornem seus assentos para a posição vertical, feche e trave a mesinha a sua frente. Desligue todos os dispositivos eletrônicos pessoais, incluindo laptops e telefones celulares. É proibido fumar durante o voo. [Thank you for choosing {airlineName}.] Aproveite seu voo.",
        "es": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mi nombre es {crewName} y soy miembro de la tripulación de este vuelo. Abróchense los cinturones de seguridad y coloquen su equipaje debajo del asiento o en los maleteros. También le pedimos que coloque el respaldo del asiento y la mesa en posición vertical antes del despegue. Apague todos los dispositivos electrónicos, incluidas las computadoras portátiles y los teléfonos celulares. Está prohibido fumar durante el vuelo. [Thank you for choosing {airlineName}.] Que tengas un buen vuelo.",
        "fr": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Je m'appelle {crewName} et je suis membre de l'équipage de ce vol. Nous vous demandons de bien vouloir attacher vos ceintures de sécurité et de ranger tous vos bagages sous votre siège ou dans les compartiments supérieurs. Veuillez également vous assurer que vos sièges et vos tablettes sont en position verticale pour le décollage. Merci d'éteindre tous les appareils électroniques personnels, y compris les ordinateurs portables et les téléphones portables. Nous vous rappelons qu'il est strictement interdit de fumer à bord de cet avion. [Thank you for choosing {airlineName}.] Passez un agréable vol.",
        "it": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mi chiamo {crewName} e sono il membro dell’equipaggio di cabina su questo volo. Vi chiediamo di allacciare le cinture di sicurezza in questo momento e di sistemare tutti i bagagli sotto il sedile o nei compartimenti sopraelevati. Vi preghiamo inoltre di mettere i sedili e i tavolini in posizione verticale per il decollo. Spegnete tutti i dispositivi elettronici personali, inclusi laptop e telefoni cellulari. Vi ricordiamo che a bordo di questo aereo è vietato fumare. [Thank you for choosing {airlineName}.] Buon volo.",
        "tr": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Adım {crewName} ve bu uçuşta kabin ekibi üyesiyim. Bu sırada emniyet kemerlerinizi takmanızı ve tüm bagajlarınızı koltuğunuzun altına veya baş üstü bölmelere yerleştirmenizi rica ediyoruz. Ayrıca kalkış için koltuklarınızın ve tepsi masalarınızın dik konumda olmasını rica ediyoruz. Lütfen dizüstü bilgisayarlar ve cep telefonları dahil tüm kişisel elektronik cihazları kapatın. Uçuş süresince sigara içmek yasaktır. [Thank you for choosing {airlineName}.] İyi uçuşlar.",
        "nl": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Mijn naam is {crewName} en ik ben uw purser op deze vlucht. Wij vragen u om op dit moment uw veiligheidsgordels vast te maken en alle bagage onder uw stoel of in de bagagevakken boven uw hoofd op te bergen. We vragen ook dat uw stoelen en tafelbladen rechtop staan voor het opstijgen. Schakelt u alstublieft alle persoonlijke elektronische apparaten uit, inclusief laptops en mobiele telefoons. Roken is niet toegestaan gedurende de hele vlucht. [Thank you for choosing {airlineName}.] Fijne vlucht.",
        "ko": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] 저는 이 항공편의 객실 승무원입니다. 자리에 앉아서 좌석벨트를 매시고 좌석 아래 또는 머리 위칸에 모든 수하물을 고정해 주시기 바랍니다. 또한 이륙을 위해 좌석과 앞좌석 선반이 똑바로 접혀있는지 확인해주세요. 노트북과 휴대전화를 포함한 모든 개인 전자 기기의 전원을 꺼주시기 바랍니다. 비행 중에는 흡연이 금지되어 있습니다. [Thank you for flying with {airlineName}.]",
        "pt_pt": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] O meu nome é {crewName} e sou o tripulante de cabine deste voo. Pedimos que, por favor, apertem os cintos de segurança neste momento e guardem toda a bagagem debaixo do vosso assento ou nos compartimentos superiores. Pedimos também que os vossos assentos e mesas estejam na posição vertical para a descolagem. Por favor, desliguem todos os dispositivos eletrónicos pessoais, incluindo portáteis e telemóveis. É proibido fumar durante todo o voo. [Thank you for choosing {airlineName}.] Desejamos-vos um bom voo.",
        "no": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] Jeg heter {crewName} og jeg er kabinpersonalet på denne flyvningen. Vi ber dere vennligst om å feste sikkerhetsbeltene nå og sikre alt bagasje under setet deres eller i de oppbevaringsrommene over hodet. Vi ber også om at setene og bordene deres er i oppreist posisjon for avgang. Vennligst slå av alle personlige elektroniske enheter, inkludert bærbare datamaskiner og mobiltelefoner. Røyking er forbudt under hele flyturen. [Thank you for choosing {airlineName}.] Nyt flyturen.",
        "th": "ท่านผู้โดยสารทุกท่าน ยินดีต้อนรับสู่สายการบิน {airlineName} จาก {originCityName} ซึ่งจะเดินทางไป {destinationCityName} ดิฉัน {crewName} เป็นพนักงานต้อนรับบนเครื่องบินของท่านในวันนี้ กรุณานั่งประจำที่และรัดเข็มขัดที่นั่ง ปรับพนักเก้าอี้ของท่านให้อยู่ในระดับตรง พับโต๊ะหน้าที่นั่ง กรุณาปิดอุปกรณ์อิเล็กทรอนิกส์ รวมถึงแล็ปท็อปและโทรศัพท์มือถือ และเราขอเรียนให้ท่านทราบว่า เราเป็นสายการบินปรอดบุหรี่ ขอบคุณทุกท่านที่เลือกใช้บริการ {airlineName} ขอให้ท่านมีความสุขกับการเดินทาง",
        "zh": "[Ladies and gentlemen, welcome onboard {airlineName} flight from {originCityName} to {destinationCityName}.] 我叫 {crewName}，是此次航班的乘务员。请您现在系好安全带，并将所有行李放置在座位下或头顶行李架内。请将座椅靠背和小桌板调整至竖直状态，以便起飞。请关闭所有个人电子设备，包括笔记本电脑和手机。[Thank you for flying with {airlineName}.]"
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
        "de": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Bitte denken Sie daran, Ihren Sicherheitsgurt immer anzulegen, wenn Sie sitzen und die Anschnallzeichen eingeschaltet sind.",
        "pt_br": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Lembre-se de manter o cinto de segurança afivelado enquanto estiver sentado e sempre que o aviso de atar os cintos estiver aceso.",
        "es": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Recuerde usar el cinturón de seguridad siempre que esté sentado y siempre que esté encendido el aviso de cinturón de seguridad.",
        "fr": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Nous vous rappelons de garder votre ceinture de sécurité attachée pendant que vous êtes assis et chaque fois que le signal de ceinture est allumé. ",
        "it": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Vi ricordiamo di tenere la cintura di sicurezza allacciata mentre siete seduti e ogni volta che il segnale della cintura è acceso.",
        "tr": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Lütfen oturduğunuzda ve emniyet kemeri işareti yandığında emniyet kemerinizi bağlı tutmayı unutmayın.",
        "nl": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Vergeet niet om uw stoelriem gesloten te houden terwijl u zit en wanneer het stoelriemen vast teken brandt.",
        "ko": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] 자리에 앉아 좌석벨트 싸인에 불이 켜질 때마다 좌석벨트 착용 하는것을 잊지마세요.",
        "pt_pt": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Por favor, lembrem-se de manter o cinto de segurança apertado enquanto estiverem sentados e sempre que o sinal de apertar os cintos estiver iluminado.",
        "no": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Vennligst husk å holde sikkerhetsbeltet festet mens dere sitter, og alltid når skiltet med sikkerhetsbeltet er tent.",
        "th": "การเดินทางของเราในวันนี้จะใช้เวลาประมาณ {flightTime} สภาพอากาศใน {destinationCityName} คือ {destinationCityWeatherHumanDescription} กรุณานั่งประจำที่และรัดเข็มขัดที่นั่งในขนะนั่งอยู่กับที่ และทุกครั้งที่กัปตันเปิดสัญญาณแจ้งรัดเข็มขัดนิรภัย",
        "zh": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] 请记得在就座时系好安全带，并在安全带标志亮起时保持系好状态。"
      },
      {
        "en": "Ladies and gentleman, this is your captain speaking again. Our flight today will take approximately {flightTime}. The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}. We expect a smooth flight with a small chance of light turbulences. Please relax and enjoy the flight.",
        "pl": "Panie i Panowie, z tej strony Wasz kapitan. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Spodziwamy się spokojnego lotu z małymi szansami na lekkie turbulencje. Życzę miłego lotu.",
        "de": "Hallo, ich bin es wieder. Ich dachte, ich teile einige Informationen mit Ihnen. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Wir erwarten einen ruhigen Flug mit einer geringen Wahrscheinlichkeit leichter Turbulenzen. Bitte entspannen Sie sich und genießen Sie den Flug.",
        "pt_br": "Olá, sou eu de novo. Gostaria de compartilhar algumas informações com vocês. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.]  Esperamos um vôo tranquilo com pequenas chances de turbulências leve. Por favor, relaxe e aproveite o vôo.",
        "es": "Hola, soy yo de nuevo. Quería compartir algo de información contigo. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Esperamos un vuelo tranquilo con pocas posibilidades de ligeras turbulencias. Que tengas un buen vuelo.",
        "fr": "Mesdames et messieurs, ici le commandant de bord. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Nous prévoyons un vol calme avec une faible possibilité de légères turbulences. Detendez-vous et profiter du vol.",
        "it": "Signore e signori, qui parla di nuovo il vostro comandante. Ecco alcune brevi informazioni sul nostro volo. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Si prevede un volo tranquillo, senza turbolenze. Buon volo.",
        "tr": "Merhaba, yine ben. Sizinle bazı bilgileri paylaşacağımı düşündüm. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Hafif türbülans ihtimalinin düşük olduğu, sorunsuz bir uçuş bekliyoruz. Lütfen rahatlayın ve uçuşun tadını çıkarın.",
        "nl": "Hallo, ik ben het weer. Ik dacht, laat ik wat informatie met jullie delen. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Wij verwachten een voorspoedige vlucht met een kleine kans op lichte turbulentie. Ontspan en geniet van de vlucht.",
        "ko": "안녕하세요. 다시 기장입니다. 승객 여러분들에게 몇가지 정보를 알려드릴까 합니다. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] 가벼운 난기류가 발생할 가능성은 있지만 순조로운 비행을 예상하고 있습니다. 긴장을 풀고 비행을 즐기시기 바랍니다.",
        "pt_pt": "Senhores passageiros, fala novamente o comandante. Queria partilhar algumas informações sobre voo convosco. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Esperamos um voo tranquilo com uma pequena possibilidade de ligeiras turbulências. Por favor, relaxem e desfrutem do voo.",
        "no": "Mine damer og herrer, dette er kapteinen som snakker igjen. [Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] Vi forventer en jevn flytur med liten sjanse for lett turbulens. Vennligst slapp av og nyt flyturen.",
        "th": "ท่านผู้โดยสาร นี่คือกัปตันของท่านอีกครั้ง การเดินทางของเราในวันนี้จะใช้เวลาประมาณ {flightTime} สภาพอากาศใน {destinationCityName} คือ {destinationCityWeatherHumanDescription} เราหวังว่าท่านจะได้รับความสะดวกสบายในการเดินทางในวันนี้  มีการคาดการณ์ว่าจะบินผ่านเขตสภาพอากาศแปรปรวนเล็กน้อย เราหวังเป็นอย่างยิ่งว่าท่านจะได้รับความสะดวกสบายในการเดินทาง",
        "zh": "[Our flight today will take approximately {flightTime}.] [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}.] 我们预计飞行将非常平稳，仅有轻微颠簸的可能。请放松并享受旅程。"
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
        "pt_br": "Senhoras e senhores, logo após a decolagem começaremos a servir lanches e bebidas. Você pode encontrar nosso menu Sky no bolso do assento à sua frente.",
        "es": "Damas y caballeros, poco después del despegue comenzaremos a servir bocadillos y bebidas. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted.",
        "fr": "Mesdames et messieurs, peu après le décollage, nous commencerons à servir des collations et des boissons. Vous trouverez notre menu en cabine dans la pochette de votre siège. ",
        "it": "Signore e signori, subito dopo il decollo inizieremo a servire snack e bevande. Potete consultare il menu nella tasca del sedile di fronte a voi.",
        "tr": "Bayanlar ve baylar, kalkıştan kısa bir süre sonra atıştırmalık ve içecek servisi yapmaya başlayacağız. Gökyüzü menümüzü önünüzdeki koltuk cebinde bulabilirsiniz.",
        "nl": "Dames en heren, kort na het opstijgen beginnen we met het serveren van snacks en drankjes. Ons Sky-menu vindt u in het stoelvak voor u.",
        "ko": "승객 여러분, 이륙 직후 간식과 음료 서비스를 시작하겠습니다. 앞 좌석 주머니에서 스카이 메뉴를 찾을 수 있습니다.",
        "pt_pt": "Senhoras e senhores, pouco depois da descolagem começaremos a servir snacks e bebidas. Podem encontrar o nosso menu de bordo no bolso do assento à vossa frente.",
        "no": "Mine damer og herrer, rett etter avgang vil vi begynne å servere snacks og drikke. Dere kan finne menyen vår i setelommen foran dere.",
        "th": "ท่านผู้โดยสารทุกท่าน หลังจากที่สัญญาณแจ้งรัดเข็มขัดที่นั่งได้ดับลงแล้ว เราจะเริ่มให้บริการของว่างและเครื่องดื่ม ท่านสามารถเลือกดูเมนูบนเครื่องได้ที่ช่องใส่ของหน้าที่นั่งของท่าน",
        "zh": "女士们，先生们，飞机起飞后不久我们将开始提供小吃和饮料。您可以在前方座椅口袋中找到我们的空中菜单。"
      },
      {
        "en": "Shortly after takeoff we'll start serving snacks and drinks. You can find our sky menu in the seat pocket in front of you.",
        "pl": "Krótko po starcie rozpoczniemy serwowanie przekąsek i napojów. Nasze menu znajdą państwo w kieszeni siedzenia przed państwem.",
        "de": "Kurz nach dem Start beginnen wir mit dem Servieren von Snacks und Getränken. Unser Sky-Menü finden Sie in der Sitztasche vor Ihnen.",
        "pt_br": "Logo após a decolagem começaremos a servir lanches e bebidas. Você pode encontrar nosso menu Sky no bolso do assento à sua frente.",
        "es": "Poco después del despegue comenzaremos a servir snacks y bebidas. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted.",
        "fr": "Peu après le décollage, nous commencerons à servir des collations et des boissons. Vous pourrez consulter notre menu en cabine dans la pochette de votre siège.",
        "it": "Poco dopo il decollo inizieremo a servire snack e bevande. Potete trovare il nostro menu nella tasca del sedile di fronte.",
        "tr": "Kalkıştan kısa bir süre sonra atıştırmalık ve içecek servisi yapmaya başlayacağız. Gökyüzü menümüzü önünüzdeki koltuk cebinde bulabilirsiniz.",
        "nl": "Kort na het opstijgen beginnen we met het serveren van snacks en drankjes. Ons Sky-menu vindt u in het stoelvak voor u.",
        "ko": "이륙 직후 간식과 음료 서비스를 시작합니다. 앞 좌석 주머니에서 스카이 메뉴를 찾을 수 있습니다.",
        "pt_pt": "Pouco depois da descolagem, começaremos a servir snacks e bebidas. Podem encontrar o nosso menu de bordo no bolso do assento à vossa frente.",
        "no": "Rett etter avgang vil vi begynne å servere snacks og drikke. Dere kan finne menyen vår i setelommen foran dere.",
        "th": "หลังจากที่สัญญาณแจ้งรัดเข็มขัดที่นั่งได้ดับลงแล้ว เราจะเริ่มให้บริการของว่างและเครื่องดื่ม ท่านสามารถดูเมนูบนเครื่องได้ที่ช่องใส่ของหน้าที่นั่งของท่าน",
        "zh": "飞机起飞后不久我们将开始提供小吃和饮料。您可以在前方座椅口袋中找到我们的空中菜单。"
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
        "pt_br": "[Our flight today will take approximately {flightTime}.] Capitão, me avise sobre as condições do voo para hoje. Logo após a decolagem começaremos a servir lanches e bebidas. Você pode encontrar nosso menu Sky no bolso do assento à sua frente.",
        "es": "[Our flight today will take approximately {flightTime}.] Capitán, simplemente hágame saber que el vuelo debería ser tranquilo. Poco después del despegue comenzaremos a servir snacks y bebidas. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted.",
        "fr": "[Our flight today will take approximately {flightTime}.] Le commandant vient de m'informer que le vol devrait être calme. Peu après le décollage, nous commencerons à servir des collations et des boissons. Vous trouverez notre menu en cabine dans la pochette de votre siège.",
        "it": "[Our flight today will take approximately {flightTime}.] Il comandante mi ha appena informato che il volo dovrebbe essere tranquillo. Poco dopo il decollo, inizieremo a servire snack e bevande. Troverete il nostro menu a bordo nella tasca del sedile davanti a voi.",
        "tr": "[Our flight today will take approximately {flightTime}.] Kaptan bana uçuşun sorunsuz olması gerektiğini söyledi. Kalkıştan kısa bir süre sonra atıştırmalık ve içecek servisi yapmaya başlayacağız. Gökyüzü menümüzü önünüzdeki koltuk cebinde bulabilirsiniz.",
        "nl": "[Our flight today will take approximately {flightTime}.] De gezagvoerder heeft mij zojuist laten weten dat het een voorspoedige vlucht gaat worden. Kort na het opstijgen beginnen we met het serveren van snacks en drankjes. Ons Sky-menu vindt u in het stoelvak voor u.",
        "ko": "[Our flight today will take approximately {flightTime}.] 기장님께서 비행이 원활해야 한다고 알려주셨습니다. 이륙 직후 간식과 음료 서비스를 시작하겠습니다. 앞 좌석 주머니에서 스카이 메뉴를 찾을 수 있습니다.",
        "pt_pt": "[Our flight today will take approximately {flightTime}.] O comandante acabou de me informar que o voo deverá ser tranquilo. Pouco depois da descolagem, começaremos a servir snacks e bebidas. Podem encontrar o nosso menu de bordo no bolso do assento à vossa frente.",
        "no": "[Our flight today will take approximately {flightTime}.] Kapteinen har nettopp informert meg om at flyturen bør bli jevn. Rett etter avgang vil vi begynne å servere snacks og drikke. Dere kan finne menyen vår i setelommen foran dere.",
        "th": "การเดินทางของเราในวันนี้จะใช้เวลาประมาณ {flightTime} กัปตันและลูกเรือทุกคนหวังว่าผู้โดยสารทุกท่านจะได้รับการบริการที่ราบรื่น หลังจากที่สัญญาณแจ้งรัดเข็มขัดที่นั่งได้ดับลงแล้ว เราจะเริ่มให้บริการของว่างและเครื่องดื่ม ท่านสามารถดูเมนูบนเครื่องได้ที่ช่องใส่ของหน้าที่นั่งของท่าน",
        "zh": "[Our flight today will take approximately {flightTime}.] 机长刚刚通知我，飞行应该会很平稳。飞机起飞后不久我们将开始提供小吃和饮料。您可以在前方座椅口袋中找到我们的空中菜单。"
      }
    ]
  },

  // Arm doors and cross-check
  {
    "category": "captain-arm-doors-and-cross-check",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_TAXI_PRE_TAKEOFF']},
    "timeout": [10, 15],
    "onlyPriorityLanguage": true,
    "texts": [
      {
        "en": "Cabin crew, arm doors and cross-check.",
        "pl": "Proszę zabezpieczyć drzwi i sprawdzić.",
        "de": "Kabinenpersonal, Armtüren und Gegenkontrolle.",
        "pt_br": "Tripulação de cabine, portas de braço e verificação cruzada.",
        "es": "Tripulación de cabina, armar puertas y verificar.",
        "fr": "Personnel de cabine, ouvrez les portes et vérifiez.",
        "it": "Personale di cabina, azionate le porte e fate un controllo incrociato.",
        "tr": "Kabin ekibi, kapıları açın ve çapraz kontrol yapın.",
        "nl": "Cabinepersoneel, beveiligde deuren en kruiscontrole.",
        "ko": "객실 승무원, 암 도어 및 교차 확인.",
        "pt_pt": "Tripulação de cabine, portas de braço e verificação cruzada.",
        "no": "Kabinpersonale, armdører og krysssjekk.",
        "th": "ลูกเรือเปิดประตูและตรวจค้น",
        "zh": "机组人员，请打开舱门并进行交叉检查。"
      }
    ]
  },

  // Safety briefing
  {
    "category": "crew-safety-briefing",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_TAXI_PRE_TAKEOFF']},
    "timeout": [20, 30],
    "texts": [
      {
        "en": "Ladies and gentlemen, on behalf of the crew I ask that you please direct your attention to the crew members as we review the emergency procedures. There are {aircraftEmergencyExistsCount} emergency exits on this aircraft. Take a minute to locate the exit closest to you. Note that the nearest exit may be behind you. Should the cabin experience sudden pressure loss, stay calm and listen for instructions from the cabin crew. Oxygen masks will drop down from above your seat. Place the mask over your mouth and nose, like this. Pull the strap to tighten it. If you are traveling with children, make sure that your own mask is on first before helping your children. In the unlikely event of an emergency landing and evacuation, leave your carry-on items behind. Life rafts are located below your seats and emergency lighting will lead you to your closest exit. We ask that you make sure that all carry-on luggage is stowed away safely during the flight. While we wait for take off, please take a moment to review the safety data card in the seat pocket in front of you. Thank you for your attention.",
        "pl": "Szanowni państwo, w imieniu załogi proszę o uwagę. Na pokładzie samolotu znajduje się {aircraftEmergencyExistsCount} wyjść awaryjnych. Proszę poświęcić chwilę, aby zlokalizować wyjście najbliższe Państwu. Zwróć szczególną uwagę, ponieważ najbliższe wyjście może znajdować się za Państwem. W przypadku nagłej utraty ciśnienia w kabinie, zachowaj spokój i słuchaj instrukcji członków załogi. Maseczki tlenowe spadną z góry nad Państwa miejscem. Umieść maseczkę na ustach i nosie. Pociągnij za pasek, aby ją naciągnąć. Jeśli podróżujesz z dziećmi, upewnij się, że najpierw założysz swoją maseczkę, zanim pomożesz swoim dzieciom. W przypadku awaryjnego lądowania i ewakuacji, pozostaw swoje bagaże podręczne. Kamizelki ratunkowe znajdują się pod Państwa siedzeniami, a oświetlenie awaryjne poprowadzi Państwa do najbliższego wyjścia. Prosimy upewnić się, że wszystkie bagaże podręczne są bezpiecznie schowane podczas lotu. Podczas oczekiwania na start, proszę poświęcić chwilę na zapoznanie się z kartą bezpieczeństwa znajdującą się w kieszeni siedzenia przed Państwem. Dziękujemy za uwagę.",
        "de": "Meine Damen und Herren im Namen von Kapitän {captainName} und der Besatzung möchten wir sie nocheinmal rechtherzlich an Bord begrüßen. Wir möchten Sie nun mit den Sicherheitsvorkehrungen an Bord [this {aircraftName} aircraft.] vertraut machen. Richten sie hierzu ihre gesamte Aufmerksamkeit auf ihre Flugbegleiter. Es gibt {aircraftEmergencyExistsCount} Notausgänge in diesem Flugzeug. Nehmen Sie sich einen Moment Zeit, um den nächstgelegenen Ausgang zu finden. Beachten Sie, dass sich der nächste Ausgang möglicherweise hinter Ihnen befindet. Sollte es in der Kabine zu einem plötzlichen Druckverlust kommen, bleiben Sie ruhig und achten Sie auf die Anweisungen des Kabinenpersonals. Sauerstoffmasken fallen von über Ihrem Sitz herunter. Legen Sie die Maske wie folgt über Mund und Nase. Ziehen Sie am Riemen, um die Maske festzuziehen. Wenn Sie mit Kindern reisen, stellen Sie sicher, dass Sie zuerst Ihre eigene Maske anlegen, bevor Sie Ihren Kindern helfen. Lassen Sie im unwahrscheinlichen Fall einer Notlandung und Evakuierung Ihr Handgepäck zurück. Unter Ihren Sitzen befinden sich Rettungswesten und eine Notbeleuchtung führt Sie zum nächstgelegenen Ausgang. Wir bitten Sie, während des Fluges darauf zu achten, dass das gesamte Handgepäck sicher verstaut ist. Während wir auf den Abflug warten, nehmen Sie sich bitte einen Moment Zeit und überprüfen Sie die Sicherheitsdatenkarte in der Sitztasche vor Ihnen. Vielen Dank für Ihre Aufmerksamkeit.",
        "pt_br": "Senhores passageiros sua atenção por favor, apresentaremos agora as informações de segurança deste avião. Para afivelar seu cinto de segurança encaixe as extremidades e ajuste-o puxando a tira, para soltá-lo levante a parte externa da fivela. Por lei é proibido fumar a bordo inclusive cigarros eletrônicos. Também é proibido manipular os detectores de fumaça dos lavatórios. Luzes de emergência no piso e no teto indicarão o caminho para as saídas da aeronave, localize a saída mais próxima lembrando que ela poderá estar atrás de você. Se a cabine perder pressão, máscaras de oxigênio cairão automaticamente dos compartimentos acima dos seus assentos. Puxe uma delas coloque sobre o nariz e a boca e respire normalmente. Somente ajude outras pessoas após ter colocado a sua máscara. O equipamento para auxílio à flutuação está indicado a sua frente, verifique o cartão com as informações de segurança localizado no bolsão da poltrona. Agradecemos a atenção e desejamos a todos uma ótima viagem.",
        "es": "Damas y caballeros, en nombre de la tripulación les pido que dirija su atención a los miembros de la tripulación mientras revisamos los procedimientos de emergencia. Hay {aircraftEmergencyExistsCount} salidas de emergencia en esta aeronave. Tómate un minuto para localizar la salida más cercana a ti. Tenga en cuenta que la salida más cercana puede estar detrás de usted. Si la cabina experimenta una pérdida repentina de presión, mantenga la calma y escuche las instrucciones de la tripulación de cabina. Las máscaras de oxígeno caerán desde encima de su asiento. Coloque la mascarilla sobre su boca y nariz, así. Tire de la correa para apretarla. Si viaja con niños, asegúrese primero de que su propia mascarilla esté puesta antes de ayudar a sus hijos. En el improbable caso de un aterrizaje de emergencia y una evacuación, deje atrás su equipaje de mano. Las balsas salvavidas están ubicadas debajo de sus asientos y la iluminación de emergencia lo llevará a la salida más cercana. Le pedimos que se asegure de que todo el equipaje de mano esté guardado de forma segura durante el vuelo. Mientras esperamos el despegue, tómese un momento para revisar la tarjeta de datos de seguridad en el bolsillo del asiento frente a usted. Gracias por su atención.",
        "fr": "Mesdames et messieurs, au nom de l'équipage, je vous demande de bien vouloir prêter attention aux membres de l'équipage pendant que nous passons en revue les procédures de sécurité. Il y a {aircraftEmergencyExistsCount} issues de secours à bord de cet appareil. Prenez un moment pour repérer l'issue la plus proche de vous. Notez que l'issue la plus proche peut se trouver derrière vous. En cas de perte soudaine de pression dans la cabine, restez calme et écoutez les instructions de l'équipage. Des masques à oxygène se déploieront au-dessus de votre siège. Placez le masque sur votre bouche et votre nez, comme ceci, et tirez sur la sangle pour le serrer. Si vous voyagez avec des enfants, assurez-vous de mettre votre propre masque en place avant d'aider vos enfants. En cas d'atterrissage d'urgence et d'évacuation, laissez vos effets personnels derrière vous. Les radeaux de sauvetage se trouvent sous vos sièges et des lumières d'urgence vous guideront vers la sortie la plus proche. Nous vous demandons de veiller à ce que tout votre bagage à main soit rangé en toute sécurité pendant le vol. En attendant le décollage, veuillez consulter la carte de sécurité dans la pochette de votre siège. Merci de votre attention.",
        "it": "Signore e signori, vi invitiamo a rivolgere la vostra attenzione ai membri dell'equipaggio che vi illustrano le procedure di emergenza. Ci sono {aircraftEmergencyExistsCount} uscite di emergenza su questo aereo. Individuate quella più vicina a voi. Tenete presente che l'uscita più vicina potrebbe essere dietro di voi. Nel caso di un'improvvisa perdita di pressione, mantenete la calma e ascoltare le istruzioni dell'equipaggio di cabina. Le maschere di ossigeno cadranno da sopra di voi. Mettete la maschera coprendo naso e bocca. Tirate la cinghia per stringerla. Se viaggiate con bambini, assicuratevi di indossare correttamente la vostra maschera prima di aiutarli. Nell'improbabile caso di atterraggio ed evacuazione di emergenza, lasciate a bordo il bagaglio a mano. I giubbotti salvagente si trovano sotto il sedile, e l'illuminazione di emergenza vi condurrà all'uscita più vicina. Accertatevi che i bagagli a mano siano riposti in modo sicuro durante il volo. In attesa del decollo, vi invitiamo a leggere la scheda con le norme di sicurezza, posta nella tasca del sedile di fronte. Grazie per l'attenzione.",
        "tr": "Bayanlar ve baylar, mürettebat adına, biz acil durum prosedürlerini incelerken lütfen dikkatinizi mürettebat üyelerine yöneltmenizi rica ediyorum. Bu uçakta {aircraftEmergencyExistsCount} acil çıkış bulunmaktadır. Size en yakın çıkışı bulmak için bir dakikanızı ayırın. En yakın çıkışın arkanızda olabileceğini unutmayın. Kabinde ani basınç kaybı olması durumunda sakin olun ve kabin ekibinin talimatlarını dinleyin. Oksijen maskeleri koltuğunuzun üzerinden aşağıya düşecek. Maskeyi ağzınıza ve burnunuza bu şekilde yerleştirin. Sıkmak için kayışı çekin. Çocuklarla seyahat ediyorsanız çocuklarınıza yardım etmeden önce kendi maskenizin takılı olduğundan emin olun. Nadir de olsa acil iniş ve tahliye durumunda, yanınızda taşıyabileceğiniz eşyalarınızı geride bırakın. Can salları koltuklarınızın altında bulunmaktadır ve acil durum aydınlatması sizi en yakın çıkışa yönlendirecektir. Uçuş sırasında tüm el bagajınızın güvenli bir şekilde saklandığından emin olmanızı rica ediyoruz. Biz kalkışı beklerken lütfen bir dakikanızı ayırıp önünüzdeki koltuk cebinde bulunan güvenlik kartını inceleyin. İlginiz için teşekkür ederiz.",
        "nl": "Dames en heren, namens de bemanning vraag ik u alstublieft uw aandacht terwijl wij de veiligheidsvoorzieningen demonstreren. Er zijn {aircraftEmergencyExistsCount} nooduitgangen in dit vliegtuig. Neem even de tijd om de dichtstbijzijnde uitgang te vinden. Houd er rekening mee dat de dichtstbijzijnde uitgang zich mogelijk achter u bevindt. Mocht er in de cabine plotseling drukverlies optreden, blijf dan kalm en luister naar de instructies van het cabinepersoneel. Zuurstofmaskers vallen van boven uw stoel naar beneden. Plaats het masker op deze manier over uw mond en neus. Trek aan de band om deze strakker te maken. Als u met kinderen reist, zorg er dan voor dat u eerst uw eigen masker op heeft voordat u uw kinderen helpt. In het onwaarschijnlijke geval van een noodlanding en evacuatie laat u uw handbagage achter. Reddingsvlotten bevinden zich onder uw stoelen en noodverlichting leidt u naar de dichtstbijzijnde uitgang. Wij vragen u ervoor te zorgen dat alle handbagage tijdens de vlucht veilig opgeborgen is. Terwijl we wachten op het opstijgen, verzoeken wij u even de tijd te nemen om de veiligheidskaart in het stoelvak voor u te bekijken. Bedankt voor uw aandacht.",
        "ko": "승객 여러분, 승무원을 대표하여 비상 절차를 검토하는 동안 승무원에게 주의를 기울여 주시기를 부탁드립니다. 이 항공기에는 {aircircuitEmergencyExistCount}개의 비상구가 있습니다. 잠시 시간을 내어 여러분과 가장 가까운 출구를 찾아보세요. 가장 가까운 출구는 뒤에 있을 수 있습니다. 객실에 갑작스러운 압력 이상이 발생하면 침착하게 객실 승무원의 지시를 따라주세요. 좌석 위에서 산소 마스크가 떨어질 것입니다. 이렇게 입과 코에 마스크를 착용하세요. 스트랩을 당겨 단단히 조입니다. 어린이와 함께 여행하는 경우 어린이를 돕기 전에 마스크를 먼저 착용하세요. 비상 착륙 및 대피 시 예상치 못한 경우 휴대품을 두고 가세요. 구명 뗏목은 좌석 아래에 있으며 비상등이 가장 가까운 출구로 안내해 줄 것입니다. 비행 중에 모든 휴대품을 안전하게 보관하십시오. 이륙을 기다리는 동안 잠시 시간을 내어 앞 좌석 주머니에 있는 안전 데이터 카드를 읽어봐주세요. 감사합니다.",
        "pt_pt": "Senhoras e senhores, em nome da {airlineName}, peço que, por favor, dirijam a vossa atenção para os membros da tripulação enquanto revemos os procedimentos de emergência. Existem {aircraftEmergencyExistsCount} saídas de emergência nesta aeronave. Reservem um minuto para localizar a saída mais próxima de vós. Notem que a saída mais próxima pode estar atrás de vós. No caso de uma súbita perda de pressão na cabine, mantenham a calma e ouçam as instruções da tripulação de cabine. Máscaras de oxigénio cairão do compartimento acima do vosso assento. Coloque a máscara sobre a boca e o nariz, desta forma. Puxe a correia para apertá-la. Se estiver a viajar com crianças, coloque a sua própria máscara primeiro antes de ajudar as crianças. No improvável caso de uma aterragem de emergência e evacuação, deixem os vossos pertences de mão para trás. Os coletes salva-vidas estão localizados debaixo dos vossos assentos e a iluminação de emergência guiar-vos-á até à saída mais próxima. Pedimos que certifiquem-se de que toda a bagagem de mão está guardada de forma segura durante o voo. Enquanto aguardamos pela descolagem, por favor, reservem um momento para rever o cartão de segurança no bolso do assento à vossa frente. Obrigado pela vossa atenção.",
        "no": "Mine damer og herrer, på vegne av mannskapet ber jeg dere vennligst rette oppmerksomheten mot kabinpersonalet mens vi går gjennom sikkerhetsprosedyrene. Det er {aircraftEmergencyExistsCount} nødutganger på dette flyet. Ta et minutt for å finne ut hvilken utgang som er nærmest deg. Merk at den nærmeste utgangen kan være bak deg. Hvis kabinen opplever plutselig trykktap, hold dere rolige og lytt til instruksjoner fra kabinpersonalet. Oksygenmasker vil falle ned fra over hodet deres. Plasser masken over munnen og nesen, slik som dette. Trekk i stroppen for å stramme den. Hvis dere reiser med barn, sørg for at din egen maske er på før du hjelper barna dine. I det usannsynlige tilfelle av en nødlanding og evakuering, etterlat håndbagasjen din. Redningsflåtene er plassert under setene dine, og nødlys vil lede deg til nærmeste utgang. Vi ber om at dere sørger for at alt håndbagasje er oppbevart på en sikker måte under flyturen. Mens vi venter på avgang, vennligst ta et øyeblikk for å se over sikkerhetsdatakortet i setelommen foran dere. Takk for oppmerksomheten.",
        "th": "ท่านผู้โดยสารทุกท่าน เพื่อความปลอดภัยขอให้ทุกท่านให้ความสนใจชมการสาธิตขั้นตอนฉุกเฉิน ในเครื่องบินลำนี้มีทางออกฉุกเฉินทั้งหมด {aircraftEmergencyExistsCount} จุด โปรดกรุณามองหาทางออกฉุกเฉินที่ใกล้ที่สุดซึ่งอาจอยู่ด้านหลังของท่าน ในกรณีฉุกเฉินหน้ากากออกซิเจนจะหล่นลงมาจากด้านบนที่นั่งของท่าน กรุณาสวมหน้ากากปิดปากและจมูก แล้วดึงสายรัดให้กระชับ หากท่านเดินทางพร้อมกับเด็ก กรุณาสวมหน้ากากให้ตัวเองก่อนแล้วจึงสวมให้เด็ก ในกรณีฉุกเฉิน ห้ามนำสัมภาระติดตัวไป เสื้อชูชีพจะอยู่ใต้ที่นั่งของท่าน และไฟฉุกเฉินจะนำท่านไปยังทางออกที่ใกล้ที่สุด โปรดเก็บสัมภาระในที่เก็บของเพื่อความปลอดภัยระหว่างเที่ยวบินนี้ ขณะที่เรารอเครื่องบินขึ้น กรุณาสละเวลาสักครู่เพื่อทบทวนข้อมูลความปลอดภัยที่อยู่ในช่องใส่ของหน้าที่นั่งของท่าน ขอบคุณสำหรับความสนใจของท่าน",
        "zh": "女士们，先生们，代表全体机组成员，我请您关注我们回顾的紧急情况程序。此飞机上有 {aircraftEmergencyExistsCount} 个紧急出口。请花点时间找出离您最近的出口。请注意，最近的出口可能在您的后方。如果机舱突然失压，请保持冷静并听从机组成员的指示。氧气面罩会从您的座位上方掉下来。将面罩罩住您的口鼻，如此操作。拉紧带子固定它。如果您与儿童同行，请先确保自己戴好面罩，再帮助您的孩子。在极少数紧急着陆和撤离的情况下，请放弃携带行李。救生筏位于您的座位下方，紧急照明将引导您到最近的出口。我们请您确保随身携带的行李在飞行过程中已妥善存放。在我们等待起飞时，请花几分钟时间阅读前方座椅口袋中的安全资料卡。感谢您的关注。"
      }
    ]
  },

  // Dim lights for takeoff
  {
    "category": "captain-dim-lights",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_TAXI_PRE_TAKEOFF']},
    "conditions": [
      {"type": "runtimeFlightMetadata", "key": "isDarkOutside", "value": [1]}
    ],
    "timeout": [120, 140],
    "onlyPriorityLanguage": true,
    "runtimeGenerated": true,
    "chime": "DING",
    "texts": [
      {
        "en": "Cabin crew, please dim the lights for takeoff.",
        "pl": "Proszę ściemnić światła przed startem.",
        "de": "Kabinenpersonal, bitte dimmen Sie das Licht für den Start.",
        "pt_br": "Tripulação de cabine, por favor diminuam as luzes antes da decolagem.",
        "es": "Tripulación de cabina, por favor atenúe las luces para el despegue.",
        "fr": "Personnel de cabine, veuillez baisser les lumières pour le décollage.",
        "it": "Personale di cabina, per favore abbassate le luci prima del decollo.",
        "tr": "Kabin ekibi, kalkış için ışıklarınızı lütfen kısın.",
        "nl": "Cabinepersoneel, wilt u de lichten dimmen voor het opstijgen?",
        "ko": "캐빈크루, 이륙을 위해 조명을 어둡게 해주세요.",
        "pt_pt": "Tripulação de cabine, por favor diminuam as luzes antes da descolagem.",
        "no": "Kabinpersonale, dimp lysene for start.",
        "th": "ลูกเรือทุกท่าน กรุณาปิดแสงสำหรับการออกเดินทาง",
        "zh": "机组人员，请为起飞调暗灯光。"
      }
    ]
  },
  {
    "category": "crew-dim-lights",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_TAXI_PRE_TAKEOFF']},
    "conditions": [
      {"type": "runtimeFlightMetadata", "key": "isDarkOutside", "value": [1]}
    ],
    "timeout": [140, 150],
    "onlyPriorityLanguage": false,
    "runtimeGenerated": true,
    "texts": [
      {
        "en": "Ladies and gentlemen, lights will be dimmed for takeoff due to safety reasons.",
        "pl": "Szanowni państwo, światła zostaną ściemnione przed startem z powodów bezpieczeństwa.",
        "de": "Meine Damen und Herren, aus Sicherheitsgründen werden die Lichter für den Start gedimmt.",
        "pt_br": "Senhoras e senhores, as luzes serão reduzidas para a decolagem por motivos de segurança.",
        "es": "Damas y caballeros, las luces se atenuarán para el despegue por razones de seguridad.",
        "fr": "Mesdames et messieurs, les lumières seront atténuées pour le décollage pour des raisons de sécurité.",
        "it": "Signore e signori, per motivi di sicurezza le luci saranno abbassate durante il decollo.",
        "tr": "Sayın misafirler, güvenlik nedeniyle kalkışta ışıklar kısık olacaktır.",
        "nl": "Dames en heren, om veiligheidsredenen worden de lichten tijdens het opstijgen gedimd.",
        "ko": "캐빈크루, 이륙을 위해 조명을 어둡게 해주세요.",
        "pt_pt": "Senhoras e senhores, as luzes serão reduzidas para a descolagem por motivos de segurança.",
        "no": "Mine damer og herrer, lysene vil dimmes for takeoff av sikkerhetsmessige årsaker.",
        "th": "ลูกเรือทุกท่าน กรุณาปิดแสงสำหรับการออกเดินทาง",
        "zh": "机组人员，请为起飞调暗灯光。"
      },
      {
        "en": "We will be dimming the lights for takeoff. Please use the reading light above your seat if you need additional light.",
        "pl": "Światła zostaną ściemnione przed startem. Jeśli potrzebują państwa dodatkowego światła, proszę skorzystać z lampki do czytania nad swoim miejscem.",
        "de": "Vor dem Start werden die Lichter gedimmt. Wenn Sie zusätzliches Licht benötigen, nutzen Sie bitte eine Leselampe über Ihrem Sitzplatz.",
        "pt_br": "As luzes serão apagadas antes da decolagem. Se precisar de luz adicional, use uma lâmpada de leitura acima do seu assento.",
        "es": "Las luces se atenuarán antes del despegue. Si necesita luz adicional, utilice una lámpara de lectura encima de su asiento.",
        "fr": "Les lumières seront tamisées avant le décollage. Si vous avez besoin de lumière supplémentaire, veuillez utiliser une lampe de lecture au-dessus de votre siège.",
        "it": "Le luci verranno abbassate prima del decollo. Se hai bisogno di luce aggiuntiva, utilizza una lampada da lettura sopra il sedile.",
        "tr": "Kalkıştan önce ışıklar kısılacak. İlave ışığa ihtiyacınız varsa lütfen koltuğunuzun üzerinde bir okuma lambası kullanın.",
        "nl": "Vóór het opstijgen worden de lichten gedimd. Als u extra licht nodig heeft, gebruik dan een leeslamp boven uw stoel.",
        "ko": "이륙 전에는 조명이 어두워집니다. 추가 조명이 필요한 경우 좌석 위의 독서등을 사용하세요.",
        "pt_pt": "As luzes serão apagadas antes da descolagem. Se precisar de luz adicional, utilize uma lâmpada de leitura acima do seu assento.",
        "no": "Lysene vil dempes før avgang. Hvis du trenger ekstra lys, bruk en leselampe over setet.",
        "th": "ไฟจะหรี่ลงก่อนเครื่องขึ้น หากคุณต้องการแสงสว่างเพิ่มเติม โปรดใช้โคมไฟอ่านหนังสือเหนือที่นั่งของคุณ",
        "zh": "起飞前灯光将变暗。如果您需要额外的照明，请使用座位上方的阅读灯。"
      },
      {
        "en": "Ladies and gentlemen, we will be dimming the cabin lights for takeoff. If you require additional light, please use the button above your seat to activate your reading light.",
        "pl": "Szanowni państwo, światła w kabinie zostaną ściemnione przed startem. Jeśli potrzebują państwo dodatkowego światła, proszę skorzystać z przycisku nad swoim miejscem, aby włączyć lampkę do czytania.",
        "de": "Meine Damen und Herren, wir werden die Kabinenbeleuchtung für den Start dimmen. Wenn Sie zusätzliches Licht benötigen, verwenden Sie bitte den Knopf über Ihrem Sitzplatz, um Ihre Leselampe zu aktivieren.",
        "pt_br": "Senhoras e senhores, as luzes da cabine serão reduzidas para a decolagem. Se precisar de luz adicional, use o botão acima do seu assento para ativar a sua luz de leitura.",
        "es": "Damas y caballeros, atenuaremos las luces de la cabina para el despegue. Si necesita luz adicional, utilice el botón encima de su asiento para activar su luz de lectura.",
        "fr": "Mesdames et messieurs, nous allons tamiser les lumières de la cabine pour le décollage. Si vous avez besoin de lumière supplémentaire, veuillez utiliser le bouton au-dessus de votre siège pour activer votre lampe de lecture.",
        "it": "Signore e signori, abbasseremo le luci della cabina per il decollo. Se hai bisogno di luce aggiuntiva, utilizza il pulsante sopra il tuo sedile per attivare la tua lampada da lettura.",
        "tr": "Bayanlar ve baylar, kalkış için kabin ışıklarını kısacağız. Ek ışığa ihtiyacınız varsa okuma lambanızı etkinleştirmek için koltuğunuzun üzerindeki düğmeyi kullanın.",
        "nl": "Dames en heren, we zullen de cabineverlichting dimmen voor het opstijgen. Als u extra licht nodig heeft, gebruik dan de knop boven uw stoel om uw leeslamp te activeren.",
        "ko": "여러분, 이륙을 위해 캐빈 조명을 어둡게 할 것입니다. 추가 조명이 필요하면 좌석 위 버튼을 눌러 독서등을 켜세요.",
        "pt_pt": "Senhoras e senhores, as luzes da cabine serão reduzidas para a descolagem. Se precisar de luz adicional, utilize o botão acima do seu assento para ativar a sua luz de leitura.",
        "no": "Mine damer og herrer, vi vil dempe kabinlyset før avgang. Hvis du trenger ekstra lys, bruk knappen over setet ditt for å aktivere leselyset.",
        "th": "ลูกเรือทุกท่าน เราจะปิดแสงในห้องโดยสารสำหรับการออกเดินทาง หากคุณต้องการแสงสว่างเพิ่มเติม โปรดใช้ปุ่มเหนือที่นั่งของคุณเพื่อเปิดไฟอ่านหนังสือของคุณ",
        "zh": "女士们，先生们，我们将为起飞调暗客舱灯光。如果您需要额外的照明，请使用座位上方的按钮激活阅读灯。"
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
        "pt_br": "Tripulação de cabine, prepare-se para a decolagem.",
        "es": "Tripulación de cabina, prepárense para el despegue.",
        "fr": "Equipage de cabine, préparez-vous au décollage.",
        "it": "Assistenti di volo, prepararsi al decollo.",
        "tr": "Kabin ekibi, kalkışa hazırlanın.",
        "nl": "Cabinepersoneel, klaarmaken voor opstijgen.",
        "ko": "캐빈크루, 이륙 준비해주세요.",
        "pt_pt": "Tripulação de cabine, preparem-se para a descolagem.",
        "no": "Kabinpersonalet, gjør dere klare for avgang.",
        "th": "ลูกเรือทุกท่าน กรุณาเตรียมพร้อมสำหรับการออกเดินทาง",
        "zh": "机组人员，请准备起飞。"
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
        "pt_br": "Senhoras e senhores, por favor permaneçam sentados enquanto subimos para nossa altitude de cruzeiro. Em breve iniciaremos nosso serviço de bordo. Você pode encontrar nosso menu Sky no bolsão do assento à sua frente.",
        "es": "Damas y caballeros, permanezcan sentados mientras subimos a nuestra altitud de crucero. En breve iniciaremos nuestro servicio a bordo. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted.",
        "fr": "Mesdames et messieurs, veuillez rester assis pendant que nous montons à notre altitude de croisière. Nous commencerons bientôt notre service en vol. Vous trouverez notre menu en cabine dans la pochette de votre siège.",
        "it": "Signore e signori, rimanete seduti mentre saliamo alla quota di crociera. A breve inizieremo il nostro servizio a bordo. Potete consultare il menu nella tasca del sedile di fronte.",
        "tr": "Bayanlar ve baylar, seyir irtifamıza tırmanırken lütfen yerlerinizde kalın. Kısa süre içerisinde uçak içi hizmetimize başlayacağız. Gökyüzü menümüzü önünüzdeki koltuk cebinde bulabilirsiniz.",
        "nl": "Dames en heren, blijft u alstublieft zitten terwijl we naar onze kruishoogte stijgen. We beginnen zo met onze service tijdens de vlucht. U vindt ons skymenu in de stoelzak voor u.",
        "ko": "승객 여러분, 비행기가 순항 고도에 올라가는 동안 자리에 앉아 계십시오. 잠시 후 기내 서비스를 시작하겠습니다. 앞쪽 좌석 주머니에서 스카이 메뉴를 찾을 수 있습니다.",
        "pt_pt": "Senhoras e senhores, por favor, permaneçam sentados enquanto subimos para a nossa altitude de cruzeiro. Iniciaremos o nosso serviço de bordo em breve. Podem encontrar o nosso menu de bordo no bolso do assento à vossa frente.",
        "no": "Mine damer og herrer, vær vennlig å forbli sittende mens vi stiger til vår marsjhøyde. Vi vil snart starte vår service om bord. Dere kan finne menyen vår i setelommen foran dere.",
        "th": "ท่านผู้โดยสารทุกท่าน กรุณานั่งอยู่กับที่ขณะที่เราไต่ระดับสู่ระดับความสูงสำหรับการบิน เราจะเริ่มให้บริการบนเครื่องบินในไม่ช้า ท่านสามารถดูเมนูได้ที่ช่องใส่ของหน้าที่นั่งของท่าน",
        "zh": "女士们，先生们，在我们爬升至巡航高度时，请保持就座。我们将很快开始机上服务。您可以在前方座椅口袋中找到我们的空中菜单。"
      },
      {
        "en": "We are now climbing to our cruising altitude. We will be starting our in-flight service shortly. You can find our sky menu in the seat pocket in front of you.",
        "pl": "Obecnie wznosimy się do naszej wysokości przelotowej. Wkrótce rozpoczniemy serwis pokładowy. Menu znajdą państwo w kieszeni siedzenia przed sobą.",
        "de": "Wir steigen jetzt auf unsere Reiseflughöhe. Wir werden in Kürze mit unserem Bordservice beginnen. Unser Sky-Menü finden Sie in der Sitztasche vor Ihnen.",
        "pt_br": "Agora estamos subindo para a nossa altitude de cruzeiro. Em breve iniciaremos nosso serviço de bordo. Você pode encontrar nosso menu Sky no bolsão do assento à sua frente.",
        "es": "Ahora estamos subiendo a nuestra altitud de crucero. En breve iniciaremos nuestro servicio a bordo. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted.",
        "fr": "Nous sommes maintenant en montée vers notre altitude de croisière. Nous commencerons bientôt notre service en vol. Vous trouverez notre menu en cabine dans la pochette de votre siège.",
        "it": "Stiamo ora salendo alla nostra quota di crociera. A breve inizieremo il nostro servizio a bordo. Potete consultare il menu nella tasca del sedile di fronte.",
        "tr": "Artık seyir irtifamıza tırmanıyoruz. Kısa süre içerisinde uçak içi hizmetimize başlayacağız. Gökyüzü menümüzü önünüzdeki koltuk cebinde bulabilirsiniz.",
        "nl": "We klimmen nu naar onze kruishoogte. We beginnen zo met onze service tijdens de vlucht. U vindt ons skymenu in de stoelzak voor u.",
        "ko": "우리 비행기 이제 순항 고도로 올라갑니다. 곧 기내 서비스를 시작할 예정입니다. 앞 좌석 주머니에서 스카이 메뉴를 찾을 수 있습니다.",
        "pt_pt": "Estamos agora a subir para a nossa altitude de cruzeiro. Iniciaremos o nosso serviço de bordo em breve. Podem encontrar o nosso menu de bordo no bolso do assento à vossa frente.",
        "no": "Vi stiger nå til vår marsjhøyde. Vi vil snart starte vår service om bord. Dere kan finne menyen vår i setelommen foran dere.",
        "th": "ขณะนี้เรากำลังไต่ระดับไปสู่ระดับความสูงสำหรับการบิน เราจะเริ่มให้บริการบนเครื่องบินในไม่ช้า ท่านสามารถดูเมนูบนเครื่องได้ที่ช่องใส่ของหน้าที่นั่งของท่าน",
        "zh": "我们正在爬升至巡航高度。我们将很快开始机上服务。您可以在前方座椅口袋中找到我们的空中菜单。"
      },
      {
        "en": "Ladies and gentlemen, in just a few moments, our cabin crew will begin serving refreshments. Please have your tray tables down and be ready to make your selection.",
        "pl": "Szanowni państwo, za chwilę nasza załoga pokładowa rozpocznie serwowanie napojów. Prosimy o otworzenie stolików i przygotowanie się do wyboru.",
        "de": "Meine Damen und Herren, in wenigen Augenblicken wird unser Kabinenpersonal mit der Erfrischungsgetränkeausgabe beginnen. Bitte klappen Sie Ihre Tische herunter und seien Sie bereit, Ihre Auswahl zu treffen.",
        "pt_br": "Senhoras e senhores, em poucos instantes, nossa tripulação de cabine começará a servir bebidas. Por favor, mantenha a bandeja abaixada e esteja pronto para fazer sua escolha.",
        "es": "Damas y caballeros, en unos momentos, nuestra tripulación de cabina comenzará a servir refrescos. Por favor, mantengan las mesas de bandeja abajo y estén listos para hacer su elección.",
        "fr": "Mesdames et messieurs, dans quelques instants, notre personnel de cabine commencera à servir des rafraîchissements. Veuillez abaisser vos tablettes et soyez prêts à faire votre choix.",
        "it": "Signore e signori, tra pochi istanti il nostro personale di cabina inizierà a servire i rinfreschi. Si prega di abbassare i tavoli e di essere pronti a fare la vostra scelta.",
        "tr": "Bayanlar ve baylar, birkaç dakika içinde kabin ekibimiz içecek servisine başlayacak. Lütfen tepsi masalarınızı indirin ve seçiminizi yapmaya hazır olun.",
        "nl": "Dames en heren, over enkele ogenblikken zal ons cabinepersoneel beginnen met het serveren van drankjes. Houd uw tafeltjes naar beneden en wees klaar om uw keuze te maken.",
        "ko": "여러분, 잠시 후 캐빈크루가 음료를 제공하기 시작할 것입니다. 트레이 테이블을 내리고 선택할 준비를 하세요.",
        "pt_pt": "Senhoras e senhores, dentro de momentos, a nossa tripulação de cabine começará a servir bebidas. Por favor, mantenha a bandeja baixa e esteja pronto para fazer a sua escolha.",
        "no": "Mine damer og herrer, om et øyeblikk vil kabinpersonalet vårt begynne å servere forfriskninger. Vennligst ha bordet nede og vær klar til å velge.",
        "th": "ลูกเรือทุกท่าน ในไม่ช้าพวกเราจะเริ่มให้บริการเครื่องดื่ม กรุณาเปิดโต๊ะลงและเตรียมเลือกเมนูของท่าน",
        "zh": "女士们，先生们，过一会儿，我们的机组人员将开始为您提供饮料。请将托盘桌放下，并准备好选择。"
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
        "de": "Meine Damen und Herren, wir starten jetzt unseren Bordservice. Wir möchten Sie daran erinnern, dass wir sowohl Kartenzahlungen als auch Bargeld akzeptieren. Unser Sky-Menü finden Sie in der Sitztasche vor Ihnen. Bitte bleiben Sie sitzen, während wir Sie bedienen. Wenn Sie etwas benötigen, zögern Sie bitte nicht, eines unserer Kabinenpersonalmitglieder anzusprechen. Vielen Dank.",
        "pt_br": "Senhoras e senhores, agora vamos iniciar o nosso serviço de bordo. Gostaríamos de lembrar que aceitamos pagamentos com cartão e dinheiro. Você pode encontrar nosso menu Sky no bolsão do assento à sua frente. Por favor, permaneça sentado enquanto o atendemos. Se precisar de alguma coisa, não hesite em perguntar a um dos nossos comissários. Obrigado.",
        "es": "Damas y caballeros, ahora estamos iniciando nuestro servicio a bordo. Te recordamos que aceptamos pagos con tarjeta además de efectivo. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted. Por favor permanezca sentado mientras le atendemos. Si necesitas algo, no dudes en preguntar a uno de nuestros miembros de la tripulación de cabina. Gracias.",
        "fr": "Mesdames et messieurs, nous commençons maintenant notre service en vol. Nous vous rappelons que nous acceptons les paiements par carte ainsi qu'en espèces. Vous trouverez notre menu en cabine dans la pochette de votre siège. Merci de rester assis pendant que nous vous servons. Si vous avez besoin de quoi que ce soit, n'hésitez pas à demander à l'un de nos membres d'équipage. Merci. ",
        "it": "Signore e signori, stiamo ora iniziando il servizio a bordo. Vi ricordiamo che accettiamo pagamenti con carta e in contante. Troverete il nostro menu a bordo nella tasca del sedile davanti a voi. Vi preghiamo di rimanere seduti mentre vi serviamo. Se avete bisogno di qualcosa, non esitate a chiedere a uno dei membri dell’equipaggio. Grazie.",
        "tr": "Bayanlar ve baylar, artık uçak içi hizmetimize başlıyoruz. Nakit ödemenin yanı sıra kartla da ödeme kabul ettiğimizi hatırlatmak isteriz. Gökyüzü menümüzü önünüzdeki koltuk cebinde bulabilirsiniz. Size hizmet ederken lütfen yerlerinizde kalın. Bir şeye ihtiyacınız olursa lütfen kabin ekibimizden birine sormaktan çekinmeyin. Teşekkür ederim.",
        "nl": "Dames en heren, we beginnen nu met onze in-flight service. We willen u eraan herinneren dat we zowel kaartbetalingen als contante betalingen accepteren. U vindt ons skymenu in de stoelzak voor u. Blijf alstublieft zitten terwijl wij u bedienen. Als u iets nodig hebt, aarzel dan niet om het aan een van onze cabinemedewerkers te vragen. Hartelijk dank.",
        "ko": "승객 여러분, 기내 서비스를 시작합니다. 저희는 현금뿐만 아니라 카드 결제도 가능하다는 것을 알려드리고자 합니다. 앞 좌석 주머니에 스카이 메뉴판이 있습니다. 서비스를 제공하는 동안 자리에 앉아 계십시오. 필요한 것이 있으시면 주저하지 마시고 객실 승무원을 불러주세요. 감사합니다.",
        "pt_pt": "Senhoras e senhores, estamos agora a iniciar o nosso serviço de bordo. Gostaríamos de relembrar que aceitamos pagamentos com cartão, bem como em dinheiro. Podem encontrar o nosso menu de bordo no bolso do assento à vossa frente. Por favor, permaneçam sentados enquanto vos servimos. Se precisarem de alguma coisa, não hesitem em pedir a um dos nossos membros da tripulação de cabine. Obrigado.",
        "no": "Mine damer og herrer, vi starter nå vår service om bord. Vi vil minne om at vi aksepterer både kortbetalinger og kontanter. Dere kan finne menyen vår i setelommen foran dere. Vennligst forbli sittende mens vi serverer dere. Hvis dere trenger noe, ikke nøl med å spørre en av våre kabinansatte. Takk.",
        "th": "ท่านผู้โดยสารทุกท่าน ขณะนี้เราเริ่มให้บริการบนเครื่องบินแล้ว เราขอแจ้งให้ท่านทราบว่าเรารับชำระด้วยบัตรเครดิตและเงินสด ท่านสามารถดูเมนูบนเครื่องได้ที่ช่องใส่ของหน้าที่นั่งของท่าน กรุณานั่งประจำที่ขณะที่เราทำการบริการ หากท่านต้องการความช่วยเหลือใดๆ โปรดแจ้งพนักงานต้อนรับบนเครื่องบิน ขอบคุณค่ะ",
        "zh": "女士们，先生们，我们现在开始机上服务。我们提醒您，我们接受信用卡和现金支付。您可以在前方座椅口袋中找到我们的空中菜单。请在我们服务时保持就座。如果您需要任何帮助，请随时向我们的机组人员提出。谢谢。"
      },
      {
        "en": "We are now starting our in-flight service. We'd like to remind you that we accept card payments as well as cash. You can find our sky menu in the seat pocket in front of you. Please remain seated while we serve you. If you need anything, please don't hesitate to ask one of our cabin crew members. Thank you.",
        "pl": "Rozpoczynamy serwis pokładowy. Przypominamy, że akceptujemy płatności kartą oraz gotówką. Menu znajdą państwo w kieszeni siedzenia przed sobą. Prosimy o pozostanie na miejscach podczas naszej obsługi. Jeśli mają Państwo specjalne potrzeby, prosimy zwrócić się do jednego z członków naszej załogi. Dziękujemy.",
        "de": "Wir starten jetzt unseren Bordservice. Wir möchten Sie daran erinnern, dass wir sowohl Kartenzahlungen als auch Bargeld akzeptieren. Unser Sky-Menü finden Sie in der Sitztasche vor Ihnen. Bitte bleiben Sie sitzen, während wir Sie bedienen. Wenn Sie etwas benötigen, zögern Sie bitte nicht, eines unserer Kabinenpersonalmitglieder anzusprechen. Danke schön.",
        "pt_br": "Agora vamos iniciar o nosso serviço de bordo. Gostaríamos de lembrar que aceitamos pagamentos com cartão e dinheiro. Você pode encontrar nosso menu Sky no bolsão do assento à sua frente. Por favor, permaneça sentado enquanto o atendemos. Se precisar de alguma coisa, não hesite em perguntar a um dos nossos comissários. Obrigado.",
        "es": "Ahora estamos iniciando nuestro servicio a bordo. Te recordamos que aceptamos pagos con tarjeta además de efectivo. Puede encontrar nuestro menú Sky en el bolsillo del asiento frente a usted. Por favor permanezca sentado mientras le atendemos. Si necesitas algo, no dudes en preguntar a uno de nuestros miembros de la tripulación de cabina. Gracias.",
        "fr": "Nous commençons maintenant notre service en vol. Nous vous rappelons que nous acceptons les paiements par carte ainsi qu'en espèces. Vous trouverez notre menu en cabine dans la pochette de votre siège. Nous vous remercions de rester assis pendant que nous vous servons. Si vous avez besoin de quoi que ce soit, n'hésitez pas à demander à l'un de nos membres d'équipage. Merci.",
        "it": "Stiamo ora iniziando il servizio a bordo. Vi ricordiamo che accettiamo pagamenti sia con carta che in contante. Troverete il nostro menu a bordo nella tasca del sedile davanti a voi. Vi preghiamo di rimanere seduti mentre vi serviamo. Se avete bisogno di qualcosa, non esitate a chiedere a uno dei membri dell’equipaggio. Grazie.",
        "tr": "Artık uçak içi hizmetimize başlıyoruz. Nakit ödemenin yanı sıra kartla da ödeme kabul ettiğimizi hatırlatmak isteriz. Gökyüzü menümüzü önünüzdeki koltuk cebinde bulabilirsiniz. Size hizmet ederken lütfen yerlerinizde kalın. Bir şeye ihtiyacınız olursa lütfen kabin ekibimizden birine sormaktan çekinmeyin. Teşekkür ederim.",
        "nl": "We beginnen nu met onze in-flight service. We willen u eraan herinneren dat we zowel kaartbetalingen als contante betalingen accepteren. U vindt ons skymenu in de stoelzak voor u. Blijf alstublieft zitten terwijl wij u bedienen. Als u iets nodig hebt, aarzel dan niet om het aan een van onze cabinemedewerkers te vragen. Hartelijk dank.",
        "ko": "이제 기내 서비스를 시작합니다. 저희는 현금뿐만 아니라 카드 결제도 가능하다는 것을 알려드리고 싶습니다. 스카이 메뉴는 앞 좌석 포켓에 있습니다. 서비스를 제공하는 동안 자리에 앉아 계십시오. 필요한 것이 있으시면 주저하지 마시고 객실 승무원 중 한명에게 물어보세요. 감사합니다.",
        "pt_pt": "Estamos agora a iniciar o nosso serviço de bordo. Gostaríamos de relembrar que aceitamos pagamentos com cartão, bem como em dinheiro. Podem encontrar o nosso menu de bordo no bolso do assento à vossa frente. Por favor, permaneçam sentados enquanto vos servimos. Se precisarem de alguma coisa, não hesitem em pedir a um dos nossos membros da tripulação de cabine. Obrigado.",
        "no": "Vi starter nå vår service om bord. Vi vil minne om at vi aksepterer både kortbetalinger og kontanter. Dere kan finne menyen vår i setelommen foran dere. Vennligst forbli sittende mens vi serverer dere. Hvis dere trenger noe, ikke nøl med å spørre en av våre kabinansatte. Takk.",
        "th": "ขณะนี้เราเริ่มให้บริการบนเครื่องบินแล้ว เราขอแจ้งให้ท่านทราบว่าเรารับชำระด้วยบัตรเครดิตและเงินสด ท่านสามารถดูเมนูบนเครื่องได้ที่ช่องใส่ของหน้าที่นั่งของท่าน กรุณานั่งประจำที่ขณะที่เราทำการบริการ หากท่านต้องการความช่วยเหลือใดๆ โปรดแจ้งพนักงานต้อนรับบนเครื่องบิน ขอบคุณค่ะ",
        "zh": "我们现在开始机上服务。我们提醒您，我们接受信用卡和现金支付。您可以在前方座椅口袋中找到我们的空中菜单。请在我们服务时保持就座。如有需要，请随时向我们的机组人员提出。谢谢。"
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
        "pt_br": "Senhoras e senhores, iniciamos agora o nosso serviço de compras a bordo. Hoje temos uma oferta especial para você. Nossos cartões de raspadinha estão disponíveis para compra. Você pode ganhar um voo grátis ou outros prêmios incríveis, como uma refeição grátis ou um desconto no seu próximo voo. Os passageiros mais sortudos podem até ganhar umas férias grátis. Boa sorte!",
        "es": "Damas y caballeros, ahora estamos iniciando nuestro servicio de compras a bordo. Hoy tenemos una oferta especial para ti. Nuestras tarjetas rasca y gana ya están disponibles para su compra. Puedes ganar un vuelo gratis u otros fantásticos premios, como una comida gratis o un descuento en tu próximo vuelo. Los pasajeros más afortunados pueden incluso ganar unas vacaciones gratis. ¡Buena suerte!",
        "fr": "Mesdames et messieurs, nous commençons maintenant notre service de shopping en vol. Aujourd'hui, nous avons une offre spéciale pour vous. Nos cartes à gratter sont désormais disponibles à la vente. Vous pouvez gagner un vol gratuit ou d'autres prix intéressants, comme un repas gratuit ou une réduction sur votre prochain vol. Les passagers les plus chanceux peuvent même remporter des vacances gratuites. Bonne chance !",
        "it": "Signore e signori, stiamo avviando il nostro servizio di shopping a bordo. Oggi abbiamo un'offerta speciale per voi. I nostri gratta e vinci sono ora disponibili per l'acquisto. Potete vincere un volo gratuito o altri fantastici premi, come un pasto gratuito o uno sconto sul vostro prossimo volo. I passeggeri più fortunati potranno vincere anche una vacanza gratis. Buona fortuna!",
        "tr": "Hanımlar beyler, artık uçak içi alışveriş hizmetimize başlıyoruz. Bugün size özel bir teklifimiz var. Kazı kazan kartlarımız artık satın alınabilir. Ücretsiz bir uçuş veya ücretsiz yemek ya da bir sonraki uçuşunuzda indirim gibi başka harika ödüller kazanabilirsiniz. En şanslı yolcular bedava tatil bile kazanabilirler. İyi şanlar!",
        "nl": "Dames en heren, we beginnen nu met onze in-flight shopping service. Vandaag hebben we een speciale aanbieding voor u. Onze kraskaarten zijn nu te koop. Je kunt een gratis vlucht winnen of andere geweldige prijzen, zoals een gratis maaltijd of korting op je volgende vlucht. De gelukkigste passagiers kunnen zelfs een gratis vakantie winnen. Veel succes!",
        "ko": "승객 여러분, 이제 기내 쇼핑 서비스를 시작합니다. 오늘 우리는 여러분을 위한 특별한 제안이 있습니다. 우리의 스크래치 카드를 구매할 수 있습니다. 여러분은 무료 비행기 또는 무료 식사 또는 다음 비행기 할인과 같은 다른 훌륭한 상품을 얻을 수 있습니다. 가장 운이 좋은 분은 무료 휴일도 얻을 수 있습니다. 행운을 빌어요!",
        "pt_pt": "Senhoras e senhores, estamos agora a iniciar o nosso serviço de compras a bordo. Hoje temos uma oferta especial para vocês. Os nossos cartões de raspadinha estão agora disponíveis para compra. Podem ganhar um voo gratuito ou outros ótimos prémios, como uma refeição gratuita ou um desconto no vosso próximo voo. Os passageiros mais sortudos podem até ganhar umas férias gratuitas. Boa sorte!",
        "no": "Mine damer og herrer, vi starter nå vår shoppingservice om bord. I dag har vi et spesielt tilbud til dere. Våre skrapelodd er nå tilgjengelige for kjøp. Dere kan vinne en gratis flytur eller andre flotte premier, som et gratis måltid eller rabatt på deres neste flyvning. De heldigste passasjerene kan til og med vinne en gratis ferie. Lykke til!",
        "th": "ท่านผู้โดยสารทุกท่าน ขณะนี้เราเริ่มบริการจำน่ายสินค้าบนเครื่องบินแล้ว วันนี้เรามีข้อเสนอพิเศษสำหรับท่าน ท่านสามารถซื้อบัตรลุ้นรางวัลเพื่อโอกาสได้รับตั๋วเครื่องบินฟรีหรือของรางวัลอื่น ๆ เช่น อาหารหรือส่วนลดในเที่ยวบินถัดไป ผู้โดยสารสามารถลุ้นรางวัลทริบท่องเที่ยวฟรีอีกด้วย เราขอให้ท่านโชคดี!",
        "zh": "女士们，先生们，现已开始机上购物服务。今天我们有特别优惠。现在可以买我们的刮刮卡，您有机会赢取免费机票或其他丰厚奖品，如免费餐饮或下次航班的折扣。最幸运的乘客甚至可以赢得免费假期。祝您好运！"
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
        "pt_br": "Senhoras e senhores, iniciamos agora o nosso serviço de compras a bordo. Hoje temos uma oferta especial para você. Na compra de dois perfumes, você ganha 10% de desconto no terceiro. Neste voo, recomendamos os últimos perfumes da nossa coleção. Você pode encontrar nosso catálogo de compras no bolso do assento à sua frente. Aceitamos pagamentos com cartão e dinheiro.",
        "es": "Damas y caballeros, ahora estamos iniciando nuestro servicio de compras a bordo. Hoy tenemos una oferta especial para ti. Si compras dos perfumes, obtendrás un 10% de descuento en el tercero. En este vuelo recomendamos encarecidamente las últimas fragancias de nuestra colección. Puede encontrar nuestro catálogo de compras en el bolsillo del asiento frente a usted. Aceptamos pagos con tarjeta y también en efectivo.",
        "fr": "Mesdames et messieurs, nous commençons maintenant notre service de shopping en vol. Aujourd'hui, nous avons une offre spéciale pour vous. Pour l'achat de deux parfums, vous bénéficiez d'une réduction de 10 % sur le troisième. Nous vous recommandons particulièrement les dernières fragrances de notre collection pour ce vol. Vous trouverez notre catalogue de shopping dans la pochette de votre siège. Nous acceptons les paiements par carte ainsi qu'en espèces.",
        "it": "Signore e signori, stiamo ora iniziando il nostro servizio di shopping a bordo. Oggi abbiamo un’offerta speciale per voi: se acquistate due profumi, riceverete uno sconto del 10% sul terzo. Su questo volo, vi consigliamo vivamente le ultime fragranze della nostra collezione. Troverete il nostro catalogo di shopping nella tasca del sedile davanti a voi. Accettiamo pagamenti con carta e in contante",
        "tr": "Hanımlar beyler, artık uçak içi alışveriş hizmetimize başlıyoruz. Bugün size özel bir teklifimiz var. İki parfüm alana üçüncüsünde %10 indirim uygulanacaktır. Bu uçuşta koleksiyonumuzdaki en yeni kokuları şiddetle tavsiye ediyoruz. Alışveriş kataloğumuzu önünüzdeki koltuk cebinde bulabilirsiniz. Nakit ödemenin yanı sıra kartla ödeme de kabul ediyoruz.",
        "nl": "Dames en heren, we beginnen nu met onze in-flight shopping service. Vandaag hebben we een speciale aanbieding voor u. Als je twee parfums koopt, krijg je 10% korting op de derde. Tijdens deze vlucht raden we u de nieuwste geuren uit onze collectie aan. Je vindt onze winkelcatalogus in de stoelzak voor je. We accepteren zowel kaartbetalingen als contante betalingen.",
        "ko": "승객 여러분, 이제 기내 쇼핑 서비스를 시작합니다. 오늘은 특별한 이벤트가 있습니다. 향수를 두개 구매하시면 세 번째 향수를 10% 할인해 드립니다. 이번 비행에서는 컬렉션의 최신 향수를 적극 추천합니다. 앞 좌석 주머니에서 쇼핑 카탈로그를 찾을 수 있습니다. 현금뿐만 아니라 카드 결제도 가능합니다.",
        "pt_pt": "Senhoras e senhores, estamos agora a iniciar o nosso serviço de compras a bordo. Hoje temos uma oferta especial para vocês. Se comprarem dois perfumes, terão um desconto de 10% no terceiro. Neste voo, recomendamos vivamente as mais recentes fragrâncias da nossa coleção. Podem encontrar o nosso catálogo de compras no bolso do assento à vossa frente. Aceitamos pagamentos com cartão, bem como em numerario.",
        "no": "Mine damer og herrer, vi starter nå vår shoppingservice om bord. I dag har vi et spesielt tilbud til dere. Hvis dere kjøper to parfymer, får dere 10 % rabatt på den tredje. På dette flyet anbefaler vi sterkt de nyeste duftene fra vår kolleksjon. Dere kan finne vår shoppingkatalog i setelommen foran dere. Vi aksepterer både kortbetalinger og kontanter.",
        "th": "ท่านผู้โดยสารทุกท่าน ขณะนี้เราเริ่มบริการจำน่ายสินค้าบนเครื่องบินแล้ว วันนี้เรามีข้อเสนอพิเศษสำหรับท่าน หากท่านซื้อน้ำหอมสองขวด ท่านจะได้รับส่วนลด 10% สำหรับขวดที่สาม ในเที่ยวบินนี้เราขอแนะนำกลิ่นหอมใหม่ล่าสุดจากคอลเลคชันของเรา ท่านสามารถดูแคทตาล็อกสินค้าของเราได้ที่ช่องใส่ของหน้าที่นั่งของท่าน เรารับชำระด้วยบัตรเครดิตและเงินสด",
        "zh": "女士们，先生们，我们现在开始机上购物服务。今天有特别优惠：购买两瓶香水，第三瓶可以享受10%的折扣。本次航班我们特别推荐我们最新的香水系列。您可以在前方座椅口袋中找到我们的购物目录。我们接受信用卡和现金支付。"
      },
      {
        "en": "We are now starting our in-flight shopping service. Today we highly recommend our special offer - a set of three perfumes for the price of two. We also have a wide selection of other products available for purchase, like souvenirs, cosmetics, and snacks. You can find our shopping catalog in the seat pocket in front of you. We accept card payments as well as cash.",
        "pl": "Rozpoczynamy serwis pokładowy. Dziś polecamy naszą specjalną ofertę - zestaw trzech zapachów w cenie dwóch. Mamy również szeroki wybór innych produktów dostępnych do zakupu, takich jak pamiątki, kosmetyki i przekąski. Katalog produktów znajdą państwo w kieszeni siedzenia przed sobą. Akceptujemy płatności kartą oraz gotówką.",
        "de": "Wir starten jetzt unseren Bordeinkaufsservice. Heute empfehlen wir Ihnen unser Sonderangebot – ein Set mit drei Parfums zum Preis von zwei. Wir haben auch eine große Auswahl an anderen Produkten zum Kauf, wie Souvenirs, Kosmetik und Snacks. Sie finden unseren Einkaufskatalog in der Sitztasche vor Ihnen. Wir akzeptieren Kartenzahlungen sowie Bargeld.",
        "pt_br": "Estamos iniciando agora nosso serviço de compras a bordo. Hoje recomendamos a nossa oferta especial - um conjunto de três perfumes pelo preço de dois. Também temos uma ampla seleção de outros produtos disponíveis para compra, como lembranças, cosméticos e lanches. Você pode encontrar nosso catálogo de compras no bolso do assento à sua frente. Aceitamos pagamentos com cartão e dinheiro.",
        "es": "Ahora estamos iniciando nuestro servicio de compras a bordo. Hoy recomendamos encarecidamente nuestra oferta especial: un juego de tres perfumes por el precio de dos. También tenemos una amplia selección de otros productos disponibles para comprar, como souvenirs, cosméticos y snacks. Puede encontrar nuestro catálogo de compras en el bolsillo del asiento frente a usted. Aceptamos pagos con tarjeta y también en efectivo.",
        "fr": "Nous commençons maintenant notre service de shopping en vol. Aujourd'hui, nous vous recommandons particulièrement notre offre spéciale : un ensemble de trois parfums au prix de deux. Nous proposons également une large sélection d'autres produits à la vente, comme des souvenirs, des cosmétiques et des snacks. Vous trouverez notre catalogue de shopping dans la pochette de votre siège. Nous acceptons les paiements par carte ainsi qu'en espèces.",
        "it": "Stiamo ora avviando il nostro servizio di shopping a bordo. Oggi vi consigliamo vivamente la nostra offerta speciale: un set di tre profumi al prezzo di due. Abbiamo anche una vasta selezione di altri prodotti in vendita, come souvenir, cosmetici e snack. Troverete il nostro catalogo di shopping nella tasca del sedile davanti a voi. Accettiamo pagamenti con carta e in contante.",
        "tr": "Artık uçak içi alışveriş hizmetimize başlıyoruz. Bugün özel teklifimizi şiddetle tavsiye ediyoruz - iki fiyatına üç parfümden oluşan set. Ayrıca hediyelik eşyalar, kozmetik ürünler ve atıştırmalıklar gibi satın alınabilecek geniş bir ürün yelpazemiz de mevcuttur. Alışveriş kataloğumuzu önünüzdeki koltuk cebinde bulabilirsiniz. Nakit ödemenin yanı sıra kartla ödeme de kabul ediyoruz.",
        "nl": "We beginnen nu met onze in-flight shopping service. Vandaag bevelen we onze speciale aanbieding van harte aan - een set van drie parfums voor de prijs van twee. We hebben ook een ruime keuze aan andere producten, zoals souvenirs, cosmetica en snacks. Je vindt onze winkelcatalogus in de stoelzak voor je. We accepteren zowel kaartbetalingen als contante betalingen.",
        "ko": "우리는 이제 기내 쇼핑 서비스를 시작합니다. 오늘 우리는 특별한 제안인 투 플러스 원 향수 세트를 적극 추천합니다. 또한 기념품, 화장품, 그리고 간식과 같은 다양한 구매 가능한 다른 상품들이 준비되어 있습니다. 앞의 좌석 주머니에서 쇼핑 카탈로그를 찾을 수 있습니다. 현금뿐만 아니라 카드 결제도 가능합니다.",
        "pt_pt": "Estamos agora a iniciar o nosso serviço de compras a bordo. Hoje recomendamos vivamente a nossa oferta especial - um conjunto de três perfumes pelo preço de dois. Temos também uma ampla seleção de outros produtos disponíveis para compra, como souvenirs, cosméticos e snacks. Podem encontrar o nosso catálogo de compras no bolso do assento à vossa frente. Aceitamos pagamentos com cartão, bem como em dinheiro.",
        "no": "Vi starter nå vår shoppingservice om bord. I dag anbefaler vi sterkt vårt spesialtilbud – et sett med tre parfymer til prisen av to. Vi har også et bredt utvalg av andre produkter tilgjengelig for kjøp, som suvenirer, kosmetikk og snacks. Dere kan finne vår shoppingkatalog i setelommen foran dere. Vi aksepterer både kortbetalinger og kontanter.",
        "th": "ขณะนี้เราเริ่มบริการขายสินค้าบนเครื่องบินแล้ว วันนี้เราขอแนะนำข้อเสนอพิเศษ เซ็ตน้ำหอม 3 ขวดในราคาสองขวดเท่านั้น เรามีสินค้าอื่น ๆ ให้เลือกซื้อมากมาย เช่น ของที่ระลึก เครื่องสำอาง และขนมขบเคี้ยว ท่านสามารถดูแคทตาล็อกสินค้าได้ที่ช่องใส่ของหน้าที่นั่งของท่าน เรารับชำระด้วยบัตรเครดิตและเงินสด",
        "zh": "现在开始机上购物服务。今天我们特别推荐优惠活动，三瓶香水只需两瓶的价格。我们还有各种产品供您选购，例如纪念品、化妆品和零食。您可以在前方座椅口袋中找到我们的购物目录。我们接受信用卡和现金支付。"
      },
      {
        "en": "Ladies and gentlemen, our in-flight shopping service is now available. Treat yourself or a loved one with our exclusive collection of duty-free items. We are highlighting our new travel kits and limited-edition accessories on this flight. Find the catalog in your seat pocket, and feel free to ask our cabin crew for assistance. Card payments and cash are accepted.",
        "pl": "Szanowni państwo, nasza usługa zakupów na pokładzie jest już dostępna. Obdarujcie siebie lub kogoś bliskiego naszą ekskluzywną kolekcją produktów bezcłowych. Na tym locie prezentujemy nasze nowe zestawy podróżne i akcesoria w limitowanej edycji. Katalog produktów znajdą państwo w kieszeni siedzenia przed sobą. Płatności kartą i gotówką są akceptowane.",
        "de": "Meine Damen und Herren, unser Einkaufsservice an Bord ist jetzt verfügbar. Verwöhnen Sie sich selbst oder einen geliebten Menschen mit unserer exklusiven Kollektion zollfreier Artikel. Auf diesem Flug stellen wir unsere neuen Reisesets und Accessoires in limitierter Auflage vor. Finden Sie den Katalog in Ihrer Sitztasche und wenden Sie sich gerne an unser Kabinenpersonal, wenn Sie Hilfe benötigen. Kartenzahlungen und Bargeld werden akzeptiert.",
        "pt_br": "Senhoras e senhores, nosso serviço de compras a bordo já está disponível. Presenteie a si mesmo ou a um ente querido com nossa coleção exclusiva de itens duty-free. Estamos destacando nossos novos kits de viagem e acessórios de edição limitada neste voo. Encontre o catálogo no bolso do seu assento e sinta-se à vontade para pedir ajuda à nossa tripulação de cabine. Pagamentos com cartão e dinheiro são aceitos.",
        "es": "Damas y caballeros, nuestro servicio de compras a bordo ya está disponible. Regálate a ti mismo o a un ser querido nuestra exclusiva colección de artículos libres de impuestos. En este vuelo, destacamos nuestros nuevos kits de viaje y accesorios de edición limitada. Encuentra el catálogo en el bolsillo de tu asiento y no dudes en pedir ayuda a nuestra tripulación de cabina. Se aceptan pagos con tarjeta y en efectivo.",
        "fr": "Mesdames et messieurs, notre service de shopping à bord est désormais disponible. Faites-vous plaisir ou faites plaisir à un proche avec notre collection exclusive d'articles duty free. Nous mettons en avant nos nouveaux kits de voyage et nos accessoires en édition limitée sur ce vol. Retrouvez le catalogue dans la pochette de votre siège et n'hésitez pas à demander de l'aide à notre personnel de cabine. Les paiements par carte et en espèces sont acceptés.",
        "it": "Signore e signori, il nostro servizio di shopping in volo è ora disponibile. Fate un regalo a voi stessi o a una persona cara con la nostra esclusiva collezione di articoli duty-free. Stiamo evidenziando i nostri nuovi kit da viaggio e accessori in edizione limitata su questo volo. Trovate il catalogo nella tasca del vostro sedile e sentitevi liberi di chiedere assistenza al nostro personale di cabina. Sono accettati pagamenti con carta e contanti.",
        "tr": "Bayanlar ve baylar, uçak içi alışveriş hizmetimiz artık mevcut. Kendinize veya sevdiklerinize gümrüksüz ürünlerden oluşan özel koleksiyonumuzla bir jest yapın. Bu uçuşta yeni seyahat kitlerimizi ve sınırlı sayıdaki aksesuarlarımızı öne çıkarıyoruz. Kataloğu koltuk cebinizde bulun ve kabin ekibimizden yardım istemekten çekinmeyin. Kart ödemeleri ve nakit kabul edilmektedir.",
        "nl": "Dames en heren, onze in-flight shopping service is nu beschikbaar. Trakteer uzelf of een geliefde op onze exclusieve collectie dutyfree artikelen. We lichten onze nieuwe reiskits en limited edition accessoires uit op deze vlucht. Zoek de catalogus in uw stoelvak en vraag gerust onze cabinebemanning om hulp. Kaartbetalingen en contant geld worden geaccepteerd.",
        "ko": "신사 숙녀 여러분, 저희의 기내 쇼핑 서비스가 이제 이용 가능합니다. 저희의 독점적인 면세품 컬렉션으로 자신이나 사랑하는 사람을 대접하세요. 저희는 이번 항공편에서 새로운 여행 키트와 한정판 액세서리를 강조하고 있습니다. 좌석 주머니에서 카탈로그를 찾고, 객실 승무원에게 도움을 요청하세요. 카드 결제와 현금 결제가 가능합니다.",
        "pt_pt": "Senhoras e senhores, o nosso serviço de compras a bordo já está disponível. Presenteie-se a si ou a alguém querido com a nossa coleção exclusiva de artigos duty-free. Destacamos os nossos novos kits de viagem e acessórios de edição limitada neste voo. Encontre o catálogo no bolso do seu lugar e sinta-se à vontade para pedir ajuda à nossa tripulação de cabine. Pagamentos com cartão e dinheiro são aceites.",
        "no": "Mine damer og herrer, vår shoppingtjeneste på fly er nå tilgjengelig. Unn deg selv eller en du er glad i med vår eksklusive samling av avgiftsfrie varer. Vi fremhever våre nye reisesett og tilbehør i begrenset opplag på denne flyturen. Finn katalogen i setelommen, og spør gjerne kabinpersonalet vårt om hjelp. Kortbetalinger og kontanter aksepteres.",
        "th": "",
        "zh": "女士们先生们，我们的机上购物服务现已推出。用我们独家的免税商品系列犒劳自己或爱人。我们将在本次航班上重点介绍我们的全新旅行套装和限量版配件。您可以在座位口袋中找到目录，并随时向我们的机组人员寻求帮助。接受信用卡和现金付款。"
      },
      {
        "en": "Ladies and gentlemen, as we cruise at our cruising altitude, we invite you to explore our curated in-flight shopping selection. This month, we’re offering unique, locally inspired items and seasonal gifts. Don’t miss out on these limited-edition products! Please refer to the catalog in the seat pocket in front of you. Our crew is here to assist, and all major payment methods are accepted.",
        "pl": "Panie i panowie, podczas gdy lecimy na naszej wysoksci przelotowej, zapraszamy do zapoznania się z naszą starannie dobraną ofertą zakupów w trakcie lotu. W tym miesiącu oferujemy wyjątkowe, inspirowane lokalnie przedmioty i sezonowe prezenty. Nie przegap tych produktów z limitowanej edycji! Zapoznaj się z katalogiem w kieszeni fotela przed Tobą. Nasza załoga jest tutaj, aby pomóc, a wszystkie główne metody płatności są akceptowane.",
        "de": "Meine Damen und Herren, während wir auf Reiseflughöhe fliegen, laden wir Sie ein, unsere kuratierte Auswahl an Bordeinkäufen zu erkunden. Diesen Monat bieten wir einzigartige, lokal inspirierte Artikel und saisonale Geschenke an. Lassen Sie sich diese Produkte in limitierter Auflage nicht entgehen! Bitte sehen Sie sich den Katalog in der Sitztasche vor Ihnen an. Unsere Crew ist hier, um Ihnen zu helfen, und wir akzeptieren alle gängigen Zahlungsmethoden.",
        "pt_br": "Senhoras e senhores, enquanto navegamos em nossa altitude de cruzeiro, convidamos vocês a explorar nossa seleção de compras de bordo com curadoria. Este mês, estamos oferecendo itens exclusivos, inspirados localmente, e presentes sazonais. Não perca esses produtos de edição limitada! Consulte o catálogo no bolso do assento à sua frente. Nossa equipe está aqui para ajudar, e todos os principais métodos de pagamento são aceitos.",
        "es": "Damas y caballeros, mientras navegamos a nuestra altitud de crucero, los invitamos a explorar nuestra selección de compras a bordo. Este mes, ofrecemos artículos únicos de inspiración local y regalos de temporada. ¡No se pierda estos productos de edición limitada! Consulte el catálogo en el bolsillo del asiento frente a usted. Nuestra tripulación está aquí para ayudarlo y se aceptan todos los métodos de pago principales.",
        "fr": "Mesdames et messieurs, alors que nous naviguons à notre altitude de croisière, nous vous invitons à explorer notre sélection de produits d'achats en vol. Ce mois-ci, nous proposons des articles uniques d'inspiration locale et des cadeaux de saison. Ne manquez pas ces produits en édition limitée ! Veuillez vous référer au catalogue dans la pochette du siège devant vous. Notre équipage est là pour vous aider et tous les principaux modes de paiement sont acceptés.",
        "it": "Signore e signori, mentre viaggiamo alla nostra altitudine di crociera, vi invitiamo a esplorare la nostra selezione di shopping in volo. Questo mese, offriamo articoli unici, ispirati alla gente del posto e regali stagionali. Non perdetevi questi prodotti in edizione limitata! Consultate il catalogo nella tasca del sedile di fronte a voi. Il nostro equipaggio è qui per assistervi e sono accettati tutti i principali metodi di pagamento.",
        "tr": "Bayanlar ve baylar, seyir irtifamızda seyrederken, özenle seçilmiş uçak içi alışveriş seçkimizi keşfetmenizi rica ediyoruz. Bu ay, benzersiz, yerel esintili ürünler ve mevsimsel hediyeler sunuyoruz. Bu sınırlı sayıdaki ürünleri kaçırmayın! Lütfen önünüzdeki koltuk cebindeki kataloğa bakın. Mürettebatımız size yardımcı olmak için burada ve tüm önemli ödeme yöntemleri kabul edilmektedir.",
        "nl": "Dames en heren, terwijl we op onze cruisehoogte varen, nodigen we u uit om onze samengestelde in-flight shopping selectie te verkennen. Deze maand bieden we unieke, lokaal geïnspireerde artikelen en seizoensgebonden geschenken. Mis deze producten in beperkte oplage niet! Raadpleeg de catalogus in de stoelzak voor u. Onze bemanning staat voor u klaar en alle gangbare betaalmethoden worden geaccepteerd.",
        "ko": "신사 숙녀 여러분, 순항 고도에서 순항하는 동안, 엄선된 기내 쇼핑 셀렉션을 살펴보시기 바랍니다. 이번 달에는 독특하고 현지에서 영감을 받은 품목과 계절별 선물을 제공합니다. 이 한정판 제품을 놓치지 마세요! 앞 좌석 주머니에 있는 카탈로그를 참조하세요. 승무원이 도와드릴 준비가 되어 있으며, 모든 주요 결제 방법이 허용됩니다.",
        "pt_pt": "Senhoras e senhores, enquanto navegamos na nossa altitude de cruzeiro, convidamo-los a explorar a nossa seleção selecionada de compras a bordo. Este mês, oferecemos artigos exclusivos de inspiração local e presentes sazonais. Não perca estes produtos de edição limitada! Consulte o catálogo no bolso do assento à sua frente. A nossa equipa está aqui para ajudar e todos os principais métodos de pagamento são aceites.",
        "no": "Mine damer og herrer, mens vi cruiser i cruisehøyden vår, inviterer vi deg til å utforske vårt utvalgte shoppingutvalg under fly. Denne måneden tilbyr vi unike, lokalt inspirerte varer og sesongbaserte gaver. Ikke gå glipp av disse produktene i begrenset opplag! Se katalogen i setelommen foran deg. Vårt mannskap er her for å hjelpe, og alle viktige betalingsmetoder aksepteres.",
        "th": "",
        "zh": "女士们先生们，当我们在巡航高度巡航时，我们邀请您探索我们精心挑选的机上购物选择。本月，我们将提供独特的、具有当地特色的商品和季节性礼品。不要错过这些限量版产品！请参阅您前方座椅口袋中的目录。我们的机组人员随时为您提供帮助，并且接受所有主要付款方式。"
      },
      {
        "en": "Ladies and gentlemen, we are pleased to offer our in-flight shopping service during this portion of your journey. Whether you're looking for a thoughtful gift, a travel essential, or just something to indulge yourself, we've got you covered. Flip through the catalog in your seat pocket, and let our crew know if you have any questions. We accept payments in cash or by card.",
        "pl": "Panie i panowie, z przyjemnością oferujemy naszą usługę zakupów w trakcie lotu na tym etapie podróży. Niezależnie od tego, czy szukasz przemyślanego prezentu, niezbędnego przedmiotu w podróży, czy po prostu czegoś, co pozwoli ci się rozpieścić, mamy coś dla ciebie. Przejrzyj katalog w kieszeni fotela i daj znać naszej załodze, jeśli masz jakieś pytania. Akceptujemy płatności gotówką lub kartą.",
        "de": "Sehr geehrte Damen und Herren, wir freuen uns, Ihnen während dieses Teils Ihrer Reise unseren Einkaufsservice an Bord anbieten zu können. Egal, ob Sie ein nettes Geschenk, ein Reiseutensil oder einfach nur etwas für sich selbst suchen, wir haben das Richtige für Sie. Blättern Sie durch den Katalog in Ihrer Sitztasche und wenden Sie sich bei Fragen an unsere Crew. Wir akzeptieren Zahlungen in bar oder mit Karte.",
        "pt_br": "Senhoras e senhores, temos o prazer de oferecer nosso serviço de compras a bordo durante esta parte da sua viagem. Quer você esteja procurando um presente atencioso, um item essencial para viagem ou apenas algo para se mimar, nós temos o que você precisa. Folheie o catálogo no bolso do seu assento e avise nossa equipe se tiver alguma dúvida. Aceitamos pagamentos em dinheiro ou cartão.",
        "es": "Damas y caballeros, nos complace ofrecer nuestro servicio de compras a bordo durante esta parte de su viaje. Ya sea que esté buscando un obsequio especial, un artículo esencial para el viaje o simplemente algo para darse un gusto, lo tenemos cubierto. Hojee el catálogo en el bolsillo de su asiento y comuníquese con nuestra tripulación si tiene alguna pregunta. Aceptamos pagos en efectivo o con tarjeta.",
        "fr": "Mesdames et messieurs, nous sommes heureux de vous proposer notre service d'achats en vol pendant cette partie de votre voyage. Que vous recherchiez un cadeau attentionné, un article de voyage indispensable ou simplement quelque chose pour vous faire plaisir, nous avons ce qu'il vous faut. Feuilletez le catalogue dans la pochette de votre siège et faites savoir à notre équipage si vous avez des questions. Nous acceptons les paiements en espèces ou par carte.",
        "it": "Signore e signori, siamo lieti di offrirvi il nostro servizio di shopping in volo durante questa parte del vostro viaggio. Che stiate cercando un regalo premuroso, un articolo essenziale per il viaggio o semplicemente qualcosa per coccolarvi, abbiamo quello che fa per voi. Sfogliate il catalogo nella tasca del vostro sedile e fate sapere al nostro equipaggio se avete domande. Accettiamo pagamenti in contanti o con carta.",
        "tr": "Bayanlar ve baylar, yolculuğunuzun bu bölümünde uçak içi alışveriş hizmetimizi sunmaktan mutluluk duyuyoruz. İster düşünceli bir hediye, ister seyahat için olmazsa olmaz bir şey, ister sadece kendinizi şımartabileceğiniz bir şey arıyor olun, sizi düşündük. Koltuk cebinizdeki kataloğu inceleyin ve herhangi bir sorunuz varsa mürettebatımıza bildirin. Nakit veya kartla ödeme kabul ediyoruz.",
        "nl": "Dames en heren, we bieden u graag onze in-flight shopping service aan tijdens dit deel van uw reis. Of u nu op zoek bent naar een attent cadeau, een reisbenodigdheden of gewoon iets om uzelf te verwennen, wij hebben het voor u. Blader door de catalogus in uw stoelzak en laat het onze bemanning weten als u vragen hebt. Wij accepteren betalingen in contanten of per kaart.",
        "ko": "신사 숙녀 여러분, 저희는 여행의 이 구간 동안 기내 쇼핑 서비스를 제공하게 되어 기쁩니다. 사려 깊은 선물, 여행 필수품, 또는 그저 자신을 만족시킬 무언가를 찾고 계시든, 저희가 준비해 놓았습니다. 좌석 주머니에 있는 카탈로그를 넘기고, 궁금한 사항이 있으면 승무원에게 말씀해 주세요. 현금 또는 카드로 결제가 가능합니다.",
        "pt_pt": "Senhoras e senhores, temos o prazer de oferecer o nosso serviço de compras a bordo durante esta parte da vossa viagem. Quer esteja à procura de um presente atencioso, um item essencial para viagem ou apenas algo para se mimar, nós temos o que precisa. Percorra o catálogo no bolso do seu lugar e informe a nossa tripulação se tiver alguma dúvida. Aceitamos pagamentos em dinheiro ou cartão.",
        "no": "Mine damer og herrer, vi er glade for å kunne tilby vår shoppingtjeneste under denne delen av reisen din. Enten du leter etter en omtenksom gave, en nødvendig reise eller bare noe å unne deg selv, har vi dekket deg. Bla gjennom katalogen i setelommen, og gi beskjed til teamet vårt hvis du har spørsmål. Vi aksepterer betaling kontant eller med kort.",
        "th": "",
        "zh": "女士们先生们，我们很高兴在您旅程的这一阶段为您提供机上购物服务。无论您是在寻找贴心的礼物、旅行必需品还是只是一些让自己放纵的东西，我们都能满足您的需求。翻阅您座位口袋里的目录，如果您有任何问题，请告知我们的工作人员。我们接受现金或信用卡付款。"
      },
      {
        "en": "Attention, passengers! Don’t miss our special offer available only during this flight: purchase any two duty-free items and get 20% off your third item. Our catalog features a wide range of items, including premium fragrances, gadgets, and travel-exclusive items. Find the catalog in the seat pocket and speak with the cabin crew to learn more.",
        "pl": "Uwaga, pasażerowie! Nie przegapcie naszej oferty specjalnej dostępnej tylko podczas tego lotu: kup dwa dowolne produkty bezcłowe i otrzymaj 20% zniżki na trzeci produkt. Nasz katalog zawiera szeroki wybór produktów, w tym perfumy premium, gadżety i produkty dostępne wyłącznie w podróży. Znajdź katalog w kieszeni fotela i porozmawiaj z personelem pokładowym, aby dowiedzieć się więcej.",
        "de": "Achtung, Passagiere! Verpassen Sie nicht unser Sonderangebot, das nur während dieses Fluges verfügbar ist: Kaufen Sie zwei beliebige zollfreie Artikel und erhalten Sie 20 % Rabatt auf Ihren dritten Artikel. Unser Katalog umfasst eine große Auswahl an Artikeln, darunter hochwertige Düfte, Gadgets und Reiseartikel. Finden Sie den Katalog in der Sitztasche und sprechen Sie mit dem Kabinenpersonal, um mehr zu erfahren.",
        "pt_br": "Atenção, passageiros! Não perca nossa oferta especial disponível somente durante este voo: compre dois itens duty-free e ganhe 20% de desconto no seu terceiro item. Nosso catálogo apresenta uma ampla variedade de itens, incluindo fragrâncias premium, gadgets e itens exclusivos para viagens. Encontre o catálogo no bolso do assento e fale com a tripulação da cabine para saber mais.",
        "es": "¡Atención, pasajeros! No se pierdan nuestra oferta especial disponible solo durante este vuelo: compre dos artículos libres de impuestos y obtenga un 20 % de descuento en el tercero. Nuestro catálogo incluye una amplia gama de artículos, incluidas fragancias premium, gadgets y artículos exclusivos para viajes. Encuentre el catálogo en el bolsillo del asiento y hable con la tripulación de cabina para obtener más información.",
        "fr": "Attention, passagers ! Ne manquez pas notre offre spéciale disponible uniquement pendant ce vol : achetez deux articles duty free et obtenez 20 % de réduction sur le troisième article. Notre catalogue propose une large gamme d'articles, notamment des parfums haut de gamme, des gadgets et des articles de voyage exclusifs. Trouvez le catalogue dans la pochette du siège et parlez avec l'équipage de cabine pour en savoir plus.",
        "it": "Attenzione, passeggeri! Non perdetevi la nostra offerta speciale disponibile solo durante questo volo: acquistate due articoli duty-free e ricevete il 20% di sconto sul terzo articolo. Il nostro catalogo presenta un'ampia gamma di articoli, tra cui profumi di alta qualità, gadget e articoli esclusivi per i viaggi. Trovate il catalogo nella tasca del sedile e parlate con l'equipaggio di cabina per saperne di più.",
        "tr": "Dikkat yolcular! Sadece bu uçuşta geçerli olan özel teklifimizi kaçırmayın: iki duty free ürünü satın alın ve üçüncü ürününüzde %20 indirim kazanın. Kataloğumuzda premium parfümler, aletler ve seyahate özel ürünler dahil olmak üzere çok çeşitli ürünler yer almaktadır. Kataloğu koltuk cebinde bulun ve daha fazla bilgi edinmek için kabin ekibiyle görüşün.",
        "nl": "Let op, passagiers! Mis onze speciale aanbieding niet die alleen tijdens deze vlucht beschikbaar is: koop twee dutyfree artikelen en ontvang 20% ​​korting op het derde artikel. Onze catalogus bevat een breed scala aan artikelen, waaronder premium geuren, gadgets en exclusieve reisartikelen. Zoek de catalogus in het stoelvak en spreek met het cabinepersoneel voor meer informatie.",
        "ko": "주의하세요, 승객 여러분! 이 항공편에서만 제공되는 특별 혜택을 놓치지 마세요. 면세품 2개를 구매하시면 3번째 품목은 20% 할인됩니다. 저희 카탈로그에는 프리미엄 향수, 가젯, 여행 전용 품목을 포함한 다양한 품목이 있습니다. 좌석 주머니에서 카탈로그를 찾고 객실 승무원에게 문의하여 자세히 알아보세요.",
        "pt_pt": "Atenção, passageiros! Não perca a nossa oferta especial disponível apenas durante este voo: compre quaisquer dois artigos duty-free e obtenha 20% de desconto no terceiro artigo. O nosso catálogo apresenta uma ampla variedade de artigos, incluindo fragrâncias premium, gadgets e artigos exclusivos para viagens. Encontre o catálogo no bolso do assento e fale com a tripulação de cabine para saber mais.",
        "no": "OBS, passasjerer! Ikke gå glipp av spesialtilbudet vårt som kun er tilgjengelig under denne flyturen: Kjøp to tollfrie varer og få 20 % rabatt på den tredje varen din. Katalogen vår inneholder et bredt utvalg av varer, inkludert førsteklasses dufter, dingser og reiseeksklusive varer. Finn katalogen i setelommen og snakk med kabinpersonalet for å lære mer.",
        "th": "",
        "zh": "乘客请注意！不要错过我们仅在此航班期间提供的特别优惠：购买任何两件免税商品，第三件商品可享受 20% 折扣。我们的产品目录包含各种商品，包括高级香水、小工具和旅行专属商品。请在座位口袋中找到目录，并与机组人员交谈以了解更多信息。"
      },
      {
        "en": "Ladies and gentlemen, we are delighted to bring you a personalized shopping experience during your flight. Our catalog offers exclusive collections tailored for our travelers, including bestselling perfumes, luxury watches, and travel must-haves. If you’d like recommendations or assistance, please let our crew know.",
        "pl": "Panie i panowie, z przyjemnością zaoferujemy Państwu spersonalizowane zakupy podczas lotu. Nasz katalog oferuje ekskluzywne kolekcje dostosowane do potrzeb naszych podróżnych, w tym bestsellerowe perfumy, luksusowe zegarki i niezbędne w podróży rzeczy. Jeśli chcieliby Państwo uzyskać rekomendacje lub pomoc, proszę dać znać naszej załodze.",
        "de": "Meine Damen und Herren, wir freuen uns, Ihnen während Ihres Fluges ein personalisiertes Einkaufserlebnis bieten zu können. Unser Katalog bietet exklusive Kollektionen, die speziell auf unsere Reisenden zugeschnitten sind, darunter Bestseller-Parfums, Luxusuhren und Must-haves für die Reise. Wenn Sie Empfehlungen oder Hilfe benötigen, wenden Sie sich bitte an unsere Crew.",
        "pt_br": "Senhoras e senhores, estamos felizes em trazer a vocês uma experiência de compras personalizada durante seu voo. Nosso catálogo oferece coleções exclusivas sob medida para nossos viajantes, incluindo perfumes campeões de vendas, relógios de luxo e itens essenciais para viagens. Se você quiser recomendações ou assistência, informe nossa tripulação.",
        "es": "Damas y caballeros, estamos encantados de brindarles una experiencia de compras personalizada durante su vuelo. Nuestro catálogo ofrece colecciones exclusivas diseñadas para nuestros viajeros, incluidos los perfumes más vendidos, relojes de lujo y artículos imprescindibles para viajar. Si desea recomendaciones o asistencia, comuníquese con nuestra tripulación.",
        "fr": "Mesdames et messieurs, nous sommes ravis de vous offrir une expérience de shopping personnalisée pendant votre vol. Notre catalogue propose des collections exclusives adaptées à nos voyageurs, notamment des parfums à succès, des montres de luxe et des incontournables du voyage. Si vous avez besoin de recommandations ou d'aide, n'hésitez pas à en faire part à notre équipage.",
        "it": "Signore e signori, siamo lieti di offrirvi un'esperienza di shopping personalizzata durante il vostro volo. Il nostro catalogo offre collezioni esclusive su misura per i nostri viaggiatori, tra cui profumi bestseller, orologi di lusso e must-have da viaggio. Se desiderate consigli o assistenza, fatelo sapere al nostro equipaggio.",
        "tr": "Bayanlar ve baylar, uçuşunuz sırasında size kişiselleştirilmiş bir alışveriş deneyimi sunmaktan mutluluk duyuyoruz. Kataloğumuz, en çok satan parfümler, lüks saatler ve seyahatte olmazsa olmazlar dahil olmak üzere yolcularımıza özel olarak hazırlanmış özel koleksiyonlar sunmaktadır. Öneri veya yardıma ihtiyacınız varsa lütfen mürettebatımıza bildirin.",
        "nl": "Dames en heren, we zijn verheugd u een gepersonaliseerde winkelervaring te bieden tijdens uw vlucht. Onze catalogus biedt exclusieve collecties die speciaal zijn afgestemd op onze reizigers, waaronder bestverkopende parfums, luxe horloges en onmisbare reisartikelen. Als u aanbevelingen of hulp wilt, laat het onze bemanning dan weten.",
        "ko": "신사 숙녀 여러분, 비행 중에 개인화된 쇼핑 경험을 제공하게 되어 기쁩니다. 저희 카탈로그는 베스트셀러 향수, 고급 시계, 여행 필수품을 포함하여 여행객을 위해 맞춤화된 독점 컬렉션을 제공합니다. 추천이나 도움이 필요하면 승무원에게 알려주십시오.",
        "pt_pt": "Senhoras e senhores, temos o prazer de vos oferecer uma experiência de compra personalizada durante o vosso voo. O nosso catálogo oferece coleções exclusivas feitas à medida para os nossos viajantes, incluindo perfumes best-sellers, relógios de luxo e artigos essenciais de viagem. Se desejar recomendações ou assistência, informe a nossa equipa.",
        "no": "Mine damer og herrer, vi er glade for å kunne gi deg en personlig handleopplevelse under flyturen. Vår katalog tilbyr eksklusive kolleksjoner skreddersydd for våre reisende, inkludert bestselgende parfymer, luksusklokker og reisemust-haves. Hvis du vil ha anbefalinger eller hjelp, vennligst gi beskjed til teamet vårt.",
        "th": "",
        "zh": "女士们，先生们，我们很高兴为您在飞行途中提供个性化的购物体验。我们的产品目录提供专为旅客量身定制的独家系列，包括畅销香水、豪华手表和旅行必备品。如果您需要建议或帮助，请告知我们的工作人员。"
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
        "en": "Ladies and gentleman, this is your captain speaking. Let me share some information with you. We are currently cruising at an altitude of {currentAltitudeFt} feet at an speed of {groundSpeed} {% usesKMPH ? 'kilometers' : 'miles' %} per hour. The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees. The rest of the flight should be smooth, with a small chance of light turbulences. Please remember to keep your seatbelt fastened while seated and whenever the seatbelt sign is illuminated. Thank you, and enjoy the flight.",
        "pl": "Szanowni państwo, tu kapitan. Podzielę się z Wami kilkoma informacjami. Obecnie przelatujemy na wysokości {currentAltitudeFt} stóp z prędkością {groundSpeed} {% usesKMPH ? 'kilometrów' : 'mil' %} na godzinę. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Reszta lotu powinna być spokojna, z małymi szansami na lekkie turbulencje. Proszę pamiętać o zapięciu pasów bezpieczeństwa podczas siedzenia i zawsze, gdy sygnał zapięcia pasów jest włączony. Dziękuję i miłego lotu.",
        "de": "Sehr geehrte Damen und Herren, hier spricht Ihr Kapitän. Ich möchte Ihnen einige Informationen mitteilen. Wir fliegen derzeit in einer Höhe von {currentAltitudeFt} Fuß mit einer Geschwindigkeit von {groundSpeed} {% usesKMPH ? 'Kilometern' : 'Meilen' %} pro Stunde. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Der Rest des Fluges sollte ruhig verlaufen, mit einer geringen Wahrscheinlichkeit leichter Turbulenzen. Bitte denken Sie daran, Ihren Sicherheitsgurt immer anzulegen, wenn Sie sitzen und das Anschnallzeichen eingeschaltet ist. Danke und genießen Sie den Flug.",
        "pt_br": "Senhoras e senhores, aqui é o comandante falando. Deixe-me compartilhar algumas informações com você. Eu gostaria de compartilhar algumas informações com vocês. No momento, estamos navegando a uma altitude de {currentAltitudeFt} pés a uma velocidade de {groundSpeed} {% usesKMPH ? 'quilômetros' : 'milhas' %} por hora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] O restante do voo deve ser tranquilo, com pequenas chances de turbulências leves. Lembre-se de manter o cinto de segurança afivelado enquanto estiver sentado e sempre que o aviso de atar os cintos estiver aceso. Obrigado e aproveite o vôo.",
        "es": "Damas y caballeros, este es el capitán. Compartiré alguna información contigo. Actualmente estamos volando a una altitud de {currentAltitudeFt} pies a una velocidad de {groundSpeed} {% usesKMPH ? 'kilómetros' : 'millas' %} por hora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] El resto del vuelo debería transcurrir en calma, con pocas posibilidades de que se produzcan ligeras turbulencias. Recuerde abrocharse los cinturones de seguridad cuando esté sentado y siempre que esté encendido el aviso de cinturón de seguridad. Gracias y que tengas un buen vuelo.",
        "fr": "Mesdames et messieurs, ici le commandant de bord. J'aimerais vous partager quelques informations sur notre vol. Nous sommes actuellement en croisière à une altitude de {currentAltitudeFt} pieds et à une vitesse de {groundSpeed} {% usesKMPH ? 'kilomètres' : 'miles' %} par heure. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Le reste du vol devrait être calme, avec une faible possibilité de légères turbulences. Merci de garder votre ceinture de sécurité attachée pendant que vous êtes assis et chaque fois que le signal de ceinture est allumé. Merci et bon vol.",
        "it": "Signore e signori, parla il vostro comandante. Vorrei darvi alcune informazioni. Attualmente stiamo volando a un’altitudine di {currentAltitudeFt} piedi a una velocità di {groundSpeed} {% usesKMPH ? 'chilometri' : 'miglia' %} all’ora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Il resto del volo dovrebbe essere tranquillo, con una piccola possibilità di leggere turbolenze. Vi preghiamo di tenere sempre la cintura di sicurezza allacciata mentre siete seduti e ogni volta che il segnale della cintura è acceso. Grazie e buon volo.",
        "tr": "Bayanlar ve baylar, kaptanınız konuşuyor. Sizinle bazı bilgileri paylaşayım. Şu anda {currentAltitudeFt} fit yükseklikte saatte {groundSpeed} {% usesKMPH ? 'kilometre' : 'mil' %} hızla seyrediyoruz. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Uçuşun geri kalanı, hafif türbülansların az da olsa yaşanması ihtimaliyle birlikte sorunsuz geçmelidir. Lütfen oturduğunuzda ve emniyet kemeri işareti yandığında emniyet kemerinizi bağlı tutmayı unutmayın. Teşekkür ederim ve uçuşun tadını çıkarın.",
        "nl": "Dames en heren, hier spreekt uw gezagvoerder. Ik wil graag wat informatie met u delen. We vliegen momenteel op een hoogte van {currentAltitudeFt} voet met een snelheid van {groundSpeed} {% usesKMPH ? 'kilometer' : 'mijlen' %} per uur. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] De rest van de vlucht zou vlot moeten verlopen, met een kleine kans op lichte turbulentie. Vergeet niet uw veiligheidsgordel te dragen wanneer u zit en wanneer het stoelriemen vast teken is geactiveerd. Bedankt en geniet van uw vlucht.",
        "ko": "승객 여러분, 기장입니다. 몇 가지 정보를 여러분과 공유하겠습니다. 우리는 현재 {currentAtlightFt}피트의 고도에서 시속 {groundSpeed}로 순항하고 있습니다. {destinationCityName}의 날씨는 {destinationCityWheatherHumanDescription}이며 온도는 {destinationCityTemperature}도입니다. 앞으로 난기류가 발생할 가능성이 적으며 순조로운 비행이 될 것으로 보입니다. 자리에 앉아 좌석벨트 싸인에 불이 켜질 때마다 좌석벨트 착용하는 것을 기억하시기 바랍니다. 감사합니다, 즐거운 비행 되세요.",
        "pt_pt": "Senhoras e senhores, fala o vosso comandante. Deixem-me partilhar algumas informações convosco. Estamos atualmente a voar a uma altitude de {currentAltitudeFt} pés a uma velocidade de {groundSpeed} {% usesKMPH ? 'quilómetros' : 'millas' %} por hora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] O resto do voo deverá ser tranquilo, com uma pequena possibilidade de ligeiras turbulências. Por favor, lembrem-se de manter o cinto de segurança apertado enquanto estiverem sentados e sempre que o sinal de apertar os cintos estiver iluminado. Obrigado e desfrutem do voo.",
        "no": "Mine damer og herrer, dette er kapteinen som snakker. La meg dele litt informasjon med dere. Vi flyr for øyeblikket på en høyde av {currentAltitudeFt} fot med en hastighet på {groundSpeed} {% usesKMPH ? 'kilometer' : 'mil' %} i timen. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Resten av flyturen bør bli jevn, med liten sjanse for lett turbulens. Vennligst husk å holde sikkerhetsbeltet festet mens dere sitter, og alltid når skiltet med fest-sikkerhetsbeltet er tent. Takk, og nyt flyturen.",
        "th": "ท่านผู้โดยสาร นี่คือกัปตันของท่าน ขณะนี้เรากำลังบินที่ระดับความสูง {currentAltitudeFt} ฟุต ด้วยความเร็ว {groundSpeed} {% usesKMPH ? 'กิโลเมตรต่อชั่วโมง' : 'ไมล์ต่อชั่วโมง' %} สภาพอากาศใน {destinationCityName} คือ {destinationCityWeatherHumanDescription} อุณหภูมิอยู่ที่ {destinationCityTemperature} องศา เราคาดว่าเที่ยวบินที่เหลือน่าจะราบรื่น อาจมีโอกาสที่จะเกิดสภาพอากาศแปรปรวนเล็กน้อย  กรุณาคาดเข็มขัดนิรภัยขณะนั่งที่และทุกครั้งที่ไฟสัญญาณเข็มขัดนิรภัยเปิด ขอบคุณและขอให้ท่านเพลิดเพลินกับการเดินทาง",
        "zh": "女士们，先生们，我是您的机长。让我与您分享一些信息。我们现在在海拔 {currentAltitudeFt} 英尺的高度上巡航，速度为每小时 {groundSpeed} {% usesKMPH ? '公里' : '英里' %}。[The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] 接下来的飞行应该会非常平稳，仅有轻微颠簸的可能。请记得在座位上系好安全带，并在安全带标志亮起时保持系好状态。谢谢，祝您飞行愉快。"
      },
      {
        "en": "Hi, it's me again. I just wanted to share some information with you. We are currently cruising at an altitude of {currentAltitudeFt} feet at an speed of {groundSpeed} {% usesKMPH ? 'kilometers' : 'miles' %} per hour. The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees. The rest of the flight should be smooth. In case of any questions, please don't hesitate to ask one of our cabin crew members. Thank you, and enjoy the flight.",
        "pl": "Proszę Państwa, tu kapitan. Chciałem podzielić się z wami kilkoma informacjami. Obecnie przelatujemy na wysokości {currentAltitudeFt} stóp z prędkością {groundSpeed} {% usesKMPH ? 'kilometrów' : 'mil' %} na godzinę. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Reszta lotu powinna być spokojna. W przypadku pytań, proszę zwrócić się do jednego z członków naszej załogi. Dziękuję i miłego lotu.",
        "de": "Hallo, ich bin es wieder. Ich möchte ein paar Informationen mit Ihnen teilen. Wir fliegen derzeit in einer Höhe von {currentAltitudeFt} Fuß mit einer Geschwindigkeit von {groundSpeed} {% usesKMPH ? 'Kilometern' : 'Meilen' %} pro Stunde. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Der Rest des Fluges sollte ruhig verlaufen. Bei Fragen wenden Sie sich bitte an eines unserer Kabinenpersonalmitglieder. Danke und genießen Sie den Flug.",
        "pt_br": "Olá, sou eu de novo. Eu gostaria de compartilhar algumas informações com vocês. No momento, estamos navegando a uma altitude de {currentAltitudeFt} pés a uma velocidade de {groundSpeed} {% usesKMPH ? 'quilômetros' : 'milhas' %} por hora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] O restante do voo deve ser tranquilo. Em caso de dúvidas, não hesite em perguntar a um dos nossos comissários. Obrigado e aproveite o vôo.",
        "es": "Damas y caballeros, este es el capitán. Quería compartir algo de información contigo. Actualmente estamos volando a una altitud de {currentAltitudeFt} pies a una velocidad de {groundSpeed} {% usesKMPH ? 'kilómetros' : 'millas' %} por hora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] El resto del vuelo debería transcurrir sin incidentes. Si tiene alguna pregunta, consulte a uno de los miembros de nuestra tripulación. Gracias y que tengas un buen vuelo.",
        "fr": "Bonjour, c’est votre commandant de bord. Je voulais juste partager quelques informations avec vous. Nous sommes actuellement en croisière à une altitude de {currentAltitudeFt} pieds et à une vitesse de {groundSpeed} {% usesKMPH ? 'kilomètres' : 'miles' %} par heure. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Le reste du vol devrait être calme. Si vous avez des questions, n'hésitez pas à demander à l'un de nos membres d'équipage. Merci et bon vol.",
        "it": "Signore e signori, è il vostro comandante che vi parla. Volevo condividere alcune informazioni sul nostro volo. Attualmente stiamo volando a un’altitudine di {currentAltitudeFt} piedi e a una velocità di {groundSpeed} {% usesKMPH ? 'chilometri' : 'miglia' %} all’ora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Il resto del volo dovrebbe essere tranquillo. Se avete domande, non esitate a chiedere a uno dei membri dell’equipaggio. Grazie e buon volo.",
        "tr": "Merhaba, yine ben. Sadece sizinle bazı bilgileri paylaşmak istedim. Şu anda {currentAltitudeFt} fit yükseklikte saatte {groundSpeed} {% usesKMPH ? 'kilometre' : 'mil' %} hızla seyrediyoruz. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Uçuşun geri kalanı sorunsuz olmalı. Herhangi bir sorunuz olması durumunda lütfen kabin ekibimizden birine sormaktan çekinmeyin. Teşekkür ederim ve uçuşun tadını çıkarın.",
        "nl": "Hallo, ik ben het weer. Ik wil graag wat informatie met u delen. We vliegen momenteel op een hoogte van {currentAltitudeFt} voet met een snelheid van {groundSpeed} {% usesKMPH ? 'kilometer' : 'mijlen' %} per uur. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] De rest van de vlucht zou vlot moeten verlopen. Als u vragen heeft, stel ze dan gerust aan het cabinepersoneel. Bedankt en geniet van uw vlucht.",
        "ko": "안녕하세요. 또 저예요. 여러분과 정보를 나누고 싶어서요. 저희는 현재 {currentAttributeFt}피트의 고도에서 시속 {groundSpeed}로 순항하고 있습니다. {destinationCityName}의 날씨는 {destinationCityWeatherHumanDescription}이며 온도는 {destinationCityTemperature}도입니다. 남은 비행은 순조로울 것으로 보입니다. 궁금한 점이 있으시면 주저하지 말고 객실 승무원에게 물어보세요. 감사합니다. 즐거운 비행 되세요.",
        "pt_pt": "Olá, o comandante novamente. Queria apenas partilhar algumas informações convosco. Estamos atualmente a voar a uma altitude de {currentAltitudeFt} pés a uma velocidade de {groundSpeed} {% usesKMPH ? 'quilómetros' : 'millas' %} por hora. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] O resto do voo deverá ser tranquilo. Em caso de dúvidas, por favor, não hesitem em perguntar a um dos nossos membros da tripulação de cabine. Obrigado e desfrutem do voo.",
        "no": "Hei, det er meg igjen. Jeg ville bare dele litt informasjon med dere. Vi flyr for øyeblikket på en høyde av {currentAltitudeFt} fot med en hastighet på {groundSpeed} {% usesKMPH ? 'kilometer' : 'mil' %} i timen. [The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] Resten av flyturen bør bli jevn. Hvis dere har spørsmål, ikke nøl med å spørre en av våre kabinansatte. Takk, og nyt flyturen.",
        "th": "สวัสดีครับ นี่คือกัปตันอีกครั้ง ขณะนี้เรากำลังบินที่ระดับความสูง {currentAltitudeFt} ฟุต ด้วยความเร็ว {groundSpeed} {% usesKMPH ? 'กิโลเมตรต่อชั่วโมง' : 'ไมล์ต่อชั่วโมง' %} สภาพอากาศใน {destinationCityName} คือ {destinationCityWeatherHumanDescription} อุณหภูมิอยู่ที่ {destinationCityTemperature} องศา เราคาดว่าเที่ยวบินที่เหลือน่าจะราบรื่น หากท่านมีคำถามใด ๆ โปรดแจ้งพนักงานต้อนรับบนเครื่องบิน ขอบคุณและขอให้ท่านเพลิดเพลินกับการเดินทาง",
        "zh": "大家好，又是我。我想与您分享一些信息。我们现在在海拔 {currentAltitudeFt} 英尺的高度上巡航，速度为每小时 {groundSpeed} {% usesKMPH ? '公里' : '英里' %}。[The weather in {destinationCityName} is {destinationCityWeatherHumanDescription}, with a temperature of {destinationCityTemperature} degrees.] 接下来的飞行应该会非常平稳。如果有任何问题，请随时向我们的机组人员提出。谢谢，祝您飞行愉快。"
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
        "pt_br": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Por favor, siga as instruções dos comissários enquanto nos preparamos para o pouso. Obrigado.",
        "es": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Siga las instrucciones de la tripulación de cabina mientras nos preparamos para el aterrizaje. Gracias.",
        "fr": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Veuillez suivre les instructions du personnel de cabine pendant que nous préparons l'atterrissage. Merci.",
        "it": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Si prega di seguire le istruzioni dell'equipaggio di cabina mentre ci prepariamo per l'atterraggio. Grazie.",
        "tr": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] İnişe hazırlanırken lütfen kabin ekibinin talimatlarını takip edin. Teşekkür ederim.",
        "nl": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Volg alstublieft de instructies van het cabinepersoneel terwijl we ons klaarmaken voor de landing. Hartelijk dank.",
        "ko": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] 착륙을 준비하는 동안 객실 승무원의 지시에 따라 주시기 바랍니다. 감사합니다.",
        "pt_pt": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Por favor, sigam as instruções da tripulação de cabine enquanto nos preparamos para a aterragem. Obrigado.",
        "no": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Vennligst følg instruksjonene fra kabinpersonalet mens vi forbereder oss på landing. Takk.",
        "th": "ท่านผู้โดยสารทุกท่าน ขณะนี้เรากำลังเริ่มลดระดับเข้าสู่ {destinationCityName} กรุณาปฏิบัติตามคำแนะนำของพนักงานต้อนรับขณะเราเตรียมตัวลงจอด ขอบคุณค่ะ",
        "zh": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] 请遵循机组人员的指示准备着陆。谢谢。"
      },
      {
        "en": "Ladies and gentlemen, we are starting our descent. Please follow the instructions of the cabin crew as we prepare for landing. Thank you.",
        "pl": "Panie i Panowie, rozpoczynamy zniżanie. Proszę postępować zgodnie z instrukcjami członków załogi. Dziękujemy.",
        "de": "Sehr geehrte Damen und Herren, wir beginnen unseren Sinkflug. Bitte folgen Sie den Anweisungen des Kabinenpersonals, während wir uns auf die Landung vorbereiten. Danke schön.",
        "pt_br": "Senhoras e senhores, estamos iniciando a descida. Por favor, siga as instruções dos comissários enquanto nos preparamos para o pouso. Obrigado.",
        "es": "Damas y caballeros, estamos iniciando nuestro descenso. Siga las instrucciones de la tripulación de cabina mientras nos preparamos para el aterrizaje. Gracias.",
        "fr": "Mesdames et messieurs, nous entamons notre descente. Veuillez suivre les instructions du personnel de cabine pendant que nous préparons l'atterrissage. Merci.",
        "it": "Signore e signori, stiamo iniziando la nostra discesa. Si prega di seguire le istruzioni dell'equipaggio di cabina mentre ci prepariamo per l'atterraggio. Grazie.",
        "tr": "Bayanlar ve baylar, inişimize başladık. İnişe hazırlanırken lütfen kabin ekibinin talimatlarına uyun. Teşekkür ederim.",
        "nl": "Dames en heren, we beginnen aan onze daling. Volg alstublieft de instructies van het cabinepersoneel terwijl we ons klaarmaken voor de landing. Hartelijk dank.",
        "ko": "승객 여러분, 이제 하강을 시작합니다. 착륙을 준비하는 동안 객실 승무원의 지시에 따라 주시기 바랍니다. 감사합니다.",
        "pt_pt": "Senhoras e senhores, estamos a iniciar a nossa descida. Por favor, sigam as instruções da tripulação de cabine enquanto nos preparamos para a aterragem. Obrigado.",
        "no": "Mine damer og herrer, vi begynner nå nedstigningen. Vennligst følg instruksjonene fra kabinpersonalet mens vi forbereder oss på landing. Takk.",
        "th": "ท่านผู้โดยสารทุกท่าน ขณะนี้เราเริ่มลดระดับสู่จุดหมายปลายทาง กรุณาปฏิบัติตามคำแนะนำของพนักงานต้อนรับขณะเราเตรียมตัวลงจอด ขอบคุณ",
        "zh": "女士们，先生们，我们现在开始下降。请遵循机组人员的指示准备着陆。谢谢。"
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
        "pt_br": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Certifique-se de que seu cinto de segurança esteja afivelado e que o encosto do seu assento esteja na posição vertical. Feche a trave a mesinha a sua frente. Coletaremos todos os itens de serviço restantes em alguns minutos. Obrigado.",
        "es": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Asegúrese de que su cinturón de seguridad esté abrochado y que el respaldo del asiento y la bandeja estén en posición vertical. Recogeremos los artículos de servicio restantes en unos minutos. Gracias.",
        "fr": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Veuillez vous assurer que votre ceinture de sécurité est attachée et que votre dossier de siège ainsi que votre tablette sont en position verticale. Nous viendrons chercher les éléments de service restants dans quelques minutes. Merci.",
        "it": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Assicuratevi che le cinture di sicurezza siano allacciate e che lo schienale e il tavolino siano in posizione verticale. Raccoglieremo tutti gli articoli di servizio rimanenti in pochi minuti. Grazie.",
        "tr": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Lütfen emniyet kemerinizin takılı olduğundan ve koltuk arkalığınızın ve tepsi masanızın dik konumda olduğundan emin olun. Kalan hizmet öğelerini birkaç dakika içinde toplayacağız. Teşekkür ederim.",
        "nl": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Zorg ervoor dat uw stoelriem vastzit en dat de rugleuning en stoeltafel rechtop staan. We zullen de resterende service-items over een paar minuten ophalen. Alvast bedankt.",
        "ko": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] 좌석벨트를 매고 좌석 등받이와 앞좌석 선반이 똑바로 접혀있는지 확인하십시오. 몇 분안에 남은 서비스 물품을 수거하겠습니다. 감사합니다.",
        "pt_pt": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Por favor, certifiquem-se de que o vosso cinto de segurança está apertado e que o encosto do assento e a mesa estão na posição vertical. Iremos recolher os restantes itens de serviço dentro de alguns minutos. Obrigado.",
        "no": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] Vennligst sørg for at sikkerhetsbeltet er festet, og at seteryggen og bordet er i oppreist posisjon. Vi vil hente inn eventuelle gjenværende søppel om noen minutter. Takk.",
        "th": "ท่านผู้โดยสารทุกท่าน กัปตันของเราได้แจ้งว่าขณะนี้เราเริ่มลดระดับเข้าสู่ {destinationCityName} กรุณานั่งประจำที่และรัดเข็มขัดที่นั่ง ปรับพนักเก้าอี้ของท่านให้อยู่ในระดับตรง พับโต๊ะหน้าที่นั่ง เราจะเริ่มปิดการบริการในอีกไม่กี่นาที ขอบคุณค่ะ",
        "zh": "[Ladies and gentlemen, as you heard from our captain, we are starting our descent into {destinationCityName}.] 请确保您的安全带已经系好，座椅靠背和小桌板处于竖直位置。我们将在几分钟内收集剩下的服务物品。谢谢。"
      },
      {
        "en": "Ladies and gentlemen, as you heard from our captain, we are starting our descent. Please make sure that your seatbelt is fastened and your seat back and tray table are in the upright position. We will collect any remaining service items in a few minutes. Thank you.",
        "pl": "Szanowni Państwo, jak mogli Państwo usłyszeć - rozpoczynamy nasze zniżanie. Prosimy o upewnienie się, że pasy są zapięte, a oparcie fotela i stolik są w pozycji pionowej. Wkrótce zbierzemy pozostałe śmieci. Dziękujemy.",
        "de": "Sehr geehrte Damen und Herren, wie Sie von unserem Kapitän gehört haben, beginnen wir mit dem Sinkflug. Bitte stellen Sie sicher, dass Ihr Sicherheitsgurt angelegt ist und sich Ihre Rückenlehne und Ihr Tabletttisch in einer aufrechten Position befinden. Wir holen alle verbleibenden Serviceartikel in wenigen Minuten ab. Danke schön.",
        "pt_br": "Senhoras e senhores, como dito pelo comandante, já iniciamos a nossa descida. Certifique-se de que seu cinto de segurança esteja afivelado e que o encosto do seu assento esteja na posição vertical. Feche a trave a mesinha a sua frente. Coletaremos todos os itens de serviço restantes em alguns minutos. Obrigado.",
        "es": "Damas y caballeros, como les dijo nuestro capitán, estamos iniciando nuestro descenso. Asegúrese de que su cinturón de seguridad esté abrochado y que el respaldo del asiento y la bandeja estén en posición vertical. Recogeremos los artículos de servicio restantes en unos minutos. Gracias.",
        "fr": "Mesdames et messieurs, comme vous l’a annoncé notre commandant de bord, nous entamons notre descente. Veuillez vous assurer que votre ceinture de sécurité est attachée et que votre dossier de siège ainsi que votre tablette sont en position verticale. Nous viendrons récupérer les éléments de service restants dans quelques minutes. Merci.",
        "it": "Signore e signori, come avete sentito dal nostro comandante, stiamo iniziando la discesa. Assicuratevi che le cinture di sicurezza siano allacciate e che lo schienale e il tavolino siano in posizione verticale. Raccoglieremo tutti gli articoli di servizio rimanenti in pochi minuti. Grazie.",
        "tr": "Bayanlar ve baylar, kaptanımızdan duyduğunuz gibi inişe başlıyoruz. Lütfen emniyet kemerinizin takılı olduğundan ve koltuk arkalığınızın ve tepsi masanızın dik konumda olduğundan emin olun. Kalan hizmet öğelerini birkaç dakika içinde toplayacağız. Teşekkür ederim.",
        "nl": "Dames en heren, zoals u van onze gezagvoerder hebt gehoord, beginnen we aan de daling. Zorg ervoor dat uw veiligheidsgordel vastzit en dat uw rugleuning en stoeltafel rechtop staan. We zullen over een paar minuten alle resterende service-items ophalen. Alvast bedankt.",
        "ko": "승객 여러분, 기장님 말씀대로 하강을 시작합니다. 좌석벨트를 매고 좌석 등받이와 앞좌석 선반이 똑바로 접혀있는지 확인하십시오. 몇 분 후에 남은 서비스 물품을 수거하겠습니다. 감사합니다.",
        "pt_pt": "Senhoras e senhores, como ouviram do nosso comandante, estamos a iniciar a nossa descida. Por favor, certifiquem-se de que o vosso cinto de segurança está apertado e que o encosto do assento e a mesa estão na posição vertical. Iremos recolher os restantes itens de serviço dentro de alguns minutos. Obrigado.",
        "no": "Mine damer og herrer, som dere har hørt fra kapteinen, begynner vi nå nedstigningen. Vennligst sørg for at sikkerhetsbeltet er festet, og at seteryggen og bordet er i oppreist posisjon. Vi vil hente inn eventuelle gjenværende søppel om noen minutter. Takk.",
        "th": "ท่านผู้โดยสารทุกท่าน ตามที่กัปตันของเราได้แจ้ง ขณะนี้เราเริ่มลดระดับสู่จุดหมายปลายทาง กรุณานั่งประจำที่และรัดเข็มขัดที่นั่ง ปรับพนักเก้าอี้ของท่านให้อยู่ในระดับตรง พับโต๊ะหน้าที่นั่ง เราจะเริ่มปิดการบริการในอีกไม่กี่นาที ขอบคุณค่ะ",
        "zh": "女士们，先生们，正如机长所说，我们现在开始下降。请确保您的安全带已经系好，座椅靠背和小桌板处于竖直位置。我们将在几分钟内收集剩下的服务物品。谢谢。"
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
        "pt_br": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Certifique-se de que seu cinto de segurança esteja afivelado e que o encosto do seu assento esteja na posição vertical. Feche a trave a mesinha a sua frente. Coletaremos todos os itens de serviço restantes em alguns minutos. Obrigado.",
        "es": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Asegúrese de que su cinturón de seguridad esté abrochado y que el respaldo del asiento y la bandeja estén en posición vertical. Recogeremos los artículos de servicio restantes en unos minutos. Gracias.",
        "fr": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Veuillez vous assurer que votre ceinture de sécurité est attachée et que votre dossier de siège ainsi que votre tablette sont en position verticale. Nous viendrons récupérer les éléments de service restants dans quelques minutes. Merci.",
        "it": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Assicuratevi che le cinture di sicurezza siano allacciate e che lo schienale e il tavolino siano in posizione verticale. Raccoglieremo tutti gli articoli di servizio rimanenti in pochi minuti. Grazie.",
        "tr": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Lütfen emniyet kemerinizin takılı olduğundan ve koltuk arkalığınızın ve tepsi masanızın dik konumda olduğundan emin olun. Kalan hizmet öğelerini birkaç dakika içinde toplayacağız. Teşekkür ederim.",
        "nl": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Zorg ervoor dat uw veiligheidsgordel vastzit en dat uw rugleuning en stoeltafel rechtop staan. We zullen over een paar minuten alle resterende service-items ophalen. Alvast bedankt.",
        "ko": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] 좌석벨트가 매여 있고 좌석 등받이와 앞좌석 선반이 똑바로 접혀있는지 확인하십시오. 몇 분 후에 남은 서비스 항목을 수거하겠습니다. 감사합니다.",
        "pt_pt": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Por favor, certifiquem-se de que o vosso cinto de segurança está apertado e que o encosto do assento e a mesa estão na posição vertical. Iremos recolher os restantes itens de serviço dentro de alguns minutos. Obrigado.",
        "no": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Vennligst sørg for at sikkerhetsbeltet er festet, og at seteryggen og bordet er i oppreist posisjon. Vi vil hente inn eventuelle gjenværende søppel om noen minutter. Takk.",
        "th": "ท่านผู้โดยสารทุกท่าน ขณะนี้เราเริ่มลดระดับเข้าสู่ {destinationCityName} กรุณานั่งประจำที่และรัดเข็มขัดที่นั่ง ปรับพนักเก้าอี้ของท่านให้อยู่ในระดับตรง พับโต๊ะหน้าที่นั่ง เราจะเริ่มปิดการบริการในอีกไม่กี่นาที ขอบคุณค่ะ",
        "zh": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] 请确保您的安全带已经系好，座椅靠背和小桌板处于竖直位置。我们将在几分钟内收集剩下的服务物品。谢谢。"
      },
      {
        "en": "Ladies and gentlemen, we are starting our descent. Please make sure that your seatbelt is fastened and your seat back and tray table are in the upright position. We will collect any remaining service items in a few minutes. Thank you.",
        "pl": "Ladies and gentlemen, we are starting our descent. Prosimy o upewnienie się, że Państwa pasy są zapięte, a oparcie fotela i stolik są w pozycji pionowej. Wkrótce zbierzemy śmieci. Dziękujemy.",
        "de": "Sehr geehrte Damen und Herren, wir beginnen unseren Sinkflug. Bitte stellen Sie sicher, dass Ihr Sicherheitsgurt angelegt ist und sich Ihre Rückenlehne und Ihr Tabletttisch in einer aufrechten Position befinden. Wir holen alle verbleibenden Serviceartikel in wenigen Minuten ab. Danke schön.",
        "pt_br": "Senhoras e senhores, estamos iniciando a descida. Certifique-se de que seu cinto de segurança esteja afivelado e que o encosto do seu assento esteja na posição vertical. Feche a trave a mesinha a sua frente. Coletaremos todos os itens de serviço restantes em alguns minutos. Obrigado.",
        "es": "Damas y caballeros, estamos iniciando nuestro descenso. Asegúrese de que su cinturón de seguridad esté abrochado y que el respaldo del asiento y la bandeja estén en posición vertical. Recogeremos los artículos de servicio restantes en unos minutos. Gracias.",
        "fr": "Mesdames et messieurs, nous entamons notre descente. Veuillez vous assurer que votre ceinture de sécurité est attachée et que votre dossier de siège ainsi que votre tablette sont en position verticale. Nous viendrons récupérer les éléments de service restants dans quelques minutes. Merci.",
        "it": "Signore e signori, stiamo iniziando la nostra discesa. Assicuratevi che le cinture di sicurezza siano allacciate e che lo schienale e il tavolino siano in posizione verticale. Raccoglieremo tutti gli articoli di servizio rimanenti in pochi minuti. Grazie.",
        "tr": "Bayanlar ve baylar, inişimize başladık. Lütfen emniyet kemerinizin takılı olduğundan ve koltuk arkalığınızın ve tepsi masanızın dik konumda olduğundan emin olun. Kalan hizmet öğelerini birkaç dakika içinde toplayacağız. Teşekkür ederim.",
        "nl": "Dames en heren, we beginnen aan de daling. Zorg ervoor dat uw veiligheidsgordel vastzit en dat uw rugleuning en stoeltafel rechtop staan. We zullen over een paar minuten alle resterende service-items ophalen. Dank u wel.",
        "ko": "승객 여러분, 하강을 시작합니다. 좌석벨트를 매고 좌석 등받이와 앞좌석 선반이 똑바로 접혀있는지 확인하십시오. 몇 분 후에 남은 서비스 물품을 수거하겠습니다. 감사합니다.",
        "pt_pt": "Senhoras e senhores, estamos a iniciar a nossa descida. Por favor, certifiquem-se de que o vosso cinto de segurança está apertado e que o encosto do assento e a mesa estão na posição vertical. Iremos recolher os restantes itens de serviço dentro de alguns minutos. Obrigado.",
        "no": "Mine damer og herrer, vi begynner nå nedstigningen. Vennligst sørg for at sikkerhetsbeltet er festet, og at seteryggen og bordet er i oppreist posisjon. Vi vil hente inn eventuelle gjenværende søppel om noen minutter. Takk.",
        "th": "ท่านผู้โดยสารทุกท่าน ขณะนี้เรากำลังเริ่มลดระดับลงสู่จุดหมายปลายทาง กรุณานั่งประจำที่และรัดเข็มขัดที่นั่ง ปรับพนักเก้าอี้ของท่านให้อยู่ในระดับตรง พับโต๊ะหน้าที่นั่ง เราจะเริ่มปิดการบริการในอีกไม่กี่นาที ขอบคุณค่ะ",
        "zh": "女士们，先生们，我们现在开始下降。请确保您的安全带已经系好，座椅靠背和小桌板处于竖直位置。我们将在几分钟内收集剩下的服务物品。谢谢。"
      }
    ]
  },

  // Dim lights for landing
  {
    "category": "captain-dim-lights-for-landing",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_DESCENT']},
    "conditions": [
      {"type": "runtimeFlightMetadata", "key": "isDarkOutside", "value": [1]}
    ],
    "timeout": [480, 500],
    "onlyPriorityLanguage": true,
    "runtimeGenerated": true,
    "chime": "DING",
    "texts": [
      {
        "en": "Cabin crew, please dim the lights for landing.",
        "pl": "Proszę ściemnić światła do lądowania.",
        "de": "Kabinenpersonal, bitte dimmen Sie die Lichter für die Landung.",
        "pt_br": "Tripulação de cabine, por favor, diminuam as luzes para o pouso.",
        "es": "Tripulación de cabina, por favor, atenúen las luces para el aterrizaje.",
        "fr": "Personnel de cabine, veuillez atténuer les lumières pour l'atterrissage.",
        "it": "Personale di cabina, si prega di abbassare le luci per l'atterraggio.",
        "tr": "Kabin ekibi, lütfen iniş için ışıkları kısın.",
        "nl": "Cabinepersoneel, dim alstublieft de lichten voor de landing.",
        "ko": "캐빈크루, 착륙을 위해 조명을 어둡게 해주세요.",
        "pt_pt": "Tripulação de cabine, por favor, diminuam as luzes para a aterragem.",
        "no": "Kabinbesetning, vennligst demp lysene for landing.",
        "th": "พนักงานบนเครื่อง กรุณาปิดแสงสำหรับการลงจอด",
        "zh": "机组人员，请为着陆调暗灯光。"
      }
    ]
  },
  {
    "category": "crew-dim-lights-for-landing",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_DESCENT']},
    "conditions": [
      {"type": "runtimeFlightMetadata", "key": "isDarkOutside", "value": [1]}
    ],
    "timeout": [500, 510],
    "onlyPriorityLanguage": false,
    "runtimeGenerated": true,
    "texts": [
      {
        "en": "Ladies and gentlemen, lights will be dimmed for landing due to safety reasons.",
        "pl": "Szanowni Państwo, światła zostaną ściemnione przed lądowaniem z powodów bezpieczeństwa.",
        "de": "Meine Damen und Herren, die Lichter werden aus Sicherheitsgründen für die Landung gedimmt.",
        "pt_br": "Senhoras e senhores, as luzes serão reduzidas para o pouso por motivos de segurança.",
        "es": "Señoras y señores, las luces se atenuarán para el aterrizaje por razones de seguridad.",
        "fr": "Mesdames et messieurs, les lumières seront tamisées pour l'atterrissage pour des raisons de sécurité.",
        "it": "Signore e signori, le luci verranno abbassate per l'atterraggio per motivi di sicurezza.",
        "tr": "Bayanlar ve baylar, ışıkların iniş için güvenlik nedeniyle kısılacağını duyuruyoruz.",
        "nl": "Dames en heren, de lichten worden gedimd voor de landing om veiligheidsredenen.",
        "ko": "여러분, 안전상의 이유로 착륙을 위해 조명이 어두워집니다.",
        "pt_pt": "Senhoras e senhores, as luzes serão reduzidas para a aterragem por razões de segurança.",
        "no": "Damer og herrer, lysene vil dempes for landing av sikkerhetsgrunner.",
        "th": "ท่านผู้โดยสารทุกท่าน ไฟจะหรี่ลงก่อนเครื่องขึ้น เนื่องจากเหตุผลด้านความปลอดภัย",
        "zh": "女士们，先生们，由于"
      },
      {
        "en": "We will be dimming the lights for landing. Please use the reading light above your seat if you need additional light.",
        "pl": "Światła zostaną ściemnione przed lądowaniem. Prosimy o skorzystanie z lampki do czytania nad Państwa miejscem, jeśli potrzebują Państwo dodatkowego światła.",
        "de": "Wir werden die Lichter für die Landung dimmen. Bitte verwenden Sie die Leselampe über Ihrem Sitz, wenn Sie zusätzliches Licht benötigen.",
        "pt_br": "As luzes serão reduzidas para o pouso. Por favor, use a luz de leitura acima do seu assento se precisar de luz adicional.",
        "es": "Bajaremos la intensidad de las luces para el aterrizaje. Utilice la luz de lectura que se encuentra sobre su asiento si necesita luz adicional.",
        "fr": "Nous allons tamiser les lumières pour l'atterrissage. Veuillez utiliser la lampe de lecture au-dessus de votre siège si vous avez besoin de lumière supplémentaire.",
        "it": "Abbasseremo le luci per l'atterraggio. Si prega di utilizzare la luce di lettura sopra il proprio sedile se si necessita di luce aggiuntiva.",
        "tr": "İniş için ışıkları kısacağız. Ekstra ışığa ihtiyacınız varsa, lütfen koltuğunuzun üstündeki okuma lambasını kullanın.",
        "nl": "We zullen de lichten dimmen voor de landing. Gebruik de leeslamp boven uw stoel als u extra licht nodig heeft.",
        "ko": "착륙을 위해 조명을 어둡게 할 예정입니다. 추가 조명이 필요하시면 좌석 위의 조명을 사용해주세요.",
        "pt_pt": "As luzes serão reduzidas para a aterragem. Por favor, use a luz de leitura acima do seu assento se precisar de luz adicional.",
        "no": "Vi vil dempe lysene for landing. Vennligst bruk leselyset over setet ditt hvis du trenger ekstra lys.",
        "th": "เราจะปิดแสงสำหรับการลงจอด กรุณาใช้ไฟส่องสำหรับการอ่านข้างบนเพื่อเพิ่มแสง",
        "zh": "我们将为着陆调暗灯光。如果您需要额外的光，请使用座位上方的阅读灯。"
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
        "pt_br": "Tripulação, preparar para o pouso.",
        "es": "Tripulación de cabina, tomen asiento para aterrizar.",
        "fr": "Personnel de cabine, prenez place pour l'atterrissage.",
        "it": "Assistenti di volo, prepararsi per l'atterraggio.",
        "tr": "Kabin ekibi, iniş için yerlerinizi alın.",
        "nl": "Cabinepersoneel, neem plaats voor de landing.",
        "ko": "캐빈크루, 곧 착륙할 예정이니 자리에 앉아주세요.",
        "pt_pt": "Tripulação de cabine, ocupem os vossos lugares para a aterragem.",
        "no": "Kabinpersonalet, gjør dere klare for landing.",
        "th": "ลูกเรือทุกท่าน กรุณานั่งประจำที่เพื่อเตรียมตัวสำหรับการลงจอด",
        "zh": "机组人员，请就座，准备降落。"
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
        "en": "Ladies and gentlemen, welcome to {destinationCityName}. The time is currently {localTimeHours} {localTimeMinutes}. Please remain seated with your seatbelt fastened until the aircraft has come to a complete stop and the seatbelt sign has been turned off. Please make sure you have all your personal belongings with you before you leave the aircraft. On behalf of the crew, I would like to thank you for flying with us today. We hope you had a pleasant flight and we look forward to welcoming you on board again soon.",
        "pl": "[Ladies and gentlemen, welcome to {destinationCityName}.] [The time is currently {localTimeHours} {localTimeMinutes}.] Prosimy o pozostanie na miejscach z zapiętymi pasami bezpieczeństwa, aż samolot całkowicie się zatrzyma i sygnał zapięcia pasów zostanie wyłączony. Upewnijcie się, że macie ze sobą wszystkie swoje rzeczy osobiste przed opuszczeniem samolotu. Dziękuję za lot z nami w dniu dzisiejszym. Mamy nadzieję, że mieli państwo przyjemny lot i mamy nadzieję gościć państwa ponownie w najbliższej przyszłości.",
        "de": "[Ladies and gentlemen, welcome to {destinationCityName}.] [The time is currently {localTimeHours} {localTimeMinutes}.] Bitte bleiben Sie mit angelegtem Sicherheitsgurt sitzen, bis das Flugzeug vollständig zum Stillstand gekommen ist und das Anschnallzeichen ausgeschaltet ist. Bitte stellen Sie sicher, dass Sie alle Ihre persönlichen Gegenstände bei sich haben, bevor Sie das Flugzeug verlassen. Im Namen der Crew möchte ich Ihnen dafür danken, dass Sie heute mit uns geflogen sind. Wir hoffen, Sie hatten einen angenehmen Flug und freuen uns, Sie bald wieder an Bord begrüßen zu dürfen.",
        "pt_br": "[Ladies and gentlemen, welcome to {destinationCityName}.] [The time is currently {localTimeHours} {localTimeMinutes}.] Por favor, permaneçam sentados com o cinto de segurança afivelados até que a aeronave pare completamente e o aviso de atar os cintos se apague. Certifique-se de ter todos os seus pertences pessoais com você antes de sair da aeronave. Em nome da tripulação, gostaria de agradecer por voar conosco hoje. Esperamos que você tenha tido um voo agradável e esperamos recebê-lo novamente a bordo em breve.",
        "es": "[Ladies and gentlemen, welcome to {destinationCityName}.] [The time is currently {localTimeHours} {localTimeMinutes}.] Permanezca sentado con el cinturón de seguridad abrochado hasta que el avión se detenga por completo y se apague la señal de cinturón de seguridad. Asegúrese de tener todas sus pertenencias personales consigo antes de abandonar el avión. En nombre de la tripulación, me gustaría agradecerle por volar con nosotros hoy. Esperamos que haya tenido un vuelo agradable y esperamos darle la bienvenida a bordo nuevamente pronto.",
        "fr": "[Ladies and gentlemen, welcome to {destinationCityName}.] [The time is currently {localTimeHours} {localTimeMinutes}.] Veuillez rester assis avec votre ceinture de sécurité attachée jusqu'à ce que l'avion soit complètement arrêté et que le signal de ceinture soit éteint. Assurez-vous d’avoir tous vos effets personnels avec vous avant de quitter l'avion. Au nom de l'équipage, je tiens à vous remercier d'avoir voyagé avec nous aujourd'hui. Nous espérons que vous avez passé un agréable vol et nous avons hâte de vous accueillir à nouveau à bord très bientôt.",
        "it": "[Ladies and gentlemen, welcome to {destinationCityName}.] [The time is currently {localTimeHours} {localTimeMinutes}.] Vi preghiamo di rimanere seduti con la cintura di sicurezza allacciata fino a quando l'aereo non si è fermato completamente e il segnale della cintura di sicurezza verrà spento. Prima di lasciare l’aereo, assicuratevi di avere con voi tutti i vostri effetti personali. A nome dell'equipaggio, vi ringraziamo per aver volato con noi oggi. Speriamo che abbiate avuto un volo piacevole e non vediamo l'ora di accogliervi nuovamente a bordo presto.",
        "tr": "[Ladies and gentlemen, welcome to {destinationCityName}.] [The time is currently {localTimeHours} {localTimeMinutes}.] Uçak tamamen durana ve emniyet kemeri işareti kapatılana kadar lütfen emniyet kemeriniz bağlı olarak yerinizde kalın. Lütfen uçaktan ayrılmadan önce tüm kişisel eşyalarınızın yanınızda olduğundan emin olun. Mürettebat adına bugün bizimle uçtuğunuz için teşekkür etmek istiyorum. Keyifli bir uçuş geçirdiğinizi umar, sizi en kısa zamanda tekrar gemimizde ağırlamayı sabırsızlıkla bekliyoruz.",
        "nl": "[Ladies and gentlemen, welcome to {destinationCityName}.] [The time is currently {localTimeHours} {localTimeMinutes}.] Blijft u alstublieft zitten met uw veiligheidsgordel om totdat het toestel volledig tot stilstand is gekomen en het stoelriemen vast teken is uitgezet. Zorg ervoor dat u al uw persoonlijke bezittingen bij u heeft voordat u het toestel verlaat. Namens de bemanning wil ik u bedanken voor het vliegen met ons vandaag. We hopen dat u een prettige vlucht heeft gehad en we hopen u snel weer aan boord te mogen verwelkomen.",
        "ko": "[Ladies and gentlemen, welcome to {destinationCityName}.] [The time is currently {localTimeHours} {localTimeMinutes}.] 비행기가 완전히 정지하고 좌석벨트 싸인이 꺼질 때까지 좌석벨트를 매고 앉아 계십시오. 비행기를 떠나기 전에 잊으신 물건은 없는지 확인하시기 바랍니다. 승무원을 대표하여 오늘 저희와 함께 비행해 주셔서 감사드립니다. 즐거운 비행이 되셨기를 바라며 다시 만날 수 있기를 기대합니다.",
        "pt_pt": "[Ladies and gentlemen, welcome to {destinationCityName}.] [The time is currently {localTimeHours} {localTimeMinutes}.] Por favor, permaneçam sentados com o cinto de segurança apertado até que a aeronave esteja completamente parada e o sinal de apertar os cintos seja desligado. Certifiquem-se de que têm todos os vossos pertences pessoais convosco antes de deixarem a aeronave. Em nome da tripulação, gostaria de vos agradecer por voarem connosco hoje. Esperamos que tenham tido um voo agradável e esperamos recebê-los a bordo novamente em breve.",
        "no": "[Ladies and gentlemen, welcome to {destinationCityName}.] [The time is currently {localTimeHours} {localTimeMinutes}.] Vennligst forbli sittende med sikkerhetsbeltet festet til flyet har kommet til full stopp og fest-sikkerhetsbelteskiltet er slått av. Sørg for at dere har alle personlige eiendeler med dere før dere forlater flyet. På vegne av mannskapet vil jeg takke dere for at dere fløy med oss i dag. Vi håper dere har hatt en behagelig flytur, og vi ser frem til å ønske dere velkommen om bord igjen snart.",
        "th": "ท่านผู้โดยสารทุกท่าน ยินดีต้อนรับสู่ {destinationCityName} กรุณานั่งประจำที่และคาดเข็มที่นั่งไว้จนกว่าเครื่องบินจะหยุดสนิทและสัญญาณเข็มขัดนิรภัยจะดับลง กรุณาตรวจสอบสิ่งของส่วนตัวของท่านก่อนออกจากเครื่องบิน ในนามของลูกเรือ ดิฉันขอขอบคุณที่เลือกเดินทางกับเราในวันนี้ เราหวังเป็นอย่างยิ่งว่าท่านได้รับความพึงพอใจและหวังว่าเราจะได้ต้อนรับท่านอีก",
        "zh": "[Ladies and gentlemen, welcome to {destinationCityName}.] [The time is currently {localTimeHours} {localTimeMinutes}.] 请保持系好安全带并坐在座位上，直到飞机完全停稳且安全带标志熄灭。请在下飞机前确保携带好您的所有随身物品。代表全体机组人员，感谢您今天选择与我们一起飞行。我们希望您度过了一个愉快的旅程，并期待再次欢迎您登机。"
      },
      {
        "en": "Welcome to {destinationCityName}. Current local time is {localTimeMinutes} minutes past {localTimeHours}. Please remain seated with your seatbelt fastened until the aircraft has come to a complete stop and the seatbelt sign has been turned off. Please make sure you have all your personal belongings with you before you leave the aircraft. On behalf of the crew, I would like to thank you for flying with us today. We hope you had a pleasant flight and we look forward to welcoming you on board again soon.",
        "pl": "[Welcome to {destinationCityName}.] [Current local time is {localTimeMinutes} minutes past {localTimeHours}.] Prosimy o pozostanie na miejscach z zapiętymi pasami bezpieczeństwa, aż samolot całkowicie się zatrzyma i sygnał zapięcia pasów zostanie wyłączony. Upewnijcie się, że macie ze sobą wszystkie swoje rzeczy osobiste przed opuszczeniem samolotu. Dziękuję za lot z nami w dniu dzisiejszym. Mamy nadzieję, że mieli państwo przyjemny lot i mamy nadzieję gościć państwa ponownie w najbliższej przyszłości.",
        "de": "[Welcome to {destinationCityName}.] [Current local time is {localTimeMinutes} minutes past {localTimeHours}.] Bitte bleiben Sie mit angelegtem Sicherheitsgurt sitzen, bis das Flugzeug vollständig zum Stillstand gekommen und das Anschnallzeichen ausgeschaltet ist. Bitte stellen Sie sicher, dass Sie alle Ihre persönlichen Gegenstände bei sich haben, bevor Sie das Flugzeug verlassen. Im Namen der Crew möchte ich Ihnen dafür danken, dass Sie heute mit uns geflogen sind. Wir hoffen, Sie hatten einen angenehmen Flug und freuen uns, Sie bald wieder an Bord begrüßen zu dürfen.",
        "pt_br": "[Welcome to {destinationCityName}.] [Current local time is {localTimeMinutes} minutes past {localTimeHours}.] Por favor, permaneça sentado com o cinto de segurança afivelado até que a aeronave pare completamente e o aviso de atar os cintos seja apagado. Certifique-se de ter todos os seus pertences pessoais com você antes de sair da aeronave. Em nome da tripulação, gostaria de agradecer por voar conosco hoje. Esperamos que você tenha tido um voo agradável e esperamos recebê-lo novamente a bordo em breve.",
        "es": "[Welcome to {destinationCityName}.] [Current local time is {localTimeMinutes} minutes past {localTimeHours}.] Permanezca sentado con el cinturón de seguridad abrochado hasta que el avión se detenga por completo y se apague la señal de cinturón de seguridad. Asegúrese de tener todas sus pertenencias personales consigo antes de abandonar el avión. En nombre de la tripulación, me gustaría agradecerle por volar con nosotros hoy. Esperamos que haya tenido un vuelo agradable y esperamos darle la bienvenida a bordo nuevamente pronto.",
        "fr": "[Welcome to {destinationCityName}.] [Current local time is {localTimeMinutes} minutes past {localTimeHours}.] Veuillez rester assis avec votre ceinture de sécurité attachée jusqu'à ce que l'avion soit complètement arrêté et que le signal de ceinture soit éteint. Assurez-vous de prendre tous vos effets personnels avec vous avant de quitter l'avion. Au nom de l'équipage, je vous remercie d'avoir volé avec nous aujourd'hui. Nous espérons que vous avez passé un agréable vol et nous serons ravis de vous accueillir à nouveau très bientôt.",
        "it": "[Welcome to {destinationCityName}.] [Current local time is {localTimeMinutes} minutes past {localTimeHours}.] Vi preghiamo di rimanere seduti con la cintura di sicurezza allacciata fino a quando l'aereo sarà completamente fermo e il segnale della cintura sarà spento. Prima di lasciare l’aereo, assicuratevi di avere con voi tutti i vostri effetti personali. A nome dell’equipaggio, vi ringraziamo per aver volato con noi oggi. Speriamo che abbiate avuto un volo piacevole e non vediamo l’ora di accogliervi di nuovo a bordo presto.",
        "tr": "[Welcome to {destinationCityName}.] [Current local time is {localTimeMinutes} minutes past {localTimeHours}.] Uçak tamamen durana ve emniyet kemeri işareti kapatılana kadar lütfen emniyet kemeriniz bağlı olarak yerinizde kalın. Lütfen uçaktan ayrılmadan önce tüm kişisel eşyalarınızın yanınızda olduğundan emin olun. Mürettebat adına bugün bizimle uçtuğunuz için teşekkür etmek istiyorum. Keyifli bir uçuş geçirdiğinizi umar, sizi en kısa zamanda tekrar gemimizde ağırlamayı sabırsızlıkla bekliyoruz.",
        "nl": "[Welcome to {destinationCityName}.] [Current local time is {localTimeMinutes} minutes past {localTimeHours}.] Blijft u alstublieft zitten met uw veiligheidsgordel om totdat het vliegtuig volledig tot stilstand is gekomen en het stoelriemen vast teken is uitgeschakeld. Zorg ervoor dat u al uw persoonlijke bezittingen bij u heeft voordat u het toestel verlaat. Namens de bemanning wil ik u bedanken voor het vliegen met ons vandaag. We hopen dat u een prettige vlucht heeft gehad en verwelkomen u graag binnenkort weer aan boord.",
        "ko": "[Welcome to {destinationCityName}.] [Current local time is {localTimeMinutes} minutes past {localTimeHours}.] 비행기가 완전히 정지하고 좌석벨트 싸인이 꺼질 때까지 좌석벨트를 매고 앉아 계십시오. 항공기를 떠나기 전에 잊으신 물건은 없는지 확인하시기 바랍니다. 승무원을 대표하여 오늘 저희와 함께 비행해 주셔서 감사합니다. 즐거운 비행이 되었기를 바라며 곧 기내에서 다시 만날 수 있기를 기대합니다.",
        "pt_pt": "[Welcome to {destinationCityName}.] [Current local time is {localTimeMinutes} minutes past {localTimeHours}.] Por favor, permaneçam sentados com o cinto de segurança apertado até que a aeronave esteja completamente parada e o sinal de apertar os cintos seja desligado. Certifiquem-se de que têm todos os vossos pertences pessoais convosco antes de deixarem a aeronave. Em nome da tripulação, gostaria de vos agradecer por voarem connosco hoje. Esperamos que tenham tido um voo agradável e esperamos recebê-los a bordo novamente em breve.",
        "no": "[Welcome to {destinationCityName}.] [Current local time is {localTimeMinutes} minutes past {localTimeHours}.] Vennligst forbli sittende med sikkerhetsbeltet festet til flyet har kommet til full stopp og fest-sikkerhetsbelteskiltet er slått av. Sørg for at dere har alle personlige eiendeler med dere før dere forlater flyet. På vegne av mannskapet vil jeg takke dere for at dere fløy med oss i dag. Vi håper dere har hatt en behagelig flytur, og vi ser frem til å ønske dere velkommen om bord igjen snart.",
        "th": "ยินดีต้อนรับสู่ {destinationCityName} กรุณานั่งประจำที่และคาดเข็มขัดนิรภัยไว้จนกว่าเครื่องบินจะหยุดสนิทและไฟสัญญาณเข็มขัดนิรภัยจะดับลง กรุณาตรวจสอบสิ่งของส่วนตัวของท่านก่อนออกจากเครื่องบิน ในนามของลูกเรือ ดิฉันขอขอบคุณที่เลือกเดินทางกับเราในวันนี้ เราหวังเป็นอย่างยิ่งว่าท่านได้รับความพึงพอใจและหวังว่าเราจะได้ต้อนรับท่านอีก",
        "zh": "[Welcome to {destinationCityName}.] [Current local time is {localTimeMinutes} minutes past {localTimeHours}.] 请保持系好安全带并坐在座位上，直到飞机完全停稳且安全带标志熄灭。请在下飞机前确保携带好您的所有随身物品。代表全体机组人员，感谢您今天选择与我们一起飞行。我们希望您度过了一个愉快的旅程，并期待再次欢迎您登机。"
      }
    ]
  },

  // Disarm doors and cross-check
  {
    "category": "captain-disarm-doors-and-cross-check",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_ON_BLOCKS']},
    "timeout": [5, 10],
    "onlyPriorityLanguage": true,
    "runtimeGenerated": true,
    "texts": [
      {
        "en": "Cabin crew, disarm doors and cross-check.",
        "pl": "Proszę personel pokładowy o rozbrojenie drzwi i sprawdzenie.",
        "de": "Kabinenpersonal, entriegeln Sie die Türen und führen Sie eine Quersicherung durch.",
        "pt_br": "Tripulação, desarmar portas e verificação cruzada.",
        "es": "Tripulación de cabina, desarmen las puertas y hagan una verificación cruzada.",
        "fr": "Personnel de cabine, désarmez les portes et effectuez une vérification croisée.",
        "it": "Assistenti di volo, disarmare le porte e controllare incrociato.",
        "tr": "Kabin ekibi, kapıları devre dışı bırakın ve çapraz kontrol yapın.",
        "nl": "Cabinepersoneel, ontgrendel de deuren en voer een kruiscontrole uit.",
        "ko": "캐빈크루, 문을 해제하고 교차 확인해주세요.",
        "pt_pt": "Tripulação de cabine, desarmar portas e verificação cruzada.",
        "no": "Kabinpersonalet, deaktiver dørene og krysskontroller.",
        "th": "ลูกเรือ ปลดปืนประตูและตรวจสอบแบบ cross-check",
        "zh": "机组人员，请解除门锁并进行交叉检查。"
      }
    ]
  },

  // Deboarding
  {
    "category": "crew-deboarding",
    "trigger": {"event": "flightStateChange", "value": ['FLIGHT_ON_BLOCKS']},
    "timeout": [20, 30],
    "chime": "DING_DONG",
    "runtimeGenerated": true,
    "texts": [
      {
        "en": "Doors will be opened shortly. Please remember to take all your personal belongings with you. Make sure you have everything you brought on board. Thank you.",
        "pl": "Drzwi zostaną otwarte wkrótce. Prosimy pamiętać, aby zabrać ze sobą wszystkie swoje rzeczy osobiste. Upewnijcie się, że macie ze sobą wszystko, co przynieśliście na pokład. Dziękujemy.",
        "de": "Die Türen werden in Kürze geöffnet. Bitte denken Sie daran, alle Ihre persönlichen Gegenstände mitzunehmen. Stellen Sie sicher, dass Sie alles dabei haben, was Sie an Bord mitgebracht haben. Danke schön.",
        "pt_br": "As portas serão abertas em breve. Lembre-se de levar todos os seus pertences pessoais com você. Certifique-se de ter tudo o que trouxe a bordo. Obrigado.",
        "es": "Las puertas se abrirán en breve. Recuerde llevar consigo todas sus pertenencias personales. Asegúrate de tener todo lo que trajiste a bordo. Gracias.",
        "fr": "Les portes seront ouvertes sous peu. Veuillez vous rappeler de prendre tous vos effets personnels avec vous. Assurez-vous de ne rien oublier avant de quitter l'avion. Merci.",
        "it": "Le porte verranno aperte a breve. Ricordatevi di portare con voi tutti i vostri effetti personali. Assicuratevi di avere tutto ciò che avete portato a bordo. Grazie.",
        "tr": "Kapılar kısa süre içerisinde açılacaktır. Lütfen tüm kişisel eşyalarınızı yanınıza almayı unutmayın. Gemiye getirdiğiniz her şeyin yanınızda olduğundan emin olun. Teşekkür ederim.",
        "nl": "De deuren worden binnenkort geopend. Vergeet niet al uw persoonlijke bezittingen mee te nemen. Zorgt u ervoor dat u alles wat u heeft meegenomen aan boord meeneemt. Bedankt voor uw medewerking.",
        "ko": "곧 문이 열립니다. 개인 소지품은 모두 챙기시는 것을 잊지마세요. 잊으신 물건이 없는지 다시 한번 확인바랍니다. 감사합니다.",
        "pt_pt": "As portas serão abertas brevemente. Por favor, lembrem-se de levar todos os vossos pertences pessoais convosco. Certifiquem-se de que têm tudo o que trouxeram a bordo. Obrigado.",
        "no": "Dørene vil bli åpnet snart. Vennligst husk å ta med alle personlige eiendeler. Sørg for at dere har alt dere tok med om bord. Takk.",
        "th": "ประตูจะถูกเปิดในไม่ช้า กรุณาตรวจสอบสิ่งของส่วนตัวของท่านก่อนออกจากเครื่องบิน ขอบคุณค่ะ",
        "zh": "舱门即将打开。请记得携带好您的所有随身物品，确保带齐您登机时的所有物品。谢谢。"
      },
      {
        "en": "We have arrived at the gate. Please remember to take all your personal belongings with you. Have a great day.",
        "pl": "Dotarliśmy do bramki. Prosimy pamiętać, aby zabrać ze sobą wszystkie swoje rzeczy osobiste. Miłego dnia.",
        "de": "Wir sind am Gate angekommen. Bitte denken Sie daran, alle Ihre persönlichen Gegenstände mitzunehmen. Ich wünsche ihnen einen wunderbaren Tag.",
        "pt_br": "Chegamos ao portão. Lembrem-se de levar todos os seus pertences pessoais com você, tenham todos um bom dia.",
        "es": "Hemos llegado a la puerta. Recuerde llevar consigo todas sus pertenencias personales. Qué tengas un lindo día.",
        "fr": "Nous sommes arrivés à la porte. Veuillez vous rappeler de prendre tous vos effets personnels avec vous. Passez une excellente journée.",
        "it": "Siamo arrivati al gate. Ricordatevi di portare con voi tutti i vostri effetti personali. Vi auguriamo una buona giornata.",
        "tr": "Terminal kapısına geldik. Lütfen tüm kişisel eşyalarınızı yanınıza almayı unutmayın. İyi günler.",
        "nl": "We zijn aangekomen bij de gate. Vergeet niet al uw persoonlijke bezittingen mee te nemen. We wensen u een fijne dag.",
        "ko": "게이트에 도착했습니다. 개인 소지품은 모두 챙겨가시기 바랍니다. 좋은 하루 되세요.",
        "pt_pt": "Chegámos à porta de embarque. Por favor, lembrem-se de levar todos os vossos pertences pessoais convosco. Tenham um ótimo dia e até à próxima.",
        "no": "Vi har ankommet gaten. Vennligst husk å ta med alle personlige eiendeler. Ha en flott dag.",
        "th": "เราได้มาถึงประตูทางออกแล้วค่ะ  กรุณาตรวจสอบสิ่งของส่วนตัวของท่านก่อนออกจากเครื่องบิน เราหวังเป็นอย่างยิ่งว่าท่านได้รับความพึงพอใจและหวังว่าเราจะได้ต้อนรับท่านอีก",
        "zh": "我们已到达登机口。请记得携带好您的所有随身物品。祝您度过美好的一天。"
      }
    ]
  }
]

export default texts;
