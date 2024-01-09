import {ApiClientService} from "../../shared/api-client-service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {Comment} from "../board-models/board.model";
import {Subject} from "rxjs";
import {BoardApiService} from "../board-api-service";


@Injectable()
export class CommentApiService extends ApiClientService<Comment> {
  // Error variable
  comment: Subject<Comment> = new Subject<Comment>();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private boardApiService: BoardApiService,
  ) {
    super(httpClient, 'http://54.180.86.155:8000/api/comments/');
    // super(httpClient, 'http://localhost:8000/api/comments/');
  }

  create(item: FormData, id?: number, childCommentOption?: boolean, parentId?: number): void {
    let targetUrl = this.apiUrl;
    if (childCommentOption) {
      targetUrl = 'http://54.180.86.155:8000/api/child_comments/'
      // targetUrl = 'http://localhost:8000/api/child_comments/'
    }
    this.httpClient.post<Comment>(`${targetUrl}`, item).subscribe(res => {
      this.boardApiService.getById(id);
    }, errorMessage => {
      this.boardApiService.error.next(errorMessage.error);
    })
  }

  delete(id: number, boardId?: number, childCommentOption?: boolean): void {
    let targetUrl = this.apiUrl;
    if (childCommentOption) {
      targetUrl = 'http://54.180.86.155:8000/api/child_comments/'
      // targetUrl = 'http://localhost:8000/api/child_comments/'
    }
    this.httpClient.delete(`${targetUrl}${id}`).subscribe(res => {
      this.boardApiService.getById(boardId);
    }, errorMessage => {
      this.boardApiService.error.next(errorMessage.error);
    })
  }

  deleteImage(imageId: number, boardId: number,) {
    let targetUrl = 'http://54.180.86.155:8000/api/comment_images/'
    // let targetUrl = 'http://localhost:8000/api/comment_images/'
    this.httpClient.delete(`${targetUrl}${imageId}`).subscribe(res => {
      this.boardApiService.getById(boardId);
    }, errorMessage => {
      this.boardApiService.error.next(errorMessage.error);
    });
  }

  getAll(): void {
  }

  getById(id: number, childCommentOption?: boolean): void {
    let targetUrl = this.apiUrl;
    if (childCommentOption) {
      targetUrl = 'http://54.180.86.155:8000/api/child_comments/'
      // targetUrl = 'http://localhost:8000/api/child_comments/'
    }
    this.httpClient.get<Comment>(`${targetUrl}${id}`).subscribe(res => {
      this.comment.next(res);
    }, errorMessage => {
      this.boardApiService.error.next(errorMessage.error);
    });
  }

  update(id: number, item: FormData, boardId: number, childCommentOption?: boolean): void {
    let targetUrl = this.apiUrl;
    if (childCommentOption) {
      targetUrl = 'http://54.180.86.155:8000/api/child_comments/'
      // targetUrl = 'http://localhost:8000/api/child_comments/'
    }
    this.httpClient.put<Comment>(`${targetUrl}${id}/`, item).subscribe(res => {
      this.boardApiService.getById(boardId);
    }, errorMessage => {
      this.boardApiService.error.next(errorMessage.error);
    })
  }

}
