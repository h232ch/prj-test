import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Board} from "../board-models/board.model";
import {Subject, Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";
import {User} from "../../auth/user.model";
import {takeUntil} from "rxjs/operators";
import {BoardApiService} from "../board-api-service";

@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.css']
})
export class BoardDetailComponent implements OnInit, OnDestroy {
  board: Board;
  user: User;
  id: number;
  boardSub: Subscription;
  userSub: Subscription;

  // error control
  error: string;
  private destroySub = new Subject<void>();
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private boardApiService: BoardApiService,
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): void {

    this.boardApiService.error
      .pipe(takeUntil(this.destroySub))
      .subscribe(res => {
        this.error = this.boardApiService.formatError(res);
      });

    this.userSub = this.authService.user.subscribe(res => {
      this.user = res;
    })

    this.boardSub = this.boardApiService.boardChanged.subscribe(res => {
      this.board = res;
    })

    // resolver will retrieve the detail of board
  }

  onEditBoard() {
    this.router.navigate(['edit'],
      {
        relativeTo: this.route,
      });
  }

  onDeleteBoard() {
    this.id = +this.board.id;
    this.boardApiService.delete(this.id);
  }

  ngOnDestroy(): void {
    this.boardSub.unsubscribe();
    this.userSub.unsubscribe();

    this.destroySub.next();
    this.destroySub.complete();
  }

  onHandleError() {
    this.error = undefined;
    this.isLoading = false;
  }
}
