import {Component, OnDestroy, OnInit} from '@angular/core';
import {Board} from "../board-models/board.model";
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {BoardSearch} from "../board-models/board-search.model";
import {takeUntil} from "rxjs/operators";
import {BoardApiService} from "../board-api-service";

@Component({
    selector: 'app-board-list',
    templateUrl: './board-list.component.html',
    styleUrls: ['./board-list.component.css']
})
export class BoardListComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    boards: Board[];
    searchString: string;
    searchSw = false;

    // Pagination
    currentPage: number = 1;
    itemsPerPage: number = 7;
    totalItems: number;
    startPage: number = 1;
    pageSize: number = 4;
    boardsLength: number;
    isLoading: boolean = false;

    // FormData
    formData = new FormData();

    constructor(
        private boardApiService: BoardApiService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.boardApiService.searchData = undefined;
        this.boardApiService.isLoading
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => {
                this.isLoading = res;
            })

        this.boardApiService.boardsChanged
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (boards: Board[]) => {
                    this.boards = boards;
                    if (this.boards.length == 0) {
                        this.boardsLength = 0;
                    } else {
                        this.boardsLength = this.boards.length;
                    }
                    this.isLoading = false;
                }
            );
        // for search data
        this.boardApiService.boardPagination
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(res => {
                this.totalItems = res.count;
            })
    }

    onNewBoard() {
        this.router.navigate(['new'], {relativeTo: this.route});
    }

    fetchData(): void {
        if (this.searchSw) {
            this.formData.delete('id');
            this.formData.append('id', this.currentPage.toString());
            this.boardApiService.search(this.formData);
        } else {
            this.boardApiService.getAll(this.currentPage)
        }
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.fetchData();
    }

    onSearch(searchData: BoardSearch) {
        // ToDo: Change to init this formData
        this.formData = new FormData();

        Object.keys(searchData).forEach(key => {
            this.formData.append(key, searchData[key]);
        })

        this.boardApiService.search(this.formData);

        this.boardApiService.initPagination();
        this.searchSw = true;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onInitSearch() {
        this.searchSw = false;
        this.searchString = '';
        this.boardApiService.searchData = undefined;

        // ToDo: Change to init this formData
        this.formData = new FormData();

        this.boardApiService.initPagination();
        this.currentPage = 1;
        this.fetchData();
    }
}
