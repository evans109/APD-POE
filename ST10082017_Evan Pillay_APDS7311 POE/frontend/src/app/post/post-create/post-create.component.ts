import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostServiceService } from '../post-service.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent{

  constructor(public postservice: PostServiceService) {}

  ngOnInit(): void {

  }

  onAddPost(postform: NgForm) {
    if (postform.invalid)
    {
      alert('invalid')
      return
    }
    alert(postform.value.enteredID+':'+postform.value.enteredMessage)
    this.postservice.addPost(postform.value.enteredID,postform.value.enteredMessage)
    postform.resetForm()
  }

}
