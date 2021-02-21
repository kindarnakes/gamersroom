import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  
  private endpoint = "/comment";
  constructor(private http: HTTP) { }

  public createComment(comment){
    return this.http.post(this.endpoint, comment, this.header)
  }

  private get header(): any {
    return {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': '*'
    };
  }
}
