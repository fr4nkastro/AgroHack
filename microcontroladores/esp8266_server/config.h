//Comunicación serial
int velocidadBaudios= 1200;
String serialInput;
String currentCommand;
const unsigned int MAX_MESSAGE_LENGTH =10;


const char* ssid     = "2";
const char* password = "12345678";

// const char* ssid     = "InprosaMiraflores 5g";
// const char* password = "InprosaM02";

const char* hostname = "ESP8266_1";

IPAddress ip(192,168,1,100 );
IPAddress gateway(192,168,1,1);
IPAddress subnet(255, 255, 255, 0);
IPAddress dns1(8,8,8,8);

enum option {allStatus, pump, fan1, fan2, humiditySensor, subterraneo, aereo, ambos};

int sPump;
int sFan1;
int sFan2;
int sRelay;
int sHumiditySensor;
int sHumiditySensor2;
int sBuiltInLed;
int sPushEmergency;
int sCaudalSensor;
float sVolume;
float sTemperature;
int sAereo;
int sSubterraneo;


const int pPump= 2;     //D4
const int pFan1= 14;    //D5
const int pFan2= 12;    //D6
const int pRelay= 13;   //D7
const int pSubterraneo = 5; //D1
const int pAereo = 4; //D2


const int pPushEmergency= 0;  //D3


const int pBuiltInLed= LED_BUILTIN;
