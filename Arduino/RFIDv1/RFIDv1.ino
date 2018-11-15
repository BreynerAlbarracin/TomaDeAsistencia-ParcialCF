/*
   D0
   D1 SDA (LDC)
   D2 SCL
   D3
   D4 SDA
   D5 SCK
   D6 MISO
   D7 MOSI
   D8 RST
*/

#include <ESP8266WiFi.h>
#include <SPI.h>
#include <ESP8266HTTPClient.h>
#include <MFRC522.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>

//WiFi
const char* ssid = ":v";
const char* password = "Usaka.red2804";
const int httpPort = 80;

//RFID
#define SDA D4
#define RST D8
MFRC522 mfrc522(SDA, RST);  // Create MFRC522 instance

//Pantalla
LiquidCrystal_I2C lcd(0x27, 16, 2);

//Programa
boolean lectura = false;
boolean espera = true;

void setup() {
  Serial.begin(115200);
  while (!Serial);

  Serial.println("SetUp iniciado");
  crearLcd();
  conectarWifi();
  conectarRFID();

  Serial.println("SetUp listo");
}

void crearLcd() {
  //Iniciamos el LDC
  Serial.println("Iniciando LCD");
  lcd.init();
  lcd.backlight();
  lcd.setCursor(4, 0);
  lcd.print("INTERFAZ");
  lcd.setCursor(4, 1);
  lcd.print("INICIADA");

  delay(1000);
}

void conectarWifi() {
  //Conectamos WiFi
  Serial.print("Conectando a: ");
  Serial.println(ssid);
  lcdArriba("Conectando a: ", 1);
  lcdAbajo(ssid, 1);
  delay(1000);

  //Cambiamos a modo Cliente y conectamos a la red
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  lcdArriba("Conexion", 4);
  lcdAbajo("Establecida", 3);
  delay(500);
}

void conectarRFID() {
  //Creamos y verificamos RFID
  SPI.begin();
  mfrc522.PCD_Init();
  mfrc522.PCD_DumpVersionToSerial();
}

void leerRFID() {
  // Revisamos si hay nuevas tarjetas
  if ( ! mfrc522.PICC_IsNewCardPresent())
  {
    return;
  }
  Serial.println("Tarjeta detectada");

  // Leer tarjeta unica
  if ( ! mfrc522.PICC_ReadCardSerial())
  {
    return;
  }
  Serial.println("Tarjeta unica puesta");

  //Evitamos lecturas no deseadas
  if (lectura) {
    return;
  }

  String tag = "";

  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    tag.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
    tag.concat(String(mfrc522.uid.uidByte[i], HEX));
  }

  tag.toUpperCase();

  if (tag != "") {
    lectura = true;
    String tagC = "";

    for(int i = 0; i < tag.length(); i++){
      if(tag[i] != ' '){
        tagC += tag[i];
      }
    }
    
    informarLectura(tagC);
  }
}

//Informamos al servidor que se realizó una lectura del RFID
void informarLectura(String tag) {
  Serial.print("Tarjeta Detectada:");
  Serial.println(tag);
  lcdArriba("TarjetaDetectada", 0);
  lcdAbajo(tag, 4);

  //Creamos el Host
  HTTPClient http;
  String host = "http://192.168.0.11/2101/";
  host.concat(tag);

  Serial.print("Solicitando: ");
  Serial.println(host);

  //Realizamos la Solicitud
  http.begin(host);

  //Capturamos el codigo de la respuesta HTTP
  int statusCode = http.GET();
  Serial.print("Status: ");
  Serial.println(statusCode);

  //Obtenemos la respuesta
  String res = http.getString();

  Serial.print("Respuesta: ");
  Serial.println(res);

  //Enviamos la información de la respuesta

  //Colocamos los valores de inicio
  http.end();

  if (statusCode == 200) {
    mostrarRespuesta(res);
  }else{
    lcdArriba("INTENTE DE NUEVO" , 0);
    lcdAbajo("" , 0);
  }

  espera = true;
  lectura = false;
}

void mostrarRespuesta(String res) {
  String nombre = "";
  String estado = "";
  boolean switcher = true;

  for (int i = 0; i < res.length(); i++) {
    if (res[i] == '-') {
      switcher = false;
      i++;
    }

    if (switcher) {
      nombre += res[i];
    } else {
      estado += res[i];
    }
  }

  lcdArriba(nombre, 0);
  lcdAbajo(estado , 0);
  delay(3000);
}

void lcdArriba(String msj, int p) {
  lcd.setCursor(0, 0);
  lcd.print("                ");
  lcd.setCursor(p, 0);
  lcd.print(msj);
}

void lcdAbajo(String msj, int p) {
  lcd.setCursor(0, 1);
  lcd.print("                ");
  lcd.setCursor(p, 1);
  lcd.print(msj);
  delay(1000);
}

void loop() {
  if (espera) {
    Serial.println("En espera");
    lcdArriba("COLOQUE SU", 3);
    lcdAbajo("CARNET", 5);
    espera = false;
  }

  leerRFID();
}
