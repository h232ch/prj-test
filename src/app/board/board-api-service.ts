import {Injectable} from "@angular/core";
import {ApiClientService} from "../shared/api-client-service";
import {Board, BoardPagination} from "./board-models/board.model";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {BoardSearch} from "./board-models/board-search.model";


@Injectable()
export class BoardApiService extends ApiClientService<Board> {

    // Board variables
    boardsChanged: Subject<Board[]> = new Subject<Board[]>();
    boardChanged: Subject<Board> = new Subject<Board>();
    boardPagination: Subject<BoardPagination> = new Subject<BoardPagination>();

    private boards: Board[];
    private board: Board;

    // Error variable
    error = new Subject<[]>();

    // Pagination variables
    currentPage: Subject<number> = new Subject<number>();
    startPage: Subject<number> = new Subject<number>();
    pageSize: Subject<number> = new Subject<number>();
    isLoading: Subject<boolean> = new Subject<boolean>();

    searchData: FormData;

    constructor(
        private httpClient: HttpClient,
        private router: Router,
    ) {
        super(httpClient, 'http://54.180.86.155:8000/api/boards/');
        // super(httpClient, 'http://localhost:8000/api/boards/');
    }

    getAll(id?: number) {
        this.isLoading.next(true);
        let targetUrl = this.apiUrl;
        if (id) {
            targetUrl = this.apiUrl + '?page=' + id;
        } else {
            targetUrl = this.apiUrl;
        }
        this.httpClient.get<BoardPagination>(`${targetUrl}`).subscribe(res => {
            this.boardPagination.next(res);
            this.boards = res.results as unknown as Board[];
            this.boardsChanged.next(this.boards);
            this.isLoading.next(false);
        }, errorMessage => {
            this.isLoading.next(false);
            this.error.next(errorMessage.error);
        });
    }


    create(item: FormData) {
        this.httpClient.post<Board>(`${this.apiUrl}`, item).subscribe(res => {
            this.onSearchData()
            this.boardChanged.next(res);
            this.currentPage.next(1);
            this.startPage.next(1);
            this.router.navigate(['/boards/' + res.id])
        }, errorMessage => {
            this.isLoading.next(false);
            this.error.next(errorMessage.error);
        })
    }

    update(id: number, item: FormData, currentPage: number): void {
        this.httpClient.put<Board>(`${this.apiUrl}${id}/`, item).subscribe(res => {
            this.onSearchData()
            this.board = res;
            this.boardChanged.next(this.board);
            this.initPagination();
            this.router.navigate(['/boards/' + res.id]);
        }, errorMessage => {
            this.isLoading.next(false);
            this.error.next(errorMessage.error);
        })
    }

    delete(id: number, imageId?: number) {
        let targetUrl = this.apiUrl;
        if (imageId) {
            targetUrl = 'http://54.180.86.155:8000/api/images/';
            // targetUrl = 'http://localhost:8000/api/images/';
            this.httpClient.delete<void>(`${targetUrl}${imageId}`).subscribe(res => {
                this.getById(id);
            }, errorMessage => {
                this.isLoading.next(false);
                this.error.next(errorMessage.error);
            });
        } else {
            this.httpClient.delete<void>(`${targetUrl}${id}`).subscribe(res => {
                // for deleting search data
                this.onSearchData();
                this.initPagination();
                this.router.navigate(['/boards']);
            }, errorMessage => {
                this.isLoading.next(false);
                this.error.next(errorMessage.error);
            });
        }
    }

    getById(id: number) {
        this.isLoading.next(true);
        this.httpClient.get<Board>(`${this.apiUrl}${id}`).subscribe(res => {
            this.boardChanged.next(res);
            this.isLoading.next(false);
            window.scrollTo(0, 0);
        }, errorMessage => {
            this.isLoading.next(false);
            this.error.next(errorMessage.error);
        })
    }

    // search(searchData: BoardSearch) {
    search(searchData: FormData) {
        // for deleting search data
        this.searchData = searchData;

        this.isLoading.next(true);
        let targetUrl: string;
        const id = searchData.get('id');

        if (id) {
            targetUrl = this.apiUrl + 'search_data/?page=' + id;
        } else {
            targetUrl = this.apiUrl + 'search_data/';
        }

        this.httpClient.post<BoardPagination>(`${targetUrl}`, searchData)
            .subscribe(res => {
                this.boardPagination.next(res);
                this.boards = res.results as unknown as Board[];
                this.boardsChanged.next(this.boards.slice());

            }, errorMessage => {
                this.isLoading.next(false);
                this.error.next(errorMessage.error);
            });
    }

    onSearchData() {
        if (this.searchData) {
            this.search(this.searchData);
        } else {
            // normal deletion case;
            this.getAll();
        }
    }

    initPagination() {
        this.currentPage.next(1);
        this.startPage.next(1);
        this.pageSize.next(4);
    }

    formatError(error: []): string {
        if (!error) return null;
        return Object.values(error).join(' & ');
    }


}
