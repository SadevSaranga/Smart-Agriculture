#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

// ==== Wi-Fi Credentials ====
#define WIFI_SSID "Dialog 4G 964"
#define WIFI_PASSWORD "892DA6c5"

// ==== Firebase Credentials ====
#define FIREBASE_HOST "https://smart-agriculture-system-fe7c6-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "hyMt5UCtoIvuhDE1erqKi7mkpVcEVWiOiW8PYGna"

// ==== Sensor Pins ====
#define DHTPIN 2
#define DHTTYPE DHT11
#define SOIL_PIN 34

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  Serial.println("🚀 Starting Smart Agriculture System...");
  
  // Initialize DHT sensor
  dht.begin();
  
  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("✅ WiFi Connected!");
  Serial.print("📶 IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("====================================");
}

void loop() {
  delay(2000); // 5 second delay
  
  // Read DHT sensor
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  // Check if DHT readings are valid
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("❌ Failed to read from DHT sensor!");
    return;
  }
  
  // Read soil moisture
  int soilValue = analogRead(SOIL_PIN);
  int soilPercent = map(soilValue, 4095, 0, 0, 100);
  soilPercent = constrain(soilPercent, 0, 100);
  
  // Print to Serial Monitor
  Serial.println("====================================");
  Serial.print("🌡️ Temperature: "); 
  Serial.print(temperature); 
  Serial.println(" °C");
  
  Serial.print("💧 Humidity: "); 
  Serial.print(humidity); 
  Serial.println(" %");
  
  Serial.print("🌾 Soil Moisture: "); 
  Serial.print(soilPercent); 
  Serial.println(" %");
  
  // Send to Firebase using HTTP
  if (WiFi.status() == WL_CONNECTED) {
    sendToFirebase(temperature, humidity, soilPercent);
  } else {
    Serial.println("📶 WiFi not connected!");
  }
  
  Serial.println("====================================");
}

void sendToFirebase(float temp, float hum, int soil) {
  HTTPClient http;
  
  // Create JSON data
  String jsonData = "{";
  jsonData += "\"temperature\":" + String(temp) + ",";
  jsonData += "\"humidity\":" + String(hum) + ",";
  jsonData += "\"moisture\":" + String(soil) + ",";
  jsonData += "\"timestamp\":" + String(millis());
  jsonData += "}";
  
  // Firebase URL
  String url = String(FIREBASE_HOST) + "/sensors.json?auth=" + String(FIREBASE_AUTH);
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.PUT(jsonData);
  
  if (httpResponseCode > 0) {
    Serial.print("🔥 Firebase Response: ");
    Serial.println(httpResponseCode);
    if (httpResponseCode == 200) {
      Serial.println("✅ Data sent successfully!");
    }
  } else {
    Serial.print("❌ Firebase Error: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}