import { Component } from '@angular/core';
import{Title,Meta}from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Aman Baid';

  
  constructor(private titleService:Title, private meta:Meta){
    titleService.setTitle('Aman Baid')
    
    meta.updateTag({name:'viewport',content:'width=device-width, initial-scale=1, shrink-to-fit=no'});
    meta.addTag({name:'description',content:'This is My Personal Blog'},true);
    
    meta.addTag({name:'author',content:'Aman Baid'},true);
}
}
