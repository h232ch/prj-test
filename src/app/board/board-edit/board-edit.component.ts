import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Board} from "../board-models/board.model";
import {Subject} from "rxjs";
import {User} from "../../auth/user.model";
import {takeUntil} from "rxjs/operators";
import {BoardApiService} from "../board-api-service";

@Component({
    selector: 'app-board-edit',
    templateUrl: './board-edit.component.html',
    styleUrls: ['./board-edit.component.css']
})
export class BoardEditComponent implements OnInit, OnDestroy {
    // uploading images variables
    selectedFiles: File[];
    board_images: File[];
    deletionImages: File[] = [];

    boardForm: FormGroup;
    boardData='boardData';

    id: number;
    board: Board;
    error: string;
    editMode = false;
    user: User;



    private currentPage: number;
    private destroySub = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private boardApiService: BoardApiService,
    ) {
    }

    ngOnInit(): void {
        this.boardApiService.error
            .pipe(takeUntil(this.destroySub))
            .subscribe(res => {
                this.error = this.boardApiService.formatError(res);
            });

        this.route.params.pipe(
            takeUntil(this.destroySub)
        ).subscribe(
            (params: Params) => {
                this.id = +params['id']; // Convert id to number
                this.editMode = params['id'] !== undefined;
                this.initForm();
            }
        );

        // to patch values when editing forms
        this.boardApiService.boardChanged.subscribe(res => {
            this.board = res;
            this.board_images = res.board_images as unknown as File[];
            this.boardForm.patchValue({
                boardData: {
                    title: this.board.title,
                    content: this.board.content,
                }
            });
        })
    }

    // to check out what key/value in there.
    displayFormData(formData: any): void {
        for (let entry of formData.entries()) {
            const key = entry[0];
            const value = entry[1];
            console.log(`${key}:`, value);
        }
    }

    // latest

    onSubmit() {
        // Image files delete on submit
        for (let deletionImage of this.deletionImages) {
            const imageId = deletionImage['id'];
            this.boardApiService.delete(this.id, imageId);
        } this.deletionImages = [];

        const boardData = this.boardForm.value.boardData;
        const formData: FormData = this.onChangeBoard(boardData);

        return this.editMode
            ? this.boardApiService.update(this.id, formData, this.currentPage)
            : this.boardApiService.create(formData);
    }


    onChangeBoard(boardData: Board): FormData {
        const formData = new FormData();

        Object.keys(boardData).forEach(key => {
            if (key !== 'images') { // If the key is not 'image', make this text field
                formData.append(key, boardData[key]);
            }
        });

        if (this.selectedFiles && this.selectedFiles.length > 0) {
            for (const file of this.selectedFiles) {
                formData.append('images', file);
            }
        }

        if (!this.editMode) {
            formData.append('published', new Date().toISOString());
        }

        return formData;
    }

    onCancel() {
        this.router.navigate(['../'],
            {relativeTo: this.route});
    }

    private initForm() {
        this.boardForm = new FormGroup({
            boardData: new FormGroup({
                'title': new FormControl<string>('',
                    [Validators.required]),
                'content': new FormControl<string>('',
                    [Validators.required]),
                'images': new FormControl<File>(null)
            }),
        });

        if (this.editMode) {
            this.boardApiService.getById(this.id);
        }
    }

    ngOnDestroy(): void {
        this.destroySub.next();
        this.destroySub.complete();
    }

    onHandleError() {
        this.error = null;
    }

    onDeleteImage(deletionImages: File[]) {
        this.deletionImages = deletionImages;
    }

    onSelectedFiles(selectedFiles: File[]) {
        this.selectedFiles = selectedFiles;
    }
}
