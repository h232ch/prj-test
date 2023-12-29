import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject, Subscription, throwError} from "rxjs";
import {Board, BoardPagination} from "./board.model";
import {DataStorageService} from "../shared/data-storage.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {catchError} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class BoardService extends DataStorageService<Board> {

  boardsChanged: Subject<Board[] | BoardPagination['results'][]> = new Subject<Board[] | BoardPagination['results'][]>();
  boardChanged: Subject<Board> = new Subject<Board>();
  boardPagination: Subject<BoardPagination> = new Subject<BoardPagination>();

  currentPage: Subject<number> = new Subject<number>();
  startPage: Subject<number> = new Subject<number>();
  pageSize: Subject<number> = new Subject<number>();

  private boards: Board[] | BoardPagination['results'][] | any;
  private board: Board;


  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) {
    super(httpClient, 'http://localhost:8000/api/boards');
  }

  getAll(): Observable<Board[]> {
    return this.httpClient.get<Board[]>(this.apiUrl);
  }

  getPaginationPage(id: number): Observable<BoardPagination> {
    return this.httpClient.get<BoardPagination>(`${this.apiUrl}?page=${id}`)
  }

  getById(id: number): Observable<Board> {
    return this.httpClient.get<Board>(`${this.apiUrl}/${id}`);
  }

  create(board: Board): Observable<Board> {
    return this.httpClient.post<Board>(`${this.apiUrl}/`, board);
  }

  update(id: number, board: Board): Observable<Board> {
    return this.httpClient.put<Board>(`${this.apiUrl}/${id}/`, board);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  getBoards(): Board[] {
    this.getAll()
      .pipe((catchError(this.errorHandler)))
      .subscribe((res: Board[] | any) => {
          if (res['results']) {
            this.boardPagination.next(res);
            this.boards = res['results'];
          } else {
            this.boards = res;
          }
          this.boardsChanged.next(this.boards.slice());
        }, errorMessage => {
          console.log(errorMessage)
        }
      )
    return this.boards;
  }

  getBoardsPagination(id: number) {
    return this.getPaginationPage(id).subscribe(res => {
      this.boardPagination.next(res);
      this.boards = res['results'];
      this.boardsChanged.next(this.boards.slice());
    })
  }

  updateBoard(id: number, board: Board, page: number) {
    this.update(id, board).subscribe(res => {
      this.getBoards();
      this.board = res;
      this.boardChanged.next(this.board);
      this.currentPage.next(1);
      this.startPage.next(1);
      this.pageSize.next(4);
      this.router.navigate(['/boards/' + res.id]);
    })
  }

  createBoard(board: Board) {
    this.create(board).subscribe(res => {
      this.getBoards();
      this.board = res;

      this.boardChanged.next(res);
      this.currentPage.next(1);

      this.startPage.next(1);
      this.getBoards();
      this.router.navigate(['/boards/' + res.id])
    })
  }

  getBoard(id: number) {
    this.getById(id).subscribe(res => {
      this.board = res;
      this.boardChanged.next(this.board);
    })
  }

  deleteBoard(id: number) {
    this.delete(id).subscribe(res => {
      this.getBoards();

      this.startPage.next(1);
      this.router.navigate(['/boards']);
    })
  }

  errorHandler(errorRes: HttpErrorResponse) {
    let errorMessage = errorRes.error;
    if (!errorRes.error) {
      return throwError(errorMessage.error);
    }
    return throwError(errorMessage);
  }
}
