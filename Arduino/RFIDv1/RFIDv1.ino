
/* Typical pin layout used:
  -------------------------------------------------
              MFRC522      Arduino       Arduino
              Reader/PCD   Uno/101       Mega
  Signal      Pin          Pin           Pin
  -------------------------------------------------
  RST/Reset   RST          9             5
  SPI SS      SDA(SS)      10            53
  SPI MOSI    MOSI         11 / ICSP-4   51
  SPI MISO    MISO         12 / ICSP-1   50
  SPI SCK     SCK          13 / ICSP-3   52
*/

#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN         5          // Configurable, segun el arduino
#define SS_PIN          53         // Configurable, segun el arduino

#define ledPinVerde     8          // Led Verde - Llego a tiempo
#define ledPinAzul      9          // Led Azul - Llego tarde
#define ledPinRojo      10         // Led rojo - Clase equivocada

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Crea objeto MFRC522

int numero_serie[5]; // Número de serie de la tarjeta que nuestro sensor RFID detectará

#define AUTHORIZED_COUNT 2 //Para autoriazar más tarjetas ponemos el número aqui y la añadimos abajo
byte Authorized[AUTHORIZED_COUNT][6] = {

  {0x13, 0x2C, 0xF9, 0x95}, {0x66, 0x31, 0xF6, 0x1F,}
  //,{0x10, 0x14, 0x39, 0x2E, 0xFF, 0xFF, } ejemplo de como autorizar más tarjetas  0x83,.....

};

int i;
boolean valido = false;

void setup() {
  Serial.begin(9600);   // Initialize serial communications with the PC
  
  pinMode(ledPinVerde  , OUTPUT);
  pinMode(ledPinAzul, OUTPUT);
  pinMode(ledPinRojo , OUTPUT);

  while (!Serial);      // No hacer nada si no se abre un puerto serie (agregado para Arduinos basado en ATMEGA32U4)
  SPI.begin();          // I// Comienzo de la comunicación SPI
  mfrc522.PCD_Init();   // Activación del lector RFID MFRC522
  mfrc522.PCD_DumpVersionToSerial();  // Muestra detalles de  PCD - MFRC522 Card Reader details
  //Serial.println(F("Scan PICC to see UID, SAK, type, and data blocks..."));
  Serial.println(F("Pase la tarjeta por el sensor..."));
}



boolean isAuthorized(byte * serial);

void loop() {
  // Look for new cards
  //si no reconoce la conexion
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    digitalWrite(ledPinAzul, HIGH);
    return;
  }

  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    digitalWrite(ledPinRojo, HIGH);
    Serial.print("Codigo: ")
    // Muestra número de serie leído

    //  Seguir pobando codigo de
    //https://miarduinounotieneunblog.blogspot.com/2016/02/control-de-acceso-con-el-modulo-rfid.html
    /*
    for(int i=0; i<=4 ; i++)
        {
          numero_serie[i] = mfrc522.uid.uidByte[i];
          Serial.print(numero_serie[i]);
          if(i<=3)
          {
            Serial.print("/");
          }        
        }            
        Serial.print(" --> ");
        delay(500);*/
    return;
  }
}




