import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { from } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  tarefas: any[]=[]; // array tarefas(nome,feito(verdadeiro/false))
  
  constructor(private alertCtrl: AlertController, private toast:ToastController, private actionSheetCtrl: ActionSheetController ) {
    let tarefasJson =  localStorage.getItem('tarefaDb');
    if(tarefasJson != null){
      this.tarefas = JSON.parse(tarefasJson);
    }
    // console.log(this.tarefas);
  }
  async addTarefa(){
    const alerta=await this.alertCtrl.create({
      header: 'O que voce precisa fazer?',
      inputs:[
        {name: 'txtnome', type:'text',placeholder:'digite aqui...'}
      ],
      buttons:[
        {text: 'Cancelar', role:'cancel', cssClass:'light',
          handler:()=>{
            console.log('Voce cancelou?!');
          }
        },
        {text:'OK',
          handler:(form)=>{
            console.log(form);
            this.add(form.txtnome);
          }
        }
      ]
    })
    alerta.present();
  }
  async add(nova:any){
    if(nova.trim().length< 1){
      const toast = await this.toast.create({
        message: 'Informe o que voce precisa fazer',
        duration:2000,
        position:'middle',
        color:'warning'
      })
      toast.present();
      }else{
        let tarefa = {nome: nova, feito: false}
        this.tarefas.push(tarefa)
        this.atualizaLocalStorage(); // armazenando no celular
        const toast = await this.toast.create({
          message:'Tarefa adiconada com sucesso',
          duration:2000,
          position:'middle',
          color:'success'
        })
      }
    }
    atualizaLocalStorage(){
      localStorage.setItem('tarefaDb', JSON.stringify(this.tarefas))
    }
    async abrirOpcoes(tarefa:any){
      const actsheet = await this.actionSheetCtrl.create({
        header:'Escolha uma ação',
        buttons:[
          {
            text:tarefa.feito?'Desmarcar':'Marcar',
            icon:tarefa.feito?'radio-button-off':'checkmark-circle',
            handler:()=>{
              tarefa.feito=!tarefa.feito;
              this.atualizaLocalStorage
            }
          }
        ]
        
    });
    actsheet.present()
    }
  }
