#include "caudal.hpp"
#include "humedad.hpp"
#include "temperatura.hpp"
#include <DHT.h>
// Inicializamos el sensor DHT11

void setup() 
{ 
  Serial.begin(1200); 
  pinMode(PinSensor, INPUT); 
  attachInterrupt(0,ContarPulsos,RISING);//(Interrupción 0(Pin2),función,Flanco de subida)
  Serial.println ("Envie 'r' para restablecer el volumen a 0 Litros"); 
  t0=millis();

  //Temperature
  sensorDS18B20.begin();
  // findSensorTemperature();
  // Comenzamos el sensor DHT
  dht.begin();
} 

void loop ()    
{
  // updateCaudalVolumen();
  // updateHumedad();
  // updateTemperature();

}


