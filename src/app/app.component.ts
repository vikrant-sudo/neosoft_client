import { Component, ViewChild } from '@angular/core';
 import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from './services/fetch-data.service';

interface apiResult {
  "userId": number,
  "id": number,
  "title": string,
  "body": string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  apiResponse: apiResult[] = []
  pagination: number = 10
  totalPage: number = 0
  pageCount: number = 1
  searchInput: string = ''
  onSinglePageRecord: apiResult[] = []
  form: FormGroup =this.fb.group({
    searchInput : ['']
  })
  constructor(private fetchDataService: FetchDataService, private fb: FormBuilder){
    this.fetchDataService.getData().subscribe((res: any)=>{
      this.apiResponse = res.sort((a: apiResult, b: apiResult)=>{
        return a.id-b.id
      })
      this.totalPage= Math.ceil(this.apiResponse.length/this.pagination)
      this.onSinglePageRecord = this.apiResponse.slice(((this.pageCount-1)*this.pagination),(this.pageCount*this.pagination))
    })
  }
  ngOnInit(){
    let searchControl = this.form.controls['searchInput']
    if(searchControl){
      searchControl.valueChanges.subscribe(value => {
        this.updateSearchFilter()
      });
    }
  } 
  updateSearchFilter(){
    this.onSinglePageRecord = this.apiResponse.slice(((this.pageCount-1)*this.pagination),(this.pageCount*this.pagination)).filter((item: apiResult)=>{
      return item.title.includes(this.form.controls['searchInput'].value)
    })
  }
  previous(){
    this.form.controls['searchInput'].setValue('')
    this.pageCount=this.pageCount-1
    this.onSinglePageRecord = this.apiResponse.slice(((this.pageCount-1)*this.pagination),(this.pageCount*this.pagination))
  }
  next(){
    this.pageCount=this.pageCount+1
    this.form.controls['searchInput'].setValue('')
    this.onSinglePageRecord = this.apiResponse.slice(((this.pageCount-1)*this.pagination),(this.pageCount*this.pagination))
  
  }
}
