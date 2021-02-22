import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { publication } from 'src/app/model/publication';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {

  @Input('publication') publication:publication;
  public p;
  public comment:FormGroup;
  constructor(public auth: AuthService, public FormBuilder: FormBuilder, private utils:UtilsService, private commentService:CommentService,
    private modalController: ModalController) {
    this.comment = this.FormBuilder.group({
      text: ['', Validators.required]})
   }

  ngOnInit() {
    this.p = this.publication;
    
  }

  async sendForm(){

    await this.utils.presentLoading();
    let text = this.comment.get('text').value;
    let comment = {
      text: text,
      user:{
        id: this.auth.user.id
      },
      publication:{
        id: this.publication.id
      }
    }

    this.commentService.createComment(comment).then(async r =>{
      if(r.data){
        let comment = await JSON.parse(r.data);
        this.p.comments.push(comment)
        this.comment.get('text').setValue('');
      }
      this.utils.stopLoading();
    }).catch(err =>{
      this.utils.stopLoading();
    })



  }

  back(){
    this.modalController.dismiss();
  }



}
