import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Board} from "../board/board-models/board.model";

@Injectable({
  providedIn: 'root',
})
export abstract class ApiClientService<T> {
  protected constructor(
    httpClient: HttpClient,
    protected apiUrl: string) {}

  abstract getAll(): void;
  abstract getById(id: number): void;
  abstract create(item: FormData): void;
  abstract update(id: number, item: FormData, currentPage: number): void;
  abstract delete(id: number): void;
}
