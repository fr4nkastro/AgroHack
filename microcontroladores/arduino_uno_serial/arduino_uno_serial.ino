#include "caudal.hpp"
#include "humedad.hpp"
#include "temperatura.hpp"
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
} 

void loop ()    
{
  // updateCaudalVolumen();
  // updateHumedad();
  // updateTemperature();
  Serial.println("C:1");
  Serial.println("V:1");
  Serial.println("h:45");
  Serial.println("H:55");
  Serial.println("T:26");
}
