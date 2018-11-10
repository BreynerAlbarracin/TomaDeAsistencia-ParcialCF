

void setup() {
  Serial.begin(115200);
  delay(10);

  //UltraSonido
  pinMode(trig, OUTPUT);
  pinMode(echo, INPUT);
}

void loop() {
  //Calcular Valores
  dist = calcularDistancia();

  //Limitamos la actualizacion a 0.2s
  if (millis() - timer > 500) {
    Serial.print("connecting to ");
    Serial.println(host);

    //Creamos el cliente y conectamos
    WiFiClient client;
    if (!client.connect(host, httpPort)) {
      Serial.println("connection failed");
      return;
    }

    //Le damos valores por paametros
    String url = "/d";
    url += dist;
    url += "t";
    url += hot;

    Serial.print("Requesting URL: ");
    Serial.println(url);

    //creamos la solicitud
    client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                 "Host: " + host + "\r\n" +
                 "Connection: close\r\n\r\n");

    Serial.println();
    Serial.println("closing connection");
    timer = millis();
  }
  Serial.println(dist);
}

long calcularDistancia() {
  long duration, distanceCm;
  
  digitalWrite(trig, LOW);
  delayMicroseconds(4);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  duration = pulseIn(echo, HIGH);

  return duration * 10 / 292 / 2;
}
