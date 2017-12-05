import { Component, OnInit } from '@angular/core';
import { BarService } from '../../services/bar.service';
import { OpenSourceCode, Sentence,Azure,Watson,Google,ResponseTime, CorrectiveNess,Value } from '../../../models/sentiment';

@Component({
  selector: 'simple-bar-chart',
  templateUrl: './simple-bar-chart.component.html',
  styleUrls: ['./simple-bar-chart.component.scss'],
  providers: [BarService]
})
export class SimpleBarChartComponent implements OnInit {
  responseTime: ResponseTime;
  data:any;
  openSourceScore: OpenSourceCode;
  humanPositiveScore: number = 0;
  humanNegativeScore: number = 0;
  azureData:Azure;
  azurePositiveScore=0;
  azureNegativeScore = 0;
  watsonData:Watson;
  watsonPositiveScore=0;
  watsonNegativeScore=0;
  watsonNeutralScore = 0;
  googleData:Google;
  googlePositiveScore:number = 0;
  googleNegativeScore:number = 0;
  googleNeutralScore:number = 0;
  toggleResponseTimeChart = false;
  googleCorrectiveData:CorrectiveNess;
  azureCorrectiveData:CorrectiveNess;
  watsonCorrectiveData:CorrectiveNess;
  constructor(private barService: BarService) { }

  ngOnInit() {
    this.callServices();
    this.correctiveMethod();
  }


  callServices() {
    this.barService.getRandomSentence().subscribe((res: any) => {
      //console.log(res);
      if (res.score == 0) {
        this.humanNegativeScore = 1;
      }
      else {
        this.humanPositiveScore = 1;
      }
      this.data = res;
      let sentence: Sentence = new Sentence();
      sentence.sentence = this.data.sentence;
      //NLTK response
      this.barService.getNLTKScore(sentence).subscribe((res: OpenSourceCode) => {
        //console.log("native" + res.responseTime);
        this.openSourceScore = res;
        //azure request
        this.barService.getAzureScore(sentence).subscribe((res: Azure) => {
          //console.log("azure"+res.responseTime);
          this.azureData = res;
          if(this.azureData.data.documents[0].score <0.5){
            this.azureNegativeScore = 1;
          }
          else{
            this.azurePositiveScore = 1
          }
          //watson
          this.barService.getWatsonScore(sentence).subscribe((res:Watson)=> {
            //console.log("watson" + res.responseTime);
            this.watsonData = res;
            //console.log(this.watsonData);
            if(this.watsonData.data.sentiment.document.label == "positive"){
             // this.watsonPositiveScore = this.watsonData.data.sentiment.document.score;
              this.watsonPositiveScore = 1;
            }
            else if(this.watsonData.data.sentiment.document.label == "neutral"){
              //this.watsonNeutralScore = this.watsonData.data.sentiment.document.score;
              this.watsonNeutralScore = 1;
            }
            else if(this.watsonData.data.sentiment.document.label == "negative"){
              //this.watsonNegativeScore = this.watsonData.data.sentiment.document.score;
              this.watsonNegativeScore = 1;
            }

            //google
            this.barService.getGoogleScore(sentence).subscribe((res:Google)=>{
              this.googleData = res;
              //console.log("Google"+res.responseTime);
              if(this.googleData.data.entities[0].sentiment.score < -0.25){
                this.googleNegativeScore = 1;
              }
              else  if(this.googleData.data.entities[0].sentiment.score > 0.25){
                this.googlePositiveScore = 1;
              }
              else {
                this.googleNeutralScore = 1;
              }

              //show bar graph
              this.showBarGraph();


            });
            //end of google  

          });
          // end of watson

        });
        //end of Azure response
      });
      // end of NLTK response
      
    });
  }


  showBarGraph(){
    this.responseTime = new ResponseTime();
    this.responseTime.Azure = this.azureData.responseTime;
    this.responseTime.Google = this.googleData.responseTime;
    this.responseTime.Watson = this.watsonData.responseTime;
    this.responseTime.NLTK = this.openSourceScore.responseTime;
    this.toggleResponseTimeChart = true;
    //console.log(this.responseTime);
  }


  correctiveMethod(){
    //google
    this.googleCorrectiveData = new CorrectiveNess();
    this.googleCorrectiveData.data = new Array<Value>();
    let value1 = new Value();
    value1.name = "Correct";
    value1.value = 50;
    let value2 = new Value();
    value2.name = "Wrong";
    value2.value = 19;
    this.googleCorrectiveData.data.push(value1);
    this.googleCorrectiveData.data.push(value2);


    //azure
    this.azureCorrectiveData = new CorrectiveNess();
    this.azureCorrectiveData.data = new Array<Value>();
    let value3 = new Value();
    value3.name = "Correct";
    value3.value = 57;
    let value4 = new Value();
    value4.name = "Wrong";
    value4.value = 12;
    this.azureCorrectiveData.data.push(value3);
    this.azureCorrectiveData.data.push(value4);

    //watson
    this.watsonCorrectiveData = new CorrectiveNess();
    this.watsonCorrectiveData.data = new Array<Value>();
    let value5 = new Value();
    value5.name = "Correct";
    value5.value = 55;
    let value6 = new Value();
    value6.name = "Wrong";
    value6.value = 14;
    this.watsonCorrectiveData.data.push(value5);
    this.watsonCorrectiveData.data.push(value6);
  }

}
