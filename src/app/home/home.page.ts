import { AfterViewInit, Component, OnInit, Inject, inject  } from '@angular/core';
import {SArduinoService} from '../services/s-arduino.service'
import { Stats } from '../interfaces/Stats';
import { AlertController } from '@ionic/angular';
import { Chart } from 'chart.js';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, collectionGroup, onSnapshot, query, QuerySnapshot } from 'firebase/firestore';
import { Queue } from '../interfaces/Queue';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZaBLHjOvgsjCPc5dm3GupmrxFsr1ssyY",
  authDomain: "ioniclot.firebaseapp.com",
  projectId: "ioniclot",
  storageBucket: "ioniclot.appspot.com",
  messagingSenderId: "319580632096",
  appId: "1:319580632096:web:3e9bb389e9d5c7dd1f7845",
  measurementId: "G-YN4SR9FDQM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const queue = new Queue<string>();

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, AfterViewInit  {
  intervalTime : number;
  intervalID: any;
  data: Stats;
  status: Stats;
  chart: any;
  firestore: Firestore = inject(Firestore);
  server:string;
  semaphore: boolean;
  toogleButton: any;
  temperaturaStart:number;
  temperaturaEnd:number;
  timeStart:string;
  timeEnd: string;
  humedadMinima:number;
  humedadMaxima:number;


  constructor(private serviceArduino: SArduinoService, private alertController : AlertController) {
    this.status = null;
    this.intervalTime= 1500;
    // onSnapshot(collectionGroup(this.firestore,'regTemperatura'),QuerySnapshot => {
    //       QuerySnapshot.forEach(element => {
    //         console.log(element.data());
    //         const dataFormated= element.data() as {value: number, timeStamp: string, dateStamp: string};
    //         if( dataFormated.timeStamp != undefined){
    //           console.log('time:',dataFormated.timeStamp.substring(0,7));
    //         }
    //       });
    // })  
  }

  getIntervalTime(queueLength) {
    if (queueLength > 10) {
      return 5000; // 5 segundos
    } else if (queueLength > 5) {
      return 3000; // 3 segundos
    } else {
      return 1500; // 1.5 segundos
    }
  }

  startInterval(){
    this.intervalID= setInterval(() => {
      try {
        //Verificar si la queue tiene items
        console.log('sizeQueue',queue.size());
        this.intervalTime= this.getIntervalTime(queue.size());
        if(queue.isEmpty()){
          this.requestData('0');
          this.semaphore=false;
        }else{
          //Extraer item
          let action=queue.dequeue();
          //Ejecutar action
          this.serviceArduino.getStatus(this.server,action).subscribe((data) => {
            //Bloquear actualizaciones de estado
            if(action!='0'){
            this.semaphore=true;
            //Actualizar valor
            this.status[action]=data[action];
            //Verificar valor
            if (data[action] === this.status[action]) {
              // Los objetos tienen los mismos valores
            }else{
              console.log('Error cliente desactualizado', action, 'data',data[action], 'status',this.status[action]);
            }
            }else if(queue.size()<=1 && !this.semaphore){
                if(JSON.stringify(this.status) === JSON.stringify(data)){
                  console.log('Sistema sincronizado');
                }else{
                  console.log('sincronizando sistema')
                  this.status=data;
                } 
              }

          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }, this.intervalTime);
  }

  public requestData(opt: string){
    let index=queue.indexOf('0');
      if(index!=-1){
        queue.splice(index,1)
        console.log('deleted', '0')
      }
      if(opt!= '0'){
        this.semaphore=true;
        //Añadir action to queue
      index=queue.indexOf(opt); 
      if(index!=-1){
        queue.splice(index,1)
        console.log('deleted', opt)
      }else{
        queue.enqueue(opt);
        console.log('action enqueued');
      }
      }else{
        queue.enqueue(opt);
      }   
  }

  stopInterval(){
    clearInterval(this.intervalID);
  }

  createChart(){
  
      this.chart = new Chart("MyChart", {
        type: 'line', //this denotes tha type of chart
  
        data: {// values on X-Axis
          labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
                   '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
           datasets: [
            {
              label: "Sales",
              data: ['467','576', '572', '79', '92',
                   '574', '573', '576'],
              backgroundColor: 'blue'
            },
            {
              label: "Profit",
              data: ['542', '542', '536', '327', '17',
                     '0.00', '538', '541'],
              backgroundColor: 'limegreen'
            }  
          ]
        },
        options: {
          aspectRatio:2.5
        }
        
      });
    }
  ngOnInit(): void {
    this.presentAlert();
    this.timeStart='';
    this.timeEnd='';
    this.temperaturaStart=0;
    this.temperaturaEnd=0;
    this.createChart();

  } 

  ngAfterViewInit(){
    this.toogleButton= document.getElementById("tooglePump");
    console.log(this.toogleButton);

  }




  



  
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Configuración del Servidor',
      buttons: [ {text:'Cancel'},{text: 'OK',   handler: data  => {
        if(data[0]!=''){
          this.server= data[0]; 
          this.startInterval();
        }
          
      }}],
      inputs: [
        {
          placeholder: this.server
        }
      ]
    });
  await alert.present();
  // await addDoc(collection(this.firestore, 'granjas/granja1/sensores/temperatura/regTemperatura'),{value: 100, timeStamp: new Date().toTimeString(), dateStamp: new Date().toDateString()});
  }



  async presentAlertTemperature() {
    const alert = await this.alertController.create({
      header: 'Seleccione Temperatura Limite',
      buttons: [{
        text: 'OK',
        handler: (data) => {
          console.log("Temperatura:" ,data[0], data[1]);
          if(data[0] !='' && data[1]!=''){
            this.temperaturaStart= Number(data[0]);
            this.temperaturaEnd= Number(data[1]);
          }
        },
      },],
      inputs: [
        {
          placeholder: 'Minima',
          type: 'number',
        },
        {placeholder: 'Máxima',
          type: 'number',
        },
      ],
    });
    await alert.present();
  }


 async presentAlertHumidity(){
  const alert = await this.alertController.create({
    header: 'Humedad minima y máxima',
    buttons: [
      {
        text: 'OK',
        handler: (data) => {
        this.humedadMinima= data[0];
        this.humedadMaxima= data[1];
        console.log("Humedad Min/Max:", this.humedadMinima, this.humedadMaxima);
        },
      },
    ],
    inputs: [
      {
        placeholder: 'Minima',
        type: 'number',
      },
      {placeholder: 'Máxima',
        type: 'number',
      },
    ],
  });

  await alert.present();

  }

  async presentAlertTime() {
    const alert = await this.alertController.create({
      header: 'Please enter your info',
      buttons: [
        {
          text: 'OK',
          handler: (data) => {
            this.timeStart= String(data[0]);
            this.timeEnd= String(data[1]);
          },
        },
      ],
      inputs: [
        {
          type: 'time',
        },
        {
          type: 'time',
        },
      ],
    });

    await alert.present();
  }
}
