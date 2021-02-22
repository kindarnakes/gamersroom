import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { publication } from '../model/publication';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  private endpoint = environment.endpoint + "/publication";

  constructor(private http: HTTP) { }

  public getByUserId(iduser:number, idprofile:number, page:number, nperpage:number){
    return this.http.get( this.endpoint+"/"+iduser+"/user/"+idprofile+'/'+page+'/'+nperpage, {}, this.header);
  }

  public getAllByUserId(idprofile:number, page:number, nperpage:number){
    return this.http.get( this.endpoint+"/user/"+idprofile+'/'+page+'/'+nperpage, {}, this.header);
  }

  public savePublication(publication:publication){
    this.http.setDataSerializer('json');
    return this.http.post(this.endpoint, {...publication}, this.header);
  }

  updatePublication(publication:publication) {
    this.http.setDataSerializer('json');
    return this.http.put(this.endpoint + "/" + publication.id, { ...publication}, this.header);
  }

  deletePublication(id:number){
    return this.http.delete(this.endpoint+'/' + id, {}, this.header);
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
