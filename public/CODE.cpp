#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

// ==== Wi-Fi Credentials ====
#define WIFI_SSID "Dialog 4G 964"
#define WIFI_PASSWORD "2002FeB03"

// ==== Firebase Credentials ====
#define FIREBASE_HOST "https://smart-agriculture-system-fe7c6-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "hyMt5UCtoIvuhDE1erqKi7mkpVcEVWiOiW8PYGna"

// ==== Sensor & Actuator Pins ====
#define DHTPIN 2
#define DHTTYPE DHT11
#define SOIL_PIN 34
#define RELAY_PIN 5  // Relay or pump pin

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Make sure pump is OFF

  dht.begin();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("====================================");
}

void loop() {
  delay(5000); // Delay between readings

  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  int soilValue = analogRead(SOIL_PIN);
  int soilPercent = map(soilValue, 4095, 0, 0, 100);
  soilPercent = constrain(soilPercent, 0, 100);

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  Serial.println("====================================");
  Serial.printf("Temperature: %.2f °C\n", temperature);
  Serial.printf("Humidity: %.2f %%\n", humidity);
  Serial.printf("Soil Moisture: %d %%\n", soilPercent);

  if (WiFi.status() == WL_CONNECTED) {
    int threshold = fetchMoistureThreshold();
    Serial.print("Threshold from Firebase: ");
    Serial.println(threshold);

    if (threshold > 0 && soilPercent < threshold) {
      Serial.println("Soil is dry! Starting pump...");
      digitalWrite(RELAY_PIN, HIGH);  // Turn ON pump
      delay(5000);                    // Pump for 5 seconds
      digitalWrite(RELAY_PIN, LOW);   // Turn OFF pump
      Serial.println("Pump stopped.");
    } else {
      Serial.println("Moisture is sufficient. Pump not needed.");
    }

    sendToFirebase(temperature, humidity, soilPercent);
  } else {
    Serial.println("WiFi not connected!");
  }

  Serial.println("====================================");
}

void sendToFirebase(float temp, float hum, int soil) {
  HTTPClient http;
  String url = String(FIREBASE_HOST) + "/sensors.json?auth=" + FIREBASE_AUTH;

  String jsonData = "{";
  jsonData += "\"temperature\":" + String(temp, 2) + ",";
  jsonData += "\"humidity\":" + String(hum, 2) + ",";
  jsonData += "\"moisture\":" + String(soil) + ",";
  jsonData += "\"timestamp\":" + String(millis());
  jsonData += "}";

  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.PUT(jsonData);

  if (httpResponseCode > 0) {
    Serial.print("🔥 Firebase Response: ");
    Serial.println(httpResponseCode);
    if (httpResponseCode == 200) Serial.println("Data sent successfully!");
  } else {
    Serial.print("Firebase Error: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}

int fetchMoistureThreshold() {
  HTTPClient http;
  String url = String(FIREBASE_HOST) + "/settings/moistureThreshold.json?auth=" + FIREBASE_AUTH;

  http.begin(url);
  int httpResponseCode = http.GET();
  int threshold = -1;

  if (httpResponseCode == 200) {
    String payload = http.getString();
    threshold = payload.toInt(); // Convert JSON number to int
  } else {
    Serial.print("Failed to get threshold: ");
    Serial.println(httpResponseCode);
  }

  http.end();
  return threshold;
}
